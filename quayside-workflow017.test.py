#!/usr/bin/env python3
"""Source/YAML-only proof that all118 prior T729 execution modes remain."""
from pathlib import Path
import sys,copy,yaml,json
ROOT=Path(__file__).resolve().parent
SOURCE=Path(sys.argv[1]).resolve() if len(sys.argv)==2 else ROOT
old=yaml.safe_load((SOURCE/'.github/workflows/gardenlife-legacy016.yml').read_text())
native=yaml.safe_load((SOURCE/'.github/workflows/gardenlife-integration016.yml').read_text())
new=yaml.safe_load((ROOT/'.github/workflows/quayside-legacy017.yml').read_text())
prior_modes=['preflight',*native['jobs']['native']['strategy']['matrix']['mode']]
expected=[{'suite':'gardenlife','mode':m,'group':'none'}for m in prior_modes]+old['jobs']['legacy']['strategy']['matrix']['include']
assert len(prior_modes)==13 and len(expected)==115
assert len({(x['suite'],x['mode'],x['group'])for x in expected})==115
smoke=yaml.safe_load((SOURCE/'.github/workflows/smoke.yml').read_text())
assert 'gpt/**' in (smoke.get('on')or smoke[True])['push']['branches']
def runs(job):return '\n'.join(s.get('run','')for s in job['steps'])
def validate(q):
 assert q['permissions']=={'contents':'read'}
 assert q['on']['push']['branches']==['gpt/british-quayside-details-017']
 assert q['concurrency']['cancel-in-progress'] is False
 j=q['jobs'];assert set(j)=={'preflight','legacy','compatibility'}
 assert j['legacy']['strategy']['matrix']['include']==expected
 assert j['legacy']['strategy']['fail-fast'] is False
 for name in ['legacy','compatibility']:
  assert j[name]['needs']=='preflight'
  downloads=[s for s in j[name]['steps']if s.get('uses')=='actions/download-artifact@v4']
  assert len(downloads)==1 and downloads[0]['with']['name']=='quayside-full-native-fingerprint-${{ github.sha }}'
  assert downloads[0]['with']['path']=='quayside-evidence/preflight'
  assert "require('./quayside-fingerprint017').readPreflight017()" in runs(j[name])
 for name,v in j.items():
  assert v['runs-on']=='ubuntu-latest'
  checkout=[s for s in v['steps']if s.get('uses')=='actions/checkout@v4'];assert len(checkout)==1 and checkout[0]['with']['persist-credentials']is False and checkout[0]['with']['fetch-depth']==0
  uploads=[s for s in v['steps']if s.get('uses')=='actions/upload-artifact@v4' and 'part' in s['with']['name']];assert len(uploads)==8
  for n,s in enumerate(uploads):assert s['with']['path']=='.quayside-packets/part'+str(n)+'/' and s['if'].startswith('always()') and s['with']['if-no-files-found']=='error'
  assert 'git diff --exit-code' in runs(v) and 'python3 quayside-package017.py'in runs(v)
 pre=runs(j['preflight'])
 for marker in ['node quayside-static-contract017.js','node quayside-compatibility017.js --static-test','node quayside-legacy017.js --static-test','node quayside-integration-qa017.js --static-test','node quayside-gameplay017.test.js','node quayside-style017.test.js','python3 quayside-workflow017.test.py','c7f0ab6e6d2c37651fd13802049b8079c5f5d37b','node gardenlife-release-contract016.test.js','node gardenlife-integration-qa016.js --static-test','python3 gardenlife-native-workflow016.test.py']:
  assert marker in pre
 # The entire old frozen-source block survives as exact source, recursively.
 assert old['jobs']['preflight']['steps'][4]['run'] in pre
 current='QS017_MODE=preflight node quayside-integration-qa017.js'
 legacy='QS017_SUITE=streetscape QS017_MODE=preflight node quayside-legacy017.js'
 assert pre.index(current)<pre.index('node quayside-legacy017.test.js quayside-evidence/preflight/fingerprint-native.json')<pre.index(legacy)
 compat=runs(j['compatibility'])
 for marker in ['for n in 1 2 3','node quayside-style017.js','QS017_SUITE=complexes QS017_MODE=fingerprint','QS017_SUITE=compatibility QS017_MODE=gameplay','node quayside-compatibility017.test.js museum-evidence/compatibility/guards/compatibility.json']:assert marker in compat
 assert 'QS017_SUITE=${{ matrix.suite }} QS017_MODE=${{ matrix.mode }} QS017_GROUP=${{ matrix.group }} node quayside-legacy017.js' in runs(j['legacy'])
 for v in j.values():
  for word in ['git push','gh pr','gh workflow','npm publish','fp.js --update','git commit']:
   assert word not in runs(v)
 return True
validate(new);rejected=[]
for name,mutate in [('drop mode',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].pop()),('duplicate mode',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].append(expected[0])),('unreviewed branch',lambda q:q['on']['push']['branches'].append('main')),('write permission',lambda q:q['permissions'].update(contents='write')),('missing gate',lambda q:q['jobs']['legacy'].pop('needs')),('missing raw packet',lambda q:q['jobs']['legacy']['steps'].pop()),('missing retained preflight',lambda q:q['jobs']['preflight']['steps'].__setitem__(5,{'run':'QS017_MODE=preflight node quayside-integration-qa017.js'})),('missing original source controls',lambda q:q['jobs']['preflight']['steps'].__setitem__(4,{'run':'node gardenlife-static-contract016.js'}))]:
 q=copy.deepcopy(new);mutate(q)
 try:validate(q)
 except (AssertionError,KeyError,ValueError):rejected.append(name)
 else:raise AssertionError('Workflow mutation accepted: '+name)
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'originalNative016Modes':13,'originalLegacy016MatrixModes':102,'retainedLegacy016Preflight':1,'retainedCompatibilityMode':1,'existingBranchSmoke':1,'totalRetainedPriorModes':118,'newLegacyMatrixJobs':115,'newLegacyWorkflowJobs':117,'newNativeWorkflowJobsExpected':13,'newCandidateTotalJobsExpected':131,'originalRuntimeModeSetExact':True,'rejected':rejected}))
