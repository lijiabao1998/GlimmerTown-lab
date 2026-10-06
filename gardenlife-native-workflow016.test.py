#!/usr/bin/env python3
"""Source/YAML data only; never runs Actions or the game."""
from pathlib import Path
import yaml,copy,json
root=Path(__file__).resolve().parent
source=yaml.safe_load((root/'.github/workflows/gardenlife-integration016.yml').read_text())
expected=['gameplay','camera0','camera1','camera2','camera3','construction0','construction1','construction2','construction3','weather','coldload','occlusion']
def validate(q):
 assert q['permissions']=={'contents':'read'} and q['on']['push']['branches']==['gpt/british-garden-life-016']
 assert q['concurrency']['cancel-in-progress'] is False
 assert set(q['jobs'])=={'preflight','native'}
 assert q['jobs']['native']['needs']=='preflight' and q['jobs']['native']['strategy']['matrix']['mode']==expected
 for name,j in q['jobs'].items():
  runs='\n'.join(s.get('run','') for s in j['steps']);assert 'node gardenlife-integration-qa016.js' in runs and 'GL016_MODE=' in runs and 'streetscape-integration-qa015.js' not in runs and 'git diff --exit-code' in runs
  checkout=[s for s in j['steps'] if s.get('uses')=='actions/checkout@v4'];assert len(checkout)==1 and checkout[0]['with']=={'fetch-depth':0,'persist-credentials':False}
  assert all(not s.get('continue-on-error',False) for s in j['steps'])
  if name=='preflight':assert 'node gardenlife-static-contract016.js' in runs and 'node gardenlife-integration-qa016.js --static-test' in runs
  else:
   assert 'python3 gardenlife-package016.py' in runs
   uploads=[s for s in j['steps'] if s.get('uses')=='actions/upload-artifact@v4'];assert len(uploads)==8
   for n,s in enumerate(uploads):assert s['with']['path']=='.gardenlife-packets/part'+str(n)+'/' and s['with']['if-no-files-found']=='error' and s['if'].startswith('always()')
 return True
validate(source);rejected=[]
for name,mutate in [('drop mode',lambda q:q['jobs']['native']['strategy']['matrix']['mode'].pop()),('write permission',lambda q:q['permissions'].update(contents='write')),('wrong branch',lambda q:q['on']['push']['branches'].append('main')),('wrong runtime',lambda q:q['jobs']['native']['steps'].__setitem__(3,{'run':'GL016_MODE=x node streetscape-integration-qa015.js'})),('missing preflight dependency',lambda q:q['jobs']['native'].pop('needs')),('drop raw artifact part',lambda q:q['jobs']['native']['steps'].pop()),('ignore failure',lambda q:q['jobs']['native']['steps'][3].update({'continue-on-error':True}))]:
 q=copy.deepcopy(source);mutate(q)
 try:validate(q)
 except (AssertionError,KeyError):rejected.append(name)
 else:raise AssertionError('Invalid native workflow accepted: '+name)
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'nativeModes':len(expected)+1,'rejected':rejected}))
