// T575 infra_a2：k148 高壓輸電變電站（2×2）／k149 電網調度中心（3×3）真實設施風格重畫。
// 分層合成：每個立體主體自成一層（hard 二值化＋深色外框），細鋼構／礙子／導線走不描邊的細線層（雙色像素保可讀）；
// 夜光按層遮擋（後層實體會擦掉被擋住的燈）。零亂數：只用 K.hsh 決定性雜湊。
(window.__variants574=window.__variants574||[]).push(function infra_a2(A){
  const B=A.SPR().bld;

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {W,H,P,poly,box}=K;
    const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h);};
    const BL=(g,a,b,c)=>{let x0=Math.round(a[0]),y0=Math.round(a[1]);const x1=Math.round(b[0]),y1=Math.round(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let n=0;n<600;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      poly(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      poly(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      poly(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const fL=(g,v,ua,ub,za,zb,c)=>poly(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);   // +v 面（左前、亮）
    const fR=(g,u,va,vb,za,zb,c)=>poly(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);   // +u 面（右前、暗）
    const flatQ=(g,u0,v0,du,dv,c,z=0)=>poly(g,[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)],c);
    // 像素平行四邊形：沿 +v 面（斜率 +.5）或 +u 面（斜率 -.5）的整數窗
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(Math.round(x0)+i,Math.round(y0)+o,1,h);}};
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0]-w+1,p[1]-h+Math.floor((w-1)*.5),w,h,-.5,c);};
    // 分層場景：o=立體主體（描外框）、t=細線層（不描邊）；依 d 由後往前
    const scene=(g,ng)=>{const items=[];
      const run=()=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;
        while(k<items.length){const it=items[k];const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);
          g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}
      };
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    const flat=(g,fn)=>{const[sc,sx]=A.cv(W,H);fn(sx);K.hard(sc);g.drawImage(sc,0,0);};
    const done=(c,g,nc,opt)=>{const[sc]=A.cv(W,H);return K.finish(c,g,sc,nc,opt);};
    // 落影（光從左 ⇒ 影子落向右側 +u−v）：先畫實心再二值化，以固定透明度疊到地面
    const shadow=(g,list,a=.2)=>{const[sc,sx]=A.cv(W,H);
      for(const[u0,v0,du,dv,h]of list){const k=h/70,q=(u,v)=>P(u,v),u1=u0+du,v1=v0+dv;
        const F=[q(u0,v0),q(u1,v0),q(u1,v1),q(u0,v1)],T=[q(u0+k,v0-k*.4),q(u1+k,v0-k*.4),q(u1+k,v1-k*.4),q(u0+k,v1-k*.4)];
        poly(sx,F,'#101418');poly(sx,T,'#101418');for(let i=0;i<4;i++)poly(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],'#101418');}
      K.hard(sc);g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=Math.round(cx);cy=Math.round(cy);for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));g.fillRect(cx-w,cy+y,2*w+1,1);}};
    // 直立圓柱：tones 左亮→右暗
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,Math.round(rx/2));cx=Math.round(cx);cy=Math.round(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));g.fillStyle=c;g.fillRect(cx+x,cy-h,1,h+yb+1);}
      if(rim)ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-(rim?1:0),Math.max(0,ry-(rim?1:0)),top);return[cx,cy-h];};
    const ribsL=(g,v,ua,ub,z0,z1,st,c)=>{for(let t=ua;t<=ub+1e-6;t+=st)BL(g,P(t,v,z0),P(t,v,z1),c);};
    const ribsR=(g,u,va,vb,z0,z1,st,c)=>{for(let t=va;t<=vb+1e-6;t+=st)BL(g,P(u,t,z0),P(u,t,z1),c);};
    const bandL=(g,v,ua,ub,z,c)=>BL(g,P(ua,v,z),P(ub,v,z),c);
    const bandR=(g,u,va,vb,z,c)=>BL(g,P(u,va,z),P(u,vb,z),c);
    // 沿面像素帶：a→b 為底線，向上 h 格；every>0 只畫每 every 欄、every<0 跳過每 |every| 欄（窗框）
    const strip=(g,a,b,h,c,every=0)=>{let p=a,q=b;if(p[0]>q[0]){p=b;q=a;}const x0=Math.round(p[0]),x1=Math.round(q[0]);g.fillStyle=c;
      for(let x=x0;x<=x1;x++){const k=x-x0;if(every>0&&k%every)continue;if(every<0&&k%(-every)===0)continue;
        const y=Math.round(p[1]+(q[1]-p[1])*(x-x0)/Math.max(1,x1-x0));g.fillRect(x,y-h+1,1,h);}};
    const stripL=(g,v,ua,ub,z,h,c,e=0)=>strip(g,P(ua,v,z),P(ub,v,z),h,c,e);
    const stripR=(g,u,va,vb,z,h,c,e=0)=>strip(g,P(u,va,z),P(u,vb,z),h,c,e);
    // 雙坡屋頂房（屋脊沿 u）
    const gable=(g,u0,v0,du,dv,h,rh,wl,wr,rl,rd)=>{const u1=u0+du,v1=v0+dv,vm=v0+dv/2;
      boxZ(g,u0,v0,du,dv,0,h,wl,wl,wr);
      poly(g,[P(u0-.02,v0-.03,h-1),P(u1+.02,v0-.03,h-1),P(u1+.02,vm,h+rh),P(u0-.02,vm,h+rh)],rd);
      poly(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],wr);
      poly(g,[P(u0-.02,v1+.03,h-1),P(u1+.02,v1+.03,h-1),P(u1+.02,vm,h+rh),P(u0-.02,vm,h+rh)],rl);
      BL(g,P(u0-.02,vm,h+rh),P(u1+.02,vm,h+rh),rd);};
    const car=(g,u,v,col,alongV)=>{const du=alongV?.07:.13,dv=alongV?.13:.07;
      boxZ(g,u,v,du,dv,1,3,col,col,col);boxZ(g,u+(alongV?.01:.03),v+(alongV?.03:.01),alongV?.05:.07,alongV?.07:.05,4,2,'#d7dee2','#3d4a55','#2f3a44');};
    const lamp=(S,u,v,h=24)=>S.t(u+v+.001,(s,n)=>{const p=P(u,v);RC(s,p[0],p[1]-h,1,h,'#59636a');RC(s,p[0]+1,p[1]-h,1,h,'#98a1a6');RC(s,p[0]-2,p[1]-h-1,5,2,'#d3d9dc');RC(n,p[0]-2,p[1]-h-1,5,2,'#ffe2a0');RC(n,p[0]-1,p[1]-h+1,3,1,'rgba(255,226,160,.55)');});
    return{RC,BL,lerp,boxZ,fL,fR,flatQ,pg,winL,winR,scene,flat,done,shadow,ell,cyl,ribsL,ribsR,bandL,bandR,strip,stripL,stripR,gable,car,lamp};
  };

  // 變電設備（細線層零件）
  const GEAR=(K,L)=>{
    const {P}=K,{RC,BL,lerp}=L;
    const ST={L:'#cdd3d6',D:'#566066',M:'#848d93'},CONC='#d2cec5';
    const PORC=[['#c4845a','#7a472b'],['#9a6240','#5a3420']];
    const GREY=[['#e4e8ea','#8a9398'],['#b8c0c4','#6b7479']];
    const ped=(g,p,h)=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-1,y-1,4,2,CONC);RC(g,x,y-h,1,h,ST.L);RC(g,x+1,y-h,1,h,ST.D);return[x,y-h];};
    const ins=(g,t,h,pal=PORC)=>{const[x,y]=t;for(let i=0;i<h;i++){const c=pal[i%2],yy=y-1-i;RC(g,x,yy,1,1,c[0]);RC(g,x+1,yy,1,1,c[1]);
        if(i%2===0&&i<h-1){RC(g,x-1,yy,1,1,c[0]);RC(g,x+2,yy,1,1,c[1]);}}return[x,y-h];};
    const wire=(g,a,b,sag=0,c='#434b50')=>{const n=Math.max(1,Math.round(Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))));let lx=null,ly=null;
      for(let i=0;i<=n;i++){const t=i/n,x=Math.round(a[0]+(b[0]-a[0])*t),y=Math.round(a[1]+(b[1]-a[1])*t+sag*4*t*(1-t));
        if(lx!==null&&Math.abs(y-ly)>1)BL(g,[lx,ly],[x,y],c);else RC(g,x,y,1,1,c);lx=x;ly=y;}};
    // 各設備回傳頂端接線點
    const cvt=(g,u,v)=>{let t=ped(g,P(u,v),7);RC(g,t[0]-1,t[1]-3,4,3,'#788287');RC(g,t[0]-1,t[1]-3,4,1,'#b0b8bc');t=ins(g,[t[0],t[1]-3],9);RC(g,t[0]-1,t[1]-1,4,1,'#d9dee0');return[t[0],t[1]-1];};
    const trap=(g,t)=>{RC(g,t[0]-2,t[1]-6,6,6,'#a3acb1');RC(g,t[0]-2,t[1]-6,1,6,'#d0d6d9');RC(g,t[0]+3,t[1]-6,1,6,'#6c767b');RC(g,t[0]-2,t[1]-6,6,1,'#e3e7e9');RC(g,t[0]-2,t[1]-3,6,1,'#889297');return[t[0],t[1]-6];};
    const cb=(g,u,v,mech)=>{const b=P(u,v);let t=ped(g,b,6);t=ins(g,t,6,GREY);RC(g,t[0]-2,t[1]-2,6,2,'#eceff1');RC(g,t[0]-2,t[1],6,1,'#7f898e');
      if(mech){const x=Math.round(b[0]),y=Math.round(b[1]);RC(g,x-5,y-6,3,5,'#8f999e');RC(g,x-5,y-6,1,5,'#c3cacd');RC(g,x-3,y-6,1,5,'#5f696e');}return[t[0],t[1]-2];};
    const ds=(g,u,v)=>{ped(g,P(u,v),6);const a=P(u,v-.07,6),b=P(u,v+.07,6);BL(g,a,b,ST.D);BL(g,[a[0],a[1]-1],[b[0],b[1]-1],ST.L);
      const ta=ins(g,[Math.round(a[0])-1,Math.round(a[1])-1],5,GREY),tb=ins(g,[Math.round(b[0])-1,Math.round(b[1])-1],5,GREY);
      BL(g,[ta[0],ta[1]-1],[tb[0]+1,tb[1]-1],'#f3f5f6');return[Math.round((ta[0]+tb[0])/2),Math.min(ta[1],tb[1])-1];};
    const ct=(g,u,v)=>{let t=ped(g,P(u,v),7);t=ins(g,t,5);RC(g,t[0]-1,t[1]-4,4,4,'#6f7a80');RC(g,t[0]-1,t[1]-4,4,1,'#b3bbbf');RC(g,t[0]+2,t[1]-3,1,3,'#4d575c');return[t[0],t[1]-4];};
    const sa=(g,u,v)=>{let t=ped(g,P(u,v),7);t=ins(g,t,8,GREY);RC(g,t[0]-1,t[1]-1,4,1,'#f4f6f7');return[t[0],t[1]-1];};
    const post=(g,u,v,h)=>{let t=ped(g,P(u,v),h-6);t=ins(g,t,6,PORC);return[t[0],t[1]];};
    // 鋼格構柱（3px）
    const latCol=(g,p,h)=>{const x=Math.round(p[0]),y=Math.round(p[1]);RC(g,x-2,y-1,5,2,CONC);
      for(let k=0;k<h-2;k+=5){BL(g,[x-1,y-k],[x+1,y-k-2],ST.M);BL(g,[x+1,y-k-2],[x-1,y-k-5],ST.M);}
      RC(g,x-1,y-h,1,h,ST.L);RC(g,x+1,y-h,1,h,ST.D);RC(g,x-1,y-h,3,1,ST.L);};
    // 門型架：沿 (ua,va)→(ub,vb)，梁高 H，legs=柱位比例，hang=掛線位置（沿梁比例）回傳掛點
    const portal=(g,ua,va,ub,vb,H,legs=[0,1],hang=[])=>{
      const A1=P(ua,va,H),B1=P(ub,vb,H),A2=P(ua,va,H-3),B2=P(ub,vb,H-3);
      for(const t of legs){latCol(g,lerp(P(ua,va,0),P(ub,vb,0),t),H+1);}
      const n=Math.max(2,Math.round(Math.hypot(B1[0]-A1[0],B1[1]-A1[1])/5));
      BL(g,A2,B2,ST.D);
      for(let i=0;i<n;i++){const q0=lerp(A2,B2,i/n),q1=lerp(A1,B1,(i+.5)/n),q2=lerp(A2,B2,(i+1)/n);BL(g,q0,q1,ST.M);BL(g,q1,q2,ST.M);}
      BL(g,A1,B1,ST.L);
      return hang.map(t=>{const s=lerp(A2,B2,t),x=Math.round(s[0]),y=Math.round(s[1]);for(let i=1;i<=4;i++)RC(g,x,y+i,1,1,i%2?'#d5dbde':'#7f898e');return[x,y+5];});
    };
    // 格構鐵塔：arms=[{h,w}]，回傳每臂兩端掛點（左、右）
    const tower=(g,ng,u,v,H,arms)=>{const b=P(u,v),bx=Math.round(b[0]),by=Math.round(b[1]);
      const hw=y=>Math.max(1,Math.round(5-4*Math.min(1,y/(H*.78))));
      RC(g,bx-7,by-1,4,2,CONC);RC(g,bx+4,by-1,4,2,CONC);
      let y0=0;while(y0<H-3){const y1=Math.min(H-1,y0+Math.max(4,Math.round(hw(y0)*1.7)));
        BL(g,[bx-hw(y0),by-y0],[bx+hw(y1),by-y1],ST.M);BL(g,[bx+hw(y0),by-y0],[bx-hw(y1),by-y1],ST.M);RC(g,bx-hw(y1),by-y1,2*hw(y1)+1,1,'#838c91');y0=y1;}
      for(let y=0;y<H;y++){const w=hw(y);RC(g,bx-w,by-y,1,1,ST.L);RC(g,bx+w,by-y,1,1,ST.D);}
      RC(g,bx,by-H-3,1,4,ST.D);
      const out=[];
      for(const a of arms){const l=P(u-a.w,v,0),r=P(u+a.w,v,0),yy=by-a.h;
        const L0=[Math.round(l[0]),yy+Math.round(l[1]-by)],R0=[Math.round(r[0]),yy+Math.round(r[1]-by)];
        BL(g,L0,R0,ST.L);BL(g,[L0[0],L0[1]+1],[R0[0],R0[1]+1],ST.D);
        const s=[];for(const e of [L0,R0]){for(let i=0;i<3;i++)RC(g,e[0]-i,e[1]+2+(i>>1),1,1,i%2?'#7f898e':'#d5dbde');s.push([e[0]-3,e[1]+3]);}
        out.push(s);}
      if(ng)RC(ng,bx,by-H-3,1,1,'#ff5a4a');
      return out;};
    // 落地罐式斷路器（單相：罐體沿 v，兩端 V 形套管），回傳兩端套管頂
    const dtb=(g,u,v)=>{const a=P(u,v-.06,5),b=P(u,v+.06,5);
      for(const q of [P(u,v-.045),P(u,v+.045)]){RC(g,q[0],q[1]-5,1,5,ST.D);RC(g,q[0]-1,q[1]-1,3,1,CONC);}
      const cols=['#5f6a70','#8d979c','#b4bdc1','#dfe4e6'];
      for(let k=0;k<4;k++)BL(g,[a[0],a[1]-k],[b[0],b[1]-k],cols[k]);
      RC(g,a[0]-1,a[1]-3,1,3,'#6c767b');RC(g,b[0]+1,b[1]-3,1,3,'#4d575c');
      const t1=ins(g,[Math.round(a[0]),Math.round(a[1])-3],7,GREY),t2=ins(g,[Math.round(b[0])-1,Math.round(b[1])-3],7,GREY);
      RC(g,t1[0]-1,t1[1]-1,3,1,'#eef1f2');RC(g,t2[0],t2[1]-1,3,1,'#eef1f2');return[[t1[0],t1[1]-1],[t2[0]+1,t2[1]-1]];};
    // 電容器組：三層鋼架，每層一排電容罐
    const capRack=(g,u0,v0,nu,nv,tiers=3)=>{for(let j=0;j<nv;j++){const v=v0+j*.1;
        const fa=P(u0-.03,v,0),fb=P(u0+nu*.055,v,0);
        for(let k=0;k<tiers;k++){const z=4+k*6;BL(g,[fa[0],fa[1]-z+1],[fb[0],fb[1]-z+1],ST.D);
          for(let i=0;i<nu;i++){const p=P(u0+i*.055,v,z);RC(g,p[0],p[1]-5,2,4,'#e3e7e9');RC(g,p[0]+2,p[1]-5,1,4,'#98a1a6');RC(g,p[0],p[1]-6,1,1,'#9a6240');}}
        RC(g,fa[0],fa[1]-tiers*6-2,1,tiers*6+2,ST.L);RC(g,fb[0],fb[1]-tiers*6-2,1,tiers*6+2,ST.D);}};
    // 木電桿＋橫擔（配電饋線），回傳三個掛點
    const woodPole=(g,u,v,h)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);
      RC(g,x,y-h,1,h,'#8a6a4a');RC(g,x+1,y-h,1,h,'#5a4330');RC(g,x-5,y-h+2,12,1,'#6e5238');RC(g,x-5,y-h+3,12,1,'#4a3726');
      const out=[];for(const dx of [-4,2,6]){RC(g,x+dx,y-h,1,2,'#e8ecee');out.push([x+dx,y-h]);}return out;};
    return{ST,CONC,PORC,GREY,ped,ins,wire,cvt,trap,cb,ds,ct,sa,post,latCol,portal,tower,dtb,capRack,woodPole};
  };

  // 主變壓器（立體層）＋套管（細線層），回傳 HV 套管頂點
  const XFMR=(K,L,G)=>{
    const {P,box}=K,{RC,BL,boxZ,fL,fR,pg}=L;
    const body=(g,ng,u0,v0,du,dv,h,o={})=>{
      const u1=u0+du,v1=v0+dv;
      box(g,u0-.04,v0-.04,du+.08,dv+.1,2,'#bdb9ae','#d9d5cc','#b0aca2');                      // 油坑擋牆
      boxZ(g,u0,v0,du,dv,2,h,o.top||'#8c979c',o.l||'#7f8a90',o.r||'#5c676d');                 // 本體
      const rc=o.rad||['#707b80','#6a757b','#4f5a60','#a9b3b8','#c2c9cd','#737e84'];
      if(o.radL!==false){                                                                        // 左面散熱片組
        boxZ(g,u0+.03,v1,du-.06,.05,3,h-4,rc[0],rc[1],rc[2]);
        for(let t=u0+.045;t<u1-.035;t+=(o.fin||.034)){const a=P(t,v1+.05,4),b=P(t,v1+.05,h-1);BL(g,a,b,rc[3]);}
        BL(g,P(u0+.03,v1+.05,h-1),P(u1-.03,v1+.05,h-1),rc[4]);}
      else{for(let t=u0+.05;t<u1-.02;t+=.07)BL(g,P(t,v1,3),P(t,v1,h+1),o.rib||'#8e999e');}          // 無散熱片：外殼加強肋
      if(o.radR!==false){                                                                        // 右面散熱片組
        boxZ(g,u1,v0+.03,.05,dv-.06,3,h-4,shadeC(rc[0]),shadeC(rc[1]),rc[2]);
        for(let t=v0+.05;t<v1-.03;t+=.04){const a=P(u1+.05,t,4),b=P(u1+.05,t,h-1);BL(g,a,b,rc[5]);}}
      BL(g,P(u0,v1,h+2),P(u1,v1,h+2),o.rim||'#aab4b9');                                            // 頂蓋緣
      if(o.cons!==false){const cz=h+7;                                                          // 儲油櫃（後方高架）
        BL(g,P(u0+.06,v0+.04,h+2),P(u0+.06,v0+.04,cz),'#59636a');BL(g,P(u0+du*.7,v0+.04,h+2),P(u0+du*.7,v0+.04,cz),'#59636a');
        boxZ(g,u0+.02,v0,du*.78,.07,cz,4,'#b4bdc1','#a2abb0','#7b858a');}
      boxZ(g,u1+(o.radR!==false?.05:0),v0+dv*.55,.04,.08,4,7,'#8d979c','#9aa3a8','#6f797e');         // 控制箱（右面）
      const s=P(u0+du*.5,v1+(o.radL!==false?.05:0),8);RC(g,s[0],s[1]-2,3,2,'#e3b33c');                 // 警告牌
    };
    const shadeC=c=>c;
    // 套管：回傳 HV 端點；o.n=HV 數、o.hv=HV 高、o.lv=是否畫低壓套管
    const bush=(g,ng,u0,v0,du,dv,h,o={})=>{const out=[],n=o.n||3,hv=o.hv||9;
      for(let i=0;i<n;i++){const t=P(u0+du*(n===1?.5:.22+.28*i),v0+dv*.42,h+2);const x=Math.round(t[0]),y=Math.round(t[1]);
        const e=G.ins(g,[x,y],hv,o.pal||G.PORC);RC(g,e[0]-1,e[1]-1,4,1,'#e6eaec');out.push([e[0],e[1]-1]);}
      if(o.lv!==false)for(let i=0;i<(n===1?1:3);i++){const t=P(u0+du*(n===1?.78:.3+.22*i),v0+dv*.85,h+2);const x=Math.round(t[0]),y=Math.round(t[1]);G.ins(g,[x,y],3,G.GREY);}
      const wl=P(u0+du,v0,h+3);RC(g,wl[0]-1,wl[1]-2,2,2,'#c0392b');if(ng)RC(ng,wl[0]-1,wl[1]-2,2,2,'#ff5a4a');
      return out;};
    return{body,bush};
  };

  // ================= k148 高壓輸電變電站 =================
  try{
    const W=136,H=150,AX=68,AY=148,SZ=2;
    const lay148=[
      // v0 戶外 AIS：雙回線終端塔 → 線路門型架 → 兩個線路間隔 → 管母線 → 兩台主變＋防火牆，右側控制室
      (K,L,G,X,g,ng)=>{
        const {P}=K,{RC,BL,boxZ,winL,winR,flatQ}=L;
        L.flat(g,f=>{flatQ(f,.08,1.78,1.86,.14,'#85827c');flatQ(f,1.52,.7,.16,1.1,'#85827c');
          flatQ(f,.12,1.0,1.36,.035,'#c9c5bb');flatQ(f,1.38,.62,.04,.42,'#c9c5bb');
          flatQ(f,.12,1.36,1.3,.34,'#b9b5ab');});
        K.backFence(g);
        const S=L.scene(g,ng);
        const PH=.12,bays=[.2,.86];
        let tw=null,hang=null;
        S.t(.1,s=>{tw=G.tower(s,null,.64,.1,52,[{h:49,w:.14},{h:42,w:.18},{h:35,w:.14}]);});
        S.t(.28,(s,n)=>{hang=G.portal(s,.1,.3,1.34,.3,28,[0,.43,1],[...[0,1,2].map(i=>(bays[0]+i*PH-.1)/1.24),...[0,1,2].map(i=>(bays[1]+i*PH-.1)/1.24)]);
          tw.forEach((arm,ai)=>{G.wire(s,arm[0],hang[2-ai],1);G.wire(s,arm[1],hang[3+ai],1);});});
        const tops={};
        const row=(v,fn)=>S.t(v,s=>{bays.forEach((u0,b)=>{for(let i=0;i<3;i++){const t=fn(s,u0+i*PH,v,i,b);(tops[b+':'+i]=tops[b+':'+i]||[]).push(t);}});});
        row(.44,(s,u,v,i)=>{const t=G.cvt(s,u,v);return i===1?G.trap(s,t):t;});
        S.t(.445,s=>{bays.forEach((u0,b)=>{for(let i=0;i<3;i++)G.wire(s,hang[b*3+i],tops[b+':'+i][0],1);});});
        row(.62,(s,u,v)=>G.ds(s,u,v));
        row(.8,(s,u,v,i)=>G.cb(s,u,v,i===0));
        row(.96,(s,u,v)=>G.ct(s,u,v));
        S.t(.97,s=>{for(const k in tops){const a=tops[k];for(let j=1;j<a.length;j++)G.wire(s,a[j-1],a[j],1);}});
        // 管母線（3 相）
        S.t(1.1,s=>{const vs=[1.08,1.17,1.26];
          for(const vv of vs){for(const uu of [.14,.72,1.36]){G.post(s,uu,vv,17);}}
          vs.forEach(vv=>{BL(s,P(.1,vv,17),P(1.42,vv,17),'#f1f4f5');BL(s,P(.1,vv,16),P(1.42,vv,16),'#6f797e');});
          bays.forEach((u0,b)=>{for(let i=0;i<3;i++){const a=tops[b+':'+i];const e=a[a.length-1];G.wire(s,e,P(u0+i*PH,vs[i],17),1);}});});
        // 主變間隔
        const xb=[.18,.9];let bt={};
        S.t(1.3,s=>{xb.forEach((u0,b)=>{for(let i=0;i<3;i++){const uu=u0+.06+i*PH,t=G.cb(s,uu,1.36,i===0);G.wire(s,P(uu,1.08+i*.09,17),t,0);(bt[b]=bt[b]||[]).push(t);}});});
        xb.forEach((u0,b)=>{
          S.o(1.5+b*.02,(s,n)=>X.body(s,n,u0,1.48,.36,.22,15));
          S.t(1.501+b*.02,(s,n)=>{const e=X.bush(s,n,u0,1.48,.36,.22,15);e.forEach((p,i)=>G.wire(s,bt[b][i],p,1));});
        });
        S.o(1.51,s=>{boxZ(s,.68,1.42,.05,.36,0,25,'#bdb8ad','#d4cfc4','#a39d92');for(let t=1.48;t<1.78;t+=.1)BL(s,P(.73,t,1),P(.73,t,24),'#a8a297');});
        // 控制室
        S.o(.6,(s,n)=>{const b=boxZ(s,1.5,.24,.4,.36,0,14,'#8e9498','#e2dac8','#bdb4a1');
          boxZ(s,1.5,.24,.4,.36,14,2,'#a9aeb1','#cfc7b4','#aaa18f');
          L.fL(s,.6,1.5,1.9,0,2,'#b7ae9b');
          for(let i=0;i<3;i++){winL(s,1.56+i*.1,.6,6,4,4,'#4d6f86');winL(s,1.56+i*.1,.6,9,4,1,'#8fb0c4');}
          const d=P(1.84,.6,0);RC(s,d[0]-1,d[1]-8,3,7,'#5a4a3c');RC(s,d[0]-2,d[1]-9,6,1,'#7b858a');
          for(let i=0;i<2;i++)winR(s,1.9,.3+i*.14,7,3,4,'#3f5b6e');
          boxZ(s,1.58,.3,.08,.08,16,3,'#c6cdd1','#b5bcc0','#8c9499');boxZ(s,1.72,.3,.08,.08,16,3,'#c6cdd1','#b5bcc0','#8c9499');});
        S.t(.61,(s,n)=>{for(let i=0;i<3;i++){const p=P(1.56+i*.1,.6,6);if(i!==1)L.pg(n,p[0],p[1]-4,4,4,.5,'#ffd98a');}});
        // 照明桿
        const lamp=(u,v)=>S.t(u+v+.001,(s,n)=>{const p=P(u,v);RC(s,p[0],p[1]-24,1,24,'#5d676d');RC(s,p[0]+1,p[1]-24,1,24,'#9aa3a8');RC(s,p[0]-2,p[1]-25,5,2,'#cfd5d8');RC(n,p[0]-2,p[1]-25,5,2,'#ffe2a0');});
        lamp(.12,1.9);lamp(1.92,.14);
        S.run();
      },
      // v1 氣體絕緣（GIS）室內變電所：金屬外牆大廠房＋屋頂 SF6 引出套管接終端塔，戶外兩台主變以匯流排管道接入廠房，右前辦公棟
      (K,L,G,X,g,ng)=>{
        const {P}=K,{RC,BL,boxZ,flatQ,ribsL,ribsR,bandL,bandR,stripL,stripR}=L;
        L.flat(g,f=>{flatQ(f,.08,1.44,1.84,.16,'#85827c');flatQ(f,1.28,.7,.14,.74,'#85827c');
          flatQ(f,.12,.86,1.12,.52,'#c3bfb5');flatQ(f,1.2,.64,.06,.04,'#c9c5bb');});
        L.shadow(g,[[.16,.18,1.04,.48,32],[1.46,.84,.42,.44,13]]);
        K.backFence(g);
        const S=L.scene(g,ng);
        const u0=.16,v0=.18,u1=1.2,v1=.66,h=32;
        S.o(.5,(s,n)=>{
          boxZ(s,u0,v0,u1-u0,v1-v0,0,h,'#7e898f','#d3dbdf','#9ba7ad');
          bandL(s,v1,u0,u1,h,'#eef2f4');bandR(s,u1,v0,v1,h,'#b9c3c8');
          bandL(s,v1-.04,u0+.04,u1-.04,h,'#657076');bandR(s,u1-.04,v0+.04,v1-.04,h,'#657076');
          ribsL(s,v1,u0+.05,u1-.03,3,h-2,.08,'#bcc6cb');ribsR(s,u1,v0+.05,v1-.03,3,h-2,.08,'#8a979d');
          L.fL(s,v1,u0,u1,0,3,'#a3aaad');L.fR(s,u1,v0,v1,0,3,'#7f878b');
          stripL(s,v1,u0+.06,u1-.06,26,4,'#46677e');stripL(s,v1,u0+.06,u1-.06,26,4,'#a9bfcc',4);bandL(s,v1,u0+.06,u1-.06,27,'#e9eef0');
          stripR(s,u1,v0+.06,v1-.06,26,4,'#35505f');stripR(s,u1,v0+.06,v1-.06,26,4,'#7f98a6',4);
          for(const du of [.42,.76]){L.fL(s,v1,du,du+.17,0,16,'#8e979c');for(let z=2;z<16;z+=2)bandL(s,v1,du,du+.17,z,'#737c81');bandL(s,v1,du-.01,du+.18,16,'#5b646a');}
          L.fL(s,v1,.24,.3,0,9,'#4f5f6a');const lp=P(.27,v1,11);RC(s,lp[0],lp[1],2,1,'#f5e7b8');RC(n,lp[0],lp[1],2,1,'#ffe6a8');
          const sg=P(.33,v1,8);RC(s,sg[0],sg[1]-2,3,2,'#e3b33c');
          L.fL(s,v1,1.02,1.12,5,11,'#56626a');for(let z=6;z<11;z+=2)bandL(s,v1,1.02,1.12,z,'#8f9ba2');
          L.fR(s,u1,.3,.4,14,20,'#4e5a61');for(let z=15;z<20;z+=2)bandR(s,u1,.3,.4,z,'#7d8990');
          for(let i=0;i<3;i++)boxZ(s,u0+.14+i*.26,v0+.18,.08,.08,h,4,'#c3cbcf','#aab3b8','#7e888d');
          for(let i=0;i<3;i++)boxZ(s,1.06,.25+i*.13,.06,.06,h,3,'#9aa3a8','#b0b8bc','#7a8489');
        });
        S.t(.51,(s,n)=>{stripL(n,v1,u0+.06,u1-.06,26,4,'#ffe6a8',-4);stripR(n,u1,v0+.06,v1-.06,26,4,'#e8cf93',-4);});
        let bt=[];
        S.t(.55,s=>{for(let i=0;i<3;i++){const p=P(1.09,.28+i*.13,h+3);const e=G.ins(s,[Math.round(p[0]),Math.round(p[1])],11,G.GREY);RC(s,e[0]-1,e[1]-2,4,2,'#e7ebed');bt.push([e[0],e[1]-2]);}});
        S.t(.9,s=>{const tw=G.tower(s,null,1.64,.26,56,[{h:52,w:.14},{h:45,w:.18},{h:38,w:.14}]);tw.forEach((a,i)=>G.wire(s,a[0],bt[i],1));});
        // 主變→廠房匯流排管道
        const xs=[.22,.8];
        S.t(.8,s=>{for(const ux of xs){const uu=ux+.17;for(const vv of [.76,.9]){const q=P(uu,vv);RC(s,q[0],q[1]-17,1,17,'#6a747a');RC(s,q[0]+1,q[1]-17,1,17,'#a9b2b7');}
          for(const dd of [0,.05]){BL(s,P(uu+dd,v1,19),P(uu+dd,.98,19),'#e4e9eb');BL(s,P(uu+dd,v1,18),P(uu+dd,.98,18),'#7d878c');}}});
        xs.forEach((ux,b)=>{S.o(1.1+b*.02,(s,n)=>X.body(s,n,ux,.98,.34,.22,15));S.t(1.101+b*.02,(s,n)=>X.bush(s,n,ux,.98,.34,.22,15,{hv:7}));});
        S.o(1.11,s=>{boxZ(s,.63,.92,.05,.36,0,24,'#bdb8ad','#d4cfc4','#a39d92');for(let t=.98;t<1.28;t+=.1)BL(s,P(.68,t,1),P(.68,t,23),'#a8a297');});
        // 辦公／控制棟
        S.o(2.1,(s,n)=>{const a=1.46,b=.84,du=.42,dv=.44,hh=13;
          boxZ(s,a,b,du,dv,0,hh,'#8f969a','#ece6d8','#c4bcab');bandL(s,b+dv,a,a+du,hh,'#faf7f0');bandR(s,a+du,b,b+dv,hh,'#d6cfbf');
          L.fL(s,b+dv,a,a+du,0,2,'#b3aa98');
          stripL(s,b+dv,a+.05,a+du-.12,5,4,'#48677b');stripL(s,b+dv,a+.05,a+du-.12,5,4,'#dfe4e6',4);
          stripR(s,a+du,b+.05,b+dv-.05,5,4,'#344e5e');stripR(s,a+du,b+.05,b+dv-.05,5,4,'#aeb6b9',4);
          L.fL(s,b+dv,a+du-.09,a+du-.03,0,8,'#5b6f7c');boxZ(s,a+du-.11,b+dv,.1,.05,9,1,'#d9d4c8','#c9c3b5','#a39c8d');
          boxZ(s,a+.08,b+.1,.1,.08,hh,4,'#c6cdd1','#b5bcc0','#8c9499');boxZ(s,a+.24,b+.1,.1,.08,hh,4,'#c6cdd1','#b5bcc0','#8c9499');
          const m=P(a+.34,b+.3,hh);RC(s,m[0],m[1]-10,1,10,'#6d777d');RC(s,m[0]-2,m[1]-8,5,1,'#9aa3a8');
          stripL(n,b+dv,a+.05,a+du-.12,5,4,'#ffd98a',-4);stripR(n,a+du,b+.05,b+dv-.05,5,4,'#f0c878',-4);});
        L.lamp(S,.12,1.34);L.lamp(S,1.92,.62);
        S.run();
        return{gate:[.08,.24]};
      },
      // v2 超高壓開關場：兩列高門型架、落地罐式斷路器、懸掛式阻波器；前方電容器組（內圍籬）與並聯電抗器
      (K,L,G,X,g,ng)=>{
        const {P}=K,{RC,BL,boxZ,flatQ,stripL,stripR,bandL,bandR}=L;
        L.flat(g,f=>{flatQ(f,1.64,.44,.15,1.52,'#85827c');flatQ(f,.12,1.22,.72,.6,'#bdb9af');flatQ(f,.94,1.26,.5,.4,'#c3bfb5');
          flatQ(f,.1,1.13,1.5,.03,'#c9c5bb');});
        L.shadow(g,[[1.56,.12,.34,.26,12],[1.4,1.3,.05,.34,24]]);
        K.backFence(g);
        const S=L.scene(g,ng);
        const PH=.13,bays=[.22,.9],hp=[];bays.forEach(u0=>{for(let i=0;i<3;i++)hp.push((u0+i*PH-.08)/1.44);});
        // 繼電器室
        S.o(.3,(s,n)=>{const a=1.56,b=.12,du=.34,dv=.26,hh=12;
          boxZ(s,a,b,du,dv,0,hh,'#8f969a','#e4ddcc','#bfb6a3');bandL(s,b+dv,a,a+du,hh,'#f4efe4');
          stripL(s,b+dv,a+.05,a+.2,5,3,'#48677b');stripL(s,b+dv,a+.05,a+.2,5,3,'#dfe4e6',4);L.fL(s,b+dv,a+.25,a+.31,0,8,'#5a4a3c');
          stripR(s,a+du,b+.05,b+dv-.05,5,3,'#344e5e');boxZ(s,a+.08,b+.08,.1,.08,hh,3,'#c6cdd1','#b5bcc0','#8c9499');
          stripL(n,b+dv,a+.05,a+.2,5,3,'#ffd98a',-4);});
        let hA,hB;
        S.t(.24,s=>{hA=G.portal(s,.08,.24,1.52,.24,36,[0,.5,1],hp);
          [1,4].forEach(i=>{const q=hA[i];RC(s,q[0]-2,q[1],5,6,'#a3acb1');RC(s,q[0]-2,q[1],1,6,'#d0d6d9');RC(s,q[0]+2,q[1],1,6,'#6c767b');RC(s,q[0]-2,q[1]+2,5,1,'#879196');hA[i]=[q[0],q[1]+6];});});
        const tops={};const push=(b,i,t)=>{(tops[b+':'+i]=tops[b+':'+i]||[]).push(t);};
        S.t(.42,s=>{bays.forEach((u0,b)=>{for(let i=0;i<3;i++){const t=G.ds(s,u0+i*PH,.42);push(b,i,t);G.wire(s,hA[b*3+i],t,1);}});});
        S.t(.6,s=>{bays.forEach((u0,b)=>{for(let i=0;i<3;i++){const t=G.dtb(s,u0+i*PH,.6);G.wire(s,tops[b+':'+i][0],t[0],0);push(b,i,t[1]);}
          const m=P(u0-.06,.6);RC(s,m[0]-2,m[1]-7,4,6,'#8f999e');RC(s,m[0]-2,m[1]-7,1,6,'#c3cacd');RC(s,m[0]+1,m[1]-7,1,6,'#5f696e');});});
        S.t(.78,s=>{bays.forEach((u0,b)=>{for(let i=0;i<3;i++){const t=G.ct(s,u0+i*PH,.78);G.wire(s,tops[b+':'+i][1],t,0);push(b,i,t);}});});
        S.t(.94,s=>{bays.forEach((u0,b)=>{for(let i=0;i<3;i++){const t=G.sa(s,u0+i*PH,.94);push(b,i,t);}});});
        S.t(1.12,s=>{hB=G.portal(s,.08,1.12,1.52,1.12,30,[0,.5,1],hp);
          bays.forEach((u0,b)=>{for(let i=0;i<3;i++){const a=tops[b+':'+i];G.wire(s,a[2],hB[b*3+i],1);BL(s,a[2],a[3],'#434b50');}});});
        // 電容器組（內圍籬）
        S.t(1.2,s=>{K.fence(s,[.14,1.24],[.82,1.24]);K.fence(s,[.14,1.24],[.14,1.8]);});
        S.t(1.3,s=>{G.capRack(s,.24,1.34,8,4,3);for(let i=0;i<3;i++){const t=P(.3+i*.16,1.34,20);G.wire(s,hB[i],[t[0],t[1]],1);}});
        S.t(1.85,s=>{K.fence(s,[.82,1.24],[.82,1.8]);K.fence(s,[.14,1.8],[.82,1.8],[.6,.8]);});
        // 並聯電抗器＋防火牆
        S.o(1.4,(s,n)=>X.body(s,n,.98,1.32,.3,.26,20,{radL:false,cons:true,top:'#7d8a80',l:'#8b988d',r:'#5d6a60',rim:'#a8b5aa',rib:'#788579'}));
        S.t(1.401,(s,n)=>{const e=X.bush(s,n,.98,1.32,.3,.26,20,{hv:10,lv:false});e.forEach((p,i)=>G.wire(s,hB[3+i],p,1));});
        S.o(1.45,s=>{boxZ(s,1.4,1.3,.05,.34,0,24,'#bdb8ad','#d4cfc4','#a39d92');for(let t=1.36;t<1.64;t+=.1)BL(s,P(1.45,t,1),P(1.45,t,23),'#a8a297');});
        L.lamp(S,.1,.12);L.lamp(S,1.92,1.9);
        S.run();
        return{gate:[.84,.94]};
      },
      // v3 舊式變電所（六〇年代）：格構鋼架大構台、三罐式油斷路器、橄欖色舊主變、紅磚斜屋頂控制室、木桿配電饋線，碎石地長雜草
      (K,L,G,X,g,ng)=>{
        const {P,hsh}=K,{RC,BL,boxZ,flatQ,stripL,stripR,bandL,bandR,cyl}=L;
        const st0={...G.ST};Object.assign(G.ST,{L:'#bdb6aa',M:'#8d8173',D:'#5f5347'});
        try{
        L.flat(g,f=>{flatQ(f,1.28,.08,.15,1.88,'#8f8574');flatQ(f,.14,.96,1.0,.36,'#b3ada0');});
        for(let i=0;i<46;i++){const u=.1+hsh(1483,i,1)*1.8,v=.1+hsh(1483,i,2)*1.8,p=P(u,v);RC(g,p[0],p[1],2,1,'#7f8f5a');RC(g,p[0],p[1]-1,1,1,'#96a868');}
        L.shadow(g,[[1.5,.9,.4,.4,18]]);
        K.backFence(g);
        const S=L.scene(g,ng);
        const cu=[.16,.66,1.16],H=30,PH=.12,bays=[.24,.78];
        const drops={};
        S.t(.22,s=>{for(const u of cu)G.latCol(s,P(u,.22),H);G.portal(s,cu[0],.22,cu[2],.22,H,[]);
          for(const u of cu){BL(s,P(u,.22,H),P(u,.56,H),G.ST.L);BL(s,P(u,.22,H-3),P(u,.56,H-3),G.ST.D);
            for(let t=0;t<4;t++)BL(s,P(u,.22+t*.085,H-3),P(u,.22+(t+.5)*.085,H),G.ST.M);}});
        S.t(.56,s=>{for(const u of cu)G.latCol(s,P(u,.56),H);
          const hh=G.portal(s,cu[0],.56,cu[2],.56,H,[],bays.flatMap(u0=>[0,1,2].map(i=>(u0+i*PH-cu[0])/(cu[2]-cu[0]))));
          G.portal(s,cu[0],.56,cu[2],.56,18,[]);
          bays.forEach((u0,b)=>{for(let i=0;i<3;i++){const p=P(u0+i*PH,.56,18);const x=Math.round(p[0]),y=Math.round(p[1]);
            const t=G.ins(s,[x,y],6);RC(s,t[0]-1,t[1]-1,1,5,'#e6e9ea');G.wire(s,hh[b*3+i],[t[0],t[1]-1],0);drops[b+':'+i]=[t[0]+1,y+1];}});
          // 構台頂上的舊式垂直開斷隔離開關
          for(const u of [.3,.8])for(let i=0;i<3;i++){const p=P(u+i*.1,.22,H);const t=G.ins(s,[Math.round(p[0]),Math.round(p[1])],4);RC(s,t[0],t[1]-3,1,3,'#dfe3e5');}});
        // 三罐式油斷路器
        const ocbTop={};
        bays.forEach((u0,b)=>{
          S.o(.8+b*.01,s=>{const fr=[P(u0-.04,.76),P(u0+.3,.76)];boxZ(s,u0-.05,.72,.38,.1,0,4,'#7a7266','#8a8276','#5e574d');
            for(let i=0;i<3;i++){const p=P(u0+i*.14,.77,4);cyl(s,p[0],p[1],3,11,['#b9bfa9','#9ba18b','#7e846f','#636955'],'#c9cfb9','#8d937d');}});
          S.t(.805+b*.01,s=>{for(let i=0;i<3;i++){const p=P(u0+i*.14,.77,16);const x=Math.round(p[0]),y=Math.round(p[1]);
            const a=G.ins(s,[x-2,y],6),c=G.ins(s,[x+1,y],6);G.wire(s,drops[b+':'+i],[a[0],a[1]],1);ocbTop[b+':'+i]=[c[0]+1,c[1]];}});
        });
        // 舊主變（橄欖色、管式散熱器）
        const xo={top:'#7f8973',l:'#8c9680',r:'#5f6755',rad:['#6f785f','#6a7359','#4c5440','#a1aa8c','#b6bf9f','#7b846a'],fin:.05,rim:'#a6af93'};
        bays.forEach((u0,b)=>{S.o(1.25+b*.01,(s,n)=>X.body(s,n,u0-.04,1.2,.3,.18,13,xo));
          S.t(1.255+b*.01,(s,n)=>{const e=X.bush(s,n,u0-.04,1.2,.3,.18,13,{hv:8});e.forEach((p,i)=>G.wire(s,ocbTop[b+':'+i],p,1));});});
        // 紅磚斜屋頂控制室
        S.o(1.35,(s,n)=>{const a=1.5,b=.9,du=.4,dv=.4,hh=12;
          L.gable(s,a,b,du,dv,hh,9,'#b4644a','#8c4a35','#a4503a','#6e3427');
          for(let z=2;z<hh;z+=3)bandL(s,b+dv,a,a+du,z,'#a05840');for(let z=2;z<hh;z+=3)bandR(s,a+du,b,b+dv,z,'#7a3f2e');
          for(let i=0;i<2;i++){stripL(s,b+dv,a+.06+i*.13,a+.12+i*.13,4,5,'#f0ece2');stripL(s,b+dv,a+.07+i*.13,a+.11+i*.13,5,3,'#4a6272');}
          L.fL(s,b+dv,a+.31,a+.37,0,8,'#4d3b2e');const lp=P(a+.34,b+dv,10);RC(s,lp[0],lp[1],2,1,'#f5e7b8');RC(n,lp[0]-1,lp[1],3,2,'#ffdf9a');
          stripR(s,a+du,b+.12,b+.2,4,5,'#f0ece2');stripR(s,a+du,b+.13,b+.19,5,3,'#3d5563');
          boxZ(s,a+.08,b+.12,.05,.05,hh+4,7,'#8f8a84','#9c5a45','#7a4535');
          for(let i=0;i<2;i++)stripL(n,b+dv,a+.07+i*.13,a+.11+i*.13,5,3,'#ffd98a');});
        // 木桿配電饋線
        S.t(1.8,s=>{const pts=[[.16,1.74],[.6,1.74],[1.04,1.74]].map(([u,v])=>G.woodPole(s,u,v,24));
          for(let j=0;j<2;j++)for(let k=0;k<3;k++)G.wire(s,pts[j][k],pts[j+1][k],2);
          bays.forEach((u0,b)=>{const q=P(u0+.1,1.38,15);G.wire(s,[q[0],q[1]],pts[b][1],2);});
          const sb=P(.92,1.56);for(let i=0;i<3;i++){RC(s,sb[0]+i*3,sb[1]-4,2,3,'#c0392b');}RC(s,sb[0]-1,sb[1]-5,10,1,'#6e5238');});
        L.lamp(S,1.42,1.84,20);
        S.run();
        }finally{Object.assign(G.ST,st0);}
        return{gate:[.64,.76]};
      },
      // v4 超高壓單相主變組：兩座終端塔→高門型架→三台單相主變（間隔防火牆）＋軌道上備用相、雨淋水箱、兩層控制樓
      (K,L,G,X,g,ng)=>{
        const {P}=K,{RC,BL,boxZ,flatQ,stripL,stripR,bandL,bandR,cyl}=L;
        L.flat(g,f=>{flatQ(f,.06,1.3,1.88,.18,'#85827c');flatQ(f,.6,1.48,.18,.46,'#85827c');flatQ(f,.1,.72,1.24,.56,'#c3bfb5');
          for(let t=.08;t<1.92;t+=.05)BL(f,P(t,1.34),P(t,1.44),'#6b5a48');
          for(const vv of [1.355,1.425])BL(f,P(.06,vv),P(1.92,vv),'#5d5f60');});
        L.shadow(g,[[.1,1.52,.42,.34,22],[.46,.76,.04,.38,30],[.84,.76,.04,.38,30],[1.5,.5,.34,.2,9]]);
        K.backFence(g);
        const S=L.scene(g,ng);
        const us=[.14,.52,.9],hp=us.map(u=>(u+.13-.08)/1.4);
        let tw1,tw2,hA;
        S.t(.1,s=>{tw1=G.tower(s,null,.3,.1,58,[{h:54,w:.15},{h:46,w:.19},{h:38,w:.15}]);tw2=G.tower(s,null,1.12,.1,58,[{h:54,w:.15},{h:46,w:.19},{h:38,w:.15}]);});
        S.t(.3,(s,n)=>{const tk=P(1.72,.3);cyl(s,tk[0],tk[1],8,20,['#e07a6a','#c9584a','#a8463b','#86362e'],'#d86a5b','#9b3f35');
          for(let y=4;y<20;y+=3)RC(s,tk[0]+6,tk[1]-y,2,1,'#5b2a24');RC(s,tk[0]-3,tk[1]-10,6,2,'#f2f2f2');});
        S.t(.4,s=>{hA=G.portal(s,.08,.4,1.48,.4,36,[0,.5,1],[...hp,...[.28,.66,1.04].map(u=>(u-.08)/1.4)]);
          [0,1,2].forEach(i=>G.wire(s,tw1[i][1],hA[i],2));[0,1,2].forEach(i=>G.wire(s,tw2[i][0],hA[3+i],2));});
        const tops=[];
        S.t(.58,s=>{us.forEach((u,i)=>{const t=G.sa(s,u+.13,.58);G.wire(s,hA[i],t,1);tops[i]=t;});
          [.28,.66,1.04].forEach((u,i)=>{const t=G.cvt(s,u,.58);G.wire(s,hA[3+i],t,1);});});
        S.o(.62,(s,n)=>{const a=1.5,b=.5,du=.34,dv=.2;boxZ(s,a,b,du,dv,0,9,'#8e9498','#d9d2c2','#b3aa98');L.fL(s,b+dv,a+.05,a+.12,0,7,'#6d7d88');
          for(let i=0;i<3;i++){const p=P(a+.18+i*.05,b+dv,4);RC(s,p[0],p[1]-2,2,2,'#4b5a64');}});
        us.forEach((u,i)=>{
          S.o(.9+i*.03,(s,n)=>X.body(s,n,u,.8,.26,.24,20,{radR:true}));
          S.t(.901+i*.03,(s,n)=>{const e=X.bush(s,n,u,.8,.26,.24,20,{n:1,hv:14});G.wire(s,tops[i],e[0],1);});
          if(i<2)S.o(.915+i*.03,s=>{boxZ(s,u+.32,.74,.04,.4,0,30,'#bdb8ad','#d4cfc4','#a39d92');for(let t=.8;t<1.14;t+=.1)BL(s,P(u+.36,t,1),P(u+.36,t,29),'#a8a297');});
        });
                // 軌道上的備用相（運輸滑台）
        // 兩層控制樓
        S.o(2.0,(s,n)=>{const a=.1,b=1.52,du=.42,dv=.34,hh=22;
          boxZ(s,a,b,du,dv,0,hh,'#80898e','#e6e1d6','#bdb6a6');bandL(s,b+dv,a,a+du,hh,'#f7f4ee');bandR(s,a+du,b,b+dv,hh,'#d3ccbd');
          for(const z of [4,14]){stripL(s,b+dv,a+.04,a+du-.04,z,5,'#46657a');stripL(s,b+dv,a+.04,a+du-.04,z,5,'#dde2e4',5);bandL(s,b+dv,a+.03,a+du-.03,z,'#a69f90');
            stripR(s,a+du,b+.04,b+dv-.04,z,5,'#33495a');stripR(s,a+du,b+.04,b+dv-.04,z,5,'#a2a9ab',5);
            stripL(n,b+dv,a+.04,a+du-.04,z,5,z===4?'#ffd98a':'#ffe6a8',-5);}
          boxZ(s,a+.14,b+dv,.14,.06,9,1,'#dad5ca','#c9c3b5','#a39c8d');
          boxZ(s,a+.1,b+.08,.12,.1,hh,4,'#c6cdd1','#b5bcc0','#8c9499');boxZ(s,a+.28,b+.08,.1,.1,hh,4,'#c6cdd1','#b5bcc0','#8c9499');
          const m=P(a+.4,b+.2,hh);RC(s,m[0],m[1]-9,1,9,'#6d777d');RC(s,m[0]-3,m[1]-7,7,1,'#9aa3a8');});
        L.lamp(S,.08,1.3);L.lamp(S,1.92,1.92);
        S.run();
        return{gate:[.28,.4]};
      },
    ];
    const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),G=GEAR(K,L),X=XFMR(K,L,G);
    for(let v=0;v<5;v++){
      try{
        const {c,g,nc,ng}=K.canvases();
        K.ground(g,1480+v);
        const o=lay148[v](K,L,G,X,g,ng)||{};
        B['148_1_'+v]=L.done(c,g,nc,{fence:true,gate:o.gate||[.08,.24]});
      }catch(e){console.error('infra575 k148 v'+v,e);}
    }
  }catch(e){console.error('infra575 k148',e);}

  // ================= k149 電網調度中心 =================
  // 城市設施零件（辦公／控制樓、微波塔、衛星碟、發電機組、冷卻設備、停車場、警衛亭、樹、旗桿、欄柵圍牆）
  const CITY=(K,L)=>{
    const {P,hsh,poly}=K,{RC,BL,boxZ,fL,fR,flatQ,stripL,stripR,bandL,bandR,ell,cyl}=L;
    const lawn=(g,seed)=>{const hw=16*K.SZ*2;
      A.dia(g,K.AX,K.TOPY,hw,'#7da457');
      for(let i=0;i<Math.round(60*K.SZ*K.SZ);i++){const u=hsh(seed,i,1)*K.SZ,v=hsh(seed,i,2)*K.SZ,p=P(u,v);RC(g,p[0],p[1],2,1,hsh(seed,i,3)<.5?'#6f9650':'#8fb566');}
      A.diaEdge(g,6,'#6a7d52',K.AX,K.TOPY,hw);A.diaEdge(g,9,'#a9c381',K.AX,K.TOPY,hw);};
    const stripF=(g,a,b,h,c,every,pred)=>{let p=a,q=b;if(p[0]>q[0]){p=b;q=a;}const x0=Math.round(p[0]),x1=Math.round(q[0]);g.fillStyle=c;
      for(let x=x0;x<=x1;x++){const k=x-x0;if(every&&k%every===0)continue;if(pred&&!pred(Math.floor(k/(every||1))))continue;
        const y=Math.round(p[1]+(q[1]-p[1])*(x-x0)/Math.max(1,x1-x0));g.fillRect(x,y-h+1,1,h);}};
    // 帷幕牆：face='L'（+v 面，固定 v=w）或 'R'（+u 面，固定 u=w）
    const curtain=(s,n,face,w,a,b,z0,floors,fh,seed,o={})=>{
      const Lf=face==='L',pt=(t,z)=>Lf?P(t,w,z):P(w,t,z);
      const glass=o.glass||(Lf?'#5d86a4':'#3c5c75'),refl=o.refl||(Lf?'#9cc0d6':'#6f90a6'),mull=o.mull||(Lf?'#b9c9d3':'#7f93a0'),spand=o.spand||(Lf?'#d9e1e6':'#9aa9b3'),ev=o.every||4;
      poly(s,[pt(a,z0),pt(b,z0),pt(b,z0+floors*fh),pt(a,z0+floors*fh)],glass);
      for(let f=0;f<floors;f++){const z=z0+f*fh;
        L.strip(s,pt(a,z+fh-1),pt(b,z+fh-1),2,refl);
        L.strip(s,pt(a,z+1),pt(b,z+1),2,spand);}
      L.strip(s,pt(a,z0),pt(b,z0),floors*fh,mull,ev);
      L.strip(s,pt(a,z0+floors*fh),pt(b,z0+floors*fh),1,spand);
      if(n)for(let f=0;f<floors;f++){const z=z0+f*fh;stripF(n,pt(a,z+2),pt(b,z+2),fh-3,(f+seed)%3?'#ffe3a3':'#fff0c8',ev,k=>hsh(seed,f,k)<(o.lit||.5));}};
    // 帶狀窗／打孔窗（混凝土外牆）
    const ribbon=(s,n,face,w,a,b,z,h,seed,o={})=>{const Lf=face==='L',pt=(t,zz)=>Lf?P(t,w,zz):P(w,t,zz);
      L.strip(s,pt(a,z),pt(b,z),h,o.glass||(Lf?'#4d6f86':'#35505f'));if(o.every)L.strip(s,pt(a,z),pt(b,z),h,o.mull||(Lf?'#d7dcdf':'#9aa3a8'),o.every);
      L.strip(s,pt(a,z+h),pt(b,z+h),1,o.lintel||(Lf?'#8e8a80':'#6e6a62'));
      if(n)stripF(n,pt(a,z),pt(b,z),h,o.night||'#ffe0a0',o.every||0,k=>hsh(seed,z,k)<(o.lit||.55));};
    const punched=(s,n,face,w,a,b,z,h,step,ww,seed,o={})=>{const Lf=face==='L';
      for(let t=a;t<=b-1e-6;t+=step){const p=Lf?P(t,w,z):P(w,t,z);const x=Math.round(p[0]),y=Math.round(p[1]);
        L.pg(s,Lf?x:x-ww+1,Lf?y-h:y-h+Math.floor((ww-1)*.5),ww,h,Lf?.5:-.5,o.glass||(Lf?'#4d6f86':'#34505f'));
        if(o.sill)L.pg(s,Lf?x:x-ww+1,Lf?y:y+Math.floor((ww-1)*.5),ww,1,Lf?.5:-.5,o.sill);
        if(n&&hsh(seed,Math.round(t*100),z)<(o.lit||.5))L.pg(n,Lf?x:x-ww+1,Lf?y-h:y-h+Math.floor((ww-1)*.5),ww,h,Lf?.5:-.5,'#ffe0a0');}};
    // 屋頂女兒牆
    const parapet=(s,u0,v0,du,dv,z,c1,c2,c3)=>{const u1=u0+du,v1=v0+dv;bandL(s,v1,u0,u1,z,c1);bandR(s,u1,v0,v1,z,c2);bandL(s,v1-.04,u0+.04,u1-.04,z-1,c3);bandR(s,u1-.04,v0+.04,v1-.04,z-1,c3);};
    // 格構微波塔（螢幕座標底點）
    const mast=(s,n,bx,by,H,wb,wt,plats=[])=>{bx=Math.round(bx);by=Math.round(by);const hw=y=>Math.round(wb+(wt-wb)*y/H);
      let y0=0;while(y0<H-3){const y1=Math.min(H-1,y0+Math.max(4,hw(y0)*2));BL(s,[bx-hw(y0),by-y0],[bx+hw(y1),by-y1],'#8e979c');BL(s,[bx+hw(y0),by-y0],[bx-hw(y1),by-y1],'#8e979c');y0=y1;}
      for(let y=0;y<H;y++){const w=hw(y);RC(s,bx-w,by-y,1,1,'#d3d8db');RC(s,bx+w,by-y,1,1,'#5a646a');}
      for(const p of plats){const w=hw(p)+2;RC(s,bx-w,by-p,2*w+1,1,'#aeb6ba');RC(s,bx-w,by-p+1,2*w+1,1,'#5f696e');}
      RC(s,bx,by-H-6,1,6,'#6d777c');RC(s,bx-1,by-H-7,3,2,'#c0392b');if(n)RC(n,bx-1,by-H-7,3,2,'#ff5a4a');return[bx,by-H];};
    // 微波碟（鼓形天線）：side=-1 面朝左（見白色碟面）、+1 面朝右（見灰背）
    const drum=(s,x,y,r,side)=>{x=Math.round(x);y=Math.round(y);
      if(side<0){ell(s,x,y,Math.max(1,r>>1),r,'#8e979c');ell(s,x-1,y,Math.max(1,r>>1),r,'#eef1f2');RC(s,x-1,y-1,1,2,'#c9d0d3');RC(s,x+1,y-r+2,2,2*r-3,'#9aa3a8');}
      else{ell(s,x,y,Math.max(1,r>>1),r,'#b9c0c4');RC(s,x-2,y-r+2,2,2*r-3,'#7d868b');ell(s,x+1,y,Math.max(1,r>>1)-1,r-1,'#d4dadd');}};
    const sat=(s,x,y,r)=>{x=Math.round(x);y=Math.round(y);RC(s,x,y-5,2,5,'#6b757b');RC(s,x-2,y-1,6,1,'#9aa3a8');
      const cy=y-5-Math.round(r*.55);ell(s,x+1,cy+1,r,Math.round(r*.7),'#8f989d');ell(s,x,cy,r,Math.round(r*.7),'#f1f3f4');ell(s,x+1,cy+1,Math.max(1,r-2),Math.max(1,Math.round(r*.7)-2),'#d7dde0');
      BL(s,[x,cy],[x-Math.round(r*.6),cy-Math.round(r*.9)],'#5d676d');RC(s,x-Math.round(r*.6)-1,cy-Math.round(r*.9)-1,2,2,'#3f484d');};
    // 貨櫃式備用發電機組
    const genset=(s,n,u0,v0,du,dv,seed,col=['#e6e1cf','#f2eee0','#c7c0aa'])=>{const u1=u0+du,v1=v0+dv;
      boxZ(s,u0-.02,v0-.02,du+.04,dv+.04,0,2,'#c9c5bb','#d6d2c8','#aea99e');
      boxZ(s,u0,v0,du,dv,2,12,col[0],col[1],col[2]);
      for(let z=5;z<12;z+=2){bandL(s,v1,u0+.05,u0+du*.35,z,'#8c8672');bandL(s,v1,u1-du*.35,u1-.05,z,'#8c8672');}
      for(const t of [u0+du*.45,u0+du*.62])BL(s,P(t,v1,3),P(t,v1,13),'#b3ac96');
      L.strip(s,P(u1,v0+.03,4),P(u1,v1-.03,4),8,'#6f6a5a');L.strip(s,P(u1,v0+.03,4),P(u1,v1-.03,4),8,'#a39d88',2);
      const st=P(u0+du*.25,v0+dv*.5,14);cyl(s,st[0],st[1],2,9,['#b4bcc0','#8a9398','#646d72'],'#3b4246');RC(s,st[0]-3,st[1]-10,7,1,'#707a7f');
      const m=P(u0+du*.6,v0+dv*.5,14);boxZ(s,u0+du*.5,v0+dv*.25,du*.25,dv*.5,14,3,'#aab2b6','#9aa3a8','#737c81');
      const led=P(u0+du*.52,v1,8);RC(s,led[0],led[1],1,1,'#52c79e');if(n)RC(n,led[0],led[1],1,1,'#7dffd0');};
    // 冷卻水塔（方形誘引通風）
    const coolT=(s,u0,v0,du,dv,h)=>{const u1=u0+du,v1=v0+dv;
      boxZ(s,u0,v0,du,dv,0,h,'#a9b3b8','#c9d0d3','#98a2a7');
      for(let z=3;z<h-3;z+=2){bandL(s,v1,u0+.03,u1-.03,z,'#8c969b');bandR(s,u1,v0+.03,v1-.03,z,'#747e83');}
      L.fL(s,v1,u0,u1,h-3,h,'#dfe4e6');L.fR(s,u1,v0,v1,h-3,h,'#b2bbbf');
      const c=P(u0+du/2,v0+dv/2,h);cyl(s,c[0],c[1],Math.round(du*10),5,['#dfe4e6','#c3cacd','#a6afb4','#8b9499'],'#3b4449','#aab3b7');};
    // 冰水主機（頂部風扇）
    const chiller=(s,u0,v0,du,dv,nf,z0=0)=>{const u1=u0+du,v1=v0+dv;boxZ(s,u0,v0,du,dv,z0,7,'#b9c1c5','#d1d7da','#9ea7ab');
      for(let z=2;z<6;z+=2)bandL(s,v1,u0+.02,u1-.02,z0+z,'#9aa3a8');
      for(let i=0;i<nf;i++){const c=P(u0+du*(i+.5)/nf,v0+dv/2,z0+7);ell(s,c[0],c[1],3,1,'#4a5358');RC(s,c[0]-1,c[1],3,1,'#798388');}};
    // 汽車（沿 u 或沿 v）
    const CARS=[['#f4f4f2','#e3e3e0','#b8b8b4'],['#c9cdd0','#b3b8bb','#8e9397'],['#4d6389','#3e5277','#2e3d5b'],['#c8574a','#b0463b','#86352d'],['#4a4d52','#3b3e42','#2a2c30'],['#d8c89a','#c4b384','#9b8d66']];
    const car=(s,u,v,ci,alongV)=>{const c=CARS[ci%CARS.length],du=alongV?.065:.12,dv=alongV?.12:.065;
      boxZ(s,u,v,du,dv,0,3,c[0],c[1],c[2]);
      boxZ(s,u+(alongV?.006:.03),v+(alongV?.03:.006),alongV?.053:.055,alongV?.055:.053,3,2,c[0],'#27313b','#1f2830');};
    const tree=(s,u,v,r,seed)=>{const p=P(u,v),x=Math.round(p[0]),y=Math.round(p[1]);
      RC(s,x,y-4,2,4,'#6b4a32');RC(s,x+1,y-4,1,4,'#4d3423');
      const cy=y-4-r;ell(s,x+1,cy,r,r,'#4a7536');ell(s,x,cy-1,r-1,r-1,'#5f9444');ell(s,x-1,cy-2,Math.max(1,r-3),Math.max(1,r-3),'#7fb257');
      for(let i=0;i<r*2;i++){const dx=Math.round((hsh(seed,i,1)-.5)*1.6*r),dy=Math.round((hsh(seed,i,2)-.5)*1.6*r);RC(s,x+dx,cy+dy,1,1,hsh(seed,i,3)<.5?'#3d6530':'#9ccb6c');}};
    const flag=(s,u,v,h,col,col2)=>{const p=P(u,v);RC(s,p[0],p[1]-h,1,h,'#e8ecee');RC(s,p[0]+1,p[1]-h,1,h,'#8e979c');RC(s,p[0]-1,p[1]-1,4,1,'#b9b4a8');
      RC(s,p[0]+2,p[1]-h,6,4,col);RC(s,p[0]+2,p[1]-h+2,6,1,col2);RC(s,p[0]+7,p[1]-h+1,1,3,col2);};
    const guard=(s,n,u0,v0)=>{const du=.2,dv=.18;boxZ(s,u0,v0,du,dv,0,10,'#8b9296','#ece8de','#c9c2b3');
      stripL(s,v0+dv,u0+.03,u0+du-.03,3,5,'#4a6b80');stripR(s,u0+du,v0+.03,v0+dv-.03,3,5,'#36505f');
      boxZ(s,u0-.03,v0-.03,du+.06,dv+.06,10,2,'#7f878b','#a3aaae','#6f777b');
      if(n){stripL(n,v0+dv,u0+.03,u0+du-.03,3,5,'#ffe3a3');stripR(n,u0+du,v0+.03,v0+dv-.03,3,5,'#f2cf8c');}};
    const boom=(s,u0,v,u1)=>{const p=P(u0,v);RC(s,p[0]-1,p[1]-7,3,7,'#e8e2d0');RC(s,p[0]-1,p[1]-5,3,2,'#c0392b');
      const a=P(u0,v,6),b=P(u1,v,6);const n=Math.round(Math.abs(b[0]-a[0]));for(let i=0;i<=n;i++){const t=i/n;RC(s,a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,1,1,(i>>2)%2?'#d23c2f':'#f4f4f2');}};
    // 欄柵圍牆（混凝土矮牆＋鋼欄柵）
    const pali=(g,a,b,gap)=>{const pa=P(...a),pb=P(...b),n=Math.max(4,Math.round(Math.abs(pb[0]-pa[0])/3));
      const seg=(t0,t1)=>{const q=(t,z)=>P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,z);
        L.strip(g,q(t0,2),q(t1,2),3,'#cfcabf');L.strip(g,q(t0,3),q(t1,3),1,'#e4e0d6');BL(g,q(t0,9),q(t1,9),'#56645c');BL(g,q(t0,5),q(t1,5),'#56645c');};
      for(let i=0;i<=n;i++){const t=i/n;if(gap&&t>gap[0]&&t<gap[1])continue;const p=P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,3);RC(g,p[0],p[1]-7,1,7,'#46534b');}
      if(gap){seg(0,gap[0]);seg(gap[1],1);for(const t of gap){const p=P(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);RC(g,p[0]-1,p[1]-11,3,11,'#d9d4c8');RC(g,p[0]+1,p[1]-11,1,11,'#aca69a');RC(g,p[0]-1,p[1]-12,3,1,'#8b867c');}}else seg(0,1);};
    const E=.05,S3=K.SZ;
    const backWall=g=>{pali(g,[E,E],[S3-E,E]);pali(g,[E,E],[E,S3-E]);};
    const frontWall=(g,gate)=>{pali(g,[S3-E,E],[S3-E,S3-E]);pali(g,[E,S3-E],[S3-E,S3-E],gate);};
    const parkLines=(g,u0,v0,du,dv,step,alongV)=>{if(alongV){for(let t=u0;t<=u0+du+1e-6;t+=step)BL(g,P(t,v0),P(t,v0+dv),'#e9e9e4');}else{for(let t=v0;t<=v0+dv+1e-6;t+=step)BL(g,P(u0,t),P(u0+du,t),'#e9e9e4');}};
    const shadowE=(g,list,a=.2)=>{const[sc,sx]=A.cv(K.W,K.H);for(const[u,v,r]of list){const p=P(u,v);ell(sx,p[0]+r*.6,p[1],r,Math.max(1,r>>1),'#101418');}g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 單管塔（面板天線＋碟）
    const monopole=(s,n,bx,by,H)=>{bx=Math.round(bx);by=Math.round(by);RC(s,bx-2,by-2,6,3,'#c9c5bb');
      for(let y=0;y<H;y++){const w=y<H*.4?2:1;RC(s,bx-w+1,by-y,1,1,'#e2e6e8');RC(s,bx+w,by-y,1,1,'#7d868b');if(w===2)RC(s,bx,by-y,1,1,'#b6bdc1');}
      for(const hh of [H-2,H-9]){RC(s,bx-4,by-hh-1,9,1,'#8e979c');for(const dx of [-4,0,4]){RC(s,bx+dx,by-hh-6,2,6,'#f0f2f3');RC(s,bx+dx+1,by-hh-6,1,6,'#b3bbbf');}}
      drum(s,bx-3,by-H+22,3,-1);RC(s,bx,by-H-3,1,3,'#6d777c');RC(s,bx,by-H-4,1,1,'#c0392b');if(n)RC(n,bx,by-H-4,1,1,'#ff5a4a');};
    // 喇叭型微波天線（舊式）
    const horn=(s,x,y,side)=>{x=Math.round(x);y=Math.round(y);const d=side<0?-1:1;
      RC(s,x-(d<0?4:0),y-3,5,6,'#c9cfd2');RC(s,x-(d<0?4:0),y-3,5,1,'#eef1f2');RC(s,x+(d<0?-4:4),y-2,1,4,'#6d777c');RC(s,x+(d<0?0:0),y+3,1,4,'#8e979c');};
    // 太陽能車棚
    const pvCanopy=(s,u0,v0,du,dv,z)=>{for(const t of [u0+.04,u0+du-.04]){const p=P(t,v0+dv/2);RC(s,p[0],p[1]-z,1,z,'#7d868b');RC(s,p[0]+1,p[1]-z,1,z,'#4f585d');}
      boxZ(s,u0,v0,du,dv,z,2,'#355d85','#4a78a0','#29496a');for(let t=u0+.08;t<u0+du;t+=.08)BL(s,P(t,v0,z+2),P(t,v0+dv,z+2),'#6d98bd');bandL(s,v0+dv,u0,u0+du,z+2,'#9cc0dc');};
    const pond=(g,u0,v0,du,dv)=>{flatQ(g,u0-.04,v0-.04,du+.08,dv+.08,'#bdb7aa');flatQ(g,u0,v0,du,dv,'#4f86a8');
      for(let i=0;i<14;i++){const p=P(u0+.05+hsh(771,i,1)*(du-.1),v0+.05+hsh(771,i,2)*(dv-.1));RC(g,p[0],p[1],3,1,'#8fc0da');}};
    // 圓柱玻璃控制室（透出螢幕牆）
    const drumGlass=(s,n,cx,cy,rx,h,seed)=>{cx=Math.round(cx);cy=Math.round(cy);const ry=rx>>1;
      cyl(s,cx,cy,rx,3,['#d9dcdc','#c8cbcb','#aeb2b3','#96999a'],'#c8cbcb');
      const tones=['#9cc0d6','#7aa3be','#5e88a6','#4a7190','#3a5b76','#2f4b62'];
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(5,Math.floor(f*6))],yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));
        RC(s,cx+x,cy-h,1,h+yb-3,c);
        if(x>-rx+2&&x<-2){const k=(x+rx);RC(s,cx+x,cy+yb-3-12,1,6,k%5===0?'#1b242c':(k%3?'#2d6f9e':'#3f9a74'));if(K.hsh(seed,k,3)<.3)RC(s,cx+x,cy+yb-3-10,1,1,'#9fe0ff');
          if(n){RC(n,cx+x,cy+yb-3-12,1,6,k%5===0?'#1b242c':(k%3?'#67c3ff':'#6fe0b0'));}}
        if((x+rx)%4===0)RC(s,cx+x,cy-h,1,h+yb-3,x<0?'#c4d6e2':'#6e8494');
        if(n&&x>=-2&&(x+rx)%4&&K.hsh(seed,x,9)<.6)RC(n,cx+x,cy+yb-3-9,1,4,'#ffe3a3');}
      for(const zz of [Math.round(h*.5)]){for(let x=-rx;x<=rx;x++){const yb=Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));RC(s,cx+x,cy+yb-3-zz,1,1,x<0?'#e6edf2':'#8da0ad');}}
      ell(s,cx,cy-h,rx+2,ry+1,'#7f878b');ell(s,cx,cy-h-1,rx+2,ry+1,'#dfe4e6');ell(s,cx,cy-h-1,rx,ry,'#8f989c');ell(s,cx+1,cy-h,rx-3,Math.max(1,ry-2),'#a3abaf');
      RC(s,cx-6,cy-h-4,5,3,'#c6cdd1');RC(s,cx-6,cy-h-4,5,1,'#e9edee');RC(s,cx-2,cy-h-4,1,3,'#8c9499');RC(s,cx+4,cy-h-3,3,2,'#b5bcc0');};
    return{lawn,stripF,curtain,ribbon,punched,parapet,mast,drum,sat,genset,coolT,chiller,car,tree,flag,guard,boom,pali,backWall,frontWall,parkLines,shadowE,monopole,horn,pvCanopy,pond,drumGlass};
  };

  try{
    const W=208,H=220,AX=104,AY=218,SZ=3;
    const ASPH='#707074',PAVE='#d3cdc0',WALK='#dcd7cb';
    const lay149=[
      // v0 現代調度大樓：五層帷幕辦公塔＋大面玻璃控制廳（透出螢幕牆），屋頂微波塔、後場發電機組與油槽、前方停車場、警衛亭與柵欄機、三旗桿
      (K,L,C,g,ng)=>{
        const {P}=K,{RC,BL,boxZ,flatQ,stripL,stripR,bandL,bandR,cyl}=L;
        L.flat(g,f=>{flatQ(f,1.05,1.2,.3,1.76,ASPH);flatQ(f,1.4,1.34,1.5,.98,ASPH);flatQ(f,.26,1.18,.79,.42,PAVE);flatQ(f,.3,1.08,2.1,.12,WALK);
          flatQ(f,2.12,.08,.8,.74,'#bdb9b0');flatQ(f,1.35,1.2,.08,1.1,WALK);});
        L.flat(g,f=>{C.parkLines(f,1.46,1.36,1.4,.3,.16,true);C.parkLines(f,1.46,2.0,1.4,.3,.16,true);for(let t=1.1;t<2.9;t+=.14)BL(f,P(1.2,t),P(1.2,t+.06),'#e9e1a0');});
        L.shadow(g,[[.35,.3,.9,.7,70],[1.25,.4,1.05,.7,24],[2.3,.12,.5,.14,12],[2.3,.34,.5,.14,12]]);
        C.shadowE(g,[[.2,1.8,5],[.2,2.25,5],[.22,2.7,4],[2.82,2.5,5],[2.2,2.78,4],[1.62,2.78,4]]);
        C.backWall(g);
        const S=L.scene(g,ng);
        // 後場發電機組＋油槽
        S.o(2.75,(s,n)=>C.genset(s,n,2.32,.1,.5,.15,1));
        S.o(2.97,(s,n)=>C.genset(s,n,2.32,.32,.5,.15,2));
        S.o(3.25,(s,n)=>{boxZ(s,2.36,.58,.46,.14,0,2,'#c9c5bb','#d6d2c8','#aea99e');boxZ(s,2.4,.6,.4,.1,2,7,'#e9ecee','#f5f6f7','#c3c9cc');
          for(const t of [2.48,2.72]){const p=P(t,.7,2);RC(s,p[0],p[1]-1,1,2,'#6f777b');}const lb=P(2.6,.7,5);RC(s,lb[0],lb[1]-1,6,1,'#c0392b');});
        // 辦公塔
        const ou=.35,ov=.3,odu=.9,odv=.7,oh=60;
        S.o(1.45,(s,n)=>{
          boxZ(s,ou,ov,odu,odv,0,oh,'#8a9297','#dfe3e5','#aab2b6');
          C.curtain(s,n,'L',ov+odv,ou+.06,ou+odu-.06,12,4,12,31,{lit:.45});
          C.curtain(s,n,'R',ou+odu,ov+.06,ov+odv-.06,12,4,12,37,{lit:.45});
          L.fL(s,ov+odv,ou+.06,ou+odu-.06,0,11,'#3f5a6d');L.strip(s,P(ou+.06,ov+odv,0),P(ou+odu-.06,ov+odv,0),11,'#9fb1bd',6);
          L.fR(s,ou+odu,ov+.06,ov+odv-.06,0,11,'#2f4555');
          boxZ(s,ou+.3,ov+odv,.3,.1,12,2,'#c9ced1','#e6eaec','#a9b0b4');
          C.stripF(n,P(ou+.06,ov+odv,1),P(ou+odu-.06,ov+odv,1),8,'#ffe9b8',6,k=>k%2===0);
          C.parapet(s,ou,ov,odu,odv,oh,'#f4f6f7','#c3cacd','#7a8388');
          boxZ(s,ou+.18,ov+.16,.36,.3,oh,9,'#9aa3a8','#c9cfd2','#9aa2a6');for(let z=oh+2;z<oh+8;z+=2)bandL(s,ov+.46,ou+.2,ou+.3,z,'#8a9398');
          boxZ(s,ou+.62,ov+.12,.14,.12,oh,5,'#b9c1c5','#d1d7da','#9ea7ab');boxZ(s,ou+.62,ov+.36,.14,.12,oh,5,'#b9c1c5','#d1d7da','#9ea7ab');});
        S.t(1.46,(s,n)=>{const b=P(ou+.36,ov+.31,oh+9);const t=C.mast(s,n,b[0],b[1],34,4,1,[12,24]);
          C.drum(s,t[0]-4,t[1]+8,3,-1);C.drum(s,t[0]+4,t[1]+14,3,1);C.drum(s,t[0]-4,t[1]+20,2,-1);
          RC(s,t[0]+1,t[1]-2,1,12,'#6d777c');});
        // 控制廳（大面玻璃透出螢幕牆）
        const cu=1.25,cv=.4,cdu=1.05,cdv=.7,ch=24;
        S.o(2.53,(s,n)=>{
          boxZ(s,cu,cv,cdu,cdv,0,ch,'#858d92','#e4e7e8','#b2b9bd');
          const v1=cv+cdv,ga=cu+.1,gb=cu+cdu-.08;
          L.fL(s,v1,ga,gb,3,20,'#24303b');
          L.strip(s,P(ga+.05,v1,8),P(gb-.05,v1,8),9,'#2d6f9e');
          L.strip(s,P(ga+.05,v1,8),P(gb-.05,v1,8),9,'#3f9a74',7);
          C.stripF(s,P(ga+.05,v1,12),P(gb-.05,v1,12),1,'#9fe0ff',0,k=>K.hsh(149,k,7)<.35);
          C.stripF(s,P(ga+.05,v1,15),P(gb-.05,v1,15),1,'#e8d27a',0,k=>K.hsh(149,k,9)<.25);
          L.strip(s,P(ga+.05,v1,8),P(gb-.05,v1,8),9,'#1b242c',9);
          L.strip(s,P(ga,v1,3),P(gb,v1,3),17,'#aebcc6',10);bandL(s,v1,ga,gb,20,'#f2f4f5');bandL(s,v1,ga,gb,3,'#c9ced1');
          L.fL(s,v1,cu,cu+cdu,20,ch,'#cfd4d6');bandL(s,v1,cu,cu+cdu,ch,'#f7f8f8');
          L.fR(s,cu+cdu,cv+.08,cv+.3,0,9,'#5c666c');for(let z=1;z<9;z+=2)bandR(s,cu+cdu,cv+.08,cv+.3,z,'#7c868b');
          L.fR(s,cu+cdu,cv+.45,cv+.55,0,10,'#4b575f');
          C.parapet(s,cu,cv,cdu,cdv,ch,'#ffffff','#c8ced1','#7a8388');
          if(n){L.strip(n,P(ga+.05,v1,8),P(gb-.05,v1,8),9,'#67c3ff');L.strip(n,P(ga+.05,v1,8),P(gb-.05,v1,8),9,'#6fe0b0',7);L.strip(n,P(ga+.05,v1,8),P(gb-.05,v1,8),9,'#1b242c',9);
            L.strip(n,P(ga,v1,6),P(gb,v1,6),3,'#ffe3a3');L.strip(n,P(ga,v1,6),P(gb,v1,6),3,'rgba(0,0,0,0)',10);}});
        S.o(2.54,s=>{C.chiller(s,1.42,.5,.3,.18,3,24);});
        S.o(2.55,s=>{C.chiller(s,1.8,.5,.3,.18,3,24);});
        S.t(2.56,s=>{const b=P(2.1,.72,24);C.sat(s,b[0],b[1],6);});
        // 廣場旗桿、警衛亭、柵欄機
        S.t(2.26,s=>{C.flag(s,.46,1.62,30,'#2f6db3','#1f4f85');C.flag(s,.64,1.62,30,'#f4f4f2','#c9c9c4');C.flag(s,.82,1.62,30,'#3c9a5f','#2a7045');});
        S.o(2.0,s=>{boxZ(s,.3,1.42,.5,.06,0,6,'#8c8f92','#a3a7aa','#6f7376');const p=P(.36,1.48,4);RC(s,p[0],p[1]-2,9,1,'#e8ecee');});
        S.o(3.43,(s,n)=>C.guard(s,n,.8,2.44));
        S.t(3.74,s=>C.boom(s,1.02,2.56,1.34));
        // 停車場
        [[1.5,1.38,0],[1.66,1.38,2],[1.98,1.38,1],[2.14,1.38,3],[2.46,1.38,4],[2.78,1.38,1],[1.5,2.02,1],[1.82,2.02,5],[1.98,2.02,0],[2.3,2.02,2],[2.62,2.02,1]].forEach(([u,v,ci],i)=>S.o(u+v+.02,s=>C.car(s,u+.03,v+.03,ci,true)));
        S.o(2.0,s=>C.tree(s,.2,1.8,5,11));S.o(2.45,s=>C.tree(s,.2,2.25,5,12));S.o(2.92,s=>C.tree(s,.22,2.7,4,13));
        S.o(5.32,s=>C.tree(s,2.82,2.5,5,14));S.o(4.98,s=>C.tree(s,2.2,2.78,4,15));S.o(4.4,s=>C.tree(s,1.62,2.78,4,16));
        L.lamp(S,1.4,1.95,26);L.lamp(S,2.9,1.95,26);
        S.run();
        return{gate:[.34,.46]};
      },
      // v1 強化型調度中心：無窗感的混凝土量體、頂層控制室玻璃帶、防撞柱與防爆入口，右後方自立式電信鐵塔，地面衛星碟、並排發電機組
      (K,L,C,g,ng)=>{
        const {P}=K,{RC,BL,boxZ,flatQ,bandL,bandR,cyl}=L;
        L.flat(g,f=>{flatQ(f,1.42,1.12,.3,1.84,ASPH);flatQ(f,1.72,1.62,1.18,.8,ASPH);flatQ(f,.22,1.1,1.5,.14,WALK);
          flatQ(f,.3,1.5,.5,.46,PAVE);flatQ(f,.3,2.08,.5,.46,PAVE);flatQ(f,1.7,.84,.9,.48,'#bdb9b0');flatQ(f,2.1,.12,.7,.6,'#bdb9b0');});
        L.flat(g,f=>{C.parkLines(f,1.76,1.64,1.1,.28,.16,true);C.parkLines(f,1.76,2.1,1.1,.28,.16,true);});
        L.shadow(g,[[.3,.3,1.2,.8,40],[1.76,.88,.44,.14,12],[1.76,1.1,.44,.14,12]]);
        C.shadowE(g,[[.12,2.7,4],[2.85,2.62,5],[1.1,2.8,4]]);
        C.backWall(g);
        const S=L.scene(g,ng);
        const bu=.3,bv=.3,bdu=1.2,bdv=.8,bh=40,v1=bv+bdv,u1=bu+bdu;
        S.o(1.5,(s,n)=>{
          boxZ(s,bu,bv,bdu,bdv,0,bh,'#8c9091','#cdc9bf','#a39e93');
          L.fL(s,v1,bu,u1,0,3,'#aaa598');L.fR(s,u1,bv,v1,0,3,'#858074');
          for(let t=bu+.1;t<u1-.02;t+=.12){BL(s,P(t,v1,3),P(t,v1,30),'#bdb8ad');}for(let t=bv+.1;t<v1-.02;t+=.12){BL(s,P(u1,t,3),P(u1,t,30),'#948f84');}
          for(const z of [9,18]){C.ribbon(s,n,'L',v1,bu+.06,u1-.06,z,2,31+z,{every:4,glass:'#3f5566',mull:'#bdb8ad',lintel:'#9e998e',lit:.35});
            C.ribbon(s,n,'R',u1,bv+.06,v1-.06,z,2,47+z,{every:4,glass:'#2e404d',mull:'#948f84',lintel:'#7d786e',lit:.35});}
          L.fL(s,v1,bu,u1,30,bh,'#b8b3a8');L.fR(s,u1,bv,v1,30,bh,'#918c81');
          C.ribbon(s,n,'L',v1,bu+.04,u1-.04,31,6,5,{every:5,glass:'#2b4a61',mull:'#e2dfd8',lintel:'#f0ede6',lit:.85,night:'#bfe6ff'});
          C.ribbon(s,n,'R',u1,bv+.04,v1-.04,31,6,6,{every:5,glass:'#223a4c',mull:'#b5b0a5',lintel:'#c9c4b9',lit:.85,night:'#a9d8f5'});
          C.stripF(s,P(bu+.1,v1,32),P(u1-.1,v1,32),1,'#6fd0ff',5,k=>K.hsh(1491,k,1)<.5);
          C.parapet(s,bu,bv,bdu,bdv,bh,'#e1ddd4','#b3aea3','#6f7274');
          boxZ(s,bu+.5,v1,.34,.14,0,13,'#7b8081','#b9b4a9','#948f84');L.fL(s,v1+.14,bu+.56,bu+.78,0,9,'#39434a');bandL(s,v1+.14,bu+.56,bu+.78,4,'#5b666d');
          const lp=P(bu+.67,v1+.14,11);RC(s,lp[0],lp[1],3,1,'#f5e7b8');RC(n,lp[0]-1,lp[1],5,2,'#ffe6a8');
          C.chiller(s,bu+.15,bv+.15,.3,.2,3,bh);C.chiller(s,bu+.55,bv+.15,.3,.2,3,bh);boxZ(s,bu+.95,bv+.5,.12,.12,bh,5,'#9aa3a8','#b3bbbf','#838c91');});
        S.t(1.51,(s,n)=>{const b=P(.5,.9,40);C.sat(s,b[0],b[1],4);for(const [u,v] of [[.32,.32],[1.48,.32],[.32,1.08],[1.48,1.08]]){const p=P(u,v,40);RC(s,p[0],p[1]-6,1,6,'#6d777c');}
          for(let i=0;i<6;i++){const p=P(.82+i*.05,1.34);RC(s,p[0],p[1]-4,2,4,'#e7e2d2');RC(s,p[0],p[1]-3,2,1,'#e0b33a');}});
        // 並排發電機組＋立式油槽
        S.o(2.93,(s,n)=>C.genset(s,n,1.76,.88,.44,.14,5,['#cfd6c9','#dde3d7','#aab3a5']));
        S.o(3.15,(s,n)=>C.genset(s,n,1.76,1.1,.44,.14,6,['#cfd6c9','#dde3d7','#aab3a5']));
        S.o(3.4,s=>{const p=P(2.36,1.02);cyl(s,p[0],p[1],7,16,['#eef0f0','#d9dcdd','#bfc4c6','#a2a8ab'],'#f5f6f6','#b9bec0');RC(s,p[0]-7,p[1]-6,15,1,'#2f6db3');});
        // 自立式電信鐵塔＋機房
        S.o(2.95,(s,n)=>{boxZ(s,2.3,.4,.3,.2,0,9,'#9aa1a4','#d8d4c9','#b0ab9f');L.fL(s,.6,2.36,2.42,0,7,'#5f6b73');});
        S.t(2.75,(s,n)=>{const b=P(2.5,.3);const t=C.mast(s,n,b[0],b[1],104,6,1,[38,66,90]);
          C.drum(s,t[0]-5,t[1]+16,4,-1);C.drum(s,t[0]+5,t[1]+22,4,1);C.drum(s,t[0]-6,t[1]+42,3,-1);C.drum(s,t[0]+6,t[1]+46,3,1);C.drum(s,t[0]-7,t[1]+68,4,-1);
          RC(s,t[0],t[1]-10,1,10,'#8e979c');});
        // 地面衛星碟
        S.t(2.6,s=>{const b=P(.55,1.73);C.sat(s,b[0],b[1],10);});
        S.t(3.1,s=>{const b=P(.55,2.31);C.sat(s,b[0],b[1],8);});
        S.o(4.2,(s,n)=>C.guard(s,n,1.14,2.5));S.t(4.4,s=>C.boom(s,1.42,2.66,1.72));
        [[1.8,1.66,4],[1.96,1.66,1],[2.28,1.66,2],[2.6,1.66,1],[1.96,2.12,0],[2.12,2.12,4],[2.6,2.12,1]].forEach(([u,v,ci])=>S.o(u+v+.02,s=>C.car(s,u+.03,v+.03,ci,true)));
        S.o(2.82,s=>C.tree(s,.12,2.7,4,21));S.o(5.47,s=>C.tree(s,2.85,2.62,5,22));S.o(3.9,s=>C.tree(s,1.1,2.8,4,23));
        L.lamp(S,1.76,2.46,26);L.lamp(S,.9,1.3,26);
        S.run();
        return{gate:[.47,.57]};
      },
      // v2 園區雙棟：高層帷幕辦公塔（直向鋁鰭＋屋頂單管塔）以空橋連接弧頂控制廳，右後方冷卻水塔，左前停車場，右前景觀水池
      (K,L,C,g,ng)=>{
        const {P}=K,{RC,BL,boxZ,flatQ,bandL,bandR,cyl}=L;
        L.flat(g,f=>{flatQ(f,1.12,1.4,.3,1.56,ASPH);flatQ(f,.22,1.46,.9,.92,ASPH);flatQ(f,.3,.92,.95,.12,WALK);flatQ(f,1.25,1.36,1.15,.14,WALK);
          flatQ(f,2.38,.1,.52,.84,'#bdb9b0');});
        L.flat(g,f=>{C.parkLines(f,.26,1.5,.2,.8,.16,false);C.parkLines(f,.8,1.5,.2,.8,.16,false);C.pond(f,1.62,1.72,.8,.52);});
        L.shadow(g,[[.35,.3,.6,.6,84],[1.25,.5,1.1,.44,20],[2.45,.16,.3,.3,16],[2.45,.54,.3,.3,16]]);
        C.shadowE(g,[[1.46,2.5,5],[2.6,2.5,5],[2.8,1.7,4],[.14,2.66,4]]);
        C.backWall(g);
        const S=L.scene(g,ng);
        const tu=.35,tv=.3,tdu=.6,tdv=.6,th=84;
        S.o(1.25,(s,n)=>{
          boxZ(s,tu,tv,tdu,tdv,0,th,'#8a9297','#dfe3e5','#aab2b6');
          C.curtain(s,n,'L',tv+tdv,tu+.04,tu+tdu-.04,10,6,12,51,{lit:.5,glass:'#4f7fa3',refl:'#8fb8d4',every:3});
          C.curtain(s,n,'R',tu+tdu,tv+.04,tv+tdv-.04,10,6,12,57,{lit:.5,glass:'#35587a',refl:'#6a8eab',every:3});
          for(let t=tu+.08;t<tu+tdu-.04;t+=.1)BL(s,P(t,tv+tdv+.02,10),P(t,tv+tdv+.02,th-2),'#f0f3f5');
          L.fL(s,tv+tdv,tu+.04,tu+tdu-.04,0,9,'#35505f');L.strip(s,P(tu+.04,tv+tdv,0),P(tu+tdu-.04,tv+tdv,0),9,'#b5c3cc',5);L.fR(s,tu+tdu,tv+.04,tv+tdv-.04,0,9,'#2a3f4c');
          C.stripF(n,P(tu+.04,tv+tdv,1),P(tu+tdu-.04,tv+tdv,1),7,'#ffe9b8',5,k=>k%2===1);
          boxZ(s,tu+.08,tv+.08,tdu-.16,tdv-.16,th,7,'#8f989d','#c7cdd0','#9aa2a6');C.parapet(s,tu,tv,tdu,tdv,th,'#f4f6f7','#c3cacd','#7a8388');
          for(let t=tu+.14;t<tu+tdu-.1;t+=.07)BL(s,P(t,tv+tdv-.08,th+1),P(t,tv+tdv-.08,th+6),'#aab2b6');});
        S.t(1.26,(s,n)=>{const b=P(tu+.3,tv+.3,th+7);C.monopole(s,n,b[0],b[1],28);});
        // 空橋
        S.o(1.9,(s,n)=>{boxZ(s,.95,.56,.3,.12,12,7,'#c3cacd','#5d86a4','#3c5c75');bandL(s,.68,.95,1.25,12,'#e7ecef');bandL(s,.68,.95,1.25,19,'#e7ecef');L.strip(s,P(.95,.68,13),P(1.25,.68,13),6,'#c9d6de',4);
          if(n)C.stripF(n,P(.95,.68,14),P(1.25,.68,14),4,'#ffe9b8',4,()=>true);});
        // 弧頂控制廳
        const cu=1.25,cv=.5,cdu=1.1,cdv=.84,ch=18;
        S.o(2.72,(s,n)=>{const v1=cv+cdv,u1=cu+cdu;
          boxZ(s,cu,cv,cdu,cdv,0,ch,'#8d9599','#e9ebeb','#b7bdc0');
          const steps=[[0,'#cfd5d8'],[.12,'#dde2e4'],[.24,'#e9edee'],[.34,'#f3f5f6']];
          for(const[d,c]of steps){const rise=[2,4,5,6][steps.findIndex(q=>q[0]===d)];boxZ(s,cu,cv+d,cdu,cdv-2*d,ch,rise,c,c,'#aeb5b9');}
          const ga=cu+.1,gb=u1-.08;
          L.fL(s,v1,ga,gb,2,15,'#24303b');
          L.strip(s,P(ga+.05,v1,6),P(gb-.05,v1,6),7,'#2d6f9e');L.strip(s,P(ga+.05,v1,6),P(gb-.05,v1,6),7,'#3f9a74',6);
          C.stripF(s,P(ga+.05,v1,9),P(gb-.05,v1,9),1,'#9fe0ff',0,k=>K.hsh(1492,k,7)<.35);
          L.strip(s,P(ga+.05,v1,6),P(gb-.05,v1,6),7,'#1b242c',8);
          L.strip(s,P(ga,v1,2),P(gb,v1,2),14,'#aebcc6',8);bandL(s,v1,ga,gb,15,'#f2f4f5');
          L.fR(s,u1,cv+.1,cv+.3,0,9,'#5c666c');for(let z=1;z<9;z+=2)bandR(s,u1,cv+.1,cv+.3,z,'#7c868b');
          if(n){L.strip(n,P(ga+.05,v1,6),P(gb-.05,v1,6),7,'#67c3ff');L.strip(n,P(ga+.05,v1,6),P(gb-.05,v1,6),7,'#6fe0b0',6);L.strip(n,P(ga+.05,v1,6),P(gb-.05,v1,6),7,'#1b242c',8);L.strip(n,P(ga,v1,3),P(gb,v1,3),2,'#ffe3a3');}});
        S.o(2.95,s=>C.coolT(s,2.46,.16,.28,.28,16));
        S.o(3.35,s=>C.coolT(s,2.46,.54,.28,.28,16));
        S.t(3.0,(s,n)=>{for(let i=0;i<3;i++){const p=P(2.4,.3+i*.2,0);RC(s,p[0],p[1]-3,1,3,'#5d676d');}BL(s,P(2.4,.3,3),P(2.4,.7,3),'#8e979c');});
        S.t(2.5,s=>C.flag(s,1.05,1.45,32,'#2f6db3','#1f4f85'));
        [[.28,1.52,0],[.28,1.68,3],[.28,1.84,1],[.28,2.0,4],[.28,2.16,2],[.82,1.52,1],[.82,1.84,5],[.82,2.16,0]].forEach(([u,v,ci])=>S.o(u+v+.03,s=>C.car(s,u+.04,v+.04,ci,false)));
        S.o(4.3,(s,n)=>C.guard(s,n,.86,2.62));S.t(4.5,s=>C.boom(s,1.12,2.72,1.42));
        S.o(3.97,s=>C.tree(s,1.46,2.5,5,31));S.o(5.12,s=>C.tree(s,2.6,2.5,5,32));S.o(4.52,s=>C.tree(s,2.8,1.7,4,33));S.o(2.82,s=>C.tree(s,.14,2.66,4,34));S.o(3.62,s=>C.tree(s,2.3,1.3,4,35));
        L.lamp(S,1.1,1.42,26);L.lamp(S,1.1,2.36,26);
        S.run();
        return{gate:[.37,.47]};
      },
      // v3 八〇年代舊調度所：面磚四層樓（帶狀窗、樓梯間塔）、屋頂格構微波塔＋喇叭天線與水塔、一層控制室加窗型冷氣，右後方附屬變電場
      (K,L,C,g,ng)=>{
        const {P,hsh}=K,{RC,BL,boxZ,flatQ,bandL,bandR,cyl}=L;
        L.flat(g,f=>{flatQ(f,1.52,1.3,.28,1.66,'#7a797b');flatQ(f,.24,1.38,1.2,.62,'#7a797b');flatQ(f,.3,1.1,2.1,.12,'#cfc8b8');
          flatQ(f,2.18,.12,.72,.56,'#aaa69b');});
        L.flat(g,f=>{C.parkLines(f,.28,1.42,1.12,.26,.16,true);for(let i=0;i<20;i++){const p=P(2.2+hsh(1493,i,1)*.68,.14+hsh(1493,i,2)*.52);RC(f,p[0],p[1],1,1,'#9c988d');}});
        L.shadow(g,[[.35,.35,1.1,.7,54],[1.45,.75,.9,.5,14]]);
        C.shadowE(g,[[.14,2.2,6],[.2,2.75,6],[2.7,2.5,6],[2.2,2.8,5],[1.3,2.75,5]]);
        C.backWall(g);
        const S=L.scene(g,ng);
        // 附屬變電場（右後）
        S.t(.9,s=>{K.fence(s,[2.2,.14],[2.88,.14]);K.fence(s,[2.2,.14],[2.2,.66]);});
        S.o(2.5,(s,n)=>{const G2=GEAR(K,L);const X2=XFMR(K,L,G2);X2.body(s,n,2.38,.3,.26,.18,12);});
        S.t(2.51,(s,n)=>{const G2=GEAR(K,L),X2=XFMR(K,L,G2);X2.bush(s,n,2.38,.3,.26,.18,12,{hv:7});
          const pts=G2.woodPole(s,2.8,.2,26);});
        S.t(2.6,s=>{K.fence(s,[2.88,.14],[2.88,.66]);K.fence(s,[2.2,.66],[2.88,.66],[.1,.3]);});
        // 主樓
        const mu=.35,mv=.35,mdu=1.1,mdv=.7,mh=46,v1=mv+mdv,u1=mu+mdu;
        S.o(1.45,(s,n)=>{
          boxZ(s,mu,mv,mdu,mdv,0,mh,'#8a8175','#d8c9a6','#ae9f80');
          L.fL(s,v1,mu,u1,0,3,'#9c8f73');L.fR(s,u1,mv,v1,0,3,'#7f7359');
          for(let f=0;f<4;f++){const z=4+f*10;
            C.ribbon(s,n,'L',v1,mu+.05,u1-.05,z,5,300+f,{every:3,glass:'#4a6070',mull:'#3a3a36',lintel:'#8a6f55',lit:.5});
            C.ribbon(s,n,'R',u1,mv+.05,v1-.05,z,5,400+f,{every:3,glass:'#34454f',mull:'#2c2c29',lintel:'#6d5842',lit:.5});
            L.stripL(s,v1,mu,u1,z-1,1,'#b39a74');L.stripR(s,u1,mv,v1,z-1,1,'#8d7a5b');}
          L.fL(s,v1,mu+.42,mu+.62,0,4,'#4a5058');boxZ(s,mu+.38,v1,.28,.12,5,1,'#b8b0a0','#a79f8f','#8a8272');
          C.parapet(s,mu,mv,mdu,mdv,mh,'#e6dcc4','#b8aa8a','#6f685c');
          for(let i=0;i<4;i++)boxZ(s,mu+.1+i*.22,mv+.5,.1,.08,mh,4,'#b9c1c5','#d1d7da','#9ea7ab');});
        S.o(1.9,(s,n)=>{boxZ(s,u1,.45,.16,.22,0,56,'#8a8175','#cdbd98','#a39473');
          for(let z=6;z<50;z+=6){const p=P(u1+.16,.56,z);RC(s,p[0]-1,p[1]-3,2,3,'#4a6070');if(hsh(1493,z,5)<.6)RC(n,p[0]-1,p[1]-3,2,3,'#ffe0a0');}
          C.parapet(s,u1,.45,.16,.22,56,'#e6dcc4','#b8aa8a','#6f685c');});
        S.t(1.47,(s,n)=>{const b=P(mu+.3,mv+.25,mh);const t=C.mast(s,n,b[0],b[1],40,5,2,[20,32]);
          C.horn(s,t[0]-4,t[1]+10,-1);C.horn(s,t[0]+4,t[1]+14,1);C.drum(s,t[0]-5,t[1]+24,3,-1);
          const w=P(mu+.8,mv+.2,mh);for(const dx of [-4,4]){RC(s,w[0]+dx,w[1]-8,1,8,'#5d676d');}cyl(s,w[0],w[1]-8,5,8,['#d4d8da','#b6bcbf','#979ea2'],'#e6e9ea','#9aa1a5');});
        // 一層控制室（加窗型冷氣）
        const au=1.61,av=.75,adu=.8,adv=.5,ah=14;
        S.o(3.01,(s,n)=>{boxZ(s,au,av,adu,adv,0,ah,'#8a8175','#d2c3a0','#a8997a');
          C.punched(s,n,'L',av+adv,au+.06,au+adu-.06,8,3,.12,4,493,{glass:'#4a6070',sill:'#efe6d0',lit:.8});
          C.punched(s,n,'R',au+adu,av+.08,av+adv-.06,8,3,.12,4,494,{glass:'#34454f',sill:'#c9bea6',lit:.8});
          for(let i=0;i<5;i++){const p=P(au+.1+i*.15,av+adv,4);RC(s,p[0],p[1]-3,4,3,'#dfe3e5');RC(s,p[0],p[1]-1,4,1,'#8e979c');}
          C.parapet(s,au,av,adu,adv,ah,'#e6dcc4','#b8aa8a','#6f685c');
          C.chiller(s,au+.1,av+.12,.24,.16,2,ah);boxZ(s,au+.45,av+.15,.12,.12,ah,6,'#b0a590','#c4b9a3','#978c78');const d=P(au+.62,av+.3,ah);C.sat(s,d[0],d[1],4);});
        S.t(2.3,s=>C.flag(s,.3,1.24,30,'#2f6db3','#1f4f85'));
        [[.32,1.44,5],[.48,1.44,1],[.96,1.44,4],[1.12,1.44,3]].forEach(([u,v,ci])=>S.o(u+v+.02,s=>C.car(s,u+.03,v+.03,ci,true)));
        S.o(4.3,(s,n)=>C.guard(s,n,1.26,2.62));S.t(4.6,s=>C.boom(s,1.52,2.74,1.8));
        S.o(2.34,s=>C.tree(s,.14,2.2,6,41));S.o(2.95,s=>C.tree(s,.2,2.75,6,42));S.o(5.2,s=>C.tree(s,2.7,2.5,6,43));S.o(5.0,s=>C.tree(s,2.2,2.8,5,44));S.o(4.05,s=>C.tree(s,1.3,2.75,5,45));S.o(3.5,s=>C.tree(s,2.3,1.2,5,46));
        L.lamp(S,1.46,2.2,24);
        S.run();
        return{gate:[.5,.6]};
      },
      // v4 綠建築新調度中心：遮陽百葉玻璃盒＋綠屋頂與屋頂太陽能、圓柱玻璃控制室、單管通訊塔、太陽能車棚＋充電樁、儲能櫃與發電機組、雨水花園
      (K,L,C,g,ng)=>{
        const {P,hsh}=K,{RC,BL,boxZ,flatQ,bandL,bandR,cyl}=L;
        L.flat(g,f=>{flatQ(f,1.26,1.44,.28,1.52,ASPH);flatQ(f,1.54,1.62,1.36,.78,ASPH);flatQ(f,.3,1.18,2.2,.14,WALK);
          flatQ(f,2.3,.1,.6,.66,'#bdb9b0');flatQ(f,.22,1.4,.96,.26,'#5d8f4a');});
        L.flat(g,f=>{C.parkLines(f,1.58,1.66,1.28,.26,.16,true);C.parkLines(f,1.58,2.1,1.28,.26,.16,true);
          for(let i=0;i<18;i++){const p=P(.26+hsh(1494,i,1)*.9,1.44+hsh(1494,i,2)*.18);RC(f,p[0],p[1],2,1,i%3?'#78b35e':'#e8d36a');}
          BL(f,P(.26,1.53),P(1.14,1.53),'#6a9fc0');});
        L.shadow(g,[[.35,.35,1.2,.8,40],[2.36,.14,.4,.14,10],[2.36,.36,.4,.14,10]]);
        C.shadowE(g,[[1.98,.98,18],[.16,2.2,5],[.2,2.7,5],[1.1,2.8,4]]);
        C.backWall(g);
        const S=L.scene(g,ng);
        const bu=.35,bv=.35,bdu=1.2,bdv=.8,bh=40,v1=bv+bdv,u1=bu+bdu;
        S.o(1.5,(s,n)=>{
          boxZ(s,bu,bv,bdu,bdv,0,bh,'#6f9a4f','#e3e6e6','#b4babd');
          C.curtain(s,n,'L',v1,bu+.04,u1-.04,4,3,12,61,{lit:.55,glass:'#4f86a0',refl:'#9cc7d6',every:5});
          C.curtain(s,n,'R',u1,bv+.04,v1-.04,4,3,12,67,{lit:.55,glass:'#35607a',refl:'#6f9aad',every:5});
          for(let z=7;z<bh;z+=12)for(const dz of [0,2]){bandL(s,v1+.03,bu+.02,u1-.02,z+dz,'#f2f4f4');bandR(s,u1+.03,bv+.02,v1-.02,z+dz,'#c9cfd2');}
          L.fL(s,v1,bu+.04,u1-.04,0,4,'#3c5566');L.fR(s,u1,bv+.04,v1-.04,0,4,'#2c4150');
          C.parapet(s,bu,bv,bdu,bdv,bh,'#f4f6f6','#c9cfd2','#56713f');
          for(let t=bv+.08;t<v1-.1;t+=.1)BL(s,P(bu+.06,t,bh),P(bu+.5,t,bh),'#86b35f');
          for(let r=0;r<4;r++)L.boxZ(s,bu+.62,bv+.1+r*.16,.48,.1,bh,2,'#2f5878','#4a78a0','#244660');
          for(let r=0;r<4;r++)for(let t=bu+.68;t<bu+1.1;t+=.08)BL(s,P(t,bv+.1+r*.16,bh+2),P(t,bv+.2+r*.16,bh+2),'#6a96b8');
          boxZ(s,bu+.1,bv+.1,.14,.14,bh,8,'#b9c1c5','#d1d7da','#9ea7ab');});
        S.o(2.95,(s,n)=>{const p=P(1.98,.92);C.drumGlass(s,n,p[0],p[1],18,24,1494);});
        S.t(3.12,(s,n)=>{const b=P(2.62,.5);C.monopole(s,n,b[0],b[1],84);});
        S.o(2.75,(s,n)=>{boxZ(s,2.36,.14,.4,.14,0,10,'#dfe3e5','#eceff0','#c3cbd0');for(let t=2.4;t<2.74;t+=.045)BL(s,P(t,.28,1),P(t,.28,9),'#b9c1c6');const led=P(2.46,.28,7);RC(s,led[0],led[1],1,1,'#52c79e');RC(n,led[0],led[1],1,1,'#7dffd0');});
        S.o(2.97,(s,n)=>C.genset(s,n,2.36,.36,.4,.14,7));
        // 太陽能車棚＋充電樁
        const rows=[1.66,2.1];
        [[1.62,1.66,2],[1.78,1.66,0],[2.1,1.66,1],[2.42,1.66,4],[2.58,1.66,0],[1.78,2.1,1],[1.94,2.1,3],[2.42,2.1,2]].forEach(([u,v,ci],i)=>S.o((v<2?3.0:3.4)+i*.01,s=>C.car(s,u+.03,v+.03,ci,true)));
        S.t(3.25,(s,n)=>{for(let t=1.7;t<2.9;t+=.32){const p=P(t,1.62);RC(s,p[0],p[1]-7,2,7,'#e8ecee');RC(s,p[0]+1,p[1]-7,1,7,'#aab2b6');RC(s,p[0],p[1]-6,2,2,'#3fb27f');RC(n,p[0],p[1]-6,2,1,'#7dffd0');}});
        S.t(3.6,(s,n)=>{for(let t=1.62;t<2.9;t+=.32){const p=P(t,2.4);RC(s,p[0],p[1]-6,2,6,'#e8ecee');RC(s,p[0],p[1]-5,2,2,'#3fb27f');RC(n,p[0],p[1]-5,2,1,'#7dffd0');}});
        S.o(3.7,s=>C.pvCanopy(s,1.58,2.1,1.28,.28,14));
        S.o(4.3,(s,n)=>C.guard(s,n,.98,2.62));S.t(4.6,s=>C.boom(s,1.26,2.74,1.54));
        S.o(2.36,s=>C.tree(s,.16,2.2,5,51));S.o(2.9,s=>C.tree(s,.2,2.7,5,52));S.o(3.9,s=>C.tree(s,1.1,2.8,4,53));S.o(1.7,s=>C.tree(s,.12,1.58,4,54));S.o(3.1,s=>C.tree(s,2.8,.3,4,55));
        L.lamp(S,1.5,2.52,26);
        S.run();
        return{gate:[.42,.52]};
      },
    ];
    const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),C=CITY(K,L);
    for(let v=0;v<lay149.length;v++){
      try{
        const {c,g,nc,ng}=K.canvases();
        C.lawn(g,1490+v);
        const o=lay149[v](K,L,C,g,ng)||{};
        const sp=L.done(c,g,nc,{fence:false});
        C.frontWall(g,o.gate||[.34,.46]);
        B['149_1_'+v]=sp;
      }catch(e){console.error('infra575 k149 v'+v,e);}
    }
  }catch(e){console.error('infra575 k149',e);}
});
