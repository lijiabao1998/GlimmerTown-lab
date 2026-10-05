/* GPT-010: original British regional natural-history museum and formal forecourt.
 * All four views project the same complete geometry; they are not flipped art.
 * Native 2:1 grid: x=ax+2i-2j, y=ay-32*sz+i+j-z; one tile is 16 units.
 * A shared opaque surface buffer resolves daylight and physical emission together.
 * No imported images, canvas fonts, simulation state, storage or random source.
 */
(function (root) {
  'use strict';
  const C = s => parseInt(s, 16);
  const P = {
    brick:[C('ae6854'),C('a6624f'),C('b47059')],
    brickR:[C('865144'),C('905746'),C('7d4a41')],
    mortar:C('895e50'), mortarR:C('6a4c43'),
    stone:C('d4c5a8'), stoneHi:C('e4d6ba'), stoneR:C('b5a88f'), stoneD:C('8f8271'),
    slate:C('4f606d'), slateHi:C('637580'), slateR:C('3d4e5a'), slateD:C('354550'),
    lead:C('849093'), iron:C('374247'), ironHi:C('697777'), ink:C('293840'),
    green:C('375b4d'), greenHi:C('527563'), greenD:C('28493f'), wood:C('77674e'),
    glass:C('526c75'), glassHi:C('77919a'), glassR:C('344d59'),
    frame:C('dacfb7'), frameR:C('b4b09e'), gold:C('cbb37e'),
    pave:C('b4afa0'), paveHi:C('bdb6a5'), paveR:C('a7a697'), seam:C('979b94'),
    leaf:[C('456b40'),C('567b46'),C('678a4d'),C('355b38')],
    flower:[C('c58091'),C('e7c475'),C('ded2ba')], soil:C('68594a'),
    pot:C('b77655'), potR:C('875744'), paper:C('e6dfc9'), paperR:C('bdb8a4'),
    warm:C('efc989'), warmHi:C('ffdfa1'), warmD:C('dba766')
  };
  const GLOW = [[P.glass,P.warm],[P.glassHi,P.warmHi],[P.glassR,P.warmD]];
  const LAMP = [C('dfca92'),P.warmHi];
  const mod = (n,d) => ((n%d)+d)%d;
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

  // Surfaces remain opaque. In particular the glass roofs are colored geometry,
  // not translucent overlays; their iron ribs and every nearer wall occlude light.
  function brick(right,seed) {
    return (x,y,z)=>{
      const along=right?y:x,row=Math.floor(z/1.9),phase=(row&1)*1.9;
      if(mod(z,1.9)<.17||mod(along+phase,3.8)<.14)return right?P.mortarR:P.mortar;
      const h=hash(Math.floor((along+phase)/3.8),row,seed);
      return (right?P.brickR:P.brick)[h%9===0?2:h%5===0?1:0];
    };
  }
  function paving(x,y) {
    const row=Math.floor(y/4),u=x+(row&1)*3;
    if(mod(y,4)<.18||mod(u,6)<.16)return P.seam;
    return hash(Math.floor(u/6),row,10)%8===0?P.paveHi:P.pave;
  }
  function lawn(x,y) {
    const h=hash(Math.floor(x*1.5),Math.floor(y*1.5),277);
    return h%17===0?C('719152'):h%7===0?C('65864c'):C('597d48');
  }
  function slate(right) {
    return (x,y,z)=>{
      const row=Math.floor(z/1.35);
      if(mod(z,1.35)<.11||mod(x+y+(row&1)*1.5,3)<.10)return P.slateD;
      return right?P.slateR:hash(Math.floor(y/3),row,77)%13===0?P.slateHi:P.slate;
    };
  }
  function masonry(S,x0,x1,y0,y1,z0,z1,seed) {
    S.box(x0,x1,y0,y1,z0,z1,brick(false,seed),brick(true,seed),P.stoneD);
    return {
      front:S.face([x0,y1],[x1,y1],0,1),
      back:S.face([x1,y0],[x0,y0],0,-1),
      right:S.face([x1,y1],[x1,y0],1,0),
      left:S.face([x0,y0],[x0,y1],-1,0)
    };
  }
  function band(S,x0,x1,y0,y1,z,h) {
    S.box(x0-.3,x1+.3,y0-.3,y1+.3,z,z+h,P.stone,P.stoneR,P.stoneHi);
  }
  function ring(S,F,u,z,r,t,d,material,segments) {
    const n=segments||20;
    for(let i=0;i<n;i++){
      const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n;
      S.poly([[r,a],[r,b],[r-t,b],[r-t,a]].map(q=>F.point(u+Math.cos(q[1])*q[0],d,z+Math.sin(q[1])*q[0])),
        typeof material==='function'?material(i):material,.06);
    }
  }
  function archWindow(S,F,u,z,w,h,opt) {
    opt=opt||{};
    const r=w/2,spring=h-r,right=!!opt.right,frame=right?P.frameR:P.frame;
    F.panel(u,u+w,z,z+h,(x,y)=>{
      const rr=Math.hypot(x-r,y-spring);
      if(y>spring&&rr>r)return null;
      if(x<.36||x>w-.36||y<.48||(y>spring&&rr>r-.42))return P.ironHi;
      if(Math.abs(x-r)<.18||Math.abs(y-h*.34)<.18||Math.abs(y-spring+.45)<.2)return frame;
      // Closed lower blinds and ironwork are physical non-emissive pixels.
      if(opt.blind&&y<2.6)return P.greenD;
      return opt.lit===false?(right?P.glassR:P.glass):GLOW[right?2:y>spring?1:0];
    },.1);
    F.block(u-.45,u+w+.45,0,.8,z-.7,z+.05,P.stone,P.stoneR,P.stoneHi);
    for(const x of[u-.7,u+w])F.block(x,x+.7,0,.28,z,z+spring,P.stone,P.stoneR,P.stoneHi);
    for(let i=0;i<11;i++){
      const a=i*Math.PI/11,b=(i+1)*Math.PI/11;
      S.poly([[r+.75,a],[r+.75,b],[r,b],[r,a]].map(q=>F.point(u+r+Math.cos(q[1])*q[0],.3,z+spring+Math.sin(q[1])*q[0])),
        i%3===0?P.stoneHi:P.stone,.06);
    }
    // The central keystone projects farther than the surrounding voussoirs.
    F.block(u+r-.32,u+r+.32,.2,.5,z+h-.12,z+h+.95,P.stoneHi,P.stoneR,P.stoneHi);
  }
  function door(F,u,z,w,h) {
    F.panel(u-.55,u+w+.55,z,z+h+.6,P.stone,.06);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      const r=w/2,top=h-r+Math.sqrt(Math.max(0,r*r-(x-r)*(x-r)));
      if(y>top)return P.stone;
      if(x<.3||x>w-.3||y>top-.4||Math.abs(x-r)<.18)return P.greenD;
      if(y>h-r-2.5)return mod(x,1.35)<.16||Math.abs(y-h+r+.7)<.18?P.frame:GLOW[0];
      if((y>1&&y<4.3)||(y>5.1&&y<9.5))return P.greenHi;
      if(y>4.35&&y<4.9&&Math.abs(x-r)<.8)return P.gold;
      return P.green;
    },.12);
  }
  function buttress(F,u,z,h,w) {
    w=w||1.3;
    F.block(u-w/2,u+w/2,0,.8,z,z+h,P.brick[0],P.brickR[0],P.stone);
    F.block(u-w/2-.25,u+w/2+.25,0,1.1,z,z+1.3,P.stone,P.stoneR,P.stoneHi);
    for(let a=z+8;a<z+h-1;a+=9)F.block(u-w/2-.12,u+w/2+.12,0,.95,a,a+.65,P.stone,P.stoneR,P.stoneHi);
    F.block(u-w/2-.2,u+w/2+.2,0,1,z+h-1,z+h,P.stone,P.stoneR,P.stoneHi);
  }
  function cornice(S,W,x0,x1,y0,y1,z) {
    band(S,x0,x1,y0,y1,z,1.15);
    for(const F of Object.values(W))for(let u=.6;u<F.length-.3;u+=2.1)
      F.block(u,u+.7,0,.5,z-1.0,z,P.stone,P.stoneR,P.stoneHi);
  }
  function gableRoof(S,x0,x1,y0,y1,z,rise,seed) {
    const x=(x0+x1)/2;
    S.poly([[x0,y0,z],[x,y0,z+rise],[x,y1,z+rise],[x0,y1,z]],slate(false));
    S.poly([[x,y0,z+rise],[x1,y0,z],[x1,y1,z],[x,y1,z+rise]],slate(true));
    for(const y of[y0,y1]){
      S.poly([[x0,y,z],[x1,y,z],[x,y,z+rise]],brick(false,seed));
      S.beam([x0,y,z],[x,y,z+rise],P.stone,.75);
      S.beam([x,y,z+rise],[x1,y,z],P.stoneHi,.75);
      S.box(x-.45,x+.45,y-.45,y+.45,z+rise-.1,z+rise+1.2,P.stone,P.stoneR,P.stoneHi);
      S.beam([x,y,z+rise+1.2],[x,y,z+rise+3],P.iron,.28);
    }
    for(const xx of[x0,x1])S.beam([xx,y0,z],[xx,y1,z],P.iron,.5);
    S.beam([x,y0,z+rise],[x,y1,z+rise],P.lead,.5);
    // Alternating short ridge crests are tied to the real roof, not floating props.
    for(let y=y0+2;y<y1-1;y+=3)S.poly([[x,y-.55,z+rise],[x,y+.55,z+rise],[x,y,z+rise+1.1]],P.iron);
    return {front:S.face([x0,y1],[x1,y1],0,1),back:S.face([x1,y0],[x0,y0],0,-1)};
  }
  function glazedRoof(S,x0,x1,y0,y1,z,rise) {
    const cx=(x0+x1)/2;
    const glass=(right)=>(x,y,zz)=>{
      const row=Math.floor(y/3.3),u=(zz-z)/rise;
      if(mod(y-y0,3.3)<.19||mod(u,.25)<.014)return P.ironHi;
      const h=hash(Math.floor(x*2),row,1078);
      return right?(h%11===0?P.glass:P.glassR):(h%7===0?C('88a6a8'):C('718f96'));
    };
    S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],glass(false));
    S.poly([[cx,y0,z+rise],[x1,y0,z],[x1,y1,z],[cx,y1,z+rise]],glass(true));
    for(const y of[y0,y1]){
      S.poly([[x0,y,z],[x1,y,z],[cx,y,z+rise]],P.glass);
      for(const xx of[x0,x1])S.beam([xx,y,z],[cx,y,z+rise],P.frame,.48);
      S.beam([cx,y,z],[cx,y,z+rise],P.ironHi,.4);
      S.beam([x0,y,z],[x1,y,z],P.stone,.5);
    }
    for(let y=y0;y<=y1+.01;y+=3.3){
      S.beam([x0,y,z+.12],[cx,y,z+rise+.12],P.ironHi,.32);
      S.beam([cx,y,z+rise+.12],[x1,y,z+.12],P.lead,.32);
    }
    for(const t of[.25,.5,.75]){
      S.beam([x0+(cx-x0)*t,y0,z+rise*t+.12],[x0+(cx-x0)*t,y1,z+rise*t+.12],P.lead,.22);
      S.beam([x1+(cx-x1)*t,y0,z+rise*t+.12],[x1+(cx-x1)*t,y1,z+rise*t+.12],P.ironHi,.22);
    }
    for(const x of[x0,cx,x1])S.beam([x,y0,z+(x===cx?rise:0)+.2],[x,y1,z+(x===cx?rise:0)+.2],P.iron,.48);
    // Raised iron ridge vent and two capped ventilators distinguish a museum roof.
    for(const y of[y0+6,y1-6]){
      S.box(cx-1,cx+1,y-.9,y+.9,z+rise-.2,z+rise+2,P.ironHi,P.iron,P.lead);
      S.box(cx-1.35,cx+1.35,y-1.2,y+1.2,z+rise+1.8,z+rise+2.3,P.lead,P.ironHi,P.lead);
    }
  }
  function ammonite(S,F,u,z,r,d) {
    d=d===undefined?.42:d;
    F.panel(u-r,u+r,z-r,z+r,(x,y)=>Math.hypot(x-r,y-r)<r?P.stone:null,d);
    ring(S,F,u,z,r,.45,d+.04,i=>i%3===0?P.stoneHi:P.stoneR,24);
    // A logarithmic-looking spiral and radial septa, carved into a stone roundel.
    let last=null;
    for(let i=0;i<=42;i++){
      const a=i*.31,rr=(.10+i/42*.76)*r,p=F.point(u+Math.cos(a)*rr,d+.1,z+Math.sin(a)*rr);
      if(last)S.beam(last,p,P.stoneD,.29);
      if(i>17&&i%3===0)S.beam(p,F.point(u+Math.cos(a+.08)*(rr+.17*r),d+.12,z+Math.sin(a+.08)*(rr+.17*r)),P.stoneD,.23);
      last=p;
    }
    ring(S,F,u,z,r-.62,.13,d+.07,P.stoneHi,24);
  }
  function leafRelief(S,F,u,z,h,d,col) {
    const p=(x,y)=>F.point(u+x,d,z+y),c=col||P.stoneHi;
    S.beam(p(0,0),p(0,h),c,.27);
    for(let i=1;i<=4;i++){
      const a=i*h/5,w=(1-Math.abs(i-2.5)/4)*h*.28;
      for(const sign of[-1,1])S.poly([p(0,a-.3),p(sign*w,a+.55),p(sign*w*.55,a+1.35),p(0,a+.7)],c,.09);
    }
  }
  const GLYPHS={
    A:['010','101','111','101','101'],E:['111','100','110','100','111'],
    H:['101','101','111','101','101'],I:['111','010','010','010','111'],
    M:['101','111','111','101','101'],N:['101','111','111','111','101'],
    R:['110','101','110','101','101'],S:['011','100','010','001','110'],
    T:['111','010','010','010','010'],U:['101','101','101','101','111'],
    ' ':['000','000','000','000','000']
  };
  function letters(F,text,u,z,unit,col,d) {
    for(let i=0;i<text.length;i++){
      const g=GLYPHS[text[i]]||GLYPHS[' '];
      for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(g[y][x]==='1')
        F.panel(u+(i*4+x)*unit,u+(i*4+x+1)*unit,z+(4-y)*unit*1.6,z+(5-y)*unit*1.6,col,d,.09);
    }
  }
  function lantern(S,x,y,z,post) {
    if(post){
      S.box(x-.65,x+.65,y-.65,y+.65,0,.65,P.stone,P.stoneR,P.stoneHi);
      S.box(x-.23,x+.23,y-.23,y+.23,.65,z,P.iron,P.iron,P.ironHi);
      S.box(x-.38,x+.38,y-.38,y+.38,z-.45,z,P.ironHi,P.iron,P.ironHi);
    }
    S.box(x-.72,x+.72,y-.65,y+.65,z,z+2.8,P.iron,P.iron,P.ironHi);
    S.box(x-.47,x+.47,y-.67,y+.67,z+.4,z+2.35,LAMP,LAMP,P.iron);
    for(const yy of[y-.7,y+.7])S.beam([x,yy,z+.3],[x,yy,z+2.5],P.iron,.18);
    for(const [a,b]of[[[x-.95,y-.85,z+2.8],[x+.95,y-.85,z+2.8]],[[x+.95,y-.85,z+2.8],[x+.95,y+.85,z+2.8]],[[x+.95,y+.85,z+2.8],[x-.95,y+.85,z+2.8]],[[x-.95,y+.85,z+2.8],[x-.95,y-.85,z+2.8]]])S.poly([a,b,[x,y,z+4]],P.iron);
    S.beam([x,y,z+3.8],[x,y,z+4.8],P.iron,.24);
  }
  function ironFence(S,a,b,z,h) {
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),n=Math.max(1,Math.floor(len/.95));
    for(let i=0;i<=n;i++){
      const x=a[0]+dx*i/n,y=a[1]+dy*i/n;
      S.beam([x,y,z],[x,y,z+h+.45],P.iron,.24);
      S.poly([[x-.3,y,z+h],[x+.3,y,z+h],[x,y,z+h+.8]],P.iron);
    }
    for(const zz of[z+.8,z+h-.25])S.beam([a[0],a[1],zz],[b[0],b[1],zz],P.iron,.34);
  }
  function pier(S,x,y,z,h) {
    S.box(x-1,x+1,y-1,y+1,z,z+h,P.stone,P.stoneR,P.stoneHi);
    S.box(x-1.22,x+1.22,y-1.22,y+1.22,z+h-.3,z+h+.45,P.stone,P.stoneR,P.stoneHi);
    S.box(x-1.25,x+1.25,y-1.25,y+1.25,z,z+.6,P.stone,P.stoneR,P.stoneHi);
    for(let zz=z+2;zz<z+h-.5;zz+=2.2)S.box(x-1.02,x+1.02,y-1.02,y+1.02,zz,zz+.16,P.stoneD,P.stoneD,P.stoneR);
  }
  function hedge(S,x0,x1,y0,y1,z,h) {
    const tex=(x,y,zz)=>P.leaf[hash(Math.floor(x*2),Math.floor(y*2)+Math.floor(zz*2),103)%4];
    S.box(x0,x1,y0,y1,z,z+h,tex,tex,tex);
  }
  function bed(S,x0,x1,y0,y1) {
    S.box(x0,x1,y0,y1,0,.55,P.stoneR,P.stoneD,P.stoneHi);
    S.flat(x0+.45,x1-.45,y0+.45,y1-.45,.57,lawn);
    for(const y of[y0+.55,y1-1])hedge(S,x0+.5,x1-.5,y,y+.55,.58,1.25);
    for(const x of[x0+.5,x1-1.05])hedge(S,x,x+.55,y0+1.1,y1-1.1,.58,1.25);
  }
  function specimen(S,x,y,z,scale) {
    const s=scale||1;
    S.box(x-.5*s,x+.5*s,y-.5*s,y+.5*s,z,z+2.4*s,P.wood,P.greenD,P.wood);
    for(let k=0;k<8;k++){
      const a=k*Math.PI/4,cx=x+Math.cos(a)*1.1*s,cy=y+Math.sin(a)*1.1*s;
      S.poly([[x,y,z+.7*s],[cx-Math.sin(a)*.6*s,cy+Math.cos(a)*.6*s,z+1.8*s],[x+Math.cos(a)*2*s,y+Math.sin(a)*2*s,z+2.6*s],[cx+Math.sin(a)*.6*s,cy-Math.cos(a)*.6*s,z+1.8*s]],P.leaf[k%4]);
    }
  }
  function flowerStrip(S,x0,x1,y0,y1,z) {
    S.flat(x0,x1,y0,y1,z,P.soil);
    for(let x=x0+.45;x<x1-.2;x+=1.25)for(let y=y0+.35;y<y1-.2;y+=1.15){
      S.box(x-.23,x+.23,y-.23,y+.23,z,z+.75,P.leaf[0],P.leaf[3],P.flower[hash(x*2,y*2,16)%3]);
    }
  }
  function sideBench(S,x,y,length,flip) {
    const q=flip?-1:1,lo=Math.min(x,x+q*2.1),hi=Math.max(x,x+q*2.1);
    for(const yy of[y+.6,y+length-.6]){
      S.box(lo+.2,hi-.2,yy-.23,yy+.23,0,2.6,P.iron,P.iron,P.ironHi);
      S.beam([x,yy,1.1],[x-q*.25,yy,5.2],P.iron,.34);
      S.beam([x,yy,3.3],[x+q*2,yy,3.3],P.iron,.32);
    }
    for(let i=0;i<3;i++){
      const xx=x+q*(.2+i*.65);
      S.box(xx-.24,xx+.24,y,y+length,2.4,2.9,P.wood,P.greenD,P.wood);
    }
    for(const z of[3.5,4.5])S.box(x-q*.25-.22,x-q*.25+.22,y,y+length,z,z+.58,P.wood,P.greenD,P.wood);
  }
  function rainpipes(S,x0,x1,y0,y1,z) {
    for(const [x,y]of[[x0-.3,y0+1.6],[x1+.3,y1-1.6]]){
      S.beam([x,y,1.3],[x,y,z],P.iron,.35);
      S.beam([x,y,1.3],[x+.5,y,1.0],P.iron,.35);
      for(let zz=8;zz<z;zz+=9)S.box(x-.25,x+.25,y-.3,y+.3,zz,zz+.32,P.ironHi,P.ironHi,P.ironHi);
    }
  }
  function column(S,x,y,z0,z1,r) {
    const n=8;
    S.box(x-r-.4,x+r+.4,y-r-.4,y+r+.4,z0,z0+1.15,P.stone,P.stoneR,P.stoneHi);
    for(let i=0;i<n;i++){
      const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n;
      S.poly([[x+Math.cos(a)*r,y+Math.sin(a)*r,z0+1],[x+Math.cos(b)*r,y+Math.sin(b)*r,z0+1],
        [x+Math.cos(b)*r,y+Math.sin(b)*r,z1-.9],[x+Math.cos(a)*r,y+Math.sin(a)*r,z1-.9]],i<4?P.stone:P.stoneR);
    }
    S.box(x-r-.35,x+r+.35,y-r-.35,y+r+.35,z1-1,z1,P.stoneHi,P.stoneR,P.stoneHi);
  }
  function openPortico(S) {
    const F=S.face([24,54.1],[40,54.1],0,1),r=5.4,spring=18;
    S.box(24,40,46.8,54.6,0,4.2,P.stoneR,P.stoneD,P.stoneHi);
    // Seven broad risers ascend continuously into the open porch.
    for(let i=0;i<7;i++)S.box(23.4,40.6,54.5,61.5-i,0,.6*(i+1),P.stone,P.stoneR,P.stoneHi);
    for(const x of[23.7,40.3]){
      S.beam([x,61,3.1],[x,54.1,7.25],P.iron,.35);
      for(let i=0;i<4;i++)S.beam([x,60.7-i*1.9,.6+i*1.14],[x,60.7-i*1.9,3.3+i*1.14],P.iron,.27);
    }
    for(const [x0,x1]of[[24,26.6],[37.4,40]]){
      S.box(x0,x1,47.0,54.1,4.2,18,P.stone,P.stoneR,P.stoneHi);
      S.box(x0-.2,x1+.2,47,54.35,4.2,5.5,P.stone,P.stoneR,P.stoneHi);
      for(let z=7;z<17;z+=2.6)S.box(x0-.03,x1+.03,47,54.15,z,z+.14,P.stoneR,P.stoneD,P.stoneR);
    }
    column(S,25.3,54.1,5.4,18.2,.6);column(S,38.7,54.1,5.4,18.2,.6);
    // Each arch segment has its own intrados and front/back spandrel. There is
    // genuinely no opaque rectangular wall across the entrance aperture.
    for(let i=0;i<16;i++){
      const a=i*Math.PI/16,b=(i+1)*Math.PI/16;
      const ua=8+Math.cos(a)*r,ub=8+Math.cos(b)*r,za=spring+Math.sin(a)*r,zb=spring+Math.sin(b)*r;
      for(const d of[-6.9,0])S.poly([F.point(ua,d,za),F.point(ub,d,zb),F.point(ub,d,25.3),F.point(ua,d,25.3)],d?P.stoneD:P.stone);
      S.poly([F.point(ua,-6.9,za),F.point(ub,-6.9,zb),F.point(ub,0,zb),F.point(ua,0,za)],P.stoneD);
      const pts=[[r+1.0,a],[r+1.0,b],[r,b],[r,a]].map(q=>F.point(8+Math.cos(q[1])*q[0],.15,spring+Math.sin(q[1])*q[0]));
      S.poly(pts,i%3===0?P.stoneHi:P.stoneR,.05);
    }
    for(const [u0,u1]of[[0,2.6],[13.4,16]])F.block(u0,u1,-6.9,.1,18,25.3,P.stone,P.stoneR,P.stoneHi);
    F.block(-.25,16.25,-7.2,.45,25.2,29.5,P.stone,P.stoneR,P.stoneHi);
    F.panel(2,14,25.65,29.15,P.stoneR,.49);
    letters(F,'MUSEUM',(16-23*.43)/2,25.72,.43,P.ink,.55);
    gableRoof(S,23.5,40.5,46.6,54.7,29.8,6.6,1001);
    // Cast wall brackets stand in front of their lamps; the shared buffer resolves it.
    for(const x of[25,39]){
      S.beam([x,54.3,15],[x,55.3,16.1],P.iron,.3);
      lantern(S,x,55.3,16.1,false);
    }
  }
  function museum(view) {
    const S=Scene(4,view,264,232);
    S.flat(0,64,0,64,0,paving);
    // Pale perimeter setts unite the building to the surrounding native footpaths.
    for(const [x0,x1,y0,y1]of[[0,64,0,.5],[0,64,63.5,64],[0,.5,0,64],[63.5,64,0,64]])S.flat(x0,x1,y0,y1,.02,P.stoneR);

    // Two deep, low exhibition ranges. Their daylight roofs remain visibly lower
    // than the central collection hall and both front gabled pavilions.
    for(const [x0,x1,seed]of[[4.5,21.5,2771],[42.5,59.5,2772]]){
      S.box(x0-.35,x1+.35,6.1,35.4,0,2.4,P.stoneD,P.stoneD,P.stone);
      const W=masonry(S,x0,x1,6.5,35,2.4,25,seed);
      band(S,x0,x1,6.5,35,3,.8);band(S,x0,x1,6.5,35,22.8,.85);
      cornice(S,W,x0,x1,6.5,35,24.3);
      for(const [side,F]of Object.entries(W)){
        const count=side==='front'||side==='back'?3:4,step=F.length/count;
        for(let i=0;i<count;i++)archWindow(S,F,(i+.5)*step-1.6,6.1,3.2,14.1,{right:side==='right',lit:(i+(side==='back'?1:0))%3!==1});
        for(let u=.5;u<F.length;u+=step)buttress(F,u,2.4,21.8,1.1);
      }
      glazedRoof(S,x0-.45,x1+.45,6,35.4,25.7,10.3);
      rainpipes(S,x0,x1,6.5,35,24.7);
    }

    // A taller, narrow gabled nave supplies a completely different massing from
    // the preceding station hotel: one museum hall, lower galleries and skylights.
    S.box(21.5,42.5,6.5,47.4,0,3.1,P.stoneD,P.stoneD,P.stone);
    const H=masonry(S,22,42,7,47,3.1,47,2770);
    for(const [z,h]of[[3.3,1.1],[25.9,.85],[44.8,.7]])band(S,22,42,7,47,z,h);
    cornice(S,H,22,42,7,47,46.4);
    for(const [side,F]of Object.entries(H)){
      const end=side==='front'||side==='back',count=end?3:5,step=F.length/count;
      for(let i=0;i<count;i++){
        archWindow(S,F,(i+.5)*step-1.8,32,3.6,11.6,{right:side==='right',lit:i%3!==1});
        if(!end)archWindow(S,F,(i+.5)*step-1.7,8,3.4,15.4,{right:side==='right',lit:i%2===0});
      }
      for(const u of[.6,F.length-.6])buttress(F,u,3.1,42.6,1.3);
    }
    door(H.front,6,4.2,8,20);
    door(H.back,7.25,3.1,5.5,16);
    for(const u of[2,14.5])archWindow(S,H.back,u,8,3.5,15.1,{lit:u===2});
    for(let i=0;i<4;i++)S.box(28,36,3.2+i*.9,7.15,0,.78*(i+1),P.stone,P.stoneR,P.stoneHi);
    const HG=gableRoof(S,21.4,42.6,6.4,47.6,48,20,2773);
    ammonite(S,HG.front,10.6,55.3,4.35,.44);
    ammonite(S,HG.back,10.6,55.3,4.0,.44);
    // Small carved leaf panels on both rear and front gable springing zones.
    for(const F of[HG.front,HG.back])for(const u of[2.5,18.7])leafRelief(S,F,u,48.9,4.2,.44,P.stone);
    for(const side of['left','right']){
      const F=H[side];
      for(const u of[8,24,36]){
        F.block(u-1.5,u+1.5,0,.3,27.7,30.2,P.stone,P.stoneR,P.stoneHi);
        leafRelief(S,F,u,27.9,2.1,.37,P.stoneD);
      }
    }
    rainpipes(S,22,42,7,47,46.5);

    // Paired Romanesque front pavilions: broad arched exhibition windows,
    // projecting buttresses, carved spandrels, red-brick gables and pale coping.
    for(const [x0,x1,seed]of[[4,22,2774],[42,60,2775]]){
      S.box(x0-.35,x1+.35,32.6,47.4,0,2.4,P.stoneD,P.stoneD,P.stone);
      const W=masonry(S,x0,x1,33,47,2.4,33.3,seed);
      band(S,x0,x1,33,47,3,.85);band(S,x0,x1,33,47,28.6,.9);
      cornice(S,W,x0,x1,33,47,32.7);
      for(const [side,F]of Object.entries(W)){
        const n=side==='front'||side==='back'?3:2,step=F.length/n;
        for(let i=0;i<n;i++){
          archWindow(S,F,(i+.5)*step-1.65,7.1,3.3,17.4,{right:side==='right',lit:(i+(x0===4?0:1))%3!==1});
          if(side==='front'){
            F.block((i+.5)*step-1.45,(i+.5)*step+1.45,0,.23,26.1,28.2,P.stone,P.stoneR,P.stoneHi);
            leafRelief(S,F,(i+.5)*step,26.1,1.9,.32,P.stoneD);
          }
        }
        for(const u of[.55,F.length-.55])buttress(F,u,2.4,29.9,1.25);
      }
      const G=gableRoof(S,x0-.55,x1+.55,32.4,47.6,34.3,11.8,seed+10);
      ammonite(S,G.front,9.55,38.2,2.25,.42);
      ammonite(S,G.back,9.55,38.2,2.0,.42);
      rainpipes(S,x0,x1,33,47,33);
    }

    openPortico(S);
    // Narrow teal collection banners are hung from fixed iron brackets on the
    // main facade, giving the natural-history identity another readable scale.
    for(const [u,leaf]of[[.8,true],[17.1,false]]){
      H.front.block(u,u+2.1,.35,.5,12.7,26.5,P.green,P.greenD,P.greenHi);
      S.beam(H.front.point(u-.25,.55,26.8),H.front.point(u+2.35,.55,26.8),P.iron,.32);
      if(leaf)leafRelief(S,H.front,u+1.05,16.1,6.8,.57,P.gold);
      else ammonite(S,H.front,u+1.05,21.1,.78,.57);
    }

    // A modest forecourt belongs to the 4x4 footprint. The substantial garden
    // beyond this apron is made from independently paid native walking paths.
    for(const [x0,x1]of[[3,21.8],[42.2,61]]){
      bed(S,x0,x1,49.9,61);
      flowerStrip(S,x0+1.2,x1-1.2,50.7,52,.62);
      for(const x of[x0+3.3,x1-3.3])specimen(S,x,57,.6,.78);
    }
    // A small outdoor fossil display has a physical stone plinth and carved shell.
    S.box(11.1,14.5,54.1,57.2,.7,2.1,P.stone,P.stoneR,P.stoneHi);
    S.box(11.6,14,54.5,56.8,2.1,6.5,P.stone,P.stoneR,P.stoneHi);
    ammonite(S,S.face([11.6,56.8],[14,56.8],0,1),1.2,4.35,1.0,.08);
    // Rear wall lamps, a specimen courtyard bench, and drainage details ensure
    // rear camera views are designed elevations rather than blank backs.
    for(const x of[25.2,38.8]){
      S.beam([x,6.8,15],[x,5.6,16],P.iron,.3);
      lantern(S,x,5.6,16,false);
    }
    sideBench(S,1.6,14,8.5,false);sideBench(S,62.4,20,8.5,true);
    for(const [a,b]of[[[2,62],[22,62]],[[42,62],[62,62]],[[1.9,48.7],[1.9,62]],[[62.1,48.7],[62.1,62]]])ironFence(S,a,b,.2,4.1);
    for(const x of[2,22,42,62])pier(S,x,62,0,5.0);
    for(const [x,y]of[[22,62],[42,62]])lantern(S,x,y,5.5,false);
    return S.finish({building:277,architecture:'regional-natural-history-museum',pathAxis:'y',design:'original-regional-Romanesque'});
  }
  function formalModule(theme,view) {
    const S=Scene(1,view,72,92);
    S.flat(0,16,0,16,0,paving);
    // All three modules retain a visibly unblocked central 5.2-unit walk from
    // y=0 to y=16. Rotating the complete sprite rotates this real path axis.
    for(const x of[5.15,10.55])S.flat(x,x+.3,0,16,.025,P.stoneHi);
    if(theme==='garden'){
      for(const [x0,x1]of[[.5,4.7],[11.3,15.5]]){
        bed(S,x0,x1,.7,15.3);
        flowerStrip(S,x0+.95,x1-.95,2,4.1,.6);
        flowerStrip(S,x0+.95,x1-.95,11.9,14,.6);
        specimen(S,(x0+x1)/2,8,.58,.73);
        S.box(x0+.8,x0+1.65,10.1,10.6,.6,1.1,P.stone,P.stoneR,P.stoneHi);
      }
    }else if(theme==='bench'){
      S.flat(.6,4.7,.6,15.4,.04,lawn);S.flat(11.3,15.4,.6,15.4,.04,lawn);
      sideBench(S,1.7,4.4,7.4,false);sideBench(S,14.3,4.4,7.4,true);
      flowerStrip(S,.95,4.35,1.0,2.6,.1);flowerStrip(S,11.65,15.05,13.4,15,.1);
      // Low black cast-iron litter bin beside a bench, with a covered opening.
      S.box(11.9,13.4,1.5,3.2,.1,3.5,P.iron,P.greenD,P.ironHi);
      S.box(11.7,13.6,1.3,3.4,3.5,4.0,P.iron,P.iron,P.ironHi);
      S.wall([11.95,3.42],[13.35,3.42],2.75,3.32,P.ink);
    }else if(theme==='gate'){
      for(const x of[3.3,12.7])pier(S,x,8,0,10.5);
      for(const x of[3.3,12.7])lantern(S,x,8,11,false);
      ironFence(S,[.3,8],[2.2,8],.2,6.9);ironFence(S,[13.8,8],[15.7,8],.2,6.9);
      // The wrought-iron leaves are opened against the sides of the approach.
      // No gate leaf or plinth crosses the middle of the walk at ground level.
      ironFence(S,[4.45,8.6],[4.65,13.2],.2,6.8);
      ironFence(S,[11.55,8.6],[11.35,13.2],.2,6.8);
      let last=null;
      for(let i=0;i<=20;i++){
        const a=i*Math.PI/20,p=[8+Math.cos(a)*4.75,8,11.1+Math.sin(a)*4.25];
        if(last)S.beam(last,p,P.iron,.4);last=p;
      }
      const F=S.face([3.3,8.05],[12.7,8.05],0,1);
      F.panel(3.55,5.85,12.1,14.6,P.green,.05);
      ammonite(S,F,4.7,13.35,.9,.12);
    }
    return S.finish({theme,pathAxis:'y',minimumClearPath:5.2});
  }
  function buildAll() {
    const buildings={277:[]},modules={};
    for(let view=0;view<4;view++){
      buildings[277].push(museum(view));
      for(const theme of['gate','garden','bench'])modules[theme+'_'+view]=formalModule(theme,view);
    }
    return {buildings,modules};
  }
  root.BritishMuseumArchitecture010=Object.freeze({version:'GPT-010-art-r1',original:true,simulationRandomCalls:0,buildAll});
})(typeof window==='undefined'?globalThis:window);
