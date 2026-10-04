/* GPT-006 residential registry/helpers. Embedded inside the game IIFE.
   Permanent IDs never alias prior sprites or simulation identities. */
const RESIDENTIAL006=Object.freeze(Object.fromEntries(RESIDENTIAL_SPEC_ROWS006.map(q=>[q.k,Object.freeze({...q,we:1})])));
const RESIDENTIAL_TOOL006=Object.freeze(Object.fromEntries(Object.values(RESIDENTIAL006).map(q=>[q.id,q])));
function residentialKind006(k){return Object.prototype.hasOwnProperty.call(RESIDENTIAL006,k);}
function housingKind006(k){return [1,127,33,105,219].includes(k)||residentialKind006(k);}
function residentialCommerce006(k){return !!RESIDENTIAL006[k]?.jobs;}
function residentialBuilt006(b){return !!(b&&!b.ref&&residentialKind006(b.k)&&b.age>=9);}
function residentialOperational006(root,b){return !!(residentialBuilt006(b)&&b.pw&&b.wa&&britishRoad004(root)&&!b.fire&&!b.sick&&!b.death&&!b.abandoned&&!b.riot&&!b.plague);}
function residentialEnterpriseK006(k){return residentialCommerce006(k)?220:k;}
function refreshResidentialUtilities006(){
  for(const root of tickBld||[]){const b=tiles[root]?.bld;if(!b||b.ref||!residentialKind006(b.k))continue;
    b.pw=!!(!powerLegacy450()&&POWER_ROOT_OK471[root]===1);
    b.wa=!!(b.pw&&!waterLegacy449()&&WATER_ROOT_STATE472[root]>=2&&WATER_ROOT_DELIVERED472[root]>0);
  }
}
function residentialRetailUnits006(){let n=0;for(const root of tickBld||[]){const b=tiles[root]?.bld;if(!b||!residentialCommerce006(b.k)||!residentialOperational006(root,b))continue;const e=enterpriseRootInfo489(root);if(e?.k===b.k)n+=Math.max(0,e.employed||0)/JOBSC[2];}return n;}
function residentialTaxes006(i,b,pm,civicMul,freightTaxMul,goodsMul284,commerceSalesMul481){
  if(!residentialOperational006(i,b))return {residential:0,commercial:0};
  const q=RESIDENTIAL006[b.k],landTaxMul=1+(LAND[i]-128)/128*.15;
  const residential=residentPopulation488(i,b)*.12*(pm.taxR||1)*WEALTH_TAX[q.we]*landTaxMul*civicMul;
  if(!q.jobs)return {residential,commercial:0};
  const rc=getMaxRoadClass(i%N,(i/N)|0,1);
  let mult=(1+rc*.08)*(COV.bus[i]>0?1.1:1)*(COV.post[i]>0?1.15:1)*((COV.parking&&COV.parking[i]>0)?1.1:1)*((COV.bank&&COV.bank[i]>0)?1.08:1)*((COV.freight&&COV.freight[i]>0)?1.05:1);
  if(COV.freight&&COV.freight[i]>0)mult*=freightTaxMul;
  if(tourists>0)mult*=1+Math.min(.2,tourists/500)*(pm.tourPromo?1.1:1);
  if(pm.nightMarket)mult*=nightCity487.ready?nightCity487.commerce.taxMul:1.06;
  const commercial=q.jobs*.18*mult*(pm.taxC||1)*(pm.ecoReg?.95:1)*civicMul*goodsMul284*commerceSalesMul481*tq('A3',1.04,1)*tq('A6',1.05,1)*tq('B4b',1.05,1)*tq('C3',1.03,1)*tq('D3',1.04,1)*sq('hub',1.03,1)*enterpriseTaxFactor489(i);
  return {residential,commercial};
}
function residentialDescription006(q){return q.sz+'×'+q.sz+' 固定英式住宅｜容量 '+q.capacity+' 人｜'+(q.band==='low'?'低密度':'中密度')+'住房市場。九天竣工後需道路、實際供電與供水；不自動升級或合併。'+(q.jobs?'樓上住家＋街角商店：'+q.jobs+' 名目商業職位；有效職位、購物與商業稅依供貨、基建及勞工結算。':'')+'無額外市政維護費。';}
function residentialInspect006(root,b){const q=RESIDENTIAL006[b.k],on=residentialOperational006(root,b);return '<h3>🏘️ '+q.nm+'</h3><div class="row">'+q.en+'</div><div class="row">居民 '+residentPopulation488(root,b)+' / 容量 '+q.capacity+' 人｜'+(q.band==='low'?'低密度':'中密度')+'入住 '+Math.round(housingOccupancy488(q.band)*100)+'%｜幸福 '+Math.round((b.h||0)*100)+'%</div><div class="row">'+(b.age<9?'施工中：'+Math.floor(b.age)+'/9 天':on?'居住基建就緒':'離線：需道路、供電與供水且無災害')+'</div>'+(q.jobs?'<div class="row">名目商業職位 '+q.jobs+'｜有效 '+Math.round(on?enterpriseActualJobs489(root,b,'positions'):0)+'｜已就業 '+(on?enterpriseActualJobs489(root,b,'employed'):0).toFixed(1)+'</div>':'')+'<div class="row">'+residentialDescription006(q)+'</div>';}
function canPlaceResidential006(q,x,y){if(window.__noResidential006)return '英式住宅暫停新增';if(!toolUnlocked458(toolMeta434(q.id)))return '城市 Lv.'+q.rank+' 解鎖';const err=canPlaceMulti(x,y,q.sz,'需 '+q.sz+'×'+q.sz+' 陸地');if(err)return err;for(let dy=0;dy<q.sz;dy++)for(let dx=0;dx<q.sz;dx++)if(T(idx(x+dx,y+dy)).crater)return '隕石坑需先剷除';return null;}
function installResidentialArt006(){const t0=performance.now(),list=window.ResidentialArchitecture006.buildAll(),seen=new Set();for(const s of list){const q=Object.values(RESIDENTIAL006).find(q=>q.art===s.id);if(!q||seen.has(q.k))throw Error('Invalid residential art identity '+s.id);seen.add(q.k);SPR.bld[q.k+'_1_0']=Object.assign(s,{smoke:[],__residential006:1,__t479:1,__t547:{k:q.k,lv:1,v:0,bw:q.sz,bh:q.sz}});}if(seen.size!==16)throw Error('Sixteen residential assets required');window.__residentialArt006={count:list.length,ms:performance.now()-t0};}
