/* GPT-021 production integration, inside the native game closure.
 * Geometry comes from the approved d389104 modules. No sprite registry,
 * simulation identity, capacity, native variant or RNG is replaced.
 */
const USE021_ROWS = /* generated native mappings */ __USE021_ROWS__;
const USE021_CACHE = new Map();
let use021Selection = null;
function use021Modules(){return [window.BritishUseScales021,window.BritishUseScalesHospitality021,window.BritishUseScalesWorkplaces021,window.BritishUseScalesAgriculture021,window.BritishUseScalesInfrastructure021];}
function use021Spec(id){for(const m of use021Modules()){const s=m.specs.find(s=>s.id===id);if(s)return {m,s};}return null;}
function use021Profile(q){return q.mode==='block'?(q.k===2?'office':'industry'):q.k===23?'ranch':q.id;}
function use021ValidProfile(p,k,zone,office){
  if(p==='office')return k===2&&!!office;
  if(p==='industry')return k===3;
  if(p==='ranch')return k===23;
  const q=USE021_ROWS.find(q=>q.id===p);return !!q&&q.mode!=='block'&&q.k===k&&q.k!==23;
}
function use021Placed(toolId,x,y){
  const t=T(idx(x,y)),q=use021Selection&&USE021_ROWS.find(q=>q.id===use021Selection);
  if(['zr','zc','zi','office','doze'].includes(toolId))delete t.zoneArt021;
  if(!q||q.tool!==toolId)return;
  if(q.mode==='block'){
    const p=use021Profile(q);
    if(t.zone===(q.k===2?2:3)&&(q.k!==2||t.office))t.zoneArt021=p;
  }else if(t.bld&&!t.bld.ref&&t.bld.k===q.k)t.bld.art021=use021Profile(q);
}
function use021Born(t){if(t.bld&&use021ValidProfile(t.zoneArt021,t.bld.k,t.zone,t.office))t.bld.art021=t.zoneArt021;}
// Some native tools (notably station008) finish in their own doPlace wrapper.
// Tag the final successful root before the caller closes its existing undo.
const use021NativePlace=doPlace;
doPlace=function(id,x,y,silent){const ok=use021NativePlace(id,x,y,silent);if(ok)use021Placed(id,x,y);return ok;};
function use021Save(){
  const a=[];for(let i=0;i<tiles.length;i++){
    const t=tiles[i],b=t.bld;
    if(t.zoneArt021&&(t.zoneArt021==='office'?t.zone===2&&t.office:t.zoneArt021==='industry'&&t.zone===3))a.push([i,'z',t.zoneArt021]);
    if(b&&!b.ref&&use021ValidProfile(b.art021,b.k,t.zone,t.office))a.push([i,'b',b.art021]);
  }return a.length?a:undefined;
}
function use021Load(a){
  use021Selection=null;USE021_CACHE.clear();
  for(const t of tiles){delete t.zoneArt021;if(t.bld)delete t.bld.art021;}
  if(!Array.isArray(a)||a.length>2*N*N)return;
  const seen=new Set();
  for(const e of a){
    if(!Array.isArray(e)||e.length!==3||!Number.isInteger(e[0])||e[0]<0||e[0]>=N*N||typeof e[2]!=='string')continue;
    const [i,kind,p]=e,t=tiles[i],b=t.bld,key=i+':'+kind;if(seen.has(key))continue;
    if(kind==='z'&&((p==='office'&&t.zone===2&&t.office)||(p==='industry'&&t.zone===3))){t.zoneArt021=p;seen.add(key);}
    else if(kind==='b'&&b&&!b.ref&&use021ValidProfile(p,b.k,t.zone,t.office)){b.art021=p;seen.add(key);}
  }
}
function use021FarmState(b,x,y,base){
  const state={};if(b.k!==22&&b.k!==53)return state;
  const sea=season(),fk=b.k+'_1_'+b.v;
  state.crop=b.k===22?b.v:1;state.season=0;state.stage=2;
  if(SPR.farmSea?.[sea]?.[fk]===base){state.season=sea;state.stage=sea===3?0:2;}
  if(sea!==3)for(const st of [0,1,2])if(SPR.farmGrow?.[sea]?.[st]?.[fk]===base){state.season=sea;state.stage=st===2?3:st;}
  return state;
}
function use021Authored(q,bw,bh,rot,state,lv,v){
  const turned=q.bw!==q.bh&&bw<bh,view=(rot+(turned?1:0)+(q.k===139&&v===4?1:0))&3;
  const d=blockDims622(bw,bh,rot),key=[q.id,bw,bh,rot,d[0],d[1],lv,v,JSON.stringify(state)].join('|');let s=USE021_CACHE.get(key);if(s)return s;
  const a=use021Spec(q.id).m.build(q.id,view,state);
  // A new object owns its own weather/silhouette/bubble caches. Never inherit
  // old geometry caches. T700 demolition consumes the real native lv/v.
  s={...a,candidate:false,sc:undefined,smoke:[],smoke608:a.smoke608||[],
    __t547:{k:q.k,lv,v,bw:d[0],bh:d[1]},
    __art021:{id:q.id,view,rot,bw,bh,lv,v,state:{...state}}};
  if(q.bw!==q.bh){s.ax+=(view&1?-1:1)*16*(q.bw-q.bh);s.ay-=8*(2*a.sz-q.bw-q.bh);}
  if(q.k===22||q.k===53){
    // World-space paths lie in the authored crop plots, then rotate with the
    // actual art. Legacy sprites continue using their unchanged fallback.
    const E=16*a.sz,project=(x,y)=>{let u=x,w=y;if(view===1){u=E-y;w=x;}else if(view===2){u=E-x;w=E-y;}else if(view===3){u=y;w=E-x;}return [a.w/2+2*u-2*w,a.h-2-2*E+u+w];};
    const plot=q.k===22?[18,23,27,27]:[10,54,34,66],p=project(plot[0],plot[1]),r=project(plot[2],plot[3]);
    s.farmerPath=[...p,...r];s.farmAnchor021=project(q.k===22?23:22,q.k===22?18:60);
    if(q.k===53){const o=project(22,60),ac=project(24,60);s.tractor021={origin:[o[0],o[1]+6],along:[(r[0]-p[0])/2,(r[1]-p[1])/2],across:[ac[0]-o[0],ac[1]-o[1]]};}
  }
  USE021_CACHE.set(key,s);return s;
}
function use021FarmPoint(s,progress,row){const t=s.tractor021,p=s.farmerPath;
  return t?t.origin.map((v,i)=>v+(progress*2-1)*t.along[i]+(row||0)*t.across[i]):[p[0]+(p[2]-p[0])*progress,p[1]+(p[3]-p[1])*progress];}
function use021Resolve(x,y,b,base,bw,bh){
  if(window.__noUseScalesRelease021||!b||b.ref||!b.art021||!base)return base;
  if(b.k===139&&b.age<9)return base; // Keep the native station construction assets and anchors.
  bw=bw||b.sz||1;bh=bh||b.sz||1;const lv=b.lv||1,v=b.v||0,p=b.art021;
  if(b.k===53&&v!==0)return base; // Only the native placed large-farm v0 uses this form; legacy crop variants stay approved.
  if(bw!==bh){const d=blockDims622(bw,bh,viewRotEff()),r=viewRotEff()&1;if(d[0]!== (r?bh:bw)||d[1]!== (r?bw:bh))return base;}
  let q;
  if(p==='office'||p==='industry'){
    for(let dy=0;dy<bh;dy++)for(let dx=0;dx<bw;dx++){
      const t=tiles[idx(x+dx,y+dy)],r=t?.bld;
      if(!r||r.ref||r.k!==b.k||r.art021!==p||(p==='office'&&!t.office))return base;
    }
    q=USE021_ROWS.find(q=>q.mode==='block'&&q.k===b.k&&q.lv===lv&&((q.bw===bw&&q.bh===bh)||(q.bw===bh&&q.bh===bw)));
  }else if(p==='ranch')q=v===0?USE021_ROWS.find(q=>q.k===23&&q.lv===lv):null;
  else q=USE021_ROWS.find(q=>q.id===p&&q.k===b.k&&q.mode!=='block');
  if(!q||q.bw!==bw&&q.mode!=='block'||q.bh!==bh&&q.mode!=='block'||q.k===139&&v!==3&&v!==4)return base;
  return use021Authored(q,bw,bh,viewRotEff(),use021FarmState(b,x,y,base),lv,v);
}
function use021BlockRead(x,y,b,base,w,h){return use021Resolve(x,y,b,base,w,h);}
function use021NativeBase(x,y,b,w,h){
  if(b.k<=3&&(w>1||h>1||!window.__noMass1x1600)){const d=blockDims622(w,h,viewRotEff());return getBlockSprite547(b.k,b.lv||1,d[0],d[1],b.v||0);}
  const fk=b.k+'_1_'+b.v;
  let s=SPR.bld[b.k+'_'+(b.lv||1)+'_'+vdraw574({x,y},b)]||SPR.bld[b.k+'_'+(b.lv||1)+'_'+b.v]||SPR.bld[b.k+'_'+(b.lv||1)+'_0']||SPR.bld[b.k+'_1_'+b.v]||SPR.bld[b.k+'_1_0'];
  if(b.k===22||b.k===53){const sea=season(),hv=cityEvent&&CITY_EVENTS[cityEvent.i]&&['harvest','autumnbounty'].includes(CITY_EVENTS[cityEvent.i].id),st=hv?3:Math.floor(((day+Math.floor(streetHash(x,y,777)*16))%16)/4),gs=st===3?2:st;
    s=SPR.bld[fk]||SPR.bld[b.k+'_1_0'];if(sea===3)s=SPR.farmSea?.[3]?.[fk]||s;else if(st!==2&&SPR.farmGrow?.[sea]?.[gs]?.[fk])s=SPR.farmGrow[sea][gs][fk];else if(sea!==0)s=SPR.farmSea?.[sea]?.[fk]||s;
  }
  s=waterfrontSprite018(b,s);if(!(VARK574.has(b.k)&&vdraw574({x,y},b)!==0))s=metroIndustrySprite516A(b,s);return s;
}
function use021Toolbar(){
  const cats=$('#toolcats');if(!cats||$('#useScalesOpen021'))return;
  const b=document.createElement('button');b.id='useScalesOpen021';b.textContent='🇬🇧 英式建築';b.title='12種用途、36種形制';b.onclick=use021Open;cats.appendChild(b);
  if(mobileBuild434()){
    const mobile=document.createElement('button');mobile.id='useScalesMobile021';mobile.className='tool';mobile.innerHTML='<span class="ic">🇬🇧</span><span>英式</span>';mobile.title='英式建築 · 36款形制';mobile.setAttribute('aria-label',mobile.title);mobile.onclick=use021Open;$('#toolStrip434').prepend(mobile);
  }
  if(use021Selection){const q=use021Spec(use021Selection)?.s;if(q){const tag=document.createElement('span');tag.id='useScalesSelected021';tag.textContent=q.nm;cats.appendChild(tag);}}
}
function use021Select(id){
  const q=USE021_ROWS.find(q=>q.id===id),meta=q&&toolMeta434(q.tool);if(!meta)return false;
  if(!toolUnlocked458(meta)){toast('🔒 '+meta.nm+'：城市 Lv.'+meta.unlockRank+' 解鎖','bad');return false;}
  activateTool434(q.tool,true);use021Selection=id;use021Close();buildToolbar();
  toast(q.mode==='block'?'已選英式分區；樓宇按原生需求與成長形成':q.k===23?'已選牛舍形制；中、大型經原生升級取得':'已選 '+use021Spec(id).s.nm,'gold');return true;
}
function use021Close(){const d=$('#useScalesDialog021');if(d?.open)d.close();}
function use021Open(){
  let d=$('#useScalesDialog021');if(!d){
    d=document.createElement('dialog');d.id='useScalesDialog021';d.setAttribute('aria-labelledby','useScalesTitle021');
    d.innerHTML='<header><h2 id="useScalesTitle021">英式建築 · 36款形制</h2><button id="useScalesClose021" aria-label="關閉英式建築目錄">✕</button></header><p>沿用現有用途、造價與容量。選形制後在城市建造；辦公與工業隨原生分區成長，牛舍中、大型經付費升級取得。</p><div id="useScalesGrid021"></div>';
    document.body.appendChild(d);$('#useScalesClose021').onclick=use021Close;
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)use021Close();}});
  }
  const groups=[['retail','商店'],['dining','餐飲'],['market','市場'],['hotel','旅館'],['office','辦公'],['crafts','作坊'],['lightfactory','輕工廠'],['warehouse','倉庫'],['farm','農業'],['ranch','牛舍'],['passengerstation','客運站'],['freightstation','貨運與配送']];
  $('#useScalesGrid021').innerHTML=groups.map(([group,nm])=>'<section><h3>'+nm+'</h3><div class="useScalesTrio021">'+USE021_ROWS.filter(q=>q.group===group).map(q=>{
    const s=use021Spec(q.id).s,m=toolMeta434(q.tool),locked=!toolUnlocked458(m),size=q.bw+'×'+q.bh;
    const method=q.mode==='block'?'原生分區成長 · Lv'+q.lv:q.k===23?'2×2牛舍 · Lv'+q.lv+(q.lv>1?'付費升級':''):'原生建造 · '+size+'格';
    const limits=q.group==='freightstation'&&q.k===167?'道路配送中心；外觀軌道不增加鐵路調度':q.k===23?'座標原生畜種為牛時採用；其他四種保留':q.mode==='block'?'形制由實際街區大小及樓宇等級決定':q.group==='market'&&q.k!==87?'沿用零售用途，沒有新增食品覆蓋':'';
    return '<button data-use021="'+q.id+'" aria-label="'+s.nm+'"><b>'+({S:'小',M:'中',L:'大'}[q.scale])+' · '+s.nm+'</b><span>'+method+'</span><span>'+((m?.pr)||'依原生分區造價')+(locked?' · Lv'+m.unlockRank+'解鎖':'')+'</span><small>'+limits+'</small></button>';
  }).join('')+'</div></section>').join('');
  d.querySelectorAll('[data-use021]').forEach(b=>b.onclick=()=>use021Select(b.dataset.use021));d.showModal();
}
function use021Selftest(){
  const checks=[],add=(s,ok)=>checks.push([s,!!ok]);
  add('36 unique approved forms / twelve trios',USE021_ROWS.length===36&&new Set(USE021_ROWS.map(q=>q.id)).size===36&&new Set(USE021_ROWS.map(q=>q.group)).size===12);
  add('all native tools exist',USE021_ROWS.every(q=>!!toolMeta434(q.tool)));
  let leak=0,soft=0,crop=0,empty=0,views=0;
  for(const q of USE021_ROWS)for(let rot=0;rot<4;rot++){
    const s=use021Authored(q,q.bw,q.bh,rot,{},q.lv,0),a=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let op=0;
    for(let i=3;i<a.length;i+=4){if(n[i]&&a[i]!==255)leak++;if(a[i]&&a[i]!==255)soft++;if(a[i]){op++;const z=(i-3)/4,x=z%s.w,y=(z/s.w)|0;if(x===0||y===0||x===s.w-1||y===s.h-1)crop++;}}
    if(!op)empty++;if(s.__t547.v!==0||s.__t547.k!==q.k)empty++;views++;
  }
  add('144 true directional sprites',views===144);add('night stays on visible opaque material',leak===0);add('hard pixel edges',soft===0);add('no cropped canvas edges',crop===0);add('visible geometry / true native metadata',empty===0);
  add('unknown profiles rejected',!use021ValidProfile('unknown',240,0,0)&&!use021ValidProfile('UKU021-L',167,0,0));
  return {ok:checks.every(q=>q[1]),checks:checks.map(q=>q[0]+(q[1]?' ✓':' ✗')),pixels:{leak,soft,crop,empty},assets:USE021_CACHE.size};
}
window.GV.useScales021={rows:()=>USE021_ROWS.map(q=>({...q})),select:use021Select,open:use021Open,close:use021Close,selection:()=>use021Selection,resolve:use021Resolve,assets:()=>[...USE021_CACHE.values()],selftest:use021Selftest,
  read:(x,y)=>{const b=T(idx(x,y))?.bld;if(!b||b.ref)return null;const blk=b.k<=3?rciBlockOrigin547(x,y):{w:b.sz||1,h:b.sz||1};if(!blk)return null;return use021Resolve(x,y,b,use021NativeBase(x,y,b,blk.w,blk.h),blk.w,blk.h);},
  profileSave:use021Save,profileLoad:use021Load,upgrade:upgradeBld,activate:activateTool434,smoke:smokeViewSrc626,bubble:bubbleFor607,partition:()=>part639(),world:()=>({n:N,day,money}),farmState:use021FarmState};
