/* GPT-005 British high-street buildings, UKH01–08.
 * Canonical native art registered by installHighStreetArt005 in the playable game.
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
  const specs=Object.freeze([{"id": "UKH01", "nm": "合作社百貨", "en": "Co-operative stores", "sz": 2, "w": 136, "h": 170, "ax": 68, "ay": 168}, {"id": "UKH02", "nm": "石砌烘焙坊", "en": "Stone bakehouse", "sz": 2, "w": 136, "h": 150, "ax": 68, "ay": 148}, {"id": "UKH03", "nm": "維多利亞室內市場", "en": "Victorian covered market", "sz": 3, "w": 208, "h": 210, "ax": 104, "ay": 208}, {"id": "UKH04", "nm": "砂岩公立學校", "en": "Sandstone board school", "sz": 3, "w": 208, "h": 195, "ax": 104, "ay": 193}, {"id": "UKH05", "nm": "花園鄉村診所", "en": "Cottage surgery", "sz": 2, "w": 136, "h": 145, "ax": 68, "ay": 143}, {"id": "UKH06", "nm": "高街郵政局", "en": "High-street post office", "sz": 2, "w": 136, "h": 155, "ax": 68, "ay": 153}, {"id": "UKH07", "nm": "市立室內浴場", "en": "Municipal swimming baths", "sz": 3, "w": 208, "h": 205, "ax": 104, "ay": 203}, {"id": "UKH08", "nm": "木造社區會堂", "en": "Timber village hall", "sz": 2, "w": 136, "h": 145, "ax": 68, "ay": 143}].map(Object.freeze));

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
  function letters(F,text,u,z,unit,col) {for(let k=0;k<text.length;k++){const A=FONT[text[k]]||FONT[' '];for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(A[y][x]==='1')F.panel(u+(k*4+x)*unit,u+(k*4+x+1)*unit,z+(4-y)*unit*1.8,z+(5-y)*unit*1.8,col,.38);}}


/* GPT-005 high-street shops. These original builders are concatenated inside the
 * existing British native-pixel IIFE. All geometry uses its unchanged Scene
 * projection and opaque day/emissive z-buffer. No raster assets or shared RNG.
 */

function hsAshlar005(right, seed, faience) {
  const cols = right
    ? (faience ? ['b6ae98','bbb29c','b3aa94'] : ['b2a58e','b9ac95','ad9f87'])
    : (faience ? ['ded5bd','e2d9c2','d9cfb7'] : ['d0c1a3','d5c7ab','cabca0']);
  const pal = cols.map(C), mortar = C(right ? 'a49a85' : 'c2b79e');
  return (u,z) => {
    const row=Math.floor(z/3.2), x=u+(row&1)*2.2;
    if(mod(z,3.2)<.15 || mod(x,4.4)<.11)return mortar;
    const n=hash(Math.floor(x/4.4),row,seed);
    return n%13===0?pal[1]:n%17===0?pal[2]:pal[0];
  };
}

function hsRubble005(right,seed) {
  const pal=(right?['a8997b','ad9d80','a49376','b0a185']:['c4b795','c9bc9d','beb18f','cfc1a0']).map(C);
  return (u,z) => {
    const row=Math.floor(z/2),phase=(row&1)*1.6,x=u+phase;
    const n=hash(Math.floor(x/3),row,seed);
    if(mod(z,2)<.19 || mod(x,3)<.13)return right?C('928870'):C('aea486');
    return pal[(n>>>6)%4];
  };
}

function hsWindow005(S,F,u,z,w,h,opt) {
  opt=opt||{};
  const right=!!opt.right, frame=opt.frame===undefined?(right?P.frameR:P.frame):opt.frame;
  const glass=opt.glass===undefined?(right?P.glassR:P.glass):opt.glass;
  const arch=opt.arch?Math.min(w*.72,4.5):0,border=opt.border||.34;
  const archTop=x=>arch?h-arch+arch*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2)):h;
  if(opt.sill!==false){
    F.panel(u-.28,u+w+.28,z-.65,z+.05,right?P.stoneD:P.stoneR,.16);
    F.panel(u-.4,u+w+.4,z-.2,z+.45,right?P.stoneR:P.stoneHi,.23);
  }
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const top=archTop(x);if(y>top)return null;
    if(x<border||x>w-border||y<.45||y>top-.5)return frame;
    const panes=opt.panes||2;
    const paneWidth=w/panes,seam=mod(x,paneWidth);
    // Opt-in centred strips survive the quarter-pixel sample phase of the
    // tall co-op bays; preserve the original sampling on every other asset.
    if(panes>1&&(opt.centeredMullions?Math.min(seam,paneWidth-seam)<=.30:Math.abs(seam)<.20))return frame;
    const bars=opt.bars||[h*.5];
    if(bars.some(b=>Math.abs(y-b)<.28))return frame;
    if(opt.leaded&&mod(x*1.45+y*.45,2.4)<.11)return right?P.iron:P.ironHi;
    if(opt.display){const d=opt.display(x,y);if(d!==null&&d!==undefined)return d;}
    const lit=opt.lit===false?0:(opt.warm===undefined?P.warm[0]:opt.warm);
    return [y>h*.76?(right?P.glass:C('7e969a')):glass,lit];
  },opt.bias===undefined?.23:opt.bias);
}

function hsText005(F,text,u,z,unit,col) {
  const glyphs={
    A:['010','101','111','101','101'],B:['110','101','110','101','110'],
    C:['011','100','100','100','011'],D:['110','101','101','101','110'],E:['111','100','110','100','111'],
    F:['111','100','110','100','100'],H:['101','101','111','101','101'],
    I:['111','010','010','010','111'],K:['101','101','110','101','101'],
    L:['100','100','100','100','111'],M:['101','111','111','101','101'],
    O:['010','101','101','101','010'],P:['110','101','110','100','100'],
    R:['110','101','110','101','101'],S:['011','100','010','001','110'],
    T:['111','010','010','010','010'],U:['101','101','101','101','111']
  };
  for(let k=0;k<text.length;k++){
    const rows=glyphs[text[k]];if(!rows)continue;
    for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(rows[y][x]==='1')
      F.panel(u+(k*4+x)*unit,u+(k*4+x+1)*unit,z+(4-y)*unit*1.65,z+(5-y)*unit*1.65,col,.39);
  }
}

function hsStoneRoof005(right,seed,axis) {
  const pal=(right?['79776b','7e7c6e','747266']:['999586','9d998a','938f80']).map(C);
  return (i,j,z)=>{
    const along=axis==='j'?j:i,across=axis==='j'?i:j;
    const row=Math.floor(across/1.4),x=along+(row&1)*1.1,n=hash(Math.floor(x/2.3),row,seed);
    if(mod(across,1.4)<.12)return right?C('686a60'):C('858474');
    if(mod(x,2.3)<.075&&n%3===0)return pal[2];
    return n%9===0?pal[1]:n%11===0?pal[2]:pal[0];
  };
}

function coOp005(spec) {
  const S=Scene(spec);ground(S,'paved');
  const blue=C('4b6472'),blueR=C('3c515e'),blueHi=C('6d828a');
  const front=S.face([3,27],[29,27]),side=S.face([29,4],[29,27]);
  const faience=hsAshlar005(false,510,true);
  front.panel(0,26,0,68,(u,z)=>{
    // The entrance is an actual cut-out: the recessed door remains behind the
    // jambs rather than being painted over an unbroken front wall.
    if(u>10.45&&u<15.55&&z<21)return null;
    return z<2?C('777b76'):faience(u,z);
  },0);
  side.panel(0,23,0,68,(u,z)=>z<2?C('686c68'):brick(true,511)(u,z),0);
  S.flat(3,29,4,27,68,P.stoneR);
  // Stone return at the street corner, then plainer service brick toward rear.
  side.panel(15.2,23,2,68,hsAshlar005(true,512,true),.05);
  const inset=S.face([13.45,25.45],[18.55,25.45]);
  inset.panel(0,5.1,0,21,C('263b45'),0);
  hsWindow005(S,inset,.5,1.1,4.1,18.3,{frame:blueHi,panes:2,bars:[12.5],sill:false,bias:.18});
  inset.panel(.75,4.35,1.2,5.8,blueR,.25);
  inset.panel(2.0,2.3,6.3,7.1,P.gold,.28);
  S.wall([13.45,25.45],[13.45,27],0,21,blueR,.03);
  S.wall([18.55,25.45],[18.55,27],0,21,blue,.03);
  S.flat(13.45,18.55,25.45,28.3,.5,(i,j)=>mod(Math.floor(i*1.2)+Math.floor(j*1.2),2)?P.stoneHi:C('8a9290'),.03);
  // Big shop panes, tall overlights and a restrained grocery display.
  for(const u of [1.3,16.4]){
    front.panel(u-.45,u+8.65,1.4,21.5,blue,.13);
    hsWindow005(S,front,u,4.2,8.2,16.3,{frame:blueHi,panes:4,bars:[10.7,13.8],sill:false,display:(x,y)=>{
      if(y>2.0&&y<2.6)return C('a48d68');
      if(y>.55&&y<1.9&&mod(x,.98)<.69)return [x<3.5?C('b1a07a'):C('8c9479'),P.warm[2]];
      return null;
    }});
    front.panel(u-.12,u+8.35,1.5,4.1,blueR,.25);
    for(let x=u+.8;x<u+7.9;x+=2.2)front.panel(x,x+1.2,2.05,3.35,blue,.28);
  }
  front.panel(0,26,21.3,25.1,C('79514b'),.14);
  front.panel(0,26,21.25,21.8,P.stoneHi,.26);
  front.panel(0,26,24.7,25.6,P.stone,.26);
  hsText005(front,'CO OP',8.5,21.75,.49,C('e5d9b7'));
  // Three tall round-headed openings span the two upper trading floors.
  // Wide faience pilasters and solid spandrels maintain a three-storey reading.
  for(const u of [1.5,10,18.5]){
    front.panel(u-.5,u+6.55,27,61.3,C('c8bda4'),.1);
    hsWindow005(S,front,u,28.5,6.0,30.4,{arch:true,frame:C('879991'),panes:3,centeredMullions:true,bars:[5.8,23.5,25.5],lit:u!==10,border:.45});
    // Opaque faience spandrels make the first/second-floor separation visible
    // at city zoom, while the tall outer arches still tie the bays together.
    front.panel(u+.2,u+5.8,40.9,44.5,blueR,.27);
    front.panel(u+.35,u+5.65,41.4,44.0,C('d1c7ad'),.31);
    front.panel(u+.15,u+5.85,44.0,44.6,P.stoneHi,.33);
    front.panel(u+.15,u+5.85,40.7,41.4,P.stoneR,.33);
    // Low-relief faience swag, drawn on the wall plane around each arch.
    for(let n=0;n<6;n++){
      const x=u+n,zz=61.2-1.3*Math.sin((n+.5)/6*Math.PI);
      front.panel(x,x+.75,zz,zz+.8,P.stoneHi,.28);
    }
  }
  for(const u of [.1,8.05,16.45,25.0]){
    front.panel(u,u+.9,25.6,63.0,P.stoneHi,.2);
    front.panel(u+.27,u+.63,29,56.5,C('c2b69c'),.24);
    front.panel(u-.15,u+1.05,59.7,61.4,P.stone,.3);
    front.panel(u-.25,u+1.15,61.8,63,P.stoneHi,.31);
  }
  for(const u of [2.3,8.1])for(const z of [30.3,47.3])
    hsWindow005(S,side,u,z,3.2,10.6,{right:true,frame:blueR,lit:z<40&&u<4,panes:2});
  hsWindow005(S,side,17.6,28.6,3.9,29.8,{right:true,arch:true,frame:C('687c7b'),panes:2,centeredMullions:true,bars:[5.8,23.2,25.0],lit:false});
  side.panel(17.8,21.3,41.1,44.4,P.stoneR,.31);
  // Broad cornice, a blind attic and a subordinate hipped slate roof.
  for(const z of [62.6,68])cornice(S,3,29,4,27,z);
  front.panel(.2,25.8,64.3,67.8,C('d7ceb6'),.1);
  for(const u of [2.2,10.7,19.2]){
    front.panel(u,u+4.9,65.0,67.0,C('bdb49d'),.15);
    front.panel(u+.3,u+4.6,65.3,66.8,C('d4cab1'),.19);
  }
  for(let u=.7;u<25.5;u+=1.4)front.panel(u,u+.6,61.9,62.8,P.stoneHi,.28);
  hipRoof(S,[[2.6,3.6],[29.4,3.6],[29.4,27.4],[2.6,27.4]],[9.0,15.5],[23,15.5],69.6,12,515);
  chimney(S,5.6,9.2,77.2,2.6,2.1,2,516);
  chimney(S,25.6,7.5,73.3,2.3,2.0,1,517);
  downpipe(S,29.35,25.9,68.8);
  // Narrow footway and stock delivery access, deliberately no pub furniture.
  step(S,13.35,18.65,27,29.0,2);
  S.box(29.8,31.1,8.7,11,0,3.5,C('a89672'),C('817558'),C('b2a07a'));
  S.line([29.9,10,1],[31.0,10,1],C('756951'),1);
  lamp(S,19.3,27.5,3.0,18.6);
  return S.finish();
}

function bakehouse005(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Perpendicular working bakehouse wing, visible beyond the low street range.
  const wingF=S.face([18,17],[29,17]),wingR=S.face([29,2.8],[29,17]);
  wingF.panel(0,11,0,20,hsRubble005(false,540),0);
  wingR.panel(0,14.2,0,20,hsRubble005(true,541),0);
  S.flat(18,29,2.8,17,20,P.stoneR);
  S.poly([[17.7,2.5,20],[23.5,2.5,30],[23.5,17.3,30],[17.7,17.3,20]],hsStoneRoof005(false,542,'j'));
  S.poly([[23.5,2.5,30],[29.3,2.5,20],[29.3,17.3,20],[23.5,17.3,30]],hsStoneRoof005(true,543,'j'));
  S.poly([[18,17,20],[29,17,20],[23.5,17,30]],(i,j,z)=>hsRubble005(false,544)(i,z),-.03);
  ridge(S,[23.5,2.5],[23.5,17.3],30,C('a29b87'));
  hsWindow005(S,wingR,2.0,5,3.9,9,{right:true,panes:3,frame:C('8b8b79'),bars:[5.2],lit:true});
  doorway(S,wingR,8.1,.6,3.8,13,{right:true,col:C('706c56')});
  chimney(S,20.1,4.1,27.3,2.2,2,1,545);
  // Coursed rubble and a steep, weighty stone-slate roof give the shop its low,
  // rural profile. The three pent dormers are individual roof constructions.
  const front=S.face([2.7,27],[28.7,27]),side=S.face([28.7,14.2],[28.7,27]);
  front.panel(0,26,0,23,hsRubble005(false,546),0);
  side.panel(0,12.8,0,23,hsRubble005(true,547),0);
  S.flat(2.7,28.7,14.2,27,23,P.stoneR);
  S.poly([[2.25,13.8,23.2],[29.15,13.8,23.2],[29.15,20.6,44],[2.25,20.6,44]],hsStoneRoof005(true,548,'i'));
  S.poly([[2.25,20.6,44],[29.15,20.6,44],[29.15,27.55,23.2],[2.25,27.55,23.2]],hsStoneRoof005(false,549,'i'));
  S.poly([[28.7,14.2,23],[28.7,27,23],[28.7,20.6,44]],(i,j,z)=>hsRubble005(true,550)(j,z),-.04);
  S.line([29.15,13.8,23.2],[29.15,20.6,44],P.stoneR,1);
  S.line([29.15,20.6,44],[29.15,27.55,23.2],P.stoneR,1);
  ridge(S,[2.25,20.6],[29.15,20.6],44,C('aaa18a'));
  S.line([2.25,27.55,23.1],[29.15,27.55,23.1],C('656b61'),1);
  for(const [k,i]of [4.4,12.2,20.1].entries()){
    const A=i,B=i+4.7,back=22.1,frontJ=25.5;
    S.poly([[A,back,39.5],[A,frontJ,29],[A,frontJ,37.6],[A,back,41]],P.stoneR,.02);
    S.poly([[B,back,39.5],[B,frontJ,29],[B,frontJ,37.6],[B,back,41]],C('a59b83'),.02);
    const D=S.face([A,frontJ],[B,frontJ]);
    D.panel(0,4.7,28.8,37.6,C('c5b99c'),.02);
    hsWindow005(S,D,.5,30.3,3.7,6.4,{panes:2,bars:[3.2],frame:C('d8cdb2'),leaded:k<2,lit:k===1});
    S.poly([[A-.25,back-.2,41.4],[B+.25,back-.2,41.4],[B+.25,frontJ+.35,37.8],[A-.25,frontJ+.35,37.8]],hsStoneRoof005(false,552+k,'i'));
    S.line([A-.25,frontJ+.35,37.8],[B+.25,frontJ+.35,37.8],C('827d6d'),1);
  }
  chimney(S,3.1,19.1,40.5,2.7,2.4,2,558);
  // The opposite end stack is older stone, deliberately unequal in width/height.
  S.box(26.3,29.0,18.8,21.4,36.8,49.9,(i,j,z)=>hsRubble005(false,559)(i,z),(i,j,z)=>hsRubble005(true,560)(j,z),P.stone);
  S.box(25.95,29.35,18.45,21.75,48.7,50.5,P.stone,P.stoneR,C('bdb196'));
  S.box(27.3,28.05,19.7,20.5,50.5,53.4,C('af7654'),C('815b46'),C('5c4c40'));
  // Small leaded domestic windows beside a recessed ledged shop door.
  for(const u of [1.5,6.9])hsWindow005(S,front,u,5.4,3.7,10.7,{panes:2,leaded:true,frame:C('d0c4a7'),bars:[6.1],lit:u<3});
  doorway(S,front,12.0,.8,4.0,16.9,{col:C('777f63')});
  for(let u=12.6;u<15.7;u+=.65)front.panel(u,u+.11,2,12.4,C('59654f'),.30);
  front.panel(11.4,16.6,17.5,18.3,P.stoneHi,.29);
  // Warm loaves sit behind two broad display panes; no cafe terrace or seating.
  hsWindow005(S,front,18.1,4.4,6.4,13.0,{panes:2,bars:[9.2],frame:C('e0cfa9'),display:(x,y)=>{
    if((y>1.3&&y<1.7)||(y>4.9&&y<5.3))return C('9b8059');
    const row=y<4?0:1,cy=row?6.3:2.7,dx=mod(x+.35,1.55)-.72;
    if(y>1.7&&y<7.8&&((dx/.59)**2+((y-cy)/1.04)**2)<1){
      if(Math.abs(dx)<.09&&y>cy)return [C('d9bc78'),P.warm[0]];
      return [row?C('bd985e'):C('c8a366'),P.warm[2]];
    }
    return null;
  }});
  front.panel(.6,25.4,19.7,23.0,C('71634f'),.22);
  front.panel(.6,25.4,22.65,23.3,C('a69774'),.28);
  hsText005(front,'BAKEHOUSE',5.1,20.05,.43,C('e3d4ad'));
  hsWindow005(S,side,3.0,6,3.5,9,{right:true,panes:2,bars:[5],lit:false});
  downpipe(S,29.0,26.9,23.2);
  step(S,14.4,18.9,27,29.1,2);
  lamp(S,18.3,27.6,2.6,15.7);
  // A single delivery rack and flour bin in the side yard identify production.
  S.box(29.8,31.0,8.5,11.3,0,3.4,C('8d795b'),C('6b5f49'),C('b2a381'));
  S.box(29.7,31.05,8.4,11.4,3.3,3.65,C('b6a47f'),C('8e805f'),C('c8b793'));
  bush(S,3.3,29.3,.78,2.5,false);
  return S.finish();
}

function marketHall005(spec) {
  const S=Scene(spec);ground(S,'paved');
  const iron=C('5c706f'),ironD=C('425655'),ironHi=C('93a39a');
  // Deep glazed hall behind a crosswise two-storey street range. Its ridge is
  // perpendicular to the shop roof; this is a T plan rather than another box.
  const hallSide=wallBrick(S,[43,4.5],[43,32],0,29.5,true,580);
  const hallFront=wallBrick(S,[12,32],[43,32],0,29.5,false,581);
  S.flat(12,43,4.5,32,29.5,P.brickR[0]);
  hallSide.panel(.5,27.0,6.5,27.6,ironD,.06);
  // Side arcade reveals stall partitions and goods through real glazed bays.
  for(let k=0;k<5;k++){
    const u=1.0+k*5.25;
    hsWindow005(S,hallSide,u,8,4.4,18.3,{right:true,arch:true,frame:iron,panes:2,bars:[6.5,12.8],lit:k!==1,display:(x,y)=>{
      if(y<4.5&&y>3.8)return C('8c7855');
      if(y>1.0&&y<3.5&&mod(x,1.0)<.72)return [k&1?C('9b925c'):C('b59868'),P.warm[2]];
      return null;
    }});
    hallSide.panel(u-.45,u-.05,6.5,29.2,P.brickR[1],.30);
  }
  const roofMat=(right)=>(i,j,z)=>{
    const bay=Math.floor((j-4.1)/5.4),slat=Math.floor((i-11.6)/2.2);
    if(mod(j-4.1,5.4)<.20)return right?ironD:iron;
    if(mod(i-11.6,2.2)<.09)return right?C('5d7273'):C('839791');
    const n=hash(slat,bay,583),highlight=mod(i+j*.3,9.5)<.48;
    const col=highlight?(right?C('8a9e9e'):C('a3b3ab')):(right?C('6d888e'):C('90a6a4'));
    // The glass roof reflects the night environment; coherent interior light
    // comes from the supported side/front glazing below. No isolated roof lamps.
    return n%13===0?(right?C('667f86'):C('889f9d')):col;
  };
  const a=11.6,b=43.4,m=27.5,back=4.1,near=32.4,eave=30.2,top=51.8;
  S.poly([[a,back,eave],[m,back,top],[m,near,top],[a,near,eave]],roofMat(false));
  S.poly([[m,back,top],[b,back,eave],[b,near,eave],[m,near,top]],roofMat(true));
  // Patent-glazed end screen behind the shop roof, with a stone parapet cap.
  S.poly([[a,near,eave],[b,near,eave],[m,near,top]],(i,j,z)=>{
    if(mod(i-a,3.2)<.15||mod(z-eave,5)<.15)return iron;
    return [P.glassHi,z<40?P.warm[2]:0];
  },.02);
  for(let j=4.1;j<32.5;j+=5.4){
    S.line([a,j,eave],[m,j,top],ironHi,1);
    S.line([m,j,top],[b,j,eave],iron,1);
  }
  for(const i of [16.9,22.2,32.8,38.1]){
    const z=top-Math.abs(i-m)/(m-a)*(top-eave);
    S.line([i,back,z+.12],[i,near,z+.12],i<m?ironHi:iron,1);
  }
  ridge(S,[m,back],[m,near],top,ironHi);
  S.line([a,back,eave],[a,near,eave],ironD,1);
  S.line([b,back,eave],[b,near,eave],ironD,1);
  // Low loading annex occupies one arm; the remaining yard stays functional.
  const annexF=wallBrick(S,[4.5,29],[12,29],0,17,false,584);
  wallBrick(S,[12,12],[12,29],0,17,true,585);
  S.poly([[4.2,11.8,17.6],[12.2,11.8,22.6],[12.2,29.3,22.6],[4.2,29.3,17.6]],tileRoof(false,586,'j'));
  doorway(S,annexF,1.6,.7,4.5,13.7,{double:true,col:C('6d7770')});
  // Main two-storey cross range, red brick and limestone arcaded shopfronts.
  const front=wallBrick(S,[3,41],[44,41],0,38.8,false,590);
  const side=wallBrick(S,[44,29],[44,41],0,38.8,true,591);
  S.flat(3,44,29,41,38.8,P.brick[0]);
  front.panel(0,41,0,2.5,C('6d716c'),.06);
  side.panel(0,12,0,2.5,C('565e5c'),.06);
  front.panel(0,41,21.0,22.3,P.stone,.13);
  side.panel(0,12,21.0,22.3,P.stoneR,.13);
  const storefronts=[{u:1.25,w:7.1},{u:10.3,w:7.1},{u:26.0,w:6.2},{u:33.8,w:6.0}];
  for(const [k,q]of storefronts.entries()){
    front.panel(q.u-.65,q.u+q.w+.65,3.0,20.4,P.stone,.13);
    hsWindow005(S,front,q.u,4.5,q.w,15.4,{arch:true,frame:C('53686b'),panes:3,bars:[9.0,11.9],sill:false,display:(x,y)=>{
      if(y>2.1&&y<2.7)return C('9a8761');
      if(y>.6&&y<2.1&&mod(x,1.4)<.9)return [k&1?C('a1956f'):C('af8262'),P.warm[2]];
      return null;
    }});
    front.panel(q.u,q.u+q.w,3,4.4,C('667779'),.26);
    front.panel(q.u+.25,q.u+q.w-.25,15.0,17.35,C('4c6267'),.28);
    hsText005(front,k===0?'FISH':k===1?'FRUIT':k===2?'TEA':'BREAD',q.u+.5,15.35,.22,P.stoneHi);
  }
  // Off-centre market passage and visible wrought-iron gates.
  front.panel(18.9,24.4,2,21.0,P.stone,.14);
  hsWindow005(S,front,19.5,2.2,4.3,18,{arch:true,frame:C('4b5b5a'),panes:2,bars:[13.2],sill:false,glass:C('354d53'),lit:true});
  front.panel(19.8,23.5,2.5,13.8,C('304746'),.27);
  for(let u=20.1;u<23.5;u+=.55)front.panel(u,u+.12,3,13.8,iron,.30);
  front.panel(19.7,23.6,5.4,5.8,ironHi,.31);
  for(const [k,u]of [1.6,7.6,13.6,19.6,25.6,31.6,37.1].entries()){
    hsWindow005(S,front,u,25.2,3.9,10.3,{arch:true,panes:2,bars:[4.1,7.1],lit:k===1||k===4,frame:C('ccc2a9')});
    front.panel(u-.45,u+4.35,36.1,36.8,P.stone,.16);
    // Short rails are part of the window surround, not floating balconies.
    for(let x=u;x<u+3.9;x+=.6)front.panel(x,x+.11,24.7,26.3,P.iron,.31);
  }
  for(const u of [1.5,7])hsWindow005(S,side,u,25.2,3.1,10.2,{right:true,arch:true,panes:2,lit:false});
  front.panel(0,41,37.3,38.7,P.stone,.14);
  side.panel(0,12,37.3,38.7,P.stoneR,.14);
  // Narrow tile roof crossing the transparent hall. No brick-gable lantern.
  const tile=(right)=>(i,j,z)=>{
    const row=Math.floor(j/1.0),n=hash(Math.floor((i+(row&1)*.75)/1.5),row,596);
    if(mod(j,1)<.09)return right?C('655648'):C('7a6350');
    return right?(n%13===0?C('806956'):C('78624f')):(n%13===0?C('a18a6c'):C('957b60'));
  };
  S.poly([[2.55,28.55,39],[44.45,28.55,39],[44.45,35,49.4],[2.55,35,49.4]],tile(true));
  S.poly([[2.55,35,49.4],[44.45,35,49.4],[44.45,41.45,39],[2.55,41.45,39]],tile(false));
  S.poly([[44,29,38.8],[44,41,38.8],[44,35,49.4]],(i,j,z)=>brick(true,598)(j,z),-.03);
  S.line([44.45,28.55,39],[44.45,35,49.4],P.stoneR,1);
  S.line([44.45,35,49.4],[44.45,41.45,39],P.stoneR,1);
  ridge(S,[2.55,35],[44.45,35],49.4,C('a99677'));
  for(const i of [5.1,15.3,31.5,40.6])chimney(S,i,33.2,46.8,2.1,1.8,1,600+i);
  front.panel(13.5,28.3,21.75,24.25,C('d0c1a3'),.24);
  hsText005(front,'MARKET HALL',14.15,22.0,.35,C('696452'));
  step(S,21.7,27.0,41,44.5,3);
  for(const i of [18.5,29.5])lamp(S,i,42.5,9.8);
  downpipe(S,44.35,40.6,38.9);
  // A compact produce stand is set against the loading range, not a crowd.
  S.box(5.0,9.5,6,9.8,0,3.2,C('8e7755'),C('6e604b'),C('b4a178'));
  for(const j of [6.3,8])for(const i of [5.4,7.5])S.box(i,i+1.2,j,j+1.15,3.2,4.1,C('9aa15f'),C('7c8851'),C('b4b173'));
  S.box(2.2,3.05,4.7,24.5,0,2.4,P.brick[0],P.brickR[0],P.stoneR);
  bush(S,8.0,44.9,1.15,3.5,false);
  return S.finish();
}

function postOffice005(spec) {
  const S=Scene(spec);ground(S,'paved');
  const pale=C('dbd3bd'),shade=C('b8b39f'),red=C('984638'),redD=C('773b33');
  // Single-storey sorting hall occupies the stem of the T, with a low glazed
  // lantern along its axis. It is visibly separate from the public range.
  const sortF=S.face([16.5,20],[29.4,20]),sortR=S.face([29.4,2.5],[29.4,20]);
  sortF.panel(0,12.9,0,18,hsAshlar005(false,620,false),0);
  sortR.panel(0,17.5,0,18,hsAshlar005(true,621,false),0);
  S.flat(16.5,29.4,2.5,20,18,C('7d8886'));
  S.box(16.25,29.65,2.25,20.25,17.4,18.5,P.stoneR,P.stoneD,C('929a91'));
  for(const u of [1.0,6.3,11.6])hsWindow005(S,sortR,u,4,4.0,10.8,{right:true,frame:C('737f7a'),panes:3,bars:[4.9,8.0],lit:u<10});
  const skyL=21.0,skyR=25.2,skyJ0=4.1,skyJ1=16.3;
  const skySide=S.face([skyR,skyJ0],[skyR,skyJ1]);
  skySide.panel(0,skyJ1-skyJ0,18.6,21.9,(u,z)=>mod(u,2.0)<.17?P.ironHi:[P.glass,C('c3b58c')],.05);
  S.poly([[skyL,skyJ0,21.9],[23.1,skyJ0,24.5],[23.1,skyJ1,24.5],[skyL,skyJ1,21.9]],(i,j,z)=>mod(j-skyJ0,2)<.17?P.ironHi:[C('8fa09a'),C('b6ad82')]);
  S.poly([[23.1,skyJ0,24.5],[skyR,skyJ0,21.9],[skyR,skyJ1,21.9],[23.1,skyJ1,24.5]],(i,j,z)=>mod(j-skyJ0,2)<.17?P.iron:[C('6e8486'),C('a99f77')]);
  ridge(S,[23.1,skyJ0],[23.1,skyJ1],24.5,P.lead);
  S.box(17.1,19.5,4.5,6.6,17.6,34.5,(i,j,z)=>brick(false,622)(i,z),(i,j,z)=>brick(true,623)(j,z),P.brick[0]);
  S.box(16.8,19.8,4.2,6.9,33.3,35.0,P.stone,P.stoneR,P.stoneHi);
  // Granite plinth, ashlar public office, soft rendered meeting rooms above.
  const front=S.face([3,27],[29,27]),side=S.face([29,17.5],[29,27]);
  const ashlar=hsAshlar005(false,624,false);
  front.panel(0,26,0,39.8,(u,z)=>{
    if(u>19.0&&u<24.6&&z<18.9)return null;
    if(z<2.1)return C('7b817c');
    return z<22.3?ashlar(u,z):pale;
  },0);
  side.panel(0,9.5,0,39.8,(u,z)=>z<2.1?C('646e6b'):z<22.3?hsAshlar005(true,625,false)(u,z):shade,0);
  S.flat(3,29,17.5,27,39.8,pale);
  // Covered carriage passage in the right bay, with a dark rear and low gate.
  S.wall([22,20.5],[27.6,20.5],0,18.9,C('384c4c'),0);
  S.wall([22,20.5],[22,27],0,18.9,C('8c8c7b'),.01);
  S.wall([27.6,20.5],[27.6,27],0,18.9,C('a6a38e'),.01);
  S.flat(22,27.6,20.5,29.7,.2,C('a6a79b'),0);
  for(let i=22.35;i<27.5;i+=.75)S.line([i,26.8,.5],[i,26.8,8.3],P.iron,1);
  S.line([22.3,26.8,6.4],[27.35,26.8,6.4],P.ironHi,1);
  S.line([22.3,26.8,8.3],[27.35,26.8,8.3],P.iron,1);
  // The left bay is the public entrance; glazing and overlight expose service.
  hsWindow005(S,front,1.5,3.0,5.7,15.2,{frame:C('657267'),panes:3,bars:[10.7],sill:false});
  front.panel(3.3,6.7,3.0,13.3,C('6f6252'),.28);
  front.panel(3.7,6.3,4.0,6.9,C('82705a'),.31);
  front.panel(3.7,6.3,8.0,12.0,C('5c726d'),.31);
  front.panel(6.0,6.25,7.0,7.8,P.gold,.35);
  // Bowed central service window is three real facade planes on stone base.
  const bow=[[11.75,27],[13.1,28.3],[19.1,28.3],[20.4,27]];
  const faces=[S.face(bow[0],bow[1]),S.face(bow[1],bow[2]),S.face(bow[2],bow[3])];
  for(const [k,F]of faces.entries()){
    F.panel(0,F.length,2.2,18.9,k===2?P.stoneR:P.stone,0);
    hsWindow005(S,F,.25,5.5,F.length-.5,12.5,{right:k===2,frame:k===2?C('9d9b85'):C('c4baa0'),panes:k===1?3:1,bars:[8.2],sill:false,display:(x,y)=>y>2.1&&y<2.8?C('917452'):null});
  }
  S.poly(bow.map(p=>[...p,19.1]),P.stoneHi);
  S.line([13.0,28.4,4.8],[19.2,28.4,4.8],P.stoneD,1);
  // Broad Doric pilasters and their plain entablature establish the civic front.
  for(const u of [.05,8.1,17.3,25.0]){
    front.panel(u-.15,u+1.2,2.0,3.5,P.stoneR,.25);
    front.panel(u,u+1.05,3.5,19.2,P.stoneHi,.27);
    front.panel(u+.78,u+1.05,4.2,18.5,P.stoneR,.30);
    front.panel(u-.18,u+1.23,18.0,18.6,P.stone,.31);
    front.panel(u-.3,u+1.35,19.0,20.4,P.stoneHi,.32);
  }
  front.panel(0,26,20.4,23.9,P.stone,.22);
  front.panel(0,26,23.55,24.4,P.stoneHi,.28);
  side.panel(0,9.5,20.4,24.2,P.stoneR,.13);
  hsText005(front,'POST OFFICE',3.0,20.95,.46,C('756c5c'));
  for(const [k,u]of [1.6,6.6,11.6,16.6,21.6].entries())
    hsWindow005(S,front,u,27.0,3.05,10.2,{panes:2,bars:[4.8,7.2],frame:C('e6ddc7'),lit:k===1||k===3});
  hsWindow005(S,side,3.3,27.0,3.3,10.2,{right:true,panes:2,bars:[4.8,7.2],lit:false});
  // Pitched slate held between high, stone-capped parapet gables. The post
  // office intentionally has no tower, cupola or ornamental rooftop clock.
  cornice(S,3,29,17.5,27,39.0);
  S.poly([[2.6,17.1,40.5],[29.4,17.1,40.5],[29.4,22.25,50.7],[2.6,22.25,50.7]],tileRoof(true,629,'i'));
  S.poly([[2.6,22.25,50.7],[29.4,22.25,50.7],[29.4,27.4,40.5],[2.6,27.4,40.5]],tileRoof(false,630,'i'));
  for(const [i,col,cap]of [[2.55,P.stone,P.stoneHi],[29.45,shade,P.stoneR]]){
    S.poly([[i,17.0,39.8],[i,27.5,39.8],[i,27.5,42.0],[i,22.25,52.7],[i,17.0,42.0]],col,.04);
    S.line([i,17.0,42.0],[i,22.25,52.7],cap,1);
    S.line([i,22.25,52.7],[i,27.5,42.0],cap,1);
  }
  ridge(S,[2.6,22.25],[29.4,22.25],50.7,P.lead);
  chimney(S,5.0,20.0,46.2,2.25,1.9,1,630);
  downpipe(S,29.25,26.6,39.8);
  downpipe(S,3.35,27.3,39.8);
  step(S,4.3,10.1,27,29.4,2);
  lamp(S,10.7,27.6,2.5,17.8);
  // Small freestanding octagonal pillar box with dark slot and domed cap.
  const pi=25.8,pj=30.1,r=.88,pts=[];
  for(let k=0;k<8;k++)pts.push([pi+Math.cos(k*Math.PI/4)*r,pj+Math.sin(k*Math.PI/4)*r]);
  S.box(pi-.82,pi+.82,pj-.82,pj+.82,0,.7,P.iron,P.iron,P.ironHi);
  for(let k=0;k<8;k++)S.wall(pts[k],pts[(k+1)%8],.7,7.7,k<4?redD:red,.02);
  S.poly(pts.map(p=>[...p,7.7]),C('b35b44'));
  for(let k=0;k<8;k++)S.poly([[...pts[k],7.7],[...pts[(k+1)%8],7.7],[pi,pj,8.5]],k<4?redD:red);
  const boxF=S.face([pi-.6,pj+.82],[pi+.6,pj+.82]);
  boxF.panel(.15,1.05,5.55,6.1,C('2d3b3d'),.2);
  boxF.panel(.3,.9,3.1,4.7,C('dbc9a4'),.23);
  S.box(30.0,31.1,5.3,8.5,0,2.7,C('86775d'),C('665f4d'),C('aa9671'));
  return S.finish();
}

/* GPT-005 community buildings. Concatenated inside the UKP pixel-engine IIFE.
 * Original geometry; fixed T717 elevation; no image imports or shared RNG.
 * All glass emits from the same opaque surface samples as its daytime pixels.
 */
const community005Pal={
  sand:[C('c3ab91'),C('c8b296'),C('bb9a87'),C('c1a48f')],
  sandR:[C('a08a75'),C('a89179'),C('977b6d'),C('a18673')],
  chalk:C('e4e2cd'),chalkR:C('bbbfae'),chalkHi:C('ece8d6'),
  board:C('839188'),boardR:C('5e7369'),boardSeam:C('75867b'),boardSeamR:C('52685e'),
  timber:C('b5b9a0'),timberR:C('82937f'),terra:C('d09b78'),terraR:C('ab755b'),terraHi:C('dfb08b')
};

function communityStone005(right,seed){
  const a=right?community005Pal.sandR:community005Pal.sand;
  const mortar=right?C('968673'):C('b29e89');
  return(u,z)=>{
    const row=Math.floor(z/2.3),x=u+(row&1)*2.4;
    if(z<1.8)return right?C('867b6b'):C('a3957e');
    if(mod(z,2.3)<.14||mod(x,4.8)<.10)return mortar;
    return a[(row%4===2?2:hash(Math.floor(x/4.8),row,seed)%7===0?1:0)];
  };
}

function communityWall005(S,a,b,z0,z1,mat){
  const f=S.face(a,b);f.panel(0,f.length,z0,z1,mat,0);return f;
}

// A ridge may run either along i or along j. Unlike the existing brick-only
// gable helper, this accepts the actual wall material for the exposed gable.
function communityGable005(S,i0,i1,j0,j1,z,rise,axis,seed,wallL,wallR,roofL,roofR,trim){
  const rL=roofL||tileRoof(false,seed,axis),rR=roofR||tileRoof(true,seed+1,axis);
  trim=trim||P.stoneR;
  if(axis==='j'){
    const m=(i0+i1)/2;
    S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],rL);
    S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],rR);
    S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,zz)=>wallL(i-i0,zz),.025);
    S.line([i0,j1,z],[m,j1,z+rise],trim,1);S.line([m,j1,z+rise],[i1,j1,z],trim,1);
    S.line([i1,j0,z],[i1,j1,z],P.roofEdge,1);ridge(S,[m,j0],[m,j1],z+rise,P.lead);
  }else{
    const m=(j0+j1)/2;
    S.poly([[i0,j0,z],[i1,j0,z],[i1,m,z+rise],[i0,m,z+rise]],rR);
    S.poly([[i0,m,z+rise],[i1,m,z+rise],[i1,j1,z],[i0,j1,z]],rL);
    S.poly([[i1,j0,z],[i1,j1,z],[i1,m,z+rise]],(i,j,zz)=>wallR(j-j0,zz),.025);
    S.line([i1,j0,z],[i1,m,z+rise],trim,1);S.line([i1,m,z+rise],[i1,j1,z],trim,1);
    S.line([i0,j1,z],[i1,j1,z],P.roofEdge,1);ridge(S,[i0,m],[i1,m],z+rise,P.lead);
  }
}

function communityQuoins005(F,height,right,wide){
  const col=right?P.stoneR:P.stone,dim=right?P.stoneD:C('c6b79d');
  for(let z=2;z<height;z+=3.5){
    const w=(Math.floor(z/3.5)&1)?wide:wide*.68;
    F.panel(0,w,z,z+3.15,col,.12);F.panel(F.length-w,F.length,z,z+3.15,col,.12);
    F.panel(0,w,z,z+.16,dim,.14);F.panel(F.length-w,F.length,z,z+.16,dim,.14);
  }
}

function communityYardWall005(S,i0,i1,j0,j1,height,stone){
  const L=stone?community005Pal.sand[0]:P.brick[0],R=stone?community005Pal.sandR[0]:P.brickR[0];
  S.box(i0,i1,j0,j1,0,height,L,R,P.stoneR);
  S.box(i0-.08,i1+.08,j0-.08,j1+.08,height-.3,height+.35,P.stone,P.stoneR,P.stoneHi);
}

function boardSchool005(spec){
  const S=Scene(spec);ground(S,'civic');
  // Two parallel classroom ranges and a lower cross-passage leave both H
  // recesses visible. The master's cottage is deliberately subordinate.
  const stL=communityStone005(false,501),stR=communityStone005(true,502);
  const cottageFront=communityWall005(S,[3.5,23],[12,23],0,19,stL);
  const cottageSide=communityWall005(S,[12,7],[12,23],0,19,stR);
  communityGable005(S,3.1,12.4,6.6,23.3,19.3,10,'j',503,stL,stR);
  windowOn(S,cottageFront,1.1,5,2.8,9,{panes:2,curtain:true,lit:false});
  doorway(S,cottageFront,5.1,.8,2.4,11,{col:P.wood});
  windowOn(S,cottageSide,2.4,5,3,9,{right:true,lit:false});
  chimney(S,5.5,9,28,2.7,2.2,1,504);
  const passage=communityWall005(S,[19.7,27],[29.1,27],0,20,stL);
  communityWall005(S,[29.1,16],[29.1,27],0,20,stR);
  communityGable005(S,19.5,29.4,15.8,27.2,20.2,7,'i',505,stL,stR);
  windowOn(S,passage,.7,5,2.8,11,{arch:true,panes:2,lit:false});
  windowOn(S,passage,6.2,5,2.5,11,{arch:true,panes:2});
  const west=communityWall005(S,[11.5,35],[21.5,35],0,26,stL);
  const westSide=communityWall005(S,[21.5,7],[21.5,35],0,26,stR);
  communityGable005(S,11.1,21.9,6.5,35.5,26,15.5,'j',506,stL,stR);
  communityQuoins005(west,25,false,.9);communityQuoins005(westSide,25,true,.9);
  for(const u of [1.55,5.7])windowOn(S,west,u,5.2,2.65,15.5,{arch:true,panes:1,transom:8.2});
  for(const u of [3.3,10.2,18,23.1])windowOn(S,westSide,u,6,2.8,13.5,{right:true,arch:true,lit:u<13});
  const east=communityWall005(S,[28.3,37],[43.2,37],0,28,stL);
  const eastSide=communityWall005(S,[43.2,6.5],[43.2,37],0,28,stR);
  communityGable005(S,27.9,43.6,6.1,37.4,28.2,17.5,'j',507,stL,stR);
  communityQuoins005(east,27,false,1.05);communityQuoins005(eastSide,27,true,1.0);
  for(const u of [1.95,8.45])windowOn(S,east,u,5.2,4.45,17,{arch:true,panes:2,transom:9});
  for(const u of [2.7,9.5,16.3,23.1])windowOn(S,eastSide,u,6,3.8,15.7,{right:true,panes:2,transom:8.5,lit:u!==9.5});
  east.panel(4.6,10.3,29.5,33.5,P.stone,.17);letters(east,'SCHOOL',5,30.1,.23,C('796e5c'));
  // A tiny open bellcote on the classroom apex, never a library-like tower.
  const bellFront=S.face([33.5,37.5],[38,37.5]);
  bellFront.panel(0,4.5,44.8,46.5,P.stone,.2);
  bellFront.panel(0,.85,46,54,P.stone,.2);bellFront.panel(3.65,4.5,46,54,P.stoneR,.2);
  bellFront.panel(.85,3.65,46.2,52.8,P.dark,.21);
  bellFront.panel(1.5,3,47,50.5,C('8e8060'),.24);bellFront.panel(1.1,3.4,46.7,47.8,C('ad9771'),.24);
  S.line([35.75,37.5,50.7],[35.75,37.5,53.1],P.iron,1);
  S.poly([[33.1,37.6,53.4],[38.4,37.6,53.4],[35.75,37.6,57]],P.stone,.24);
  S.line([33.1,37.6,53.4],[35.75,37.6,57],P.stoneHi,1);S.line([35.75,37.6,57],[38.4,37.6,53.4],P.stoneR,1);
  // The entrance sits in the H recess and has its own low steep porch.
  const porch=communityWall005(S,[22,33.1],[27.5,33.1],0,15.5,stL);
  communityWall005(S,[27.5,27],[27.5,33.1],0,15.5,stR);
  communityGable005(S,21.7,27.8,26.7,33.4,15.8,7.8,'j',508,stL,stR);
  doorway(S,porch,1,1.1,3.5,12.2,{double:true,col:P.greenD});
  step(S,22.8,26.9,33.15,35.1,2);
  chimney(S,40,14,39,2.4,2.3,1,509);
  downpipe(S,43.35,35.4,27);downpipe(S,21.7,32.9,25);
  S.flat(22.4,27.3,35.1,47.2,.08,C('b8b1a1'),.03,1);
  // A compact, useful schoolyard with an open gate on the entrance axis.
  communityYardWall005(S,2.3,21.7,45.1,46,4.0,true);
  communityYardWall005(S,28,45.6,45.1,46,4.0,true);
  communityYardWall005(S,45.2,46,25.4,45.1,4.0,true);
  for(const i of [21.6,28])S.box(i-.55,i+.55,44.8,46.2,0,5.6,P.stone,P.stoneR,P.stoneHi);
  railing(S,[28.7,45],[32.2,45],4.2);
  bench(S,7.5,40.4,6.2);bush(S,4.5,38.5,1.4,4.3,false);
  return S.finish();
}

function communityRoughcast005(right){
  const base=right?community005Pal.chalkR:community005Pal.chalk;
  const faint=right?C('b4b9a8'):C('dadccb');
  return(u,z)=>z<1.5?(right?C('8b9586'):C('a7ad98')):hash(Math.floor(u*1.5),Math.floor(z*1.5),550)%31===0?faint:base;
}

function communityRenderedStack005(S,i,j,z){
  S.box(i,i+3.1,j,j+2.2,z-8,z+7,community005Pal.chalk,community005Pal.chalkR,community005Pal.chalkHi);
  S.box(i-.25,i+3.35,j-.25,j+2.45,z+5.9,z+7.5,C('d4d3bd'),C('a9b09e'),P.stoneHi);
  for(const x of [.65,2.3])S.box(i+x-.3,i+x+.3,j+.75,j+1.4,z+7.4,z+10.5,C('b58a68'),C('88684f'),C('574d41'));
}

function cottageSurgery005(spec){
  const S=Scene(spec);ground(S,'garden');
  const L=communityRoughcast005(false),R=communityRoughcast005(true);
  // Two small rear returns around a service court, with the long patient wing
  // in front. Broad low slate and stout rendered stacks carry the silhouette.
  communityWall005(S,[3.4,10],[9.8,10],0,16.2,L);communityWall005(S,[9.8,2.8],[9.8,10],0,16.2,R);
  communityGable005(S,3,10.2,2.4,10.4,16.5,9,'j',551,L,R,null,null,community005Pal.chalkR);
  communityWall005(S,[20.4,10.5],[28.2,10.5],0,16,L);communityWall005(S,[28.2,2.4],[28.2,10.5],0,16,R);
  communityGable005(S,20,28.6,2,10.9,16.3,9,'j',552,L,R,null,null,community005Pal.chalkR);
  const front=communityWall005(S,[3.3,19.2],[28.4,19.2],0,18,L);
  const side=communityWall005(S,[28.4,7.8],[28.4,19.2],0,18,R);
  hipRoof(S,[[2.6,7.1],[29,7.1],[29,19.7],[2.6,19.7]],[7.2,13.4],[24.1,13.4],18.2,11.8,553);
  for(const q of [[1.5,5.6],[16.5,6.6]])windowOn(S,front,q[0],4.4,q[1],9.5,{panes:q[1]>6?4:3,transom:6.8,curtain:true,lit:q[0]<5});
  doorway(S,front,10.4,.8,3.7,12.2,{double:true,col:P.greenD});
  for(const u of [1.4,6.3])windowOn(S,side,u,4.4,3.5,9.5,{right:true,panes:2,curtain:true,lit:u>4});
  front.panel(8.1,9.8,6.5,10.6,P.greenD,.24);
  front.panel(8.4,9.5,7.1,7.5,P.gold,.26);front.panel(8.4,9.5,8.2,8.5,P.frame,.26);
  // At 2:1 projection the canopy obscures a rear-wall height of twice its
  // plan depth. Keep a real opaque lean-to, but leave 11.4 px of facade below
  // its projected front eave so the door and mullioned windows can be read.
  S.box(3.1,28.6,19.1,21.85,0,.75,P.stoneR,P.stoneD,C('b1b49e'));
  S.poly([[2.9,19.3,17.9],[28.8,19.3,17.9],[28.8,21.9,16.8],[2.9,21.9,16.8]],tileRoof(false,554,'i'));
  S.line([2.9,21.9,16.8],[28.8,21.9,16.8],P.iron,1);
  // A wider entrance bay also keeps a foreground post off the door's sightline.
  for(const i of [3.7,8.5,13.1,20,24,28]){
    S.box(i-.2,i+.2,21.5,21.9,.75,16.7,C('b8c2a8'),C('8b9f8a'),C('c9cfb7'));
    S.line([i,21.7,14.6],[i+1.2,21.7,16.7],C('8eaa91'),1);
  }
  communityRenderedStack005(S,6.6,10,28.4);communityRenderedStack005(S,22.8,9.1,28.5);
  downpipe(S,28.65,18.9,17.5);downpipe(S,3.2,21.9,16.7);
  step(S,13.7,17.9,21.85,23.15,1);
  S.flat(13.9,17.7,22.6,31.3,.08,C('bdb6a4'),.05,1);
  // Two quiet planted beds leave the entry path clear. This is a small clinic,
  // without hospital-tower iconography or an oversized medical rooftop sign.
  S.flat(3.4,12.4,25.1,29.6,.08,C('7b8d66'),.05,1);
  S.flat(19.2,28.5,25.1,29.6,.08,C('7b8d66'),.05,1);
  for(const i of [5,9.4,21,25.8])bush(S,i,28.1,1.15,3.7,i===9.4);
  communityYardWall005(S,2.7,12.9,30,30.6,2.4,true);
  communityYardWall005(S,18.5,29.3,30,30.6,2.4,true);
  bench(S,20.6,19.9,4.6);
  return S.finish();
}

function communityPoolRoof005(S,i0,i1,j0,j1,z,rise,seed){
  const m=(i0+i1)/2,half=(i1-i0)/2;
  communityGable005(S,i0,i1,j0,j1,z,rise,'j',seed,brick(false,seed),brick(true,seed));
  // Narrow raised rooflight strips: the pool halls remain opaque slate roofs,
  // clearly different from a glass market or a conservatory.
  for(const side of [-1,1]){
    const ia=m+side*.65,ib=m+side*3.0,za=z+rise*(1-Math.abs(ia-m)/half)+.16,zb=z+rise*(1-Math.abs(ib-m)/half)+.16;
    S.poly([[ia,j0+2.2,za],[ib,j0+2.2,zb],[ib,j1-2.1,zb],[ia,j1-2.1,za]],(i,j)=>{
      if(mod(j-j0,3.5)<.19)return C('a2aaa3');
      return [side<0?C('8bafb1'):C('678b95'),P.warm[0]];
    },.14);
    S.line([ia,j0+2.2,za],[ia,j1-2.1,za],P.lead,1);S.line([ib,j0+2.2,zb],[ib,j1-2.1,zb],P.lead,1);
    S.line([ia,j0+2.2,za],[ib,j0+2.2,zb],P.lead,1);S.line([ia,j1-2.1,za],[ib,j1-2.1,zb],P.lead,1);
  }
}

function communityBathTurret005(S,ci,cj){
  const rad=2.7,z0=28,z1=39.5,pts=[];
  for(let k=0;k<8;k++){const a=(k+.5)*Math.PI/4;pts.push([ci+Math.cos(a)*rad,cj+Math.sin(a)*rad]);}
  for(let k=0;k<8;k++){
    const a=pts[k],b=pts[(k+1)%8],right=(a[0]+b[0])/2>ci;
    S.wall(a,b,z0,z1,right?community005Pal.terraR:community005Pal.terra);
    S.wall(a,b,30.7,31.6,right?P.stoneR:P.stone,.1);
    const f=S.face(a,b);
    if(k<4){f.panel(.38,f.length-.38,33.4,37.8,P.dark,.1);for(let z=34;z<37.8;z+=1)f.panel(.4,f.length-.4,z,z+.22,right?C('907b64'):C('b3a083'),.15);}
  }
  S.poly(pts.map(p=>[p[0],p[1],z1]),P.stoneR);
  const rings=[[rad+.25,39.7],[rad+.4,40.4],[rad-.2,41.3],[rad-.35,43.2],[rad-1.2,45.1],[.35,46.1]];
  for(let n=0;n<rings.length-1;n++)for(let k=0;k<8;k++){
    const a=(k+.5)*Math.PI/4,b=(k+1.5)*Math.PI/4,r=rings[n],t=rings[n+1];
    const col=k<2||k>5?(n%2?C('a88b71'):C('b69b7b')):(n%2?C('c0a17c'):C('d2b38a'));
    S.poly([[ci+Math.cos(a)*r[0],cj+Math.sin(a)*r[0],r[1]],[ci+Math.cos(b)*r[0],cj+Math.sin(b)*r[0],r[1]],[ci+Math.cos(b)*t[0],cj+Math.sin(b)*t[0],t[1]],[ci+Math.cos(a)*t[0],cj+Math.sin(a)*t[0],t[1]]],col);
  }
  S.line([ci,cj,45.8],[ci,cj,48],P.stoneR,1);
}

function communityBathChimney005(S,ci,cj){
  const rings=[[2.4,1],[2.4,13],[1.8,57],[2.2,58],[2.2,61],[1.9,62]],n=10;
  for(let t=0;t<rings.length-1;t++)for(let k=0;k<n;k++){
    const a=k*Math.PI*2/n,b=(k+1)*Math.PI*2/n,r=rings[t],q=rings[t+1];
    const right=Math.cos((a+b)/2)>.25,mat=brick(right,590+k);
    S.poly([[ci+Math.cos(a)*r[0],cj+Math.sin(a)*r[0],r[1]],[ci+Math.cos(b)*r[0],cj+Math.sin(b)*r[0],r[1]],[ci+Math.cos(b)*q[0],cj+Math.sin(b)*q[0],q[1]],[ci+Math.cos(a)*q[0],cj+Math.sin(a)*q[0],q[1]]],(i,j,z)=>mat((i+j)*.7,z));
  }
  const top=[];for(let k=0;k<n;k++){const a=k*Math.PI*2/n;top.push([ci+Math.cos(a)*1.9,cj+Math.sin(a)*1.9,62]);}S.poly(top,C('4b403a'));
}

function municipalBaths005(spec){
  const S=Scene(spec);ground(S,'civic');
  // Roof-lit long pools stand behind the compact entrance/slipper-bath range.
  // Water stays indoors: no outdoor basin is used as a shorthand for baths.
  for(const b of [[5.3,21.5,581],[23.2,38.6,582]]){
    const i0=b[0],i1=b[1];
    const f=wallBrick(S,[i0,32],[i1,32],0,24,false,b[2]);
    const r=wallBrick(S,[i1,4.5],[i1,32],0,24,true,b[2]+1);
    communityPoolRoof005(S,i0-.35,i1+.35,4.1,32.3,24.3,12,b[2]);
    for(const u of [3,9,15,21])windowOn(S,r,u,10,3,9,{right:true,arch:true,lit:u===9||u===21});
    f.panel(1,i1-i0-1,21.4,22.3,P.stone,.1);
  }
  const boiler=wallBrick(S,[39,25],[46,25],0,15.5,false,583);
  const boilerSide=wallBrick(S,[46,6],[46,25],0,15.5,true,584);
  communityGable005(S,38.8,46.2,5.8,25.2,15.7,5.5,'j',585,brick(false,585),brick(true,585));
  doorway(S,boiler,1.9,.5,3.1,10.8,{col:P.iron});windowOn(S,boilerSide,11,5,3.7,7.5,{right:true,lit:false});
  communityBathChimney005(S,42.4,8.3);
  const F=wallBrick(S,[4.7,41.3],[43.7,41.3],0,30,false,586);
  const R=wallBrick(S,[43.7,31.2],[43.7,41.3],0,30,true,587);
  S.flat(4.7,43.7,31.2,41.3,30,P.brick[0]);
  hipRoof(S,[[4.25,30.85],[44.05,30.85],[44.05,41.6],[4.25,41.6]],[10.3,35.3],[37.8,35.3],30.2,6.9,588);
  // Terracotta dressings are local masonry, never a screen-space decoration.
  for(const z of [2.4,15.5,27.7]){
    F.panel(0,39,z,z+1.05,community005Pal.terra,.16);
    R.panel(0,R.length,z,z+1.05,community005Pal.terraR,.16);
  }
  for(const u of [.4,9.6,17,22,29.4,37.3]){
    F.panel(u,u+1.25,2.8,28.5,community005Pal.terra,.15);
    for(const z of [5.5,11,20,25])F.panel(u-.14,u+1.4,z,z+.65,community005Pal.terraHi,.18);
  }
  for(const u of [2.4,11.8,24.1,32.6])windowOn(S,F,u,5.1,3.6,8.4,{arch:true,panes:2,lit:u<16});
  for(const u of [2.4,11.8,24.1,32.6])windowOn(S,F,u,18.8,3.6,7.6,{arch:true,panes:2,transom:4.2,lit:u>22});
  doorway(S,F,17.5,.8,4.1,13.9,{double:true,col:P.greenD});
  F.panel(16.7,22.4,15.5,18.4,community005Pal.terraHi,.25);
  letters(F,'BATHS',17.45,16.05,.22,C('755c49'));
  // The central oriel projects a little, under a low shaped Flemish gable.
  S.box(21.6,27,41.3,42.8,19.2,28.9,community005Pal.terra,community005Pal.terraR,community005Pal.terraHi);
  const O=S.face([21.6,42.8],[27,42.8]);windowOn(S,O,.55,20.2,4.3,7.6,{panes:3,arch:true,transom:4.4});
  S.box(21.3,27.3,41,43,28.4,29.5,community005Pal.terraHi,community005Pal.terraR,P.stone);
  const G=S.face([20.4,41.7],[28.1,41.7]);
  G.panel(0,7.7,30,32,community005Pal.terra,.23);G.panel(.9,6.8,32,34.8,community005Pal.terra,.23);G.panel(2,5.7,34.8,36.4,community005Pal.terra,.23);
  S.poly([[22.15,41.7,36.3],[26.35,41.7,36.3],[24.25,41.7,39.2]],community005Pal.terraHi,.25);
  G.panel(2.5,5.2,32.7,34.6,C('af7d5c'),.27);
  for(const p of [[11.3,39.9],[36.6,39.9]])communityBathTurret005(S,p[0],p[1]);
  for(const u of [1.6,6.3])windowOn(S,R,u,6,2.6,9.5,{right:true,arch:true,lit:u<3});
  downpipe(S,43.85,40.3,29.7);downpipe(S,5,40.9,29.7);
  step(S,21.6,27,42.9,45.1,2);
  S.flat(21.8,26.8,44.9,47.3,.1,C('bdb6a5'),.05,1);
  lamp(S,19.9,44.3,8.5);lamp(S,28.5,44.3,8.5);
  return S.finish();
}

function communityWeatherboard005(right){
  return(u,z)=>{
    if(z<1.7)return right?C('636d5c'):C('8b917a');
    if(mod(z,1.55)<.18)return right?community005Pal.boardSeamR:community005Pal.boardSeam;
    return right?community005Pal.boardR:community005Pal.board;
  };
}

function communityIronRoof005(right,axis){
  const base=right?C('655252'):C('7f6460'),rib=right?C('745d59'):C('94736b'),seam=right?C('554a4a'):C('6e5956');
  return(i,j,z)=>{
    const u=axis==='j'?j:i,v=axis==='j'?i:j;
    if(mod(u,1.1)<.17)return rib;
    if(mod(v,6.5)<.14)return seam;
    return base;
  };
}

function villageHall005(spec){
  const S=Scene(spec);ground(S,'garden');
  const L=communityWeatherboard005(false),R=communityWeatherboard005(true);
  // A tall, steep-roofed timber hall and a separate lower perpendicular
  // schoolroom, with no upper storey or galleried-inn balcony.
  const front=communityWall005(S,[3.2,22.2],[24.5,22.2],0,19.5,L);
  const end=communityWall005(S,[24.5,8.5],[24.5,22.2],0,19.5,R);
  communityGable005(S,2.7,25,8.1,22.6,19.8,16.5,'i',601,L,R,communityIronRoof005(false,'i'),communityIronRoof005(true,'i'),community005Pal.timber);
  for(const q of [[1.5,3.8],[6,3.8],[15.8,3.8]])windowOn(S,front,q[0],4.7,q[1],11.6,{panes:2,transom:7.7,lit:q[0]!==6});
  doorway(S,front,10.9,.9,3.8,13.8,{double:true,col:C('425f50')});
  // A three-light high gable window belongs to the lit roofspace.
  windowOn(S,end,4.6,22,4.4,6.5,{right:true,panes:3,transom:4.3,lit:false});
  S.line([24.9,15.3,36.3],[24.9,15.3,39],community005Pal.timber,1);
  S.line([2.8,15.3,36.3],[2.8,15.3,38.3],community005Pal.timber,1);
  const wing=communityWall005(S,[24.4,23],[30,23],0,14.2,L);
  const wingSide=communityWall005(S,[30,5.5],[30,23],0,14.2,R);
  communityGable005(S,24.1,30.3,5.2,23.3,14.5,9,'j',602,L,R,communityIronRoof005(false,'j'),communityIronRoof005(true,'j'),community005Pal.timberR);
  windowOn(S,wing,1,3.6,3.5,8.3,{panes:2,lit:false});
  for(const u of [2,9.6])windowOn(S,wingSide,u,4,3.3,7.9,{right:true,panes:2,lit:u>5});
  // Continuous veranda, five bays of timber posts and restrained brackets.
  // The shallow opaque canopy joins beneath the main eave while its raised
  // front edge leaves the actual back-wall entry and windows visible.
  S.box(2.7,25.2,22,25.0,0,.8,C('9e9f8b'),C('777f6e'),C('b7b6a0'));
  S.poly([[2.4,22.35,19.2],[25.3,22.35,19.2],[25.3,25.1,18.1],[2.4,25.1,18.1]],communityIronRoof005(false,'i'));
  S.line([2.4,25.1,18.1],[25.3,25.1,18.1],community005Pal.timberR,1);
  for(const i of [3.1,7.4,11.7,16,20.3,24.6]){
    S.box(i-.32,i+.32,24.65,25.05,.8,1.7,P.stone,P.stoneR,P.stoneHi);
    S.box(i-.21,i+.21,24.7,25,1.7,18.0,community005Pal.timber,community005Pal.timberR,community005Pal.timber);
    if(i<24){S.line([i,24.85,15.6],[i+1.25,24.85,17.9],community005Pal.timber,1);S.line([i+3.1,24.85,17.9],[i+4.3,24.85,15.6],community005Pal.timberR,1);}
  }
  downpipe(S,25.1,25.05,18.0);downpipe(S,30.2,21.8,14);
  step(S,13.6,18.4,25.05,26.4,1);S.flat(14,18,26.1,31.25,.08,C('bbb3a0'),.04,1);
  // The noticeboard is attached to the veranda rather than scattered signage.
  const notice=S.face([5.1,25.1],[8.3,25.1]);notice.panel(0,3.2,3.8,9.2,C('536650'),.12);
  notice.panel(.25,2.95,4.15,8.9,C('bcbaa1'),.14);notice.panel(.55,1.35,5.7,8.2,C('d8d3b8'),.18);notice.panel(1.75,2.7,4.7,7.4,C('c7b496'),.18);
  for(const z of [6.4,7.3])notice.panel(.7,1.2,z,z+.18,C('8e927a'),.2);
  front.panel(10.6,15.1,15.5,17.8,C('526d59'),.26);letters(front,'HALL',11.2,15.9,.22,P.frame);
  bush(S,5.5,29.6,1.1,3.3,false);bush(S,25.5,29.5,1.2,3.7,false);
  return S.finish();
}

  const builders={UKH01:coOp005,UKH02:bakehouse005,UKH03:marketHall005,UKH04:boardSchool005,UKH05:cottageSurgery005,UKH06:postOffice005,UKH07:municipalBaths005,UKH08:villageHall005};
  function build(id){const s=specs.find(q=>q.id===id);if(!s)throw Error('Unknown high-street building: '+id);return builders[id](s);}
  root.HighStreetArchitecture005=Object.freeze({version:'UKH-art-r2',specs,build,buildAll:()=>specs.map(s=>builders[s.id](s))});
})(window);
