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
 # Validate parsed shell command boundaries, not merely strings in YAML.
 # A folded YAML scalar can silently turn the next `node` invocation into
 # arguments to `node` or output filenames for `tee`.
 preflight_lines=[line.strip() for step in jobs['preflight']['steps'] for line in step.get('run','').splitlines()]
 for command in ['node complexes-regression-adapter014.js --static-test','node complexes-regression-adapter014.test.js','node complexes-fixture014.test.js','node complexes-release-contract014.test.js','node complexes-release-contract014.test.js --native complexes-evidence/preflight/guards/fingerprint-native.json']:
  assert preflight_lines.count(command)==1,'Missing standalone source gate: '+command
 compatibility_lines=[line.strip() for step in jobs['legacy-compatibility']['steps'] for line in step.get('run','').splitlines()]
 comparison='node complexes-compatibility014.test.js museum-evidence/compatibility/guards/compatibility.json'
 assert sum(bool(re.fullmatch(re.escape(comparison)+r'(?: 2>&1 \| tee [^\s|;]+\.txt)?',line)) for line in compatibility_lines)==1,'Eight-world data comparison must execute as its own shell command'
 for key,job in jobs.items():
  for step in job['steps']:
   for line in step.get('run','').splitlines():
    for tee in re.finditer(r'(?:^|\|)\s*tee\s+([^|;\n]+)',line):
     assert not re.search(r'(?:^|\s)(?:node|python3)(?:\s|$)|\.(?:js|py|json)(?:\s|$)',tee.group(1)),'tee must not receive a following command or overwrite source/data: '+key
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
def alter_run(data,job,old,new):
 changed=0
 for step in data['jobs'][job]['steps']:
  if old in step.get('run',''):
   assert step['run'].count(old)==1
   step['run']=step['run'].replace(old,new);changed+=1
 assert changed==1,'Negative control must change one actual parsed command'
semantic_mutations=[
 ('missing bounded release metadata gate','preflight','node complexes-release-contract014.test.js\n','printf skipped-release-metadata\n'),
 ('missing approved native release gate','preflight','node complexes-release-contract014.test.js --native complexes-evidence/preflight/guards/fingerprint-native.json','printf skipped-approved-native-release'),
 ('folded preflight node argument','preflight','node complexes-regression-adapter014.js --static-test\nnode complexes-regression-adapter014.test.js','node complexes-regression-adapter014.js --static-test node complexes-regression-adapter014.test.js'),
 ('folded compatibility tee overwrite','legacy-compatibility','tee complexes-legacy-compatibility.txt\nnode complexes-compatibility014.test.js','tee complexes-legacy-compatibility.txt node complexes-compatibility014.test.js'),
 ('missing eight-world comparison','legacy-compatibility','node complexes-compatibility014.test.js museum-evidence/compatibility/guards/compatibility.json','printf skipped-eight-world-comparison'),
 ('tee writes source file','legacy-compatibility','tee complexes-legacy-compatibility.txt','tee complexes-legacy-compatibility.txt complexes-compatibility014.test.js')
]
for name,job,old_command,new_command in semantic_mutations:
 q=copy.deepcopy(current);alter_run(q,job,old_command,new_command)
 try:verify(q)
 except (AssertionError,KeyError):negatives.append(name)
 else:raise AssertionError('Parsed command mutation accepted '+name)
# Source pins on actual cold navigation and untouched numerical performance cap.
s=(ROOT/'complexes-integration-qa014.js').read_text()
assert "iteration <= 2"in s and "day <= 3"in s and "cdp.send('Page.reload', { ignoreCache: true })"in s and "document.getElementById('bContinue')"in s
assert 'report.performance.mean<1000'in s
assert 'for(let n=1;n<=9;n++)'in s and 'if(constructionRotation!==null)await shot(n)'in s
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'historicalJobs':44,'newJobs':46,'totalJobs':90,'negativeControls':negatives},indent=2))
