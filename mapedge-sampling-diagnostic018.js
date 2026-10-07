#!/usr/bin/env node
'use strict';
// DIAGNOSTIC ONLY. No proposal here grants product, release or image approval.
// Browser functions are serialized only in isolated Actions. Imports are inert.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const base=require('./mapedge-native-qa018');
const DRIVER_SHA256='47a150afe2c46c74730cc0b3ba659353788bf93d876098dcbac4dce92975105a';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function samplingDiagnosticPair018(options){
 const{rotation,zoom,night,focus,proposal}=options,C=window.__complexQA014,F=window.__waterfrontFns018,originalAPI=window.MapEdgeRepair018,SPR=GV.art574.SPR(),cliff=SPR.cliff,c=document.getElementById('game');
 if(!['underlay','full-size-masked-copy'].includes(proposal))throw Error('Unknown diagnostic proposal');
 const scene=F.waterfrontScene018(rotation,night,zoom,null,focus);delete scene.png;
 const camera=GV.lookAt(...focus),w=c.width,h=c.height,n=C.N,z=zoom,ox=Math.round(w/2-camera[0]*z),oy=Math.round(h/2-camera[1]*z),pad=560*z,tiles=[];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const[vx,vy]=mapedgeView018(x,y,rotation,n),sx=ox+((vx-vy)*32-32)*z,sy=oy+(vx+vy)*16*z;if(sx<=-pad||sx>=w+pad||sy<=-pad||sy>=h+pad||vx!==n-1&&vy!==n-1)continue;const t=GV.tile(x,y);tiles.push({x,y,vx,vy,sx,sy,mask:(vy===n-1?1:0)|(vx===n-1?2:0),terrain:t.t,height:t.el||0});}
 const make=(width=w,height=h)=>{const c=document.createElement('canvas');c.width=width;c.height=height;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g];};
 const[mask,mg]=make(),[outward,og]=make();mg.fillStyle='#fff';for(const t of tiles){if(t.mask!==3)mg.fillRect(t.sx+(t.mask===1?32:0)*z,t.sy,32*z,56*z);og.drawImage(cliff,t.sx,t.sy,64*z,56*z);}
 const allowed=mg.getImageData(0,0,w,h).data,soil=og.getImageData(0,0,w,h).data,source=cliff.getContext('2d').getImageData(0,0,64,56),copies={},copyProof=[];
 for(const side of[1,2]){const[image,g]=make(64,56),bytes=new Uint8ClampedArray(source.data);for(let y=0;y<56;y++)for(let x=0;x<64;x++)if(side===1?x>=32:x<32)bytes.fill(0,(y*64+x)*4,(y*64+x)*4+4);g.putImageData(new ImageData(bytes,64,56),0,0);const observed=g.getImageData(0,0,64,56).data;let retainedMismatch=0,discardedOpaque=0;for(let y=0;y<56;y++)for(let x=0;x<64;x++){const i=(y*64+x)*4;if(side===1?x<32:x>=32){for(let k=0;k<4;k++)if(observed[i+k]!==source.data[i+k])retainedMismatch++;}else if(observed[i]||observed[i+1]||observed[i+2]||observed[i+3])discardedOpaque++;}copies[side]=image;copyProof.push({side,width:image.width,height:image.height,retainedMismatch,discardedOpaque});}
 const world=C.world(),storage=JSON.stringify(C.storage()),canonicalPNG=cliff.toDataURL(),flagHad=Object.hasOwn(window,'__noMapEdgeFix018'),flag=window.__noMapEdgeFix018,waterHad=Object.hasOwn(window,'__waterF695'),water=window.__waterF695,draw=CanvasRenderingContext2D.prototype.drawImage,clear=CanvasRenderingContext2D.prototype.clearRect,random=Math.random;
 let context=null,active=null,randomCalls=0;const frames=[],ground=[],full=[],pngs=[];
 try{
  window.__waterF695=0;Math.random=function(){randomCalls++;return random.apply(this,arguments);};
  // The wrapper changes only this explicitly named diagnostic proposal. The
  // original frozen API object is neither edited nor used as an acceptance shim.
  window.MapEdgeRepair018=Object.freeze({...originalAPI,drawMapEdge018:function(g,sprite,vx,vy,n,sx,sy,z,legacy){
   if(!active)return originalAPI.drawMapEdge018(g,sprite,vx,vy,n,sx,sy,z,legacy);
   if(!context)context=g;if(context!==g||sprite!==cliff)throw Error('Diagnostic must observe exactly one canonical ground context');
   const mask=(vy===n-1?1:0)|(vx===n-1?2:0);active.calls.push([vx,vy,sx,sy,z]);
   if(active.legacy)return originalAPI.drawMapEdge018(g,sprite,vx,vy,n,sx,sy,z,true);
   if(proposal==='underlay'){active.suppressed++;return mask;}
   draw.call(g,mask===3?cliff:copies[mask],sx,sy,64*z,56*z);active.proposalDraws++;return mask;
  }});
  CanvasRenderingContext2D.prototype.clearRect=function(x,y,width,height){
   const result=clear.apply(this,arguments);
   if(active&&!active.legacy&&this===context&&x===0&&y===0&&width===w&&height===h){active.cacheClears++;if(proposal==='underlay'){for(const t of tiles){draw.call(this,cliff,t.sx,t.sy,64*z,56*z);active.proposalDraws++;}active.underlayBeforeGround=true;}}
   return result;
  };
  for(const legacy of[true,false,true,false]){
   active={legacy,calls:[],cacheClears:0,suppressed:0,proposalDraws:0,underlayBeforeGround:false};window.__noMapEdgeFix018=legacy;GV.forceDraw();
   if(!context||context.canvas.width!==w||context.canvas.height!==h)throw Error('No actual production ground context');
   ground.push(context.getImageData(0,0,w,h).data);full.push(c.getContext('2d').getImageData(0,0,w,h).data);
   if(frames.length<2){const phase=legacy?'legacy':'proposal';pngs.push({phase,kind:'full-game',png:c.toDataURL('image/png')},{phase,kind:'ground-cache',png:context.canvas.toDataURL('image/png')});}
   const expected=tiles.map(t=>[t.vx,t.vy,t.sx,t.sy,z]);active.callsExact=JSON.stringify(active.calls)===JSON.stringify(expected);active.terrainExact=tiles.every(t=>{const now=GV.tile(t.x,t.y);return now.t===t.terrain&&(now.el||0)===t.height;});active.calls=active.calls.length;frames.push(active);active=null;
  }
 }finally{window.MapEdgeRepair018=originalAPI;CanvasRenderingContext2D.prototype.clearRect=clear;Math.random=random;if(flagHad)window.__noMapEdgeFix018=flag;else delete window.__noMapEdgeFix018;if(waterHad)window.__waterF695=water;else delete window.__waterF695;}
 const groundDiff=mapedgeDiff018(ground[0],ground[1],w,allowed),fullDiff=mapedgeDiff018(full[0],full[1],w,allowed);let preservedOutward=0,changedOutward=0;const outsideSamples=[];
 for(let i=0;i<soil.length;i+=4){const changed=ground[0][i]!==ground[1][i]||ground[0][i+1]!==ground[1][i+1]||ground[0][i+2]!==ground[1][i+2]||ground[0][i+3]!==ground[1][i+3];if(soil[i+3]&&!allowed[i+3]){preservedOutward++;if(changed)changedOutward++;}if(changed&&!allowed[i+3]&&outsideSamples.length<100)outsideSamples.push({x:i/4%w,y:Math.floor(i/4/w),before:Array.from(ground[0].slice(i,i+4)),after:Array.from(ground[1].slice(i,i+4))});}
 return{kind:'temporary compositor proposal diagnostic, not product acceptance or owner-review evidence',...options,proposalOnly:true,width:w,height:h,day:GV.stats().day,camera,scene,tiles,copyProof,frames,ground:groundDiff,full:fullDiff,restoredLegacy:mapedgeDiff018(ground[0],ground[2],w),repeatedProposal:mapedgeDiff018(ground[1],ground[3],w),preservedOutward,changedOutward,outsideSamples,worldExact:world===C.world(),storageExact:storage===JSON.stringify(C.storage()),canonicalCliffExact:canonicalPNG===cliff.toDataURL(),canonical:F.waterfrontCanonical018(),apiRestored:window.MapEdgeRepair018===originalAPI&&CanvasRenderingContext2D.prototype.clearRect===clear&&CanvasRenderingContext2D.prototype.drawImage===draw,randomCalls,pngs};
}
function diagnosticPass018(q){return !!q&&q.proposalOnly&&q.worldExact&&q.storageExact&&q.canonicalCliffExact&&q.canonical&&q.apiRestored&&q.randomCalls===0&&q.copyProof.every(r=>r.retainedMismatch===0&&r.discardedOpaque===0)&&q.frames.length===4&&q.frames.every((f,n)=>f.legacy===(n%2===0)&&f.callsExact&&f.terrainExact&&(f.legacy||(f.cacheClears===1&&f.proposalDraws===f.calls&&(q.proposal!=='underlay'||f.underlayBeforeGround&&f.suppressed===f.calls))))&&q.ground.outside===0&&q.full.outside===0&&q.restoredLegacy.changed===0&&q.repeatedProposal.changed===0&&q.preservedOutward>0&&q.changedOutward===0;}
const DIAGNOSTIC_BLOCK=String.raw`  if(EDGE_MODE){
   report.limits.push('Dedicated proposal diagnostic: a count-checked runner adapter substitutes only this comparator and observer import. Product index and complete original cold Continue path remain byte exact. These images and measurements grant no product, release or image approval.');
   report.diagnostic={...diagnosticAdaptation,proposalOnly:true,acceptanceGranted:false,afterActualReloads:report.reloads.length,ordinaryDaysPerReload:report.reloads.map(r=>r.following.length),pairs:[],errors:[]};
   fs.writeFileSync(path.join(OUT,'diagnostic-adapted-runner.js'),diagnosticAdaptedSource);
   fs.writeFileSync(path.join(OUT,'diagnostic-adaptation.json'),JSON.stringify(diagnosticAdaptation,null,2));
   check('proposal diagnostic follows exact original two reloads and three ordinary days each',report.reloads.length===2&&report.reloads.every(r=>r.following.length===3));
   const diagnosticCall=(name,...args)=>ev('window.__mapedgeFns018.'+name+'('+args.map(a=>JSON.stringify(a)).join(',')+')',name),scenarios=[],selectedRotation=+REQUESTED_MODE.slice(-1);
   if(selectedRotation===1)for(const zoom of[1.6,2])for(const night of[false,true])scenarios.push({rotation:1,zoom,night,focus:[66.5,65],focusLabel:'image10'});
   for(const rotation of[selectedRotation]){const focus=edge.mapedgeView018(69,69,(4-rotation)%4);for(const zoom of[.75,1,1.6,2])scenarios.push({rotation,zoom,night:false,focus,focusLabel:'near-front-corner'});scenarios.push({rotation,zoom:1.6,night:true,focus,focusLabel:'near-front-corner'});const survey=await diagnosticCall('mapedgeBoundarySurvey018',rotation);if(survey.elevatedFocus)scenarios.push({rotation,zoom:.75,night:false,focus:survey.elevatedFocus,focusLabel:'existing-elevated-boundary'});}
   for(const options of scenarios)for(const proposal of['underlay','full-size-masked-copy']){
    try{const q=await diagnosticCall('samplingDiagnosticPair018',{...options,proposal});
     for(const im of q.pngs)png('images/diagnostic-'+proposal+'-r'+options.rotation+'-'+options.focusLabel+'-z'+options.zoom+'-'+(options.night?'night':'day')+'-'+im.kind+'-'+im.phase+'.png',im.png,{kind:'PROPOSAL DIAGNOSTIC ONLY: '+im.kind,proposal,phase:im.phase,rotation:options.rotation,zoom:options.zoom,night:options.night,focus:options.focus,day:q.day,approval:false});delete q.pngs;
     q.proposedPixelGatesPass=edge.diagnosticPass018(q);report.diagnostic.pairs.push(q);save();console.log('DIAGNOSTIC '+JSON.stringify({proposal,...options,pass:q.proposedPixelGatesPass,ground:q.ground,full:q.full,changedOutward:q.changedOutward}));
    }catch(error){report.diagnostic.errors.push({proposal,...options,error:error.stack||String(error)});save();console.error('DIAGNOSTIC MEASUREMENT ERROR',error);}
   }
   report.diagnostic.summary=['underlay','full-size-masked-copy'].map(proposal=>{const rows=report.diagnostic.pairs.filter(q=>q.proposal===proposal);return{proposal,measured:rows.length,passed:rows.filter(q=>q.proposedPixelGatesPass).length,expected:scenarios.length,errors:report.diagnostic.errors.filter(q=>q.proposal===proposal).length,selectionOrApproval:false};});save();
   check('all proposal measurements retained without stopping at pixel mismatches',report.diagnostic.errors.length===0&&report.diagnostic.pairs.length===scenarios.length*2,report.diagnostic.summary);
  }
`;
function adaptDriver018(source){
 if(hash(source)!==DRIVER_SHA256)throw Error('Diagnostic driver source changed; audit and repin explicitly');
 const start='  if(EDGE_MODE){',end='  report.finalWorker=',oldImport="const edge=require('./mapedge-native-qa018'),edgeRenderer=require('./mapedge-render018');",newImport="const edge=require('./mapedge-sampling-diagnostic018'),edgeRenderer=require('./mapedge-render018');";
 for(const token of[start,end,oldImport])if(source.split(token).length!==2)throw Error('Unique diagnostic adapter boundary required: '+token);
 const a=source.indexOf(start),b=source.indexOf(end,a);if(b<=a)throw Error('Invalid diagnostic adapter span');
 const adapted=source.slice(0,a)+DIAGNOSTIC_BLOCK+source.slice(b),result=adapted.replace(oldImport,newImport);new vm.Script(result);
 if(result.replace(DIAGNOSTIC_BLOCK,source.slice(a,b)).replace(newImport,oldImport)!==source)throw Error('Diagnostic adapter does not reverse exactly');
 return{source:result,proof:{originalDriverSHA256:DRIVER_SHA256,adaptedDriverSHA256:hash(result),replacements:2,reversible:true,originalColdFlowByteExact:true,productSourceSubstituted:false,proposalOnly:true,acceptanceGranted:false}};
}
const functions018=[...base.functions018,samplingDiagnosticPair018];
module.exports={...base,functions018,DRIVER_SHA256,DIAGNOSTIC_BLOCK,adaptDriver018,diagnosticPass018};
if(require.main===module){
 if(process.argv.includes('--static-test'))require('./mapedge-sampling-diagnostic018.test');
 else{
  if(process.env.GITHUB_ACTIONS!=='true')throw Error('Native diagnostic runs only in isolated GitHub Actions');
  if(!/^mapedge[0-3]$/.test(process.env.WF018_MODE||''))throw Error('Audited diagnostic rotation cold-load mode required');
  const original=fs.readFileSync(path.join(__dirname,'waterfront-integration-qa018.js'),'utf8'),adapted=adaptDriver018(original),provenance={...adapted.proof,diagnosticSourceSHA256:hash(fs.readFileSync(__filename)),baseProductHead:'a119c9c9cdf18375e769a956656dafc91a34e105',productSourceSHA256:hash(fs.readFileSync(path.join(__dirname,'index.html'))),checkedSHA:process.env.GITHUB_SHA,run:process.env.GITHUB_RUN_ID};
  const binding='const diagnosticAdaptation='+JSON.stringify(provenance)+';const diagnosticAdaptedSource='+JSON.stringify(adapted.source)+';\n';
  const driver=adapted.source.replace("'use strict';","'use strict';\n"+binding),Module=require('node:module'),filename=path.join(__dirname,'.mapedge-diagnostic-driver018.js'),child=new Module(filename,module);child.filename=filename;child.paths=module.paths;child._compile(driver,filename);
 }
}
