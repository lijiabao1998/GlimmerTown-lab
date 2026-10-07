'use strict';
// Source and inert DOM/geometry mocks only. No browser, game or painter runs.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {quarterBoxUI019,quarterCatalogBounds019}=require('./waterfront-quarter-catalog-qa019');
const game=fs.readFileSync('gameplay019.js','utf8'),runner=fs.readFileSync('probe-waterfront-quarter019.js','utf8');
const segment=game.split('/* GPT-019 CATALOG FIT BEGIN: additive UI only; frozen T731 sources stay exact. */')[1].split('/* GPT-019 CATALOG FIT END */')[0];assert(segment);
let renders=0,styles=0,lastSizeArg,lastSizeThis;const elements=new Map(),attrs=new Set(),host={scrollTop:83,insertAdjacentHTML:()=>{}},search={value:'old'},cats={appendChild:b=>{cats.button=b;}};
elements.set('buildCatalog458',{toggleAttribute:(key,on)=>on?attrs.add(key):attrs.delete(key)});elements.set('catalogResults458',host);elements.set('catalogSearch458',search);elements.set('catalogCats458',cats);
const context={window:{},document:{getElementById:id=>elements.get(id),createElement:tag=>({tag,dataset:{},style:{},classList:{toggle:()=>{}}}),head:{appendChild:e=>{styles++;elements.set(e.id,e);}}},$:selector=>elements.get(selector.slice(1)),catalogCat458:'all',catalogMode458:'fav',catalogQuery458:'old',catalogDetailId458:'old',renderCatalogCats458:()=>{},renderBuildCatalog458:()=>{renders++;},waterfrontTool018:id=>['lifeboatHeritageHall018','canalTollhouseExhibit018'].includes(id),toolSize458:function(arg){lastSizeArg=arg;lastSizeThis=this;return typeof arg==='string'&&arg.endsWith('018')?2:1;}};
vm.createContext(context);new vm.Script(segment).runInContext(context);
context.renderBuildCatalog458();assert.equal(styles,1);assert(attrs.has('data-quarter-catalog-fit019'));assert.equal(host.scrollTop,83);
const css=elements.get('quarterCatalogStyle019').textContent;assert(css.includes('grid-template-columns:minmax(0,1fr)'));assert(css.includes('.catalogSheet458>*{min-width:0;max-width:100%}'));assert(css.split('}').filter(Boolean).every(rule=>rule.startsWith('#buildCatalog458[data-quarter-catalog-fit019] ')));
context.quarterEnterCollection019();assert.equal(host.scrollTop,0);assert.equal(search.value,'');assert.equal(context.catalogCat458,'waterfront019');assert.equal(context.catalogMode458,'all');assert.equal(context.catalogQuery458,'');assert.equal(context.catalogDetailId458,'');assert.equal(renders,2);
host.scrollTop=71;context.renderBuildCatalog458();assert.equal(host.scrollTop,71,'favorite/search rerenders must preserve user scroll');assert.equal(styles,1);
context.window.__noWaterfrontCatalogFit019=true;context.quarterEnterCollection019();assert.equal(host.scrollTop,71);assert(!attrs.has('data-quarter-catalog-fit019'));
context.window.__noWaterfrontCatalogFit019=false;context.renderBuildCatalog458();assert(attrs.has('data-quarter-catalog-fit019'));assert.equal(host.scrollTop,71);
context.renderCatalogCats458();assert.equal(cats.button.onclick,context.quarterEnterCollection019);assert.equal(cats.button.dataset.quarterCollection019,'1');
for(const id of['lifeboatHeritageHall018','canalTollhouseExhibit018']){assert.equal(context.toolSize458({id}),2);assert.equal(lastSizeArg,id);assert.equal(context.toolSize458(id),2);}
const oldObject={id:'park',nativeField:'untouched'},receiver={};assert.equal(context.toolSize458.call(receiver,oldObject),1);assert.equal(lastSizeArg,oldObject);assert.equal(lastSizeThis,receiver);for(const x of[undefined,null,7,'park']){context.toolSize458(x);assert.equal(lastSizeArg,x);}
assert(!/scrollIntoView|scrollLeft\s*=|scrollTo\(/.test(segment));assert(!/scrollIntoView/.test(quarterBoxUI019.toString()));assert(runner.includes('legacy portrait to landscape control exposes retained scroll clipping the notice'));assert(runner.includes('corrected-after-native-category-swipe'));assert(runner.includes('all16 tools are fully reachable'));
const box=(left,top,width,height)=>({left,top,right:left+width,bottom:top+height,width,height,clientLeft:0,clientTop:0,clientWidth:width,clientHeight:height,scrollLeft:0,scrollTop:0,scrollWidth:width,scrollHeight:height});
const halls=['lifeboatHeritageHall018','canalTollhouseExhibit018'],q={viewport:{left:0,top:0,right:390,bottom:844},sheet:box(0,102,390,742),header:box(8,114,374,36),title:box(8,114,130,20),close:box(346,114,36,36),search:box(8,158,374,40),mode:box(8,206,374,34),categoryWrapper:box(8,248,374,44),categories:box(8,248,374,44),results:box(8,300,374,534),notice:box(8,300,374,96),noticeText:'訪客是展館營運的視覺呈現。',noticeTextRects:[box(20,332,340,16)],cards:Array.from({length:16},(_,i)=>({id:halls[i]||'path'+i,size:i<2?'2×2':'1×1',box:box(8+(i%2)*190,400+Math.floor(i/2)*110,184,104)}))};
assert.deepEqual(quarterCatalogBounds019(q),{fits:true,headerFits:true,horizontalFailures:[],cardFailures:[],noticeReadable:true,truthfulSizes:true});
let rejected=0;for(const mutate of[r=>{r.header.left=-45;r.title.left=-45;},r=>{r.cards[0].box.left=-45;},r=>{r.cards[1].box.right=431;},r=>{r.sheet.scrollWidth=445;},r=>{r.sheet.scrollLeft=55;},r=>{r.sheet.scrollTop=10;},r=>{r.categoryWrapper.right=450;},r=>{r.close.right=405;},r=>{r.results.scrollWidth=436;}]){const bad=structuredClone(q);mutate(bad);assert(!quarterCatalogBounds019(bad).fits);rejected++;}
for(const mutate of[r=>{r.notice.top=260;},r=>{r.noticeTextRects[0].top=290;},r=>{r.noticeTextRects=[];}]){const bad=structuredClone(q);mutate(bad);assert(!quarterCatalogBounds019(bad).noticeReadable);rejected++;}
for(const mutate of[r=>{r.cards[0].size='1×1';},r=>{r.cards[5].size='2×2';},r=>{r.cards.pop();}]){const bad=structuredClone(q);mutate(bad);assert(!quarterCatalogBounds019(bad).truthfulSizes);rejected++;}
// A clipped ancestor invalidates a target even when it has positive width and
// the document itself does not overflow. Only its designated scrollport moves.
let xOffset=0,yOffset=0;const sheet={...box(0,100,390,744),parentElement:null,getBoundingClientRect(){return box(0,100,390,744);}},scroller={...box(8,300,374,200),parentElement:sheet,contains:e=>e===target,getBoundingClientRect(){return box(8,300,374,200);},get scrollTop(){return yOffset;},set scrollTop(v){yOffset=v;},get scrollLeft(){return xOffset;},set scrollLeft(v){xOffset=v;}};
const target={parentElement:scroller,contains:e=>e===target,getBoundingClientRect:()=>box(8-xOffset,650-yOffset,180,100)};
const doc={querySelector:s=>s==='#catalogResults458'?scroller:target,elementFromPoint:()=>target};
const evaluate=(selector,scroll)=>new vm.Script('('+quarterBoxUI019.toString()+')('+JSON.stringify(selector)+','+JSON.stringify(scroll)+')').runInNewContext({document:doc,innerWidth:390,innerHeight:844,getComputedStyle:e=>({overflowX:'hidden',overflowY:e===scroller?'auto':'hidden'})});
assert(!evaluate('.target',null).visible);assert.equal(yOffset,0);const reveal=evaluate('.target','#catalogResults458');assert(reveal.fullyVisible&&reveal.tappable);assert.equal(yOffset,250);assert.equal(xOffset,0);assert.equal(sheet.scrollTop,0);assert.equal(sheet.scrollLeft,0);assert.throws(()=>evaluate('.target','.catalogSheet458'),/Undesignated/);
doc.elementFromPoint=()=>({});assert(!evaluate('.target',null).tappable);
console.log(JSON.stringify({ok:true,sourceOnly:true,gameOrPainterExecuted:false,catalogEntryOnlyReset:true,escapeRestoresLegacyLayout:true,hallObjectSizeNormalization:true,rejectedGeometryMutations:rejected,ancestorClipAndHitTest:true,designatedScrollerOnly:true}));

// Broken legacy UI teardown must not require its deliberately clipped close
// target. Corrected acceptance retains full hit-tested touch requirements.
const legacySection=runner.split('// Actual negative control:')[1].split("await ev('window.__noWaterfrontCatalogFit019=false')")[0];
assert(legacySection.includes("const legacyClose=await box('#catalogClose458')"));
assert(legacySection.includes("Input.dispatchKeyEvent"));assert(legacySection.includes("key:'Escape'"));assert(!legacySection.includes("touchTarget('#catalogClose458')"));
const correctedSection=runner.split("await ev('window.__noWaterfrontCatalogFit019=false')")[1];
assert(correctedSection.includes("touchTarget('#catalogClose458')"));assert(correctedSection.includes('corrected-reopen-after-close'));
assert(!correctedSection.includes('Input.dispatchKeyEvent'));assert(!/\.scrollIntoView\s*\(/.test(correctedSection));
assert(correctedSection.includes('actual category reset swipe reaches its start without buying'));
assert(!/scrollLeft\s*=(?!=)|scrollTop\s*=(?!=)/.test(correctedSection));
console.log(JSON.stringify({ok:true,sourceOnly:true,legacyCleanupNativeEscapeOnly:true,correctedAcceptanceStillStrictTouch:true,categoryResetActualTouch:true}));
