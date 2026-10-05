/* GPT-012: original British riverside market and native walking-path furniture.
 * Design evidence (Historic England list entries, consulted 2026-10-05):
 * https://historicengland.org.uk/listing/the-list/list-entry/1286182
 *   Leadenhall: brick/Portland-stone shop fronts, cast iron and glass canopies.
 * https://historicengland.org.uk/listing/the-list/list-entry/1358951
 *   Greenwich entrance: two storeys, five bays, open passage and sash windows.
 * https://historicengland.org.uk/listing/the-list/list-entry/1419872
 *   Custom House Quay: granite coping and stairs parallel to the river wall.
 * https://historicengland.org.uk/listing/the-list/list-entry/1455446
 *   Hayle: battered masonry retaining faces and substantial stone coping.
 * https://historicengland.org.uk/listing/the-list/list-entry/1078922
 *   Greenwich boundary: stone plinth, ornamental iron railings and lamp piers.
 * This is an original composite, NOT a surveyed reconstruction or imported art.
 *
 * Spatial contract: the roof-free principal court is x=9..39, y=12..47,
 * 1,050 / 2,304 square units (45.57% of the native 3x3 footprint). Low
 * single-storey wings and a two-storey five-bay rear range form a genuine U;
 * nothing spans the courtyard. A through-passage is modeled as missing solids.
 * Stalls, carts and furniture sit at the court edges, leaving its middle open.
 * Four cameras rotate the same complete world-space geometry, never an image.
 * Native 2:1 grid: x=ax+2i-2j, y=ay-32*sz+i+j-z; one tile is 16 units.
 * The shared opaque depth buffer is adapted from british-museum-art010.js.
 * Day surfaces and only their physically exposed lamps/window panes contribute
 * to emission together, so an opaque arch, canopy, shutter or rail removes the
 * night pixel behind it. Glass is pale colored geometry, not an emissive roof.
 * No fonts, imported images, simulation state, storage, RNG or mutable cache.
 */
(function (root) {
  'use strict';
  const C = s => parseInt(s,16);
  const P = {
    brick:[C('ab6651'),C('b37259'),C('985d4c'),C('bb7e62')],
    brickR:[C('805046'),C('915c4b'),C('774a40'),C('9c6752')],
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
    granite:C('969d98'),graniteHi:C('b0b5aa'),graniteR:C('747f7b'),graniteD:C('62716d'),
    leaf:[C('426b42'),C('668a4e'),C('557945'),C('355c3d')],
    flower:[C('d894a5'),C('e0c25e'),C('ede1c5'),C('a67daf'),C('c46c86')],
    apple:C('a45f4d'),appleHi:C('d39065'),pear:C('b1b55b'),carrot:C('c18a46'),
    cabbage:C('78955e'),soil:C('695a48'),pot:C('b67d59'),potR:C('8e6249'),
    zinc:C('8d9e98'),zincR:C('677e7a'),paper:C('e8dfc6'),
    canvas:C('e0d6b7'),canvasD:C('b9b099'),canvasGreen:C('768b6c'),canvasRose:C('b67e83'),
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
  function granite(right) {
    return (x,y,z)=>{
      const u=right?y:x,row=Math.floor(z/1.55);
      if(mod(z,1.55)<.11||mod(u+(row&1)*2.5,5)<.13)return P.graniteD;
      const n=hash(Math.floor(u*2),Math.floor(z*3),129);
      return n%23===0?P.graniteHi:right?P.graniteR:P.granite;
    };
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
  const GLYPHS={
    A:['010','101','111','101','101'],B:['110','101','110','101','110'],
    C:['011','100','100','100','011'],D:['110','101','101','101','110'],
    E:['111','100','110','100','111'],F:['111','100','110','100','100'],
    G:['011','100','101','101','011'],H:['101','101','111','101','101'],
    I:['111','010','010','010','111'],K:['101','101','110','101','101'],
    L:['100','100','100','100','111'],M:['101','111','111','101','101'],
    N:['101','111','111','111','101'],O:['010','101','101','101','010'],
    P:['110','101','110','100','100'],R:['110','101','110','101','101'],
    S:['011','100','010','001','110'],T:['111','010','010','010','010'],
    U:['101','101','101','101','111'],V:['101','101','101','101','010'],
    W:['101','101','111','111','101'],Y:['101','101','010','010','010'],
    ' ':['000','000','000','000','000']
  };
  function letters(F,text,u,z,unit,col,d) {
    for(let i=0;i<text.length;i++){
      const g=GLYPHS[text[i]]||GLYPHS[' '];
      for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(g[y][x]==='1')
        F.panel(u+(i*4+x)*unit,u+(i*4+x+1)*unit,z+(4-y)*unit*1.6,z+(5-y)*unit*1.6,col,d,.075);
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
  function shopDoor(F,u,z,w,h,lit) {
    F.panel(u-.3,u+w+.3,z,z+h+.45,P.woodD,.035);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      if(x<.2||x>w-.2||y<.25||y>h-.25||Math.abs(x-w/2)<.13)return P.greenD;
      if(y>h*.58)return Math.abs(y-h*.79)<.13||mod(x,1.3)<.12?P.frameR:lit?GLOW[2]:P.glassR;
      if(y>h*.20&&y<h*.47)return P.greenHi;
      if(y>h*.48&&y<h*.55&&Math.abs(x-w*.7)<.2)return P.gold;
      return P.green;
    },.10);
    F.block(u-.32,u+w+.32,-.1,.55,z-.15,z+.18,P.stone,P.stoneR,P.stoneHi);
  }
  function shutter(F,u,z,w,h) {
    F.panel(u,u+w,z,z+h,(x,y)=>mod(x,1.25)<.12?P.greenD:y<.5||y>h-.5?P.greenHi:P.green,.16);
    for(const zz of[z+1,z+h-1.3])F.panel(u+.2,u+w-.2,zz,zz+.32,P.ironD,.2);
    F.panel(u+w*.44,u+w*.56,z+h*.43,z+h*.57,P.gold,.23);
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
  function chimney(S,x,y,z) {
    S.box(x-.65,x+.65,y-.65,y+.65,z,z+3.8,brick(false,28),brick(true,28),P.brick[1]);
    S.box(x-.84,x+.84,y-.84,y+.84,z+3.3,z+4.0,P.stoneD,P.stoneR,P.stone);
    for(const xx of[x-.4,x+.4])cylinder(S,xx,y,z+4,z+5.7,.27,.31,P.pot,P.potR,P.ink,6);
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

  // A real load-bearing masonry arch: no rectangle is painted over its opening.
  // Front and back spandrels plus the intrados give it thickness in every view.
  function arcadeArch(S,F,u,w,spring,top,depth,seed) {
    const r=w/2,c=u+r,segments=14;
    for(const [a,b]of[[u-.72,u],[u+w,u+w+.72]]){
      F.block(a,b,-depth,0,.35,top,brick(false,seed),brick(true,seed),P.stone);
      F.block(a-.09,b+.09,-depth-.08,.12,.35,1.1,P.stone,P.stoneR,P.stoneHi);
      F.block(a-.11,b+.11,-depth-.10,.19,spring-.48,spring+.17,P.stone,P.stoneR,P.stoneHi);
    }
    for(let i=0;i<segments;i++){
      const a=i*Math.PI/segments,b=(i+1)*Math.PI/segments;
      const xa=c+Math.cos(a)*r,xb=c+Math.cos(b)*r,za=spring+Math.sin(a)*r,zb=spring+Math.sin(b)*r;
      for(const d of[-depth,0])S.poly([F.point(xa,d,za),F.point(xb,d,zb),F.point(xb,d,top),F.point(xa,d,top)],d?P.brickR[0]:P.brick[0]);
      S.poly([F.point(xa,-depth,za),F.point(xb,-depth,zb),F.point(xb,0,zb),F.point(xa,0,za)],P.brickR[2]);
      const aa=a+.018,bb=b-.018;
      for(const d of[.08,-depth-.08])S.poly([
        F.point(c+Math.cos(aa)*(r+.65),d,spring+Math.sin(aa)*(r+.65)),
        F.point(c+Math.cos(bb)*(r+.65),d,spring+Math.sin(bb)*(r+.65)),
        F.point(c+Math.cos(bb)*r,d,spring+Math.sin(bb)*r),
        F.point(c+Math.cos(aa)*r,d,spring+Math.sin(aa)*r)
      ],i===6||i===7?P.stoneHi:i%3===0?P.brick[3]:P.brick[1],.035);
    }
    F.block(c-.3,c+.3,-.02,.29,spring+r-.15,spring+r+1.0,P.stone,P.stoneR,P.stoneHi);
  }
  function leafRelief(S,F,u,z,h,d,col) {
    const p=(x,y)=>F.point(u+x,d,z+y),c=col||P.stoneHi;
    S.beam(p(0,0),p(0,h),c,.18);
    for(let i=1;i<4;i++)for(const sign of[-1,1]){
      const yy=i*h/4,w=(i===2?.32:.25)*h;
      S.poly([p(0,yy-.2),p(sign*w,yy+.12),p(sign*w*.68,yy+.58),p(0,yy+.35)],c,.05);
    }
  }
  function produceFrieze(S,F,u,z,w) {
    F.panel(u,u+w,z,z+2.25,P.stoneR,.12);
    F.panel(u+.12,u+w-.12,z+.18,z+2.08,P.stone,.16);
    const cx=u+w/2;
    // A sheaf and a pair of rounded fruits: carved stone, never luminous signs.
    for(const off of[-1.8,-1.35,1.35,1.8])leafRelief(S,F,cx+off,z+.3,1.65,.22,P.stoneHi);
    for(const [off,r]of[[-.47,.55],[.42,.64]]){
      const pts=[];
      for(let i=0;i<10;i++){const a=i*Math.PI/5;pts.push(F.point(cx+off+Math.cos(a)*r,.25,z+.91+Math.sin(a)*r));}
      S.poly(pts,P.stoneD,.04);
      S.poly(pts.map(p=>[p[0],p[1],p[2]+.12]),P.stoneHi,.055);
      S.beam(F.point(cx+off,.26,z+1.37),F.point(cx+off+.1,.26,z+1.73),P.stoneD,.14);
    }
  }
  function canopy(S,F,u0,u1,projection,innerZ,outerZ,spacing) {
    const n=Math.max(1,Math.round((u1-u0)/(spacing||4.1))),step=(u1-u0)/n;
    // Long slender panels remain confined to the arcade perimeter. No center roof.
    for(let i=0;i<n;i++){
      const a=u0+i*step,b=a+step;
      for(let j=0;j<2;j++){
        const d0=projection*j/2,d1=projection*(j+1)/2,z0=innerZ+(outerZ-innerZ)*j/2,z1=innerZ+(outerZ-innerZ)*(j+1)/2;
        S.poly([F.point(a,d0,z0),F.point(b,d0,z0),F.point(b,d1,z1),F.point(a,d1,z1)],i%4===1?P.canopyHi:j?P.canopy:P.canopyR);
        // Small cool diagonal glints suggest glass without exposing rear emission.
        if(i%2===0)S.beam(F.point(a+.65,d0+.15,z0+.04),F.point(a+1.42,d1-.15,z1+.04),P.canopyHi,.18);
      }
    }
    for(let i=0;i<=n;i++){
      const u=u0+i*step;
      S.beam(F.point(u,0,innerZ+.09),F.point(u,projection,outerZ+.09),P.ironHi,.25);
    }
    for(const t of[0,.5,1])S.beam(F.point(u0,projection*t,innerZ+(outerZ-innerZ)*t+.10),F.point(u1,projection*t,innerZ+(outerZ-innerZ)*t+.1),P.iron,.29);
    const count=Math.max(1,Math.round((u1-u0)/8.3));
    for(let i=0;i<=count;i++){
      const u=u0+(u1-u0)*i/count,p=F.point(u,projection,0);
      cylinder(S,p[0],p[1],.25,.95,.35,.29,P.ironHi,P.ironD,P.iron,6);
      cylinder(S,p[0],p[1],.95,outerZ-.55,.18,.16,P.iron,P.ironD,P.ironHi,6);
      S.box(p[0]-.33,p[0]+.33,p[1]-.33,p[1]+.33,outerZ-.55,outerZ-.16,P.ironHi,P.ironD,P.ironHi);
      // Open spandrel brackets meet the actual post and beam.
      for(const sign of[-1,1])if(u+sign*1.5>=u0&&u+sign*1.5<=u1){
        let last=F.point(u,projection,outerZ-2.1);
        for(let j=1;j<=7;j++){
          const a=j*Math.PI/14,q=F.point(u+sign*1.7*(1-Math.cos(a)),projection,outerZ-2.1+1.9*Math.sin(a));
          S.beam(last,q,P.ironHi,.19);last=q;
        }
      }
    }
    // Fine gutter and a shallow toothed fascia, not a hanging opaque apron.
    S.beam(F.point(u0,projection+.12,outerZ-.16),F.point(u1,projection+.12,outerZ-.16),P.ironD,.34);
    for(let u=u0+.35;u<u1;u+=1.15)S.beam(F.point(u,projection,outerZ-.2),F.point(u,projection,outerZ-.55),P.iron,.17);
  }
  function crate(S,x,y,z,w,d,h) {
    const front=(xx,yy,zz)=>mod(zz-z,1.0)<.15?P.woodD:mod(xx-x,2.5)<.12?P.woodR:P.wood;
    const side=(xx,yy,zz)=>mod(zz-z,1.0)<.15?P.woodD:P.woodR;
    S.box(x,x+w,y,y+d,z,z+h,front,side,null);
    S.flat(x+.2,x+w-.2,y+.2,y+d-.2,z+.12,P.woodD);
    for(const xx of[x,x+w-.25])for(const yy of[y,y+d-.25])S.box(xx,xx+.25,yy,yy+.25,z,z+h+.1,P.woodHi,P.wood,P.woodHi);
    for(const yy of[y,y+d-.20])S.box(x,x+w,yy,yy+.20,z+h-.2,z+h+.12,P.woodHi,P.woodR,P.woodHi);
  }
  function fruit(S,x,y,z,r,c,kind) {
    const rr=kind==='pear'?r*.82:r;
    cylinder(S,x,y,z,z+r*.65,rr*.78,rr,c,P.woodR,c,7);
    cylinder(S,x,y,z+r*.65,z+r*1.2,rr,kind==='pear'?rr*.36:rr*.55,c,c,c,7);
    if(kind==='cabbage'){
      for(let k=0;k<3;k++)S.beam([x-r*.65+k*r*.4,y-r*.5,z+r*.8],[x-r*.65+k*r*.4,y+r*.5,z+r*1.13],P.leaf[1],.12);
    }else S.beam([x,y,z+r*1.12],[x+.09,y,z+r*1.5],P.leaf[3],.13);
  }
  function produceCrate(S,x,y,z,w,d,kind) {
    crate(S,x,y,z,w,d,1.5);
    const c=kind==='apple'?P.apple:kind==='pear'?P.pear:kind==='cabbage'?P.cabbage:P.carrot;
    const step=kind==='cabbage'?1.6:1.05,r=kind==='cabbage'?.7:.42;
    for(let xx=x+.57;xx<x+w-.35;xx+=step)for(let yy=y+.55;yy<y+d-.3;yy+=step){
      if(kind==='carrot'){
        S.beam([xx-.22,yy-.3,z+1.15],[xx+.25,yy+.36,z+1.7],c,.42);
        S.beam([xx+.23,yy+.34,z+1.7],[xx+.36,yy+.56,z+2.05],P.leaf[1],.25);
      }else fruit(S,xx,yy,z+1.10,r,c,kind);
    }
  }
  function blossom(S,x,y,z,r,col) {
    for(let k=0;k<5;k++){
      const a=k*Math.PI*2/5,cx=x+Math.cos(a)*r*.54,cy=y+Math.sin(a)*r*.54;
      S.poly([[cx-r*.4,cy,z],[cx,cy-r*.42,z+.14],[cx+r*.4,cy,z+.18],[cx,cy+r*.42,z+.08]],col);
    }
    S.box(x-r*.13,x+r*.13,y-r*.13,y+r*.13,z+.13,z+.32,P.gold,P.gold,P.paper);
  }
  function bouquet(S,x,y,z,scale,seed) {
    const s=scale||1;
    cylinder(S,x,y,z,z+2.35*s,.48*s,.68*s,P.zinc,P.zincR,P.soil,8);
    cylinder(S,x,y,z+2.25*s,z+2.52*s,.69*s,.7*s,P.zinc,P.zincR,P.soil,8);
    for(let k=0;k<7;k++){
      const a=k*2.4,rr=(k? .57:0)*s,xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr,zz=z+(3.7+(hash(k,seed,27)%8)*.14)*s;
      S.beam([x,y,z+2.1*s],[xx,yy,zz],P.leaf[3],.13*s);
      for(const sign of[-1,1])S.poly([[xx,yy,zz-.8*s],[xx+sign*.62*s,yy-.18*s,zz-.35*s],[xx+sign*.38*s,yy+.18*s,zz-.22*s]],P.leaf[(k+1)%4]);
      blossom(S,xx,yy,zz,.52*s,P.flower[(k+seed)%P.flower.length]);
    }
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
  function counter(S,x,y,w,d,h) {
    for(const xx of[x+.4,x+w-.4])for(const yy of[y+.3,y+d-.3])S.box(xx-.18,xx+.18,yy-.18,yy+.18,.3,h,P.woodR,P.woodD,P.wood);
    S.box(x-.2,x+w+.2,y-.2,y+d+.2,h,h+.45,P.wood,P.woodR,P.woodHi);
    for(const yy of[y,y+d-.2])S.box(x+.2,x+w-.2,yy,yy+.2,1.5,1.85,P.woodR,P.woodD,P.wood);
  }
  function handcart(S,x,y) {
    // Two open spoke wheels, one axle, slatted bed and real projecting handles.
    for(const yy of[y-.25,y+3.9]){
      const F=S.face([x-2,yy],[x+5,yy],0,yy<y?-1:1);
      ring(S,F,4,1.55,1.45,1.45,.28,.04,P.ironD,14);
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4;S.beam(F.point(4,0,1.55),F.point(4+Math.cos(a)*1.25,0,1.55+Math.sin(a)*1.25),P.woodR,.17);
      }
      S.beam(F.point(3.65,.06,1.55),F.point(4.35,.06,1.55),P.ironHi,.3);
    }
    S.beam([x+2,y-.3,1.55],[x+2,y+4,1.55],P.ironD,.28);
    crate(S,x,y,2.1,5,3.65,2.2);
    for(const yy of[y+.55,y+3.1])S.beam([x+3.3,yy,2.3],[x+7.0,yy,3.4],P.woodR,.3);
    produceCrate(S,x+.4,y+.4,2.35,3.8,2.6,'apple');
  }

  function market(view) {
    const S=Scene(3,view,200,164);
    S.flat(0,48,0,48,0,paving);
    for(const [x0,x1,y0,y1]of[[0,48,0,.42],[0,48,47.58,48],[0,.42,0,48],[47.58,48,0,48]])S.flat(x0,x1,y0,y1,.015,P.stoneR);
    // Fine stone channels follow the U and the open entrance, not a water texture.
    for(const [x0,x1,y0,y1]of[[8.8,9.1,12,47],[38.9,39.2,12,47],[9,39,11.9,12.2]])S.flat(x0,x1,y0,y1,.025,P.stoneD);
    for(const [x,y]of[[9.0,42.6],[39,42.6]]){
      S.flat(x-.55,x+.55,y-.8,y+.8,.04,P.ironD);
      for(let a=-.35;a<.5;a+=.3)S.flat(x+a,x+a+.1,y-.66,y+.66,.045,P.lead);
    }
    S.flat(2,46,2.7,9.2,.35,paving);
    // Ground-floor shop backs flank a real 7.4-unit through-passage. The rear
    // elevation repeats the central arch; no dark decal stands in for the void.
    const shopBlocks=[masonry(S,2,20.32,2.7,5.5,.35,15.2,2781),masonry(S,27.68,46,2.7,5.5,.35,15.2,2782)];
    for(let b=0;b<shopBlocks.length;b++){
      const W=shopBlocks[b];
      for(let i=0;i<2;i++){
        const u=1.15+i*8.8;
        shopDoor(W.front,u,.55,3.0,10.2,(i+b)%2===0);
        shutter(W.front,u+3.5,.85,3.05,8.7);
        sash(S,W.back,u+1.4,5,3.4,6.4,(i+b)%2===1);
      }
      band(S,b?27.68:2,b?46:20.32,2.7,5.5,.45,.65);
    }
    const rearFront=S.face([2,9.2],[46,9.2],0,1);
    for(let i=0;i<5;i++)arcadeArch(S,rearFront,.72+i*8.8,7.36,10,15.45,.88,2784+i);
    const passageBack=S.face([27.68,2.7],[20.32,2.7],0,-1);
    arcadeArch(S,passageBack,0,7.36,10,15.45,.65,2791);
    // Upper range: five bay rhythm, genuine sash frames, modest inscription,
    // projecting cornice, tiny dentils and low slate hips.
    const upper=masonry(S,2,46,2.7,9.2,15.45,31.3,2780);
    band(S,2,46,2.7,9.2,15.45,.7);band(S,2,46,2.7,9.2,30.55,.95);
    for(const [side,F]of Object.entries(upper)){
      const n=side==='front'||side==='back'?5:1,step=F.length/n;
      for(let i=0;i<n;i++)sash(S,F,(i+.5)*step-1.95,21.3,3.9,7.55,(i+(side==='back'?1:0))%3!==1);
      for(let u=.75;u<F.length-.4;u+=2.1)F.block(u,u+.5,0,.44,29.85,30.55,P.stone,P.stoneR,P.stoneHi);
      for(const u of[.25,F.length-.9])F.block(u,u+.65,0,.16,16.3,29.9,P.brick[1],P.brickR[1],P.stone);
    }
    for(const F of[upper.front,upper.back]){
      F.block(11.2,32.8,.08,.32,16.35,20.45,P.green,P.greenD,P.greenHi);
      F.panel(11.55,32.45,16.65,20.13,P.greenD,.37);
      letters(F,'MARKET',(44-23*.56)/2,16.78,.56,P.paper,.43);
      for(const u of[2.2,35.1])produceFrieze(S,F,u,17,6.7);
    }
    hippedRoof(S,1.6,46.4,2.3,9.6,31.65,4.25,true);
    for(const x of[8.4,39.6])chimney(S,x,5.7,35.0);
    for(const [x,y]of[[1.8,3.8],[46.2,8.0]])rainpipe(S,x,y,31.6);
    canopy(S,rearFront,.2,43.8,2.62,15.25,14.35,4.35);
    for(const u of[9,35])wallLamp(S,rearFront,u,10.9);

    // Low wings have real open arcades toward the court and designed service
    // backs. Their roofs stop at x=6.6 / 41.4, keeping the central sky visible.
    for(const right of[false,true]){
      const x0=right?41.8:2,x1=right?46:6.2;
      const W=masonry(S,right?44.9:x0,right?x1:3.1,9.2,39.9,.35,15.5,right?2788:2787);
      const court=right?S.face([41.8,39.9],[41.8,9.2],-1,0):S.face([6.2,9.2],[6.2,39.9],1,0);
      const outside=right?W.right:W.left;
      S.flat(x0,x1,9.2,39.9,.35,paving);
      for(let i=0;i<4;i++){
        const step=30.7/4,u=.72+i*step,w=step-1.44;
        arcadeArch(S,court,u,w,9.3,15.4,.64,2794+i);
        const yy=10.3+i*7.3;
        if(i!==2)counter(S,right?42.7:3.8,yy,2.65,3.8,4.1);
        if(i===0||i===3){
          for(let k=0;k<2;k++)bouquet(S,right?43.9:5.3,yy+1+k*1.7,4.55,.52,k+i+(right?2:0));
        }else if(i===1){
          produceCrate(S,right?42.9:4,yy+.25,4.55,2.25,3.05,right?'pear':'apple');
        }else{
          crate(S,right?43.1:3.8,yy+.2,.4,2.1,2.15,2.35);
          crate(S,right?43.1:3.8,yy+.2,2.75,2.1,2.15,2.0);
        }
        if(i===1)shopDoor(outside,i*7.3+1.7,.35,2.9,10,false);
        else sash(S,outside,i*7.3+2.0,5.0,2.8,5.6,i%2===0);
      }
      // Actual doors terminate the wings; the entry to the court is wide open.
      const end=masonry(S,x0,x1,39.35,39.9,.35,15.4,right?2783:2786);
      shopDoor(end.front,.65,.35,2.7,10.1,true);
      produceFrieze(S,end.front,.2,11.2,3.8);
      band(S,x0,x1,9.2,39.9,15.3,.65);
      hippedRoof(S,x0-.25,x1+.25,9.0,40.2,16.0,3.2,false);
      canopy(S,court,.15,30.5,2.62,14.95,13.9,3.8);
      for(const u of[7.75,23.0])wallLamp(S,court,u,10.8);
      rainpipe(S,right?46.2:1.8,38.8,15.9);
    }
    // Edge objects give the market a lived-in scale without filling its court.
    for(const [x,y,s,seed]of[[10.35,34,.85,1],[10.8,37.3,.96,3],[12.45,40.1,.72,0]])bouquet(S,x,y,.08,s,seed);
    pottedPlant(S,10.2,43.5,.08,.85,P.flower[1]);pottedPlant(S,37.4,43.5,.08,.85,P.flower[4]);
    handcart(S,32.0,34.2);
    produceCrate(S,37.1,28.7,.06,2.7,2.9,'cabbage');
    crate(S,37.0,24.9,.08,2.7,2.9,2.7);produceCrate(S,37.1,25.0,2.8,2.5,2.7,'pear');
    // A small freestanding price board has real hinged legs and a matte slate.
    for(const xx of[15.2,17.4]){
      S.beam([xx,43.6,.08],[xx,42.2,5.9],P.woodR,.24);
      S.beam([xx,40.8,.08],[xx,42.2,5.9],P.woodR,.24);
    }
    const price=S.face([15.0,42.45],[17.6,42.45],0,1);
    price.panel(0,2.6,1.6,5.5,P.woodHi,0);
    price.panel(.22,2.38,1.95,5.18,P.ink,.04);
    for(const z of[2.7,3.7,4.6])price.panel(.55,2.04,z,z+.15,P.paper,.06);
    for(const [x,y]of[[3,44.4],[45,44.4]])lantern(S,x,y,10.6,true);
    return S.finish({building:278,architecture:'open-british-riverside-market-arcade',pathAxis:'y',
      design:'original-red-brick-open-U-court',roofFreeCourt:[9,39,12,47],roofFreeCourtFraction:1050/2304});
  }

  function canvasShelter(S,x0,x1,y0,y1,z,rise,florist) {
    const cy=(y0+y1)/2,stripe=florist?P.canvasRose:P.canvasGreen;
    const cloth=(x,y,zz)=>{
      const u=mod(x-x0,2.4);
      if(u<.13)return P.canvasD;
      return u<1.16?P.canvas:stripe;
    };
    S.poly([[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]],cloth);
    S.poly([[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z],[x0,y1,z]],cloth);
    for(const x of[x0,x1]){
      S.poly([[x,y0,z],[x,cy,z+rise],[x,y1,z]],florist?P.canvasRose:P.canvasGreen);
      S.beam([x,y0,z],[x,cy,z+rise],P.canvasD,.18);
      S.beam([x,cy,z+rise],[x,y1,z],P.canvasD,.18);
    }
    for(const yy of[y0,y1]){
      const F=S.face([x0,yy],[x1,yy],0,yy===y0?-1:1);
      F.panel(0,x1-x0,z-.9,z,(x,zz)=>mod(x,2.4)<1.2?P.canvasD:stripe,.035);
      for(let x=x0+.15;x<x1;x+=1.2)S.beam([x,yy,z-.95],[Math.min(x+1.0,x1),yy,z-.95],P.woodD,.14);
    }
    S.beam([x0,cy,z+rise+.05],[x1,cy,z+rise+.05],P.canvasD,.16);
    for(const xx of[x0+.5,x1-.5])for(const yy of[y0+.5,y1-.5]){
      S.box(xx-.15,xx+.15,yy-.15,yy+.15,.2,z+.1,P.wood,P.woodR,P.woodHi);
      S.beam([xx,yy,z-2.1],[xx+(xx<(x0+x1)/2?.9:-.9),yy,z-.1],P.woodR,.18);
      cylinder(S,xx,yy,.1,.65,.27,.24,P.iron,P.ironD,P.ironHi,6);
    }
    // A proper glazed task lantern is clamped to the front corner standard.
    // Its panes sit above the highest canvas ridge (z+rise), rather than hiding
    // a subpixel bulb beneath an opaque canopy. The same four-sided physical
    // lantern used by the riverside lamps remains legible in every real view;
    // the shared depth buffer still resolves its iron frame and shade normally.
    const lx=x1-.5,ly=y1+.25,lampZ=z+rise+.55;
    S.beam([lx,y1-.5,z-2.2],[lx,y1-.5,lampZ+.15],P.ironD,.25);
    S.beam([lx,y1-.5,lampZ+.15],[lx,ly,lampZ+.15],P.iron,.26);
    S.beam([lx,y1-.5,lampZ-1.1],[lx,ly,lampZ+.15],P.iron,.19);
    for(const zz of[z-1.9,z-.25])S.box(lx-.27,lx+.27,y1-.76,y1-.24,zz,zz+.25,P.ironHi,P.ironD,P.ironHi);
    lantern(S,lx,ly,lampZ,false);
  }
  function hangingBoard(S,x0,x1,y,z,text,florist) {
    for(const x of[x0+.45,x1-.45])S.beam([x,y,z+4.3],[x,y,z+3.2],P.iron,.14);
    S.box(x0,x1,y-.16,y+.16,z,z+3.35,P.green,P.greenD,P.greenHi);
    const F=S.face([x0,y+.18],[x1,y+.18],0,1),B=S.face([x1,y-.18],[x0,y-.18],0,-1);
    for(const face of[F,B]){
      const unit=Math.min(.39,(x1-x0-.8)/(text.length*4-1));
      letters(face,text,((x1-x0)-(text.length*4-1)*unit)/2,z+.17,unit,P.paper,.035);
    }
    if(florist)S.beam([x0+.24,y+.18,z+.35],[x0+.24,y+.18,z+2.85],P.gold,.12);
  }
  function flowerStall(view) {
    const S=Scene(1,view,72,88);
    S.flat(0,16,0,16,0,paving);
    for(const y of[.45,15.1])S.flat(.45,15.55,y,y+.18,.018,P.stoneR);
    // Two florist's display heights, buckets of cut stems and separate potted
    // plants make the open sides and service gap readable from all four views.
    counter(S,2.3,4.3,9.6,2.0,5.2);
    counter(S,2.0,9.4,8.0,2.35,3.5);
    for(const [x,y,z,s,seed]of[[3.0,5.2,5.65,.70,0],[5.4,5.15,5.65,.81,3],[8,5.2,5.65,.73,1],[10.5,5.2,5.65,.80,4],
      [2.7,10.45,3.95,.72,2],[5,10.5,3.95,.76,4],[7.6,10.5,3.95,.79,0],
      [12.7,9.4,.08,.87,3],[12.75,12.35,.08,.80,1]])bouquet(S,x,y,z,s,seed);
    pottedPlant(S,3.0,13.5,.08,.83,P.flower[4]);
    pottedPlant(S,5.4,13.65,.08,.70,P.flower[1]);
    pottedPlant(S,8.0,13.45,.08,.78,P.flower[2]);
    crate(S,1.75,1.35,.1,3.35,2.4,2.2);
    for(const x of[2.45,3.75])pottedPlant(S,x,2.55,2.4,.55,P.flower[3]);
    crate(S,8.9,1.45,.08,3.1,2.4,2.1);
    // Wrapped stems are folded cream paper cones laid on the rear service shelf.
    for(let i=0;i<3;i++){
      const x=9.25+i*.85;
      S.poly([[x,1.75,2.35],[x+.65,1.75,2.35],[x+.4,3.15,3.3]],P.paper);
      S.beam([x+.4,3.0,3.3],[x+.65,3.5,3.7],P.leaf[1],.17);
    }
    // A zinc watering can: body, spout and open loop handle are separate solids.
    cylinder(S,12.8,3.05,.1,2.15,.68,.72,P.zinc,P.zincR,P.zinc,8);
    S.beam([13.3,3.1,1.2],[14.3,3.55,2.35],P.zincR,.34);
    const handle=S.face([11.4,2.98],[14.4,2.98],0,1);
    ring(S,handle,1.4,2.25,.86,1.13,.2,0,P.zincR,12);
    canvasShelter(S,1.35,14.65,3.55,12.4,15.5,3.1,true);
    hangingBoard(S,3.2,12.4,12.75,11.05,'FLORA',true);
    return S.finish({building:279,architecture:'british-cut-flower-stall',pathAxis:'y',design:'open-rose-canvas-florist'});
  }
  function balanceScale(S,x,y,z) {
    S.box(x-.65,x+.65,y-.48,y+.48,z,z+.4,P.iron,P.ironD,P.ironHi);
    S.beam([x,y,z+.35],[x,y,z+3.8],P.iron,.25);
    S.beam([x-1.5,y,z+3.6],[x+1.5,y,z+3.6],P.gold,.22);
    for(const sign of[-1,1]){
      const xx=x+sign*1.25;
      for(const yy of[y-.5,y+.5])S.beam([xx,y,z+3.6],[xx,yy,z+1.8],P.ironHi,.11);
      cylinder(S,xx,y,z+1.5,z+1.8,.56,.72,P.zinc,P.zincR,P.zinc,8);
    }
    S.beam([x,y,z+3.55],[x+.16,y,z+4.15],P.gold,.15);
  }
  function produceStall(view) {
    const S=Scene(1,view,72,88);
    S.flat(0,16,0,16,0,paving);
    for(const y of[.45,15.1])S.flat(.45,15.55,y,y+.18,.018,P.stoneR);
    counter(S,2.15,8.3,11.0,3.5,4.0);
    counter(S,3.1,4.1,8.4,2.35,5.9);
    produceCrate(S,2.4,8.65,4.45,3.1,2.65,'apple');
    produceCrate(S,5.9,8.65,4.45,3.1,2.65,'pear');
    produceCrate(S,9.4,8.65,4.45,3.4,2.65,'carrot');
    produceCrate(S,3.4,4.35,6.35,4.0,1.85,'cabbage');
    balanceScale(S,9.45,5.2,6.35);
    // Slatted stock crates and one small barrel are useful stock, not an opaque
    // substitute for the stall structure. Their tops have actual merchandise.
    crate(S,1.9,1.05,.12,3.0,2.3,2.0);crate(S,1.9,1.05,2.2,3.0,2.3,2.0);
    produceCrate(S,6.0,1.1,.12,3.1,2.3,'pear');
    cylinder(S,12.6,3.1,.1,3.9,.87,1.03,P.wood,P.woodR,P.woodHi,10);
    for(const z of[.65,3.20])cylinder(S,12.6,3.1,z,z+.27,1.04,1.04,P.ironD,P.iron,P.woodHi,10);
    for(const x of[1.35,3.65]){
      // Woven potato sack with a tied neck and restrained stitch texture.
      cylinder(S,x,13.65,.1,2.45,.73,.93,P.canvasD,P.woodR,P.canvasD,8);
      cylinder(S,x,13.65,2.45,3.15,.93,.38,P.canvasD,P.woodR,P.canvas,8);
      S.beam([x-.4,13.65,3.08],[x+.4,13.65,3.08],P.woodD,.17);
    }
    crate(S,10.25,12.6,.1,3.7,2.65,2.15);
    produceCrate(S,10.5,12.85,2.28,3.2,2.15,'cabbage');
    canvasShelter(S,1.35,14.65,3.55,12.4,15.25,2.6,false);
    hangingBoard(S,3.2,12.4,12.75,10.8,'GREENS',false);
    return S.finish({building:280,architecture:'british-produce-stall',pathAxis:'y',design:'open-sage-canvas-greengrocer'});
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
  function stonePier(S,x,y,z,h) {
    S.box(x-.55,x+.55,y-.58,y+.58,z,z+h,P.granite,P.graniteR,P.graniteHi);
    S.box(x-.76,x+.76,y-.77,y+.77,z+h-.14,z+h+.35,P.stone,P.stoneR,P.stoneHi);
    for(let zz=z+1.8;zz<z+h-.3;zz+=1.8)S.box(x-.56,x+.56,y-.59,y+.59,zz,zz+.10,P.graniteD,P.graniteD,P.graniteR);
  }
  function quayWall(S) {
    const z0=.06,z1=3.95;
    // Battered granite face stays entirely inside its paid dry-land cell.
    // The lower wall is geometry above the terrain plane, never invented water.
    S.poly([[13.65,0,z0],[13.65,16,z0],[14.10,16,z1],[14.10,0,z1]],granite(true));
    S.poly([[16,0,z0],[15.6,0,z1],[15.6,16,z1],[16,16,z0]],granite(true));
    S.poly([[13.65,0,z0],[14.1,0,z1],[15.6,0,z1],[16,0,z0]],granite(false));
    S.poly([[13.65,16,z0],[16,16,z0],[15.6,16,z1],[14.1,16,z1]],granite(false));
    for(let y=0;y<16;y+=4){
      S.box(13.80,15.9,y+.035,Math.min(y+3.965,16),3.95,4.48,P.stone,P.stoneR,P.stoneHi);
      S.beam([15.87,y+.18,4.47],[15.87,Math.min(y+3.8,15.85),4.47],P.stoneD,.11);
    }
    for(const y of[1.4,14.6]){
      // Small recessed drain holes are matte, with dressed stone surrounds.
      const F=S.face([16,y-1],[16,y+1],1,0);
      F.panel(.65,1.35,.65,1.25,P.graniteD,-.12);
    }
  }
  function riversideModule(theme,view) {
    const S=Scene(1,view,72,92);
    S.flat(0,16,0,16,0,paving);
    for(const x of[5.05,10.55])S.flat(x,x+.22,0,16,.022,P.stoneHi);
    // All modules preserve the ordinary native path and a 5.28-unit visual
    // north/south walking strip. Placement logic alone rotates that path axis.
    if(theme==='quay'){
      quayWall(S);
      stonePier(S,14.78,14.25,4.48,1.25);lantern(S,14.78,14.25,6.08,false);
      // Six shallow stone treads run parallel to the boundary, as at Custom
      // House Quay. They access the low coping, not a fictional ferry berth.
      for(let i=0;i<6;i++)S.box(11.15,13.7,3.7,11.5-i*1.18,.02,.66*(i+1),P.granite,P.graniteR,P.stoneHi);
      S.box(11.15,13.8,2.7,4.42,.02,3.96,P.granite,P.graniteR,P.stoneHi);
      S.beam([10.99,11.3,2.5],[10.99,4.0,6.7],P.iron,.26);
      for(let i=0;i<4;i++)S.beam([10.99,10.75-i*2.1,.66+i*1.18],[10.99,10.75-i*2.1,2.82+i*1.2],P.iron,.20);
      // A compact seat and a low stone name plaque face the maintained walk.
      bench(S,1.5,5.6,6.3,false);
      S.box(.7,3.6,1.4,2.5,.08,1.0,P.granite,P.graniteR,P.graniteHi);
      const F=S.face([.7,2.52],[3.6,2.52],0,1);
      F.panel(.35,2.55,.34,.77,P.stoneR,.025);
    }else if(theme==='rail'){
      S.box(13.7,15.8,0,16,.06,1.55,granite(false),granite(true),P.stone);
      for(let y=0;y<16;y+=4)S.box(13.5,15.95,y+.03,Math.min(y+3.97,16),1.5,1.97,P.stone,P.stoneR,P.stoneHi);
      ironRail(S,[14.78,.25],[14.78,15.75],1.97,5.1);
      stonePier(S,14.78,3.4,1.97,4.1);lantern(S,14.78,3.4,6.45,false);
      // Drain grate and two discreet planters leave the through-path untouched.
      for(const y of[1.9,13.9])pottedPlant(S,2.45,y,.08,.69,y<8?P.flower[2]:P.flower[4]);
      S.flat(11.9,12.8,6.7,9.3,.025,P.ironD);
      for(let y=6.9;y<9.1;y+=.4)S.flat(12.0,12.7,y,y+.13,.03,P.lead);
    }else if(theme==='promenade'){
      // Broader dressed paving, offset granite kerb, timber/cast-iron bench,
      // freestanding lantern and a covered litter bin identify the public walk.
      for(let y=.35;y<16;y+=3.8)for(let x=.35;x<16;x+=5.2)
        S.flat(x,Math.min(x+4.99,15.85),y,Math.min(y+3.58,15.85),.025,(Math.floor(x/5)+Math.floor(y/4))%3===0?P.paveHi:P.pave);
      S.box(14.3,15.8,0,16,.025,.68,P.granite,P.graniteR,P.stoneHi);
      ironRail(S,[15.0,.45],[15.0,15.55],.7,4.15);
      bench(S,1.65,4.5,7.7,false);
      lantern(S,12.3,2.5,10.15,true);
      S.box(11.6,13.2,12.7,14.5,.08,3.2,P.iron,P.ironD,P.ironHi);
      S.box(11.4,13.4,12.5,14.7,3.17,3.6,P.iron,P.ironD,P.ironHi);
      S.wall([11.85,14.52],[12.95,14.52],2.48,2.98,P.ink);
      for(let z=.6;z<2.4;z+=.6)S.wall([11.78,14.52],[13.0,14.52],z,z+.1,P.ironHi);
      pottedPlant(S,2.4,13.9,.08,.70,P.flower[1]);
    }
    return S.finish({theme,pathAxis:'y',minimumClearPath:5.28,design:'dry-native-riverside-walk',waterCells:0});
  }
  function buildAll() {
    const buildings={278:[],279:[],280:[]},modules={};
    for(let view=0;view<4;view++){
      buildings[278].push(market(view));
      buildings[279].push(flowerStall(view));
      buildings[280].push(produceStall(view));
      for(const theme of['quay','rail','promenade'])modules[theme+'_'+view]=riversideModule(theme,view);
    }
    return {buildings,modules};
  }
  root.BritishRiversideArchitecture012=Object.freeze({version:'GPT-012-art-r2',original:true,simulationRandomCalls:0,buildAll});
})(typeof window==='undefined'?globalThis:window);
