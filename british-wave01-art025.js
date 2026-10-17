/* GPT-025 / wave 01. Ten original geometric interpretations, native 2x2.
 * Source references document structure, not copied photographs or textures.
 * Shared approved Scene and palette stay unchanged. No simulation or RNG.
 */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
    {id:'alaronde',nm:'阿拉隆德十六角屋',en:'A la Ronde',shape:'sixteen-sided-diamond-window-house',note:'十六邊低屋體、菱形窗與分面屋頂。',url:'https://www.nationaltrust.org.uk/visit/devon/a-la-ronde/things-to-see-and-do-at-a-la-ronde-house'},
    {id:'dunster',nm:'鄧斯特紗市亭',en:'Dunster Yarn Market',shape:'open-octagon-eight-dormers-lantern',note:'八角木柱、中央石柱、八個小山牆窗與木燈亭。',url:'https://historicengland.org.uk/listing/the-list/list-entry/1173428'},
    {id:'tattershall',nm:'塔特舍爾大塔',en:'Tattershall Great Tower',shape:'tall-brick-keep-four-corner-turrets',note:'高窄紅磚大塔、四角凸塔、石框尖窗與城垛。',url:'https://www.nationaltrust.org.uk/visit/nottinghamshire-lincolnshire/tattershall-castle/the-history-of-tattershall-castle'},
    {id:'hardwick',nm:'哈德威克廳',en:'Hardwick Hall',shape:'broad-glazed-hall-six-flat-towers',note:'寬闊三層大廳、六個突出塔樓與高大的上層窗。',url:'https://www.nationaltrust.org.uk/visit/peak-district-derbyshire/hardwick/discover-hardwick-hall'},
    {id:'stokesay',nm:'斯托克賽堡',en:'Stokesay Castle',shape:'stone-hall-two-towers-timber-gatehouse',note:'石造長廳、不同高度的塔與獨立木構門樓。',url:'https://www.english-heritage.org.uk/visit/places/stokesay-castle/history-and-stories/history/'},
    {id:'chiswick',nm:'奇西克別墅',en:'Chiswick House',shape:'square-villa-six-column-portico-octagonal-dome',note:'方形別墅、六柱前廊、分叉外階與八角穹頂。',url:'https://www.english-heritage.org.uk/visit/places/chiswick-house/history/'},
    {id:'cragside',nm:'克拉格賽德',en:'Cragside',shape:'asymmetric-stone-wings-tower-cross-gables',note:'分期相接的石造樓翼、高低山牆、凸塔與煙囪。',url:'https://www.nationaltrust.org.uk/visit/north-east/cragside/history-of-cragside'},
    {id:'homewood',nm:'霍姆伍德現代別墅',en:'The Homewood',shape:'cantilevered-l-wing-pilotis-ribbon-windows',note:'白色水平樓翼架在細柱上，帶狀窗與磚造底層。',url:'https://www.nationaltrust.org.uk/visit/surrey/the-homewood/explore-the-homewood'},
    {id:'cardington',nm:'卡丁頓飛船棚',en:'Cardington Hangar 2',shape:'long-steel-shed-buttresses-folded-roof-doors',note:'鋼構高棚、檐下扶壁與大型滑門；小比例長寬有壓縮。',url:'https://www.cardingtonstudios.com/facilities'},
    {id:'willington',nm:'威靈頓鴿舍',en:'Willington Dovecote',shape:'stone-dovecote-stepped-gables-roof-louvres',note:'厚石牆、階梯山牆與屋頂百葉入口。',url:'https://www.nationaltrust.org.uk/visit/essex-bedfordshire-hertfordshire/willington-dovecote-and-stables/visiting-willington-dovecote-and-stables'}
  ].map((r,i)=>Object.freeze({...r,v:160+i*4})));

  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4037'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0')};
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      if(kind==='brick')return K.brick(d,2501);
      if(kind==='stone')return K.ashlar(d,2502);
      if(kind==='steel')return(u,z)=>K.mod(z,3.3)<.16?(d?Q.steel:Q.steelHi):(d?Q.steelD:Q.steel);
      if(kind==='wood')return(u,z)=>K.mod(z,1.5)<.15?(d?Q.oakD:Q.oak):(d?P.woodR:P.woodHi);
      return(u,z)=>K.hash(Math.floor(u*2),Math.floor(z*2),2503)%47===0?(d?Q.creamD:Q.creamHi):(d?Q.creamD:Q.cream);
    }
    function volume(x0,x1,y0,y1,z0,z1,kind){
      const f={
        front:Object.assign(S.face([x0,y1],[x1,y1],0,1),{nx:0,ny:1}),
        back:Object.assign(S.face([x1,y0],[x0,y0],0,-1),{nx:0,ny:-1}),
        right:Object.assign(S.face([x1,y1],[x1,y0],1,0),{nx:1,ny:0}),
        left:Object.assign(S.face([x0,y0],[x0,y1],-1,0),{nx:-1,ny:0})
      };
      S.wall([x0,y1],[x1,y1],z0,z1,mat(kind,0,1));S.wall([x1,y0],[x0,y0],z0,z1,mat(kind,0,-1));
      S.wall([x1,y1],[x1,y0],z0,z1,mat(kind,1,0));S.wall([x0,y0],[x0,y1],z0,z1,mat(kind,-1,0));
      S.flat(x0,x1,y0,y1,z1,kind==='steel'?Q.steelD:P.stoneR);
      return f;
    }
    function roof(x0,x1,y0,y1,z,rise,axis,kind){
      const cx=(x0+x1)/2,cy=(y0+y1)/2,m=(nx,ny)=>K.slate(dark(nx,ny));
      if(axis!=='y'){
        S.poly([[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]],m(0,-1));S.poly([[x0,y1,z],[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z]],m(0,1));
        S.poly([[x0,y0,z],[x0,y1,z],[x0,cy,z+rise]],mat(kind||'stone',-1,0));S.poly([[x1,y0,z],[x1,cy,z+rise],[x1,y1,z]],mat(kind||'stone',1,0));
        S.beam([x0,cy,z+rise],[x1,cy,z+rise],P.lead,.36);
      }else{
        S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],m(-1,0));S.poly([[x1,y0,z],[x1,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],m(1,0));
        S.poly([[x0,y0,z],[cx,y0,z+rise],[x1,y0,z]],mat(kind||'stone',0,-1));S.poly([[x0,y1,z],[x1,y1,z],[cx,y1,z+rise]],mat(kind||'stone',0,1));
        S.beam([cx,y0,z+rise],[cx,y1,z+rise],P.lead,.36);
      }
    }
    function pane(F,u,z,w,h,type,lit){
      const cx=u+w/2,head=type==='pointed'?h*.64:type==='arch'?h*.66:h;
      let outside,inside;
      if(type==='diamond'){
        outside=[[cx,z-.35],[u+w+.35,z+h/2],[cx,z+h+.35],[u-.35,z+h/2]];
        inside=[[cx,z+.35],[u+w-.35,z+h/2],[cx,z+h-.35],[u+.35,z+h/2]];
      }else if(type==='pointed'||type==='arch'){
        outside=[[u-.3,z-.35],[u+w+.3,z-.35],[u+w+.3,z+head],[cx,z+h+.4],[u-.3,z+head]];
        inside=[[u+.3,z+.35],[u+w-.3,z+.35],[u+w-.3,z+head-.2],[cx,z+h-.35],[u+.3,z+head-.2]];
      }else{
        outside=[[u-.3,z-.35],[u+w+.3,z-.35],[u+w+.3,z+h+.35],[u-.3,z+h+.35]];
        inside=[[u+.22,z+.22],[u+w-.22,z+.22],[u+w-.22,z+h-.22],[u+.22,z+h-.22]];
      }
      S.poly(outside.map(p=>F.point(p[0],.13,p[1])),P.stoneHi);
      const glass=dark(F.nx,F.ny)?P.glassR:P.glass;
      S.poly(inside.map(p=>F.point(p[0],.24,p[1])),lit===false?glass:[glass,P.warm]);
      if(type!=='diamond'){
        const bays=type==='ribbon'?Math.max(2,Math.round(w/2.8)):type==='mullion'?3:2;
        for(let b=1;b<bays;b++)F.panel(u+w*b/bays-.10,u+w*b/bays+.10,z+.2,z+h-.3,P.frame,.32);
        if(type!=='ribbon')F.panel(u+.2,u+w-.2,z+h*.48-.10,z+h*.48+.10,P.frame,.33);
      }else{
        S.beam(F.point(cx,.31,z+.45),F.point(cx,.31,z+h-.45),P.frame,.15);
        S.beam(F.point(u+.45,.31,z+h/2),F.point(u+w-.45,.31,z+h/2),P.frame,.15);
      }
    }
    function windows(F,levels,bays,z0,step,w,h,type){
      for(let l=0;l<levels;l++)for(let b=0;b<bays;b++)pane(F,F.length*(b+.5)/bays-w/2,z0+l*step,w,h,type,true);
    }
    function polygon(cx,cy,r,z0,z1,n,kind,phase){
      const points=Array.from({length:n},(_,i)=>{const a=(phase||0)+i*Math.PI*2/n;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r];}),faces=[];
      for(let i=0;i<n;i++){
        const p=points[i],q=points[(i+1)%n],a=(phase||0)+(i+.5)*Math.PI*2/n,nx=Math.cos(a),ny=Math.sin(a);
        S.wall(p,q,z0,z1,mat(kind,nx,ny));faces.push(Object.assign(S.face(p,q,nx,ny),{nx,ny}));
      }
      S.poly(points.map(p=>[...p,z1]),P.stoneR);return faces;
    }
    function cone(cx,cy,r0,r1,z0,z1,n,kind){
      for(let i=0;i<n;i++){
        const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n,m=(a+b)/2;
        const tex=kind==='lead'?(dark(Math.cos(m),Math.sin(m))?Q.steelD:Q.steel):K.slate(dark(Math.cos(m),Math.sin(m)));
        S.poly([[cx+Math.cos(a)*r0,cy+Math.sin(a)*r0,z0],[cx+Math.cos(b)*r0,cy+Math.sin(b)*r0,z0],[cx+Math.cos(b)*r1,cy+Math.sin(b)*r1,z1],[cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,z1]],tex);
      }
    }
    function parapet(x0,x1,y0,y1,z,battled){
      for(const [xa,xb,ya,yb]of[[x0,x1,y0,y0+.45],[x0,x1,y1-.45,y1],[x0,x0+.45,y0,y1],[x1-.45,x1,y0,y1]])S.box(xa,xb,ya,yb,z,z+1.7,P.stone,P.stoneR,P.stoneHi);
      if(battled)for(let u=x0;u<x1;u+=2.6)for(const y of[y0,y1-.8])S.box(u,Math.min(u+1.35,x1),y,y+.8,z+1.7,z+3,P.stone,P.stoneR,P.stoneHi);
    }
    function steps(x0,x1,y0,y1,rise,n){for(let i=0;i<n;i++)S.box(x0,x1,y0+(y1-y0)*i/n,y1,.42,.42+rise*(i+1)/n,P.stone,P.stoneR,P.stoneHi);}
    function chimney(x,y,z,h){volume(x-.65,x+.65,y-.7,y+.7,z,z+h,'brick');S.box(x-.9,x+.9,y-.9,y+.9,z+h,z+h+.7,P.stone,P.stoneR,P.stoneHi);for(const dx of[-.38,.38])K.cylinder(S,x+dx,y,z+h+.7,z+h+2.5,.24,.28,Q.red,Q.redD,P.ink,8);}
    if(!root.__wave025GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave025GeometryOnly){K.lantern(S,3.2,28.4,4.3,true);K.lantern(S,28.8,28.4,4.3,true);}
      return S.finish({id:row.id,design:row.shape,heritageName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave025:1});
    }
    return{...H,S,K,P,Q,mat,volume,roof,pane,windows,polygon,cone,parapet,steps,chimney,finish};
  }

  function alaronde(row,v){
    const A=context(row,v),{S,P,polygon,pane,cone}=A,F=polygon(16,16,11.1,.45,18.2,16,'plaster');
    F.forEach((f,i)=>{if(i%2===0)pane(f,f.length/2-1.35,7.2,2.7,5.3,'diamond');});
    cone(16,16,12,3.7,18.3,30,16);polygon(16,16,3.7,29.6,33,8,'plaster');cone(16,16,4.3,0,33.1,37.2,8);
    A.K.timberDoor(F[3],.3,.6,2.4,6.1,true);A.chimney(10.6,13.4,25.2,5.3);
    for(let i=0;i<16;i++){const a=i*Math.PI/8;S.beam([16+Math.cos(a)*12,16+Math.sin(a)*12,18.3],[16+Math.cos(a)*3.7,16+Math.sin(a)*3.7,30],P.lead,.15);}
    return A.finish();
  }
  function dunster(row,v){
    const A=context(row,v),{S,K,P,Q,cone,polygon,pane}=A;
    K.cylinder(S,16,16,.45,16.5,1.15,1.35,P.stone,P.stoneR,P.stoneHi,8);
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4,x=16+Math.cos(a)*11.6,y=16+Math.sin(a)*11.6,b=(i+1)*Math.PI/4,xx=16+Math.cos(b)*11.6,yy=16+Math.sin(b)*11.6;
      S.box(x-.26,x+.26,y-.26,y+.26,.45,16.4,Q.oak,Q.oakD,P.woodHi);
      S.beam([x,y,16.1],[xx,yy,16.1],Q.oak,.65);S.beam([16,16,15.8],[x,y,16.1],Q.oak,.5);
      S.beam([x,y,12.2],[16+(x-16)*.72,16+(y-16)*.72,16.1],Q.oak,.37);
      const mid=a+Math.PI/8,nx=Math.cos(mid),ny=Math.sin(mid),tx=-ny,ty=nx,cx=16+nx*8.9,cy=16+ny*8.9;
      const p=[cx-tx*2.1,cy-ty*2.1],q=[cx+tx*2.1,cy+ty*2.1],F=Object.assign(S.face(p,q,nx,ny),{nx,ny});
      S.wall(p,q,20,23.2,A.mat('wood',nx,ny));S.poly([[...p,23.2],[...q,23.2],[cx,cy,26]],P.woodHi);pane(F,.4,20.35,3.4,2.5,'mullion');
      S.poly([[...p,23.3],[cx,cy,26.1],[cx-nx*3,cy-ny*3,25]],K.slate(A.dark(tx,ty)));
      S.poly([[...q,23.3],[cx-nx*3,cy-ny*3,25],[cx,cy,26.1]],K.slate(A.dark(-tx,-ty)));
    }
    cone(16,16,13,3.1,16.8,26.3,8);
    const L=polygon(16,16,3.1,26.2,31.2,8,'wood');L.forEach(f=>pane(f,.45,27.1,Math.max(.8,f.length-.9),2.6,'sash'));
    cone(16,16,3.9,0,31.3,36,8);S.beam([16,16,36],[16,16,39],P.iron,.23);S.beam([14.4,16,38],[17.6,16,38],P.gold,.23);
    return A.finish();
  }
  function tattershall(row,v){
    const A=context(row,v),{S,P,volume,windows,polygon,pane,parapet}=A,F=volume(9.6,22.4,9.6,22.4,.45,72,'brick');
    for(const f of Object.values(F))windows(f,4,2,6,16,3.4,10,'pointed');
    for(const x of[9.7,22.3])for(const y of[9.7,22.3]){
      const fs=polygon(x,y,3.25,.45,78,8,'brick');
      fs.forEach((f,i)=>{if(i%2===0){pane(f,.35,21,1.7,5.2,'pointed');pane(f,.35,51,1.7,5.2,'pointed');}});
      polygon(x,y,3.65,77,79.2,8,'stone');
      for(let j=0;j<8;j++){const a=j*Math.PI/4;S.box(x+Math.cos(a)*3.2-.47,x+Math.cos(a)*3.2+.47,y+Math.sin(a)*3.2-.47,y+Math.sin(a)*3.2+.47,79.2,81.5,P.stone,P.stoneR,P.stoneHi);}
    }
    parapet(9.2,22.8,9.2,22.8,72,true);A.steps(13.2,18.8,23.4,29.8,4,6);A.K.timberDoor(F.front,4.7,4.1,3.5,8,true);
    return A.finish();
  }
  function hardwick(row,v){
    const A=context(row,v),{volume,windows,parapet}=A,F=volume(4.2,27.8,9,23,.45,34,'stone');
    for(const f of Object.values(F)){windows(f,2,Math.max(2,Math.floor(f.length/4.6)),3.4,10.2,3.2,6.5,'mullion');windows(f,1,Math.max(2,Math.floor(f.length/4.6)),25,1,3.4,8,'mullion');}
    parapet(4.1,27.9,8.9,23.1,34,false);
    for(const x of[3.2,13,22.8])for(const y of[5.2,21.2]){
      const T=volume(x,x+6,y,y+6,.45,42,'stone');
      for(const f of Object.values(T)){windows(f,2,1,3.4,11,3.2,6.8,'mullion');windows(f,1,1,26.5,1,3.4,11.7,'mullion');}
      parapet(x-.18,x+6.18,y-.18,y+6.18,42,false);
    }
    A.steps(13.5,18.5,27.5,30.8,2.5,5);return A.finish();
  }
  function stokesay(row,v){
    const A=context(row,v),{S,P,Q,volume,roof,windows,polygon,pane}=A,F=volume(3.7,12.7,9.5,27,.45,21,'stone');
    roof(3.3,13.1,9.1,27.4,21.3,12,'y','stone');windows(F.right,1,4,6.3,1,3.1,10.8,'pointed');windows(F.left,1,4,6.3,1,3.1,10.8,'pointed');
    const N=volume(3.7,13.5,3.5,10,.45,30,'stone');roof(3.3,13.9,3.1,10.4,30.3,8,'x','plaster');windows(N.back,2,2,6,12,2.9,7,'sash');windows(N.left,2,1,6,12,2.8,7,'sash');
    const T=polygon(9.2,25.2,5.5,.45,38,6,'stone');T.forEach(f=>pane(f,.65,22.8,Math.max(2,f.length-1.3),8.2,'mullion'));A.cone(9.2,25.2,5.9,.2,38.4,44.5,6);
    volume(19,22.4,20,27,.45,11,'stone');volume(26.6,30,20,27,.45,11,'stone');
    const G=volume(18.5,30.5,19.6,27.4,11,23,'plaster');roof(18.1,30.9,19.2,27.8,23.4,7,'x','plaster');
    for(const f of Object.values(G)){for(let u=.3;u<f.length;u+=3){S.beam(f.point(u,.32,11),f.point(u,.32,23),Q.oak,.42);S.beam(f.point(u,.34,12),f.point(Math.min(u+2.7,f.length-.2),.34,21.5),Q.oak,.25);}pane(f,f.length/2-1.4,15,2.8,5.7,'mullion');}
    S.beam([22.5,23.8,9.8],[26.5,23.8,9.8],P.woodHi,.55);return A.finish();
  }
  function chiswick(row,v){
    const A=context(row,v),{S,K,P,volume,pane,windows,polygon,cone,steps}=A,F=volume(7.5,26.5,6.5,24,.45,28,'stone');
    windows(F.back,2,3,4,12,3.8,7.5,'sash');windows(F.left,2,3,4,12,3.2,7.5,'sash');windows(F.right,2,3,4,12,3.2,7.5,'sash');
    pane(F.front,7.7,14,3.6,9,'arch');
    const D=polygon(17,14.3,6.8,28,33,8,'stone');D.forEach((f,i)=>{if(i%2===0)pane(f,.65,29,Math.max(1.8,f.length-1.3),3.2,'arch');});
    cone(17,14.3,7.1,5.6,33.2,39.1,8,'lead');cone(17,14.3,5.6,2.9,39.1,43,8,'lead');cone(17,14.3,2.9,.3,43,44.9,8,'lead');
    S.box(7,27,24,29.2,7,8,P.stone,P.stoneR,P.stoneHi);
    for(let i=0;i<6;i++){const x=8.5+i*3.4;K.cylinder(S,x,28.1,8,24.2,.42,.45,P.stoneHi,P.stoneR,P.stoneHi,8);S.box(x-.65,x+.65,27.45,28.75,23.4,24.4,P.stone,P.stoneR,P.stoneHi);}
    S.box(7.5,26.5,25.6,29.1,24.4,25.9,P.stone,P.stoneR,P.stoneHi);A.roof(7.2,26.8,25.2,29.4,26.2,6,'y','stone');
    steps(2.7,7,24.2,30.7,7,9);steps(27,31.3,24.2,30.7,7,9);
    return A.finish();
  }
  function cragside(row,v){
    const A=context(row,v),{S,P,Q,volume,roof,windows,pane}=A,B=volume(3,28.5,4,11,.45,30,'stone'),L=volume(3,10.5,11,27.8,.45,23,'stone'),F=volume(10.5,22,20.5,28,.45,29,'stone'),T=volume(21,28.5,10.5,18.5,.45,49,'stone');
    roof(2.7,28.8,3.7,11.3,30.4,10,'x','stone');roof(2.7,10.8,10.7,28.1,23.4,10,'y','stone');roof(10.2,22.3,20.2,28.3,29.4,9,'x','stone');roof(20.6,28.9,10.1,18.9,49.4,8,'y','stone');
    windows(B.back,2,6,5,12,3,7,'mullion');windows(L.left,2,4,4,11,2.6,7,'sash');windows(F.front,2,3,4,12,2.9,8,'mullion');windows(T.right,3,2,8,12,2.2,7,'mullion');
    const O=volume(25.5,30.2,14,20,28,37,'plaster');for(const f of Object.values(O))pane(f,.45,29.7,Math.max(2,f.length-.9),5.4,'mullion');
    roof(25.2,30.5,13.7,20.3,37.4,5,'y','plaster');
    for(const y of[14.3,16.8,19.6])S.beam([25.6,y,28],[30.2,y,37],Q.oak,.27);
    A.chimney(6.3,8.1,36,7);A.chimney(18,7.6,36,10);A.chimney(14.2,24.3,34,7);
    return A.finish();
  }
  function homewood(row,v){
    const A=context(row,v),{S,P,Q,volume,pane}=A;
    const G=volume(7.5,17,9.5,20,.45,13.2,'brick');pane(G.front,1,3.7,6.8,6.2,'ribbon');A.K.timberDoor(G.left,1.4,.5,2.3,8,true);
    for(const x of[5.8,13.6,21.4,28])for(const y of[8,12.1])S.box(x-.23,x+.23,y-.23,y+.23,.45,14,Q.cream,Q.creamD,Q.creamHi);
    for(const y of[19.3,26.3])for(const x of[20,28])S.box(x-.23,x+.23,y-.23,y+.23,.45,14,Q.cream,Q.creamD,Q.creamHi);
    const B=volume(4.7,29,5.8,13.6,14,27,'plaster'),L=volume(19,29,13.6,27.5,14,27,'plaster');
    pane(B.front,.7,18,22.9,6.8,'ribbon');pane(B.back,.7,18,22.9,6.8,'ribbon');pane(B.left,.7,18,6.4,6.8,'ribbon');
    pane(L.right,.8,18,12.3,6.8,'ribbon');pane(L.left,.8,18,12.3,6.8,'ribbon');pane(L.front,.7,18,8.6,6.8,'ribbon');
    S.box(4.4,29.3,5.5,13.9,27,27.6,Q.creamHi,Q.creamD,Q.creamHi);S.box(18.7,29.3,13.6,27.8,27,27.6,Q.creamHi,Q.creamD,Q.creamHi);
    S.flat(3,17,23,28.5,.55,P.pave);return A.finish();
  }
  function cardington(row,v){
    const A=context(row,v),{S,P,Q,volume,pane}=A,F=volume(8,24,2.4,29.6,.45,41,'steel');
    const section=[[7.4,41],[8.5,46],[11.8,51.8],[16,54.7],[20.2,51.8],[23.5,46],[24.6,41]];
    for(let j=0;j<section.length-1;j++){const a=section[j],b=section[j+1];S.poly([[a[0],2.2,a[1]],[b[0],2.2,b[1]],[b[0],29.8,b[1]],[a[0],29.8,a[1]]],A.mat('steel',(a[0]+b[0])/2<16?-1:1,0));}
    for(const y of[2.35,29.65])S.poly([[8,y,41],...section.map(p=>[p[0],y,p[1]]),[24,y,41]],A.mat('steel',0,y<16?-1:1));
    for(const y of[4.1,9.2,14.3,19.4,24.5,28])for(const x of[8,24]){
      const out=x<16?4:28;S.poly([[x,y-1.1,.5],[out,y-1.1,.5],[out,y-1.1,7],[x,y-1.1,40]],x<16?Q.steel:Q.steelD);
      S.poly([[x,y+1.1,.5],[out,y+1.1,.5],[out,y+1.1,7],[x,y+1.1,40]],x<16?Q.steelHi:Q.steel);S.beam([out,y,7],[x,y,40],P.iron,.45);
    }
    for(const f of[F.front,F.back]){
      f.panel(.8,15.2,.6,35.5,A.mat('steel',f.nx,f.ny),.22);
      for(let x=1;x<15;x+=2.3)f.panel(x,x+.18,1,35,P.ironD,.32);
      pane(f,1.2,36,13.6,3.2,'ribbon');f.block(.5,15.5,0,.7,35.5,36.2,P.iron,P.ironD,P.ironHi);
    }
    for(const f of[F.left,F.right])for(let b=0;b<5;b++)pane(f,2+b*5,31,3.7,3.6,'ribbon');
    return A.finish();
  }
  function willington(row,v){
    const A=context(row,v),{S,P,Q,volume,roof,pane}=A,F=volume(7,25,7,25,.45,18.3,'stone');
    roof(6.7,25.3,6.7,25.3,18.6,11,'y','stone');
    for(const y of[6.8,24.8])for(let j=0;j<6;j++)S.box(6.7+j*1.5,25.3-j*1.5,y,y+.65,18.6+j*1.85,20.5+j*1.85,P.stone,P.stoneR,P.stoneHi);
    const V=volume(13.8,18.2,13.8,18.2,28.5,33.7,'wood');
    for(const f of Object.values(V))for(let j=0;j<4;j++)f.panel(.2,f.length-.2,29.1+j*.9,29.45+j*.9,Q.oakD,.19);
    A.hip(13.3,18.7,13.3,18.7,34,3,true);
    A.K.timberDoor(F.front,7,.5,3.2,6.5,false);
    pane(F.right,6,11.5,2.1,3.3,'sash',false);pane(F.back,7.8,11.5,2.1,3.3,'sash',false);
    return A.finish();
  }
  const AUTHORS=Object.freeze([alaronde,dunster,tattershall,hardwick,stokesay,chiswick,cragside,homewood,cardington,willington]);
  function build(id,view){
    const i=ROWS.findIndex(r=>r.id===id);
    if(i<0||!Number.isInteger(view)||view<0||view>3)throw Error('wave025 requires a known form and four geometric views');
    return AUTHORS[i](ROWS[i],view);
  }
  function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  root.BritishWaveArchitecture025=Object.freeze({rows:ROWS,build,buildAll});
})(typeof window==='undefined'?globalThis:window);
