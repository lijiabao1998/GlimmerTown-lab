/* GPT-021 paired save oracle. Evidence-only pure comparators.
 * No game/source/storage mutations, browser launch or server access.
 * Load this file in Node, or inject it into the parent's disposable QA page.
 * Results describe supplied snapshots; they do not assert that a game ran.
 */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PairedSaveOracle021=api;
})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const RLE_FIELDS=Object.freeze(['ter','tre','rd','zn','dc','rn','rc','rcl','wp','el','bs','cm','sk','dt','skd','dtd','rl','rb','dk','ow','tl','pm','bln','tr','of','fl','le','ab','ctr','cmd','hvl471','ugc471','wmn472','smn472','lvl475','udl475','fly475','ix475']);
  const CORE_STATS=Object.freeze(['money','pop','jobs','day','buildings','poweredBld','roads','zones','happy','dem','cars','fires','ruins','weather','buses']);
  const BASE_SAVE_FIELDS=Object.freeze(['v','n','gameVer','seed','money','day','msIdx','cam','ter','tre','rd','zn','dc','rn','rc','rcl','wp','el','bs','cm','sk','dt','skd','dtd','cmd','bl','ach','nm','ln','star','rl','rb','dk','ow','tl','pm','bln','tr','of','fl','le','ab','pol','region','ctr','hvl471','ugc471','wmn472','smn472','lvl475','udl475','fly475','ix475','df','hi','nl','bus_rt','bop468','rln463','tln463','riot','plague','sc','rk','sup','aim','aiR','gds','sb','cev','mln','sf','rdep']);
  const OPTIONAL_SAVE_FIELDS=Object.freeze(['waterfront018','fuel364','shipCount','shipProgress','steel364','tech343','cms385','spec386','aiv470','pwr471','wtr472','h488','c490','i493','ops501','am502','j503','p504','s505','cap506','inn507','gpn508','mob509','bal510','dev512','gov513','obs514','fiscal515']);
  const NATIVE_SAVE_FIELDS=Object.freeze([...BASE_SAVE_FIELDS,...OPTIONAL_SAVE_FIELDS]);
  const PROTECTED_KEYS=Object.freeze([
    'glimmerville.v1',
    'glimmerville.v1.s1','glimmerville.v1.s1_bak',
    'glimmerville.v1.s2','glimmerville.v1.s2_bak',
    'glimmerville.v1.s1.sandbox516b','glimmerville.v1.s1.sandbox516b_bak',
    'glimmerville.v1.s2.sandbox516b','glimmerville.v1.s2.sandbox516b_bak'
  ]);
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const clone=v=>JSON.parse(JSON.stringify(v));
  function parsed(raw){
    if(typeof raw==='string')return JSON.parse(raw);
    if(raw&&typeof raw==='object'&&!Array.isArray(raw))return clone(raw);
    throw Error('A real JSON save string or parsed save object is required');
  }
  // Exact T312 codec copied from the reviewed native source. Comparisons never
  // normalize BL variants, optional tails, default values or unknown save fields.
  function rleDec(s){
    if(typeof s!=='string'||!s||s.indexOf('*')<0)return s;
    let o='',i=0;
    while(i<s.length){
      if(s[i]==='*'){
        const j=s.indexOf(',',i+1);
        if(j<0){o+=s.slice(i);break;}
        const n=+s.slice(i+1,j);
        o+=s[j+1].repeat(n>0?n:0);i=j+2;
      }else{o+=s[i];i++;}
    }
    return o;
  }
  function rleEnc(s){
    if(typeof s!=='string'||!s)return s;
    let o='',i=0;
    while(i<s.length){
      const c=s.charCodeAt(i);let n=1;
      while(i+n<s.length&&s.charCodeAt(i+n)===c&&n<99999)n++;
      o+=(n>3)?('*'+n+','+s[i]):s.substr(i,n);
      i+=n;
    }
    return o;
  }
  function inflate(raw){
    const d=parsed(raw);
    if(d&&d.z===1){for(const f of RLE_FIELDS)if(typeof d[f]==='string')d[f]=rleDec(d[f]);delete d.z;}
    return d;
  }
  function deflate(raw){
    const d=parsed(raw);
    for(const f of RLE_FIELDS)if(typeof d[f]==='string')d[f]=rleEnc(d[f]);
    d.z=1;return d;
  }
  function brief(v){
    if(v===undefined)return {type:'absent'};
    if(typeof v==='string')return {type:'string',length:v.length,preview:v.slice(0,64)};
    if(Array.isArray(v))return {type:'array',length:v.length};
    if(v&&typeof v==='object')return {type:'object',keys:Object.keys(v)};
    return {type:typeof v,value:v};
  }
  function diff(a,b,path='$',limit=200){
    let total=0;const differences=[];
    const add=(p,x,y,reason)=>{
      total++;if(differences.length>=limit)return;
      const q={path:p,reason,left:brief(x),right:brief(y)};
      if(typeof x==='string'&&typeof y==='string'){
        let i=0;while(i<Math.min(x.length,y.length)&&x[i]===y[i])i++;
        q.firstDifferentCharacter=i;q.leftContext=x.slice(Math.max(0,i-12),i+24);q.rightContext=y.slice(Math.max(0,i-12),i+24);
      }
      differences.push(q);
    };
    function walk(x,y,p){
      if(Object.is(x,y))return;
      if(Array.isArray(x)&&Array.isArray(y)){
        if(x.length!==y.length)add(p+'.length',x.length,y.length,'array length');
        for(let i=0;i<Math.max(x.length,y.length);i++){
          if(own(x,i)!==own(y,i))add(p+'['+i+']',x[i],y[i],'array entry presence');
          else walk(x[i],y[i],p+'['+i+']');
        }
        return;
      }
      if(x&&y&&typeof x==='object'&&typeof y==='object'&&!Array.isArray(x)&&!Array.isArray(y)){
        for(const k of [...new Set([...Object.keys(x),...Object.keys(y)])].sort()){
          if(own(x,k)!==own(y,k))add(p+'.'+k,x[k],y[k],'object property presence');
          else walk(x[k],y[k],p+'.'+k);
        }
        return;
      }
      add(p,x,y,'exact value/type');
    }
    walk(a,b,path);
    return {equal:total===0,total,shown:differences.length,truncated:total>differences.length,differences};
  }
  function withoutArt(d){const o=Object.create(null);for(const k of Object.keys(d))if(k!=='art021')o[k]=d[k];return o;}
  function validateInflated(d,allRle){
    if(d.v!==1)throw Error('Native v1 save required');
    const n=+d.n||72;
    if(!Number.isInteger(n)||n<1||typeof d.ter!=='string'||d.ter.length!==n*n)throw Error('Native terrain/size validation failed');
    if(!Array.isArray(d.bl))throw Error('Native BL array required');
    for(const b of d.bl)if(!Array.isArray(b)||b.length<5||!Number.isInteger(b[0])||b[0]<0||b[0]>=n*n)throw Error('Invalid native BL root tuple');
    if(allRle)for(const f of RLE_FIELDS)if(typeof d[f]!=='string'||d[f].length!==n*n)throw Error('Post-save RLE field missing/wrong length: '+f);
    return n;
  }
  function compareNativeSave(leftRaw,rightRaw,options={}){
    const le=parsed(leftRaw),re=parsed(rightRaw),ld=inflate(le),rd=inflate(re);
    const ln=validateInflated(ld,options.requireAllRleFields!==false),rn=validateInflated(rd,options.requireAllRleFields!==false);
    if(options.requireBaseFields!==false)for(const f of BASE_SAVE_FIELDS)if(!own(ld,f)||!own(rd,f))throw Error('Post-save native base field missing: '+f);
    const native=diff(withoutArt(ld),withoutArt(rd),'$native',options.limit||200);
    const bl=diff(ld.bl,rd.bl,'$BL',options.limit||200);
    const rle={decoded:[],encoded:[]};
    for(const f of RLE_FIELDS){
      rle.decoded.push({field:f,...diff(ld[f],rd[f],'$RLEdecoded.'+f,4)});
      rle.encoded.push({field:f,...diff(le[f],re[f],'$RLEencoded.'+f,4)});
    }
    const transport=diff(le.z,re.z,'$transport.z',4),art=diff(le.art021,re.art021,'$art021',options.limit||200);
    const encodedEqual=transport.equal&&rle.encoded.every(q=>q.equal);
    const requireEncoding=options.requireEncoding!==false,requireArt=options.requireArtMetadata===true;
    const result={
      ok:native.equal&&bl.equal&&rle.decoded.every(q=>q.equal)&&(!requireEncoding||encodedEqual)&&(!requireArt||art.equal),
      nativeFieldNames:[...new Set([...NATIVE_SAVE_FIELDS,...Object.keys(withoutArt(ld)),...Object.keys(withoutArt(rd))])].sort(),
      nativeFields:[...new Set([...NATIVE_SAVE_FIELDS,...Object.keys(withoutArt(ld)),...Object.keys(withoutArt(rd))])].sort().map(field=>({field,presentLeft:own(ld,field),presentRight:own(rd,field),...diff(ld[field],rd[field],'$native.'+field,options.limit||200)})),
      sparseFieldsAbsentInBoth:OPTIONAL_SAVE_FIELDS.filter(field=>!own(ld,field)&&!own(rd,field)),
      nativeFieldSet:diff(Object.keys(withoutArt(ld)).sort(),Object.keys(withoutArt(rd)).sort(),'$nativeFieldSet',200),
      native,bl,rle,transport,art,n:[ln,rn],
      rawBytesEqual:typeof leftRaw==='string'&&typeof rightRaw==='string'?leftRaw===rightRaw:null,
      exclusions:{visualTopField:'art021',transportDecoded:'z',BLColumns:[],otherNativeFields:[]},
      requirements:{requireEncoding,requireArtMetadata:requireArt},
      fullSuppliedDataCompared:true
    };
    result.firstFailure=!bl.equal?{category:'BL',...bl.differences[0]}:!native.equal?{category:'native-save',...native.differences[0]}:!encodedEqual&&requireEncoding?{category:'RLE-encoding',detail:!transport.equal?transport.differences[0]:rle.encoded.find(q=>!q.equal).differences[0]}:!art.equal&&requireArt?{category:'visual-metadata',...art.differences[0]}:null;
    return result;
  }
  function statsSchema(s){
    if(!s||typeof s!=='object'||Array.isArray(s))throw Error('Actual GV.stats snapshot required');
    const keys=Object.keys(s).sort();if(!diff(keys,CORE_STATS.slice().sort()).equal)throw Error('Exactly all fifteen native GV.stats fields are required');
    for(const f of CORE_STATS)if(f!=='dem'&&(typeof s[f]!=='number'||!Number.isFinite(s[f])))throw Error('Native finite numeric stat required: '+f);
    if(!s.dem||typeof s.dem!=='object'||!diff(Object.keys(s.dem).sort(),['1','2','3']).equal||Object.values(s.dem).some(v=>typeof v!=='number'||!Number.isFinite(v)))throw Error('All three finite native demand fields are required');
  }
  function compareCoreStats(a,b,options={}){
    statsSchema(a);statsSchema(b);
    const fields=CORE_STATS.map(field=>({field,...diff(a[field],b[field],'$stats.'+field,options.limit||200)}));
    return {ok:fields.every(q=>q.equal),count:CORE_STATS.length,fields,firstFailure:fields.find(q=>!q.equal)?.differences[0]||null,tolerance:0};
  }
  function compareCheckpointPair(on,off,options={}){
    if(!on||!off||typeof on.raw!=='string'||typeof off.raw!=='string')throw Error('Full raw native save evidence is required in both checkpoints');
    for(const s of [on,off])if(!s.phase||typeof s.phase.kind!=='string'||!s.phase.kind||s.phase.bootDone!==true||s.phase.migrationComplete!==true||s.phase.running!==false||s.phase.day!==s.stats?.day||s.phase.day!==parsed(s.raw).day)throw Error('Matched fully booted, migrated, paused native checkpoint phase required');
    const save=compareNativeSave(on.raw,off.raw,{...options,requireArtMetadata:options.requireArtMetadata!==false});
    const stats=compareCoreStats(on.stats,off.stats,options);
    const required=options.requiredVehicleFamilies||['cars'],vehicles=required.map(f=>{
      const a=f==='cars'||f==='buses'?on.stats[f]:on.vehicles?.[f],b=f==='cars'||f==='buses'?off.stats[f]:off.vehicles?.[f];
      return {family:f,on:a,off:b,nonempty:Number.isInteger(a)&&a>0&&Number.isInteger(b)&&b>0,equal:Object.is(a,b)};
    });
    const requireNonempty=options.requireNonemptyVehicles!==false,phase=diff(on.phase,off.phase,'$phase',40);
    return {ok:save.ok&&stats.ok&&phase.equal&&(!requireNonempty||vehicles.every(v=>v.nonempty&&v.equal)),save,stats,vehicles,phase,requireNonemptyVehicles:requireNonempty,
      firstFailure:save.firstFailure||(!stats.ok?{category:'core-stats',...stats.firstFailure}:!phase.equal?{category:'phase',...phase.differences[0]}:requireNonempty&&vehicles.some(v=>!v.nonempty||!v.equal)?{category:'nonempty-vehicles',detail:vehicles.find(v=>!v.nonempty||!v.equal)}:null),
      requiresRawArtifactRetention:true,gameWasRunByThisComparator:false};
  }
  function inspectFixture(raw){
    const d=inflate(raw),n=validateInflated(d,false),counts={};
    for(const r of d.bl)counts[r[1]]=(counts[r[1]]||0)+1;
    return {n,seed:d.seed,day:d.day,rank:d.rk,money:d.money,nativeFieldNames:Object.keys(withoutArt(d)).sort(),rootCount:d.bl.length,
      rootCountsByK:counts,artMetadataPresent:own(d,'art021'),artMetadataEntries:Array.isArray(d.art021)?d.art021.length:null,
      farm53:d.bl.filter(r=>r[1]===53),stations:d.bl.filter(r=>[17,55,139].includes(r[1])),
      railRoutes:d.rln463,tramRoutes:d.tln463,busRoutes:d.bus_rt,metroLines:d.mln,
      runtimeVehicleCountKnown:false,actorSerialization:'Cars/buses/trains/ships are not stored as runtime actor arrays; a raw save cannot prove nonempty actors.'};
  }
  function malformedMetadataCases(raw){
    const d=inflate(raw),n=validateInflated(d,false),root=d.bl[0]?.[0]??0;
    const cases=[
      ['absent',undefined],['null',null],['number',123],['string','office'],['object',{entries:[]}],
      ['bad-entry-shapes',[null,1,'office',{},[],[root,'b']]],
      ['invalid-indices',[[-1,'b','industry'],[n*n,'b','industry'],[1.5,'b','industry'],[String(root),'b','industry']]],
      ['invalid-kinds',[[root,'x','industry'],[root,'zombie','office']]],
      ['invalid-profile-types',[[root,'b',null],[root,'b',42],[root,'b',{}]]],
      ['unknown-profiles',[[root,'b','not-a-profile021'],[root,'z','not-a-profile021']]],
      ['wrong-known-carrier',[[d.bl.find(r=>r[1]!==276)?.[0]??root,'b','UKU021-S']]],
      ['entry-length-four',[[root,'b','not-a-profile021','extra']]],
      ['over-whole-field-bound',Array.from({length:2*n*n+1},()=>[root,'b','not-a-profile021'])]
    ];
    return cases.map(([name,value])=>{const out=clone(d);if(value===undefined)delete out.art021;else out.art021=value;return {name,raw:JSON.stringify(deflate(out)),expectedAcceptedMetadata:[],expectedNativeUnchanged:true,normalNativeLoadRequired:true};});
  }
  function compareProtectedStorage(before,after,audit={}){
    if(!before||!after||audit.disposableProfile!==true)throw Error('Disposable fixture storage snapshots and explicit profile provenance required');
    const entries=PROTECTED_KEYS.map(key=>({key,nonemptyBefore:typeof before[key]==='string'&&before[key].length>0,
      unchanged:Object.is(before[key],after[key]),beforeLength:before[key]?.length??null,afterLength:after[key]?.length??null}));
    const attempts=Array.isArray(audit.protectedWriteAttempts)?audit.protectedWriteAttempts:[];
    return {ok:entries.every(q=>q.nonemptyBefore&&q.unchanged)&&attempts.length===0&&audit.selectorBefore==='3'&&audit.selectorAfter==='3',
      entries,protectedWriteAttempts:attempts,selector:[audit.selectorBefore,audit.selectorAfter],
      scope:'Native legacy key, slot1/2 and all normal/sandbox backups in an isolated test profile. Boot reads may occur; writes/remove/clear must be blocked and audited.'};
  }
  return Object.freeze({RLE_FIELDS,CORE_STATS,BASE_SAVE_FIELDS,OPTIONAL_SAVE_FIELDS,NATIVE_SAVE_FIELDS,PROTECTED_KEYS,rleDec,rleEnc,inflate,deflate,diff,compareNativeSave,compareCoreStats,compareCheckpointPair,inspectFixture,malformedMetadataCases,compareProtectedStorage});
});

if(typeof module==='object'&&module.exports&&typeof require==='function'&&require.main===module){
  const fs=require('fs'),assert=require('assert'),O=module.exports;
  const args=process.argv.slice(2);
  if(args[0]==='--inspect'){console.log(JSON.stringify(O.inspectFixture(fs.readFileSync(args[1],'utf8')),null,2));}
  else if(args[0]==='--compare'){
    const a=JSON.parse(fs.readFileSync(args[1],'utf8')),b=JSON.parse(fs.readFileSync(args[2],'utf8')),r=O.compareCheckpointPair(a,b);
    console.log(JSON.stringify(r,null,2));if(!r.ok)process.exitCode=1;
  }else if(args[0]==='--selftest'){
    const raw=fs.readFileSync(args[1],'utf8'),d=O.inflate(raw),a=JSON.stringify(O.deflate(d));
    assert(O.compareNativeSave(a,a).ok);
    assert.strictEqual(O.rleEnc('01111'),'0*4,1');assert.strictEqual(O.rleDec('0*4,1'),'01111');
    const badBl=O.inflate(a);badBl.bl[0][3]++;
    const blResult=O.compareNativeSave(a,JSON.stringify(O.deflate(badBl)));assert(!blResult.ok);assert.strictEqual(blResult.firstFailure.category,'BL');
    const badRle=O.inflate(a);badRle.ter=(badRle.ter[0]==='2'?'1':'2')+badRle.ter.slice(1);
    const rleResult=O.compareNativeSave(a,JSON.stringify(O.deflate(badRle)));assert(!rleResult.ok);
    const noncanonical=JSON.parse(a);noncanonical.ter=d.ter;const encodingResult=O.compareNativeSave(a,JSON.stringify(noncanonical));assert(!encodingResult.ok);assert.strictEqual(encodingResult.firstFailure.category,'RLE-encoding');
    const extra=O.inflate(a);extra.unrecognizedNativeChannel021={enabled:1};assert(!O.compareNativeSave(a,JSON.stringify(O.deflate(extra))).ok);
    const stats=Object.fromEntries(O.CORE_STATS.map(k=>[k,k==='dem'?{1:.5,2:.2,3:.1}:k==='day'?d.day:1])),stats2=JSON.parse(JSON.stringify(stats));stats2.jobs++;
    assert(!O.compareCoreStats(stats,stats2).ok);
    const checkpoint={raw:a,stats,phase:{kind:'synthetic-comparator-selftest',day:d.day,bootDone:true,migrationComplete:true,running:false}};
    assert(O.compareCheckpointPair(checkpoint,checkpoint).ok);
    const empty={...checkpoint,stats:{...stats,cars:0}};assert(!O.compareCheckpointPair(empty,empty).ok);
    assert.strictEqual(O.malformedMetadataCases(a).length,13);
    const storage=Object.fromEntries(O.PROTECTED_KEYS.map(k=>[k,'nonempty-disposable-sentinel']));
    const audit={disposableProfile:true,selectorBefore:'3',selectorAfter:'3',protectedWriteAttempts:[]};
    assert(O.compareProtectedStorage(storage,storage,audit).ok);
    const changed={...storage,'glimmerville.v1.s1_bak':'changed'};assert(!O.compareProtectedStorage(storage,changed,audit).ok);
    console.log(JSON.stringify({ok:true,kind:'Pure comparator/source-independent fault effectiveness selftest',nativeSaveFields:O.NATIVE_SAVE_FIELDS.length,RLEFields:O.RLE_FIELDS.length,coreStats:O.CORE_STATS.length,malformedCases:13,BLVariantFaultCaught:true,terrainFaultCaught:true,noncanonicalRLEEncodingFaultCaught:true,unknownNativeFieldFaultCaught:true,jobsFaultCaught:true,emptyVehiclesRejected:true,nonemptyBackupFaultCaught:true,gameAcceptance:false,browser:false},null,2));
  }else{console.error('Usage: --inspect save.json | --compare on-checkpoint.json off-checkpoint.json | --selftest save.json');process.exitCode=2;}
}
