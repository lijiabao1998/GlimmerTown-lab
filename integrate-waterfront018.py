#!/usr/bin/env python3
"""Count-checked additive source assembly; never runs game or art."""
import argparse,hashlib,json,pathlib,re
P=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--output',required=True);a=p.parse_args()
src=pathlib.Path(a.input);out=pathlib.Path(a.output)
if src.resolve()==out.resolve() or out.resolve()==(P/'index.html').resolve():raise SystemExit('Separate candidate output required')
base=src.read_text();s=base;audit=[]
if hashlib.sha256(base.encode()).hexdigest()!='f43910b13ff2d0d341e36ebed9b1332439286bb97e39fab3e5d2fedf103e7a99':raise SystemExit('Exact released T730 required')
if 'WATERFRONT_TOOL018' in s:raise SystemExit('Already integrated')
def rep(old,new,count=1):
 global s
 if s.count(old)!=count:raise SystemExit(f'Unique anchor expected {count}, got {s.count(old)}: {old[:110]}')
 s=s.replace(old,new);audit.append({'from':old,'to':new,'count':count})
early,late=(P/'gameplay018.js').read_text().split('/* GPT-018 LATE NATIVE HOOKS */',1)
art=(P/'british-waterfront-heritage-art018.js').read_text()
edge=(P/'mapedge-render018.js').read_text()
rep('<!-- GPT-017 native quayside art END -->','<!-- GPT-017 native quayside art END -->\n<!-- GPT-018 native waterfront art BEGIN: source british-waterfront-heritage-art018.js -->\n<script>\n'+art+'\n</script>\n<!-- GPT-018 native waterfront art END -->')
rep('<!-- GPT-018 native waterfront art END -->','<!-- GPT-018 native waterfront art END -->\n<!-- GPT-018 owner-requested native map-edge repair BEGIN -->\n<script>\n'+edge+'\n</script>\n<!-- GPT-018 owner-requested native map-edge repair END -->')
rep('function britishSpec004(k){',early+'\nfunction britishSpec004(k){')
rep('const drawPath643=(src=>','/* GPT-018 LATE NATIVE HOOKS */'+late+'\nconst drawPath643=(src=>')
rep('installQuaysideArt017(); // GPT-004','installQuaysideArt017();installWaterfrontArt018(); // GPT-004')
rep('function toolHint434(t){','function toolHint434(t){\n  if(t&&waterfrontTool018(t.id))return waterfrontDescription018(waterfrontTool018(t.id));')
rep('function toolUnlocked458(t){return !!t&&','function toolUnlocked458(t){return !!t&& !(waterfrontTool018(t.id)&&(window.__noWaterfront018||window.__noComplex014))&&')
rep('    if(!(VARK574.has(bd.k)&&vdraw574(o,bd)!==0))s=metroIndustrySprite516A(bd,s);','    s=waterfrontSprite018(bd,s);\n    if(!(VARK574.has(bd.k)&&vdraw574(o,bd)!==0))s=metroIndustrySprite516A(bd,s);')
rep('    if(fuel>0)data.fuel364=fuel;','    {const w018=waterfrontSave018();if(w018)data.waterfront018=w018;}\n    if(fuel>0)data.fuel364=fuel;')
rep('    if(d.cm)for(let i=0;i<N*N;i++){','    waterfrontLoad018(d.waterfront018);\n    if(d.cm)for(let i=0;i<N*N;i++){')
rep('  quaysideSelftest017,quaysideSpecs017,quaysideAt017,quaysideEvidence017,','  waterfrontSelftest018,waterfrontSpecs018,waterfrontAt018,waterfrontEvidence018,\n  quaysideSelftest017,quaysideSpecs017,quaysideAt017,quaysideEvidence017,')
rep("gc.drawImage(SPR.cliff,sx,sy,64*z,56*z); // T388", "window.MapEdgeRepair018.drawMapEdge018(gc,SPR.cliff,vp388[0],vp388[1],N,sx,sy,z,!!window.__noMapEdgeFix018); // GPT-018 owner-requested outward map-edge faces; T388")
rep("+(window.__noWaterGrad666?'_wg0':''); // T648", "+(window.__noWaterGrad666?'_wg0':'')+(window.__noMapEdgeFix018?'_me018old':''); // T648")
reverse=s
for e in reversed(audit):
 if reverse.count(e['to'])!=e['count']:raise SystemExit('Non-unique reverse integration')
 reverse=reverse.replace(e['to'],e['from'])
if reverse!=base:raise SystemExit('Unlisted product delta')
for key in ['GAME_VER','GAME_ANCHOR']:assert re.findall(r'const '+key+r'=[^;]+;',base)==re.findall(r'const '+key+r'=[^;]+;',s)
assert src.read_text()==base
out.write_text(s)
print(json.dumps({'baseSHA256':hashlib.sha256(base.encode()).hexdigest(),'sourceSHA256':hashlib.sha256(s.encode()).hexdigest(),'edits':[{'anchor':e['from'][:120],'count':e['count']} for e in audit],'reversibleExact':True},ensure_ascii=False))
