/* GPT-014 / original British civic complexes: baths and central fire brigade.
 * Primary architectural research, consulted 2026-10-05:
 * https://historicengland.org.uk/listing/the-list/list-entry/1376535
 *   Camberwell: red brick, terracotta, grand entrance and roof-lit pool halls.
 * https://historicengland.org.uk/listing/the-list/list-entry/1404746
 *   Woolton: pool hall, private-bath range, rear laundry, boiler and chimney.
 * https://historicengland.org.uk/images-books/photos/item/PLA01/03/0221
 *   Westminster: trusses and glazed skylights above the former slipper baths.
 * https://historicengland.org.uk/listing/the-list/list-entry/1385916
 *   Southwark: headquarters, appliance bays, workshops, dormitories, drill yard.
 * https://collection.sciencemuseumgroup.org.uk/objects/co45251/motor-fire-engine-with-hatfield-pump-made-by-merryweather-and-sons-fire-engines
 *   1904 motor pump: 4.8m long, 2.05m wide, 2.1m high; suction hose and ladder.
 * Original architectural composites, not measured copies of the named buildings.
 * Baths are a late-Victorian complex, fire buildings a late-Victorian/Edwardian
 * headquarters occupied in the early motor-appliance era. No modern blue lights.
 * Six complete buildings, real four-camera geometry, jointly depth-resolved day
 * and physical warm emission. 4x4:304x320; 2x2:160x196; paths:72x92.
 * All eight paths have furniture, retain x=5.3..10.7 clear walking space, and
 * use full-size native 1x1 terrain geometry. No fonts, imported pixels, RNG,
 * simulation/storage mutation or screen-space halos. Existing art is untouched.
 */
(function(root){
  'use strict';
  const K=root.BritishComplexPrimitives014;
  if(!K)throw new Error('BritishComplexPrimitives014 must load before BritishBathsFire014');
  const {Scene,P,C,mod,hash,GLOW,LAMP,brick,paving,slate,band,masonry,cylinder,ring,
    sash,hippedRoof,rainpipe,lantern,wallLamp,leafRelief,blossom,pottedPlant,
    ironRail,bench,cornice,archWindow,timberDoor}=K;
  const T={terra:C('b97654'),terraHi:C('d39972'),terraR:C('925c45'),
    tile:C('68978f'),tileHi:C('a5beb1'),tileD:C('426e6c'),
    red:C('a84035'),redHi:C('c35c47'),redD:C('702f2b'),
    brass:C('c6a05d'),brassHi:C('e1c484'),brassD:C('92774b'),
    hose:C('c6b994'),hoseR:C('a39374'),white:C('e6dfc7'),
    glass:C('7eada9'),glassR:C('608d91'),glassHi:C('b2c9bd'),
    wet:C('637d7a'),water:C('739997'),waterHi:C('aac4b6'),
    gravel:C('a39c8c'),gravelD:C('8c897d'),grass:C('72816a'),
    turf:C('5b7151'),coal:C('3d4440')};

  function faces(S,x0,x1,y0,y1){return {
    front:S.face([x0,y1],[x1,y1],0,1),back:S.face([x1,y0],[x0,y0],0,-1),
    left:S.face([x0,y0],[x0,y1],-1,0),right:S.face([x1,y1],[x1,y0],1,0)};}
  function ground(S,size){
    S.flat(0,size,0,size,0,paving);
    for(const q of[.15,size-.4]){
      S.flat(.15,size-.15,q,q+.22,.025,P.stoneR);
      S.flat(q,q+.22,.15,size-.15,.025,P.stoneR);
    }
  }
  function terraBand(S,x0,x1,y0,y1,z,h){
    S.box(x0-.18,x1+.18,y0-.18,y1+.18,z,z+h,T.terra,T.terraR,T.terraHi);
  }
  function drain(S,x0,x1,y0,y1){
    S.flat(x0,x1,y0,y1,.08,P.ironD);
    for(let x=x0+.22;x<x1-.15;x+=.48)S.flat(x,x+.14,y0+.16,y1-.16,.105,P.lead);
  }
  function terracottaPier(S,F,u,z,h,w){
    F.block(u-w/2,u+w/2,.02,.45,z,z+h,T.terra,T.terraR,T.terraHi);
    for(let zz=z+1.2;zz<z+h-.8;zz+=3.25)F.block(u-w*.55,u+w*.55,.02,.56,zz,zz+.46,T.terraHi,T.terraR,T.terraHi);
    F.block(u-w*.7,u+w*.7,.01,.7,z+h-.85,z+h+.15,T.terra,T.terraR,T.terraHi);
  }
  function flowerBed(S,x0,x1,y0,y1,seed){
    S.box(x0,x1,y0,y1,.1,.72,P.stone,P.stoneR,P.stoneHi);
    S.flat(x0+.25,x1-.25,y0+.25,y1-.25,.74,P.soil);
    for(let y=y0+.68;y<y1-.42;y+=1.35)for(let x=x0+.65;x<x1-.45;x+=1.24){
      const v=hash(Math.floor(x*5),Math.floor(y*3),seed),h=.9+(v%4)*.17;
      S.beam([x,y,.76],[x+.18,y,h+1.08],P.leaf[3],.12);
      S.poly([[x-.46,y,.94],[x+.28,y-.48,h+.68],[x+.56,y+.2,h+.44],[x,y+.45,1.02]],P.leaf[v%4]);
      if(v%3!==0)blossom(S,x+.16,y,h+1.02,.37,P.flower[v%5]);
    }
  }
  function steps(S,x0,x1,y,h,n){
    for(let i=0;i<n;i++)S.box(x0,x1,y+i*.68,y+(i+1)*.68,0,h-i*h/n,P.stone,P.stoneR,P.stoneHi);
  }
  function plaque(S,F,u,z,w,h,kind){
    F.block(u,u+w,.08,.35,z,z+h,T.terra,T.terraR,T.terraHi);
    F.panel(u+.28,u+w-.28,z+.3,z+h-.3,P.stoneHi,.38);
    const c=u+w/2;
    if(kind==='waves'){
      for(let row=0;row<3;row++)for(let i=0;i<8;i++){
        const a=c-w*.31+i*w*.077,b=a+w*.072;
        const zz=z+h*.28+row*h*.18,ra=i%2===0?.18:-.18;
        S.beam(F.point(a,.43,zz+ra),F.point(b,.43,zz-ra),T.tileD,.16);
      }
    }else{
      // A relief shield, crossed hand tools and a raised boss are fixed masonry.
      S.poly([[c-w*.21,z+h*.75],[c+w*.21,z+h*.75],[c+w*.18,z+h*.4],[c,z+h*.23],[c-w*.18,z+h*.4]].map(p=>F.point(p[0],.43,p[1])),T.redD,.055);
      for(const sign of[-1,1])S.beam(F.point(c-sign*w*.2,.48,z+h*.29),F.point(c+sign*w*.2,.48,z+h*.78),T.brass,.18);
      ring(S,F,c,z+h*.53,w*.11,h*.13,.21,.50,T.brassHi,12);
    }
  }
  function bathArch(S,F,u,z,w,h,lit){
    // Glazed-white/sea-green interiors, without the theatre curtain strips.
    const spring=h-w/2,mid=u+w/2;
    const arch=(a,b,bot,top,depth,mat)=>{
      const r=(b-a)/2,s=top-r,c=(a+b)/2,q=[F.point(a,depth,bot),F.point(b,depth,bot),F.point(b,depth,s)];
      for(let i=1;i<=20;i++){const t=i*Math.PI/20;q.push(F.point(c+Math.cos(t)*r,depth,s+Math.sin(t)*r));}
      S.poly(q,mat,.04);
    };
    arch(u-.52,u+w+.52,z-.15,z+h+.48,.06,T.terraR);
    const base=F.point(u,.15,z),q=F.point(u+1,.15,z),dx=q[0]-base[0],dy=q[1]-base[1];
    arch(u,u+w,z,z+h,.15,(x,y,zz)=>{
      const a=(x-base[0])*dx+(y-base[1])*dy,b=zz-z;
      if(a<.2||a>w-.2||b<.25||Math.abs(a-w/2)<.13||Math.abs(a-w/4)<.09||Math.abs(a-w*.75)<.09)return T.white;
      if(Math.abs(b-spring)<.13||Math.abs(b-h*.31)<.12||Math.abs(b-h*.6)<.11)return P.frameR;
      if(b>spring&&mod(Math.atan2(b-spring,a-w/2)*(w/2),1.7)<.13)return T.white;
      if(b<h*.17)return T.tile;
      return lit?(a<w/2?[T.glass,P.warm]:[T.glassR,P.warmD]):a<w/2?T.glass:T.glassR;
    });
    for(let i=0;i<13;i++){
      const a=i*Math.PI/13+.011,b=(i+1)*Math.PI/13-.011,r=w/2;
      S.poly([F.point(mid+Math.cos(a)*(r+.66),.34,z+spring+Math.sin(a)*(r+.66)),
        F.point(mid+Math.cos(b)*(r+.66),.34,z+spring+Math.sin(b)*(r+.66)),
        F.point(mid+Math.cos(b)*r,.34,z+spring+Math.sin(b)*r),
        F.point(mid+Math.cos(a)*r,.34,z+spring+Math.sin(a)*r)],i%2?T.terra:T.terraHi,.055);
    }
    for(const a of[u-.52,u+w+.07])F.block(a,a+.45,.01,.48,z-.25,z+spring,T.terra,T.terraR,T.terraHi);
    F.block(u-.62,u+w+.62,.02,.68,z-.7,z-.21,T.terraHi,T.terraR,T.terraHi);
    F.block(mid-.33,mid+.33,.03,.62,z+h-.15,z+h+.82,P.stone,P.stoneR,P.stoneHi);
  }
  function glazedRoof(S,x0,x1,y0,y1,z,rise,alongX,seed){
    // The two roof slopes are finite physical surfaces. Opaque glazing reads as
    // reflected sky by day; selected actual panes emit warmly with the same depth.
    const span=alongX?y1-y0:x1-x0,run=alongX?x1-x0:y1-y0;
    const world=(u,v,h)=>alongX?[x0+v,y0+u,h]:[x0+u,y0+v,h];
    const zAt=u=>z+rise*(1-Math.abs(u-span/2)/(span/2));
    const mat=(x,y,zz)=>{
      const u=alongX?y-y0:x-x0,v=alongX?x-x0:y-y0;
      if(u<span*.16||u>span*.84)return slate(u>span/2)(x,y,zz);
      if(mod(v,2.35)<.14||mod(zz-z,2.2)<.10)return P.frameR;
      const n=hash(Math.floor(v/2.35),Math.floor((zz-z)/2.2),seed);
      if(n%5===0)return [u<span/2?T.glassHi:T.glass,P.warmD];
      return u<span/2?(n%4===0?T.glassHi:T.glass):T.glassR;
    };
    S.poly([world(0,0,z),world(0,run,z),world(span/2,run,z+rise),world(span/2,0,z+rise)],mat);
    S.poly([world(span/2,0,z+rise),world(span/2,run,z+rise),world(span,run,z),world(span,0,z)],mat);
    for(const u of[0,span*.16,span*.84,span])S.beam(world(u,0,zAt(u)+.09),world(u,run,zAt(u)+.09),P.ironHi,.32);
    for(let v=.6;v<run;v+=4.7)for(const u of[0,span/2])S.beam(world(u,v,zAt(u)+.08),world(u+span/2,v,zAt(u+span/2)+.08),P.frame,.22);
    for(const v of[0,run]){
      S.poly([world(0,v,z),world(span,v,z),world(span/2,v,z+rise)],brick(!alongX,seed));
      S.beam(world(0,v,z+.2),world(span/2,v,z+rise+.2),T.terraHi,.48);
      S.beam(world(span,v,z+.2),world(span/2,v,z+rise+.2),T.terraHi,.48);
      const F=S.face(world(0,v,0),world(span,v,0),alongX?(v===0?-1:1):0,alongX?0:(v===0?-1:1));
      const rx=Math.min(2.45,span*.14),rz=Math.min(2.65,rise*.23),cz=z+rise*.38,glass=[];
      for(let i=0;i<20;i++){
        const a=i*Math.PI/10;glass.push(F.point(span/2+Math.cos(a)*rx,.11,cz+Math.sin(a)*rz));
      }
      S.poly(glass,[T.glassR,P.warmD],.03);
      ring(S,F,span/2,cz,rx+.38,rz+.38,.38,.20,T.terraHi,20);
      S.beam(F.point(span/2-rx,.23,cz),F.point(span/2+rx,.23,cz),P.frame,.18);
      S.beam(F.point(span/2,.23,cz-rz),F.point(span/2,.23,cz+rz),P.frame,.18);
    }
    // A narrow ventilating glazed monitor sits on and intersects the main roof.
    const u0=span*.435,u1=span*.565,base=zAt(u0)-.05,top=z+rise+2.4;
    const monitor=(x,y,zz)=>mod((alongX?x-x0:y-y0)-1.2,2.35)<.2||zz>top-.26?P.frameR:[T.glassR,P.warmD];
    for(const u of[u0,u1])S.poly([world(u,1.2,base),world(u,run-1.2,base),world(u,run-1.2,top),world(u,1.2,top)],monitor);
    for(const v of[1.2,run-1.2])S.poly([world(u0,v,base),world(u1,v,base),world(u1,v,top),world(u0,v,top)],T.terraR);
    S.poly([world(u0-.22,1,top),world(u1+.22,1,top),world(u1+.22,run-1,top),world(u0-.22,run-1,top)],P.lead);
    S.beam(world(span/2,.6,top+.32),world(span/2,run-.6,top+.32),P.ironHi,.24);
    for(const v of[2.0,run-2.0])S.beam(world(span/2,v,top+.3),world(span/2,v,top+1.5),P.iron,.22);
  }
  function swimmingHall(S,x0,x1,y0,y1,z,alongX,seed){
    const f=masonry(S,x0,x1,y0,y1,.25,z,seed);
    terraBand(S,x0,x1,y0,y1,1.1,1.1);terraBand(S,x0,x1,y0,y1,z-2,.7);
    for(const F of Object.values(f)){
      const n=Math.max(1,Math.floor(F.length/6.6)),step=F.length/n;
      for(let i=0;i<n;i++)bathArch(S,F,i*step+step*.23,5.5,step*.53,z-9.0,(i+seed)%3!==0);
      for(let i=0;i<=n;i++)terracottaPier(S,F,Math.max(.45,Math.min(F.length-.45,i*step)),2.2,z-4.2,.65);
      for(let u=1.25;u<F.length-1;u+=3.2)F.block(u,u+.5,.03,.45,z-1.65,z-1.13,T.terra,T.terraR,T.terraHi);
    }
    glazedRoof(S,x0-.4,x1+.4,y0-.4,y1+.4,z+.4,Math.min(12,(alongX?y1-y0:x1-x0)*.47),alongX,seed);
    for(const [x,y]of[[x0-.25,y0+.9],[x1+.25,y1-.8]])rainpipe(S,x,y,z+.3);
    return f;
  }
  function chimney(S,x,y,z0,h,w){
    S.box(x-w*.67,x+w*.67,y-w*.67,y+w*.67,z0,z0+3.0,T.terra,T.terraR,T.terraHi);
    S.box(x-w/2,x+w/2,y-w/2,y+w/2,z0+3,z0+h,brick(false,1440),brick(true,1440),P.ink);
    for(const z of[z0+h-3.1,z0+h-1.9,z0+h-.7])S.box(x-w*.58,x+w*.58,y-w*.58,y+w*.58,z,z+.58,T.terra,T.terraR,T.terraHi);
    S.flat(x-w*.35,x+w*.35,y-w*.35,y+w*.35,z0+h+.015,P.ink);
  }
  function laundryBasket(S,x,y,z,w){
    const r=w/2;
    cylinder(S,x,y,z,z+w*.75,r*.8,r,T.hose,T.hoseR,T.white,8);
    for(let zz=z+.16;zz<z+w*.7;zz+=.35)cylinder(S,x,y,zz,zz+.07,r*(.8+.2*(zz-z)/(w*.75)),r*(.8+.2*(zz-z)/(w*.75)),P.woodR,P.woodR,undefined,8);
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4;S.beam([x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.8,z+.07],[x+Math.cos(a)*r,y+Math.sin(a)*r,z+w*.72],P.woodHi,.11);
    }
    S.box(x-r*.6,x+r*.15,y-r*.2,y+r*.56,z+w*.73,z+w*.9,T.white,P.frameR,T.white);
    S.box(x-r*.1,x+r*.65,y-r*.6,y+r*.12,z+w*.72,z+w*.85,P.frame,P.frameR,T.white);
  }
  function clothesLine(S,x0,x1,y,z){
    for(const x of[x0,x1]){
      S.beam([x,y,.2],[x,y,z+.35],P.iron,.24);
      S.beam([x,y-.55,z],[x,y+.55,z],P.iron,.22);
      cylinder(S,x,y,z+.2,z+.53,.25,.05,P.ironHi,P.iron,P.ironHi,6);
    }
    S.beam([x0,y,z],[x1,y,z],T.hoseR,.09);
    const n=Math.max(1,Math.floor((x1-x0)/2.8));
    for(let i=0;i<n;i++){
      const a=x0+.65+i*(x1-x0-1)/n,b=Math.min(x1-.45,a+1.8),bot=z-2.55-(i%2)*.48;
      S.poly([[a,y,z-.12],[b,y,z-.12],[b-.12,y+.12,bot],[a+.08,y+.12,bot]],i%3===0?P.frame:T.white);
      for(const xx of[a+.16,b-.16])S.box(xx-.06,xx+.06,y-.08,y+.13,z-.3,z+.07,P.wood,P.woodR,P.woodHi);
      S.beam([a+.15,y+.14,bot+.22],[b-.16,y+.14,bot+.22],P.frameR,.08);
    }
  }
  function laundryBlock(S,x0,x1,y0,y1,h,seed){
    const f=masonry(S,x0,x1,y0,y1,.22,h,seed);
    terraBand(S,x0,x1,y0,y1,1.2,.75);terraBand(S,x0,x1,y0,y1,h-1.3,.5);
    const wid=x1-x0,dep=y1-y0;
    timberDoor(f.front,1.4,.5,Math.min(3.6,wid*.25),10,true);
    for(const F of[f.left,f.right])for(let u=2;u<F.length-3;u+=5.8)bathArch(S,F,u,5,3.2,h-7.3,(Math.floor(u)+seed)%2===0);
    if(wid>11)bathArch(S,f.front,wid-5.5,5,3.6,h-7.0,true);
    for(let u=2;u<wid-3;u+=5.8)sash(S,f.back,u,4.5,2.8,7.5,false);
    glazedRoof(S,x0-.32,x1+.32,y0-.32,y1+.32,h+.2,Math.min(6,wid*.38),false,seed);
    rainpipe(S,x1+.15,y1-.6,h);
    drain(S,x0+1,x1-1,y1+.45,y1+1.04);
    wallLamp(S,f.front,wid-.65,10.2);
    return f;
  }
  function bathEntrance(S,x0,x1,y0,y1,h){
    const f=masonry(S,x0,x1,y0,y1,.2,h,1423),w=x1-x0,mid=w/2;
    terraBand(S,x0,x1,y0,y1,2,1);terraBand(S,x0,x1,y0,y1,h-3,1.0);cornice(S,x0,x1,y0,y1,h);
    for(const F of[f.left,f.right]){
      bathArch(S,F,Math.max(1,(F.length-4)/2),4.5,4.0,h-8.4,true);
      terracottaPier(S,F,.52,3,h-4,.84);terracottaPier(S,F,F.length-.52,3,h-4,.84);
    }
    for(const u of[2.0,w-6.4])bathArch(S,f.front,u,5.2,4.4,h-10.2,true);
    for(const u of[.65,8.4,w-8.4,w-.65])terracottaPier(S,f.front,u,2.8,h-3.7,1.0);
    timberDoor(f.front,mid-2.6,1.0,5.2,12.7,true);
    bathArch(S,f.front,mid-2.55,14.25,5.1,7.0,true);
    for(const du of[-3.4,3.4]){
      f.front.block(mid+du-.34,mid+du+.34,.1,1.05,1.0,16.15,T.terra,T.terraR,T.terraHi);
      f.front.block(mid+du-.57,mid+du+.57,.12,1.27,13.9,14.8,T.terraHi,T.terraR,T.terraHi);
    }
    steps(S,x0+mid-3.8,x0+mid+3.8,y1+.3,1.0,3);
    for(const u of[mid-4.6,mid+4.6])wallLamp(S,f.front,u,12.0);
    hippedRoof(S,x0-.4,x1+.4,y0-.4,y1+.4,h+.75,5.5,true);
    // A stepped terracotta gable sits on the entrance wall, with a wave relief.
    const front=S.face([x0,y1+.16],[x1,y1+.16],0,1);
    for(const [ww,z0,z1]of[[11.6,h+.5,h+2.2],[9.8,h+2.2,h+4.9],[7.3,h+4.9,h+6.5]])
      front.block(mid-ww/2,mid+ww/2,-.25,.45,z0,z1,T.terra,T.terraR,T.terraHi);
    S.poly([front.point(mid-3.65,.46,h+6.45),front.point(mid+3.65,.46,h+6.45),front.point(mid,.46,h+10.2)],T.terraHi,.06);
    plaque(S,front,mid-2.4,h+1.0,4.8,4.8,'waves');
    for(const du of[-5.15,5.15])cylinder(S,x0+mid+du,y1+.33,h+2.3,h+3.8,.46,.1,T.terraHi,T.terraR,T.terraHi,8);
    S.beam([x0+mid,y1+.2,h+9.5],[x0+mid,y1+.2,h+11.1],P.iron,.22);
    chimney(S,x0+3.4,y0+2.1,h+3.2,7.6,1.65);
    return f;
  }
  function baths(view){
    const S=Scene(4,view,304,320);ground(S,64);
    // Deliberately unequal, perpendicular pool halls distinguish this generous
    // campus from k244's compact parallel halls and from k215's open Roman pool.
    swimmingHall(S,5.8,29.0,5.6,42.6,25.0,false,1420);
    swimmingHall(S,32.0,59.5,5.5,22.0,22.5,true,1421);
    const c=masonry(S,32,40.8,22.0,42.7,.2,16.5,1422);
    for(const F of[c.left,c.right])for(let u=2;u<F.length-3;u+=5.4)bathArch(S,F,u,4.1,2.6,9,true);
    hippedRoof(S,31.7,41.1,21.7,43.0,16.9,4.1,false);
    bathEntrance(S,6.8,38.9,42.6,51.4,25.2);
    const l=laundryBlock(S,44.0,58.8,27.1,41.3,16.5,1430);
    chimney(S,59.4,25.0,.1,43.5,2.5);
    S.box(57.9,61.0,31.3,34.5,.1,2.6,brick(false,1431),brick(true,1431),P.ink);
    for(let y=31.7;y<34.3;y+=.75)for(let x=58.2;x<60.7;x+=.8)S.box(x,x+.58,y,y+.5,2.3,2.9,T.coal,P.ink,T.coal);
    // Service laundry court: real open gate, drying line, basket and wash trough.
    S.flat(43.5,62.0,43.1,61.5,.03,(x,y)=>hash(Math.floor(x*2),Math.floor(y*2),1432)%5===0?T.gravelD:T.gravel);
    for(const [a,b]of[[[43.2,43.4],[43.2,61.7]],[[43.2,61.7],[48.2,61.7]],[[55.5,61.7],[62,61.7]],[[62,43.0],[62,61.7]]])ironRail(S,a,b,.16,4.0);
    clothesLine(S,46.0,59.3,49.0,7.3);clothesLine(S,46.0,59.3,54.4,7.3);
    laundryBasket(S,46.4,58.4,.05,2.55);laundryBasket(S,49.0,57.9,.05,1.9);
    S.box(56.4,60.6,57.1,59.6,.1,2.35,P.stone,P.stoneR,P.stoneHi);
    S.flat(56.8,60.2,57.5,59.2,2.39,T.water);
    S.beam([59.7,57.0,2],[59.7,57,4.5],P.iron,.25);S.beam([59.7,57,4.4],[59.7,57.85,4.4],P.iron,.23);
    for(const x of[2.6,40.8])lantern(S,x,57.9,11.8,true);
    flowerBed(S,4.5,14.0,55.3,58.2,1440);flowerBed(S,30.7,38.8,55.3,58.2,1441);
    bench(S,3.0,46.8,6.6,false);
    for(const [a,b]of[[[.9,61.8],[17.7,61.8]],[[27.8,61.8],[41.5,61.8]]])ironRail(S,a,b,.15,3.8);
    for(const x of[17.4,28.1]){
      S.box(x-.52,x+.52,61.2,62.3,.1,5.7,T.terra,T.terraR,T.terraHi);
      S.box(x-.68,x+.68,61.0,62.5,5.5,6.2,P.stone,P.stoneR,P.stoneHi);
    }
    drain(S,14.2,32.1,53.6,54.2);
    return S.finish({id:288,design:'victorian-baths-washhouse-complex',poolHalls:2,serviceCourt:true,lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function smallSwimmingHall(view){
    const S=Scene(2,view,160,196);ground(S,32);
    swimmingHall(S,4.8,26.6,3.2,22.6,22.7,false,1448);
    const f=masonry(S,10.0,22.0,22.9,27.2,.1,15.8,1449);
    timberDoor(f.front,3.7,.65,4.6,10.7,true);terraBand(S,10,22,22.9,27.2,13.6,.7);
    plaque(S,f.front,3.2,12.3,5.6,3.1,'waves');
    hippedRoof(S,9.7,22.3,22.6,27.5,16.0,3.5,true);
    for(const u of[1.55,10.45])wallLamp(S,f.front,u,9.3);
    steps(S,13.0,19.2,27.5,.8,2);
    flowerBed(S,2.1,6.2,25.6,29.7,1450);bench(S,27.4,24.1,5.3,false);
    drain(S,10,21.8,30.3,30.8);
    for(const y of[4.7,20.8])lantern(S,29.25,y,10.4,true);
    return S.finish({id:289,design:'independent-victorian-swimming-hall',poolHalls:1,lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function smallWashhouse(view){
    const S=Scene(2,view,160,196);ground(S,32);
    laundryBlock(S,3.6,23.0,4.0,18.9,18.0,1458);chimney(S,27.35,5.5,.1,38.0,2.9);
    const f=masonry(S,23.5,29,10.0,18.9,.1,11.8,1459);
    timberDoor(f.front,1.0,.35,3.0,8.2,false);hippedRoof(S,23.25,29.3,9.7,19.2,12.1,3.0,false);
    clothesLine(S,5.2,22.3,24.0,7.2);laundryBasket(S,6.2,28.35,.1,2.8);
    laundryBasket(S,9.0,28.1,.1,2.05);
    S.box(25,29.7,24.2,27,.1,2.8,P.stone,P.stoneR,P.stoneHi);S.flat(25.4,29.3,24.6,26.6,2.83,T.water);
    S.beam([28.8,24.1,.3],[28.8,24.1,4.9],P.iron,.29);S.beam([28.8,24.1,4.8],[28.8,25,4.8],P.iron,.23);
    ironRail(S,[1.4,21.1],[1.4,30.2],.1,3.8);ironRail(S,[1.4,30.2],[11.9,30.2],.1,3.8);ironRail(S,[20.8,30.2],[30.4,30.2],.1,3.8);
    lantern(S,24.0,29.0,10.7,true);pottedPlant(S,2.3,19.9,.1,.7,P.flower[2]);
    return S.finish({id:290,design:'independent-victorian-washhouse',serviceCourt:true,lightPolicy:'physical-fixtures-only-shared-depth'});
  }

  function ladder(S,a,b,width,color){
    const c=color||P.woodHi,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=len>.001?-dy/len:1,ny=len>.001?dx/len:0;
    for(const q of[-width/2,width/2])S.beam([a[0]+nx*q,a[1]+ny*q,a[2]],[b[0]+nx*q,b[1]+ny*q,b[2]],c,.20);
    const n=Math.max(2,Math.floor(Math.hypot(dx,dy,b[2]-a[2])/1.05));
    for(let i=1;i<n;i++){
      const t=i/n,x=a[0]+dx*t,y=a[1]+dy*t,z=a[2]+(b[2]-a[2])*t;
      S.beam([x-nx*width/2,y-ny*width/2,z],[x+nx*width/2,y+ny*width/2,z],P.wood,.16);
    }
  }
  function hoseCoil(S,x,y,z,r){
    const n=32;
    for(let j=0;j<3;j++)for(let i=0;i<n;i++){
      const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n,rr=r-j*.25;
      S.beam([x+Math.cos(a)*rr,y+Math.sin(a)*rr,z+.15],[x+Math.cos(b)*rr,y+Math.sin(b)*rr,z+.15],j%2?T.hoseR:T.hose,.20);
    }
    S.beam([x+r,y,z+.15],[x+r+.65,y+.2,z+.15],T.brass,.32);
  }
  function wheel(S,x,y,z,r){
    // Vertical wheel in a yz plane, with tyre thickness and true rotating spokes.
    const n=12,q=[];
    for(let i=0;i<n;i++){
      const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n;
      const A=[x-.16,y+Math.cos(a)*r,z+Math.sin(a)*r],B=[x-.16,y+Math.cos(b)*r,z+Math.sin(b)*r],
        C1=[x+.16,B[1],B[2]],D=[x+.16,A[1],A[2]];
      S.poly([A,B,C1,D],P.ink);q.push(D);
    }
    S.poly(q,P.ink);
    for(const xx of[x-.18,x+.18]){
      const F=S.face([xx,y-r],[xx,y+r],xx<x?-1:1,0);
      ring(S,F,r,z,r*.79,r*.79,.16,.03,T.redHi,16);
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4;S.beam([xx,y,z],[xx,y+Math.cos(a)*r*.75,z+Math.sin(a)*r*.75],T.brassD,.10);
      }
      S.box(xx-.08,xx+.08,y-.22,y+.22,z-.22,z+.22,T.brass,T.brassD,T.brassHi);
    }
  }
  function motorPump(S,x,y,scale){
    // 4.8m/2.05m proportion from the 1904 museum vehicle: length/width = 2.34.
    // Scene dimensions are 10.30 x 4.40 units, rather than a toy-sized icon.
    const s=scale||1,box=(a,b,c,d,e,f,front,side,top)=>S.box(x+a*s,x+b*s,y+c*s,y+d*s,e*s,f*s,front,side,top),p=(a,b,z)=>[x+a*s,y+b*s,z*s];
    box(-1.95,1.95,-5.15,5.15,1.0,1.5,P.iron,P.ironD,P.ironHi);
    box(-1.6,1.6,-4.9,1.1,1.5,2.9,T.red,T.redD,T.redHi);
    box(-1.5,1.5,1.2,4.6,1.7,3.0,T.red,T.redD,T.redHi);
    box(-1.0,1.0,2.0,4.9,2.8,3.8,T.red,T.redD,T.redHi);
    box(-1.11,1.11,4.63,4.97,1.6,3.82,T.brass,T.brassD,T.brassHi);
    const R=S.face(p(-1.02,4.99,0),p(1.02,4.99,0),0,1);
    R.panel(0,2.04*s,1.83*s,3.55*s,(u,z)=>mod(u,.31*s)<.1*s?T.brassHi:P.ink,.025);
    for(const xx of[-2.2,2.2])for(const yy of[-3.3,3.15])wheel(S,x+xx*s,y+yy*s,1.17*s,1.12*s);
    for(const xx of[-2.05,2.05]){
      box(xx-.25,xx+.25,-4.65,.8,1.55,1.88,P.wood,P.woodR,P.woodHi);
      box(xx-.3,xx+.3,2.0,4.15,2.0,2.28,T.red,T.redD,T.redHi);
    }
    // Open driving seat, footplate, two inward supports and a modest windscreen.
    box(-1.62,1.62,.0,1.16,2.9,3.34,P.woodD,P.woodR,P.woodHi);
    box(-1.62,1.62,-.07,.16,3.25,4.36,P.woodD,P.woodR,P.woodHi);
    for(const xx of[-1.55,1.55])S.beam(p(xx,1.34,2.95),p(xx,1.34,4.65),T.brassD,.12*s);
    S.wall(p(-1.48,1.34,0),p(1.48,1.34,0),3.45*s,4.62*s,T.glassR);
    S.beam(p(-1.58,1.34,4.65),p(1.58,1.34,4.65),T.brass,.12*s);
    S.beam(p(.6,.9,2.8),p(.6,.7,3.75),P.iron,.17*s);
    const F=S.face(p(.1,.69,0),p(1.1,.69,0),0,-1);ring(S,F,.5*s,3.8*s,.5*s,.31*s,.09*s,.02,P.iron,12);
    for(const xx of[-1.3,1.3]){
      box(xx-.22,xx+.22,-4.25,-.4,3.0,3.45,P.wood,P.woodR,P.woodHi);
      S.beam(p(xx,-4.2,3.7),p(xx,-.4,3.7),T.brass,.11*s);
    }
    // Rear pump casing, suction couplings and a lashed ladder on fixed brackets.
    box(-1.2,1.2,-5.1,-4.44,1.9,3.4,P.ironHi,P.ironD,T.brass);
    for(const xx of[-.69,.69]){
      const F2=S.face(p(xx-.32,-5.15,0),p(xx+.32,-5.15,0),0,-1);
      ring(S,F2,.32*s,2.72*s,.29*s,.29*s,.13*s,.025,T.brassHi,12);
    }
    for(const yy of[-3.6,-.85])for(const xx of[-.8,.8])S.beam(p(xx,yy,3),p(xx,yy,4.8),T.redD,.16*s);
    ladder(S,p(0,-4.65,4.82),p(0,3.7,4.82),1.15*s,P.woodHi);
    for(const yy of[-3.6,-.85])S.beam(p(-.8,yy,4.8),p(.8,yy,4.8),T.hoseR,.17*s);
    for(const xx of[-1.47,1.47]){
      box(xx-.24,xx+.24,4.05,4.43,3.25,3.8,T.brass,T.brassD,T.brassHi);
      box(xx-.17,xx+.17,4.43,4.47,3.32,3.72,LAMP,LAMP,T.brass);
    }
    cylinder(S,x-1.2*s,y+1.0*s,4.1*s,4.55*s,.27*s,.39*s,T.brass,T.brassD,T.brassHi,8);
  }
  function appliancePortal(S,F,u,z,w,h,open){
    // Red folding doors have recessed panels and transom glazing. Open bays use
    // visible inward leaves; a solid building floor/roof still encloses the bay.
    F.block(u-.56,u+w+.56,.03,.55,z-.1,z+h+1.15,P.stone,P.stoneR,P.stoneHi);
    F.panel(u,u+w,z,z+h,P.ink,.58);
    const pane=(x,y)=>{
      const v=mod(x,w/4);
      if(v<.14||v>w/4-.14||y<.18||Math.abs(y-h*.68)<.16||y>h-.18)return T.redHi;
      if(y>h*.7){if(Math.abs(y-h*.84)<.09)return T.redD;return GLOW[2];}
      if(v<.34||v>w/4-.34||y<h*.18||y>h*.56)return T.redD;
      return T.red;
    };
    if(!open)F.panel(u+.08,u+w-.08,z+.05,z+h-.08,pane,.62);
    else{
      for(const q of[0,w-1.05])F.panel(u+q,u+q+1.05,z+.05,z+h-.08,pane,.68);
      F.panel(u+1.12,u+w-1.12,z+h-1.0,z+h-.2,[T.glassR,P.warmD],.60);
      for(const q of[1.13,w-1.13]){
        S.beam(F.point(u+q,.69,z+.2),F.point(u+q,.69,z+h-.18),T.redHi,.22);
      }
    }
    F.block(u-.64,u+w+.64,.02,.85,z+h+.6,z+h+1.4,T.terra,T.terraR,T.terraHi);
    for(const q of[0,w])F.block(u+q-.18,u+q+.18,.58,.82,z+2.5,z+3.4,P.iron,P.ironD,T.brass);
  }
  function garageRange(S,x0,x1,y0,y1,z,n,seed){
    const f=masonry(S,x0,x1,y0,y1,.12,z,seed),step=(x1-x0)/n;
    for(let i=0;i<n;i++){
      appliancePortal(S,f.front,i*step+1.0,.4,step-2.0,12.2,i===1);
      sash(S,f.back,i*step+step*.31,5.3,step*.38,6.6,i%2===0);
      f.front.block(i*step+.12,i*step+.74,.03,.50,.25,z-.7,T.terra,T.terraR,T.terraHi);
    }
    for(const F of[f.left,f.right]){
      timberDoor(F,1.1,.3,2.8,9.0,false);
      if(F.length>9)sash(S,F,F.length-4.6,5,2.8,6.6,true);
    }
    terraBand(S,x0,x1,y0,y1,z-2.0,.75);cornice(S,x0,x1,y0,y1,z);
    hippedRoof(S,x0-.4,x1+.4,y0-.4,y1+.4,z+.7,5.0,true);
    for(const u of[.65,f.front.length-.65])wallLamp(S,f.front,u,13.3);
    for(const [x,y]of[[x0-.16,y0+.5],[x1+.16,y1-.7]])rainpipe(S,x,y,z);
    return f;
  }
  function domesticRange(S,x0,x1,y0,y1,h,seed){
    const f=masonry(S,x0,x1,y0,y1,.12,h,seed);
    for(const F of Object.values(f)){
      for(const z of[4.2,15.5,26.8])if(z+7.2<h)for(let u=2;u<F.length-3;u+=5.7)sash(S,F,u,z,2.75,7.1,(Math.floor(u)+Math.floor(z)+seed)%3!==0);
      for(const u of[.3,F.length-.88])for(let z=2.3;z<h-1.3;z+=2.8)F.block(u,u+.59,.04,.30,z,z+1.4,T.terraHi,T.terraR,T.terraHi);
    }
    for(const z of[2.3,13.4,24.7])if(z<h-1)terraBand(S,x0,x1,y0,y1,z,.6);
    timberDoor(f.front,Math.max(.7,(x1-x0)/2-1.4),.5,2.8,9.3,true);
    cornice(S,x0,x1,y0,y1,h);hippedRoof(S,x0-.45,x1+.45,y0-.45,y1+.45,h+.7,6.1,x1-x0>y1-y0);
    for(const [x,y]of[[x0+1.5,y0+2.3],[x1-1.6,y1-2.5]])chimney(S,x,y,h+2.1,7.1,1.5);
    rainpipe(S,x1+.2,y1-.45,h);wallLamp(S,f.front,1.1,10.5);
    return f;
  }
  function drillTower(S,x0,x1,y0,y1,h){
    const f=masonry(S,x0,x1,y0,y1,.1,h,1490),w=x1-x0;
    // No civic clock or decorative spire: repeating training apertures, projecting
    // ledges, hose-hoist beam and actual ladder explain this tower's purpose.
    for(const F of Object.values(f)){
      for(const z of[7.5,19.5,31.5,43.5]){
        F.block(1.3,F.length-1.3,.02,.45,z-1.1,z-.5,P.stone,P.stoneR,P.stoneHi);
        F.panel(1.7,F.length-1.7,z,z+7.0,P.ink,.12);
        for(const u of[1.5,F.length-1.75])F.block(u,u+.26,.12,.44,z,z+7.3,T.terra,T.terraR,T.terraHi);
        F.block(1.45,F.length-1.45,.04,.6,z+7,z+7.5,T.terraHi,T.terraR,T.terraHi);
        if(F===f.back)F.panel(2.0,F.length-2.0,z+5.5,z+6.8,[T.glassR,P.warmD],.18);
      }
      for(const z of[4.0,16.0,28.0,40.0,52.0])F.block(.1,F.length-.1,.03,.5,z,z+.52,T.terra,T.terraR,T.terraHi);
    }
    S.box(x0-.35,x1+.35,y0-.35,y1+.35,h,h+.7,P.stone,P.stoneR,P.stoneHi);
    for(const [a,b]of[[[x0,y0],[x1,y0]],[[x0,y1],[x1,y1]],[[x0,y0],[x0,y1]],[[x1,y0],[x1,y1]]])S.wall(a,b,h+.6,h+3,brick(false,1491));
    S.flat(x0+.6,x1-.6,y0+.6,y1-.6,h+.72,P.slateD);
    for(const [a,b]of[[[x0-.25,y0-.25],[x1+.25,y0-.25]],[[x0-.25,y1+.25],[x1+.25,y1+.25]],[[x0-.25,y0-.25],[x0-.25,y1+.25]],[[x1+.25,y0-.25],[x1+.25,y1+.25]]])S.beam([a[0],a[1],h+3.1],[b[0],b[1],h+3.1],P.stoneHi,.5);
    for(const z of[18.8,30.8,42.8]){
      S.box(x0+1.0,x1-1.0,y1,y1+1.5,z,z+.4,P.iron,P.ironD,P.ironHi);
      ironRail(S,[x0+1.05,y1+1.45],[x1-1.05,y1+1.45],z+.4,2.5);
      for(const x of[x0+1.25,x1-1.25])S.beam([x,y1,z-2.0],[x,y1+1.3,z],P.iron,.23);
    }
    ladder(S,[x0+2.1,y1+4.6,.3],[x0+2.1,y1+.24,19.1],1.65);
    S.beam([x1-.75,y1-.75,h+3],[x1-.75,y1-.75,h+7],P.iron,.40);
    S.beam([x1-.75,y1-.75,h+7],[x1-.75,y1+2.0,h+7],P.iron,.45);
    for(const x of[x1-1.15,x1-.65])S.beam([x,y1+1.85,5.4],[x,y1+1.85,h+6.65],T.hose,.21);
    S.beam([x1-.75,y1-.75,h+4.7],[x1-.75,y1+1.6,h+6.7],P.iron,.28);
    lantern(S,x0+1.2,y0+1.2,h+1.0,false);
  }
  function fireHydrant(S,x,y){
    cylinder(S,x,y,.1,.55,.76,.66,P.stone,P.stoneR,P.stoneHi,8);
    cylinder(S,x,y,.55,2.9,.39,.34,T.red,T.redD,T.redHi,8);
    cylinder(S,x,y,2.9,3.35,.47,.12,T.redHi,T.redD,T.redHi,8);
    S.box(x-.75,x+.75,y-.22,y+.22,1.5,1.98,T.brass,T.brassD,T.brassHi);
    S.beam([x-.52,y+.27,1.55],[x-.25,y+.36,.94],P.iron,.09);
    S.beam([x+.52,y+.27,1.55],[x+.25,y+.36,.94],P.iron,.09);
  }
  function bellFrame(S,x,y,z){
    for(const xx of[x-1.1,x+1.1])S.beam([xx,y,z],[xx,y,z+5.4],P.iron,.32);
    S.beam([x-1.25,y,z+5.3],[x+1.25,y,z+5.3],P.iron,.4);
    S.beam([x,y,z+5.3],[x,y,z+4.6],T.brassD,.25);
    cylinder(S,x,y,z+3.1,z+4.6,.85,.34,T.brass,T.brassD,T.brassHi,12);
    cylinder(S,x,y,z+2.95,z+3.17,.94,.94,T.brassHi,T.brassD,T.brassHi,12);
    S.beam([x,y,z+3.25],[x,y,z+2.61],P.iron,.16);
    S.beam([x+.35,y,z+4.6],[x+.65,y,z+.6],T.hoseR,.10);
  }
  function headquarters(view){
    const S=Scene(4,view,304,320);ground(S,64);
    domesticRange(S,5.5,35.5,4.5,15.8,29.0,1470);
    domesticRange(S,50.0,60.0,17.8,51.5,35.0,1471);
    const G=garageRange(S,5.0,46.8,39.0,51.8,18.8,4,1472);
    plaque(S,G.front,17.8,15.0,6.1,3.2,'shield');
    drillTower(S,39.2,48.0,5.2,14.0,57.0);
    // Rear drill yard is open between separate ranges, with a ladder rack,
    // hose-drying tower, a low practice wall and marked stone training stations.
    S.flat(6.0,47.5,18.0,37.8,.035,(x,y)=>hash(Math.floor(x),Math.floor(y),1473)%11===0?T.gravelD:T.gravel);
    for(const [x,y]of[[13,24],[27,25],[37,31]]){
      for(const d of[-2.3,2.3])S.flat(x+d,x+d+.16,y-2.5,y+2.5,.07,P.stoneHi);
      S.flat(x-2.3,x+2.46,y+2.5,y+2.66,.07,P.stoneHi);
    }
    for(const x of[7.7,16.6])S.beam([x,18.5,.1],[x,18.5,6.5],P.iron,.32);
    for(const z of[2.8,5.5])S.beam([7.7,18.5,z],[16.6,18.5,z],P.iron,.25);
    ladder(S,[7.6,18.8,2.95],[17.2,18.8,2.95],1.2);
    ladder(S,[7.6,18.8,5.6],[17.2,18.8,5.6],1.2);
    S.box(5.8,6.6,23.0,32.5,.1,6.5,brick(false,1476),brick(true,1476),P.stoneHi);
    hoseCoil(S,18.7,32.0,.05,1.8);hoseCoil(S,23.0,33.3,.05,1.45);
    fireHydrant(S,31.5,33.4);S.beam([32.2,33.4,.35],[36,31.5,.25],T.hose,.21);
    drain(S,10,39.2,36.7,37.35);
    bellFrame(S,33.0,18.0,.0);
    motorPump(S,13.0,57.2,.95);motorPump(S,33.8,57.4,.95);
    // Low apron bollards do not obstruct the vehicle exits.
    for(const x of[3.0,22.5,45.5]){
      cylinder(S,x,59.6,.05,2.8,.32,.27,P.iron,P.ironD,P.ironHi,8);
      cylinder(S,x,59.6,2.3,2.65,.30,.29,T.brass,T.brassD,T.brassHi,8);
    }
    for(const [x,y]of[[2.3,35.6],[48.4,57.6],[61.7,9.1]])lantern(S,x,y,12.0,true);
    flowerBed(S,51.0,59.7,55.0,58.5,1478);bench(S,60.3,53.0,7.7,false);
    ironRail(S,[51.0,61.2],[62.0,61.2],.1,3.8);ironRail(S,[62.0,52.5],[62.0,61.2],.1,3.8);
    return S.finish({id:291,design:'central-fire-brigade-training-headquarters',applianceBays:4,motorPumps:2,drillTower:true,lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function smallApplianceGarage(view){
    const S=Scene(2,view,160,196);ground(S,32);
    const f=garageRange(S,3.2,28.0,4.0,19.4,19.0,3,1480);
    plaque(S,f.front,10,15.1,4.8,2.8,'shield');
    motorPump(S,15.5,25.5,.95);fireHydrant(S,29.5,28.6);
    ladder(S,[5.2,2.4,.85],[17.8,2.4,.85],1.15);
    for(const x of[5.5,16.8])S.box(x-.2,x+.2,1.4,3.1,.0,.85,P.iron,P.ironD,P.ironHi);
    hoseCoil(S,26.8,24.3,.07,1.35);lantern(S,2.1,27.1,10.5,true);
    drain(S,3.5,10.2,29.6,30.2);
    return S.finish({id:292,design:'independent-appliance-garage',applianceBays:3,motorPumps:1,lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function residentialCourt(view){
    const S=Scene(2,view,160,196);ground(S,32);
    domesticRange(S,3.8,28.4,3.7,12.7,27.0,1488);
    domesticRange(S,3.8,12.0,13.1,25.2,25.0,1489);
    S.flat(14,28.7,14.8,28.5,.04,T.grass);
    S.flat(15.1,25.8,19.6,23.3,.06,paving);S.flat(20.3,24.0,12.7,30.8,.07,paving);
    flowerBed(S,15.0,18.8,15.3,18.0,1494);flowerBed(S,26.1,29.3,21.5,27.6,1495);
    bench(S,15.5,24.7,4.5,false);bellFrame(S,28.1,16.6,.07);
    clothesLine(S,14.5,19.4,14.3,6.5);laundryBasket(S,14.2,16.6,.1,1.7);
    ironRail(S,[1.1,29.9],[19.2,29.9],.1,3.8);ironRail(S,[25.6,29.9],[30.6,29.9],.1,3.8);
    for(const x of[19.0,25.8])S.box(x-.43,x+.43,29.35,30.5,.1,4.6,T.terra,T.terraR,T.terraHi);
    lantern(S,29.8,28.2,10.0,true);pottedPlant(S,2.5,26.5,.1,.7,P.flower[4]);
    return S.finish({id:293,design:'independent-firefighters-residential-court',residentialCourt:true,lightPolicy:'physical-fixtures-only-shared-depth'});
  }

  const THEMES=Object.freeze(['bathsPromenade','bathsFountain','bathsTowelGarden','bathsLaundryWalk','fireApron','fireHoseWalk','fireMemorialGarden','fireBrigadeWalk']);
  function fountain(S,x,y){
    cylinder(S,x,y,.1,.55,1.8,1.8,P.stone,P.stoneR,P.stoneHi,12);
    cylinder(S,x,y,.55,1.4,1.5,1.63,T.tile,T.tileD,T.tileHi,12);
    cylinder(S,x,y,1.37,1.53,1.40,1.40,T.water,T.water,T.waterHi,12);
    cylinder(S,x,y,1.5,4.4,.33,.27,P.stone,P.stoneR,P.stoneHi,8);
    cylinder(S,x,y,4.3,4.7,.65,.7,T.tile,T.tileD,T.tileHi,12);
    cylinder(S,x,y,4.7,5.3,.29,.08,P.stone,P.stoneR,P.stoneHi,8);
    for(const q of[-1,1])S.beam([x+q*.36,y,4.4],[x+q*.98,y,1.64],T.waterHi,.10);
  }
  function civicModule(theme,view){
    const S=Scene(1,view,72,92);ground(S,16);
    for(const x of[5.08,10.72])S.flat(x,x+.18,0,16,.035,theme.startsWith('baths')?T.tileHi:T.terraHi);
    if(theme==='bathsPromenade'){
      bench(S,1.7,4.0,7.8,false);lantern(S,13.5,3.1,12.0,true);
      for(const y of[2.0,13.6])pottedPlant(S,2.65,y,.1,.65,P.flower[2]);
      ironRail(S,[14.8,6.2],[14.8,14.9],.1,3.6);
    }else if(theme==='bathsFountain'){
      fountain(S,2.9,5.3);bench(S,14.2,8.3,5.4,true);
      lantern(S,13.6,2.7,10.3,true);flowerBed(S,1.0,4.6,11.5,14.8,1510);
      drain(S,1.1,4.6,8.0,8.7);
    }else if(theme==='bathsTowelGarden'){
      flowerBed(S,.9,4.7,2.0,13.9,1512);bench(S,14.3,6.2,6.3,true);
      // Folded towels sit on the bench, retaining a recognisable baths accessory.
      S.box(12.75,13.7,8.3,10.0,2.75,3.08,T.white,P.frameR,T.white);
      S.flat(12.78,13.66,8.55,8.72,3.1,T.tile);
      lantern(S,13.5,2.5,11.2,true);
    }else if(theme==='bathsLaundryWalk'){
      clothesLine(S,1.2,4.5,5.6,7.5);laundryBasket(S,2.65,10.25,.1,2.5);
      S.box(12.0,14.85,9.0,12.1,.1,2.6,P.stone,P.stoneR,P.stoneHi);
      S.flat(12.35,14.5,9.35,11.75,2.64,T.water);
      lantern(S,13.55,3.0,11.0,true);ironRail(S,[.8,13.7],[4.6,13.7],.1,3.2);
    }else if(theme==='fireApron'){
      fireHydrant(S,2.5,4.1);lantern(S,13.6,3.0,11.8,true);
      for(const y of[8.4,12.9]){
        cylinder(S,2.55,y,.1,2.85,.32,.24,P.iron,P.ironD,P.ironHi,8);
        cylinder(S,2.55,y,2.25,2.6,.30,.28,T.brass,T.brassD,T.brassHi,8);
      }
      drain(S,11.7,15.0,12.4,13.3);S.flat(11.7,15.0,8.1,8.4,.06,P.stoneHi);
    }else if(theme==='fireHoseWalk'){
      for(const y of[3.0,12.7])S.beam([2.3,y,.1],[2.3,y,5.8],P.iron,.26);
      for(const z of[2.0,4.8])S.beam([2.3,3,z],[2.3,12.7,z],P.iron,.25);
      ladder(S,[2.7,2.9,4.85],[2.7,13.2,4.85],1.4);
      hoseCoil(S,13.25,10.6,.1,1.25);fireHydrant(S,13.4,13.8);lantern(S,13.4,3.0,11.4,true);
    }else if(theme==='fireMemorialGarden'){
      flowerBed(S,11.6,15.1,2.0,14.8,1518);bench(S,1.5,9.7,4.6,false);
      S.box(1.3,4.4,3.0,5.1,.1,.65,P.stone,P.stoneR,P.stoneHi);
      S.box(1.9,3.8,3.55,4.55,.65,6.1,T.terra,T.terraR,T.terraHi);
      const F=S.face([1.9,4.56],[3.8,4.56],0,1);plaque(S,F,.10,2.5,1.7,2.6,'shield');
      S.box(1.6,4.1,3.3,4.8,6.0,6.5,P.stone,P.stoneR,P.stoneHi);
      lantern(S,13.6,1.6,10.5,true);
    }else if(theme==='fireBrigadeWalk'){
      bellFrame(S,2.8,4.3,.1);bench(S,14.2,7.6,6.0,true);
      lantern(S,13.6,2.9,11.2,true);pottedPlant(S,2.6,11.7,.1,.8,P.flower[4]);
      ironRail(S,[.8,14.8],[4.7,14.8],.1,3.5);
    }
    return S.finish({theme,pathAxis:'y',minimumClearPath:5.4,design:'british-civic-'+theme,lightPolicy:'physical-fixtures-only-shared-depth'});
  }
  function buildAll(){
    const buildings={288:[],289:[],290:[],291:[],292:[],293:[]},modules={};
    const builders={288:baths,289:smallSwimmingHall,290:smallWashhouse,291:headquarters,292:smallApplianceGarage,293:residentialCourt};
    for(let view=0;view<4;view++){
      for(const id of Object.keys(builders))buildings[id].push(builders[id](view));
      for(const theme of THEMES)modules[theme+'_'+view]=civicModule(theme,view);
    }
    return {buildings,modules};
  }
  root.BritishBathsFire014=Object.freeze({version:'GPT-014-baths-fire-r1',original:true,simulationRandomCalls:0,themes:THEMES,buildAll});
})(typeof window==='undefined'?globalThis:window);
