'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('wave047 native pairs run on GitHub Actions only');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {withGame,ROOT}=require('./harness.js'),BASE='182150fae37c7d95aee352ec6f901316668ad91b',file=path.join(ROOT,'index.html'),head=fs.readFileSync(file),originalBase=cp.execFileSync('git',['show',BASE+':index.html'],{maxBuffer:20*1024*1024}),OUT=path.join(ROOT,'shots','wave047','normal-pairs');
// Candidate contract: no version-label normalization or save-field exclusion.
// Release must use a separately pinned exact three-label contract.
const baseRelease={ver:'14.65',anchor:'T772'},headRelease={...baseRelease},labelPairs=[];
const frozenLabels=["const GAME_VER='14.65';","const GAME_ANCHOR='T772';",'id="startVersion456">v14.65 · T772</span>'];
function candidateLabels(text){for(const label of frozenLabels)assert.equal(text.split(label).length,2,'normal047 exact frozen candidate label '+label);}
candidateLabels(originalBase.toString());candidateLabels(head.toString());
let labelRed;try{candidateLabels(head.toString().replace("const GAME_VER='14.65';","const GAME_VER='14.66';"));}catch(e){labelRed=e.message.split('\n')[0];}assert(labelRed?.startsWith('normal047 exact frozen candidate label'),'normal047 real version-label first RED');candidateLabels(head.toString());
const base=originalBase,sourceHash=x=>crypto.createHash('sha256').update(x).digest('hex');
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex'),canon=x=>Array.isArray(x)?x.map(canon):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canon(x[k])])):x;
function pair047(useNew){
  const out=[],controls=[];
  for(const seed of[31,71,103]){
    GV.setDiff(3);GV.newWorldSeeded(seed);GV.setSpeed(0);if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
    const find=()=>{for(let y=4;y<66;y+=3)for(let x=4;x<66;x+=3)if(GV.placePreview459('landmark',x,y)?.ok){let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear)return{x,y};}throw Error('normal047 legal native lot');};
    const placements=[];
    for(let i=0;i<3;i++){
      const p=find(),quote=GV.placePreview459('landmark',p.x,p.y).cost,before=GV.devMoney516B();
      if(useNew&&!GV.britishWave047.select(['spindlefruit','tansymill','campionbarn'][i]))throw Error('normal047 appearance selection');
      if(!GV.placeUndo('landmark',p.x,p.y))throw Error('normal047 actual paid placement');
      const b=GV.tile(p.x,p.y)?.bld,spent=before-GV.devMoney516B();if(spent!==quote||spent<=0)throw Error('normal047 native fee');placements.push({...p,v:b.v,spent});
    }
    GV.selectTool434('pan');const checkpoints=[];
    for(const ticks of[0,1,3]){if(ticks)GV.step(ticks);GV.save();checkpoints.push({ticks,state:JSON.parse(GV.rawSave()),stats:GV.stats()});}
    if(useNew){
      const cash=GV.devMoney516B();GV.capabilitySetMoney506(cash-1);GV.save();const damaged=JSON.parse(GV.rawSave());
      GV.capabilitySetMoney506(cash);GV.save();const restored=JSON.parse(GV.rawSave());
      controls.push({seed,original:checkpoints.at(-1).state,damaged,restored});
    }
    out.push({seed,placements,checkpoints});
  }
  const early=out[0].checkpoints[0].state,key='glimmerville.v1.s3.sandbox516b';
  localStorage.setItem(key,JSON.stringify(early));if(!GV.load())throw Error('normal047 original pre-update constructor load');GV.save();
  const bootstrap={input:early,output:JSON.parse(GV.rawSave())};
  // Match the failing native job's ten paid lots and real undo/redo/ref actions
  // on the independent BASE too. The earlier three-lot fixture did not reproduce
  // that particular lazy policy state, and is retained as separate evidence.
  GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const tenRows=useNew?GV.britishWave047.rows():Array.from({length:10},()=>null),tenLots=[];
  for(let j=0;j<10;j++){
    let p;for(let y=4;y<66&&!p;y+=3)for(let x=4;x<66;x+=3)if(GV.placePreview459('landmark',x,y)?.ok){let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear){p={x,y};break;}}
    if(!p)throw Error('normal047 matched transaction lot');if(useNew){if(!GV.britishWave047.select(tenRows[j].id))throw Error('normal047 matched appearance');}else GV.selectTool434('landmark');
    if(!GV.placeUndo('landmark',p.x,p.y)||!GV.undo()||!GV.redo()||!GV.placeUndo('doze',p.x+1,p.y+1)||!GV.undo())throw Error('normal047 matched native transaction sequence');tenLots.push(p);
  }
  const last=tenLots.at(-1);if(!GV.undo()||!GV.redo()||!GV.placeUndo('doze',last.x+1,last.y+1)||!GV.undo())throw Error('normal047 matched final ref transaction');
  const save=()=>{GV.save();return JSON.parse(GV.rawSave());},preUpdate=save();GV.step(1);const afterStep=save();
  document.getElementById('bAI').click();const options=document.querySelector('[data-mtab470="options"]');if(!options)throw Error('normal047 real native mayor options');options.click();document.getElementById('infoX').click();const initialized=save();
  if(initialized.aim!==afterStep.aim||initialized.money!==afterStep.money||initialized.day!==afterStep.day)throw Error('normal047 read-only mayor view changed AI, money or day');
  const loaded=[];for(let j=0;j<2;j++){if(!GV.load())throw Error('normal047 initialized native load');loaded.push(save());}
  return{pairs:out,controls,bootstrap,tenTransactions:{lots:tenLots,preUpdate,afterStep,initialized,loaded}};
}
async function run(source,useNew){
  fs.writeFileSync(file,source);
  const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125',log:console.log},async({cdp})=>{const data=await cdp.evalJs('('+pair047.toString()+')('+useNew+')');if(cdp.errors.length)throw Error(cdp.errors.join('; '));return data;});
  assert(r.ok&&r.result,'normal047 native session: '+r.fails.join('; '));return r.result;
}
// A structural comparison includes every serialized field. Only root b.v on the
// actual paid lots may differ. Every other field, including gameVer, is exact.
function compare(a,b,allowedVariants){
  const changed=[];
  function walk(x,y,p=''){
    if(JSON.stringify(canon(x))===JSON.stringify(canon(y)))return;
    if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))walk(x[k],y[k],p?p+'.'+k:k);return;}
    if(allowedVariants.has(p)){assert(Number.isInteger(x)&&x>=0&&x<=2,'normal047 BASE native variant');assert.equal(y,allowedVariants.get(p),'normal047 exact authored variant');changed.push({path:p,base:x,head:y});return;}
    assert.fail('normal047 complete native model differs at '+p+': '+JSON.stringify(x)+' -> '+JSON.stringify(y));
  }
  walk(a,b);return changed;
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});let a,b;
  let controls,baseBootstrap,headBootstrap,baseTen,headTen;
  fs.writeFileSync(path.join(OUT,'base-source-provenance.json'),JSON.stringify({source:BASE,originalSHA256:sourceHash(originalBase),declaredSHA256:sourceHash(base),originalRelease:baseRelease,declaredRelease:headRelease,onlySourceChanges:labelPairs,allModelSourceExact:true,stateNormalization:false,fieldExclusions:[]},null,2)+'\n');
  try{const raw=await run(originalBase,false);fs.writeFileSync(path.join(OUT,'original-main-complete-pairs.json'),JSON.stringify(raw,null,2)+'\n');const ar=base.equals(originalBase)?raw:await run(base,false),br=await run(head,true);a=ar.pairs;b=br.pairs;controls=br.controls;baseBootstrap=ar.bootstrap;headBootstrap=br.bootstrap;baseTen=ar.tenTransactions;headTen=br.tenTransactions;}finally{fs.writeFileSync(file,head);}
  const pairs=[],allowed=[];
  for(let i=0;i<a.length;i++){
    assert.equal(a[i].seed,b[i].seed);const av=new Map();
    // Derive allowed paths from independently known native serialized roots;
    // no financial, history, backlog, cursor or other state is excluded.
    const expected=[880,892,900];
    const baseline=structuredClone(a[i]),next=structuredClone(b[i]);
    for(let j=0;j<3;j++){assert.deepEqual({...baseline.placements[j],v:expected[j]},next.placements[j]);av.set('placements.'+j+'.v',expected[j]);}
    for(let c=0;c<next.checkpoints.length;c++){
      const state=next.checkpoints[c].state,roots=state.bl;
      assert(Array.isArray(roots),'normal047 original bl array serialization');
      for(let j=0;j<3;j++){
        const p=next.placements[j],root=p.y*state.n+p.x,at=roots.findIndex(q=>q[0]===root);
        assert(at>=0,'normal047 actual paid root serialized');assert.equal(roots[at][1],24);assert.equal(roots[at][3],expected[j]);
        av.set('checkpoints.'+c+'.state.bl.'+at+'.3',expected[j]);
      }
    }
    const differences=compare(baseline,next,av);allowed.push(av);pairs.push({seed:a[i].seed,baseSHA256:hash(canon(a[i])),headSHA256:hash(canon(b[i])),differences,checkpoints:a[i].checkpoints.length});
  }
  const negative=[];assert.equal(controls.length,3,'normal047 three actual live-source fault fixtures');
  for(const c of controls){
    let first;try{compare(c.original,c.damaged,new Map());}catch(e){first=e.message;}
    assert(first?.startsWith('normal047 complete native model differs at money:'),'normal047 actual native money corruption first RED');
    compare(c.original,c.restored,new Map());negative.push({seed:c.seed,name:'actual native money API removes one dollar then native save',first,restoredGreen:true});
    fs.writeFileSync(path.join(OUT,'native-fault-'+c.seed+'.json'),JSON.stringify(c,null,2)+'\n');
  }
  const bootstrapAllowed=new Map();for(let j=0;j<3;j++){const p=b[0].placements[j],index=p.y*headBootstrap.input.n+p.x;for(const side of['input','output']){const at=headBootstrap[side].bl.findIndex(q=>q[0]===index);assert(at>=0);bootstrapAllowed.set(side+'.bl.'+at+'.3',[880,892,900][j]);}}
  const bootstrapDifferences=compare(baseBootstrap,headBootstrap,bootstrapAllowed);
  const changedTop=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>JSON.stringify(canon(a[k]))!==JSON.stringify(canon(b[k])));
  const earlyFields={base:changedTop(baseBootstrap.input,baseBootstrap.output),head:changedTop(headBootstrap.input,headBootstrap.output)};
  assert.deepEqual(earlyFields.base,earlyFields.head,'normal047 native constructor bootstrap fields match original BASE');
  fs.writeFileSync(path.join(OUT,'constructor-base.json'),JSON.stringify(baseBootstrap,null,2)+'\n');fs.writeFileSync(path.join(OUT,'constructor-head.json'),JSON.stringify(headBootstrap,null,2)+'\n');
  const tenAllowed=new Map();for(const prefix of['preUpdate','afterStep','initialized','loaded.0','loaded.1']){
    const state=prefix.startsWith('loaded')?headTen.loaded[+prefix.split('.')[1]]:headTen[prefix];
    for(let j=0;j<10;j++){const p=headTen.lots[j],root=p.y*state.n+p.x,at=state.bl.findIndex(q=>q[0]===root);assert(at>=0);assert.equal(state.bl[at][3],880+j*4);tenAllowed.set(prefix+'.bl.'+at+'.3',880+j*4);}
  }
  const tenDifferences=compare(baseTen,headTen,tenAllowed);
  fs.writeFileSync(path.join(OUT,'ten-transactions-base.json'),JSON.stringify(baseTen,null,2)+'\n');fs.writeFileSync(path.join(OUT,'ten-transactions-head.json'),JSON.stringify(headTen,null,2)+'\n');
  const stability=[];
  for(const [source,side]of[['BASE',baseTen],['HEAD',headTen]])for(let pass=0;pass<side.loaded.length;pass++){
    try{compare(side.initialized,side.loaded[pass],new Map());stability.push({source,pass:pass+1,ok:true,differences:[]});}
    catch(e){stability.push({source,pass:pass+1,ok:false,fields:changedTop(side.initialized,side.loaded[pass]),first:e.message});}
  }
  fs.writeFileSync(path.join(OUT,'ten-transaction-stability.json'),JSON.stringify({head:process.env.GITHUB_SHA,base:BASE,baseHeadDifferences:tenDifferences,stability,fieldExclusions:[]},null,2)+'\n');
  console.log('normal047 TEN_TRANSACTION_STABILITY '+JSON.stringify(stability));
  assert(stability.every(q=>q.ok),'normal047 complete native save fields remain RED: '+stability.filter(q=>!q.ok).map(q=>q.source+'/'+q.pass+' '+q.fields.join(',')).join('; '));
  const report={head:process.env.GITHUB_SHA,base:BASE,pairs,negative,constructorBootstrap:{earlyFields,baseHeadDifferences:bootstrapDifferences,note:'The three-lot early fixture is separate from the matched ten-lot transaction fixture; no bootstrap change is assumed.'},tenTransactions:{forms:10,baseHeadDifferences:tenDifferences,nativeFirstUpdate:{base:changedTop(baseTen.preUpdate,baseTen.afterStep),head:changedTop(headTen.preUpdate,headTen.afterStep)},nativeMayorOptionsRead:{base:changedTop(baseTen.afterStep,baseTen.initialized),head:changedTop(headTen.afterStep,headTen.initialized)},completeStableRounds:2,fieldExclusions:[]},fieldExclusions:[],nativeGameplay:true,usesEscapeValve:false};
  fs.writeFileSync(path.join(OUT,'manifest-normal-pairs.json'),JSON.stringify(report,null,2)+'\n');console.log('normal047 GREEN '+JSON.stringify(report));
})().catch(e=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'failure.json'),JSON.stringify({head:process.env.GITHUB_SHA,action:'normal native BASE-HEAD proof',error:e.stack},null,2)+'\n');console.error(e.stack);process.exitCode=1;});
