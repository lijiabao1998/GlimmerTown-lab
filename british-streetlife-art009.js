/* GPT-009: original British station hotel, refreshment café and newsstand.
 * All four views project the same complete geometry; they are not flipped art.
 * Native 2:1 grid: x=ax+2i-2j, y=ay-32*sz+i+j-z; one tile is 16 units.
 * A shared opaque surface buffer resolves daylight and physical emission together.
 * No imported images, canvas fonts, simulation state, storage or random source.
 */
(function (root) {
  'use strict';
  const C = s => parseInt(s, 16);
  const P = {
    brick:[C('ad6652'),C('a96350'),C('a45f4e')],
    brickR:[C('824d43'),C('8b5347'),C('7d4941')],
    mortar:C('895e50'), mortarR:C('6a4c43'),
    stone:C('d4c5a8'), stoneHi:C('e4d6ba'), stoneR:C('b5a88f'), stoneD:C('8f8271'),
    slate:C('55636d'), slateHi:C('5d6b74'), slateR:C('424e59'), slateD:C('39464f'),
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

  function brick(right,seed) {
    return (x,y,z)=>{
      const along=right?y:x,row=Math.floor(z/2),phase=(row&1)*1.8;
      if(mod(z,2)<.18||mod(along+phase,3.6)<.16)return right?P.mortarR:P.mortar;
      const h=hash(Math.floor((along+phase)/3.6),row,seed);
      return (right?P.brickR:P.brick)[h%13===0?2:h%7===0?1:0];
    };
  }
  function paving(x,y) {
    const row=Math.floor(y/4),joint=mod(x+(row&1)*3,6);
    if(mod(y,4)<.2||joint<.18)return P.seam;
    return hash(Math.floor((x+(row&1)*3)/6),row,9)%9===0?P.paveHi:P.pave;
  }
  function slate(right) {
    return (x,y,z)=>{
      const row=Math.floor(z/1.3);
      if(mod(z,1.3)<.10)return P.slateD;
      if(mod(x+y+(row&1)*1.25,2.5)<.09)return right?P.slateD:P.slate;
      return right?P.slateR:hash(Math.floor(x/3),row,91)%13===0?P.slateHi:P.slate;
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
    S.box(x0-.3,x1+.3,y0-.3,y1+.3,z,z+(h||1),P.stone,P.stoneR,P.stoneHi);
  }
  function quoins(F,h) {
    for(let z=3;z<h-1;z+=3.2)for(const u of[0,F.length-1.15])
      F.block(u,u+1.15+(Math.floor(z/3.2)%2)*.45,0,.18,z,z+1.4,P.stone,P.stoneR,P.stoneHi);
  }
  function sash(F,u,z,w,h,opt) {
    opt=opt||{};
    const arch=!!opt.arch,right=!!opt.right,frame=right?P.frameR:P.frame;
    const r=w/2,spring=h-r,lit=opt.lit!==false;
    F.panel(u,u+w,z,z+h,(x,y)=>{
      const cap=Math.hypot(x-r,y-spring);
      if(arch&&y>spring&&cap>r)return null;
      if(x<.42||x>w-.42||y<.6||(!arch&&y>h-.5)||(arch&&y>spring&&cap>r-.55))return frame;
      if(Math.abs(x-w/2)<.2||Math.abs(y-h*.48)<.28)return frame;
      if(opt.curtain&&(x<w*.23||x>w*.8)&&y<h*.82)return right?P.stoneD:P.stone;
      return lit?GLOW[right?2:y>h*.64?1:0]:right?P.glassR:P.glass;
    });
    F.block(u-.35,u+w+.35,0,.65,z-.6,z+.15,P.stone,P.stoneR,P.stoneHi);
    if(arch){
      // Each voussoir is a real stone arch segment on the wall face.
      for(let i=0;i<9;i++){
        const a=i*Math.PI/9,b=(i+1)*Math.PI/9;
        const points=[[r+.65,a],[r+.65,b],[r,b],[r,a]].map(q=>F.point(u+r+Math.cos(q[1])*q[0],.11,z+spring+Math.sin(q[1])*q[0]));
        F.polygon(points,i%3===1?P.stoneHi:P.stone);
      }
    }else F.block(u-.28,u+w+.28,0,.35,z+h,z+h+.75,P.stone,P.stoneR,P.stoneHi);
  }
  function door(F,u,z,w,h,arch) {
    F.panel(u-.4,u+w+.4,z,z+h+.5,P.stone);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      const r=w/2,top=arch?h-r+Math.sqrt(Math.max(0,r*r-(x-r)*(x-r))):h;
      if(y>top)return P.stone;
      if(x<.35||x>w-.35||y>top-.45)return P.greenD;
      if(y>h-3.7)return Math.abs(x-r)<.2||mod(x+y,2.4)<.2?P.frame:GLOW[0];
      if(Math.abs(x-r)<.2||y<.75)return P.iron;
      if(y>4.7&&y<5.3&&(Math.abs(x-r)<.9))return P.gold;
      if((y>1.8&&y<4.3)||(y>6.3&&y<h-4.3))return P.greenHi;
      return P.green;
    },.10);
  }
  const GLYPHS = Object.freeze({
    A:['010','101','111','101','101'],C:['011','100','100','100','011'],
    E:['111','100','110','100','111'],F:['111','100','110','100','100'],
    H:['101','101','111','101','101'],I:['111','010','010','010','111'],
    L:['100','100','100','100','111'],N:['101','111','111','111','101'],
    O:['010','101','101','101','010'],R:['110','101','110','101','101'],
    S:['011','100','010','001','110'],T:['111','010','010','010','010'],
    W:['101','101','111','111','101'],' ':['000','000','000','000','000']
  });
  function letters(F,text,u,z,unit,col,d) {
    for(let k=0;k<text.length;k++){
      const g=GLYPHS[text[k]]||GLYPHS[' '];
      for(let row=0;row<5;row++)for(let x=0;x<3;x++)if(g[row][x]==='1')
        F.panel(u+(k*4+x)*unit,u+(k*4+x+1)*unit,z+(4-row)*unit*1.6,z+(5-row)*unit*1.6,col,d,.07);
    }
  }
  function sign(F,text,u,z,w,h,unit) {
    F.block(u,u+w,0,.62,z,z+h,P.green,P.greenD,P.greenHi);
    F.panel(u+.25,u+w-.25,z+.22,z+h-.22,P.greenD,.64);
    letters(F,text,u+(w-(text.length*4-1)*unit)/2,z+(h-8*unit)/2,unit,P.frame,.68);
  }
  function hipRoof(S,x0,x1,y0,y1,z,rise) {
    const cy=(y0+y1)/2,cut=Math.min((x1-x0)/3,(y1-y0)/2),a=[x0+cut,cy,z+rise],b=[x1-cut,cy,z+rise];
    S.poly([[x0,y0,z],[x1,y0,z],b,a],slate(true));
    S.poly([[x1,y0,z],[x1,y1,z],b],slate(true));
    S.poly([[x1,y1,z],[x0,y1,z],a,b],slate(false));
    S.poly([[x0,y1,z],[x0,y0,z],a],slate(false));
    for(const [p,q]of[[[x0,y0,z],[x1,y0,z]],[[x1,y0,z],[x1,y1,z]],[[x1,y1,z],[x0,y1,z]],[[x0,y1,z],[x0,y0,z]]])S.beam(p,q,P.slateD,.45);
    S.beam(a,b,P.lead,.48);
  }
  function gableRoof(S,x0,x1,y0,y1,z,rise) {
    const x=(x0+x1)/2;
    S.poly([[x0,y0,z],[x,y0,z+rise],[x,y1,z+rise],[x0,y1,z]],slate(false));
    S.poly([[x,y0,z+rise],[x1,y0,z],[x1,y1,z],[x,y1,z+rise]],slate(true));
    for(const y of[y0,y1]){
      S.poly([[x0,y,z],[x1,y,z],[x,y,z+rise]],P.stone);
      S.beam([x0,y,z],[x,y,z+rise],P.stoneHi,.48);
      S.beam([x,y,z+rise],[x1,y,z],P.stoneHi,.48);
    }
    S.beam([x,y0,z+rise],[x,y1,z+rise],P.lead,.4);
  }
  function chimney(S,x,y,z,w) {
    // The hidden lower stack penetrates the roof; even hip-end stacks stay seated.
    S.box(x,x+w,y,y+2.5,z-12,z+9,brick(false,82),brick(true,83),P.brick[0]);
    S.box(x-.3,x+w+.3,y-.3,y+2.8,z+7.4,z+9,P.brick[1],P.brickR[1],P.stoneR);
    for(const u of[.8,w-.8]){
      S.box(x+u-.35,x+u+.35,y+.8,y+1.6,z+9,z+12.3,P.pot,P.potR,P.ink);
      S.box(x+u-.45,x+u+.45,y+.7,y+1.7,z+11.3,z+12.4,P.pot,P.potR,P.ink);
    }
  }
  function lantern(S,x,y,z,post) {
    if(post)S.box(x-.25,x+.25,y-.25,y+.25,0,z,P.iron,P.iron,P.ironHi);
    S.box(x-.7,x+.7,y-.65,y+.65,z,z+2.8,P.iron,P.iron,P.iron);
    S.box(x-.48,x+.48,y-.67,y+.67,z+.4,z+2.45,LAMP,LAMP,P.iron);
    S.beam([x,y-.7,z+.35],[x,y-.7,z+2.55],P.iron,.18);
    S.beam([x,y+.7,z+.35],[x,y+.7,z+2.55],P.iron,.18);
    hipRoof(S,x-.95,x+.95,y-.9,y+.9,z+2.85,1.0);
    S.beam([x,y,z+3.8],[x,y,z+4.5],P.iron,.22);
  }
  function railing(S,F,u0,u1,d,z,h) {
    for(let u=u0;u<=u1+.01;u+=1.1)S.beam(F.point(u,d,z),F.point(u,d,z+h),P.iron,.25);
    for(const zz of[z+.7,z+h])S.beam(F.point(u0,d,zz),F.point(u1,d,zz),P.iron,.35);
  }
  function balcony(S,F,u,z,w) {
    F.block(u-.65,u+w+.65,0,2.1,z-1,z,P.stone,P.stoneR,P.stoneHi);
    railing(S,F,u-.55,u+w+.55,2,z,3.4);
    for(const a of[u-.55,u+w+.55]){
      S.beam(F.point(a,0,z+3.4),F.point(a,2,z+3.4),P.iron,.3);
      S.beam(F.point(a,0,z+.6),F.point(a,2,z+.6),P.iron,.25);
      S.beam(F.point(a,0,z-2.4),F.point(a,1.7,z-1),P.stoneR,.7);
    }
  }
  function dormer(S,x,y,z,back) {
    const y0=back?y:y-4,y1=back?y+4:y;
    const f=masonry(S,x-2.4,x+2.4,y0,y1,z-4,z+4,71);
    sash(back?f.back:f.front,.9,z-.7,3,4,{arch:true,lit:!back});
    gableRoof(S,x-2.85,x+2.85,y0-.3,y1+.3,z+4.1,3.1);
  }
  function bench(S,x,y,w) {
    for(const a of[x+.7,x+w-.7]){
      S.box(a-.3,a+.3,y+.15,y+2.1,0,2.9,P.iron,P.iron,P.ironHi);
      S.beam([a,y+1.9,1.4],[a,y+2.4,5.2],P.iron,.38);
      S.beam([a,y-.2,3.2],[a,y+2,3.2],P.iron,.35);
    }
    for(let d=0;d<3;d++)S.box(x,x+w,y+d*.7,y+d*.7+.5,2.45,2.9,P.wood,P.greenD,P.wood);
    for(const z of[3.35,4.35])S.box(x,x+w,y+2.25,y+2.65,z,z+.65,P.wood,P.greenD,P.wood);
  }
  function planter(S,x,y,w,d,z) {
    S.box(x,x+w,y,y+d,0,z,P.stone,P.stoneR,P.stoneHi);
    S.box(x-.15,x+w+.15,y-.15,y+d+.15,z-.45,z+.25,P.stone,P.stoneR,P.stoneHi);
    S.flat(x+.45,x+w-.45,y+.45,y+d-.45,z+.27,P.soil);
    // Low clipped shrubs, each an opaque four-sided foliage crown.
    for(let i=0;i<3;i++){
      const cx=x+(i+.5)*w/3,cy=y+d/2,r=Math.min(w/5,d*.42),top=z+1.6+(i%2)*.6;
      const base=[[cx-r,cy-r,z+.35],[cx+r,cy-r,z+.35],[cx+r,cy+r,z+.35],[cx-r,cy+r,z+.35]];
      for(let q=0;q<4;q++)S.poly([base[q],base[(q+1)%4],[cx,cy,top]],(xx,yy,zz)=>{
        const h=hash(Math.floor(xx*2),Math.floor(yy*2)+Math.floor(zz*2),31);
        return zz>z+1&&h%17===0?P.flower[h%3]:P.leaf[(q+(h%2))%4];
      });
    }
  }
  function rainpipes(S,x0,x1,y0,y1,z) {
    for(const [x,y]of[[x0-.2,y0+.8],[x1+.2,y1-.8]]){
      S.beam([x,y,2],[x,y,z],P.iron,.32);
      for(let h=7;h<z;h+=12)S.box(x-.25,x+.25,y-.35,y+.35,h,h+.35,P.ironHi,P.ironHi,P.ironHi);
    }
  }

  function hotel(view) {
    const S=Scene(3,view,208,204);
    S.flat(0,48,0,48,0,paving);
    S.box(3.3,44.7,4.3,40.7,0,2,P.stoneD,P.stoneD,P.stone);
    const W=masonry(S,4,44,5,40,2,59,274);
    for(const z of[2.3,23,41,57.7])band(S,4,44,5,40,z,z===57.7?1.6:.8);
    // Complete elevations: seven facade bays and six on each return wall.
    for(const [side,F]of Object.entries(W)){
      const front=side==='front',back=side==='back',n=front||back?7:6,step=F.length/n;
      quoins(F,57);
      for(let i=0;i<n;i++){
        const u=(i+.5)*step-1.75;
        if(!(front&&i===3)&&!(back&&i===1))sash(F,u,6,3.5,13.5,{arch:true,right:side==='right',lit:(i+(back?2:0))%3!==0});
        sash(F,u,27,3.5,10.8,{arch:true,right:side==='right',curtain:i%3===0,lit:i%4!==1});
        sash(F,u+.1,45,3.3,9,{right:side==='right',lit:(i+(back?1:0))%3===0});
        // Stone spandrels tie each storey to the whole brick frontage.
        F.panel(u+.15,u+3.35,39.1,40.1,P.stoneR);
        if((front&&i!==3&&i%2===1)||(!front&&!back&&i===2))balcony(S,F,u,26.5,3.5);
      }
    }
    door(W.back,6.75,2,4.5,15,false);
    sign(W.front,'HOTEL',14.9,20,10.2,3.2,.35);
    // A proper arched stone porch with an open center, supporting a balcony.
    door(W.front,16.7,2,6.6,16,true);
    for(const u of[15.4,23.1]){
      W.front.block(u,u+1.5,0,5.4,1.2,16.4,P.stone,P.stoneR,P.stoneHi);
      W.front.block(u-.25,u+1.75,4.1,5.6,1.2,2.4,P.stoneHi,P.stoneR,P.stoneHi);
      W.front.block(u-.2,u+1.7,4.1,5.6,15,16.5,P.stoneHi,P.stoneR,P.stoneHi);
    }
    for(let i=0;i<11;i++){
      const a=i*Math.PI/11,b=(i+1)*Math.PI/11;
      const q=[[4.65,a],[4.65,b],[3.25,b],[3.25,a]].map(t=>W.front.point(20+Math.cos(t[1])*t[0],5.45,13+Math.sin(t[1])*t[0]));
      S.poly(q,i%3===0?P.stoneHi:P.stone);
    }
    W.front.block(15.1,24.9,0,5.65,18,19.1,P.stone,P.stoneR,P.stoneHi);
    railing(S,W.front,15.4,24.6,5.4,19.1,3.6);
    for(const u of[15.4,24.6])S.beam(W.front.point(u,0,22.7),W.front.point(u,5.4,22.7),P.iron,.35);
    for(let i=0;i<3;i++)S.box(18.4,29.6,45.2,47.5-i*.65,0,.45*(i+1),P.stoneR,P.stoneD,P.stone);
    // Continuous steep slate roof, paired dormers on both principal elevations.
    hipRoof(S,3.2,44.8,4.2,40.8,60,14);
    for(const x of[11,20,29,38]){dormer(S,x,36.2,65.2,false);dormer(S,x,8.8,65.2,true);}
    for(const [x,y]of[[7,18],[36,23]])chimney(S,x,y,71,4);
    rainpipes(S,4,44,5,40,58.7);
    for(const x of[17.6,30.4]){
      S.beam([x,40.1,12],[x,42,13],P.iron,.35);
      lantern(S,x,42,13,false);
    }
    bench(S,5.4,44,7.2);planter(S,35.3,43.5,7.6,2.5,1.8);
    return S.finish({building:274,architecture:'railway-hotel'});
  }

  function teaTable(S,x,y) {
    S.box(x-.25,x+.25,y-.25,y+.25,.2,3.6,P.iron,P.iron,P.ironHi);
    S.flat(x-1.5,x+1.5,y-1.4,y+1.4,3.7,P.stoneHi);
    for(const dx of[-2.1,2.1]){
      S.box(x+dx-.65,x+dx+.65,y-.65,y+.65,0,1.8,P.green,P.greenD,P.wood);
      S.box(x+dx-.65,x+dx+.65,y+.55,y+.85,1.8,3.5,P.green,P.greenD,P.greenHi);
    }
    S.box(x+.1,x+.55,y-.3,y+.15,3.72,4.3,P.paper,P.stoneR,P.paper);
  }
  function cafe(view) {
    const S=Scene(2,view,136,148);
    S.flat(0,32,0,32,0,paving);
    S.box(2.7,29.3,2.7,25.3,0,1.4,P.stoneD,P.stoneD,P.stone);
    const W=masonry(S,3,29,3,25,1.4,35,275);
    for(const z of[1.6,19.7,34])band(S,3,29,3,25,z,.9);
    for(const [side,F]of Object.entries(W)){
      quoins(F,33);
      for(let i=0;i<3;i++)sash(F,2.4+i*(F.length-4.8)/3,23,3.9,8.8,{right:side==='right',curtain:side==='back',lit:i!==1});
      if(side!=='front'){
        for(let i=0;i<2;i++)sash(F,3+i*(F.length-8),6,4.3,9.5,{arch:true,right:side==='right',lit:side==='right'});
        if(side==='back')door(F,11.1,1.5,4.2,13,false);
      }
    }
    // A complete green timber shopfront: panelled apron, glazed display bays,
    // recessed center door, continuous fascia, pilasters and striped canvas awning.
    W.front.block(1.2,24.8,0,.4,1.4,17,P.green,P.greenD,P.greenHi);
    for(const [u,w]of[[2.1,7.2],[16.7,7.2]]){
      W.front.panel(u,u+w,5,14.3,(x,z)=>{
        if(x<.3||x>w-.3||z<.3||z>9||Math.abs(x-w/2)<.25||Math.abs(z-7.2)<.23)return P.greenHi;
        if(z<1.2&&mod(x,1.6)<1.1)return P.pot;
        return z>6.8?GLOW[1]:GLOW[0];
      },.43);
      W.front.panel(u+.5,u+w-.5,2.2,4.1,P.greenD,.43);
      W.front.block(u-.25,u+w+.25,.35,.8,4.65,5.15,P.greenHi,P.greenD,P.greenHi);
    }
    for(const u of[1.2,9.8,15.5,24.1])W.front.block(u,u+.75,0,.7,1.5,17,P.greenHi,P.greenD,P.greenHi);
    door(W.front,10.8,1.5,4.4,12.7,false);
    sign(W.front,'TEA ROOM',1.2,15.2,23.6,3.2,.35);
    const x0=4.2,x1=27.8,y0=25.5,y1=28.8;
    S.poly([[x0,y0,15],[x1,y0,15],[x1,y1,12.4],[x0,y1,12.4]],x=>Math.floor((x-x0)/1.4)%2?P.frame:P.green);
    S.wall([x0,y1],[x1,y1],11.6,12.4,x=>Math.floor((x-x0)/1.4)%2?P.frame:P.green);
    for(const x of[x0+.5,x1-.5])S.beam([x,25.4,10.1],[x,y1,12.2],P.iron,.3);
    hipRoof(S,2.3,29.7,2.3,25.7,36,11.5);
    dormer(S,16,22.2,40.2,false);
    chimney(S,5,10.5,42,3.6);chimney(S,23,14,42,3.6);
    rainpipes(S,3,29,3,25,34.5);
    S.beam([4.1,25.1,17.9],[4.1,26.6,18.4],P.iron,.3);lantern(S,4.1,26.6,18.4,false);
    teaTable(S,8.1,29.3);teaTable(S,23.7,29.3);
    return S.finish({building:275,architecture:'station-refreshment-cafe'});
  }

  function newsstand(view) {
    const S=Scene(1,view,72,104);
    S.flat(0,16,0,16,0,paving);
    S.box(2.2,13.8,2.2,12.8,0,1,P.stoneD,P.stoneD,P.stone);
    S.box(2.8,13.2,2.8,12.2,1,17.5,P.green,P.greenD,P.greenHi);
    const W={front:S.face([2.8,12.2],[13.2,12.2],0,1),back:S.face([13.2,2.8],[2.8,2.8],0,-1),
      right:S.face([13.2,12.2],[13.2,2.8],1,0),left:S.face([2.8,2.8],[2.8,12.2],-1,0)};
    for(const [side,F]of Object.entries(W)){
      for(const u of[.15,F.length-.6])F.block(u,u+.45,0,.3,1,17.5,P.greenHi,P.greenD,P.greenHi);
      F.panel(.8,F.length-.8,2,5.3,(u,z)=>mod(u,2.1)<.13||z<.15||z>3.15?P.greenHi:P.greenD);
      if(side==='back'){
        door(F,3.1,1,4.2,13.3,false);
        continue;
      }
      F.panel(1.05,F.length-1.05,6,13.7,(u,z)=>{
        if(z>6.6||z<.25||mod(u,2.45)<.2)return P.greenHi;
        if(z<5.5){
          const px=mod(u,2.45),py=mod(z,2.65);
          if(px>.28&&px<2.1&&py>.25&&py<2.35)return py>1.8?P.paperR:mod(px+py,1)<.14?P.ironHi:P.paper;
        }
        return GLOW[0];
      },.09);
      F.block(.55,F.length-.55,0,1.25,5.7,6.25,P.wood,P.greenD,P.wood);
      // Framed folded shutters are attached to each trading opening.
      for(const u of[.55,F.length-1.2])F.panel(u,u+.65,6.4,13.7,(x,z)=>mod(z,.95)<.16?P.greenHi:P.greenD,.3);
    }
    for(const F of[W.front,W.right,W.left]){
      F.block(.35,F.length-.35,0,.5,14.2,18.1,P.stone,P.stoneR,P.stoneHi);
      F.panel(.65,F.length-.65,14.45,17.85,P.frame,.53);
      letters(F,'NEWS',(F.length-15*.42)/2,14.48,.42,P.greenD,.57);
    }
    // A small hipped pavilion cap has fascia, sloping slate and a real finial.
    S.box(1.8,14.2,1.8,13.2,17.8,18.8,P.greenHi,P.greenD,P.greenHi);
    hipRoof(S,1.5,14.5,1.5,13.5,19,6.3);
    S.box(7.5,8.5,7,8,25.2,26.3,P.lead,P.ironHi,P.lead);
    S.beam([8,7.5,26],[8,7.5,28.5],P.iron,.35);
    // News bundles lie on the physical front counter, never in the walkway.
    for(const x of[4.1,7.8,10.5]){
      S.box(x,x+1.8,12.35,13.1,6.26,6.85,P.paper,P.paperR,P.paper);
      S.flat(x+.8,x+1,12.35,13.1,6.87,P.ironHi);
    }
    S.beam([3.1,12.3,13],[3.1,13.2,13.5],P.iron,.3);lantern(S,3.1,13.2,13.5,false);
    return S.finish({building:276,architecture:'railway-newsstand'});
  }

  function fingerpost(S,x,y) {
    S.box(x-.75,x+.75,y-.75,y+.75,0,.8,P.stone,P.stoneR,P.stoneHi);
    S.box(x-.3,x+.3,y-.3,y+.3,.8,17.6,P.iron,P.iron,P.ironHi);
    S.box(x-.5,x+.5,y-.5,y+.5,16.5,17.2,P.gold,P.gold,P.gold);
    S.beam([x,y,17.6],[x,y,19],P.iron,.45);
    const a=S.face([x-5.4,y],[x+5.4,y],0,1);
    const b=S.face([x,y+4.4],[x,y-4.4],1,0);
    for(const [F,w,z]of[[a,10.8,14.6],[b,8.8,11.5]]){
      F.block(.7,w-.7,-.18,.18,z,z+1.9,P.frame,P.stoneR,P.frame);
      for(const d of[-.2,.2])S.poly([F.point(w-.8,d,z),F.point(w+.1,d,z+.95),F.point(w-.8,d,z+1.9)],P.frame);
      // Tiny cast direction marks use geometric strokes rather than an unreadable font.
      for(const u of[1.5,2.45,3.4,4.35])F.panel(u,u+.45,z+.7,z+1.15,P.iron,.2);
    }
  }
  function streetModule(theme,view) {
    const S=Scene(1,view,72,92);
    S.flat(0,16,0,16,0,paving);
    if(theme==='bench'){
      bench(S,3,9.3,10);
      // Small cast feet and front clearance leave the middle of the paid path open.
      S.box(2.4,3.7,9.3,11.7,0,.45,P.stoneR,P.stoneD,P.stone);
      S.box(12.3,13.6,9.3,11.7,0,.45,P.stoneR,P.stoneD,P.stone);
    }else if(theme==='planter'){
      planter(S,2.2,9.1,11.6,4.2,2.6);
      S.flat(2.4,13.6,13.7,14,.03,P.stoneHi);
    }else if(theme==='fingerpost')fingerpost(S,8,9);
    return S.finish({theme});
  }
  function buildAll() {
    const buildings={274:[],275:[],276:[]},modules={};
    for(let view=0;view<4;view++){
      buildings[274].push(hotel(view));
      buildings[275].push(cafe(view));
      buildings[276].push(newsstand(view));
      for(const theme of['bench','planter','fingerpost'])modules[theme+'_'+view]=streetModule(theme,view);
    }
    return {buildings,modules};
  }
  root.BritishStreetLifeArchitecture009=Object.freeze({version:'GPT-009-art-r1',original:true,simulationRandomCalls:0,buildAll});
})(typeof window==='undefined'?globalThis:window);
