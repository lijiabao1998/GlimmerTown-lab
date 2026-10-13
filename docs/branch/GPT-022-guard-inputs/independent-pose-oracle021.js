'use strict';
/* Source/math oracle for the reconstructed GPT-021 build.
 * NO Chrome, DOM, sprite build, runtime resolve, browser state or mutations.
 * Expected anchors come from the pinned old Scene and ideal lot corners.
 * Observations supplied by the parent must come from actual native drawing.
 */
(function(root){
  const SOURCE_PINS=Object.freeze({
    'index.html':'8bb22b699d7af017f8e41a462c21e7f34362ab8e3ec220142d282a1f251762ed',
    'british-complex-primitives014.js':'7b1e42d2514f7a1d16122ee0d0afc9ff265cfcb73c3856c74b4aed08ffd3d9c8',
    'british-use-scales-art021.js':'7d198526e46ac209d4cf892656bcc73fd95f8115cb1a07140518b933c6276de8',
    'british-use-scales-hospitality021.js':'7270c5e8b01626e80ddd625fa22b988ed956bbcc88f9be3141f34a6c56b81cf5',
    'british-use-scales-workplaces021.js':'51f14212f00e214d4654d86f65af33f49df9575e53835e5f3820dba8859e4144',
    'british-use-scales-agriculture021.js':'fcc80082b4732b14b29b741018e8afcc1b67a6aec55f3b4735c277a406654781',
    'british-use-scales-infrastructure021.js':'1a682da294d788bccb953e0adef45dada8da632be8c6fae0cf76c944ca02a7bc',
    'british-use-scales-kit021.js':'7ccbe0a54ed00b8dca173725922937346170343c9f9edca66bc2dc2055fc9efd',
    'british-use-scales-release021.js':'38c40019b61cf233de4c93f0db60710e689d99da1771862da0fc76a094fbdc9a',
    'build-use-scales-release021.js':'ff41ba3aca6e5c57b60d1f4be6217ce4561088fe730500760ac175fc5921c9ab',
    'british-use-scales-native-map021.json':'f34aeea8c080cd2bcccb984c257deb3cf366bc8b9af4d24a15f87636f45a57a7'
  });
  // Literal review copy of the five immutable art specs: id,sz,W,H,k,lv,bw,bh.
  // Never obtain these values from GV.useScales021.read/assets or sprite.ax/ay.
  const FORM_DATA=[
    ['UKU021-S',1,80,116,276,1,1,1],['UKU021-M',2,160,194,238,1,2,2],['UKU021-L',3,232,240,240,1,3,3],
    ['UKD021-S',1,80,102,196,1,1,1],['UKD021-M',2,160,178,275,1,2,2],['UKD021-L',2,160,204,220,1,2,2],
    ['UKM021-S',2,160,150,87,1,2,2],['UKM021-M',3,232,212,240,1,3,3],['UKM021-L',3,232,226,278,1,3,3],
    ['UKH021-S',1,80,116,81,1,1,1],['UKH021-M',2,160,202,82,1,2,2],['UKH021-L',3,232,252,274,1,3,3],
    ['UKO021-S',1,80,116,2,1,1,1],['UKO021-M',2,160,184,2,1,2,2],['UKO021-L',3,232,244,2,2,3,3],
    ['UKC021-S',1,80,108,3,1,1,1],['UKC021-M',2,160,162,3,1,2,1],['UKC021-L',2,160,182,3,1,2,2],
    ['UKI021-S',1,80,116,3,2,1,1],['UKI021-M',2,160,166,3,2,2,1],['UKI021-L',2,160,200,3,2,2,2],
    ['UKW021-S',2,160,180,64,1,2,2],['UKW021-M',3,232,218,167,1,3,3],['UKW021-L',4,296,232,165,1,4,4],
    ['UKF021-S',2,144,138,22,1,2,2],['UKF021-M',2,144,144,63,1,2,2],['UKF021-L',5,336,242,53,1,5,5],
    ['UKR021-S',2,144,126,23,1,2,2],['UKR021-M',2,144,150,23,2,2,2],['UKR021-L',2,144,160,23,3,2,2],
    ['UKP021-S',1,80,108,17,1,1,1],['UKP021-M',3,232,206,55,1,3,3],['UKP021-L',5,360,286,139,1,5,5],
    ['UKT021-S',2,160,174,110,1,2,2],['UKT021-M',3,232,206,167,1,3,3],['UKT021-L',4,296,240,166,1,4,4]
  ];
  const FORMS=Object.freeze(Object.fromEntries(FORM_DATA.map(([id,sz,w,h,k,lv,bw,bh])=>[id,Object.freeze({id,sz,w,h,k,lv,bw,bh})])));
  const MATRICES=Object.freeze([
    [1,0,0,0,1,0], [0,-1,1,1,0,0], [-1,0,1,0,-1,1], [0,1,0,-1,0,1]
  ].map(Object.freeze));
  const FRONT_CORNERS=Object.freeze([[1,1],[1,0],[0,0],[0,1]].map(Object.freeze));
  const EPS=1e-6;
  function integer(n,lo,hi){if(!Number.isInteger(n)||n<lo||n>hi)throw Error('Invalid integer '+n);return n;}
  function finite(n){if(!Number.isFinite(n))throw Error('Non-finite number');return n;}
  function form(id){const s=FORMS[id];if(!s)throw Error('Unreviewed form '+id);return s;}
  function rotate(x,y,extent,rotation){
    const m=MATRICES[integer(rotation,0,3)];
    return [m[0]*x+m[1]*y+m[2]*extent,m[3]*x+m[4]*y+m[5]*extent];
  }
  function projectLocal(id,view,point){
    const s=form(id),E=16*s.sz,[u,v]=rotate(point[0],point[1],E,view);
    return [s.w/2+2*(u-v),s.h-2-2*E+u+v-(point[2]||0)];
  }
  function authoredView(id,bw,bh,rot,nativeVariant){
    const s=form(id);integer(rot,0,3);
    const rectTurn=s.bw!==s.bh&&bw<bh?1:0;
    if(s.k===139&&nativeVariant!==3&&nativeVariant!==4)throw Error('Station v outside reviewed 3/4: exact native fallback required');
    if(s.k===53&&nativeVariant!==0)throw Error('Legacy large-farm v: exact native fallback required');
    return (rot+rectTurn+(s.k===139&&nativeVariant===4?1:0))%4;
  }
  function anchor(id,view){
    // The authored lot is centered within the old square Scene; rectangle
    // dimensions are 16*bw and 16*bh. Project its frontmost corner, z=0.
    const s=form(id),E=16*s.sz,left=(E-16*s.bw)/2,top=(E-16*s.bh)/2;
    const corners=[[left,top],[left+16*s.bw,top],[left,top+16*s.bh],[left+16*s.bw,top+16*s.bh]].map(p=>rotate(p[0],p[1],E,view));
    const u=Math.max(...corners.map(p=>p[0])),v=Math.max(...corners.map(p=>p[1]));
    return [s.w/2+2*(u-v),s.h-2-2*E+u+v];
  }
  function frontCorner(x,y,bw,bh,rot){const c=FRONT_CORNERS[integer(rot,0,3)];return [x+c[0]*(bw-1),y+c[1]*(bh-1)];}
  function frameOffset(f){
    for(const k of ['W','H','camX','camY','zoom'])finite(f[k]);if(!(f.zoom>0))throw Error('Nonpositive zoom');
    return [Math.round(f.W/2-f.camX*f.zoom+(f.shakeX||0)),Math.round(f.H/2-f.camY*f.zoom+(f.shakeY||0))];
  }
  function pose(input){
    const s=form(input.id),bw=input.bw??s.bw,bh=input.bh??s.bh,rot=integer(input.rot,0,3),N=integer(input.N,2,4096),lv=input.nativeLevel??s.lv,v=input.nativeVariant??0;
    integer(bw,1,N);integer(bh,1,N);integer(input.x,0,N-bw);integer(input.y,0,N-bh);
    if(!((bw===s.bw&&bh===s.bh)||(s.bw!==s.bh&&bw===s.bh&&bh===s.bw)))throw Error('Unsupported dimensions: exact native fallback required');
    if((s.k<=3||s.k===23)&&lv!==s.lv)throw Error('Wrong root level for selected form');
    const view=authoredView(s.id,bw,bh,rot,v),a=anchor(s.id,view),front=frontCorner(input.x,input.y,bw,bh,rot),uv=rotate(front[0],front[1],N-1,rot),offset=frameOffset(input.frame),z=input.frame.zoom;
    const nativeViewOrigin=[32*(uv[0]-uv[1])-a[0],16*(uv[0]+uv[1])+32-a[1]];
    const xy=nativeViewOrigin.map((n,i)=>offset[i]+z*n);
    return {id:s.id,k:s.k,lv,v,bw,bh,rot,view,front,uv,anchor:a,frame:{...input.frame},offset,nativeViewOrigin,
      nativeDims:(rot%2)?[bh,bw]:[bw,bh],draw:[...xy,s.w*z,s.h*z],nativeTransform:[1,0,0,1,0,0],w:s.w,h:s.h,x:input.x,y:input.y,N};
  }
  function screenPoint(p,local){return [p.draw[0]+p.frame.zoom*local[0],p.draw[1]+p.frame.zoom*local[1]];}
  // Literal chimney mouths from unchanged workplace architecture. Office art
  // intentionally overrides smoke608 to []; I-L supplies its actual boiler cap.
  const CHIMNEYS=Object.freeze({
    'UKO021-S':[],'UKO021-M':[],'UKO021-L':[],
    'UKC021-S':[[3.2,9.5,26.2]],'UKC021-M':[[25,11.9,36.8]],'UKC021-L':[[6.9,8.8,23.6],[27.1,25.8,36.6]],
    'UKI021-S':[[4.3,5.3,30.6]],'UKI021-M':[[26,18.6,36.1]],'UKI021-L':[[21,7.4,47.8]]
  });
  for(const mouths of Object.values(CHIMNEYS)){for(const mouth of mouths)Object.freeze(mouth);Object.freeze(mouths);}
  function smokeExpected(p){
    if(!(p.id in CHIMNEYS))throw Error('Smoke oracle limited to the nine RCI forms');
    return CHIMNEYS[p.id].map(q=>{const local=projectLocal(p.id,p.view,q);return {
      local,view:{vx:p.nativeViewOrigin[0]+local[0],vy:p.nativeViewOrigin[1]+local[1],ax:p.front[0],ay:p.front[1]},screen:screenPoint(p,local),
      // Preserve the old 608 world-coordinate contract, including its +32.
      world608:{wx:32*(p.front[0]-p.front[1])+32+local[0]-p.anchor[0],wy:16*(p.front[0]+p.front[1])+32+local[1]-p.anchor[1],ax:p.front[0],ay:p.front[1]}
    };});
  }
  function nativeStreetHash(x,y,salt){
    let n=(x*374761393+y*668265263+salt*2246822519)|0;
    n=Math.imul(n^(n>>>15),2246822519);n=Math.imul(n^(n>>>13),3266489917);n^=n>>>16;return(n>>>0)/4294967296;
  }
  function alphaRows(rgba,W,H,threshold){
    integer(W,1,10000);integer(H,1,10000);if(rgba.length!==4*W*H)throw Error('Wrong raw RGBA length');
    const rows=Array.from({length:H},()=>[]);
    for(let p=0;p<W*H;p++)if(rgba[4*p+3]>threshold)rows[Math.floor(p/W)].push(p%W);
    return rows;
  }
  function top636(rgba,W,H,logicalW){
    const rows=alphaRows(rgba,W,H,60),y=rows.findIndex(row=>row.length>0);if(y<0)return null;
    const row=rows[y],k=logicalW/W;return [(row[0]+row[row.length-1])*k/2,y*k];
  }
  function bodyTop607(rgba,W,H,logicalW){
    const rows=alphaRows(rgba,W,H,40),need=Math.max(5,Math.round(W/10));let y=rows.findIndex(row=>row.length>=need);
    if(y<0)y=H-1;const columns=rows.slice(y,y+3).flat(),x=columns.length?columns.reduce((a,b)=>a+b,0)/columns.length:W/2,k=logicalW/W;
    return {x:x*k,y:y*k};
  }
  function fwAlphaExpected(rgba,W,H,logicalW,logicalH){
    alphaRows(rgba,W,H,0);const A=Uint8Array.from({length:W*H},(_,p)=>rgba[4*p+3]);
    return {W,H,w:logicalW,h:logicalH,kx:W/logicalW,ky:H/logicalH,A};
  }
  function fwColumns(p){
    const out=[],z=p.frame.zoom;
    for(let y=p.y;y<p.y+p.bh;y++)for(let x=p.x;x<p.x+p.bw;x++){
      const uv=rotate(x,y,p.N-1,p.rot),tile=[p.offset[0]+(32*(uv[0]-uv[1])-32)*z,p.offset[1]+16*(uv[0]+uv[1])*z];
      out.push({l:(tile[0]-p.draw[0])/z,sy:(tile[1]-p.draw[1])/z,dep:uv[0]+uv[1]});
    }return out;
  }
  function fwOffset(me,other){
    if(me.rot!==other.rot||me.frame.zoom!==other.frame.zoom||!same(me.offset,other.offset))throw Error('FW requires the same native frame');
    const z=me.frame.zoom,root=rotate(other.x,other.y,other.N-1,other.rot);
    return {dx:(me.draw[0]-other.draw[0])/z,dy:(me.draw[1]-other.draw[1])/z,dep:other.uv[0]+other.uv[1]+root[1]*.001,tie:root[1]*.001,tl:fwColumns(other)};
  }
  function fwLandDisposition(k,nativeSize){return nativeSize>=2&&![1,2,3,4,5,9,10,11,12,13,22,52,53].includes(k)?'profile-if-valid':'null';}
  function reflectionDisposition(facts){
    if(!facts||facts.ref||facts.nativeSize>=2)return 'null';
    if(facts.k>=1&&facts.k<=3)return facts.profile&&facts.origin&&facts.bw===1&&facts.bh===1?'profile-1x1':'exact-approved-1x1';
    return [4,5,10,11,12,13].includes(facts.k)?'exact-approved-special':'null';
  }
  function bubbleExpected(p,rgba,facts){
    if(!facts.origin||facts.ref||p.k<1||p.k>3||p.frame.zoom<1)return null;
    const hh=nativeStreetHash(p.x,p.y,52101),eligible=nativeStreetHash(p.x,p.y,60701),progress=(facts.visT/11+hh)%1;
    if(eligible>.52||progress>.09)return null;
    const icon=p.k===1?(facts.nd>0?'zzz':hh>.5?'heart':'smile'):p.k===2?(facts.nd>0?'zzz':'note'):facts.nd>0?null:'gear';if(!icon)return null;
    const top=bodyTop607(rgba,p.w,p.h,p.w),point=screenPoint(p,[top.x+(hh-.5)*6,top.y-3]),fade=progress<.015?progress/.015:progress>.075?(.09-progress)/.015:1;
    return {icon,tipX:point[0],tipY:point[1],topY:p.draw[1]+top.y*p.frame.zoom,alpha:Math.max(0,Math.min(1,fade)),rise:(1-fade)*2};
  }
  function farmerExpected(p,h1,h2,visT){
    if(p.k!==22)throw Error('Farmer oracle is native farm22 only');
    const local=projectLocal(p.id,p.view,[18+9*h1,23+4*h1,0]);local[1]+=(h2-.5)*4;
    const xy=screenPoint(p,local),bob=Math.sin(visT*.9+nativeStreetHash(p.x,p.y,4043)*6)*p.frame.zoom*.6;
    return {local,body:[xy[0],xy[1]+bob-3*p.frame.zoom,Math.max(1,2*p.frame.zoom),Math.max(1,3*p.frame.zoom)],foot:[xy[0],xy[1]+bob]};
  }
  function tractorExpected(p,progress,row){
    if(p.k!==53||p.v!==0)throw Error('Tractor oracle is current large-farm v0 only');
    const t=2*progress-1,local=projectLocal(p.id,p.view,[22+12*t+2*row,60+6*t,0]),point=[local[0],local[1]+6],z=p.frame.zoom;
    const tx=p.draw[0]+(local[0]-3)*z,ty=p.draw[1]+local[1]*z;
    return {local,point,redBody:[tx,ty-3*z,5*z,3*z],wheelOrigin:[tx,ty]};
  }
  function sprinklerExpected(p){if(p.k!==22)throw Error('Sprinkler oracle is farm22 only');const local=projectLocal(p.id,p.view,[23,18,0]);return {local,screen:screenPoint(p,local)};}
  function ranchDoorExpected(p){
    const bounds={'UKR021-S':[2.2,8.8,4,21],'UKR021-M':[2.4,10.4,3,15.2],'UKR021-L':[21.8,29.3,9.3,28.5]},b=bounds[p.id];if(!b)throw Error('Not a ranch form');
    const [x0,x1,y0,y1]=b,cx=(x0+x1)/2,cy=(y0+y1)/2,points=[[x1+.23,cy,5.3],[cx,y0-.23,5.3],[x0-.23,cy,5.3],[cx,y1+.23,5.3]];
    let point=points[p.view];if(p.id==='UKR021-M'&&p.view===0)point=[6.4,15.43,5.3];if(p.id==='UKR021-L'&&p.view===1)point=[18.65,1.77,5.3];
    const xy=projectLocal(p.id,p.view,point);return [Math.floor(xy[0])-1,Math.floor(xy[1])-1,2,3];
  }
  function same(a,b,tolerance=EPS){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>Number.isFinite(x)&&Number.isFinite(b[i])&&Math.abs(x-b[i])<=tolerance);}
  function poseGuard(expected,observed){
    const name='pose/'+expected.id+'/r'+expected.rot+'/'+expected.bw+'x'+expected.bh+'/v'+expected.v;
    // First guard compares actual target draw arguments to hand-derived math.
    // It does not use an observed sprite's ax/ay to calculate its expectation.
    const hits=observed.draws||[],all=hits.length>0&&hits.every(d=>same(d,expected.draw));
    return {name,ok:all,expected:expected.draw,observed:hits};
  }
  function nativeDrawGuard(expected,qualifiedTargetRows){
    const basic=poseGuard(expected,{draws:qualifiedTargetRows.map(r=>r.args)});
    return {...basic,ok:basic.ok&&qualifiedTargetRows.every(r=>r.main===true&&r.kind==='day'&&r.id===expected.id&&r.view===expected.view&&same(r.matrix,expected.nativeTransform)),scope:'actual qualified native body trace; separate independent canvas pixels still required'};
  }
  function syntheticSelfcheck(){
    const f={W:1440,H:1000,camX:0,camY:0,zoom:2,shakeX:0,shakeY:0},checks=[],add=(n,b)=>checks.push({name:n,ok:!!b});
    const wide=[[-48,1252,320,324],[3152,2244,320,324],[1168,3844,320,324],[-2032,2852,320,324]],tall=[[-112,1252,320,324],[3152,2212,320,324],[1232,3844,320,324],[-2032,2884,320,324]],station=[[-280,1212,720,572],[2728,2076,720,572],[1000,3580,720,572],[-2008,2716,720,572]];
    for(let r=0;r<4;r++){
      const base={x:10,y:20,N:72,frame:f,rot:r},p=pose({...base,id:'UKC021-M'}),t=pose({...base,id:'UKC021-M',bw:1,bh:2});
      add('manual rectangle 2x1 r'+r,same(p.draw,wide[r]));add('manual rectangle 1x2 r'+r,same(t.draw,tall[r]));
      for(const v of [3,4]){const s=pose({...base,id:'UKP021-L',nativeVariant:v});add('manual station v'+v+' r'+r,same(s.draw,station[r])&&s.view===(r+v-3)%4);}
      const shifted=p.draw.slice();shifted[0]-=16*f.zoom;
      add('synthetic anchor+16 first-red r'+r,!poseGuard(p,{draws:[shifted]}).ok&&poseGuard(p,{draws:[p.draw]}).ok);
    }
    const c=pose({id:'UKC021-M',x:10,y:20,N:72,rot:0,frame:f});add('manual chimney local r0',same(smokeExpected(c)[0].local,[106.2,96.1]));
    const trace={id:c.id,view:c.view,kind:'day',main:true,args:c.draw,matrix:c.nativeTransform};add('synthetic actual-context guard rejects translate16',nativeDrawGuard(c,[trace]).ok&&!nativeDrawGuard(c,[{...trace,matrix:[1,0,0,1,16,0]}]).ok);
    const farmer=pose({id:'UKF021-S',x:10,y:20,N:72,rot:0,frame:f});add('manual farmer .25/.75',same(farmerExpected(farmer,.25,.75,0).local,[64.5,117.25]));
    const farm=pose({id:'UKF021-L',x:10,y:20,N:72,rot:0,frame:f});add('manual tractor .25 row1',same(tractorExpected(farm,.25,1).point,[90,161]));
    add('review manifest 36',Object.keys(FORMS).length===36);add('large RCI reflection retains native approximation',reflectionDisposition({k:3,nativeSize:1,origin:true,bw:2,bh:1,profile:true})==='exact-approved-1x1');
    add('small fixed unsupported reflection remains null',reflectionDisposition({k:276,nativeSize:1,origin:true,bw:1,bh:1,profile:true})==='null');
    const pixels=new Uint8Array(12*8*4);pixels[(1*12+2)*4+3]=255;for(let x=3;x<=7;x++)pixels[(4*12+x)*4+3]=255;
    add('independent alpha roof ignores needle for bubble',same(top636(pixels,12,8,12),[2,1])&&bodyTop607(pixels,12,8,12).y===4);
    return {status:'synthetic math/source only; NO GAME OR CHROME PASS',ok:checks.every(q=>q.ok),checks};
  }
  const api={SOURCE_PINS,FORMS,EPS,form,rotate,projectLocal,authoredView,anchor,frontCorner,frameOffset,pose,screenPoint,CHIMNEYS,smokeExpected,nativeStreetHash,top636,bodyTop607,fwAlphaExpected,fwColumns,fwOffset,fwLandDisposition,reflectionDisposition,bubbleExpected,farmerExpected,tractorExpected,sprinklerExpected,ranchDoorExpected,same,poseGuard,nativeDrawGuard,syntheticSelfcheck};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.IndependentPoseOracle021=Object.freeze(api);
  if(typeof require==='function'&&typeof module==='object'&&require.main===module){
    const result=syntheticSelfcheck(),arg=process.argv.indexOf('--sources');
    if(arg>=0){const fs=require('fs'),path=require('path'),crypto=require('crypto'),repo=process.argv[arg+1];if(!repo)throw Error('--sources requires explicit path');
      result.sourcePins=Object.entries(SOURCE_PINS).map(([file,want])=>{const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,file))).digest('hex');return {file,expected:want,actual,ok:actual===want};});result.ok=result.ok&&result.sourcePins.every(q=>q.ok);
    }
    console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;
  }
})(typeof globalThis==='object'?globalThis:this);
