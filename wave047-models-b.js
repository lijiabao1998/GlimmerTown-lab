  // Wave047 B: new authored structural bodies, not historical model dispatches.
  // A closed prism extruded along x; yz is a simple counter-clockwise section.
  function b47XPrism(A,x0,x1,yz,kind='wood'){
    const {S}=A,L=yz.map(p=>[x0,p[0],p[1]]),R=yz.map(p=>[x1,p[0],p[1]]);
    S.poly(L,A.mat(kind,-1,0));S.poly(R.slice().reverse(),A.mat(kind,1,0));
    for(let i=0;i<yz.length;i++){
      const j=(i+1)%yz.length,p=yz[i],q=yz[j],dy=q[0]-p[0],dz=q[1]-p[1];
      const m=Math.abs(dy)<1e-9?A.mat(kind,0,dz>0?-1:1):dz===0?(dy>0?A.P.woodR:A.P.woodHi):A.mat(kind,0,dy>0?-1:1);
      S.poly([L[i],L[j],R[j],R[i]],m);
    }
  }
  function b47YPrism(A,y0,y1,xz,kind='wood'){
    const {S}=A,F=xz.map(p=>[p[0],y0,p[1]]),B=xz.map(p=>[p[0],y1,p[1]]);
    S.poly(F,A.mat(kind,0,-1));S.poly(B.slice().reverse(),A.mat(kind,0,1));
    for(let i=0;i<xz.length;i++){const j=(i+1)%xz.length;S.poly([F[i],F[j],B[j],B[i]],A.mat(kind,xz[j][0]===xz[i][0]?(xz[j][1]>xz[i][1]?-1:1):0,0));}
  }
  function b47SolidBox(A,x0,x1,y0,y1,z0,z1,kind='wood'){
    const F=A.volume(x0,x1,y0,y1,z0,z1,kind,false);
    A.S.flat(x0,x1,y0,y1,z0,A.P.woodR);A.S.flat(x0,x1,y0,y1,z1,kind==='stone'?A.P.stoneHi:A.P.woodHi);
    return F;
  }
  function b47SlopingWindow(A,F,u0,u1,z0,z1,h){
    const q=[[u0,z0],[u1,z1],[u1,z1+h],[u0,z0+h]],cx=(u0+u1)/2;
    A.S.poly(q.map(p=>F.point(p[0],.13,p[1])),A.P.stoneHi);
    const inner=[[u0+.18,z0+.18],[u1-.18,z1+.18],[u1-.18,z1+h-.18],[u0+.18,z0+h-.18]];
    A.S.poly(inner.map(p=>F.point(p[0],.24,p[1])),[A.dark(F.nx,F.ny)?A.P.glassR:A.P.glass,A.P.warm]);
    A.S.beam(F.point(cx,.32,(z0+z1)/2+.1),F.point(cx,.32,(z0+z1)/2+h-.1),A.P.frame,.15);
  }

  function catmintbridge(row,view){
    const A=context(row,view),{S,P}=A,x0=10,x1=22,y0=2,join0=12,join1=20,y1=30,low=.65,high=8.65;
    // Each tread has real contrasting riser faces and a solid projecting nose.
    // Covered timber stays in the original wood palette; world normals decide
    // its light/dark face, never screen direction or a score-dependent branch.
    function stairTread(yz){
      const L=yz.map(p=>[11,p[0],p[1]]),R=yz.map(p=>[21,p[0],p[1]]);
      S.poly(L,A.mat('wood',-1,0));S.poly(R.slice().reverse(),A.mat('wood',1,0));
      for(let k=0;k<yz.length;k++){
        const j=(k+1)%yz.length,a=yz[k],b=yz[j],dy=b[0]-a[0],dz=b[1]-a[1];
        const material=Math.abs(dy)<1e-9?(A.dark(0,dz>0?-1:1)?P.woodD:P.woodR):Math.abs(dz)<1e-9?P.woodHi:P.woodD;
        S.poly([L[k],L[j],R[j],R[k]],material);
      }
    }
    function treadNose(y,z,reverse){
      const ya=y-(reverse?.16:.20),yb=y+(reverse?.20:.16),bottom=z-.38;
      S.flat(11,21,ya,yb,z,P.woodHi);S.flat(11,21,ya,yb,bottom,P.woodD);
      S.wall([11,ya],[21,ya],bottom,z,A.dark(0,-1)?P.woodD:P.woodR);
      S.wall([11,yb],[21,yb],bottom,z,A.dark(0,1)?P.woodD:P.woodR);
      S.wall([11,ya],[11,yb],bottom,z,A.dark(-1,0)?P.woodD:P.woodR);
      S.wall([21,ya],[21,yb],bottom,z,A.dark(1,0)?P.woodD:P.woodR);
    }
    // Four slender load-bearing piers carry the level central floor. No anchor rooms.
    for(const [xa,xb]of[[10,11.4],[20.6,22]])for(const [ya,yb]of[[12,13.2],[18.8,20]]){
      b47SolidBox(A,xa,xb,ya,yb,.42,8.15,'stone');
      b47SolidBox(A,xa-.18,xb+.18,ya-.18,yb+.18,.42,1.15,'stone');
    }
    b47SolidBox(A,x0,x1,join0,join1,8.15,high,'wood');
    // The centre is enclosed along both long sides, with real open landing bays
    // at each end. Their lintels do not fill the space below the gallery floor.
    for(const [xa,xb]of[[10,11],[21,22]]){
      b47SolidBox(A,xa,xb,14,18,high,16.8,'wood');
      for(const [ya,yb]of[[12,14],[18,20]])b47SolidBox(A,xa,xb,ya,yb,14.4,16.8,'wood');
      for(const y of[12,13.75,18,19.75])b47SolidBox(A,xa,xb,y,y+.25,high,14.4,'wood');
    }
    for(const x of[10,22]){
      const F=face(A,[x,12],[x,20],x===10?-1:1,0);
      A.pane(F,2.65,10.4,2.7,3.2,'mullion',true);
    }
    // Eight actual stepped tread solids per opposed run, carried by a continuous
    // sloping underside. The lowest threshold is grounded; the high tread meets
    // the central floor exactly. The under-stair wedge is intentionally NOT filled.
    for(const reverse of[false,true]){
      const Y=s=>reverse?30-s:2+s, Z=s=>low+.8*s;
      for(let i=0;i<8;i++){
        const a=i*1.25,b=(i+1)*1.25,za=Z(a),zb=Z(b),ya=Y(a),yb=Y(b);
        const section=ya<yb?[[ya,za-.5],[yb,zb-.5],[yb,zb],[ya,zb]]:[[yb,zb-.5],[ya,za-.5],[ya,zb],[yb,zb]];
        stairTread(section);treadNose(ya,zb,reverse);
      }
      // Enclosed descending side walls are finite-thickness sloping prisms.
      const ya=Math.min(Y(0),Y(10)),yb=Math.max(Y(0),Y(10)),za=reverse?high:low,zb=reverse?low:high;
      for(const [xa,xb]of[[10,11],[21,22]])b47XPrism(A,xa,xb,[[ya,za-.5],[yb,zb-.5],[yb,zb+8.15],[ya,za+8.15]],'wood');
      for(const x of[10,22]){
        const F=face(A,[x,ya],[x,yb],x===10?-1:1,0);
        for(const u of[1.1,4.0,6.9]){
          const base=u=>reverse?high-.8*u:low+.8*u;
          b47SlopingWindow(A,F,u,u+2,base(u)+3.4,base(u+2)+3.4,1.65);
        }
      }
      const startY=Y(0),endY=Y(10),lowEave=8.8,highEave=16.8;
      // Two planar gabled slopes follow each stair rise. No level plank roof.
      roofShell(A,[[9.7,startY,lowEave],[16,startY,12],[16,endY,20],[9.7,endY,highEave]]);
      roofShell(A,[[16,startY,12],[22.3,startY,lowEave],[22.3,endY,highEave],[16,endY,20]]);
      S.beam([16,startY,12.04],[16,endY,20.04],P.lead,.28);
      // Open end portal: thick jambs, physical lintel and closed triangular head.
      const py0=reverse?29.4:2,py1=reverse?30:2.6;
      b47SolidBox(A,10,11,py0,py1,.42,8.4,'wood');b47SolidBox(A,21,22,py0,py1,.42,8.4,'wood');
      b47SolidBox(A,11,21,py0,py1,7.0,8.4,'wood');
      b47YPrism(A,py0,py1,[[9.7,8.4],[22.3,8.4],[16,11.6]],'wood');
      const fy0=reverse?30:1.1,fy1=reverse?30.9:2;
      b47SolidBox(A,10.8,21.2,fy0,fy1,.42,.65,'stone');
    }
    // A level complete gable joins the sloping roofs at exactly the high eaves.
    roofShell(A,[[9.7,12,16.8],[16,12,20],[16,20,20],[9.7,20,16.8]]);
    roofShell(A,[[16,12,20],[22.3,12,16.8],[22.3,20,16.8],[16,20,20]]);
    S.beam([16,12,20.04],[16,20,20.04],P.lead,.28);
    const finished=A.finish();return {...finished,details:{...(finished.details||{}),originalDesign:true,newModelBody:true}};
  }

  function periwinklebell(row,view){
    const A=context(row,view),{S,P}=A;
    // A low square masonry room, with an actually recessed ground door.
    b47SolidBox(A,7,25,7,8,.6,11,'stone');
    b47SolidBox(A,7,8,8,25,.6,11,'stone');b47SolidBox(A,24,25,8,25,.6,11,'stone');
    b47SolidBox(A,8,13.5,24,25,.6,11,'stone');b47SolidBox(A,18.5,24,24,25,.6,11,'stone');
    b47SolidBox(A,13.5,18.5,24,25,7.6,11,'stone');
    b47SolidBox(A,7,25,7,25,.42,.6,'stone');S.flat(8,24,8,24,10.95,P.woodR);
    solidDoor(A,face(A,[13.5,24],[18.5,24],0,1),0,.6,5,7,'wood');
    A.steps(13.5,18.5,25,27.5,.18,2);
    const faces=[face(A,[7,25],[25,25],0,1),face(A,[25,7],[7,7],0,-1),face(A,[7,7],[7,25],-1,0),face(A,[25,25],[25,7],1,0)];
    for(const F of faces){
      for(const u of[2.0,13.6]){A.pane(F,u,6.7,2.4,3.1,'arch',false);louver(A,F,u+.15,6.95,2.1,2.05);}
    }
    // Modest visible lit work lights belong to real solid side/rear masonry.
    for(const F of faces.slice(1))A.pane(F,7.5,2.3,3,3,'mullion',true);
    // Four broad triangular broaches resolve the square eaves into an octagonal
    // pyramid WITHOUT an intermediate drum. Cardinal lower trapezoids are
    // coplanar with their corresponding upper spire faces.
    const z0=11.4,z1=14.4,peak=[16,16,35],inset=9*(z1-z0)/(peak[2]-z0),lo=7+inset,hi=25-inset;
    const q=[[7,7,z0],[25,7,z0],[25,25,z0],[7,25,z0]];
    const r=[[12,lo,z1],[20,lo,z1],[hi,12,z1],[hi,20,z1],[20,hi,z1],[12,hi,z1],[lo,20,z1],[lo,12,z1]];
    for(let i=0;i<4;i++){
      const a=2*i,b=2*i+1,next=(2*i+2)%8,corner=(i+1)%4;
      roofSheet(A,[q[i],q[corner],r[b],r[a]],.4);
      roofSheet(A,[q[corner],r[next],r[b]],.4);
      // The broach seam is physical roof edging, not an opaque painted triangle.
      S.beam(q[corner],r[b],P.lead,.18);S.beam(q[corner],r[next],P.lead,.18);
      fascia(A,q[i],q[corner],.4);
    }
    for(let i=0;i<8;i++)roofSheet(A,[r[i],r[(i+1)%8],peak],.4);
    const finished=A.finish();return {...finished,details:{...(finished.details||{}),originalDesign:true,newModelBody:true}};
  }
  // Wave047 originals. These helpers make closed world-space solids; they do
  // not call any historical building body or draw screen-space void masks.
  function bSolid(A,x0,x1,y0,y1,z0,z1,kind,top){
    const F=A.volume(x0,x1,y0,y1,z0,z1,kind,false);
    A.S.flat(x0,x1,y0,y1,z1,top===undefined?A.P.stoneHi:top);
    A.S.flat(x0,x1,y0,y1,z0,kind==='wood'?A.P.woodR:A.P.stoneD);
    return F;
  }
  function bFaceSolid(A,F,u0,u1,d0,d1,z0,z1,kind,top){
    const a=F.point(u0,d0,0),b=F.point(u1,d1,0);
    return bSolid(A,Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1]),z0,z1,kind,top);
  }
  function bDoor(A,F,u0,u1,z0,z1){
    const {S,P}=A;
    bFaceSolid(A,F,u0,u1,0,.24,z0,z1,'wood',P.woodHi);
    for(let u=u0+.72;u<u1;u+=.72)S.beam(F.point(u,.27,z0+.1),F.point(u,.27,z1-.1),P.woodD,.10);
    for(const z of[z0+(z1-z0)*.28,z0+(z1-z0)*.73]){
      S.beam(F.point(u0+.12,.34,z),F.point(u1-.12,.34,z),P.woodR,.26);
    }
    S.beam(F.point((u0+u1)/2,.35,z0),F.point((u0+u1)/2,.35,z1),P.woodD,.18);
    for(const u of[(u0+u1)/2-.28,(u0+u1)/2+.28])S.beam(F.point(u,.42,z0+(z1-z0)*.45),F.point(u,.42,z0+(z1-z0)*.45+.48),P.ironD,.18);
  }
  function bSlopedSolid(A,x0,x1,y0,y1,z0,h0,h1,kind,top){
    const {S,P}=A;
    const q=[[x0,y0,h0],[x1,y0,h0],[x1,y1,h1],[x0,y1,h1]];
    S.poly(q,top===undefined?P.stoneHi:top);
    S.flat(x0,x1,y0,y1,z0,kind==='wood'?P.woodR:P.stoneD);
    S.wall([x1,y0],[x0,y0],z0,h0,A.mat(kind,0,-1));
    S.wall([x0,y1],[x1,y1],z0,h1,A.mat(kind,0,1));
    for(const [x,nx]of[[x0,-1],[x1,1]])S.poly([[x,y0,z0],[x,y1,z0],[x,y1,h1],[x,y0,h0]],A.mat(kind,nx,0));
  }
  function bXPrism(A,x0,x1,section,kind){
    const {S}=A;
    for(const [x,nx]of[[x0,-1],[x1,1]])S.poly(section.map(p=>[x,p[0],p[1]]),A.mat(kind,nx,0));
    for(let i=0;i<section.length;i++){
      const a=section[i],b=section[(i+1)%section.length];
      S.poly([[x0,a[0],a[1]],[x1,a[0],a[1]],[x1,b[0],b[1]],[x0,b[0],b[1]]],A.mat(kind,0,b[1]>=a[1]?-1:1));
    }
  }
  function bArchSpandrel(A,x0,x1,y0,y1,spring,rise,top){
    const {S,P}=A,c=(x0+x1)/2,r=(x1-x0)/2,n=16;
    const at=i=>{const t=Math.PI-i*Math.PI/n;return[c+r*Math.cos(t),spring+rise*Math.sin(t)];};
    for(let i=0;i<n;i++){
      const a=at(i),b=at(i+1);
      for(const [y,ny]of[[y0,-1],[y1,1]])S.poly([[a[0],y,a[1]],[b[0],y,b[1]],[b[0],y,top],[a[0],y,top]],A.mat('stone',0,ny));
      // The curved soffit is the actual underside of a 1.25-unit-deep arch.
      S.poly([[a[0],y0,a[1]],[b[0],y0,b[1]],[b[0],y1,b[1]],[a[0],y1,a[1]]],P.stoneD);
      S.flat(a[0],b[0],y0,y1,top,P.stoneHi);
    }
    for(const x of[x0,x1])S.poly([[x,y0,spring],[x,y1,spring],[x,y1,top],[x,y0,top]],A.mat('stone',x===x0?-1:1,0));
  }
  function bRoundSolid(A,cx,cy,z0,z1,r0,r1,n){
    const {S,P}=A,lo=[],hi=[];
    for(let i=0;i<n;i++){
      const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n,m=(a+b)/2;
      const p=[cx+r0*Math.cos(a),cy+r0*Math.sin(a),z0],q=[cx+r0*Math.cos(b),cy+r0*Math.sin(b),z0];
      const r=[cx+r1*Math.cos(b),cy+r1*Math.sin(b),z1],s=[cx+r1*Math.cos(a),cy+r1*Math.sin(a),z1];
      S.poly([p,q,r,s],A.mat('stone',Math.cos(m),Math.sin(m)));lo.push(p);hi.push(s);
    }
    S.poly(lo,P.stoneD);S.poly(hi,P.stoneHi);
  }
  function bHipShell(A,x0,x1,y0,y1,eave,rise){
    const {S,P}=A,cx=(x0+x1)/2,t=Math.min((x1-x0)/2,(y1-y0)/3),a=[cx,y0+t,eave+rise],b=[cx,y1-t,eave+rise];
    const q=[[x0,y0,eave],[x1,y0,eave],[x1,y1,eave],[x0,y1,eave]];
    for(const p of[[q[0],q[1],a],[q[1],q[2],b,a],[q[2],q[3],b],[q[3],q[0],a,b]])roofSheet(A,p,.55);
    for(let i=0;i<4;i++)fascia(A,q[i],q[(i+1)%4],.55);
    for(const p of[[q[0],a],[q[1],a],[q[2],b],[q[3],b],[a,b]])S.beam(p[0],p[1],P.lead,.25);
  }

  function campionbarn(row,view){
    const A=context(row,view),{S,K,P}=A;
    const x0=3.5,x1=28.5,y0=16,y1=29.5,floor=10,soffit=9.4;
    const roofY0=15.2,roofY1=30.3,cy=22.75,eave=20.6,rise=6.9,thick=.55;
    const wallTop=eave+rise*(y0-roofY0)/(cy-roofY0)-thick;
    // Actual sheltered inner masonry faces receive recess shading. No dark
    // face is placed across an arch mouth: all openings and depths stay empty.
    function lowerWall(xa,xb,ya,yb,inside){
      const z0=.65,z1=soffit;
      S.wall([xa,yb],[xb,yb],z0,z1,inside==='front'?P.stoneD:A.mat('stone',0,1));
      S.wall([xb,ya],[xa,ya],z0,z1,A.mat('stone',0,-1));
      S.wall([xa,ya],[xa,yb],z0,z1,inside==='left'?(A.dark(-1,0)?P.stoneD:P.stoneR):A.mat('stone',-1,0));
      S.wall([xb,yb],[xb,ya],z0,z1,inside==='right'?(A.dark(1,0)?P.stoneD:P.stoneR):A.mat('stone',1,0));
      S.flat(xa,xb,ya,yb,z0,P.stoneD);S.flat(xa,xb,ya,yb,z1,P.stoneHi);
    }
    // A closed, asset-owned bank rises 9.55 over 12.7, then has a 1.8-unit
    // level landing. Its entire top meets the upper floor, not the undercroft.
    const earth=(x,y,z)=>K.hash(Math.floor(x*1.8),Math.floor(y*1.8),47061)%13===0?P.woodD:P.soil;
    bSlopedSolid(A,7,25,1.5,14.2,.43,.45,floor,'stone',earth);
    bSolid(A,7,25,14.2,y0,.43,floor,'stone',earth);
    for(const [a,b]of[[6.3,7],[25,25.7]]){
      bSlopedSolid(A,a,b,1.5,14.2,.43,.60,floor+.15,'stone',P.stoneR);
      bSolid(A,a,b,14.2,y0,.43,floor+.15,'stone',P.stoneR);
    }
    // Stone side/rear walls and three thick curved front arches enclose a
    // deep, empty lower room. There is no opaque front rectangle to mask.
    bSolid(A,x0,x1,y0,y1,.43,.65,'stone',P.stoneD);
    // Closed stone flags sit ON the real lower floor. Their finite raised edges
    // and narrow recessed joints reveal the floor's depth through the tall
    // openings; no colour or opaque geometry is placed across an arch mouth.
    for(let i=0;i<6;i++)for(let j=0;j<4;j++){
      const xa=4.85+i*3.7,xb=xa+3.5,ya=17.35+j*2.95,yb=ya+2.65;
      S.flat(xa,xb,ya,yb,.65,P.stoneD);S.flat(xa,xb,ya,yb,.9,P.stoneR);
      S.wall([xa,ya],[xb,ya],.65,.9,P.stoneD);S.wall([xa,yb],[xb,yb],.65,.9,P.stoneD);
      S.wall([xa,ya],[xa,yb],.65,.9,P.stoneD);S.wall([xb,ya],[xb,yb],.65,.9,P.stoneD);
    }
    lowerWall(x0,4.65,y0,y1,'right');
    lowerWall(27.35,x1,y0,y1,'left');
    lowerWall(4.65,27.35,y0,17.15,'front');
    for(const [a,b]of[[3.5,5],[11.3,12.8],[19.2,20.7],[27,28.5]])bSolid(A,a,b,27.25,y1,.65,soffit,'stone');
    for(const [a,b]of[[5,11.3],[12.8,19.2],[20.7,27]])bArchSpandrel(A,a,b,27.25,y1,5.4,3.4,soffit);
    bSolid(A,x0,x1,y0,y1,soffit,floor,'wood',P.woodHi);
    for(const x of[8.15,16,23.85])bSolid(A,x-.24,x+.24,17.15,27.25,8.95,soffit,'wood',P.woodR);
    // The upper barn is enclosed by real 0.75-unit timber walls, with an
    // actual framed rear loading aperture closed by a solid timber leaf.
    const front=bSolid(A,x0,x1,28.75,y1,floor,wallTop,'wood',P.woodHi).front;
    const left=bSolid(A,x0,4.25,y0,28.75,floor,wallTop,'wood',P.woodHi).left;
    const right=bSolid(A,27.75,x1,y0,28.75,floor,wallTop,'wood',P.woodHi).right;
    bSolid(A,4.25,12.2,y0,16.75,floor,wallTop,'wood',P.woodHi);
    bSolid(A,19.8,27.75,y0,16.75,floor,wallTop,'wood',P.woodHi);
    bSolid(A,12.2,19.8,y0,16.75,19.8,wallTop,'wood',P.woodHi);
    const back=face(A,[x1,16.35],[x0,16.35],0,-1);
    bDoor(A,back,8.7,16.3,floor,19.8);
    bSolid(A,11.85,12.2,15.75,16.75,floor,20.15,'wood',P.woodHi);
    bSolid(A,19.8,20.15,15.75,16.75,floor,20.15,'wood',P.woodHi);
    bSolid(A,11.85,20.15,15.75,16.75,19.8,20.15,'wood',P.woodHi);
    bSolid(A,11.85,20.15,15.7,16.75,9.7,floor,'stone',P.stoneHi);
    for(const u of[3.5,10.9,18.3])A.pane(front,u,15.9,3.2,2.75,'rect',true);
    A.pane(left,4.2,14.5,3.2,3.5,'rect',true);
    A.pane(right,4.2,14.5,3.2,3.5,'rect',true);
    const rearFace=face(A,[x1,y0],[x0,y0],0,-1);
    for(const u of[2.1,19.6])A.pane(rearFace,u,15.9,3.2,2.75,'rect',true);
    // Thick triangular gable wall sections touch the underside of two
    // complete roof shells. Neither gable is an unbacked painted triangle.
    const gableSection=[[y0,wallTop],[y1,wallTop],[cy,eave+rise-thick]];
    bXPrism(A,x0,4.25,gableSection,'wood');
    bXPrism(A,27.75,x1,gableSection,'wood');
    roofShell(A,[[2.75,roofY0,eave],[29.25,roofY0,eave],[29.25,cy,eave+rise],[2.75,cy,eave+rise]],thick);
    roofShell(A,[[2.75,cy,eave+rise],[29.25,cy,eave+rise],[29.25,roofY1,eave],[2.75,roofY1,eave]],thick);
    S.beam([2.75,cy,eave+rise+.04],[29.25,cy,eave+rise+.04],P.lead,.32);
    for(const [x,nx]of[[x0,-1],[x1,1]]){
      const F=face(A,[x,20.7],[x,24.8],nx,0);
      // Plain small loft shutter, wholly inside and backed by its gable.
      bDoor(A,F,1.05,3.05,21.5,24.2);
    }
    const finished=A.finish();return {...finished,details:{...(finished.details||{}),originalDesign:true,newModelBody:true}};
  }

  function woodruffgrain(row,view){
    const A=context(row,view),{S,P}=A;
    const x0=7.5,x1=24.5,y0=4.5,y1=27,floor=5.7,underside=4.6,eave=15.4,wallTop=14.85;
    // Nine SHORT staddles lie on the actual outer wall lines. Exposed half-caps
    // keep their necks readable instead of hiding below an inset floor edge.
    // They remain much shorter than the squat 9.15-unit timber room above.
    for(const x of[7.5,16,24.5])for(const y of[4.5,15.6,27]){
      bRoundSolid(A,x,y,.45,3.5,.95,.8,12);
      bRoundSolid(A,x,y,3.5,underside,1.65,1.45,12);
    }
    // The same closed timber floor has actual shaded bearing edges and soffit.
    // Nothing is drawn below its underside or across the open ventilation gap.
    S.flat(x0,x1,y0,y1,underside,P.woodD);S.flat(x0,x1,y0,y1,floor,P.woodHi);
    S.wall([x0,y0],[x1,y0],underside,floor,A.dark(0,-1)?P.woodD:P.woodR);
    S.wall([x0,y1],[x1,y1],underside,floor,A.dark(0,1)?P.woodD:P.woodR);
    S.wall([x0,y0],[x0,y1],underside,floor,A.dark(-1,0)?P.woodD:P.woodR);
    S.wall([x1,y0],[x1,y1],underside,floor,A.dark(1,0)?P.woodD:P.woodR);
    // Full low air gap survives beneath the entire store. No plinth, hidden
    // lower room, continuous skirt or tall generic piles fill this gap.
    const left=bSolid(A,x0,8.15,y0,y1,floor,wallTop,'wood',P.woodHi).left;
    const right=bSolid(A,23.85,x1,y0,y1,floor,wallTop,'wood',P.woodHi).right;
    const back=bSolid(A,8.15,23.85,y0,5.15,floor,wallTop,'wood',P.woodHi).back;
    bSolid(A,8.15,11.2,26.35,y1,floor,wallTop,'wood',P.woodHi);
    bSolid(A,20.8,23.85,26.35,y1,floor,wallTop,'wood',P.woodHi);
    // Recessed SHORT-END porch: 9.6 wide, 4.2 clear depth, with solid
    // cheeks and an elevated continuous floor under the common hip roof.
    bSolid(A,10.55,11.2,22.1,y1,floor,wallTop,'wood',P.woodHi);
    bSolid(A,20.8,21.45,22.1,y1,floor,wallTop,'wood',P.woodHi);
    const porchBack=bSolid(A,11.2,20.8,22.1,22.8,floor,wallTop,'wood',P.woodHi).front;
    bSolid(A,x0,x1,y0,y1,14.4,wallTop,'wood',P.woodR);
    bDoor(A,porchBack,1.7,7.9,floor,11.8);
    for(const u of[1.35,7.9])bFaceSolid(A,porchBack,u,u+.35,0,.48,floor,12.2,'wood',P.woodHi);
    bFaceSolid(A,porchBack,1.35,8.25,0,.48,11.8,12.2,'wood',P.woodHi);
    // Five stone treads terminate precisely at the porch-floor elevation.
    for(let i=0;i<5;i++)bSolid(A,12.8,19.2,27,31-i*.8,.45,.45+(floor-.45)*(i+1)/5,'stone',P.stoneHi);
    for(const F of[left,right])for(const u of[5.4,12.5])A.pane(F,u,10.8,2.8,2.35,'rect',true);
    A.pane(back,6.35,10.8,2.8,2.35,'rect',true);
    bHipShell(A,x0,x1,y0,y1,eave,4.4);
    // Projecting timber eave bearing is structural and does not bridge the
    // porch mouth below its real ceiling.
    for(const y of[y0,y1])bSolid(A,7.25,24.75,y-.14,y+.14,14.55,14.85,'wood',P.woodHi);
    const finished=A.finish();return {...finished,details:{...(finished.details||{}),originalDesign:true,newModelBody:true}};
  }

  function speedwellseasoning(row,view){
    const A=context(row,view),{S,P}=A;
    const x0=3,x1=27,y0=10,y1=24.5,mid=11.1,under=10.3;
    const roofY0=9.2,roofY1=25.3,roofHigh=28,roofLow=22.8,thick=.55;
    const roofAt=y=>roofHigh+(roofLow-roofHigh)*(y-roofY0)/(roofY1-roofY0)-thick;
    // One solid rear and two thick end walls, with the front intentionally
    // absent at BOTH levels. Walls meet the actual sloping roof underside.
    bSolid(A,x0,x1,y0,y1,.43,.72,'stone',P.paveR);
    const rear=bSlopedSolid(A,x0,x1,y0,10.85,.72,roofAt(y0),roofAt(10.85),'brick',P.stoneR);
    bSlopedSolid(A,x0,3.85,10.85,y1,.72,roofAt(10.85),roofAt(y1),'brick',P.stoneR);
    bSlopedSolid(A,26.15,x1,10.85,y1,.72,mid,mid,'brick',P.stoneR);
    // Upper end doorway is genuinely cut out; landing joins both floor and
    // opening. No black rectangle or closed door hides the access geometry.
    bSlopedSolid(A,26.15,x1,10.85,11.25,mid,roofAt(10.85),roofAt(11.25),'brick',P.stoneR);
    bSlopedSolid(A,26.15,x1,14.25,y1,mid,roofAt(14.25),roofAt(y1),'brick',P.stoneR);
    bSlopedSolid(A,26.15,x1,11.25,14.25,18.7,roofAt(11.25),roofAt(14.25),'brick',P.stoneR);
    bSolid(A,x0,x1,y0,y1,under,mid,'wood',P.woodHi);
    // Four substantial full-height posts plus broad, unfilled front bays.
    // The intermediate floor has an exposed .8-unit front edge/underside.
    for(const x of[3.5,11.15,18.85,26.5]){
      bSolid(A,x-.55,x+.55,23.95,24.85,.72,roofAt(24.4),'wood',P.woodHi);
      for(const z of[under,roofAt(24.4)]){
        if(x>4)S.beam([x,24.4,z-2.6],[x-2.5,24.4,z-.12],P.woodR,.44);
        if(x<26)S.beam([x,24.4,z-2.6],[x+2.5,24.4,z-.12],P.woodR,.44);
      }
    }
    for(const x of[7.4,15.1,22.7])bSolid(A,x-.25,x+.25,10.85,23.95,9.85,under,'wood',P.woodR);
    for(const z of[11.75,13.15])S.beam([3.8,24.48,z],[26.2,24.48,z],P.woodR,.22);
    for(const x of[7.3,15,22.7])bSolid(A,x-.12,x+.12,24.36,24.60,mid,13.25,'wood',P.woodHi);
    // Deep upper and lower bays stay empty from front to the actual rear
    // wall (13.1 clear units), rather than a shallow balcony/dark panel.
    roofShell(A,[[2.2,roofY0,roofHigh],[27.8,roofY0,roofHigh],[27.8,roofY1,roofLow],[2.2,roofY1,roofLow]],thick);
    for(const x of[7.4,15.1,22.7])S.beam([x,10.1,roofAt(10.1)-.22],[x,24.5,roofAt(24.5)-.22],P.woodR,.45);
    // Exterior stone stair along the right end: twelve individual treads,
    // real risers and two inclined timber stringers; only its landing has
    // grounded supports. This is not another enclosed end-room mass.
    const stairY0=14.25,stairY1=30.0,n=12,run=(stairY1-stairY0)/n,step=(mid-.45)/n;
    for(let i=0;i<n;i++){
      const ya=stairY1-(i+1)*run,yb=stairY1-i*run,top=.45+(i+1)*step;
      bSolid(A,27.5,30.9,ya,yb,top-.34,top,'wood',P.woodHi);
      bSolid(A,27.5,30.9,yb-.17,yb,.45+i*step,top,'wood',P.woodR);
    }
    for(const x of[27.7,30.7])S.beam([x,30,.62],[x,14.25,10.65],P.woodR,.62);
    bSolid(A,26.15,30.9,11.25,14.25,10.4,mid,'wood',P.woodHi);
    for(const y of[11.65,13.85])bSolid(A,30.1,30.8,y-.3,y+.3,.45,10.4,'wood',P.woodHi);
    for(const x of[27.7,30.7]){
      S.beam([x,29.7,3.35],[x,14.45,13.1],P.woodD,.22);
      for(const i of[0,4,8,11]){
        const y=stairY1-(i+.5)*run,z=.45+(i+1)*step;
        bSolid(A,x-.12,x+.12,y-.12,y+.12,z,z+2.1,'wood',P.woodHi);
      }
    }
    S.beam([30.65,11.4,13.2],[30.65,14.35,13.2],P.woodD,.22);
    S.beam([27.6,11.4,13.2],[30.65,11.4,13.2],P.woodD,.22);
    const back=face(A,[x1,y0],[x0,y0],0,-1);
    for(const u of[3.4,10.8,18.2])A.pane(back,u,19.6,2.4,3.0,'rect',true);
    const finished=A.finish();return {...finished,details:{...(finished.details||{}),originalDesign:true,newModelBody:true}};
  }
