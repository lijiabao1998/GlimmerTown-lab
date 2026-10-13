/* GPT-021, first review group only. Original world-space shop architecture.
 * Art-only module: no registry, save, world, simulation or RNG access.
 * Reuses the unchanged approved opaque pixel rasterizer and material palette.
 * References: Historic England, England's Co-operative Movement and Department
 * Stores research. No imported raster art, text glyph facade or bitmap scaling.
 */
(function(root){
  'use strict';
  const specs=Object.freeze([
    {id:'UKU021-S',nm:'鄰里街角商店',sz:1,w:80,h:116,k:276,tool:'stationNewsstand009',floors:2,
      plan:'single-shop-with-side-catslide',roof:'one-gable-and-low-lean-to',entry:'front-shop-door',yard:'rear-stock-court',
      masses:[[.9,12.1,3.6,13.9,0,24],[12.4,15,4,10.8,0,8]]},
    {id:'UKU021-M',nm:'高街合作商舖',sz:2,w:160,h:194,k:238,tool:'coOpStores',floors:3,
      plan:'L-shaped-two-street-frontages',roof:'two-perpendicular-ridges',entry:'two-independent-shop-entrances',yard:'open-delivery-court',
      masses:[[1.8,29.5,1.8,10.8,0,39.5],[20.4,29.5,10.8,28.2,0,39.5]]},
    {id:'UKU021-L',nm:'愛德華式中庭百貨',sz:3,w:232,h:240,k:240,tool:'coveredMarket',floors:4,
      plan:'four-ranges-and-real-open-courtyard',roof:'separate-front-side-and-rear-ridges',entry:'open-arched-passage',yard:'rear-loading-wing',
      masses:[[2,20.2,35,45.6,0,52],[26.8,46,35,45.6,0,52],[20.2,26.8,35,45.6,14.4,52],
        [2,14,8.5,35,0,37],[34,46,8.5,35,0,37],[14,34,5,15,0,27]]}
  ].map(s=>Object.freeze({...s,masses:Object.freeze(s.masses.map(q=>Object.freeze(q)))})));
  function build(id,view){
    const spec=specs.find(q=>q.id===id);if(!spec)throw Error('Unknown candidate '+id);
    if(!Number.isInteger(view)||view<0||view>3)throw Error('Four bounded geometric views required');
    const K=root.BritishComplexPrimitives014;if(!K)throw Error('Approved native pixel engine missing');
    const {P,C,hash,mod,Scene,paving,brick,sash,timberDoor,lantern,wallLamp,rainpipe}=K;
    const S=Scene(spec.sz,view,spec.w,spec.h),extent=spec.sz*16;
    const green=C('355a49'),greenHi=C('5b7862'),greenD=C('254437'),glass=C('66868b');
    // Illuminate the screen-left face after the same geometry turns, rather
    // than baking world-north bright walls into every rotated elevation.
    function dark(nx,ny){let x=nx,y=ny;if(view===1){x=-ny;y=nx;}else if(view===2){x=-nx;y=-ny;}else if(view===3){x=ny;y=-nx;}return x>y;}
    function walls(x0,x1,y0,y1,z0,z1,seed,stone){
      const material=(nx,ny)=>stone?K.ashlar(dark(nx,ny),seed):brick(dark(nx,ny),seed);
      S.wall([x0,y1],[x1,y1],z0,z1,material(0,1));
      S.wall([x1,y0],[x0,y0],z0,z1,material(0,-1));
      S.wall([x1,y1],[x1,y0],z0,z1,material(1,0));
      S.wall([x0,y0],[x0,y1],z0,z1,material(-1,0));
      S.flat(x0,x1,y0,y1,z1,P.stoneR);
      return {front:S.face([x0,y1],[x1,y1],0,1),back:S.face([x1,y0],[x0,y0],0,-1),
        right:S.face([x1,y1],[x1,y0],1,0),left:S.face([x0,y0],[x0,y1],-1,0)};
    }
    function course(F,z,col){F.block(0,F.length,0,.24,z,z+.5,col||P.stone,P.stoneR,P.stoneHi);}
    function roof(x0,x1,y0,y1,z,rise,alongX){
      const cx=(x0+x1)/2,cy=(y0+y1)/2,slate=(nx,ny)=>K.slate(dark(nx,ny));
      if(alongX){
        S.poly([[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]],slate(0,-1));
        S.poly([[x0,y1,z],[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z]],slate(0,1));
        for(const x of[x0,x1])S.poly([[x,y0,z],[x,y1,z],[x,cy,z+rise]],brick(dark(x===x0?-1:1,0),2112));
        S.beam([x0,cy,z+rise],[x1,cy,z+rise],P.lead,.33);
      }else{
        S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],slate(-1,0));
        S.poly([[x1,y0,z],[x1,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],slate(1,0));
        for(const y of[y0,y1])S.poly([[x0,y,z],[x1,y,z],[cx,y,z+rise]],brick(dark(0,y===y0?-1:1),2113));
        S.beam([cx,y0,z+rise],[cx,y1,z+rise],P.lead,.33);
      }
      for(const x of[x0,x1])S.beam([x,y0,z],[x,y1,z],P.ironD,.28);
      for(const y of[y0,y1])S.beam([x0,y,z],[x1,y,z],P.ironD,.28);
    }
    function chimney(x,y,z,pots){
      walls(x-.62,x+.62,y-.75,y+.75,z-2,z+4,2131);
      S.box(x-.82,x+.82,y-.9,y+.9,z+3.6,z+4.1,P.stone,P.stoneR,P.stoneHi);
      for(let p=0;p<pots;p++){const xx=x+(p-(pots-1)/2)*.62;
        K.cylinder(S,xx,y,z+4.1,z+6.6,.20,.27,C('bc805c'),C('905c44'),P.ink,8);
        K.cylinder(S,xx,y,z+6.3,z+6.7,.33,.33,C('c78c67'),C('8f5b44'),P.ink,8);
      }
    }
    function crates(x,y,count){for(let a=0;a<count;a++){
      const xx=x+a*1.35;S.box(xx,xx+1.1,y,y+1.25,.15,1.7,P.woodHi,P.woodR,P.woodHi);
      S.beam([xx,y+1.27,.6],[xx+1.1,y+1.27,1.35],P.woodD,.16);
    }}
    function shopfront(F,start,width,door){
      const bottom=.7,top=11.2;
      F.block(start-.3,start+width+.3,.05,.44,bottom,top,green,greenD,greenHi);
      F.panel(start,start+width,2,9.4,(x,y)=>{
        if(y<.65||y>6.9||x<.22||x>width-.22)return greenHi;
        if(Math.abs(mod(x,3.1))<.17||Math.abs(y-5.1)<.15)return P.frameR;
        if(y<1.8&&mod(x,1.4)<.9)return [hash(Math.floor(x),1,2120)%2?P.woodHi:P.paper,0];
        return [y>5?P.glassHi:glass,y>1.8?P.warm:0];
      },.51);
      F.block(start-.42,start+width+.42,.1,.75,10,11.1,green,greenD,greenHi);
      F.panel(start+.3,start+width-.3,10.34,10.57,P.gold,.79);
      for(let u=start;u<=start+width+.1;u+=3.1){
        F.block(u-.20,u+.20,.07,.80,.7,10.2,greenHi,greenD,greenHi);
        F.block(u-.33,u+.33,.1,.93,9.1,9.5,P.gold,C('a08d61'),C('e6d3a0'));
      }
      if(door!==undefined)timberDoor(F,door,.8,2.35,9,true);
    }
    function upper(F,floors,bays,z0,bayW,arch){
      for(let floor=0;floor<floors;floor++){
        const z=z0+floor*12.6,spacing=F.length/bays;
        for(let b=0;b<bays;b++){
          const u=spacing*(b+.5)-bayW/2;
          if(arch&&floor===floors-1)K.archWindow(S,F,u,z,bayW,7.8,true);
          else sash(S,F,u,z,bayW,7.7,true);
        }
        course(F,z-1.2);
      }
    }
    function gate(F,u,w){timberDoor(F,u,.6,w,8,false);F.block(u-.25,u+w+.25,0,.6,8.6,9.3,P.stone,P.stoneR,P.stoneHi);}
    function gutter(F,z){F.block(0,F.length,0,.35,z,z+.45,P.iron,P.ironD,P.ironHi);}
    S.flat(.4,extent-.4,.4,extent-.4,0,paving);
    if(spec.sz===1){
      const F=walls(.9,12.1,3.6,13.9,.2,24,2101);
      shopfront(F.front,.4,10.35,7.25);shopfront(F.right,.8,5.4,6.85);
      upper(F.front,1,2,14.2,3.6,false);upper(F.right,1,2,14.2,3.1,false);
      sash(S,F.back,1.2,14.2,3,6.2,true);gate(F.back,7.4,2.45);
      sash(S,F.left,1.2,14.2,3,6.2,true);
      gate(F.left,4.5,2.2);gutter(F.front,23.6);gutter(F.back,23.6);
      roof(.66,12.34,3.38,14.1,24.2,5.4,true);chimney(2.4,6.2,28.2,2);
      const A=walls(12.4,15,4,10.8,.2,8,2102);
      S.poly([[12.4,4,9.3],[12.4,10.8,9.3],[15,10.8,7.9],[15,4,7.9]],K.slate(true));
      gate(A.back,.6,1.35);crates(1.1,1.2,3);
      walls(.9,9.8,.6,1.1,0,1.55,2140);walls(14.6,15.1,1.1,3.6,0,2.3,2141);
      wallLamp(S,F.front,5.8,10.3);wallLamp(S,F.back,6.3,10.3);rainpipe(S,11.95,14.15,23.5);
    }else if(spec.sz===2){
      const A=walls(1.8,29.5,1.8,10.8,.3,39.5,2201),B=walls(20.4,29.5,10.8,28.2,.3,39.5,2202);
      shopfront(A.front,.7,17.9,12.7);shopfront(B.front,.5,8.1,5.5);
      shopfront(B.right,1.1,15.2,10.3);shopfront(A.left,.6,7.8,4.9);
      upper(A.front,2,5,14.2,3.9,true);upper(A.back,2,5,14.2,3.5,false);
      upper(B.front,2,2,14.2,3.3,true);upper(B.right,2,4,14.2,3.5,true);
      upper(B.left,2,3,14.2,3.4,false);upper(A.left,2,2,14.2,3.1,false);
      gate(A.back,20.5,4.2);gate(B.left,5.2,4.4);
      for(const F of[A.front,A.back,A.left,B.front,B.right,B.left]){course(F,12.5);course(F,38.8);gutter(F,39.5);}
      roof(1.4,29.9,1.4,11.1,39.9,7.5,true);
      roof(20.1,29.8,11.05,28.6,39.9,8.3,false);
      chimney(4.2,5.9,47.5,2);chimney(25,17.8,48.2,3);
      rainpipe(S,20.1,26.7,39.3);rainpipe(S,1.45,8.2,39.3);
      // The delivery courtyard is a full open 16-unit-wide area, with a
      // passable gate; crates and hand trolley leave the centre lane clear.
      const L=walls(2,4.1,15.5,24.1,0,4.8,2203);gate(L.right,1.8,3.2);
      crates(5.2,15.5,4);crates(5.2,17,3);
      S.box(11.1,14.9,14.6,17.7,.1,.6,P.wood,P.woodR,P.woodHi);
      for(const x of[11.5,14.5])for(const y of[15,17.3])K.cylinder(S,x,y,.15,.8,.40,.40,P.iron,P.ironD,P.ironHi,8);
      walls(2,12.5,29.1,29.7,0,1.45,2204);
      lantern(S,15.6,26.7,8,true);wallLamp(S,B.front,4.4,10.2);
    }else{
      // Four separately designed ranges enclose a genuine hole in the plan.
      // The front range is split, and its bridge starts above the passage.
      const A=walls(2,20.2,35,45.6,.3,52,2301,true),B=walls(26.8,46,35,45.6,.3,52,2302,true);
      const bridge=walls(20.2,26.8,35,45.6,14.4,52,2303,true);
      const L=walls(2,14,8.5,35,.3,37,2304),R=walls(34,46,8.5,35,.3,37,2305),back=walls(14,34,5,15,.3,27,2306);
      shopfront(A.front,.8,16.6,12.6);shopfront(B.front,.8,17.6,3.1);
      shopfront(A.left,.7,9.3,5.4);shopfront(B.right,.7,9.3,5.4);
      upper(A.front,3,3,14.8,4.3,true);upper(B.front,3,3,14.8,4.3,true);
      upper(A.left,3,2,14.8,3.9,false);upper(B.right,3,2,14.8,3.9,false);
      upper(bridge.front,3,1,14.8,4.4,true);
      for(const F of[A.front,B.front,bridge.front]){course(F,12.5);course(F,51.4);for(let u=.1;u<F.length;u+=F.length/3)K.pilaster(S,F,u,12.9,37.8,.8);}
      for(const F of[L.left,L.right,R.left,R.right]){upper(F,2,5,11.3,3.7,false);course(F,36.4);}
      upper(back.front,1,4,14.1,3.4,false);upper(back.back,1,4,14.1,3.4,false);
      for(const F of[L.back,R.back]){upper(F,2,2,11.3,3.5,false);gate(F,4.4,3.3);}
      for(const F of[L.front,R.front])upper(F,2,2,11.3,3.5,false);
      shopfront(back.front,1,18,12.3);gate(back.back,7.5,4.5);
      roof(1.6,46.4,34.7,46,52.5,9.9,true);
      roof(1.65,14.2,8.2,34.7,37.5,8.1,false);roof(33.8,46.35,8.2,34.7,37.5,8.1,false);
      roof(14,34,4.7,15.2,27.3,6.3,true);
      // Stone arch has an actual unglazed tunnel. The solid spring fills run
      // back to the court, with upper bridge floor independent of the opening.
      const cx=23.5,r=3.3,spring=9.9;
      for(let i=0;i<18;i++){
        const a=i*Math.PI/18,b=(i+1)*Math.PI/18;
        const x0=cx+Math.cos(b)*r,x1=cx+Math.cos(a)*r,z0=spring+Math.sin(b)*r,z1=spring+Math.sin(a)*r;
        S.poly([[x0,45.6,z0],[x1,45.6,z1],[x1,45.6,14.4],[x0,45.6,14.4]],P.stone);
        S.poly([[x0,35,z0],[x1,35,z1],[x1,35,14.4],[x0,35,14.4]],P.stoneR);
        S.poly([[x0,35,z0],[x1,35,z1],[x1,45.6,z1],[x0,45.6,z0]],P.stoneD);
      }
      K.ring(S,bridge.front,3.3,spring,r+.53,r+.53,.5,.17,P.stoneHi,18);
      bridge.front.block(2.65,3.95,.08,.78,13.0,14.4,P.stone,P.stoneR,P.stoneHi);
      for(const x of[20.1,26.9])S.box(x-.30,x+.30,45.61,46.05,.4,spring,P.stone,P.stoneR,P.stoneHi);
      S.flat(20.4,26.6,35.1,47.2,.06,(x,y)=>mod(x+y,2)<.18?P.stoneR:P.paveHi);
      wallLamp(S,A.front,17.3,10.6);wallLamp(S,B.front,1.0,10.6);
      lantern(S,18.3,18.5,8,true);lantern(S,30.3,30.2,8,true);
      chimney(6,23,45.7,3);chimney(40.1,13,45.7,3);chimney(6.3,38.2,61.6,3);
      for(const x of[2.0,46])rainpipe(S,x,45.8,51.5);
      // Rear service canopy and small packages stay behind the public court.
      for(const x of[16.2,30.8])S.beam([x,1.1,.1],[x,1.1,7],P.iron,.38);
      S.flat(15,32,1.1,4.9,7,P.lead);crates(16,2,5);crates(25,2.1,4);
      walls(2.2,10.2,1.4,5.6,.1,6.2,2307);gate(S.face([10.2,1.4],[10.2,5.6],1,0),.7,2.6);
    }
    return S.finish({id:spec.id,nm:spec.nm,k:spec.k,tool:spec.tool,floors:spec.floors,plan:spec.plan,roof:spec.roof,
      entry:spec.entry,yard:spec.yard,masses:spec.masses,candidate:true,lightPolicy:'opaque-shared-depth-physical-fixtures'});
  }
  root.BritishUseScales021=Object.freeze({specs,build,buildAll:()=>specs.flatMap(s=>Array.from({length:4},(_,v)=>build(s.id,v)))});
})(typeof window==='undefined'?globalThis:window);
