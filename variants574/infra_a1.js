(window.__variants574=window.__variants574||[]).push(function infra_a1(A){
  const B=A.SPR().bld;
  /* ============ infra_a1 共用像素工具（整數像素、硬邊、光從左） ============ */
  const tool=(W,H,AX,AY,SZ)=>{
    const K=A.iso575(W,H,AX,AY,SZ),P=K.P,hsh=K.hsh;
    const R=(g,x,y,w,h,c)=>{if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
    // 掃描線多邊形：像素中心取樣，無反鋸齒
    const fp=(g,pts,c)=>{
      g.fillStyle=c;let y0=1e9,y1=-1e9;
      for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1];}
      for(let y=Math.floor(y0);y<=Math.ceil(y1);y++){
        const yc=y+.5,xs=[];
        for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];
          if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
        xs.sort((p,q)=>p-q);
        for(let i=0;i+1<xs.length;i+=2){const xa=Math.round(xs[i]),xb=Math.round(xs[i+1]);if(xb>xa)g.fillRect(xa,y,xb-xa,1);}
      }
    };
    const ln=(g,a,b,c)=>{
      g.fillStyle=c;let x0=Math.round(a[0]),y0=Math.round(a[1]);const x1=Math.round(b[0]),y1=Math.round(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
      for(let n=0;n<600;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}
    };
    const dot=(g,p,c,w=1,h=1)=>R(g,p[0],p[1],w,h,c);
    // 方盒（可抬高 z）
    const bx=(g,u0,v0,du,dv,h,top,left,right,z=0)=>{const u1=u0+du,v1=v0+dv;
      if(left)fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      if(right)fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      if(top)fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);
      return {u0,v0,u1,v1,du,dv,z,h,t:z+h};};
    // 面上的矩形：fV 在 v=常數（亮面），fU 在 u=常數（暗面），fT 水平面
    const fV=(g,v,ua,ub,h0,h1,c)=>fp(g,[P(ua,v,h0),P(ub,v,h0),P(ub,v,h1),P(ua,v,h1)],c);
    const fU=(g,u,va,vb,h0,h1,c)=>fp(g,[P(u,va,h0),P(u,vb,h0),P(u,vb,h1),P(u,va,h1)],c);
    const fT=(g,u0,v0,du,dv,h,c)=>fp(g,[P(u0,v0,h),P(u0+du,v0,h),P(u0+du,v0+dv,h),P(u0,v0+dv,h)],c);
    const colV=(g,u,v,h0,h1,c,w=1)=>{const a=P(u,v,h1),b=P(u,v,h0);R(g,a[0],a[1],w,Math.round(b[1])-Math.round(a[1]),c);};
    // 百葉：面上一組水平線
    const louvV=(g,v,ua,ub,h0,h1,bg,ln1,step=2)=>{fV(g,v,ua,ub,h0,h1,bg);for(let h=h0+1;h<h1;h+=step)ln(g,P(ua,v,h),P(ub,v,h),ln1);};
    const louvU=(g,u,va,vb,h0,h1,bg,ln1,step=2)=>{fU(g,u,va,vb,h0,h1,bg);for(let h=h0+1;h<h1;h+=step)ln(g,P(u,va,h),P(u,vb,h),ln1);};
    // 直立圓柱（rx 像素半徑，ry=rx/2）
    const cylV=(g,u,v,rx,z,h,top,l,m,d,rim)=>{
      const c=P(u,v,z),cx=c[0],cyB=c[1],cyT=c[1]-h,ry=rx/2;
      for(let x=Math.floor(cx-rx);x<Math.ceil(cx+rx);x++){
        const dx=(x+.5-cx)/rx;if(Math.abs(dx)>1)continue;
        const e=ry*Math.sqrt(1-dx*dx),col=dx<-.4?l:(dx<.3?m:d);
        const y0=Math.round(cyT-e),y1=Math.round(cyB+e);R(g,x,y0,1,y1-y0,col);
        if(top){const t0=Math.round(cyT-e),t1=Math.round(cyT+e);R(g,x,t0,1,Math.max(1,t1-t0),top);if(rim){R(g,x,t0,1,1,rim);}}
      }
      return [cx,cyT];
    };
    // 橢圓（任意兩軸向量）多邊形
    const ell=(g,c,a,b,col,n=18)=>{const pts=[];for(let i=0;i<n;i++){const t=i/n*Math.PI*2;pts.push([c[0]+a[0]*Math.cos(t)+b[0]*Math.sin(t),c[1]+a[1]*Math.cos(t)+b[1]*Math.sin(t)]);}fp(g,pts,col);};
    // 臥式圓柱：沿 u 或 v 軸（油槽、消音器）
    const cylH=(g,axis,s0,s1,w,hc,rp,dk,md,lt,cap)=>{
      const A1=axis==='u'?[-.703*rp,.351*rp]:[.703*rp,.351*rp],B1=[0,-rp];
      const at=s=>axis==='u'?P(s,w,hc):P(w,s,hc);
      const st=1/64;
      for(let s=s0;s<=s1+1e-6;s+=st)ell(g,at(s),A1,B1,dk);
      for(let s=s0;s<=s1-st;s+=st){const c=at(s);ell(g,[c[0],c[1]-rp*.22],[A1[0]*.78,A1[1]*.78],[0,-rp*.7],md);}
      for(let s=s0+st;s<=s1-2*st;s+=st){const c=at(s);R(g,c[0]-(axis==='u'?1:0),c[1]-rp*.72,1,1,lt);}
      const e=at(s1);ell(g,e,A1,B1,cap);ell(g,e,[A1[0]*.55,A1[1]*.55],[0,-rp*.55],md);
    };
    // 黃色三角警告牌
    const warn=(g,x,y)=>{x=Math.round(x);y=Math.round(y);R(g,x,y,1,1,'#f0c840');R(g,x-1,y+1,3,1,'#f0c840');R(g,x-2,y+2,5,1,'#e0b030');R(g,x,y+1,1,2,'#2b2b2b');};
    // 圖層：獨立描邊後疊到 g（讓前後物件之間也有外框）
    const stamp=(g,fn)=>{const[lc,lg]=A.cv(W,H);fn(lg);K.hard(lc);A.outlineSprite(lc,28,34,42);g.drawImage(lc,0,0);};
    // 草地、鋪面
    const grassDia=(g,seed,col='#6f9152')=>{fp(g,[P(0,0),P(SZ,0),P(SZ,SZ),P(0,SZ)],col);
      for(let i=0;i<Math.round(46*SZ*SZ);i++){const p=P(hsh(seed,i,5)*SZ,hsh(seed,i,6)*SZ,0);R(g,p[0],p[1],1,1,hsh(seed,i,7)<.5?'#62864a':'#83a562');}};
    const shrub=(g,u,v,r,seed)=>{const p=P(u,v,0);const x=Math.round(p[0]),y=Math.round(p[1]);
      fp(g,[[x-r,y-1],[x-r+1,y-r],[x+r-1,y-r],[x+r,y-1],[x+r-1,y+1],[x-r+1,y+1]],'#4d7a3e');
      R(g,x-r+1,y-r,Math.max(1,r),1,'#6f9e55');R(g,x-r+1,y-r+1,1,1,'#6f9e55');R(g,x+1,y-1,r-1,1,'#3e6532');};
    // 喬木：樹幹＋圓冠（左上亮、右下暗）
    const tree=(q,u,v,r,h,seed=0)=>{const p=P(u,v,0);const x=Math.round(p[0]),y=Math.round(p[1]);
      R(q,x,y-h,1,h,'#6b5140');R(q,x+1,y-h,1,h,'#4f3b2f');
      const cy=y-h-r+2;
      for(let yy=-r;yy<=r;yy++){const hw=Math.round(Math.sqrt(r*r-yy*yy)*1.15);R(q,x-hw,cy+yy,hw*2+2,1,'#4f7f41');}
      for(let yy=-r+1;yy<=0;yy++){const hw=Math.round(Math.sqrt(r*r-yy*yy)*.62);R(q,x-hw-1,cy+yy-1,hw+1,1,'#6c9c52');}
      for(let yy=1;yy<r;yy++){const hw=Math.round(Math.sqrt(r*r-yy*yy)*1.05);R(q,x+2,cy+yy,hw-1,1,'#3d6634');}
      for(let i=0;i<4;i++){R(q,x-r+Math.floor(hsh(seed,i,11)*(2*r)),cy-r+2+Math.floor(hsh(seed,i,12)*(2*r-3)),1,1,hsh(seed,i,13)<.5?'#85b565':'#355c2d');}
    };
    // 下沉坑：在遮罩（地面開口）內畫坑壁／坑底
    const pit=(g,open,draw)=>{const[lc,lg]=A.cv(W,H);draw(lg);const[mc,mg]=A.cv(W,H);fp(mg,open,'#ffffff');
      lg.globalCompositeOperation='destination-in';lg.drawImage(mc,0,0);lg.globalCompositeOperation='source-over';g.drawImage(lc,0,0);};
    // 路燈（可指定高度）
    const lamp=(q,ng,u,v,h=24,dir=1)=>{const p=P(u,v,0);R(q,p[0],p[1]-h,1,h,'#5f686e');R(q,p[0],p[1]-h,dir*3,1,'#5f686e');
      const hx=dir>0?p[0]+2:p[0]-4;R(q,hx,p[1]-h,3,2,'#c7cdd1');if(ng){R(ng,hx,p[1]-h+1,3,1,'#ffe2a0');}};
    return Object.assign({},K,{K,R,fp,ln,dot,bx,fV,fU,fT,colV,louvV,louvU,cylV,ell,cylH,warn,stamp,grassDia,shrub,tree,pit,lamp});
  };
  const ROT={};   // 除錯用：{k:N} 把第 N 個變體輪到 v0 位置檢視；定稿必須是空物件
  const run=(k,W,H,AX,AY,SZ,layouts)=>{
    const T=tool(W,H,AX,AY,SZ),n=layouts.length;
    layouts.forEach((fn,v)=>{
      const {c,g,nc,ng,sc,sg}=T.canvases();
      const opt=fn(T,g,sg,ng,k*10+v)||{};
      const spr=T.finish(c,g,sc,nc,{fence:opt.fence!==false,gate:opt.gate});
      if(opt.post)opt.post(g,ng);
      B[k+'_1_'+((v-(ROT[k]||0)+n)%n)]=spr;
    });
  };

  /* ================= k161 配電變電站（1×1） ================= */
  try{
    const MET={t:'#b3babe',l:'#d0d5d8',r:'#9ba3a8',seam:'#8e979c',dk:'#4d565c'};
    const TR={t:'#5f6d72',l:'#74838b',r:'#55626a',fin:'#4a575e',hi:'#8b9aa2'};
    // 油浸式配電變壓器（散熱片、套管、儲油櫃、冷卻風扇）
    const distTx=(T,g,ng,u0,v0,du,dv,h,fans)=>{
      const {P,R,ln,bx,fV,fU,colV,cylH}=T;
      const b=bx(g,u0,v0,du,dv,h,TR.t,TR.l,TR.r,1);
      for(let u=u0+.03;u<b.u1-.02;u+=.0625){colV(g,u,b.v1,2,h,TR.fin);}          // +v 面散熱片
      const rb=bx(g,b.u1,v0+.03,.06,dv-.06,h-2,'#6b7980','#7b8a92','#4e5b62',1);   // +u 側散熱器組
      for(let v=rb.v0+.02;v<rb.v1;v+=.04)ln(g,P(rb.u1,v,2),P(rb.u1,v,h-2),'#3f4b51');
      if(fans){for(const v of [rb.v0+.05,rb.v1-.05]){const p=P(rb.u1,v,0);R(g,p[0]-1,p[1]-2,3,2,'#2f383d');R(g,p[0],p[1]-2,1,1,'#8a969c');}}
      R(g,...P(u0+du*.25,b.v1,h-3),2,1,'#c9d0d4');                                  // 銘牌
      cylH(g,'u',u0+.04,u0+du*.62,v0+.06,h+5,2,'#56636a','#76858d','#a9b6bd','#4c585e');   // 儲油櫃
      colV(g,u0+.08,v0+.06,h+1,h+4,'#3f4a50');colV(g,u0+du*.55,v0+.06,h+1,h+4,'#3f4a50');
      for(let i=0;i<3;i++){const p=P(u0+.07+i*.07,v0+dv*.62,h+1);R(g,p[0],p[1]-5,1,5,'#e3e6e3');R(g,p[0]-1,p[1]-6,3,1,'#8b5a3a');R(g,p[0],p[1]-3,1,1,'#b9bfbd');}  // 高壓套管
      for(let i=0;i<4;i++){const p=P(u0+du*.55+i*.035,v0+dv-.03,h+1);R(g,p[0],p[1]-2,1,2,'#d6d0c2');}                 // 低壓套管
      return b;
    };
    run(161,76,98,38,96,1,[
      // v0 戶外圍籬式：電桿引入＋油浸變壓器＋金屬封閉開關櫃
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,warn}=T;
        T.ground(g,seed);
        fT(g,.50,.14,.42,.34,0,'#c7c3b9');ln(g,P(.50,.48),P(.92,.48),'#a19d93');ln(g,P(.92,.14),P(.92,.48),'#a19d93');   // 變壓器油坑基座
        fT(g,.07,.52,.48,.24,0,'#c2beb4');                                                                             // 開關櫃基座
        for(let u=.25;u<.50;u+=.06)fT(g,u,.20,.045,.07,0,'#b9b5ab');                                                    // 電纜溝蓋板：電桿→變壓器
        for(let v=.30;v<.52;v+=.06)fT(g,.36,v,.07,.045,0,'#b9b5ab');                                                    // 電纜溝蓋板：→開關櫃
        T.backFence(g);
        // 高壓引入電桿（橫擔、礙子、電纜頭、避雷器、下引電纜護管）
        const pp=P(.18,.18,0),PH=39;   // 電桿壓低 7px（原 46），不搶主體
        R(sg,pp[0]-1,pp[1]-PH,1,PH,'#c4bfb4');R(sg,pp[0],pp[1]-PH,1,PH,'#948f85');
        R(sg,pp[0]-7,pp[1]-PH+6,15,1,'#6d767c');R(sg,pp[0]-4,pp[1]-PH+7,1,2,'#6d767c');R(sg,pp[0]+4,pp[1]-PH+7,1,2,'#6d767c');
        for(const dx of [-6,0,6]){R(sg,pp[0]+dx,pp[1]-PH+3,1,3,'#e6eae8');R(sg,pp[0]+dx-1,pp[1]-PH+2,3,1,'#9aa3a6');}
        R(sg,pp[0]-5,pp[1]-PH+15,11,1,'#6d767c');
        for(const dx of [-4,0,4]){R(sg,pp[0]+dx,pp[1]-PH+12,1,3,'#a86f4a');R(sg,pp[0]+dx,pp[1]-PH+11,1,1,'#e6eae8');}
        R(sg,pp[0]+1,pp[1]-PH+16,1,PH-25,'#2f3538');R(sg,pp[0]+1,pp[1]-9,2,9,'#8e979c');
        R(sg,pp[0]-1,pp[1]-PH+21,1,3,'#f0c840');
        // 變壓器（右側）
        distTx(T,sg,ng,.54,.19,.22,.18,11,true);
        // 金屬封閉開關櫃（左前，三面盤）
        const s=bx(sg,.10,.56,.39,.14,13,MET.t,MET.l,MET.r);
        fT(sg,.09,.55,.41,.16,13,'#a3abb0');fT(sg,.11,.57,.37,.12,14,MET.t);
        for(let i=1;i<3;i++)colV(sg,.10+.13*i,s.v1,1,13,MET.seam);
        for(let i=0;i<3;i++){const u=.10+.13*i;
          fV(sg,s.v1,u+.03,u+.08,10,12,MET.dk);
          const led=P(u+.10,s.v1,11);R(sg,led[0],led[1],1,1,i===1?'#e0584a':'#52c79e');R(ng,led[0],led[1],1,1,i===1?'#ff6a55':'#7dffd0');
          const hd=P(u+.105,s.v1,7);R(sg,hd[0],hd[1],1,2,'#5d666c');
          ln(sg,P(u+.02,s.v1,3),P(u+.09,s.v1,3),'#8a9398');ln(sg,P(u+.02,s.v1,5),P(u+.09,s.v1,5),'#8a9398');
        }
        { const p=P(.06+.13,s.v1,9);warn(sg,p[0],p[1]-1); }
        T.louvU(sg,s.u1,.59,.67,3,10,'#8f989d','#6f787d');
        // 照明桿（左角）
        const lp=P(.12,.88,0);R(sg,lp[0],lp[1]-28,1,28,'#6d767c');R(sg,lp[0],lp[1]-29,4,2,'#c7cdd1');R(ng,lp[0],lp[1]-28,4,1,'#ffe2a0');
return {gate:[.30,.50],post:(g2)=>{const p=P(.95,.62,0);warn(g2,p[0],p[1]-7);const q=P(.95,.34,0);R(g2,q[0]-1,q[1]-6,4,3,'#f2f2f2');R(g2,q[0],q[1]-5,2,1,'#c0392b');}};
      },
      // v1 磚造室內變電所：雙坡屋頂、百葉窗、雙開鋼門、屋脊通風帽
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,cylV,warn,shrub}=T;
        T.ground(g,seed);
        fT(g,.10,.14,.80,.74,0,'#c4c0b7');                                        // 鋪面
        for(let u=.26;u<.9;u+=.16)ln(g,P(u,.14),P(u,.88),'#b4b0a7');
        fT(g,.38,.88,.18,.10,0,'#c4c0b7');                                        // 入口步道
        for(const [uu,vv] of [[.14,.74],[.19,.72]]){fT(g,uu,vv,.045,.05,0,'#b3afa5');ln(g,P(uu,vv+.05),P(uu+.045,vv+.05),'#99958b');}  // 電纜溝蓋板：電桿→牆腳
        T.backFence(g);
        const u0=.20,v0=.22,du=.56,dv=.46,h=17,u1=u0+du,v1=v0+dv;
        const BR={l:'#b56a4d',r:'#8e4f3b',cl:'#a35c42',cr:'#7f4533'};
        bx(sg,u0,v0,du,dv,2,'#bdb8ae','#cfcac0','#a8a398');                       // 勒腳
        bx(sg,u0,v0,du,dv,h-2,null,BR.l,BR.r,2);
        for(let hh=5;hh<h;hh+=3){ln(sg,P(u0,v1,hh),P(u1,v1,hh),BR.cl);ln(sg,P(u1,v0,hh),P(u1,v1,hh),BR.cr);}
        ln(sg,P(u0,v1,h),P(u1,v1,h),'#d8d2c6');ln(sg,P(u1,v0,h),P(u1,v1,h),'#9a8f86');
        // 雙開鋼門（加寬）＋雨遮＋門燈＋大號高壓警告牌
        const d0=.40,d1=.62,dm=(d0+d1)/2;
        fV(sg,v1,d0-.01,d1+.01,2,14,'#4a524f');                                   // 門框
        fV(sg,v1,d0,d1,2,13,'#6f8279');colV(sg,dm,v1,2,13,'#4f5f58');
        R(sg,...P(dm-.03,v1,5),1,1,'#c8d0cc');R(sg,...P(dm+.03,v1,5),1,1,'#c8d0cc');
        for(const hh of [3,4])ln(sg,P(d0+.02,v1,hh),P(d1-.02,v1,hh),'#62736b');     // 門下通風槽
        fT(sg,d0-.02,v1,d1-d0+.04,.04,15,'#9c978d');
        {const p=P(dm,v1,12);const x=Math.round(p[0]),y=Math.round(p[1]);          // 高壓警告牌：黃 5×5＋黑邊
          const rows=[[1,3],[1,3],[2,5],[2,5],[3,7],[3,7],[3,7]];rows.forEach(([o,w],i)=>R(sg,x-o,y+i,w,1,'#2b2b2b'));
          [[0,1],[1,3],[1,3],[2,5],[2,5]].forEach(([o,w],i)=>R(sg,x-o,y+1+i,w,1,i<3?'#f4cc3c':'#e3b52c'));
          R(sg,x,y+2,1,2,'#2b2b2b');R(sg,x,y+5,1,1,'#2b2b2b');}
        {const p=P(dm,v1+.02,17);R(sg,p[0]-1,p[1],2,1,'#e8e0c0');R(ng,p[0]-1,p[1],2,1,'#ffe8ad');R(ng,p[0]-1,p[1]+1,2,1,'rgba(255,220,150,.55)');}
        // 百葉窗（右側一扇；左側讓給電纜進線）
        louvV(sg,v1,.66,.74,6,13,'#5d5a55','#9a958c');fV(sg,v1,.65,.75,5,6,'#cfc9bd');
        // +v 牆腳出地電纜護管 → 電纜終端箱
        {const cu=.255;
          fV(sg,v1,cu-.01,cu+.05,0,2,'#7b858a');                                   // 出地彎頭
          fV(sg,v1,cu,cu+.035,2,9,'#9aa4a9');colV(sg,cu+.035,v1,2,9,'#6c767b');     // 護管
          fV(sg,v1,cu-.035,cu+.08,9,15,'#8e979c');fV(sg,v1,cu-.025,cu+.07,10,14,'#a9b2b6');  // 終端箱
          ln(sg,P(cu-.035,v1,15),P(cu+.08,v1,15),'#c5cdd0');
          colV(sg,cu+.02,v1,10,14,'#7b8488');}
        // +u 暗面：大型變壓器進氣百葉（深灰金屬框）
        {const va=v0+.08,vb=v0+.40;
          fU(sg,u1,va,vb,1,15,'#3f464a');                                         // 外框
          louvU(sg,u1,va+.02,vb-.02,2,14,'#262b2e','#6e777c',2);
          colV(sg,u1,(va+vb)/2,2,14,'#3f464a');                                   // 中框
          ln(sg,P(u1,va,15),P(u1,vb,15),'#59626a');}        // 雙坡屋頂（屋脊沿 u）
        const vm=v0+dv/2,rh=9,o=.03;
        fp(sg,[P(u0-o,v0-o,h),P(u1+o,v0-o,h),P(u1+o,vm,h+rh),P(u0-o,vm,h+rh)],'#566064');
        fp(sg,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],BR.r);                                     // 山牆
        louvU(sg,u1,vm-.05,vm+.05,h+1,h+5,'#4d4a46','#7f7a72');
        fp(sg,[P(u0-o,vm,h+rh),P(u1+o,vm,h+rh),P(u1+o,v1+o,h-1),P(u0-o,v1+o,h-1)],'#727b80');
        for(const t of [.3,.55,.8]){const vv=vm+(v1+o-vm)*t,hh=h+rh-(rh+1)*t;ln(sg,P(u0-o,vv,hh),P(u1+o,vv,hh),'#667075');}
        ln(sg,P(u0-o,vm,h+rh),P(u1+o,vm,h+rh),'#98a1a5');
        ln(sg,P(u1+o,vm,h+rh),P(u1+o,v1+o,h-1),'#5a6368');
        // 屋脊金屬通風罩（蘑菇型鍍鋅罩：短頸＋寬罩＋罩下陰影）
        for(const uu of [.36,.60]){const p=P(uu,vm,h+rh);const x=Math.round(p[0]),y=Math.round(p[1]);
          R(sg,x-1,y-3,3,3,'#7a848a');R(sg,x+1,y-3,1,3,'#5a6368');                 // 頸
          R(sg,x-3,y-5,7,2,'#a3adb2');R(sg,x-3,y-5,4,1,'#dde3e6');R(sg,x+1,y-4,2,1,'#7f898f');   // 罩
          R(sg,x-2,y-6,5,1,'#c6ced2');R(sg,x-2,y-3,5,1,'#3c4448');}                 // 罩頂／罩下陰影
        // 進線電桿（矮）：橫擔＋礙子＋電纜終端頭，沿桿下引護管入地
        {const pp=P(.12,.79,0),x=Math.round(pp[0]),y=Math.round(pp[1]),PH=27;
          R(sg,x-1,y-PH,1,PH,'#c4bfb4');R(sg,x,y-PH,1,PH,'#948f85');
          R(sg,x-7,y-PH+5,15,1,'#6d767c');R(sg,x-4,y-PH+6,1,2,'#6d767c');R(sg,x+4,y-PH+6,1,2,'#6d767c');
          for(const dx of [-6,0,6]){R(sg,x+dx,y-PH+2,1,3,'#e6eae8');R(sg,x+dx-1,y-PH+1,3,1,'#9aa3a6');}
          R(sg,x-5,y-PH+13,11,1,'#6d767c');
          for(const dx of [-4,4]){R(sg,x+dx,y-PH+10,1,3,'#a86f4a');R(sg,x+dx,y-PH+9,1,1,'#e6eae8');}
          R(sg,x+2,y-PH+14,1,PH-14,'#9aa4a9');
          R(sg,x-1,y-11,1,3,'#f0c840');}
        shrub(sg,.86,.16,3);shrub(sg,.86,.80,2);
        return {fence:true,gate:[.34,.58]};
      },
      // v2 混凝土平頂變電所＋戶外變壓器間（鋼格柵圍籬）
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,cylV,warn,fence}=T;
        T.ground(g,seed);
        fT(g,.56,.20,.36,.46,0,'#c7c3b9');                                        // 變壓器間基座
        for(let u=.60;u<.9;u+=.08)fT(g,u,.68,.06,.06,0,'#b3afa5');                // 電纜溝蓋板
        fT(g,.10,.84,.36,.10,0,'#c4c0b7');
        T.fence(g,[.56,.20],[.92,.20]);
        // 建築本體
        const u0=.12,v0=.16,du=.40,dv=.66,h=20,u1=u0+du,v1=v0+dv;
        const CO={t:'#b9b4aa',l:'#dad5ca',r:'#aca69b'};
        bx(sg,u0,v0,du,dv,h,CO.t,CO.l,CO.r);
        for(const hh of [7,14]){ln(sg,P(u0,v1,hh),P(u1,v1,hh),'#cac5ba');ln(sg,P(u1,v0,hh),P(u1,v1,hh),'#9c968b');}
        fT(sg,u0+.03,v0+.03,du-.06,dv-.06,h,'#9e998f');                          // 女兒牆內凹
        bx(sg,u0+.08,v0+.10,.10,.12,3,'#8e979c','#a8b0b4','#7d868b',h);          // 屋頂檢修口
        for(const vv of [v0+.36,v0+.52]){const c=cylV(sg,u0+.24,vv,2,h,3,'#c2c9cc','#d6dcdf','#b0b8bc','#8f989d');R(sg,c[0]-2,c[1]-3,5,2,'#aeb6ba');R(sg,c[0]-1,c[1]-4,3,1,'#d6dcdf');}
        // +u 面：變壓器室百葉大門、鋼門
        louvU(sg,u1,v0+.08,v0+.26,0,14,'#6a7470','#8d9793');colV(sg,u1,v0+.17,0,14,'#4f5956');
        fU(sg,u1,v0+.34,v0+.46,0,12,'#7a8a84');colV(sg,u1,v0+.40,0,12,'#56645f');
        {const p=P(u1,v0+.40,11);T.warn(sg,p[0]+1,p[1]-8);}
        louvU(sg,u1,v0+.52,v0+.62,8,13,'#6a7470','#8d9793');
        // +v 面：人員門、高窗百葉、名牌、壁燈
        fV(sg,v1,u0+.10,u0+.20,0,11,'#6f8279');colV(sg,u0+.15,v1,0,11,'#4f5f58');
        louvV(sg,v1,u0+.26,u0+.36,10,16,'#6a7470','#8d9793');
        fV(sg,v1,u0+.10,u0+.22,13,16,'#3d6aa0');ln(sg,P(u0+.11,v1,15),P(u0+.20,v1,15),'#dfe8f2');
        {const p=P(u0+.23,v1,12);R(sg,p[0],p[1],1,2,'#e8e0c0');R(ng,p[0],p[1],1,2,'#ffe8ad');R(ng,p[0]-1,p[1]+2,3,1,'rgba(255,220,150,.5)');}
        // 戶外變壓器
        distTx(T,sg,ng,.62,.26,.20,.18,10,false);
        // 前側鋼格柵
        return {fence:false,post:(g2)=>{fence(g2,[.92,.20],[.92,.66]);fence(g2,[.56,.66],[.92,.66],[.3,.62]);
          const p=P(.74,.66,0);warn(g2,p[0],p[1]-6);}};
      },
    ]);
  }catch(e){console.error('infra575 k161',e);}

  /* ================= k162 電纜開關站（1×1） ================= */
  try{
    // 電纜溝蓋板（沿 u 或 v 一排）
    const trench=(T,g,axis,s0,s1,w,col='#bdb9af',jt='#9c988e')=>{const {P,fT,ln}=T;
      for(let s=s0;s<s1-.02;s+=.08){if(axis==='u'){fT(g,s,w,.075,.09,0,col);ln(g,P(s+.075,w),P(s+.075,w+.09),jt);}
        else{fT(g,w,s,.09,.075,0,col);ln(g,P(w,s+.075),P(w+.09,s+.075),jt);}}};
    // 電纜標示樁（白樁紅頂，不描邊）
    const marker=(T,g,u,v)=>{const p=T.P(u,v,0);T.R(g,p[0],p[1]-4,1,4,'#eceae2');T.R(g,p[0]+1,p[1]-4,1,4,'#b9b6ad');T.R(g,p[0],p[1]-5,2,1,'#d0402f');T.R(g,p[0],p[1],2,1,'rgba(40,40,40,.35)');};
    // 花紋鋼板人孔／吊裝蓋（黃黑邊）
    const hatch=(T,g,u0,v0,du,dv,leaves=2)=>{const {P,fT,ln,R,fp}=T;
      fT(g,u0-.02,v0-.02,du+.04,dv+.04,0,'#6f6c66');
      fT(g,u0,v0,du,dv,1,'#8e9397');
      for(let i=0;i<24;i++){const a=(i*.37)%1,b=(i*.61)%1;const p=P(u0+du*(.08+.84*a),v0+dv*(.08+.84*b),1);R(g,p[0],p[1],1,1,'#a9aeb1');}
      if(leaves>1)ln(g,P(u0+du/2,v0,1),P(u0+du/2,v0+dv,1),'#6d7276');
      for(let t=0;t<1;t+=.2){ln(g,P(u0+du*t,v0+dv,1),P(u0+du*Math.min(1,t+.1),v0+dv,1),'#e8c33a');ln(g,P(u0+du,v0+dv*t,1),P(u0+du,v0+dv*Math.min(1,t+.1),1),'#e8c33a');}
    };
    const bollard=(T,g,u,v)=>{const p=T.P(u,v,0);T.R(g,p[0],p[1]-5,2,5,'#e8c33a');T.R(g,p[0],p[1]-3,2,1,'#2b2b2b');T.R(g,p[0]+1,p[1]-5,1,5,'#b8952a');};
    run(162,76,98,38,96,1,[
      // v0 預鑄混凝土開關站：低矮平頂、百葉、雙開檢修門、電纜溝蓋板與標示樁、小圍籬
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,warn}=T;
        T.ground(g,seed);
        fT(g,.16,.20,.62,.56,0,'#c6c2b8');
        trench(T,g,'v',.76,.96,.40);trench(T,g,'u',.78,.96,.36);
        T.backFence(g);
        const u0=.22,v0=.26,du=.50,dv=.40,h=12,u1=u0+du,v1=v0+dv;
        bx(sg,u0,v0,du,dv,h,null,'#d6d2c7','#aca69a');
        for(let u=u0+.125;u<u1-.01;u+=.125)colV(sg,u,v1,0,h,'#c2bdb1');
        for(let v=v0+.1;v<v1-.01;v+=.1)colV(sg,u1,v,0,h,'#9a9488');
        bx(sg,u0-.03,v0-.03,du+.06,dv+.06,2,'#9d998f','#bdb8ad','#8e8a80',h);      // 屋頂板（出簷）
        fT(sg,u0+.02,v0+.02,du-.02,dv-.02,h+2,'#8f8b83');
        bx(sg,u0+.30,v0+.10,.08,.08,2,'#a8a39a','#c0bbb1','#8f8a81',h+2);          // 屋頂通風口
        // +v 面：雙開檢修門、百葉、高壓危險標誌
        fV(sg,v1,u0+.17,u0+.33,0,10,'#77897f');colV(sg,u0+.25,v1,0,10,'#52615a');
        ln(sg,P(u0+.17,v1,10),P(u0+.33,v1,10),'#5a6a62');
        R(sg,...P(u0+.23,v1,5),1,1,'#c8d0cc');R(sg,...P(u0+.27,v1,5),1,1,'#c8d0cc');
        {const p=P(u0+.21,v1,9);warn(sg,p[0],p[1]);}
        louvV(sg,v1,u0+.04,u0+.13,2,9,'#6a6660','#a29d93');
        louvV(sg,v1,u0+.37,u0+.46,2,9,'#6a6660','#a29d93');
        fV(sg,v1,u0+.37,u0+.46,10,11,'#f2f2ee');R(sg,...P(u0+.40,v1,10),2,1,'#c0392b');   // 編號牌
        // +u 面：通風百葉
        louvU(sg,u1,v0+.06,v0+.16,5,10,'#5a5752','#8c877e');louvU(sg,u1,v0+.24,v0+.34,5,10,'#5a5752','#8c877e');
        {const p=P(u0+.25,v1+.01,12);R(sg,p[0],p[1]-1,2,1,'#e8e0c0');R(ng,p[0],p[1]-1,2,1,'#ffe8ad');R(ng,p[0]-1,p[1],4,1,'rgba(255,220,150,.45)');}
        return {gate:[.36,.56],post:(g2)=>{marker(T,g2,.34,.84);marker(T,g2,.62,.84);marker(T,g2,.88,.30);}};
      },
      // v1 戶外金屬開關箱群：綠色環網櫃＋分接箱＋灰色計量箱，混凝土基座、護欄樁
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,warn}=T;
        T.ground(g,seed);
        fT(g,.14,.26,.72,.50,0,'#cdc9bf');ln(g,P(.14,.76),P(.86,.76),'#a8a49a');ln(g,P(.86,.26),P(.86,.76),'#a8a49a');
        trench(T,g,'v',.78,.96,.30);trench(T,g,'u',.86,.96,.44);
        const G={t:'#5b8466',l:'#6f9a78',r:'#4b6e55',sm:'#557d60',dk:'#34503c'};
        const cab=(q,u0,v0,du,dv,h,col,nD)=>{
          const b=bx(q,u0,v0,du,dv,h,col.t,col.l,col.r);
          ln(q,P(u0,b.v1,h),P(b.u1,b.v1,h),col.hi);ln(q,P(b.u1,v0,h),P(b.u1,b.v1,h),col.sm);   // 頂蓋緣
          ln(q,P(u0,b.v1,h-1),P(b.u1,b.v1,h-1),col.dk);
          for(let i=1;i<nD;i++)colV(q,u0+du*i/nD,b.v1,1,h-1,col.dk);
          for(let i=0;i<nD;i++){const ua=u0+du*i/nD,ub=u0+du*(i+1)/nD,uc=(ua+ub)/2;
            ln(q,P(ua+.025,b.v1,h-3),P(ub-.025,b.v1,h-3),col.dk);                               // 門上通風槽
            R(q,...P(ub-.03,b.v1,h*.55),1,2,'#d6ddd9');}                                        // 把手
          ln(q,P(u0,b.v1,1),P(b.u1,b.v1,1),col.dk);
          return b;};
        const GR={t:'#9aa2a6',l:'#b8bfc2',r:'#848c91',sm:'#737b80',dk:'#6a7277',hi:'#cfd5d8'};
        G.hi='#8fb898';G.sm='#3f5f48';
        // 後排：大型環網櫃（三門）＋分接箱（各自描邊，看得出是分開的箱體）
        T.stamp(g,q=>{const a=cab(q,.18,.30,.36,.15,12,G,3);
          {const p=P(.24,a.v1,6);warn(q,p[0],p[1]);}
          fV(q,a.v1,.42,.48,8,9,'#f2f2ee');
          louvU(q,a.u1,.33,.42,3,8,G.r,G.dk);
          const led=P(.45,a.v1,5);R(q,led[0],led[1],1,1,'#e0584a');R(ng,led[0],led[1],1,1,'#ff6a55');});
        T.stamp(g,q=>{const b2=cab(q,.62,.30,.20,.13,10,G,2);
          {const p=P(.72,b2.v1,5);warn(q,p[0]-1,p[1]);}});
        // 前排：灰色計量／低壓箱＋窄型電纜分接箱
        T.stamp(g,q=>{const c=cab(q,.22,.60,.13,.10,8,GR,1);
          const led2=P(.26,c.v1,6);R(q,led2[0],led2[1],1,1,'#52c79e');R(ng,led2[0],led2[1],1,1,'#7dffd0');});
        T.stamp(g,q=>{cab(q,.56,.58,.11,.10,9,G,1);});
        return {fence:false,post:(g2)=>{bollard(T,g2,.12,.24);bollard(T,g2,.90,.24);bollard(T,g2,.12,.80);bollard(T,g2,.90,.80);bollard(T,g2,.51,.84);
          marker(T,g2,.40,.90);marker(T,g2,.93,.52);}};
      },
      // v2 地下式開關站：地面僅留出入口亭、通風井、吊裝蓋板、標示樁，位於綠地鋪面
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,cylV,warn,shrub}=T;
        T.grassDia(g,seed);
        A.diaEdge(g,6,'#5b7a44',38,64,32);
        fT(g,.10,.10,.80,.62,0,'#c9c5bb');
        for(let u=.26;u<.9;u+=.16)ln(g,P(u,.10),P(u,.72),'#b7b3a9');
        for(let v=.26;v<.72;v+=.16)ln(g,P(.10,v),P(.90,v),'#b7b3a9');
        fT(g,.40,.72,.16,.26,0,'#c9c5bb');
        hatch(T,g,.14,.46,.30,.20,2);                                             // 設備吊裝口
        hatch(T,g,.52,.52,.12,.12,1);                                             // 人孔
        // 通風井（百葉＋頂蓋）
        const vs=bx(sg,.16,.16,.14,.14,9,'#bdb8ad','#d8d3c8','#aaa498');
        louvV(sg,vs.v1,.18,.28,2,8,'#5d5a55','#9a958c');louvU(sg,vs.u1,.18,.28,2,8,'#5d5a55','#9a958c');
        bx(sg,.14,.14,.18,.18,2,'#8f8b83','#b0aba1','#86827a',9);
        // 出入口亭（單坡屋頂、門、壁燈）
        const u0=.56,v0=.14,du=.28,dv=.26,h=15,u1=u0+du,v1=v0+dv;
        bx(sg,u0,v0,du,dv,h,'#c6c1b6','#dcd7cc','#aea89c');
        fp(sg,[P(u0-.03,v0-.03,h+4),P(u1+.03,v0-.03,h+4),P(u1+.03,v1+.03,h),P(u0-.03,v1+.03,h)],'#6f7a80');
        ln(sg,P(u0-.03,v1+.03,h),P(u1+.03,v1+.03,h),'#8d989e');
        fp(sg,[P(u1,v0,h),P(u1,v1,h),P(u1,v0,h+4)],'#aea89c');
        fp(sg,[P(u1+.03,v0-.03,h+4),P(u1+.03,v1+.03,h),P(u1+.03,v1+.03,h-1),P(u1+.03,v0-.03,h+3)],'#56616a');
        fV(sg,v1,u0+.08,u0+.18,0,11,'#6f8279');ln(sg,P(u0+.08,v1,11),P(u0+.18,v1,11),'#4f5f58');R(sg,...P(u0+.16,v1,6),1,1,'#c8d0cc');
        {const p=P(u0+.22,v1,9);warn(sg,p[0],p[1]);}
        louvU(sg,u1,v0+.06,v0+.20,4,10,'#5d5a55','#9a958c');
        {const p=P(u0+.13,v1+.01,13);R(sg,p[0],p[1],2,1,'#e8e0c0');R(ng,p[0],p[1],2,1,'#ffe8ad');R(ng,p[0]-1,p[1]+1,4,1,'rgba(255,220,150,.45)');}
        // 排氣帽
        {const c=cylV(sg,.80,.64,2,0,7,'#b9c1c4','#d0d6d9','#b0b8bc','#8a9398');R(sg,c[0]-3,c[1]-2,6,2,'#9aa3a7');R(sg,c[0]-2,c[1]-3,4,1,'#c9d0d3');}
        shrub(sg,.10,.86,3);shrub(sg,.74,.86,3);shrub(sg,.92,.62,2);
        return {fence:false,post:(g2)=>{marker(T,g2,.36,.80);marker(T,g2,.66,.80);}};
      },
    ]);
  }catch(e){console.error('infra575 k162',e);}

  /* ================= k164 共同管道入口（2×2） ================= */
  try{
    const CON={t:'#a8a399',l:'#d8d3c8',r:'#b0aa9e',pp:'#96918a'};
    const GL={g:'#4f6f86',m:'#35495a',h:'#8fb0c4'};
    // 鋪面廣場＋格線
    const plaza=(T,g,u0,v0,du,dv,col='#c9c5bb',jt='#bab6ac',step=.2)=>{const {P,fT,ln}=T;fT(g,u0,v0,du,dv,0,col);
      for(let u=u0+step;u<u0+du-.01;u+=step)ln(g,P(u,v0),P(u,v0+dv),jt);
      for(let v=v0+step;v<v0+dv-.01;v+=step)ln(g,P(u0,v),P(u0+du,v),jt);};
    // 管廊走向標示帶（紅磚色鋪面＋黃色標示牌）
    const route=(T,g,axis,w0,w1)=>{const {P,fT,ln,R,SZ}=T;
      if(axis==='u'){fT(g,0.02,w0,1.96,w1-w0,0,'#b28b72');ln(g,P(.02,w0),P(1.98,w0),'#9a7560');ln(g,P(.02,w1),P(1.98,w1),'#9a7560');
        for(let u=.2;u<1.9;u+=.4){const p=P(u,(w0+w1)/2,0);R(g,p[0]-2,p[1]-1,4,2,'#e8c33a');R(g,p[0]-1,p[1]-1,2,1,'#f6e08a');}}
      else{fT(g,w0,.02,w1-w0,1.96,0,'#b28b72');ln(g,P(w0,.02),P(w0,1.98),'#9a7560');ln(g,P(w1,.02),P(w1,1.98),'#9a7560');
        for(let v=.2;v<1.9;v+=.4){const p=P((w0+w1)/2,v,0);R(g,p[0]-2,p[1]-1,4,2,'#e8c33a');R(g,p[0]-1,p[1]-1,2,1,'#f6e08a');}}};
    const hatchZ=(T,q,u0,v0,du,dv,z,leaves=2)=>{const {P,fT,ln,R,bx}=T;
      bx(q,u0-.03,v0-.03,du+.06,dv+.06,z,'#bdb8ad','#cfcabf','#a39e93');
      fT(q,u0,v0,du,dv,z,'#8e9397');
      for(let i=0;i<Math.round(60*du*dv/.05);i++){const a=(i*.377)%1,b=(i*.618)%1;const p=P(u0+du*(.06+.88*a),v0+dv*(.06+.88*b),z);R(q,p[0],p[1],1,1,'#a9aeb1');}
      if(leaves>1)ln(q,P(u0+du/2,v0,z),P(u0+du/2,v0+dv,z),'#5f6468');
      for(let t=0;t<.99;t+=.16){ln(q,P(u0+du*t,v0+dv,z),P(u0+du*Math.min(1,t+.08),v0+dv,z),'#e8c33a');ln(q,P(u0+du,v0+dv*t,z),P(u0+du,v0+dv*Math.min(1,t+.08),z),'#e8c33a');
        ln(q,P(u0+du*t,v0,z),P(u0+du*Math.min(1,t+.08),v0,z),'#e8c33a');ln(q,P(u0,v0+dv*t,z),P(u0,v0+dv*Math.min(1,t+.08),z),'#e8c33a');}
      for(const [a,b] of [[.25,.5],[.75,.5]]){const p=P(u0+du*a,v0+dv*b,z);R(q,p[0]-1,p[1],2,1,'#4f5458');}   // 把手
    };
    // 通風井塔：混凝土框＋大百葉＋頂蓋
    const ventTower=(T,q,u0,v0,du,dv,h,cap)=>{const {P,R,bx,fV,fU,louvV,louvU,ln,colV}=T;
      const b=bx(q,u0,v0,du,dv,h,CON.t,CON.l,CON.r);
      louvV(q,b.v1,u0+.04,b.u1-.04,h*.45,h-4,'#666b72','#a3a9ae');louvU(q,b.u1,v0+.04,b.v1-.04,h*.45,h-4,'#565b61','#8a9095');
      colV(q,(u0+b.u1)/2,b.v1,h*.45,h-4,'#b9b4a9');colV(q,b.u1,(v0+b.v1)/2,h*.45,h-4,'#99938a');
      ln(q,P(u0,b.v1,h*.45-2),P(b.u1,b.v1,h*.45-2),'#c4bfb3');
      if(cap==='hood'){bx(q,u0-.04,v0-.04,du+.08,dv+.08,2,'#8a8f94','#a9aeb2','#7b8085',h);bx(q,u0+.02,v0+.02,du-.04,dv-.04,3,'#9ba0a4','#b5babd','#878c90',h+2);
        bx(q,u0+.05,v0+.05,du-.1,dv-.1,2,'#7b8085','#9ba0a4','#6d7276',h+5);}
      else{bx(q,u0-.03,v0-.03,du+.06,dv+.06,3,'#9e998f','#c4bfb3','#99938a',h);}
      return b;};
    run(164,136,150,68,148,2,[
      // v0 出入口建築＋通風井塔＋投料口＋人員出口亭＋走向標示帶
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,cylV,warn,tree,lamp,shrub}=T;
        T.grassDia(g,seed);A.diaEdge(g,6,'#5b7a44',68,84,64);
        plaza(T,g,.08,.08,1.40,1.84);plaza(T,g,1.48,.08,.44,.60);
        route(T,g,'u',1.04,1.30);
        fT(g,1.52,.72,.40,1.20,0,'#6f9152');
        // 出入口建築（兩層，帶狀窗、雨遮、捲門、招牌）
        const u0=.18,v0=.20,du=.70,dv=.62,h=26,u1=u0+du,v1=v0+dv;
        bx(sg,u0,v0,du,dv,h,CON.t,CON.l,CON.r);
        fT(sg,u0+.04,v0+.04,du-.08,dv-.08,h,'#948f86');
        fV(sg,v1,u0+.04,u1-.04,15,21,GL.g);for(let u=u0+.12;u<u1-.05;u+=.1)colV(sg,u,v1,15,21,GL.m);
        ln(sg,P(u0+.04,v1,20),P(u1-.04,v1,20),GL.h);
        fU(sg,u1,v0+.06,v1-.06,15,21,'#3f5a6e');for(let v=v0+.16;v<v1-.05;v+=.12)colV(sg,u1,v,15,21,'#2d3f4c');
        for(let u=u0+.16;u<u1-.08;u+=.2){const p=P(u,v1,18);R(ng,p[0],p[1],5,2,'rgba(255,226,160,.85)');}
        {const p=P(u0+.12,v0+.4,0);}
        fV(sg,v1,u0+.08,u0+.22,0,10,GL.g);colV(sg,u0+.15,v1,0,10,GL.m);fV(sg,v1,u0+.06,u0+.24,10,11,'#6b7075');
        bx(sg,u0+.05,v1,.20,.07,2,'#8d9196','#a9adb1','#7c8085',11);                                // 雨遮
        {const p=P(u0+.15,v1+.03,10);R(ng,p[0]-2,p[1],5,1,'#ffe8ad');R(ng,p[0]-4,p[1]+1,9,2,'rgba(255,220,150,.35)');}
        fV(sg,v1,u0+.34,u0+.60,0,11,'#8f959a');for(let hh=1;hh<11;hh+=2)ln(sg,P(u0+.34,v1,hh),P(u0+.60,v1,hh),'#747a7f');
        fV(sg,v1,u0+.32,u0+.62,11,12,'#6b7075');
        fV(sg,v1,u0+.30,u0+.64,22,25,'#2f5f8f');for(let u=u0+.34;u<u0+.61;u+=.045)R(sg,...P(u,v1,24),2,1,'#e6eef6');
        {const p=P(u0+.66,v1,6);warn(sg,p[0],p[1]);}
        louvU(sg,u1,v0+.12,v0+.30,2,10,'#666b72','#a3a9ae');
        bx(sg,u0+.10,v0+.10,.22,.20,7,'#b7b2a7','#cdc8bd','#a6a095',h);                             // 樓梯間
        fV(sg,v0+.30,u0+.14,u0+.22,h,h+6,'#6f8279');
        bx(sg,u0+.44,v0+.14,.10,.08,4,'#c2c8cb','#d6dbdd','#a8afb3',h);bx(sg,u0+.44,v0+.30,.10,.08,4,'#c2c8cb','#d6dbdd','#a8afb3',h);  // 屋頂空調
        // 通風井塔＋排風機房
        ventTower(T,sg,1.14,.20,.30,.30,40,'flat');
        {const b=bx(sg,1.54,.30,.24,.20,14,CON.t,CON.l,CON.r);louvV(sg,b.v1,1.57,1.75,4,12,'#666b72','#a3a9ae');
          const c=cylV(sg,1.66,.40,5,14,4,'#9ba3a7','#b9c1c4','#9aa3a7','#7a8388');R(sg,c[0]-4,c[1]-1,8,1,'#5d666b');}
        // 投料口（凸起蓋板）
        hatchZ(T,sg,1.10,.68,.40,.22,3,2);
        // 人員出口亭（玻璃）
        {const b=bx(sg,.40,1.46,.24,.22,13,'#8d9196',GL.g,'#3f5a6e');
          colV(sg,.52,b.v1,0,12,GL.m);ln(sg,P(.40,b.v1,6),P(.64,b.v1,6),GL.m);colV(sg,b.u1,1.57,0,12,'#2d3f4c');
          ln(sg,P(.41,b.v1,11),P(.50,b.v1,11),GL.h);
          bx(sg,.37,1.43,.30,.28,2,'#9aa0a4','#b6bbbf','#83898d',13);
          {const p=P(.46,b.v1,4);R(ng,p[0],p[1]-4,3,4,'rgba(255,226,160,.7)');}}
        tree(sg,1.70,.95,6,7,seed);tree(sg,1.78,1.40,5,6,seed+1);tree(sg,.16,1.78,6,7,seed+2);shrub(sg,1.60,1.75,3);
        lamp(sg,ng,1.00,1.40,24,-1);lamp(sg,ng,1.40,.60,24,1);
        return {fence:false,post:(g2)=>{for(const u of [1.08,1.24,1.40,1.56]){const p=P(u,.96,0);R(g2,p[0],p[1]-4,2,4,'#e8c33a');R(g2,p[0],p[1]-3,2,1,'#2b2b2b');}}};
      },
      // v1 斜坡入口：下沉坡道＋管廊洞口捲門＋擋土牆＋排水泵房＋雙排風百葉箱
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,cylV,warn,tree,lamp,shrub,pit}=T;
        T.grassDia(g,seed);A.diaEdge(g,6,'#5b7a44',68,84,64);
        plaza(T,g,.08,.08,1.84,1.84);
        // 坡道：前端（v 大）與地面齊平，往後（v 小）下沉到洞口；洞口牆朝 +v（亮面）正對鏡頭
        const ua=.92,ub=1.64,va=.74,vb=1.78,D=18;
        fT(g,ua-.05,va,ub-ua+.10,vb-va+.04,0,'#d2cdc2');
        pit(g,[P(ua,va,0),P(ub,va,0),P(ub,vb,0),P(ua,vb,0)],(q)=>{
          fp(q,[P(ua,va,-D),P(ub,va,-D),P(ub,vb,0),P(ua,vb,0)],'#5b5955');                          // 坡道面（瀝青）
          for(let v=va+.10;v<vb-.02;v+=.08){const hh=-D*(vb-v)/(vb-va);ln(q,P(ua+.02,v,hh),P(ub-.02,v,hh),'#6b6964');}   // 止滑溝
          for(let v=va+.04;v<vb;v+=.14){const hh=-D*(vb-v)/(vb-va),h2=-D*(vb-v-.07)/(vb-va);ln(q,P(ua+.05,v,hh),P(ua+.05,v+.07,h2),'#e8c33a');ln(q,P(ub-.05,v,hh),P(ub-.05,v+.07,h2),'#e8c33a');}
          fp(q,[P(ua,va,-D),P(ua,vb,0),P(ua,va,0)],'#9e998e');                                        // 左側擋土牆內面（暗）
          for(let hh=-D+4;hh<0;hh+=5)ln(q,P(ua,va,hh),P(ua,vb-(vb-va)*(-hh)/D,hh),'#8f8a80');
          fp(q,[P(ua,va,-D),P(ub,va,-D),P(ub,va,0),P(ua,va,0)],'#cdc8bc');                            // 洞口牆（亮）
          fV(q,va,ua+.10,ub-.16,-D,-D+13,'#1b1f23');                                                  // 管廊洞口
          fV(q,va,ua+.10,ub-.16,-D+6,-D+13,'#8f959a');for(let hh=-D+7;hh<-D+13;hh+=2)ln(q,P(ua+.10,va,hh),P(ub-.16,va,hh),'#71777c');   // 半開捲門
          fV(q,va,ua+.08,ub-.14,-D+13,-D+15,'#a7a296');
          fV(q,va,ub-.12,ub-.04,-D,-D+9,'#6f8279');                                                    // 人員門
          ln(q,P(ua+.02,va+.04,-D+1),P(ub-.02,va+.04,-D+1),'#34373a');                                // 截水溝格柵
          {const p=P((ua+ub)/2-.03,va,-D+16);R(q,p[0]-1,p[1],3,1,'#e8e0c0');R(ng,p[0]-1,p[1],3,1,'#ffe8ad');R(ng,p[0]-3,p[1]+1,7,3,'rgba(255,220,150,.35)');}
        });
        // 洞口上方頭牆（含標示牌）＋兩側擋土牆矮牆
        const hw=bx(sg,ua-.05,.50,ub-ua+.10,.24,12,CON.t,CON.l,CON.r);
        fT(sg,ua-.02,.53,ub-ua+.04,.18,12,'#948f86');
        fV(sg,hw.v1,ua+.12,ub-.18,4,9,'#2f5f8f');for(let u=ua+.16;u<ub-.2;u+=.05)R(sg,...P(u,hw.v1,7),2,1,'#e6eef6');
        bx(sg,ua-.05,va,.05,vb-va,4,'#cfcabe','#d8d3c8','#b0aa9e');
        bx(sg,ub,va,.05,vb-va,4,'#cfcabe','#d8d3c8','#b0aa9e');
        // 排水泵房（後左）
        {const b=bx(sg,.14,.16,.40,.36,17,CON.t,'#d2c7b5','#ada28f');fT(sg,.17,.19,.34,.30,17,'#948f86');
          fV(sg,b.v1,.20,.30,0,11,'#6f8279');colV(sg,.25,b.v1,0,11,'#4f5f58');louvV(sg,b.v1,.36,.48,7,13,'#666b72','#a3a9ae');
          louvU(sg,b.u1,.22,.34,4,12,'#565b61','#8a9095');
          cylV(sg,.42,.28,3,17,5,'#9ba3a7','#b9c1c4','#9aa3a7','#7a8388');
          {const p=P(.25,b.v1,13);R(sg,p[0],p[1],2,1,'#e8e0c0');R(ng,p[0],p[1],2,1,'#ffe8ad');}
          {const p=P(.42,b.v1,9);warn(sg,p[0],p[1]+3);}}
        // 雙排風百葉箱（後右）
        for(const u of [1.18,1.54]){const b=bx(sg,u,.14,.30,.24,13,CON.t,CON.l,CON.r);
          louvV(sg,b.v1,u+.03,u+.27,2,11,'#666b72','#a3a9ae');louvU(sg,b.u1,.17,.35,2,11,'#565b61','#8a9095');
          fT(sg,u+.03,.17,.24,.18,13,'#5b6065');for(let t=u+.06;t<u+.27;t+=.05)ln(sg,P(t,.17,13),P(t,.35,13),'#8a8f94');}
        // 投料口＋配電小亭（前左）
        hatchZ(T,sg,.26,.80,.40,.26,2,2);
        {const b=bx(sg,.30,1.36,.24,.20,12,'#8e979c','#a8b0b4','#7d868b');colV(sg,.42,b.v1,1,11,'#6f787d');
          {const p=P(.36,b.v1,8);warn(sg,p[0],p[1]);}const l=P(.48,b.v1,9);R(sg,l[0],l[1],1,1,'#52c79e');R(ng,l[0],l[1],1,1,'#7dffd0');}
        tree(sg,1.84,.66,6,7,seed);tree(sg,.18,1.78,6,7,seed+1);tree(sg,1.84,1.60,5,6,seed+2);shrub(sg,.66,1.84,3);
        lamp(sg,ng,1.80,1.10,24,-1);
        return {fence:false,post:(g2)=>{
          for(const uu of [ua-.025,ub+.025]){const a=P(uu,va,4),b=P(uu,vb,4);ln(g2,[a[0],a[1]-5],[b[0],b[1]-5],'#c9ced1');
            for(let t=0;t<=1.001;t+=.2){const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;R(g2,x,y-5,1,5,'#8e979c');}}
          for(const uu of [ua+.06,ub-.06]){const p=P(uu,vb+.06,0);R(g2,p[0],p[1]-6,2,6,'#e8c33a');R(g2,p[0],p[1]-4,2,1,'#2b2b2b');}}};
      },
      // v2 控制室＋雙通風塔（進／排）＋吊裝口門式吊架＋玻璃人員出口＋走向標示帶
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,cylV,warn,tree,lamp,shrub}=T;
        T.grassDia(g,seed);A.diaEdge(g,6,'#5b7a44',68,84,64);
        plaza(T,g,.08,.08,1.84,1.84);
        route(T,g,'v',1.00,1.16);
        fT(g,.08,1.74,.9,.18,0,'#6f9152');
        // 雙通風塔
        ventTower(T,sg,.20,.18,.28,.28,34,'flat');
        ventTower(T,sg,.62,.18,.28,.28,28,'hood');
        // 吊裝口＋門式吊架（黃色鋼構）
        hatchZ(T,sg,1.26,.30,.46,.34,3,2);
        const Y='#d9a92a',YD='#a67d1c';
        const leg=(q,u,v,h)=>{const p=P(u,v,0);R(q,p[0]-1,p[1]-h,2,h,Y);R(q,p[0],p[1]-h,1,h,YD);};
        leg(sg,1.22,.24,30);leg(sg,1.78,.24,30);
        ln(sg,P(1.22,.24,30),P(1.78,.24,30),Y);ln(sg,P(1.22,.24,31),P(1.78,.24,31),Y);
        leg(sg,1.22,.70,30);leg(sg,1.78,.70,30);
        ln(sg,P(1.22,.70,30),P(1.78,.70,30),Y);ln(sg,P(1.22,.70,31),P(1.78,.70,31),YD);
        ln(sg,P(1.50,.24,32),P(1.50,.70,32),YD);ln(sg,P(1.50,.24,31),P(1.50,.70,31),Y);
        {const p=P(1.50,.47,30);R(sg,p[0]-2,p[1]-1,4,4,'#4d5357');R(sg,p[0],p[1]+3,1,9,'#2f3336');R(sg,p[0]-1,p[1]+12,3,2,Y);}
        // 控制室（帶狀窗、門、屋頂空調與天線）
        const u0=.14,v0=1.02,du=.78,dv=.62,h=16,u1=u0+du,v1=v0+dv;
        bx(sg,u0,v0,du,dv,h,CON.t,'#dcd6ca','#b3ada1');
        fT(sg,u0+.03,v0+.03,du-.06,dv-.06,h,'#948f86');
        fV(sg,v1,u0+.24,u1-.05,6,12,GL.g);for(let u=u0+.34;u<u1-.05;u+=.1)colV(sg,u,v1,6,12,GL.m);ln(sg,P(u0+.24,v1,11),P(u1-.05,v1,11),GL.h);
        for(let u=u0+.28;u<u1-.1;u+=.2){const p=P(u,v1,9);R(ng,p[0],p[1],6,2,'rgba(255,226,160,.85)');}
        fU(sg,u1,v0+.08,v1-.08,6,12,'#3f5a6e');for(let v=v0+.18;v<v1-.05;v+=.12)colV(sg,u1,v,6,12,'#2d3f4c');
        fV(sg,v1,u0+.06,u0+.17,0,11,'#6f8279');colV(sg,u0+.115,v1,0,11,'#4f5f58');
        {const p=P(u0+.12,v1,13);R(sg,p[0],p[1],2,1,'#e8e0c0');R(ng,p[0],p[1],2,1,'#ffe8ad');R(ng,p[0]-2,p[1]+1,6,2,'rgba(255,220,150,.35)');}
        fV(sg,v1,u0+.24,u1-.05,13,15,'#2f5f8f');for(let u=u0+.28;u<u0+.6;u+=.045)R(sg,...P(u,v1,14),2,1,'#e6eef6');
        bx(sg,u0+.12,v0+.12,.12,.10,5,'#c2c8cb','#d6dbdd','#a8afb3',h);bx(sg,u0+.30,v0+.12,.12,.10,5,'#c2c8cb','#d6dbdd','#a8afb3',h);
        {const p=P(u0+.60,v0+.2,h);R(sg,p[0],p[1]-18,1,18,'#6d767c');R(sg,p[0]-2,p[1]-14,5,1,'#6d767c');R(sg,p[0]-1,p[1]-19,2,1,'#c0392b');R(ng,p[0]-1,p[1]-19,2,1,'#ff5a4a');}
        // 玻璃人員出口亭
        {const b=bx(sg,1.34,1.20,.24,.22,13,'#8d9196',GL.g,'#3f5a6e');
          colV(sg,1.46,b.v1,0,12,GL.m);ln(sg,P(1.34,b.v1,6),P(1.58,b.v1,6),GL.m);colV(sg,b.u1,1.31,0,12,'#2d3f4c');
          ln(sg,P(1.35,b.v1,11),P(1.44,b.v1,11),GL.h);
          bx(sg,1.31,1.17,.30,.28,2,'#9aa0a4','#b6bbbf','#83898d',13);
          {const p=P(1.40,b.v1,4);R(ng,p[0],p[1]-4,3,4,'rgba(255,226,160,.7)');}}
        // 排水泵井蓋＋設備箱
        hatchZ(T,sg,1.40,.96,.14,.14,1,1);
        bx(sg,1.66,1.00,.14,.10,9,'#8e979c','#a8b0b4','#7d868b');
        tree(sg,1.82,1.70,6,7,seed);tree(sg,.30,1.86,5,6,seed+1);tree(sg,1.84,.86,5,6,seed+2);shrub(sg,.70,1.84,3);
        lamp(sg,ng,1.08,.20,24,1);lamp(sg,ng,1.10,1.84,24,-1);
        return {fence:false};
      },
    ]);
  }catch(e){console.error('infra575 k164',e);}

  /* ================= k150 緊急微電網（2×2） ================= */
  try{
    const PAL={
      green:{t:'#5f7b5b',l:'#72906c',r:'#4f684c',seam:'#4a6046',lv:'#415540'},
      sand:{t:'#cbc3ac',l:'#e0d8c2',r:'#aea791',seam:'#a09984',lv:'#8a846f'},
      blue:{t:'#7b8c99',l:'#93a5b2',r:'#687884',seam:'#5f6f7c',lv:'#53616c'},
    };
    // 貨櫃式柴油發電機組：油箱底座、進氣百葉門、散熱器端、屋頂出風扇、消音器＋排氣管雨帽
    const genset=(T,q,ng,u0,v0,len,axis,pal)=>{
      const {P,R,ln,bx,fV,fU,fT,colV,louvV,louvU,cylH,ell}=T;
      const H=11,WD=.20,n=Math.max(3,Math.round(len/.19));
      const stack=(p)=>{R(q,p[0]-1,p[1]-13,2,13,'#6b7276');R(q,p[0],p[1]-13,1,13,'#4c5357');R(q,p[0]-2,p[1]-14,4,1,'#34393c');R(q,p[0]-2,p[1]-13,1,1,'#34393c');};
      if(axis==='u'){
        const b=bx(q,u0,v0,len,WD,H,pal.t,pal.l,pal.r);
        fV(q,b.v1,u0,b.u1,0,2,'#44494c');fU(q,b.u1,v0,b.v1,0,2,'#383c3f');
        for(let i=1;i<n;i++)colV(q,u0+len*i/n,b.v1,2,H,pal.seam);
        for(let i=0;i<n;i++){const ua=u0+len*i/n,ub=u0+len*(i+1)/n;
          if(i%2===1)louvV(q,b.v1,ua+.03,ub-.03,4,H-1,pal.lv,pal.l);else R(q,...P(ub-.035,b.v1,7),1,2,'#eef2ef');}
        louvU(q,b.u1,v0+.02,b.v1-.02,2,H,'#33383c','#62696e');
        {const p=P(u0+len*.4/n,b.v1,9);R(q,p[0]-1,p[1],3,2,'#f2f2ee');R(q,p[0],p[1],1,1,'#c0392b');}
        bx(q,b.u1-.21,v0+.02,.19,WD-.04,2,'#4b5155','#5d6468','#3f4549',H);
        {const c=P(b.u1-.115,v0+WD/2,H+2);ell(q,c,[5,0],[0,2.5],'#23282c');ell(q,c,[2,0],[0,1],'#7e878c');}
        cylH(q,'u',u0+.07,u0+.34,v0+WD/2,H+4,3,'#5f666a','#8e969a','#c6cdd0','#50575b');
        stack(P(u0+.37,v0+WD/2,H+3));
        {const p=P(u0+len*1.6/n,b.v1,9);R(q,p[0],p[1],1,1,'#52c79e');R(ng,p[0],p[1],1,1,'#7dffd0');}
        return b;
      }
      const b=bx(q,u0,v0,WD,len,H,pal.t,pal.l,pal.r);
      fV(q,b.v1,u0,b.u1,0,2,'#44494c');fU(q,b.u1,v0,b.v1,0,2,'#383c3f');
      for(let i=1;i<n;i++)colV(q,b.u1,v0+len*i/n,2,H,pal.seam);
      for(let i=0;i<n;i++){const va=v0+len*i/n,vb=v0+len*(i+1)/n;
        if(i%2===1)louvU(q,b.u1,va+.03,vb-.03,4,H-1,pal.lv,pal.t);else R(q,...P(b.u1,vb-.035,7),1,2,'#c9d0cc');}
      louvV(q,b.v1,u0+.02,b.u1-.02,2,H,'#3c4246','#737b80');
      bx(q,u0+.02,b.v1-.21,WD-.04,.19,2,'#4b5155','#5d6468','#3f4549',H);
      {const c=P(u0+WD/2,b.v1-.115,H+2);ell(q,c,[5,0],[0,2.5],'#23282c');ell(q,c,[2,0],[0,1],'#7e878c');}
      stack(P(u0+WD/2,v0+.05,H+3));
      cylH(q,'v',v0+.08,v0+.36,u0+WD/2,H+4,3,'#5f666a','#8e969a','#c6cdd0','#50575b');
      {const p=P(b.u1,v0+len*.5,9);R(q,p[0],p[1],1,1,'#52c79e');R(ng,p[0],p[1],1,1,'#7dffd0');}
      return b;
    };
    // 防溢堤＋臥式儲油槽
    const dike=(T,g,q,u0,v0,du,dv,drawIn)=>{const {P,ln,bx,fT}=T;
      fT(g,u0,v0,du,dv,0,'#b3afa5');for(let u=u0+.16;u<u0+du;u+=.16)ln(g,P(u,v0),P(u,v0+dv),'#a6a298');
      const W1=['#cdc8bc','#d9d4c8','#aca69a'];
      bx(q,u0,v0,du,.03,4,...W1);bx(q,u0,v0,.03,dv,4,...W1);
      drawIn();
      bx(q,u0,v0+dv-.03,du,.03,4,...W1);bx(q,u0+du-.03,v0,.03,dv,4,...W1);
    };
    const hTank=(T,q,axis,s0,s1,w,rp)=>{const {P,R,bx,cylH,colV,ln}=T;
      for(const s of [s0+.08,s1-.10]){if(axis==='u')bx(q,s,w-.07,.05,.14,4,'#8a867e','#9c978e','#7a766f');else bx(q,w-.07,s,.14,.05,4,'#8a867e','#9c978e','#7a766f');}
      cylH(q,axis,s0,s1,w,3+rp,rp,'#a9a59b','#dcd8ce','#f4f2ec','#c3bfb5');
      const m=axis==='u'?P((s0+s1)/2,w,3+rp):P(w,(s0+s1)/2,3+rp);
      R(q,m[0]-1,m[1]-2,3,3,'#f2f2ee');R(q,m[0],m[1]-2,1,1,'#c0392b');R(q,m[0]-1,m[1]-1,1,1,'#c0392b');R(q,m[0]+1,m[1]-1,1,1,'#3d6fb0');R(q,m[0],m[1],1,1,'#e8c33a');
      const t=axis==='u'?P(s0+.12,w,3+2*rp):P(w,s0+.12,3+2*rp);R(q,t[0],t[1]-4,1,4,'#6b7276');R(q,t[0]-1,t[1]-4,3,1,'#50575b');   // 通氣管
      const f=axis==='u'?P(s1-.2,w,3+2*rp):P(w,s1-.2,3+2*rp);R(q,f[0]-1,f[1]-2,3,2,'#8a9296');                                     // 注油口
    };
    // 微電網控制器機櫃（HMI 螢幕＋狀態燈）
    const mgc=(T,q,ng,u0,v0,nC)=>{const {P,R,bx,fV,colV}=T;
      for(let i=0;i<nC;i++){const u=u0+i*.085,b=bx(q,u,v0,.08,.10,11,'#a9b1b5','#c6cdd0','#949ca1');
        fV(q,b.v1,u+.015,u+.06,6,9,'#274a66');fV(ng,b.v1,u+.015,u+.06,6,9,'rgba(120,190,255,.75)');
        const l=P(u+.02,b.v1,4);R(q,l[0],l[1],1,1,i%2?'#e8c33a':'#52c79e');R(ng,l[0],l[1],1,1,i%2?'#ffd766':'#7dffd0');}
      ln2(T,q,P(u0,v0+.10,11),P(u0+nC*.085,v0+.10,11),'#dde2e4');};
    const ln2=(T,q,a,b,c)=>T.ln(q,a,b,c);
    // 自動切換開關（ATS）室
    const atsRoom=(T,q,ng,u0,v0,du,dv,h)=>{const {P,R,bx,fV,fU,fT,colV,louvV,louvU,warn}=T;
      const b=bx(q,u0,v0,du,dv,h,'#8f969a','#d9d3c6','#b3ac9f');
      fT(q,u0+.02,v0+.02,du-.04,dv-.04,h,'#9aa0a4');
      fV(q,b.v1,u0+.06,u0+.18,0,10,'#6f8279');colV(q,u0+.12,b.v1,0,10,'#4f5f58');
      fV(q,b.v1,u0+.22,u0+.34,9,12,'#2f5f8f');R(q,...P(u0+.25,b.v1,11),3,1,'#e6eef6');
      {const p=P(u0+.28,b.v1,7);warn(q,p[0],p[1]);}
      louvU(q,b.u1,v0+.05,b.v1-.05,3,9,'#5d5a55','#9a958c');
      bx(q,u0+du*.55,v0+dv*.3,.10,.10,4,'#c2c8cb','#d6dbdd','#a8afb3',h);
      {const p=P(u0+.12,b.v1+.01,11);R(q,p[0],p[1],2,1,'#e8e0c0');R(ng,p[0],p[1],2,1,'#ffe8ad');R(ng,p[0]-2,p[1]+1,6,2,'rgba(255,220,150,.35)');}
      return b;};
    // 小汽車（沿 v 停放）
    const car=(T,q,u,v,col)=>{const {P,R,bx,fT,fV}=T;
      bx(q,u,v,.13,.28,3,col[0],col[1],col[2],1);
      bx(q,u+.015,v+.06,.10,.15,3,'#3b4a55','#50616d','#2f3b44',4);
      fT(q,u+.015,v+.075,.10,.11,7,col[0]);
      const w1=P(u+.02,v+.26,0),w2=P(u+.13,v+.22,0);R(q,w1[0],w1[1]-1,2,1,'#1f2326');R(q,w2[0],w2[1]-2,2,1,'#1f2326');};
    const CARS=[['#dfe3e6','#eef1f3','#b9bfc3'],['#b8453c','#cc5a50','#8f3530'],['#3f6da0','#5485ba','#315580'],['#9aa1a6','#b3b9bd','#80878c'],['#3b3f44','#4c5157','#2c3034']];
    // 太陽能車棚（單柱懸臂、傾斜板面）
    const carport=(T,q,u0,v0,du,dv,hB,hF)=>{const {P,R,fp,ln,fV,fU}=T;const u1=u0+du,v1=v0+dv;
      for(let u=u0+.10;u<u1;u+=.36){const p=P(u,v0+dv*.45,0);R(q,p[0]-1,p[1]-hF-2,2,hF+2,'#7a848a');R(q,p[0],p[1]-hF-2,1,hF+2,'#5d666c');}
      fV(q,v1,u0,u1,hF-1,hF,'#39434c');fp(q,[P(u1,v0,hB-1),P(u1,v1,hF-1),P(u1,v1,hF),P(u1,v0,hB)],'#2c353d');
      fp(q,[P(u0,v0,hB),P(u1,v0,hB),P(u1,v1,hF),P(u0,v1,hF)],'#2f5878');
      for(let u=u0+.09;u<u1-.01;u+=.09)ln(q,P(u,v0,hB),P(u,v1,hF),'#4d7aa0');
      for(let t=1;t<4;t++){const v=v0+dv*t/4,h=hB+(hF-hB)*t/4;ln(q,P(u0,v,h),P(u1,v,h),'#5f8fb3');}
      ln(q,P(u0,v1,hF),P(u1,v1,hF),'#9ab8cc');ln(q,P(u0,v0,hB),P(u1,v0,hB),'#7fa2bb');};
    run(150,136,150,68,148,2,[
      // v0 貨櫃機組站：雙貨櫃柴油機＋電池貨櫃＋ATS 室＋控制櫃＋臥式油槽防溢堤＋變壓器
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,K}=T;
        T.ground(g,seed);
        fT(g,.14,.14,1.00,.68,0,'#cbc8c0');fT(g,1.20,.14,.72,.30,0,'#cbc8c0');
        T.road(g,.08,1.62,1.84,.16);
        for(let v=.84;v<.98;v+=.05)fT(g,.60,v,.06,.035,0,'#b9b5ab');
        T.backFence(g);
        genset(T,sg,ng,.20,.18,.84,'u',PAL.sand);
        K.container(sg,ng,1.24,.18,.56,.19);
        genset(T,sg,ng,.20,.52,.84,'u',PAL.sand);
        atsRoom(T,sg,ng,1.26,.56,.36,.30,14);
        mgc(T,sg,ng,1.68,.62,2);
        dike(T,g,sg,.18,1.02,.78,.40,()=>{hTank(T,sg,'u',.28,.86,1.22,5);});
        K.transformer(sg,ng,1.34,1.06);
        K.pole(sg,ng,.10,.95);K.pole(sg,ng,1.92,1.00);
        return {gate:[.62,.84]};
      },
      // v1 太陽能車棚＋電池貨櫃＋備用機組＋控制器（前半停車場開放，後半設備場圍籬）
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,K}=T;
        T.ground(g,seed);
        fT(g,.04,.98,1.92,.98,0,'#6e6c68');
        for(let u=.12;u<1.9;u+=.20){ln(g,P(u,1.12),P(u,1.46),'#d9d6cf');ln(g,P(u,1.60),P(u,1.92),'#d9d6cf');}
        ln(g,P(.04,1.52),P(1.96,1.52),'#8a8884');
        T.backFence(g);
        T.stamp(g,q=>{
          genset(T,q,ng,.18,.18,.80,'u',PAL.green);
          atsRoom(T,q,ng,1.18,.16,.34,.30,14);
          mgc(T,q,ng,1.60,.20,3);
          K.container(q,ng,.18,.52,.54,.18);K.container(q,ng,.82,.52,.40,.18);
          K.pcs(q,ng,1.40,.58);K.pcs(q,ng,1.66,.58);
        });
        T.fence(g,[1.95,.05],[1.95,.90]);T.fence(g,[.05,.90],[1.95,.90],[.40,.56]);
        [0,1,3,4,6,7].forEach((i,j)=>car(T,sg,.155+i*.20,1.16,CARS[(j+seed)%5]));
        carport(T,sg,.08,1.08,1.84,.40,19,15);
        [1,2,5,8].forEach((i,j)=>car(T,sg,.155+i*.20,1.62,CARS[(j*2+1)%5]));
        for(const u of [.30,.90,1.50]){const b=bx(sg,u,1.54,.05,.04,8,'#dfe3e5','#eef1f2','#b9c1c6');const l=P(u+.02,b.v1,6);R(sg,l[0],l[1],1,2,'#52c79e');R(ng,l[0],l[1],1,2,'#7dffd0');}
        K.pole(sg,ng,1.92,1.52);
        return {fence:false};
      },
      // v2 發電機房（建築型，屋頂消音器與排氣管）＋立式儲油槽防溢堤＋ATS 室＋變壓器＋控制櫃
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,cylH,cylV,warn,K}=T;
        T.ground(g,seed);
        fT(g,.10,.10,1.10,.80,0,'#cbc8c0');
        T.road(g,.08,1.66,1.84,.14);
        T.backFence(g);
        // 機房
        const u0=.16,v0=.16,du=.92,dv=.62,h=22,u1=u0+du,v1=v0+dv;
        bx(sg,u0,v0,du,dv,h,'#9a958b','#dcd6c8','#b7b0a2');
        fT(sg,u0+.03,v0+.03,du-.06,dv-.06,h,'#8c877d');
        for(const hh of [8,16])ln(sg,P(u0,v1,hh),P(u1,v1,hh),'#cdc7b8');
        for(const ua of [u0+.05,u0+.30]){louvV(sg,v1,ua,ua+.21,4,18,'#5f646a','#9da3a8');}
        fV(sg,v1,u0+.58,u0+.80,0,15,'#8f959a');for(let hh=1;hh<15;hh+=2)ln(sg,P(u0+.58,v1,hh),P(u0+.80,v1,hh),'#747a7f');fV(sg,v1,u0+.56,u0+.82,15,16,'#6b7075');
        fV(sg,v1,u0+.84,u0+.90,0,10,'#6f8279');
        {const p=P(u0+.52,v1,12);warn(sg,p[0],p[1]);}
        louvU(sg,u1,v0+.08,v0+.28,5,17,'#565b61','#8a9095');louvU(sg,u1,v0+.36,v0+.54,5,17,'#565b61','#8a9095');
        {const p=P(u0+.87,v1+.01,14);R(sg,p[0],p[1],2,1,'#e8e0c0');R(ng,p[0],p[1],2,1,'#ffe8ad');R(ng,p[0]-2,p[1]+1,6,2,'rgba(255,220,150,.35)');}
        for(const uu of [u0+.20,u0+.46,u0+.72]){
          bx(sg,uu-.03,v0+.14,.06,.04,3,'#6b7276','#7d8488','#5a6165',h);bx(sg,uu-.03,v0+.40,.06,.04,3,'#6b7276','#7d8488','#5a6165',h);
          cylH(sg,'v',v0+.10,v0+.44,uu,h+6,3,'#5f666a','#8e969a','#c6cdd0','#50575b');
          const p=P(uu,v0+.48,h+3);R(sg,p[0]-1,p[1]-14,2,14,'#6b7276');R(sg,p[0],p[1]-14,1,14,'#4c5357');R(sg,p[0]-2,p[1]-15,4,1,'#34393c');}
        // 立式儲油槽
        dike(T,g,sg,1.26,.16,.62,.60,()=>{
          const c=cylV(sg,1.57,.46,11,0,30,'#d4d0c6','#eeebe3','#d9d5cb','#b3afa5','#c2beb4');
          const p=P(1.57,.46,0);
          for(let hh=4;hh<30;hh+=9)ln(sg,[p[0]-11,p[1]-hh],[p[0]+10,p[1]-hh],'#c4c0b6');
          R(sg,p[0]-7,p[1]-33,1,33,'#6b7276');R(sg,p[0]-5,p[1]-33,1,33,'#6b7276');for(let hh=3;hh<32;hh+=3)R(sg,p[0]-7,p[1]-hh,3,1,'#8a9296');
          R(sg,p[0]+5,p[1]-26,1,20,'#d07a2a');
          R(sg,p[0]-10,p[1]-34,20,1,'#8a9296');R(sg,p[0]-1,p[1]-36,2,3,'#6b7276');
          R(sg,p[0]-2,p[1]-15,5,4,'#f2f2ee');R(sg,p[0],p[1]-15,1,1,'#c0392b');R(sg,p[0]-1,p[1]-14,3,1,'#c0392b');R(sg,p[0],p[1]-13,1,1,'#3d6fb0');
        });
        {const a=P(u1,.47,8),b=P(1.34,.47,8);ln(sg,a,b,'#50575b');ln(sg,[a[0],a[1]-1],[b[0],b[1]-1],'#8a9296');}
        // 前排：ATS 室＋變壓器＋控制櫃
        atsRoom(T,sg,ng,.18,1.02,.44,.34,15);
        {const a=P(.40,.78,10),b=P(.40,1.02,10);ln(sg,a,b,'#50575b');ln(sg,[a[0],a[1]+1],[b[0],b[1]+1],'#8a9296');}
        K.transformer(sg,ng,.86,1.06);
        mgc(T,sg,ng,1.34,1.12,3);
        bx(sg,1.36,1.40,.20,.12,9,'#8e9a93','#a3aea7','#77837c');
        K.pole(sg,ng,1.92,1.10);K.pole(sg,ng,.10,.98);
        return {gate:[.62,.84]};
      },
      // v3 大型並排機組（三台貨櫃沿 v 排列，散熱器端朝前）＋雙臥式油槽＋雙電池貨櫃＋控制樓
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,K}=T;
        T.ground(g,seed);
        fT(g,.12,.12,1.00,.94,0,'#cbc8c0');fT(g,1.12,.12,.80,.56,0,'#cbc8c0');
        for(let u=.30;u<1.0;u+=.30)for(let v=1.02;v<1.12;v+=.05)fT(g,u,v,.06,.035,0,'#b9b5ab');
        T.backFence(g);
        genset(T,sg,ng,.18,.16,.84,'v',PAL.blue);
        genset(T,sg,ng,.48,.16,.84,'v',PAL.blue);
        genset(T,sg,ng,.78,.16,.84,'v',PAL.blue);
        K.container(sg,ng,1.16,.16,.58,.19);K.container(sg,ng,1.16,.44,.58,.19);
        dike(T,g,sg,.16,1.16,.90,.66,()=>{hTank(T,sg,'u',.26,.94,1.36,5);hTank(T,sg,'u',.26,.94,1.64,5);});
        K.building(sg,ng,1.24,.80,.44,.30);mgc(T,sg,ng,1.72,.84,2);
        K.transformer(sg,ng,1.30,1.30);
        K.pole(sg,ng,1.92,.72);K.pole(sg,ng,1.92,1.86);
        return {gate:[.70,.90]};
      },
      // v4 燃氣熱電聯產（CHP）機房＋雙煙囪＋乾式冷卻器陣列＋調壓撬＋電池櫃＋控制室
      (T,g,sg,ng,seed)=>{
        const {P,R,fp,ln,bx,fV,fU,fT,colV,louvV,louvU,cylH,cylV,ell,warn,K}=T;
        T.ground(g,seed);
        fT(g,.12,.12,1.00,.96,0,'#cbc8c0');fT(g,1.10,.12,.82,.56,0,'#cbc8c0');fT(g,.16,1.16,.84,.40,0,'#cbc8c0');
        T.backFence(g);
        // 雙煙囪（機房後方）
        for(const uu of [.34,.62]){const c=cylV(sg,uu,.24,3,0,52,'#7d8488','#c9ced1','#aeb4b8','#868d91','#5d6468');
          const p=P(uu,.24,0);R(sg,p[0]-3,p[1]-50,6,3,'#c0392b');R(sg,p[0]-3,p[1]-43,6,2,'#eceae4');R(sg,p[0]-5,p[1]-36,10,1,'#6b7276');
          R(sg,p[0],p[1]-54,1,1,'#e0584a');R(ng,p[0]-1,p[1]-55,2,2,'#ff5a4a');}
        // CHP 機房（金屬壓型板）
        const u0=.16,v0=.36,du=.84,dv=.62,h=18,u1=u0+du,v1=v0+dv;
        bx(sg,u0,v0,du,dv,h,'#7f8a90','#b3bec4','#8b979e');
        for(let u=u0+.04;u<u1;u+=.04)colV(sg,u,v1,1,h,'#a3aeb4');
        for(let v=v0+.04;v<v1;v+=.04)colV(sg,u1,v,1,h,'#7e8990');
        fT(sg,u0+.02,v0+.02,du-.04,dv-.04,h,'#737e84');
        louvV(sg,v1,u0+.06,u0+.30,6,15,'#4f565c','#8c959b');
        fV(sg,v1,u0+.40,u0+.62,0,14,'#8f959a');for(let hh=1;hh<14;hh+=2)ln(sg,P(u0+.40,v1,hh),P(u0+.62,v1,hh),'#747a7f');
        fV(sg,v1,u0+.70,u0+.78,0,10,'#5d6b73');{const p=P(u0+.66,v1,12);warn(sg,p[0],p[1]);}
        fV(sg,v1,u0+.40,u0+.62,15,17,'#2f5f8f');for(let u=u0+.43;u<u0+.6;u+=.045)R(sg,...P(u,v1,16),2,1,'#e6eef6');
        louvU(sg,u1,v0+.10,v0+.50,4,14,'#4f565c','#7a838a');
        {const p=P(u0+.74,v1+.01,12);R(sg,p[0],p[1],2,1,'#e8e0c0');R(ng,p[0],p[1],2,1,'#ffe8ad');R(ng,p[0]-2,p[1]+1,6,2,'rgba(255,220,150,.35)');}
        for(const uu of [.34,.62]){cylH(sg,'v',v0+.10,v0+.40,uu,h+5,3,'#5f666a','#8e969a','#c6cdd0','#50575b');
          bx(sg,uu-.03,v0+.08,.06,.04,2,'#6b7276','#7d8488','#5a6165',h);
          const a=P(uu,v0+.10,h+5),b=P(uu,.27,h+5);ln(sg,a,b,'#5f666a');ln(sg,[a[0],a[1]-1],[b[0],b[1]-1],'#8e969a');}
        // 乾式冷卻器陣列（架高＋頂面風扇）
        {const cu=1.16,cv=.18,cdu=.66,cdv=.42,z=6;
          for(const [uu,vv] of [[cu+.03,cv+.03],[cu+cdu-.03,cv+.03],[cu+.03,cv+cdv-.03],[cu+cdu-.03,cv+cdv-.03]]){const p=P(uu,vv,0);R(sg,p[0],p[1]-z,1,z,'#5d666c');}
          bx(sg,cu,cv,cdu,cdv,4,'#6f787e','#8c959b','#5f686e',z);
          for(let i=0;i<4;i++)for(let j=0;j<2;j++){const c=P(cu+cdu*(i+.5)/4,cv+cdv*(j+.5)/2,z+4);ell(sg,c,[6,0],[0,3],'#2a3034');ell(sg,c,[4,0],[0,2],'#495156');R(sg,c[0]-1,c[1]-1,2,1,'#9aa3a8');}
          ln(sg,P(cu,cv+cdv,z+4),P(cu+cdu,cv+cdv,z+4),'#a9b1b6');}
        // 天然氣調壓撬
        {const su=1.50,sv=.72;fT(g,su-.04,sv-.04,.44,.32,0,'#bdb9af');
          const kb=bx(sg,su,sv,.12,.10,9,'#b9c0c3','#d2d8da','#a1a9ad');fV(sg,kb.v1,su+.03,su+.09,0,7,'#8d959a');
          for(const vv of [sv+.06,sv+.18]){bx(sg,su+.14,vv-.015,.24,.03,1,'#8a867e','#9c978e','#7a766f');
            const a=P(su+.13,vv,4),b=P(su+.38,vv,4);ln(sg,a,b,'#a67d1c');ln(sg,[a[0],a[1]-1],[b[0],b[1]-1],'#e8b830');}
          for(const uu of [su+.20,su+.30]){const p=P(uu,sv+.18,5);R(sg,p[0]-1,p[1]-3,3,2,'#b8453c');R(sg,p[0],p[1]-4,1,1,'#3a3f42');}
          {const p=P(su+.25,sv+.06,5);R(sg,p[0]-1,p[1]-3,3,2,'#6b7276');}}
        // 電池櫃＋PCS
        for(let r=0;r<2;r++){K.cabinet(sg,ng,.20,1.20+r*.14,.54,.12,300+r);}
        K.pcs(sg,ng,.78,1.22);
        // 控制室＋控制櫃
        atsRoom(T,sg,ng,1.10,1.14,.36,.30,14);
        mgc(T,sg,ng,1.52,1.30,3);
        K.pole(sg,ng,1.92,.80);K.pole(sg,ng,.10,1.60);
        return {gate:[.66,.86]};
      },
    ]);
  }catch(e){console.error('infra575 k150',e);}
});
