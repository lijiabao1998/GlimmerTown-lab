/* GPT-019 pure geometry and validation. No canvas, clock, storage or simulation. */
(function(root){
 'use strict';
 const THEMES=Object.freeze(['arrivalCourt','brickPromenade','quayEdgeWalk','quayCorner','heritageDisplay','watersideBench','harbourLantern','timberShelter']);
 const FLAT=Object.freeze(['arrivalCourt','brickPromenade']);
 const DIRS=Object.freeze([[0,-1],[1,0],[0,1],[-1,0]].map(Object.freeze));
 const mod=(n,d)=>((n%d)+d)%d;
 function metadata(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.keys(raw).sort().join(',')!=='british019,turn019'||!THEMES.includes(raw.british019)||!Number.isInteger(raw.turn019)||raw.turn019<0||raw.turn019>3)return null;return{theme:raw.british019,turn:raw.turn019};}
 function rotateMask(mask,turn){if(!Number.isInteger(mask)||mask<0||mask>15||!Number.isInteger(turn))throw Error('Bounded mask and integer direction required');turn=mod(turn,4);return((mask<<turn)|(mask>>(4-turn)))&15;}
 function hash(a,b=0){let n=Math.imul((a|0)^Math.imul(b|0,374761393),668265263);n=Math.imul(n^(n>>>13),1274126177);return(n^(n>>>16))>>>0;}
 function graph(cells,size){
  if(!Array.isArray(cells)||!Number.isInteger(size)||size<2||size>256||cells.length>size*size)throw Error('Bounded native path inventory required');
  const nodes=new Map(),seen=new Set();for(const r of cells){if(!r||!Number.isInteger(r.i)||r.i<0||r.i>=size*size||seen.has(r.i)||!Number.isInteger(r.open)||r.open<0||r.open>15)throw Error('Unique bounded path rows required');seen.add(r.i);if(r.passable!==true)continue;nodes.set(r.i,{i:r.i,x:r.i%size,y:Math.floor(r.i/size),flat:r.flat===true,theme:THEMES.includes(r.theme)?r.theme:null,elevation:Number.isFinite(r.elevation)?r.elevation:0,open:r.open,neighbors:[],visual:[],mask:0});}
  for(const n of nodes.values())for(let d=0;d<4;d++){const x=n.x+DIRS[d][0],y=n.y+DIRS[d][1];if(x<0||y<0||x>=size||y>=size)continue;const q=nodes.get(y*size+x);if(!q)continue;n.neighbors.push(q.i);const joined=n.elevation===q.elevation&&!!((n.open&(1<<d))&&(q.open&(1<<mod(d+2,4))));if(joined)n.mask|=1<<d;if(n.flat&&q.flat&&joined)n.visual.push(q.i);}
  return{size,nodes};
 }
 function entrance(hall,g){
  if(!hall||!Number.isInteger(hall.x)||!Number.isInteger(hall.y)||hall.sz!==2||!Number.isInteger(hall.turn)||hall.turn<0||hall.turn>3||hall.x<0||hall.y<0||hall.x+2>g.size||hall.y+2>g.size)return{front:null,connected:[],reason:'invalid-hall'};
  const x=hall.x,y=hall.y,d=mod(2+hall.turn,4),edges=[[[x,y-1],[x+1,y-1]],[[x+2,y],[x+2,y+1]],[[x+1,y+2],[x,y+2]],[[x-1,y+1],[x-1,y]]];
  const connected=edges[d].filter(([a,b])=>a>=0&&b>=0&&a<g.size&&b<g.size).map(([a,b])=>g.nodes.get(b*g.size+a)).filter(n=>n?.flat&&n.visual.length&&n.elevation===(Number.isFinite(hall.elevation)?hall.elevation:0)).map(n=>n.i);
  return{front:d,connected,reason:connected.length?'connected':'front-path-missing'};
 }
 function routes(hall,g,{maxVisited=128,maxDepth=12,maxRoutes=4}={}){
  if(!Number.isInteger(maxVisited)||maxVisited<1||maxVisited>256||!Number.isInteger(maxDepth)||maxDepth<1||maxDepth>24||!Number.isInteger(maxRoutes)||maxRoutes<0||maxRoutes>8)throw Error('Bounded visual route limits required');
  const entry=entrance(hall,g),queue=[],prev=new Map(),dist=new Map();for(const i of entry.connected.slice(0,maxVisited)){queue.push(i);prev.set(i,null);dist.set(i,0);}
  for(let at=0;at<queue.length&&at<maxVisited;at++){const i=queue[at],d=dist.get(i);if(d>=maxDepth)continue;for(const j of g.nodes.get(i).visual){if(dist.has(j)||queue.length>=maxVisited)continue;prev.set(j,i);dist.set(j,d+1);queue.push(j);}}
  const score=i=>{const n=g.nodes.get(i),near=n.neighbors.map(j=>g.nodes.get(j)).filter(q=>q.theme&&!q.flat);return near.length?100+near.reduce((s,q)=>s+(q.theme==='heritageDisplay'?8:q.theme==='watersideBench'?6:3),0):0;};
  const candidates=queue.filter(i=>dist.get(i)>=2).sort((a,b)=>score(b)-score(a)||dist.get(b)-dist.get(a)||(hash(a,hall.y*g.size+hall.x)-hash(b,hall.y*g.size+hall.x))||a-b),out=[];
  for(const i of maxRoutes?candidates:[]){const path=[];for(let q=i;q!==null;q=prev.get(q))path.push(q);path.reverse();if(out.some(p=>p.at(-1)===i))continue;out.push(path);if(out.length>=maxRoutes)break;}
  return{entry,visited:queue.length,paths:maxRoutes?out:[],truncated:queue.length===maxVisited};
 }
 function position(path,g,time,seed=0){
  if(!Array.isArray(path)||path.length<2||path.some((i,n)=>!g.nodes.get(i)?.flat||(n&&!g.nodes.get(path[n-1]).visual.includes(i)))||!Number.isFinite(time)||!Number.isInteger(seed))return null;
  const length=path.length-1,pause=2,period=length*2+pause*2,t=mod(time*.42+(hash(seed)/4294967296)*period,period);let distance,state;
  if(t<length){distance=t;state='walking';}else if(t<length+pause){distance=length;state='looking';}else if(t<length*2+pause){distance=length*2+pause-t;state='walking';}else{distance=0;state='waiting';}
  const a=Math.min(length,Math.floor(distance)),b=Math.min(length,a+1),u=distance-a,A=g.nodes.get(path[a]),B=g.nodes.get(path[b]);
  return{x:A.x+(B.x-A.x)*u,y:A.y+(B.y-A.y)*u,from:A.i,to:B.i,fraction:u,state};
 }
 function activity({built,operational,employed,leisure,night=false,wet=false,winter=false,zoom=1,disabled=false}){if(disabled||built!==true||operational!==true||!Number.isFinite(employed)||employed<=0||!Number.isFinite(leisure)||leisure<=0||!Number.isFinite(zoom)||zoom<1)return 0;return night?(wet||winter?0:1):(wet||winter?1:4);}
 const api=Object.freeze({THEMES,FLAT,DIRS,metadata,rotateMask,hash,graph,entrance,routes,position,activity});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WaterfrontQuarterLogic019=api;
})(typeof window==='undefined'?globalThis:window);
