/* GPT-021 infrastructure candidates. Original, deterministic world geometry.
 * Warehouse carriers are 2/3/4 native tiles; passenger carriers 1/3/5.
 * Freight's middle carrier is ROAD distribution, not a new railway station.
 * Pure art: no registry, game world, saves, RNG, simulation or bitmap scaling.
 * Four geometric views share the unchanged approved opaque CPU rasterizer.
 */
(function(root){
  'use strict';
  const specs=Object.freeze([
    {id:'UKW021-S',nm:'石砌單跨貨棧',group:'warehouse',scale:'S',sz:2,w:160,h:180,k:64,tool:'warehouse',floors:1,
      plan:'single-stone-span-and-low-side-store',roof:'long-stone-gable-and-side-catslide',entry:'front-raised-loading-door-and-side-staff-door',yard:'open-front-unloading-apron-and-rear-service-strip',
      masses:[[3,24.3,7.1,23.8,0,19.2],[24.8,29.6,14.1,23.2,0,10.3]],
      functionLimit:'Native k64 warehouse only; geometry does not add stock, goods or throughput.'},
    {id:'UKW021-M',nm:'三層起重磚貨棧',group:'warehouse',scale:'M',sz:3,w:232,h:218,k:167,tool:'distributionCenter',floors:3,
      plan:'tall-west-range-and-low-north-return-plus-gate-office',roof:'long-tall-gable-and-perpendicular-low-gable',entry:'separate-front-hoist-loading-and-east-court-staff-entry',yard:'real-open-eastern-delivery-court',
      masses:[[3,22,5,38,0,35.5],[22,43,5,16,0,24.2],[37,44,35,44,0,13.3]],
      functionLimit:'Native k167 road distribution; shared carrier with freight M, installed by group only.'},
    {id:'UKW021-L',nm:'錯列雙倉理貨院',group:'warehouse',scale:'L',sz:4,w:296,h:232,k:165,tool:'containerLogistics',floors:2,
      plan:'offset-parallel-brick-warehouses-and-detached-front-office',roof:'two-unequal-long-gables-and-office-hip',entry:'two-goods-frontages-and-independent-office-door',yard:'unobstructed-central-through-lane-and-two-loading-courts',
      masses:[[3,23,9,53,0,24],[39,61,3,40,0,17.6],[39,60,43,59,0,27]],
      functionLimit:'British masonry art on native k165 containerLogistics; retains its existing logistics values.'},
    {id:'UKP021-S',nm:'鄉村單月台站房',group:'passengerstation',scale:'S',sz:1,w:80,h:108,k:17,tool:'station',floors:1,
      plan:'compact-booking-room-and-detached-coal-store',roof:'short-gable-and-single-front-platform-canopy',entry:'separate-street-and-platform-doors',yard:'small-rear-staff-yard-with-coal-store',
      masses:[[1.5,11.2,3.3,10.5,0,14.5],[11.8,14.5,3.1,7.7,0,7.9]],
      functionLimit:'Native k17 is 1x1, not 2x2. Rail service still needs the native adjacent network.'},
    {id:'UKP021-M',nm:'鎮站雙月台長站房',group:'passengerstation',scale:'M',sz:3,w:232,h:206,k:55,tool:'grandStation',floors:2,
      plan:'long-west-booking-range-and-two-separated-platform-canopies',roof:'high-station-gable-and-two-low-iron-ridges',entry:'street-end-booking-hall-and-side-platform-access',yard:'separate-front-concourse-and-small-eastern-service-bay',
      masses:[[3,19,7,39,0,27.2],[36,44,33,42,0,11.5]],
      functionLimit:'Native k55 3x3 railway station. Painted internal track positions do not add or repair native topology.'},
    {id:'UKP021-L',nm:'雙廳雙跨城市客站',group:'passengerstation',scale:'L',sz:5,w:360,h:286,k:139,tool:'hsrStation',floors:2,
      plan:'separated-west-and-central-booking-halls-two-narrow-glass-sheds-and-east-service-range',roof:'two-independent-glass-vaults-and-separate-hipped-halls',entry:'two-street-halls-and-upper-platform-gallery',yard:'front-walking-court-and-independent-eastern-service-bay',
      masses:[[3,16,41,76,0,28.4],[33,47,63,76,0,28.4],[35,45,65,74,28.4,52],[65,76,7,25,0,17.3]],
      functionLimit:'Native 5x5 k139 only. When used with approved 008 variants, preserve their actual x24/x56 owned corridors and all native port/construction authorities.'},
    {id:'UKT021-S',nm:'穿廊單跨鐵道貨棚',group:'freightstation',scale:'S',sz:2,w:160,h:174,k:110,tool:'freight',floors:1,
      plan:'genuinely-open-through-shed-and-small-east-goods-office',roof:'one-long-gable-and-low-offset-office-hip',entry:'open-end-rail-arches-and-separated-side-goods-door',yard:'eastern-unloading-apron-and-small-office-court',
      masses:[[3,7.4,4,27.4,0,18.8],[17.6,22,4,27.4,0,18.8],[7.4,17.6,4,4.9,11.4,18.8],[7.4,17.6,26.5,27.4,11.4,18.8],[23.5,29.9,17.4,28.3,0,11.2]],
      functionLimit:'Native k110 freight only. Painted through-track is visual geometry, not a new railway connection or train schedule.'},
    {id:'UKT021-M',nm:'橫樓公路配送貨院',group:'freightstation',scale:'M',sz:3,w:232,h:206,k:167,tool:'distributionCenter',floors:2,
      plan:'two-storey-front-cross-range-low-west-shed-and-detached-canopy',roof:'long-front-hip-low-west-gable-and-open-loading-canopy',entry:'front-staff-entrance-and-rear-goods-doors',yard:'large-open-central-road-delivery-court-with-east-gate',
      masses:[[3,42,30,44,0,25.8],[3,15,4,30,0,15.2]],
      functionLimit:'Native k167 ROAD distribution, not a railway freight station. Shared carrier with warehouse M, installed by group only.'},
    {id:'UKT021-L',nm:'錯列雙貨棚門吊院',group:'freightstation',scale:'L',sz:4,w:296,h:240,k:166,tool:'intermodalHub',floors:3,
      plan:'two-offset-open-rail-goods-sheds-central-gantry-court-and-west-control-range',roof:'two-separated-slate-gables-and-hipped-control-room',entry:'two-through-rail-arches-road-gate-and-separate-control-door',yard:'separated-central-loading-yard-and-clear-painted-rail-corridors',
      masses:[[3.7,11.9,5,27,0,18.6],[22.1,28.4,5,27,0,18.6],[11.9,22.1,5,5.9,11.4,18.6],[11.9,22.1,26.1,27,11.4,18.6],
        [36,41.9,34,57,0,17.5],[52.1,59,34,57,0,17.5],[41.9,52.1,34,34.9,11.4,17.5],[41.9,52.1,56.1,57,11.4,17.5],[3.5,11.6,39,55,0,41.5]],
      functionLimit:'Native k166 intermodalHub conditions remain. As disclosed in T611, painted rails do not connect adjacent true rail tiles; no new dispatch or throughput.'}
  ].map(s=>Object.freeze({...s,masses:Object.freeze(s.masses.map(m=>Object.freeze(m)))})));

  function build(id,view){
    const spec=specs.find(s=>s.id===id);if(!spec)throw Error('Unknown infrastructure candidate '+id);
    if(!root.BritishUseScalesKit021)throw Error('Candidate architectural kit missing');
    const A=root.BritishUseScalesKit021.create(spec,view),{S,K,P,C,extent:E,dark,walls,course,gable,hip,shed,windows,door,loading,chimney,crates,fence,canopy,lamps}=A;
    const ballast=C('777f76'),ballastDark=C('646f67'),ironPale=C('90a49a');
    S.flat(.9,E-.9,.9,E-.9,0,K.paving);
    function bay(F,u,z,w,h,lit){K.sash(S,F,u,z,w,h,lit!==false);}
    function row(F,bays,z,w,h){for(let b=0;b<bays;b++)bay(F,F.length*(b+.5)/bays-w/2,z,w,h);}
    function lamp(x,y,z){K.lantern(S,x,y,z||9,true);}
    function pipes(x0,x1,y0,y1,z){for(const[x,y]of[[x0,y0],[x1,y1]])K.rainpipe(S,x,y,z);}
    function stoneGable(x0,x1,y0,y1,z,rise,alongX){
      gable(x0,x1,y0,y1,z,rise,alongX);
      if(alongX){const cy=(y0+y1)/2;for(const x of[x0,x1])S.poly([[x,y0,z],[x,y1,z],[x,cy,z+rise]],K.ashlar(dark(x===x0?-1:1,0),2193),.025);}
      else{const cx=(x0+x1)/2;for(const y of[y0,y1])S.poly([[x0,y,z],[x1,y,z],[cx,y,z+rise]],K.ashlar(dark(0,y===y0?-1:1),2194),.025);}
    }
    function dock(x0,x1,y0,y1,z){S.box(x0,x1,y0,y1,0,z,P.stone,P.stoneR,P.stoneHi);for(const yy of[y0,y1])S.beam([x0,yy,z+.05],[x1,yy,z+.05],P.ironD,.20);}
    function stackedGoods(x,y){crates(x,y,4);crates(x,y+1.7,3);for(let i=0;i<2;i++)S.box(x+.7+i*1.4,x+1.8+i*1.4,y+.7,y+1.9,1.7,3.1,P.woodHi,P.woodR,P.wood);}
    function gatePost(x,y,h){const F=walls(x-.42,x+.42,y-.42,y+.42,0,h||4.4,2189,'stone');S.box(x-.60,x+.60,y-.60,y+.60,(h||4.4)-.1,(h||4.4)+.55,P.stone,P.stoneR,P.stoneHi);return F;}
    function clock(F,u,z,r){
      F.panel(u-r-.4,u+r+.4,z-r-.4,z+r+.4,(xx,zz)=>{const x=xx-r-.4,y=zz-r-.4,d=Math.hypot(x,y);
        if(d>r)return null;if(d>r-.42)return P.gold;
        if(Math.abs(x)<.19&&y>-.25&&y<r*.63||Math.abs(y+x*.55)<.18&&x>-.18&&x<r*.58)return P.ink;
        if(d>r-.9&&K.mod(Math.atan2(y,x)*6/Math.PI,.99)<.15)return P.ink;return P.paper;},.22);
    }
    function track(center,y0,y1){
      S.flat(center-4.3,center+4.3,y0,y1,.18,(x,y)=>K.mod(y,2.4)<.38?P.woodD:K.hash(Math.floor(x*2),Math.floor(y*2),2180)%9===0?ballastDark:ballast);
      for(const dx of[-2.45,2.45]){S.flat(center+dx-.30,center+dx+.30,y0,y1,.48,P.ironD);S.flat(center+dx-.12,center+dx+.12,y0,y1,.63,ironPale);}
    }
    function platform(x0,x1,y0,y1){
      S.box(x0,x1,y0,y1,0,2.5,P.stone,P.stoneR,K.paving);
      for(const x of[x0+.25,x1-.65])S.flat(x,x+.4,y0+.3,y1-.3,2.55,P.paper,.02);
    }
    function ironCanopy(x0,x1,y0,y1,z,rise){
      const cx=(x0+x1)/2;
      S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],P.canopyHi);
      S.poly([[cx,y0,z+rise],[x1,y0,z],[x1,y1,z],[cx,y1,z+rise]],P.canopyR);
      S.beam([cx,y0,z+rise+.06],[cx,y1,z+rise+.06],P.ironHi,.34);
      for(const y of[y0+.6,(y0+y1)/2,y1-.6]){
        for(const x of[x0+.4,x1-.4]){S.box(x-.12,x+.12,y-.12,y+.12,0,z,P.iron,P.ironD,P.ironHi);S.beam([x,y,z-2.2],[cx,y,z+rise-.2],P.ironHi,.25);}
        S.beam([x0,y,z],[cx,y,z+rise],P.ironHi,.26);S.beam([cx,y,z+rise],[x1,y,z],P.ironHi,.26);
      }
      for(const x of[x0,x1])S.beam([x,y0,z],[x,y1,z],P.ironD,.35);
    }
    function glassShed(x0,x1,y0,y1,z,rise){
      const xs=[0,.16,.35,.5,.65,.84,1].map(t=>x0+(x1-x0)*t),zs=[0,.55,.91,1,.91,.55,0].map(t=>z+rise*t);
      for(let a=0;a<xs.length-1;a++){
        S.poly([[xs[a],y0,zs[a]],[xs[a+1],y0,zs[a+1]],[xs[a+1],y1,zs[a+1]],[xs[a],y1,zs[a]]],(x,y)=>K.mod(y-y0,3.8)<.14?P.ironHi:a<3?P.glassHi:P.glass);
        S.beam([xs[a],y0,zs[a]+.05],[xs[a],y1,zs[a]+.05],P.ironHi,.27);
      }
      S.beam([x1,y0,z],[x1,y1,z],P.ironHi,.27);
      for(let y=y0+.8;y<y1;y+=9.1){
        for(const x of[x0,x1])S.box(x-.19,x+.19,y-.18,y+.18,0,z,P.iron,P.ironD,P.ironHi);
        for(let a=0;a<xs.length-1;a++)S.beam([xs[a],y,zs[a]],[xs[a+1],y,zs[a+1]],P.ironHi,.47);
        S.beam([x0,y,z],[x1,y,z],P.iron,.28);
      }
    }
    function archPortal(F,u,width,height){
      const r=width/2,spring=height-r,c=u+r,t=.9;
      for(let i=0;i<16;i++){
        const a=i*Math.PI/16,b=(i+1)*Math.PI/16;
        S.poly([F.point(c+Math.cos(a)*r,.20,spring+Math.sin(a)*r),F.point(c+Math.cos(b)*r,.20,spring+Math.sin(b)*r),
          F.point(c+Math.cos(b)*(r+t),.20,spring+Math.sin(b)*(r+t)),F.point(c+Math.cos(a)*(r+t),.20,spring+Math.sin(a)*(r+t))],i%3===0?P.stoneHi:P.stone,.04);
      }
      F.block(u-.85,u,0,.48,0,spring,P.stone,P.stoneR,P.stoneHi);F.block(u+width,u+width+.85,0,.48,0,spring,P.stone,P.stoneR,P.stoneHi);
      F.block(u+width/2-.28,u+width/2+.28,0,.55,height-.15,height+1.15,P.stoneHi,P.stoneR,P.stoneHi);
    }
    function openGoodsShed(x0,x1,y0,y1,z,rise,center,seed){
      const g0=center-5.1,g1=center+5.1,openingH=11.4;
      walls(x0,g0,y0,y1,0,z,seed);walls(g1,x1,y0,y1,0,z,seed+1);
      walls(g0,g1,y0,y0+.9,openingH,z,seed+2);walls(g0,g1,y1-.9,y1,openingH,z,seed+3);
      gable(x0-.25,x1+.25,y0-.25,y1+.25,z,rise,false);
      const F={front:S.face([x0,y1],[x1,y1],0,1),back:S.face([x1,y0],[x0,y0],0,-1),
        left:S.face([x0,y0],[x0,y1],-1,0),right:S.face([x1,y1],[x1,y0],1,0)};
      archPortal(F.front,g0-x0,10.2,openingH);archPortal(F.back,x1-g1,10.2,openingH);
      row(F.front,3,z-4.2,2.6,2.3);row(F.back,3,z-4.2,2.6,2.3);
      row(F.left,4,8.0,2.5,5.2);row(F.right,4,8.0,2.5,5.2);
      course(F.left,z-.7);course(F.right,z-.7);lamps(F.front,1.25,9.0);lamps(F.back,F.back.length-1.3,9.0);
      return F;
    }
    function gantry(x0,x1,y,z){
      for(const x of[x0,x1]){
        S.box(x-.42,x+.42,y-.53,y+.53,0,z,P.ironHi,P.ironD,P.ironHi);
        S.box(x-.75,x+.75,y-.8,y+.8,0,.9,P.stone,P.stoneR,P.stoneHi);
        S.beam([x,y,z-5.4],[x+(x===x0?3.3:-3.3),y,z-.5],P.ironHi,.52);
      }
      S.box(x0-.4,x1+.4,y-.62,y+.62,z,z+2.15,P.ironHi,P.ironD,P.ironHi);
      for(let x=x0+.6;x<x1;x+=4.2)S.beam([x,y-.64,z+.13],[x+3.2,y-.64,z+1.97],P.ironD,.27);
      S.box((x0+x1)/2-1.1,(x0+x1)/2+1.1,y-.85,y+.85,z-.7,z+.4,P.iron,P.ironD,P.ironHi);
      S.beam([(x0+x1)/2,y,z-.7],[(x0+x1)/2,y,6.0],P.ironD,.14);
      S.beam([(x0+x1)/2,y,6.0],[(x0+x1)/2+.8,y,5.5],P.iron,.28);
    }

    if(id==='UKW021-S'){
      const F=walls(3,24.3,7.1,23.8,0,19.2,2181,'stone');
      stoneGable(2.7,24.6,6.8,24.1,19.2,7.3,true);
      course(F.front,18.4);course(F.back,18.4);course(F.left,18.4);course(F.right,18.4);
      loading(F.front,7.7,6.7,10.5);bay(F.front,1.7,9.2,3,5.7);bay(F.front,16.7,9.2,3,5.7);
      row(F.back,4,9.2,2.8,5.7);row(F.left,3,8.4,2.6,5.9);row(F.right,3,11.4,2.4,4.2);
      lamps(F.front,2.0,5.7);lamps(F.front,18.6,5.7);lamps(F.back,10.3,7.4);
      dock(8.5,18.8,23.9,26.7,1.3);dock(19.0,21.2,24.0,25.0,.55);
      S.box(19.0,21.2,25.0,26.0,0,.9,P.stone,P.stoneR,P.stoneHi);
      const O=walls(24.8,29.6,14.1,23.2,0,10.3,2182,'stone');shed(24.5,29.9,13.8,23.5,10.3,2.5);
      door(O.front,1.1,2.5,8);bay(O.back,1.0,3.0,2.5,4.8);bay(O.right,2.7,3.0,2.5,4.8);lamps(O.right,7.3,6.4);
      pipes(3,24.3,7.1,23.8,18.6);chimney(27.2,15.9,12.5,1);
      stackedGoods(3.2,26.4);crates(26.0,9.1,2);
      fence(2.1,2.8,18.4,2.8,2.7);fence(28.7,2.8,28.7,8.1,2.7);
      gatePost(19.8,3.1,3.6);gatePost(26.0,3.1,3.6);lamp(2.4,29.2,8.3);lamp(28.1,4.2,8.0);
    }else if(id==='UKW021-M'){
      const F=walls(3,22,5,38,0,35.5,2183);
      gable(2.7,22.3,4.7,38.3,35.5,7.4,false);
      for(const z of[11.7,23.1,34.6])for(const side of['front','back','left','right'])course(F[side],z);
      loading(F.front,6.7,6.6,10.5);bay(F.front,1.0,3.0,2.8,6.3);bay(F.front,15.2,3.0,2.7,6.3);
      for(const z of[15.0,26.2]){bay(F.front,1.0,z,2.8,6.2);bay(F.front,15.2,z,2.7,6.2);}
      F.front.panel(6.9,13.1,14.7,24.4,(u,z)=>K.mod(u,1.2)<.12?P.woodD:P.wood,.15);
      F.front.block(6.6,13.4,0,.45,24.0,25.0,P.stone,P.stoneR,P.stoneHi);bay(F.front,7.7,27.0,3.0,6.0);
      windows(F.back,3,3,3.4,3.0,6.2);windows(F.left,3,6,3.4,2.8,6.2);windows(F.right,2,6,15.0,2.8,6.2);
      loading(F.right,9.3,6.4,10.0);door(F.right,26.6,2.6,8.7);lamps(F.front,16.1,10.2);lamps(F.back,1.5,9.4);
      // A real attached hoist dormer and suspended rope, not a painted roof icon.
      const H=walls(9.0,15.5,37.9,40.3,30.5,37.8,2184,'timber');gable(8.8,15.7,37.7,40.5,37.8,4.1,false);
      H.front.panel(1.4,5.0,31.3,36.8,P.woodD,.12);
      S.beam([12.2,38.3,35.0],[12.2,43.0,35.0],P.woodD,.55);S.beam([12.2,38.4,38.0],[12.2,42.5,35.0],P.iron,.32);
      S.beam([12.2,42.7,34.8],[12.2,42.7,5.0],P.ironD,.12);S.beam([12.2,42.7,5.0],[12.9,42.7,4.6],P.iron,.22);
      const R=walls(22,43,5,16,0,24.2,2185);gable(21.8,43.3,4.7,16.3,24.2,5.3,true);
      windows(R.front,2,4,3.0,2.7,6.3);windows(R.back,2,4,3.0,2.7,6.3);row(R.right,2,14.2,2.8,6.3);
      loading(R.right,2.1,5.6,10.2);lamps(R.front,19.4,8.3);lamps(R.back,1.5,8.6);
      canopy(22.5,31.7,23.2,28.3,11.1);dock(22.1,25.0,23.6,30.0,1.1);
      const O=walls(37,44,35,44,0,13.3,2186);hip(36.7,44.3,34.7,44.3,13.3,4.0,false);
      door(O.front,2.4,2.5,9);row(O.back,2,3.7,2.4,6.1);row(O.right,2,3.7,2.4,6.1);bay(O.left,2.8,3.7,2.5,6.1);lamps(O.front,1.0,8.2);
      pipes(3,22,5,38,35.1);pipes(22,43,5,16,23.8);chimney(40.7,37.3,16.0,2);
      stackedGoods(25.7,18.4);stackedGoods(27.8,31.6);crates(34.0,18.3,5);
      fence(2.0,2.6,44.7,2.6,3);fence(45.0,3.0,45.0,33.0,3);
      gatePost(24.5,44.8,4.2);gatePost(34.7,44.8,4.2);lamp(30.0,41.4,11);lamp(44.5,19.0,10);
    }else if(id==='UKW021-L'){
      const W=walls(3,23,9,53,0,24,2187);gable(2.7,23.3,8.7,53.3,24,7.4,false);
      course(W.front,12.0);course(W.back,12.0);course(W.right,23.2);course(W.left,23.2);
      loading(W.front,5.2,9.6,11.4);row(W.front,3,14.8,3.2,5.5);row(W.back,3,14.8,3.2,5.5);
      row(W.left,7,14.8,2.8,5.5);row(W.right,7,14.8,2.8,5.5);
      for(const u of[5.4,21.7,34.0]){loading(W.right,u,6.4,10.5);lamps(W.right,u+7.8,9.0);}
      lamps(W.back,1.3,8.0);lamps(W.front,17.8,8.0);
      const R=walls(39,61,3,40,0,17.6,2188);gable(38.7,61.2,2.7,40.3,17.6,6.0,false);
      loading(R.front,6.0,9.0,10.6);row(R.front,3,11.2,2.7,4.1);row(R.back,4,7.0,2.7,6.0);
      row(R.left,6,10.8,2.8,4.6);row(R.right,6,10.8,2.8,4.6);loading(R.left,12.2,7.3,9.3);
      lamps(R.front,2.0,6.9);lamps(R.back,20.0,7.0);lamps(R.right,6.0,8.0);
      const O=walls(39,60,43,59,0,27,2190);hip(38.7,60.3,42.7,59.3,27,6.0,true);
      for(const side of['front','back','left','right']){course(O[side],12.8);course(O[side],26.1);}
      windows(O.front,1,4,15.6,3.0,6.6);windows(O.back,2,4,4.2,3.0,6.6);windows(O.right,2,3,4.2,2.8,6.6);windows(O.left,2,3,4.2,2.8,6.6);
      door(O.front,8.3,3.3,10.8);bay(O.front,2.0,4.2,3.2,6.6);bay(O.front,15.8,4.2,3.2,6.6);lamps(O.front,7.0,9);lamps(O.front,13.8,9);
      canopy(23.4,28.7,29.0,37.4,10.1);canopy(34.0,38.5,15.0,23.3,9.3);
      dock(18.4,23.1,54.0,58.4,1.3);dock(39.0,49.7,40.2,42.0,1.0);
      pipes(3,23,9,53,23.6);pipes(39,61,3,40,17.2);chimney(44.6,46.3,31.4,2);chimney(55.6,54.0,31.4,2);
      stackedGoods(4.7,3.9);stackedGoods(53.4,40.7);crates(5.2,59.0,6);
      fence(2.0,2.4,35.8,2.4,3.2);fence(2.0,4.0,2.0,59.4,3.2);fence(61.7,42.8,61.7,60.5,3.2);
      gatePost(25.1,61.0,4.8);gatePost(36.3,61.0,4.8);lamp(31.0,55.2,11.3);lamp(31.0,7.4,11.3);lamp(60.2,41.2,9.0);
    }else if(id==='UKP021-S'){
      const F=walls(1.5,11.2,3.3,10.5,0,14.5,2191,'stone');stoneGable(1.2,11.5,3.0,10.8,14.5,6.3,true);
      course(F.front,13.6);course(F.back,13.6);course(F.left,13.6);course(F.right,13.6);
      door(F.front,4.0,2.5,9.5);K.archWindow(S,F.front,.7,2.7,2.3,10.0,true);K.archWindow(S,F.front,7.0,2.7,2.0,10.0,true);
      row(F.back,3,3.2,2.0,5.5);bay(F.left,.9,3.2,2.0,5.5);door(F.left,4.1,2.2,8.8);row(F.right,2,3.2,2.0,5.5);
      clock(F.front,5.25,11.6,1.7);lamps(F.back,4.8,9.3);lamps(F.right,1.1,9.0);
      // High physical platform lamps remain visible above the low canopy;
      // canopy-covered window glow is correctly hidden by the shared z buffer.
      lamps(F.front,.25,11.7);lamps(F.front,9.3,11.7);
      platform(1.3,11.9,11.0,14.7);canopy(1.1,12.1,10.8,14.5,10.5);
      S.beam([1.3,14.5,10.5],[11.9,14.5,10.5],P.greenD,.30);for(const x of[1.7,11.4])S.beam([x,14.1,8.4],[x+(.8*(x<6?1:-1)),14.1,10.3],P.ironHi,.24);
      const O=walls(11.8,14.5,3.1,7.7,0,7.9,2192,'timber');shed(11.6,14.7,2.9,7.9,7.9,1.8);loading(O.front,.5,1.6,6.3);
      fence(12.1,8.4,14.5,8.4,2.6);fence(14.5,8.4,14.5,10.7,2.6);crates(12.1,9.2,1);
      pipes(1.5,11.2,3.3,10.5,14.1);chimney(8.6,5.6,18.1,1);lamp(13.3,12.6,8.8);lamp(2.1,1.8,7.0);
    }else if(id==='UKP021-M'){
      track(26,2.0,43.0);track(40,2.0,30.4);
      platform(20.1,21.5,2.0,35.6);platform(30.6,35.4,2.0,35.6);platform(44.5,46.4,2.0,29.5);
      const F=walls(3,19,7,39,0,27.2,2195);gable(2.7,19.3,6.7,39.3,27.2,7.0,false);
      for(const side of['front','back','left','right']){course(F[side],13.5);course(F[side],26.4);}
      door(F.front,6.4,3.2,11);K.archWindow(S,F.front,.9,2.3,4.1,10.4,true);K.archWindow(S,F.front,11.3,2.3,3.7,10.4,true);
      windows(F.front,1,3,16.5,2.9,6.3);windows(F.back,2,3,4.9,2.9,6.3);windows(F.left,2,6,4.9,2.7,6.3);
      windows(F.right,1,6,16.5,2.7,6.3);for(const u of[3.2,14.0,25.0]){door(F.right,u,3,10.6);lamps(F.right,u+4.2,9.8);}
      clock(F.front,8,29.4,2.5);lamps(F.front,5.1,9.8);lamps(F.back,1.4,9.8);
      ironCanopy(21.4,31.0,3.0,29.3,14.0,3.7);ironCanopy(35.3,44.2,3.0,29.3,13.0,3.2);
      for(const [x,y]of[[33.1,8.0],[33.1,25.0],[45.5,6.0],[45.5,22.8]])lamp(x,y,9.5);
      const O=walls(36,44,33,42,0,11.5,2196,'stone');hip(35.7,44.3,32.7,42.3,11.5,3.4,false);
      door(O.front,3.0,2.4,8.3);row(O.back,2,3.5,2.3,5.1);row(O.right,2,3.5,2.3,5.1);bay(O.left,3.0,3.5,2.3,5.1);
      fence(35.2,43.1,45.2,43.1,2.7);crates(44.6,33.8,1);pipes(3,19,7,39,26.8);chimney(8.0,13.6,31.8,2);chimney(14.0,29.4,31.8,2);
      lamp(4.3,43.6,10.8);lamp(24.0,44.0,10.8);lamp(44.5,31.0,9.8);
    }else if(id==='UKP021-L'){
      // These two centers are the approved British 008 actual rail corridors.
      // No solid booking hall, stair or service bay occupies either corridor.
      track(24,.9,79.1);track(56,.9,79.1);
      platform(3.0,18.8,2.0,37.6);platform(29.2,49.8,2.0,56.7);platform(61.3,76.3,28.0,59.2);
      glassShed(17.8,30.2,4.0,53.8,21.0,12.5);glassShed(49.8,62.2,4.0,53.8,21.0,12.5);
      ironCanopy(65.0,75.3,31.0,52.1,14.2,4.1);
      const W=walls(3,16,41,76,0,28.4,2197);hip(2.7,16.3,40.7,76.3,28.4,7.2,false);
      for(const side of['front','back','left','right']){course(W[side],13.2);course(W[side],27.7);}
      door(W.front,4.7,3.3,11.2);K.archWindow(S,W.front,.8,2.0,3.1,10.6,true);K.archWindow(S,W.front,9.2,2.0,3.0,10.6,true);
      windows(W.front,1,3,16.0,2.7,6.6);windows(W.back,2,3,4.4,2.7,6.6);windows(W.left,2,7,4.4,2.7,6.6);windows(W.right,2,7,4.4,2.7,6.6);
      // Booking halls have separate street entrances, not an opaque cross-track frontage.
      const B=walls(33,47,63,76,0,28.4,2198,'stone');hip(32.7,47.3,62.7,76.3,28.4,6.0,true);
      for(const side of['front','back','left','right']){course(B[side],13.2);course(B[side],27.7);}
      door(B.front,5.25,3.5,11.1);K.archWindow(S,B.front,.8,2.0,3.4,10.4,true);K.archWindow(S,B.front,9.8,2.0,3.3,10.4,true);
      windows(B.front,1,3,16.0,2.8,6.6);windows(B.back,2,3,4.4,2.8,6.6);windows(B.left,2,3,4.4,2.8,6.6);windows(B.right,2,3,4.4,2.8,6.6);
      const T=walls(35,45,65,74,28.4,52,2199);hip(34.7,45.3,64.7,74.3,52,5.3,true);
      for(const side of['front','back','left','right']){course(T[side],39.0);course(T[side],51.3);clock(T[side],T[side].length/2,46.2,3.1);row(T[side],2,31.2,2.5,5.0);}
      const O=walls(65,76,7,25,0,17.3,2200);gable(64.7,76.3,6.7,25.3,17.3,5.0,false);
      loading(O.front,3.1,5.0,9.7);row(O.back,3,5.2,2.6,7.1);row(O.left,4,5.2,2.6,7.1);row(O.right,4,5.2,2.6,7.1);lamps(O.front,1.1,10.8);lamps(O.back,8.4,10.8);
      canopy(65.0,76.0,25.6,28.3,10.4);crates(66.7,25.8,5);
      // Lower transverse gallery sits beyond the two glass sheds, with its
      // stair on the independent east platform rather than inside a rail cell.
      S.box(15.7,72.8,57.6,60.0,16.0,17.7,P.stone,P.stoneR,P.stoneHi);
      for(const y of[57.6,60.0]){S.beam([15.7,y,17.8],[72.8,y,17.8],P.iron,.4);S.beam([15.7,y,21.0],[72.8,y,21.0],P.ironHi,.4);for(let x=16.7;x<73;x+=3.2)S.beam([x,y,17.8],[x,y,21.0],P.iron,.2);}
      for(const x of[17.3,38.2,69.9])S.box(x-.28,x+.28,58.3,59.1,0,16.0,P.iron,P.ironD,P.ironHi);
      for(let i=0;i<11;i++)S.box(68.2,72.0,60.1+i,61.1+i,0,16.0-i*1.5,P.stone,P.stoneR,P.stoneHi);
      for(const x of[68.1,72.1])S.beam([x,60.1,19.1],[x,71.2,3.8],P.ironHi,.35);
      for(const [x,y]of[[9.0,8.0],[9.0,30.2],[37.4,7.0],[37.4,28.5],[37.4,49.5],[71.0,36.0],[71.0,56.0]])lamp(x,y,12.0);
      lamps(W.front,3.3,9.6);lamps(W.front,9.6,9.6);lamps(W.back,6.0,9.6);lamps(B.front,3.9,9.6);lamps(B.front,10.2,9.6);
      pipes(3,16,41,76,28);pipes(33,47,63,76,28);pipes(65,76,7,25,17);chimney(7.2,49.0,32.8,2);chimney(11.6,68.7,32.8,2);chimney(71.1,11.0,20.3,1);
      lamp(7.0,78.1,10);lamp(41.0,78.1,10);lamp(71.0,74.0,10);fence(64.1,2.9,76.7,2.9,2.8);
    }else if(id==='UKT021-S'){
      track(12.5,.9,31.1);
      const F=openGoodsShed(3,22,4,27.4,18.8,6.4,12.5,2201);
      loading(F.right,10.5,6.4,9.0);lamps(F.right,18.5,9.8);pipes(3,22,4,27.4,18.4);
      dock(22.1,25.1,10.6,16.7,1.5);canopy(22.4,29.7,10.0,16.1,10.1);
      const O=walls(23.5,29.9,17.4,28.3,0,11.2,2205,'stone');hip(23.3,30.1,17.2,28.5,11.2,3.5,false);
      door(O.front,2.0,2.5,8.6);row(O.back,2,3.3,2.4,5.2);row(O.right,2,3.3,2.5,5.2);bay(O.left,4.1,3.3,2.5,5.2);lamps(O.front,.8,8.5);
      stackedGoods(24.1,4.1);crates(24.2,28.8,3);chimney(26.8,20.0,13.5,1);
      fence(1.8,3.0,1.8,29.0,2.7);fence(23.0,1.9,29.5,1.9,2.7);gatePost(23.9,30.1,3.6);gatePost(29.1,30.1,3.6);
      lamp(2.1,29.2,9.0);lamp(28.9,7.2,9.0);
    }else if(id==='UKT021-M'){
      const F=walls(3,42,30,44,0,25.8,2206);hip(2.7,42.3,29.7,44.3,25.8,6.5,true);
      for(const side of['front','back','left','right']){course(F[side],12.8);course(F[side],25.0);}
      windows(F.front,1,7,15.3,2.8,6.3);windows(F.back,1,7,15.3,2.8,6.3);windows(F.left,2,3,4.1,2.5,6.3);windows(F.right,2,3,4.1,2.5,6.3);
      for(const u of[1.8,8.2,26.0,32.5])bay(F.front,u,4.1,2.8,6.3);
      door(F.front,18.0,3.7,10.6);lamps(F.front,16.4,9.8);lamps(F.front,23.1,9.8);
      loading(F.back,4.0,7.0,10.2);loading(F.back,18.3,7.0,10.2);lamps(F.back,14.5,9.5);lamps(F.back,28.5,9.5);
      const W=walls(3,15,4,30,0,15.2,2207);gable(2.7,15.3,3.7,30.3,15.2,5.2,false);
      row(W.left,5,6.0,2.5,5.8);row(W.right,5,7.0,2.5,4.8);row(W.back,3,5.3,2.5,6.0);
      loading(W.right,8.8,6.4,9.4);lamps(W.right,20.8,8.9);lamps(W.back,1.0,8.7);
      canopy(24.0,42.9,11.8,22.2,10.5);dock(14.7,18.1,10.0,18.0,1.0);
      stackedGoods(25.0,13.2);stackedGoods(34.1,13.2);crates(17.3,4.8,4);
      // The eastern entrance opens onto a road-delivery turning court. There
      // is deliberately no railway artwork on this road-only middle carrier.
      fence(2.1,2.4,44.7,2.4,3.0);fence(44.9,3.8,44.9,21.2,3.0);fence(44.9,36.5,44.9,44.8,3.0);
      gatePost(45.1,23.2,4.5);gatePost(45.1,34.5,4.5);lamp(43.8,27.6,11.2);lamp(19.5,24.0,10.5);
      pipes(3,42,30,44,25.4);pipes(3,15,4,30,14.8);chimney(8.0,34.6,30.0,2);chimney(35.1,39.4,30.0,2);
    }else if(id==='UKT021-L'){
      track(17,.9,63.1);track(47,.9,63.1);
      const N=openGoodsShed(3.7,28.4,5,27,18.6,7.0,17,2208);
      const R=openGoodsShed(36,59,34,57,17.5,6.4,47,2212);
      loading(N.right,6.8,6.3,9.6);loading(R.left,7.9,6.4,9.1);lamps(N.left,9.0,10.5);lamps(R.right,9.0,10.0);
      dock(28.3,32.0,13.4,21.0,1.4);dock(32.5,36.2,39.7,47.1,1.3);
      gantry(2.5,60.9,30.2,25.5);gantry(25.7,60.9,60.0,23.5);
      const O=walls(3.5,11.6,39,55,0,41.5,2216);hip(3.2,11.9,38.7,55.3,41.5,5.4,false);
      for(const side of['front','back','left','right']){
        course(O[side],13.5);course(O[side],27.1);course(O[side],40.8);
        O[side].panel(.55,O[side].length-.55,29.2,37.8,(u,z)=>u<.15||z<.22||z>8.3||K.mod(u,2.5)<.17||Math.abs(z-4.1)<.18?P.frameR:[P.glass,P.warmD],.19);
      }
      windows(O.back,2,2,4.4,2.5,6.3);windows(O.left,2,3,4.4,2.5,6.3);windows(O.right,2,3,4.4,2.5,6.3);
      door(O.front,2.5,2.9,10.4);windows(O.front,1,2,17.2,2.5,6.3);lamps(O.front,1.0,10.2);lamps(O.back,1.0,10.2);
      stackedGoods(25.0,37.0);stackedGoods(27.0,47.7);crates(23.6,57.0,7);crates(54.2,3.6,4);
      pipes(3.7,28.4,5,27,18.2);pipes(36,59,34,57,17.1);pipes(3.5,11.6,39,55,41.1);
      fence(1.7,2.1,1.7,59.2,3.0);fence(3.0,61.8,11.4,61.8,3.0);fence(24.0,61.8,38.4,61.8,3.0);fence(54.0,61.8,61.6,61.8,3.0);
      gatePost(30.8,33.1,4.4);gatePost(39.9,33.1,4.4);lamp(31.2,7.7,12.0);lamp(30.9,43.0,12.0);lamp(58.8,25.6,12.0);lamp(12.1,57.0,11.0);
    }
    return A.finish({nativeFunctionOnly:true,transportGeometry:spec.group==='passengerstation'?'native-station-art-only':'none',
      ...(id==='UKP021-L'?{railCenters:[24,56],railAxis:'v',nativePortPolicy:'preserve-approved-008-owned-corridors'}:{}),
      ...(id==='UKP021-M'?{paintedRailCenters:[26,40],decorativeTrackGeometry:true}:{}),
      ...(id==='UKP021-S'?{adjacentNativeRailRequired:true}:{}),
      ...(spec.group==='freightstation'?{transportGeometry:id==='UKT021-M'?'road-delivery-only':'painted-rail-does-not-connect-native-topology',decorativeTrackGeometry:id!=='UKT021-M'}:{})});
  }
  function buildAll(){const out={};for(const spec of specs)out[spec.id]=Array.from({length:4},(_,v)=>build(spec.id,v));return out;}
  root.BritishUseScalesInfrastructure021=Object.freeze({specs,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
