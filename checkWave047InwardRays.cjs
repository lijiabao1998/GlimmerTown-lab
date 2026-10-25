'use strict';
// Finite source-only intersection proof. Never invokes Scene, triangle raster,
// Canvas, pixel loops, game, Chrome, fingerprints or image construction.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const crypto=require('crypto'),cp=require('child_process');
const BASE='46fd34314e82efa176d5b45140421753da6ee039';
const OLD='cx=16,cy=22,zc=4.4,r=11.5,inner=10.85,n=24,m=12';
const NEXT='cx=16,cy=22,zc=9.4,r=11.5,inner=10.85,n=24,m=12';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const clone=x=>JSON.parse(JSON.stringify(x));
const near=(a,b,e=1e-7)=>Math.abs(a-b)<e;
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function replaceOne(s,a,b){assert.equal(s.split(a).length,2,'unique exact source replacement');return s.replace(a,b);}
function makeChecker(repo){
  const cwd=process.cwd();process.chdir(repo);
  const H=require(path.join(repo,'wave047-geometry-harness.cjs'));process.chdir(cwd);
  const primitive=fs.readFileSync(path.join(repo,'british-complex-primitives014.js'),'utf8');
  const start=primitive.indexOf('    function beam(a,b,c,width) {'),end=primitive.indexOf('    function face(',start);
  assert(start>=0&&end>start,'native finite beam function source');
  const beamSource=primitive.slice(start,end).trim();
  const ps=primitive.indexOf('    function project(p) {'),pe=primitive.indexOf('    function triangle(',ps);
  assert(ps>=0&&pe>ps,'native projection definition source');
  const projectSource=primitive.slice(ps,pe).trim();
  assert(primitive.includes('if(z<depth[k]-.000001)continue;'),'native larger-depth-wins rule unchanged');
  assert(primitive.includes('A[2]*u+B[2]*v+D[2]*t+(bias||0)'),'native affine triangle depth interpolation unchanged');
  assert(primitive.includes('for(let i=1;i<points.length-1;i++)triangle(points[0],points[i],points[i+1],material,bias);'),'native finite triangle fan unchanged');
  function project(view){return vm.runInNewContext('('+projectSource+')',{view,size:32,ax:80,oy:130});}
  function capture(source,view){
    const before=H.traces.length;
    const box={BritishUseScalesKit021:{create:H.kit},__wave047GeometryOnly:true};
    Object.defineProperty(box,'document',{get(){throw Error('Canvas/game access forbidden');}});
    vm.runInNewContext(source,box,{filename:'recording-only-cavity-source.js'});
    box.BritishWaveArchitecture047.build('vervainrecital',view);
    assert.equal(H.traces.length,before+1,'one recording trace only');
    const t=clone(H.traces[before]),surfaces=t.polygons.map((q,index)=>({q,index,kind:'poly'}));
    const record=(q)=>surfaces.push({q:clone(q),index:surfaces.length,kind:'beam'});
    const boxPoly=(x0,x1,y0,y1,z0,z1)=>{
      for(const[a,b]of[[[x0,y0],[x1,y0]],[[x0,y1],[x1,y1]],[[x0,y0],[x0,y1]],[[x1,y0],[x1,y1]]])record([[...a,z0],[...b,z0],[...b,z1],[...a,z1]]);
      record([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]]);
    };
    // Execute only the exact native solid-beam construction using recording poly.
    // It creates finite world polygons, not projected samples or pixels.
    const beam=vm.runInNewContext('('+beamSource+')',{poly:record,box:boxPoly});
    for(const[a,b,width]of t.beams)beam(a,b,0,width);
    return {surfaces,polygonCount:t.polygons.length,beamCount:t.beams.length};
  }
  function classify(s,zc){
    if(s.kind==='beam')return 'solid-beam';
    const q=s.q,rad=p=>Math.hypot(p[0]-16,p[1]-22);
    if(q.every(p=>near(p[2],1.2)))return 'stage-top';
    if(q.length===4&&q.every(p=>near(rad(p),10.85))&&near(Math.min(...q.map(p=>p[2])),.6)&&near(Math.max(...q.map(p=>p[2])),zc))return 'rear-inner-wall';
    if(q.every(p=>p[2]>=zc-1e-7&&near(Math.hypot(p[0]-16,p[1]-22,p[2]-zc),10.85)))return 'inner-hemisphere';
    if(q.every(p=>near(p[1],22))&&Math.max(...q.map(p=>p[2]))>zc)return 'front-mouth-plane';
    return 'other-real-surface';
  }
  function intersection(origin,direction,tri){
    const[a,b,c]=tri,e1=sub(b,a),e2=sub(c,a),h=cross(direction,e2),det=dot(e1,h);
    if(Math.abs(det)<1e-10)return null;
    const f=1/det,s=sub(origin,a),u=f*dot(s,h),q=cross(s,e1),v=f*dot(direction,q),t=f*dot(e2,q);
    if(u< -1e-8||v< -1e-8||u+v>1+1e-8||t< -1e-8)return null;
    return {t,point:origin.map((x,i)=>x+t*direction[i]),weights:[1-u-v,u,v]};
  }
  function ray(trace,origin,direction,zc,view){
    const all=[],proj=project(view),O=proj(origin);
    for(const s of trace.surfaces)for(let i=1;i<s.q.length-1;i++){
      const tri=[s.q[0],s.q[i],s.q[i+1]],h=intersection(origin,direction,tri);if(!h)continue;
      const p=proj(h.point),depth=tri.reduce((a,v,j)=>a+proj(v)[2]*h.weights[j],0);
      assert(near(p[0],O[0])&&near(p[1],O[1]),'actual triangle hit stays on one native projected ray');
      assert(near(depth,p[2]),'native affine triangle depth equals actual world hit depth');
      assert(near(depth,O[2]-6*h.t),'native depth decreases strictly by six per inward ray unit');
      all.push({...h,depth,surfaceIndex:s.index,kind:classify(s,zc),triangle:tri});
    }
    all.sort((a,b)=>a.t-b.t);
    assert(all.length,'finite ray meets actual recorded geometry');
    const first=all[0],max=Math.max(...all.map(h=>h.depth));
    assert(near(first.depth,max),'native greater-depth winner is nearest actual surface, not draw-order inversion');
    return {origin,direction,first,subsequentKinds:[...new Set(all.slice(1).map(h=>h.kind))]};
  }
  // Explicit finite witnesses avoid the existing central pole/rib bundle. That
  // bundle is separately reported below, rather than silently excluded as floor.
  const sampleSpec=[14,15,17,18].flatMap(x=>[9.4,9.6].map(aboveSpring=>({x,aboveSpring})));
  function check(source,zc=9.4,expect='rear-inner-wall',mutation){
    const results=[];
    for(const view of[0,3]){
      const trace=capture(source,view);if(mutation)mutation(trace,zc);
      const direction=view===0?[-1,-1,-2]:[1,-1,-2],rays=[];
      for(const spec of sampleSpec){
        const mouth=[view===0?spec.x:32-spec.x,22,zc+spec.aboveSpring];
        assert((mouth[0]-16)**2+spec.aboveSpring**2<10.85**2,'finite test ray enters inside actual front arch');
        // Start one unit in front of the mouth; an inserted front panel is hit.
        const origin=mouth.map((x,i)=>x-direction[i]);
        const out=ray(trace,origin,direction,zc,view);
        assert.equal(out.first.kind,expect,'selected finite front ray must first meet '+expect+' / view '+view+' / x '+mouth[0]+' / z '+mouth[2]);
        assert(out.first.t>1.01,'selected ray has real open depth beyond the mouth');
        rays.push({...out,mouth});
      }
      results.push({view,polygonCount:trace.polygonCount,beamCount:trace.beamCount,expandedSurfaceCount:trace.surfaces.length,rays});
    }
    return results;
  }
  return {check,capture,ray,classify,primitiveSHA256:sha(primitive),beamSourceSHA256:sha(beamSource)};
}
function run(repo,candidatePath){
  repo=path.resolve(repo);const baseline=cp.execFileSync('git',['show',BASE+':british-wave19-art047.js'],{cwd:repo,encoding:'utf8'});
  const candidate=fs.readFileSync(candidatePath?path.resolve(candidatePath):path.join(repo,'british-wave19-art047.js'),'utf8');
  assert.equal(replaceOne(require('./wave047-inward-repair-contract.cjs').restore(candidate),NEXT,OLD),baseline,'candidate is exactly sole approved springline value change from official C5');
  const C=makeChecker(repo),positive=C.check(candidate),old=C.check(baseline,4.4,'stage-top');
  const centerBeamDiagnostics=[];
  for(const [name,source,zc]of[['C5',baseline,4.4],['candidate',candidate,9.4]])for(const view of[0,3]){
    const trace=C.capture(source,view),d=view===0?[-1,-1,-2]:[1,-1,-2],mouth=[16,22,zc+9.6],o=mouth.map((x,i)=>x-d[i]);
    const hit=C.ray(trace,o,d,zc,view);assert.equal(hit.first.kind,'solid-beam','existing central pole/rib bundle is honestly retained in finite-ray diagnosis');
    centerBeamDiagnostics.push({name,view,mouth,...hit});
  }
  const fixtures=[
    {name:'restore-low-springline',source:baseline,zc:4.4,actual:'stage-top',pattern:/^selected finite front ray must first meet rear-inner-wall \/ view 0 \/ x 14 \/ z 13\.8\n/},
    {name:'raise-real-stage-top',mutation:t=>{for(const s of t.surfaces)if(s.q.every(p=>near(p[2],1.2)))for(const p of s.q)p[2]=6.2;},actual:'other-real-surface',pattern:/^selected finite front ray must first meet rear-inner-wall \/ view 0 \/ x 14 \/ z 18\.8\n/},
    {name:'fill-real-mouth-with-opaque-panel',mutation:t=>t.surfaces.push({index:t.surfaces.length,kind:'poly',q:[[5.2,22,1.2],[26.8,22,1.2],[26.8,22,20.3],[5.2,22,20.3]]}),actual:'front-mouth-plane',pattern:/^selected finite front ray must first meet rear-inner-wall \/ view 0 \/ x 14 \/ z 18\.8\n/},
    {name:'remove-real-inner-rear-wall',mutation:(t,zc)=>{t.surfaces=t.surfaces.filter(s=>C.classify(s,zc)!=='rear-inner-wall');},actual:'other-real-surface',pattern:/^selected finite front ray must first meet rear-inner-wall \/ view 0 \/ x 14 \/ z 18\.8\n/}
  ],negative=[];
  for(const f of fixtures){let error=null;try{C.check(f.source||candidate,f.zc||9.4,'rear-inner-wall',f.mutation);}catch(e){error=e;}assert(error,'negative fixture must fail: '+f.name);assert(f.pattern.test(error.message),'exact first red: '+f.name+' / '+error.message);assert.equal(error.actual,f.actual,'exact wrong first surface for '+f.name);assert.equal(error.expected,'rear-inner-wall','exact failed surface requirement for '+f.name);C.check(candidate);negative.push({name:f.name,firstFailure:error.message,actualWrongSurface:error.actual,expectedFailure:f.pattern.source,restored:true});}
  return {ok:true,kind:'finite-actual-triangle-and-native-solid-beam-source-proof',baselineCommit:BASE,baselineArtSHA256:sha(baseline),candidateArtSHA256:sha(candidate),candidateKind:'actual current or explicitly supplied committed-model source',nativePrimitiveSHA256:C.primitiveSHA256,nativeBeamFunctionSHA256:C.beamSourceSHA256,rayCount:positive.reduce((n,r)=>n+r.rays.length,0),frontViews:[0,3],positive,baseline:old,centerBeamDiagnostics,negativeControls:negative,centerThresholds:{floorRadius:10.75,innerWallRadius:10.85,lastStageHitMouthZ:1.2+Math.SQRT2*10.75,rearWallHitAboveFloorMouthZ:1.2+Math.SQRT2*10.85,c5InnerCrown:4.4+10.85,candidateInnerCrown:9.4+10.85},gameExecuted:false,rasterizerExecuted:false,visualAcceptance:false,limitations:['Finite sixteen geometric ray witnesses, not a pixel map, coverage percentage or native visual acceptance.','The ideal center floor/wall boundary excludes existing pole/rib solids; central rays can first hit the existing solid-beam bundle. Four actual central-ray diagnostics are included, and are NOT miscounted as floor-to-wall witnesses.','Compared rays use the same horizontal mouth position and height above each actual springline; raising the arch moves these homologous rays upward.','Nearest candidate hit for the sixteen witness rays is the real curved rear inner wall, not central hemisphere soffit.','The original finite upper hemisphere is restricted to z at/above the springline; full-sphere roots below it are not physical hits.','Native beam solid geometry is included through its actual finite construction function; the native triangle raster and Scene are never invoked.','Official candidate original PNGs remain required; no material or global renderer change is proposed.']};
}
module.exports={makeChecker,run};
if(require.main===module){const out=run(process.argv[2]||process.cwd(),process.argv[3]);const dest=path.join(path.resolve(process.argv[2]||process.cwd()),'shots','wave047','source-inward-rays.json');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({ok:out.ok,rayCount:out.rayCount,negativeControls:out.negativeControls.length,candidateArtSHA256:out.candidateArtSHA256,visualAcceptance:false,result:dest}));}
