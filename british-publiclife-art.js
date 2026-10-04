/* GPT-007 British public life, UKL01–12.
 * Canonical native art registered by installPublicLifeArt007 in the playable game.
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
  const specs=Object.freeze([{"nm": "歷史英式市政廳", "en": "Historic English town hall", "sz": 3, "w": 208, "h": 196, "ax": 104, "ay": 194, "id": "UKL01"}, {"nm": "紅磚治安法院", "en": "Brick Gothic magistrates court", "sz": 3, "w": 208, "h": 196, "ax": 104, "ay": 194, "id": "UKL02"}, {"nm": "英式自治市警署", "en": "English borough police station", "sz": 2, "w": 136, "h": 150, "ax": 68, "ay": 148, "id": "UKL03"}, {"nm": "愛德華消防局", "en": "Edwardian fire station", "sz": 3, "w": 208, "h": 210, "ax": 104, "ay": 208, "id": "UKL04"}, {"nm": "英式技術學院", "en": "English technical institute", "sz": 3, "w": 208, "h": 196, "ax": 104, "ay": 194, "id": "UKL05"}, {"nm": "英式文法學校", "en": "English grammar school", "sz": 3, "w": 208, "h": 196, "ax": 104, "ay": 194, "id": "UKL06"}, {"nm": "燧石教區教堂", "en": "Flint English parish church", "sz": 3, "w": 208, "h": 180, "ax": 104, "ay": 178, "id": "UKL07"}, {"nm": "英式非國教禮拜堂", "en": "English nonconformist chapel", "sz": 2, "w": 136, "h": 150, "ax": 68, "ay": 148, "id": "UKL08"}, {"nm": "英式板球俱樂部", "en": "English cricket pavilion", "sz": 3, "w": 208, "h": 164, "ax": 104, "ay": 162, "id": "UKL09"}, {"nm": "草地滾球會館", "en": "English bowls club pavilion", "sz": 2, "w": 136, "h": 124, "ax": 68, "ay": 122, "id": "UKL10"}, {"nm": "鑄鐵公園演奏亭", "en": "Cast-iron park bandstand", "sz": 2, "w": 136, "h": 130, "ax": 68, "ay": 128, "id": "UKL11"}, {"nm": "英式海濱音樂廳", "en": "English seaside concert pavilion", "sz": 3, "w": 208, "h": 172, "ax": 104, "ay": 170, "id": "UKL12"}].map(Object.freeze));

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
    // Slate reads as long, orderly courses, not independent high-contrast pixels.
    // Restrained tone changes occur per whole slate; most slates keep the base tone.
    const pal=right?[C('45525c'),C('48555e'),C('414e57')]:[C('596870'),C('5d6c73'),C('55646d')];
    const course=right?C('3c4a54'):C('4e5e68');
    return (i,j,z)=>{
      const across=axis==='j'?j:i,down=axis==='j'?i:j,row=Math.floor(down/1.12),seam=mod(down,1.12);
      const phase=(row&1)*.95,col=Math.floor((across+phase)/1.9),n=hash(col,row,seed);
      if(seam<.085)return course;
      if(mod(across+phase,1.9)<.075&&n%3===0)return pal[2];
      return n%19===0?pal[1]:n%23===0?pal[2]:pal[0];
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
  Object.assign(FONT,{"D":["110","101","101","101","110"],"G":["011","100","101","101","011"],"J":["111","001","001","101","010"],"K":["101","101","110","101","101"],"M":["101","111","111","101","101"],"P":["110","101","110","100","100"],"Q":["010","101","101","011","001"],"V":["101","101","101","101","010"],"W":["101","101","111","111","101"],"Z":["111","001","010","100","111"]});
  function letters(F,text,u,z,unit,col) {for(let k=0;k<text.length;k++){const A=FONT[text[k]]||FONT[' '];for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(A[y][x]==='1')F.panel(u+(k*4+x)*unit,u+(k*4+x+1)*unit,z+(4-y)*unit*1.8,z+(5-y)*unit*1.8,col,.38);}}



// GPT-007 / UKL01–06. Original civic and learning forms.
// Concatenated inside the PUBLICLIFE007 art closure. Only Scene primitives are
// shared with earlier rounds; plans, sections and facade compositions are new.
// All coordinates are plot-local (16 units/tile); the public street is +j.

function plCivicStone007(right,seed) {
  const pal=right?[C('9f957d'),C('a99d83'),C('a3977d')]:[C('cbb994'),C('d5c49f'),C('cfbe98')];
  return (u,z)=>{
    const row=Math.floor(z/2.3),v=u+(row&1)*1.65,n=hash(Math.floor(v/3.3),row,seed);
    if(z<2)return right?C('887e6d'):C('afa084');
    if(mod(z,2.3)<.14||mod(v,3.3)<.13)return right?C('928973'):C('b5a789');
    return pal[n%3];
  };
}

function plCivicBrick007(right,seed) {
  const pal=right?[C('824c40'),C('8b5144'),C('7d493e')]:[C('b36a50'),C('bb7055'),C('ad644c')];
  return (u,z)=>{
    const row=Math.floor(z/1.7),v=u+(row&1)*1.15,n=hash(Math.floor(v/2.3),row,seed);
    if(z<2.4)return right?P.stoneD:P.stoneR;
    if(mod(z,1.7)<.13||mod(v,2.3)<.10)return right?C('6f4a40'):C('96664f');
    return pal[n%3];
  };
}

function plCivicWall007(S,a,b,h,right,seed,stone) {
  const F=S.face(a,b);F.panel(0,F.length,0,h,stone?plCivicStone007(right,seed):plCivicBrick007(right,seed),0);return F;
}

function plCivicBlock007(S,i0,i1,j0,j1,h,seed,stone) {
  const F=plCivicWall007(S,[i0,j1],[i1,j1],h,false,seed,stone);
  const R=plCivicWall007(S,[i1,j0],[i1,j1],h,true,seed+1,stone);
  S.flat(i0,i1,j0,j1,h,stone?P.stoneR:P.brickR[0]);
  return {F,R};
}

function plCivicBand007(F,z,h,right,terracotta) {
  const a=terracotta?(right?C('a57253'):C('cf9c70')):(right?P.stoneR:P.stone);
  F.panel(0,F.length,z,z+h,a,.10);
  F.panel(0,F.length,z+h-.12,z+h+.27,terracotta?(right?C('966449'):C('ddae80')):(right?P.stoneD:P.stoneHi),.15);
}

function plCivicWindow007(S,F,u,z,w,h,opt) {
  opt=opt||{};const r=!!opt.right,stone=r?P.stoneR:P.stoneHi,frame=r?P.frameR:P.frame;
  const top=x=>opt.pointed?h-(opt.rise||4)*(Math.abs(x-w/2)/(w/2)):opt.round?h-w*.48+w*.48*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2)):h;
  F.panel(u-.42,u+w+.42,z-.5,z+h+.65,(x,y)=>y>top(Math.max(0,Math.min(w,x-.42)))+.58?null:stone,.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const t=top(x);if(y>t)return null;
    if(x<.33||x>w-.33||y<.5||y>t-.5)return frame;
    const cols=opt.cols||2,rows=opt.rows||2;
    for(let k=1;k<cols;k++)if(Math.abs(x-w*k/cols)<(opt.mullion||.18))return frame;
    for(let k=1;k<rows;k++)if(Math.abs(y-h*k/rows)<.20)return frame;
    if(opt.leaded&&mod(x*1.5+y*.52,2.6)<.10)return r?P.iron:P.ironHi;
    if(opt.bars&&mod(x,1.2)<.15)return P.iron;
    return [y>h*.68?(r?P.glass:P.glassHi):(r?P.glassR:P.glass),opt.lit?P.warm[opt.warm||0]:0];
  },.23);
  F.panel(u-.58,u+w+.58,z-.52,z+.18,r?P.stoneR:P.stone,.27);
  if(!opt.pointed&&!opt.round)F.panel(u-.45,u+w+.45,z+h+.1,z+h+1.0,r?P.stoneD:P.stone,.18);
}

function plCivicDoor007(S,F,u,z,w,h,opt) {
  opt=opt||{};const r=!!opt.right,arch=opt.arch!==false,top=x=>arch?h-w*.38+w*.38*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2)):h;
  F.panel(u-.65,u+w+.65,z,z+h+.9,(x,y)=>y>top(Math.max(0,Math.min(w,x-.65)))+.8?null:(r?P.stoneR:P.stone),.14);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const t=top(x);if(y>t)return null;
    if(x<.3||x>w-.3||y>t-.4)return r?P.wood:P.frameR;
    if(y>h-3.3){if(Math.abs(x-w/2)<.17||Math.abs(y-h+3.0)<.2)return P.frameR;return [r?P.glassR:P.glass,opt.lit?P.warm[1]:0];}
    if(y<.8||Math.abs(x-w/2)<.13)return P.iron;
    if(mod(x-.4,1.25)<.1)return r?C('34463e'):C('41594c');
    if((y>2.1&&y<5.7)||(y>7.3&&y<h-4.1))return r?P.greenD:P.greenHi;
    if(y>6.1&&y<6.8&&(Math.abs(x-w*.39)<.2||Math.abs(x-w*.61)<.2))return P.gold;
    return opt.color||P.green;
  },.27);
}

function plCivicFrontRoof007(S,i0,i1,j0,j1,z,rise,seed,stone) {
  const m=(i0+i1)/2,roof=right=>stone?plCivicStoneRoof007(right,seed,'j'):tileRoof(right,seed,'j');
  S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],roof(false));
  S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],roof(true));
  S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,h)=>(stone?plCivicStone007(false,seed):plCivicBrick007(false,seed))(i,h),.01);
  for(const a of [i0,i1])S.line([a,j1+.04,z],[m,j1+.04,z+rise],P.stone,1);
  ridge(S,[m,j0],[m,j1],z+rise,stone?C('c0b391'):P.lead);
  S.line([i1,j0,z],[i1,j1,z],P.iron,1);
  return S.face([i0,j1],[i1,j1]);
}

function plCivicStoneRoof007(right,seed,axis) {
  return (i,j,z)=>{
    const across=axis==='j'?j:i,down=axis==='j'?i:j;
    const row=Math.floor(down/1.3),n=hash(Math.floor((across+(row&1)*1.3)/2.6),row,seed);
    if(mod(down,1.3)<.13)return right?C('827a64'):C('a39679');
    return right?[C('948a71'),C('9b9077'),C('8e856e')][n%3]:[C('baac89'),C('c0b38f'),C('b5a885')][n%3];
  };
}

function plCivicLongHip007(S,i0,i1,j0,j1,z,rise,seed) {
  // Unlike hipRoof's transverse ridge, this hall ridge runs into the plot.
  // Keeping its face topology explicit prevents bow-tie roof polygons.
  const m=(i0+i1)/2,end=(i1-i0)*.32,R=[m,j0+end,z+rise],Q=[m,j1-end,z+rise];
  const A=[i0,j0,z],B=[i1,j0,z],D=[i1,j1,z],E=[i0,j1,z];
  S.poly([A,R,Q,E],tileRoof(false,seed,'j'));
  S.poly([B,D,Q,R],tileRoof(true,seed+1,'j'));
  S.poly([A,B,R],tileRoof(true,seed+2,'i'));
  S.poly([E,Q,D],tileRoof(false,seed+3,'i'));
  for(const [a,b]of [[A,B],[B,D],[D,E],[E,A]])S.line(a,b,P.roofEdge,1);
  ridge(S,R,Q,z+rise,P.lead);
}

function plCivicStoneRangeRoof007(S,i0,i1,j0,j1,z,rise,seed) {
  const m=(j0+j1)/2;
  S.poly([[i0,j0,z],[i1,j0,z],[i1,m,z+rise],[i0,m,z+rise]],plCivicStoneRoof007(true,seed));
  S.poly([[i0,m,z+rise],[i1,m,z+rise],[i1,j1,z],[i0,j1,z]],plCivicStoneRoof007(false,seed));
  S.poly([[i1,j0,z],[i1,j1,z],[i1,m,z+rise]],(i,j,h)=>plCivicStone007(true,seed)(j,h));
  S.line([i1,j0,z],[i1,m,z+rise],P.stoneR,1);S.line([i1,m,z+rise],[i1,j1,z],P.stoneR,1);
  ridge(S,[i0,m],[i1,m],z+rise,C('c6b994'));
  S.line([i0,j1,z],[i1,j1,z],C('8b806b'),1);
}

function plCivicQuoins007(F,h,right,terracotta) {
  for(let z=3;z<h-1;z+=3.3)for(const a of [0,F.length-.85])
    F.panel(a,a+.85,z,z+2.2,terracotta?(right?C('ad815e'):C('d3aa7c')):(right?P.stoneR:P.stone),.09);
}

function plCivicRoundel007(F,u,z,r,clock) {
  F.panel(u-r-.4,u+r+.4,z-r*1.6-.6,z+r*1.6+.6,(x,y)=>{
    const dx=(x-r-.4)/r,dy=(y-r*1.6-.6)/(r*1.6),d=dx*dx+dy*dy;
    if(d>1.14)return null;if(d>.79)return P.stoneHi;
    if(clock){if((Math.abs(dx)<.095&&dy>-.08&&dy<.62)||(Math.abs(dy)<.095&&dx>-.05&&dx<.56))return P.iron;
      if(d>.59&&(Math.abs(dx)<.13||Math.abs(dy)<.13))return P.iron;return C('d8cfb1');}
    return mod(y,1.6)<.3?P.iron:P.dark;
  },.27);
}

function plCivicPlaque007(F,u,z,w,text) {
  F.panel(u-.25,u+w+.25,z-.4,z+4.3,P.stone,.14);F.panel(u,u+w,z,z+3.7,P.greenD,.23);
  const unit=Math.min(.34,(w-.8)/(text.length*4)),start=u+(w-text.length*4*unit)/2;
  for(let k=0;k<text.length;k++){
    if(text[k]!=='P'){letters(F,text[k],start+k*4*unit,z+.5,unit,P.frame);continue;}
    // The shared alphabet has no P; supply this glyph locally, without changing
    // that alphabet or altering any legacy plaque.
    const glyph=['110','101','110','100','100'];
    for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(glyph[y][x]==='1')
      F.panel(start+(k*4+x)*unit,start+(k*4+x+1)*unit,z+.5+(4-y)*unit*1.8,z+.5+(5-y)*unit*1.8,P.frame,.38);
  }
}

function plCivicStairs007(S,i0,i1,j0,j1,h,n) {
  for(let k=0;k<n;k++)S.box(i0,i1,j0,j1-k*(j1-j0)/n,0,(k+1)*h/n,P.stoneR,P.stoneD,P.stone);
}

function plCivicOgee007(S,i,j,z,r,h) {
  // Eight ruled facets per level, with a swelling shoulder and pinched neck.
  const levels=[[0,1],[.24,.88],[.51,.48],[.73,.22],[.90,.20],[1,0]];
  for(let q=0;q<levels.length-1;q++)for(let k=0;k<8;k++){
    const a=Math.PI*k/4,b=Math.PI*(k+1)/4,[za,ra]=levels[q],[zb,rb]=levels[q+1];
    S.poly([[i+Math.cos(a)*r*ra,j+Math.sin(a)*r*ra,z+h*za],[i+Math.cos(b)*r*ra,j+Math.sin(b)*r*ra,z+h*za],[i+Math.cos(b)*r*rb,j+Math.sin(b)*r*rb,z+h*zb],[i+Math.cos(a)*r*rb,j+Math.sin(a)*r*rb,z+h*zb]],k<3?C('6d807d'):k<6?C('91a19a'):C('7d9289'));
  }
  S.line([i,j,z+h],[i,j,z+h+3.5],P.iron,1);
}

function plHistoricTownHall007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Long irregular two-storey stone hall, with a lower open-sided east pentice.
  const A=plCivicBlock007(S,3.0,34,5.5,27,37.5,1201,true);
  for(const [u,z,w,h]of [[2.4,4.2,5.3,11.4],[12.1,5.4,4.0,9.4],[22.5,4.3,5.5,12.4],[1.8,22,6.3,11],[11.6,23.1,4.8,10],[21.5,22,6.2,11]])
    plCivicWindow007(S,A.F,u,z,w,h,{cols:w>5?3:2,rows:2,leaded:true,lit:z>20&&u>20});
  for(const [u,z,w,h]of [[2.1,6.0,5.2,10.5],[11.8,4.8,5.8,12.0],[2.2,23.4,5.3,10.4],[12,22.1,5.6,11.5]])
    plCivicWindow007(S,A.R,u,z,w,h,{right:true,cols:3,rows:2,leaded:true,lit:z>20&&u<5});
  plCivicBand007(A.F,19.1,.55,false);plCivicBand007(A.R,19.1,.55,true);
  plCivicStoneRangeRoof007(S,2.6,34.4,5.1,27.4,38,14.0,1203);
  // Projecting council chamber is a real cross-gabled block, not a false gable.
  const B=plCivicBlock007(S,4.2,17.6,22.0,36.0,40,1204,true);
  plCivicWindow007(S,B.F,1.7,5.0,10.0,13.2,{cols:4,rows:2,lit:false,leaded:true});
  plCivicWindow007(S,B.F,2.0,23.4,9.4,12.5,{cols:3,rows:2,lit:true,leaded:true});
  for(const z of [5,24])plCivicWindow007(S,B.R,6.8,z,4.8,11.5,{right:true,cols:2,rows:2,lit:z>20});
  const G=plCivicFrontRoof007(S,3.8,18,21.6,36.4,40.6,14.8,1205,true);
  plCivicRoundel007(G,7.1,46.7,1.8,false);
  for(const i of [4.2,16.4]){S.box(i,i+1.15,36.0,37.2,0,22,P.stone,P.stoneR,P.stoneHi);S.poly([[i,36,25],[i+1.15,36,25],[i+1.15,37.3,21],[i,37.3,21]],P.stone);}
  // Small entrance lobby in the angle, accessible from the +j pavement.
  const E=plCivicBlock007(S,19,29.2,26.7,32.5,23,1206,true);
  plCivicDoor007(S,E.F,2.5,2.0,5.2,16.5,{lit:true});
  plCivicStoneRangeRoof007(S,18.7,29.5,26.4,32.8,23.6,5,1207);
  plCivicStairs007(S,20.9,27.4,32.5,37.0,2.1,3);
  plCivicPlaque007(A.F,19.5,34,9.3,'HALL');
  // The shelter floor and three posts are visible below the independent pentice.
  S.box(34,44.8,13,29.5,0,.8,P.stoneR,P.stoneD,P.path[2]);
  // R1 pixels: the sunlit paving read as solid infill between the pale posts.
  // Shade only the existing shelter floor; retain the lit edge, open geometry,
  // masonry palette and window-only emission. No screen-space shadow overlay.
  S.flat(34.1,44.25,13.0,29.25,.82,(i,j)=>{
    if(mod(i-34.1,3.2)<.12||mod(j-13,3.2)<.12)return C('817f6f');
    return [C('8f8c79'),C('96927e'),C('898774')][hash(Math.floor(i/3.2),Math.floor(j/3.2),1210)%3];
  },.02,1);
  for(const j of [14,21.3,28.9]){S.box(43.4,44.1,j-.35,j+.35,.8,16.4,P.stone,P.stoneR,P.stoneHi);S.line([43.7,j,14],[40.8,j,17.4],P.wood,1);}
  S.poly([[33.7,12.6,22],[33.7,29.7,22],[44.6,29.7,16.8],[44.6,12.6,16.8]],plCivicStoneRoof007(true,1208));
  S.line([44.6,12.6,16.8],[44.6,29.7,16.8],P.iron,1);bench(S,35.4,27.5,6.5);
  // Compact belfry stands on the main ridge; all louvers are opaque recesses.
  const T=plCivicBlock007(S,24.8,30.6,12.9,18.7,65,1209,true);
  for(const F of [T.F,T.R])F.panel(.9,4.9,55.1,63.4,(x,y)=>x<.25||x>3.75?P.stoneR:mod(y,1.35)<.42?P.ironHi:P.dark,.21);
  S.box(24.4,31,12.5,19.1,64.7,66.1,P.stone,P.stoneR,P.stoneHi);
  plCivicOgee007(S,27.7,15.8,66.1,4.4,13.2);
  downpipe(S,34.25,26.8,37);downpipe(S,18,35.9,40);
  bench(S,32.7,39.7,7.2);bush(S,5.1,43.0,1.8,3.8,false);bush(S,42.1,40.8,1.7,3.4,false);
  return S.finish();
}

function plMagistratesCourt007(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Tall cross-gabled courtroom and deliberately unequal low waiting wing.
  const A=plCivicBlock007(S,4.7,22.3,6.4,33.5,47.0,1221,false);
  plCivicBand007(A.F,17.3,1.0,false);plCivicBand007(A.R,17.3,1.0,true);
  for(const u of [2.0,7.0,12])plCivicWindow007(S,A.F,u,21.7,3.8,20.5,{pointed:true,rise:4,cols:1,rows:3,lit:u===7,leaded:true});
  for(const u of [3.1,11.8,20.1])plCivicWindow007(S,A.R,u,19.8,4.5,21.3,{right:true,pointed:true,cols:2,rows:3,lit:u<4,leaded:true});
  for(const u of [2.2,11.7])plCivicWindow007(S,A.F,u,5.0,3.5,8.4,{cols:2,rows:2,lit:false,bars:true});
  const G=plCivicFrontRoof007(S,4.3,22.7,6.0,33.9,47.8,21.5,1223,false);
  plCivicRoundel007(G,9.2,55.6,2.1,false);
  for(const i of [4.7,21.1]){S.box(i,i+1.2,33.5,35.1,0,39,P.stone,P.stoneR,P.stoneHi);S.poly([[i,33.5,42],[i+1.2,33.5,42],[i+1.2,35.2,38.6],[i,35.2,38.6]],P.stone);}
  const B=plCivicBlock007(S,22.3,43.8,11.1,29.7,27.5,1224,false);
  for(const u of [1.6,8.0,14.5])plCivicWindow007(S,B.F,u,6,4.8,15.2,{pointed:true,rise:3.2,cols:2,rows:2,lit:u<3});
  for(const u of [2.5,10.6])plCivicWindow007(S,B.R,u,6,4.8,15.2,{right:true,pointed:true,cols:2,rows:2,lit:false});
  plCivicBand007(B.F,23.7,.9,false);plCivicBand007(B.R,23.7,.9,true);
  gableRoof(S,22,44.1,10.8,30,28.3,11.0,1226);
  // Raised public door and shallow gabled porch remain in the visible forecourt.
  const E=plCivicBlock007(S,27,37.2,27.5,35.2,25.2,1227,false);
  plCivicDoor007(S,E.F,2.3,4.2,5.6,15.2,{lit:true});
  plCivicFrontRoof007(S,26.6,37.6,27.2,35.6,25.8,9.7,1228,false);
  plCivicPlaque007(E.F,1.4,21,7.3,'COURT');
  plCivicStairs007(S,28.6,35.6,35.2,42.2,4.2,6);
  for(const i of [28.4,35.8]){S.line([i,35.5,8],[i,42,3.8],P.iron,1);for(let j=36;j<42;j+=1.5)S.line([i,j,4.2*(42.2-j)/7],[i,j,3.8+4.2*(42.2-j)/7],P.iron,1);}
  // Genuine low cell annex on the right, leaving its paved side court exposed.
  const Cb=plCivicBlock007(S,35.0,43.8,2.6,11.1,17.2,1229,false);
  for(const u of [1.2,5.2])plCivicWindow007(S,Cb.R,u,8,2,5.4,{right:true,cols:1,rows:1,bars:true,lit:false});
  gableRoof(S,34.7,44.1,2.3,11.4,17.8,5.5,1230);
  chimney(S,7.0,10,59,2.8,2.5,2,1231);chimney(S,39.5,16,35,2.4,2.3,2,1232);
  downpipe(S,22.55,33.2,47);downpipe(S,44,29.3,27);
  railing(S,[1.3,45.7],[26.7,45.7],5);railing(S,[38.1,45.7],[46.7,45.7],5);
  bench(S,7.7,40.6,8);bush(S,43.4,41.4,1.35,3.7,false);
  return S.finish();
}

function plBoroughPolice007(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Two forward gables flank a short recessed public range. The charge yard is
  // on the camera-visible +i side, not hidden behind a tall front curtain wall.
  const M=plCivicBlock007(S,2.3,20.1,4.1,20.5,31.5,1241,false);
  gableRoof(S,2.0,20.4,3.8,20.8,32.1,8.7,1242);
  for(const [i0,i1,h,sd]of [[2.3,9.1,35.7,1243],[13.2,20.1,35.7,1247]]){
    const A=plCivicBlock007(S,i0,i1,6.6,23.4,h,sd,false);
    plCivicBand007(A.F,19.4,.9,false,true);plCivicBand007(A.R,19.4,.9,true,true);
    plCivicQuoins007(A.F,h,false,true);
    if(i0<3)plCivicWindow007(S,A.F,1.05,5,4.7,11.7,{round:true,cols:2,rows:2,lit:true});
    else plCivicDoor007(S,A.F,1.12,1.4,4.6,15.8,{lit:true});
    plCivicWindow007(S,A.F,1.2,23,4.3,9.5,{cols:3,rows:3,lit:i0>10});
    const G=plCivicFrontRoof007(S,i0-.25,i1+.25,6.3,23.75,36.2,11.2,sd+2,false);
    plCivicRoundel007(G,(i1-i0)/2+.25,40.6,1.4,false);
    if(i0>10)for(const u of [2.4,9.5])plCivicWindow007(S,A.R,u,23,3.4,9.2,{right:true,cols:2,rows:3,lit:false});
  }
  plCivicWindow007(S,M.F,7.45,5.5,3.0,10.5,{cols:2,rows:2,lit:false});
  plCivicWindow007(S,M.F,7.4,22,3.1,8,{cols:2,rows:2,lit:false});
  plCivicPlaque007(S.face([13.2,23.43],[20.1,23.43]),.3,18,6.3,'POLICE');
  plCivicStairs007(S,14.0,19.1,23.4,26.3,1.4,2);
  // A low rear charge-room wing encloses an exposed stone-paved service yard.
  const Cb=plCivicBlock007(S,20.1,29.6,3.5,11.4,13.6,1251,false);
  for(const u of [1.3,5.5])plCivicWindow007(S,Cb.F,u,6.3,2.4,5.0,{cols:1,rows:1,bars:true,lit:false});
  plCivicWindow007(S,Cb.R,2.2,6.3,3.1,4.8,{right:true,cols:2,rows:1,bars:true,lit:false});
  S.poly([[19.9,3.2,18.2],[29.9,3.2,18.2],[29.9,11.7,14.0],[19.9,11.7,14.0]],tileRoof(false,1252,'i'));
  S.flat(21,30.4,12.0,28.9,.12,(i,j)=>mod(i,3)<.12||mod(j,3)<.12?C('83877e'):C('a9aa9b'),.03,1);
  S.box(30.0,30.8,11.4,29.3,0,5.2,P.brick[1],P.brickR[0],P.stone);
  S.box(20.8,24.5,28.8,29.6,0,5.2,P.brick[1],P.brickR[0],P.stone);
  for(const i of [24.6,30.2])S.box(i-.35,i+.35,28.8,29.6,0,7.2,P.brick[1],P.brickR[0],P.stoneHi);
  for(let i=25.0;i<30;i+=.7)S.line([i,29.1,.5],[i,29.1,6.6],P.iron,1);
  S.line([24.8,29.1,6.0],[30,29.1,6.0],P.iron,1);
  // Two small yard fixtures on the ground, with no fake emissive security lights.
  S.box(27.4,29.0,13.0,14.6,0,2.8,P.ironHi,P.iron,P.lead);
  S.line([21.7,14.0,.2],[29.3,14.0,.2],C('7b827a'),1);
  chimney(S,4,8.5,43.4,2,2.3,2,1253);chimney(S,15.1,8,44,2,2.2,2,1254);
  downpipe(S,20.35,22.9,35.5);
  railing(S,[1.2,29.9],[12.7,29.9],4.7);bush(S,4.3,26.8,1.1,2.9,false);
  return S.finish();
}

function plEdwardianFireStation007(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Two deep appliance bays under crew rooms; the whole south strip is apron.
  const A=plCivicBlock007(S,3.8,34.8,7.4,31.0,43.0,1261,false);
  plCivicBand007(A.F,22.8,1.1,false);plCivicBand007(A.R,22.8,1.1,true);
  for(const u of [2.3,16.1]){
    const w=11.6,h=19.7,top=x=>h-3+3*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
    A.F.panel(u-.6,u+w+.6,.8,h+1.7,(x,y)=>y>top(Math.max(0,Math.min(w,x-.6)))+.65?null:P.stone,.13);
    A.F.panel(u,u+w,1.2,h+1.2,(x,y)=>{
      if(y>top(x))return null;
      if(x<.45||x>w-.45||y>top(x)-.4)return P.iron;
      if(y>11.7){if(mod(x,2.3)<.18||Math.abs(y-15.5)<.22)return C('835044');return [P.glass,u<10?P.warm[0]:0];}
      if(mod(x,2.3)<.15||Math.abs(y-4.9)<.23||Math.abs(y-9.0)<.23)return C('633c35');
      if(y<.7)return P.iron;return C('9b493b');
    },.26);
    S.flat(3.8+u,3.8+u+w,31.0,42.6,.04,(i,j)=>mod(j,2.4)<.13?C('999b90'):P.path[1],.05,1);
  }
  for(const u of [2.1,9.6,17.1,24.6])plCivicWindow007(S,A.F,u,28.4,4.7,10.2,{cols:3,rows:2,lit:u<5||u>22});
  for(const u of [3.0,10.4,17.7])plCivicWindow007(S,A.R,u,28.4,4.2,10.2,{right:true,cols:2,rows:2,lit:u>15});
  plCivicPlaque007(A.F,6.3,24.1,18.7,'FIRE STATION');
  hipRoof(S,[[3.4,7],[35.2,7],[35.2,31.4],[3.4,31.4]],[10.5,19.2],[28.5,19.2],43.7,15,1263);
  chimney(S,7,13,54.6,2.8,2.5,3,1264);chimney(S,29.7,13,54.6,2.8,2.5,3,1265);
  // Watch-room steps and its own front door are separate from the vehicle bays.
  const W=plCivicBlock007(S,34.8,44.8,21,34.7,23.8,1266,false);
  plCivicDoor007(S,W.F,2.5,1.3,4.7,15.0,{lit:true});
  plCivicWindow007(S,W.R,5,6.4,5,11.6,{right:true,cols:3,rows:2,lit:true});
  plCivicPlaque007(W.F,1.0,18.7,8.1,'FIRE');
  hipRoof(S,[[34.5,20.7],[45.1,20.7],[45.1,35],[34.5,35]],[38,27.7],[41.7,27.7],24.5,6.1,1267);
  plCivicStairs007(S,36.7,42.6,34.7,38.1,1.3,2);
  // Narrow functional side drill tower: stacked openings, landings and hose rails.
  const T=plCivicBlock007(S,35.9,44.6,4.0,15.8,83.5,1268,false);
  for(const z of [8.8,27.2,45.6,64.0]){
    plCivicWindow007(S,T.F,2.1,z,4.5,12,{cols:1,rows:1,lit:false});
    T.F.panel(2.5,6.2,z+.8,z+11.0,(x,y)=>mod(y,2.6)<.5?C('5d665f'):P.dark,.28);
    plCivicWindow007(S,T.R,3.5,z,4.5,12,{right:true,cols:1,rows:1,lit:false});
    S.box(36.1,44.4,15.8,17.5,z-1.6,z-.7,P.stoneR,P.stoneD,P.stone);
    for(const i of [36.3,40.2,44.1])S.line([i,17.3,z-.7],[i,17.3,z+3.2],P.iron,1);
    S.line([36.3,17.3,z+2.8],[44.1,17.3,z+2.8],P.iron,1);
  }
  for(const F of [T.F,T.R])plCivicBand007(F,80.6,1.0,F===T.R);
  S.box(35.5,45,3.6,16.2,83.3,85,P.stone,P.stoneR,P.stoneHi);
  S.flat(36.2,44.3,4.3,15.5,85.1,C('65716f'));
  for(const i of [36.0,44.5])S.wall([i,4],[i,15.8],85,88,P.iron,.02);
  S.wall([35.9,15.8],[44.6,15.8],85,88,(i,j,z)=>mod(i,1.4)<.13||z>87.6?P.iron:null,.02);
  downpipe(S,35.1,30.5,43);downpipe(S,45.0,34.5,24);
  // Apron drain, threshold edging and paired bollards leave both exits clear.
  S.line([3,43.7,.15],[34.5,43.7,.15],C('7c817c'),1);
  for(let i=3;i<34;i+=1.4)S.line([i,43.4,.18],[i,44.0,.18],P.iron,1);
  for(const i of [2.7,35.2])S.box(i-.35,i+.35,40.7,41.4,0,4.1,P.ironHi,P.iron,P.stone);
  return S.finish();
}

function plTechnicalInstitute007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Broad practical-teaching frontage, tall corner stair, and a lower workshop
  // return around a visible paved right-hand entrance court.
  const A=plCivicBlock007(S,3.5,35.6,5.8,26.4,43,1281,false);
  for(const F of [A.F,A.R]){plCivicBand007(F,22.1,1.0,F===A.R,true);plCivicBand007(F,39.8,1.0,F===A.R,true);}
  for(const z of [5.4,27.0])for(const u of [2.0,11.6,21.3])plCivicWindow007(S,A.F,u,z,7.3,z>20?10.4:13.2,{cols:4,rows:3,lit:z>20&&u<15});
  for(const z of [5.4,27.0])for(const u of [2.2,11.6])plCivicWindow007(S,A.R,u,z,6.2,z>20?10.4:13.2,{right:true,cols:3,rows:3,lit:z<10&&u<5});
  hipRoof(S,[[3.1,5.4],[36,5.4],[36,26.8],[3.1,26.8]],[9.8,16.1],[29.3,16.1],43.8,11.8,1283);
  // Raised nine-light stair window dominates this corner tower rather than a
  // domestic stack of little windows; its cap is a separate shallow hip roof.
  const T=plCivicBlock007(S,29.2,41.1,20.5,32.5,58,1284,false);
  plCivicQuoins007(T.F,58,false,true);plCivicQuoins007(T.R,58,true,true);
  plCivicWindow007(S,T.F,2.0,24,7.9,22.6,{round:true,cols:3,rows:3,mullion:.24,lit:true});
  plCivicWindow007(S,T.R,2.2,27,7.2,19.4,{right:true,cols:3,rows:3,lit:false});
  plCivicDoor007(S,T.F,2.9,2.2,6.2,17.1,{lit:true});
  plCivicBand007(T.F,50.0,1.1,false,true);plCivicBand007(T.R,50.0,1.1,true,true);
  plCivicPlaque007(T.F,1.1,52.4,9.8,'INSTITUTE');
  hipRoof(S,[[28.8,20.1],[41.5,20.1],[41.5,32.9],[28.8,32.9]],[33,26.5],[37.3,26.5],58.7,8.1,1286);
  S.line([35.2,26.5,66.8],[35.2,26.5,70.3],P.iron,1);
  plCivicStairs007(S,31.3,38.9,32.5,37.2,2.2,3);
  // Low shop wing with wider glazing and a monitor clerestory on real surfaces.
  const W=plCivicBlock007(S,5.0,24.3,25.8,39.1,23.5,1287,false);
  for(const u of [1.7,10.3])plCivicWindow007(S,W.F,u,4.3,7.1,14.9,{cols:4,rows:3,lit:u>5});
  plCivicWindow007(S,W.R,3.4,4.3,7.2,14.9,{right:true,cols:4,rows:3,lit:false});
  S.poly([[4.6,25.4,27.2],[24.7,25.4,27.2],[24.7,39.5,24.1],[4.6,39.5,24.1]],tileRoof(false,1288,'i'));
  S.box(8.0,21.0,28.2,34.0,26.2,31.0,P.frame,P.frameR,P.roof[0]);
  const MF=S.face([8,34],[21,34]),MR=S.face([21,28.2],[21,34]);
  for(const u of [1,4.1,7.2,10.3])plCivicWindow007(S,MF,u,27.4,2.1,2.5,{cols:1,rows:1,lit:false});
  plCivicWindow007(S,MR,1,27.4,3.8,2.5,{right:true,cols:2,rows:1,lit:false});
  gableRoof(S,7.7,21.3,27.9,34.3,31.5,2.8,1289);
  // Technical-school identity: stone relief panel and glazed-brick dado.
  A.F.panel(10.4,21.0,18.8,21.5,C('5d705d'),.12);
  for(const u of [10.9,13.2,15.5,17.8,20.1])A.F.panel(u,u+.45,19.1,21.1,P.stone,.20);
  chimney(S,5.6,10,49.7,2.6,2.6,2,1290);chimney(S,27,8.5,50,2.6,2.5,2,1291);
  downpipe(S,24.5,38.8,24);downpipe(S,41.3,32.3,58);
  railing(S,[2,45.6],[25.4,45.6],4.8);railing(S,[42.1,45.6],[46.4,45.6],4.8);
  bench(S,38.7,40.8,6.2);bush(S,9.0,43.0,1.5,3.2,false);
  return S.finish();
}

function plGrammarSchool007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Tall axial hall behind two short projecting gabled entrance pavilions.
  // Low connecting classrooms spread across almost the full 3×3 footprint.
  const H=plCivicBlock007(S,15.1,33.0,5.2,31.0,44.5,1301,false);
  for(const u of [1.8,6.9,12.0])plCivicWindow007(S,H.F,u,19.2,3.8,20.1,{round:true,cols:2,rows:3,lit:u<5,leaded:true});
  for(const u of [3.1,11.9,20.0])plCivicWindow007(S,H.R,u,20,4.2,18.7,{right:true,cols:2,rows:3,lit:u>18});
  plCivicBand007(H.F,15.9,1.0,false);plCivicBand007(H.R,15.9,1.0,true);
  plCivicLongHip007(S,14.7,33.4,4.8,31.4,45.2,17.0,1303);
  for(const [i0,i1,seed]of [[2.1,15.1,1304],[33.0,46.0,1307]]){
    const W=plCivicBlock007(S,i0,i1,8.1,27.0,24.3,seed,false);
    for(const u of [1.7,7.4])plCivicWindow007(S,W.F,u,5.1,4.1,14.3,{cols:3,rows:3,lit:i0>20&&u>5});
    if(i0>20)for(const u of [2.2,10.6])plCivicWindow007(S,W.R,u,5.1,4.8,14.3,{right:true,cols:3,rows:3,lit:u<5});
    plCivicBand007(W.F,21.1,.9,false);plCivicBand007(W.R,21.1,.9,true);
    gableRoof(S,i0-.3,i1+.3,7.8,27.3,25,8.4,seed+2);
  }
  for(const [i0,i1,seed]of [[7.7,17.6,1311],[30.5,40.4,1315]]){
    const A=plCivicBlock007(S,i0,i1,21.8,35.4,35.6,seed,false);
    plCivicQuoins007(A.F,35,false,false);plCivicQuoins007(A.R,35,true,false);
    plCivicDoor007(S,A.F,2.25,2.0,5.4,15.2,{lit:i0<20});
    plCivicWindow007(S,A.F,2.15,22.1,5.6,9.7,{cols:3,rows:3,lit:i0>20});
    plCivicBand007(A.F,19.0,1.0,false);plCivicBand007(A.R,19.0,1.0,true);
    for(const u of [2.6,8.7])plCivicWindow007(S,A.R,u,22,3.0,9.6,{right:true,cols:2,rows:2,lit:false});
    const G=plCivicFrontRoof007(S,i0-.35,i1+.35,21.45,35.8,36.3,14.1,seed+2,false);
    plCivicRoundel007(G,5.3,41.9,1.55,false);
    // Coped stepped verges distinguish these from the court's acute straight verge.
    for(let k=0;k<4;k++)for(const sign of [-1,1]){
      const x=(i0+i1)/2+sign*(4.8-k*1.0),z=37.2+k*2.8;
      S.box(x-.52,x+.52,35.65,36.15,z,z+1.0,P.stone,P.stoneR,P.stoneHi);
    }
    plCivicStairs007(S,i0+1.4,i1-1.4,35.4,39.3,2.0,3);
    downpipe(S,i1+.25,35.1,35.6);
  }
  // Hall front stays visible between the projecting gables, including its
  // central crest, triple transomed glazing and lower assembly-room doors.
  plCivicDoor007(S,H.F,6.4,1.4,5.1,12.0,{lit:true,arch:false});
  H.F.panel(6.8,11.0,40.4,43.2,P.stone,.18);
  H.F.panel(7.9,9.9,40.8,42.8,(x,y)=>y<.7&&Math.abs(x-1)>.5?null:P.gold,.26);
  // Octagonal open-louver cupola with a compact slate spire on the hall ridge.
  const ci=23.9,cj=17.8,base=61.3,rad=3.3;
  const oct=[];for(let k=0;k<8;k++)oct.push([ci+Math.cos(k*Math.PI/4)*rad,cj+Math.sin(k*Math.PI/4)*rad]);
  for(let k=0;k<8;k++){
    const a=oct[k],b=oct[(k+1)%8],F=S.face(a,b),right=k<3;
    F.panel(0,F.length,base,base+9.3,right?P.stoneR:P.stone,0);
    F.panel(.35,F.length-.35,base+1.9,base+7.9,(x,y)=>mod(y,1.2)<.35?(right?P.iron:P.ironHi):P.dark,.18);
    S.poly([[a[0]*1.02-ci*.02,a[1]*1.02-cj*.02,base+9.6],[b[0]*1.02-ci*.02,b[1]*1.02-cj*.02,base+9.6],[ci,cj,base+20.0]],right?P.roofR[0]:P.roof[1]);
  }
  S.line([ci,cj,base+19.5],[ci,cj,base+23.8],P.iron,1);
  chimney(S,3.4,13.5,29.5,2.4,2.4,2,1321);chimney(S,42,13.2,29.5,2.4,2.4,2,1322);
  railing(S,[1.2,44.9],[8.1,44.9],5);railing(S,[17.8,44.9],[30.6,44.9],5);railing(S,[40.5,44.9],[46.8,44.9],5);
  for(const i of [8.3,17.6,30.8,40.3])S.box(i-.55,i+.55,44.2,45.3,0,6.5,P.brick[1],P.brickR[0],P.stoneHi);
  bench(S,19.7,38.1,8.1);bush(S,3.7,39.5,1.5,3.8,false);bush(S,44.5,39.5,1.5,3.8,false);
  return S.finish();
}

/* GPT-007 / UKL07–12: original parish and recreation buildings.
 * Concatenated inside publiclife-art-primitives007.js's IIFE.
 * The six forms use independent volumes and real open structural bays.
 * All materials go through Scene's paired day/emission depth buffer.
 * No bitmap imports, Canvas paths, anti-aliasing, shared RNG, or old-art edits.
 */

function plLeisureFlint007(right,seed) {
  const pal=(right?['6b706a','73786f','636b67','7b7e71']:['92968a','a0a292','888f85','a7a897']).map(C);
  return (u,z)=>{
    const row=Math.floor(z/1.65),x=u+(row&1)*.94,n=hash(Math.floor(x/1.9),row,seed);
    if(z<2.4)return right?C('767d69'):C('999f85');
    if(mod(z,1.65)<.14||mod(x,1.9)<.13)return right?C('92917d'):C('bab79c');
    if(mod(x,1.9)<.36&&mod(z,1.65)>1.0)return pal[2];
    return pal[(n>>>4)%4];
  };
}
function plLeisureBrick007(right,seed) {
  const pal=(right?['865448','8f5b4c','7d5046']:['b47157','bd7b5c','aa6954']).map(C);
  return (u,z)=>{
    const row=Math.floor(z/1.75),x=u+(row&1)*1.2,n=hash(Math.floor(x/2.4),row,seed);
    if(z<2.1)return right?C('736953'):C('93856a');
    if(mod(z,1.75)<.16||mod(x,2.4)<.12)return right?C('715447'):C('9a7259');
    return n%11===0?pal[1]:n%13===0?pal[2]:pal[0];
  };
}
function plLeisureBoard007(right,seed,cream) {
  const pal=(cream?(right?['a7ad96','adb19b','9ea68f']:['d5d6b7','deddbf','cdcfb0']):(right?['435c4d','4a6251','3d564a']:['627e61','6b8567','58745b'])).map(C);
  return (u,z)=>{
    const row=Math.floor(z/1.55),n=hash(Math.floor(u/5),row,seed);
    if(mod(z,1.55)<.18)return cream?(right?C('878f7c'):C('afb99a')):(right?C('344c41'):C('486550'));
    return n%17===0?pal[1]:n%19===0?pal[2]:pal[0];
  };
}
function plLeisureAshlar007(right) {
  return (u,z)=>{
    const row=Math.floor(z/3.2),x=u+(row&1)*2.6;
    if(mod(z,3.2)<.14||mod(x,5.2)<.10)return right?C('999381'):C('c2b89d');
    return right?C('b8ae93'):C('dcd0b0');
  };
}
function plLeisureWalls007(S,i0,i1,j0,j1,z0,z1,material,seed) {
  const F=S.face([i0,j1],[i1,j1]),R=S.face([i1,j0],[i1,j1]);
  F.panel(0,i1-i0,z0,z1,material(false,seed),0);
  R.panel(0,j1-j0,z0,z1,material(true,seed+1),0);
  return {F,R};
}
function plLeisureClay007(right,seed,axis) {
  const pal=(right?['79534a','80594d','714b43']:['a5785d','ae8062','9e7157']).map(C);
  return (i,j,z)=>{
    const along=axis==='j'?j:i,down=axis==='j'?i:j,row=Math.floor(down/1.1),x=along+(row&1)*.9;
    const n=hash(Math.floor(x/1.8),row,seed);
    if(mod(down,1.1)<.095)return right?C('684b43'):C('8e674f');
    return n%17===0?pal[1]:n%23===0?pal[2]:pal[0];
  };
}
function plLeisureRoof007(S,i0,i1,j0,j1,z,rise,seed,opt) {
  opt=opt||{};const axis=opt.axis||'i',m=axis==='j'?(i0+i1)/2:(j0+j1)/2;
  const tex=opt.clay?plLeisureClay007:tileRoof,edge=opt.stone?P.stoneR:P.roofEdge;
  const mat=opt.gable||plLeisureBrick007(axis==='i',seed+9);
  if(axis==='j'){
    S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],tex(false,seed,'j'));
    S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],tex(true,seed+1,'j'));
    S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,zz)=>mat(i-i0,zz),-.025);
    S.line([i0,j1,z],[m,j1,z+rise],edge,1);S.line([m,j1,z+rise],[i1,j1,z],edge,1);
    ridge(S,[m,j0],[m,j1],z+rise,opt.clay?C('c0916d'):P.lead);
    S.line([i1,j0,z],[i1,j1,z],P.roofEdge,1);
  }else{
    S.poly([[i0,j0,z],[i1,j0,z],[i1,m,z+rise],[i0,m,z+rise]],tex(true,seed,'i'));
    S.poly([[i0,m,z+rise],[i1,m,z+rise],[i1,j1,z],[i0,j1,z]],tex(false,seed+1,'i'));
    S.poly([[i1,j0,z],[i1,j1,z],[i1,m,z+rise]],(i,j,zz)=>mat(j-j0,zz),-.025);
    S.line([i1,j0,z],[i1,m,z+rise],edge,1);S.line([i1,m,z+rise],[i1,j1,z],edge,1);
    ridge(S,[i0,m],[i1,m],z+rise,opt.clay?C('c0916d'):P.lead);
    S.line([i0,j1,z],[i1,j1,z],P.roofEdge,1);
  }
}
function plLeisurePointWindow007(S,F,u,z,w,h,opt) {
  opt=opt||{};const right=!!opt.right,frame=right?C('b3ab92'):C('d4cbb0'),border=.52;
  const top=x=>h-Math.abs(x-w/2)*.94;
  F.panel(u-.35,u+w+.35,z-.65,z+.15,right?P.stoneR:P.stoneHi,.2);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const a=top(x);if(y>a)return null;
    if(x<border||x>w-border||y<.65||y>a-.65)return frame;
    if(Math.abs(x-w/2)<.23||Math.abs(y-h*.53)<.20)return right?P.stoneR:P.stone;
    if(opt.louvre)return mod(y,1.65)<.62?(right?C('677166'):C('879083')):C('293e3d');
    if(y>h*.53&&Math.abs(Math.abs(x-w/2)-(h-y)/2)<.25)return frame;
    if(mod(x*1.4+y*.38,2.5)<.15)return right?C('3d5355'):C('576c67');
    const col=y>h*.62?C('9c8a63'):(right?C('3b5961'):C('597a7b'));
    return [col,opt.lit===false?0:(y>h*.62?C('c9a46b'):C('ddbd82'))];
  },.2);
  const A=F.point(u),B=F.point(u+w/2),D=F.point(u+w);
  S.line([A[0],A[1],z+top(0)],[B[0],B[1],z+h],right?P.stoneR:P.stoneHi,1);
  S.line([B[0],B[1],z+h],[D[0],D[1],z+top(w)],right?P.stoneR:P.stoneHi,1);
}
function plLeisureRoundDoor007(S,F,u,z,w,h,opt) {
  opt=opt||{};const right=!!opt.right,arch=Math.min(w*.52,3.4),frame=right?P.stoneR:P.stone;
  const top=x=>h-arch+arch*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
  F.panel(u-.4,u+w+.4,z-.4,z+.45,right?P.stoneD:P.stoneHi,.19);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const a=top(x);if(y>a)return null;
    if(x<.48||x>w-.48||y>a-.65)return frame;
    if(y>h-arch-3.0){
      if(Math.abs(x-w/2)<.22||Math.abs(y-(h-arch-2.8))<.3)return P.frameR;
      return [right?P.glassR:P.glass,opt.lit===false?0:P.warm[0]];
    }
    if(Math.abs(x-w/2)<.2||y<.5||mod(x,1.25)<.12)return right?C('314b42'):C('425a4a');
    if(y>4.5&&y<5.2&&Math.abs(x-w/2)<.8)return P.gold;
    return right?C('415a4d'):C('58715b');
  },.23);
}
function plLeisureSteps007(S,i0,i1,back,front,z,n) {
  const run=(front-back)/n;
  for(let k=0;k<n;k++){
    const a=back+k*run,b=back+(k+1)*run,h=z*(n-k)/n;
    S.box(i0,i1,a,b,0,h,P.stoneR,P.stoneD,P.stone);
    S.line([i0,b,h],[i1,b,h],P.stoneHi,1);
  }
}
function plLeisurePost007(S,i,j,z0,z1,cream) {
  const L=cream?C('d8d6b8'):C('5b7462'),R=cream?C('a8ad96'):C('394f45');
  S.box(i-.65,i+.65,j-.65,j+.65,z0,z0+1.2,L,R,cream?P.stoneHi:C('718774'));
  S.box(i-.38,i+.38,j-.38,j+.38,z0+1.2,z1-1,L,R,L);
  S.box(i-.64,i+.64,j-.64,j+.64,z1-1,z1+.25,L,R,cream?P.stoneHi:C('718774'));
}
function plLeisureRails007(S,a,b,z,h,opt) {
  opt=opt||{};const L=Math.hypot(b[0]-a[0],b[1]-a[1]),col=opt.cream?C('c2c7ab'):C('456052');
  S.line([a[0],a[1],z+h],[b[0],b[1],z+h],col,1);
  S.line([a[0],a[1],z+.7],[b[0],b[1],z+.7],col,1);
  for(let u=0;u<=L;u+=1.45){const p=lerp(a,b,u/L);S.line([p[0],p[1],z+.5],[p[0],p[1],z+h],col,1);}
  if(opt.cross)for(let u=0;u<L-.2;u+=4){
    const p=lerp(a,b,u/L),q=lerp(a,b,Math.min(L,u+4)/L);
    S.line([p[0],p[1],z+.8],[q[0],q[1],z+h-.3],col,1);
    S.line([p[0],p[1],z+h-.3],[q[0],q[1],z+.8],col,1);
  }
}
function plLeisureGrass007(S,seed) {
  const n=S.spec.sz*16;
  S.flat(.6,n-.6,.6,n-.6,0,(i,j)=>{
    const v=hash(Math.floor(i/3),Math.floor(j/3),seed);
    return [C('87946d'),C('7f8e65'),C('8b976f')][v%3];
  },0,1);
}
function plLeisurePaving007(S,i0,i1,j0,j1,seed,z) {
  S.flat(i0,i1,j0,j1,z===undefined?.12:z,(i,j)=>{
    const row=Math.floor(j/2.25),x=i+(row&1)*1.75,n=hash(Math.floor(x/3.5),row,seed);
    if(mod(j,2.25)<.13||mod(x,3.5)<.12)return C('949487');
    return [C('b2ae9b'),C('beb8a5'),C('a9a895')][n%3];
  },.01,1);
}
function plLeisureButtress007(S,i,j,h,wide) {
  const w=wide||1.15;
  S.box(i-w,i+w,j-1.1,j+1.8,0,h*.46,P.stoneR,P.stoneD,P.stone);
  S.box(i-w*.76,i+w*.76,j-.75,j+1.2,h*.46,h*.8,P.stone,P.stoneR,P.stoneHi);
  S.box(i-w*.58,i+w*.58,j-.55,j+.8,h*.8,h,P.stone,P.stoneR,P.stoneHi);
  S.poly([[i-w*.76,j+1.2,h*.46],[i+w*.76,j+1.2,h*.46],[i+w*.76,j+.8,h*.46+1.2],[i-w*.76,j+.8,h*.46+1.2]],P.stoneHi);
}
function plLeisureSconce007(S,i,j,z) {
  // A real opaque iron-backed lantern, never emissive air or a screen-space halo.
  S.box(i-.55,i+.55,j-.45,j+.45,z-1.2,z+1.7,P.iron,P.iron,P.ironHi);
  S.box(i-.35,i+.35,j-.48,j+.48,z-.8,z+1.25,[C('ceb47f'),P.warm[0]],[C('ad905f'),P.warm[2]],P.iron);
  S.line([i-.6,j+.48,z+1.6],[i+.6,j+.48,z+1.6],P.iron,1);
}

function flintParishChurch007(spec) {
  const S=Scene(spec);plLeisureGrass007(S,768);
  // The lower chancel and separate south porch break the broad flint nave.
  plLeisurePaving007(S,22.2,30.2,37,47.4,769);
  plLeisurePaving007(S,30,47.4,40.5,44.3,770);
  plLeisurePaving007(S,2.5,45.6,29.7,34.2,771);
  const N=plLeisureWalls007(S,13.8,35.5,12.2,30.4,0,35,plLeisureFlint007,772);
  plLeisureRoof007(S,13.3,35.9,11.7,30.9,35.2,21.8,774,{clay:true,stone:true,gable:plLeisureFlint007(true,775)});
  for(const u of [2.7,9.7,16.2])plLeisurePointWindow007(S,N.F,u,12,4.2,17,{lit:u!==9.7});
  for(const i of [15.2,22.2,29.4,35.2])plLeisureButtress007(S,i,30.5,29.5,.65);
  const Cn=plLeisureWalls007(S,35.4,44.6,15.1,28.4,0,27,plLeisureFlint007,776);
  plLeisureRoof007(S,35.0,45.0,14.7,28.8,27.2,16.4,778,{clay:true,stone:true,gable:plLeisureFlint007(true,779)});
  plLeisurePointWindow007(S,Cn.F,2.7,8.2,4.3,14.7,{lit:true});
  plLeisurePointWindow007(S,Cn.R,3.4,7.2,6.4,20,{right:true,lit:false});
  plLeisureButtress007(S,44.0,28.3,23.5,.7);
  // A square three-stage tower. Its open, recessed top is bounded by parapets.
  const T=plLeisureWalls007(S,3.8,15.2,15.0,27.3,0,78.2,plLeisureFlint007,780);
  for(const z of [2.2,28.4,55.0,76.6]){
    S.box(3.45,15.55,14.65,27.65,z,z+1.15,P.stone,P.stoneR,P.stoneHi);
  }
  plLeisurePointWindow007(S,T.F,3.65,11.5,4.25,18,{lit:true});
  plLeisurePointWindow007(S,T.F,3.45,60,4.65,13.9,{louvre:true,lit:false});
  plLeisurePointWindow007(S,T.R,3.9,60,4.65,13.9,{right:true,louvre:true,lit:false});
  plLeisurePointWindow007(S,T.R,4.9,35.1,2.45,10,{right:true,lit:false});
  for(const [i,j]of [[4.0,27.1],[14.9,27.1],[15,15.4]])plLeisureButtress007(S,i,j,71.4,1.05);
  S.flat(4.1,14.9,15.3,27.0,78.3,C('646e62'));
  S.box(3.7,15.3,14.9,15.85,78.25,82,P.stone,P.stoneR,P.stoneHi);
  S.box(3.7,4.65,15.0,27.4,78.25,82,P.stone,P.stoneR,P.stoneHi);
  S.box(3.7,15.3,26.45,27.4,78.25,82,P.stone,P.stoneR,P.stoneHi);
  S.box(14.35,15.3,15,27.4,78.25,82,P.stone,P.stoneR,P.stoneHi);
  for(const i of [3.7,7.9,12.1])for(const j of [14.9,26.45])S.box(i,i+3.2,j,j+.95,82,86.8,P.stone,P.stoneR,P.stoneHi);
  for(const j of [18.3,22.6])for(const i of [3.7,14.35])S.box(i,i+.95,j,j+2.65,82,86.8,P.stone,P.stoneR,P.stoneHi);
  // The porch has a deep entrance and timber-supported opening below its gable.
  const PF=S.face([21.7,40.1],[31.1,40.1]),PR=S.face([31.1,30],[31.1,40.1]);
  PR.panel(0,10.1,0,20.5,plLeisureFlint007(true,782),0);
  PF.panel(0,9.4,0,20.5,(u,z)=>{
    const inner=u>2.15&&u<7.25,top=17.7-Math.abs(u-4.7)*.88;
    return inner&&z>1&&z<top?null:plLeisureFlint007(false,783)(u,z);
  },0);
  S.wall([23.85,37],[28.95,37],.9,18.8,C('405047'));
  const D=S.face([23.85,37.05],[28.95,37.05]);plLeisureRoundDoor007(S,D,0,1,5.1,16.7,{lit:false});
  S.wall([23.85,37],[23.85,40.1],1,15.5,P.stoneD);S.wall([28.95,37],[28.95,40.1],1,15.5,P.stoneR);
  S.flat(22.5,30.4,35.3,40.5,1.05,P.path[1]);
  plLeisureRoof007(S,21.3,31.5,29.6,40.6,20.7,10.4,784,{axis:'j',clay:true,stone:true,gable:plLeisureAshlar007(false)});
  for(const i of [22.6,30.1])S.box(i-.35,i+.35,39.9,40.2,16.5,21,C('68705c'),C('47594b'),P.stoneR);
  S.line([22.2,40.7,21],[26.4,40.7,29.8],C('596454'),1);S.line([26.4,40.7,29.8],[30.6,40.7,21],C('596454'),1);
  S.line([26.4,40.7,21],[26.4,40.7,30.7],C('68705c'),1);
  plLeisurePointWindow007(S,PR,4.3,7,2.0,8.5,{right:true,lit:false});
  plLeisureSteps007(S,23.1,29.8,40.2,42.6,1.8,3);
  downpipe(S,35.55,30.7,34.9);downpipe(S,44.7,28.5,27.0);
  // Low churchyard edges retain street access and a readable lawn strip.
  for(const [a,b]of [[[1,46.5],[21.7,46.5]],[[30.8,46.5],[46.6,46.5]],[[46.6,5.0],[46.6,39.8]]]){
    const F=S.face(a,b);F.panel(0,F.length,0,2.2,plLeisureFlint007(a[0]===b[0],786),0);
    S.line([a[0],a[1],2.3],[b[0],b[1],2.3],P.stoneR,1);
  }
  bench(S,34.6,37.0,6.4);bush(S,8.2,39.4,2.2,4.1,false);bush(S,40.7,7.6,2.0,4.2,false);
  lamp(S,32.0,43.8,9);return S.finish();
}

function nonconformistChapel007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Compact double-height brick gallery hall, with a classical street front.
  const W=plLeisureWalls007(S,3.2,27.6,4.0,24.5,0,43.4,plLeisureBrick007,790);
  hipRoof(S,[[2.75,3.55],[28.05,3.55],[28.05,24.55],[2.75,24.55]],[11.2,13.0],[19.6,13.0],43.6,10.3,792);
  S.box(2.85,27.95,4.0,24.85,20.7,21.8,P.stone,P.stoneR,P.stoneHi);
  cornice(S,3.0,27.8,3.85,24.65,42.5);
  // Side pilasters and two tiers of round-headed lights clearly indicate gallery use.
  for(const j of [4.4,10.7,17.2,23.5]){
    S.box(27.6,28.05,j,j+1.0,1.8,41.7,C('b27a5d'),C('966447'),P.stoneR);
    S.box(27.55,28.2,j-.2,j+1.2,39.8,41.2,P.stoneR,P.stoneD,P.stone);
  }
  for(const u of [2.15,8.5,14.7]){
    windowOn(S,W.R,u,5.0,4.1,13.3,{right:true,arch:true,panes:2,transom:6.4,lit:u!==8.5});
    windowOn(S,W.R,u,26.0,4.1,13.7,{right:true,arch:true,panes:2,transom:6.7,lit:u===8.5});
  }
  for(const i of [3.25,8.8,21.05,26.5]){
    S.box(i,i+1.05,24.45,25.15,1.2,42.7,P.stone,P.stoneR,P.stoneHi);
    S.box(i-.18,i+1.23,24.4,25.45,39.5,41.3,P.stoneHi,P.stoneR,P.stoneHi);
  }
  for(const u of [1.7,19.0]){
    windowOn(S,W.F,u,5.7,3.9,13.4,{arch:true,panes:2,lit:false});
    windowOn(S,W.F,u,26.0,3.9,13.7,{arch:true,panes:2});
  }
  plLeisureRoundDoor007(S,W.F,7.4,3.4,4.35,15.0,{});
  plLeisureRoundDoor007(S,W.F,12.8,3.4,4.35,15.0,{});
  windowOn(S,W.F,8.5,27.0,7.35,13.4,{arch:true,panes:3,transom:6.4});
  W.F.panel(7.1,17.65,22.1,25.8,P.stone,.2);letters(W.F,'CHAPEL',7.75,22.6,.36,C('76523e'));
  // A broken pediment sits above the central bay; it is masonry, not floating trim.
  const PF=S.face([9.0,25.35],[22.0,25.35]);PF.panel(0,13,41.8,45.8,plLeisureBrick007(false,795),0);
  S.poly([[9.0,25.35,45.2],[22,25.35,45.2],[15.5,25.35,54.6]],(i,j,z)=>plLeisureBrick007(false,796)(i,z),0);
  S.line([8.8,25.6,45.7],[13.45,25.6,52.5],P.stoneHi,1);
  S.line([17.55,25.6,52.5],[22.2,25.6,45.7],P.stoneHi,1);
  S.line([8.75,25.6,44.8],[22.25,25.6,44.8],P.stoneHi,1);
  windowOn(S,PF,5.2,46.4,2.7,5.4,{arch:true,panes:1,lit:false});
  plLeisureSteps007(S,9.5,22.1,24.9,29.7,3.45,5);
  for(const i of [9.15,22.4]){
    S.line([i,25.0,7],[i,29.7,4.2],P.iron,1);
    for(const j of [25.1,27.1,29.4]){const z=3.45*(29.7-j)/4.8;S.line([i,j,z],[i,j,z+3.9],P.iron,1);}
  }
  downpipe(S,27.98,24.5,42.5);lamp(S,5.6,29.1,8.6);bush(S,28.9,28.9,1.3,2.8,true);
  return S.finish();
}

function cricketPavilion007(spec) {
  const S=Scene(spec);plLeisureGrass007(S,802);
  plLeisurePaving007(S,2.0,46.0,40.0,47.4,803);plLeisurePaving007(S,43.1,47.4,5,43,804);
  // Substantial brick clubhouse behind a high, long, genuinely open veranda.
  const W=plLeisureWalls007(S,4.5,43.0,6.0,24.3,0,36.5,plLeisureBrick007,805);
  plLeisureRoof007(S,4.0,43.5,5.5,24.8,36.7,14.0,807,{clay:true,gable:plLeisureBoard007(true,808,true)});
  for(const u of [2,9.5,26.5,33.0])windowOn(S,W.F,u,15.0,4.9,12.1,{panes:3,transom:7.7});
  doorway(S,W.F,17.0,9.5,5.0,16.9,{double:true});
  for(const u of [2.1,9.8])windowOn(S,W.R,u,12.0,4.9,13.7,{right:true,panes:3,transom:8.7});
  W.F.panel(0,38.5,30.6,32.0,C('495f4e'),.14);W.R.panel(0,18.3,30.6,32,C('344d42'),.14);
  for(const i of [6.2,14.5,34.2,41.3])S.box(i-.36,i+.36,24.25,24.6,28.0,36.4,C('58715b'),C('3b5245'),P.frameR);
  // Terrace and veranda have separate height levels and supported load paths.
  S.box(3.8,43.6,24.2,34.9,0,9.0,(i,j,z)=>plLeisureBrick007(false,810)(i,z),(i,j,z)=>plLeisureBrick007(true,811)(j,z),C('a19b80'));
  // Shade only the real deck under the veranda; leave the exposed lip unchanged.
  // This separates the cream posts from the floor seen through the open bays.
  S.flat(4.1,43.3,24.2,34.7,9.08,(i,j)=>{
    const seam=mod(i,1.15)<.12;
    if(j>34.4)return seam?C('827e68'):C('b3a386');
    if(j>32.8)return seam?C('78806a'):C('9a947c');
    return seam?C('65715d'):C('80836c');
  });
  for(const i of [5.5,13.1,20.7,28.3,35.9,42.4]){
    plLeisurePost007(S,i,33.65,9.1,27.4,true);
    S.line([i,33.65,23.9],[i+2.0,33.65,27.1],C('aeb89b'),1);
    S.line([i,33.65,23.9],[i-2.0,33.65,27.1],C('aeb89b'),1);
  }
  S.poly([[4.0,24.1,32.2],[43.6,24.1,32.2],[43.6,34.4,27.4],[4.0,34.4,27.4]],plLeisureClay007(false,812,'i'));
  S.wall([4.0,34.4],[43.6,34.4],26.9,28.1,C('cec8a8'));
  S.line([4,34.45,26.5],[43.6,34.45,26.5],C('566b54'),1);
  for(const [a,b]of [[[4.5,34.7],[19.6,34.7]],[[27.3,34.7],[43.0,34.7]],[[43.1,24.9],[43.1,34.7]]])plLeisureRails007(S,a,b,9.1,4.7,{cream:true,cross:true});
  // A jettied, gabled viewing room rises above the veranda's low sweep.
  const V=plLeisureWalls007(S,17.0,30.2,17.1,28.5,30.5,46.4,(right,seed)=>plLeisureBoard007(right,seed,true),814);
  plLeisureRoof007(S,16.6,30.6,16.7,29.0,46.5,13.4,816,{axis:'j',clay:true,gable:plLeisureBoard007(false,817,true)});
  S.box(16.5,30.7,28.4,29.2,30.0,31.3,C('5a6c51'),C('3a5243'),C('708064'));
  windowOn(S,V.F,1.6,33.0,10.0,11.6,{panes:5,transom:7.8,border:.32});
  windowOn(S,V.R,3.4,34.0,5.4,9.0,{right:true,panes:3,lit:false});
  for(const i of [17.3,23.6,29.9])S.line([i,29.05,46.7],[i,29.05,46.7+(i===23.6?12.6:.5)],C('536a50'),1);
  S.line([17.15,29.08,46.7],[23.6,29.08,59.2],C('536a50'),1);S.line([23.6,29.08,59.2],[30.05,29.08,46.7],C('536a50'),1);
  S.line([19.4,29.08,46.8],[23.6,29.08,53.7],C('536a50'),1);S.line([27.8,29.08,46.8],[23.6,29.08,53.7],C('536a50'),1);
  S.line([23.6,29.08,58.9],[23.6,29.08,62.1],C('657258'),1);
  // Broad stepped spectator terraces leave the central stair genuinely clear.
  for(let n=0;n<4;n++){
    const back=34.9+n*2.7,front=back+2.7,z=7.1-n*1.75;
    for(const [a,b]of [[4.2,19.5],[27.4,43.5]]){
      S.box(a,b,back,front,0,z,P.stoneR,P.stoneD,P.path[1]);
      S.line([a,front,z],[b,front,z],P.stoneHi,1);
      // Fixed slatted benches on visible iron legs, not painted stripes on the steps.
      const y=back+.65;
      for(const i of [a+.7,b-.7])S.box(i-.16,i+.16,y,y+.7,z,z+1.5,P.iron,P.iron,null);
      S.box(a+.2,b-.2,y,y+1.1,z+1.35,z+1.8,C('9e865c'),C('746a4c'),C('b39b6a'));
    }
  }
  plLeisureSteps007(S,20,26.9,34.85,46.2,9.0,9);
  for(const i of [19.7,27.2]){
    S.line([i,35,13],[i,46.1,4],C('c2c7aa'),1);
    for(let k=0;k<5;k++){const j=35+k*2.7,z=9*(46.2-j)/11.35;S.line([i,j,z],[i,j,z+4],C('aeb79c'),1);}
  }
  // A compact scoreboard on the right wall is part of the club's everyday use.
  W.R.panel(2.5,15.5,28.5,34.2,C('344b40'),.2);letters(W.R,'CC',3.4,29.5,.36,P.frame);
  for(const u of [7.0,9.6,12.1])W.R.panel(u,u+1.1,30.0,32.3,C('d2ccb0'),.25);
  downpipe(S,43.2,24.45,36.5);bush(S,2.0,33.4,1.25,3.0,false);lamp(S,45.6,39.0,10);
  return S.finish();
}

function bowlsClub007(spec) {
  const S=Scene(spec);plLeisureGrass007(S,824);
  plLeisurePaving007(S,1,31,24.3,27.4,825);plLeisurePaving007(S,12.7,20.0,26.5,31.4,826);
  // Rear changing room with weatherboard, and three truly open segmental bays.
  const W=plLeisureWalls007(S,3.1,29.0,7.1,14.5,0,23.4,(right,seed)=>plLeisureBoard007(right,seed,false),827);
  S.box(2.7,29.4,6.8,23.8,0,2.35,(i,j,z)=>plLeisureBrick007(false,829)(i,z),(i,j,z)=>plLeisureBrick007(true,830)(j,z),C('8c977d'));
  // A shaded timber floor makes the three open archways legible as depth.
  // The frontmost strip catches edge light; no dark fill is placed in the air.
  S.flat(3,29.1,14.4,23.7,2.42,(i,j)=>{
    const seam=mod(i,1.15)<.1;
    return j>22.6?(seam?C('7e8269'):C('91967b')):(seam?C('697461'):C('7b846b'));
  });
  doorway(S,W.F,10.45,2.45,5.0,14.6,{double:true,col:C('4e6856')});
  for(const u of [2.2,19.0])windowOn(S,W.F,u,8.5,4.8,8.6,{panes:3,lit:u>10,border:.3});
  windowOn(S,W.R,2.0,8.4,3.6,8.4,{right:true,panes:2,lit:false});
  const F=S.face([3.2,23.2],[28.8,23.2]);
  for(const i of [3.25,11.8,20.35,28.85])plLeisurePost007(S,i,23.2,2.4,21.5,true);
  // A shallow arch is cut out of each structural spandrel; no dark fake opening.
  for(const u of [.45,9.0,17.55]){
    const w=7.65;
    F.panel(u,u+w,16.1,21.4,(x,z)=>{
      const curve=1.0+3.3*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
      return z<curve?null:C('d3d2b2');
    },.12);
    let prev=null;
    for(let k=0;k<=12;k++){
      const x=w*k/12,z=17.1+3.3*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2)),p=F.point(u+x);
      if(prev)S.line(prev,[p[0],p[1],z],C('a8b299'),1);prev=[p[0],p[1],z];
    }
  }
  for(const [a,b]of [[3.2,11.8],[20.35,28.8]]){
    S.wall([a,23.2],[b,23.2],2.4,6.9,(i,j,z)=>plLeisureBoard007(false,832,true)(i,z),.08);
    S.box(a,b,22.9,23.5,6.7,7.35,C('c7cfb0'),C('969e88'),C('d6d9ba'));
    for(let i=a+.75;i<b-.4;i+=2.15)S.line([i,23.3,3.1],[i,23.3,6.6],C('a5b093'),1);
  }
  S.wall([29,14.5],[29,23.2],2.4,6.9,(i,j,z)=>plLeisureBoard007(true,833,true)(j,z),.05);
  S.box(2.7,29.45,22.95,23.6,21.3,23.0,C('d8d4b3'),C('aab097'),C('e1ddbd'));
  // Monopitch slate, high at the rear and low at the arcade. No gable or cupola.
  S.poly([[2.6,6.6,27.0],[29.5,6.6,27.0],[29.5,23.8,23.2],[2.6,23.8,23.2]],tileRoof(false,834,'i'));
  S.poly([[29.1,7.1,23.3],[29.1,23.2,21.7],[29.1,23.8,23.2],[29.1,6.6,27.0]],C('54705b'));
  S.line([2.6,6.6,27],[29.5,6.6,27],P.lead,1);S.line([2.6,23.8,23.2],[29.5,23.8,23.2],P.roofEdge,1);
  plLeisureSteps007(S,12.2,20.0,23.55,26.4,2.4,3);
  // Low seating and a cropped green edge establish scale without inventing play.
  bench(S,3.5,28.3,6.1);bench(S,23.0,28.3,5.8);
  S.line([1.4,30.7,.3],[10.6,30.7,.3],C('d4d2af'),1);
  S.box(6.8,7.5,29.8,30.5,.2,.7,C('424d40'),C('343e36'),C('54604a'));
  S.box(9.2,9.7,29.8,30.3,.2,.6,C('dddcc4'),C('b4b79e'),C('efecd4'));
  plLeisureSconce007(S,11.8,23.4,16.0);plLeisureSconce007(S,20.35,23.4,16.0);
  downpipe(S,29.3,23.65,23);return S.finish();
}

function ironBandstand007(spec) {
  const S=Scene(spec);plLeisureGrass007(S,844);
  plLeisurePaving007(S,1,31,2.0,30.8,845);
  const B=[[8,4],[24,4],[28,8],[28,24],[24,28],[8,28],[4,24],[4,8]];
  const R=B.map(p=>[16+(p[0]-16)*1.17,16+(p[1]-16)*1.17]);
  const Q=B.map(p=>[16+(p[0]-16)*.94,16+(p[1]-16)*.94]);
  // The column ring is inset from the eave. Seat every capital on the
  // actual sloping canopy at that radius, not merely at eave height.
  const canopySeat=37.0-(37.0-29.8)*(.94/1.17);
  // Octagonal stone drum and a timber stage; the whole interior remains air.
  for(let k=0;k<8;k++){
    const a=B[k],b=B[(k+1)%8],right=(b[1]-a[1])>(b[0]-a[0]);
    S.wall(a,b,0,4.6,right?P.stoneR:P.stone);
    S.line([a[0],a[1],1.7],[b[0],b[1],1.7],right?P.stoneD:C('b4ab90'),1);
    S.wall(a,b,4.5,5.25,right?C('aaa78d'):C('cec5a8'));
  }
  S.poly(B.map(p=>[p[0],p[1],5.3]),(i,j)=>mod(i,1.15)<.1?C('8b7d62'):C('b39c77'));
  for(let k=0;k<8;k++){
    const a=Q[k],b=Q[(k+1)%8];plLeisurePost007(S,a[0],a[1],5.35,canopySeat,false);
    // Cast iron corner brackets are slender geometry tied directly to each post.
    const da=lerp(a,b,.23),db=lerp(a,b,.77);
    S.line([a[0],a[1],25],[da[0],da[1],28.9],C('607969'),1);
    S.line([db[0],db[1],28.9],[b[0],b[1],25],C('607969'),1);
    S.line([a[0],a[1],28.9],[b[0],b[1],28.9],C('536c5c'),1);
    // Patterned rail, with a real central entry opening on the front face.
    if(k===4){
      plLeisureRails007(S,a,[19.4,a[1]],5.4,4.5,{cross:true});
      plLeisureRails007(S,[12.6,a[1]],b,5.4,4.5,{cross:true});
    }else plLeisureRails007(S,a,b,5.4,4.5,{cross:true});
    // Lower the four lanterns below the eave and mount them on the outer
    // column faces. The opaque casing and panes share normal scene depth.
    if(k===2||k===3||k===4||k===5){
      const li=a[0]+(k<4?.62:0),lj=a[1]+(k>=4?.62:0),lz=18.3;
      S.box(Math.min(a[0],li)-.18,Math.max(a[0],li)+.18,Math.min(a[1],lj)-.18,Math.max(a[1],lj)+.18,lz-.15,lz+.5,P.iron,P.iron,P.ironHi);
      S.box(li-.65,li+.65,lj-.58,lj+.58,lz-1.5,lz+1.9,P.iron,P.iron,P.ironHi);
      const LF=S.face([li-.44,lj+.60],[li+.44,lj+.60]);
      const LR=S.face([li+.67,lj-.34],[li+.67,lj+.34]);
      LF.panel(0,.88,lz-1.04,lz+1.28,[C('ceb47f'),P.warm[0]],.08);
      LR.panel(0,.68,lz-1.04,lz+1.28,[C('ad905f'),P.warm[2]],.08);
      S.box(li-.75,li+.75,lj-.68,lj+.68,lz+1.75,lz+2.08,P.iron,P.iron,P.ironHi);
    }
  }
  // A shallow eight-facet metal canopy, never a double-eaved temple roof.
  for(let k=0;k<8;k++){
    const a=R[k],b=R[(k+1)%8],right=(a[0]+b[0])>(a[1]+b[1]);
    const mat=(i,j,z)=>{
      const seam=mod((k&1?i+j:i-j)*1.1,3.4)<.11;
      return seam?(right?C('455d59'):C('6b8174')):(right?C('5d756c'):C('829586'));
    };
    S.poly([[a[0],a[1],29.8],[b[0],b[1],29.8],[16,16,37.0]],mat);
    S.wall(a,b,28.7,29.85,right?C('355247'):C('567362'));
    S.line([a[0],a[1],29.85],[16,16,37.05],right?C('6f8478'):C('9ba999'),1);
    const m=lerp(a,b,.5);
    S.line([m[0],m[1],29.5],[m[0],m[1],31.9],C('556e5b'),1);
    S.line([m[0]-.45,m[1],30.3],[m[0]+.45,m[1],30.3],C('728c73'),1);
  }
  // Central basket finial is physically seated on the canopy crown.
  S.box(15.2,16.8,15.2,16.8,36.7,38.1,C('627b65'),C('3e5848'),C('899779'));
  for(const d of [-.7,.7])S.line([16+d,16,38.0],[16+d*.65,16,41.0],C('5a735d'),1);
  S.line([15.35,16,40.2],[16.65,16,40.2],C('6f8569'),1);S.line([16,16,37.9],[16,16,43.2],C('5c7057'),1);
  plLeisureSteps007(S,12.7,19.3,27.65,31.0,5.3,5);
  return S.finish();
}

function seasideConcertHall007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Enclosed assembly hall with an opaque, low vaulted metal roof.
  const W=plLeisureWalls007(S,4.0,35.1,4.3,33.1,0,28.4,plLeisureAshlar007,860);
  W.F.panel(0,31.1,2.0,5.0,C('b9ba9e'),.1);W.R.panel(0,28.8,2.0,5.0,C('959f8a'),.1);
  for(const u of [2.4,10.1,18.0,25.2])windowOn(S,W.F,u,9,4.2,15.5,{arch:true,panes:2,transom:9.2});
  for(const u of [2.4,9.8,17.2,24.0])windowOn(S,W.R,u,9.0,4.2,15.5,{right:true,arch:true,panes:2,transom:9.2,lit:u!==9.8});
  for(const i of [4.0,11.7,19.5,27.3,34.3])S.box(i,i+.85,33.0,33.55,2.0,27.3,P.stoneHi,P.stoneR,P.stoneHi);
  for(const j of [4.5,11.7,19.1,26.4,32.0])S.box(35.05,35.7,j,j+.8,2,27.3,P.stoneR,P.stoneD,P.stone);
  cornice(S,3.9,35.2,4.2,33.2,27.5);
  const i0=3.6,i1=35.6,mid=(i0+i1)/2,rad=(i1-i0)/2,z0=29.0,rise=13.5;
  const roofZ=i=>z0+rise*Math.sqrt(Math.max(0,1-((i-mid)/rad)**2));
  for(let n=0;n<12;n++){
    const a=i0+(i1-i0)*n/12,b=i0+(i1-i0)*(n+1)/12,za=roofZ(a),zb=roofZ(b),right=n>=6;
    const metal=(i,j,z)=>{
      if(mod(j,3.35)<.11)return right?C('4d6d68'):C('7d9788');
      return right?C('69857a'):C('95aa96');
    };
    S.poly([[a,3.9,za],[b,3.9,zb],[b,33.6,zb],[a,33.6,za]],metal);
    S.poly([[a,33.35,28.3],[b,33.35,28.3],[b,33.35,zb],[a,33.35,za]],P.stone);
    S.line([a,3.9,za+.1],[a,33.6,za+.1],right?C('6f8d7e'):C('a7b8a0'),1);
    S.line([a,33.62,za],[b,33.62,zb],P.stoneHi,1);
  }
  // A shallow ridge vent is solid, with small louvers, not a greenhouse lantern.
  S.box(17.3,21.9,11.0,23.8,41.0,44.0,C('b5bda2'),C('8e9d8a'),C('738c78'));
  const VF=S.face([17.3,23.8],[21.9,23.8]);VF.panel(.55,4.05,41.4,43.35,(x,z)=>mod(z,.85)<.32?C('acb89d'):C('526b5d'),.12);
  // Right-hand colonnaded promenade provides the visible roof void from the road.
  // Apply roof shelter to the slab's actual top surface, bounded by its roof.
  // Outer slab margins keep the existing sunlit paving colour.
  S.box(35.2,44.8,5.4,42.4,0,1.8,P.stoneR,P.stoneD,(i,j)=>{
    if(i<35.3||i>44.3||j<5.8||j>41.8)return P.path[2];
    if(i>42.8)return C('a2a58f');
    return mod(j,3.2)<.12?C('7e8775'):C('909682');
  });
  for(const j of [6.8,14.9,23.0,31.1,40.6]){
    plLeisurePost007(S,43.4,j,1.9,20.4,true);
    S.line([43.4,j,17.3],[43.4,j+1.65,20.2],C('b7c0a3'),1);
    S.line([43.4,j,17.3],[43.4,j-1.65,20.2],C('b7c0a3'),1);
  }
  S.poly([[35.3,5.8,22.4],[44.3,5.8,20.9],[44.3,41.8,20.9],[35.3,41.8,22.4]],tileRoof(true,866,'j'));
  S.wall([44.3,5.8],[44.3,41.8],20.0,21.15,C('b2baa1'));
  S.line([44.3,5.8,19.8],[44.3,41.8,19.8],C('768c78'),1);
  plLeisureSconce007(S,43.45,14.9,16.0);plLeisureSconce007(S,43.45,31.1,16.0);
  // Independent entrance volume projects below its own ribbed copper dome.
  const E=plLeisureWalls007(S,12.6,28.0,30.1,42.2,0,31.5,plLeisureAshlar007,867);
  S.box(12.2,28.4,29.85,42.55,29.8,31.5,P.stoneHi,P.stoneR,P.stoneHi);
  for(const i of [12.7,15.2,25.2,27.2]){
    S.box(i-.35,i+.35,42.1,42.7,2.0,28.8,P.stoneHi,P.stoneR,P.stoneHi);
    S.box(i-.6,i+.6,42.0,42.95,27.4,29.1,P.stoneHi,P.stoneR,P.stoneHi);
  }
  plLeisureRoundDoor007(S,E.F,4.6,1.2,6.25,19.0,{});
  windowOn(S,E.F,1.1,9.0,2.15,11.0,{arch:true,panes:1,lit:false});
  windowOn(S,E.F,12.1,9.0,2.15,11.0,{arch:true,panes:1,lit:false});
  E.F.panel(3.45,12.15,22.6,27.3,C('77917d'),.22);letters(E.F,'HALL',4.35,23.4,.48,P.stoneHi);
  windowOn(S,E.R,3.0,9.3,4.6,15.0,{right:true,arch:true,panes:2,transom:8.4});
  // Faceted dome rings are closed opaque solids on the roof, with paired shading.
  const cx=20.3,cy=36.1,ys=.78,segments=12,rings=[[7.5,31.55],[7.65,33.3],[6.85,38.6],[4.75,44.0],[2.25,47.3],[.7,48.4]];
  for(let n=0;n<rings.length-1;n++)for(let k=0;k<segments;k++){
    const a=2*Math.PI*k/segments,b=2*Math.PI*(k+1)/segments,A=rings[n],B=rings[n+1];
    const p=[cx+Math.cos(a)*A[0],cy+Math.sin(a)*A[0]*ys,A[1]],q=[cx+Math.cos(b)*A[0],cy+Math.sin(b)*A[0]*ys,A[1]],r=[cx+Math.cos(b)*B[0],cy+Math.sin(b)*B[0]*ys,B[1]],t=[cx+Math.cos(a)*B[0],cy+Math.sin(a)*B[0]*ys,B[1]];
    const right=Math.cos((a+b)/2)>Math.sin((a+b)/2);
    S.poly([p,q,r,t],right?C('668476'):C('91ab91'));
    S.line(p,t,right?C('8b9f89'):C('b1c0a4'),1);
  }
  S.flat(cx-.7,cx+.7,cy-.7,cy+.7,48.4,C('718a6d'));
  S.box(cx-.6,cx+.6,cy-.6,cy+.6,48.3,50.1,C('a3b293'),C('738a70'),C('b7c3a3'));
  S.line([cx,cy,49.8],[cx,cy,53.0],C('6a805f'),1);
  plLeisureSteps007(S,15.4,25.0,42.4,46.0,1.8,3);
  bench(S,4.6,39.6,5.9);bench(S,34.9,44.2,6.6);bush(S,8.7,45.5,1.6,3.0,true);
  downpipe(S,35.6,33.15,27.5);lamp(S,30.0,45.8,9.4);return S.finish();
}

  const builders={UKL01:plHistoricTownHall007,UKL02:plMagistratesCourt007,UKL03:plBoroughPolice007,UKL04:plEdwardianFireStation007,UKL05:plTechnicalInstitute007,UKL06:plGrammarSchool007,UKL07:flintParishChurch007,UKL08:nonconformistChapel007,UKL09:cricketPavilion007,UKL10:bowlsClub007,UKL11:ironBandstand007,UKL12:seasideConcertHall007};
  function build(id){const s=specs.find(q=>q.id===id);if(!s)throw Error('Unknown public-life building: '+id);return builders[id](s);}
  root.PublicLifeArchitecture007=Object.freeze({version:'UKL-art-r1',specs,build,buildAll:()=>specs.map(s=>builders[s.id](s))});
})(window);
