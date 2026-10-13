#!/usr/bin/env node
'use strict';
// Reproducible self-contained Pages build. Never loads the candidate adapter
// or candidate scene. Exact hook anchors fail closed on upstream changes.
const fs=require('fs'),crypto=require('crypto');
const geom=['british-use-scales-art021.js','british-use-scales-kit021.js','british-use-scales-hospitality021.js','british-use-scales-workplaces021.js','british-use-scales-agriculture021.js','british-use-scales-infrastructure021.js'];
// Five restored architecture sources stay byte-exact during kit reconstruction.
const originalArtPins={
 'british-use-scales-art021.js':'7d198526e46ac209d4cf892656bcc73fd95f8115cb1a07140518b933c6276de8',
 'british-use-scales-hospitality021.js':'7270c5e8b01626e80ddd625fa22b988ed956bbcc88f9be3141f34a6c56b81cf5',
 'british-use-scales-workplaces021.js':'51f14212f00e214d4654d86f65af33f49df9575e53835e5f3820dba8859e4144',
 'british-use-scales-agriculture021.js':'fcc80082b4732b14b29b741018e8afcc1b67a6aec55f3b4735c277a406654781',
 'british-use-scales-infrastructure021.js':'1a682da294d788bccb953e0adef45dada8da632be8c6fae0cf76c944ca02a7bc'
};
for(const [f,pin] of Object.entries(originalArtPins))if(crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')!==pin)throw Error('Restored architecture changed: '+f);
const mapping=JSON.parse(fs.readFileSync('british-use-scales-native-map021.json'));
const rows=Object.values(mapping.groups).flat().map(q=>Object.fromEntries(['id','group','scale','k','tool','alternateTool','sz','lv','bw','bh','mode'].map(k=>[k,q[k]])));
let runtime=fs.readFileSync('british-use-scales-release021.js','utf8').replace('__USE021_ROWS__',JSON.stringify(rows));
let html=fs.readFileSync('index.html','utf8');
function patch(a,b){if(html.includes(b))return;const n=html.split(a).length-1;if(n!==1)throw Error('Hook anchor count '+n+': '+a.slice(0,120));html=html.replace(a,b);}
patch('function newWorld(seedOverride){','function newWorld(seedOverride){\n  use021Selection=null;USE021_CACHE.clear(); // GPT-021: UI/cache only, native world remains unchanged');
html=html.replace('  use021Placed(toolId,x,y); // GPT-021: same native undo transaction, success path only\n','');
patch('      tickBld.push(idx(x,y)); // T316','      use021Born(cell); // GPT-021: actual native birth inherits the paid zone profile\n      tickBld.push(idx(x,y)); // T316');
patch('    const data={v:1,n:N,gameVer:GAME_VER','    const data={art021:use021Save(),v:1,n:N,gameVer:GAME_VER');
patch('    waterfrontLoad018(d.waterfront018);','    waterfrontLoad018(d.waterfront018);\n    use021Load(d.art021); // GPT-021: optional sparse visual metadata; old bl/RLE unchanged');
patch('function activateTool434(id,fromRecent){\n  const t=','function activateTool434(id,fromRecent){\n  use021Selection=null; // GPT-021: choosing/cancelling another native tool clears the visual selection\n  const t=');
patch('  refreshTxnUi460();if(mobile)requestAnimationFrame(()=>{const sel=', '  use021Toolbar();\n  refreshTxnUi460();if(mobile)requestAnimationFrame(()=>{const sel=');
patch('/* T364a sc sprite view：', 's=use021Resolve(o.x,o.y,bd,s,o.block547?.w,o.block547?.h); // GPT-021: real renderer, after native selection\n    /* T364a sc sprite view：');
patch('  if(!s||!s.img)return null;\n  let ax=x+bw-1,ay=y+bh-1,bd0=-1;', '  s=use021BlockRead(x,y,b,s,bw,bh); // GPT-021: story bubbles use the real directional sprite\n  if(!s||!s.img)return null;\n  let ax=x+bw-1,ay=y+bh-1,bd0=-1;');
// Both original smoke paths intentionally receive the same object as draw.
const sm='  if(!sp||!sp.smoke608)return [];';
if(!html.includes('GPT-021: smoke readers')){if(html.split(sm).length-1!==2)throw Error('Smoke hook count');html=html.replaceAll(sm,'  sp=use021BlockRead(x,y,b,sp,bw,bh); // GPT-021: smoke readers\n'+sm);}
patch('if(!(VARK574.has(b.k)&&v!==0))sp=metroIndustrySprite516A(b,sp);if(!sp)return null;', 'if(!(VARK574.has(b.k)&&v!==0))sp=metroIndustrySprite516A(b,sp);sp=use021Resolve(ox,oy,b,sp);if(!sp)return null;');
patch('os=getBlockSprite547(ob.k,ob.lv||1,dm[0],dm[1],ob.v||0),al=fw699Alpha(os);', 'os=use021BlockRead(ox,oy,ob,getBlockSprite547(ob.k,ob.lv||1,dm[0],dm[1],ob.v||0),ow,oh),al=fw699Alpha(os);');
patch('function reflectSprite(bd){','function reflectSprite(bd,px,py){');
// Original null cases and per-cell 1x1 reflection approximations remain.
const reflectStart=html.indexOf('function reflectSprite(bd,px,py){'),reflectEnd=html.indexOf('\n\n/* 標題 LOGO',reflectStart);
if(reflectStart<0||reflectEnd<0)throw Error('Native reflection anchors missing');
let reflect=html.slice(reflectStart,reflectEnd);
reflect=reflect.replace(/  if\(!window\.__noReflect608&&bd\.art021&&px!=null&&!window\.__noUseScalesRelease021\)\{[\s\S]*?\n  \}\n/,'');
reflect=reflect.replace('try{return getBlockSprite547(bd.k,bd.lv||1,1,1,bd.v||0);}', 'try{const base=getBlockSprite547(bd.k,bd.lv||1,1,1,bd.v||0);const blk=px!=null&&bd.art021?rciBlockOrigin547(px,py):null;return blk&&blk.w===1&&blk.h===1?use021Resolve(px,py,bd,base,1,1):base;}');
html=html.slice(0,reflectStart)+reflect+html.slice(reflectEnd);
patch('      let rb=null; // 倒影：依 wm 位向優先序找第一個有建築的鄰接陸地格\n      if(t.wm&1)rb=T(idx(x,y-1)).bld;\n      if(!rb&&t.wm&2)rb=T(idx(x+1,y)).bld;\n      if(!rb&&t.wm&4)rb=T(idx(x,y+1)).bld;\n      if(!rb&&t.wm&8)rb=T(idx(x-1,y)).bld;\n      const rs=rb&&reflectSprite(rb);', '      let rb=null,rpx,rpy; // 倒影：依 wm 位向優先序找第一個有建築的鄰接陸地格\n      if(t.wm&1){rpx=x;rpy=y-1;rb=T(idx(rpx,rpy)).bld;}\n      if(!rb&&t.wm&2){rpx=x+1;rpy=y;rb=T(idx(rpx,rpy)).bld;}\n      if(!rb&&t.wm&4){rpx=x;rpy=y+1;rb=T(idx(rpx,rpy)).bld;}\n      if(!rb&&t.wm&8){rpx=x-1;rpy=y;rb=T(idx(rpx,rpy)).bld;}\n      const rs=rb&&reflectSprite(rb,rpx,rpy);');
patch('    const old=getBlockSprite547(t.k,Math.max(1,(t.lv||2)-1),t.bw,t.bh,t.v||0);if(!old)return;', '    const previousLv=Math.max(1,(t.lv||2)-1),nativeOld=getBlockSprite547(t.k,previousLv,t.bw,t.bh,t.v||0);\n    const old=use021Resolve(o.x,o.y,{...bd,lv:previousLv},nativeOld,o.block547?.w,o.block547?.h);if(!old)return; // GPT-021: true previous native level, same profile');
if(html.includes('const p021=s.farmerPath?use021FarmPoint'))patch('const p021=s.farmerPath?use021FarmPoint','const p021=s.tractor021?use021FarmPoint');
else patch('const tx=bx+(164+tprog*38+row3*10-3)*z, ty=by+(206+tprog*19+row3*5-6)*z;', 'const p021=s.tractor021?use021FarmPoint(s,(tprog+1)/2,row3):[164+tprog*38+row3*10,206+tprog*19+row3*5];\n        const tx=bx+(p021[0]-3)*z, ty=by+(p021[1]-6)*z;');
patch('const spx=bx+68*z, spy=by+126*z;', 'const anchor021=s.farmAnchor021||[68,126],spx=bx+anchor021[0]*z, spy=by+anchor021[1]*z;');
const css='<style id="useScalesStyle021">\n#useScalesDialog021{color:#eee8d9;background:#272e2b;border:1px solid #877957;border-radius:12px;padding:20px;width:min(940px,calc(100% - 24px));max-width:calc(100% - 24px);max-height:calc(100dvh - 32px);box-sizing:border-box;overflow:auto;font:inherit}#useScalesDialog021::backdrop{background:#101816b8}#useScalesDialog021 header{display:flex;align-items:center;justify-content:space-between;gap:12px}#useScalesDialog021 h2{font-size:20px;margin:0}#useScalesDialog021 h3{margin:18px 0 8px;font-size:16px}#useScalesDialog021 p{line-height:1.6;color:#c9c6b7}#useScalesDialog021 button{font:inherit;color:inherit;background:#35403a;border:1px solid #617062;border-radius:8px;cursor:pointer}#useScalesClose021{min-width:44px;min-height:44px}.useScalesTrio021{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.useScalesTrio021 button{text-align:left;padding:12px;display:flex;flex-direction:column;gap:7px;min-width:0;min-height:118px}.useScalesTrio021 button:hover{border-color:#d9bf78}.useScalesTrio021 span{font-size:12px;color:#dbd5c4}.useScalesTrio021 small{font-size:11px;line-height:1.45;color:#b8c5b7}.useScalesTrio021>div{display:flex;flex-direction:column;gap:6px}.useScalesAxis021{font-size:12px;display:flex;align-items:center;gap:8px}.useScalesAxis021 select{font:inherit;color:inherit;background:#35403a;border:1px solid #617062;border-radius:6px;min-height:44px;max-width:100%;padding:4px}#useScalesSelected021{font-size:11px;padding:5px 8px;white-space:nowrap;color:#ddc890}#useScalesDialog021 button:focus-visible{outline:2px solid #e3c776;outline-offset:3px}@media(max-width:600px){#useScalesDialog021{padding:14px}.useScalesTrio021{grid-template-columns:1fr}.useScalesTrio021 button{min-height:98px}}\n</style>';
const art='<!-- GPT-021 PURE ART START -->\n'+css+'\n'+geom.map(f=>'<script data-use021-source="'+f+'">\n'+fs.readFileSync(f,'utf8')+'\n</script>').join('\n')+'\n<!-- GPT-021 PURE ART END -->\n';
if(html.includes('<!-- GPT-021 PURE ART START -->'))html=html.replace(/<!-- GPT-021 PURE ART START -->[\s\S]*?<!-- GPT-021 PURE ART END -->\n/,art);else html=html.replace('<script>',art+'<script>');
const rt='/* GPT-021 RUNTIME START */\n'+runtime+'\n/* GPT-021 RUNTIME END */\n';
if(html.includes('/* GPT-021 RUNTIME START */'))html=html.replace(/\/\* GPT-021 RUNTIME START \*\/[\s\S]*?\/\* GPT-021 RUNTIME END \*\/\n/,rt);else html=html.replace('Object.assign(window.GV,{art574',rt+'Object.assign(window.GV,{art574');
fs.writeFileSync('index.html',html);
console.log(JSON.stringify({forms:rows.length,indexSHA256:crypto.createHash('sha256').update(html).digest('hex'),geometry:geom.length,selfContained:!/<script[^>]+src=[^>]*021/.test(html)}));
