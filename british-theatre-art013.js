/* GPT-013: original British Edwardian theatre quarter, four true geometric views.
 * Design sources consulted before drawing on 2026-10-05:
 * https://historicengland.org.uk/listing/the-list/list-entry/1065384
 *   Richmond Theatre: red brick, pale terracotta, arched bays and ornate frontage.
 *   Its listed canopy is modern; it is NOT evidence of an original 1899 canopy.
 * https://historicengland.org.uk/listing/the-list/list-entry/1319336
 *   Theatre Royal Windsor: tall transomed windows, swept parapet, glazed canopy.
 * https://www.theatrestrust.org.uk/discover-theatres/theatre-faqs/171-what-spaces-make-up-a-theatre
 *   Fly tower above the stage; separate rear stage door and scenery-loading dock.
 * This is an original architectural composite, not a surveyed reconstruction.
 *
 * Native projection: x=ax+2i-2j, y=ay-32*sz+i+j-z, one cell=16 world units.
 * The same complete geometry is rotated for all four cameras, never image-flipped.
 * Shared depth resolves DAY AND EMISSION together. Nearer opaque surfaces remove
 * lights behind them. Only glazing inside real lanterns, lightboxes and windows
 * emits; walls, canopy roof, brick, brass and paving never emit or receive halos.
 * Building k281: 3x3, 232x260, ax116, ay258; modules: 1x1, 72x92, ax36, ay90.
 * Furniture modules retain a clear x=5.3..10.7 walking strip; ticket booth sits
 * at the side. No imported art, fonts, simulation state, storage, RNG or cache.
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
    '0':['111','101','101','101','111'],'1':['010','110','010','010','111'],
    '8':['111','101','111','101','111'],'9':['111','101','111','001','111'],
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

  // Restrained carved leaves belong to the stone surface, never the light mask.
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
  function posterBox(S,F,u,z,w,h,variant) {
    F.block(u-.18,u+w+.18,.04,.54,z-.16,z+h+.18,P.burgundyD,P.ironD,P.gold);
    F.panel(u,u+w,z,z+h,P.paper,.56);
    F.panel(u+.23,u+w-.23,z+h*.28,z+h*.86,variant%2?P.greenD:P.burgundy,.59);
    // A tiny illustrated programme: theatre masks or a gold crescent, then rules
    // of type. Light is confined to the actual narrow lamp inside the top bezel.
    const c=u+w/2;
    if(variant%2){
      ring(S,F,c,z+h*.58,w*.27,w*.27,.35,.61,P.gold,16);
      F.panel(c+.08,c+w*.3,z+h*.42,z+h*.81,P.greenD,.64);
      for(const [du,dz]of[[-.7,.15],[.7,-.5],[-.2,-.95]])F.panel(c+du,c+du+.2,z+h*.58+dz,z+h*.58+dz+.2,P.paper,.67);
    }else{
      for(const [du,dz,col]of[[-.5,.9,P.paper],[.45,-.5,P.gold]]){
        const q=[[c+du-.65,z+h*.6+dz+.6],[c+du+.6,z+h*.6+dz+.6],[c+du+.4,z+h*.6+dz-1],[c+du,z+h*.6+dz-1.45],[c+du-.5,z+h*.6+dz-.9]];
        S.poly(q.map(a=>F.point(a[0],.62,a[1])),col,.065);
        for(const d of[-.3,.25])F.panel(c+du+d,c+du+d+.2,z+h*.6+dz,z+h*.6+dz+.23,P.burgundyD,.65);
      }
    }
    for(const [v,length]of[[.13,.74],[.20,.54],[.90,.63]])F.panel(u+w*(1-length)/2,u+w*(1+length)/2,z+h*v,z+h*v+.15,P.burgundyD,.62);
    F.panel(u+.22,u+w-.22,z+h-.05,z+h+.12,LAMP,.57);
    F.panel(u-.18,u+w+.18,z+h+.18,z+h+.35,P.iron,.68);
  }
  function ticketWindow(S,F,u,z,w,h,sign) {
    F.block(u-.5,u+w+.5,.05,.63,z-.4,z+h+.55,P.stone,P.stoneR,P.stoneHi);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      if(x<.18||x>w-.18||y>h-.25||Math.abs(y-h*.4)<.13)return P.gold;
      if(y<h*.39&&x>w*.34&&x<w*.68)return P.ink;
      if(Math.abs(x-w/2)<.11||Math.abs(y-h*.73)<.11)return P.woodR;
      return y>h*.4?GLOW[2]:P.woodD;
    },.70);
    F.block(u-.8,u+w+.8,.06,1.08,z-.45,z-.08,P.wood,P.woodR,P.woodHi);
    if(sign){
      F.block(u-.6,u+w+.6,.05,.48,z+h+.78,z+h+3.8,P.burgundy,P.burgundyD,P.gold);
      const unit=(w+.5)/27;letters(F,'TICKETS',u-.26,z+h+1.42,unit,P.gold,.51);
    }
  }
  function cantedBay(S,x,y,z,w,h) {
    const d=1.95,shoulder=1.5;
    const q=[[x,y],[x+shoulder,y+d],[x+w-shoulder,y+d],[x+w,y]];
    // Canted bay panels have separate outward normals; frames are real beams.
    for(let i=0;i<3;i++){
      const a=q[i],b=q[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
      const F=S.face(a,b,-(b[1]-a[1])/len,(b[0]-a[0])/len);
      S.wall(a,b,z,z+h,P.stoneR);
      F.panel(.2,len-.2,z+.45,z+h-.5,(xx,zz)=>{
        if(Math.abs(xx-(len-.4)/2)<.13||Math.abs(zz-h*.36)<.17||Math.abs(zz-h*.7)<.16)return P.frame;
        return zz<h*.2?P.burgundyD:xx<(len-.4)/2?GLOW[2]:P.glassHi;
      },.06);
      for(const zz of[z,z+h*.36,z+h*.7,z+h])S.beam([a[0],a[1],zz],[b[0],b[1],zz],P.stone,.45);
      for(const p of[a,b])S.beam([p[0],p[1],z],[p[0],p[1],z+h],P.stone,.45);
    }
    for(const zz of[z-.5,z+h+.1])S.poly(q.map(p=>[p[0],p[1],zz]),P.stoneHi);
    const center=x+w/2;
    S.poly([[x-.35,y,z+h+.6],[x+shoulder-.25,y+d+.3,z+h+.6],[center,y+.5,z+h+3.1]],P.slate);
    S.poly([[x+shoulder-.25,y+d+.3,z+h+.6],[x+w-shoulder+.25,y+d+.3,z+h+.6],[center,y+.5,z+h+3.1]],P.slateHi);
    S.poly([[x+w-shoulder+.25,y+d+.3,z+h+.6],[x+w+.35,y,z+h+.6],[center,y+.5,z+h+3.1]],P.slateR);
  }
  function theatreCanopy(S,F,u0,u1) {
    const w=u1-u0,projection=5.25,n=14,m=5;
    const roof=(u,d)=>19.55+2.45*Math.sin((u-u0)/w*Math.PI)-.22*d;
    // A shallow curved roof, subdivided into real glass panes with iron ribs.
    for(let i=0;i<n;i++)for(let j=0;j<m;j++){
      const a=u0+w*i/n,b=u0+w*(i+1)/n,d0=projection*j/m,d1=projection*(j+1)/m;
      S.poly([F.point(a,d0,roof(a,d0)),F.point(b,d0,roof(b,d0)),F.point(b,d1,roof(b,d1)),F.point(a,d1,roof(a,d1))],(i+j)%3===0?P.canopyHi:(i+j)%3===1?P.canopy:P.canopyR);
    }
    for(let i=0;i<=n;i++){
      const u=u0+w*i/n;S.beam(F.point(u,0,roof(u,0)+.08),F.point(u,projection,roof(u,projection)+.08),P.iron,.21);
    }
    for(const d of[0,projection*.5,projection])for(let i=0;i<n;i++){
      const a=u0+w*i/n,b=u0+w*(i+1)/n;
      S.beam(F.point(a,d,roof(a,d)+.09),F.point(b,d,roof(b,d)+.09),d===projection?P.ironHi:P.iron,.28);
    }
    for(const u of[u0+.65,u1-.65]){
      const p=F.point(u,projection-.15,0),top=roof(u,projection);
      cylinder(S,p[0],p[1],.15,1.1,.38,.31,P.ironHi,P.ironD,P.iron,8);
      cylinder(S,p[0],p[1],1.1,top-.5,.19,.15,P.iron,P.ironD,P.ironHi,8);
      cylinder(S,p[0],p[1],top-.5,top+.08,.30,.40,P.ironHi,P.ironD,P.ironHi,8);
      for(const dir of[-1,1]){
        let last=F.point(u,projection-.15,top-2.7);
        for(let i=1;i<=7;i++){
          const a=i*Math.PI/14,q=F.point(u+dir*2.15*(1-Math.cos(a)),projection-.15,top-2.7+2.7*Math.sin(a));
          if(q[0]>=4&&q[0]<=44)S.beam(last,q,P.ironHi,.2);last=q;
        }
      }
    }
    for(let i=0;i<n;i++){
      const a=u0+w*i/n,b=u0+w*(i+1)/n;
      S.poly([F.point(a,projection,roof(a,projection)-1),F.point(b,projection,roof(b,projection)-1),
        F.point(b,projection,roof(b,projection)),F.point(a,projection,roof(a,projection))],P.burgundy);
    }
    // Pendant lanterns hang beneath, not above or through the canopy glass.
    for(const u of[u0+w*.28,u0+w*.73]){
      const p=F.point(u,3.7,13.9);lantern(S,p[0],p[1],p[2],false);
      S.beam([p[0],p[1],17.5],F.point(u,3.7,roof(u,3.7)-.05),P.iron,.14);
    }
  }
  function sweptParapet(S,F,u,w,z) {
    const curve=[0,.22,.85,2.6,5.2,6.3,5.2,2.6,.85,.22,0],depth=1.05;
    for(let i=0;i<curve.length-1;i++){
      const a=u+w*i/10,b=u+w*(i+1)/10;
      for(const d of[0,-depth])S.poly([F.point(a,d,z),F.point(b,d,z),F.point(b,d,z+curve[i+1]+1.9),F.point(a,d,z+curve[i]+1.9)],d?P.brickR[0]:P.brick[0]);
      S.poly([F.point(a,0,z+curve[i]+1.9),F.point(b,0,z+curve[i+1]+1.9),F.point(b,-depth,z+curve[i+1]+1.9),F.point(a,-depth,z+curve[i]+1.9)],P.stoneHi);
      S.beam(F.point(a,.16,z+curve[i]+2.0),F.point(b,.16,z+curve[i+1]+2.0),P.stoneHi,.55);
    }
    const mid=u+w/2;
    F.block(mid-2.45,mid+2.45,.04,.49,z+1.4,z+4.6,P.stone,P.stoneR,P.stoneHi);
    letters(F,'1908',mid-1.8,z+2.0,.25,P.stoneD,.54);
    for(const q of[u,u+w]){
      F.block(q-.5,q+.5,-.9,.4,z,z+3.25,P.stone,P.stoneR,P.stoneHi);
      const p=F.point(q,-.1,z+3.25);cylinder(S,p[0],p[1],p[2],p[2]+1.5,.47,.2,P.stone,P.stoneR,P.stoneHi,8);
    }
  }
  function vent(F,u,z,w,h) {
    F.block(u-.25,u+w+.25,.02,.32,z-.25,z+h+.25,P.brick[2],P.brickR[2],P.stoneD);
    F.panel(u,u+w,z,z+h,(x,y)=>mod(y,.57)<.2?P.ironHi:P.ink,.34);
  }
  function verticalSign(S) {
    const x=45.7,y0=32.6,y1=36.6,z0=29,z1=59.9;
    S.box(x-.27,x+.27,y0,y1,z0,z1,P.burgundyD,P.burgundy,P.gold);
    for(const xside of[x-.30,x+.30]){
      const F=S.face([xside,y0],[xside,y1],xside<x?-1:1,0);
      F.panel(.18,3.82,z0+.25,z1-.3,P.burgundy,.08);
      for(let i=0;i<7;i++)letters(F,'THEATRE'[i],1.16,z1-4.55-i*3.8,.49,P.gold,.14);
      for(const u of[.3,3.7])F.panel(u,u+.12,z0+.45,z1-.45,P.gold,.16);
    }
    for(const z of[z0+2,z1-2])S.beam([43.9,34.6,z],[x,34.6,z],P.iron,.27);
    S.beam([43.9,34.6,z1-4],[x,34.6,z1-2],P.iron,.20);
  }
  function sceneryCrate(S,x,y,z,w,d,h) {
    S.box(x,x+w,y,y+d,z,z+h,(xx,yy,zz)=>mod(xx-x,1.0)<.09?P.woodD:P.wood,
      (xx,yy,zz)=>mod(yy-y,.9)<.1?P.woodD:P.woodR,P.woodHi);
    for(const zz of[z+.35,z+h-.55])S.box(x-.08,x+w+.08,y-.08,y+d+.08,zz,zz+.23,P.woodR,P.woodD,P.wood);
    S.beam([x+.2,y+d+.05,z+.8],[x+w-.2,y+d+.05,z+h-.8],P.woodD,.23);
    const F=S.face([x,y+d+.09],[x+w,y+d+.09],0,1);
    F.panel(w*.34,w*.67,z+h*.42,z+h*.62,P.paper,.05);
  }
  function theatre(view) {
    const S=Scene(3,view,232,260);
    S.flat(0,48,0,48,0,paving);
    for(const [x0,x1,y0,y1]of[[0,48,0,.45],[0,48,47.55,48],[0,.45,0,48],[47.55,48,0,48]])S.flat(x0,x1,y0,y1,.015,P.stoneR);
    for(const y of[3.5,45.5])S.flat(.5,47.5,y,y+.26,.028,P.stoneHi);
    // Auditorium behind the public front. Its long slate roof ends at the fly
    // tower rather than stretching into a generic flat commercial roof.
    const A=masonry(S,5.2,42.8,11.4,33.8,.3,43.0,2811);
    cornice(S,5.2,42.8,11.4,33.8,42.6);
    hippedRoof(S,4.75,43.25,10.95,34.25,43.4,11.1,false);
    for(const side of['left','right']){
      const F=A[side];
      for(const u of[2.2,10.7,18.2]){
        F.block(u,u+.74,0,.31,2,40.6,P.brick[1],P.brickR[1],P.stone);
        archWindow(S,F,u+2.15,25.7,3.1,8.8,false);
        if(u<17)vent(F,u+2.0,16.0,3.5,3.4);
      }
      band(S,5.2,42.8,11.4,33.8,21.8,.6);
    }
    // Roof ventilator has louvred faces, a lead cap and a genuinely open raised
    // silhouette; the back views retain this functionally different massing.
    S.box(21.9,26.1,21.0,24.6,52.8,57.0,P.ironHi,P.iron,P.lead);
    for(const F of[S.face([21.9,24.6],[26.1,24.6],0,1),S.face([26.1,21],[21.9,21],0,-1)])vent(F,.3,53.2,3.6,2.9);
    hippedRoof(S,21.5,26.5,20.6,25.0,57.0,2.1,true);
    // High rear fly tower, modest blind brick panels and non-emissive louvres.
    const T=masonry(S,10.2,37.8,4.7,15.4,.3,75.5,2812);
    cornice(S,10.2,37.8,4.7,15.4,74.8);
    hippedRoof(S,9.8,38.2,4.3,15.8,75.5,4.0,true);
    for(const [key,F]of Object.entries(T)){
      const count=key==='front'||key==='back'?4:2;
      for(let i=0;i<count;i++){
        const u=(i+.5)*F.length/count;
        F.block(u-2.5,u+2.5,0,.11,30,65.5,P.brick[2],P.brickR[2],P.brick[0]);
        F.panel(u-2.17,u+2.17,30.6,64.9,key==='right'||key==='back'?P.brickR[0]:P.brick[0],.15);
        vent(F,u-1.7,67.6,3.4,3.6);
      }
      for(const u of[.3,F.length-1.05])F.block(u,u+.75,0,.26,1.0,72.9,P.brick[1],P.brickR[1],P.stone);
      F.block(.1,F.length-.1,0,.25,25.1,25.65,P.stoneD,P.stoneD,P.stoneR);
    }
    // Rear loading dock and staff entrance read as a working theatre, not a
    // copied public facade. Cargo stays behind the building, off the forecourt.
    timberDoor(T.back,10.0,.4,8.0,18.4,false);
    T.back.panel(10.15,17.85,1.0,18.3,(x,y)=>mod(x,.85)<.12?P.woodD:P.greenD,.42);
    T.back.panel(9.1,18.9,19.2,21.8,P.burgundyD,.27);
    letters(T.back,'SCENERY',9.75,19.8,.31,P.paper,.31);
    S.box(19.4,29.5,2.6,4.75,0,1.1,P.stoneD,P.stoneR,P.stone);
    const R=masonry(S,37.8,43.5,6.6,19.0,.3,23.3,2813);
    cornice(S,37.8,43.5,6.6,19,22.8);
    hippedRoof(S,37.5,43.8,6.3,19.3,23.6,3.0,false);
    timberDoor(R.right,6.1,.35,3.9,11.9,false);
    R.right.block(5.45,10.65,.1,.46,13.1,15.9,P.burgundy,P.burgundyD,P.gold);
    letters(R.right,'STAGE',5.77,13.65,.24,P.paper,.51);
    letters(R.right,'DOOR',6.25,15.15,.15,P.paper,.51);
    wallLamp(S,R.right,10.6,11.0);
    sash(S,R.back,1.1,10.5,2.4,6.5,true);
    sceneryCrate(S,5.3,2.0,.08,3.4,3.6,5.5);
    sceneryCrate(S,5.65,2.35,5.6,2.75,2.8,2.5);
    for(const x of[13.2,34.8])S.box(x-.38,x+.38,2.55,3.25,.08,3.5,P.iron,P.ironD,P.ironHi);
    S.flat(43.9,45.05,17.4,20.8,.035,P.ironD);
    for(let y=17.6;y<20.7;y+=.4)S.flat(44.03,44.91,y,y+.13,.04,P.lead);
    for(const [x,y,h]of[[10.0,5.3,74.9],[38.0,5.3,74.9],[4.95,20,42.6],[43.7,7.1,22.8]])rainpipe(S,x,y,h);

    // Substantial three-bay red-brick / cream-stone public elevation.
    const H=masonry(S,4.0,44.0,31.0,39.0,.4,59.0,2810);
    band(S,4,44,31,39,.4,2.2);
    band(S,4,44,31,39,23.15,1.1);
    band(S,4,44,31,39,49.7,.7);
    cornice(S,4,44,31,39,58.45);
    for(const F of[H.front,H.back]){
      for(const u of[.72,12.65,27.35,39.28])pilaster(S,F,u,24.15,32.1,1.12);
      for(const u of[1.85,35.0])F.block(u,u+3.1,.06,.54,51.1,55.8,P.stone,P.stoneR,P.stoneHi);
      for(let u=1.65;u<39;u+=3.15)F.block(u,u+.55,.04,.27,56.6,57.75,P.stone,P.stoneR,P.stoneHi);
    }
    // Central arched foyer window and lower projecting canted side bays.
    archWindow(S,H.front,15.05,27.0,9.9,21.0,true);
    cantedBay(S,7.0,39,27.2,7.4,15.5);
    cantedBay(S,33.6,39,27.2,7.4,15.5);
    for(const u of[3.2,31.2]){
      H.front.block(u,u+5.6,.04,.30,45.0,48.2,P.stone,P.stoneR,P.stoneHi);
      leafRelief(S,H.front,u+2.8,45.3,2.55,.35,P.stoneD);
    }
    for(const side of['left','right']){
      const F=H[side];pilaster(S,F,1.0,24.2,32.1,.85);pilaster(S,F,7.0,24.2,32.1,.85);
      archWindow(S,F,2.35,29.2,3.3,15.0,side==='left');
      sash(S,F,2.55,50.9,2.9,4.2,false);
      posterBox(S,F,2.0,4.0,3.8,8.8,side==='left'?0:1);
    }
    // Entry inscription and paired timber doors beneath the real curved canopy.
    H.front.block(10.65,29.35,.04,.55,24.65,26.9,P.burgundy,P.burgundyD,P.gold);
    letters(H.front,'THEATRE',13.33,25.0,.50,P.gold,.61);
    timberDoor(H.front,11.3,.95,6.9,15.05,true);
    timberDoor(H.front,21.8,.95,6.9,15.05,true);
    ticketWindow(S,H.front,2.65,6.25,5.2,6.8,true);
    posterBox(S,H.front,32.55,3.8,4.9,11.2,0);
    for(const u of[10.2,29.8])pilaster(S,H.front,u,.45,17.2,.85);
    // Three shallow stone treads meet the actual door thresholds. Brass rails
    // follow their slope, and both end posts sit on a visible tread surface.
    for(let i=0;i<3;i++)S.box(14.6+i*.3,33.4-i*.3,39.02,43.5-i*.85,0,.3*(i+1),P.stone,P.stoneR,P.stoneHi);
    for(const x of[15.5,22.0,26.0,32.5]){
      S.beam([x,39.8,.9],[x,39.8,4.10],P.gold,.21);
      S.beam([x,43.0,.3],[x,43.0,3.50],P.gold,.21);
      S.beam([x,39.8,4.10],[x,43.0,3.50],P.gold,.24);
    }
    theatreCanopy(S,H.front,8.95,31.05);
    // A real programme case beside the doors and a restrained street poster.
    H.front.block(19.0,21.0,.1,.75,1.2,5.8,P.wood,P.woodR,P.woodHi);
    for(let z=2.0;z<5.5;z+=1.1){
      H.front.panel(19.15,20.85,z,z+.7,P.paper,.78);
      H.front.panel(19.6,20.45,z+.35,z+.47,P.burgundy,.81);
      H.front.block(19.0,21.0,.1,.91,z-.13,z+.02,P.woodR,P.woodD,P.woodHi);
    }
    for(const u of[1.0,39.0])wallLamp(S,H.front,u,15.7);
    // Flat foyer roof behind the parapet is visible only from the rear; a small
    // leaded skylight belongs to this shallow front range, not the auditorium.
    S.flat(4.4,43.6,31.4,38.6,59.0,P.slateR);
    S.box(16.6,31.4,32.2,36.9,59.0,60.0,P.lead,P.ironD,P.glass);
    for(let x=17;x<31.3;x+=2.35)S.beam([x,32.2,60.08],[x,36.9,60.08],P.lead,.18);
    for(const u of[.1,28.6])sweptParapet(S,H.front,u,11.3,59.25);
    sweptParapet(S,H.front,12.15,15.7,59.25);
    // Little baluster groups fill the parapet gaps; they are open, not painted
    // stripes on a large pale rectangle.
    for(const u of[11.4,28.0])for(let d=0;d<.85;d+=.4){
      const p=H.front.point(u+d,-.15,59.3);cylinder(S,p[0],p[1],59.3,61.4,.17,.2,P.stone,P.stoneR,P.stone,6);
    }
    verticalSign(S);
    for(const [x,y]of[[4.0,31.5],[44.0,38.2]])rainpipe(S,x,y,58.45);
    for(const [x,y]of[[5.8,43.4],[41.4,44.0]])pottedPlant(S,x,y,.08,1.2,P.flower[4]);
    return S.finish({building:281,architecture:'british-edwardian-theatre',pathAxis:'y',
      design:'original-edwardian-theatre-quarter',front:'foyer-and-curved-canopy',rear:'fly-tower-stage-door-and-scenery-dock',
      lightPolicy:'physical-fixtures-only-shared-depth',footprint:[48,48]});
  }

  function streetLamp(S,x,y,z) {
    S.box(x-.66,x+.66,y-.66,y+.66,.02,.5,P.stone,P.stoneR,P.stoneHi);
    cylinder(S,x,y,.5,1.4,.46,.40,P.ironHi,P.ironD,P.iron,8);
    cylinder(S,x,y,1.4,3.0,.33,.25,P.iron,P.ironD,P.ironHi,8);
    cylinder(S,x,y,3.0,z,.20,.135,P.iron,P.ironD,P.ironHi,8);
    for(const zz of[3.1,z-1.4,z-.45])cylinder(S,x,y,zz,zz+.3,.27,.27,P.ironHi,P.ironD,P.ironHi,8);
    // Decorative arm holds a genuine slightly offset lantern, leaving the
    // long central path unobstructed and producing a distinct reverse view.
    const yy=y+1.85;
    S.beam([x,y,z-.2],[x,yy,z+.6],P.iron,.25);
    let last=[x,y,z-1.5];
    for(let i=1;i<=8;i++){
      const a=i*Math.PI/16,p=[x,y+1.85*(1-Math.cos(a)),z-1.5+1.9*Math.sin(a)];
      S.beam(last,p,P.ironHi,.18);last=p;
    }
    lantern(S,x,yy,z+.45,false);
    S.beam([x,y,z-.1],[x,y,z+1.3],P.iron,.20);
    cylinder(S,x,y,z+1.25,z+1.65,.23,.05,P.gold,P.ironD,P.gold,8);
  }
  function stonePlanter(S,x0,x1,y0,y1) {
    S.box(x0+.2,x1-.2,y0+.2,y1-.2,.05,.7,P.stoneD,P.stoneD,P.stoneR);
    S.box(x0+.32,x1-.32,y0+.32,y1-.32,.7,2.55,P.stone,P.stoneR,P.soil);
    S.box(x0,x1,y0,y1,2.5,3.0,P.stone,P.stoneR,P.stoneHi);
    S.flat(x0+.33,x1-.33,y0+.33,y1-.33,3.02,P.soil);
    for(const y of[y0+.85,(y0+y1)/2,y1-.85]){
      const F=S.face([x1,y-.45],[x1,y+.45],1,0);
      F.panel(.1,.8,1.15,2.2,P.stoneD,.04);
      F.panel(.23,.67,1.28,2.1,P.stoneHi,.08);
    }
    for(let i=0;i<10;i++){
      const x=x0+.65+(i%2)*(x1-x0-1.3),y=y0+.67+Math.floor(i/2)*(y1-y0-1.34)/4;
      const z=4.5+(hash(i,13,281)%4)*.25;
      S.beam([x,y,3.03],[x+.12,y+.14,z],P.leaf[3],.14);
      for(const s of[-1,1])S.poly([[x,y,3.5],[x+s*.55,y+.32,3.9],[x+s*.34,y+.58,4.25],[x,y+.23,3.98]],P.leaf[i%4]);
      blossom(S,x+.12,y+.14,z,.6,P.flower[(i+2)%5]);
    }
  }
  function ticketKiosk(S) {
    const x0=.8,x1=4.15,y0=3.7,y1=12.25;
    S.box(x0-.15,x1+.15,y0-.15,y1+.15,.05,.62,P.stoneD,P.stoneR,P.stone);
    S.box(x0,x1,y0,y1,.6,11.85,P.burgundy,P.burgundyD,P.woodHi);
    const front=S.face([x1,y1],[x1,y0],1,0);
    const back=S.face([x0,y0],[x0,y1],-1,0);
    const south=S.face([x0,y1],[x1,y1],0,1),north=S.face([x1,y0],[x0,y0],0,-1);
    // Booth counter faces the path while the employee door is on its short end.
    ticketWindow(S,front,1.15,4.35,5.2,4.9,false);
    front.block(.25,8.3,.04,.26,10.05,11.55,P.burgundyD,P.burgundyD,P.gold);
    letters(front,'TICKETS',.85,10.26,.245,P.gold,.31);
    for(const F of[front,back,south,north]){
      for(const u of[.2,F.length-.5])F.block(u,u+.30,.03,.19,.7,11.85,P.gold,P.woodR,P.gold);
      F.block(.03,F.length-.03,.02,.21,2.7,3.0,P.gold,P.woodR,P.gold);
    }
    timberDoor(south,.55,.64,2.2,8.55,false);
    posterBox(S,back,2.3,3.5,3.55,6.1,1);
    north.panel(.45,2.9,4.0,9.55,(x,z)=>Math.abs(x-1.225)<.13||Math.abs(z-2.55)<.14?P.woodR:P.glassR,.08);
    S.box(x0-.32,x1+.32,y0-.32,y1+.32,11.8,12.35,P.gold,P.woodR,P.woodHi);
    hippedRoof(S,x0-.32,x1+.32,y0-.32,y1+.32,12.35,3.25,false);
    const cx=(x0+x1)/2,cy=(y0+y1)/2;
    cylinder(S,cx,cy,15.4,16.15,.38,.25,P.copper,P.copperR,P.copperHi,8);
    cylinder(S,cx,cy,16.15,17.3,.25,.04,P.gold,P.ironD,P.gold,8);
    // A short roof-corner standard exposes real four-sided glazing to the rear
    // quarters; its solid mount meets the roof and neither surface emits.
    const lampX=x0+.1,lampY=y0+.1;
    S.box(lampX-.22,lampX+.22,lampY-.22,lampY+.22,12.85,13.25,P.copper,P.copperR,P.copperHi);
    S.beam([lampX,lampY,13.0],[lampX,lampY,15.75],P.iron,.24);
    lantern(S,lampX,lampY,15.75,false);
    // Printed tickets and a programme stack remain on the narrow counter.
    S.box(4.67,5.15,6.2,7.45,3.94,4.18,P.paper,P.woodHi,P.paper);
    S.flat(4.73,5.09,6.5,6.63,4.20,P.burgundy);
    const p=front.point(7.4,.30,7.8);lantern(S,p[0],p[1],p[2],false);
    S.beam(front.point(7.4,.12,7.0),[p[0],p[1],7.9],P.iron,.22);
  }
  function theatreModule(theme,view) {
    const S=Scene(1,view,72,92);
    S.flat(0,16,0,16,0,paving);
    for(const x of[5.08,10.72])S.flat(x,x+.18,0,16,.018,P.stoneHi);
    for(const y of[.15,15.64])S.flat(.18,15.82,y,y+.18,.02,P.stoneR);
    if(theme==='ticket')ticketKiosk(S);
    else if(theme==='plaza'){
      // Dressed flagstones, a shallow radial stone medallion and inset brass
      // corners are ground-level details: this remains a fully walkable plaza.
      for(let y=.42;y<15.5;y+=3.8)for(let x=.42;x<15.5;x+=4.98)
        S.flat(x,Math.min(x+4.77,15.6),y,Math.min(y+3.57,15.6),.024,((x+y)|0)%3===0?P.paveHi:P.pave);
      const cx=8.0,cy=8.55,n=16;
      for(let i=0;i<n;i++){
        const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n;
        const points=[[cx,cy,.03],[cx+Math.cos(a)*3.25,cy+Math.sin(a)*3.25,.03],[cx+Math.cos(b)*3.25,cy+Math.sin(b)*3.25,.03]];
        S.poly(points,i%2?P.stoneR:P.stoneHi);
        S.beam(points[1],points[2],P.stoneD,.13);
      }
      S.poly([[8,6.1,.06],[8.9,8.55,.06],[8,9.45,.06],[7.1,8.55,.06]],P.gold);
      S.poly([[8,6.1,.065],[8,9.45,.065],[7.1,8.55,.065]],P.stoneD);
      for(const [x,y]of[[1.4,1.5],[13.65,13.7]]){
        S.flat(x,x+1.15,y,y+.16,.04,P.gold);S.flat(x,x+.16,y,y+1.15,.04,P.gold);
      }
      S.flat(12.7,14.65,2.0,3.45,.04,P.ironD);
      for(let x=12.86;x<14.6;x+=.3)S.flat(x,x+.10,2.12,3.33,.055,P.lead);
    }else if(theme==='rail'){
      S.box(13.4,15.65,.12,15.88,.04,.95,P.stoneD,P.stoneD,P.stoneR);
      for(let y=.18;y<15.8;y+=3.85)S.box(13.2,15.82,y,Math.min(y+3.69,15.9),.94,1.43,P.stone,P.stoneR,P.stoneHi);
      ironRail(S,[14.5,.40],[14.5,15.60],1.43,5.7);
      // Small gate-maker's crest and an unequal end pier distinguish the sides.
      const F=S.face([14.58,5.8],[14.58,10.2],1,0);
      ring(S,F,2.2,4.5,.7,.9,.23,.05,P.gold,14);
      S.box(13.87,15.12,1.1,2.35,1.4,6.5,P.stone,P.stoneR,P.stoneHi);
      S.box(13.62,15.37,.85,2.60,6.42,6.9,P.stone,P.stoneR,P.stoneHi);
      cylinder(S,14.5,1.72,6.9,7.8,.35,.11,P.stone,P.stoneR,P.stoneHi,8);
    }else if(theme==='bench'){
      bench(S,1.55,4.45,8.25,false);
      // Two tiny curved end scrolls and a cast crest enrich the timber seat.
      for(const y of[4.96,12.18]){
        const F=S.face([1.15,y],[4.1,y],0,1);
        ring(S,F,1.75,3.72,.43,.46,.16,.05,P.ironHi,12);
      }
      const F=S.face([1.2,6.55],[1.2,10.0],-1,0);
      ring(S,F,1.725,4.54,.55,.64,.17,.02,P.gold,12);
      S.flat(1.82,2.47,7.65,8.62,2.75,P.paper);
      S.flat(1.9,2.37,7.75,7.9,2.77,P.burgundy);
    }else if(theme==='planter'){
      stonePlanter(S,1.00,4.70,3.95,12.85);
      // A discreet maintenance plaque is at the planter, not in the walkway.
      S.box(2.15,3.5,2.12,2.37,.1,1.4,P.iron,P.ironD,P.ironHi);
      const F=S.face([2.15,2.39],[3.5,2.39],0,1);F.panel(.14,1.2,.58,1.14,P.gold,.035);
    }else if(theme==='lamp'){
      streetLamp(S,2.50,4.0,13.65);
      // Service plate and directional paving joints keep all four rotations
      // geometrically identifiable even before the small lantern is lit.
      S.flat(1.65,3.35,9.3,10.75,.035,P.stoneR);
      S.flat(1.83,3.17,9.48,10.57,.042,P.ironD);
      for(const y of[9.68,10.18])S.flat(2.25,2.75,y,y+.11,.047,P.lead);
    }
    return S.finish({theme,pathAxis:'y',minimumClearPath:5.4,
      design:'edwardian-theatre-'+theme,lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function buildAll() {
    const buildings={281:[]},modules={};
    for(let view=0;view<4;view++){
      buildings[281].push(theatre(view));
      for(const theme of['ticket','plaza','rail','bench','planter','lamp'])modules[theme+'_'+view]=theatreModule(theme,view);
    }
    return {buildings,modules};
  }
  root.BritishTheatreArchitecture013=Object.freeze({version:'GPT-013-art-r1',original:true,simulationRandomCalls:0,buildAll});
})(typeof window==='undefined'?globalThis:window);
