/* GPT-014 shared original pixel-geometry primitives.
 * Source-copied from british-theatre-art013.js without modifying the old art.
 * One cell is 16 world units, x=ax+2i-2j, y=ay-32*sz+i+j-z.
 * All four views rotate complete geometry; one depth buffer owns day and night.
 * Only real glazing/fixtures emits. No screen glow, bitmap, fonts, RNG or state.
 * Source/parse work only; raster/runtime verification belongs to isolated CI.
 */
(function (root) {
  'use strict';
  const C = s => parseInt(s,16);
  const P = {
    brick:[C('a45c4c'),C('b36a52'),C('915144'),C('c18061')],
    brickR:[C('794a41'),C('895142'),C('6e423a'),C('995e49')],
    mortar:C('916955'),mortarR:C('705346'),
    stone:C('d4c7ac'),stoneHi:C('e3d5ba'),stoneR:C('b7aa93'),stoneD:C('948a77'),
    slate:C('52616a'),slateHi:C('657780'),slateR:C('40515c'),slateD:C('35464e'),
    iron:C('294a3e'),ironHi:C('4d6c58'),ironD:C('253a35'),ink:C('2b3837'),
    green:C('3d6150'),greenHi:C('527563'),greenD:C('29493f'),
    wood:C('a48a60'),woodHi:C('c3a97b'),woodR:C('7b674d'),woodD:C('655742'),
    glass:C('5a7880'),glassHi:C('8ca4a5'),glassR:C('3d5a63'),
    canopy:C('adc0b8'),canopyHi:C('cfdbca'),canopyR:C('819b98'),
    frame:C('dbd3bb'),frameR:C('b6b4a0'),lead:C('879490'),gold:C('cdb880'),
    pave:C('b4afa0'),paveHi:C('c1bbaa'),paveR:C('a4a495'),seam:C('969a91'),
    leaf:[C('426b42'),C('668a4e'),C('557945'),C('355c3d')],
    flower:[C('d894a5'),C('e0c25e'),C('ede1c5'),C('a67daf'),C('c46c86')],
    soil:C('695a48'),pot:C('b67d59'),potR:C('8e6249'),paper:C('e8dfc6'),
    burgundy:C('763d3f'),burgundyHi:C('995652'),burgundyD:C('512e34'),
    copper:C('62766b'),copperR:C('435d53'),copperHi:C('7a8a73'),
    warm:C('efc989'),warmHi:C('ffdfa1'),warmD:C('dba766')
  };
  const GLOW=[[P.glass,P.warm],[P.glassHi,P.warmHi],[P.glassR,P.warmD]];
  const LAMP=[C('dcca98'),P.warmHi];
  const mod=(n,d)=>((n%d)+d)%d;
  function hash(x,y,seed) {
    let n=Math.imul((x|0)^Math.imul(y|0,374761393),668265263)^(seed|0);
    n=Math.imul(n^(n>>>13),1274126177);
    return (n^(n>>>16))>>>0;
  }
  function Scene(sz,view,w,h) {
    const size=16*sz,ax=w/2,ay=h-2,oy=ay-2*size,count=w*h;
    const depth=new Float64Array(count),day=new Uint32Array(count),night=new Uint32Array(count);
    const occupied=new Uint8Array(count);
    depth.fill(-Infinity);
    function project(p) {
      let x=p[0],y=p[1];
      if(view===1){x=size-p[1];y=p[0];}
      else if(view===2){x=size-p[0];y=size-p[1];}
      else if(view===3){x=p[1];y=size-p[0];}
      return [ax+2*x-2*y,oy+x+y-p[2],x+y+2*p[2]];
    }
    function triangle(a,b,c,material,bias) {
      const A=project(a),B=project(b),D=project(c);
      const det=(B[1]-D[1])*(A[0]-D[0])+(D[0]-B[0])*(A[1]-D[1]);
      if(Math.abs(det)<1e-9)return;
      const x0=Math.max(0,Math.floor(Math.min(A[0],B[0],D[0])));
      const x1=Math.min(w-1,Math.ceil(Math.max(A[0],B[0],D[0])));
      const y0=Math.max(0,Math.floor(Math.min(A[1],B[1],D[1])));
      const y1=Math.min(h-1,Math.ceil(Math.max(A[1],B[1],D[1])));
      const sample=typeof material==='function';
      for(let py=y0;py<=y1;py++)for(let px=x0;px<=x1;px++){
        const u=((B[1]-D[1])*(px+.5-D[0])+(D[0]-B[0])*(py+.5-D[1]))/det;
        const v=((D[1]-A[1])*(px+.5-D[0])+(A[0]-D[0])*(py+.5-D[1]))/det,t=1-u-v;
        if(u<-.000001||v<-.000001||t<-.000001)continue;
        const z=A[2]*u+B[2]*v+D[2]*t+(bias||0),k=py*w+px;
        if(z<depth[k]-.000001)continue;
        const color=sample?material(a[0]*u+b[0]*v+c[0]*t,a[1]*u+b[1]*v+c[1]*t,a[2]*u+b[2]*v+c[2]*t):material;
        if(color===null||color===undefined)continue;
        depth[k]=z;occupied[k]=1;
        day[k]=Array.isArray(color)?color[0]:color;
        night[k]=Array.isArray(color)?color[1]||0:0;
      }
    }
    function poly(points,material,bias) {
      for(let i=1;i<points.length-1;i++)triangle(points[0],points[i],points[i+1],material,bias);
    }
    function flat(x0,x1,y0,y1,z,c,b) {
      poly([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]],c,b);
    }
    function wall(a,b,z0,z1,c,bias) {
      poly([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]],c,bias);
    }
    function box(x0,x1,y0,y1,z0,z1,front,side,top) {
      wall([x0,y0],[x1,y0],z0,z1,front);
      wall([x0,y1],[x1,y1],z0,z1,front);
      wall([x0,y0],[x0,y1],z0,z1,side===undefined?front:side);
      wall([x1,y0],[x1,y1],z0,z1,side===undefined?front:side);
      if(top!==null)flat(x0,x1,y0,y1,z1,top===undefined?front:top);
    }
    // Solid world-space rails, not screen-space strokes. Rotations keep real depth.
    function beam(a,b,c,width) {
      const t=(width===undefined?.35:width)/2,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
      if(len<.0001){box(a[0]-t,a[0]+t,a[1]-t,a[1]+t,Math.min(a[2],b[2]),Math.max(a[2],b[2]),c,c,c);return;}
      const nx=-dy/len*t,ny=dx/len*t;
      const q=[[a[0]+nx,a[1]+ny,a[2]-t],[b[0]+nx,b[1]+ny,b[2]-t],[b[0]-nx,b[1]-ny,b[2]-t],[a[0]-nx,a[1]-ny,a[2]-t]];
      const r=q.map(p=>[p[0],p[1],p[2]+2*t]);
      poly(r,c);poly(q,c);
      for(let i=0;i<4;i++)poly([q[i],q[(i+1)%4],r[(i+1)%4],r[i]],c);
    }
    function face(a,b,nx,ny) {
      const length=Math.hypot(b[0]-a[0],b[1]-a[1]),tx=(b[0]-a[0])/length,ty=(b[1]-a[1])/length;
      const point=(u,d,z)=>[a[0]+tx*u+nx*d,a[1]+ty*u+ny*d,z];
      function panel(u0,u1,z0,z1,mat,d,bias) {
        d=d===undefined?.06:d;
        poly([point(u0,d,z0),point(u1,d,z0),point(u1,d,z1),point(u0,d,z1)],
          typeof mat==='function'?(x,y,z)=>mat((x-a[0])*tx+(y-a[1])*ty-u0,z-z0):mat,bias===undefined?.025:bias);
      }
      function block(u0,u1,d0,d1,z0,z1,c,r,top) {
        const A=point(u0,d0,0),B=point(u1,d1,0);
        box(Math.min(A[0],B[0]),Math.max(A[0],B[0]),Math.min(A[1],B[1]),Math.max(A[1],B[1]),z0,z1,c,r,top);
      }
      return {length,point,panel,block,polygon:(points,c)=>poly(points,c,.03)};
    }
    function finish(meta) {
      const make=emissive=>{
        const img=document.createElement('canvas');img.width=w;img.height=h;
        const context=img.getContext('2d'),pixels=context.createImageData(w,h);
        for(let k=0;k<count;k++){
          if(!occupied[k]||(emissive&&!night[k]))continue;
          const c=emissive?night[k]:day[k],i=k*4;
          pixels.data[i]=c>>>16;pixels.data[i+1]=(c>>>8)&255;pixels.data[i+2]=c&255;pixels.data[i+3]=255;
        }
        context.putImageData(pixels,0,0);return img;
      };
      return Object.assign({img:make(false),night:make(true),w,h,ax,ay,sz,view,original:true},meta);
    }
    return {poly,flat,wall,box,beam,face,finish};
  }


  function brick(right,seed) {
    return (x,y,z)=>{
      const u=right?y:x,row=Math.floor(z/1.5),phase=(row&1)*1.45;
      if(mod(z,1.5)<.14||mod(u+phase,2.9)<.12)return right?P.mortarR:P.mortar;
      const n=hash(Math.floor((u+phase)/2.9),row,seed);
      return (right?P.brickR:P.brick)[n%17===0?3:n%7===0?2:n%5===0?1:0];
    };
  }
  function paving(x,y) {
    const row=Math.floor(y/3),u=x+(row&1)*2.25;
    if(mod(y,3)<.14||mod(u,4.5)<.13)return P.seam;
    const n=hash(Math.floor(u/4.5),row,12012);
    return n%11===0?P.paveHi:n%7===0?P.paveR:P.pave;
  }
  function slate(right) {
    return (x,y,z)=>{
      const row=Math.floor(z/1.0);
      if(mod(z,1)<.11||mod(x+y+(row&1)*1.3,2.6)<.13)return P.slateD;
      return right?P.slateR:hash(Math.floor(x),row,1208)%19===0?P.slateHi:P.slate;
    };
  }
  function band(S,x0,x1,y0,y1,z,h) {
    S.box(x0-.2,x1+.2,y0-.2,y1+.2,z,z+h,P.stone,P.stoneR,P.stoneHi);
  }
  function masonry(S,x0,x1,y0,y1,z0,z1,seed) {
    S.box(x0,x1,y0,y1,z0,z1,brick(false,seed),brick(true,seed),P.stoneD);
    return {front:S.face([x0,y1],[x1,y1],0,1),back:S.face([x1,y0],[x0,y0],0,-1),
      right:S.face([x1,y1],[x1,y0],1,0),left:S.face([x0,y0],[x0,y1],-1,0)};
  }
  function cylinder(S,x,y,z0,z1,r0,r1,c,side,top,n) {
    n=n||8;
    const ring=[];
    for(let i=0;i<n;i++){
      const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n;
      const A=[x+Math.cos(a)*r0,y+Math.sin(a)*r0,z0],B=[x+Math.cos(b)*r0,y+Math.sin(b)*r0,z0];
      const C1=[x+Math.cos(b)*r1,y+Math.sin(b)*r1,z1],D=[x+Math.cos(a)*r1,y+Math.sin(a)*r1,z1];
      S.poly([A,B,C1,D],i<n/2?c:side);ring.push(D);
    }
    if(top!==null)S.poly(ring,top===undefined?c:top);
  }
  function ring(S,F,u,z,rx,rz,thick,d,c,n) {
    n=n||16;
    for(let i=0;i<n;i++){
      const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n;
      S.poly([F.point(u+Math.cos(a)*rx,d,z+Math.sin(a)*rz),F.point(u+Math.cos(b)*rx,d,z+Math.sin(b)*rz),
        F.point(u+Math.cos(b)*(rx-thick),d,z+Math.sin(b)*(rz-thick)),F.point(u+Math.cos(a)*(rx-thick),d,z+Math.sin(a)*(rz-thick))],c,.035);
    }
  }

  function sash(S,F,u,z,w,h,lit) {
    F.panel(u-.28,u+w+.28,z-.15,z+h+.35,P.stoneD,.08);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      if(x<.25||x>w-.25||y<.28||y>h-.28)return P.frame;
      if(Math.abs(x-w/2)<.11||Math.abs(y-h/2)<.22)return P.frame;
      if(Math.abs(y-h*.25)<.095||Math.abs(y-h*.75)<.095)return P.frameR;
      if(!lit||y<h*.19)return P.glassR;
      return y>h/2?GLOW[0]:GLOW[2];
    },.13);
    F.block(u-.45,u+w+.45,0,.64,z-.55,z-.12,P.stone,P.stoneR,P.stoneHi);
    F.block(u-.36,u+w+.36,0,.32,z+h+.18,z+h+.72,P.stone,P.stoneR,P.stoneHi);
    // Flat brick heads have individually pointed joints and a pale central key.
    for(let i=0;i<7;i++)F.panel(u-.35+i*(w+.7)/7,u-.39+(i+1)*(w+.7)/7,z+h+.75,z+h+1.5,i%2?P.brick[1]:P.brick[0],.09);
    F.panel(u+w/2-.28,u+w/2+.28,z+h+.6,z+h+1.58,P.stoneHi,.16);
  }
  function hippedRoof(S,x0,x1,y0,y1,z,rise,ridgeAlongX) {
    const cx=(x0+x1)/2,cy=(y0+y1)/2;
    if(ridgeAlongX){
      const inset=Math.min((y1-y0)/2,(x1-x0)/3),a=x0+inset,b=x1-inset;
      S.poly([[x0,y0,z],[x1,y0,z],[b,cy,z+rise],[a,cy,z+rise]],slate(true));
      S.poly([[x0,y1,z],[a,cy,z+rise],[b,cy,z+rise],[x1,y1,z]],slate(false));
      S.poly([[x0,y0,z],[a,cy,z+rise],[x0,y1,z]],slate(false));
      S.poly([[x1,y0,z],[x1,y1,z],[b,cy,z+rise]],slate(true));
      S.beam([a,cy,z+rise+.08],[b,cy,z+rise+.08],P.lead,.35);
      for(const [x,xx]of[[x0,a],[x1,b]])for(const y of[y0,y1])S.beam([x,y,z+.06],[xx,cy,z+rise+.06],P.slateHi,.17);
    }else{
      const inset=Math.min((x1-x0)/2,(y1-y0)/3),a=y0+inset,b=y1-inset;
      S.poly([[x0,y0,z],[cx,a,z+rise],[cx,b,z+rise],[x0,y1,z]],slate(false));
      S.poly([[x1,y0,z],[x1,y1,z],[cx,b,z+rise],[cx,a,z+rise]],slate(true));
      S.poly([[x0,y0,z],[x1,y0,z],[cx,a,z+rise]],slate(true));
      S.poly([[x0,y1,z],[cx,b,z+rise],[x1,y1,z]],slate(false));
      S.beam([cx,a,z+rise+.08],[cx,b,z+rise+.08],P.lead,.35);
      for(const [y,yy]of[[y0,a],[y1,b]])for(const x of[x0,x1])S.beam([x,y,z+.06],[cx,yy,z+rise+.06],P.slateHi,.17);
    }
    for(const y of[y0,y1])S.beam([x0,y,z],[x1,y,z],P.ironD,.35);
    for(const x of[x0,x1])S.beam([x,y0,z],[x,y1,z],P.ironD,.35);
  }
  function rainpipe(S,x,y,h) {
    S.beam([x,y,.45],[x,y,h],P.ironD,.26);
    for(const z of[3.5,9.5,18,25])if(z<h)S.box(x-.22,x+.22,y-.22,y+.22,z,z+.24,P.ironHi,P.iron,P.ironHi);
    S.beam([x,y,.5],[x+.42,y,.2],P.ironD,.29);
  }
  function lantern(S,x,y,z,post) {
    if(post){
      S.box(x-.54,x+.54,y-.54,y+.54,0,.7,P.stone,P.stoneR,P.stoneHi);
      cylinder(S,x,y,.7,2,.29,.22,P.ironHi,P.ironD,P.iron,6);
      cylinder(S,x,y,2,z,.18,.13,P.iron,P.ironD,P.ironHi,6);
      S.box(x-.29,x+.29,y-.29,y+.29,z-.45,z,P.ironHi,P.ironD,P.ironHi);
    }
    S.box(x-.57,x+.57,y-.57,y+.57,z,z+2.1,P.iron,P.ironD,P.iron);
    S.box(x-.36,x+.36,y-.60,y+.60,z+.3,z+1.76,LAMP,LAMP,P.iron);
    S.box(x-.60,x+.60,y-.36,y+.36,z+.3,z+1.76,LAMP,LAMP,P.iron);
    for(const xx of[x-.41,x+.41])for(const yy of[y-.41,y+.41])S.beam([xx,yy,z+.2],[xx,yy,z+1.9],P.ironD,.15);
    for(const [a,b]of[[[x-.76,y-.76],[x+.76,y-.76]],[[x+.76,y-.76],[x+.76,y+.76]],[[x+.76,y+.76],[x-.76,y+.76]],[[x-.76,y+.76],[x-.76,y-.76]]])
      S.poly([[a[0],a[1],z+2.05],[b[0],b[1],z+2.05],[x,y,z+3.05]],P.ironD);
    S.beam([x,y,z+2.9],[x,y,z+3.6],P.iron,.22);
  }
  function wallLamp(S,F,u,z) {
    S.beam(F.point(u,.15,z-1.5),F.point(u,1.0,z),P.iron,.24);
    const p=F.point(u,1,z);lantern(S,p[0],p[1],p[2],false);
  }
  function leafRelief(S,F,u,z,h,d,col) {
    const p=(x,y)=>F.point(u+x,d,z+y),c=col||P.stoneHi;
    S.beam(p(0,0),p(0,h),c,.18);
    for(let i=1;i<4;i++)for(const sign of[-1,1]){
      const yy=i*h/4,w=(i===2?.32:.25)*h;
      S.poly([p(0,yy-.2),p(sign*w,yy+.12),p(sign*w*.68,yy+.58),p(0,yy+.35)],c,.05);
    }
  }
  function blossom(S,x,y,z,r,col) {
    for(let k=0;k<5;k++){
      const a=k*Math.PI*2/5,cx=x+Math.cos(a)*r*.54,cy=y+Math.sin(a)*r*.54;
      S.poly([[cx-r*.4,cy,z],[cx,cy-r*.42,z+.14],[cx+r*.4,cy,z+.18],[cx,cy+r*.42,z+.08]],col);
    }
    S.box(x-r*.13,x+r*.13,y-r*.13,y+r*.13,z+.13,z+.32,P.gold,P.gold,P.paper);
  }
  function pottedPlant(S,x,y,z,scale,col) {
    const s=scale||1;
    cylinder(S,x,y,z,z+1.7*s,.43*s,.73*s,P.pot,P.potR,P.soil,8);
    cylinder(S,x,y,z+1.43*s,z+1.85*s,.8*s,.8*s,P.pot,P.potR,P.soil,8);
    for(let k=0;k<6;k++){
      const a=k*Math.PI/3,xx=x+Math.cos(a)*1.0*s,yy=y+Math.sin(a)*1.0*s;
      S.beam([x,y,z+1.7*s],[xx,yy,z+3.0*s],P.leaf[3],.15*s);
      S.poly([[x,y,z+2*s],[xx-.25*s,yy-.18*s,z+2.7*s],[xx,yy,z+3.5*s],[xx+.3*s,yy+.15*s,z+2.9*s]],P.leaf[k%4]);
      if(k%2===0)blossom(S,xx,yy,z+3.4*s,.52*s,col||P.flower[4]);
    }
  }
  function ironRail(S,a,b,z,h) {
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),n=Math.max(1,Math.floor(len/1.10));
    const tx=dx/len,ty=dy/len;
    for(let i=0;i<=n;i++){
      const x=a[0]+dx*i/n,y=a[1]+dy*i/n;
      S.beam([x,y,z],[x,y,z+h],P.ironD,.18);
      // Leaf tips are true world-space diamonds in the railing plane.
      S.poly([[x-tx*.26,y-ty*.26,z+h-.15],[x,y,z+h+.62],[x+tx*.26,y+ty*.26,z+h-.15],[x,y,z+h-.52]],P.iron);
    }
    for(const zz of[z+.65,z+h-.70])S.beam([a[0],a[1],zz],[b[0],b[1],zz],P.iron,.26);
    for(const t of[0,.5,1]){
      const x=a[0]+dx*t,y=a[1]+dy*t;
      S.box(x-.20,x+.20,y-.20,y+.20,z,z+h+.32,P.iron,P.ironD,P.ironHi);
      cylinder(S,x,y,z+h+.28,z+h+.7,.29,.10,P.ironHi,P.ironD,P.ironHi,6);
    }
    // Restrained cast rings between the long rails, with no solid panel behind.
    const F=S.face(a,b,-ty,tx);
    for(let u=2.6;u<len-1.0;u+=4.4)ring(S,F,u,z+h*.49,.69,.82,.15,.04,P.ironHi,12);
  }
  function bench(S,x,y,length,flip) {
    const q=flip?-1:1,lo=Math.min(x,x+q*2.1),hi=Math.max(x,x+q*2.1);
    for(const yy of[y+.5,y+length-.5]){
      S.beam([x+q*.15,yy,.2],[x+q*.55,yy,2.45],P.iron,.30);
      S.beam([x+q*1.9,yy,.2],[x+q*1.55,yy,2.45],P.iron,.30);
      S.beam([x,yy,1.1],[x-q*.22,yy,4.9],P.iron,.27);
      S.beam([x-q*.07,yy,3.4],[x+q*1.85,yy,3.4],P.iron,.25);
      S.beam([x+q*1.85,yy,2.45],[x+q*1.85,yy,3.4],P.iron,.22);
    }
    for(let i=0;i<3;i++){
      const xx=x+q*(.25+i*.68);
      S.box(xx-.25,xx+.25,y,y+length,2.3,2.73,P.wood,P.woodR,P.woodHi);
    }
    for(const z of[3.3,4.25])S.box(x-q*.2-.19,x-q*.2+.19,y,y+length,z,z+.53,P.wood,P.woodR,P.woodHi);
    S.beam([lo+.2,y+.5,1.3],[hi-.2,y+.5,1.3],P.ironD,.22);
  }
  function cornice(S,x0,x1,y0,y1,z) {
    band(S,x0,x1,y0,y1,z-.95,.48);
    S.box(x0-.4,x1+.4,y0-.4,y1+.4,z-.47,z+.12,P.stoneD,P.stoneR,P.stone);
    S.box(x0-.68,x1+.68,y0-.65,y1+.65,z+.12,z+.67,P.stone,P.stoneR,P.stoneHi);
    const faces=[S.face([x0,y1],[x1,y1],0,1),S.face([x1,y0],[x0,y0],0,-1),
      S.face([x1,y1],[x1,y0],1,0),S.face([x0,y0],[x0,y1],-1,0)];
    for(const F of faces)for(let u=.35;u<F.length-.4;u+=1.65)
      F.block(u,u+.5,.07,.49,z-1.55,z-.94,P.stone,P.stoneR,P.stoneHi);
  }
  function pilaster(S,F,u,z,h,w) {
    F.block(u-w/2,u+w/2,.02,.52,z,z+h,P.stone,P.stoneR,P.stoneHi);
    F.block(u-w*.68,u+w*.68,.04,.79,z,z+.9,P.stone,P.stoneR,P.stoneHi);
    F.block(u-w*.58,u+w*.58,.03,.68,z+h-1.75,z+h-.7,P.stone,P.stoneR,P.stoneHi);
    F.block(u-w*.77,u+w*.77,.02,.92,z+h-.7,z+h+.2,P.stone,P.stoneR,P.stoneHi);
    for(const q of[-.27,0,.27])F.panel(u+w*q-.07,u+w*q+.07,z+2,z+h-2.4,P.stoneD,.535);
    leafRelief(S,F,u,z+h-1.6,1.25,.81,P.stoneHi);
  }
  function archWindow(S,F,u,z,w,h,lit) {
    const r=w/2,spring=h-r,c=u+r;
    // The dark reveal, glazing, mullions and individually jointed arch stones
    // occupy the arched silhouette only; no glowing rectangle hides behind it.
    const arch=(left,right,bottom,top,mat,d)=>{
      const ww=right-left,rr=ww/2,sp=top-rr,mid=(left+right)/2;
      const q=[F.point(left,d,bottom),F.point(right,d,bottom),F.point(right,d,sp)];
      for(let i=1;i<=18;i++){const a=i*Math.PI/18;q.push(F.point(mid+Math.cos(a)*rr,d,sp+Math.sin(a)*rr));}
      S.poly(q,mat,.04);
    };
    arch(u-.45,u+w+.45,z-.18,z+h+.45,P.stoneD,.08);
    arch(u,u+w,z,z+h,(x,y,zz)=>{
      const base=F.point(u,.15,z),q=F.point(u+1,.15,z),dx=q[0]-base[0],dy=q[1]-base[1];
      const xx=(x-base[0])*dx+(y-base[1])*dy,yy=zz-z;
      if(xx<.24||xx>w-.24||yy<.28)return P.frame;
      if(Math.abs(xx-w/2)<.17||Math.abs(xx-w/4)<.105||Math.abs(xx-w*.75)<.105)return P.frame;
      if(Math.abs(yy-spring)<.18||Math.abs(yy-h*.43)<.15||Math.abs(yy-h*.18)<.13)return P.frameR;
      if(yy<spring&&((xx<w*.2)||(xx>w*.8)))return P.burgundyD;
      if(yy>spring&&mod(Math.atan2(yy-spring,xx-r)*r,2.1)<.13)return P.frame;
      return lit?(xx<w/2?GLOW[0]:GLOW[2]):xx<w/2?P.glassHi:P.glassR;
    },.15);
    for(const a of[u-.65,u+w+.08])F.block(a,a+.57,.02,.53,z-.35,z+spring,P.stone,P.stoneR,P.stoneHi);
    for(let i=0;i<13;i++){
      const a=i*Math.PI/13+.012,b=(i+1)*Math.PI/13-.012;
      S.poly([F.point(c+Math.cos(a)*(r+.7),.36,z+spring+Math.sin(a)*(r+.7)),
        F.point(c+Math.cos(b)*(r+.7),.36,z+spring+Math.sin(b)*(r+.7)),
        F.point(c+Math.cos(b)*r,.36,z+spring+Math.sin(b)*r),
        F.point(c+Math.cos(a)*r,.36,z+spring+Math.sin(a)*r)],i%3===0?P.stoneHi:P.stone,.055);
    }
    F.block(c-.45,c+.45,.12,.72,z+h-.22,z+h+1.05,P.stone,P.stoneR,P.stoneHi);
    F.block(u-.82,u+w+.82,0,.87,z-.84,z-.26,P.stone,P.stoneR,P.stoneHi);
    for(const x of[u+.65,u+w-1.15])F.block(x,x+.5,.1,.58,z-1.5,z-.86,P.stone,P.stoneR,P.stoneHi);
  }
  function timberDoor(F,u,z,w,h,lit) {
    F.block(u-.42,u+w+.42,.02,.3,z,z+h+.5,P.stone,P.stoneR,P.stoneHi);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      if(x<.22||x>w-.22||Math.abs(x-w/2)<.17||y<.2||y>h-.2)return P.woodD;
      if(y>h*.69){
        if(Math.abs(y-h*.72)<.13||Math.abs(x-w*.25)<.13||Math.abs(x-w*.75)<.13)return P.woodR;
        return lit?GLOW[2]:P.glassR;
      }
      const q=mod(x,w/2);
      if(q<.4||q>w/2-.4||Math.abs(y-h*.37)<.16)return P.woodHi;
      if(y<h*.17||y>h*.59)return P.woodR;
      if(Math.abs(x-w/2)<.57&&y>h*.39&&y<h*.51)return P.gold;
      return P.wood;
    },.36);
    F.block(u-.45,u+w+.45,.05,.75,z-.15,z+.15,P.stone,P.stoneR,P.stoneHi);
  }

  // Warm ashlar is coursed in world coordinates; no screen-oriented noise.
  function ashlar(right,seed) {
    return (x,y,z)=>{
      const u=right?y:x,row=Math.floor(z/2.3),q=u+(row&1)*2.7;
      if(mod(z,2.3)<.13||mod(q,5.4)<.13)return right?P.stoneD:P.stoneR;
      const n=hash(Math.floor(q/5.4),row,seed||14014);
      return right?(n%11===0?P.stoneD:P.stoneR):(n%13===0?P.stoneHi:P.stone);
    };
  }
  function stoneBlock(S,x0,x1,y0,y1,z0,z1,seed) {
    S.box(x0,x1,y0,y1,z0,z1,ashlar(false,seed),ashlar(true,seed),P.stoneHi);
    return {front:S.face([x0,y1],[x1,y1],0,1),back:S.face([x1,y0],[x0,y0],0,-1),
      right:S.face([x1,y1],[x1,y0],1,0),left:S.face([x0,y0],[x0,y1],-1,0)};
  }
  function gableRoof(S,x0,x1,y0,y1,z,rise,ridgeAlongX,roofMat,gableMat) {
    const cx=(x0+x1)/2,cy=(y0+y1)/2,front=roofMat||slate(false),side=roofMat||slate(true),gable=gableMat||ashlar(false,140);
    if(ridgeAlongX){
      S.poly([[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]],side);
      S.poly([[x0,y1,z],[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z]],front);
      for(const x of[x0,x1])S.poly([[x,y0,z],[x,y1,z],[x,cy,z+rise]],gable);
      S.beam([x0,cy,z+rise+.05],[x1,cy,z+rise+.05],P.lead,.3);
    }else{
      S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],front);
      S.poly([[x1,y0,z],[x1,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],side);
      for(const y of[y0,y1])S.poly([[x0,y,z],[x1,y,z],[cx,y,z+rise]],gable);
      S.beam([cx,y0,z+rise+.05],[cx,y1,z+rise+.05],P.lead,.3);
    }
    for(const y of[y0,y1])S.beam([x0,y,z],[x1,y,z],P.ironD,.3);
    for(const x of[x0,x1])S.beam([x,y0,z],[x,y1,z],P.ironD,.3);
  }
  function grass(x,y) {
    const n=hash(Math.floor(x*1.7),Math.floor(y*1.7),1457);
    return n%31===0?P.leaf[1]:n%11===0?P.leaf[0]:C('63814a');
  }
  function hedge(S,x0,x1,y0,y1,z,h) {
    const texture=(x,y,zz)=>{const n=hash(Math.floor(x*2+y),Math.floor(zz*2),1439);return P.leaf[n%17===0?1:n%5===0?0:3];};
    S.box(x0,x1,y0,y1,z,z+h,texture,texture,(x,y)=>hash(Math.floor(x*2),Math.floor(y*2),1459)%7===0?P.leaf[1]:P.leaf[2]);
    S.box(x0+.2,x1-.2,y0+.2,y1-.2,z+h,z+h+.28,P.leaf[0],P.leaf[3],P.leaf[2]);
  }
  root.BritishComplexPrimitives014=Object.freeze({Scene,P,C,mod,hash,GLOW,LAMP,brick,paving,slate,band,masonry,cylinder,ring,
    sash,hippedRoof,rainpipe,lantern,wallLamp,leafRelief,blossom,pottedPlant,ironRail,bench,cornice,pilaster,archWindow,timberDoor,
    ashlar,stoneBlock,gableRoof,hedge,grass});
})(typeof window==='undefined'?globalThis:window);
