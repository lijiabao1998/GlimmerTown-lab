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


