/* GPT-024: fifteen original British heritage interpretations, native 2x2 lots.
 * Four real world-space views; existing Scene / z buffer / opaque pixel rules.
 * Official structural sources in ROWS. No photos, textures, simulation or RNG.
 */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
    {id:'lavenham',nm:'拉文納姆行會館',en:'Lavenham Guildhall',shape:'jettied-long-hall',note:'16世紀木構行會館：懸挑上層、木框斜撐與門廊。',url:'https://www.nationaltrust.org.uk/visit/suffolk/lavenham-guildhall/history-of-lavenham-guildhall'},
    {id:'moreton',nm:'小莫頓庭院宅',en:'Little Moreton Hall',shape:'u-court-oriel-gallery',note:'分期建造的都鐸庭院宅：長廊、菱格窗與突出凸窗。',url:'https://www.nationaltrust.org.uk/visit/cheshire-greater-manchester/little-moreton-hall/history-of-little-moreton-hall'},
    {id:'coxwell',nm:'考克斯韋爾大穀倉',en:'Great Coxwell Barn',shape:'cross-porch-steep-barn',note:'中世紀石造穀倉：陡屋面、十字門廊與厚扶壁。',url:'https://www.nationaltrust.org.uk/visit/oxfordshire-buckinghamshire-berkshire/great-coxwell-barn/history-of-great-coxwell-barn'},
    {id:'rushton',nm:'拉什頓三角屋',en:'Rushton Triangular Lodge',shape:'triangular-three-gables',note:'1593–97年小屋以三為題：三角平面、三層與三個山牆。',url:'https://www.english-heritage.org.uk/visit/places/rushton-triangular-lodge/history/decoding-rushton-triangular-lodge/'},
    {id:'dunmore',nm:'鄧莫爾鳳梨亭',en:'Dunmore Pineapple',shape:'pineapple-stone-crown',note:'蘇格蘭1761年夏亭：雕石鳳梨冠頂與低矮石翼。',url:'https://www.nts.org.uk/visit/places/The-Pineapple/'},
    {id:'dulwich',nm:'杜爾維治畫廊',en:'Dulwich Picture Gallery',shape:'lantern-gallery-mausoleum',note:'Soane的低磚畫廊：一列屋頂採光天窗與獨立陵堂體。',url:'https://www.dulwichpicturegallery.org.uk/explore/news-stories/our-architecture/'},
    {id:'flaxmill',nm:'什魯斯伯里亞麻廠',en:'Shrewsbury Flaxmill',shape:'five-storey-mill-tower',note:'1797年鐵架工業建築：五層磚體、規則窗列與服務塔。',url:'https://historicengland.org.uk/campaigns/visit/shrewsbury-flax-mill/history/'},
    {id:'settle',nm:'塞特爾信號樓',en:'Settle Signal Box',shape:'raised-glazed-cab-stair',note:'1891年Midland木造信號樓：架高觀察室、外階與四坡頂。',url:'https://www.foscl.org.uk/content/settle-station-signal-box'},
    {id:'beamish',nm:'比米什礦井展示',en:'Beamish Heapstead',shape:'stone-engine-wood-heapstead',note:'礦業展示：高石砌絞車屋、木造井架平台與礦車。',url:'https://www.beamish.org.uk/explore/1900s-colliery/'},
    {id:'bletchley',nm:'布萊切利一號木屋',en:'Bletchley Park Hut 1',shape:'low-weatherboard-brick-annex',note:'1939年木板長屋、氈屋頂，附1942年磚造延伸部分。',url:'https://historicengland.org.uk/listing/the-list/list-entry/1391793'},
    {id:'appleby',nm:'阿普爾比市政廳',en:'Appleby Moot Hall',shape:'white-hall-bellcote-stair',note:'白色抹灰石牆、陡板岩頂、六角鐘亭與外石階。',url:'https://historicengland.org.uk/listing/the-list/list-entry/1145607'},
    {id:'kew',nm:'邱宮荷蘭屋',en:'Kew Palace',shape:'three-dutch-curved-gables',note:'1631年磚造小宮殿：三個荷蘭式山牆與緊湊對稱窗列。',url:'https://www.hrp.org.uk/kew-palace/history-and-stories/the-story-of-kew-palace/'},
    {id:'orford',nm:'奧福德城堡主塔',en:'Orford Castle Keep',shape:'polygon-keep-three-turrets',note:'12世紀多邊形主塔，三座外凸方塔與外台階。',url:'https://historicengland.org.uk/listing/the-list/list-entry/1014860'},
    {id:'delawarr',nm:'德拉沃展亭',en:'De La Warr Pavilion',shape:'modern-balcony-glazed-rotunda',note:'1935年現代主義：水平樓體、懸挑露台與玻璃樓梯體。',url:'https://www.dlwp.com/about-us/our-heritage/'},
    {id:'rievaulx',nm:'里沃修道院遺址',en:'Rievaulx Abbey',shape:'roofless-pointed-arcade',note:'修道院石造遺址：無頂尖拱列、破牆、分層窗與庭院基址。',url:'https://www.english-heritage.org.uk/visit/places/rievaulx-abbey/history-and-stories/history/description/'}
  ].map((r,i)=>Object.freeze({...r,v:100+i*4})));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const T={cream:C('ddd5bd'),creamR:C('aaa691'),creamHi:C('eee5ce'),oak:C('514c40'),oakR:C('353b35'),tile:C('846250'),tileR:C('604f46'),felt:C('45584e'),feltR:C('34433e')};
    if(!root.__heritage024GeometryOnly){S.box(.7,31.3,.7,31.3,0,.42,P.pave,P.paveR,P.pave);S.flat(.7,31.3,.7,31.3,.43,K.paving);}
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      if(kind==='stone')return K.ashlar(d,2424);
      if(kind==='brick')return K.brick(d,2425);
      if(kind==='timber')return(x,y,z)=>K.mod(z,1.5)<.12?(d?P.greenD:P.green):(d?P.green:P.greenHi);
      return(x,y,z)=>K.hash(Math.floor(x*2),Math.floor(z*2),2401)%37===0?(d?P.stoneD:T.creamHi):(d?T.creamR:T.cream);
    }
    function volume(x0,x1,y0,y1,z0,z1,kind){
      kind=kind||'brick';
      S.wall([x0,y1],[x1,y1],z0,z1,mat(kind,0,1));S.wall([x1,y0],[x0,y0],z0,z1,mat(kind,0,-1));
      S.wall([x1,y1],[x1,y0],z0,z1,mat(kind,1,0));S.wall([x0,y0],[x0,y1],z0,z1,mat(kind,-1,0));
      S.flat(x0,x1,y0,y1,z1,P.stoneD);
      return{front:S.face([x0,y1],[x1,y1],0,1),back:S.face([x1,y0],[x0,y0],0,-1),left:S.face([x0,y0],[x0,y1],-1,0),right:S.face([x1,y1],[x1,y0],1,0)};
    }
    function band(x0,x1,y0,y1,z){S.box(x0-.18,x1+.18,y0-.18,y1+.18,z,z+.6,P.stone,P.stoneR,P.stoneHi);}
    function roof(x0,x1,y0,y1,z,rise,axis,kind,roofMat){
      const cx=(x0+x1)/2,cy=(y0+y1)/2,col=(nx,ny)=>roofMat? (dark(nx,ny)?T.feltR:T.felt):K.slate(dark(nx,ny));
      if(axis!=='y'){
        S.poly([[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]],col(0,-1));S.poly([[x0,y1,z],[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z]],col(0,1));
        S.poly([[x0,y0,z],[x0,y1,z],[x0,cy,z+rise]],mat(kind||'brick',-1,0));S.poly([[x1,y0,z],[x1,cy,z+rise],[x1,y1,z]],mat(kind||'brick',1,0));S.beam([x0,cy,z+rise],[x1,cy,z+rise],P.lead,.4);
      }else{
        S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],col(-1,0));S.poly([[x1,y0,z],[x1,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],col(1,0));
        S.poly([[x0,y0,z],[cx,y0,z+rise],[x1,y0,z]],mat(kind||'brick',0,-1));S.poly([[x0,y1,z],[x1,y1,z],[cx,y1,z+rise]],mat(kind||'brick',0,1));S.beam([cx,y0,z+rise],[cx,y1,z+rise],P.lead,.4);
      }
      for(const x of[x0,x1])S.beam([x,y0,z],[x,y1,z],P.ironD,.3);for(const y of[y0,y1])S.beam([x0,y,z],[x1,y,z],P.ironD,.3);
    }
    function glass(F,u,z,w,h,lit,wood){
      F.panel(u-.3,u+w+.3,z-.3,z+h+.35,wood?T.oak:P.stoneR,.13);
      F.panel(u,u+w,z,z+h,(a,b)=>{
        if(a<.22||a>w-.22||b<.25||b>h-.25||Math.abs(a-w/2)<.14||Math.abs(b-h/2)<.15)return wood?T.cream:P.frame;
        if(wood&&K.mod(a+b,2.1)<.16)return P.frameR;
        const c=dark(0,1)?P.glassR:P.glass;return lit?[c,P.warm]:c;
      },.19);F.block(u-.4,u+w+.4,0,.5,z-.6,z-.25,P.stone,P.stoneR,P.stoneHi);
    }
    function windows(F,floors,bays,z0,step,w,h,wood){for(let f=0;f<floors;f++)for(let b=0;b<bays;b++)glass(F,F.length*(b+.5)/bays-w/2,z0+f*step,w,h,true,wood);}
    function pointed(F,u,z,w,h,lit){
      const a=[[u,z],[u+w,z],[u+w,z+h*.63],[u+w/2,z+h],[u,z+h*.63]],b=[[u+.45,z+.5],[u+w-.45,z+.5],[u+w-.45,z+h*.60],[u+w/2,z+h-.7],[u+.45,z+h*.60]];
      S.poly(a.map(p=>F.point(p[0],.15,p[1])),P.stoneHi,.035);S.poly(b.map(p=>F.point(p[0],.22,p[1])),lit?[P.glassR,P.warm]:P.glassR,.04);F.panel(u+w/2-.12,u+w/2+.12,z+.5,z+h-.8,P.stone,.28);
    }
    function timber(x0,x1,y0,y1,z0,z1){
      const f=volume(x0,x1,y0,y1,z0,z1,'plaster');
      for(const F of Object.values(f)){
        for(let u=.3;u<F.length;u+=4.3){S.beam(F.point(u,.26,z0),F.point(u,.26,z1),T.oak,.5);for(let z=z0;z+7<z1;z+=8.4)S.beam(F.point(u,.27,z+.6),F.point(Math.min(u+4,F.length-.2),.27,z+7.7),T.oak,.29);}
        for(let z=z0;z<=z1;z+=8.4)S.beam(F.point(0,.28,z),F.point(F.length,.28,z),T.oak,.52);
      }return f;
    }
    function round(x,y,z0,z1,r0,r1,kind,lit,n){
      n=n||12;const cap=[];
      for(let i=0;i<n;i++){const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n,nn=(a+b)/2,c=lit?[dark(Math.cos(nn),Math.sin(nn))?P.glassR:P.glass,P.warm]:mat(kind||'stone',Math.cos(nn),Math.sin(nn));
        S.poly([[x+Math.cos(a)*r0,y+Math.sin(a)*r0,z0],[x+Math.cos(b)*r0,y+Math.sin(b)*r0,z0],[x+Math.cos(b)*r1,y+Math.sin(b)*r1,z1],[x+Math.cos(a)*r1,y+Math.sin(a)*r1,z1]],c);cap.push([x+Math.cos(a)*r1,y+Math.sin(a)*r1,z1]);
      }S.poly(cap,P.stoneHi);
    }
    function steps(x0,x1,y0,y1,rise,n){for(let i=0;i<n;i++){const a=y0+(y1-y0)*i/n;S.box(x0,x1,a,y1,0,rise*(i+1)/n,P.stone,P.stoneR,P.stoneHi);}}
    function lamps(){K.lantern(S,3.3,28.6,5.3,true);K.lantern(S,28.7,28.6,5.3,true);}
    function finish(){if(!root.__heritage024GeometryOnly)lamps();return S.finish({id:row.id,design:row.shape,features:row.shape,heritageName:row.nm,lightPolicy:'opaque-physical-glazing-and-display-lanterns-only',smoke:[],__heritage024:1});}
    return{...H,S,K,P,T,C,mat,volume,band,roof,glass,windows,pointed,timber,round,steps,finish};
  }

  function lavenham(row,v){const A=context(row,v),{S,P,T,volume,timber,roof,windows,glass}=A;
    volume(4,28,9,22,.45,2.1,'stone');const lower=timber(4,28,9,22,2.1,12),upper=timber(3.5,28.5,8.5,22.5,12,26.5);
    roof(3.1,28.9,8.1,22.9,27,8,'x','plaster');windows(lower.front,1,5,4,8,2.4,5.2,true);windows(upper.front,1,6,16,8,2.4,7.1,true);windows(upper.right,1,3,16,8,2,7,true);windows(upper.back,1,6,16,8,2.4,7.1,true);
    for(const F of[lower.front,upper.front])S.beam(F.point(0,.48,12),F.point(F.length,.48,12),T.oak,.7);
    for(const x of[13,18])S.box(x-.3,x+.3,22,26.1,.45,9,T.oak,T.oakR,T.oak);roof(12.4,18.6,22.1,26.4,9,3,'x','plaster');A.K.timberDoor(lower.front,10.5,2.4,3,8,true);glass(upper.left,4,17,3,6,true,true);A.band(4,28,9,22,1.7);return A.finish();}

  function moreton(row,v){const A=context(row,v),{S,P,timber,roof,windows,glass}=A;
    const back=timber(3.2,28.8,5.4,11.5,.45,30),left=timber(3.2,9.3,11.5,26,.45,22),right=timber(22.7,28.8,11.5,26,.45,24);
    roof(2.9,29.1,5.1,11.8,30.5,7,'x','plaster');roof(2.9,9.6,11.3,26.3,22.5,6,'y','plaster');roof(22.4,29.1,11.3,26.3,24.5,6.7,'y','plaster');
    windows(back.front,2,6,5,10,2.5,6.2,true);windows(back.front,1,9,23,9,1.8,5.7,true);windows(back.back,3,8,4,8.9,2,5.8,true);windows(left.left,2,4,4,9,2.3,6,true);windows(right.right,2,4,4,9,2.3,6,true);
    const bay=timber(12.5,18.7,11.5,13.8,14,23);for(const F of Object.values(bay))glass(F,.6,16,F.length-1.2,5.5,true,true);roof(12.1,19.1,11.2,14.1,23.3,3,'x','plaster');
    const porch=timber(22.7,28.8,26,28.3,.45,10);A.K.timberDoor(porch.front,1.8,.7,2.4,7.8,true);roof(22.5,29,25.8,28.5,10,3,'x','plaster');S.flat(10.5,21.5,14,25,.48,P.paveHi);A.K.bench(S,13.5,24.5,5,false);return A.finish();}

  function coxwell(row,v){const A=context(row,v),{S,P,volume,roof}=A;const f=volume(5.4,26.6,8,22.5,.45,18.5,'stone');roof(4.9,27.1,7.5,23,19,14,'x','stone');
    const porch=volume(12,20,22.5,28,.45,12.5,'stone');roof(11.6,20.4,22.2,28.4,13,8,'y','stone');A.loading(porch.front,1.6,4.8,10.8);
    for(const x of[6.8,11,16,21,25.2])S.box(x-.65,x+.65,22.4,24.2,.45,12.2,P.stone,P.stoneR,P.stoneHi);
    for(const F of[f.back,f.left,f.right])for(let u=2;u<F.length-1;u+=4)F.panel(u,u+.6,11,14,P.ink,.09);A.K.timberDoor(f.left,5,.6,4,10,false);return A.finish();}

  function rushton(row,v){const A=context(row,v),{S,P,mat,pointed}=A,poly=[[4.5,25.5],[27.5,25.5],[16,5.6]],center=[16,18.9];
    for(let i=0;i<3;i++){const a=poly[i],b=poly[(i+1)%3],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len,F=S.face(a,b,nx,ny);
      S.wall(a,b,.45,41,mat('stone',nx,ny));for(const z of[12.5,25.7,38.8])S.wall(a,b,z,z+1.5,P.stoneD,.03);
      for(let level=0;level<3;level++)for(const u of[3.3,len/2-1.7,len-6.7])pointed(F,u,3.3+level*12.8,3.4,7,true);
      S.poly([F.point(0,0,41),F.point(len,0,41),F.point(len/2,0,49)],mat('stone',nx,ny));S.poly([[a[0],a[1],41],[b[0],b[1],41],[center[0],center[1],48]],A.K.slate(A.dark(nx,ny)));
      S.beam(F.point(0,.18,41),F.point(len/2,.18,49),P.stoneHi,.55);S.beam(F.point(len,.18,41),F.point(len/2,.18,49),P.stoneHi,.55);
    }S.poly(poly.map(p=>[...p,41]),P.stoneD);return A.finish();}

  function dunmore(row,v){const A=context(row,v),{S,P,volume,round}=A;const f=volume(4,28,12,21,.45,10,'stone');A.band(3.8,28.2,11.8,21.2,10);S.flat(3.8,28.2,11.8,21.2,11,P.slateR);
    for(const F of[f.front,f.back])for(const u of[2.4,8,14,20])A.pointed(F,u,1.5,3,7,true);round(16,16,10.5,19.5,5.1,5.1,'stone',false,12);
    for(const F of Object.values(f))for(let u=1;u<F.length;u+=5)F.block(u,u+.65,0,.5,.6,9.9,P.stoneHi,P.stoneR,P.stoneHi);
    const rings=[[19.5,4.9],[23,6.5],[27,6.6],[31,5.4],[34.8,3.4],[36,1.7]];for(let i=0;i<rings.length-1;i++)round(16,16,rings[i][0],rings[i+1][0],rings[i][1],rings[i+1][1],'stone',false,16);
    for(let r=1;r<rings.length-1;r++)for(let i=0;i<16;i++){const a=i*Math.PI/8,b=(i+.5)*Math.PI/8,z=rings[r][0],rr=rings[r][1]+.07;S.beam([16+Math.cos(a)*rr,16+Math.sin(a)*rr,z-2],[16+Math.cos(b)*rr,16+Math.sin(b)*rr,z+1.3],P.stoneD,.2);}
    for(let i=0;i<10;i++){const a=i*Math.PI/5,rr=4.2;S.poly([[16,16,35],[16+Math.cos(a-.2)*rr,16+Math.sin(a-.2)*rr,37],[16+Math.cos(a)*2.6,16+Math.sin(a)*2.6,45.5],[16+Math.cos(a+.2)*rr,16+Math.sin(a+.2)*rr,37]],P.stoneHi);}
    for(const x of[4.5,27.5])S.box(x-.35,x+.35,4,11,.45,4,P.stone,P.stoneR,P.stoneHi);return A.finish();}

  function dulwich(row,v){const A=context(row,v),{S,P,volume}=A;const f=volume(3.5,28.5,13,23,.45,14,'brick');A.band(3.5,28.5,13,23,14);S.flat(3.3,28.7,12.8,23.2,15,P.slateR);
    for(let i=0;i<5;i++){const x=5+i*4.7;const q=volume(x,x+3.3,16.2,19.5,15,18,'plaster');for(const F of[q.front,q.back,q.left,q.right])A.glass(F,.35,15.7,F.length-.7,1.5,true,false);A.roof(x-.2,x+3.5,16,19.7,18,1.7,'x','plaster');}
    const tomb=volume(11.2,20.8,4.3,13,.45,21,'brick');A.band(11.2,20.8,4.3,13,20.4);A.round(16,8.7,21,23.5,3.6,2.6,'stone',false,12);A.round(16,8.7,23.5,26.8,2.6,.8,'stone',false,12);
    for(const u of[1.5,7.2,12.9,18.6])A.pointed(f.front,u,2,3.5,8,true);A.K.timberDoor(tomb.back,3,.7,3.2,8,false);for(const u of[1.4,6.5])A.pointed(tomb.left,u,6,2.2,8,true);return A.finish();}

  function flaxmill(row,v){const A=context(row,v),{S,P,volume,roof}=A;const f=volume(4,25.5,8,22.5,.45,53,'brick');roof(3.6,25.9,7.6,22.9,53.5,8.5,'x','brick');
    A.windows(f.front,5,7,3.4,9.8,1.8,5.8,false);A.windows(f.back,5,7,3.4,9.8,1.8,5.8,false);A.windows(f.left,5,4,3.4,9.8,1.8,5.8,false);A.windows(f.right,5,4,3.4,9.8,1.8,5.8,false);
    for(const z of[12,22,32,42])A.band(4,25.5,8,22.5,z);const tower=volume(25.5,29,9,14,.45,65,'timber');roof(25.1,29.4,8.6,14.4,65.4,4.5,'y','timber');A.windows(tower.front,5,1,7,10.8,1.8,4,false);A.loading(f.front,18,4.6,8);A.crates(19,26.2,3);S.box(3,8,25,28.5,.45,2,P.stone,P.stoneR,P.stoneHi);return A.finish();}

  function settle(row,v){const A=context(row,v),{S,P,T,volume}=A;const base=volume(10,24,11.5,20,.45,10,'brick'),cab=volume(9.4,24.6,10.9,20.6,10,23,'timber');
    for(const F of Object.values(cab))A.windows(F,1,F.length>10?4:3,12.4,10,2.7,7.8,false);A.hip(9,25,10.5,21,23.5,5,'x');A.steps(5.8,9,12,26,10,9);
    S.box(5.5,10,11.2,13,9.7,10.3,T.oak,T.oakR,T.oak);for(const x of[5.7,8.9]){S.beam([x,25.4,1.6],[x,12,12],T.oak,.25);for(let i=0;i<8;i++){const y=25.4-i*1.7;S.beam([x,y,1.6+i*1.3],[x,y,3.1+i*1.3],T.oak,.21);}}
    A.K.timberDoor(base.front,5,.7,3,7,true);for(const y of[28.2,29.3])S.beam([5,y,.65],[27,y,.65],P.ironD,.3);for(let x=5;x<28;x+=2)S.box(x,x+.6,27.8,29.7,.45,.7,P.wood,P.woodR,P.wood);return A.finish();}

  function beamish(row,v){const A=context(row,v),{S,P,T,volume,roof}=A;const engine=volume(3.5,14.5,6.5,18,.45,31,'stone');roof(3.1,14.9,6.1,18.4,31.5,8,'y','stone');A.windows(engine.left,2,2,5,13,2.5,7,false);A.pointed(engine.front,3,5,4,12,true);
    for(const x of[19,27.5])for(const y of[13.5,24]){S.box(x-.55,x+.55,y-.55,y+.55,.45,26,P.woodR,P.woodD,P.wood);S.beam([x,y,3],[x===19?27.5:19,y,16],T.oak,.5);}
    S.box(18.4,28.1,13,24.6,14.5,15.5,P.wood,P.woodR,P.woodHi);A.fence(18.5,24.6,28,24.6,17);roof(18.1,28.4,12.6,24.8,26.5,4,'y','timber');
    for(const x of[20.2,25.8])S.beam([x,17,27],[23,17,36],T.oak,.7);S.beam([19.9,17,31],[26.1,17,31],P.woodHi,.55);A.round(23,17,35,36.6,1.8,1.8,'timber',false,10);
    for(const y of[27.1,28.5])S.beam([15,y,.7],[27,y,.7],P.ironD,.25);for(let x=15;x<28;x+=2)S.box(x,x+.5,26.8,28.8,.45,.65,P.wood,P.woodR,P.wood);
    S.box(17,20.8,26.8,28.9,1.4,3.9,P.ironHi,P.ironD,P.ink);for(const x of[17.4,20.3])for(const y of[26.7,29])A.round(x,y,.5,1.5,.45,.45,'timber',false,6);return A.finish();}

  function bletchley(row,v){const A=context(row,v),{S,P,volume,roof}=A;const hut=volume(3.6,28.4,12.6,22.6,.45,11.5,'timber');roof(3.2,28.8,12.2,23,12,4,'x','timber','felt');
    A.windows(hut.front,1,7,4,8,1.9,4.8,false);A.windows(hut.back,1,7,4,8,1.9,4.8,false);A.K.timberDoor(hut.right,3,.7,2.4,7.8,true);
    const annex=volume(3.6,12.3,6.5,12.6,.45,11.5,'brick');roof(3.2,12.7,6.1,13,12,4,'x','brick','felt');A.windows(annex.back,1,3,4,8,1.8,4.8,false);A.loading(annex.left,1.5,3.1,7.8);
    for(const x of[4.2,27.8])A.K.rainpipe(S,x,22.9,11.7);A.fence(3.4,25.8,13,25.8,2.5);S.flat(14,26,24.6,26,.5,P.paveR);return A.finish();}

  function appleby(row,v){const A=context(row,v),{S,P,T,volume,roof}=A;const f=volume(7.8,26.2,7.5,22.8,.45,27,'plaster');roof(7.3,26.7,7,23.3,27.5,11,'x','plaster');
    for(const F of[f.front,f.back]){A.windows(F,1,4,16,12,2.8,6.5,false);for(const u of[1.8,7.7,13.2])A.K.timberDoor(F,u,.7,3,9,true);}
    A.round(17,15.2,38.5,43.5,1.7,1.7,'plaster',false,6);A.round(17,15.2,43.5,46.6,2.1,.1,'stone',false,6);for(const x of[16.1,17.9])S.beam([x,15.2,39],[x,15.2,43],T.oak,.22);
    A.steps(3.6,7.7,12,25.5,14,10);S.box(3.2,7.8,10.4,12.4,13.5,14.2,P.stone,P.stoneR,P.stoneHi);
    for(let i=0;i<10;i++){const a=Math.PI*.02+i*Math.PI/10,b=a+Math.PI/10;S.wall([8+Math.cos(a)*5,21+Math.sin(a)*5],[8+Math.cos(b)*5,21+Math.sin(b)*5],.45,3.5,P.stone);}
    for(const z of[13.9,27])for(const F of Object.values(f))S.beam(F.point(0,.22,z),F.point(F.length,.22,z),T.oak,.42);A.glass(f.right,5,16,3.3,6.4,true,false);return A.finish();}

  function kew(row,v){const A=context(row,v),{S,P,volume,roof}=A;const f=volume(4.8,28,7.5,23,.45,33.5,'brick');A.windows(f.front,3,7,3.5,10,2,6.2,false);A.windows(f.back,3,7,3.5,10,2,6.2,false);A.windows(f.left,3,4,3.5,10,2,6.2,false);A.windows(f.right,3,4,3.5,10,2,6.2,false);
    for(let i=0;i<3;i++){const x0=5+i*7.55,x1=x0+7.1;roof(x0,x1,7.2,23.2,34,10,'y','brick');const F=S.face([x0,23.4],[x1,23.4],0,1),w=x1-x0;
      const pp=[[0,34],[w,34],[w-.2,37],[w-1.1,39],[w-1.9,39.2],[w-1.8,42],[w/2+.75,43.4],[w/2,45],[w/2-.75,43.4],[1.8,42],[1.9,39.2],[1.1,39],[.2,37]];
      S.poly(pp.map(p=>F.point(p[0],.08,p[1])),A.mat('brick',0,1));for(let j=0;j<pp.length-1;j++)S.beam(F.point(pp[j][0],.14,pp[j][1]),F.point(pp[j+1][0],.14,pp[j+1][1]),P.stoneHi,.4);A.glass(F,w/2-1,36.2,2,4.8,true,false);
    }A.steps(13,19,23.3,27.5,2.2,4);A.K.timberDoor(f.front,10.2,2.4,3.4,8.4,true);for(const z of[13,23,33])A.band(4.8,28,7.5,23,z);for(const x of[7,25.6])A.chimney(x,10.1,40,2);return A.finish();}

  function orford(row,v){const A=context(row,v),{S,P,mat}=A,cx=16,cy=15.7,r=8.2,n=18;
    const outer=[];for(let i=0;i<n;i++){const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n,p=[cx+Math.cos(a)*r,cy+Math.sin(a)*r],q=[cx+Math.cos(b)*r,cy+Math.sin(b)*r],nx=Math.cos((a+b)/2),ny=Math.sin((a+b)/2),F=S.face(p,q,nx,ny);S.wall(p,q,.45,45,mat('stone',nx,ny));outer.push([...p,44.8]);if(i%3===0)for(const z of[12,27])A.pointed(F,.8,z,1.3,5,true);S.wall(p,q,45,47,P.stoneR);S.box(p[0]-.55,p[0]+.55,p[1]-.55,p[1]+.55,47,49,P.stone,P.stoneR,P.stoneHi);}
    S.poly(outer,P.slateD);for(const a of[Math.PI,Math.PI*1.5,Math.PI*.22]){const x=cx+Math.cos(a)*9,y=cy+Math.sin(a)*9,f=A.volume(x-2.5,x+2.5,y-2.5,y+2.5,.45,52,'stone');for(const F of Object.values(f))A.pointed(F,1.6,32,1.8,5,true);A.band(x-2.6,x+2.6,y-2.6,y+2.6,52);S.flat(x-2.3,x+2.3,y-2.3,y+2.3,52.6,P.slateD);for(const xx of[x-2.5,x+2.5])for(const yy of[y-2.5,y+2.5])S.box(xx-.5,xx+.5,yy-.5,yy+.5,52.6,55,P.stone,P.stoneR,P.stoneHi);}
    const fore=A.volume(8.8,13.5,23,26,.45,10,'stone');A.steps(8.8,13.5,26,29.5,10,9);A.K.timberDoor(fore.front,1,9,2.7,6,false);return A.finish();}

  function delawarr(row,v){const A=context(row,v),{S,P,T,volume}=A;const f=volume(3.8,25.5,7.5,19,.45,25,'plaster');for(const F of[f.front,f.back,f.left])A.windows(F,2,F.length>15?6:3,3.5,12,3,7.6,false);
    for(const z of[12,25])S.box(3.1,26.2,7.2,22,z,z+.65,T.creamHi,T.creamR,T.creamHi);for(const x of[5,10,15,20])S.box(x-.25,x+.25,21.4,21.9,.45,12,T.cream,T.creamR,T.creamHi);
    A.round(25.3,20,1,28,4.7,4.7,'plaster',true,16);for(let i=0;i<16;i++){const a=i*Math.PI/8,x=25.3+Math.cos(a)*4.77,y=20+Math.sin(a)*4.77;S.beam([x,y,1],[x,y,28],P.frame,.3);}for(const z of[1,12,24,28])A.round(25.3,20,z,z+.6,5,5,'plaster',false,16);
    for(const z of[14,27]){S.beam([3.3,22,z],[24,22,z],P.ironD,.16);for(let x=3.5;x<24;x+=2)S.beam([x,22,z-1.4],[x,22,z],P.ironD,.12);}
    for(let i=0;i<9;i++){const a=i*Math.PI/6;S.box(24+Math.cos(a)*2-.55,24+Math.cos(a)*2+.55,20+Math.sin(a)*2-.55,20+Math.sin(a)*2+.55,2+i*1.5,2.6+i*1.5,T.cream,T.creamR,T.creamHi);}A.steps(6,17,22.2,26,1.4,3);return A.finish();}

  function rievaulx(row,v){const A=context(row,v),{S,P,mat}=A;
    function arcade(a,b,nx,ny,count,z,height){const F=S.face(a,b,nx,ny),unit=F.length/count;
      for(let i=0;i<=count;i++)F.block(i*unit-.7,i*unit+.7,0,.85,.45,z+height*.63,mat('stone',nx,ny),P.stoneR,P.stoneHi);
      for(let i=0;i<count;i++){const u=i*unit+.8,w=unit-1.6,profile=[[0,height*.62],[w*.18,height*.82],[w/2,height],[w*.82,height*.82],[w,height*.62]];
        for(let j=0;j<profile.length-1;j++){const p=profile[j],q=profile[j+1];S.poly([F.point(u+p[0],.1,z+p[1]),F.point(u+q[0],.1,z+q[1]),F.point(u+q[0],.1,z+q[1]+1),F.point(u+p[0],.1,z+p[1]+1)],P.stoneHi);S.poly([F.point(u+p[0],-.5,z+p[1]),F.point(u+q[0],-.5,z+q[1]),F.point(u+q[0],.1,z+q[1]),F.point(u+p[0],.1,z+p[1])],P.stoneR);}
      }return F;
    }
    arcade([8,27],[8,5],-1,0,4,10,13);arcade([24,5],[24,22],1,0,3,10,13);arcade([8,5],[24,5],0,-1,3,19,19);
    for(const x of[8,24])for(const y of[6.5,13.5,20.5])S.box(x-.8,x+.8,y-.6,y+.6,.45,30+(y<10?7:0),P.stone,P.stoneR,P.stoneHi);
    for(const [x0,x1,y0,y1,h]of[[5.5,7.8,5,11,14],[24.2,26.5,5,14,20],[9,22,4.2,5,8],[6,13,26,27,2],[18,26,24,25.3,3]])A.volume(x0,x1,y0,y1,.45,h,'stone');
    S.flat(11.5,20.5,10,25,.46,P.paveR);S.flat(9,23,10,11.6,.48,P.stoneD);for(const x of[11.5,20.5])S.box(x-.3,x+.3,12,25,.45,.9,P.stone,P.stoneR,P.stoneHi);return A.finish();}

  const AUTHORS=Object.freeze([lavenham,moreton,coxwell,rushton,dunmore,dulwich,flaxmill,settle,beamish,bletchley,appleby,kew,orford,delawarr,rievaulx]);
  function buildAll(){return ROWS.flatMap((row,i)=>[0,1,2,3].map(view=>({row,view,sprite:AUTHORS[i](row,view)})));}
  root.BritishHeritageArchitecture024=Object.freeze({rows:ROWS,buildAll,build:(id,view)=>{const i=ROWS.findIndex(r=>r.id===id);if(i<0)throw Error('Unknown heritage form');if(!Number.isInteger(view)||view<0||view>3)throw Error('Four views required');return AUTHORS[i](ROWS[i],view);}});
})(typeof window==='undefined'?globalThis:window);
