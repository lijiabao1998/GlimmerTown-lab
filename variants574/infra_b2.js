// T575 infra_b2：k153 淨水處理廠（3×3）／k154 清水庫（4×4）真實設施風格重畫。
// 分層合成：每個立體主體自成一層（二值化＋深色外框），欄杆／管線／細桿走不描邊層；夜光按層遮擋（後層實體擦掉被擋住的燈）。
// 零亂數：只用 K.hsh 決定性雜湊。光從左：+v 面亮、+u 面暗；落影向右。
(window.__variants574=window.__variants574||[]).push(function infra_b2(A){
  const B=A.SPR().bld;const DEV=false;

  // ================= 共用工具 =================
  const C={lip:'#dcd8cd',cL:'#cbc6b9',cR:'#a39d91',inL:'#b6b0a2',inD:'#857f75',
    wSet:'#4b8ca5',wSetH:'#78b6ca',wSetD:'#3b768c',wFloc:'#6a8c7b',wFlocH:'#8fad99',wFlocD:'#587868',wFil:'#56a2ba',wFilH:'#86c3d4',
    stl:'#8e9ba1',stlL:'#a9b4b9',stlR:'#6e7b81',rail:'#e0bf4c',
    wallL:'#e6e0ce',wallR:'#c0b8a4',roof:'#8b969c',roofL:'#9fa9ae',roofD:'#6f7a80',par:'#c9ccc8',
    win:'#4b6f8a',winD:'#3d5a70',lit:'#ffe2a0',door:'#5c5852',
    lawn:'#76a058',lawnD:'#68914e',lawnH:'#85ad66',asph:'#7e7b76',asphE:'#a19d95',pad:'#c6c2b8',mark:'#e8e4d8',
    grass:'#86b364',grassD:'#79a659',
    tank:['#dfe3e1','#f3f5f2','#eceeeb','#d7dbd9','#bcc2c2','#a6adae'],tankTop:'#e8ebe8',tankRim:'#b9bfbf'};
  const LIB=K=>{
    const {W,H,AX,SZ,TOPY,P,hsh,poly}=K;
    const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=Math.round(a[0]),y0=Math.round(a[1]);const x1=Math.round(b[0]),y1=Math.round(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let n=0;n<900;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      poly(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      poly(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      poly(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const quad=(g,u0,v0,du,dv,c,z=0)=>poly(g,[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)],c);
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);
      for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));g.fillRect(cx-w,cy+y,2*w+1,1);}};
    const ring=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);let pw=-1;
      for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
        const yn=Math.abs(y)+1,wn=yn>ry?-1:Math.round(rx*Math.sqrt(Math.max(0,1-(yn*yn)/((ry+.5)*(ry+.5)))));
        const s=Math.max(1,w-wn);g.fillRect(cx-w,cy+y,s,1);g.fillRect(cx+w-s+1,cy+y,s,1);}};
    // 直立圓柱：tones 由左到右（亮在左偏中、暗在右）
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,Math.round(rx/2));cx=Math.round(cx);cy=Math.round(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));g.fillStyle=c;g.fillRect(cx+x,cy-h,1,h+yb+1);}
      if(top){if(rim){ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-1,Math.max(0,ry-1),top);}else ell(g,cx,cy-h,rx,ry,top);}
      return[cx,cy-h,ry];};
    const RX=r=>Math.max(2,Math.round(r*45.25));   // 等距圓半徑（格）→ 螢幕 rx
    // 像素平行四邊形窗：+v 面（斜率 +.5）／+u 面（斜率 −.5）；(x,y) 為左上
    const pgL=(g,x,y,w,h,c)=>{g.fillStyle=c;x=Math.round(x);y=Math.round(y);for(let i=0;i<w;i++)g.fillRect(x+i,y+(i>>1),1,h);};
    const pgR=(g,x,y,w,h,c)=>{g.fillStyle=c;x=Math.round(x);y=Math.round(y);for(let i=0;i<w;i++)g.fillRect(x+i,y-(i>>1),1,h);};
    // 沿 +v 面（v=常數）在 u∈[ua,ub] 均分 n 窗；z 為窗底高
    const rowL=(g,ng,v,ua,ub,z,h,n,w,c,lit,seed,p=.65)=>{for(let i=0;i<n;i++){const t=ua+(ub-ua)*(i+.5)/n,q=P(t-w/64,v,z+h);
      pgL(g,q[0],q[1],w,h,c);if(ng&&lit&&hsh(seed,i,7)<p)pgL(ng,q[0],q[1],w,h,lit);}};
    const rowR=(g,ng,u,va,vb,z,h,n,w,c,lit,seed,p=.65)=>{for(let i=0;i<n;i++){const t=va+(vb-va)*(i+.5)/n,q=P(u,t+w/64,z+h);
      pgR(g,q[0],q[1],w,h,c);if(ng&&lit&&hsh(seed,i,9)<p)pgR(ng,q[0],q[1],w,h,lit);}};
    // 場景：o=立體主體（描外框）、t=細線層（不描邊）；依 d 由後往前；落影先畫在地面
    const scene=()=>{const items=[],SH=[];let n=0;
      const S={o:(d,fn)=>items.push({d,ol:1,fn,i:n++}),t:(d,fn)=>items.push({d,ol:0,fn,i:n++}),
        shB:(u0,v0,du,dv,h)=>SH.push([0,u0,v0,du,dv,h]),shC:(u,v,r,h)=>SH.push([1,u,v,r,h]),
        run:(g,ng,fence=true)=>{
          if(SH.length){const[sc,sx]=A.cv(W,H);const k0='#000';
            for(const s of SH){const k=Math.round(s[5]*.55),dy=-Math.round(s[5]*.12);
              if(s[0]===0){const[,u0,v0,du,dv]=s;const F=[P(u0,v0),P(u0+du,v0),P(u0+du,v0+dv),P(u0,v0+dv)],T=F.map(p=>[p[0]+k,p[1]+dy]);
                poly(sx,F,k0);poly(sx,T,k0);for(let i=0;i<4;i++)poly(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],k0);}
              else{const[,u,v,r]=s;const c=P(u,v),rx=RX(r),ry=Math.max(1,Math.round(rx/2));
                ell(sx,c[0],c[1],rx,ry,k0);ell(sx,c[0]+k,c[1]+dy,rx,ry,k0);poly(sx,[[c[0],c[1]-ry],[c[0]+k,c[1]+dy-ry],[c[0]+k,c[1]+dy+ry],[c[0],c[1]+ry]],k0);}}
            K.hard(sc);const[tc,tx]=A.cv(W,H);tx.fillStyle='#17222c';tx.fillRect(0,0,W,H);tx.globalCompositeOperation='destination-in';tx.drawImage(sc,0,0);
            g.save();g.globalAlpha=.26;g.globalCompositeOperation='source-atop';g.drawImage(tc,0,0);g.restore();}
          if(fence)K.backFence(g);
          items.sort((a,b)=>a.d-b.d||a.i-b.i);
          for(const it of items){const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);it.fn(sx,lx);K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
            g.drawImage(sc,0,0);ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
        }};
      return S;};
    // ---- 地面 ----
    const lawn=(g,seed)=>{A.dia(g,AX,TOPY,32*SZ,C.lawn);
      for(let i=0;i<Math.round(26*SZ*SZ);i++){const u=hsh(seed,i,1)*SZ,v=hsh(seed,i,2)*SZ,p=P(u,v,0);RC(g,p[0],p[1],2,1,hsh(seed,i,3)<.5?C.lawnD:C.lawnH);}
      A.diaEdge(g,6,'#5c8444',AX,TOPY,32*SZ);A.diaEdge(g,9,'#8fb56f',AX,TOPY,32*SZ);};
    const asph=(g,u0,v0,du,dv)=>{quad(g,u0,v0,du,dv,C.asphE);quad(g,u0+.02,v0+.02,du-.04,dv-.04,C.asph);};
    const stalls=(g,u0,v0,du,dv,n,alongU=true)=>{for(let i=0;i<=n;i++){if(alongU){const u=u0+du*i/n;BL(g,P(u,v0),P(u,v0+dv*.45),C.mark);}else{const v=v0+dv*i/n;BL(g,P(u0,v),P(u0+du*.45,v),C.mark);}}};
    // ---- 元件 ----
    // 開放式矩形水池：外牆盒＋內緣＋下沉水面（後內牆可見）＋水紋
    const basin=(S,u0,v0,du,dv,h,wc,o={})=>{
      const d=o.d!==undefined?o.d:u0+v0+(du+dv)/2;
      S.shB(u0,v0,du,dv,h);
      const t=o.t||.035,wd=o.wd||2,ui0=u0+t,vi0=v0+t,ui1=u0+du-t,vi1=v0+dv-t;
      const G={u0,v0,du,dv,h,u1:u0+du,v1:v0+dv,ui0,vi0,ui1,vi1,wz:h-wd,d};
      S.o(d,(g,ng)=>{
        boxZ(g,u0,v0,du,dv,0,h,C.lip,C.cL,C.cR);
        const Lp=P(ui0,vi1,h),T=P(ui0,vi0,h),R=P(ui1,vi0,h),Bt=P(ui1,vi1,h);
        poly(g,[Lp,T,R,Bt],C.inL);
        poly(g,[Lp,T,[T[0],T[1]+wd],[Lp[0]+wd,Lp[1]+wd/2]],C.inD);
        if(wc){poly(g,[[Lp[0]+wd,Lp[1]+wd/2],[T[0],T[1]+wd],[R[0]-wd,R[1]+wd/2],Bt],wc);
          const hl=o.hl||C.wSetH,nr=Math.round((ui1-ui0)*(vi1-vi0)*(o.rip===undefined?14:o.rip));
          for(let i=0;i<nr;i++){const u=ui0+.06+hsh(o.seed||3,i,1)*(ui1-ui0-.12),v=vi0+.06+hsh(o.seed||3,i,2)*(vi1-vi0-.12),p=P(u,v,G.wz);RC(g,p[0],p[1],2+(hsh(o.seed||3,i,3)*2|0),1,hl);}}
        if(o.deco)o.deco(g,ng,G);
      });
      if(o.fine)S.t(d+.001,(g,ng)=>o.fine(g,ng,G));
      return G;};
    // 移動式刮泥機走道橋（橫跨 v）
    const bridgeV=(S,G,u)=>{const va=G.v0-.015,vb=G.v1+.015,z=G.h;
      S.o(G.d+.002,g=>{boxZ(g,u,va,.05,vb-va,z,2,C.stlL,C.stl,C.stlR);boxZ(g,u,vb-.07,.05,.05,z+2,3,'#8a978c','#a0ada2','#6c796f');});
      S.t(G.d+.003,g=>{const uu=u+.05;BL(g,P(uu,va+.02,z+5),P(uu,vb-.08,z+5),C.rail);
        for(let i=0;i<=2;i++){const v=va+.02+(vb-.1-va)*i/2;BL(g,P(uu,v,z+2),P(uu,v,z+5),C.rail);}});};
    const bridgeU=(S,G,v)=>{const ua=G.u0-.015,ub=G.u1+.015,z=G.h;
      S.o(G.d+.002,g=>{boxZ(g,ua,v,ub-ua,.05,z,2,C.stlL,C.stl,C.stlR);boxZ(g,ub-.07,v,.05,.05,z+2,3,'#8a978c','#a0ada2','#6c796f');});
      S.t(G.d+.003,g=>{const vv=v+.05;BL(g,P(ua+.02,vv,z+5),P(ub-.08,vv,z+5),C.rail);
        for(let i=0;i<=2;i++){const u=ua+.02+(ub-.1-ua)*i/2;BL(g,P(u,vv,z+2),P(u,vv,z+5),C.rail);}});};
    // 水中橫牆／集水槽（沿 v 或沿 u 的細牆頂）
    const wallV=(g,G,u,col=C.lip,dk=C.inD)=>{BL(g,P(u,G.vi0,G.wz),P(u,G.vi1,G.wz),dk);BL(g,P(u,G.vi0,G.h),P(u,G.vi1,G.h),col);BL(g,P(u,G.vi0,G.h-1),P(u,G.vi1,G.h-1),col);};
    const wallU=(g,G,v,col=C.lip,dk=C.inD)=>{BL(g,P(G.ui0,v,G.wz),P(G.ui1,v,G.wz),dk);BL(g,P(G.ui0,v,G.h),P(G.ui1,v,G.h),col);BL(g,P(G.ui0,v,G.h-1),P(G.ui1,v,G.h-1),col);};
    const troughV=(g,G,u,dk)=>{BL(g,P(u,G.vi0,G.wz+1),P(u,G.vi1,G.wz+1),C.lip);BL(g,P(u,G.vi0,G.wz),P(u,G.vi1,G.wz),dk);};
    const troughU=(g,G,v,dk)=>{BL(g,P(G.ui0,v,G.wz+1),P(G.ui1,v,G.wz+1),C.lip);BL(g,P(G.ui0,v,G.wz),P(G.ui1,v,G.wz),dk);};
    // 雙坡屋頂房（屋脊沿 u）
    // o.z：底高（站在池頂等平台上時用；此時落影改畫在平台面上，由 o.shCol 指定平台暗色）
    const gable=(S,u0,v0,du,dv,h,rh,o={})=>{const d=o.d!==undefined?o.d:u0+v0+(du+dv)/2,z=o.z||0;
      if(!z)S.shB(u0,v0,du,dv,h+rh);
      else if(o.shCol)S.t(d-.001,g=>{const k=Math.round((h+rh)*.55),dy=-Math.round((h+rh)*.12),a=P(u0+du,v0,z),b=P(u0+du,v0+dv,z),f=P(u0,v0+dv,z);
        poly(g,[a,[a[0]+k,a[1]+dy],[b[0]+k,b[1]+dy],[f[0]+k,f[1]+dy],f,b],o.shCol);});
      const wl=o.wl||C.wallL,wr=o.wr||C.wallR,rl=o.rl||'#8a959b',rd=o.rd||'#6c767c';
      S.o(d,(g,ng)=>{const u1=u0+du,v1=v0+dv,vm=v0+dv/2,e=.025,zh=z+h;
        boxZ(g,u0,v0,du,dv,z,h,wl,wl,wr);
        poly(g,[P(u0-e,v0-e,zh-1),P(u1+e,v0-e,zh-1),P(u1+e,vm,zh+rh),P(u0-e,vm,zh+rh)],rd);
        poly(g,[P(u1,v0,zh),P(u1,v1,zh),P(u1,vm,zh+rh)],wr);
        poly(g,[P(u0-e,v1+e,zh-1),P(u1+e,v1+e,zh-1),P(u1+e,vm,zh+rh),P(u0-e,vm,zh+rh)],rl);
        BL(g,P(u0-e,vm,zh+rh),P(u1+e,vm,zh+rh),o.ridge||'#b7c0c4');
        if(o.seams)for(let t=u0+.06;t<u1;t+=.06)BL(g,P(t,v1+e,zh),P(t,vm,zh+rh-1),o.seams);
        if(o.deco)o.deco(g,ng,{u0,v0,u1,v1,vm,h,rh,z});});};
    // 平頂房：女兒牆＋屋頂設備
    const flat=(S,u0,v0,du,dv,h,o={})=>{const d=o.d!==undefined?o.d:u0+v0+(du+dv)/2;S.shB(u0,v0,du,dv,h);
      S.o(d,(g,ng)=>{const u1=u0+du,v1=v0+dv;
        boxZ(g,u0,v0,du,dv,0,h,o.roof||C.par,o.wl||C.wallL,o.wr||C.wallR);
        quad(g,u0+.03,v0+.03,du-.06,dv-.06,o.rin||C.roof,h);
        if(o.deco)o.deco(g,ng,{u0,v0,u1,v1,h});});};
    // 化學藥劑儲槽（FRP 立式槽）
    const tank=(S,u,v,r,h,o={})=>{S.shC(u,v,r,h);const d=o.d!==undefined?o.d:u+v;
      S.o(d,(g,ng)=>{const p=P(u,v,o.z||0),rx=RX(r);const[cx,cy,ry]=cyl(g,p[0],p[1],rx,h,o.tones||C.tank,o.top||C.tankTop,o.rim||C.tankRim);
        if(o.band)RC(g,cx-rx,cy+Math.round(h*.35),2*rx+1,1,o.band);
        RC(g,cx-rx+2,cy+1,1,h-1,'#8f9696');for(let y=cy+3;y<cy+h;y+=3)RC(g,cx-rx+1,y,3,1,'#8f9696');   // 爬梯
        RC(g,cx-1,cy-ry+1,3,1,'#9aa1a1');
        if(o.warn){RC(g,cx,cy-ry-1,1,1,'#c0392b');if(ng)RC(ng,cx,cy-ry-1,1,1,'#ff5a4a');}});};
    // 覆土清水池：草皮頂＋混凝土壓頂＋通氣管＋人孔
    const vent=(g,p,tall=4)=>{RC(g,p[0],p[1]-tall,1,tall,'#6c7378');RC(g,p[0]-1,p[1]-tall-1,3,1,'#e3e6e6');RC(g,p[0]-1,p[1]-tall,3,1,'#9aa2a6');};
    const hatch=(g,p)=>{RC(g,p[0]-2,p[1]-1,5,2,'#8c9294');RC(g,p[0]-1,p[1]-1,3,1,'#b3b8b9');};
    const tree=(S,u,v,s=1,seed=0)=>{S.shC(u,v,.05*s,15*s);S.o(u+v+.03,g=>{const p=P(u,v),r=Math.round(3.5*s)+(hsh(seed,u*100|0,v*100|0)<.5?0:1),cy=p[1]-5-r;
      RC(g,p[0],p[1]-5,1,5,'#5b4630');ell(g,p[0],cy,r+1,r,'#3b7036');ell(g,p[0]-1,cy-1,r-1,Math.max(1,r-2),'#4e8b42');RC(g,p[0]-2,cy-2,2,1,'#6ea85a');RC(g,p[0]+1,cy+1,1,1,'#2f5c2c');});};
    const lamp=(S,u,v)=>S.o(u+v+.02,(g,ng)=>K.pole(g,ng,u,v));
    const car=(S,u,v,col,dk,alongU=true)=>S.o(u+v+.04,g=>{const du=alongU?.1:.055,dv=alongU?.055:.1;
      boxZ(g,u,v,du,dv,0,3,col,col,dk);
      boxZ(g,u+(alongU?.025:.008),v+(alongU?.008:.025),alongU?.05:.04,alongU?.04:.05,3,2,'#cfd8dc','#6f8796','#556b78');});
    // 圓形池（澄清池／污泥濃縮池）：混凝土圓筒＋內牆＋下沉水面＋周邊溢流槽＋中心筒＋半徑走道橋
    const CONC=['#c7c2b5','#d6d1c4','#cec9bc','#bdb7aa','#a8a296','#989286'];
    const clarifier=(S,cu,cv,r,h,o={})=>{const d=o.d!==undefined?o.d:cu+cv;S.shC(cu,cv,r,h);
      let G=null;
      S.o(d,(g,ng)=>{const p=P(cu,cv,0),rx=RX(r),ry=Math.round(rx/2);
        const[cx,cy]=cyl(g,p[0],p[1],rx,h,CONC,C.lip,null);G={cx,cy,rx,ry};
        ell(g,cx,cy,rx-2,ry-1,C.inD);ell(g,cx,cy+1,rx-3,ry-2,o.w||C.wSet);
        if(!o.noWeir)ring(g,cx,cy+1,rx-6,Math.max(1,ry-3),C.lip);
        const sd=o.seed||1;for(let i=0;i<Math.round(rx*.7);i++){const a=hsh(sd,i,1)*6.283,rr=.35+hsh(sd,i,2)*.5;RC(g,cx+Math.cos(a)*(rx-5)*rr,cy+1+Math.sin(a)*(ry-3)*rr,2,1,o.hl||C.wSetH);}
        const cr=Math.max(3,Math.round(rx*(o.core||.28))),crY=Math.max(1,Math.round(cr/2));
        ell(g,cx,cy+1,cr,crY,o.coreW||C.wSetD);ring(g,cx,cy+1,cr,crY,C.lip);
        if(o.sludge)ell(g,cx,cy+1,cr-2,Math.max(1,crY-1),o.sludge);
        const bl=cx-rx+1;RC(g,bl,cy-1,cx-bl+1,2,C.stl);RC(g,bl,cy-1,cx-bl+1,1,C.stlL);
        RC(g,cx-3,cy-4,7,4,'#7b878c');RC(g,cx-3,cy-4,7,1,'#a4b0b4');RC(g,cx+2,cy-3,2,3,'#5d686d');
        if(o.arm){RC(g,cx+3,cy,rx-6,1,'#7b878c');}
      });
      S.t(d+.001,g=>{const p=P(cu,cv,0),rx=RX(r),cy=Math.round(p[1])-h,cx=Math.round(p[0]),bl=cx-rx+1;
        RC(g,bl,cy-4,cx-bl-3,1,C.rail);for(let x=bl;x<cx-3;x+=4)RC(g,x,cy-3,1,2,C.rail);});};
    // 紅磚牆面：沿面磚縫（每 3 列一道）
    const brickL=(g,v,ua,ub,z0,z1,c)=>{for(let z=z0+2;z<z1;z+=3)BL(g,P(ua,v,z),P(ub,v,z),c);};
    const brickR=(g,u,va,vb,z0,z1,c)=>{for(let z=z0+2;z<z1;z+=3)BL(g,P(u,va,z),P(u,vb,z),c);};
    // 拱窗（+v 面／+u 面）
    const archL=(g,ng,v,ua,ub,z,h,n,w,c,lit,seed,p=.6,sill)=>{for(let i=0;i<n;i++){const t=ua+(ub-ua)*(i+.5)/n,q=P(t-w/64,v,z+h),x=Math.round(q[0]),y=Math.round(q[1]);
      for(let j=0;j<w;j++){const e=(j===0||j===w-1)?1:0;RC(g,x+j,y+(j>>1)+e,1,h-e,c);if(ng&&lit&&hsh(seed,i,7)<p)RC(ng,x+j,y+(j>>1)+e,1,h-e,lit);
        if(sill)RC(g,x+j,y+(j>>1)+h,1,1,sill);}}};
    const archR=(g,ng,u,va,vb,z,h,n,w,c,lit,seed,p=.6,sill)=>{for(let i=0;i<n;i++){const t=va+(vb-va)*(i+.5)/n,q=P(u,t+w/64,z+h),x=Math.round(q[0]),y=Math.round(q[1]);
      for(let j=0;j<w;j++){const e=(j===0||j===w-1)?1:0;RC(g,x+j,y-(j>>1)+e,1,h-e,c);if(ng&&lit&&hsh(seed,i,9)<p)RC(ng,x+j,y-(j>>1)+e,1,h-e,lit);
        if(sill)RC(g,x+j,y-(j>>1)+h,1,1,sill);}}};
    // 立式筒倉（支腳＋錐底）
    const silo=(S,u,v,r,h,leg,o={})=>{S.shC(u,v,r,h+leg);S.o(o.d!==undefined?o.d:u+v,(g,ng)=>{const p=P(u,v,0),rx=RX(r),ry=Math.max(1,Math.round(rx/2)),x=Math.round(p[0]),y=Math.round(p[1]);
      const ax=Math.round(rx*.7),ay=Math.round(ry*.7);
      RC(g,x-ax,y-leg-ay,1,leg,'#6b7478');RC(g,x+ax,y-leg-ay,1,leg,'#6b7478');
      poly(g,[[x-rx,y-leg],[x+rx+1,y-leg],[x+2,y-leg+Math.round(rx*.9)],[x-1,y-leg+Math.round(rx*.9)]],'#b3baba');poly(g,[[x-rx,y-leg],[x,y-leg],[x,y-leg+Math.round(rx*.9)],[x-1,y-leg+Math.round(rx*.9)]],'#cdd3d2');
      RC(g,x,y-leg+Math.round(rx*.9),1,3,'#7d8588');
      RC(g,x-ax,y-leg+ay,1,leg,'#7d8589');RC(g,x+ax,y-leg+ay,1,leg,'#5f686c');
      BL(g,[x-ax,y-Math.round(leg*.4)+ay],[x+ax,y-Math.round(leg*.4)+ay],'#7d8589');
      const[cx,cy,ry2]=cyl(g,x,y-leg,rx,h,o.tones||C.tank,o.top||C.tankTop,o.rim||C.tankRim);
      for(let z=Math.round(h/3);z<h;z+=Math.round(h/3))RC(g,cx-rx,cy+z,2*rx+1,1,'#a9b0b0');
      RC(g,cx-rx+2,cy,1,h,'#7d8588');for(let yy=cy+2;yy<cy+h;yy+=3)RC(g,cx-rx+1,yy,3,1,'#7d8588');
      RC(g,cx-2,cy-ry2-2,5,2,'#9aa1a1');RC(g,cx,cy-ry2-3,1,1,'#c0392b');if(ng)RC(ng,cx,cy-ry2-3,1,1,'#ff5a4a');});};
    // 煙囪（紅磚方筒）
    const chimney=(S,u,v,s,h,o={})=>{S.shB(u,v,s,s,h);S.o(o.d!==undefined?o.d:u+v+s,(g,ng)=>{boxZ(g,u,v,s,s,0,h,'#6d3a2c','#b0593f','#86412f');
      for(let z=4;z<h-4;z+=3){BL(g,P(u,v+s,z),P(u+s,v+s,z),'#9a4d37');BL(g,P(u+s,v,z),P(u+s,v+s,z),'#733627');}
      boxZ(g,u-.015,v-.015,s+.03,s+.03,h-4,3,'#d9d2c2','#e6dfcd','#bdb5a2');quad(g,u+.01,v+.01,s-.02,s-.02,'#2e2a28',h-1);});};
    // 太陽能遮棚（架在水池上）
    const solarCover=(S,G,zc)=>{S.t(G.d+.004,g=>{for(let i=0;i<=4;i++){const u=G.u0+.05+(G.du-.1)*i/4;for(const v of [G.v0+.05,G.v1-.05]){BL(g,P(u,v,G.h),P(u,v,zc),'#6d767b');}}});
      S.o(G.d+.005,g=>{const u0=G.u0-.02,v0=G.v0-.02,du=G.du+.04,dv=G.dv+.04;boxZ(g,u0,v0,du,dv,zc,1,'#2f5878','#4d6f88','#26465f');
        for(let t=v0+.08;t<v0+dv-.02;t+=.08)BL(g,P(u0,t,zc+1),P(u0+du,t,zc+1),'#5f8cb0');
        for(let t=u0+.16;t<u0+du-.02;t+=.16)BL(g,P(t,v0,zc+1),P(t,v0+dv,zc+1),'#22415a');
        BL(g,P(u0,v0,zc+1),P(u0+du,v0,zc+1),'#8fb4d0');});};
    // 壓力容器（活性碳／壓力過濾）
    const BLUE=['#5d88aa','#77a3c6','#6c98bb','#5b83a2','#4a6e8a','#405f78'];
    const vessel=(S,u,v,r,h,o={})=>tank(S,u,v,r,h,Object.assign({tones:BLUE,top:'#7ea8c8',rim:'#5d86a6'},o));
    // 鋸齒屋頂廠房（採光面朝 +u）
    const sawtooth=(S,u0,v0,du,dv,h,n,rh,o={})=>{const d=o.d!==undefined?o.d:u0+v0+(du+dv)/2;S.shB(u0,v0,du,dv,h+rh);
      S.o(d,(g,ng)=>{const u1=u0+du,v1=v0+dv,w=du/n;boxZ(g,u0,v0,du,dv,0,h,C.par,o.wl||C.wallL,o.wr||C.wallR);
        for(let i=0;i<n;i++){const a=u0+i*w,b=a+w;
          poly(g,[P(a,v0,h),P(b,v0,h+rh),P(b,v1,h+rh),P(a,v1,h)],i%2?'#8d989e':'#96a1a6');
          poly(g,[P(b,v0,h),P(b,v1,h),P(b,v1,h+rh),P(b,v0,h+rh)],'#50697b');
          for(let t=v0+.07;t<v1-.02;t+=.07)BL(g,P(b,t,h),P(b,t,h+rh),'#8699a6');
          if(ng)for(let t=v0+.04,j=0;t<v1-.04;t+=.21,j++){if((i+j)%2===0)poly(ng,[P(b,t,h+1),P(b,t+.12,h+1),P(b,t+.12,h+rh-1),P(b,t,h+rh-1)],'rgba(255,226,160,.45)');}
          poly(g,[P(a,v1,h),P(b,v1,h),P(b,v1,h+rh)],o.wl||C.wallL);}
        if(o.deco)o.deco(g,ng,{u0,v0,u1,v1,h});});};
    // 卡車（沿 u，車頭朝 +u）
    const truck=(S,u,v,col,dk)=>S.o(u+v+.06,g=>{boxZ(g,u,v,.22,.08,0,7,'#9aa0a3','#b3b8bb','#80868a');boxZ(g,u+.23,v+.005,.07,.07,0,6,col,col,dk);
      const w=P(u+.3,v+.04,5);RC(g,w[0]-1,w[1],2,2,'#3d5566');});
    return {W,H,AX,SZ,TOPY,P,hsh,poly,RC,BL,boxZ,quad,ell,ring,cyl,RX,pgL,pgR,rowL,rowR,scene,lawn,asph,stalls,basin,bridgeV,bridgeU,wallV,wallU,troughV,troughU,gable,flat,tank,vent,hatch,tree,lamp,car,
      CONC,clarifier,brickL,brickR,archL,archR,silo,chimney,solarCover,BLUE,vessel,sawtooth,truck};
  };
  const build=(k,W,H,AX,AY,SZ,layouts)=>{
    layouts.forEach((lay,v)=>{
      const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K);
      const {c,g,nc,ng,sc}=K.canvases();const S=L.scene();
      const opt=lay(K,L,g,S,v)||{};
      S.run(g,ng,opt.fence!==false);
      B[k+'_1_'+v]=K.finish(c,g,sc,nc,{fence:opt.fence!==false,gate:opt.gate});
    });
  };

  // 覆土／蓋板式清水池：草皮頂（割草條紋）或混凝土蓋板、通氣管陣列、人孔
  const well=(L,S,u0,v0,du,dv,h,o={})=>{const {P,boxZ,quad}=L;S.shB(u0,v0,du,dv,h);
    S.o(o.d!==undefined?o.d:u0+v0+(du+dv)/2,(g,ng)=>{boxZ(g,u0,v0,du,dv,0,h,C.lip,C.cL,C.cR);
      if(o.deck){quad(g,u0+.03,v0+.03,du-.06,dv-.06,'#c7c3b8',h);for(let t=u0+.24;t<u0+du-.1;t+=.24)L.BL(g,P(t,v0+.03,h),P(t,v0+dv-.03,h),'#aeaa9f');}
      else{quad(g,u0+.03,v0+.03,du-.06,dv-.06,C.grass,h);for(let t=u0+.03,i=0;t<u0+du-.08;t+=.09,i++)if(i%2)quad(g,t,v0+.03,.09,dv-.06,C.grassD,h);}
      const nu=o.nu||3,nv=o.nv||2;for(let i=0;i<nu;i++)for(let j=0;j<nv;j++)L.vent(g,P(u0+du*(i+.5)/nu,v0+dv*(j+.5)/nv,h),o.vh||4);
      L.hatch(g,P(u0+.1,v0+.1,h));L.hatch(g,P(u0+du-.1,v0+dv-.1,h));
      if(o.deco)o.deco(g,ng);});};
  const gravel=(L,g,u0,v0,du,dv)=>{L.quad(g,u0,v0,du,dv,'#a59e8e');L.quad(g,u0+.02,v0+.02,du-.04,dv-.04,'#bdb6a5');};

  // ================= k153 淨水處理廠（3×3）=================
  try{
    const W=192,H=205,AX=96,AY=203,SZ=3;
    const L153=[
      (K,L,g,S)=>{ // v0 標準傳統廠：膠凝池→兩條長沉澱池（刮泥機橋）→快濾池＋操作廊→覆土清水池；藥劑槽、行政樓、送水泵房
        const {P,RC,BL,boxZ,rowL,rowR}=L;
        L.lawn(g,153);
        L.asph(g,.1,1.5,2.8,.16);L.asph(g,.92,1.62,.3,1.36);L.asph(g,2.72,.46,.16,1.08);
        L.asph(g,.14,2.5,.66,.4);L.stalls(g,.16,2.52,.62,.36,5);
        L.flat(S,.12,.12,.5,.36,12,{deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.04,b.u1-.2,3,3,3,3,C.win,C.lit,11);
          const dp=P(b.u1-.12,b.v1,7);L.pgL(g,dp[0],dp[1],6,7,'#8e969a');for(let i=1;i<7;i+=2)L.pgL(g,dp[0],dp[1]+i,6,1,'#7b8387');
          rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,4,2,2,4,'#7b8387',null,0);
          boxZ(g,b.u0+.1,b.v0+.1,.1,.1,12,3,'#b9c1c6','#cdd4d8','#a7afb4');}});
        S.o(1.42,g=>{boxZ(g,.68,.12,.9,.36,0,2,C.lip,C.cL,C.cR);L.quad(g,.71,.15,.84,.3,'#b3ada0',2);});
        L.tank(S,.84,.3,.1,15,{band:'#5f86a8',d:1.25});L.tank(S,1.1,.3,.1,15,{band:'#c7a33b',d:1.5});L.tank(S,1.36,.3,.1,15,{band:'#5f86a8',d:1.75,warn:true});
        L.basin(S,.12,.58,.46,.86,5,C.wFloc,{hl:C.wFlocH,seed:5,rip:8,deco:(g,ng,G)=>{L.wallV(g,G,.35);L.wallU(g,G,.87);L.wallU(g,G,1.15);
          for(const u of [.235,.465])for(const v of [.73,1.01,1.29]){const p=P(u,v,G.h);BL(g,P(u,v-.12,G.h),P(u,v+.12,G.h),'#9aa3a6');RC(g,p[0]-2,p[1]-4,4,3,'#5f7d74');RC(g,p[0]-2,p[1]-4,4,1,'#86a398');}}});
        const sd=(g,ng,G)=>{L.wallV(g,G,G.ui0+.07);for(let i=0;i<5;i++)L.troughV(g,G,G.ui1-.05-i*.075,C.wSetD);};
        const sA=L.basin(S,.64,.58,1.38,.44,5,C.wSet,{seed:7,deco:sd});L.bridgeV(S,sA,1.02);
        const sB=L.basin(S,.64,1.0,1.38,.44,5,C.wSet,{seed:8,deco:sd});L.bridgeV(S,sB,1.36);
        L.gable(S,1.66,.12,1.22,.3,12,5,{seams:'#7d888e',deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.08,b.u1-.08,4,4,6,3,C.win,C.lit,21);
          rowR(g,ng,b.u1,b.v0+.05,b.v1-.05,4,4,1,3,C.win,C.lit,22,1);}});
        for(let i=0;i<3;i++){const va=.5+i*.32;
          for(const ua of [2.08,2.48])L.basin(S,ua,va,.28,.3,6,C.wFil,{hl:C.wFilH,seed:30+i+ua*10,rip:10,deco:(g,ng,G)=>{L.troughV(g,G,G.u0+G.du/2,'#3f8aa1');}});}
        L.flat(S,2.37,.48,.1,.98,9,{roof:'#a9b0b3',rin:'#8f989d',deco:(g,ng,b)=>{rowR(g,ng,b.u1,b.v0+.05,b.v1-.05,6,2,6,2,C.win,C.lit,23,.8);}});
        well(L,S,1.34,1.78,.92,.72,3,{nu:3,nv:2});
        L.gable(S,2.36,1.8,.5,.4,10,4,{wl:'#e3d9c2',wr:'#bdb19a',deco:(g,ng,b)=>{const dp=P(b.u0+.14,b.v1,8);L.pgL(g,dp[0],dp[1],7,8,'#8e969a');
          rowL(g,ng,b.v1,b.u0+.3,b.u1-.02,4,3,2,3,C.win,C.lit,31);rowR(g,ng,b.u1,b.v0,b.v1,4,3,2,3,C.win,C.lit,32);}});
        L.flat(S,.12,1.74,.64,.56,15,{deco:(g,ng,b)=>{
          for(const z of [3,10])rowL(g,ng,b.v1,b.u0+.03,b.u1-.03,z,3,5,3,C.win,C.lit,50+z);
          for(const z of [3,10])rowR(g,ng,b.u1,b.v0+.03,b.v1-.03,z,3,4,3,C.win,C.lit,60+z);
          boxZ(g,b.u0+.24,b.v1,.18,.06,7,1,'#e8ebec','#c9ced0','#aab0b3');
          boxZ(g,b.u0+.12,b.v0+.12,.14,.12,15,4,'#b9c1c6','#cdd4d8','#a7afb4');}});
        L.car(S,.22,2.58,'#c0392b','#8e2a20',false);L.car(S,.47,2.58,'#e6e8ea','#b4b9bc',false);
        L.tree(S,1.4,2.76,1,1);L.tree(S,1.78,2.82,1.1,2);L.tree(S,2.2,2.8,1,3);L.tree(S,2.84,2.5,1,4);
        L.lamp(S,2.9,2.1);L.lamp(S,.1,2.4);
        return {gate:[.3,.42]};
      },
      (K,L,g,S)=>{ // v1 圓形高速澄清池廠：兩座圓形澄清池（中心反應筒＋走道橋）、PAC 筒倉、長形快濾池廠房（屋頂氣窗）、污泥乾燥床
        const {P,BL,boxZ,rowL,rowR}=L;
        L.lawn(g,1531);
        L.asph(g,.1,1.62,2.8,.16);L.asph(g,2.24,.12,.16,1.5);L.asph(g,1.36,1.78,.24,1.2);
        L.asph(g,1.66,2.52,.74,.38);L.stalls(g,1.68,2.54,.7,.34,6);
        L.silo(S,.84,.3,.13,22,10,{d:1.3});
        L.flat(S,.12,.12,.46,.34,10,{deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.04,b.u1-.04,3,3,3,3,C.win,C.lit,71);rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,3,3,1,3,C.win,C.lit,72);}});
        L.clarifier(S,.7,1.06,.5,6,{seed:3});
        L.clarifier(S,1.68,.62,.48,6,{seed:4});
        L.flat(S,2.46,.12,.42,1.44,13,{deco:(g,ng,b)=>{
          rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,3,7,8,2,C.win,C.lit,73,.7);
          rowL(g,ng,b.v1,b.u0+.06,b.u1-.06,3,6,2,2,C.win,C.lit,74);
          boxZ(g,b.u0+.13,b.v0+.08,.16,b.v1-b.v0-.16,13,4,'#a9b2b6','#9aa4a9','#7b858a');
          rowR(g,ng,b.u0+.29,b.v0+.12,b.v1-.12,13,2,9,2,'#5d7a8e',C.lit,75,.5);}});
        const beds=[['#7a6146','#94795a'],['#5f4b37','#6f5a44'],['#8d7657','#a58c69'],['#6b5640','#7f6a50'],[C.wFloc,C.wFlocH],['#846c50','#9b8262']];
        for(let i=0;i<3;i++)for(let j=0;j<2;j++){const bc=beds[i*2+j];L.basin(S,.14+i*.38,1.86+j*.52,.36,.48,3,bc[0],{hl:bc[1],seed:80+i*2+j,rip:22,wd:1,
          deco:(g,ng,G)=>{BL(g,P(G.ui0+.03,(G.vi0+G.vi1)/2,G.wz),P(G.ui1-.03,(G.vi0+G.vi1)/2,G.wz),'#4f3f2f');}});}
        well(L,S,1.7,1.88,.72,.52,3,{nu:3,nv:1});
        L.gable(S,2.5,1.88,.38,.56,11,4,{deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.04,b.u1-.04,4,3,2,3,C.win,C.lit,76);
          rowR(g,ng,b.u1,b.v0+.04,b.v1-.2,4,3,2,3,C.win,C.lit,77);const dp=P(b.u1,b.v1-.04,7);L.pgR(g,dp[0],dp[1],4,7,'#6f6a62');}});
        L.car(S,1.74,2.6,'#3a6ea5','#2a527c',false);L.car(S,1.98,2.6,'#e6e8ea','#b4b9bc',false);L.car(S,2.22,2.6,'#555c62','#3e4449',false);
        L.tree(S,2.3,1.32,1,5);L.tree(S,1.26,1.66,.9,6);L.tree(S,2.8,2.72,1.1,7);
        L.lamp(S,2.9,1.7);L.lamp(S,1.32,2.9);
        return {gate:[.45,.53]};
      },
      (K,L,g,S)=>{ // v2 日治時期慢濾池廠：四格慢砂濾池（一格排空露砂）、紅磚抽水機房＋煙囪、原水沉澱池、覆土清水池＋磚造通氣塔、舊式高架水塔、老樹
        const {P,RC,BL,rowL}=L;
        L.lawn(g,1532);
        gravel(L,g,.1,1.4,2.8,.13);gravel(L,g,1.4,1.53,.2,1.45);gravel(L,g,1.6,2.14,.8,.3);
        for(let i=0;i<2;i++)for(let j=0;j<2;j++){const u0=.14+i*.62,v0=.14+j*.62;
          if(i===1&&j===0)L.basin(S,u0,v0,.58,.58,4,'#d3c397',{hl:'#e3d6b0',seed:130,rip:0,deco:(g,ng,G)=>{for(let t=G.ui0+.06;t<G.ui1-.02;t+=.07)BL(g,P(t,G.vi0+.03,G.wz),P(t,G.vi1-.03,G.wz),'#bcaa7c');
            const p=P(G.ui0+.3,G.vi0+.34,G.wz);RC(g,p[0],p[1]-4,2,4,'#3e5a78');RC(g,p[0],p[1]-6,2,2,'#e0b48a');}});
          else L.basin(S,u0,v0,.58,.58,4,'#5b949d',{hl:'#86b7bd',seed:131+i*2+j,rip:12});}
        L.gable(S,1.56,.18,.9,.46,15,7,{wl:'#b35d43',wr:'#8a4533',rl:'#6a6461',rd:'#514c4a',ridge:'#8e8884',deco:(g,ng,b)=>{
          L.brickL(g,b.v1,b.u0,b.u1,0,b.h-3,'#9b4c37');L.brickR(g,b.u1,b.v0,b.v1,0,b.h-3,'#733829');
          BL(g,P(b.u0,b.v1,b.h-2),P(b.u1,b.v1,b.h-2),'#e6dcc6');BL(g,P(b.u1,b.v0,b.h-2),P(b.u1,b.v1,b.h-2),'#bfb39c');
          BL(g,P(b.u0,b.v1,1),P(b.u1,b.v1,1),'#9d968a');BL(g,P(b.u1,b.v0,1),P(b.u1,b.v1,1),'#7c766c');
          L.archL(g,ng,b.v1,b.u0+.06,b.u1-.06,3,8,5,3,'#3f5566',C.lit,91,.6,'#e6dcc6');
          L.archR(g,ng,b.u1,b.v0+.06,b.v1-.06,3,8,2,3,'#33485a',C.lit,92,.6,'#bfb39c');}});
        L.chimney(S,2.56,.16,.12,46,{d:2.9});
        L.basin(S,1.56,.8,1.3,.5,4,'#6f8e7e',{hl:'#8fab9b',seed:93,deco:(g,ng,G)=>{L.wallV(g,G,G.ui0+.42);L.wallV(g,G,G.ui0+.84);}});
        well(L,S,.16,1.62,1.1,.62,3,{nu:4,nv:1,vh:3});
        // 磚造通氣小亭：站在覆土池頂（z=3），排在池頂（d≈2.64）之後；落影畫在池頂草皮上
        L.gable(S,.63,1.86,.16,.16,8,4,{z:3,shCol:'#6b9750',wl:'#b35d43',wr:'#8a4533',rl:'#5e5956',rd:'#4a4644',d:3.5,
          deco:(g,ng,b)=>{L.brickL(g,b.v1,b.u0,b.u1,b.z,b.z+b.h-1,'#9b4c37');const dp=P(b.u0+.05,b.v1,b.z+6);L.pgL(g,dp[0],dp[1],2,4,'#3a2f2a');}});
        L.gable(S,1.72,1.66,.62,.38,10,5,{wl:'#b35d43',wr:'#8a4533',rl:'#6a6461',rd:'#514c4a',deco:(g,ng,b)=>{
          L.brickL(g,b.v1,b.u0,b.u1,0,b.h-2,'#9b4c37');L.brickR(g,b.u1,b.v0,b.v1,0,b.h-2,'#733829');
          L.archL(g,ng,b.v1,b.u0+.04,b.u1-.04,2,6,3,3,'#3f5566',C.lit,94,.8,'#e6dcc6');L.archR(g,ng,b.u1,b.v0+.04,b.v1-.04,2,6,1,3,'#33485a',C.lit,95,.8);}});
        L.silo(S,2.66,1.96,.15,9,24,{tones:['#6f8b7a','#88a592','#7f9b89','#6d8878','#5b7465','#4f6658'],top:'#8aa693',rim:'#5f7a69',d:4.62});
        L.tree(S,.3,2.5,1.4,11);L.tree(S,.8,2.72,1.3,12);L.tree(S,2.1,2.74,1.3,13);L.tree(S,2.72,2.66,1.1,14);L.tree(S,1.4,.1+1.2,1.1,15);
        L.lamp(S,1.62,2.9);
        return {gate:[.46,.53]};
      },
      (K,L,g,S)=>{ // v3 大型現代廠：膠凝池＋四條平板沉澱池（後兩條加蓋太陽能）、濾池大樓、活性碳壓力槽列、玻璃帷幕行政樓
        const {P,RC,BL,boxZ,rowL,rowR}=L;
        L.lawn(g,1533);
        L.asph(g,.1,1.48,2.8,.14);L.asph(g,1.02,1.62,.24,1.36);L.asph(g,.14,2.36,.84,.54);L.stalls(g,.16,2.38,.8,.3,7);
        L.quad(g,1.38,1.64,1.46,.26,C.pad);
        L.basin(S,.12,.14,.4,1.28,5,C.wFloc,{hl:C.wFlocH,seed:101,rip:6,deco:(g,ng,G)=>{L.wallV(g,G,.32);for(const v of [.46,.78,1.1])L.wallU(g,G,v);
          for(const u of [.22,.42])for(let j=0;j<4;j++){const p=P(u,.3+j*.32,G.h);RC(g,p[0]-2,p[1]-3,4,3,'#5f7d74');RC(g,p[0]-2,p[1]-3,4,1,'#86a398');}}});
        const lam=(g,ng,G)=>{for(let k=0;k<3;k++){const a=G.ui0+.08+k*.46;for(let u=a;u<a+.38;u+=.06)BL(g,P(u,G.vi0+.04,G.wz),P(u,G.vi1-.04,G.wz),'#33687d');
            BL(g,P(a,G.vi0+.04,G.wz),P(a+.36,G.vi0+.04,G.wz),'#33687d');BL(g,P(a,G.vi1-.04,G.wz),P(a+.36,G.vi1-.04,G.wz),'#33687d');}
          for(let i=0;i<3;i++)L.troughV(g,G,G.ui1-.04-i*.05,C.wSetD);};
        for(let j=0;j<4;j++)L.basin(S,.56,.14+j*.32,1.62,.32,5,C.wSet,{seed:110+j,rip:5,deco:lam});
        L.solarCover(S,{u0:.56,v0:.14,du:1.62,dv:.64,u1:2.18,v1:.78,h:5,d:2.02},14);
        L.flat(S,2.3,.14,.58,1.28,15,{deco:(g,ng,b)=>{
          for(const z of [3,9])rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,z,3,12,2,C.win,C.lit,140+z,.7);
          rowL(g,ng,b.v1,b.u0+.05,b.u1-.05,4,7,3,3,'#6d9bb8',C.lit,142,.8);
          boxZ(g,b.u0+.22,b.v0+.08,.12,b.v1-b.v0-.16,15,2,'#b8d0de','#8fb0c4','#6f8fa3');}});
        for(let i=0;i<4;i++)L.vessel(S,1.5+i*.38,1.77,.085,11,{d:3.3+i*.01});   // 4 座，間距 12px：外框之間留 1px 地面
        S.t(3.4,g=>{BL(g,P(1.46,1.66,4),P(2.72,1.66,4),'#4f7c9e');BL(g,P(1.46,1.66,5),P(2.72,1.66,5),'#7ea8c8');});
        well(L,S,1.4,2.02,1.46,.5,3,{nu:5,nv:1});
        L.flat(S,.14,1.64,.8,.6,17,{deco:(g,ng,b)=>{
          for(const z of [2,7,12])rowL(g,ng,b.v1,b.u0+.03,b.u1-.03,z,4,9,3,'#6d9bb8','#fff0c0',150+z,.75);
          for(const z of [2,7,12])rowR(g,ng,b.u1,b.v0+.03,b.v1-.03,z,4,6,3,'#557e99','#fff0c0',160+z,.75);
          boxZ(g,b.u0+.5,b.v0+.12,.16,.16,17,3,'#b9c1c6','#cdd4d8','#a7afb4');}});
        L.flat(S,.8,2.1,.16,.16,21,{d:3.2,roof:'#8fb0c4',rin:'#6d8ea3',wl:'#9dc0d6',wr:'#6f93aa'});
        L.car(S,.2,2.44,'#c0392b','#8e2a20',false);L.car(S,.42,2.44,'#e6e8ea','#b4b9bc',false);L.car(S,.75,2.44,'#2f3a44','#20282f',false);
        L.tree(S,2.45,2.76,1.1,21);L.tree(S,2.86,2.62,1,22);L.tree(S,1.6,2.82,1,23);
        L.lamp(S,.98,2.3);L.lamp(S,2.9,1.56);
        return {gate:[.33,.42]};
      },
      (K,L,g,S)=>{ // v4 都市緊湊型：鋸齒屋頂加蓋處理廠房、混凝土蓋板清水池、藥劑槽區、污泥濃縮池×2＋脫水機房＋污泥車、反洗水回收池
        const {P,RC,BL,boxZ,rowL,rowR}=L;
        L.lawn(g,1534);
        L.asph(g,.1,1.56,2.8,.16);L.asph(g,.98,1.72,.22,1.26);L.asph(g,.12,2.4,.82,.5);L.stalls(g,.14,2.42,.78,.3,7);L.asph(g,2.2,2.4,.66,.5);
        L.sawtooth(S,.12,.12,1.44,.8,13,6,6,{deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.05,b.u1-.05,3,4,8,3,C.win,C.lit,121);rowR(g,ng,b.u1,b.v0+.05,b.v1-.05,3,4,4,3,C.win,C.lit,122);
          const dp=P(b.u0+.3,b.v1,9);L.pgL(g,dp[0],dp[1],8,9,'#8e969a');for(let i=1;i<9;i+=2)L.pgL(g,dp[0],dp[1]+i,8,1,'#7b8387');}});
        well(L,S,1.66,.12,1.2,.6,4,{deck:true,nu:4,nv:2});
        S.o(2.64,g=>{boxZ(g,1.66,.84,.76,.6,0,2,C.lip,C.cL,C.cR);L.quad(g,1.69,.87,.7,.54,'#b3ada0',2);});
        L.tank(S,1.86,1.0,.1,15,{band:'#5f86a8',d:2.86});L.tank(S,2.22,1.0,.1,15,{band:'#c7a33b',d:3.22});
        L.tank(S,1.86,1.28,.1,15,{band:'#5f86a8',d:3.14});L.tank(S,2.22,1.28,.1,15,{band:'#8e5aa8',d:3.5,warn:true});
        L.flat(S,2.52,.84,.34,.58,10,{deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.04,b.u1-.04,3,3,2,3,C.win,C.lit,123);rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,3,3,3,3,C.win,C.lit,124);}});
        const SL='#6f6650',SLH='#8a8068';
        L.gable(S,.12,1.0,.46,.48,11,4,{seams:'#7d888e',deco:(g,ng,b)=>{const dp=P(b.u0+.08,b.v1,9);L.pgL(g,dp[0],dp[1],9,9,'#4d4a45');for(let i=2;i<9;i+=2)L.pgL(g,dp[0],dp[1]+i,9,1,'#625e58');
          rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,5,3,2,3,C.win,C.lit,128);}});
        L.clarifier(S,.88,1.28,.24,5,{w:SL,hl:SLH,coreW:'#5a523f',seed:125,arm:true,core:.3});
        L.clarifier(S,1.38,1.28,.24,5,{w:SL,hl:SLH,coreW:'#5a523f',seed:126,arm:true,core:.3});
        L.truck(S,.16,1.6,'#e0b33a','#b08a28');
        L.basin(S,.14,1.84,.78,.46,4,'#7a9088',{hl:'#99aca4',seed:129,rip:10,deco:(g,ng,G)=>{L.wallV(g,G,G.ui0+.36);}});
        L.flat(S,1.3,1.84,.8,.46,13,{deco:(g,ng,b)=>{for(const z of [2,8])rowL(g,ng,b.v1,b.u0+.04,b.u1-.04,z,3,7,3,C.win,C.lit,130+z);
          for(const z of [2,8])rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,z,3,3,3,C.win,C.lit,135+z);
          boxZ(g,b.u0+.2,b.v0+.12,.14,.12,13,4,'#b9c1c6','#cdd4d8','#a7afb4');boxZ(g,b.u0+.5,b.v0+.14,.1,.1,13,3,'#b9c1c6','#cdd4d8','#a7afb4');}});
        L.gable(S,2.24,1.84,.62,.44,10,4,{wl:'#e3d9c2',wr:'#bdb19a',deco:(g,ng,b)=>{const dp=P(b.u0+.1,b.v1,8);L.pgL(g,dp[0],dp[1],7,8,'#8e969a');
          rowL(g,ng,b.v1,b.u0+.3,b.u1-.02,4,3,3,3,C.win,C.lit,139);rowR(g,ng,b.u1,b.v0,b.v1,4,3,2,3,C.win,C.lit,140);}});
        S.t(4.6,g=>{BL(g,P(2.5,2.3,2),P(2.5,2.95,2),'#4f7c9e');BL(g,P(2.5,2.3,3),P(2.5,2.95,3),'#7ea8c8');});
        L.car(S,.2,2.48,'#e6e8ea','#b4b9bc',false);L.car(S,.42,2.48,'#3a6ea5','#2a527c',false);L.car(S,.75,2.48,'#555c62','#3e4449',false);
        L.tree(S,1.42,2.62,1,31);L.tree(S,1.8,2.78,1.1,32);L.tree(S,2.84,2.56,1,33);
        L.lamp(S,.1,2.2);L.lamp(S,2.9,1.7);
        return {gate:[.33,.4]};
      },
    ];
    build(153,W,H,AX,AY,SZ,L153);
  }catch(e){console.error('infra575 k153',e);if(DEV)throw e;}
  // ================= k154 清水庫／服務水庫（4×4）=================
  // 左亮右暗的橢圓（圓頂／錐頂分層用）
  const ellLR=(g,cx,cy,rx,ry,cl,cd,sp=.15)=>{cx=Math.round(cx);cy=Math.round(cy);const xs=cx+Math.round(rx*sp);
    for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));g.fillStyle=cd;g.fillRect(cx-w,cy+y,2*w+1,1);
      const r=Math.min(cx+w,xs);if(r>=cx-w){g.fillStyle=cl;g.fillRect(cx-w,cy+y,r-(cx-w)+1,1);}}};
  const ybOf=(rx,ry)=>x=>Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));
  // 管線（外露送水管，描邊層）＋閥門手輪
  const pipeU=(L,g,u0,u1,v,z)=>{L.BL(g,L.P(u0,v,z),L.P(u1,v,z),'#3f6c8e');L.BL(g,L.P(u0,v,z+1),L.P(u1,v,z+1),'#7ea8c8');L.BL(g,L.P(u0,v,z+2),L.P(u1,v,z+2),'#5b89ad');};
  const pipeV=(L,g,v0,v1,u,z)=>{L.BL(g,L.P(u,v0,z),L.P(u,v1,z),'#3f6c8e');L.BL(g,L.P(u,v0,z+1),L.P(u,v1,z+1),'#7ea8c8');L.BL(g,L.P(u,v0,z+2),L.P(u,v1,z+2),'#5b89ad');};
  const valve=(L,g,u,v,z)=>{const p=L.P(u,v,z);L.RC(g,p[0]-1,p[1]-2,3,3,'#34566f');L.RC(g,p[0]-2,p[1]-5,5,1,'#c0392b');L.RC(g,p[0],p[1]-5,1,3,'#8a2a20');};
  // 覆土式配水池土丘：斜坡草皮＋平頂
  const mound=(L,S,u0,v0,du,dv,h,ins,o={})=>{const {P,poly,quad,BL}=L,u1=u0+du,v1=v0+dv,a0=u0+ins,b0=v0+ins,a1=u1-ins,b1=v1-ins;
    S.shB(u0+ins*.5,v0+ins*.5,du-ins,dv-ins,h*.5);
    S.o(o.d!==undefined?o.d:u0+v0+(du+dv)/2,(g,ng)=>{
      poly(g,[P(u0,v0,0),P(u1,v0,0),P(a1,b0,h),P(a0,b0,h)],'#7aa85b');poly(g,[P(u0,v0,0),P(u0,v1,0),P(a0,b1,h),P(a0,b0,h)],'#739f55');
      poly(g,[P(u0,v1,0),P(u1,v1,0),P(a1,b1,h),P(a0,b1,h)],'#97c473');
      poly(g,[P(u1,v0,0),P(u1,v1,0),P(a1,b1,h),P(a1,b0,h)],'#6a9851');
      for(const t of [.3,.62]){BL(g,P(u1-t*ins,v0+t*ins,t*h),P(u1-t*ins,v1-t*ins,t*h),'#5f8c48');BL(g,P(u0+t*ins,v1-t*ins,t*h),P(u1-t*ins,v1-t*ins,t*h),'#a6d080');}   // 邊坡割草等高紋
      quad(g,a0,b0,a1-a0,b1-b0,'#82af5f',h);
      for(let t=a0,i=0;t<a1-.06;t+=.12,i++)if(i%2)quad(g,t,b0,Math.min(.12,a1-t),b1-b0,'#77a455',h);
      BL(g,P(a0,b1,h),P(a1,b1,h),'#d6d2c6');BL(g,P(a1,b0,h),P(a1,b1,h),'#b9b4a8');
      for(let i=0;i<Math.round(du*dv*5);i++){const u=u0+.05+L.hsh(o.seed||7,i,1)*(du-.1),q=P(u,v1-L.hsh(o.seed||7,i,2)*ins*.8,L.hsh(o.seed||7,i,2)*h*.8);L.RC(g,q[0],q[1],2,1,'#a8d183');}
      for(let i=0;i<Math.round(du*dv*4);i++){const v=v0+.05+L.hsh(o.seed||7,i,4)*(dv-.1),t=L.hsh(o.seed||7,i,5),q=P(u1-t*ins*.8,v,t*h*.8);L.RC(g,q[0],q[1],2,1,'#4f7a3c');}
      if(o.deco)o.deco(g,ng,{u0,v0,u1,v1,a0,b0,a1,b1,h});});};
  // 通氣塔（小型混凝土亭＋蓋板）
  const ventK=(L,g,u,v,z)=>{L.boxZ(g,u,v,.07,.07,z,5,'#dcd8cd','#cfcabd','#a39d91');L.boxZ(g,u-.02,v-.02,.11,.11,z+5,1,'#7f878b','#959ca0','#6a7276');
    const p=L.P(u+.035,v+.07,z+3);L.RC(g,p[0]-2,p[1],2,1,'#6a7276');};
  const hatchBox=(L,g,u,v,z)=>{L.boxZ(g,u,v,.11,.09,z,2,'#838b8f','#aaa599','#8a8478');L.quad(g,u+.02,v+.02,.07,.05,'#5f676b',z+2);};
  // 蘑菇頭通氣塔：方座＋混凝土圓柱＋圓頂通風帽（帽下暗縫）
  const mush=(L,g,u,v,z)=>{const p=L.P(u,v,z),x=Math.round(p[0]),y=Math.round(p[1]);
    L.boxZ(g,u-.05,v-.05,.1,.1,z,2,'#d9d5ca','#cbc6b9','#a39d91');
    L.cyl(g,x,y-2,2,6,['#e4e0d6','#d6d1c5','#c3beb1','#a39d91','#948e83'],null,null);
    const ty=y-9;RC0(g,x-4,ty+1,9,1,'#4f5c56');
    ellLR(g,x,ty,4,2,'#a9bab0','#728379',.1);ellLR(g,x,ty-1,3,1,'#bfcdc4','#879a8f',0);RC0(g,x-1,ty-2,2,1,'#d8e3dc');};
  const RC0=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
  // 外露大口徑送水管（沿 u，5px 粗：底暗→亮面→頂）＋法蘭
  const bigPipeU=(L,g,u0,u1,v,z)=>{const cols=['#2b4a60','#46759a','#76a5c6','#a2c7de','#5b89ad'];
    for(let k=0;k<5;k++)L.BL(g,L.P(u0,v,z+k),L.P(u1,v,z+k),cols[k]);
    for(let t=u0+.12;t<u1-.03;t+=.2){const a=L.P(t,v,z-1);RC0(g,a[0],a[1]-6,1,7,'#2b4a60');RC0(g,a[0]+1,a[1]-5,1,1,'#b6d3e5');}};
  // 大型儲水槽：pc＝預力混凝土（壁柱＋環梁＋圓頂）；steel＝焊接鋼板（焊道＋螺旋梯＋錐頂＋欄杆）
  const bigTank=(L,S,cu,cv,r,h,o={})=>{const {P,RC,cyl,ring,RX,poly}=L;const rise=o.rise||(o.kind==='pc'?7:9);S.shC(cu,cv,r,h+rise);
    S.o(o.d!==undefined?o.d:cu+cv,(g,ng)=>{const p=P(cu,cv,0),rx=RX(r),ry=Math.round(rx/2),cx=Math.round(p[0]),cy=Math.round(p[1]),yb=ybOf(rx,ry);
      cyl(g,cx,cy,rx,h,o.tones,null,null);const top=cy-h;
      if(o.kind==='pc'){
        for(let x=-rx;x<=rx;x++){const L2=x<rx*.2;RC(g,cx+x,top+yb(x)+1,1,2,L2?'#e3ded2':'#b9b3a6');RC(g,cx+x,top+yb(x)+3,1,1,L2?'#aaa498':'#8b867b');RC(g,cx+x,cy+yb(x)-2,1,2,L2?'#b0aa9d':'#8f897e');}
        for(let k=-7;k<=7;k++){const x=Math.round(rx*Math.sin(k*Math.PI/16));if(Math.abs(x)>=rx-1)continue;RC(g,cx+x,top+yb(x)+4,1,h-6,x<rx*.2?'#bdb7aa':'#948e83');}
        if(o.flat){   // 平頂：女兒牆頂＋下沉屋面＋環形欄杆＋屋頂人孔＋遙測天線桿
          ellLR(g,cx,top,rx,ry,'#e0dbcf','#b3ada0',.1);ellLR(g,cx,top+1,rx-2,Math.max(1,ry-1),'#aeb1a7','#9a9d93',.1);
          const yr=ybOf(rx-1,ry);L.ring(g,cx,top-3,rx-1,ry,'#e4e9eb');for(let k=-4;k<=4;k++){const x=Math.round((rx-1)*Math.sin(k*Math.PI/10));RC(g,cx+x,top-3+yr(x),1,3,'#c9d0d3');}
          RC(g,cx-9,top-1,6,3,'#8f969a');RC(g,cx-9,top-1,6,1,'#b9c0c3');
          const mx=cx+Math.round(rx*.3),my=top+1;RC(g,mx,my-22,1,22,'#6c757a');for(const yy of [my-18,my-11])RC(g,mx-2,yy,5,1,'#8d969a');
          RC(g,mx-3,my-21,2,6,'#e4e8ea');RC(g,mx+2,my-17,2,6,'#e4e8ea');RC(g,mx-4,my-9,3,3,'#d5dadc');RC(g,mx,my-23,1,1,'#c0392b');if(ng)RC(ng,mx,my-23,1,1,'#ff5a4a');
        }else{
          for(let k=0;k<=rise;k++){const s=Math.sqrt(1-Math.pow(k/(rise+1),2)),rxx=Math.max(2,Math.round(rx*s)),ryy=Math.max(1,Math.round(ry*s));
            ellLR(g,cx,top-k,rxx,ryy,k%3===0?'#cdc8bb':'#d6d1c5',k%3===0?'#aca699':'#b6b0a3',.1);}
          RC(g,cx-2,top-rise-3,5,3,'#9aa1a4');RC(g,cx-2,top-rise-3,5,1,'#c4cacc');
          if(o.cowls)for(const dx of [-Math.round(rx*.42),Math.round(rx*.36)]){const x=cx+dx,y=top-rise+4;   // 圓頂通風帽（屋頂通風機）
            RC(g,x-1,y-4,3,5,'#b0aa9d');RC(g,x+1,y-4,1,5,'#8f897e');RC(g,x-3,y-5,7,1,'#4f5c56');RC(g,x-3,y-7,7,2,'#a9bab0');RC(g,x+1,y-7,3,2,'#728379');RC(g,x-2,y-8,5,1,'#c4d2c9');}
        }
        if(!o.noLadder){const lx=cx+Math.round(rx*(o.lad!==undefined?o.lad:-.62)),yb0=yb(lx-cx);
          RC(g,lx,top+yb0,1,h,'#6f777b');RC(g,lx+3,top+yb0,1,h,'#6f777b');for(let y=top+yb0+2;y<cy+yb0;y+=2)RC(g,lx,y,4,1,'#8d9599');
          for(let y=top+yb0+4;y<cy+yb0-8;y+=5)RC(g,lx-1,y,6,1,'#5d666a');}
        if(o.door){const dx=cx-Math.round(rx*.36),yb0=cy+yb(dx-cx);RC(g,dx,yb0-10,6,9,'#5a6670');RC(g,dx+3,yb0-10,1,9,'#46525b');RC(g,dx-1,yb0-11,8,1,'#ebe7de');
          RC(g,dx+2,yb0-13,2,1,'#f3e6b8');if(ng)RC(ng,dx+1,yb0-13,4,2,'#ffe2a0');}
      }else{
        for(let z=9;z<h-2;z+=9)for(let x=-rx;x<=rx;x++)RC(g,cx+x,cy-z+yb(x),1,1,x<rx*.2?o.seam:o.seamD);
        for(let c=0;c*9<h-9;c++)for(let k=-5;k<=5;k++){const x=Math.round(rx*Math.sin((k+(c%2?.5:0))*Math.PI/12));if(Math.abs(x)>=rx-1)continue;RC(g,cx+x,cy-(c+1)*9+yb(x)+1,1,8,x<rx*.2?o.seam:o.seamD);}
        if(o.band)for(let x=-rx;x<=rx;x++){RC(g,cx+x,top+yb(x)+5,1,4,x<rx*.2?o.band[0]:o.band[1]);}
        for(let i=0;i<=h*2;i++){const t=i/(h*2),th=t*Math.PI*.5,x=cx-Math.round((rx+1)*Math.sin(th)),y=cy+Math.round(ry*Math.cos(th))-Math.round(t*h);RC(g,x,y,2,1,'#55626a');RC(g,x,y-4,1,1,'#eef2f4');}
        ellLR(g,cx,top,rx,ry,o.roofL,o.roofD,.1);
        poly(g,[[cx-rx,top],[cx,top-rise],[cx+1,top+ry],[cx-rx*.2,top+ry*.9]],o.roofL2);poly(g,[[cx,top-rise],[cx+rx+1,top],[cx+rx*.3,top+ry*.9],[cx+1,top+ry]],o.roofD2);
        ring(g,cx,top-3,rx,ry,'#e4e9eb');for(let k=-4;k<=4;k++){const x=Math.round(rx*Math.sin(k*Math.PI/10));RC(g,cx+x,top-3+yb(x),1,3,'#c9d0d3');}
        RC(g,cx-2,top-rise-3,5,3,'#8e979b');RC(g,cx-2,top-rise-3,5,1,'#b9c1c4');
      }
      if(o.warn){RC(g,cx,top-rise-5,1,2,'#c0392b');if(ng)RC(ng,cx,top-rise-5,1,2,'#ff5a4a');}});};
  // 複合式高架水塔：混凝土柱身＋錐形過渡＋鋼製水箱＋錐頂
  const wtower=(L,S,u,v,o={})=>{const {P,RC,cyl,poly}=L;const rc=o.rc||6,col=o.col||56,rb=o.rb||20,bh=o.bh||16,ryb=Math.round(rb/2);S.shC(u,v,.16,col+30);
    S.o(o.d!==undefined?o.d:u+v,(g,ng)=>{const p=P(u,v,0),cx=Math.round(p[0]),cy=Math.round(p[1]),yb=ybOf(rb,ryb);
      cyl(g,cx,cy,rc,col,L.CONC,null,null);
      L.RC(g,cx-2,cy-8,4,7,'#6c6760');L.RC(g,cx-rc+1,cy-col+14,1,col-20,'#b3ad9f');
      for(let y=cy-col+20;y<cy-12;y+=12){L.RC(g,cx-1,y,2,3,'#4d6a80');if(ng&&L.hsh(u*10|0,y,3)<.5)L.RC(ng,cx-1,y,2,3,'#ffe2a0');}
      const colTop=cy-col,baseY=colTop-ryb-7;
      poly(g,[[cx-rb,baseY],[cx+2,baseY],[cx+2,colTop+1],[cx-rc,colTop+1]],'#dde3e5');poly(g,[[cx+2,baseY],[cx+rb+1,baseY],[cx+rc+1,colTop+1],[cx+2,colTop+1]],'#a9b2b6');
      ellLR(g,cx,baseY,rb,ryb,'#dde3e5','#a9b2b6',.1);
      cyl(g,cx,baseY,rb,bh,['#dfe6ea','#f4f7f8','#eef2f4','#d8e0e4','#bcc6cb','#a6b1b7'],null,null);
      const top=baseY-bh;for(let x=-rb;x<=rb;x++){RC(g,cx+x,top+yb(x)+5,1,3,x<rb*.2?'#4f8fc0':'#3b6f98');RC(g,cx+x,baseY+yb(x)-1,1,1,x<rb*.2?'#c3ccd0':'#95a0a5');}
      ellLR(g,cx,top,rb,ryb,'#e9eef0','#b8c2c7',.1);
      poly(g,[[cx-rb,top],[cx,top-6],[cx+1,top+ryb]],'#f1f4f5');poly(g,[[cx,top-6],[cx+rb+1,top],[cx+1,top+ryb]],'#b3bdc2');
      L.ring(g,cx,top-3,rb,ryb,'#d9e0e3');
      RC(g,cx,top-9,1,3,'#6c7378');RC(g,cx,top-10,1,1,'#c0392b');if(ng)RC(ng,cx,top-10,1,1,'#ff5a4a');
      RC(g,cx+rb-3,top-4,1,3,'#8f989c');RC(g,cx+rb-4,top-7,3,2,'#c9d0d3');});};
  // 太陽能板列（屋頂上，面朝 +v）
  const solarRoof=(L,g,u0,v0,du,dv,z,step=.24)=>{const {P,poly,BL}=L;for(let v=v0+.04;v+.17<=v0+dv;v+=step){const a=u0+.05,b=u0+du-.05;
    poly(g,[P(a,v+.17,z),P(a,v,z+3),P(b,v,z+3),P(b,v+.17,z)],'#34597a');
    for(let t=a+.15;t<b-.02;t+=.15)BL(g,P(t,v,z+3),P(t,v+.17,z),'#25455d');
    BL(g,P(a,v+.09,z+2),P(b,v+.09,z+2),'#4a7597');BL(g,P(a,v,z+3),P(b,v,z+3),'#8fb4d0');BL(g,P(a,v+.17,z),P(b,v+.17,z),'#1d3446');}};
  // 露明混凝土水庫（壁柱）
  const resv=(L,S,u0,v0,du,dv,h,o={})=>{const {P,boxZ,quad,BL}=L;S.shB(u0,v0,du,dv,h);
    S.o(o.d!==undefined?o.d:u0+v0+(du+dv)/2,(g,ng)=>{const u1=u0+du,v1=v0+dv;boxZ(g,u0,v0,du,dv,0,h,'#bdb9ae','#cdc8bb','#a39d91');
      for(let t=u0+.22;t<u1-.08;t+=.3)boxZ(g,t,v1,.05,.025,0,h,'#d6d1c4','#dad5c8','#b1ab9e');
      for(let t=v0+.22;t<v1-.08;t+=.3)boxZ(g,u1,t,.025,.05,0,h,'#b8b2a5','#b8b2a5','#948e83');
      BL(g,P(u0,v1,1),P(u1,v1,1),'#aaa497');BL(g,P(u1,v0,1),P(u1,v1,1),'#878175');
      quad(g,u0+.04,v0+.04,du-.08,dv-.08,o.roof||'#a6aa9f',h);BL(g,P(u0,v1,h),P(u1,v1,h),'#e2ddd1');BL(g,P(u1,v0,h),P(u1,v1,h),'#bfb9ac');
      if(o.deco)o.deco(g,ng,{u0,v0,u1,v1,h});});};
  const railTop=(L,S,d,u0,v0,du,dv,h)=>S.t(d,g=>{const {P,BL}=L,u1=u0+du,v1=v0+dv,c='#dfe4e6';
    BL(g,P(u0,v1,h+4),P(u1,v1,h+4),c);BL(g,P(u1,v0,h+4),P(u1,v1,h+4),c);BL(g,P(u0,v0,h+4),P(u1,v0,h+4),'#b9c0c3');BL(g,P(u0,v0,h+4),P(u0,v1,h+4),'#b9c0c3');
    for(let t=u0;t<=u1+1e-6;t+=du/Math.max(2,Math.round(du/.2)))BL(g,P(t,v1,h),P(t,v1,h+4),c);
    for(let t=v0;t<=v1+1e-6;t+=dv/Math.max(2,Math.round(dv/.2)))BL(g,P(u1,t,h),P(u1,t,h+4),c);});
  const STEEL={kind:'steel',tones:['#b7c8d1','#d3e0e6','#cad8df','#b6c6ce','#a1b1ba','#8d9ca5','#7f8e97'],seam:'#bfcdd4',seamD:'#8e9da6',
    roofL:'#c9d5db',roofD:'#9aa9b1',roofL2:'#dfe8ec',roofD2:'#94a3ab'};
  try{
    const W=256,H=265,AX=128,AY=263,SZ=4;
    const ring4=(L,g)=>{L.asph(g,.12,.12,3.76,.2);L.asph(g,.12,.12,.2,3.76);L.asph(g,3.68,.12,.2,3.76);L.asph(g,.12,3.68,3.76,.2);};
    const L154=[
      (K,L,g,S)=>{ // v0 覆土式配水池：草皮土丘＋外露混凝土頂板走道（蘑菇頭通氣塔×4、人孔列）；土丘前緣嵌入式閥室＋外露送水管（閘閥、法蘭、支墩）＋閥井；加氯站、溢流渠、環場道路
        const {P,RC,BL,boxZ,quad,rowL,rowR}=L;
        L.lawn(g,1540);ring4(L,g);
        L.asph(g,1.7,3.0,1.06,.7);                                                   // 閥室前作業場
        quad(g,2.96,1.56,.72,.18,'#bdb8ab');quad(g,2.98,1.61,.7,.08,'#4a7c8a');       // 溢流排水渠
        quad(g,.44,2.84,.56,.48,C.pad);quad(g,3.36,2.58,.32,.58,C.pad);               // 加氯站／閥井基座
        quad(g,.47,2.7,2.55,.05,'#b8b3a6');quad(g,3.0,.47,.05,2.28,'#a6a194');          // 坡腳排水溝
        mound(L,S,.5,.5,2.5,2.2,16,.36,{seed:41,deco:(g,ng,b)=>{
          const w0=1.38,w1=1.8;                                                        // 外露混凝土頂板帶（走道）
          quad(g,b.a0,w0,b.a1-b.a0,w1-w0,'#d3cfc4',b.h);
          BL(g,P(b.a0,w0,b.h),P(b.a1,w0,b.h),'#a7a398');BL(g,P(b.a0,w1,b.h),P(b.a1,w1,b.h),'#ece9e0');BL(g,P(b.a1,w0,b.h),P(b.a1,w1,b.h),'#b5b1a6');
          for(let t=b.a0+.37;t<b.a1-.05;t+=.37)BL(g,P(t,w0+.01,b.h),P(t,w1-.01,b.h),'#bbb7ac');
          for(const u of [.9,1.33,1.78,2.23])hatchBox(L,g,u,1.64,b.h);                   // 人孔列（走道前緣）
          const st=1.2;for(let k=0;k<=8;k++){const t=k/8;BL(g,P(st,b.v1-.36*t,b.h*t),P(st+.14,b.v1-.36*t,b.h*t),k%2?'#c9c5ba':'#e0dcd1');}
          BL(g,P(st,b.v1,0),P(st,b.b1,b.h),'#8c887e');BL(g,P(st+.14,b.v1,0),P(st+.14,b.b1,b.h),'#8c887e');}});
        S.o(3.36,g=>{for(let i=0;i<4;i++)mush(L,g,1.12+i*.45,1.5,16);});              // 蘑菇頭通氣塔（走道後緣一列）
        // 嵌入土丘前緣的閥室（視覺主體）：鋼製雙扇門＋雨遮＋門燈、藍色標示牌、高窗、+u 牆百葉；屋頂人孔、通氣管、遙測天線
        L.flat(S,1.64,2.48,1.06,.6,18,{d:5.2,roof:'#d3cec2',rin:'#a2a6a2',wl:'#ddd8cb',wr:'#aba596',deco:(g,ng,b)=>{
          BL(g,P(b.u0,b.v1,2),P(b.u1,b.v1,2),'#b6b0a3');BL(g,P(b.u1,b.v0,2),P(b.u1,b.v1,2),'#8f897c');
          const dp=P(b.u0+.14,b.v1,13);L.pgL(g,dp[0],dp[1],13,13,'#4f6878');L.pgL(g,dp[0]+6,dp[1]+3,1,10,'#3b4f5b');L.pgL(g,dp[0],dp[1],13,1,'#6d8796');
          for(const k of [2,10])L.pgL(g,dp[0]+k,dp[1]+(k>>1)+3,2,2,'#7892a2');
          boxZ(g,b.u0+.1,b.v1,.5,.05,14,1,'#ebe7de','#c7c2b6','#a39d91');
          const lp=P(b.u0+.34,b.v1,17);RC(g,lp[0],lp[1],2,1,'#f3e6b8');if(ng)RC(ng,lp[0]-1,lp[1],4,2,'#ffe2a0');
          const sp=P(b.u0+.66,b.v1,10);L.pgL(g,sp[0],sp[1],8,4,'#2f6aa3');L.pgL(g,sp[0]+1,sp[1]+2,6,1,'#dfe8f1');
          rowL(g,ng,b.v1,b.u0+.6,b.u1-.02,13,3,3,3,C.win,C.lit,404,.7);
          const gv=P(b.u1,b.v0+.36,15);L.pgR(g,gv[0],gv[1],8,6,'#7d776b');for(let i=1;i<6;i+=2)L.pgR(g,gv[0],gv[1]+i,8,1,'#5f5a51');
          rowR(g,ng,b.u1,b.v1-.2,b.v1-.04,13,3,1,3,C.winD,C.lit,407,1);
          boxZ(g,b.u0+.14,b.v0+.12,.16,.14,18,3,'#b9c1c6','#cdd4d8','#a7afb4');
          const vp=P(b.u0+.56,b.v0+.2,18);RC(g,vp[0],vp[1]-6,1,6,'#6c7378');RC(g,vp[0]-1,vp[1]-7,3,1,'#e3e6e6');
          const mp=P(b.u1-.14,b.v0+.12,18);RC(g,mp[0],mp[1]-14,1,14,'#6c757a');RC(g,mp[0]-2,mp[1]-12,2,5,'#e4e8ea');RC(g,mp[0]+1,mp[1]-8,2,3,'#e4e8ea');RC(g,mp[0],mp[1]-15,1,1,'#c0392b');if(ng)RC(ng,mp[0],mp[1]-15,1,1,'#ff5a4a');}});
        // 外露送水管×2：由閥室 +u 牆穿出（牆管套）→ 閘閥（紅手輪）、支墩 → 閥井
        S.o(5.6,(g,ng)=>{const z=3;
          for(const v of [2.7,3.02]){
            for(const t of [3.1,3.3])boxZ(g,t,v-.04,.06,.08,0,z,'#d6d1c4','#cdc8bb','#a39d91');
            bigPipeU(L,g,2.7,3.42,v,z);
            const q0=P(2.72,v,z-1);RC(g,q0[0],q0[1]-6,2,8,'#2b4a60');
            const vu=v<2.9?2.84:2.92;boxZ(g,vu,v-.04,.08,.08,z-1,7,'#3f6c8e','#5585ab','#2f5670');
            const hw=P(vu+.04,v,z+11);RC(g,hw[0],hw[1],1,5,'#5b6468');L.ell(g,hw[0],hw[1],3,1,'#c0392b');RC(g,hw[0],hw[1],1,1,'#6b1f18');}
          });
        S.o(6.4,g=>{boxZ(g,3.4,2.64,.26,.46,0,3,'#b7b3a8','#cfcabd','#a39d91');
          quad(g,3.44,2.69,.18,.17,'#6f777b',3);quad(g,3.44,2.9,.18,.17,'#6f777b',3);
          for(const v of [2.69,2.9])BL(g,P(3.44,v+.02,3),P(3.62,v+.02,3),'#9aa2a6');});
        // 加氯站（左前）
        L.flat(S,.5,2.9,.36,.34,10,{d:3.6,deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.04,b.u1-.14,4,3,1,3,C.win,C.lit,405,1);
          const dp=P(b.u1-.12,b.v1,7);L.pgL(g,dp[0],dp[1],4,7,'#8e969a');rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,4,3,1,3,C.win,C.lit,406,.5);}});
        L.tank(S,.94,2.98,.065,10,{d:3.95,band:'#c7a33b'});
        S.o(2.26+3.3+.1,g=>{boxZ(g,2.2,3.3,.24,.1,0,7,'#eef0f1','#f1f3f4','#b9bec1');const w=P(2.44,3.35,6);RC(g,w[0]-1,w[1],2,3,'#3d5566');
          L.rowL(g,null,3.4,2.24,2.38,4,2,2,4,'#5f7a8c',null,0);BL(g,P(2.2,3.4,2),P(2.44,3.4,2),'#2f6aa3');});   // 維修廂型車
        L.tree(S,3.45,.45,1.3,41);L.tree(S,3.5,1.0,1.2,42);L.tree(S,.4,3.52,1.2,43);L.tree(S,1.32,3.54,1.1,44);
        L.lamp(S,3.58,2.2);L.lamp(S,.38,2.5);
        return {gate:[.5,.66]};
      },
      (K,L,g,S)=>{ // v1 預力混凝土圓形水槽×2（壁柱、環梁）：寬扁圓頂槽（入口門＋頂部通風帽）＋較小較高平頂槽（爬梯籠、屋頂欄杆、遙測天線）、閥室、外露送水管與閥門
        const {P,RC,BL,boxZ,quad,rowL,rowR}=L;
        L.lawn(g,1541);L.asph(g,.12,3.42,3.76,.22);L.asph(g,3.42,.12,.22,3.3);L.asph(g,2.4,2.5,1.02,.92);
        const PCT=['#c9c4b7','#dcd7cb','#d5d0c3','#c6c1b4','#b2ac9f','#a29c90','#958f84'];
        // A：寬扁圓頂槽（無外梯，底部入口門＋圓頂通風帽）；B：較小較高的平頂槽（外爬梯籠＋屋頂欄杆＋遙測天線）
        bigTank(L,S,1.08,2.34,.84,26,{kind:'pc',tones:PCT,d:3.2,noLadder:true,door:true,cowls:true});
        bigTank(L,S,2.3,1.1,.6,42,{kind:'pc',tones:PCT,d:3.25,flat:true,rise:3,lad:.5});
        S.o(3.6,g=>{pipeU(L,g,1.9,2.6,2.62,2);pipeV(L,g,1.72,2.62,2.62,2);valve(L,g,2.24,2.62,4);valve(L,g,2.62,2.2,4);});
        L.gable(S,2.62,2.7,.72,.52,12,5,{deco:(g,ng,b)=>{const dp=P(b.u0+.08,b.v1,9);L.pgL(g,dp[0],dp[1],8,9,'#6f7478');for(let i=1;i<9;i+=2)L.pgL(g,dp[0],dp[1]+i,8,1,'#5d6266');
          rowL(g,ng,b.v1,b.u0+.36,b.u1-.04,5,3,3,3,C.win,C.lit,411);rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,5,3,3,3,C.win,C.lit,412);}});
        S.o(6.9,g=>{boxZ(g,3.5,3.0,.14,.16,0,8,'#b9c1c6','#cdd4d8','#a7afb4');});
        L.car(S,2.6,3.0,'#e6e8ea','#b4b9bc',true);L.car(S,2.6,3.2,'#3a6ea5','#2a527c',true);
        L.tree(S,.4,3.3,1.3,46);L.tree(S,.9,3.55,1.2,47);L.tree(S,3.62,.42,1.2,48);L.tree(S,3.3,1.3,1.1,49);L.tree(S,1.9,3.6,1.1,50);
        L.lamp(S,2.3,3.4);L.lamp(S,3.4,2.3);
        return {gate:[.6,.74]};
      },
      (K,L,g,S)=>{ // v2 大型焊接鋼板水槽（焊道、螺旋梯、錐頂欄杆、塗裝色帶）＋小型調壓槽、加壓泵站、外露管線
        const {P,RC,BL,boxZ,quad,rowL,rowR}=L;
        L.lawn(g,1542);L.asph(g,.12,3.42,3.76,.22);L.asph(g,3.42,.12,.22,3.3);L.asph(g,2.72,2.4,.7,1.02);
        quad(g,.5,.5,2.3,2.3,C.pad);
        bigTank(L,S,1.65,1.65,1.1,44,Object.assign({band:['#4f8fc0','#3b6f98'],warn:true,d:3.3},STEEL));
        bigTank(L,S,3.05,.78,.4,26,Object.assign({d:3.83},STEEL));
        S.o(3.95,g=>{pipeU(L,g,2.62,3.0,2.3,2);pipeV(L,g,1.2,2.3,3.0,2);valve(L,g,2.8,2.3,4);valve(L,g,3.0,1.8,4);});
        L.flat(S,2.9,2.54,.62,.72,13,{deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.04,b.u1-.04,6,4,4,3,C.win,C.lit,421);rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,6,4,4,3,C.win,C.lit,422);
          const dp=P(b.u0+.06,b.v1,9);L.pgL(g,dp[0],dp[1],7,9,'#6f7478');boxZ(g,b.u0+.2,b.v0+.2,.18,.14,13,4,'#b9c1c6','#cdd4d8','#a7afb4');}});
        S.o(3.62+2.2,g=>{boxZ(g,3.42,2.02,.2,.16,0,9,'#7d8b91','#95a3a9','#6b787e');const p=P(3.52,2.18,5);RC(g,p[0]-3,p[1]-2,2,2,'#d1a33a');});
        L.vessel(S,2.62,2.82,.08,12,{d:5.44});
        L.tree(S,.42,3.3,1.3,51);L.tree(S,.95,3.56,1.2,52);L.tree(S,.35,2.6,1.2,53);L.tree(S,3.62,.35,1.1,54);L.tree(S,2.0,3.6,1.1,55);
        L.lamp(S,2.62,3.36);L.lamp(S,3.3,1.6);
        return {gate:[.66,.8]};
      },
      (K,L,g,S)=>{ // v3 複合式高架水塔＋地上型混凝土配水池（壁柱、屋頂欄杆、外梯、人孔與通氣管）、泵房
        const {P,RC,BL,boxZ,quad,rowL,rowR}=L;
        L.lawn(g,1543);L.asph(g,.12,3.5,3.76,.2);L.asph(g,.12,.12,.2,3.38);L.asph(g,.32,1.72,1.2,.2);
        quad(g,.62,.62,.76,.76,C.pad);
        wtower(L,S,1.0,1.0,{col:58,rb:21,bh:16,d:2.0});
        resv(L,S,1.66,1.3,1.9,1.92,14,{roof:'#9ea59b',deco:(g,ng,b)=>{const h=b.h,ru0=b.u0+.04,rv0=b.v0+.04,ru1=b.u1-.04,rv1=b.v1-.04;
          // 防水層分格色差（3×2 格）＋一塊新補的防水層
          const cu=[ru0,b.u0+.66,b.u0+1.28,ru1],cv=[rv0,b.v0+.98,rv1],tn=['#a0a79c','#979e93','#a8aea3','#9ba296','#959c90','#a3a99e'];
          for(let i=0;i<3;i++)for(let j=0;j<2;j++)quad(g,cu[i],cv[j],cu[i+1]-cu[i],cv[j+1]-cv[j],tn[i*2+j],h);
          quad(g,b.u0+.1,b.v0+1.3,.36,.3,'#8a9186',h);BL(g,P(b.u0+.1,b.v0+1.6,h),P(b.u0+.46,b.v0+1.6,h),'#b3b9ad');
          // 伸縮縫（凸起縫蓋：暗線＋亮線）×3
          for(const u of [cu[1],cu[2]]){BL(g,P(u,rv0,h),P(u,rv1,h),'#747b71');BL(g,P(u+.025,rv0,h),P(u+.025,rv1,h),'#c2c8bc');}
          BL(g,P(ru0,cv[1],h),P(ru1,cv[1],h),'#747b71');BL(g,P(ru0,cv[1]+.025,h),P(ru1,cv[1]+.025,h),'#c2c8bc');
          // 屋面排水口
          for(const [u,v] of [[ru0+.06,rv1-.06],[ru1-.06,rv0+.06],[ru1-.06,rv1-.06]]){const p=P(u,v,h);RC(g,p[0]-1,p[1],3,1,'#5d645a');}
          // 通氣管組 ×2（共用基座、三支鵝頸通氣管）
          for(const [u,v] of [[b.u0+.28,b.v0+.62],[b.u0+1.46,b.v0+1.46]]){boxZ(g,u,v,.3,.1,h,1,'#c9ccc4','#bfc2ba','#9a9e95');
            for(let k=0;k<3;k++){const p=P(u+.05+k*.1,v+.05,h+1);RC(g,p[0],p[1]-6,1,6,'#6c7378');RC(g,p[0],p[1]-7,3,1,'#e3e6e6');RC(g,p[0]+2,p[1]-6,1,2,'#9aa2a6');}}
          // 屋頂人孔（凸緣蓋板）×2
          hatchBox(L,g,b.u0+.86,b.v0+.4,h);hatchBox(L,g,b.u0+.3,b.v0+1.18,h);
          // 太陽能小陣列（後右格）
          solarRoof(L,g,b.u0+1.34,b.v0+.08,.5,.84,h+1,.26);
          // 空調／遙測機箱（梯間小屋旁）
          boxZ(g,b.u0+.74,b.v0+1.24,.14,.1,h,4,'#dfe3e5','#eceff0','#b9c1c6');const fp=P(b.u0+.81,b.v0+1.29,h+4);RC(g,fp[0]-2,fp[1]-1,4,2,'#7d878d');
          boxZ(g,2.62,2.9,.2,.2,h,7,'#b3b8b0','#d6d1c4','#aaa497');const dp=P(2.68,3.1,h+6);L.pgL(g,dp[0],dp[1],4,6,'#6f7478');
          const mp=P(1.9,1.5,h);RC(g,mp[0],mp[1]-12,1,12,'#6c757a');RC(g,mp[0]-2,mp[1]-13,5,2,'#34597a');RC(g,mp[0]+1,mp[1]-8,2,2,'#e4e8ea');if(ng)RC(ng,mp[0]+1,mp[1]-8,1,1,'#7dffd0');}});
        railTop(L,S,4.9,1.66,1.3,1.9,1.92,14);
        S.t(4.95,g=>{const v=3.25;for(let k=0;k<=14;k++){const t=k/14,u=2.0+.56*t;BL(g,P(u,v,14*t),P(u+.05,v,14*t),'#8d887d');}
          BL(g,P(2.0,v,0),P(2.56,v,14),'#5f5b54');BL(g,P(2.0,v,4),P(2.56,v,18),'#dfe4e6');});
        L.gable(S,.4,2.1,.82,.5,10,4,{deco:(g,ng,b)=>{const dp=P(b.u0+.1,b.v1,8);L.pgL(g,dp[0],dp[1],7,8,'#6f7478');
          rowL(g,ng,b.v1,b.u0+.34,b.u1-.04,4,3,3,3,C.win,C.lit,431);rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,4,3,2,3,C.win,C.lit,432);}});
        S.o(2.9,g=>{pipeV(L,g,1.12,2.1,.86,2);pipeU(L,g,1.12,1.66,1.5,2);valve(L,g,.86,1.8,4);valve(L,g,1.45,1.5,4);});
        L.car(S,.5,2.86,'#c0392b','#8e2a20',true);
        L.tree(S,.45,3.25,1.2,56);L.tree(S,1.1,3.3,1.3,57);L.tree(S,3.62,.5,1.3,58);L.tree(S,3.2,.4,1.1,59);L.tree(S,2.2,.45,1.1,60);
        L.lamp(S,1.5,3.45);L.lamp(S,3.62,3.3);
        return {gate:[.2,.34]};
      },
      (K,L,g,S)=>{ // v4 露明混凝土配水池＋屋頂太陽能板、閥室、變流器箱、溢流階梯跌水渠＋排水溝、加氯站
        const {P,RC,BL,boxZ,quad,rowL,rowR}=L;
        L.lawn(g,1544);L.asph(g,3.44,.12,.22,3.2);L.asph(g,2.6,3.0,1.06,.5);
        quad(g,.2,3.48,3.2,.2,'#a9a497');quad(g,.24,3.53,3.12,.1,'#4a7c8a');
        quad(g,1.22,2.86,.2,.62,'#b7b2a5');for(let k=0;k<6;k++){const v=2.9+k*.1;BL(g,P(1.24,v),P(1.4,v),'#8f8a7e');}quad(g,1.27,2.88,.1,.6,'#5d8e9c');
        for(let k=0;k<6;k++){const v=2.9+k*.1;BL(g,P(1.27,v),P(1.37,v),'#d4e6ea');}
        resv(L,S,.42,.46,2.84,2.4,11,{roof:'#a9aca3',deco:(g,ng,b)=>{solarRoof(L,g,b.u0+.06,b.v0+.06,b.u1-b.u0-.12,b.v1-b.v0-.12,b.h,.26);}});
        S.o(3.1,g=>{boxZ(g,1.2,2.86,.24,.08,0,6,'#cfcabd','#d6d1c4','#a39d91');});
        L.gable(S,3.34,2.14,.3,.56,12,5,{d:5.9,deco:(g,ng,b)=>{const dp=P(b.u1,b.v1-.06,8);L.pgR(g,dp[0],dp[1],5,8,'#6f7478');
          rowL(g,ng,b.v1,b.u0+.04,b.u1-.04,5,3,1,3,C.win,C.lit,441,1);rowR(g,ng,b.u1,b.v0+.04,b.v1-.2,5,3,2,3,C.win,C.lit,442);}});
        S.o(5.1,g=>{pipeU(L,g,3.26,3.34,2.4,2);valve(L,g,3.3,2.4,4);});
        S.o(5.6,(g,ng)=>{for(let i=0;i<2;i++){boxZ(g,2.7+i*.26,3.08,.18,.12,0,8,'#8e9a93','#a3aea7','#77837c');for(let k=0;k<4;k++){const u=2.72+i*.26+k*.035;BL(g,P(u,3.2,1),P(u,3.2,6),'#6a766f');}
          const w=P(2.78+i*.26,3.2,7);RC(g,w[0],w[1],1,1,'#52c79e');if(ng)RC(ng,w[0],w[1],1,1,'#7dffd0');}});
        L.flat(S,.3,2.96,.6,.4,9,{deco:(g,ng,b)=>{rowL(g,ng,b.v1,b.u0+.04,b.u1-.2,3,3,2,3,C.win,C.lit,443);rowR(g,ng,b.u1,b.v0+.04,b.v1-.04,3,3,2,3,C.win,C.lit,444);
          const dp=P(b.u1-.14,b.v1,7);L.pgL(g,dp[0],dp[1],6,7,'#8e969a');}});
        L.tank(S,1.02,3.1,.07,11,{band:'#c7a33b',d:4.2});
        L.tree(S,3.62,.4,1.3,61);L.tree(S,3.2,.3,1.1,62);L.tree(S,1.8,3.3,1.2,63);L.tree(S,2.3,3.35,1.1,64);L.tree(S,.2,1.6,1.2,65);
        L.lamp(S,3.3,3.3);L.lamp(S,.2,2.4);
        return {gate:[.66,.82]};
      },
    ];
    build(154,W,H,AX,AY,SZ,L154);
  }catch(e){console.error('infra575 k154',e);if(DEV)throw e;}
});
