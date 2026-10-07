#!/usr/bin/env python3
"""Source-only: preserve all148 old jobs and add exactly eight019 modes."""
from pathlib import Path
import copy,json,yaml
root=Path(__file__).resolve().parent
old=yaml.safe_load((root/'.github/workflows/waterfront-full018.yml').read_text())
current=yaml.safe_load((root/'.github/workflows/waterfront-quarter019.yml').read_text())
new_modes=['planning','lifecycle',*[f'camera{n}'for n in range(4)],'coldload','mobile']
def commands(job):return '\n'.join(s.get('run','')for s in job['steps'])
def validate(q):
 assert q['name']=='waterfront-quarter019'
 assert q['permissions']=={'contents':'read'} and q['concurrency']['cancel-in-progress']is False
 assert q['on']['push']['branches']==['gpt/waterfront-cultural-quarter-019']
 j=q['jobs'];assert set(j)=={'preflight','legacy','native','compatibility','quarter'}
 assert j['legacy']['strategy']==old['jobs']['legacy']['strategy']
 assert j['native']['strategy']==old['jobs']['native']['strategy']
 assert j['quarter']['strategy']=={'fail-fast':False,'matrix':{'mode':new_modes}}
 assert 1+len(j['legacy']['strategy']['matrix']['include'])+len(j['native']['strategy']['matrix']['mode'])+1+len(j['quarter']['strategy']['matrix']['mode'])==156
 for name,job in j.items():
  assert job['runs-on']=='ubuntu-latest'
  assert all(not s.get('continue-on-error',False)for s in job['steps'])
  assert [s['with']for s in job['steps']if s.get('uses')=='actions/checkout@v4']==[{'fetch-depth':0,'persist-credentials':False}]
  for s in job['steps']:assert not s.get('env',{}).get('NODE_OPTIONS')
  text=commands(job);assert 'git diff --exit-code'in text and'python3 waterfront-quarter-package019.py'in text
  for forbidden in ['git push','gh pr','gh workflow','git commit','fp.js --update','npm publish']:assert forbidden not in text
  uploads=[s for s in job['steps']if s.get('uses')=='actions/upload-artifact@v4'and'part'in s['with']['name']];assert len(uploads)==8
  for n,s in enumerate(uploads):assert s['if'].startswith('always()')and s['with']['path']==f'.waterfront-quarter-packets/part{n}/'and s['with']['if-no-files-found']=='error'
  if name!='preflight':
   assert job['needs']==('preflight'if name in ['native','quarter']else['preflight','native'])
   assert [s['with']for s in job['steps']if s.get('uses')=='actions/download-artifact@v4']==[{'name':'waterfront-quarter019-native-fingerprint-${{ github.sha }}','path':'waterfront-quarter-evidence/preflight'}]
 pre=commands(j['preflight']);assert old['jobs']['preflight']['steps'][3]['run']in pre and old['jobs']['preflight']['steps'][4]['run']in pre
 assert 'b101348278b71f133b5f4347bc6e63237c9942a1'in pre
 for text in ['node waterfront-quarter-contract019.js','node waterfront-quarter-logic019.test.js','node waterfront-quarter-native019.test.js','node waterfront-quarter-legacy019.js --static-test','node waterfront-quarter-compatibility019.js --static-test','node waterfront-quarter-adapters019.test.js','python3 waterfront-quarter-workflow019.test.py','python3 waterfront-quarter-package019.test.py','node waterfront-quarter-preflight019.js','node waterfront-quarter-retained-controls019.js waterfront-quarter-evidence/preflight/fingerprint-native.json','WF019_SUITE=streetscape WF019_MODE=preflight']:assert text in pre
 assert pre.index('node waterfront-quarter-preflight019.js')<pre.index('node waterfront-quarter-retained-controls019.js')<pre.index('WF019_SUITE=streetscape')
 assert'WF019_SUITE=waterfront WF019_MODE=${{ matrix.mode }} node waterfront-quarter-legacy019.js'in commands(j['native'])
 assert'WF019_SUITE=${{ matrix.suite }} WF019_MODE=${{ matrix.mode }} WF019_GROUP=${{ matrix.group }} node waterfront-quarter-legacy019.js'in commands(j['legacy'])
 assert'WF019_MODE=${{ matrix.mode }} node probe-waterfront-quarter019.js'in commands(j['quarter'])
 c=commands(j['compatibility'])
 for text in ['for n in 1 2 3','node smoke.js','node waterfront-quarter-style019.js','WF019_SUITE=complexes WF019_MODE=fingerprint','WF019_SUITE=compatibility WF019_MODE=gameplay','node waterfront-quarter-compatibility019.js museum-evidence/compatibility/guards/compatibility.json']:assert text in c
 return True
validate(current);rejected=[]
for name,change in [('drop retained runtime',lambda q:q['jobs']['legacy']['strategy']['matrix']['include'].pop()),('drop old native mode',lambda q:q['jobs']['native']['strategy']['matrix']['mode'].pop()),('drop new mode',lambda q:q['jobs']['quarter']['strategy']['matrix']['mode'].pop()),('duplicate new mode',lambda q:q['jobs']['quarter']['strategy']['matrix']['mode'].append('mobile')),('grant write',lambda q:q['permissions'].update(contents='write')),('enable main',lambda q:q['on']['push']['branches'].append('main')),('skip exact-head preflight',lambda q:q['jobs']['native'].pop('needs')),('mask failure',lambda q:q['jobs']['quarter']['steps'][3].update({'continue-on-error':True})),('drop historical source controls',lambda q:q['jobs']['preflight']['steps'].__setitem__(4,{'run':'true'})),('drop full3179 input',lambda q:q['jobs']['preflight']['steps'].__setitem__(5,{'run':'node waterfront-quarter-retained-controls019.js'})),('drop artifact',lambda q:q['jobs']['quarter']['steps'].pop(-2))]:
 q=copy.deepcopy(current);change(q)
 try:validate(q)
 except(AssertionError,KeyError,ValueError):rejected.append(name)
 else:raise AssertionError('Bad workflow accepted: '+name)
package=(root/'waterfront-quarter-package019.py').read_text();assert 'len(index_bytes(packet))'in package and "'packetCount':8"in package and 'os.rename(ready,out)'in package and 'limit-65536'not in package
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'retainedJobs':148,'newJobs':8,'combinedJobs':156,'oldMatricesExact':True,'oldSourceControlsPinned':True,'losslessPackagerExactIndexBudget':True,'rejected':rejected}))
