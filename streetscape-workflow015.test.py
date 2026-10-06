#!/usr/bin/env python3
"""Static workflow topology/data guard; never executes Chrome or game code."""
from pathlib import Path
import copy,itertools,yaml,json
ROOT=Path(__file__).resolve().parent
old=yaml.safe_load((ROOT/'.github/workflows/complexes-integration014.yml').read_text())
new=yaml.safe_load((ROOT/'.github/workflows/streetscape-legacy015.yml').read_text())
expected=[]
for name,j in old['jobs'].items():
 matrix=j.get('strategy',{}).get('matrix',{});axes={k:v for k,v in matrix.items() if k not in ('include','exclude')}
 combinations=[dict(zip(axes,c)) for c in itertools.product(*axes.values())] if axes else [{}]
 for c in combinations:
  if name=='legacy-compatibility':continue
  if not name.startswith('legacy-'):suite='complexes';mode=c.get('mode','preflight');group=c.get('group','college')
  elif name=='legacy-preflight':suite='theatre';mode='preflight';group='none'
  elif name=='legacy-prior':suite=c['suite'];mode='gameplay';group='none'
  elif name=='legacy-cold-reload':suite='coldload';mode=c['case'];group='none'
  else:suite=name.removeprefix('legacy-');mode=c['mode'];group='none'
  expected.append({'suite':suite,'mode':mode,'group':group})
def validate(q):
 assert q['permissions']=={'contents':'read'}
 assert q['on']['push']['branches']==['gpt/british-streetscape-015']
 assert q['concurrency']['cancel-in-progress'] is False
 j=q['jobs'];assert set(j)=={'preflight','legacy','compatibility'}
 assert j['legacy']['strategy']['matrix']['include']==expected and len(expected)==89
 for name in ['legacy','compatibility']:
  assert j[name]['needs']=='preflight'
  downloads=[s for s in j[name]['steps'] if s.get('uses')=='actions/download-artifact@v4']
  assert len(downloads)==1 and downloads[0]['with']['name']=='streetscape-full-native-fingerprint-${{ github.sha }}'
  assert downloads[0]['with']['path']=='streetscape-evidence/preflight'
 for name,v in j.items():
  assert v['runs-on']=='ubuntu-latest'
  checkout=[s for s in v['steps'] if s.get('uses')=='actions/checkout@v4'];assert len(checkout)==1 and checkout[0]['with']['persist-credentials'] is False and checkout[0]['with']['fetch-depth']==0
  uploads=[s for s in v['steps'] if s.get('uses')=='actions/upload-artifact@v4' and 'part' in s['with']['name']];assert len(uploads)==8
  for n,s in enumerate(uploads):assert s['with']['path']=='.streetscape-packets/part'+str(n)+'/' and s['if'].startswith('always()') and s['with']['if-no-files-found']=='error'
  runs='\n'.join(s.get('run','') for s in v['steps']);assert 'git diff --exit-code' in runs and 'python3 streetscape-package015.py' in runs
 runs='\n'.join(s.get('run','') for s in j['compatibility']['steps'])
 for marker in ['for n in 1 2 3','node streetscape-style015.js','SC015_SUITE=complexes SC015_MODE=fingerprint','SC015_SUITE=compatibility SC015_MODE=gameplay','node streetscape-compatibility015.test.js']:assert marker in runs
 return True
validate(new);rejected=[]
for name,mutate in [('drop mode',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].pop()),('duplicate mode',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].append(expected[0])),('unreviewed branch',lambda q:q['on']['push']['branches'].append('main')),('write permission',lambda q:q['permissions'].update(contents='write')),('missing gate',lambda q:q['jobs']['legacy'].pop('needs')),('missing raw packet',lambda q:q['jobs']['legacy']['steps'].pop())]:
 q=copy.deepcopy(new);mutate(q)
 try:validate(q)
 except (AssertionError,KeyError):rejected.append(name)
 else:raise AssertionError('Workflow mutation accepted: '+name)
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'retainedModes':len(expected)+1,'additionalPreflight':1,'originalRuntimeModeSetExact':True,'rejected':rejected}))
