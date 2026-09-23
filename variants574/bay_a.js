// T610 bay_a：嵐坡灣（濕地灣城・英國鄉間）實驗線重畫
//   k23 牧場 v0–v4（2×2，136×150，錨 68,148）：v0 牛／v1 羊／v2 馬／v3 豬／v4 家禽，五款畜舍形制與分欄方式各不同。
//   k130 抽水站 v0、v1、v2（1×1，144×224，錨 72,220，sc 與原 130_1_0 相同＝undefined ⇒ 1:1）。
//     退件後接手重畫 v0（原 T605 米白＋棕扁平方盒、128px 底板，與 v1/v2 不同語言也大一圈）：沼地排水引擎房＋閥室＋排水渠，
//     保留 __t605:'pump' 標記給 bayFlavorSelftest605；三款同一套紅褐磚／米白石帶／拱窗／石板山牆、牆高 20–22 同尺度。
// 座標一律用「1/16 格」整數步：P(a,b,h)=[AX+2(a-b), TOPY+(a+b)-h]，所以所有頂點都落在整數像素上。
// 光從左：+b 面（左前）亮、+a 面（右前）暗；落影向右、只落在建物腳下。零亂數：只用 K.hsh 決定性雜湊。
// 繪製端會把 T596 佔地剪裁套在精靈上 ⇒ 所有東西都畫在自己的佔地柱內（菱形下緣以上）。
// 接手修整（第二位設計師）：成品最後一律過 lotMask（清掉菱形下緣外的溢出像素，量測 0 顆）；
//   牧場 v1 補石水槽／乾草架／方捆垛、v2 補兩道牧場大門／方捆垛／放牧場水槽、v3 豬舍棚重畫成看得出浪板的半圓棚並散開、
//   柵欄改木色、泥地雜點改成成片草斑、補場院大門；v4 雞場加沙浴窩與刨土面、棲木架、移動雞舍移到塘邊不再黏著主雞舍、補大門。
//   抽水站 v1 加屋脊百葉通風亭；v2 第二次退件後重排：兩泵房退到地塊後半（H20，與 v1 同高），進水池放大成前三分之一，
//   閘牆移到池心（2px 矮牆、兩側都看得到水）、絞盤縮成細綠柱＋暗紅小手輪、攔污柵改成水中一排等距細鋼條，
//   煙囪移到右後角站在自己的石座上（不再從屋頂谷裡長出來）。
(window.__variants574=window.__variants574||[]).push(function bay_a(A){
  // 注入測試時本批次排在內嵌 b01–civic_d3 之前（b10 會蓋掉 130_1_1/2）⇒ 不是最後一棒就把本體排到隊尾再跑；
  // 正式整合時本檔接在最後，直接執行。runVariants574 以 for…of 走陣列，隊尾新增的會被執行到。
  const QL=window.__variants574||[];
  if(!bay_a.__late&&QL.indexOf(bay_a)>=0&&QL.indexOf(bay_a)<QL.length-1){bay_a.__late=1;QL.push(function bay_a_late(A2){bay_a(A2);});return;}
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const REP=window.__bayA610={err:[],farm:{},pump:{}};

  // ======================= 共用工具 =======================
  const LIB=(W,H,AX,AY,SZ)=>{
    const K=A.iso575(W,H,AX,AY,SZ),NS=16*SZ,TOPY=AY-2*NS;
    const hsh=(a,b,c)=>K.hsh(a,b,c);
    const P=(a,b,h=0)=>[AX+(a-b)*2,TOPY+(a+b)-h];
    const V=(p,q)=>[q[0]-p[0],q[1]-p[1]];
    const RC=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    // 像素中心掃描線多邊形；c 可為顏色或 (x,y)=>顏色|null
    const fp=(g,pts,c)=>{let ya=1e9,yb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];}
      const y0=Math.max(0,Math.floor(ya)),y1=Math.min(H-1,Math.ceil(yb)),n=pts.length,fn=typeof c==='function';if(!fn)g.fillStyle=c;
      for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
        for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n];if((p[1]<=yc&&q[1]>yc)||(q[1]<=yc&&p[1]>yc))xs.push(p[0]+(yc-p[1])*(q[0]-p[0])/(q[1]-p[1]));}
        if(xs.length<2)continue;xs.sort((p,q)=>p-q);
        for(let k=0;k+1<xs.length;k+=2){const xa=Math.max(0,Math.ceil(xs[k]-.5)),xb=Math.min(W-1,Math.ceil(xs[k+1]-.5)-1);if(xb<xa)continue;
          if(!fn)g.fillRect(xa,y,xb-xa+1,1);
          else for(let x=xa;x<=xb;x++){const col=c(x,y);if(col){g.fillStyle=col;g.fillRect(x,y,1,1);}}}}};
    const BL=(g,p,q,c)=>{let x0=rnd(p[0]),y0=rnd(p[1]);const x1=rnd(q[0]),y1=rnd(q[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<3000;k++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    // 斜面列座標：過 O、斜率 sl 的基線；s＝離 O 的水平像素、r＝基線以上第幾列
    const rowFn=(O,sl,f)=>(x,y)=>{const s=x+.5-O[0];return f(Math.floor(s),Math.floor(O[1]+s*sl-(y+.5)),x,y);};
    const Q=(a0,b0,a1,b1,z=0)=>[P(a0,b0,z),P(a1,b0,z),P(a1,b1,z),P(a0,b1,z)];
    const flat=(g,a0,b0,a1,b1,c,z=0)=>fp(g,Q(a0,b0,a1,b1,z),c);
    // 立面：faceB＝+b 面（受光）；faceA＝+a 面（背光）
    const faceB=(g,a0,a1,b,z0,z1,f)=>fp(g,[P(a0,b,z0),P(a1,b,z0),P(a1,b,z1),P(a0,b,z1)],typeof f==='function'?rowFn(P(a0,b,z0),.5,f):f);
    const faceA=(g,a,b0,b1,z0,z1,f)=>fp(g,[P(a,b1,z0),P(a,b0,z0),P(a,b0,z1),P(a,b1,z1)],typeof f==='function'?rowFn(P(a,b1,z0),-.5,f):f);
    const topF=(g,a0,b0,a1,b1,z,f)=>fp(g,Q(a0,b0,a1,b1,z),f);
    const box=(g,a0,b0,a1,b1,z,h,T,L,R)=>{faceB(g,a0,a1,b1,z,z+h,L);faceA(g,a1,b0,b1,z,z+h,R);topF(g,a0,b0,a1,b1,z+h,T);};
    // 立面上的「直條形」：左下角 O、面斜率 sl、寬 w 欄、高 h 列；fn(i,j,x,y) j 由上往下
    const cols=(g,O,sl,w,h,fn)=>{const X0=Math.ceil(O[0]-.5);
      for(let i=0;i<w;i++){const x=X0+i,yb=O[1]+(x+.5-O[0])*sl,bot=Math.ceil(yb-.5)-1;
        for(let j=0;j<h;j++){const y=bot-(h-1)+j,c=fn(i,j,x,y);if(c){g.fillStyle=c;g.fillRect(x,y,1,1);}}}};
    const fpt=(face,a,b,z,dx=0)=>{const O=P(a,b,z),sl=face==='b'?.5:-.5;return [[O[0]+dx,O[1]+dx*sl],sl];};
    const archOff=(i,w)=>{if(w<3)return 0;if(w===3)return i===1?0:1;const r=w/2,d=i+.5-r;return Math.max(0,Math.round(r-Math.sqrt(Math.max(0,r*r-d*d))-.25));};
    // 窗：拱券／石框 → 玻璃 → 石窗台；夜圖只亮玻璃
    const win=(g,ng,face,a,b,z,w,h,o={})=>{
      const [O,sl]=fpt(face,a,b,z),gl=o.glass||'#34475a',hi=o.hi||'#7f9db4',ar=!!o.arch;
      if(o.head)cols(g,[O[0]-1,O[1]-sl],sl,w+2,h+1,(i,j)=>{const off=ar?archOff(i,w+2):0;return j>=off?o.head:null;});
      cols(g,O,sl,w,h,(i,j)=>{const off=ar?archOff(i,w):0;if(j<off)return null;
        if(o.bar&&w>=3&&i===(w>>1))return o.barC||'#e8e2d2';if(o.rail&&j===(h>>1))return o.barC||'#e8e2d2';
        return (i===0&&j===off)||(i===1&&j===off&&w>3)?hi:gl;});
      if(o.sill!==false)cols(g,[O[0]-1,O[1]-sl+1],sl,w+2,1,()=>o.sillC||'#ddd6c6');
      if(o.lit&&ng)cols(ng,O,sl,w,h,(i,j)=>{const off=ar?archOff(i,w):0;if(j<off)return null;if(o.bar&&w>=3&&i===(w>>1))return null;return o.litC||'#ffd68a';});
    };
    // 門洞：回傳可給繪製端 door403 的內接矩形 [x,y,w,h]
    const door=(g,face,a,b,z,w,h,o={})=>{const [O,sl]=fpt(face,a,b,z),col=o.col||'#261b13';const tb={};
      if(o.head)cols(g,[O[0]-1,O[1]-sl],sl,w+2,h+1,(i,j)=>{const off=o.arch?archOff(i,w+2):0;return j>=off?o.head:null;});
      cols(g,O,sl,w,h,(i,j,x,y)=>{const off=o.arch?archOff(i,w):0;if(j<off)return null;const q=tb[x]||(tb[x]=[1e9,-1e9]);q[0]=Math.min(q[0],y);q[1]=Math.max(q[1],y);
        if(o.leaf&&i===w-1)return o.leaf;return (j===off||j===off+1)&&o.inner?o.inner:col;});
      const xs=Object.keys(tb).map(Number).sort((p,q)=>p-q);let y0=-1e9,y1=1e9;for(const x of xs){y0=Math.max(y0,tb[x][0]);y1=Math.min(y1,tb[x][1]);}
      if(o.step)cols(g,[O[0]-1,O[1]-sl+1],sl,w+2,1,()=>o.step);
      return [xs[0],y0,xs.length,y1-y0+1];};
    // 材質
    const TX={
      brick:(L,seed=11)=>{const M=SH(L,-17),D=SH(L,-8),Lt=SH(L,9);return (s,r,x,y)=>{if(r%3===2)return M;const c=Math.floor(r/3);if(((s+(c&1)*2)&3)===0&&hsh(x,c,seed)<.55)return D;const q=hsh(x,y,seed);return q<.09?D:q>.93?Lt:L;};},
      stone:(L,seed=12)=>{const M=SH(L,-24),D=SH(L,-11),Lt=SH(L,10);return (s,r,x,y)=>{const c=r>>1,o=(c*5)%7,cell=Math.floor((s+o)/4),q=hsh(cell,c,seed);
        if((r&1)&&q<.5)return M;if(((s+o)&3)===0&&hsh(cell,c,seed+1)<.65)return M;return q<.3?D:q>.8?Lt:L;};},
      slate:(L,seed=13)=>{const M=SH(L,-12),Lt=SH(L,8),D=SH(L,-5);return (s,r,x,y)=>{if(r%2===1)return M;const q=hsh(Math.floor((s+(r&2))/3),r,seed);return q<.16?D:q>.88?Lt:L;};},
      board:(L)=>{const M=SH(L,-13);return (s,r)=>r%2===1?M:L;},
      tin:(L)=>{const M=SH(L,-14),Lt=SH(L,10);return (s)=>s%3===0?M:s%3===1?Lt:L;},
      flat:(L)=>()=>L,
    };
    const ROOF={slate:{L:'#6c7884',D:'#515b66',ridge:'#3e4750',verge:'#8d98a3'},
      slateW:{L:'#737e89',D:'#56606b',ridge:'#434b54',verge:'#96a1ab'}};
    // 雙坡屋頂房：ridge 'a'（屋脊沿 a，+a 端山牆背光）／'b'（屋脊沿 b，+b 端山牆受光）
    const house=(g,o)=>{const {a0,b0,a1,b1,H,R}=o,ov=o.ov==null?.5:o.ov,rf=o.roof||ROOF.slate,tl=o.texL,tr=o.texR;
      faceB(g,a0,a1,b1,0,H,tl);faceA(g,a1,b0,b1,0,H,tr);
      if(o.plinth){faceB(g,a0,a1,b1,0,o.plinth[0],o.plinth[1]);faceA(g,a1,b0,b1,0,o.plinth[0],o.plinth[2]);}
      if(o.ridge==='a'){const bm=(b0+b1)/2;
        fp(g,[P(a0-ov,b0-ov,H),P(a1+ov,b0-ov,H),P(a1+ov,bm,H+R),P(a0-ov,bm,H+R)],rf.D);
        fp(g,[P(a1,b1,H),P(a1,b0,H),P(a1,bm,H+R)],rowFn(P(a1,b1,0),-.5,tr));
        const O=P(a0-ov,b1+ov,H);fp(g,[O,P(a1+ov,b1+ov,H),P(a1+ov,bm,H+R),P(a0-ov,bm,H+R)],rowFn(O,.5,TX.slate(rf.L)));
        BL(g,P(a1+ov,b1+ov,H),P(a1+ov,bm,H+R),rf.verge);BL(g,P(a1+ov,bm,H+R),P(a1+ov,b0-ov,H),SH(rf.D,-8));
        BL(g,P(a0-ov,bm,H+R),P(a1+ov,bm,H+R),rf.ridge);
        BL(g,P(a0-ov,b1+ov,H),P(a1+ov,b1+ov,H),SH(rf.L,-22));
        return {top:P(a0,bm,H+R),ridgeY:H+R,bm};}
      else{const am=(a0+a1)/2;
        fp(g,[P(a0-ov,b0-ov,H),P(a0-ov,b1+ov,H),P(am,b1+ov,H+R),P(am,b0-ov,H+R)],rf.L);
        fp(g,[P(a0,b1,H),P(a1,b1,H),P(am,b1,H+R)],rowFn(P(a0,b1,0),.5,tl));
        const O=P(a1+ov,b1+ov,H);fp(g,[O,P(a1+ov,b0-ov,H),P(am,b0-ov,H+R),P(am,b1+ov,H+R)],rowFn(O,-.5,TX.slate(rf.D)));
        BL(g,P(a0-ov,b1+ov,H),P(am,b1+ov,H+R),rf.verge);BL(g,P(am,b1+ov,H+R),P(a1+ov,b1+ov,H),SH(rf.D,10));
        BL(g,P(am,b0-ov,H+R),P(am,b1+ov,H+R),rf.ridge);
        BL(g,P(a1+ov,b1+ov,H),P(a1+ov,b0-ov,H),SH(rf.D,-16));
        return {top:P(am,b0,H+R),ridgeY:H+R,am};}
    };
    // 單坡（披屋）：高側在 hiSide（'b0' 背面高 ⇒ 屋面朝 +b 受光）
    const leanTo=(g,o)=>{const {a0,b0,a1,b1,H,R}=o,ov=o.ov==null?.5:o.ov,rf=o.roof||ROOF.slate;
      faceB(g,a0,a1,b1,0,H,o.texL);
      fp(g,[P(a1,b1,0),P(a1,b0,0),P(a1,b0,H+R),P(a1,b1,H)],rowFn(P(a1,b1,0),-.5,o.texR));
      const O=P(a0-ov,b1+ov,H);fp(g,[O,P(a1+ov,b1+ov,H),P(a1+ov,b0,H+R),P(a0-ov,b0,H+R)],rowFn(O,.5,o.tin?TX.tin(o.tin):TX.slate(rf.L)));
      BL(g,P(a1+ov,b1+ov,H),P(a1+ov,b0,H+R),o.tin?SH(o.tin,20):rf.verge);BL(g,P(a0-ov,b1+ov,H),P(a1+ov,b1+ov,H),SH(o.tin||rf.L,-24));};
    // 地面：逐像素 fn(a,b,x,y)（a,b 為步座標連續值）
    const ground=(g,fn)=>{for(let y=TOPY;y<AY;y++)for(let x=AX-2*NS;x<AX+2*NS;x++){const X=x+.5-AX,Y=y+.5-TOPY,a=(X/2+Y)/2,b=(Y-X/2)/2;
      if(a<0||b<0||a>=NS||b>=NS)continue;const c=fn(a,b,x,y);if(c){g.fillStyle=c;g.fillRect(x,y,1,1);}}};
    const seg2=(px,py,p,q)=>{const vx=q[0]-p[0],vy=q[1]-p[1],L2=vx*vx+vy*vy;let t=L2?((px-p[0])*vx+(py-p[1])*vy)/L2:0;t=Math.max(0,Math.min(1,t));const dx=px-(p[0]+t*vx),dy=(py-(p[1]+t*vy))*1.4;return Math.sqrt(dx*dx+dy*dy);};
    const pathD=(x,y,pl)=>{let d=1e9;for(let i=0;i+1<pl.length;i++){const p=P(pl[i][0],pl[i][1]),q=P(pl[i+1][0],pl[i+1][1]);d=Math.min(d,seg2(x+.5,y+.5,p,q));}return d;};
    // 落影：足跡往右（+a、-b）推 k 步；只蓋在地面上
    const shadows=(g,list,al=.26)=>{const[sc,sx]=A.cv(W,H),C='#141a12';
      for(const s of list){const[a0,b0,a1,b1,k]=s,kb=k*.5;
        const F=Q(a0,b0,a1,b1),T=[P(a0+k,b0-kb),P(a1+k,b0-kb),P(a1+k,b1-kb),P(a0+k,b1-kb)];
        fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
      g.save();g.globalAlpha=al;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 場景：o＝實體（二值化＋外框）、t＝細件（不描外框）；依深度 d 由後往前
    const scene=(g,ng)=>{const items=[];
      const run=()=>{items.sort((p,q)=>p.d-q.d||p.i-q.i);const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
        for(const it of items){
          if(it.ol){sx.clearRect(0,0,W,H);lx.clearRect(0,0,W,H);it.fn(sx,lx);K.hard(sc);A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
            ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
          else it.fn(g,ng);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 等距橢圓
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 佔地遮罩：清掉像素中心落在菱形兩條下緣之外、或超出東西頂點欄寬的像素（牆腳陰影線、外框溢出 1px 之類）；
    // 後緣以上（a、b 為負的天空區）不動 ⇒ 立在後方的屋頂、樹冠照常保留
    const lotMask=(cv)=>{const g=cv.getContext('2d'),im=g.getImageData(0,0,W,H),d=im.data;let n=0;
      for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(!d[i+3])continue;const X=x+.5-AX,Y=y+.5-TOPY,a=(X/2+Y)/2,b=(Y-X/2)/2;
        if(a>=NS||b>=NS||Math.abs(X)>2*NS){d[i+3]=0;n++;}}
      if(n)g.putImageData(im,0,0);return n;};
    return {K,W,H,AX,AY,NS,TOPY,hsh,P,V,RC,fp,BL,rowFn,Q,flat,faceB,faceA,topF,box,cols,fpt,archOff,win,door,TX,ROOF,house,leanTo,ground,pathD,shadows,scene,ell,lotMask};
  };

  // ======================= 牧場 k23 =======================
  const buildFarms=()=>{
    const W=136,H=150,AX=68,AY=148;
    const FC={
      g0:['#7aa651','#729e4b','#82ae58','#688f43'],   // 一般牧草
      g1:['#6a9843','#63903e','#72a049','#5a8639'],   // 茂草
      g2:['#8cab5a','#84a354','#94b362','#7b9a4d'],   // 啃短的草
      hay:['#b2ad60','#a9a458','#bab669','#9e9a50'],  // 割過的乾草地
      yard:['#9b8a62','#92815a','#a4936b','#857553'], // 踩實的場院
      mud:['#7c6446','#735b3f','#856c4d','#655037'],
      sand:['#d2bd8e','#cab586','#d9c597','#bea97a'],
      cob:['#918d82','#88847a','#9c988d','#7a766d'],
      straw:['#c9ae62','#bfa458','#d2b86d','#b0964e'],
      path:'#a88f63',pathD:'#937b53',
    };
    const WALL={T:'#c6c2b4',L:'#a9a598',R:'#827f75'};
    const ANI={ // 朝左的小像素群；'.' 透明
      cow:{m:["...WKKW.","KK.WWKKWT","KWKWWWWKT",".P.KWWWW.","...L..L.."],c:{W:'#f1eee6',K:'#26262b',P:'#d9a5a0',L:'#3a3530',T:'#26262b'}},
      cowB:{m:["...RRRR.","WR.RRRRRT","WWRRRRRRT",".P.RRRRR.","...L..L.."],c:{W:'#efe9dc',R:'#8c4a2c',P:'#d9a5a0',L:'#3d2a1e',T:'#5a3020'}},
      sheep:{m:[".WWW.","KWWWW","KWWWW",".L.L."],c:{W:'#ece6d4',K:'#2d2926',L:'#4a4038'}},
      sheepW:{m:[".WWW.","FWWWW",".WWWW",".L.L."],c:{W:'#e4dcc6',F:'#cfc5ae',L:'#5a4e44'}},
      horse:{m:["HH......","HHM.....",".MBBBBB.","..BBBBBT","..L...LT","..L...L."],c:{H:'#7a4526',M:'#2b211c',B:'#8a4f2b',L:'#2f2520',T:'#2b211c'}},
      horseG:{m:["HH......","HHM.....",".MBBBBB.","..BBBBBT","..L...LT","..L...L."],c:{H:'#c9c5bb',M:'#8e8a82',B:'#d6d2c8',L:'#5d5a55',T:'#8e8a82'}},
      horseK:{m:["HH......","HHM.....",".MBBBBB.","..BBBBBT","..L...LT","..L...L."],c:{H:'#3a2d26',M:'#1c1714',B:'#43342b',L:'#1c1714',T:'#1c1714'}},
      horseC:{m:["HH......","HHM.....",".MBBBBB.","..BBBBBT","..L...LT","..L...L."],c:{H:'#b0602c',M:'#e2cf9e',B:'#b8672f',L:'#6b3a1c',T:'#e2cf9e'}},
      pig:{m:[".PPPP.","SPPPPt",".D..D."],c:{P:'#eeb3aa',S:'#d98e87',D:'#b9746d',t:'#d98e87'}},
      pigS:{m:[".PKPP.","SPPKPt",".D..D."],c:{P:'#eeb3aa',S:'#d98e87',D:'#b9746d',t:'#d98e87',K:'#2e2a2a'}},
      hen:{m:["R..","WW.","WWW",".Y."],c:{R:'#d8433a',W:'#f3efe3',Y:'#d9a53a'}},
      henB:{m:["R..","BB.","BBB",".Y."],c:{R:'#d8433a',B:'#a8653a',Y:'#d9a53a'}},
      duck:{m:["WO.",".WW"],c:{W:'#f4f1e8',O:'#e39a3a'}},
    };

    const makeFarm=(v,lay)=>{
      const L=LIB(W,H,AX,AY,2),{P,fp,BL,RC,hsh,ground,pathD,scene,house,leanTo,box,faceA,faceB,topF,flat,win,door,TX,ROOF,shadows,ell,cols,fpt,rowFn}=L;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);
      const S=scene(g,ng),sh=[];
      // ---- 小件 ----
      const animal=(kind,a,b,flip,seed=0)=>{const M=ANI[kind],p=P(a,b),w=M.m[0].length,h=M.m.length;
        S.t(a+b+.3,(g2)=>{const x0=rnd(p[0]-w/2),y0=rnd(p[1])-h+1;
          g2.fillStyle='rgba(20,26,16,.32)';g2.fillRect(x0+1,y0+h,w-1,1);g2.fillRect(x0+2,y0+h-1,w-2,1);
          for(let j=0;j<h;j++)for(let i=0;i<w;i++){const ch=M.m[j][flip?w-1-i:i];if(ch==='.')continue;const col=M.c[ch];if(!col)continue;
            g2.fillStyle=(j===0&&ch!=='R')?SH(col,14):col;g2.fillRect(x0+i,y0+j,1,1);}});};
      const flock=(kinds,list)=>list.forEach((q,i)=>animal(kinds[(q[3]!=null?q[3]:i)%kinds.length],q[0],q[1],!!q[2],i));
      // 乾砌石牆：沿 a（b 固定）或沿 b（a 固定），逐 2 步切段排序；gaps=[[s0,s1],...] 開口
      const stoneTex=TX.stone(WALL.L,21),stoneTexR=TX.stone(WALL.R,22);
      const topTex=(x,y)=>{const q=hsh(x>>1,y,23);return q<.25?'#b3afa1':q>.85?'#d6d2c4':WALL.T;};
      const inGap=(s,gaps)=>gaps&&gaps.some(q=>s>=q[0]&&s<q[1]);
      const wallA=(b,a0,a1,o={})=>{const h=o.h||4,t=.5;
        for(let a=a0;a<a1;a+=2){const s0=a,s1=Math.min(a1,a+2);if(inGap(s0+.01,o.gaps))continue;
          const endR=s1>=a1||inGap(s1+.01,o.gaps);
          S.t(s1+b+t,(g2)=>{faceB(g2,s0,s1,b+t,0,h,stoneTex);if(endR)faceA(g2,s1,b-t,b+t,0,h,stoneTexR);topF(g2,s0,b-t,s1,b+t,h,topTex);
            const p=P(s0,b+t),q=P(s1,b+t);BL(g2,[p[0],p[1]],[q[0]-1,q[1]-.5],'rgba(30,36,24,.35)');});}};
      const wallB=(a,b0,b1,o={})=>{const h=o.h||4,t=.5;
        for(let b=b0;b<b1;b+=2){const s0=b,s1=Math.min(b1,b+2);if(inGap(s0+.01,o.gaps))continue;
          const endL=s1>=b1||inGap(s1+.01,o.gaps);
          S.t(a+t+s1,(g2)=>{faceA(g2,a+t,s0,s1,0,h,stoneTexR);if(endL)faceB(g2,a-t,a+t,s1,0,h,stoneTex);topF(g2,a-t,s0,a+t,s1,h,topTex);
            const p=P(a+t,s1),q=P(a+t,s0);BL(g2,[p[0]+1,p[1]],[q[0]+1,q[1]],'rgba(30,36,24,.35)');});}};
      // 木柵（柱＋兩道橫木）
      const fenceA=(b,a0,a1,o={})=>{const cl=o.c||'#8a6d49',cp=o.p||'#5f4a33',h=o.h||5,st=o.step||2;
        for(let a=a0;a<a1;a+=st){const s0=a,s1=Math.min(a1,a+st);if(inGap(s0+.01,o.gaps))continue;
          S.t(s1+b+.1,(g2)=>{for(const z of [h-1,h-3]){const p=P(s0,b,z),q=P(s1,b,z);BL(g2,p,[q[0]-1,q[1]-.5],cl);}
            const p=P(s0,b);RC(g2,p[0],p[1]-h,1,h,cp);if(s1>=a1||inGap(s1+.01,o.gaps)){const q=P(s1,b);RC(g2,q[0]-1,q[1]-h,1,h,cp);}});}};
      const fenceB=(a,b0,b1,o={})=>{const cl=o.c||'#7a5f3f',cp=o.p||'#5f4a33',h=o.h||5,st=o.step||2;
        for(let b=b0;b<b1;b+=st){const s0=b,s1=Math.min(b1,b+st);if(inGap(s0+.01,o.gaps))continue;
          S.t(a+s1+.1,(g2)=>{for(const z of [h-1,h-3]){const p=P(a,s1,z),q=P(a,s0,z);BL(g2,p,[q[0]-1,q[1]+.5],cl);}
            const p=P(a,s1);RC(g2,p[0],p[1]-h,1,h,cp);if(s0<=b0||inGap(s0-.01,o.gaps)){const q=P(a,s0);RC(g2,q[0]-1,q[1]-h,1,h,cp);}});}};
      // 五橫木農場大門（沿 a 或沿 b）
      const gateA=(b,a0,a1)=>S.t(a1+b+.2,(g2)=>{for(let z=1;z<=5;z+=1){if(z===2)continue;const p=P(a0,b,z),q=P(a1,b,z);BL(g2,p,[q[0]-1,q[1]-.5],'#c9b58c');}
        BL(g2,P(a0,b,1),P(a1,b,5),'#c9b58c');const p=P(a0,b),q=P(a1,b);RC(g2,p[0]-1,p[1]-7,2,7,'#6b5238');RC(g2,q[0]-1,q[1]-7,2,7,'#6b5238');});
      const gateB=(a,b0,b1)=>S.t(a+b1+.2,(g2)=>{for(let z=1;z<=5;z+=1){if(z===2)continue;const p=P(a,b1,z),q=P(a,b0,z);BL(g2,p,[q[0]-1,q[1]+.5],'#c9b58c');}
        BL(g2,P(a,b1,1),P(a,b0,5),'#c9b58c');const p=P(a,b1),q=P(a,b0);RC(g2,p[0]-1,p[1]-7,2,7,'#6b5238');RC(g2,q[0]-1,q[1]-7,2,7,'#6b5238');});
      // 樹籬（沿後緣，一整條描外框）
      const hedgeA=(b0,b1,a0,a1,h=5,seed=1)=>S.o(-1+b0*.01,(g2)=>{const Lc='#5d8c3c',Tc='#6f9e48',Rc='#48702f';
        faceB(g2,a0,a1,b1,0,h,(s,r,x,y)=>{const q=hsh(x,y,seed);return q<.2?SH(Lc,-12):q>.85?SH(Lc,12):Lc;});faceA(g2,a1,b0,b1,0,h,Rc);
        topF(g2,a0,b0,a1,b1,h,(x,y)=>{const q=hsh(x,y,seed+3);return q<.25?SH(Tc,-10):q>.8?SH(Tc,14):Tc;});
        const pa=P(a0,b1,h),pb=P(a1,b1,h);for(let x=rnd(pa[0]);x<rnd(pb[0]);x++){const q=hsh(x,seed,5);if(q<.45)continue;const yb=pa[1]+(x-pa[0])*.5;RC(g2,x,yb-1-(q>.8?1:0),1,1+(q>.8?1:0),Tc);}});
      const hedgeB=(a0,a1,b0,b1,h=5,seed=2)=>S.o(-1+a0*.01,(g2)=>{const Lc='#5d8c3c',Tc='#6f9e48',Rc='#48702f';
        faceA(g2,a1,b0,b1,0,h,(s,r,x,y)=>{const q=hsh(x,y,seed);return q<.2?SH(Rc,-10):q>.85?SH(Rc,12):Rc;});faceB(g2,a0,a1,b1,0,h,Lc);
        topF(g2,a0,b0,a1,b1,h,(x,y)=>{const q=hsh(x,y,seed+3);return q<.25?SH(Tc,-10):q>.8?SH(Tc,14):Tc;});
        const pa=P(a1,b1,h),pb=P(a1,b0,h);for(let x=rnd(pa[0]);x<rnd(pb[0]);x++){const q=hsh(x,seed,5);if(q<.45)continue;const yb=pa[1]-(x-pa[0])*.5;RC(g2,x,yb-1-(q>.8?1:0),1,1+(q>.8?1:0),Tc);}});
      // 樹（英國橡樹／山楂）
      const tree=(a,b,r=7,hgt=14,seed=3)=>{sh.push([a-1,b-1,a+1,b+1,2]);S.o(a+b+.5,(g2)=>{const p=P(a,b);RC(g2,p[0]-1,p[1]-hgt+2,3,hgt-1,'#5a4331');RC(g2,p[0]+1,p[1]-hgt+2,1,hgt-1,'#46342a');
        const cy=p[1]-hgt-r*.4;const blobs=[[0,0,r,r*.8],[-r*.55,r*.25,r*.6,r*.5],[r*.6,r*.3,r*.55,r*.5],[r*.1,-r*.45,r*.6,r*.5]];
        for(const[dx,dy,rx,ry]of blobs)ell(g2,p[0]+dx,cy+dy,rnd(rx),rnd(ry),'#4f7d35');
        for(const[dx,dy,rx,ry]of blobs){const rx2=Math.max(1,rnd(rx*.7)),ry2=Math.max(1,rnd(ry*.65));ell(g2,p[0]+dx-rx*.25,cy+dy-ry*.25,rx2,ry2,'#62933f');}
        for(let i=0;i<14;i++){const q=hsh(seed,i,7),q2=hsh(seed,i,8);RC(g2,p[0]-r*.9+q*r*1.2,cy-r*.7+q2*r*.9,1,1,'#7bab52');}
        for(let i=0;i<8;i++){const q=hsh(seed,i,9),q2=hsh(seed,i,10);RC(g2,p[0]+q*r*.9,cy+q2*r*.7,1,1,'#3f662b');}});};
      // 圓捆乾草（躺放、軸沿 a）
      const bale=(a,b)=>S.o(a+b+.4,(g2)=>{const p=P(a,b),x=rnd(p[0]),y=rnd(p[1]);
        const m=[".YYYY.","YYYYYE","YYYYEE",".YYYE."];const cc={Y:'#d7bd67',E:'#b99d4c'};
        for(let j=0;j<4;j++)for(let i=0;i<6;i++){const ch=m[j][i];if(ch==='.')continue;g2.fillStyle=j===0?'#e6cf82':cc[ch];g2.fillRect(x-3+i,y-4+j,1,1);}
        g2.fillStyle='#a88c40';g2.fillRect(x+1,y-2,1,1);});
      const smallBales=(a0,b0,n,m)=>{for(let i=0;i<n;i++)for(let j=0;j<m;j++){const a=a0+i*1.5,b=b0+j;
        S.o(a+b+.35,(g2)=>box(g2,a,b,a+1.5,b+1,0,2,'#e2c979','#d2b865','#b09646'));}};
      // 飲水槽（石槽）
      const trough=(a,b,along='a',len=3)=>{const a1=along==='a'?a+len:a+1,b1=along==='a'?b+1:b+len;
        S.o((a+a1+b+b1)/2,(g2)=>{box(g2,a,b,a1,b1,0,3,'#b9b5a8','#a8a497','#86837a');flat(g2,a+.5,b+.25,a1-.5,b1-.25,'#5b8fb0',3);
          const p=P(a+.6,b+.4,3);RC(g2,p[0],p[1],2,1,'#9cc4dc');});};
      const lantern=(g2,n2,xy)=>{RC(g2,xy[0],xy[1]-1,2,1,'#2a2622');RC(g2,xy[0],xy[1],2,2,'#e9d9a2');RC(n2,xy[0],xy[1],2,2,'#ffe2a0');};
      const dc=(a0,b0,a1,b1)=>(a0+a1+b0+b1)/2;
      const ctx={L,g,ng,S,sh,P,dc,animal,flock,wallA,wallB,fenceA,fenceB,gateA,gateB,hedgeA,hedgeB,tree,bale,smallBales,trough,lantern,FC,WALL};
      const out=lay(ctx);
      shadows(g,sh,.24);
      S.run();
      if(out.post)out.post();
      L.lotMask(c);L.lotMask(nc);
      const spr={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[],door403:out.door403,__t610:'farm'};
      if(out.hen403)spr.hen403=out.hen403;
      return spr;
    };
    // 草地著色器
    const grassC=(T,x,y,seed)=>{const q=REPH(x,y,seed);return q<.16?T[1]:q>.88?T[2]:q>.84?T[3]:T[0];};
    let REPH=null;

    // ---------- v0 牛：長條石砌牛舍（屋脊沿 a）＋乾草棚＋石牆圍的場院＋兩塊牧地 ----------
    const L0=(C)=>{const {L,g,ng,S,sh,P,dc,flock,wallA,wallB,gateA,gateB,hedgeA,hedgeB,tree,bale,smallBales,trough,lantern,FC}=C;const {house,win,door,TX,box,faceB,faceA,topF,fp,BL,RC,hsh,ground,pathD,ROOF,leanTo}=L;REPH=hsh;
      const paths=[[[12,11],[12,15],[14,19],[18,24],[24,28]],[[20,13],[24,12],[27,14]]];
      ground(g,(a,b,x,y)=>{
        let T=FC.g0;if(b<11&&a<21)T=FC.yard;else if(a>=21)T=FC.g2;else if(b>=16)T=FC.g1;
        if(a>=4&&a<20&&b>=10&&b<16){T=FC.yard;}
        const d=Math.min(pathD(x,y,paths[0]),pathD(x,y,paths[1]));
        if(T!==FC.yard&&d<1.6)return hsh(x,y,9)<.3?FC.pathD:FC.path;if(T!==FC.yard&&d<2.4&&hsh(x,y,8)<.5)return FC.g2[3];
        if(T===FC.yard&&hsh(x,y,12)<.1)return FC.straw[0];
        return grassC(T,x,y,5);});
      hedgeA(0,1.5,0,32,5,11);hedgeB(0,1.5,1.5,32,5,12);
      tree(2.5,13,7,11,31);
      // 牛舍
      sh.push([4,4,20,10,2.5]);
      let d403=null;
      S.o(dc(4,4,20,10),(sg,sng)=>{
        const st=TX.stone('#c7bca3',31),stR=TX.stone('#948a76',32);
        house(sg,{a0:4,b0:4,a1:20,b1:10,H:12,R:9,ridge:'a',texL:st,texR:stR});
        d403=door(sg,'b',9,10,0,5,9,{head:'#8c7658',inner:'#3a2a1c'});
        for(const a of [5.5,13.5,16.5])door(sg,'b',a,10,0,3,6,{col:'#5d4430',head:'#8c7658'});
        for(const a of [6.5,14.5,17.5])win(sg,sng,'b',a,10,8,2,2,{glass:'#2c3a44',sill:false,head:'#8c7658',lit:a<7});
        win(sg,sng,'a',20,8,7,2,3,{glass:'#2c3a44',head:'#6c604e',lit:true});
        // 通風口與屋脊瓦
        const t=P(12,7,21);RC(sg,t[0]-1,t[1]-3,3,3,'#566069');RC(sg,t[0]-2,t[1]-4,5,1,'#3f4750');
        lantern(sg,sng,P(8.4,10,8));});
      // 乾草棚（荷蘭式開放棚：柱＋弧形鐵皮頂，內堆方捆）
      sh.push([22,3,29,10,2]);
      S.o(dc(22,3,29,10),(sg)=>{
        // 方捆堆（磚式錯縫＝一捆捆）
        const baleL=TX.brick('#dcc070',35),baleR=TX.brick('#b89c4c',36);
        faceB(sg,22.6,28.6,9.4,0,11,baleL);faceA(sg,28.6,3.6,9.4,0,11,baleR);topF(sg,22.6,3.6,28.6,9.4,11,'#e8d38a');
        // 鋼柱
        for(const[a,b]of[[22,10],[25.5,10],[29,10],[29,6.5],[29,3]]){const p=P(a,b);RC(sg,p[0]-1,p[1]-15,1,15,'#6f777c');RC(sg,p[0],p[1]-15,1,15,'#4b5256');}
        // 弧形鏽紅浪板頂
        const zf=b=>15+Math.round(4*Math.sin(Math.PI*(b-2.5)/8));
        for(let k=0;k<8;k++){const b0=2.5+k,b1=b0+1;fp(sg,[P(21.5,b0,zf(b0)),P(29.5,b0,zf(b0)),P(29.5,b1,zf(b1)),P(21.5,b1,zf(b1))],k<3?'#8e4a33':k<5?'#b0603f':'#a4553a');}
        for(let a=22.5;a<29.5;a+=1.5)for(let k=3;k<8;k++)BL(sg,P(a,2.5+k,zf(2.5+k)),P(a,3.5+k,zf(3.5+k)),'#83412d');
        for(let k=0;k<8;k++)BL(sg,P(29.5,2.5+k,zf(2.5+k)),P(29.5,3.5+k,zf(3.5+k)),'#6a3224');
        BL(sg,P(21.5,10.5,zf(10.5)),P(29.5,10.5,zf(10.5)),'#c9785a');});
      // 場院石牆＋槽
      wallA(16,4,20,{gaps:[[10,14]]});wallB(20,10,16);wallB(4,10,16);gateA(16,10,14);
      trough(15,12,'a',4);
      // 牧地分隔牆
      wallB(20.5,16,32,{gaps:[[22,25]]});gateB(20.5,22,25);wallA(31,0,32,{gaps:[[4,8]]});gateA(31,4,8);wallB(31,0,31);
      // 環形乾草餵食架
      S.o(26+20+.5,(sg)=>{const p=P(26,20);L.ell(sg,p[0],p[1]-2,5,2,'#6e777c');L.ell(sg,p[0],p[1]-3,4,2,'#d8be6a');L.ell(sg,p[0],p[1]-4,3,1,'#e6cf82');RC(sg,p[0]-5,p[1]-2,1,2,'#50575b');RC(sg,p[0]+5,p[1]-2,1,2,'#50575b');});
      bale(24,26);bale(28,23);
      flock(['cow','cow','cowB','cow'],[[8,13,1],[17,13.5,0],[6,22,0],[11,26,1],[15,20,0],[4,28,1,2],[25,17,0],[29,19,1,2],[24,23,0],[27,28,1]]);
      return {get door403(){return d403;}};};

    // ---------- v1 羊：石牆分割的拼布牧地＋石砌田間穀倉（屋脊沿 b、受光山牆開車門）＋圓形石羊圈＋木欄分羊欄 ----------
    const L1=(C)=>{const {L,g,ng,S,sh,P,dc,flock,wallA,wallB,gateA,gateB,hedgeA,hedgeB,tree,fenceA,fenceB,lantern,trough,smallBales,FC,WALL}=C;const {house,win,door,TX,box,faceB,faceA,topF,fp,BL,RC,hsh,ground,pathD,leanTo}=L;REPH=hsh;
      const paths=[[[9,19],[11,24],[16,27],[22,30]]];
      ground(g,(a,b,x,y)=>{let T=FC.g0;
        if(a<16&&b<13)T=FC.g2;else if(a>=16&&b<16)T=FC.g1;else if(a<16&&b>=13)T=FC.g0;else T=FC.hay;
        if(T===FC.hay&&((b|0)%2===0))T=[T[3],T[0],T[2],T[3]];
        const d=pathD(x,y,paths[0]);if(d<1.4)return hsh(x,y,9)<.3?FC.pathD:FC.path;
        const cx=24,cy=22,rr=Math.hypot((a-cx),(b-cy));if(rr<4.3)return grassC(FC.yard,x,y,6);
        return grassC(T,x,y,5);});
      hedgeA(0,1.5,0,32,4,21);hedgeB(0,1.5,1.5,32,4,22);
      tree(27,4,8,11,41);
      // 田間穀倉（兩層、屋脊沿 b，受光山牆朝前）
      sh.push([5,8,12,18,3]);let d403=null;
      S.o(dc(5,8,12,18),(sg,sng)=>{const st=TX.stone('#c9bfa7',41),stR=TX.stone('#968c78',42);
        house(sg,{a0:5,b0:8,a1:12,b1:18,H:15,R:9,ridge:'b',texL:st,texR:stR});
        d403=door(sg,'b',6.5,18,0,6,10,{arch:true,head:'#e0d6bf',inner:'#3a2a1c'});
        win(sg,sng,'b',7.5,18,12,2,2,{glass:'#2a343c',head:'#e0d6bf',sill:false});
        for(const b of [16.5,12.5])win(sg,sng,'a',12,b,8,2,3,{glass:'#2c3a44',head:'#6f6555',lit:b>15});
        // 穿牆石
        for(const b of [15,11]){const p=P(12,b,11);RC(sg,p[0],p[1],2,1,'#d8cfba');}
        lantern(sg,sng,P(6,18,9));});
      // 披屋羊棚（貼穀倉 +a 側）
      sh.push([12,11,16,17,1.5]);
      S.o(dc(12,11,16,17),(sg)=>{leanTo(sg,{a0:12,b0:11,a1:16,b1:17,H:6,R:4,texL:TX.stone('#c3b9a1',43),texR:TX.stone('#908673',44)});
        faceB(sg,12.6,15.4,17,0,4,'#3b2f25');});
      // 石牆拼布
      wallA(13,0,5,{});wallA(13,16,32,{gaps:[[21,24]]});gateA(13,21,24);
      wallB(16,18,31,{gaps:[[26,29]]});gateB(16,26,29);
      wallA(31,0,32,{gaps:[[14,18]]});wallB(31,0,31);
      // 圓形石羊圈
            const cx=24,cy=22,rr=4.3;
      for(let k=0;k<24;k++){const t0=k/24*Math.PI*2,t1=(k+1)/24*Math.PI*2;if(k===9||k===10)continue;
        const a0=cx+Math.cos(t0)*rr,b0=cy+Math.sin(t0)*rr,a1=cx+Math.cos(t1)*rr,b1=cy+Math.sin(t1)*rr;
        S.t((a0+a1+b0+b1)/2+.2,(g2)=>{const h=4;const pts=[P(a0,b0,0),P(a1,b1,0),P(a1,b1,h),P(a0,b0,h)];
          const nx=Math.cos((t0+t1)/2),ny=Math.sin((t0+t1)/2);const lit=ny-nx*.6;
          fp(g2,pts,lit>.3?WALL.L:lit>-.4?'#999588':WALL.R);BL(g2,P(a0,b0,h),P(a1,b1,h),WALL.T);});}
      // 分羊木欄（hurdles）
      const hd={h:3,c:'#b39873',p:'#7d6446',step:3};
      fenceA(20,4,10,hd);fenceB(10,20,24,hd);fenceB(4,20,24,hd);fenceA(24,4,10,{...hd,gaps:[[6,8]]});
      // 羊欄裡的木製乾草架（V 形槽＋乾草）、後牧地的石水槽、穀倉旁一小垛方捆
      S.o(7.2+22+.4,(sg)=>{const a0=5.6,a1=8.8,b0=21.6,b1=22.6;
        fp(sg,[P(a0,b0,4),P(a1,b0,4),P(a1,b1,4),P(a0,b1,4)],'#d8bf6c');
        for(let a=a0;a<=a1+.01;a+=.8){const p=P(a,b1),q=P(a,b0,4);BL(sg,[p[0],p[1]-1],q,'#6b5238');}
        L.faceB(sg,a0,a1,b1,1,4,(s,r)=>r%2?'#7d6446':'#9a7d58');L.faceA(sg,a1,b0,b1,1,4,'#5f4a33');
        const t=P(a0+.3,b0+.3,5);RC(sg,t[0],t[1]-1,6,1,'#e6cf82');});
      trough(20,8.5,'a',3);
      smallBales(17,2,2,1);S.o(18.5+2.5+.6,(sg)=>L.box(sg,17.8,2,19.3,3,2,2,'#e6cf82','#d2b865','#b09646'));
      flock(['sheep','sheepW'],[[6,21],[8,22.5,1],[5,23],[22,20,1],[25,21],[23,24,1],[26,23.5],[21,23],
        [4,5,1],[9,4],[11,6,1],[14,3],[3,10],[20,5,1],[24,8],[28,10,1],[19,9],[26,14],[9,27,1],[5,29],[13,25],[27,28,1],[20,29],[29,24]]);
      return {get door403(){return d403;}};};

    // ---------- v2 馬：L 形紅磚馬廄（鐘塔）＋卵石馬廄院＋白欄沙場＋放牧場 ----------
    const L2=(C)=>{const {L,g,ng,S,sh,P,dc,flock,animal,fenceA,fenceB,gateA,gateB,hedgeA,hedgeB,tree,trough,smallBales,lantern,FC}=C;const {house,win,door,TX,box,faceB,faceA,topF,fp,BL,RC,hsh,ground,pathD}=L;REPH=hsh;
      ground(g,(a,b,x,y)=>{let T=FC.g0;
        if(a>=6&&a<24&&b>=10&&b<18)T=FC.cob;
        if(a>=17&&a<31&&b>=20&&b<31)T=FC.sand;
        if(a<14&&b>=20)T=FC.g1;if(a>=25&&b<19)T=FC.g2;
        if(T===FC.cob&&((x+(y&1)*2)%4===0||y%2===0)&&hsh(x,y,3)<.5)return '#7a766d';
        if(T===FC.sand){const e=Math.abs(a-24)/7+Math.abs(b-25.5)/5.5;if(e>.75&&e<.95&&hsh(x,y,4)<.6)return FC.sand[3];}
        return grassC(T,x,y,5);});
      hedgeA(0,1.5,0,32,5,31);hedgeB(0,1.5,1.5,32,5,32);
      // 主馬廄（沿 a）
      sh.push([6,3,24,9,2.5]);let d403=null;
      S.o(dc(6,3,24,9),(sg,sng)=>{const br=TX.brick('#b3674b',51),brR=TX.brick('#83493a',52);
        const r=house(sg,{a0:6,b0:3,a1:24,b1:9,H:12,R:8,ridge:'a',texL:br,texR:brR,plinth:[1,'#8f8a7e','#6d695f']});
        // 拱門（馬車道）
        d403=door(sg,'b',13.5,9,0,6,10,{arch:true,head:'#e2dac6',inner:'#3a2a1c'});
        // 馬房半截門（上半開）
        for(const a of [7.5,10.5,18,21]){const[O,sl]=L.fpt('b',a,9,0);L.cols(sg,O,sl,3,7,(i,j)=>j<3?'#2a1f17':'#3f5c46');L.cols(sg,[O[0],O[1]-3],sl,3,1,()=>'#2f4634');}
        {const hp=P(8.6,9,6);RC(sg,hp[0],hp[1]-1,2,3,'#8a4f2b');RC(sg,hp[0]-1,hp[1]+1,2,2,'#7a4526');RC(sg,hp[0]+1,hp[1]-1,1,2,'#2b211c');}
        for(const a of [9,19.5])win(sg,sng,'b',a+.3,9,9,1,2,{glass:'#2c3a44',sill:false});
        win(sg,sng,'a',24,7,6,2,3,{glass:'#2c3a44',arch:true,head:'#e2dac6',lit:true});
        // 鐘樓
        const t=P(15,6,20);box(sg,14,5,16,7,20,5,'#e7e1d2','#f1ece0','#c8c1b0');
        const q=P(14,7,25),q2=P(16,7,25),q3=P(16,5,25),q4=P(14,5,25),tp=P(15,6,31);
        fp(sg,[q,q2,tp],'#6b7783');fp(sg,[q2,q3,tp],'#4f5963');RC(sg,tp[0],tp[1]-3,1,3,'#3c3a36');RC(sg,tp[0]-1,tp[1]-3,3,1,'#3c3a36');
        const ck=P(15,7,22.5);RC(sg,ck[0]-2,ck[1]-1,2,2,'#f8f4ea');RC(sg,ck[0]-1,ck[1]-1,1,1,'#2d2a26');
        lantern(sg,sng,P(13,9,9));});
      // 側翼（沿 b）
      sh.push([6,9,11,19,2]);
      S.o(dc(6,9,11,19),(sg,sng)=>{const br=TX.brick('#b3674b',53),brR=TX.brick('#83493a',54);
        house(sg,{a0:6,b0:9,a1:11,b1:19,H:11,R:7,ridge:'b',texL:br,texR:brR,plinth:[1,'#8f8a7e','#6d695f']});
        for(const b of [17.5,13.5]){const[O,sl]=L.fpt('a',11,b,0);L.cols(sg,O,sl,3,7,(i,j)=>j<3?'#1e1611':'#324a38');}
        win(sg,sng,'b',7.5,19,6,2,3,{glass:'#2c3a44',arch:true,head:'#e2dac6',lit:true});});
      trough(19,12,'a',3);
      S.o(22+15,(sg)=>{L.box(sg,21,14,22.5,15.5,0,3,'#bdb8aa','#aaa598','#87837a');});  // 上馬石
      // 沙場白欄
      const wf={c:'#ece8dc',p:'#cfc9ba',h:5};
      fenceA(20,17,31,wf);fenceB(17,20,31,{...wf,gaps:[[22,25]]});fenceA(31,17,31,wf);fenceB(31,20,31,wf);
      // 放牧場木欄
      fenceA(20,0,14,{c:'#ece8dc',p:'#cfc9ba',gaps:[[4,7]]});fenceB(14,20,32,{c:'#ece8dc',p:'#cfc9ba'});
      fenceB(25,0,19,{c:'#ece8dc',p:'#cfc9ba',gaps:[[12,15]]});fenceA(19,25,32,{c:'#ece8dc',p:'#cfc9ba'});
      gateA(20,4,7);gateB(25,12,15);
      // 馬廄側翼旁的方捆垛（兩層）、右後放牧場的石水槽與吊乾草網
      smallBales(1.7,21.2,1,2);S.o(2.45+22.2+.6,(sg)=>L.box(sg,1.7,21.7,3.2,22.7,2,2,'#e6cf82','#d2b865','#b09646'));
      trough(27.5,14.5,'a',3);
      tree(3,26,7,14,51);
      flock(['horse','horseG','horseC','horseK'],[[5,23,0,0],[10,28,1,1],[7,30,0,3],[28,6,1,2],[29,13,0,0],[23,24,1,1],[26,27,0,2]]);
      return {get door403(){return d403;}};};

    // ---------- v3 豬：紅磚豬舍排屋（單坡）＋前方小磚牆豬欄＋兩層糧倉（外石梯）＋泥地豬舍棚＋飼料倉 ----------
    const L3=(C)=>{const {L,g,ng,S,sh,P,dc,flock,fenceA,fenceB,gateA,hedgeA,hedgeB,tree,bale,trough,lantern,FC}=C;const {house,leanTo,win,door,TX,box,faceB,faceA,topF,fp,BL,RC,hsh,ground,flat}=L;REPH=hsh;
      ground(g,(a,b,x,y)=>{let T=FC.g0;
        if(b>=15&&a>=2&&a<31)T=FC.mud;
        if(a>=4&&a<21&&b>=8&&b<14)T=FC.yard;
        if(T===FC.mud){const w1=Math.hypot(a-9,(b-25)*1.3),w2=Math.hypot(a-24,(b-20)*1.3);if(w1<2.2||w2<1.8)return hsh(x,y,6)<.2?'#6e7f7c':'#5f6e6a';
          if(hsh(x>>2,y>>1,7)<.16)return grassC(FC.g2,x,y,5);}
        return grassC(T,x,y,5);});
      hedgeA(0,1.5,0,32,5,41);hedgeB(0,1.5,1.5,32,5,42);
      // 糧倉（兩層，屋脊沿 a），外石梯上二樓門
      sh.push([21,3,29,9,3]);let d403=null;
      S.o(dc(21,3,29,9),(sg,sng)=>{const br=TX.brick('#ad6248',61),brR=TX.brick('#7f4636',62);
        house(sg,{a0:21,b0:3,a1:29,b1:9,H:17,R:8,ridge:'a',texL:br,texR:brR,plinth:[2,'#958f80','#716c62']});
        d403=door(sg,'b',25,9,0,4,8,{head:'#e0d8c4',inner:'#3a2a1c'});
        // 二樓吊貨門＋吊桿
        door(sg,'b',25,9,10,3,5,{col:'#5a4130',head:'#e0d8c4'});
        {const hb=P(26.2,9,17);RC(sg,hb[0]-1,hb[1],4,1,'#4a3a2c');RC(sg,hb[0]+2,hb[1]+1,1,4,'#2e2a26');}
        win(sg,sng,'b',22.3,9,6,2,3,{glass:'#2c3a44',head:'#e0d8c4',lit:true});win(sg,sng,'b',22.3,9,11,2,3,{glass:'#2c3a44',head:'#e0d8c4'});
        win(sg,sng,'a',29,7,10,2,3,{glass:'#2c3a44',head:'#e0d8c4',lit:true});
        lantern(sg,sng,P(24.4,9,8));});
      // 豬舍排屋（單坡、屋面朝 +b）
      sh.push([4,4,21,8,1.5]);
      S.o(dc(4,4,21,8),(sg)=>{const br=TX.brick('#ad6248',63),brR=TX.brick('#7f4636',64);
        leanTo(sg,{a0:4,b0:4,a1:21,b1:8,H:6,R:4,texL:br,texR:brR});
        for(const a of [5.5,9.7,13.9,18.1])door(sg,'b',a,8,0,2,4,{col:'#2a1f17'});});
      // 小豬欄：磚矮牆分隔成三格，前牆留豬門
      const bw=TX.brick('#a95f46',65),bwR=TX.brick('#7c4535',66),cap='#b4a794';
      for(const a of [4,9.6,15.3,21]){for(let b=8;b<14;b+=2){const b1=b+2;S.t(a+.5+b1,(g2)=>{faceA(g2,a+.5,b,b1,0,3,bwR);topF(g2,a-.5,b,a+.5,b1,3,cap);if(b1>=14)faceB(g2,a-.5,a+.5,14,0,3,bw);});}}
      for(let i=0;i<3;i++){const a0=4.5+i*5.66,a1=a0+4.66;for(let a=a0;a<a1-1.9;a+=1){const s1=Math.min(a1-2,a+1);S.t(s1+14,(g2)=>{faceB(g2,a,s1,14,0,3,bw);topF(g2,a,13,s1,14,3,cap);});}}
      // 飼料倉（鍍鋅桶＋腳架）
      sh.push([1.5,9.5,3.5,11.5,3]);
      S.o(2.5+10.5+.5,(sg)=>{const a0=1.5,b0=9.5,a1=3.5,b1=11.5,p=P(2.5,10.5);for(const dx of [-3,3])RC(sg,p[0]+dx,p[1]-6,1,6,'#6d7478');
        fp(sg,[P(a0,b1,6),P(a1,b1,6),P(a1,b0,6),[p[0],p[1]-1]],'#8b9397');
        box(sg,a0,b0,a1,b1,6,12,'#c9d0d3',TX.tin('#b3bbbf'),TX.tin('#8e969a'));
        const t=P(2.5,10.5,18);fp(sg,[P(a0,b0,18),P(a1,b0,18),P(a1,b1,18),P(a0,b1,18)],'#c9d0d3');fp(sg,[P(a0,b1,18),P(a1,b1,18),[t[0],t[1]-3]],'#dfe5e8');fp(sg,[P(a1,b1,18),P(a1,b0,18),[t[0],t[1]-3]],'#a5adb1');});
      // 泥地分欄木柵
      const pw={h:4,c:'#b09a74',p:'#5f4a33',step:3};
      fenceA(15,2,31,{...pw,gaps:[[12,15]]});fenceB(16,15,31,{...pw,gaps:[[21,24]]});fenceB(2,15,31,pw);fenceA(31,2,31,pw);fenceB(30.5,15,31,pw);gateA(15,12,15);
      // 豬舍棚（arks：半圓鍍鋅浪板、端牆開豬門）
      // 半圓鍍鋅浪板豬舍棚：背坡暗、頂亮、受光前坡中間調；浪板肋沿弧線；+a 端木板端牆開拱形豬門、門口鋪乾草
      const ark=(a,b,col='#aeb6bb')=>{const len=4,wd=3,hh=7,n=10;sh.push([a,b,a+len,b+wd,1.5]);S.o(a+len/2+b+wd/2,(sg)=>{
        const zb=bb=>{const t=(bb-b)/wd;return Math.sqrt(Math.max(0,1-(2*t-1)*(2*t-1)))*hh;};
        const tone=k=>k<3?SH(col,-24):k<6?SH(col,16):SH(col,4);
        for(let k=0;k<n;k++){const b0=b+wd*k/n,b1=b+wd*(k+1)/n;fp(sg,[P(a,b0,zb(b0)),P(a+len,b0,zb(b0)),P(a+len,b1,zb(b1)),P(a,b1,zb(b1))],tone(k));}
        for(let aa=a+.5;aa<a+len-.2;aa+=1){for(let k=3;k<n;k++){const b0=b+wd*k/n,b1=b+wd*(k+1)/n;BL(sg,P(aa,b0,zb(b0)),P(aa,b1,zb(b1)),SH(col,-20));}}
        const pts=[P(a+len,b+wd,0)];for(let k=n;k>=0;k--)pts.push(P(a+len,b+wd*k/n,zb(b+wd*k/n)));pts.push(P(a+len,b,0));
        fp(sg,pts,L.rowFn(P(a+len,b+wd,0),-.5,(s,r)=>r%2?'#5c4633':'#6e553d'));
        const[O,sl]=L.fpt('a',a+len,b+wd*.72,0);L.cols(sg,O,sl,3,4,(i,j)=>j<L.archOff(i,3)?null:'#1d1611');
        for(let k=0;k<7;k++){const p=P(a+len+.3+(k%3)*.4,b+wd*.3+k*.25);RC(sg,p[0],p[1],1,1,k%2?'#c9ae62':'#dcc272');}});};
      ark(3.5,17);ark(20.5,22.5);ark(10.5,27.3,'#b8bfc3');
      trough(24,16.5,'a',3);bale(27,26);
      flock(['pig','pigS','pig'],[[6.5,10.5,0],[11,11,1],[15,10,0],[19,11.5,1],[8,23.5,1],[13.5,25,0],[6,28,1],[14,22,0],[21,19,1],[26,21,0],[23,28,1],[27,23,0],[18,29,1]]);
      return {get door403(){return d403;}};};

    // ---------- v4 家禽：黑護牆板雞舍（屋脊沿 a、磚腳）＋鐵網放養雞場（平地）＋鴨塘＋移動雞舍 ----------
    const L4=(C)=>{const {L,g,ng,S,sh,P,dc,flock,fenceA,fenceB,gateA,gateB,hedgeA,hedgeB,tree,trough,lantern,FC}=C;const {house,win,door,TX,box,faceB,faceA,topF,fp,BL,RC,hsh,ground,ell}=L;REPH=hsh;
      const HEN=[66,121];
      ground(g,(a,b,x,y)=>{let T=FC.g0;
        if(a>=9&&b>=8&&a<31&&b<31)T=FC.g2;
        const pd=Math.hypot((a-5)*1.1,(b-24)*.8);if(pd<4.2)return pd<3.6?(hsh(x,y,5)<.12?'#7fb0cc':'#4f86a8'):'#8d7a55';
        if(T===FC.g2){
          // 雞場：沙浴窩（踩禿的土坑）＋被刨過的斑駁土面＋雞舍門前散落的墊草
          for(const[cx,cy,r]of[[15,16,2.3],[23.5,23,2.8],[12.5,23.5,1.9],[25,14,1.7]]){const d=Math.hypot(a-cx,b-cy);
            if(d<r)return d>r-.6?'#8f7a54':(hsh(x,y,19)<.2?'#b09a6c':'#a08a5f');}
          if(b<10.5&&a<24&&hsh(x,y,21)<.35)return FC.straw[(x+y)&3];
          if(hsh(x>>2,y>>1,17)<.2)return hsh(x,y,18)<.5?FC.yard[0]:FC.yard[1];
          if(hsh(x>>1,y,6)<.14)return FC.yard[(x+y)&1];
        }
        return grassC(T,x,y,5);});
      hedgeA(0,1.5,0,32,5,51);hedgeB(0,1.5,1.5,32,5,52);
      tree(2,14,7,14,61);
      // 雞舍（沿 a）：磚腳＋黑色護牆板
      sh.push([4,2,24,7,2.5]);let d403=null;
      S.o(dc(4,2,24,7),(sg,sng)=>{const wb=TX.board('#4d4944'),wbR=TX.board('#373431');
        house(sg,{a0:4,b0:2,a1:24,b1:7,H:11,R:7,ridge:'a',texL:wb,texR:wbR,plinth:[3,TX.brick('#ad6248',71),TX.brick('#7f4636',72)]});
        d403=door(sg,'b',15,7,0,4,8,{head:'#c9c1ae',inner:'#3a2a1c'});
        for(const a of [6,9,12,19,21.5])win(sg,sng,'b',a,7,6,2,2,{glass:'#9fb7c4',hi:'#d7e6ee',sill:false,head:'#c9c1ae'});
        for(const a of [7.5,10.5,20.5]){const p=P(a,7,0);RC(sg,p[0],p[1]-3,2,2,'#1d1814');}
        // 屋脊通風帽
        for(const a of [8,13,18]){const t=P(a,4.5,18);RC(sg,t[0]-1,t[1]-2,3,2,'#56606a');RC(sg,t[0]-2,t[1]-3,5,1,'#3e464f');}
        win(sg,sng,'a',24,5.5,5,2,2,{glass:'#2c3a44',head:'#c9c1ae',lit:true});
        lantern(sg,sng,P(14.4,7,8));});
      // 鐵網雞場圍籬
      const wire={c:'#a9b0b3',p:'#6b5a44',h:6};
      fenceA(8,24,31,wire);fenceB(8.5,8,31,{...wire,gaps:[[17,19]]});fenceA(31,9,31,wire);fenceB(31,8,31,wire);gateB(8.5,17,19);
      // 移動雞舍（輪上木屋）：停在雞場外、樹與鴨塘之間的草地上，跟主雞舍分開不黏在一起
      {const ma0=2.2,mb0=15.6,ma1=5.4,mb1=18.3;
      sh.push([ma0,mb0,ma1,mb1,2]);
      S.o(dc(ma0,mb0,ma1,mb1),(sg)=>{house(sg,{a0:ma0,b0:mb0,a1:ma1,b1:mb1,H:6,R:4,ridge:'a',texL:TX.board('#8a6a45'),texR:TX.board('#65503a'),roof:{L:'#7a8288',D:'#5c6369',ridge:'#454c52',verge:'#9aa1a6'}});
        for(const a of [ma0+.6,ma1-.6]){const q=P(a,mb1);RC(sg,q[0]-1,q[1]-1,2,2,'#2a2624');RC(sg,q[0]-1,q[1]-1,1,1,'#5a524c');}
        const r=P(ma0+1,mb1,1);for(let k=0;k<3;k++)RC(sg,r[0]-2-k,r[1]+1+k,2,1,'#8a6a45');
        const d=P(ma0+1.7,mb1,2);RC(sg,d[0],d[1]-3,2,3,'#231c16');});}
      // A 字雞籠（前右角，游走帶之外）
      sh.push([27,23,30.5,26,1.5]);
      S.o(dc(27,23,30.5,26),(sg)=>{const a0=27,a1=30.5,b0=23,b1=26,bm=24.5,Hh=6;
        fp(sg,[P(a0,b0,0),P(a1,b0,0),P(a1,bm,Hh),P(a0,bm,Hh)],'#7a5f40');
        fp(sg,[P(a1,b1,0),P(a1,b0,0),P(a1,bm,Hh)],'#5c4630');
        fp(sg,[P(a0,b1,0),P(a1,b1,0),P(a1,bm,Hh),P(a0,bm,Hh)],L.rowFn(P(a0,b1,0),.5,(s,r)=>r%2===1?'#8b6c47':'#a3825a'));
        BL(sg,P(a0,bm,Hh),P(a1,bm,Hh),'#c4a577');const d=P(a1,b1-1.2,0);RC(sg,d[0]-1,d[1]-3,2,3,'#231c16');});
      // 棲木架（兩個 A 字腳＋兩道橫桿）：雞舍門前左側、游走帶之外
      S.t(12+11.5+.3,(g2)=>{for(const a of [10.2,13.8]){const p=P(a,11.5);BL(g2,[p[0]-2,p[1]],[p[0],p[1]-5],'#6b5238');BL(g2,[p[0]+2,p[1]],[p[0],p[1]-5],'#5a4430');}
        BL(g2,P(10.2,11.5,5),P(13.8,11.5,5),'#8a6d49');BL(g2,P(10.2,11.5,3),P(13.8,11.5,3),'#7a5f3f');});
      // 穀槽
      S.o(13+26.5,(sg)=>{box(sg,11.5,26,14.5,27,0,2,'#9c8058','#b39468','#7d6446');L.flat(sg,11.8,26.2,14.2,26.8,'#d9b85c',2);});
      // 飲水器、穀盆
      S.o(28+27,(sg)=>{const p=P(27,27);RC(sg,p[0]-1,p[1]-4,3,4,'#c23d33');RC(sg,p[0]-2,p[1]-1,5,1,'#8f2a24');});
      // 鴨塘蘆葦
      for(const[a,b]of[[1.5,21],[2.2,27.5],[8.8,21.5],[3,28.8]]){S.t(a+b+.2,(g2)=>{const p=P(a,b);RC(g2,p[0],p[1]-4,1,4,'#5f7d3a');RC(g2,p[0]+1,p[1]-3,1,3,'#6f8e45');RC(g2,p[0],p[1]-5,1,1,'#6b4a2a');});}
      flock(['duck'],[[4,23],[6,25.5,1],[5.5,22]]);
      flock(['hen','henB','hen'],[[11,12],[13,10.5,1],[16,12],[22,11,1],[28,15],[27,20,1],[12,24],[25,28],[28,26,1],[10,29],[19,29.5]]);
      return {get door403(){return d403;},hen403:HEN};};

    const lays=[L0,L1,L2,L3,L4];
    for(let v=0;v<5;v++){const s=makeFarm(v,lays[v]);B['23_1_'+v]=s;REP.farm['v'+v]={door403:s.door403,hen403:s.hen403||null};}
  };

  // ======================= 抽水站 k130 v0、v1、v2 =======================
  // T610 退件後：v0 原本是 T605 的米白＋棕扁平大方盒（128px 底板、72px 寬量體，比 v1/v2 大一圈），三款不像同一個鎮。
  //   本批次接手重畫 130_1_0：同一套紅褐磚／石帶／拱窗／石板山牆，量體縮到 1×1 佔地內、與 v1/v2 泵房同尺度。
  //   保留 __t605:'pump' 標記（bayFlavorSelftest605 讀它判定「抽水站是磚泵房」，新圖確實是磚泵房）。
  const buildPumps=()=>{
    const old=B['130_1_0'];const W=144,H=224,AX=72,AY=220;const SC=old?old.sc:undefined;
    const makePump=(v,lay)=>{const L=LIB(W,H,AX,AY,1),{P,fp,BL,RC,hsh,ground,scene,house,box,faceB,faceA,topF,flat,win,door,TX,shadows,cols,fpt}=L;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);const S=scene(g,ng),sh=[];
      lay({L,g,ng,S,sh});
      shadows(g,sh,.26);S.run();L.lotMask(c);L.lotMask(nc);
      const spr={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,sc:SC,smoke:[],__t610:'pump'};return spr;};
    const BR='#b0644a',BRD='#7f4636',STONE='#d9d0bb';
    const PAVE=(x,y,hsh)=>{const q=hsh(x,y,5);return q<.2?'#9a968b':q>.85?'#b3afa3':'#a6a296';};
    const COPE=(x,y)=>(x+y)&1?'#d6cfbd':'#cbc3b0';
    const WATER=(x,y,hsh,deep)=>{const q=hsh(x,y,3);if(q<.08)return '#7fb0cc';if((x+2*y)%11===0&&q<.6)return '#5f95b5';return deep?'#44779a':'#4d82a3';};
    // v0：沼地排水引擎房——高聳的單棟引擎房（屋脊沿 b、受光山牆朝前：拱門＋兩側拱窗＋上層大拱窗＋山牆圓窗＋頂上石鐘亭）
    //     ＋右後一棟矮閥室（屋脊沿 a）＋右前一條石砌排水渠（出水口頭牆、渠上石板便橋）＋前庭煤氣燈
    const P0=(C)=>{const {L,g,ng,S,sh}=C;const {P,fp,BL,RC,hsh,ground,house,box,faceB,faceA,topF,flat,win,door,TX}=L;
      const CA0=10.5,CA1=14.5,CB0=6.5;
      ground(g,(a,b,x,y)=>{
        if(a>=CA0&&a<CA1&&b>=CB0){
          if(a<CA0+.6||a>=CA1-.6)return COPE(x,y);
          if(a<CA0+1.3)return hsh(x,y,7)<.3?'#6f685d':'#7d766a';     // 看得到的渠內壁（渠深）
          if(b<CB0+1.4)return hsh(x,y,4)<.5?'#e8f1f4':'#a9cfe2';      // 出水口翻白
          return WATER(x,y,hsh,false);}
        return PAVE(x,y,hsh);});
      // 引擎房
      const E={a0:1.5,b0:2.5,a1:9,b1:11.5,H:22,R:9};
      sh.push([E.a0,E.b0,E.a1,E.b1,3]);
      S.o(12.2,(sg,sng)=>{const br=TX.brick(BR,71),brR=TX.brick(BRD,72);
        house(sg,{...E,ridge:'b',texL:br,texR:brR,plinth:[2,'#a39d8e','#7b766b']});
        faceB(sg,E.a0,E.a1,E.b1,11,12,'#ddd4c0');faceA(sg,E.a1,E.b0,E.b1,11,12,'#b3ab98');
        // 受光山牆：拱門＋兩側拱窗、上層大拱窗、山牆圓窗
        // 山牆 15 欄（AX-20…AX-6），中欄 AX-13：門／大窗 3 欄、圓窗 5 欄都對正中欄；兩側窗左右對稱
        door(sg,'b',4.5,E.b1,0,3,10,{arch:true,head:STONE,col:'#3f5a4a',inner:'#2f4539',step:'#c9c1ae'});
        for(const a of [2.5,7])win(sg,sng,'b',a,E.b1,3,2,7,{arch:true,head:STONE,glass:'#34475a',lit:a<3});
        win(sg,sng,'b',4.5,E.b1,13,3,7,{arch:true,head:STONE,glass:'#34475a',bar:true,lit:true});
        {const[O,sl]=L.fpt('b',4,E.b1,23);const ring=(i,j)=>(i-2)*(i-2)+(j-2)*(j-2);
          L.cols(sg,O,sl,5,5,(i,j)=>{const d=ring(i,j);return d>5?null:d>=3?'#ddd4c0':(i===1&&j===1?'#7f9db4':'#34475a');});}
        // 背光長牆：兩列高拱窗（閥室擋住的後段不開）
        for(const b of [10.75,8.25]){win(sg,sng,'a',E.a1,b,3,2,7,{arch:true,head:'#b3ab98',glass:'#2e3d4c',lit:b<9});win(sg,sng,'a',E.a1,b,13,2,7,{arch:true,head:'#b3ab98',glass:'#2e3d4c'});}
        // 山牆頂石鐘亭（底部埋進屋脊端，不浮空）
        {const am=(E.a0+E.a1)/2,bc0=E.b1-1.3,bc1=E.b1;
          box(sg,am-.7,bc0,am+.7,bc1,E.H+E.R-3,7,'#e1d9c6','#ddd4c0','#b3ab98');
          const[O,sl]=L.fpt('b',am-.25,bc1,E.H+E.R);L.cols(sg,O,sl,1,3,(i,j)=>j===2?'#c9a23a':'#2a2622');
          const tp=P(am,(bc0+bc1)/2,E.H+E.R+9);fp(sg,[P(am-.9,bc1+.2,E.H+E.R+4),P(am+.9,bc1+.2,E.H+E.R+4),tp],'#6c7884');fp(sg,[P(am+.9,bc1+.2,E.H+E.R+4),P(am+.9,bc0-.2,E.H+E.R+4),tp],'#4f5963');
          RC(sg,tp[0],tp[1]-2,1,2,'#3a3d44');}
        // 門燈
        const lp=P(6,E.b1,10);RC(sg,lp[0],lp[1],2,1,'#2a2622');RC(sg,lp[0],lp[1]+1,2,2,'#e8d9a8');RC(sng,lp[0],lp[1]+1,2,2,'#ffe6a8');});
      // 閥室（矮，屋脊沿 a）
      const V={a0:9,b0:1,a1:13.5,b1:5,H:11,R:5};
      sh.push([V.a0,V.b0,V.a1,V.b1,2]);
      S.o(16,(sg,sng)=>{house(sg,{...V,ridge:'a',texL:TX.brick(BR,73),texR:TX.brick(BRD,74),plinth:[2,'#a39d8e','#7b766b']});
        faceB(sg,V.a0,V.a1,V.b1,8,9,'#ddd4c0');faceA(sg,V.a1,V.b0,V.b1,8,9,'#b3ab98');
        // 受光長牆下段被出水口頭牆擋住 ⇒ 只開高窗；門開在背光山牆（前方是空地）
        for(const a of [9.5,12])win(sg,sng,'b',a,V.b1,4,2,4,{arch:true,head:STONE,glass:'#34475a',lit:a>10});
        door(sg,'a',V.a1,3.75,0,3,7,{col:'#3f5a4a',inner:'#2f4539',head:'#b3ab98',step:'#9a927f'});});
      // 出水口頭牆（渠的後端、閥室門前）：4px 高，受光面開出水口，水從口裡翻出
      S.o(19,(sg)=>{box(sg,CA0-.2,CB0-1,CA1+.2,CB0,0,4,'#d2c9b4',TX.stone('#c4bba5',75),TX.stone('#9a927f',76));
        BL(sg,P(CA0-.2,CB0,4),P(CA1+.2,CB0,4),'#e6dfcd');
        const[O,sl]=L.fpt('b',CA0+1,CB0,0);L.cols(sg,O,sl,4,3,(i,j)=>j===2?'#cfe3ec':(j===0&&(i===0||i===3))?null:'#1d2a33');});
      // 前庭煤氣燈
      S.t(1.3+13.6+.3,(g2,n2)=>{const p=P(1.3,13.6);RC(g2,p[0],p[1]-10,1,10,'#2e3336');RC(g2,p[0]-1,p[1]-1,3,1,'#2e3336');RC(g2,p[0]-1,p[1]-13,3,3,'#2a2622');RC(g2,p[0]-1,p[1]-12,3,1,'#e8d9a8');RC(n2,p[0]-1,p[1]-12,3,1,'#ffe6a8');});
    };
    // v1：磚造泵房（屋脊沿 a）＋磚砌調壓塔＋石砌出水涵口與明渠
    const P1=(C)=>{const {L,g,ng,S,sh}=C;const {P,fp,BL,RC,hsh,ground,house,box,faceB,faceA,topF,flat,win,door,TX,pathD}=L;
      ground(g,(a,b,x,y)=>{if(b>=11.5&&b<15&&a>=4)return (b<12||b>=14.5)?'#b9b3a3':(hsh(x,y,3)<.14?'#7fb0cc':'#4d82a3');
        const q=hsh(x,y,5);return q<.2?'#9a968b':q>.85?'#b3afa3':'#a6a296';});
      // 出水涵口頭牆
      S.o(17,(sg)=>{box(sg,3,11,4.5,15.5,0,6,'#d2c9b4','#c4bba5','#9a927f');const[O,sl]=L.fpt('a',4.5,14.3,0);
        L.cols(sg,O,sl,5,4,(i,j)=>{const off=L.archOff(i,5);return j<off?null:'#1d2226';});L.cols(sg,[O[0]-1,O[1]+.5],sl,7,5,(i,j)=>{const off=L.archOff(i,7);return j===off?'#e6ddc8':null;});});
      // 泵房
      sh.push([6,2,15,10,3]);
      S.o(16.5,(sg,sng)=>{const br=TX.brick(BR,81),brR=TX.brick(BRD,82);
        house(sg,{a0:6,b0:2,a1:15,b1:10,H:20,R:9,ridge:'a',texL:br,texR:brR,plinth:[2,'#a39d8e','#7b766b']});
        // 屋脊百葉通風亭（維多利亞泵房的招牌）：底部埋進屋面，不浮空
        {const va0=9.8,va1=11.6,vb0=5.1,vb1=6.9;
          box(sg,va0,vb0,va1,vb1,26,6,'#e1d9c6',(s,r)=>r%2?'#8c8472':'#ddd4c0',(s,r)=>r%2?'#6a6356':'#b3ab98');
          const tp=P((va0+va1)/2,6,37);fp(sg,[P(va0-.4,vb1+.4,32),P(va1+.4,vb1+.4,32),tp],'#6c7884');fp(sg,[P(va1+.4,vb1+.4,32),P(va1+.4,vb0-.4,32),tp],'#4f5963');
          RC(sg,tp[0],tp[1]-2,1,2,'#3a3d44');}
        // 石帶
        faceB(sg,6,15,10,15,16,'#ddd4c0');faceA(sg,15,2,10,15,16,'#b3ab98');
        for(const a of [7,12.5])win(sg,sng,'b',a,10,3,3,10,{arch:true,head:STONE,glass:'#34475a',rail:true,lit:true});
        door(sg,'b',9.8,10,0,4,10,{arch:true,head:STONE,col:'#3f5a4a',inner:'#2f4539'});
        // 山牆圓窗
        const[O,sl]=L.fpt('a',15,7.5,13);const ring=(i,j)=>(i-2)*(i-2)+(j-2)*(j-2);
        L.cols(sg,O,sl,5,5,(i,j)=>{const d=ring(i,j);return d>5?null:d>=3?'#ddd4c0':(i===1&&j===1?'#7f9db4':'#34475a');});
        L.cols(sng,O,sl,5,5,(i,j)=>ring(i,j)<3?'#ffd68a':null);
        const lp=P(11.8,10,12);RC(sg,lp[0],lp[1],2,1,'#2a2622');RC(sg,lp[0],lp[1]+1,2,2,'#e8d9a8');RC(sng,lp[0],lp[1]+1,2,2,'#ffe6a8');});
      // 調壓塔（磚砌方塔、石帶、拱窗、疊澀簷口、四坡頂）
      sh.push([1,3,6,8,5]);
      S.o(9,(sg,sng)=>{const br=TX.brick(BR,83),brR=TX.brick(BRD,84),a0=1,b0=3,a1=6,b1=8,Ht=62;
        faceB(sg,a0,a1,b1,0,Ht,br);faceA(sg,a1,b0,b1,0,Ht,brR);
        for(const z of [2,24,46]){faceB(sg,a0,a1,b1,z,z+1,'#ddd4c0');faceA(sg,a1,b0,b1,z,z+1,'#b3ab98');}
        for(const z of [8,30])win(sg,sng,'b',a0+1.5,b1,z,2,7,{arch:true,head:STONE,glass:'#2e3d4c',sill:true,lit:z===30});
        win(sg,sng,'a',a1,b1-1.5,34,2,6,{arch:true,head:'#b3ab98',glass:'#2e3d4c'});
        // 疊澀
        box(sg,a0-.5,b0-.5,a1+.5,b1+.5,Ht,3,'#c7bea9','#ddd4c0','#b3ab98');
        box(sg,a0-.5,b0-.5,a1+.5,b1+.5,Ht+3,5,BR,SH(BR,6),BRD);
        for(let k=0;k<3;k++){const p=P(a0+.5+k*1.7,b1+.5,Ht+4);RC(sg,p[0],p[1]-2,2,2,'#2e3d4c');}
        box(sg,a0-.8,b0-.8,a1+.8,b1+.8,Ht+8,2,'#d2c9b4','#e1d9c6','#b3ab98');
        const tp=P((a0+a1)/2,(b0+b1)/2,Ht+19);
        fp(sg,[P(a0-.8,b1+.8,Ht+10),P(a1+.8,b1+.8,Ht+10),tp],'#6c7884');fp(sg,[P(a1+.8,b1+.8,Ht+10),P(a1+.8,b0-.8,Ht+10),tp],'#4f5963');
        RC(sg,tp[0],tp[1]-4,1,4,'#3a3d44');RC(sg,tp[0]-1,tp[1]-5,3,1,'#c23d33');RC(sng,tp[0]-1,tp[1]-5,3,1,'#ff6a5a');});
      // 明渠上的鐵柵欄
      S.t(21.8,(g2)=>{for(let a=5;a<16;a+=1.5){const p=P(a,11.3);RC(g2,p[0],p[1]-4,1,4,'#3c4247');}BL(g2,P(5,11.3,4),P(16,11.3,4),'#4c5359');});
    };
    // v2：兩棟泵房退到地塊後半成 L 形，前半整片是進水池（前三分之一以上）：
    //     水 → 前方一排等距細鋼條攔污柵 → 橫跨池心的石閘牆（兩孔閘門＋兩根細綠絞盤柱、暗紅小手輪）→ 內池 → 泵房牆腳進水口。
    //     磚煙囪站在右後角自己的石座上（看得到底座），不從屋頂谷裡長出來。
    const P2=(C)=>{const {L,g,ng,S,sh}=C;const {P,fp,BL,RC,hsh,ground,house,box,faceB,faceA,topF,flat,win,door,TX}=L;
      const PA=6.6,PE=15.6;   // 池：a、b ∈ [PA,PE)，9×9 步＝地塊前三分之一
      // 閘牆沿 b、放在池心偏前；等距視角下高 h 的牆會吃掉身後 h/2 步的水面 ⇒ 牆只砌 3px 高，內池留 3 步以上看得到
      const GA0=11.2,GA1=12.2,GM=(GA0+GA1)/2,GH=2;
      const RA=14.3;           // 攔污柵
      const GATES=[[9.2,10.7],[12.4,13.9]];  // 兩孔閘門（沿 b 的區段）
      ground(g,(a,b,x,y)=>{
        if(a>=PA&&b>=PA&&a<PE&&b<PE){
          if(a<PA+.6||b<PA+.6||a>=PE-.5||b>=PE-.5)return COPE(x,y);
          if(a<PA+1.1)return hsh(x,y,7)<.3?'#6f685d':'#7d766a';   // 背光內壁（看得到池深）
          if(b<PA+1.1)return hsh(x,y,7)<.3?'#8a8274':'#978f80';   // 受光內壁
          return WATER(x,y,hsh,a<GA0);}
        return PAVE(x,y,hsh);});
      // 左泵房（屋脊沿 b，受光山牆朝前）：山牆 11 欄 AX-19…AX-9、中欄 AX-14
      const LH={a0:.5,b0:1.5,a1:6,b1:10,H:20,R:8};
      sh.push([LH.a0,LH.b0,LH.a1,LH.b1,2.5]);
      S.o(14,(sg,sng)=>{house(sg,{...LH,ridge:'b',texL:TX.brick(BR,93),texR:TX.brick(BRD,94),plinth:[2,'#a39d8e','#7b766b']});
        faceB(sg,LH.a0,LH.a1,LH.b1,16,17,'#ddd4c0');faceA(sg,LH.a1,LH.b0,LH.b1,16,17,'#b3ab98');
        for(const a of [1,4.5])win(sg,sng,'b',a,LH.b1,3,2,10,{arch:true,head:STONE,glass:'#34475a',lit:a<2});
        door(sg,'b',2.5,LH.b1,0,3,9,{arch:true,head:STONE,col:'#3f5a4a',inner:'#2f4539',step:'#c9c1ae'});
        {const[O,sl]=L.fpt('b',2,LH.b1,21);const ring=(i,j)=>(i-2)*(i-2)+(j-2)*(j-2);
          L.cols(sg,O,sl,5,5,(i,j)=>{const d=ring(i,j);return d>5?null:d>=3?'#ddd4c0':(i===1&&j===1?'#7f9db4':'#34475a');});}
        for(const b of [9.5,7.5])win(sg,sng,'a',LH.a1,b,4,2,10,{arch:true,head:'#b3ab98',glass:'#2e3d4c',lit:b<8});});
      // 右泵房（屋脊沿 a，受光長牆朝水池）：長牆 15 欄 AX+1…AX+15、中欄 AX+8
      const RH={a0:6,b0:.5,a1:13.5,b1:5.5,H:20,R:8};
      sh.push([RH.a0,RH.b0,RH.a1,RH.b1,2.5]);
      S.o(14.1,(sg,sng)=>{house(sg,{...RH,ridge:'a',texL:TX.brick(BR,95),texR:TX.brick(BRD,96),plinth:[2,'#a39d8e','#7b766b']});
        faceB(sg,RH.a0,RH.a1,RH.b1,16,17,'#ddd4c0');faceA(sg,RH.a1,RH.b0,RH.b1,16,17,'#b3ab98');
        for(const a of [7,11.5])win(sg,sng,'b',a,RH.b1,4,2,10,{arch:true,head:STONE,glass:'#34475a',lit:a<8});
        door(sg,'b',9,RH.b1,0,3,10,{arch:true,head:STONE,col:'#3f5a4a',inner:'#2f4539',step:'#c9c1ae'});
        {const[O,sl]=L.fpt('b',9,RH.b1,12);L.cols(sg,O,sl,3,2,(i,j)=>j?'#cfc6b0':'#e3dbc8');} // 門楣紀年石
        // 背光山牆：高拱窗＋山尖小圓窗（10 欄 AX+16…AX+25）
        win(sg,sng,'a',RH.a1,3.5,4,2,10,{arch:true,head:'#b3ab98',glass:'#2e3d4c'});
        {const[O,sl]=L.fpt('a',RH.a1,4,21);L.cols(sg,O,sl,4,4,(i,j)=>{const e=(i===0||i===3)&&(j===0||j===3);if(e)return null;return (i===1||i===2)&&(j===1||j===2)?'#34475a':'#b3ab98';});
          L.cols(sng,O,sl,4,4,(i,j)=>(i===1||i===2)&&(j===1||j===2)?'#ffd68a':null);}
        const lp=P(10.5,RH.b1,11);RC(sg,lp[0],lp[1],2,1,'#2a2622');RC(sg,lp[0],lp[1]+1,2,2,'#e8d9a8');RC(sng,lp[0],lp[1]+1,2,2,'#ffe6a8');});
      // 煙囪：右後角、站在自己的石座上（座腳前方是空地，看得到落地）
      sh.push([13.9,.3,15.9,2.3,6]);
      S.o(17,(sg,sng)=>{const Hc=50,a0=14.3,a1=15.5,b0=.7,b1=1.9;
        box(sg,13.9,.3,15.9,2.3,0,4,'#d2c9b4',TX.stone('#c4bba5',91),TX.stone('#9a927f',92));
        BL(sg,P(13.9,2.3,4),P(15.9,2.3,4),'#e6dfcd');
        faceB(sg,a0,a1,b1,4,Hc,TX.brick(BR,93));faceA(sg,a1,b0,b1,4,Hc,TX.brick(BRD,94));
        for(const z of [20,36]){faceB(sg,a0,a1,b1,z,z+1,'#ddd4c0');faceA(sg,a1,b0,b1,z,z+1,'#b3ab98');}
        box(sg,a0-.35,b0-.35,a1+.35,b1+.35,Hc,2,'#d2c9b4','#e1d9c6','#b3ab98');box(sg,a0,b0,a1,b1,Hc+2,2,'#3a302b',SH(BR,-10),BRD);
        const t=P((a0+a1)/2,(b0+b1)/2,Hc+4);RC(sg,t[0],t[1]-5,1,4,'#3a3d44');RC(sg,t[0],t[1]-6,1,1,'#c23d33');RC(sng,t[0],t[1]-6,1,1,'#ff6a5a');});
      // 水池前緣石緣（高 1 的矮壓頂，落地）
      S.t(PE+PE,(g2)=>{faceB(g2,PA,16,16,0,1,'#bdb4a0');faceA(g2,16,PA,16,0,1,'#968e7c');});
      // 攔污柵：一排等距細鋼條立在水裡＋頂橫檔（在閘牆前方，兩側都看得到水）
      S.t(RA+(PA+PE)/2,(g2)=>{for(let b=PA+1;b<PE-.6;b+=1){const p=P(RA,b);RC(g2,p[0],p[1]-3,1,3,'#3a4146');RC(g2,p[0],p[1],1,1,'#9cc4dc');}
        BL(g2,P(RA,PA+.8,3),P(RA,PE-.8,3),'#5a6166');});
      // 進水閘牆：從池底砌起、橫跨池心（2px 矮石牆、不描粗外框，免得在池心變成一塊米色大磚）；兩孔木閘板嵌在牆面、比牆頂高 1px
      S.t(GM+(PA+PE)/2,(sg)=>{
        box(sg,GA0,PA+.6,GA1,PE-.5,0,GH,'#c9c0ab',TX.stone('#b5ac97',97),TX.stone('#8c8472',98));
        BL(sg,P(GA0,PE-.5,GH),P(GA1,PE-.5,GH),'#ddd4c0');BL(sg,P(GA1,PE-.5,0),P(GA1,PA+.6,0),'#2b3a44');
        for(const[s0,s1]of GATES){faceA(sg,GA1,s0,s1,0,GH+1,(s,r)=>r===GH?'#8a6d49':r%2?'#5a4130':'#6b5238');}});
      // 閘門絞盤：每孔一根 2px 細綠柱＋暗紅小手輪，不描外框、不擋泵房門窗
      S.t(GM+(PA+PE)/2+.2,(g2)=>{for(const[s0,s1]of GATES){const t=P(GM,(s0+s1)/2,GH);RC(g2,t[0],t[1]-4,1,4,'#3f5c48');RC(g2,t[0]+1,t[1]-4,1,4,'#2e4636');
        RC(g2,t[0]-1,t[1]-5,4,1,'#6e2620');RC(g2,t[0],t[1]-5,1,1,'#3a1a16');}});
    };
    const L0=makePump(0,P0),L1=makePump(1,P1),L2=makePump(2,P2);
    B['130_1_0']=L0;B['130_1_1']=L1;B['130_1_2']=L2;REP.pump={sc:SC===undefined?'undefined':SC};
  };

  try{buildFarms();}catch(e){REP.err.push('k23 '+(e&&e.stack||e));console.error('bay_a k23',e);}
  try{buildPumps();}catch(e){REP.err.push('k130 '+(e&&e.stack||e));console.error('bay_a k130',e);}
});
