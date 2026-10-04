/* GPT-006 British residential streets, UKR01–16.
 * Canonical native art registered by installResidentialArt006 in the playable game.
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
  const specs=Object.freeze([{"nm": "喬治式連續街屋", "en": "Georgian continuous row", "sz": 2, "w": 136, "h": 160, "ax": 68, "ay": 158, "id": "UKR01"}, {"nm": "喬治式轉角街屋", "en": "Georgian L-corner terrace", "sz": 2, "w": 136, "h": 165, "ax": 68, "ay": 163, "id": "UKR02"}, {"nm": "喬治式端景宅", "en": "Georgian end pavilion", "sz": 2, "w": 136, "h": 160, "ax": 68, "ay": 158, "id": "UKR03"}, {"nm": "喬治式下沉前庭宅", "en": "Georgian raised-basement terrace", "sz": 2, "w": 136, "h": 168, "ax": 68, "ay": 166, "id": "UKR04"}, {"nm": "維多利亞雙山牆半獨立屋", "en": "Victorian cross-gabled semi pair", "sz": 2, "w": 136, "h": 155, "ax": 68, "ay": 153, "id": "UKR05"}, {"nm": "維多利亞凸窗別墅", "en": "Victorian canted-bay villa", "sz": 2, "w": 136, "h": 160, "ax": 68, "ay": 158, "id": "UKR06"}, {"nm": "維多利亞花園雙門面宅", "en": "Victorian double-fronted garden villa", "sz": 2, "w": 136, "h": 150, "ax": 68, "ay": 148, "id": "UKR07"}, {"nm": "維多利亞哥德翼樓宅", "en": "Victorian Gothic cross-wing villa", "sz": 2, "w": 136, "h": 168, "ax": 68, "ay": 166, "id": "UKR08"}, {"nm": "英格蘭石砌雙農舍", "en": "English stone cottage pair", "sz": 2, "w": 136, "h": 135, "ax": 68, "ay": 133, "id": "UKR09"}, {"nm": "英式長披簷磚農舍", "en": "English brick catslide cottage", "sz": 2, "w": 136, "h": 135, "ax": 68, "ay": 133, "id": "UKR10"}, {"nm": "英式圍院農舍", "en": "English courtyard cottages", "sz": 2, "w": 136, "h": 140, "ax": 68, "ay": 138, "id": "UKR11"}, {"nm": "英式茅草長屋", "en": "English thatched long cottage", "sz": 2, "w": 136, "h": 135, "ax": 68, "ay": 133, "id": "UKR12"}, {"nm": "英國工人窄面連排屋", "en": "British narrow workers row", "sz": 2, "w": 136, "h": 145, "ax": 68, "ay": 143, "id": "UKR13"}, {"nm": "英國工人後院連排屋", "en": "British through-terrace with yards", "sz": 2, "w": 136, "h": 145, "ax": 68, "ay": 143, "id": "UKR14"}, {"nm": "英國工人背靠背院落", "en": "British back-to-back court", "sz": 2, "w": 136, "h": 145, "ax": 68, "ay": 143, "id": "UKR15"}, {"nm": "英國工人街角店宅", "en": "British corner shop and homes", "sz": 2, "w": 136, "h": 152, "ax": 68, "ay": 150, "id": "UKR16"}].map(Object.freeze));

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



// GPT-006 UKR01–08. Original residential massing, not variants of legacy sprites.
// This fragment is concatenated inside the native residential-art006 IIFE.
// Common street datum: Georgian facade j=24, eaves z=56, pavement j=29.6–31.4.

function gvStock006(right,seed) {
  const pal=right?[C('84765b'),C('8b7b5f'),C('7f7057')]:[C('b6a17e'),C('baa582'),C('ae9976')];
  return (u,z)=>{
    const row=Math.floor(z/1.65),n=hash(Math.floor((u+(row&1)*1.1)/2.2),row,seed);
    if(z<2.4)return right?P.stoneD:P.stoneR;
    if(mod(z,1.65)<.15||mod(u+(row&1)*1.1,2.2)<.09)return right?C('7b705b'):C('a18e71');
    if(z<5&&n%5===0)return pal[2];
    return pal[n%3];
  };
}

function gvWall006(S,a,b,h,right,seed,stone) {
  const F=S.face(a,b);
  F.panel(0,F.length,0,h,stone?gvStock006(right,seed):brick(right,seed,h),0);
  return F;
}

function gvBand006(F,z,h,right) {
  F.panel(0,F.length,z,z+h,right?P.stoneR:P.stone,.10);
  F.panel(0,F.length,z+h-.25,z+h+.2,right?P.stoneD:P.stoneHi,.14);
}

function gvSash006(S,F,u,z,w,h,opt) {
  opt=opt||{};
  const right=!!opt.right,frame=right?P.frameR:P.frame,border=.33;
  F.panel(u-.35,u+w+.35,z-.65,z+.2,right?P.stoneD:P.stoneR,.14);
  F.panel(u-.42,u+w+.42,z-.18,z+.48,right?P.stoneR:P.stoneHi,.24);
  F.panel(u-.24,u+w+.24,z+h-.1,z+h+.9,right?P.stoneR:P.stone,.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    if(x<border||x>w-border||y<.5||y>h-.5||Math.abs(y-h*.49)<.32)return frame;
    const panes=opt.panes||2;
    for(let n=1;n<panes;n++)if(Math.abs(x-w*n/panes)<.16)return frame;
    if(opt.six&&(Math.abs(y-h*.25)<.17||Math.abs(y-h*.74)<.17))return frame;
    if(opt.curtain&&y<h*.88&&(x<w*.22||x>w*.84))return right?C('ac9e87'):C('d2c0a1');
    if(opt.leaded&&mod(x*1.25+y*.45,2.4)<.13)return right?P.iron:P.ironHi;
    return [y>h*.72?(right?P.glass:P.glassHi):(right?P.glassR:P.glass),opt.lit?P.warm[opt.warm||0]:0];
  },.2);
}

function gvDoor006(S,F,u,z,w,h,opt) {
  opt=opt||{};
  const right=!!opt.right,top=x=>h-2.8+2.8*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
  F.panel(u-.55,u+w+.55,z,z+h+.65,(x,y)=>{
    const tx=Math.max(0,Math.min(w,x-.55));
    return y>top(tx)+.6?null:(right?P.stoneR:P.stoneHi);
  },.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    if(y>top(x))return null;
    if(x<.3||x>w-.3||y>top(x)-.4)return right?P.wood:P.frame;
    if(y>h-3.4){
      if(Math.abs(y-(h-3.15))<.18||Math.abs(x-w/2)<.13||Math.abs((x-w/2)*1.3-y+h-3.15)<.14||Math.abs((x-w/2)*1.3+y-h+3.15)<.14)return P.frameR;
      return [right?P.glassR:P.glass,opt.lit?P.warm[1]:0];
    }
    if(y<.7)return P.iron;
    if(x>.6&&x<w-.6&&((y>2&&y<5.8)||(y>7.1&&y<h-4.4)))return opt.col===C('6a4b44')?C('80584c'):P.greenHi;
    if(x>w*.7&&x<w*.87&&y>6.3&&y<7)return P.gold;
    return opt.col||P.green;
  },.25);
  F.panel(u-.65,u+w+.65,z+h+.3,z+h+1.05,right?P.stoneR:P.stoneHi,.18);
}

function gvFrontRoof006(S,i0,i1,j0,j1,z,rise,seed,stock,ornate) {
  // Ridge runs into the plot, so the street sees an actual triangular gable.
  const m=(i0+i1)/2;
  S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],tileRoof(false,seed,'j'));
  S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],tileRoof(true,seed+1,'j'));
  S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,zz)=>(stock?gvStock006(false,seed+2):brick(false,seed+2))(i,zz),.01);
  const trim=ornate?P.frame:P.stone;
  S.line([i0,j1+.04,z],[m,j1+.04,z+rise],trim,1);
  S.line([m,j1+.04,z+rise],[i1,j1+.04,z],trim,1);
  if(ornate){
    for(let s=1;s<7;s++){
      const t=s/7,x=i0+(m-i0)*t,zz=z+rise*t-1.1;
      S.line([x,j1+.08,zz],[x,j1+.08,zz-1.2],P.frameR,1);
      S.line([i1-(m-i0)*t,j1+.08,zz],[i1-(m-i0)*t,j1+.08,zz-1.2],P.frameR,1);
    }
    S.line([m,j1+.08,z+rise-2],[m,j1+.08,z+rise+2.6],P.wood,1);
  }
  ridge(S,[m,j0],[m,j1],z+rise,P.lead);
  S.line([i1,j0,z],[i1,j1,z],P.iron,1);
  return S.face([i0,j1],[i1,j1]);
}

function gvGarden006(S,paths) {
  S.flat(.6,31.4,.6,31.4,0,(i,j)=>{
    const n=hash(Math.floor(i/2.2),Math.floor(j/2.2),630);
    if(j>30.2||(paths||[]).some(p=>i>p[0]&&i<p[1]&&j>p[2]))return P.path[n%4];
    return P.grass[n%3];
  },0,1);
  S.line([.6,31.35,0],[31.35,31.35,0],P.stoneR,1);
  S.line([31.35,.6,0],[31.35,31.35,0],P.stoneD,1);
}

function gvFence006(S,a,b,gate) {
  const F=S.face(a,b),L=F.length,segs=gate?[[0,gate[0]],[gate[1],L]]:[[0,L]];
  for(const [u,v]of segs){
    if(v<=u)continue;
    S.wall(F.point(u),F.point(v),0,1.4,P.brickR[1]);
    for(let x=u+.25;x<v;x+=1.05){const p=F.point(x);S.line([p[0],p[1],1.4],[p[0],p[1],4.9],P.iron,1);}
    for(const z of [2.2,4.2]){const p=F.point(u),q=F.point(v);S.line([p[0],p[1],z],[q[0],q[1],z],P.iron,1);}
  }
  for(const u of gate?[0,gate[0],gate[1],L]:[0,L]){
    const p=F.point(u),r=.35;
    S.box(p[0]-r,p[0]+r,p[1]-r,p[1]+r,0,5.0,P.brick[1],P.brickR[0],P.stone);
    S.box(p[0]-r-.1,p[0]+r+.1,p[1]-r-.1,p[1]+r+.1,4.7,5.3,P.stone,P.stoneR,P.stoneHi);
  }
}

function gvGeorgianFront006(S,F,start,width,seed,raised) {
  const base=raised?8.7:1.3,doorU=start+width-4.8;
  gvDoor006(S,F,doorU,base,3.2,raised?14.2:16.2,{lit:seed%3===0,col:seed%2?P.green:C('6a4b44')});
  gvSash006(S,F,start+2.1,base+3.2,3.7,raised?10:12.2,{six:true,lit:seed%2===0,curtain:true});
  for(const [row,z,h]of [[0,26,12.7],[1,44,8.6]]){
    gvSash006(S,F,start+2.1,z,3.7,h,{six:true,lit:(seed+row)%3===0});
    gvSash006(S,F,doorU-.25,z,3.7,h,{six:true,lit:(seed+row)%4===0,curtain:row===0});
  }
  F.panel(start+.35,start+.73,2,55.4,P.stoneR,.06);
  for(const z of [raised?24.1:22.5,41.2])F.panel(start+.5,start+width-.1,z,z+.55,P.stone,.09);
  if(raised)gvSash006(S,F,start+2.15,1.2,3.6,5.2,{panes:2,lit:false});
}

function gvGeorgianCornice006(S,i0,i1,j0,j1,z) {
  S.box(i0,i1,j0,j1,z-1.25,z-.35,P.stoneR,P.stoneD,P.stone);
  S.box(i0-.17,i1+.17,j0-.17,j1+.24,z-.35,z+.6,P.stone,P.stoneR,P.stoneHi);
  S.line([i0,j1+.25,z-.7],[i1,j1+.25,z-.7],P.stoneHi,1);
}

function georgianRow006(spec) {
  const S=Scene(spec);ground(S,'paved');
  const F=gvWall006(S,[.8,24],[31.2,24],56,false,641,true),R=gvWall006(S,[31.2,9.8],[31.2,24],56,true,642,true);
  S.flat(.8,31.2,9.8,24,56,P.stoneR);
  gvGeorgianFront006(S,F,0,15.2,643,false);gvGeorgianFront006(S,F,15.2,15.2,644,false);
  gvBand006(R,22.5,.6,true);gvBand006(R,41.2,.55,true);
  // Plain party-end brick is intentional: the next module continues the row.
  R.panel(3.0,5.2,28,37,C('80745e'),.01);
  gvGeorgianCornice006(S,.8,31.2,9.8,24,56);
  gableRoof(S,.6,31.4,9.5,24.3,57,11.6,645);
  for(const i of [.95,15.3,29.1])chimney(S,i,15.9,65.0,1.9,2.5,2,646+Math.floor(i));
  for(const i of [15.75,30.9])downpipe(S,i,24.32,55,2);
  for(const i of [10.75,25.95]){
    step(S,i,i+3.9,24,26,2);
    S.flat(i-.2,i+4.1,25.4,31.3,.02,P.path[2],.03,1);
  }
  railing(S,[.8,29.5],[15.8,29.5],5.3,[9.6,14.2]);
  railing(S,[16,29.5],[31.2,29.5],5.3,[9.7,14.3]);
  railing(S,[15.8,24.6],[15.8,29.5],5.3);
  for(const i of [3.4,19.1])bush(S,i,26.6,.78,2.1,false);
  return S.finish();
}

function georgianCorner006(spec) {
  const S=Scene(spec);ground(S,'paved');
  // The return wing reaches the back plot edge: a genuine L around an open yard.
  const side=gvWall006(S,[25.4,.8],[25.4,24],56,true,651,true);
  const front=gvWall006(S,[.8,24],[25.4,24],56,false,652,true);
  gvWall006(S,[.8,10.8],[18.2,10.8],56,false,653,true);
  S.flat(.8,25.4,10.8,24,56,P.stoneR);S.flat(12.4,25.4,.8,17.4,56,P.stoneR);
  // Inner wing face remains visible above the lower courtyard service lean-to.
  const yard=gvWall006(S,[12.4,10.8],[18.2,10.8],56,false,654,true);
  for(const z of [27,44])gvSash006(S,yard,1,z,3.3,z<40?11:8,{six:true,lit:false});
  gvGeorgianFront006(S,front,0,14,655,false);
  for(const z of [4.5,26,44])for(const u of [15.1,20.2])gvSash006(S,front,u,z,3.1,z>40?8.6:12.7,{six:true,lit:(u<17&&z<30)});
  gvBand006(front,22.5,.6,false);gvBand006(front,41.2,.6,false);
  for(const z of [5,26,44])for(const u of [2.2,9.2,16.3])gvSash006(S,side,u,z,3.2,z>40?8.5:12.3,{right:true,six:true,lit:z===26&&u>15});
  // Return entrance and its side-facing footpath make both streets usable.
  gvDoor006(S,side,9.05,1.3,3.5,16.2,{right:true,lit:false});
  gvBand006(side,22.5,.6,true);gvBand006(side,41.2,.6,true);
  gvGeorgianCornice006(S,.8,25.4,10.8,24,56);
  gvGeorgianCornice006(S,12.4,25.4,.8,17.4,56);
  gableRoof(S,.6,25.65,10.5,24.3,57,11.6,656);
  gvFrontRoof006(S,12.15,25.65,.6,17.4,57,11.6,657,true,false);
  chimney(S,1.1,15.8,65,2.0,2.4,2,658);chimney(S,19,3.1,65,2.2,2.4,2,659);
  // Brick rear washhouse below the long return, not an enclosed extra block.
  const service=gvWall006(S,[2.2,8.3],[10.8,8.3],13.8,false,660,true);
  gvWall006(S,[10.8,2.1],[10.8,8.3],13.8,true,661,true);
  S.poly([[2,1.9,19],[11,1.9,19],[11,8.6,14],[2,8.6,14]],tileRoof(false,662,'i'));
  doorway(S,service,1.2,.5,2.5,10.7,{col:C('667061')});
  downpipe(S,25.65,23.8,56);downpipe(S,14.3,24.3,56);
  step(S,10,14.1,24,26,2);
  S.box(25.4,27.8,9.4,13.8,0,.65,P.stoneR,P.stoneD,P.path[2]);
  S.box(25.4,26.5,9.4,13.8,.65,1.3,P.stoneR,P.stoneD,P.path[2]);
  railing(S,[.8,29.5],[25.4,29.5],5.3,[8.9,13.7]);
  railing(S,[29.8,.8],[29.8,29.5],5.3,[8.1,13.4]);
  bush(S,20.8,27,.9,2.5,false);
  return S.finish();
}

function georgianEnd006(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Tall terminal pavilion plus a lower rear service wing, joined to row at left.
  const rear=gvWall006(S,[31.2,2.2],[31.2,13.5],39,true,671,true);
  gvWall006(S,[21.5,13.5],[31.2,13.5],39,false,672,true);
  for(const z of [6,23])for(const u of [2,7.0])gvSash006(S,rear,u,z,2.8,10,{right:true,six:true,lit:u<3&&z<10});
  gableRoof(S,21.25,31.4,1.95,13.75,40,10,673);
  chimney(S,27.5,6.3,47,2.4,2.1,2,674);
  const F=gvWall006(S,[.8,24],[17.3,24],56,false,675,true);
  S.flat(.8,17.3,10.0,24,56,P.stoneR);
  gvGeorgianFront006(S,F,0,16.5,676,false);
  gvGeorgianCornice006(S,.8,17.3,10,24,56);
  gableRoof(S,.6,18,9.7,24.3,57,11.6,677);
  const PF=gvWall006(S,[17.3,25.4],[31.2,25.4],60,false,678,true),PR=gvWall006(S,[31.2,10],[31.2,25.4],60,true,679,true);
  S.flat(17.3,31.2,10,25.4,60,P.stoneR);
  for(const z of [6,27,46])for(const u of [2.25,8.2])gvSash006(S,PF,u,z,3.4,z>40?9:12.4,{six:true,lit:u<3&&z<30});
  for(const z of [6,27,46])for(const u of [2.4,9.4])gvSash006(S,PR,u,z,3.4,z>40?9:12.4,{right:true,six:true,lit:z===27&&u>8});
  for(const FF of [PF,PR])for(const z of [22.5,41.2])gvBand006(FF,z,.8,FF===PR);
  // Rusticated pavilion corners, restrained rather than a stucco terrace copy.
  for(let z=3;z<59;z+=3.4)for(const u of [0,12.9])PF.panel(u,u+(z%6.8<3.4?.8:1.05),z,z+2.7,P.stone,.11);
  gvGeorgianCornice006(S,17.3,31.2,10,25.4,60);
  hipRoof(S,[[17.1,9.75],[31.4,9.75],[31.4,25.7],[17.1,25.7]],[21.8,17.7],[26.8,17.7],61,11.6,681);
  chimney(S,18.5,15.8,67.5,2.2,2.4,2,682);
  downpipe(S,31.05,25.67,59);downpipe(S,16.9,24.25,56);
  step(S,12,16.1,24,26,2);
  railing(S,[.8,29.5],[31.2,29.5],5.3,[10.9,15.7]);
  railing(S,[31.2,25.8],[31.2,29.5],5.3);
  bush(S,21,27.4,.85,2.6,false);bush(S,28,27.4,.7,2.3,false);
  return S.finish();
}

function georgianArea006(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Raised principal floor above an exposed basement, with deep open areas.
  const F=gvWall006(S,[.8,24],[31.2,24],56,false,691,true),R=gvWall006(S,[31.2,8.8],[31.2,24],56,true,692,true);
  S.flat(.8,31.2,8.8,24,56,P.stoneR);
  gvGeorgianFront006(S,F,0,15.2,693,true);gvGeorgianFront006(S,F,15.2,15.2,694,true);
  gvBand006(F,8.4,.55,false);gvBand006(R,8.4,.55,true);
  for(const z of [12,28,44])gvSash006(S,R,5.2,z,3.5,z>40?8:10,{right:true,six:true,lit:z===28});
  gvGeorgianCornice006(S,.8,31.2,8.8,24,56);
  gableRoof(S,.6,31.4,8.5,24.3,57,12.5,695);
  for(const i of [1.0,15.3,29.1])chimney(S,i,14.9,66,1.9,2.6,2,696+Math.floor(i));
  // The basement floor is a dark stone surface at z=.1. Raised street retaining
  // walls and bridge slabs supply the section without negative ground geometry.
  for(const start of [.8,16]){
    const d=start+10.4;
    S.flat(start+.5,start+14.4,24.1,28.8,.1,C('777769'),.05,1);
    S.wall([start+.35,28.9],[start+14.6,28.9],.1,3.9,P.stoneD,.02);
    S.wall([start+.35,24],[start+.35,28.9],.1,3.9,P.stoneR,.02);
    S.line([start+.35,28.9,4],[start+14.6,28.9,4],P.stone,1);
    // Narrow stair descends along the side of the area, separately from entry.
    for(let n=0;n<5;n++)S.box(start+.65,start+2.15,24.6+n*.68,25.2+n*.68,.12,(n+1)*.72,P.stoneR,P.stoneD,P.path[1]);
    S.box(d-.2,d+3.75,24,27.0,7.8,8.65,P.stone,P.stoneR,P.stoneHi);
    // Four visible risers from the street datum lead to each bridge landing.
    for(let n=0;n<5;n++)S.box(d-.2,d+3.75,26.8,30.9-n*.76,0,(n+1)*1.73,P.stoneR,P.stoneD,P.path[2]);
    for(const ii of [d-.2,d+3.75]){
      for(const j of [24.5,25.8,27])S.line([ii,j,8.7],[ii,j,12.3],P.iron,1);
      S.line([ii,24.2,11.8],[ii,27,11.8],P.iron,1);
      S.line([ii,27,11.8],[ii,30.8,5.1],P.iron,1);
    }
    railing(S,[start+.35,29],[d-.3,29],7.8);
    railing(S,[d+3.85,29],[start+14.6,29],7.8);
  }
  downpipe(S,15.7,24.3,56);downpipe(S,30.95,24.3,56);
  return S.finish();
}

function victorianGabledSemi006(spec) {
  const S=Scene(spec);gvGarden006(S,[[12.2,15.7,20],[16.4,19.7,20]]);
  // Broad H plan: projecting gabled living-room wings and recessed twin doors.
  const CF=gvWall006(S,[11.3,20.7],[20.7,20.7],35.5,false,711,false);
  S.flat(10.8,21.2,7.8,20.7,35.5,P.brickR[0]);
  gableRoof(S,10.5,21.5,7.5,21,36,12.5,712);
  for(const u of [1.1,5.65]){
    gvDoor006(S,CF,u,.9,2.9,15.5,{lit:u<3});
    gvSash006(S,CF,u,22,2.9,9.7,{lit:u>3,panes:2});
  }
  for(const [k,a,b]of [[0,3.4,11.5],[1,20.5,28.6]]){
    const F=gvWall006(S,[a,24],[b,24],38,false,713+k*5,false),R=gvWall006(S,[b,7.7],[b,24],38,true,714+k*5,false);
    S.flat(a,b,7.7,24,38,P.brick[0]);
    gvBand006(F,19.3,1.0,false);gvBand006(R,19.3,1.0,true);
    gvSash006(S,F,1.35,4.7,5.35,11.8,{panes:3,lit:k===0,curtain:true});
    gvSash006(S,F,1.65,23,4.75,11.6,{panes:2,lit:k===1});
    for(const u of [3.1,10.1])for(const z of [5,23])gvSash006(S,R,u,z,3.6,10.8,{right:true,lit:k===1&&u>8&&z>20});
    const G=gvFrontRoof006(S,a-.35,b+.35,7.3,24.4,38.8,18,718+k,false,true);
    gvSash006(S,G,3.1,41.5,2.6,7.1,{panes:2,lit:false});
    for(const u of [.2,7.1])for(let z=3.4;z<37;z+=4.2)F.panel(u,u+.75,z,z+2.1,P.stone,.1);
    chimney(S,k?26.4:4.2,11.5,47,2.4,2.1,3,723+k);
    downpipe(S,b+.3,23.9,38);
  }
  // Separate entrance canopies stay below first-floor openings.
  for(const a of [12.15,16.65]){
    step(S,a,a+3.2,20.7,23.0,2);
    S.poly([[a-.25,20.4,18],[a+3.45,20.4,18],[a+3.45,23,16],[a-.25,23,16]],tileRoof(false,726,'i'));
    for(const i of [a-.1,a+3.3])S.line([i,22.65,1],[i,22.65,16.2],P.wood,1);
  }
  gvFence006(S,[1.1,30.2],[15.8,30.2],[10.8,14.6]);
  gvFence006(S,[16.2,30.2],[30.9,30.2],[.2,4.2]);
  gvFence006(S,[16,23.2],[16,30.2]);
  gvFence006(S,[30.9,2],[30.9,30.2]);
  for(const [i,j]of [[6.1,27.5],[24.7,27.3],[2,4.1]])bush(S,i,j,1.35,3.6,true);
  return S.finish();
}

function victorianBayVilla006(spec) {
  const S=Scene(spec);gvGarden006(S,[[17.2,21.6,20.8],[28.7,30,6]]);
  // Asymmetrical main block with a single full-height canted bay and offset entry.
  const F=gvWall006(S,[4.4,21.4],[27.4,21.4],40,false,741,false),R=gvWall006(S,[27.4,6.4],[27.4,21.4],40,true,742,false);
  S.flat(4.4,27.4,6.4,21.4,40,P.brick[0]);
  gvBand006(F,20.6,.9,false);gvBand006(R,20.6,.9,true);
  gvDoor006(S,F,13.4,1.3,3.5,17.1,{lit:true});
  gvSash006(S,F,13.2,25.1,4.0,11.4,{lit:false});
  gvSash006(S,F,19.0,5,2.8,12.6,{lit:false});
  for(const z of [5.8,25.1])for(const u of [2.2,9.1])gvSash006(S,R,u,z,3.7,11.2,{right:true,lit:z>20&&u<4,curtain:true});
  gableRoof(S,4.1,27.75,6.05,21.7,40.8,14.5,743);
  // The polygon is real geometry, including two oblique sashes and deep reveals.
  const O=[[5.0,20.4],[14.9,20.4],[14.9,23.2],[12.8,25.4],[7.1,25.4],[5.0,23.2]];
  for(let n=1;n<O.length-1;n++){
    const A=O[n],B=O[n+1],right=n===1||n===2;
    const BF=gvWall006(S,A,B,39.8,right,745+n,false);
    gvBand006(BF,20.3,1.2,right);
    const W=BF.length-.9;
    for(const z of [5.1,24.1])gvSash006(S,BF,.45,z,W,11.8,{right,panes:W>4?3:1,lit:(n===3&&z<10)||(n===2&&z>20),curtain:n===3});
  }
  S.flat(5,14.9,20.4,23.2,39.8,P.stoneR);
  S.poly(O.map(p=>[p[0],p[1],39.8]),P.stone,.03);
  // Low faceted slate cap beneath the much taller gable of the same bay axis.
  for(let n=1;n<O.length-1;n++)S.poly([[O[n][0],O[n][1],40.4],[O[n+1][0],O[n+1][1],40.4],[9.95,20.9,47.9]],tileRoof(n<3,751+n,'i'));
  const GF=gvFrontRoof006(S,4.15,15.6,7.0,21.85,41.0,20.0,756,false,true);
  gvSash006(S,GF,4.3,44.2,3.1,8.0,{panes:2,lit:false});
  // Polygonal bay gutters, red brick panels and stone strings remain legible.
  for(let n=1;n<O.length-1;n++)S.line([O[n][0],O[n][1],40.4],[O[n+1][0],O[n+1][1],40.4],P.iron,1);
  chimney(S,22.8,12,52.5,2.7,2.1,3,759);chimney(S,5.1,10.4,54,2.1,2.0,2,760);
  // A substantial opaque pitched portico occludes the lower doorway overlight.
  S.poly([[17.3,21.1,21],[21.5,21.1,21],[21.5,24.4,18],[17.3,24.4,18]],tileRoof(false,761,'i'));
  for(const i of [17.5,21.3])S.box(i-.28,i+.28,24,24.5,0,18.1,P.stone,P.stoneR,P.stoneHi);
  step(S,17.65,21.6,21.4,25.0,2);
  downpipe(S,27.65,21.4,40);downpipe(S,15.4,21.6,40);
  gvFence006(S,[1.1,30.2],[30.9,30.2],[15.6,21]);gvFence006(S,[30.9,2],[30.9,30.2]);
  for(const [i,j,r,h]of [[8.3,28,1.3,3.5],[25.7,27.1,1.45,4.4],[2.2,6.1,1.25,4.5]])bush(S,i,j,r,h,true);
  return S.finish();
}

function victorianGardenVilla006(spec) {
  const S=Scene(spec);gvGarden006(S,[[13.7,17.6,20.9],[23.5,29.3,25.1]]);
  const F=S.face([3.2,21.4],[25.9,21.4]),R=S.face([25.9,6],[25.9,21.4]);
  const render=(right)=>(u,z)=>mod(z,4.5)<.14?(right?C('a99f86'):C('c6bba0')):(right?C('b3aa91'):C('d4c8ab'));
  F.panel(0,F.length,0,36.7,render(false),0);R.panel(0,R.length,0,36.7,render(true),0);
  S.flat(3.2,25.9,6,21.4,36.7,P.stoneR);
  gvBand006(F,2.1,1,false);gvBand006(R,2.1,1,true);
  gvBand006(F,19.2,.6,false);gvBand006(R,19.2,.6,true);
  for(const u of [2.2,16.5]){
    gvSash006(S,F,u,5.1,4.2,11.9,{six:true,lit:u<4,curtain:true});
    gvSash006(S,F,u,23,4.2,10.2,{six:true,lit:u>10});
  }
  gvDoor006(S,F,10.6,1.3,3.6,16.1,{col:P.green,lit:false});
  gvSash006(S,F,10.5,23,3.8,10.2,{six:true,lit:false});
  for(const z of [5,23])for(const u of [2.0,8.8])gvSash006(S,R,u,z,3.5,10.4,{right:true,six:true,lit:u<3&&z>20});
  for(const u of [.1,21.65]){
    F.panel(u,u+1.0,2.8,35.4,P.stoneHi,.07);
    F.panel(u-.08,u+1.1,32.8,34.0,P.stone,.11);
  }
  gvGeorgianCornice006(S,3.2,25.9,6,21.4,36.7);
  hipRoof(S,[[2.8,5.6],[26.3,5.6],[26.3,21.8],[2.8,21.8]],[9.2,13.7],[20,13.7],37.4,13.1,779);
  chimney(S,4.2,12.3,45.0,2.3,2.1,2,780);chimney(S,23.1,10.1,43.3,2.2,2,2,781);
  // Central pedimented porch does not turn the whole front into a glass shed.
  for(const i of [13.15,17.05])S.box(i,i+.3,23.85,24.25,1.1,16.8,P.stoneHi,P.stoneR,P.stone);
  S.box(12.9,17.6,21.4,24.5,16.2,17.1,P.stone,P.stoneR,P.stoneHi);
  S.poly([[12.7,24.65,17],[17.8,24.65,17],[15.25,24.65,21.1]],P.stone,.05);
  S.line([12.7,24.7,17],[15.25,24.7,21.1],P.stoneHi,1);S.line([15.25,24.7,21.1],[17.8,24.7,17],P.stoneHi,1);
  S.poly([[12.7,21.2,17],[15.25,21.2,21.1],[15.25,24.65,21.1],[12.7,24.65,17]],tileRoof(false,782,'j'));
  S.poly([[15.25,21.2,21.1],[17.8,21.2,17],[17.8,24.65,17],[15.25,24.65,21.1]],tileRoof(true,783,'j'));
  step(S,13.15,17.5,21.4,25.3,2);
  // Lower side conservatory: opaque pale framing and individual glazed panels.
  // The z-buffer hides the house windows physically behind its roof and walls.
  const CF=S.face([22.8,26.1],[29.6,26.1]),CR=S.face([29.6,15.3],[29.6,26.1]);
  CF.panel(0,6.8,0,12.5,P.frame,.03);CR.panel(0,10.8,0,12.5,P.frameR,.03);
  for(const [FF,right,count,width]of [[CF,false,3,2.2],[CR,true,5,2.1]])for(let n=0;n<count;n++)
    gvSash006(S,FF,.28+n*width,3.1,width-.48,8.8,{right,panes:1,lit:!right&&n===1});
  const roofGlass=(right)=>(i,j,z)=>{
    if(mod(j-15.1,2.1)<.12||mod(i-22.6,1.7)<.12)return right?P.frameR:P.frame;
    return right?C('60797d'):C('829a98');
  };
  S.poly([[22.6,15.1,19.9],[29.85,15.1,12.9],[29.85,26.4,12.9],[22.6,26.4,19.9]],roofGlass(false),.02);
  S.poly([[22.8,26.1,12.5],[29.6,26.1,12.5],[22.8,26.1,19.65]],P.frame,.03);
  const TF=S.face([22.8,26.12],[29.6,26.12]);
  TF.panel(.2,6.6,12.5,19.7,(x,y)=>y>7.15*(1-(x+.2)/6.8)?null:(mod(x+.2,1.7)<.18?P.frame:C('78918e')),.14);
  S.line([22.6,26.4,19.9],[29.85,26.4,12.9],P.frame,1);
  S.line([29.85,15.1,12.9],[29.85,26.4,12.9],P.frameR,1);
  downpipe(S,26.15,7.2,36);downpipe(S,3.4,21.65,36);
  gvFence006(S,[1.1,30.2],[30.9,30.2],[12.1,17]);gvFence006(S,[30.9,1.5],[30.9,30.2]);
  bush(S,7.8,26.5,1.75,3.7,true);bush(S,20.2,28.4,1.15,3.1,true);bush(S,2,3.1,.85,4,false);
  return S.finish();
}

function gvPointed006(S,F,u,z,w,h,right,lit) {
  const top=x=>h-3.7+3.7*(1-Math.abs(x-w/2)/(w/2));
  F.panel(u-.4,u+w+.4,z-.5,z+h+.5,(x,y)=>y>top(Math.max(0,Math.min(w,x-.4)))+.4?null:(right?P.stoneR:P.stone),.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    if(y>top(x))return null;
    if(x<.34||x>w-.34||y<.5||y>top(x)-.55||Math.abs(x-w/2)<.2||Math.abs(y-h*.44)<.25)return right?P.frameR:P.frame;
    if(mod(x*1.6+y*.6,2.6)<.14)return P.ironHi;
    return [right?P.glassR:P.glass,lit?P.warm[0]:0];
  },.22);
}

function victorianGothicVilla006(spec) {
  const S=Scene(spec);gvGarden006(S,[[15,19.9,19.9],[27.4,29,8.4]]);
  // Long low hall ends in a steep, taller transverse wing and an angle porch.
  const HF=gvWall006(S,[4.0,20.6],[19.7,20.6],33.1,false,801,false),HR=gvWall006(S,[19.7,6.6],[19.7,20.6],33.1,true,802,false);
  S.flat(4,19.7,6.6,20.6,33.1,P.brick[0]);
  gvBand006(HF,19.1,.7,false);
  for(const u of [1.7,7.2]){
    gvPointed006(S,HF,u,4.2,3.4,12.1,false,u<3);
    gvSash006(S,HF,u,23,3.4,7.3,{panes:2,leaded:true,lit:false});
  }
  gableRoof(S,3.6,20.1,6.2,21.0,33.8,20.8,803);
  // Cross-wing ridge runs forward at right angles to the hall ridge.
  const WF=gvWall006(S,[20,24.1],[28.1,24.1],43.5,false,804,false),WR=gvWall006(S,[28.1,4.2],[28.1,24.1],43.5,true,805,false);
  S.flat(20,28.1,4.2,24.1,43.5,P.brick[0]);
  for(const z of [20.4,40.8]){gvBand006(WF,z,.7,false);gvBand006(WR,z,.7,true);}
  gvPointed006(S,WF,1.25,4.7,5.7,13.6,false,true);
  gvPointed006(S,WF,1.55,25,5.1,13,false,false);
  for(const u of [2.8,9.6,15.5])for(const z of [6,25])gvPointed006(S,WR,u,z,3.3,12.4,true,z>20&&u<4);
  const GF=gvFrontRoof006(S,19.6,28.5,3.8,24.5,44.3,23.8,806,false,true);
  gvPointed006(S,GF,3.35,47.2,2.3,8.1,false,false);
  // A tiny lozenge vent in the apex belongs to the gable face, not screen space.
  GF.panel(3.8,5.1,59.4,62.3,(x,y)=>Math.abs((x-.65)/.65)+Math.abs((y-1.45)/1.45)<1?P.iron:null,.18);
  // Octagonal-ish stair turret in the angle, with a small independently roofed porch.
  const TF=gvWall006(S,[13.7,22.5],[19.8,22.5],26.5,false,807,false);
  gvWall006(S,[19.8,15.5],[19.8,22.5],26.5,true,808,false);
  gvDoor006(S,TF,1.3,1.3,3.5,17.4,{lit:true,col:C('6a4b44')});
  const TM=gvFrontRoof006(S,13.35,20.15,15.2,22.85,27.2,11.6,809,false,true);
  gvPointed006(S,TM,2.6,28.4,1.6,5.1,false,false);
  step(S,14.75,19.1,22.5,25.1,2);
  // Wide stepped stack and clustered pots are prominent domestic Gothic cues.
  chimney(S,6.4,11.3,51.4,3.4,2.8,3,810);
  S.box(6.1,10.15,11,14.4,53.3,54.3,P.brick[1],P.brickR[1],P.stoneR);
  chimney(S,24.1,7.3,61.8,2.6,2.2,2,811);
  for(let z=4;z<40;z+=4.4)WR.panel(18.7,19.6,z,z+2.3,P.stoneR,.08);
  downpipe(S,28.45,23.8,43.5);downpipe(S,12.6,20.8,33);
  gvFence006(S,[1.1,30.2],[30.9,30.2],[12.9,19.2]);gvFence006(S,[30.9,1.5],[30.9,30.2]);
  bush(S,7.8,26.8,1.55,4.5,true);bush(S,25.6,28,1.25,3.3,false);bush(S,2.1,7.1,1.05,3.9,false);
  return S.finish();
}

/* UKR09–16. Original village and industrial domestic plans.
 * This fragment is concatenated inside residential-art-primitives006.js's IIFE.
 * References inform typology rather than copying a particular surviving house.
 */

function vwRubble006(right,seed) {
  const pal=(right?['aaa18a','b3a58d','a79b83','b6a98d']:['c9bea1','d3c7a9','c3b79c','d7cbad']).map(C);
  return (u,z)=>{
    const row=Math.floor(z/2.1),phase=(row&1)*1.72,x=u+phase;
    const cell=Math.floor(x/3.35),n=hash(cell,row,seed);
    if(z<2.6)return right?C('8b8974'):C('a09d80');
    if(mod(z,2.1)<.20||mod(x,3.35)<.14)return right?C('928b77'):C('b0a68c');
    return pal[(n>>>6)%4];
  };
}
function vwBrick006(right,seed) {
  const pal=(right?['815147','87574c','7b4d44']:['a96b55','b1735b','a36854']).map(C);
  return (u,z)=>{
    const row=Math.floor(z/1.75),x=u+(row&1)*1.2,n=hash(Math.floor(x/2.4),row,seed);
    if(z<1.7)return right?C('68665b'):C('8c8470');
    if(mod(z,1.75)<.17||mod(x,2.4)<.12)return right?C('735347'):C('916954');
    if(z<4.5&&n%5===0)return pal[2];
    return n%9===0?pal[1]:n%11===0?pal[2]:pal[0];
  };
}
function vwClay006(right,seed,axis) {
  const pal=(right?['765048','7e564c','704940']:['a8755a','ae7a5f','a06c55']).map(C);
  return (i,j,z)=>{
    const along=axis==='j'?j:i,down=axis==='j'?i:j,row=Math.floor(down/1.05);
    const x=along+(row&1)*.8,n=hash(Math.floor(x/1.6),row,seed);
    if(mod(down,1.05)<.1)return right?C('61473f'):C('93654f');
    return n%13===0?pal[1]:n%17===0?pal[2]:pal[0];
  };
}
function vwStoneSlate006(right,seed,axis) {
  const pal=(right?['777a6e','7e8072','737668']:['999a87','a3a28e','939583']).map(C);
  return (i,j,z)=>{
    const a=axis==='j'?j:i,d=axis==='j'?i:j,row=Math.floor(d/1.5),x=a+(row&1)*1.3;
    const n=hash(Math.floor(x/2.6),row,seed);
    if(mod(d,1.5)<.13)return right?C('676e63'):C('818877');
    return n%13===0?pal[1]:n%17===0?pal[2]:pal[0];
  };
}
function vwRoof006(S,i0,i1,j0,j1,z,rise,seed,opt) {
  opt=opt||{};
  const axis=opt.axis||'i',m=axis==='j'?(i0+i1)/2:(j0+j1)/2;
  const tex=opt.clay?vwClay006:opt.stone?vwStoneSlate006:tileRoof;
  const gable=opt.gable||vwBrick006(axis==='i',seed+8);
  if(axis==='j'){
    S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],tex(false,seed,'j'));
    S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],tex(true,seed+1,'j'));
    S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,zz)=>gable(i-i0,zz),-.025);
    S.line([i0,j1,z],[m,j1,z+rise],opt.stone?P.stone:P.roofEdge,1);
    S.line([m,j1,z+rise],[i1,j1,z],opt.stone?P.stoneR:P.roofEdge,1);
    ridge(S,[m,j0],[m,j1],z+rise,opt.clay?C('bd8b6a'):opt.stone?C('b1ae97'):P.lead);
    S.line([i1,j0,z],[i1,j1,z],P.iron,1);
  }else{
    S.poly([[i0,j0,z],[i1,j0,z],[i1,m,z+rise],[i0,m,z+rise]],tex(true,seed,'i'));
    S.poly([[i0,m,z+rise],[i1,m,z+rise],[i1,j1,z],[i0,j1,z]],tex(false,seed+1,'i'));
    S.poly([[i1,j0,z],[i1,j1,z],[i1,m,z+rise]],(i,j,zz)=>gable(j-j0,zz),-.025);
    S.line([i1,j0,z],[i1,m,z+rise],opt.stone?P.stoneR:P.roofEdge,1);
    S.line([i1,m,z+rise],[i1,j1,z],opt.stone?P.stoneR:P.roofEdge,1);
    ridge(S,[i0,m],[i1,m],z+rise,opt.clay?C('bd8b6a'):opt.stone?C('b1ae97'):P.lead);
    S.line([i0,j1,z],[i1,j1,z],P.iron,1);
  }
}
function vwPlainDoor006(S,F,u,z,w,h,opt) {
  opt=opt||{};const right=!!opt.right,col=opt.col||P.wood;
  F.panel(u-.3,u+w+.3,z,z+h+.7,right?P.stoneD:P.stone,.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    if(x<.3||x>w-.3||y>h-.45)return right?P.greenD:C('5c6756');
    if(opt.glazed&&y>h-4.1&&y<h-.9&&x>.6&&x<w-.6)return [P.glass,P.warm[2]];
    if(mod(x,.85)<.10)return right?C('344b42'):C('45594b');
    if(y>h*.42&&y<h*.48&&x>w*.72)return P.gold;
    return col;
  },.23);
  const a=F.point(u-.15),b=F.point(u+w+.15);
  S.line([a[0],a[1]+.2,z+.15],[b[0],b[1]+.2,z+.15],P.stoneHi,1);
}
function vwCottageWindow006(S,F,u,z,w,h,opt) {
  opt=opt||{};const right=!!opt.right;
  windowOn(S,F,u,z,w,h,{right,panes:opt.panes||2,transom:h*.56,leaded:!!opt.leaded,curtain:!!opt.curtain,lit:opt.lit!==false,warm:opt.warm||0,border:.3});
  if(opt.woodLintel)F.panel(u-.5,u+w+.5,z+h,z+h+.85,right?C('716751'):C('8b7c5e'),.28);
}
function vwGarden006(S,seed) {
  S.flat(.7,31.3,.7,31.3,0,(i,j)=>{
    const n=hash(Math.floor(i/3),Math.floor(j/3),seed);
    if(j>30)return P.path[n%4];
    return [C('89956f'),C('83916a'),C('8d9973')][n%3];
  },0,1);
}
function vwCobbles006(S,i0,i1,j0,j1,seed) {
  S.flat(i0,i1,j0,j1,.12,(i,j)=>{
    const row=Math.floor(j/1.65),x=i+(row&1)*1.1,n=hash(Math.floor(x/2.2),row,seed);
    if(mod(j,1.65)<.16||mod(x,2.2)<.14)return C('919082');
    return [C('ada997'),C('b5af9c'),C('a5a491'),C('bcb6a2')][n%4];
  },.01,1);
}
function vwGardenWall006(S,a,b,height,seed,stone) {
  const F=S.face(a,b),right=a[0]===b[0];
  F.panel(0,F.length,0,height,stone?vwRubble006(right,seed):vwBrick006(right,seed),.02);
  for(let u=0;u<F.length;u+=1.55){
    const p=F.point(u),q=F.point(Math.min(F.length,u+1.5));
    S.line([p[0],p[1],height],[q[0],q[1],height],stone?P.stoneR:C('a3775d'),1);
  }
}
function vwGate006(S,a,b,h) {
  const L=Math.hypot(b[0]-a[0],b[1]-a[1]);
  for(let u=0;u<=L;u+=.8){const p=lerp(a,b,u/L);S.line([p[0],p[1],.4],[p[0],p[1],h],C('7f7960'),1);}
  for(const z of [1.2,h-1])S.line([a[0],a[1],z],[b[0],b[1],z],C('a09576'),1);
}
function vwPot006(S,i,j,flower) {
  S.box(i-.6,i+.6,j-.6,j+.6,0,1.7,C('a67358'),C('7d5544'),C('6e6650'));
  bush(S,i,j,.85,3.2,flower);
}
function vwKitchenBed006(S,i0,i1,j0,j1,seed) {
  S.flat(i0,i1,j0,j1,.17,C('81775c'),.02,1);
  for(let j=j0+.8;j<j1;j+=1.7)for(let i=i0+.65;i<i1;i+=1.4){
    const n=hash(Math.floor(i*3),Math.floor(j*3),seed);
    S.line([i-.25,j,.6],[i+.35,j,1.1],n%2?C('607c49'):C('769052'),1);
  }
}
function vwDormer006(S,i0,i1,back,front,z0,z1,rise,seed,stone) {
  const mid=(i0+i1)/2,mat=stone?vwRubble006(false,seed):vwBrick006(false,seed);
  S.poly([[i0,back,z1+1],[i0,front,z0],[i0,front,z1]],P.stoneD,.02);
  S.poly([[i1,back,z1+1],[i1,front,z0],[i1,front,z1]],P.stoneR,.02);
  const D=S.face([i0,front],[i1,front]);D.panel(0,i1-i0,z0,z1,mat,.02);
  S.poly([[i0,front,z1],[i1,front,z1],[mid,front,z1+rise]],(i,j,z)=>mat(i-i0,z),.02);
  S.poly([[i0,back,z1],[i1,back,z1],[mid,back,z1+rise]],P.stoneD,-.03);
  vwRoof006(S,i0-.25,i1+.25,back,front+.32,z1,rise,seed+1,{axis:'j',stone,gable:mat});
  vwCottageWindow006(S,D,.9,z0+1,i1-i0-1.8,z1-z0-1.8,{leaded:true});
}

function stoneCottagePair006(spec) {
  const S=Scene(spec);vwGarden006(S,609);
  // Two distinct cottages share the party wall; their roof/eave levels step.
  const A=S.face([2.6,23],[15.7,23]),AR=S.face([15.7,10.2],[15.7,23]);
  A.panel(0,13.1,0,23.5,vwRubble006(false,610),0);
  AR.panel(0,12.8,0,23.5,vwRubble006(true,611),0);
  const B=S.face([15.7,24],[29.0,24]),BR=S.face([29,10],[29,24]);
  B.panel(0,13.3,0,25.4,vwRubble006(false,612),0);
  BR.panel(0,14,0,25.4,vwRubble006(true,613),0);
  vwRoof006(S,2.15,15.8,9.8,23.45,23.7,18.1,614,{stone:true,gable:vwRubble006(true,615)});
  vwRoof006(S,15.5,29.5,9.5,24.5,25.6,19.5,616,{stone:true,gable:vwRubble006(true,617)});
  vwDormer006(S,6.7,12.5,19.2,23.5,25.1,34.4,6.6,618,true);
  vwDormer006(S,20.0,26.3,20.6,24.5,27.0,37.4,7.4,620,true);
  vwPlainDoor006(S,A,1.2,.6,3.25,15.3,{col:C('596c61'),glazed:true});
  vwCottageWindow006(S,A,6.3,5.1,4.65,10.6,{leaded:true,woodLintel:true,curtain:true});
  vwCottageWindow006(S,B,1.3,5.4,4.8,10.8,{leaded:true,woodLintel:true});
  vwPlainDoor006(S,B,8.5,.6,3.3,16.0,{col:C('777d64')});
  vwCottageWindow006(S,BR,3.5,6.1,4.2,10.1,{right:true,leaded:true,lit:false});
  vwCottageWindow006(S,BR,6.1,27.4,3.2,7.6,{right:true,leaded:true,lit:false});
  // Solid stone stacks, irregular domestic gardens, and two working gates.
  chimney(S,3.7,15.1,40.0,2.1,2.0,1,622);
  chimney(S,16.1,16.1,43.7,2.55,2.2,2,623);
  vwCobbles006(S,3.2,7.2,23.1,30.7,624);vwCobbles006(S,23.6,28.1,24.0,30.7,625);
  vwGardenWall006(S,[1,30.3],[3.4,30.3],3.4,626,true);
  vwGardenWall006(S,[7.1,30.3],[23.7,30.3],3.4,627,true);
  vwGardenWall006(S,[27.8,30.3],[31,30.3],3.4,628,true);
  vwGardenWall006(S,[31,19.2],[31,30.3],3.4,629,true);
  vwGardenWall006(S,[15.7,24.3],[15.7,30.3],2.8,630,true);
  vwGate006(S,[3.5,30.3],[7.0,30.3],3.5);vwGate006(S,[23.8,30.3],[27.7,30.3],3.5);
  bush(S,10.7,27.7,1.65,3.1,true);bush(S,19.4,28.1,1.4,2.8,true);
  vwPot006(S,28.7,25.4,false);downpipe(S,15.5,23.2,23.4);
  return S.finish();
}

function brickCatslideCottage006(spec) {
  const S=Scene(spec);vwGarden006(S,640);
  vwCobbles006(S,11.7,16.8,25.0,31,641);
  // The continuous long rear slope genuinely descends to a single-storey outshot.
  const F=S.face([4.5,25.0],[24.1,25.0]),R=S.face([24.1,5.0],[24.1,25.0]);
  F.panel(0,19.6,0,35.0,vwBrick006(false,642),0);
  S.poly([[24.1,5,0],[24.1,25,0],[24.1,25,35],[24.1,18,49],[24.1,5,19]],(i,j,z)=>vwBrick006(true,643)(j-5,z),0);
  S.wall([4.5,5],[24.1,5],0,19,(i,j,z)=>vwBrick006(true,644)(i,z),0);
  S.poly([[4.1,4.55,18.4],[24.55,4.55,18.4],[24.55,18,49.3],[4.1,18,49.3]],vwClay006(true,645,'i'));
  S.poly([[4.1,18,49.3],[24.55,18,49.3],[24.55,25.5,34.8],[4.1,25.5,34.8]],vwClay006(false,646,'i'));
  ridge(S,[4.1,18],[24.55,18],49.3,C('ba8664'));
  S.line([24.55,4.55,18.4],[24.55,18,49.3],C('9d7158'),1);
  S.line([24.55,18,49.3],[24.55,25.5,34.8],C('9d7158'),1);
  S.line([4.1,25.5,34.8],[24.55,25.5,34.8],P.iron,1);
  vwPlainDoor006(S,F,7.9,.6,3.8,16.4,{col:C('526b5e'),glazed:true});
  for(const u of [1.1,13.45]){
    vwCottageWindow006(S,F,u,5.2,5.0,10.4,{panes:3,curtain:u<2});
    vwCottageWindow006(S,F,u+.3,23.0,4.4,8.9,{panes:2,lit:u>10});
  }
  // Rear kitchen casement and low plank back door are on the outshot's side.
  vwCottageWindow006(S,R,1.3,4.2,4.3,9.4,{right:true});
  vwPlainDoor006(S,R,6.6,.4,3.1,13.7,{right:true,col:C('626f5c')});
  vwCottageWindow006(S,R,12.6,22.0,3.2,9.3,{right:true,lit:false});
  chimney(S,20.2,16.8,47.3,2.8,2.7,2,647);
  downpipe(S,24.5,25.0,34.4);downpipe(S,24.45,5.2,18.5);
  vwKitchenBed006(S,26.0,30.3,5.3,11.6,648);
  vwKitchenBed006(S,26.0,30.3,14.1,20.6,649);
  vwGardenWall006(S,[30.9,3.8],[30.9,24.2],3.0,650,false);
  vwGate006(S,[30.9,24.2],[30.9,28.3],3.0);
  bush(S,6.7,28.4,1.8,3.5,true);bush(S,22.2,28.3,1.9,3.6,true);
  vwPot006(S,17.8,26.5,true);
  return S.finish();
}

function courtyardCottages006(spec) {
  const S=Scene(spec);vwGarden006(S,660);
  vwCobbles006(S,12.0,30.7,13.3,30.6,661);
  // A two-storey dwelling range and genuinely lower perpendicular cottage wing.
  const F=S.face([2.8,14.1],[28.8,14.1]),R=S.face([28.8,3.8],[28.8,14.1]);
  F.panel(0,26,0,31.8,vwRubble006(false,662),0);R.panel(0,10.3,0,31.8,vwRubble006(true,663),0);
  vwRoof006(S,2.3,29.3,3.3,14.6,32.0,16.4,664,{clay:true,gable:vwRubble006(true,665)});
  for(const u of [2.0,13.8]){
    vwPlainDoor006(S,F,u,.6,3.1,14.8,{col:u<5?C('636e57'):C('526858'),glazed:true});
    vwCottageWindow006(S,F,u+4.6,4.4,4.5,10.0,{leaded:true});
    vwCottageWindow006(S,F,u+1.4,22.0,4.0,7.6,{lit:u>5});
  }
  vwCottageWindow006(S,R,2.9,5.0,4.0,10.0,{right:true});
  vwCottageWindow006(S,R,3.0,22.0,3.5,7.7,{right:true,lit:false});
  const WF=S.face([2.8,27.5],[12.2,27.5]),WR=S.face([12.2,13.2],[12.2,27.5]);
  WF.panel(0,9.4,0,21.0,vwBrick006(false,666),0);WR.panel(0,14.3,0,21.0,vwBrick006(true,667),0);
  vwRoof006(S,2.3,12.7,12.5,28.0,21.3,12.7,668,{axis:'j',clay:true,gable:vwBrick006(false,669)});
  vwCottageWindow006(S,WF,2.1,5.1,5.1,10.4,{panes:3,curtain:true});
  vwCottageWindow006(S,WR,1.2,4.8,3.4,9.7,{right:true,lit:false});
  vwPlainDoor006(S,WR,6.3,.5,3.15,14.7,{right:true,col:C('6c765e')});
  vwCottageWindow006(S,WR,10.6,5.0,2.4,9.3,{right:true});
  chimney(S,6.5,8.1,46.3,2.6,2.2,2,670);chimney(S,6.3,19.6,31.9,2.0,2.1,1,671);
  downpipe(S,28.9,14.3,31.8);downpipe(S,12.35,25.8,21);
  // Cobbled access stays open all the way to the lane; enclosure is low.
  vwGardenWall006(S,[30.7,16],[30.7,30.4],3.0,672,true);
  vwGardenWall006(S,[12.6,30.4],[20.0,30.4],2.8,673,true);
  vwGardenWall006(S,[26.0,30.4],[30.7,30.4],2.8,674,true);
  vwGate006(S,[20.1,30.4],[25.9,30.4],2.9);
  vwPot006(S,14.1,23.3,true);vwPot006(S,27.8,17.0,false);
  bench(S,16.5,17.7,4.7);
  S.box(27.0,29.2,23.0,25.2,0,2.6,C('a09b84'),C('807d6d'),C('797f6c'));
  bush(S,28.1,24.1,1.0,3.7,false);
  return S.finish();
}

function thatchedLongCottage006(spec) {
  const S=Scene(spec);vwGarden006(S,680);
  const cob=(right)=>(u,z)=>{
    const n=hash(Math.floor(u/2.7),Math.floor(z/2.5),681);
    if(z<3.1)return right?C('a3a18a'):C('b8b7a0');
    if(z>17.6)return right?C('c0bda5'):C('d8d4b9');
    return right?(n%19===0?C('c2bea7'):C('ccc7ad')):(n%23===0?C('ddd9c0'):C('e5dfc6'));
  };
  const F=S.face([2.6,24.0],[29.1,24.0]),R=S.face([29.1,12.7],[29.1,24.0]);
  F.panel(0,26.5,0,19.2,cob(false),0);R.panel(0,11.3,0,19.2,cob(true),0);
  // A rounded, thick thatch section made from several roof facets, with reed
  // courses following the slope. There is no slate grid, jetty, or half timber.
  const thatch=(right)=>(i,j,z)=>{
    const n=hash(Math.floor(i*1.6),Math.floor(j*.9),683),course=mod(j*1.9+z*.11,2.25);
    if(course<.17)return right?C('887b51'):C('aa9967');
    return right?(n%13===0?C('a59867'):C('9b8c5e')):(n%17===0?C('c9b77c'):C('bdac72'));
  };
  const sections=[[11.7,18.0],[13.2,23.7],[17.0,37.7],[18.2,40.1],[19.5,37.7],[23.5,23.6],[25.1,18.0]];
  for(let q=0;q<sections.length-1;q++){
    const [j0,z0]=sections[q],[j1,z1]=sections[q+1];
    S.poly([[1.8,j0,z0],[29.8,j0,z0],[29.8,j1,z1],[1.8,j1,z1]],thatch(q<3));
  }
  S.poly([[29.1,12.7,18.5],[29.1,24,18.5],[29.1,18.2,39.2]],(i,j,z)=>cob(true)(j,z),-.03);
  // Deep straw rolls at both eaves and a stitched saddle ridge.
  S.wall([1.8,25.1],[29.8,25.1],16.7,18.1,C('9b8b59'),.03);
  S.line([1.8,25.1,18.2],[29.8,25.1,18.2],C('d0bd81'),1);
  S.line([1.8,18.2,40.2],[29.8,18.2,40.2],C('cbb983'),1);
  for(let i=2.7;i<29.1;i+=1.4){
    S.line([i,17.35,38.7],[i+.75,19.1,38.5],C('8e7a50'),1);
    S.line([i,19.1,38.5],[i+.75,17.35,38.7],C('ac9763'),1);
  }
  vwPlainDoor006(S,F,10.9,.45,3.8,14.5,{col:C('5a6a57')});
  vwCottageWindow006(S,F,2.2,5,5.8,8.6,{panes:3,curtain:true,woodLintel:true});
  vwCottageWindow006(S,F,18.1,5,5.3,8.6,{panes:3,woodLintel:true});
  vwCottageWindow006(S,R,4.8,4.8,3.8,8.3,{right:true,lit:false});
  // The rear lean-to has boarded cladding and its own clearly lower roof plane.
  const LR=S.face([29.1,5.3],[29.1,12.9]);
  LR.panel(0,7.6,0,12.4,(u,z)=>mod(u,1.1)<.12?C('4b5144'):C('69705b'),0);
  S.poly([[21.4,5.0,12.4],[29.5,5.0,12.4],[29.5,12.8,19.4],[21.4,12.8,19.4]],vwClay006(true,684,'i'));
  S.poly([[29.1,5.3,12.3],[29.1,12.9,12.3],[29.1,12.9,19.4]],C('626953'),-.02);
  vwPlainDoor006(S,LR,2.2,.2,2.9,10.8,{right:true,col:C('747962')});
  chimney(S,4.1,17.1,38.2,2.6,2.4,1,685);
  vwCobbles006(S,12.4,17.8,24.0,31.0,686);
  vwGate006(S,[2.0,29.7],[12.3,29.7],2.8);vwGate006(S,[17.9,29.7],[30.6,29.7],2.8);
  bush(S,7.5,27.0,1.55,3.3,true);bush(S,23.3,27.2,1.5,3.0,true);
  vwKitchenBed006(S,2.0,6.6,5.0,9.6,687);
  return S.finish();
}

function vwWorkersBase006(S,seed) {
  vwCobbles006(S,.6,31.4,.6,31.4,seed);
  // The same narrow stone footway, frontage line and eaves bind the street set.
  S.flat(.6,31.4,30.15,31.4,.24,(i,j)=>mod(i,3.6)<.12?C('969787'):C('bbb5a2'),.03,1);
  S.line([.6,31.35,.2],[31.4,31.35,.2],C('83897e'),1);
}
function vwWorkersFace006(S,F,width,seed,opt) {
  opt=opt||{};const right=!!opt.right,h=opt.h||37.6;
  F.panel(0,width,0,h,vwBrick006(right,seed),0);
  F.panel(0,width,h-1.7,h-.8,right?C('704d43'):C('93614e'),.10);
  F.panel(0,width,18.8,19.3,right?C('9c8066'):C('c49f79'),.10);
}
function vwWorkerAddress006(S,F,u,opt) {
  opt=opt||{};const right=!!opt.right;
  vwPlainDoor006(S,F,u+.8,.45,2.7,15.8,{right,col:opt.col||C('4c6557'),glazed:true});
  vwCottageWindow006(S,F,u+4.35,4.9,4.35,10.4,{right,curtain:true,lit:opt.lit!==false});
  vwCottageWindow006(S,F,u+3.05,24.3,4.3,10.2,{right,lit:opt.upperLit!==false});
  F.panel(u+.8,u+3.5,17.4,18.1,right?C('a38166'):C('c79d76'),.16);
}
function vwLaundry006(S,a,b,z) {
  S.line([a[0],a[1],0],[a[0],a[1],z+.4],C('766954'),1);
  S.line([b[0],b[1],0],[b[0],b[1],z+.4],C('766954'),1);
  S.line([a[0],a[1],z],[b[0],b[1],z],C('b0a38c'),1);
  for(const [q,col]of [[.27,C('d3cbb2')],[.64,C('a8b1a5')]]){
    const p=lerp(a,b,q),r=lerp(a,b,q+.16);
    S.wall([p[0],p[1]],[r[0],r[1]],z-3.4,z-.2,col,.02);
  }
}

function workersNarrowRow006(spec) {
  const S=Scene(spec);vwWorkersBase006(S,700);
  const F=S.face([.65,30.0],[31.35,30.0]),R=S.face([31.35,12.0],[31.35,30.0]);
  vwWorkersFace006(S,F,30.7,701);vwWorkersFace006(S,R,18.0,702,{right:true});
  vwRoof006(S,.6,31.4,11.6,30.25,37.8,10.1,703,{gable:vwBrick006(true,704)});
  for(const [k,u]of [0,10.2,20.4].entries()){
    vwWorkerAddress006(S,F,u,{col:[C('476454'),C('6b6a5a'),C('54666b')][k],upperLit:k!==1,lit:k!==2});
    if(k)F.panel(u-.13,u+.13,1,37.2,C('8c594a'),.12);
  }
  // Flat-fronted addresses and shared stacks, deliberately no Victorian bays.
  chimney(S,9.2,19.6,47.2,2.15,2.4,2,705);
  chimney(S,19.4,19.6,47.2,2.15,2.4,2,706);
  vwCottageWindow006(S,R,3.1,6.0,3.1,8.3,{right:true,lit:false});
  vwCottageWindow006(S,R,3.2,25.4,3.0,8.8,{right:true,lit:false});
  downpipe(S,10.25,30.15,37.4);downpipe(S,30.9,30.15,37.4);
  for(const i of [1.5,11.7,21.9])S.flat(i,i+2.8,30.02,30.95,.55,P.stoneR,.08);
  // Rear service strip is paved, not a lawn around each house.
  vwGardenWall006(S,[31.0,1.2],[31.0,10.4],3.0,707,false);
  vwGate006(S,[27.5,2],[30.9,2],3.3);
  return S.finish();
}

function workersYardTerrace006(spec) {
  const S=Scene(spec);vwWorkersBase006(S,720);
  // Three individual rear kitchens project from a shallow through-house range.
  // Staggered outriggers leave the visible-side yards and back passage legible.
  for(const [k,i]of [1.5,11.7,21.9].entries()){
    const depth=[12.4,10.5,7.0][k],end=i+3.7;
    const KR=S.face([end,depth],[end,22.0]),KF=S.face([i,22],[end,22]);
    KR.panel(0,22-depth,0,14.4,vwBrick006(true,722+k*3),0);
    KF.panel(0,3.7,0,14.4,vwBrick006(false,723+k*3),0);
    S.poly([[i-.25,depth-.3,15.0],[end+.25,depth-.3,15.0],[end+.25,22.2,22.3],[i-.25,22.2,22.3]],tileRoof(true,724+k*3,'i'));
    S.poly([[end,depth,14.4],[end,22,14.4],[end,22,22.1]],(ii,j,z)=>vwBrick006(true,730+k)(j,z),-.02);
    vwPlainDoor006(S,KR,2.0,.2,2.35,11.2,{right:true,col:C('5a6657')});
    if(k===2)vwCottageWindow006(S,KR,7.2,4.2,2.6,7.2,{right:true,lit:true});
    vwGardenWall006(S,[i+8.95,3.4],[i+8.95,22],3.9,734+k,false);
    vwGardenWall006(S,[i-.3,3.4],[i+4.5,3.4],3.5,737+k,false);
    vwGate006(S,[i+4.6,3.4],[i+8.8,3.4],3.4);
  }
  // Back passage runs uninterrupted behind the three gated yards.
  S.flat(.8,31.2,.8,3.25,.22,(i,j)=>mod(i,2.4)<.15?C('8b8d80'):C('a1a191'),.03,1);
  const F=S.face([.65,30.0],[31.35,30.0]),R=S.face([31.35,21.9],[31.35,30.0]);
  vwWorkersFace006(S,F,30.7,741);vwWorkersFace006(S,R,8.1,742,{right:true});
  vwRoof006(S,.6,31.4,21.5,30.25,37.8,9.7,743,{gable:vwBrick006(true,744)});
  for(const [k,u]of [0,10.2,20.4].entries())vwWorkerAddress006(S,F,u,{col:[C('5f6b58'),C('546a64'),C('6e695c')][k],upperLit:k!==0});
  chimney(S,9.4,24.8,46.8,2.1,1.9,2,745);chimney(S,19.6,24.8,46.8,2.1,1.9,2,746);
  downpipe(S,10.3,30.15,37.4);downpipe(S,30.9,30.15,37.4);
  // Low privy, coal store and drying line in the exposed right-hand rear yard.
  S.box(27.6,30.2,4.5,7.3,0,8.3,(i,j,z)=>vwBrick006(false,747)(i,z),(i,j,z)=>vwBrick006(true,748)(j,z),P.roofR[0]);
  S.poly([[27.4,4.3,8.2],[30.4,4.3,8.2],[30.4,7.5,9.6],[27.4,7.5,9.6]],tileRoof(false,749,'i'));
  vwPlainDoor006(S,S.face([27.6,7.3],[30.2,7.3]),.5,.2,1.6,6.5,{col:C('665f4e')});
  vwLaundry006(S,[26.9,9.2],[30.3,15.2],7.1);
  S.box(28.1,30.3,17.1,19.2,0,2.5,C('6a6455'),C('4e5147'),C('414841'));
  vwPot006(S,26.7,19.7,false);
  return S.finish();
}

function workersCourt006(spec) {
  const S=Scene(spec);vwWorkersBase006(S,760);
  // A compact urban back-to-back court. The street range's outer homes face
  // j=30 and its inner homes face j=22.7, sharing their rear wall at j=26.35.
  // The side pairs share a rear wall at i=5.05; their visible doors face the court.
  // A north range and low washhouse enclose the yard without filling its access.
  const BF=S.face([.7,10.2],[24.0,10.2]),BR=S.face([24.0,2.0],[24.0,10.2]);
  vwWorkersFace006(S,BF,23.3,761,{h:38.7});vwWorkersFace006(S,BR,8.2,762,{h:38.7,right:true});
  vwRoof006(S,.6,24.4,1.6,10.6,38.9,9.8,763,{gable:vwBrick006(true,764)});
  for(const [k,u]of [1.2,12.1].entries()){
    vwPlainDoor006(S,BF,u,.4,2.8,15.5,{col:k?C('64715f'):C('536859'),glazed:true});
    vwCottageWindow006(S,BF,u+4.5,4.7,4.1,10.4,{curtain:true});
    vwCottageWindow006(S,BF,u+3.0,24.6,4.4,10.5,{lit:k===1});
  }
  chimney(S,10.5,5.0,47.6,2.3,2.1,2,765);
  const LF=S.face([.7,23.1],[9.4,23.1]),LR=S.face([9.4,10.0],[9.4,23.1]);
  vwWorkersFace006(S,LF,8.7,766,{h:32});vwWorkersFace006(S,LR,13.1,767,{h:32,right:true});
  vwRoof006(S,.6,9.8,9.7,23.4,32.2,8.4,768,{axis:'j',gable:vwBrick006(false,769)});
  vwPlainDoor006(S,LR,2.0,.4,2.6,14.3,{right:true,col:C('677361'),glazed:true});
  vwCottageWindow006(S,LR,6.3,4.8,3.8,9.0,{right:true});
  vwCottageWindow006(S,LR,5.6,22.0,3.8,7.3,{right:true,lit:false});
  const F=S.face([.65,30.0],[31.35,30.0]),R=S.face([31.35,22.7],[31.35,30]);
  // A real rectangular cut-out under a segmental arch opens the covered passage.
  const openingA=24.0,openingB=28.7;
  F.panel(0,30.7,0,37.6,(u,z)=>{
    if(u>openingA&&u<openingB&&z<14.7)return null;
    return vwBrick006(false,770)(u,z);
  },0);
  R.panel(0,7.3,0,37.6,vwBrick006(true,771),0);
  const CF=S.face([31.35,22.7],[.65,22.7]);
  CF.panel(0,30.7,0,37.6,(u,z)=>{
    // The same passage is open at both ends, while the adjacent homes have
    // independent court doors. These rear openings obey ordinary roof occlusion.
    if(u>2.0&&u<6.7&&z<14.7)return null;
    return vwBrick006(true,782)(u,z);
  },0);
  for(const u of [8.1,18.7]){
    vwPlainDoor006(S,CF,u,.4,2.7,15.3,{right:true,col:C('596855'),glazed:true});
    vwCottageWindow006(S,CF,u+4.4,5.0,3.9,10.1,{right:true,lit:false});
    vwCottageWindow006(S,CF,u+2.4,24.7,4.1,10.0,{right:true,lit:false});
  }
  S.flat(.65,31.35,22.7,30,37.6,P.brickR[0]);
  vwRoof006(S,.6,31.4,22.3,30.25,37.8,9.7,772,{gable:vwBrick006(true,773)});
  for(const u of [.2,10.6])vwWorkerAddress006(S,F,u,{upperLit:u<1});
  vwCottageWindow006(S,F,24.25,25.0,4.5,9.9,{lit:true});
  // Tunnel walls and a dark soffit, not an opaque door painted over a facade.
  S.wall([24.65,22.7],[24.65,30],0,14.7,C('6c5548'),0);
  S.wall([29.35,22.7],[29.35,30],0,14.7,C('8a6852'),0);
  S.flat(24.65,29.35,22.7,30,14.7,C('493f38'),-.02);
  F.panel(openingA-.3,openingB+.3,14.7,17.5,(u,z)=>{
    const x=u-.3,half=(openingB-openingA)/2,top=2.5*Math.sqrt(Math.max(0,1-((x-half)/half)**2));
    return z<top?C('655044'):C('9e6d54');
  },.14);
  F.panel(0,30.7,35.8,36.8,C('98644f'),.1);
  chimney(S,10.2,25.1,46.7,2.25,1.9,2,774);
  downpipe(S,20.8,30.15,37.4);
  // Small shared brewhouse / washhouse has a chimney, sink and drying yard.
  const W=S.face([25.4,11.0],[31.0,11.0]),WR=S.face([31,3.2],[31,11]);
  W.panel(0,5.6,0,12.0,vwBrick006(false,775),0);WR.panel(0,7.8,0,12.0,vwBrick006(true,776),0);
  vwRoof006(S,25.0,31.35,2.8,11.4,12.2,5.3,777,{axis:'j',gable:vwBrick006(false,778)});
  vwPlainDoor006(S,W,1.6,.3,2.5,9.9,{col:C('6a6e5c')});
  chimney(S,28.0,4.0,16.0,1.3,1.4,1,779);
  S.box(26.4,28.9,13.0,14.7,0,2.8,C('a7a28b'),C('827f6e'),C('646d65'));
  S.line([29.7,13.7,0],[29.7,13.7,6.0],P.iron,1);
  S.line([29.7,13.7,5.9],[28.9,13.7,5.9],P.ironHi,1);
  vwLaundry006(S,[17.2,12.3],[24.4,15.1],7.8);
  vwGardenWall006(S,[31.1,12.0],[31.1,20.3],3.2,780,false);
  return S.finish();
}

function workersCornerShop006(spec) {
  const S=Scene(spec);vwWorkersBase006(S,800);
  // Housing continues across the street frontage; only the narrow corner bay is
  // a shop. The separate stair door and stepped rear wing make its homes explicit.
  const LF=S.face([.65,30],[19.2,30]),LR=S.face([19.2,18.2],[19.2,30]);
  vwWorkersFace006(S,LF,18.55,801);vwWorkersFace006(S,LR,11.8,802,{right:true});
  vwRoof006(S,.6,19.5,17.8,30.25,37.8,9.7,803,{gable:vwBrick006(true,804)});
  vwWorkerAddress006(S,LF,.05,{col:C('556d62'),upperLit:false});
  vwPlainDoor006(S,LF,13.7,.45,3.1,16.8,{col:C('565f55'),glazed:true});
  vwCottageWindow006(S,LF,12.1,24.1,4.5,10.4,{curtain:true});
  // Two occupied upper rooms over the shop, not a freestanding high-street hall.
  const F=S.face([19.2,30],[31.35,30]),R=S.face([31.35,17.3],[31.35,30]);
  F.panel(0,12.15,0,42.2,vwBrick006(false,805),0);R.panel(0,12.7,0,42.2,vwBrick006(true,806),0);
  vwRoof006(S,18.9,31.4,16.9,30.25,42.4,10.6,807,{gable:vwBrick006(true,808)});
  const green=C('425e51'),greenR=C('324a40'),trim=C('849080');
  F.panel(.2,11.95,1.0,18.5,green,.11);R.panel(5.3,12.5,1,18.5,greenR,.11);
  windowOn(S,F,.75,4.5,6.6,12.3,{panes:3,transom:9.1,lit:true,border:.34});
  F.panel(.6,7.5,1.0,4.2,greenR,.24);
  vwPlainDoor006(S,F,8.1,.4,3.15,16.4,{col:green,glazed:true});
  windowOn(S,R,6.0,4.5,5.7,12.3,{right:true,panes:3,transom:9.1,lit:true,border:.34});
  R.panel(5.8,12,1,4.2,greenR,.24);
  // Small shop fascia turns the corner in its own facade planes.
  F.panel(0,12.15,18.0,21.5,green,.2);R.panel(5.0,12.7,18.0,21.5,greenR,.2);
  F.panel(0,12.15,21.1,21.8,trim,.3);R.panel(5.0,12.7,21.1,21.8,C('69796c'),.3);
  letters(F,'STORES',1.1,18.6,.40,C('d2c299'));
  for(const u of [1.4,7.2])vwCottageWindow006(S,F,u,27.0,3.8,10.7,{curtain:true,lit:u<2});
  for(const u of [1.1,7.6])vwCottageWindow006(S,R,u,27.0,3.6,10.7,{right:true,lit:u>5});
  // Lower rear domestic wing, plus a real back entrance onto the side street.
  const WF=S.face([22.3,17.5],[31.35,17.5]),WR=S.face([31.35,5.0],[31.35,17.5]);
  WF.panel(0,9.05,0,25.7,vwBrick006(false,809),0);WR.panel(0,12.5,0,25.7,vwBrick006(true,810),0);
  vwRoof006(S,21.9,31.4,4.6,17.9,25.9,8.8,811,{axis:'j',gable:vwBrick006(false,812)});
  vwPlainDoor006(S,WR,1.2,.4,2.9,14.4,{right:true,col:C('5c6b5b'),glazed:true});
  vwCottageWindow006(S,WR,6.6,6.0,3.8,10.0,{right:true,lit:false});
  chimney(S,9.2,22.9,46.5,2.2,2.0,2,813);
  chimney(S,26.1,22.9,51.9,2.1,2.1,2,814);
  chimney(S,25.9,7.6,33.8,1.7,1.7,1,815);
  downpipe(S,19.1,30.15,37.4);downpipe(S,31.25,18.0,41.8);
  // A restrained doorstep display leaves both streets and the stair door clear.
  S.box(20.2,22.1,30.1,31.0,0,2.4,C('8e7858'),C('705e48'),C('89905f'));
  lamp(S,30.8,30.3,2.8,19.1);
  vwGardenWall006(S,[20.5,2.1],[20.5,15.3],3.1,816,false);
  vwGate006(S,[20.5,2.1],[26.0,2.1],3.1);
  return S.finish();
}

  const builders={UKR01:georgianRow006,UKR02:georgianCorner006,UKR03:georgianEnd006,UKR04:georgianArea006,UKR05:victorianGabledSemi006,UKR06:victorianBayVilla006,UKR07:victorianGardenVilla006,UKR08:victorianGothicVilla006,UKR09:stoneCottagePair006,UKR10:brickCatslideCottage006,UKR11:courtyardCottages006,UKR12:thatchedLongCottage006,UKR13:workersNarrowRow006,UKR14:workersYardTerrace006,UKR15:workersCourt006,UKR16:workersCornerShop006};
  function build(id){const s=specs.find(q=>q.id===id);if(!s)throw Error('Unknown residential building: '+id);return builders[id](s);}
  root.ResidentialArchitecture006=Object.freeze({version:'UKR-art-r1',specs,build,buildAll:()=>specs.map(s=>builders[s.id](s))});
})(window);
