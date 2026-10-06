#!/usr/bin/env python3
"""Source/YAML-only workflow inventory and provenance controls. Never starts a game."""
import copy,itertools,json,pathlib,re,yaml
ROOT=pathlib.Path(__file__).resolve().parent
old=yaml.safe_load((ROOT/'.github/workflows/theatre-integration013.yml').read_text())
current=yaml.safe_load((ROOT/'.github/workflows/complexes-integration014.yml').read_text())
def count(job):
 m=job.get('strategy',{}).get('matrix',{})
 result=1
 for values in m.values():result*=len(values)
 return result
def verify(data):
 jobs=data['jobs']
 assert sum(count(v)for k,v in jobs.items()if k.startswith('legacy-'))==44
 assert sum(count(v)for k,v in jobs.items()if not k.startswith('legacy-'))==46
 for key,prior in old['jobs'].items():
  j=jobs['legacy-'+key]
  assert j.get('strategy',{}).get('matrix',{})==prior.get('strategy',{}).get('matrix',{}),'Original historical matrix changed'
  assert 'node complexes-regression-adapter014.js'in '\n'.join(s.get('run','')for s in j['steps'])
 for key,suite in [('legacy-prior','${{ matrix.suite }}'),('legacy-compatibility','compatibility')]:
  commands='\n'.join(step.get('run','') for step in jobs[key]['steps'])
  assert 'CX014_SUITE='+suite+' CX014_MODE=gameplay node complexes-regression-adapter014.js' in commands,'Historical gameplay-only suite misrouted: '+key
 for key in ['gameplay','camera','construction','weather']:
  assert jobs[key]['strategy']['matrix']['group']==['college','manor','baths','fire']
 assert jobs['camera']['strategy']['matrix']['mode']==['camera0','camera1','camera2','camera3']
 assert jobs['construction']['strategy']['matrix']['mode']==['construction0','construction1','construction2','construction3']
 assert jobs['weather']['strategy']['matrix']['mode']==['weather-wet','weather-winter']
 for key,j in jobs.items():
  assert not j.get('continue-on-error',False)
  assert j.get('strategy',{}).get('fail-fast',False)==False
  package=[s for s in j['steps']if s.get('name','').startswith('Package')]
  assert len(package)==1
  text=package[0]['run']
  for expected in ['limit=28*1024*1024',"assert head==os.environ['GITHUB_SHA']","'sha256':hashlib.sha256(data).hexdigest()","'payloadSHA256':hashlib.sha256(encoded).hexdigest()","q['packetCount']=len(packets)","q['completeFileCount']=len(files)","assert file.suffix in ('.json','.txt','.log')","'complexes-evidence','theatre-evidence'","assert size<=limit"]:assert expected in text,expected
  assert sum(s.get('uses')=='actions/upload-artifact@v4'and'.complexes-packets/'in s.get('with',{}).get('path','')for s in j['steps'])==8
  assert all(s.get('with',{}).get('persist-credentials')is False for s in j['steps']if s.get('uses')=='actions/checkout@v4')
 return True
assert verify(current)
negatives=[]
for name,mutate in [('drop historical weather',lambda q:q['jobs']['legacy-theatre']['strategy']['matrix']['mode'].remove('weather')),('drop new support group',lambda q:q['jobs']['gameplay']['strategy']['matrix']['group'].pop()),('drop camera',lambda q:q['jobs']['camera']['strategy']['matrix']['mode'].pop()),('drop construction view',lambda q:q['jobs']['construction']['strategy']['matrix']['mode'].pop()),('drop winter',lambda q:q['jobs']['weather']['strategy']['matrix']['mode'].pop()),('allow failure',lambda q:q['jobs']['gameplay'].update({'continue-on-error':True}))]:
 q=copy.deepcopy(current);mutate(q)
 try:verify(q)
 except (AssertionError,KeyError):negatives.append(name)
 else:raise AssertionError('Workflow negative accepted '+name)
for job in ['legacy-prior','legacy-compatibility']:
 q=copy.deepcopy(current)
 for step in q['jobs'][job]['steps']:
  if 'run' in step:step['run']=step['run'].replace('CX014_MODE=gameplay','CX014_MODE=preflight')
 try:verify(q)
 except (AssertionError,KeyError):negatives.append('misroute '+job)
 else:raise AssertionError('Historical mode mutation accepted '+job)
# Source pins on actual cold navigation and untouched numerical performance cap.
s=(ROOT/'complexes-integration-qa014.js').read_text()
assert "iteration <= 2"in s and "day <= 3"in s and "cdp.send('Page.reload', { ignoreCache: true })"in s and "document.getElementById('bContinue')"in s
assert 'report.performance.mean<1000'in s
assert 'for(let n=1;n<=9;n++)'in s and 'if(constructionRotation!==null)await shot(n)'in s
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'historicalJobs':44,'newJobs':46,'totalJobs':90,'negativeControls':negatives},indent=2))
