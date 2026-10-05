/* Original British central station, GPT-008. Native 2:1 opaque pixel surfaces.
   Four real geometric views; no imported images, font rendering, random or state. */
(function(root){
  'use strict';
  const rgb=s=>parseInt(s,16),P={brick:rgb('a96350'),brickR:rgb('804b43'),mortar:rgb('805949'),stone:rgb('d7c7a8'),stoneR:rgb('aa9a80'),slate:rgb('55616c'),slateR:rgb('414b57'),iron:rgb('354649'),ironHi:rgb('718784'),glass:rgb('73999e'),glassR:rgb('536d78'),glassHi:rgb('9db9b3'),wood:rgb('4b6053'),pave:rgb('b6b2a4'),paveR:rgb('979b94'),ballast:rgb('69716c'),rail:rgb('9aa7a3'),white:rgb('e9dfc2'),gold:rgb('d2ad6b'),dark:rgb('29373b'),warm:rgb('f4cb88'),leaf:rgb('567048'),red:rgb('b95146')};
  const mod=(a,n)=>(a%n+n)%n;
  function scene(size,rot,w=336,h=304){
    const ax=w/2,ay=h-2,oy=ay-size*2,dep=new Float64Array(w*h),day=new Uint32Array(w*h),night=new Uint32Array(w*h);dep.fill(-Infinity);
    function rotate(p){const[x,y,z]=p;return rot===1?[size-y,x,z]:rot===2?[size-x,size-y,z]:rot===3?[y,size-x,z]:p;}
    function proj(p){const q=rotate(p);return[ax+2*q[0]-2*q[1],oy+q[0]+q[1]-q[2],q[0]+q[1]+2*q[2]];}
    function tri(a,b,c,mat,bias=0){const A=proj(a),B=proj(b),C=proj(c),det=(B[1]-C[1])*(A[0]-C[0])+(C[0]-B[0])*(A[1]-C[1]);if(Math.abs(det)<1e-9)return;const x0=Math.max(0,Math.floor(Math.min(A[0],B[0],C[0]))),x1=Math.min(w-1,Math.ceil(Math.max(A[0],B[0],C[0]))),y0=Math.max(0,Math.floor(Math.min(A[1],B[1],C[1]))),y1=Math.min(h-1,Math.ceil(Math.max(A[1],B[1],C[1])));for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const u=((B[1]-C[1])*(x+.5-C[0])+(C[0]-B[0])*(y+.5-C[1]))/det,v=((C[1]-A[1])*(x+.5-C[0])+(A[0]-C[0])*(y+.5-C[1]))/det,t=1-u-v;if(u<-.000001||v<-.000001||t<-.000001)continue;const d=A[2]*u+B[2]*v+C[2]*t+bias,k=y*w+x;if(d<dep[k]-.000001)continue;const p=a.map((q,i)=>q*u+b[i]*v+c[i]*t),color=typeof mat==='function'?mat(...p):mat;if(color===null||color===undefined)continue;dep[k]=d;day[k]=Array.isArray(color)?color[0]:color;night[k]=Array.isArray(color)?color[1]||0:0;}}
    function poly(p,c,b=0){for(let i=1;i<p.length-1;i++)tri(p[0],p[i],p[i+1],c,b);}
    function flat(x0,x1,y0,y1,z,c,b=0){poly([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]],c,b);}
    function wall(a,b,z0,z1,c,bi=0){poly([[...a,z0],[...b,z0],[...b,z1],[...a,z1]],c,bi);}
    function box(x0,x1,y0,y1,z0,z1,c=P.brick,r=P.brickR,top=P.stone){wall([x0,y0],[x1,y0],z0,z1,c);wall([x0,y1],[x1,y1],z0,z1,c);wall([x0,y0],[x0,y1],z0,z1,r);wall([x1,y0],[x1,y1],z0,z1,r);if(top!==null)flat(x0,x1,y0,y1,z1,top);}
    function line(a,b,c,thick=.35){const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(len<.001){box(a[0]-thick/2,a[0]+thick/2,a[1]-thick/2,a[1]+thick/2,Math.min(a[2],b[2]),Math.max(a[2],b[2]),c,c,c);return;}const nx=-dy/len*thick/2,ny=dx/len*thick/2;poly([[a[0]+nx,a[1]+ny,a[2]],[b[0]+nx,b[1]+ny,b[2]],[b[0]-nx,b[1]-ny,b[2]],[a[0]-nx,a[1]-ny,a[2]]],c,.15);}
    function finish(meta){const canvas=n=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),im=g.createImageData(w,h);for(let i=0;i<n.length;i++){const v=n[i];if(!v)continue;im.data[i*4]=v>>>16;im.data[i*4+1]=(v>>>8)&255;im.data[i*4+2]=v&255;im.data[i*4+3]=255;}g.putImageData(im,0,0);return c;};return{img:canvas(day),night:canvas(night),w,h,ax,ay,...meta};}
    return{flat,wall,box,line,poly,finish};
  }
  const paving=(x,y)=>mod(Math.floor(x),8)===0||mod(Math.floor(y),8)===0?P.paveR:P.pave;
  const brick=(right=false)=>(x,y,z)=>mod(Math.floor(z),3)===0||mod(Math.floor((right?y:x)+(Math.floor(z/3)%2)*3),6)===0?P.mortar:right?P.brickR:P.brick;
  function cornice(S,x0,x1,y0,y1,z){S.box(x0-.4,x1+.4,y0-.4,y1+.4,z,z+1.4,P.stone,P.stoneR,P.white);}
  function roof(S,x0,x1,y0,y1,z,rise){const mid=(x0+x1)/2;S.poly([[x0,y0,z],[mid,y0,z+rise],[mid,y1,z+rise],[x0,y1,z]],(x,y)=>mod(Math.floor(y),3)===0?P.iron:P.slate);S.poly([[mid,y0,z+rise],[x1,y0,z],[x1,y1,z],[mid,y1,z+rise]],(x,y)=>mod(Math.floor(y),3)===0?P.iron:P.slateR);S.poly([[x0,y1,z],[x1,y1,z],[mid,y1,z+rise]],brick());S.poly([[x0,y0,z],[x1,y0,z],[mid,y0,z+rise]],brick());S.line([mid,y0,z+rise],[mid,y1,z+rise],P.ironHi,.55);}
  function lamp(S,x,y,z=15){S.box(x-.3,x+.3,y-.3,y+.3,0,z,P.iron,P.iron,P.iron);S.box(x-1,x+1,y-.8,y+.8,z,z+2,[P.warm,P.warm],[P.warm,P.warm],P.iron);S.box(x-1.3,x+1.3,y-1,y+1,z+2,z+2.8,P.iron,P.iron,P.iron);}
  function bench(S,x,y){S.box(x,x+5,y,y+1,0,2,P.iron,P.iron,P.wood);S.box(x,x+5,y+.9,y+1.3,2,4,P.wood,P.wood,P.wood);}
  function clock(S,x0,x1,y,z0,z1){S.wall([x0,y],[x1,y],z0,z1,(x,_y,z)=>{const cx=(x0+x1)/2,cz=(z0+z1)/2,r=(x1-x0)/2,d=Math.hypot(x-cx,z-cz);if(d>r)return null;if(d>r-.65)return P.gold;if(Math.abs(x-cx)<.45&&z>=cz-3&&z<cz+.8||Math.abs(z-cz+(x-cx)*.7)<.4&&x>=cx&&x<cx+2.5)return P.dark;if(mod(Math.round(Math.atan2(z-cz,x-cx)*6/Math.PI),3)===0&&d>r-1.5)return P.iron;return[P.white,P.warm];},.2);}
  function tracks(S){for(const c of[24,56]){S.flat(c-5,c+5,0,80,.2,(x,y)=>mod(Math.floor(y),3)===0?P.wood:P.ballast);for(const d of[-2.3,2.3])S.flat(c+d-.22,c+d+.22,0,80,.55,P.rail,.1);}S.box(33,47,1,79,0,2.8,P.pave,P.paveR,P.pave);for(const x of[32.8,46.8,15.3,64.8])S.flat(x,x+.75,1,79,3,P.gold,.2);S.box(65,78,1,79,0,2.8,P.pave,P.paveR,P.pave);}
  function vault(S,roofOn=true,maxY=56){
    const xs=[17,21,28,38,48,58,68,74,78],zs=[27,39,48,54,57,54,48,39,27];
    for(const y of[4,16,28,40,52,64,76]){for(const x of[17,78])S.box(x-.6,x+.6,y-.5,y+.5,3,27,P.iron,P.iron,P.iron);for(let i=0;i<xs.length-1;i++)S.line([xs[i],y,zs[i]],[xs[i+1],y,zs[i+1]],P.ironHi,.8);for(const x of[28,48,68])S.line([x,y,27],[x,y,Math.min(54,zs[x===28?2:x===48?4:6])],P.iron,.3);S.line([17,y,27],[78,y,27],P.iron,.45);}
    for(let i=0;i<xs.length-1;i++){if(roofOn)for(let y=4;y<maxY;y+=4)S.poly([[xs[i],y,zs[i]],[xs[i+1],y,zs[i+1]],[xs[i+1],Math.min(maxY,y+4),zs[i+1]],[xs[i],Math.min(maxY,y+4),zs[i]]],(x,yy)=>mod(Math.floor(yy),4)===0?P.ironHi:(i<4?P.glass:P.glassR));S.line([xs[i],4,zs[i]],[xs[i],76,zs[i]],i===4?P.iron:P.ironHi,.45);}
  }
  function bookingHall(S){
    S.box(1,15,4,72,0,28,brick(),brick(true),null);cornice(S,1,15,4,72,27);roof(S,.6,15.4,4,39,29,7);roof(S,.6,15.4,58,72,29,7);
    // Open roof section exposes an actual ticket hall; no second-stage retail.
    S.flat(2,14,39,58,1.5,(x,y)=>mod(Math.floor(x+y),4)<2?P.stone:P.white);
    S.box(10,13,41,55,2,7,P.wood,P.wood,P.stone);for(const y of[42,46,50,54]){S.box(10,13,y,y+.6,7,12,P.iron,P.iron,P.iron);S.box(10,10.5,y+.5,y+2,7,11,[P.glass,P.warm],[P.glassR,P.warm],P.iron);}
    for(const y of[11,23,35,63]){S.wall([15.05,y-2.2],[15.05,y+2.2],8,20,(_x,yy,z)=>mod(Math.floor(z),6)===0||Math.abs(yy-y)<.4?P.stone:[P.glassR,P.warm],.2);S.box(14.8,15.6,y-2.8,y+2.8,6.8,8,P.stone,P.stoneR,P.stone);}
    for(const y of[9,21,33,45,57,69])S.box(.4,1.2,y-.5,y+.5,0,29,P.stone,P.stoneR,P.stone);
    for(const y of[44,50,56])bench(S,3,y);
    // Clock tower is part of the station's booking wing, not a hotel frontage.
    S.box(2,14,65,77,0,66,brick(),brick(true),P.stone);cornice(S,2,14,65,77,28);cornice(S,2,14,65,77,47);cornice(S,2,14,65,77,65);roof(S,1.6,14.4,64.6,77.4,68,12);
    clock(S,3.1,12.9,77.05,51,60.8);S.wall([14.05,66.2],[14.05,75.8],51,60.8,(_x,y,z)=>{const d=Math.hypot(y-71,z-55.9);return d>4.8?null:d>4.1?P.gold:Math.abs(y-71)<.35&&z>55?P.dark:[P.white,P.warm];},.2);
    S.wall([4,77.1],[12,77.1],2,18,(x,_y,z)=>x<4.5||x>11.5||z>17?P.stone:(Math.abs(x-8)<.35?P.stone:P.dark),.1);
    for(const x of[3,13])lamp(S,x,78.2,15);
    S.box(4,12,77.2,78,21,24,P.wood,P.wood,P.wood);S.wall([4.2,78.05],[11.8,78.05],21.8,23.2,(x)=>mod(Math.floor(x*2),3)===0?P.white:P.wood,.15);
  }
  function passage(S){
    S.box(14,79,60,64,25,27,P.stone,P.stoneR,P.pave);for(const y of[60,64]){S.line([14,y,27],[79,y,27],P.iron,.8);S.line([14,y,31],[79,y,31],P.iron,.65);for(let x=15;x<79;x+=3)S.line([x,y,27],[x,y,31],P.iron,.35);}
    for(const x of[39,72]){for(let i=0;i<10;i++)S.box(x-2,x+2,64+i,65+i,3,25-i*2.2,P.stone,P.stoneR,P.pave);S.line([x-2.2,64,28],[x-2.2,74,6],P.iron,.5);S.line([x+2.2,64,28],[x+2.2,74,6],P.iron,.5);}
    for(const x of[19,33,47,65,78])S.box(x-.55,x+.55,60.5,61.5,3,25,P.iron,P.iron,P.iron);
  }
  function station(view){const S=scene(80,view);S.flat(0,80,0,80,0,paving);tracks(S);for(const [x,y]of[[35,15],[35,35],[67,18],[67,38]])bench(S,x,y);for(const [x,y]of[[40,8],[40,48],[72,8],[72,48]])lamp(S,x,y,17);passage(S);vault(S);bookingHall(S);for(const [x,y]of[[42,23],[74,23]]){S.box(x-.35,x+.35,y-.3,y+.3,3,15,P.iron,P.iron,P.iron);S.box(x-2,x+2,y-.5,y+.5,14,18,P.wood,P.wood,P.wood);S.wall([x-1.8,y+.55],[x+1.8,y+.55],15,17,P.white,.2);}return S.finish({sz:5,view,railCenters:[24,56],railAxis:'v',roofOpenEnd:[56,80],original:true});}
  function construction(stage,view){const S=scene(80,view);S.flat(0,80,0,80,0,(x,y)=>mod(Math.floor(x+y),7)<2?P.paveR:P.pave);if(stage>=1)tracks(S);if(stage>=2){S.box(1,15,4,72,0,stage===2?14:28,brick(),brick(true),null);S.box(2,14,65,77,0,stage===2?24:62,brick(),brick(true),null);}if(stage===3){vault(S,false);passage(S);roof(S,1,15,4,39,29,7);}for(const x of[1,15,78])for(let y=3;y<=77;y+=8){const z=stage===3?x===1?62:31:stage===2?25:8;S.line([x,y,0],[x,y,z],P.ironHi,.5);S.line([x,y,8],[x,Math.min(78,y+8),8],P.ironHi,.5);if(stage>=2)S.line([x,y,20],[x,Math.min(78,y+8),20],P.ironHi,.5);}for(const y of[1,79]){S.line([0,y,0],[80,y,0],P.wood,.8);for(let x=3;x<80;x+=7)S.box(x-.3,x+.3,y-.4,y+.4,0,4,P.wood,P.wood,P.wood);}for(const x of[4,70])lamp(S,x,76,10);S.box(4,12,4,8,0,4,P.stoneR,P.stoneR,P.stone);S.box(62,72,7,12,0,3,P.brick,P.brickR,P.brick);for(const y of[11,14,17])S.box(3,13,y,y+1,0,1.8,P.wood,P.wood,P.wood);return S.finish({sz:5,stage,view,original:true});}
  function module(theme,view){const S=scene(16,view,72,92);if(!['bus','taxi'].includes(theme))S.flat(0,16,0,16,0,paving);
    if(theme==='square'){for(const [x,y]of[[2,2],[12,12]]){S.box(x,x+2,y,y+2,0,1,P.stone,P.stoneR,P.stone);S.box(x+.2,x+1.8,y+.2,y+1.8,1,3,P.leaf,P.leaf,P.leaf);}bench(S,4,12);}
    if(theme==='entrance'||theme==='transfer'){for(const x of[2,13]){S.box(x,x+1.5,4,6,0,17,P.brick,P.brickR,P.stone);lamp(S,x+.7,5,18);}S.box(2,14.5,4,6,17,19,P.stone,P.stoneR,P.white);S.box(3,13,4.2,5.8,19,21,P.wood,P.wood,P.wood);S.wall([4,6.05],[12,6.05],19.2,20.8,(x)=>mod(Math.floor(x*2),3)===0?P.white:P.wood,.2);if(theme==='transfer'){S.line([4,9,1],[12,9,1],P.gold,.8);S.line([4,9,1],[6,7,1],P.gold,.8);S.line([12,9,1],[10,11,1],P.gold,.8);}}
    if(theme==='cycleParking'){for(const x of[2,13])for(const y of[3,13])S.box(x-.25,x+.25,y-.25,y+.25,0,11,P.iron,P.iron,P.iron);S.flat(1,14,2,14,12,P.wood);for(let y=4;y<13;y+=2){S.line([4,y,0],[4,y,3],P.ironHi,.6);S.line([4,y,3],[10,y,3],P.ironHi,.6);S.line([10,y,3],[10,y,0],P.ironHi,.6);}lamp(S,13,13,10);}
    if(theme==='cyclePath'){S.flat(2,14,0,16,.3,P.wood);for(let y=1;y<16;y+=4)S.flat(7.6,8.3,y,y+2,.5,P.white);S.line([3,0,.5],[3,16,.5],P.white,.3);S.line([13,0,.5],[13,16,.5],P.white,.3);}
    if(theme==='bus'||theme==='taxi'){S.flat(1,15,12,16,.3,paving);for(let x=2;x<15;x+=3)S.flat(x,x+1.5,2,8,.5,P.white);S.line([1,11,.6],[15,11,.6],P.gold,.6);for(const x of[2,13])S.box(x-.3,x+.3,13,13.6,0,11,P.iron,P.iron,P.iron);if(theme==='bus'){S.wall([2,14],[13,14],1,10,(x,_y,z)=>mod(Math.floor(x),4)===0||z>9?P.ironHi:P.glassR);S.flat(1,14,11.5,15,12,P.wood);bench(S,4,13);lamp(S,13,14,10);}else{S.box(12,13,14,15,0,13,P.iron,P.iron,P.iron);S.box(10,15,14,15,12,16,P.gold,P.stoneR,P.gold);S.wall([10.4,15.05],[14.6,15.05],13,15,(x)=>mod(Math.floor(x*2),3)===0?P.dark:P.gold,.15);}}
    return S.finish({sz:1,theme,view,original:true});}
  function buildAll(){const stationViews=Array.from({length:4},(_,v)=>station(v)),modules={},constructionViews={};for(const theme of['square','entrance','bus','taxi','cycleParking','cyclePath','transfer'])for(let v=0;v<4;v++)modules[theme+'_'+v]=module(theme,v);for(let stage=0;stage<4;stage++)for(let v=0;v<4;v++)constructionViews[stage+'_'+v]=construction(stage,v);return{station:stationViews,modules,construction:constructionViews};}
  root.BritishStationArchitecture008=Object.freeze({buildAll,version:'GPT-008',original:true,simulationRandomCalls:0});
})(typeof window==='undefined'?globalThis:window);
