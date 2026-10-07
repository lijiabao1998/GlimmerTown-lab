#!/usr/bin/env python3
"""No game execution: retain every original runtime mode and failure artifact."""
from pathlib import Path
import copy,json,yaml
root=Path(__file__).resolve().parent
old=yaml.safe_load((root/'.github/workflows/quayside-legacy017.yml').read_text())
oldnative=yaml.safe_load((root/'.github/workflows/quayside-integration017.yml').read_text())
current=yaml.safe_load((root/'.github/workflows/waterfront-full018.yml').read_text())
expected=[{'suite':'quayside','mode':mode,'group':'none'}for mode in ['preflight',*oldnative['jobs']['native']['strategy']['matrix']['mode']]]+old['jobs']['legacy']['strategy']['matrix']['include']
native=['catalog','gameplay','coldload','malformed',*[f'camera{n}'for n in range(4)],*[f'construction{n}'for n in range(4)],'weather','occlusion']
assert len(expected)==128 and len({tuple(v.values())for v in expected})==128
def runs(job):return'\n'.join(s.get('run','')for s in job['steps'])
def validate(q):
 assert q['permissions']=={'contents':'read'}
 assert q['on']['push']['branches']==['gpt/british-waterfront-heritage-018']
 assert q['concurrency']['cancel-in-progress']is False
 j=q['jobs'];assert set(j)=={'preflight','legacy','compatibility','native'}
 assert j['legacy']['strategy']['matrix']['include']==expected and j['legacy']['strategy']['fail-fast']is False
 assert j['native']['strategy']['matrix']['mode']==native and j['native']['strategy']['fail-fast']is False
 for name in ['legacy','compatibility','native']:
  assert j[name]['needs']=='preflight'
  downloads=[s for s in j[name]['steps']if s.get('uses')=='actions/download-artifact@v4'];assert len(downloads)==1
  assert downloads[0]['with']=={'name':'waterfront-full-native-fingerprint-${{ github.sha }}','path':'waterfront-evidence/preflight'}
 for name,job in j.items():
  assert job['runs-on']=='ubuntu-latest'
  checkouts=[s for s in job['steps']if s.get('uses')=='actions/checkout@v4'];assert len(checkouts)==1 and checkouts[0]['with']=={'fetch-depth':0,'persist-credentials':False}
  assert all(not s.get('continue-on-error',False)for s in job['steps'])
  uploads=[s for s in job['steps']if s.get('uses')=='actions/upload-artifact@v4'and'part'in s['with']['name']];assert len(uploads)==8
  for n,s in enumerate(uploads):assert s['if'].startswith('always()')and s['with']['path']=='.waterfront-packets/part'+str(n)+'/'and s['with']['if-no-files-found']=='error'
  commands=runs(job);assert'git diff --exit-code'in commands and'python3 waterfront-package018.py'in commands
  for forbidden in ['git push','gh pr','gh workflow','npm publish','fp.js --update','git commit']:assert forbidden not in commands
 pre=runs(j['preflight']);assert old['jobs']['preflight']['steps'][4]['run']in pre
 for text in ['1400301238f7a46ab6d3c489422a48f9f90cac9d','node quayside-release-contract017.test.js','node quayside-legacy017.js --static-test','node waterfront-preflight018.js','node waterfront-legacy018.test.js','node waterfront-historical-bridge018.test.js','node waterfront-style018.test.js','node waterfront-integration-qa018.js --static-test','node waterfront-compatibility018.test.js --static-test','python3 waterfront-workflow018.test.py']:assert text in pre
 assert pre.index('node waterfront-preflight018.js')<pre.index('node waterfront-legacy018.test.js')<pre.index('WF018_SUITE=streetscape')
 compatibility=runs(j['compatibility'])
 for text in ['for n in 1 2 3','node waterfront-style018.js','WF018_SUITE=complexes WF018_MODE=fingerprint','WF018_SUITE=compatibility WF018_MODE=gameplay','node waterfront-compatibility018.test.js museum-evidence/compatibility/guards/compatibility.json']:assert text in compatibility
 assert'WF018_SUITE=${{ matrix.suite }} WF018_MODE=${{ matrix.mode }} WF018_GROUP=${{ matrix.group }} node waterfront-legacy018.js'in runs(j['legacy'])
 assert'WF018_MODE=${{ matrix.mode }} node waterfront-integration-qa018.js'in runs(j['native'])
 return True
validate(current);rejected=[]
for name,mutate in [('drop historical mode',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].pop()),('drop native mode',lambda q:q['jobs']['native']['strategy']['matrix']['mode'].pop()),('duplicate old mode',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].append(expected[0])),('main branch trigger',lambda q:q['on']['push']['branches'].append('main')),('write permission',lambda q:q['permissions'].update(contents='write')),('missing native dependency',lambda q:q['jobs']['native'].pop('needs')),('drop raw artifact',lambda q:q['jobs']['native']['steps'].pop(-2)),('ignored failure',lambda q:q['jobs']['native']['steps'][3].update({'continue-on-error':True})),('remove frozen controls',lambda q:q['jobs']['preflight']['steps'].__setitem__(4,{'run':'node waterfront-source-qa018.js'}))]:
 q=copy.deepcopy(current);mutate(q)
 try:validate(q)
 except(AssertionError,KeyError,ValueError):rejected.append(name)
 else:raise AssertionError('Invalid workflow accepted: '+name)
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'retainedMatrixModes':128,'newNativeModes':14,'fullWorkflowJobs':144,'priorSourceBlocksExact':True,'rejected':rejected}))
