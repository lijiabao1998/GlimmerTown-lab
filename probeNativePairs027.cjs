'use strict';
if(!process.env.GITHUB_ACTIONS)throw Error('wave027 native pairs run on GitHub Actions only');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {withGame,ROOT}=require('./harness.js'),BASE='58130eae1f5451a5f56142b5fab7b003b910155e',file=path.join(ROOT,'index.html'),head=fs.readFileSync(file),base=cp.execFileSync('git',['show',BASE+':index.html'],{maxBuffer:20*1024*1024}),OUT=path.join(ROOT,'shots','wave027','normal-pairs');
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex'),canon=x=>Array.isArray(x)?x.map(canon):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canon(x[k])])):x;
function pair027(useNew){
  const out=[],controls=[];
  for(const seed of[31,71,103]){
    GV.setDiff(3);GV.newWorldSeeded(seed);GV.setSpeed(0);if(!GV.dev516B().sandbox)GV.enterSandbox516B();GV.setGod516B(true);GV.setOverride516B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
    const find=()=>{for(let y=4;y<66;y+=3)for(let x=4;x<66;x+=3)if(GV.placePreview459('landmark',x,y)?.ok){let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear)return{x,y};}throw Error('normal027 legal native lot');};
    const placements=[];
    for(let i=0;i<3;i++){
      const p=find(),quote=GV.placePreview459('landmark',p.x,p.y).cost,before=GV.devMoney516B();
      if(useNew&&!GV.britishWave027.select(['croydon','campden','blackpool'][i]))throw Error('normal027 appearance selection');
      if(!GV.placeUndo('landmark',p.x,p.y))throw Error('normal027 actual paid placement');
      const b=GV.tile(p.x,p.y)?.bld,spent=before-GV.devMoney516B();if(spent!==quote||spent<=0)throw Error('normal027 native fee');placements.push({...p,v:b.v,spent});
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
  localStorage.setItem(key,JSON.stringify(early));if(!GV.load())throw Error('normal027 original pre-update constructor load');GV.save();
  return{pairs:out,controls,bootstrap:{input:early,output:JSON.parse(GV.rawSave())}};
}
async function run(source,useNew){
  fs.writeFileSync(file,source);
  const r=await withGame({port:8199,fresh:true,timeout:300,preScript:'window.confirm=()=>true;Math.random=()=>.125',log:console.log},async({cdp})=>{const data=await cdp.evalJs('('+pair027.toString()+')('+useNew+')');if(cdp.errors.length)throw Error(cdp.errors.join('; '));return data;});
  assert(r.ok&&r.result,'normal027 native session: '+r.fails.join('; '));return r.result;
}
// A structural comparison includes every serialized field. Only root b.v on the
// three actual paid lots and the committed writer declaration may differ.
function compare(a,b,allowedVariants){
  const changed=[];
  function walk(x,y,p=''){
    if(JSON.stringify(canon(x))===JSON.stringify(canon(y)))return;
    if(x&&y&&typeof x==='object'&&typeof y==='object'){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))walk(x[k],y[k],p?p+'.'+k:k);return;}
    if(p.endsWith('.gameVer')){assert.equal(y,head.toString().match(/^const GAME_VER='(\d+\.\d{2})';/m)[1],'normal027 exact declared gameVer');changed.push({path:p,base:x,head:y});return;}
    if(allowedVariants.has(p)){assert(Number.isInteger(x)&&x>=0&&x<=2,'normal027 BASE native variant');assert.equal(y,allowedVariants.get(p),'normal027 exact authored variant');changed.push({path:p,base:x,head:y});return;}
    assert.fail('normal027 complete native model differs at '+p+': '+JSON.stringify(x)+' -> '+JSON.stringify(y));
  }
  walk(a,b);return changed;
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});let a,b;
  let controls,baseBootstrap,headBootstrap;
  try{const ar=await run(base,false),br=await run(head,true);a=ar.pairs;b=br.pairs;controls=br.controls;baseBootstrap=ar.bootstrap;headBootstrap=br.bootstrap;}finally{fs.writeFileSync(file,head);}
  const pairs=[],allowed=[];
  for(let i=0;i<a.length;i++){
    assert.equal(a[i].seed,b[i].seed);const av=new Map();
    // Derive allowed paths from independently known native serialized roots;
    // no financial, history, backlog, cursor or other state is excluded.
    const expected=[200,212,236];
    const baseline=structuredClone(a[i]),next=structuredClone(b[i]);
    for(let j=0;j<3;j++){assert.deepEqual({...baseline.placements[j],v:expected[j]},next.placements[j]);av.set('placements.'+j+'.v',expected[j]);}
    for(let c=0;c<next.checkpoints.length;c++){
      const state=next.checkpoints[c].state,roots=state.bl;
      assert(Array.isArray(roots),'normal027 original bl array serialization');
      for(let j=0;j<3;j++){
        const p=next.placements[j],root=p.y*state.n+p.x,at=roots.findIndex(q=>q[0]===root);
        assert(at>=0,'normal027 actual paid root serialized');assert.equal(roots[at][1],24);assert.equal(roots[at][3],expected[j]);
        av.set('checkpoints.'+c+'.state.bl.'+at+'.3',expected[j]);
      }
    }
    const differences=compare(baseline,next,av);allowed.push(av);pairs.push({seed:a[i].seed,baseSHA256:hash(canon(a[i])),headSHA256:hash(canon(b[i])),differences,checkpoints:a[i].checkpoints.length});
  }
  const negative=[];assert.equal(controls.length,3,'normal027 three actual live-source fault fixtures');
  for(const c of controls){
    let first;try{compare(c.original,c.damaged,new Map());}catch(e){first=e.message;}
    assert(first?.startsWith('normal027 complete native model differs at money:'),'normal027 actual native money corruption first RED');
    compare(c.original,c.restored,new Map());negative.push({seed:c.seed,name:'actual native money API removes one dollar then native save',first,restoredGreen:true});
    fs.writeFileSync(path.join(OUT,'native-fault-'+c.seed+'.json'),JSON.stringify(c,null,2)+'\n');
  }
  const bootstrapAllowed=new Map();for(let j=0;j<3;j++){const p=b[0].placements[j],index=p.y*headBootstrap.input.n+p.x;for(const side of['input','output']){const at=headBootstrap[side].bl.findIndex(q=>q[0]===index);assert(at>=0);bootstrapAllowed.set(side+'.bl.'+at+'.3',[200,212,236][j]);}}
  const bootstrapDifferences=compare(baseBootstrap,headBootstrap,bootstrapAllowed);
  const changedTop=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>JSON.stringify(canon(a[k]))!==JSON.stringify(canon(b[k])));
  const earlyFields={base:changedTop(baseBootstrap.input,baseBootstrap.output),head:changedTop(headBootstrap.input,headBootstrap.output)};
  assert.deepEqual(earlyFields.base,earlyFields.head,'normal027 native constructor bootstrap fields match original BASE');
  fs.writeFileSync(path.join(OUT,'constructor-base.json'),JSON.stringify(baseBootstrap,null,2)+'\n');fs.writeFileSync(path.join(OUT,'constructor-head.json'),JSON.stringify(headBootstrap,null,2)+'\n');
  const report={head:process.env.GITHUB_SHA,base:BASE,pairs,negative,constructorBootstrap:{earlyFields,baseHeadDifferences:bootstrapDifferences,note:'An untouched pre-first-update constructor bootstraps native optional policy/governance/innovation fields on load on both sources. Stable new-appearance roundtrip uses one actual native simulation step before its first reference save.'},fieldExclusions:[],nativeGameplay:true,usesEscapeValve:false};
  fs.writeFileSync(path.join(OUT,'manifest-normal-pairs.json'),JSON.stringify(report,null,2)+'\n');console.log('normal027 GREEN '+JSON.stringify(report));
})().catch(e=>{fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'failure.json'),JSON.stringify({head:process.env.GITHUB_SHA,action:'normal native BASE-HEAD proof',error:e.stack},null,2)+'\n');console.error(e.stack);process.exitCode=1;});
