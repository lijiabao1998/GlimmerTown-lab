/* British architecture study, UKP01–03. Prototype-only, no game registration.
 * Native 2:1 pixel geometry: x=ax+2i-2j, y=ay-32*sz+i+j-z.
 * A deterministic opaque surface z-buffer writes day and emissive pixels together.
 * No raster imports, shared RNG, Canvas anti-aliasing, or changes to existing assets.
 */
(function (root) {
  'use strict';
  const C = h => parseInt(h.replace('#', ''), 16);
  const P = {
    ink:C('303437'), iron:C('374247'), ironHi:C('697777'),
    brick:[C('ad6652'),C('b56d57'),C('a35d4c'),C('a96150')],
    brickR:[C('824d43'),C('8e574a'),C('78483f'),C('875045')],
    mortar:C('895e50'), mortarR:C('6a4c43'),
    stone:C('d4c5a8'), stoneHi:C('e4d6ba'), stoneR:C('b5a88f'), stoneD:C('8f8271'),
    roof:[C('55636d'),C('5c6b74'),C('4e5b66'),C('626f76')],
    roofR:[C('424e59'),C('485761'),C('3c4953'),C('4e5b65')],
    roofEdge:C('39464f'), lead:C('849093'), copper:C('658878'),
    glass:C('526c75'), glassHi:C('77919a'), glassR:C('344d59'),
    frame:C('dacfb7'), frameR:C('b4b09e'), wood:C('4f6257'),
    green:C('375b4d'), greenHi:C('527563'), greenD:C('28493f'),
    tile:C('355647'), tileHi:C('486b55'), tileR:C('28463b'),
    gold:C('cbb37e'), goldHi:C('ead49a'),
    path:[C('b4afa0'),C('aaa89b'),C('bdb6a5'),C('a7a697')],
    ground:C('82916c'), grass:[C('85956e'),C('7d8e64'),C('8a996f')],
    leaf:[C('456b40'),C('567b46'),C('678a4d'),C('355b38')],
    flower:[C('c58091'),C('e7c475'),C('ded2ba')],
    warm:[C('efc989'),C('ffdfa1'),C('dba766')], dark:C('293840')
  };
  const hash = (x,y,s) => {
    let n=Math.imul((x|0)^Math.imul(y|0,374761393),668265263)^(s|0);
    n=Math.imul(n^(n>>>13),1274126177); return (n^(n>>>16))>>>0;
  };
  const mod=(n,d)=>((n%d)+d)%d;
  const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
  const specs = Object.freeze([
    Object.freeze({id:'UKP01',nm:'維多利亞紅磚連棟屋',en:'Victorian brick terrace',sz:2,w:136,h:150,ax:68,ay:148}),
    Object.freeze({id:'UKP02',nm:'狐狸與雀鳥街角酒館',en:'The Fox & Finch corner pub',sz:2,w:136,h:150,ax:68,ay:148}),
    Object.freeze({id:'UKP03',nm:'愛德華時代公共圖書館',en:'Edwardian public library',sz:3,w:208,h:220,ax:104,ay:218})
  ]);

  function Scene(spec) {
    const {w,h,ax,ay,sz}=spec, oy=ay-32*sz, count=w*h;
    const dep=new Float64Array(count); dep.fill(-Infinity);
    const day=new Uint32Array(count), night=new Uint32Array(count), kind=new Uint8Array(count);
    const project=p=>[ax+2*p[0]-2*p[1],oy+p[0]+p[1]-p[2]];
    function triangle(a,b,c,material,bias,tag) {
      const A=project(a),B=project(b),D=project(c);
      const det=(B[1]-D[1])*(A[0]-D[0])+(D[0]-B[0])*(A[1]-D[1]);
      if(Math.abs(det)<1e-8)return;
      const x0=Math.max(0,Math.floor(Math.min(A[0],B[0],D[0]))),x1=Math.min(w-1,Math.ceil(Math.max(A[0],B[0],D[0])));
      const y0=Math.max(0,Math.floor(Math.min(A[1],B[1],D[1]))),y1=Math.min(h-1,Math.ceil(Math.max(A[1],B[1],D[1])));
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
        const px=x+.5,py=y+.5;
        const p=((B[1]-D[1])*(px-D[0])+(D[0]-B[0])*(py-D[1]))/det;
        const q=((D[1]-A[1])*(px-D[0])+(A[0]-D[0])*(py-D[1]))/det,r=1-p-q;
        if(p<-.00001||q<-.00001||r<-.00001)continue;
        const i=p*a[0]+q*b[0]+r*c[0],j=p*a[1]+q*b[1]+r*c[1],z=p*a[2]+q*b[2]+r*c[2];
        const d=i+j+2*z+(bias||0),k=y*w+x;
        if(d<dep[k]-.000001)continue;
        const v=typeof material==='function'?material(i,j,z):material;
        if(v===null||v===undefined)continue;
        dep[k]=d;day[k]=Array.isArray(v)?v[0]:v;night[k]=Array.isArray(v)?(v[1]||0):0;kind[k]=tag===undefined?2:tag;
      }
    }
    function poly(points,mat,bias,tag) {for(let k=1;k<points.length-1;k++)triangle(points[0],points[k],points[k+1],mat,bias,tag);}
    function flat(i0,i1,j0,j1,z,mat,bias,tag) {poly([[i0,j0,z],[i1,j0,z],[i1,j1,z],[i0,j1,z]],mat,bias,tag);}
    function wall(a,b,z0,z1,mat,bias,tag) {poly([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]],mat,bias,tag);}
    function face(a,b) {
      const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
      const point=u=>[a[0]+dx*u/length,a[1]+dy*u/length];
      const local=(i,j)=>((i-a[0])*dx+(j-a[1])*dy)/length;
      return {a,b,length,point,local,panel(u0,u1,z0,z1,mat,bias){
        wall(point(u0),point(u1),z0,z1,typeof mat==='function'?(i,j,z)=>mat(local(i,j)-u0,z-z0,i,j):mat,bias===undefined?.08:bias);
      }};
    }
    function box(i0,i1,j0,j1,z0,z1,L,R,T,tag) {
      wall([i0,j1],[i1,j1],z0,z1,L,0,tag);wall([i1,j0],[i1,j1],z0,z1,R,0,tag);
      if(T!==null)flat(i0,i1,j0,j1,z1,T===undefined?L:T,0,tag);
    }
    function line(a,b,col,width,lit) {
      const A=project(a),B=project(b),steps=Math.max(1,Math.ceil(Math.max(Math.abs(B[0]-A[0]),Math.abs(B[1]-A[1]))*2));
      for(let s=0;s<=steps;s++){
        const t=s/steps,p=lerp(a,b,t),v=project(p),x=Math.floor(v[0]),y=Math.floor(v[1]);
        for(let yy=0;yy<(width||1);yy++)for(let xx=0;xx<(width||1);xx++){
          if(x+xx<0||x+xx>=w||y+yy<0||y+yy>=h)continue;
          const k=(y+yy)*w+x+xx,d=p[0]+p[1]+2*p[2]+.3;
          if(d>=dep[k]-.15){dep[k]=d;day[k]=col;night[k]=lit||0;kind[k]=2;}
        }
      }
    }
    function finish() {
      const img=document.createElement('canvas'),nc=document.createElement('canvas');img.width=nc.width=w;img.height=nc.height=h;
      const g=img.getContext('2d'),ng=nc.getContext('2d'),id=g.createImageData(w,h),nd=ng.createImageData(w,h);
      for(let k=0;k<count;k++){
        if(kind[k]===0)continue;
        const v=day[k],n=night[k],o=k*4;
        id.data[o]=v>>>16;id.data[o+1]=(v>>>8)&255;id.data[o+2]=v&255;id.data[o+3]=255;
        if(n){nd.data[o]=n>>>16;nd.data[o+1]=(n>>>8)&255;nd.data[o+2]=n&255;nd.data[o+3]=255;}
      }
      g.putImageData(id,0,0);ng.putImageData(nd,0,0);
      return Object.assign({},spec,{img,night:nc});
    }
    return {spec,project,poly,flat,wall,face,box,line,finish};
  }

  function brick(right,seed,H) {
    const c=right?P.brickR:P.brick,m=right?P.mortarR:P.mortar;
    return (u,z)=>{
      const row=Math.floor(z/2),course=mod(z,2),b=Math.floor((u+(row&1)*1.25)/2.5);
      if(z<2)return right?P.stoneD:P.stoneR;
      if(H&&z>H-1.5)return right?C('68493f'):C('845747');
      if(course<.22||mod(u+(row&1)*1.25,2.5)<.11)return m;
      const h=hash(b,row,seed);
      if(z<4&&h%4===0)return c[2];
      return c[(h>>>5)%c.length];
    };
  }
  function wallBrick(S,a,b,z0,z1,right,seed) {const f=S.face(a,b);f.panel(0,f.length,z0,z1,brick(right,seed,z1-z0),0);return f;}
  function tileRoof(right,seed,axis) {
    const pal=right?P.roofR:P.roof;
    return (i,j,z)=>{
      const across=axis==='j'?j:i,down=axis==='j'?i:j,row=Math.floor(down*1.5),seam=mod(down*1.5,1);
      const col=Math.floor((across+(row&1)*.65)/1.3),n=hash(col,row,seed);
      if(seam<.12)return right?P.roofEdge:C('475760');
      if(mod(across+(row&1)*.65,1.3)<.07)return pal[2];
      return pal[(n>>>8)&3];
    };
  }
  function ridge(S,a,b,z,col) {S.line([a[0],a[1],z],[b[0],b[1],z],col||P.lead,1);S.line([a[0],a[1]+.3,z-.7],[b[0],b[1]+.3,z-.7],P.roofEdge,1);}
  function gableRoof(S,i0,i1,j0,j1,z,rise,seed) {
    const m=(j0+j1)/2;
    S.poly([[i0,j0,z],[i1,j0,z],[i1,m,z+rise],[i0,m,z+rise]],tileRoof(true,seed,'i'));
    S.poly([[i0,m,z+rise],[i1,m,z+rise],[i1,j1,z],[i0,j1,z]],tileRoof(false,seed,'i'));
    S.poly([[i1,j0,z],[i1,j1,z],[i1,m,z+rise]],(i,j,zz)=>brick(true,seed+4)(j,zz),-.01);
    S.line([i1,j0,z],[i1,m,z+rise],P.stoneR,1);S.line([i1,m,z+rise],[i1,j1,z],P.stoneR,1);
    ridge(S,[i0,m],[i1,m],z+rise,P.lead);
    S.line([i0,j1,z],[i1,j1,z],P.iron,1);
  }
  function hipRoof(S,outline,r1,r2,z,rise,seed) {
    const A=outline.map(p=>[p[0],p[1],z]),R=[r1[0],r1[1],z+rise],Q=[r2[0],r2[1],z+rise];
    S.poly([A[0],A[1],Q,R],tileRoof(true,seed,'i'));
    if(A.length===5){S.poly([A[1],A[2],Q],tileRoof(true,seed+1,'j'));S.poly([A[2],A[3],Q],tileRoof(true,seed+2,'j'));S.poly([A[3],A[4],R,Q],tileRoof(false,seed+3,'i'));S.poly([A[4],A[0],R],tileRoof(false,seed+4,'j'));}
    else{S.poly([A[1],A[2],Q],tileRoof(true,seed+1,'j'));S.poly([A[2],A[3],R,Q],tileRoof(false,seed+2,'i'));S.poly([A[3],A[0],R],tileRoof(false,seed+3,'j'));}
    for(let k=0;k<A.length;k++)S.line(A[k],A[(k+1)%A.length],P.roofEdge,1);
    ridge(S,r1,r2,z+rise,P.lead);
  }
  function chimney(S,i,j,z,width,depth,pots,seed) {
    S.box(i,i+width,j,j+depth,z-5,z+8,(ii,jj,zz)=>brick(false,seed)(ii,zz),(ii,jj,zz)=>brick(true,seed)(jj,zz),P.brick[0]);
    S.box(i-.3,i+width+.3,j-.3,j+depth+.3,z+6.3,z+8,P.brick[1],P.brickR[0],P.stoneR);
    for(let p=0;p<pots;p++){
      const pi=i+.4+(width-.8)*(p+.5)/pots,pj=j+depth*.5;
      S.box(pi-.36,pi+.36,pj-.36,pj+.36,z+8,z+12,C('c1815b'),C('915b46'),C('5c443b'));
      S.box(pi-.48,pi+.48,pj-.48,pj+.48,z+10.9,z+12.1,C('ce9167'),C('a26b50'),C('594238'));
    }
  }
  function cornice(S,i0,i1,j0,j1,z) {
    S.box(i0-.35,i1+.35,j0-.35,j1+.35,z,z+1.3,P.stone,P.stoneR,P.stoneHi);
    S.line([i0,j1+.35,z-.7],[i1,j1+.35,z-.7],P.stoneD,1);
  }
  function windowOn(S,F,u,z,w,h,opt) {
    opt=opt||{};const right=!!opt.right,frame=right?P.frameR:P.frame,glass=right?P.glassR:P.glass;
    const arch=opt.arch?Math.min(w*.6,3):0,border=opt.border||.38;
    const archTop=x=>!arch?h:h-arch+arch*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
    F.panel(u-.4,u+w+.4,z-.8,z+.1,right?P.stoneD:P.stoneR,.14);
    F.panel(u-.55,u+w+.55,z-.25,z+.55,right?P.stoneR:P.stoneHi,.22);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      const top=archTop(x);if(y>top)return null;
      if(x<border||x>w-border||y<.6||y>top-.65)return frame;
      if(Math.abs(y-(opt.transom===undefined?h*.5:opt.transom))<.36)return frame;
      const panes=opt.panes||2;
      if(panes>1&&Math.abs(mod(x,w/panes))<.22)return frame;
      if(opt.leaded&&y>h*.67&&mod(x*1.7+y*.5,2.1)<.16)return right?P.iron:P.ironHi;
      if(opt.books&&y<3&&mod(x,1.1)<.7)return [mod(x,2.2)<1.1?C('987b55'):C('5f755d'),0];
      if(opt.curtain&&(x<w*.25||x>w*.80)&&y<h*.91)return right?C('a49c82'):C('cab998');
      const lit=opt.lit===false?0:P.warm[opt.warm===undefined?0:opt.warm];
      const tint=y>h*.69?(right?P.glass:P.glassHi):glass;
      return [opt.stained&&y>h*.73?C('b19460'):tint,lit];
    },.18);
    // Local material bands sit on the actual facade and cannot leak over openings.
    if(!arch)F.panel(u-.3,u+w+.3,z+h,z+h+1.05,right?P.stoneR:P.stone,.20);
  }
  function doorway(S,F,u,z,w,h,opt) {
    opt=opt||{};const right=!!opt.right,col=opt.col||P.green;
    F.panel(u-.45,u+w+.45,z,z+h+1,right?P.stoneD:P.stone,.15);
    F.panel(u,u+w,z,z+h,(x,y)=>{
      if(x<.35||x>w-.35||y>h-.4)return right?P.iron:P.wood;
      if(y>h-3.4){if(Math.abs(x-w/2)<.18||y>h-3&&mod(x+y,2.4)<.18)return P.frameR;return [P.glass,P.warm[1]];}
      if(Math.abs(x-w/2)<.16&&opt.double)return P.iron;
      if(y<1.1)return P.iron;
      if((y>2&&y<6.2)||(y>7.8&&y<h-4.8)){if(x<.8||x>w-.8||Math.abs(y-2.4)<.3||Math.abs(y-8.1)<.3)return right?P.greenD:P.greenHi;}
      if(y>6.4&&y<7.1&&x>w*.69&&x<w*.84)return P.gold;
      return col;
    },.24);
  }
  function step(S,i0,i1,j0,j1,n) {for(let s=0;s<n;s++)S.box(i0,i1,j0,j1-s*.65,0,(s+1)*.65,P.stoneR,P.stoneD,P.path[2]);}
  function lamp(S,i,j,h,wall) {
    const z=wall||0;
    S.box(i-.35,i+.35,j-.35,j+.35,z,z+1,P.iron,P.iron,P.ironHi);
    S.line([i,j,z],[i,j,z+h],P.iron,1);
    S.box(i-.6,i+.6,j-.6,j+.6,z+h-1.8,z+h+.6,P.iron,P.iron,P.ironHi);
    S.box(i-.35,i+.35,j-.36,j+.36,z+h-1.5,z+h+.2,[C('dfca92'),P.warm[1]],[C('c4a76e'),P.warm[0]],P.iron);
    S.poly([[i-.8,j-.8,z+h+.5],[i+.8,j-.8,z+h+.5],[i+.8,j+.8,z+h+.5],[i-.8,j+.8,z+h+.5],[i,j,z+h+1.8]],P.iron);
    S.line([i,j,z+h+1],[i,j,z+h+2.3],P.iron,1);
  }
  function railing(S,a,b,h,gate) {
    const L=Math.hypot(b[0]-a[0],b[1]-a[1]);
    S.wall(a,b,0,.8,P.stoneR);
    for(let u=0;u<=L+.01;u+=1.2){if(gate&&u>gate[0]&&u<gate[1])continue;const p=lerp(a,b,u/L);S.line([p[0],p[1],.8],[p[0],p[1],h],P.iron,1);}
    const segs=gate?[[0,gate[0]],[gate[1],L]]:[[0,L]];
    for(const [u,v]of segs)for(const z of [h-1,1.6]){const p=lerp(a,b,u/L),q=lerp(a,b,v/L);S.line([p[0],p[1],z],[q[0],q[1],z],P.iron,1);}
  }
  function bush(S,i,j,rad,h,flower) {
    S.box(i-rad*.65,i+rad*.65,j-rad*.65,j+rad*.65,0,.9,C('826d52'),C('695b49'),C('89734d'));
    const rings=6;
    for(let k=0;k<rings;k++){
      const a=k*Math.PI*2/rings,b=(k+1)*Math.PI*2/rings;
      const A=[i+Math.cos(a)*rad,j+Math.sin(a)*rad,1.1],B=[i+Math.cos(b)*rad,j+Math.sin(b)*rad,1.1];
      S.poly([A,B,[i,j,h]],(ii,jj,zz)=>{const t=hash(Math.floor(ii*2),Math.floor(jj*2)+Math.floor(zz),72);return flower&&zz>h*.53&&t%11===0?P.flower[t%3]:P.leaf[(k<3?1:0)+(t%2)];});
    }
  }
  function bench(S,i,j,length) {
    for(const u of [.4,length-.4]){S.box(i+u-.2,i+u+.2,j,j+1.3,0,2.5,P.iron,P.iron,null);S.line([i+u,j,2],[i+u,j,5],P.iron,1);}
    S.box(i,i+length,j,j+1.3,2.3,2.8,C('9e8458'),C('756749'),C('b09867'));
    for(const z of [3.5,4.6])S.wall([i,j],[i+length,j],z,z+.55,C('a88d60'));
  }
  function ground(S,style) {
    const n=S.spec.sz*16;
    S.flat(.6,n-.6,.6,n-.6,0,(i,j)=>{
      const cell=hash(Math.floor(i/2.5),Math.floor(j/2.5),98);
      if(style==='garden'&&j>26&&i<29){
        if((i>12&&i<15)||(i>25&&i<28)||j>30)return P.path[cell%4];
        return P.grass[cell%3];
      }
      if(style==='civic'&&j>34&&i<17&&!(i>12&&i<15))return P.grass[cell%3];
      if(mod(i,3.2)<.13||mod(j,3.2)<.13)return C('96988b');
      return P.path[cell%4];
    },0,1);
    // In-footprint paving edges; no oversized elliptical halo.
    S.line([.6,n-.6,0],[n-.6,n-.6,0],C('8c9183'),1);
    S.line([n-.6,.6,0],[n-.6,n-.6,0],C('7d837b'),1);
  }
  function downpipe(S,i,j,top,bottom) {S.line([i,j,top],[i,j,bottom||1],P.iron,1);for(const z of [8,23,36])if(z<top)S.line([i-.25,j,z],[i+.35,j,z],P.ironHi,1);}

  // Tiny lettering is geometry on the sign plane, never screen-facing text.
  const FONT={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],E:['111','100','110','100','111'],F:['111','100','110','100','100'],H:['101','101','111','101','101'],I:['111','010','010','010','111'],L:['100','100','100','100','111'],N:['101','111','111','111','101'],O:['010','101','101','101','010'],R:['110','101','110','101','101'],S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],X:['101','101','010','101','101'],Y:['101','101','010','010','010'],'&':['010','101','010','101','011'],' ':['000','000','000','000','000']};
  function letters(F,text,u,z,unit,col) {for(let k=0;k<text.length;k++){const A=FONT[text[k]]||FONT[' '];for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(A[y][x]==='1')F.panel(u+(k*4+x)*unit,u+(k*4+x+1)*unit,z+(4-y)*unit*1.8,z+(5-y)*unit*1.8,col,.38);}}

  function terrace(spec) {
    const S=Scene(spec);ground(S,'garden');
    // The back service wing belongs to the end house, below the shared main roof.
    S.box(22.5,29.5,2,10,0,20,(i,j,z)=>brick(false,11)(i,z),(i,j,z)=>brick(true,11)(j,z),P.roofR[0]);
    gableRoof(S,22.2,29.8,1.7,10.3,20,5,12);
    const front=wallBrick(S,[3,23],[29,23],0,39,false,1),side=wallBrick(S,[29,6],[29,23],0,39,true,2);
    S.flat(3,29,6,23,39,P.brick[0]);
    front.panel(0,26,19.8,21.1,P.stoneR,.08);side.panel(0,17,19.8,21.1,P.stoneD,.08);
    // Two distinct addresses, two generous canted bays, one continuous party roof.
    for(let h=0;h<2;h++){
      const u=h*13,bi=4.4+u,bj=23,bw=6.8;
      const outline=[[bi,bj],[bi+bw,bj],[bi+bw-.8,bj+2.7],[bi+.8,bj+2.7]];
      const bayFaces=[S.face(outline[0],outline[3]),S.face(outline[3],outline[2]),S.face(outline[2],outline[1])];
      bayFaces.forEach((F,k)=>{
        F.panel(0,F.length,1.4,18,(x,z)=>z<4.3?(k===2?P.brickR[0]:P.brick[1]):(k===2?P.stoneR:P.stone),0);
        windowOn(S,F,.40,6.4,F.length-.8,10.1,{right:k===2,panes:k===1?2:1,lit:h===0||k===2,curtain:k===1});
      });
      S.poly(outline.map(p=>[p[0],p[1],18.5]),P.stoneHi);
      const R=[bi+bw/2,bj+1,21.1];
      for(let k=0;k<4;k++)S.poly([[...outline[k],18.8],[...outline[(k+1)%4],18.8],R],tileRoof(k===2,20+h,'i'));
      windowOn(S,front,u+1.7,25.7,4.4,9.6,{curtain:h===1,lit:h===0,panes:2});
      windowOn(S,front,u+8.2,25.7,3.2,9.6,{lit:h===1,panes:2});
      doorway(S,front,u+9,1.7,3.2,15.8,{col:h===0?P.green:C('5c4c46')});
      step(S,12+u,15.4+u,23.1,27.6,3);
      // Pale lintel with a reddish soldier arch above the bay and entry.
      front.panel(u+8.5,u+12.6,18,19.1,P.brick[1],.1);
      railing(S,[3+u,30.8],[15.4+u,30.8],4.7,[8.8,11.8]);
      railing(S,[3+u,26.4],[3+u,30.8],4.7);
      bush(S,7.1+u,28.5,1.5,4,h===0);
      // Door lamp and boot scraper are at the entry, not freestanding light blobs.
      lamp(S,15.2+u,23.4,3.3,13.5);
      S.line([14.7+u,26.7,0],[14.7+u,26.7,1.5],P.iron,1);
    }
    // Functional but restrained end elevation: rear sash, blind panel, downpipe.
    windowOn(S,side,2.1,24.8,3.2,9.3,{right:true,lit:false,panes:2});
    windowOn(S,side,3.2,7.5,3.2,9.8,{right:true,lit:true,panes:2});
    side.panel(9.7,13.3,24.8,34.1,(x,z)=>x<.35||x>3.25||z<.5||z>8.8?P.brickR[1]:P.brickR[2],.05);
    side.panel(9.4,13.6,24.2,25,P.stoneD,.08);
    cornice(S,3,29,6,23,38.3);
    gableRoof(S,2.6,29.4,5.6,23.4,40,12.8,42);
    chimney(S,3.8,13.2,51,3.3,2.1,2,51);
    chimney(S,15.2,13.2,51,3.4,2.1,2,52);
    chimney(S,27,13.2,51,2.3,2.1,2,53);
    downpipe(S,29.38,22.6,39.6);downpipe(S,16,23.4,39.6);
    S.line([29.4,8,40],[29.4,8,22],P.iron,1);
    return S.finish();
  }

  function pub(spec) {
    const S=Scene(spec);ground(S,'paved');
    const outline=[[3,3],[28,3],[28,23],[24,27],[3,27]];
    const front=wallBrick(S,[3,27],[24,27],0,43,false,71),side=wallBrick(S,[28,3],[28,23],0,43,true,72),corner=wallBrick(S,[28,23],[24,27],0,43,false,73);
    S.poly(outline.map(p=>[...p,43]),P.brick[0]);
    for(const [F,right]of [[front,false],[side,true],[corner,false]]){
      F.panel(0,F.length,0,19,(x,z)=>{
        if(z<1.5)return P.iron;
        if(z<4.4)return mod(z,1.45)<.13||mod(x+(Math.floor(z/1.45)&1)*.75,1.5)<.08?(right?P.greenD:P.green):(right?P.tileR:P.tileHi);
        return right?P.greenD:P.green;
      },.03);
      F.panel(0,F.length,18.8,22.5,right?P.greenD:P.green,.12);
      F.panel(0,F.length,18.8,19.3,P.gold,.2);F.panel(0,F.length,22.2,22.8,right?P.stoneR:P.stone,.2);
      F.panel(0,F.length,23,24.1,right?P.stoneD:P.stoneR,.13);
      for(let u=0;u<F.length-.5;u+=6.9){
        F.panel(u,u+.7,1.8,19,right?P.green:P.greenHi,.22);
        F.panel(u-.1,u+.85,16.7,18.5,right?P.greenHi:P.gold,.26);
      }
    }
    for(const u of [1,7.7,14.4])windowOn(S,front,u,5,5.3,12.9,{lit:true,panes:3,transom:9,stained:true,leaded:true,border:.35});
    for(const u of [1.2,7.8,14.1])windowOn(S,side,u,5,4.9,12.9,{right:true,lit:true,panes:3,transom:9,stained:true,leaded:true,border:.35});
    // The chamfer is a real third plane: entrance opens toward the street corner.
    doorway(S,corner,.7,1.2,corner.length-1.4,16.6,{double:true,col:P.greenD});
    S.poly([[28.1,23,1.1],[29.4,24.4,1.1],[25.5,28.4,1.1],[24,27,1.1]],P.stoneHi);
    for(const u of [2.1,9.4,16.2])windowOn(S,front,u,28.2,3.8,10.2,{lit:u>8&&u<11,panes:2,curtain:true});
    for(const u of [2.3,9.4,16.0])windowOn(S,side,u,28.2,3.3,10.2,{right:true,lit:u>8&&u<11,panes:2});
    windowOn(S,corner,1.0,28,3.6,10.5,{lit:true,panes:2,arch:true});
    letters(front,'FOX & FINCH',1.4,19.65,.38,P.goldHi);
    letters(side,'FINE ALES',2.3,19.65,.38,P.gold);
    for(const F of [front,side,corner])F.panel(0,F.length,41.6,43.1,P.stoneR,.1);
    const roofOutline=[[2.6,2.6],[28.4,2.6],[28.4,23.2],[24.2,27.4],[2.6,27.4]];
    hipRoof(S,roofOutline,[9,15],[22,15],43.8,13,80);
    chimney(S,6,11.4,51.5,3.1,2.3,2,81);chimney(S,21.9,8.7,49.6,3.2,2.3,2,82);
    downpipe(S,27.9,22.8,43.8);downpipe(S,3.3,27.45,43.7);
    // Projecting painted inn sign, hung from a visible bracket.
    S.line([20.6,27.1,30],[20.6,30.5,30],P.iron,1);
    S.line([20.6,27.1,27.6],[20.6,29.3,30],P.iron,1);
    const sign=S.face([20.6,28.6],[20.6,31]);
    sign.panel(0,2.4,22.8,29.5,P.gold,.15);sign.panel(.3,2.1,23.3,29,P.greenD,.2);
    // Fox silhouette: angular red body, cream chest, lifted tail.
    sign.panel(.6,1.55,25.1,26.7,C('cb8750'),.3);sign.panel(1.3,1.9,26.3,27.3,C('cc8a51'),.3);
    sign.panel(.35,.75,26,27,C('e1c995'),.3);sign.panel(1.5,1.8,25.2,26.2,C('e0c99a'),.31);
    // Barrel, small pavement table, a backed bench, and two attached flower baskets.
    S.box(5.7,7.6,28.3,30.2,0,4.1,C('9d7951'),C('765c43'),C('ad8b59'));
    for(const z of [1,3.2])S.box(5.65,7.65,28.25,30.25,z,z+.45,P.iron,P.iron,P.iron);
    S.box(10.6,14.6,28.5,30.4,3.4,3.9,C('8b7352'),C('685d48'),C('af976a'));
    for(const i of [11.1,14.1])S.line([i,29.1,0],[i,29.1,3.4],P.iron,1);
    bench(S,3.8,29.7,3.6);
    bush(S,8.7,27.9,.85,3.2,true);bush(S,26.3,26.9,.7,2.8,true);
    lamp(S,24.55,27.05,3.1,17.4);
    lamp(S,28.4,22.3,3.1,17.4);
    return S.finish();
  }

  function library(spec) {
    const S=Scene(spec);ground(S,'civic');
    const front=wallBrick(S,[5,32],[43,32],0,43,false,110),side=wallBrick(S,[43,7],[43,32],0,43,true,111);
    S.flat(5,43,7,32,43,P.brick[0]);
    // Low plinth and terracotta bands tie the reading-room masses together.
    front.panel(0,38,0,4,P.stoneR,.05);side.panel(0,25,0,4,P.stoneD,.05);
    for(const z of [7,33.5]){front.panel(0,38,z,z+1.5,P.stone,.1);side.panel(0,25,z,z+1.5,P.stoneR,.1);}
    for(const u of [2.3,8.5,27.5,33.3])windowOn(S,front,u,11,4.5,19.5,{arch:true,panes:2,transom:12.8,leaded:true,lit:true,books:true});
    for(const u of [2.5,8.6,14.7,20.2])windowOn(S,side,u,11,3.8,19.5,{right:true,arch:true,panes:2,transom:12.8,leaded:true,lit:u<17,books:true});
    // Shallow terracotta piers, with alternating quoins at true masonry corners.
    for(const u of [.1,13.4,24.2,36.7]){
      front.panel(u,u+1.1,4,40,P.stoneR,.16);
      front.panel(u-.15,u+1.25,31.4,33.4,P.stone,.19);
    }
    for(let z=5;z<39;z+=4){front.panel(36.4,38,z,z+2.1,P.stone,.2);side.panel(23.4,25,z,z+2.1,P.stoneR,.2);}
    cornice(S,5,43,7,32,42);
    hipRoof(S,[[4.5,6.5],[43.5,6.5],[43.5,32.5],[4.5,32.5]],[13,19.5],[35,19.5],43.8,17,125);
    // Roof-top reading-room lantern: modest, horizontal, clearly glazed.
    S.box(15.5,30.5,16.9,22.1,57.1,62,P.stoneR,P.stoneD,P.roof[1]);
    const lanternF=S.face([15.5,22.15],[30.5,22.15]),lanternR=S.face([30.55,16.9],[30.55,22.1]);
    lanternF.panel(.4,14.6,58,61.6,(u,z)=>mod(u,2.1)<.25?P.frame:[P.glassHi,P.warm[0]],.2);
    lanternR.panel(.4,4.8,58,61.6,(u,z)=>mod(u,1.65)<.25?P.frameR:[P.glass,P.warm[2]],.2);
    hipRoof(S,[[15.1,16.5],[30.9,16.5],[30.9,22.5],[15.1,22.5]],[18,19.5],[28,19.5],62,3.5,126);
    chimney(S,7.5,17.2,56,3.6,2.5,3,130);
    chimney(S,39.2,13.5,51,3,2.5,2,131);
    // Projecting left reading bay: low enough for the main slate roof to remain legible.
    const bay=[[6.8,32],[17.5,32],[16.2,35.2],[8.1,35.2]],bayFaces=[S.face(bay[0],bay[3]),S.face(bay[3],bay[2]),S.face(bay[2],bay[1])];
    bayFaces.forEach((F,k)=>{F.panel(0,F.length,0,31,(u,z)=>z<5?P.stoneR:(k===2?P.stoneR:P.stone),0);windowOn(S,F,.6,8.6,F.length-1.2,18.1,{right:k===2,panes:k===1?4:1,transom:12,leaded:true,lit:true,books:true});});
    S.poly(bay.map(p=>[...p,31]),P.stoneHi);
    S.poly([[6.5,31.6,31.6],[17.8,31.6,31.6],[16.4,35.5,31.6],[7.8,35.5,31.6]],tileRoof(false,135,'i'));
    S.line([7.8,35.5,31.6],[16.4,35.5,31.6],P.lead,1);
    // Integrated entrance risalit, not a separate tower: gable and pitched roof join hall.
    const entry=wallBrick(S,[19,37],[29.5,37],2.5,47,false,140),entrySide=wallBrick(S,[29.5,29.5],[29.5,37],2.5,47,true,141);
    S.box(18.7,29.8,32,37.3,2.2,5.2,P.stone,P.stoneR,P.stoneHi);
    for(const u of [0,9.4])entry.panel(u,u+1.1,5,45,P.stone,.2);
    entry.panel(0,10.5,30.5,32.1,P.stone,.18);
    doorway(S,entry,2.7,5.2,5.1,20.5,{double:true,col:C('586151')});
    // Stone voussoirs and a recessed fanlight make the main entrance readable at z1.
    windowOn(S,entry,2.3,25,5.9,8.5,{arch:true,panes:3,transom:2,lit:true,border:.6});
    entry.panel(1.15,9.3,35.2,41.1,P.stone,.2);
    letters(entry,'LIBRARY',1.68,36.5,.27,C('65564a'));
    entry.panel(.3,10.2,44.5,46.3,P.stoneHi,.2);
    S.poly([[18.65,37.35,46.2],[29.85,37.35,46.2],[24.25,37.35,61]],(i,j,z)=>{
      const t=(z-46.2)/14.8,edge=Math.abs(i-24.25)-(5.6*(1-t));
      if(edge>-.7||z<47.3)return P.stone;
      return brick(false,144)(i,z);
    },.06);
    // Gable returns and cross roof run back into the main hall.
    S.poly([[18.65,37.35,46.2],[24.25,37.35,61],[24.25,28,61],[18.65,28,46.2]],tileRoof(false,145,'j'));
    S.poly([[29.85,37.35,46.2],[24.25,37.35,61],[24.25,28,61],[29.85,28,46.2]],tileRoof(true,146,'j'));
    S.line([18.65,37.4,46.2],[24.25,37.4,61],P.stoneHi,1);S.line([24.25,37.4,61],[29.85,37.4,46.2],P.stoneR,1);
    // Small stone roundel and copper finial, avoiding a clock-tower silhouette.
    entry.panel(3.75,6.75,49,55.3,(x,z)=>((x-1.5)/1.5)**2+((z-3.1)/3.1)**2<=1?P.stone:null,.25);
    entry.panel(4.3,6.2,50.3,53.8,(x,z)=>((x-.95)/.95)**2+((z-1.75)/1.75)**2<=1?P.brick[1]:null,.3);
    S.line([24.25,37.4,61],[24.25,37.4,64.1],P.copper,1);
    step(S,19.3,29.25,37,43.9,7);
    // Handrails follow the step flight, with no inaccessible ornamental front door.
    for(const i of [19.7,28.8]){S.line([i,38,8],[i,43.4,3.6],P.iron,1);for(const j of [38.3,41,43.2])S.line([i,j,Math.max(.5,(44-j)*.65)],[i,j,Math.max(.5,(44-j)*.65)+3],P.iron,1);}
    lamp(S,17.4,38.8,11);lamp(S,31.5,38.8,11);
    bench(S,34.2,40.4,7.5);bench(S,7.3,41.7,7);
    bush(S,8.7,37.8,2,4.4,true);bush(S,13.3,37.9,1.4,3.4,false);bush(S,43.1,36.7,1.4,3.3,false);
    // Low boundary walls leave the entrance axis open.
    S.box(3.4,17.8,45,45.9,0,2.4,P.brick[0],P.brickR[0],P.stone);
    S.box(31.2,45.1,45,45.9,0,2.4,P.brick[0],P.brickR[0],P.stone);
    railing(S,[3.5,45.5],[17.7,45.5],5.4);railing(S,[31.3,45.5],[45,45.5],5.4);
    for(const i of [17.6,31.3])S.box(i-.55,i+.55,44.9,46,0,6.2,P.brick[1],P.brickR[1],P.stoneHi);
    downpipe(S,43.4,31.7,43.5);downpipe(S,29.8,36.7,45.6);
    return S.finish();
  }

  const builders={UKP01:terrace,UKP02:pub,UKP03:library};
  function build(id) {if(root.__noBritishPrototypes003)return null;const s=specs.find(q=>q.id===id);if(!s)throw new Error('Unknown British prototype: '+id);return builders[id](s);}
  root.BritishPrototypes=Object.freeze({version:'UKP-art-r1',specs,build,buildAll:()=>root.__noBritishPrototypes003?[]:specs.map(s=>builders[s.id](s))});
})(window);
