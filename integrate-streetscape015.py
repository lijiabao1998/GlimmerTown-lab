#!/usr/bin/env python3
"""GPT-015 deterministic count-checked additive source assembly. No game execution."""
import argparse, hashlib, json, pathlib, re
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True);a=p.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if src.resolve()==out.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if hashlib.sha256(base.encode()).hexdigest()!='3a2b5c8f4c1a9fa59a080d9ae7e9ea4dca36a35dc00cd17b9723141f6dedaa0f':raise SystemExit('Exact deployed T727 baseline required')
if 'STREETSCAPE_PATH015' in s:raise SystemExit('Already integrated')
def rep(old,new,count=1):
 global s
 if s.count(old)!=count:raise SystemExit(f'Unique integration anchor expected {count}, got {s.count(old)}: {old[:110]}')
 s=s.replace(old,new);audit.append({'from':old,'to':new,'count':count})
early,late=(P/'gameplay015.js').read_text().split('/* GPT-015 LATE NATIVE HOOKS */',1)
art=(P/'british-streetscape-art015.js').read_text()
rep('<!-- GPT-014 native complexes art END -->','<!-- GPT-014 native complexes art END -->\n<!-- GPT-015 native street detail art BEGIN: source british-streetscape-art015.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-015 native street detail art END -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('const drawPath643=(src=>','/* GPT-015 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installComplexArt014(); // GPT-004','installComplexArt014();installStreetscapeArt015(); // GPT-004')
rep('function toolHint434(t){','function toolHint434(t){\n  if(t&&STREETSCAPE_PATH015[t.id])return streetscapeDescription015(STREETSCAPE_PATH015[t.id]);')
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !(STREETSCAPE_PATH015[t.id]&&window.__noStreetscape015)&&')
rep('!theatreTheme013(t)&&!complexTheme014(t)&&hasRoadNear','!theatreTheme013(t)&&!complexTheme014(t)&&!streetscapeTheme015(t)&&hasRoadNear')
rep('complexObjects014(objs,sxOf,syOf,vis,lodFar);','complexObjects014(objs,sxOf,syOf,vis,lodFar);streetscapeObjects015(objs,sxOf,syOf,vis,lodFar);')
rep('    if(o.complexModule014){','    if(o.streetscapeModule015){streetscapeModuleDraw015(ctx,o,z,nightDepth,nightSprites,occ629Push);continue;}\n    if(o.complexModule014){')
rep('||(!window.__noComplexArt014&&cam.z>=lodFarZ648()&&complexTheme014(tiles[i])))continue;','||(!window.__noComplexArt014&&cam.z>=lodFarZ648()&&complexTheme014(tiles[i]))||(!window.__noStreetscapeArt015&&cam.z>=lodFarZ648()&&streetscapeTheme015(tiles[i])))continue;')
rep('  complexSelftest014,complexSpecs014,complexAt014,complexEvidence014,complexFiscal014,','  streetscapeSelftest015,streetscapeSpecs015,streetscapeAt015,streetscapeEvidence015,\n  complexSelftest014,complexSpecs014,complexAt014,complexEvidence014,complexFiscal014,')
# Every edit is independently reversible, including complete authored insertions.
reverse=s
for e in reversed(audit):
 if reverse.count(e['to'])!=e['count']:raise SystemExit('Non-unique reverse integration')
 reverse=reverse.replace(e['to'],e['from'])
if reverse!=base:raise SystemExit('Unlisted product delta')
for key in ['GAME_VER','GAME_ANCHOR']:
 assert re.findall(r'const '+key+r'=[^;]+;',base)==re.findall(r'const '+key+r'=[^;]+;',s)
assert src.read_text()==base
out.write_text(s)
print(json.dumps({'baseSHA256':hashlib.sha256(base.encode()).hexdigest(),'sourceSHA256':hashlib.sha256(s.encode()).hexdigest(),'edits':[{'anchor':e['from'][:120],'count':e['count']} for e in audit],'reversibleExact':True},ensure_ascii=False))
