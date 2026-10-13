/* GPT-021 original British workplaces, candidate-only authored geometry.
 * No simulation, registry, save, RNG or approved-art mutation. Native office
 * and industrial block carriers are supplied by the separate preview adapter.
 * The medium industrial footprints are genuinely 2 x 1, centred within the
 * rasterizer's 2 x 2 rotation envelope; their unused ground remains transparent.
 */
(function(root){
  'use strict';
  const specs=Object.freeze([
    {id:'UKO021-S',nm:'街屋事務所',group:'office',scale:'S',sz:1,bw:1,bh:1,w:80,h:116,k:2,lv:1,tool:'office',floors:2,
      plan:'narrow-street-office-with-side-archive',roof:'short-gable-and-low-archive-shed',entry:'central-office-door',yard:'small-rear-document-delivery-yard',
      masses:[[1.3,12.3,3.3,13.7,.2,25.2],[12.5,14.7,4.1,9.4,.2,7.4]]},
    {id:'UKO021-M',nm:'轉角事務大樓',group:'office',scale:'M',sz:2,bw:2,bh:2,w:160,h:184,k:2,lv:1,tool:'office',floors:3,
      plan:'L-range-with-true-diagonal-corner-entrance',roof:'perpendicular-ridges-and-cut-corner-hip',entry:'diagonal-corner-lobby-and-rear-staff-door',yard:'open-inner-service-court',
      masses:[[1.8,25.4,19.6,29.4,.2,37.5],[25.4,29.4,19.6,25.4,.2,37.5],[1.8,10.7,2.8,19.6,.2,37.5]],
      polygons:[[[25.4,25.4],[29.4,25.4],[25.4,29.4]]]},
    {id:'UKO021-L',nm:'城鎮辦公院',group:'office',scale:'L',sz:3,bw:3,bh:3,w:232,h:244,k:2,lv:2,tool:'office',floors:4,
      plan:'two-four-storey-ranges-and-low-archive-around-open-court',roof:'two-hipped-ranges-and-low-shed-annex',entry:'two-street-lobbies-with-separate-service-drive',yard:'court-and-clear-right-hand-delivery-lane',
      masses:[[2.3,45.4,33.8,44.8,.2,49.5],[2.3,13.2,6.2,33.8,.2,49.5],[13.2,37.6,5.2,14.8,.2,13.2]]},
    {id:'UKC021-S',nm:'材料棚小工坊',group:'crafts',scale:'S',sz:1,bw:1,bh:1,w:80,h:108,k:3,lv:1,tool:'zi',floors:1,
      plan:'single-workroom-with-side-material-lean-to',roof:'one-gable-with-physical-rooflights-and-low-shed',entry:'separate-worker-and-wide-material-doors',yard:'rear-timber-rack',
      masses:[[1.2,10.9,3.3,13.6,.2,16.1],[11.1,14.7,4.4,10.7,.2,7.8]]},
    {id:'UKC021-M',nm:'橫向雙翼工坊',group:'crafts',scale:'M',sz:2,bw:2,bh:1,w:160,h:162,k:3,lv:1,tool:'zi',floors:2,
      plan:'rectangular-L-workhall-and-two-storey-office',roof:'long-low-gable-and-cross-ridge-office',entry:'court-facing-material-door-and-street-worker-lobby',yard:'front-working-court-and-covered-timber-rack',
      masses:[[1.6,20.2,9.4,16.0,.2,17.0],[20.2,29.7,9.4,22.6,.2,26.1]]},
    {id:'UKC021-L',nm:'穿堂搬運工坊院',group:'crafts',scale:'L',sz:2,bw:2,bh:2,w:160,h:182,k:3,lv:1,tool:'zi',floors:2,
      plan:'three-workshop-ranges-and-real-ground-level-cart-passage',roof:'three-separate-gables-at-two-heights',entry:'open-cart-passage-and-independent-worker-door',yard:'open-central-material-handling-court',
      masses:[[1.6,17.5,22.2,29.5,.2,26.0],[22.1,29.9,22.2,29.5,.2,26.0],[17.5,22.1,22.2,29.5,11.5,26.0],
        [1.6,10.1,3.7,22.2,.2,13.5],[10.1,29.9,3.7,10.2,.2,13.5]]},
    {id:'UKI021-S',nm:'高窗單廳輕工廠',group:'lightfactory',scale:'S',sz:1,bw:1,bh:1,w:80,h:116,k:3,lv:2,tool:'zi',floors:1,
      plan:'one-tall-industrial-hall-and-short-loading-apron',roof:'steep-end-gable-with-short-front-loading-canopy',entry:'separate-worker-and-wide-goods-doors',yard:'rear-drum-storage-and-front-loading-face',
      masses:[[1.3,14.5,3.2,13.5,.2,18.8]]},
    {id:'UKI021-M',nm:'雙鋸齒採光輕工廠',group:'lightfactory',scale:'M',sz:2,bw:2,bh:1,w:160,h:166,k:3,lv:2,tool:'zi',floors:2,
      plan:'rectangular-long-production-hall-with-office-end-wing',roof:'two-asymmetric-north-glazed-sawtooth-bays-and-office-hip',entry:'separate-production-loading-face-and-office-lobby',yard:'short-goods-apron-and-side-service-entry',
      masses:[[1.5,22.0,9.4,21.0,.2,14.7],[22.0,29.9,15.0,22.6,.2,26.0]]},
    {id:'UKI021-L',nm:'多層磚廠卸貨院',group:'lightfactory',scale:'L',sz:2,bw:2,bh:2,w:160,h:200,k:3,lv:2,tool:'zi',floors:3,
      plan:'three-storey-production-range-with-low-boiler-and-dispatch-wings',roof:'high-long-gable-low-boiler-hip-and-dispatch-gable',entry:'street-worker-lobby-and-court-facing-goods-doors',yard:'open-right-hand-delivery-court-with-physical-boiler-stack',
      masses:[[1.8,15.5,3.8,29.4,.2,37.0],[15.5,25.9,3.8,11.2,.2,13.4],[15.5,30.2,22.0,29.4,.2,14.8]]}
  ].map(q=>Object.freeze({...q,masses:Object.freeze(q.masses.map(a=>Object.freeze(a)))})));

  function build(id,view){
    const spec=specs.find(q=>q.id===id);if(!spec)throw Error('Unknown workplace candidate '+id);
    const kit=root.BritishUseScalesKit021;if(!kit)throw Error('Candidate architectural kit missing');
    const A=kit.create(spec,view),{S,K,P,C,walls,course,gable,hip,shed,windows,door,loading,chimney,crates,fence,canopy,lamps}=A;
    const industrial=spec.group!=='office';let explicitSmoke=null;
    const rect=spec.bw===2&&spec.bh===1;
    const bounds=rect?[.65,31.35,8.65,23.35]:[.65,A.extent-.65,.65,A.extent-.65];
    S.flat(...bounds,0,K.paving);
    function sills(F,levels){for(const z of levels)course(F,z);}
    function pipe(x,y,h){K.rainpipe(S,x,y,h);}
    function parapet(F,z){F.block(0,F.length,0,.3,z,z+.42,P.iron,P.ironD,P.ironHi);}
    function glazing(F,u,z,w,h,lit){
      // Factory metal casements are distinct from the office's sash windows.
      F.panel(u-.20,u+w+.20,z-.2,z+h+.25,P.stoneD,.08);
      F.panel(u,u+w,z,z+h,(x,y)=>{
        if(x<.2||x>w-.2||y<.2||y>h-.2||K.mod(x,1.65)<.12||K.mod(y,2.25)<.14)return P.ironHi;
        return lit!==false?[P.glass,P.warmD]:P.glassR;
      },.14);
      F.block(u-.3,u+w+.3,0,.48,z-.5,z-.12,P.stone,P.stoneR,P.stoneHi);
      F.block(u-.27,u+w+.27,0,.27,z+h+.24,z+h+.72,P.brick[1],P.brickR[1],P.stoneR);
    }
    function ironTie(F,u,z){F.panel(u-.07,u+.07,z-1.05,z+1.05,P.ironD,.16);F.panel(u-.7,u+.7,z-.10,z+.10,P.ironD,.17);}
    function timberRack(x0,x1,y0,y1,z){
      for(const x of[x0+.4,x1-.4])for(const y of[y0+.25,y1-.25])S.box(x-.13,x+.13,y-.13,y+.13,0,z+.4,P.wood,P.woodR,P.woodHi);
      for(let q=0;q<3;q++){
        const zz=.8+q*1.2;S.box(x0,x1,y0,y1,zz,zz+.4,P.woodHi,P.woodR,P.woodHi);
        for(let y=y0+.3;y<y1;y+=.62)S.beam([x0+.1,y,zz+.5],[x1-.1,y,zz+.5],P.wood,.24);
      }
    }
    function rooflight(x0,x1,y0,y1,roofY0,roofYC,z,rise){
      const height=y=>z+rise*(y-roofY0)/(roofYC-roofY0)+.07;
      S.poly([[x0,y0,height(y0)],[x1,y0,height(y0)],[x1,y1,height(y1)],[x0,y1,height(y1)]],P.glassHi,.03);
      for(const x of[x0,x1])S.beam([x,y0,height(y0)],[x,y1,height(y1)],P.frameR,.18);
      for(const y of[y0,y1])S.beam([x0,y,height(y)],[x1,y,height(y)],P.frameR,.18);
      for(let x=x0+1.8;x<x1;x+=1.8)S.beam([x,y0,height(y0)],[x,y1,height(y1)],P.ironHi,.16);
    }
    function sawtooth(x0,x1,y0,y1,z,rise){
      const ridge=y0+1.05;
      S.poly([[x0,y0,z],[x1,y0,z],[x1,ridge,z+rise],[x0,ridge,z+rise]],P.glassHi);
      S.poly([[x0,ridge,z+rise],[x1,ridge,z+rise],[x1,y1,z],[x0,y1,z]],K.slate(A.dark(0,1)));
      for(const x of[x0,x1])S.poly([[x,y0,z],[x,y1,z],[x,ridge,z+rise]],K.brick(A.dark(x===x0?-1:1,0),22709));
      for(let x=x0;x<=x1+.01;x+=3.4)S.beam([x,y0,z+.03],[x,ridge,z+rise+.03],P.ironHi,.18);
      S.beam([x0,ridge,z+rise+.05],[x1,ridge,z+rise+.05],P.lead,.33);
      S.beam([x0,y0,z],[x1,y0,z],P.ironD,.28);S.beam([x0,y1,z],[x1,y1,z],P.ironD,.28);
    }
    function drum(x,y,r){K.cylinder(S,x,y,.1,2.8,r,r,P.ironHi,P.ironD,P.ironHi,8);for(const z of[.6,2.1])K.cylinder(S,x,y,z,z+.16,r+.05,r+.05,P.lead,P.iron,P.lead,8);}
    function diagonalDoor(F,u,w,h){
      F.panel(u-.35,u+w+.35,.4,h+.5,P.stoneHi,.12);
      F.panel(u,u+w,.6,h,(x,y)=>{
        if(x<.2||x>w-.2||Math.abs(x-w/2)<.13||y<.2)return P.woodD;
        if(y>h*.72)return [P.glassHi,P.warm];
        return K.mod(y,3.0)<.2?P.woodD:P.wood;
      },.17);
      for(const b of[u-.35,u+w+.35])S.beam(F.point(b,.25,.4),F.point(b,.25,h+.6),P.stone,.34);
      S.beam(F.point(u-.5,.25,h+.5),F.point(u+w+.5,.25,h+.5),P.stoneHi,.43);
    }

    if(spec.id==='UKO021-S'){
      const F=walls(1.3,12.3,3.3,13.7,.2,25.2,22101);
      K.sash(S,F.front,.55,2.3,2.3,6.7,true);K.sash(S,F.front,8.15,2.3,2.3,6.7,true);
      door(F.front,4.5,2.35,8.9,true);
      windows(F.front,1,3,14.4,2.5,7,true);windows(F.right,2,2,3.2,2.6,6.5,true);
      windows(F.left,2,2,3.2,2.6,6.5,true);windows(F.back,1,3,14.4,2.4,6.4,true);
      door(F.back,7.0,2.3,7.8,false);K.sash(S,F.back,1.1,3.1,2.9,6.4,true);
      for(const f of Object.values(F)){sills(f,[12,24.5]);parapet(f,25.2);}
      gable(1.05,12.55,3.05,13.95,25.4,5.6,true);chimney(3.5,8.5,30.3,2);
      const R=walls(12.5,14.7,4.1,9.4,.2,7.4,22102);loading(R.back,.38,1.48,5.7);
      shed(12.45,14.95,4.0,9.55,7.5,1.1);crates(1.8,1.05,2);
      fence(5.7,1.2,11.8,1.2,2.5);lamps(F.front,8.0,9.3);lamps(F.back,4.9,8.9);
      pipe(12.42,12.9,25.0);
    }else if(spec.id==='UKO021-M'){
      const F=walls(1.8,25.4,19.6,29.4,.2,37.5,22201),L=walls(1.8,10.7,2.8,19.6,.2,37.5,22202);
      const R=walls(25.4,29.4,19.6,25.4,.2,37.5,22203);
      // A solid triangular prism makes the corner physically diagonal at all
      // levels. It is not a painted corner door on a rectangular hidden wall.
      const polygon=[[25.4,25.4],[29.4,25.4],[25.4,29.4]];
      for(let i=0;i<3;i++){const a=polygon[i],b=polygon[(i+1)%3],dx=b[0]-a[0],dy=b[1]-a[1];S.wall(a,b,.2,37.5,K.brick(A.dark(dy,-dx),22204));}
      S.poly(polygon.map(p=>[p[0],p[1],37.5]),P.stoneR);
      const D=S.face([29.4,25.4],[25.4,29.4],Math.SQRT1_2,Math.SQRT1_2);
      diagonalDoor(D,1.25,3.1,9.2);K.sash(S,D,1.15,14.2,3.0,7.1,true);K.sash(S,D,1.15,25.4,3.0,7.1,true);
      windows(F.front,3,5,2.8,3.2,7.3,true);windows(F.left,3,2,2.8,2.6,7.3,true);
      windows(F.back,3,4,2.8,3.5,7.3,true);
      windows(L.left,3,3,2.8,3.2,7.3,true);windows(L.right,3,3,2.8,3.0,7.3,true);
      windows(L.back,3,2,2.8,2.8,7.3,true);windows(R.right,3,1,2.8,2.8,7.3,true);
      door(L.right,4.7,2.65,8.2,false);loading(F.back,7.2,4.0,8.4);
      for(const f of[F.front,F.left,F.back,L.left,L.right,L.back,R.right])sills(f,[12.3,23.5,36.8]);
      gable(1.45,25.65,19.3,29.7,37.8,7.5,true);
      gable(1.45,11.05,2.5,19.35,37.8,7.3,false);
      // The hip closes the cut corner without filling its open ground prism.
      const a=[25.55,24.5,45.3],b=[29.65,19.3,37.8],c=[29.65,25.55,37.8],d=[25.55,29.65,37.8];
      S.poly([a,b,c],K.slate(A.dark(1,0)));S.poly([a,c,d],K.slate(A.dark(1,1)));
      S.beam(c,d,P.ironD,.28);chimney(5.9,8.6,44.8,3);chimney(12.4,24.5,45.2,2);
      canopy(14.8,22.7,14.8,19.0,7.4);crates(16.2,16.1,3);
      fence(28.7,3.6,28.7,15.6,3.2);fence(14.0,3.6,24.3,3.6,3.2);
      lamps(F.front,21.7,10.0);lamps(L.back,4.4,9.4);lamps(L.right,8.6,9.4);
      pipe(1.52,27.8,37.1);pipe(10.96,5.2,37.1);
    }else if(spec.id==='UKO021-L'){
      const F=walls(2.3,45.4,33.8,44.8,.2,49.5,22301,'stone'),L=walls(2.3,13.2,6.2,33.8,.2,49.5,22302,'stone');
      const R=walls(13.2,37.6,5.2,14.8,.2,13.2,22303);
      for(const f of[F.front,F.back]){
        windows(f,3,8,14.0,3.6,7.1,true);sills(f,[11.8,23.0,34.2,48.8]);
      }
      for(const u of[1.1,6.0,18.0,23.0,36.0,40.8])K.sash(S,F.front,u,2.5,3.0,7.0,true);
      for(const u of[11.0,28.6]){door(F.front,u,3.5,9.0,true);K.pilaster(S,F.front,u-.9,.4,10.2,.72);K.pilaster(S,F.front,u+4.4,.4,10.2,.72);F.front.block(u-1.7,u+5.2,0,.85,10.2,10.9,P.stone,P.stoneR,P.stoneHi);}
      for(const f of[F.right,L.left,L.right,L.back]){
        windows(f,4,f.length>20?5:2,2.8,3.2,7.0,true);sills(f,[11.8,23.0,34.2,48.8]);
      }
      windows(F.back,1,8,2.8,3.0,7.0,true);door(F.back,20.0,3.0,8.1,false);
      windows(R.front,1,5,3.1,3.1,6.6,true);windows(R.back,1,5,3.1,3.1,6.6,true);
      loading(R.right,2.0,5.0,9.2);loading(R.back,9.5,4.4,8.8);door(L.right,9.0,2.8,8.3,false);
      hip(1.9,45.8,33.45,45.2,49.8,7.8,true);hip(1.9,13.55,5.85,33.45,49.8,7.8,false);
      shed(13.1,37.95,4.95,15.1,13.5,3.0);
      chimney(7.3,12.5,57.0,3);chimney(34.9,39.0,57.0,3);
      // Clear loading lane at x39–46.2 stays open from the rear to the court.
      S.flat(39.1,46.2,1.1,31.6,.03,(x,y)=>K.mod(x,4)<.12?P.paveR:P.paveHi);
      canopy(21.0,32.7,1.0,4.75,7.4);crates(22.3,1.5,4);
      K.ironRail(S,[15.1,30.4],[15.1,19.0],0,3.4);K.ironRail(S,[19.8,30.4],[35.2,30.4],0,3.4);
      K.bench(S,20.2,19.3,6,false);K.bench(S,30.5,19.3,6,true);
      for(const u of[7.9,16.6,25.6,34.1])lamps(F.front,u,10.0);
      lamps(R.back,3.3,10.3);lamps(L.left,12.0,10.3);lamps(F.right,4.5,10.3);
      pipe(45.55,41.0,49.2);pipe(2.05,9.0,49.2);
    }else if(spec.id==='UKC021-S'){
      const H=walls(1.2,10.9,3.3,13.6,.2,16.1,22401),M=walls(11.1,14.7,4.4,10.7,.2,7.8,22402,'timber');
      door(H.front,.55,2.15,8.0,true);loading(H.front,4.2,4.45,10.1);
      glazing(H.front,3.0,12.1,5.2,2.4,true);
      for(const f of[H.left,H.right]){glazing(f,1.0,6.0,3.1,5.5,true);glazing(f,6.1,6.0,3.1,5.5,true);}
      glazing(H.back,.7,5.7,3.1,5.4,true);glazing(H.back,5.7,5.7,3.1,5.4,true);door(H.back,3.5,1.75,7.0,false);
      for(const f of Object.values(H)){parapet(f,16.05);ironTie(f,f.length*.5,13.9);}
      gable(.95,11.15,3.05,13.85,16.3,5.5,true);rooflight(2.7,8.7,4.5,6.3,3.05,8.45,16.3,5.5);
      chimney(3.2,9.5,20.6,1);shed(11.0,14.95,4.2,10.9,7.9,1.8);loading(M.front,.45,2.6,6.1);
      timberRack(2.0,7.3,1.0,2.4,4.0);fence(8.3,1.1,14.0,1.1,2.4);
      lamps(H.front,3.3,9.8);lamps(H.back,8.8,8.0);pipe(10.98,12.7,15.9);
    }else if(spec.id==='UKC021-M'){
      const H=walls(1.6,20.2,9.4,16.0,.2,17.0,22501),O=walls(20.2,29.7,9.4,22.6,.2,26.1,22502);
      loading(H.front,8.3,6.5,10.8);door(H.left,1.3,2.2,8.0,false);
      glazing(H.front,.9,6.1,4.8,5.5,true);glazing(H.front,14.7,6.1,2.8,5.5,true);
      glazing(H.front,7.9,13.1,7.1,2.2,true);glazing(H.left,1.7,10.3,2.6,4.0,true);
      for(let u=1.0;u<16.0;u+=5.6)glazing(H.back,u,5.1,3.7,7.0,true);
      door(O.front,.85,2.5,8.5,true);K.sash(S,O.front,5.5,3.2,2.7,6.3,true);
      windows(O.front,1,2,15.1,2.8,6.8,true);windows(O.back,2,2,3.9,2.8,6.8,true);
      windows(O.right,2,3,3.9,2.9,6.8,true);windows(O.left,1,3,15.1,2.8,6.8,true);
      loading(O.left,1.2,4.0,9.0);sills(O.front,[12.6,25.5]);sills(O.right,[12.6,25.5]);
      gable(1.35,20.35,9.15,16.25,17.2,4.8,true);rooflight(3.7,11.8,10.0,11.0,9.15,12.7,17.2,4.8);
      gable(19.95,29.95,9.15,22.85,26.3,5.6,false);chimney(25.0,11.9,31.2,2);
      canopy(2.0,8.2,16.45,20.8,6.4);timberRack(2.6,7.2,17.1,19.6,3.8);
      crates(13.4,19.7,4);fence(2.0,22.6,14.9,22.6,2.5);
      lamps(H.front,6.7,9.6);lamps(O.left,9.0,9.9);lamps(O.right,9.0,9.9);
      pipe(29.92,21.6,25.8);pipe(1.45,14.8,16.8);
    }else if(spec.id==='UKC021-L'){
      const F=walls(1.6,17.5,22.2,29.5,.2,26.0,22601),E=walls(22.1,29.9,22.2,29.5,.2,26.0,22602);
      const B=walls(17.5,22.1,22.2,29.5,11.5,26.0,22603);
      const L=walls(1.6,10.1,3.7,22.2,.2,13.5,22604),R=walls(10.1,29.9,3.7,10.2,.2,13.5,22605);
      door(F.front,.75,2.35,8.0,true);loading(F.front,5.3,6.4,9.4);glazing(F.front,12.6,3.0,2.6,6.3,true);
      door(E.front,1.0,2.35,8.1,true);glazing(E.front,4.2,3.0,2.7,6.3,true);
      windows(F.front,1,3,15.0,3.2,6.5,true);windows(E.front,1,2,15.0,2.8,6.5,true);
      K.sash(S,B.front,.8,15.0,3.0,6.5,true);K.sash(S,B.back,.8,15.0,3.0,6.5,true);
      for(const f of[F.left,E.right])windows(f,2,1,3.8,3.0,6.5,true);
      for(const f of[F.back,E.back])windows(f,1,f.length>10?3:2,15.0,2.8,6.5,true);
      for(const f of[F.front,E.front,B.front])sills(f,[12.4,25.4]);
      for(let u=1.2;u<15.8;u+=5.2){glazing(L.left,u,4.0,3.3,5.6,true);glazing(L.right,u,4.0,3.3,5.6,true);}
      glazing(L.back,1.1,4.0,5.2,5.6,true);loading(L.right,8.5,5.6,9.4);
      for(let u=1.0;u<16.5;u+=5.8)glazing(R.back,u,3.8,3.8,5.8,true);
      glazing(R.right,.8,3.8,4.5,5.8,true);glazing(R.front,1.4,3.8,3.3,5.8,true);loading(R.front,7.1,6.0,9.3);
      gable(1.35,30.15,21.95,29.75,26.3,6.0,true);
      gable(1.35,10.35,3.45,21.95,13.8,4.7,false);gable(10.35,30.15,3.45,10.45,13.8,4.4,true);
      // The bridge underside is above 11.5: the central cart path remains a
      // real gap through the front building rather than a painted arch panel.
      for(const x of[17.48,22.12])S.box(x-.22,x+.22,29.5,29.88,.3,11.8,P.stone,P.stoneR,P.stoneHi);
      S.flat(17.8,21.8,21.2,30.7,.045,P.paveHi);
      canopy(24.8,29.0,11.0,17.7,6.0);timberRack(25.4,28.4,12.1,16.4,3.8);crates(12.1,12.1,3);
      chimney(6.9,8.8,18.0,2);chimney(27.1,25.8,31.0,2);
      lamps(F.front,13.8,10.0);lamps(E.front,5.6,10.0);lamps(R.back,14.2,9.9);lamps(L.back,4.0,9.4);
      pipe(1.43,18.9,13.4);pipe(30.03,28.0,25.8);
    }else if(spec.id==='UKI021-S'){
      const H=walls(1.3,14.5,3.2,13.5,.2,18.8,22701);
      loading(H.front,1.0,5.5,10.3);door(H.front,9.5,2.3,8.4,true);
      glazing(H.front,1.05,12.3,5.4,4.4,true);glazing(H.front,9.4,11.2,2.9,5.2,true);
      for(const f of[H.left,H.right]){glazing(f,1.0,5.9,3.3,7.8,true);glazing(f,6.0,5.9,3.3,7.8,true);ironTie(f,5.1,15.6);}
      for(let u=.8;u<11.0;u+=4.25)glazing(H.back,u,6.0,3.1,7.8,true);
      door(H.back,5.0,2.1,7.8,false);sills(H.front,[17.9]);sills(H.back,[17.9]);
      gable(1.05,14.75,2.95,13.75,19.1,7.2,false);chimney(4.3,5.3,25.0,1);
      canopy(2.2,8.2,13.75,15.15,9.3);drum(11.0,1.5,.47);drum(12.5,1.5,.47);
      crates(1.8,1.0,2);lamps(H.front,8.1,10.6);lamps(H.back,10.5,10.2);pipe(14.63,12.3,18.5);
    }else if(spec.id==='UKI021-M'){
      const H=walls(1.5,22.0,9.4,21.0,.2,14.7,22801),O=walls(22.0,29.9,15.0,22.6,.2,26.0,22802);
      loading(H.front,8.7,6.8,10.0);glazing(H.front,1.2,4.0,4.7,6.8,true);glazing(H.front,16.7,4.0,2.7,6.8,true);
      for(let u=.9;u<17.6;u+=5.8)glazing(H.back,u,3.8,4.0,6.9,true);
      for(const f of[H.left,H.right]){glazing(f,1.0,4.0,3.2,6.5,true);glazing(f,6.8,4.0,3.2,6.5,true);}
      door(H.left,4.5,2.0,7.8,false);sills(H.front,[13.8]);sills(H.back,[13.8]);
      sawtooth(1.25,22.25,9.15,15.0,14.95,5.2);sawtooth(1.25,22.25,15.0,21.25,14.95,5.2);
      door(O.front,.75,2.45,8.5,true);K.sash(S,O.front,4.4,3.6,2.55,6.4,true);
      windows(O.front,1,2,15.0,2.8,6.5,true);windows(O.back,2,2,3.8,2.7,6.5,true);
      windows(O.right,2,1,3.8,3.0,6.5,true);windows(O.left,1,1,15.0,3.0,6.5,true);
      hip(21.75,30.15,14.75,22.85,26.3,4.9,true);chimney(26.0,18.6,30.5,2);
      canopy(10.0,16.6,21.35,23.22,8.8);drum(25.9,11.2,.6);drum(27.5,11.2,.6);
      crates(25.0,13.1,3);fence(23.2,9.3,29.7,9.3,2.5);
      lamps(H.front,7.4,9.8);lamps(O.back,4.0,9.8);lamps(O.right,4.2,10.0);
      pipe(1.35,19.4,14.5);pipe(30.0,21.7,25.8);
    }else if(spec.id==='UKI021-L'){
      const H=walls(1.8,15.5,3.8,29.4,.2,37.0,22901),B=walls(15.5,25.9,3.8,11.2,.2,13.4,22902);
      const D=walls(15.5,30.2,22.0,29.4,.2,14.8,22903);
      door(H.front,.55,2.35,8.3,true);loading(H.front,4.7,6.8,9.5);
      for(let f=0;f<2;f++)for(const u of[1.3,8.0])glazing(H.front,u,14.1+f*11.2,4.0,7.0,true);
      for(const face of[H.left,H.right])for(let f=0;f<3;f++)for(let u=1.3;u<21.0;u+=5.1)glazing(face,u,3.0+f*11.2,3.4,7.4,true);
      for(let f=0;f<3;f++)for(const u of[1.3,8.0])glazing(H.back,u,3.0+f*11.2,4.0,7.4,true);
      loading(H.right,6.2,6.0,9.5);door(H.back,5.8,2.5,8.0,false);
      for(const face of Object.values(H)){sills(face,[12.0,23.2,36.4]);for(let u=2.2;u<face.length-1;u+=5.2)ironTie(face,u,35.2);}
      gable(1.45,15.85,3.45,29.75,37.3,6.5,false);
      glazing(B.back,.8,3.3,3.1,5.7,true);glazing(B.back,6.8,3.3,2.7,5.7,true);
      glazing(B.right,1.2,3.3,4.5,5.7,true);loading(B.front,4.0,5.2,9.0);
      hip(15.7,26.25,3.45,11.55,13.7,4.0,true);
      loading(D.back,2.2,7.0,10.0);door(D.front,1.0,2.5,8.0,true);
      glazing(D.front,5.1,4.1,3.5,6.6,true);glazing(D.front,10.0,4.1,3.5,6.6,true);
      glazing(D.right,.9,4.1,4.8,6.6,true);gable(15.75,30.55,21.7,29.75,15.1,4.9,true);
      // The boiler stack is attached to the low boilerhouse and has its own
      // actual raster-space smoke origin in every view, never the old sprite's.
      K.cylinder(S,21.0,7.4,0,46.9,1.28,.93,K.brick(false,22909),K.brick(true,22910),P.ink,8);
      for(const z of[13.0,26.5,39.5])K.cylinder(S,21.0,7.4,z,z+.32,1.15,1.15,P.ironD,P.ironD,P.iron,8);
      K.cylinder(S,21.0,7.4,46.9,47.65,1.17,1.17,P.stone,P.stoneR,P.ink,8);
      explicitSmoke=[A.project(21.0,7.4,47.8)];
      canopy(26.4,30.3,12.3,17.6,6.5);crates(26.9,13.0,2);drum(17.7,13.2,.7);drum(19.6,13.2,.7);
      S.flat(16.1,30.7,18.2,21.5,.045,(x,y)=>K.mod(y,2.7)<.14?P.paveR:P.paveHi);
      fence(30.3,3.9,30.3,10.2,3.0);fence(17.0,1.6,28.8,1.6,3.0);
      lamps(H.front,3.6,10.0);lamps(H.back,11.6,10.0);lamps(D.front,11.8,10.0);lamps(B.right,3.5,10.0);
      pipe(1.59,27.6,36.7);pipe(30.35,28.4,14.6);
    }else throw Error('Unfinished workplace group '+id);

    return A.finish({nativeFunction:industrial?'existing-industrial-roots-no-new-recipes':'existing-office-zoned-roots-no-new-identity',
      footprint:[spec.bw,spec.bh],centredRasterFootprint:rect,...(explicitSmoke?{smoke608:explicitSmoke}:{}),
      ...(industrial?{}:{smoke608:[]})});
  }
  root.BritishUseScalesWorkplaces021=Object.freeze({specs,build,
    buildAll:()=>specs.flatMap(q=>Array.from({length:4},(_,v)=>build(q.id,v)))});
})(typeof window==='undefined'?globalThis:window);
