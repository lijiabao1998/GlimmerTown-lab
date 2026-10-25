'use strict';
// Source-only material callback/finite-phase proof. No game, Canvas, raster or pixels.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const crypto=require('crypto'),cp=require('child_process');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const BASE='13ae5404e9e9fd7d6bdb3e2dfcae28a1353a445d';
const OLD='const stageTimber=(x,y,z)=>A.K.mod(x,1.5)<.12?P.woodD:P.woodR;';
const NEXT='const stageTimber=(x,y,z)=>A.K.mod(x,1.5)<.30?P.woodD:P.woodR;';
function replaceOne(source,from,to){assert.equal(source.split(from).length,2,'one exact independently identified source mutation');return source.replace(from,to);}
function makeChecker(repo){
  const cwd=process.cwd();process.chdir(repo);
  const {kit,U}=require(path.join(repo,'wave047-geometry-harness.cjs'));
  process.chdir(cwd);
  const primitiveSource=fs.readFileSync(path.join(repo,'british-complex-primitives014.js'),'utf8');
  const native={};Object.defineProperty(native,'document',{get(){throw Error('Canvas/game access forbidden in source-only material check');}});
  // Defining native primitives exposes the original palette/mod function only.
  // Scene is never invoked; no drawing surface or pixel array is constructed.
  vm.runInNewContext(primitiveSource,native,{filename:'native-primitives-definitions-only.js'});
  const N=native.BritishComplexPrimitives014,P=N.P,mod=N.mod;
  const close=(a,b)=>Math.abs(a-b)<1e-8;
  const point=(j,z)=>[16+10.75*Math.cos(j*Math.PI/24),22-10.75*Math.sin(j*Math.PI/24),z];
  const expected=Array.from({length:24},(_,j)=>({call:'poly',q:[[16,22,1.2],point(j,1.2),point(j+1,1.2)]}));
  expected.push({call:'flat',q:[[5,19,1.2],[27,19,1.2],[27,28,1.2],[5,28,1.2]]});
  function capture(source,view){
    const calls=[];
    function create(spec,v){
      const H=kit(spec,v),rawPoly=H.S.poly,rawFlat=H.S.flat;
      H.P=P;H.K={...H.K,mod};
      H.S.poly=function(q,material,...rest){calls.push({call:'poly',q:q.map(p=>p.slice()),material});return rawPoly(q,material,...rest);};
      H.S.flat=function(x0,x1,y0,y1,z,material,...rest){calls.push({call:'flat',q:[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]],material});return rawFlat(x0,x1,y0,y1,z,material,...rest);};
      return H;
    }
    const box={BritishUseScalesKit021:{create},__wave047GeometryOnly:true};
    Object.defineProperty(box,'document',{get(){throw Error('Canvas/game access forbidden in source-only material check');}});
    vm.runInNewContext(source,box,{filename:'authored-source-recording-stub-only.js'});
    box.BritishWaveArchitecture047.build('vervainrecital',view);
    const floors=expected.map(({q,call})=>{
      const matches=calls.filter(c=>c.call===call&&U.polykey(c.q)===U.polykey(q));
      assert.equal(matches.length,1,'actual horizontal stage floor at fixed z1.2 must be drawn exactly once');
      assert(matches[0].q.every(p=>close(p[2],1.2)),'actual horizontal stage floor at fixed z1.2');
      assert.equal(typeof matches[0].material,'function','actual S.poly/S.flat stage material must be the callback, not a substitute swatch');
      return matches[0];
    });
    assert(floors.every(c=>c.material===floors[0].material),'all actual stage top faces receive the same material callback');
    return floors;
  }
  // Independent algebra of the unchanged 160x196 / sz2 native projection.
  function project(x,y,z,view){let u=x,v=y;if(view===1){u=32-y;v=x;}else if(view===2){u=32-x;v=32-y;}else if(view===3){u=y;v=32-x;}return[80+2*u-2*v,130+u+v-z];}
  function inverse(px,py,z,view){const difference=(px+.5-80)/2,sum=py+.5-130+z,u=(sum+difference)/2,v=(sum-difference)/2;return view===0?[u,v,z]:view===1?[v,32-u,z]:view===2?[32-u,32-v,z]:[32-v,u,z];}
  function inside(point,q){
    const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    for(let i=1;i<q.length-1;i++){const a=q[0],b=q[i],c=q[i+1],d=cross(a,b,c);if(Math.abs(d)<1e-10)continue;const u=cross(point,b,c)/d,v=cross(a,point,c)/d,w=1-u-v;if(Math.min(u,v,w)>-1e-8)return true;}
    return false;
  }
  function phases(floors,view){
    return [{name:'inside-half-round-floor',anchor:[16,16,1.2],faces:floors.slice(0,24)},{name:'projecting-front-stage',anchor:[16,25,1.2],faces:floors.slice(24)}].map(group=>{
      const projected=project(...group.anchor,view),px0=Math.round(projected[0]-.5)-2,py=Math.round(projected[1]-.5),samples=[];
      // Exactly six phase representatives, not an image grid, visibility test,
      // depth buffer, raster, score or rendered-pixel count.
      for(let k=0;k<6;k++){
        const px=px0+k,p=inverse(px,py,1.2,view),again=project(...p,view);
        assert(close(again[0],px+.5)&&close(again[1],py+.5),'independent pixel-center inverse maps back exactly');
        const face=group.faces.find(f=>inside(p,f.q));assert(face,'finite phase point lies inside a real drawn floor polygon');
        const value=face.material(...p);
        samples.push({integerCenterIndex:[px,py],worldPoint:p,modulo1p5:mod(p[0],1.5),materialValue:value});
      }
      return {name:group.name,samples};
    });
  }
  function check(source){
    const results=[];
    for(let view=0;view<4;view++){
      const floors=capture(source,view),groups=phases(floors,view);
      for(const group of groups){
        assert(group.samples.every(s=>s.materialValue===P.woodD||s.materialValue===P.woodR),'actual stage callback returns only the original two opaque timber shades');
        const phases=group.samples.map(s=>Math.round(s.modulo1p5*1000)/1000).sort((a,b)=>a-b);
        assert.deepEqual(phases,view<2?[.225,.475,.725,.975,1.225,1.475]:[.025,.275,.525,.775,1.025,1.275],'six fixed independent native lattice phase classes');
        const colours=new Set(group.samples.map(s=>s.materialValue));
        assert(colours.has(P.woodD)&&colours.has(P.woodR),'both timber shades must be sampled from the actual stage callback in view '+view+' / '+group.name);
        for(const sample of group.samples)assert.equal(sample.materialValue,sample.modulo1p5<.30?P.woodD:P.woodR,'fixed .30 world-x plank classification at every actual sample in view '+view+' / '+group.name);
      }
      results.push({view,actualTopPolygons:floors.length,groups});
    }
    return results;
  }
  return {check,capture,phases,P,primitiveSourceSHA256:sha(primitiveSource)};
}
function run(repo,candidatePath){
  repo=path.resolve(repo);const readGit=f=>cp.execFileSync('git',['show',BASE+':'+f],{cwd:repo,encoding:'utf8'});
  const c4=readGit('british-wave19-art047.js');candidatePath=candidatePath||path.join(repo,'british-wave19-art047.js');const candidate=fs.readFileSync(candidatePath,'utf8');
  assert.equal(replaceOne(candidate,NEXT,OLD),c4,'candidate source is exactly the single approved seam-width line from official C4');
  const checker=makeChecker(repo),positive=checker.check(candidate),baseline=[];
  for(let view=0;view<4;view++){const floors=checker.capture(c4,view);const callbackSource=String(floors[0].material).replace(/\s+/g,'');assert.equal(callbackSource,'(x,y,z)=>A.K.mod(x,1.5)<.12?P.woodD:P.woodR','captured C4 callback is the actual x-only period1.5 original .12 predicate');baseline.push({view,capturedCallbackSource:callbackSource,groups:checker.phases(floors,view)});}
  assert(baseline[0].groups.every(g=>g.samples.every(s=>s.materialValue===checker.P.woodR)),'C4 view0 original .12 seam has no woodD representative');
  const fixtures=[
    ['restore-original-under-sampled-width',replaceOne(candidate,NEXT,OLD),/both timber shades.*view 0/],
    ['replace-stage-callback-with-constant-light',replaceOne(candidate,NEXT,'const stageTimber=(x,y,z)=>P.woodR;'),/both timber shades.*view 0/],
    ['replace-stage-callback-with-constant-dark',replaceOne(candidate,NEXT,'const stageTimber=(x,y,z)=>P.woodD;'),/both timber shades.*view 0/],
    ['move-real-floor-vertex-off-fixed-height',replaceOne(candidate,'S.poly([[cx,cy,1.2],floorPt(j,1.2),floorPt(j+1,1.2)],stageTimber);','S.poly([[cx,cy,1.3],floorPt(j,1.2),floorPt(j+1,1.2)],stageTimber);'),/actual horizontal stage floor at fixed z1.2/],
    ['swap-two-real-timber-materials',replaceOne(candidate,NEXT,'const stageTimber=(x,y,z)=>A.K.mod(x,1.5)<.30?P.woodR:P.woodD;'),/fixed .30 world-x plank classification/],
    ['broaden-seam-beyond-fixed-contract',replaceOne(candidate,NEXT,'const stageTimber=(x,y,z)=>A.K.mod(x,1.5)<.60?P.woodD:P.woodR;'),/fixed .30 world-x plank classification/],
    ['replace-stage-callback-with-stone',replaceOne(candidate,NEXT,'const stageTimber=(x,y,z)=>P.stoneD;'),/original two opaque timber shades/],
    ['bypass-actual-poly-material-callback',replaceOne(candidate,'floorPt(j+1,1.2)],stageTimber);','floorPt(j+1,1.2)],P.woodR);'),/actual S.poly\/S.flat stage material must be the callback/]
  ],negatives=[];
  for(const [name,bad,pattern]of fixtures){let failure=null;try{checker.check(bad);}catch(e){failure=e;}assert(failure,'negative must fail: '+name);assert(pattern.test(failure.message),'exact first red for '+name+': '+failure.message);checker.check(candidate);negatives.push({name,target:pattern.source,firstFailure:failure.message,restored:true,changedSourceSHA256:sha(bad)});}
  return {ok:true,kind:'source-only-real-material-callback-finite-phase-proof',gameExecuted:false,rasterizerExecuted:false,canvasCreated:false,renderedSprites:0,visualAcceptance:false,c4Commit:BASE,c4ArtSHA256:sha(c4),candidateArtSHA256:sha(candidate),candidateKind:'actual supplied/current art source, exactly one approved line different from C4',nativePrimitiveSourceSHA256:checker.primitiveSourceSHA256,palette:{woodD:checker.P.woodD,woodR:checker.P.woodR},fixedFloorZ:1.2,phaseRepresentativesPerRegion:6,regionsPerView:2,actualStageTopPolygonsPerView:25,views:4,positive,baseline,negativeControls:negatives,limitations:['This proves finite analytic sample coverage of actual recorded material callbacks, not occlusion, visual depth or image quality.','The baseline is the official C4 Git source, not a fabricated score or replacement PNG.','No game, Canvas, pixel buffer, local raster, Chrome or fingerprint execution.','Official C5 original PNG review remains required.']};
}
module.exports={makeChecker,run};
if(require.main===module){const repo=process.argv[2]||process.cwd(),candidate=process.argv[3];const out=run(repo,candidate);const dest=path.join(path.resolve(repo),'shots','wave047','source-plank-material.json');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({ok:out.ok,candidateArtSHA256:out.candidateArtSHA256,views:out.views,actualStageTopPolygonsPerView:out.actualStageTopPolygonsPerView,negativeControls:out.negativeControls.length,visualAcceptance:false,result:dest}));}
