/* GPT-021 rebuilt architectural kit, 2026-10-12. NOT the lost final5db827a1 source.
 * Restored early helpers + new native Scene-compatible project/smoke interface.
 * Five original architecture modules and approved rasterizer remain unchanged.
 * Pure deterministic geometry: no game, saves, registry or simulation access.
 * World units: 16 per native tile. Roofs and apertures share native z buffer.
 */
(function(root){
  'use strict';
  function create(spec,view){
    if(!Number.isInteger(view)||view<0||view>3)throw Error('Four geometric views required');
    const K=root.BritishComplexPrimitives014;if(!K)throw Error('Native rasterizer missing');
    const {P,C}=K,sz=spec.sz,S=K.Scene(sz,view,spec.w,spec.h),extent=16*sz;
    const chimneyHeads=[];
    // Matches the unchanged native Scene projection; coordinates stay fractional.
    function project(x,y,z){
      let u=x,v=y;
      if(view===1){u=extent-y;v=x;}else if(view===2){u=extent-x;v=extent-y;}else if(view===3){u=y;v=extent-x;}
      return [spec.w/2+2*u-2*v,spec.h-2-2*extent+u+v-z];
    }
    function dark(nx,ny){let x=nx,y=ny;if(view===1){x=-ny;y=nx;}else if(view===2){x=-nx;y=-ny;}else if(view===3){x=ny;y=-nx;}return x>y;}
    function walls(x0,x1,y0,y1,z0,z1,seed,mat){
      const material=(x,y)=>mat==='stone'?K.ashlar(dark(x,y),seed):mat==='timber'?(dark(x,y)?P.woodR:P.wood):K.brick(dark(x,y),seed);
      S.wall([x0,y1],[x1,y1],z0,z1,material(0,1));S.wall([x1,y0],[x0,y0],z0,z1,material(0,-1));
      S.wall([x1,y1],[x1,y0],z0,z1,material(1,0));S.wall([x0,y0],[x0,y1],z0,z1,material(-1,0));
      S.flat(x0,x1,y0,y1,z1,P.stoneR);
      return {front:S.face([x0,y1],[x1,y1],0,1),back:S.face([x1,y0],[x0,y0],0,-1),right:S.face([x1,y1],[x1,y0],1,0),left:S.face([x0,y0],[x0,y1],-1,0)};
    }
    function course(F,z,col){F.block(0,F.length,0,.22,z,z+.5,col||P.stone,P.stoneR,P.stoneHi);}
    function gable(x0,x1,y0,y1,z,rise,alongX){
      const cx=(x0+x1)/2,cy=(y0+y1)/2,slate=(x,y)=>K.slate(dark(x,y));
      if(alongX!==false){
        S.poly([[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]],slate(0,-1));
        S.poly([[x0,y1,z],[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z]],slate(0,1));
        for(const x of[x0,x1])S.poly([[x,y0,z],[x,y1,z],[x,cy,z+rise]],K.brick(dark(x===x0?-1:1,0),2112));
        S.beam([x0,cy,z+rise],[x1,cy,z+rise],P.lead,.33);
      }else{
        S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],slate(-1,0));
        S.poly([[x1,y0,z],[x1,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],slate(1,0));
        for(const y of[y0,y1])S.poly([[x0,y,z],[x1,y,z],[cx,y,z+rise]],K.brick(dark(0,y===y0?-1:1),2113));
        S.beam([cx,y0,z+rise],[cx,y1,z+rise],P.lead,.33);
      }
      for(const x of[x0,x1])S.beam([x,y0,z],[x,y1,z],P.ironD,.26);
      for(const y of[y0,y1])S.beam([x0,y,z],[x1,y,z],P.ironD,.26);
    }
    function hip(x0,x1,y0,y1,z,rise,alongX){
      const cx=(x0+x1)/2,cy=(y0+y1)/2,m=(x,y)=>K.slate(dark(x,y));
      if(alongX!==false){const t=Math.min((y1-y0)/2,(x1-x0)/3),a=x0+t,b=x1-t;
        S.poly([[x0,y0,z],[x1,y0,z],[b,cy,z+rise],[a,cy,z+rise]],m(0,-1));S.poly([[x0,y1,z],[a,cy,z+rise],[b,cy,z+rise],[x1,y1,z]],m(0,1));
        S.poly([[x0,y0,z],[a,cy,z+rise],[x0,y1,z]],m(-1,0));S.poly([[x1,y0,z],[x1,y1,z],[b,cy,z+rise]],m(1,0));S.beam([a,cy,z+rise],[b,cy,z+rise],P.lead,.35);
      }else{const t=Math.min((x1-x0)/2,(y1-y0)/3),a=y0+t,b=y1-t;
        S.poly([[x0,y0,z],[cx,a,z+rise],[cx,b,z+rise],[x0,y1,z]],m(-1,0));S.poly([[x1,y0,z],[x1,y1,z],[cx,b,z+rise],[cx,a,z+rise]],m(1,0));
        S.poly([[x0,y0,z],[x1,y0,z],[cx,a,z+rise]],m(0,-1));S.poly([[x0,y1,z],[cx,b,z+rise],[x1,y1,z]],m(0,1));S.beam([cx,a,z+rise],[cx,b,z+rise],P.lead,.35);
      }
    }
    function shed(x0,x1,y0,y1,z,rise){S.poly([[x0,y0,z+rise],[x1,y0,z+rise],[x1,y1,z],[x0,y1,z]],K.slate(dark(0,1)));}
    function mansard(x0,x1,y0,y1,z,rise,inset){
      const t=inset||2.3,zm=z+rise*.72;
      S.poly([[x0,y0,z],[x1,y0,z],[x1-t,y0+t,zm],[x0+t,y0+t,zm]],K.slate(dark(0,-1)));
      S.poly([[x0,y1,z],[x0+t,y1-t,zm],[x1-t,y1-t,zm],[x1,y1,z]],K.slate(dark(0,1)));
      S.poly([[x0,y0,z],[x0+t,y0+t,zm],[x0+t,y1-t,zm],[x0,y1,z]],K.slate(dark(-1,0)));
      S.poly([[x1,y0,z],[x1,y1,z],[x1-t,y1-t,zm],[x1-t,y0+t,zm]],K.slate(dark(1,0)));
      hip(x0+t,x1-t,y0+t,y1-t,zm,rise*.28,true);
    }
    function windows(F,floors,bays,z0,width,height,lit){
      for(let f=0;f<floors;f++)for(let b=0;b<bays;b++)K.sash(S,F,F.length*(b+.5)/bays-width/2,z0+f*11.2,width,height||6.8,lit!==false);
    }
    function door(F,u,width,height,lit){K.timberDoor(F,u,.6,width||2.5,height||8,lit!==false);}
    function loading(F,u,width,height){
      const w=width||5,h=height||9;F.panel(u,u+w,.4,h,(x,y)=>K.mod(x,1.2)<.15?P.woodD:P.wood,.15);
      F.block(u-.35,u,0,.42,.3,h+.4,P.stone,P.stoneR,P.stoneHi);F.block(u+w,u+w+.35,0,.42,.3,h+.4,P.stone,P.stoneR,P.stoneHi);
      F.block(u-.35,u+w+.35,0,.5,h,h+.55,P.stone,P.stoneR,P.stoneHi);F.panel(u+w*.48,u+w*.52,1,h-.5,P.ironD,.25);
    }
    function chimney(x,y,z,pots){walls(x-.58,x+.58,y-.66,y+.66,z-1.5,z+3,2131);S.box(x-.8,x+.8,y-.8,y+.8,z+2.7,z+3.2,P.stone,P.stoneR,P.stoneHi);
      for(let p=0;p<(pots||2);p++)K.cylinder(S,x+(p-((pots||2)-1)/2)*.62,y,z+3.2,z+5.6,.23,.30,C('bc805c'),C('905c44'),P.ink,8);chimneyHeads.push(project(x,y,z+5.6));}
    function crates(x,y,count){for(let a=0;a<count;a++){const xx=x+a*1.4;S.box(xx,xx+1.12,y,y+1.25,.15,1.7,P.woodHi,P.woodR,P.woodHi);S.beam([xx,y+1.26,.6],[xx+1.1,y+1.26,1.35],P.woodD,.16);}}
    function fence(x0,y0,x1,y1,h){const len=Math.hypot(x1-x0,y1-y0),steps=Math.max(1,Math.ceil(len/3));h=h||3;
      for(let a=0;a<=steps;a++){const x=x0+(x1-x0)*a/steps,y=y0+(y1-y0)*a/steps;S.box(x-.12,x+.12,y-.12,y+.12,0,h,P.wood,P.woodR,P.woodHi);}
      for(const z of[h*.35,h*.78])S.beam([x0,y0,z],[x1,y1,z],P.wood,.25);}
    function canopy(x0,x1,y0,y1,z){for(const x of[x0+.3,x1-.3])for(const y of[y0+.3,y1-.3])S.box(x-.12,x+.12,y-.12,y+.12,0,z,P.iron,P.ironD,P.ironHi);ShedCanopy();
      function ShedCanopy(){S.poly([[x0,y0,z+.8],[x1,y0,z+.8],[x1,y1,z],[x0,y1,z]],P.canopy);}}
    function lamps(F,u,z){K.wallLamp(S,F,u,z||8.5);}
    function finish(extra){return S.finish({...spec,view,candidate:true,__useScales021:1,lightPolicy:'solid-glazing-and-fixtures-only',smoke:[],smoke608:chimneyHeads.map(p=>p.slice()),...extra});}
    return {S,K,P,C,extent,dark,project,walls,course,gable,hip,shed,mansard,windows,door,loading,chimney,crates,fence,canopy,lamps,finish};
  }
  root.BritishUseScalesKit021=Object.freeze({create});
})(typeof window==='undefined'?globalThis:window);
