'use strict';
/* Apply GPT-053-style exact optimization: merge the two identical neighbourhood scans
 * used by mayorSiteScore470A / mayorMegaSiteScore470 into one pass, with identical
 * accumulation order (same bounds, same tile order) so every numeric result is bit-equal.
 */
const fs = require('node:fs');
const file = 'index.html';
let s = fs.readFileSync(file, 'utf8');

const anchor = 'function mayorNearMetrics470A(x,y,sz=1){';
if (s.split(anchor).length !== 2) throw new Error('anchor not unique');
if (s.includes('MAYOR_SITE_METRICS_054')) { console.log('already applied'); process.exit(0); }

const helper = `/* DSK-054 EXACT: one neighbourhood pass shared by both site scorers.
   Same bounds and same tile order as mayorNearMetrics470A and mayorMegaSiteScore470,
   so road/rail/water/access/land/n and res/ind are accumulated bit-identically. */
const MAYOR_RES_054=new Set([1,33,105,127]),MAYOR_IND_054=new Set([3,49,50,57,64,100,109,110,116,117,118,121,122,123]);/* MAYOR_SITE_METRICS_054 */
function mayorSiteMetrics054(x,y,sz){
  let road=0,rail=0,water=0,res=0,ind=0,access=0,land=0,n=0;
  const accArr=(ACCESS468&&ACCESS468.length===N*N)?ACCESS468:null;
  const landArr=(LAND&&LAND.length===N*N)?LAND:null;
  const x0=Math.max(0,x-3),x1=Math.min(N-1,x+sz+2),y0=Math.max(0,y-3),y1=Math.min(N-1,y+sz+2);
  for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++){
    const i=idx(xx,yy),t=tiles[i],b=t.bld;
    if(t.road)road++;
    if(t.rail)rail++;
    if(t.t===0)water++;
    if(b&&!b.ref){if(MAYOR_RES_054.has(b.k))res++;if(MAYOR_IND_054.has(b.k))ind++;}
    if(accArr)access+=accArr[i]||0;
    if(landArr)land+=landArr[i]||0;
    n++;
  }
  return{road,rail,water,res,ind,access,land,n};
}
`;
s = s.replace(anchor, helper + anchor);

// 1) site score: use the merged metrics and pass them into the mega score.
const siteOld = 'function mayorSiteScore470A(tool,x,y,s){const sz=toolSize458(tool),m=mayorNearMetrics470A(x,y,sz),cat=mayorToolCategory470(tool),heavy=';
if (s.split(siteOld).length !== 2) throw new Error('site anchor not unique');
const siteNew = 'function mayorSiteScore470A(tool,x,y,s){const sz=toolSize458(tool),m=mayorSiteMetrics054(x,y,sz),cat=mayorToolCategory470(tool),heavy=';
s = s.replace(siteOld, siteNew);
const megaCall = 'let score=mayorMegaSiteScore470(tool,x,y)+m.road*2+m.access*.22;';
if (s.split(megaCall).length !== 2) throw new Error('mega call not unique');
s = s.replace(megaCall, 'let score=mayorMegaSiteScore470(tool,x,y,m)+m.road*2+m.access*.22;');

// 2) mega score: accept precomputed metrics; fall back to the same single-pass helper.
const megaHead = 'function mayorMegaSiteScore470(tool,x,y){\n  const sz=typeof toolSize458===\'function\'?toolSize458(tool):1,cx=x+(sz-1)/2,cy=y+(sz-1)/2,center=mayorSnapshotState470?.center||aiCenter();let road=0,rail=0,water=0,access=0,land=0,n=0;\n  for(let yy=Math.max(0,y-3);yy<=Math.min(N-1,y+sz+2);yy++)for(let xx=Math.max(0,x-3);xx<=Math.min(N-1,x+sz+2);xx++){const i=idx(xx,yy),t=tiles[i];if(t.road)road++;if(t.rail)rail++;if(t.t===0)water++;access+=ACCESS468&&ACCESS468.length===N*N?(ACCESS468[i]||0):0;land+=LAND&&LAND.length===N*N?(LAND[i]||0):0;n++;}';
if (s.split(megaHead).length !== 2) throw new Error('mega head not unique (len ' + megaHead.length + ')');
const megaNew = 'function mayorMegaSiteScore470(tool,x,y,pre){\n  const sz=typeof toolSize458===\'function\'?toolSize458(tool):1,cx=x+(sz-1)/2,cy=y+(sz-1)/2,center=mayorSnapshotState470?.center||aiCenter();\n  const m=pre||mayorSiteMetrics054(x,y,sz);\n  const road=m.road,rail=m.rail,water=m.water,access=m.access,land=m.land,n=m.n;';
s = s.replace(megaHead, megaNew);

fs.writeFileSync(file, s);
console.log('applied; size', s.length);
