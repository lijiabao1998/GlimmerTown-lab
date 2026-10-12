/* GPT-021 candidate-only farm / ranch architecture.
 * Six original plans, four complete world-space views each. No game registry,
 * save, RNG, production, prices, capacities or calendar access.
 * Farm scale carriers are native farm 2x2 / greenhouse 2x2 / largeFarm 5x5.
 * All ranch plans stay 2x2; S/M/L depict native paid Lv1/Lv2/Lv3, not new lots.
 * Temporal art inputs follow native T397: season 0..3, stage 0 seedling,
 * 1 growing, 2 mature, 3 harvested stubble. Native dispatch owns those inputs.
 * Glass uses opaque dither and genuine uncovered samples over interior beds;
 * its frame and plants share the approved rasterizer's day/night depth buffer.
 */
(function(root){
  'use strict';
  const specs=Object.freeze([
    {id:'UKF021-S',nm:'側院田間農場',group:'farm',scale:'S',sz:2,w:144,h:138,k:22,tool:'farm',floors:2,
      plan:'side-house-and-independent-raised-granary-with-crop-strip',roof:'house-long-gable-and-short-granary-ridge',
      entry:'house-door-and-field-gate-separated',yard:'side-gravel-lane-and-granary-loading-court',
      masses:[[2.1,11.2,5.1,15.2,.15,18.5],[2.4,11.2,20.1,28.8,.8,10.3]]},
    {id:'UKF021-M',nm:'雙跨栽培溫室',group:'farm',scale:'M',sz:2,w:144,h:144,k:63,tool:'greenhouse',floors:1,
      plan:'two-different-glass-spans-with-brick-headhouse-and-side-potting-room',roof:'two-glazed-ridges-and-low-slate-service-roofs',
      entry:'headhouse-public-door-and-separate-potting-door',yard:'side-potting-delivery-strip',
      masses:[[4.8,13,4.4,25.1,1.6,7.8],[13.6,22.4,4.4,25.1,1.6,8.4],
        [2,28.4,25.6,30.2,.15,8.6],[24.2,29.5,7.5,22.5,.15,6.8]]},
    {id:'UKF021-L',nm:'雙糧院大型農莊',group:'farm',scale:'L',sz:5,w:336,h:242,k:53,tool:'largeFarm',floors:2,
      plan:'stone-house-and-three-low-barn-ranges-with-two-separate-grain-courts',roof:'three-independent-threshing-and-store-ridges',
      entry:'central-field-gate-and-east-service-gate',yard:'two-grain-courts-linked-by-an-open-service-lane',
      masses:[[4,18,7,27,.15,24],[22,65,5,16,.15,16.8],[19.4,44,29.5,40,.15,14.5],
        [43.5,53,16.5,37,.15,14.2]]},
    {id:'UKR021-S',nm:'小牛舍與開牧地',group:'ranch',scale:'S',sz:2,w:144,h:126,k:23,tool:'ranch',lv:1,floors:1,
      plan:'one-side-cattle-house-and-a-large-open-grazing-enclosure',roof:'single-long-ridge-and-a-low-feed-catslide',
      entry:'barn-door-and-pasture-gate-separated',yard:'short-feed-apron-outside-the-barn',
      masses:[[2.2,8.8,4,21,.15,9.6],[2.4,7.1,23.5,28.7,.15,4.7]]},
    {id:'UKR021-M',nm:'雙翼糧樓畜舍',group:'ranch',scale:'M',sz:2,w:144,h:150,k:23,tool:'ranch',lv:2,floors:2,
      plan:'tall-west-feed-loft-and-low-north-cattle-range-with-open-working-court',roof:'unequal-perpendicular-gables',
      entry:'feed-loading-door-and-cattle-gate-separated',yard:'central-feed-court-and-two-grazing-strips',
      masses:[[2.4,10.4,3,15.2,.15,19.5],[10.8,28.5,3,10.2,.15,10.2]]},
    {id:'UKR021-L',nm:'環院覆廄農莊',group:'ranch',scale:'L',sz:2,w:144,h:160,k:23,tool:'ranch',lv:3,floors:2,
      plan:'three-unequal-ranges-around-a-real-open-cattle-yard',roof:'north-gable-west-hip-and-east-feed-loft-gable',
      entry:'open-south-yard-mouth-and-separate-east-loading-door',yard:'open-U-court-with-a-covered-west-stable-veranda',
      masses:[[2,29.3,2,8.8,.15,10.5],[2,8.5,9.3,27.5,.15,11.2],[21.8,29.3,9.3,28.5,.15,22.5]]}
  ].map(s=>Object.freeze({...s,masses:Object.freeze(s.masses.map(m=>Object.freeze(m)))})));
  // Same native crop order as T279's CCLASS; these are visual forms only.
  const cropClasses=Object.freeze(['sprout','grain','leaf','corn','vine','orchard','tomato','straw',
    'grape','sun','rice','cabbage','carrot','melon','cotton','lav']);

  function build(id,view,extra){
    const spec=specs.find(s=>s.id===id);if(!spec)throw Error('Unknown agriculture candidate '+id);
    const H=root.BritishUseScalesKit021;if(!H)throw Error('Candidate architectural kit missing');
    const A=H.create(spec,view),{S,K,P,C,extent,walls,course,gable,hip,shed,door,loading,chimney,crates,fence,lamps,finish,dark}=A;
    extra=extra||{};
    const sn=typeof extra.season==='string'?['spring','summer','autumn','winter'].indexOf(extra.season):extra.season;
    const season=Number.isInteger(sn)&&sn>=0&&sn<=3?sn:0;
    const stage=Number.isInteger(extra.stage)&&extra.stage>=0&&extra.stage<=3?extra.stage:2;
    const crop=Number.isInteger(extra.crop)&&extra.crop>=0&&extra.crop<16?extra.crop:(spec.k===63?2:1);
    const winter=season===3;
    const grassSets=[['667950','738658','596d46','8a9169'],['667846','768954','546a40','8e9668'],
      ['858253','999063','72794c','a29a73'],['929589','a5a698','83887b','b2b1a3']].map(q=>q.map(C));
    const soils=[['62513c','766148','887258'],['5b4d38','6e5c41','826d50'],
      ['6b5740','7f684d','948061'],['7f7970','969187','a7a295']].map(q=>q.map(C));
    const grass=(x,y)=>grassSets[season][K.hash(Math.floor(x*2),Math.floor(y*2),2161)%23===0?3:
      K.hash(Math.floor(x),Math.floor(y),2162)%7===0?1:K.hash(Math.floor(x*2),Math.floor(y),2163)%5===0?2:0];
    const gravel=(x,y)=>K.hash(Math.floor(x*2),Math.floor(y*2),2164)%11===0?P.paveHi:
      K.hash(Math.floor(x*2),Math.floor(y*2),2165)%6===0?P.paveR:P.pave;
    S.flat(.8,extent-.8,.8,extent-.8,0,grass);

    function apron(x0,x1,y0,y1){S.flat(x0,x1,y0,y1,.035,gravel);}
    function stoneWall(x0,x1,y0,y1,h){return walls(x0,x1,y0,y1,0,h||1.65,2166,'stone');}
    function bales(x,y,count,layers){
      for(let row=0;row<(layers||1);row++)for(let n=0;n<count;n++){
        const xx=x+n*2.2+(row&1)*.25,yy=y+row*.14,z=.15+row*1.4;
        S.box(xx,xx+1.9,yy,yy+1.6,z,z+1.35,C('c4ab6e'),C('9e8754'),C('d2bc83'));
        for(const t of[.35,1.45])S.beam([xx+t,yy,z+1.36],[xx+t,yy+1.6,z+1.36],C('897449'),.13);
      }
    }
    function trough(x,y,longY){
      const a=longY?1.6:4.1,b=longY?4.1:1.6;
      S.box(x,x+a,y,y+b,.1,1.45,P.stone,P.stoneR,P.stoneHi);
      S.flat(x+.24,x+a-.24,y+.24,y+b-.24,1.47,C('607f7f'));
    }
    function cart(x,y){
      S.box(x,x+2.7,y,y+2.0,1.0,1.38,P.wood,P.woodR,P.woodHi);
      for(const xx of[x-.08,x+2.78])for(const yy of[y+.4,y+1.7])K.cylinder(S,xx,yy,.1,1.2,.36,.36,P.ironD,P.ink,P.iron,8);
      S.beam([x+2.4,y+1,1.1],[x+4.3,y+1,.4],P.wood,.25);crates(x+.3,y+.25,1);
    }
    function cropPlant(x,y,cls,sn2,st,z){
      const dry=sn2===3||st===3,base=z||.15;
      if(dry){
        S.beam([x,y,base],[x,y,base+.58],C('9c8b65'),.14);
        if(sn2===3)S.beam([x-.22,y,base+.4],[x+.24,y,base+.75],C('ab9c7c'),.11);
        return;
      }
      const green=sn2===2?C('78834b'):sn2===1?C('5c7b43'):C('6b8650');
      if(st===0){
        S.beam([x,y,base],[x,y,base+.78],green,.16);
        S.poly([[x,y,base+.45],[x-.42,y-.07,base+.87],[x-.18,y+.17,base+.52]],C('8fa36a'));
        S.poly([[x,y,base+.5],[x+.38,y+.05,base+.83],[x+.22,y-.15,base+.48]],green);return;
      }
      if(st===1){
        S.beam([x,y,base],[x,y,base+1.45],green,.19);
        S.poly([[x,y,base+.5],[x-.63,y,base+1.08],[x-.19,y+.20,base+.8]],green);
        S.poly([[x,y,base+.7],[x+.50,y+.13,base+1.48],[x+.20,y-.16,base+.9]],C('91a66b'));return;
      }
      if(cls==='cabbage'){
        K.cylinder(S,x,y,base+.08,base+.92,.72,.43,C('849a70'),C('627b59'),C('a3b38a'),8);
        for(const q of[-1,1])S.poly([[x,y,base+.22],[x+q*.9,y-.20,base+.25],[x+q*.65,y+.20,base+.62]],green);
        return;
      }
      if(cls==='sprout'||cls==='carrot'){
        const hh=cls==='sprout'?1.9:1.15;
        for(const q of[-1,0,1]){
          S.beam([x,y,base],[x+q*.18,y+q*.1,base+hh],green,.16);
          S.poly([[x+q*.1,y,base+.4],[x+q*.42-.18,y-.18,base+hh*.72],[x+q*.30,y+.14,base+hh]],C('8fa26b'));
        }
        if(cls==='carrot'&&sn2===2)S.box(x-.12,x+.16,y-.14,y+.14,base+.1,base+.37,C('bd844d'),C('926940'),C('cea162'));
        return;
      }
      const low=['sprout','leaf','cabbage','carrot','vine','melon','straw'].includes(cls);
      if(low){
        const l=cls==='vine'||cls==='melon'?.84:cls==='straw'?.48:.61;
        for(const sg of[-1,1]){
          S.poly([[x,y,base+.15],[x+sg*l,y-.25,base+.40],[x+sg*l*.85,y+.32,base+.82],[x,y+.20,base+1.0]],sg<0?green:C('899d62'));
          S.poly([[x,y,base+.12],[x-.28,y+sg*l,base+.35],[x+.32,y+sg*l*.8,base+.75],[x+.17,y,base+1]],green);
        }
        if(cls==='vine'||cls==='melon')K.cylinder(S,x+.4,y+.28,base+.15,base+.84,.47,.30,
          cls==='vine'?C('b98b4f'):C('658151'),cls==='vine'?C('92713f'):C('4e6c41'),cls==='vine'?C('d4a461'):C('7b955d'),8);
        if(cls==='straw'&&sn2>0)S.box(x-.15,x+.15,y+.2,y+.5,base+.38,base+.70,C('aa5d57'),C('854a49'),C('bd7468'));
        return;
      }
      if(cls==='orchard'){
        S.beam([x,y,base],[x,y,base+3.8],P.woodD,.30);
        K.cylinder(S,x,y,base+2.5,base+4.4,1.1,.66,green,C('586c42'),C('91a068'),7);
        if(sn2===1)S.box(x-.78,x-.42,y+.25,y+.59,base+3.2,base+3.54,C('ae6354'),C('80493f'),C('bf7a64'));return;
      }
      if(cls==='grape'){
        for(const xx of[x-.78,x+.78])S.beam([xx,y,base],[xx,y,base+3.15],P.woodD,.18);
        S.beam([x-.9,y,base+2.8],[x+.9,y,base+2.8],P.wood,.20);
        S.poly([[x-.7,y,base+2.65],[x,y-.3,base+3.55],[x+.7,y,base+2.7],[x,y+.32,base+2.3]],green);
        if(sn2===2)S.box(x-.19,x+.19,y+.14,y+.43,base+2.1,base+2.6,C('78617b'),C('605365'),C('937b97'));return;
      }
      const h=cls==='corn'||cls==='sun'?4.05:cls==='tomato'?2.3:cls==='lav'?2.45:2.8;
      S.beam([x,y,base],[x,y,base+h],green,.18);
      S.poly([[x,y,base+h*.38],[x-.70,y-.07,base+h*.70],[x-.20,y+.16,base+h*.55]],green);
      S.poly([[x,y,base+h*.58],[x+.61,y+.12,base+h*.88],[x+.19,y-.15,base+h*.65]],C('95a66a'));
      if(cls==='grain'||cls==='rice'){
        const ear=sn2===2?C('d5bc79'):C('a4ae64');
        S.beam([x-.42,y,base+h-.20],[x+.42,y,base+h+.27],ear,.32);
        S.beam([x,y-.32,base+h-.20],[x,y+.32,base+h+.18],ear,.23);
      }else if(cls==='corn')S.box(x+.12,x+.45,y-.11,y+.23,base+2.05,base+2.93,C('c6b069'),C('9c9154'),C('ddcc8b'));
      else if(cls==='sun'){K.cylinder(S,x,y,base+h-.05,base+h+.3,.42,.42,C('bfa059'),C('927c4a'),C('6a5a40'),8);}
      else if(cls==='tomato')for(const dx of[-.45,.45])S.box(x+dx-.13,x+dx+.15,y+.05,y+.31,base+1.4,base+1.77,C('b5634b'),C('8d4c3f'),C('c47c58'));
      else if(cls==='cotton')for(const dx of[-.38,.32])S.box(x+dx-.20,x+dx+.22,y-.12,y+.20,base+2.1,base+2.52,P.paper,P.frameR,P.frame);
      else if(cls==='lav')S.beam([x,y,base+1.9],[x,y,base+2.6],C('9785a0'),.36);
    }
    function cropPlot(x0,x1,y0,y1,cls,protectedBed,z){
      const cropSeason=protectedBed&&winter?1:season,z0=z||.13,so=soils[protectedBed&&winter?1:season];
      S.flat(x0,x1,y0,y1,z0,(x,y)=>K.mod(x-x0,2.8)<.35?so[0]:K.mod(x-x0,2.8)<.65?so[2]:so[1]);
      if(cls==='rice'&&!winter)S.flat(x0+.5,x1-.5,y0+.5,y1-.5,z0+.035,(x,y)=>K.mod(x-x0,2.8)<.45?C('738d8c'):null);
      const gap=cls==='orchard'?4.8:2.8;
      const visibleStage=winter&&!protectedBed?2:stage;
      for(let x=x0+gap*.5;x<x1-.6;x+=gap)for(let y=y0+1.25;y<y1-.8;y+=gap){
        if(visibleStage===0&&((Math.floor(x/gap)+Math.floor(y/gap))&1))continue;
        cropPlant(x,y,cls,cropSeason,visibleStage,z0+.04);
      }
    }
    function cow(x,y,flip){
      const q=flip?-1:1,T=(xx,yy,zz)=>[x+q*xx,y+yy,zz];
      function box(x0,x1,y0,y1,z0,z1,col,side,top){
        S.poly([T(x0,y0,z0),T(x1,y0,z0),T(x1,y0,z1),T(x0,y0,z1)],col);
        S.poly([T(x0,y1,z0),T(x0,y1,z1),T(x1,y1,z1),T(x1,y1,z0)],col);
        for(const xx of[x0,x1])S.poly([T(xx,y0,z0),T(xx,y1,z0),T(xx,y1,z1),T(xx,y0,z1)],side);
        S.poly([T(x0,y0,z1),T(x1,y0,z1),T(x1,y1,z1),T(x0,y1,z1)],top);
      }
      const cream=C('d2cabb'),creamD=C('a9a79c'),black=C('484c44');
      for(const xx of[-1.25,1.2])for(const yy of[-.43,.44])box(xx-.16,xx+.16,yy-.14,yy+.14,.15,1.55,black,C('343d36'),creamD);
      box(-1.65,1.45,-.7,.7,1.45,3.0,cream,creamD,P.paper);
      box(1.35,2.4,-.52,.47,2.0,2.88,black,C('343d36'),creamD);
      box(2.1,2.72,-.48,.43,1.95,2.36,C('a89884'),C('817968'),creamD);
      S.poly([T(-1.1,.705,1.55),T(-.43,.705,1.55),T(-.20,.705,2.35),T(-.95,.705,2.78)],black,.03);
      S.poly([T(.47,-.705,1.7),T(1.05,-.705,1.7),T(1.3,-.705,2.7),T(.63,-.705,2.86)],black,.03);
      S.beam(T(-1.65,0,2.72),T(-2.05,.22,1.27),black,.15);
      for(const yy of[-.62,.62])S.beam(T(1.64,yy,2.73),T(1.92,yy*1.22,3.18),creamD,.18);
    }
    // Tiny inner rectangle on the actual chosen loading aperture. T403 can
    // keep its screen-space opening/closing overlay without using old art's
    // coordinates. Every chosen face points toward this geometric view.
    function animationDoor(F,u,w,h){
      const p=F.point(u+w/2,.23,Math.min(h-1.1,5.3));let x=p[0],y=p[1];
      if(view===1){x=extent-p[1];y=p[0];}else if(view===2){x=extent-p[0];y=extent-p[1];}else if(view===3){x=p[1];y=extent-p[0];}
      const sx=spec.w/2+2*x-2*y,sy=spec.h-2-2*extent+x+y-p[2];
      return [Math.floor(sx)-1,Math.floor(sy)-1,2,3];
    }
    function barnDoors(B,width,height){
      const candidates={};
      for(const [name,F]of Object.entries(B)){
        const w=Math.min(width,F.length-1.5),u=(F.length-w)/2;loading(F,u,w,height);candidates[name]={F,u,w};
      }
      const choice=candidates[['right','back','left','front'][view]];
      return animationDoor(choice.F,choice.u,choice.w,height);
    }
    let door403=null,hen403=null;

    if(id==='UKF021-S'){
      apron(1.2,13.5,15.7,20);apron(11.5,13.6,1.4,30.6);
      cropPlot(14.5,30.2,2.2,14.8,cropClasses[crop],false);
      cropPlot(14.5,30.2,16.1,30.2,cropClasses[crop],false);
      const home=walls(2.1,11.2,5.1,15.2,.15,18.5,2171);
      for(const [name,F]of Object.entries(home)){
        course(F,9.1);K.sash(S,F,F.length*.24-.95,11.2,2.2,5.0,true);K.sash(S,F,F.length*.73-.95,11.2,2.2,5.0,true);
        if(name==='right'||name==='left')K.sash(S,F,1.1,2.1,2.4,5.0,true);
      }
      door(home.front,3.25,2.5,7.4,true);door(home.back,3.25,2.5,7.4,true);
      K.sash(S,home.front,.45,2.0,2.05,5.1,true);K.sash(S,home.back,.45,2.0,2.05,5.1,true);
      gable(1.85,11.45,4.85,15.45,18.7,5.9,false);chimney(6.65,7.6,24.4,2);
      K.rainpipe(S,11.35,14.8,18.2);lamps(home.front,6.9,7.5);lamps(home.back,6.9,7.5);
      const granary=walls(2.4,11.2,20.1,28.8,.8,10.3,2172,'timber');
      for(const xx of[3.1,10.3])for(const yy of[20.7,28])S.box(xx-.3,xx+.3,yy-.3,yy+.3,0,.95,P.stone,P.stoneR,P.stoneHi);
      loading(granary.right,2.4,4.2,7.3);loading(granary.left,2.4,4.2,7.3);
      for(const F of[granary.front,granary.back])F.panel(3.1,5.7,7.8,9.4,(x,y)=>K.mod(x,.55)<.15?P.woodHi:P.ink,.14);
      gable(2.15,11.45,19.85,29.05,10.45,4.7,true);
      stoneWall(1.2,9.0,1.2,1.8);stoneWall(1.2,1.8,1.8,4.4);stoneWall(1.1,8.9,30.3,30.8);
      fence(14,2.0,14,28.2,2.3);fence(14,30.7,30.6,30.7,2.3);
      bales(2.4,17.1,3,1);cart(8.2,16.1);K.lantern(S,13.1,29.0,6.2,true);
    }else if(id==='UKF021-M'){
      apron(1.1,3.6,2.2,24.9);apron(23.1,30.5,3.6,25.2);
      function glasshouse(x0,x1,y0,y1,eave,rise,seed){
        walls(x0,x1,y0,y1,.15,1.6,seed);
        const mid=(x0+x1)/2;
        S.flat(x0+.25,x1-.25,y0+.25,y1-.25,1.62,P.paveR);
        for(const [a,b]of[[x0+.85,mid-.48],[mid+.48,x1-.85]]){
          S.box(a,b,y0+1.0,y1-1.0,1.62,2.17,P.wood,P.woodR,P.soil);
          cropPlot(a+.12,b-.12,y0+1.12,y1-1.12,cropClasses[crop],true,2.2);
        }
        const glazing=(x,y,z)=>{
          if(K.mod(y-y0,3.6)<.12||K.mod(z-1.6,2.4)<.11||K.mod(x-x0,2.6)<.11)return P.frameR;
          if((Math.floor(x*2)+Math.floor(y*2)+Math.floor(z*2))&1)return null;
          return K.hash(Math.floor(x),Math.floor(y),seed)%7===0?C('a7bfaf'):C('7faaa1');
        };
        S.wall([x0,y0],[x1,y0],1.6,eave,glazing);S.wall([x0,y1],[x1,y1],1.6,eave,glazing);
        S.wall([x0,y0],[x0,y1],1.6,eave,glazing);S.wall([x1,y0],[x1,y1],1.6,eave,glazing);
        S.poly([[x0,y0,eave],[mid,y0,eave+rise],[mid,y1,eave+rise],[x0,y1,eave]],glazing);
        S.poly([[x1,y0,eave],[x1,y1,eave],[mid,y1,eave+rise],[mid,y0,eave+rise]],glazing);
        for(const yy of[y0,y1])S.poly([[x0,yy,eave],[x1,yy,eave],[mid,yy,eave+rise]],glazing);
        for(let yy=y0;yy<=y1+.01;yy+=3.6){
          for(const xx of[x0,x1])S.beam([xx,yy,1.5],[xx,yy,eave+.04],P.frame,.23);
          S.beam([x0,yy,eave+.04],[mid,yy,eave+rise+.04],P.frame,.24);
          S.beam([mid,yy,eave+rise+.04],[x1,yy,eave+.04],P.frameR,.24);
        }
        for(const xx of[x0,x1])S.beam([xx,y0,eave],[xx,y1,eave],P.frameR,.28);
        S.beam([mid,y0,eave+rise],[mid,y1,eave+rise],P.frame,.31);
        for(const yy of[y0,y1]){
          const F=S.face([x0,yy],[x1,yy],0,yy===y0?-1:1);
          K.timberDoor(F,(x1-x0)/2-1.0,1.6,2.0,5.9,false);
        }
      }
      glasshouse(4.8,13,4.4,25.1,7.8,5.2,2181);glasshouse(13.6,22.4,4.4,25.1,8.4,5.7,2182);
      const head=walls(2,28.4,25.6,30.2,.15,8.6,2183);
      for(const F of[head.front,head.back]){
        for(const u of[1.1,5.8,17.6,22.3])K.sash(S,F,u,2.1,2.6,4.35,true);
        door(F,11.45,3.1,6.9,true);course(F,8.25);
      }
      for(const F of[head.left,head.right])K.sash(S,F,1.0,2.15,2.15,4.2,true);
      hip(1.75,28.65,25.35,30.45,8.8,2.5,true);chimney(5.3,27.9,11.3,1);
      const pot=walls(24.2,29.5,7.5,22.5,.15,6.8,2184,'timber');
      door(pot.front,1.35,2.3,5.6,false);loading(pot.right,5.0,4.3,5.6);
      for(const F of[pot.left,pot.right])for(const u of[.9,10.7])K.sash(S,F,u,1.15,3.2,3.8,true);
      K.sash(S,pot.back,1.0,1.15,3.2,3.8,true);
      shed(24,29.75,7.25,22.75,7.0,1.6);
      crates(24.5,23.2,3);cart(24.4,4.2);
      for(const [x,y]of[[2.6,3.0],[28.7,2.7],[2.5,22.2],[30,23.7]])K.lantern(S,x,y,6.2,true);
      lamps(head.front,9.5,5.1);lamps(head.back,16.0,5.1);
    }else if(id==='UKF021-L'){
      apron(18.8,42.8,16.8,29);apron(53.6,67,16.8,37.4);apron(2.3,77.5,40.8,44);
      apron(39.8,44.2,40.8,77.3);apron(72.8,77.1,16.4,77.2);
      cropPlot(3.4,38.7,46.1,76.6,cropClasses[crop],false);
      cropPlot(45.6,71.2,46.1,76.6,cropClasses[crop],false);
      cropPlot(68.7,77,4.0,15.0,cropClasses[crop],false);
      cropPlot(3.4,17.6,29.4,39.2,cropClasses[crop],false);
      const home=walls(4,18,7,27,.15,24,2191,'stone');
      for(const F of[home.front,home.back,home.left,home.right]){
        const bays=F.length>15?3:2;
        for(let fl=0;fl<2;fl++)for(let b=0;b<bays;b++)K.sash(S,F,F.length*(b+.5)/bays-1.35,2.6+fl*11,2.7,6.1,true);
        course(F,11.2);course(F,23.6);
      }
      door(home.right,7.8,3,8.5,true);door(home.left,7.8,3,8.5,true);
      gable(3.65,18.35,6.65,27.35,24.3,6.3,false);chimney(11,10.1,30.6,2);
      const north=walls(22,65,5,16,.15,16.8,2192),south=walls(19.4,44,29.5,40,.15,14.5,2193,'stone');
      for(const u of[3.0,17.0,32.0]){
        loading(north.front,u,6.2,11.8);loading(north.back,u,6.2,11.8);
        K.sash(S,north.front,u+1.7,13.0,2.2,2.3,true);K.sash(S,north.back,u+1.7,13.0,2.2,2.3,true);
      }
      for(const F of[north.left,north.right]){loading(F,2.8,5.4,11);K.sash(S,F,4.3,13.0,2.3,2.3,true);}
      gable(21.65,65.35,4.65,16.35,17.05,6.8,true);
      for(const F of[south.front,south.back]){
        loading(F,3.0,5.6,9.8);loading(F,15.0,5.6,9.8);
        K.sash(S,F,10.6,9.0,2.6,3.6,true);lamps(F,2.0,8.8);
      }
      for(const F of[south.left,south.right])K.sash(S,F,3.8,7.5,2.5,4.2,true);
      gable(19.05,44.35,29.15,40.35,14.75,5.6,true);
      const divider=walls(43.5,53,16.5,37,.15,14.2,2194);
      for(const F of[divider.left,divider.right]){
        loading(F,2.2,5.0,10.2);loading(F,13.0,5.0,10.2);
        for(const u of[3.7,14.6])K.sash(S,F,u,11.2,2.2,2.0,true);
      }
      for(const F of[divider.front,divider.back])K.sash(S,F,3.25,8.3,2.8,4.2,true);
      gable(43.15,53.35,16.15,37.35,14.45,5.6,false);
      // A genuinely open hay arcade projects into only the west court edge.
      for(const x of[23.1,27.1,31.1])S.beam([x,21,.1],[x,21,7.8],P.woodD,.34);
      S.poly([[22,16.2,9],[32.5,16.2,9],[32.5,21.4,7.7],[22,21.4,7.7]],K.slate(dark(0,1)));
      bales(23.6,18.1,3,2);bales(55.6,20.3,4,2);cart(34.2,23.4);cart(58.4,31.5);
      stoneWall(2.1,67.3,1.1,1.8,2);stoneWall(1.1,1.8,1.8,40,2);
      stoneWall(1.6,38.2,78.0,78.6,1.6);stoneWall(45.2,71.7,78.0,78.6,1.6);
      fence(2.6,45,38.7,45,2.6);fence(45.6,45,71.2,45,2.6);
      for(const [x,y]of[[20.1,26.7],[61.9,37.8],[41.8,75.8],[75.2,41.1]])K.lantern(S,x,y,7.3,true);
      lamps(home.right,4.0,8.6);lamps(north.front,28.7,9.5);
    }else if(id==='UKR021-S'){
      apron(8.95,13.5,9,22.5);apron(2.0,9.0,21.5,23.2);
      const barn=walls(2.2,8.8,4,21,.15,9.6,2201);
      door403=barnDoors(barn,3.8,7.5);
      for(const F of[barn.left,barn.right])for(const u of[.8,12.6])K.sash(S,F,u,3.0,3.1,5.0,true);
      gable(1.95,9.05,3.75,21.25,9.85,5.0,false);
      for(const F of[barn.front,barn.back]){
        const pts=[];for(let n=0;n<16;n++){const a=n*Math.PI/8;pts.push(F.point(3.3+Math.cos(a)*1.05,.14,11.8+Math.sin(a)*1.05));}
        S.poly(pts,[P.glass,P.warm],.045);K.ring(S,F,3.3,11.8,1.27,1.27,.22,.18,P.stone,16);
        S.beam(F.point(2.25,.2,11.8),F.point(4.35,.2,11.8),P.frameR,.16);
        S.beam(F.point(3.3,.2,10.75),F.point(3.3,.2,12.85),P.frame,.16);
      }
      lamps(barn.front,.65,7.1);lamps(barn.back,.65,7.1);
      const feed=walls(2.4,7.1,23.5,28.7,.15,4.7,2202,'timber');
      loading(feed.front,1.0,2.8,3.8);shed(2.2,7.35,23.25,28.95,4.9,1.5);
      lamps(feed.left,2.0,4.4);lamps(feed.right,2.0,4.4);
      fence(10.2,1.8,30.1,1.8,2.6);fence(30.1,1.8,30.1,30.2,2.6);
      fence(10.2,1.8,10.2,8.0,2.6);fence(10.2,12.5,10.2,29.5,2.6);
      fence(1.4,30.2,11.5,30.2,2.6);fence(16.0,30.2,30.1,30.2,2.6);
      fence(12.0,30.0,15.5,29.9,2.3);trough(12.2,25.5,false);
      cow(18.0,14.9,false);cow(24.3,24.6,true);bales(3.0,22.0,2,1);
      K.lantern(S,13.6,29.1,6.1,true);hen403=projectPoint(19,21,.3);
    }else if(id==='UKR021-M'){
      apron(11.0,29.0,11,22.5);apron(10.8,14.8,23.0,30.4);
      const loft=walls(2.4,10.4,3,15.2,.15,19.5,2211);
      door403=barnDoors(loft,4.5,8.6);
      if(view===0)door403=animationDoor(loft.front,1.75,4.5,8.6);
      for(const F of[loft.front,loft.back])K.sash(S,F,2.35,11.1,3.3,5.3,true);
      for(const F of[loft.left,loft.right])for(const u of[1.15,7.45])K.sash(S,F,u,11.1,2.7,5.3,true);
      for(const F of Object.values(loft)){course(F,9.6);course(F,19.1);}
      gable(2.1,10.7,2.7,15.5,19.8,5.4,false);
      const stable=walls(10.8,28.5,3,10.2,.15,10.2,2212,'stone');
      for(const F of[stable.front,stable.back]){
        for(const u of[1.25,6.95,12.65])loading(F,u,3.35,7.3);
        for(const u of[2.25,7.95,13.65])K.sash(S,F,u,8.0,1.9,1.6,true);
      }
      for(const F of[stable.left,stable.right])K.sash(S,F,2.2,3.7,2.7,4.4,true);
      gable(10.5,28.8,2.7,10.5,10.5,4.6,true);
      lamps(stable.front,5.9,7.0);lamps(stable.back,5.9,7.0);lamps(loft.left,9.8,8.1);
      fence(1.3,17.1,10.0,17.1,2.5);fence(10.0,17.1,10.0,30.2,2.5);
      fence(1.3,30.2,9.9,30.2,2.5);fence(16.0,23.3,30.4,23.3,2.5);
      fence(30.4,11.0,30.4,30.2,2.5);fence(16.0,30.2,30.4,30.2,2.5);
      bales(13.0,13.0,3,2);trough(21.4,20.1,false);cart(25.0,12.5);
      cow(5.4,23.4,false);cow(23.5,27.1,true);K.lantern(S,16.0,20.3,6.7,true);hen403=projectPoint(17.3,18.2,.3);
    }else{
      apron(9.2,21.0,10.1,28.5);apron(29.5,30.7,8.8,29.8);
      const north=walls(2,29.3,2,8.8,.15,10.5,2221,'stone');
      for(const F of[north.front,north.back]){
        for(const u of[1.6,8.6,18.8])loading(F,u,4.1,7.8);
        for(const u of[3.0,10.0,20.2])K.sash(S,F,u,8.3,1.9,1.6,true);
      }
      for(const F of[north.left,north.right])K.sash(S,F,1.65,3.8,2.8,4.3,true);
      gable(1.7,29.6,1.7,9.1,10.8,4.5,true);
      const west=walls(2,8.5,9.3,27.5,.15,11.2,2222,'stone');
      for(const F of[west.left,west.right]){
        for(const u of[1.2,7.1,13])loading(F,u,3.8,8.4);
        for(const u of[2.2,8.1,14.0])K.sash(S,F,u,9.0,1.85,1.65,true);
      }
      for(const F of[west.front,west.back])K.sash(S,F,1.7,5.3,3.0,4.3,true);
      hip(1.7,8.8,9.0,27.8,11.5,4.2,false);
      // West veranda remains open: real posts, a low sloping roof and no
      // solid filler under it. The central court has a full south opening.
      for(const yy of[10.2,15.1,20.0,24.9])S.beam([10.7,yy,.1],[10.7,yy,6.8],P.woodD,.27);
      S.poly([[8.55,9.7,8.3],[10.95,9.7,6.9],[10.95,25.4,6.9],[8.55,25.4,8.3]],K.slate(dark(1,0)));
      const loft=walls(21.8,29.3,9.3,28.5,.15,22.5,2223);
      door403=barnDoors(loft,4.4,9.5);
      if(view===1)door403=animationDoor(north.back,8.6,4.1,7.8);
      for(const F of[loft.front,loft.back]){
        K.sash(S,F,2.3,12.6,2.85,5.2,true);course(F,11.0);course(F,22.1);
      }
      for(const F of[loft.left,loft.right]){
        for(const u of[1.6,7.75,13.9])K.sash(S,F,u,12.6,2.85,5.2,true);
        course(F,11.0);course(F,22.1);
      }
      gable(21.5,29.6,9.0,28.8,22.8,5.6,false);
      lamps(north.front,15.8,7.5);lamps(north.back,15.8,7.5);lamps(loft.front,.8,8.7);lamps(loft.back,.8,8.7);
      bales(12.2,11.4,3,2);trough(13.4,24.7,false);cart(16.9,16.0);
      cow(14.1,20.4,false);cow(18.4,26.0,true);
      fence(1.35,30.2,9.0,30.2,2.5);fence(21.3,30.2,30.5,30.2,2.5);
      K.lantern(S,20.0,28.6,6.5,true);hen403=projectPoint(15.3,19.0,.3);
    }
    function projectPoint(xx,yy,zz){
      let x=xx,y=yy;if(view===1){x=extent-yy;y=xx;}else if(view===2){x=extent-xx;y=extent-yy;}else if(view===3){x=yy;y=extent-xx;}
      return [Math.round(spec.w/2+2*x-2*y),Math.round(spec.h-2-2*extent+x+y-(zz||0))];
    }
    const meta={season,stage,crop,cropClass:cropClasses[crop],temporalInputs:'native-T397-only',
      nativeFootprint:spec.sz+'x'+spec.sz,nativeLevel:spec.lv||1,geometryVariant:spec.id,
      functionality:'original-carrier-only; no new production, animal count, capacity or calendar'};
    if(door403){meta.door403=door403;meta.hen403=hen403;meta.animalArt='static-cattle-preview; native species and head counts remain unmodified';}
    if(spec.k===63){meta.glassPolicy='opaque-dithered-see-through-panels-over-real-interior-beds';meta.winterPolicy='protected-bed-art; external-season-color-only';}
    else meta.winterPolicy='muted-ground-and-dry-crop-stubble; snow-owned-by-native-overlay';
    return finish(meta);
  }
  root.BritishUseScalesAgriculture021=Object.freeze({specs,cropClasses,build,
    buildAll:extra=>specs.flatMap(s=>Array.from({length:4},(_,view)=>build(s.id,view,extra)))});
})(typeof window==='undefined'?globalThis:window);
