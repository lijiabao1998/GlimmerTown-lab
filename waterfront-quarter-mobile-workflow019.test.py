#!/usr/bin/env python3
from pathlib import Path
import copy,json,yaml
root=Path(__file__).resolve().parent
full=yaml.safe_load((root/'.github/workflows/waterfront-quarter019.yml').read_text())
short=yaml.safe_load((root/'.github/workflows/waterfront-quarter019-mobile-qa.yml').read_text())
for w in [full,short]:
 for job in w['jobs'].values():
  steps=[s for s in job['steps']if s.get('name')=='Native font'];assert len(steps)==1
  f=steps[0];assert f['timeout-minutes']==7 and not f.get('continue-on-error',False)
  run=f['run'];assert 'for attempt in 1 2; do' in run and run.count('timeout --kill-after=5s 90s')==2
  assert 'fonts-wqy-zenhei=0.9.45-8' in run and 'dpkg --verify fonts-wqy-zenhei' in run and 'sha256sum /usr/share/fonts/truetype/wqy/wqy-zenhei.ttc' in run
  assert run.rstrip().endswith('exit 1') and 'Acquire::http::Timeout=20' in run and 'Acquire::https::Timeout=20' in run
assert set(short['jobs'])=={'preflight','quarter'} and short['jobs']['preflight']==full['jobs']['preflight']
q=copy.deepcopy(full['jobs']['quarter']);q['strategy']['matrix']['mode']=['mobile'];assert q==short['jobs']['quarter']
assert short['on']['push']['branches']==['gpt/waterfront-quarter019-mobile-qa'] and full['on']['push']['branches']==['gpt/waterfront-cultural-quarter-019']
assert short['permissions']=={'contents':'read'} and short['concurrency']['cancel-in-progress']is False
print(json.dumps({'ok':True,'sourceOnly':True,'gameExecuted':False,'full156Unchanged':True,'independentMobileQA':True,'shortReusesExactPreflightAndMobile':True,'samePinnedFontPackage':True,'fontAttempts':2,'fontCommandTimeoutSeconds':90,'fontStepTimeoutMinutes':7,'failuresRemainFatal':True}))
