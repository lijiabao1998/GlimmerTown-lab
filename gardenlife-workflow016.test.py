#!/usr/bin/env python3
"""Source/YAML-only proof that every105 prior T728 execution mode remains."""
from pathlib import Path
import sys,copy,yaml,json
ROOT=Path(__file__).resolve().parent
SOURCE=Path(sys.argv[1]).resolve() if len(sys.argv)==2 else ROOT
old=yaml.safe_load((SOURCE/'.github/workflows/streetscape-legacy015.yml').read_text())
native=yaml.safe_load((SOURCE/'.github/workflows/streetscape-integration015.yml').read_text())
new=yaml.safe_load((ROOT/'.github/workflows/gardenlife-legacy016.yml').read_text())
prior_modes=['preflight',*native['jobs']['native']['strategy']['matrix']['mode']]
expected=[{'suite':'streetscape','mode':m,'group':'none'}for m in prior_modes]+old['jobs']['legacy']['strategy']['matrix']['include']
assert len(prior_modes)==13 and len(expected)==102
assert len({(x['suite'],x['mode'],x['group'])for x in expected})==102
smoke=yaml.safe_load((SOURCE/'.github/workflows/smoke.yml').read_text())
assert 'gpt/**' in (smoke.get('on')or smoke[True])['push']['branches']
def runs(job):return '\n'.join(s.get('run','')for s in job['steps'])
def validate(q):
 assert q['permissions']=={'contents':'read'}
 assert q['on']['push']['branches']==['gpt/british-garden-life-016']
 assert q['concurrency']['cancel-in-progress'] is False
 j=q['jobs'];assert set(j)=={'preflight','legacy','compatibility'}
 assert j['legacy']['strategy']['matrix']['include']==expected
 assert j['legacy']['strategy']['fail-fast'] is False
 for name in ['legacy','compatibility']:
  assert j[name]['needs']=='preflight'
  downloads=[s for s in j[name]['steps']if s.get('uses')=='actions/download-artifact@v4']
  assert len(downloads)==1 and downloads[0]['with']['name']=='gardenlife-full-native-fingerprint-${{ github.sha }}'
  assert downloads[0]['with']['path']=='gardenlife-evidence/preflight'
  assert "require('./gardenlife-fingerprint016').readPreflight016()" in runs(j[name])
 for name,v in j.items():
  assert v['runs-on']=='ubuntu-latest'
  checkout=[s for s in v['steps']if s.get('uses')=='actions/checkout@v4'];assert len(checkout)==1 and checkout[0]['with']['persist-credentials']is False and checkout[0]['with']['fetch-depth']==0
  uploads=[s for s in v['steps']if s.get('uses')=='actions/upload-artifact@v4' and 'part' in s['with']['name']];assert len(uploads)==8
  for n,s in enumerate(uploads):assert s['with']['path']=='.gardenlife-packets/part'+str(n)+'/' and s['if'].startswith('always()') and s['with']['if-no-files-found']=='error'
  assert 'git diff --exit-code' in runs(v) and 'python3 gardenlife-package016.py'in runs(v)
 pre=runs(j['preflight'])
 for marker in ['node gardenlife-static-contract016.js','node gardenlife-compatibility016.js --static-test','node gardenlife-legacy016.js --static-test','node gardenlife-integration-qa016.js --static-test','node gardenlife-style016.test.js','python3 gardenlife-workflow016.test.py','bcd77d5e959ed801d920766cbc9dc010cce19f58','node streetscape-release-contract015.test.js','node streetscape-integration-qa015.js --static-test']:
  assert marker in pre
 # Keep the whole unchanged014 frozen-source test block, not only selected checks.
 assert old['jobs']['preflight']['steps'][4]['run'] in pre
 current='GL016_MODE=preflight node gardenlife-integration-qa016.js'
 legacy='GL016_SUITE=streetscape GL016_MODE=preflight node gardenlife-legacy016.js'
 assert pre.index(current)<pre.index('node gardenlife-legacy016.test.js gardenlife-evidence/preflight/fingerprint-native.json')<pre.index(legacy)
 compat=runs(j['compatibility'])
 for marker in ['for n in 1 2 3','node gardenlife-style016.js','GL016_SUITE=complexes GL016_MODE=fingerprint','GL016_SUITE=compatibility GL016_MODE=gameplay','node gardenlife-compatibility016.test.js museum-evidence/compatibility/guards/compatibility.json']:assert marker in compat
 # No checkout credentials, PR, merge, publish or mutable-baseline maintenance.
 for v in j.values():
  for word in ['git push','gh pr','gh workflow','npm publish','fp.js --update','git commit']:
   assert word not in runs(v)
 return True
validate(new);rejected=[]
for name,mutate in [('drop mode',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].pop()),('duplicate mode',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].append(expected[0])),('unreviewed branch',lambda q:q['on']['push']['branches'].append('main')),('write permission',lambda q:q['permissions'].update(contents='write')),('missing gate',lambda q:q['jobs']['legacy'].pop('needs')),('missing raw packet',lambda q:q['jobs']['legacy']['steps'].pop()),('missing retained preflight',lambda q:q['jobs']['preflight']['steps'].__setitem__(5,{'run':'GL016_MODE=preflight node gardenlife-integration-qa016.js'}))]:
 q=copy.deepcopy(new);mutate(q)
 try:validate(q)
 except (AssertionError,KeyError,ValueError):rejected.append(name)
 else:raise AssertionError('Workflow mutation accepted: '+name)
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'originalNative015Modes':13,'originalLegacy015MatrixModes':89,'retainedLegacy015Preflight':1,'retainedCompatibilityMode':1,'existingBranchSmoke':1,'totalRetainedPriorModes':105,'additionalCurrent016Preflight':1,'originalRuntimeModeSetExact':True,'rejected':rejected}))
