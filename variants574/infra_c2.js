// T575 infra_c2：k156 高級污水處理廠／k159 都市滯洪池／k160 人工濕地（4×4，畫布 256×265，錨點 128,263）真實設施風格重畫。
// 分層合成：立體主體各自一層（二值化＋深色外框）；欄杆／管線／細桿走不描邊的細線層；
// 地面（草地／路面／水面／下凹池體）走像素精準的高度場掃描線，不描粗。
// 夜光按層遮擋（後層實體擦掉被擋住的燈）；水面不發光。零亂數：只用 K.hsh 決定性雜湊。光從左：+v 面亮、+u 面暗；落影向右。
(window.__variants574=window.__variants574||[]).push(function infra_c2(A){
  const B=A.SPR().bld,SH=A.shade,rnd=Math.round;
  const DEV={};          // 迭代用：{156:[3,4]}＝把 v3、v4 暫放到 v0、v1 槽位看大圖；定稿必須是 {}
  const DEV_ZOOM={};     // 迭代用：{156:{from:0,to:1,x:0,y:130}}＝把 v0 的左下半幅放大兩倍放到 v1 槽位；定稿必須是 {}
  const DEV_THROW=false;   // 迭代用：分類出錯時在批次尾拋出讓報表看得到；定稿必須是 false
  const W=256,H=265,AX=128,AY=263,SZ=4;
  const errs=[];

  // ================= 共用工具 =================
  const LIB=(K)=>{
    const {P,hsh,TOPY}=K;
    const RC=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(rnd(x),rnd(y),w,h);};
    const BL=(g,a,b,c,ok)=>{let x0=rnd(a[0]),y0=rnd(a[1]);const x1=rnd(b[0]),y1=rnd(b[1]);
      const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;g.fillStyle=c;
      for(let k=0;k<2000;k++){if(!ok||ok(x0,y0))g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    // 像素精準多邊形：掃描線取像素中心、左閉右開（無抗鋸齒、相鄰面不留縫、任意繞向）
    const fp=(g,pts,c)=>{g.fillStyle=c;let ya=1e9,yb=-1e9;for(const p of pts){if(p[1]<ya)ya=p[1];if(p[1]>yb)yb=p[1];}
      const y0=Math.max(0,Math.floor(ya)),y1=Math.min(H-1,Math.ceil(yb)),n=pts.length;
      for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
        for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
        if(xs.length<2)continue;xs.sort((p,q)=>p-q);
        for(let k=0;k+1<xs.length;k+=2){const xa=Math.ceil(xs[k]-.5),xb=Math.ceil(xs[k+1]-.5)-1;if(xb>=xa)g.fillRect(xa,y,xb-xa+1,1);}}};
    const Q=(u0,v0,du,dv,z=0)=>[P(u0,v0,z),P(u0+du,v0,z),P(u0+du,v0+dv,z),P(u0,v0+dv,z)];
    const flat=(g,u0,v0,du,dv,c,z=0)=>fp(g,Q(u0,v0,du,dv,z),c);
    const boxZ=(g,u0,v0,du,dv,z,h,top,left,right)=>{const u1=u0+du,v1=v0+dv;
      fp(g,[P(u0,v1,z),P(u1,v1,z),P(u1,v1,z+h),P(u0,v1,z+h)],left);
      fp(g,[P(u1,v0,z),P(u1,v1,z),P(u1,v1,z+h),P(u1,v0,z+h)],right);
      fp(g,[P(u0,v0,z+h),P(u1,v0,z+h),P(u1,v1,z+h),P(u0,v1,z+h)],top);return{u0,v0,u1,v1,z,h};};
    const faceL=(g,v,ua,ub,za,zb,c)=>fp(g,[P(ua,v,za),P(ub,v,za),P(ub,v,zb),P(ua,v,zb)],c);
    const faceR=(g,u,va,vb,za,zb,c)=>fp(g,[P(u,va,za),P(u,vb,za),P(u,vb,zb),P(u,va,zb)],c);
    const clipPoly=(g,pts,fn)=>{g.save();g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.clip();fn();g.restore();};
    // 牆面平行四邊形（整數像素）：winL 在 +v 面、winR 在 +u 面；錨點＝左下
    const pg=(g,x0,y0,w,h,s,c)=>{g.fillStyle=c;for(let i=0;i<w;i++){const o=s>0?Math.floor(i*s+1e-6):Math.ceil(i*s-1e-6);g.fillRect(rnd(x0)+i,rnd(y0)+o,1,h);}};
    const winL=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,.5,c);};
    const winR=(g,u,v,z,w,h,c)=>{const p=P(u,v,z);pg(g,p[0],p[1]-h,w,h,-.5,c);};
    const rowL=(g,n,u0,u1,v,z,w,h,gap,glass,seed,lit=.55,frame)=>{const p=P(u0,v,z),len=Math.floor((u1-u0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])+Math.floor(x*.5)-h;
        if(frame)pg(g,X-1,Y-1,w+2,h+2,.5,frame);pg(g,X,Y,w,h,.5,glass);pg(g,X,Y,w,1,.5,SH(glass,36));
        if(n&&hsh(seed,k,11)<lit)pg(n,X,Y,w,h,.5,'#ffe3a0');}};
    const rowR=(g,n,u,v0,v1,z,w,h,gap,glass,seed,lit=.5,frame)=>{const p=P(u,v1,z),len=Math.floor((v1-v0)*32);let k=0;
      for(let x=gap;x+w<=len-gap+1;x+=w+gap,k++){const X=rnd(p[0])+x,Y=rnd(p[1])-Math.floor(x*.5)-h;
        if(frame)pg(g,X-1,Y,w+2,h+2,-.5,frame);pg(g,X,Y,w,h,-.5,glass);
        if(n&&hsh(seed,k,13)<lit)pg(n,X,Y,w,h,-.5,'#f3d68e');}};
    const louvL=(g,u,v,z,w,rows,fr='#5f696e',sl='#a7b0b4')=>{winL(g,u,v,z,w,rows*2+1,fr);for(let r=0;r<rows;r++)winL(g,u,v,z+1+r*2,w,1,sl);};
    const louvR=(g,u,v,z,w,rows,fr='#4f585d',sl='#8c969a')=>{winR(g,u,v,z,w,rows*2+1,fr);for(let r=0;r<rows;r++)winR(g,u,v,z+1+r*2,w,1,sl);};
    // 橢圓（等距圓 rx:ry=2:1）
    const RX=r=>Math.max(1,rnd(r*45.25));
    const hw=(rx,ry,y)=>Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/((ry+.5)*(ry+.5)))));
    const hx=(rx,ry,x)=>Math.round(ry*Math.sqrt(Math.max(0,1-(x*x)/((rx+.5)*(rx+.5)))));
    const ell=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y);g.fillRect(cx-w,cy+y,2*w+1,1);}};
    const ellIn=(g,cx,cy,rx,ry,c,ox,oy,orx,ory)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);ox=rnd(ox);oy=rnd(oy);
      for(let y=-ry;y<=ry;y++){const yy=cy+y-oy;if(yy<-ory||yy>ory)continue;const w=hw(rx,ry,y),w2=hw(orx,ory,yy),xa=Math.max(cx-w,ox-w2),xb=Math.min(cx+w,ox+w2);if(xb>=xa)g.fillRect(xa,cy+y,xb-xa+1,1);}};
    const ring=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let y=-ry;y<=ry;y++){const w1=hw(rx,ry,y);
      if(Math.abs(y)>ry-1||rx<2){g.fillRect(cx-w1,cy+y,2*w1+1,1);continue;}const w2=hw(rx-1,ry-1,y);g.fillRect(cx-w1,cy+y,w1-w2,1);g.fillRect(cx+w2+1,cy+y,w1-w2,1);}};
    const arcF=(g,cx,cy,rx,ry,c,x0=-1e9,x1=1e9)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let x=Math.max(-rx,x0);x<=Math.min(rx,x1);x++)g.fillRect(cx+x,cy+hx(rx,ry,x),1,1);};
    const arcB=(g,cx,cy,rx,ry,c)=>{g.fillStyle=c;cx=rnd(cx);cy=rnd(cy);for(let x=-rx;x<=rx;x++)g.fillRect(cx+x,cy-hx(rx,ry,x),1,1);};
    // 直立圓柱：tones 左→右（首色為左緣，第二色最亮）
    const cyl=(g,cx,cy,rx,h,tones,top,rim)=>{const ry=Math.max(1,rx>>1);cx=rnd(cx);cy=rnd(cy);
      for(let x=-rx;x<=rx;x++){const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];
        const yb=hx(rx,ry,x);g.fillStyle=c;g.fillRect(cx+x,cy-h,1,h+yb+1);}
      if(top){if(rim){ell(g,cx,cy-h,rx,ry,rim);ell(g,cx,cy-h,rx-1,Math.max(0,ry-1),top);}else ell(g,cx,cy-h,rx,ry,top);}
      return[cx,cy-h];};
    // 淺錐頂（置於圓柱頂 cx,cy）
    const cone=(g,cx,cy,rx,rh,tones)=>{const ry=Math.max(1,rx>>1);cx=rnd(cx);cy=rnd(cy);
      for(let x=-rx;x<=rx;x++){const yb=hx(rx,ry,x),yt=Math.max(yb,rnd(rh*(1-Math.abs(x)/(rx+.5))+ry*.15));
        const f=(x+rx)/(2*rx+1),c=tones[Math.min(tones.length-1,Math.floor(f*tones.length))];g.fillStyle=c;g.fillRect(cx+x,cy-yt,1,yt+yb+1);}};
    // 旋轉體（蛋形消化槽、氣囊球）：prof(zs)→畫面水平半徑；逐片由下往上、逐像素依法線打光
    const revolve=(g,cx,cy,zh,prof,tones,opt={})=>{cx=rnd(cx);cy=rnd(cy);
      for(let z=0;z<=zh;z++){const rr=prof(z);if(!(rr>=.6))continue;const rx=rnd(rr),ry=Math.max(0,rnd(rr/2));
        const d=(prof(Math.min(zh,z+1))-prof(Math.max(0,z-1)))/2*.866,nn=Math.sqrt(1+d*d),cp=1/nn,sp=-d/nn;
        const band=opt.band&&z>2&&z%opt.band===0;
        for(let y=-ry;y<=ry;y++){const w=hw(rx,ry,y),ca=ry?y/(ry+.5):1;
          for(let x=-w;x<=w;x++){const sa=x/(rx+.5);let l=-.62*sa*cp+.6*sp+.3*Math.max(0,ca)*cp+(opt.bias||0);
            let k=l>.42?0:l>.16?1:l>-.08?2:l>-.32?3:4;if(band&&y===hx(rx,ry,x))k=Math.min(4,k+1);
            g.fillStyle=tones[k];g.fillRect(cx+x,cy-z+y,1,1);}}}};
    // 分層場景：o＝立體主體（描外框）、t＝細線層（不描邊、相鄰合併）；依 d 由後往前
    const scene=()=>{const items=[];
      const run=(g,ng)=>{items.sort((a,b)=>a.d-b.d||a.i-b.i);let k=0;
        while(k<items.length){const it=items[k];const[sc,sx]=A.cv(W,H),[lc,lx]=A.cv(W,H);
          if(it.ol){it.fn(sx,lx);k++;}else{while(k<items.length&&!items[k].ol){items[k].fn(sx,lx);k++;}}
          K.hard(sc);if(it.ol)A.outlineSprite(sc,28,34,42);g.drawImage(sc,0,0);
          ng.globalCompositeOperation='destination-out';ng.drawImage(sc,0,0);ng.globalCompositeOperation='source-over';ng.drawImage(lc,0,0);}};
      return{o:(d,fn)=>items.push({d,ol:1,fn,i:items.length}),t:(d,fn)=>items.push({d,ol:0,fn,i:items.length}),run};};
    // 落影（光從左 ⇒ 影子落向右）：['b',u0,v0,du,dv,h,z] 方盒／['c',u,v,r,h,z] 圓柱
    const shadow=(g,list,a=.22)=>{const[sc,sx]=A.cv(W,H),C='#0e1216';
      for(const s of list){if(s[0]==='b'){const[,u0,v0,du,dv,h,z=0]=s,k=h/64,u1=u0+du,v1=v0+dv;
          const F=[P(u0,v0,z),P(u1,v0,z),P(u1,v1,z),P(u0,v1,z)],T=[P(u0+k,v0-k*.45,z),P(u1+k,v0-k*.45,z),P(u1+k,v1-k*.45,z),P(u0+k,v1-k*.45,z)];
          fp(sx,F,C);fp(sx,T,C);for(let i=0;i<4;i++)fp(sx,[F[i],F[(i+1)%4],T[(i+1)%4],T[i]],C);}
        else{const[,u,v,r,h,z=0]=s,k=h/64,n=Math.max(2,rnd(k*30));for(let i=0;i<=n;i++){const t=k*i/n,p=P(u+t,v-t*.45,z);ell(sx,p[0],p[1],RX(r),RX(r)>>1,C);}}}
      g.save();g.globalAlpha=a;g.globalCompositeOperation='source-atop';g.drawImage(sc,0,0);g.restore();};
    // 高度場：zf(u,v)→z、cf(u,v,z,gu,gv,i,j)→色；tgt 可為 g（直接畫）或 scene（逐斜列排序，與物件互相遮擋）
    const terrain=(tgt,u0,v0,u1,v1,st,zf,cf)=>{const nu=rnd((u1-u0)/st),nv=rnd((v1-v0)/st),Z=[];
      for(let i=0;i<=nu;i++){const row=new Float32Array(nv+1);for(let j=0;j<=nv;j++)row[j]=zf(u0+i*st,v0+j*st);Z.push(row);}
      const drawRow=(g,s)=>{for(let i=Math.max(0,s-nv+1);i<=Math.min(nu-1,s);i++){const j=s-i,u=u0+i*st,v=v0+j*st;
        const a=Z[i][j],b=Z[i+1][j],c=Z[i+1][j+1],d=Z[i][j+1],gu=(b+c-a-d)/(2*st),gv=(d+c-a-b)/(2*st);
        const col=cf(u+st/2,v+st/2,(a+b+c+d)/4,gu,gv,i,j);if(col)fp(g,[P(u,v,a),P(u+st,v,b),P(u+st,v+st,c),P(u,v+st,d)],col);}};
      for(let s=0;s<=nu+nv-2;s++){if(tgt.t){const ss=s;tgt.t(u0+v0+(s+1)*st,g=>drawRow(g,ss));}else drawRow(tgt,s);}
      return Z;};
    // 地面材質
    const GRASS='#78a255';
    const MAT={
      g:s=>(i,j)=>{const t=hsh(s,i,j*64+1);return t<.05?'#6a9449':t>.965?'#8ab463':GRASS;},
      a:s=>(i,j)=>{const t=hsh(s,i,j*64+2);return t<.06?'#716e69':t>.95?'#86837d':'#7b7872';},
      c:s=>(i,j)=>{const t=hsh(s,i,j*64+3);return t<.06?'#c1bdb3':t>.97?'#d6d2c9':'#cbc7bd';},
      k:s=>(i,j)=>{const t=hsh(s,i,j*64+4);return t<.25?'#a8a397':t>.8?'#bebaae':'#b3aea2';},
      p:s=>(i,j)=>{const t=hsh(s,i,j*64+5);return (i+j)%4===0?'#b9ab93':t<.1?'#c2b49b':'#cdbfa6';},   // 步道鋪面
    };
    const ground=(g,seed,mats=[])=>{A.dia(g,AX,TOPY,32*SZ,GRASS);
      const fns=mats.map(m=>[m[1],m[2],m[3],m[4],MAT[m[0].toLowerCase()](seed+m[0].charCodeAt(0))]),gf=MAT.g(seed);
      terrain(g,0,0,SZ,SZ,1/16,()=>0,(u,v,z,gu,gv,i,j)=>{for(let k=fns.length-1;k>=0;k--){const m=fns[k];if(u>=m[0]&&u<m[0]+m[2]&&v>=m[1]&&v<m[1]+m[3])return m[4](i,j);}return gf(i,j);});
      for(const m of mats){if(m[0]!=='A')continue;const[,u0,v0,du,dv]=m;   // 大寫 A：道路中線虛線
        if(du>=dv){const vm=v0+dv/2;for(let t=u0+.06;t<u0+du-.1;t+=.16)BL(g,P(t,vm),P(t+.07,vm),'#d8d2bd');}
        else{const um=u0+du/2;for(let t=v0+.06;t<v0+dv-.1;t+=.16)BL(g,P(um,t),P(um,t+.07),'#d8d2bd');}}
      A.diaEdge(g,6,'#5d8540',AX,TOPY,32*SZ);A.diaEdge(g,9,'#90b86c',AX,TOPY,32*SZ);};
    const stalls=(g,u0,v0,du,n,dv=.2)=>{for(let k=0;k<=n;k++){const u=u0+du*k/n;BL(g,P(u,v0),P(u,v0+dv),'#dedad0');}};
    // ---- 小配件 ----
    const TREE=[['#9ccb6a','#6fa247','#4f7f35','#355c25'],['#b0c86c','#7f9f45','#5c7c38','#3f5a28'],['#8fc07a','#5d9457','#3f7040','#2b5130']];
    const tree=(S,u,v,z=0,s=1,kind=0)=>S.o(u+v+.03,(g)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]),pal=TREE[kind%3];
      const r=Math.max(2,rnd(4.2*s)),h=rnd(9*s)+3;RC(g,x,y-h+r,1,h-r+1,'#6e5238');RC(g,x+1,y-h+r,1,h-r,'#4a3727');
      const cy=y-h;ell(g,x+1,cy+1,r,r-1,pal[3]);ell(g,x,cy,r,r-1,pal[2]);ell(g,x-1,cy-1,r-1,Math.max(1,r-2),pal[1]);ell(g,x-2,cy-2,Math.max(1,r-3),Math.max(1,r-3),pal[0]);
      for(let i=0;i<r+2;i++){const a=hsh(rnd(u*97),rnd(v*89),i)*6.283,d=hsh(rnd(v*71),rnd(u*53),i)*(r-1);RC(g,x+rnd(Math.cos(a)*d),cy+rnd(Math.sin(a)*d*.8),1,1,hsh(i,rnd(u*31),rnd(v*37))<.5?pal[3]:pal[0]);}});
    const conifer=(S,u,v,z=0,s=1)=>S.o(u+v+.03,(g)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]),h=rnd(14*s);RC(g,x,y-3,1,3,'#5a4330');
      for(let k=0;k<h;k++){const w=Math.max(0,rnd((k/h)*4.5*s));g.fillStyle=k%4===3?'#2f5a34':'#3f7443';g.fillRect(x-w,y-3-h+k,w+1,1);g.fillStyle=k%4===3?'#244a2a':'#2f5a34';g.fillRect(x+1,y-3-h+k,w,1);}});
    const bush=(S,u,v,z=0,r=3)=>S.o(u+v+.02,(g)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);ell(g,x,y-r+1,r,Math.max(1,r-1),'#4f7f35');ell(g,x-1,y-r,Math.max(1,r-1),Math.max(1,r-2),'#78a84c');RC(g,x-1,y-r-1,1,1,'#a3cf72');});
    const lamp=(S,u,v,z=0,h=18)=>S.t(u+v+.04,(g,n)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,1,h,'#566066');RC(g,x+1,y-h+1,1,h-1,'#8e979c');
      RC(g,x-1,y-h-1,4,1,'#3e464b');RC(g,x-1,y-h,3,1,'#efe2b0');if(n){RC(n,x-1,y-h,3,1,'#ffe6a0');RC(n,x-2,y-h+1,5,1,'rgba(255,226,160,.45)');}});
    const sign=(S,u,v,c='#2f6fb0')=>S.t(u+v+.04,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-3,y-2,1,2,'#5f686e');RC(g,x+3,y-2,1,2,'#5f686e');RC(g,x-4,y-7,9,5,'#f2f4f5');RC(g,x-4,y-7,9,1,c);RC(g,x-3,y-5,6,1,'#8f989d');RC(g,x-3,y-3,4,1,'#b2babe');});
    const rail=(g,a,b,h=3,c='#a3acb1',step=6)=>{BL(g,[a[0],a[1]-h],[b[0],b[1]-h],c);const n=Math.max(1,rnd(Math.abs(b[0]-a[0])/step));for(let i=0;i<=n;i++){const q=lerp(a,b,i/n);RC(g,q[0],q[1]-h+1,1,h-1,SH(c,-44));}};
    const pipe=(g,a,b,c=['#a9c7de','#5f8fb8','#3f6283'])=>{BL(g,[a[0],a[1]-1],[b[0],b[1]-1],c[0]);BL(g,a,b,c[1]);BL(g,[a[0],a[1]+1],[b[0],b[1]+1],c[2]);};
    const hydrant=(S,u,v)=>S.o(u+v+.02,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-1,y-5,3,5,'#c0392b');RC(g,x-2,y-3,5,1,'#e0584a');RC(g,x-1,y-6,3,1,'#e8e1d0');});
    const car=(S,u,v,alongU,col)=>S.o(u+v+.1,(g)=>{const du=alongU?.15:.08,dv=alongU?.08:.15;
      boxZ(g,u,v,du,dv,1,2,col,SH(col,20),SH(col,-40));boxZ(g,u+(alongU?.04:.01),v+(alongU?.01:.04),alongU?.07:.06,alongU?.06:.07,3,2,SH(col,30),'#7fa3bb','#5a7d94');});
    const truck=(S,u,v,alongU,col='#d98f2e')=>S.o(u+v+.25,(g,n)=>{if(alongU){boxZ(g,u,v,.3,.11,1,6,'#9aa3a8','#c5cbce','#848d92');boxZ(g,u+.31,v+.005,.1,.1,1,5,SH(col,20),col,SH(col,-44));winR(g,u+.41,v+.09,3,3,2,'#34495a');
        const a=P(u+.06,v+.11,0),b=P(u+.24,v+.11,0);RC(g,a[0],a[1]-1,2,2,'#2a2e31');RC(g,b[0],b[1]-1,2,2,'#2a2e31');}
      else{boxZ(g,u,v,.11,.3,1,6,'#9aa3a8','#c5cbce','#848d92');boxZ(g,u+.005,v+.31,.1,.1,1,5,SH(col,20),col,SH(col,-44));winL(g,u+.02,v+.41,3,3,2,'#34495a');
        const a=P(u+.11,v+.06,0),b=P(u+.11,v+.24,0);RC(g,a[0]-1,a[1]-1,2,2,'#2a2e31');RC(g,b[0]-1,b[1]-1,2,2,'#2a2e31');}});
    const bench=(S,u,v,alongU=true)=>S.o(u+v+.02,(g)=>{if(alongU)boxZ(g,u,v,.12,.04,1,1,'#9b7653','#b58d66','#7b5c40');else boxZ(g,u,v,.04,.12,1,1,'#9b7653','#b58d66','#7b5c40');});
    return{P,hsh,RC,BL,lerp,fp,Q,flat,boxZ,faceL,faceR,clipPoly,pg,winL,winR,rowL,rowR,louvL,louvR,RX,hw,hx,ell,ellIn,ring,arcF,arcB,cyl,cone,revolve,scene,shadow,terrain,MAT,ground,stalls,tree,conifer,bush,lamp,sign,rail,pipe,hydrant,car,truck,bench,GRASS};
  };

  // 組裝：每類一個 K、每變體獨立畫布；DEV 映射只在迭代時使用
  const build=(k,layouts,nv)=>{const K=A.iso575(W,H,AX,AY,SZ),L=LIB(K),order=DEV[k]||null;
    for(let slot=0;slot<nv;slot++){const v=order?order[slot]:slot;if(v==null||!layouts[v])continue;
      const[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H),S=L.scene();
      const o=layouts[v](g,ng,S,L,K)||{};
      S.run(g,ng);
      const[sc]=A.cv(W,H);
      B[k+'_1_'+slot]=K.finish(c,g,sc,nc,{fence:o.fence!==false,gate:o.gate,smoke:o.smoke||[]});}
    const zs=[].concat(DEV_ZOOM[k]||[]),snap=zs.map(z=>B[k+'_1_'+z.from]);
    zs.forEach((z,i)=>{const src=snap[i],[c,g]=A.cv(W,H),[nc,ng]=A.cv(W,H);g.imageSmoothingEnabled=false;ng.imageSmoothingEnabled=false;
      g.drawImage(src.img,z.x,z.y,W/2,H/2,0,0,W,H);ng.drawImage(src.night,z.x,z.y,W/2,H/2,0,0,W,H);B[k+'_1_'+z.to]={img:c,night:nc,ax:AX,ay:AY,w:W,h:H,smoke:[]};});};

  // ================= k156 高級污水處理廠 =================
  try{
    const K156=L=>{
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,clipPoly,pg,winL,winR,rowL,rowR,louvL,louvR,RX,hw,hx,ell,ellIn,ring,arcF,cyl,cone,revolve,rail,pipe}=L;
      const CT='#d9d5cb',CLt='#e4e0d6',CRt='#b1ada3';
      const WC={base:'#4e8a8c',deep:'#3c7377',lite:'#86bcb7',wall:'#8a867d'};    // 二沉池：清澈藍綠
      const WP={base:'#7c8068',deep:'#666b55',lite:'#9ea287',wall:'#8a867d'};    // 初沉池：灰褐
      const AER={base:'#8a8062',anox:'#6f6a52',foam:'#f0efe2',foam2:'#c8c4a8'};
      // 圓形沉澱池：池壁＋內側遠壁＋水面＋出流堰槽＋整流筒＋旋轉刮泥橋
      const clarifier=(S,u,v,r,opt={})=>{const rx=RX(r),ry=rx>>1,h=opt.h||5,Wt=opt.water||WC,th=opt.th!=null?opt.th:-2.2,seed=opt.seed||7;
        S.o(u+v,(g,n)=>{const c=P(u,v,0),cx=rnd(c[0]),cy=rnd(c[1]);
          cyl(g,cx,cy,rx,h,['#c2beb4','#e2ded4','#d6d2c8','#c2beb4','#aaa69c'],null);
          const ty=cy-h,orx=rx-2,ory=Math.max(1,ry-1);
          ell(g,cx,ty,rx,ry,'#e8e4db');ell(g,cx,ty,orx,ory,Wt.wall);
          ellIn(g,cx,ty+2,orx,ory,Wt.base,cx,ty,orx,ory);
          if(rx>=12){ellIn(g,cx,ty+1,orx-2,ory-1,'#d4d0c6',cx,ty,orx,ory);ellIn(g,cx,ty+1,orx-3,ory-2,Wt.deep,cx,ty,orx,ory);ellIn(g,cx,ty+2,orx-3,ory-2,Wt.base,cx,ty,orx,ory);
            ring(g,cx,ty+2,orx-6,Math.max(1,ory-3),Wt.lite);ellIn(g,cx,ty+2,orx-7,Math.max(1,ory-4),Wt.base,cx,ty,orx,ory);}
          for(let i=0;i<3;i++){const a=hsh(seed,i,3)*6.28,d=.35+hsh(seed,i,4)*.3;for(let k=0;k<5;k++){const b=a+k*.09;RC(g,cx+rnd(Math.cos(b)*orx*d),ty+2+rnd(Math.sin(b)*ory*d),1,1,Wt.lite);}}
          cyl(g,cx,ty+2,Math.max(2,rnd(rx*.16)),2,['#8f989c','#c9d0d3','#aab2b6','#8f989c'],'#dfe4e6');
          RC(g,cx-1,ty-2,3,2,'#4f7390');RC(g,cx-1,ty-2,1,2,'#7fa3bf');
          const ex=u+Math.cos(th)*r*.94,ev=v+Math.sin(th)*r*.94,E=P(ex,ev,h),inside=(x,y)=>{const yy=y-ty,w=hw(orx,ory,yy);return Math.abs(yy)<=ory&&Math.abs(x-cx)<=w;};
          BL(g,[cx+2,ty+3],[E[0]+2,E[1]+3],Wt.deep,inside);
          BL(g,[cx,ty-1],[E[0],E[1]-1],'#f2f4f5');BL(g,[cx,ty],[E[0],E[1]],'#8d969b');
          const eb=[rnd(E[0]),rnd(E[1])];RC(g,eb[0]-2,eb[1]-3,4,3,'#d9a13a');RC(g,eb[0]-2,eb[1]-3,4,1,'#f0c25a');
          if(opt.full){const fx=u-Math.cos(th)*r*.94,fv=v-Math.sin(th)*r*.94,F=P(fx,fv,h);BL(g,[cx,ty-1],[F[0],F[1]-1],'#f2f4f5');BL(g,[cx,ty],[F[0],F[1]],'#8d969b');RC(g,F[0]-2,F[1]-3,4,3,'#d9a13a');}
        });
        S.t(u+v+.002,(g)=>{const c=P(u,v,h),cx=rnd(c[0]),cy=rnd(c[1]),E=P(u+Math.cos(th)*r*.94,v+Math.sin(th)*r*.94,h);BL(g,[cx,cy-4],[E[0],E[1]-4],'#b7c0c4');
          for(let k=1;k<4;k++){const q=L.lerp([cx,cy],E,k/4);RC(g,q[0],q[1]-3,1,2,'#6d777c');}});
      };
      // 長方形池（曝氣池／初沉池）：lanes 條沿 u 的水道；kind='aer' 白色氣泡、'prim' 初沉灰褐＋行車式刮泥橋
      const tank=(S,u0,v0,du,dv,lanes,kind,opt={})=>{const h=opt.h||5,t=.06,u1=u0+du,v1=v0+dv,seed=opt.seed||11,lw=(dv-t)/lanes;
        S.o(u0+v0+(du+dv)*.5,(g,n)=>{
          boxZ(g,u0,v0,du,dv,0,h,CT,CLt,CRt);
          for(let Ln=0;Ln<lanes;Ln++){const a=v0+t+Ln*lw,b=a+lw-t,iu0=u0+t,iu1=u1-t;
            faceL(g,a,iu0,iu1,h-2,h,'#bebab0');faceR(g,iu0,a,b,h-2,h,'#8e8a80');
            if(kind==='aer'){flat(g,iu0,a,iu1-iu0,b-a,AER.base,h-2);const ax=opt.anox!=null?opt.anox:.16;flat(g,iu0,a,(iu1-iu0)*ax,b-a,AER.anox,h-2);
              for(let uu=iu0+(iu1-iu0)*ax+.05;uu<iu1-.03;uu+=.085)for(let vv=a+.045;vv<b-.015;vv+=.075){const q=hsh(seed,rnd(uu*100),rnd(vv*100)+Ln*7),p=P(uu,vv,h-2),x=rnd(p[0]),y=rnd(p[1]);
                RC(g,x-1,y,3,1,AER.foam2);RC(g,x,y,q<.5?2:1,1,AER.foam);if(q>.62)RC(g,x+1,y-1,1,1,AER.foam);}
              const mx=P(iu0+(iu1-iu0)*ax*.5,(a+b)/2,h-2);RC(g,mx[0]-1,mx[1]-1,3,1,'#5d5947');}
            else{flat(g,iu0,a,iu1-iu0,b-a,WP.base,h-2);
              for(let i=0;i<rnd(du*10);i++){const p=P(iu0+hsh(seed,i,Ln+1)*(iu1-iu0),a+.03+hsh(seed,i,Ln+9)*(b-a-.06),h-2);RC(g,p[0],p[1],2,1,hsh(seed,i,5)<.5?WP.lite:WP.deep);}
              const sc=P(iu1-.1,a,h-2),sd=P(iu1-.1,b,h-2);BL(g,[sc[0],sc[1]+1],[sd[0],sd[1]+1],'#a39e8a');}
          }
          for(let Ln=1;Ln<lanes;Ln++){const a=v0+t+Ln*lw-t;flat(g,u0,a,du,t,CT,h);}
          flat(g,u0,v1-t,du,t,'#e8e4da',h);flat(g,u1-t,v0,t,dv,'#cfcbc1',h);
          faceL(g,v1,u0,u1,0,h,CLt);faceR(g,u1,v0,v1,0,h,CRt);BL(g,P(u0,v1,h),P(u1,v1,h),'#f3f0e8');
          if(kind==='prim'){const bu=u0+du*(opt.bridge!=null?opt.bridge:.42);boxZ(g,bu,v0-.02,.07,dv+.04,h,2,'#e9ecee','#f4f6f7','#b9c1c5');
            const m=P(bu+.035,v1,h+2);RC(g,m[0]-2,m[1]-4,4,3,'#d9a13a');RC(g,m[0]-2,m[1]-4,4,1,'#f0c25a');}
        });
        S.t(u0+v0+du+dv*.5+.01,(g)=>{rail(g,P(u0,v1,h),P(u1,v1,h),3);rail(g,P(u1,v0,h),P(u1,v1,h),3);
          if(kind==='aer')for(let Ln=1;Ln<lanes;Ln++){const a=v0+t+Ln*lw-t*.5;BL(g,P(u0+.03,a,h+2),P(u1-.03,a,h+2),'#86add0');BL(g,P(u0+.03,a,h+1),P(u1-.03,a,h+1),'#3f6283');
            for(let uu=u0+.2;uu<u1-.1;uu+=.22){const p=P(uu,a,h+1);RC(g,p[0],p[1],1,2,'#3f6283');}}});
      };
      // 圓柱消化槽：保溫外殼＋環縫＋淺錐頂＋氣罩＋螺旋梯＋頂燈
      const digester=(S,u,v,r,h,opt={})=>{const rx=RX(r),ry=rx>>1,rh=opt.rh!=null?opt.rh:Math.max(3,rnd(rx*.42));
        S.o(u+v,(g,n)=>{const c=P(u,v,0),cx=rnd(c[0]),cy=rnd(c[1]),T=opt.tones||['#b0a894','#dcd4c0','#d0c8b4','#bcb4a0','#a29a86'];
          cyl(g,cx,cy,rx,h,T,null);
          for(let z=opt.band||8;z<h-2;z+=opt.band||8)arcF(g,cx,cy-z,rx,ry,SH(T[3],-16));
          RC(g,cx-2,cy+ry-9,4,7,'#6d6a62');RC(g,cx-2,cy+ry-9,1,7,'#8e8a80');
          const ty=cy-h;cone(g,cx,ty,rx,rh,opt.roof||['#6f7a75','#98a29d','#86908b','#6f7974','#5a635e']);arcF(g,cx,ty,rx,ry,'#e3e6e3');arcF(g,cx,ty-1,rx-1,ry-1,'#4f5853');
          cyl(g,cx,ty-rh+1,2,3,['#c9cfd2','#e1e5e7','#aab2b6','#8d9599'],'#eef1f2');BL(g,[cx+3,ty-rh+1],[cx+rnd(rx*.6),ty-2],'#7e878c');
          RC(g,cx,ty-rh-3,1,1,'#d04535');if(n)RC(n,cx,ty-rh-3,1,1,'#ff5a4a');});
        if(opt.stair!==false)S.t(u+v+.003,(g)=>{const c=P(u,v,0),cx=rnd(c[0]),cy=rnd(c[1]),a0=opt.a0!=null?opt.a0:-1.3,a1=a0+2.3;let prev=null;
          for(let k=0;k<=28;k++){const a=a0+(a1-a0)*k/28;if(Math.cos(a)<.08){prev=null;continue;}const x=cx+rnd((rx+1)*Math.sin(a)),y=cy+rnd(ry*Math.cos(a))-rnd(2+(h-3)*k/28);
            if(prev){BL(g,prev,[x,y],'#4d575d');BL(g,[prev[0],prev[1]-3],[x,y-3],'#c3cacd');}prev=[x,y];}
          arcF(g,cx,cy-h-3,rx,ry,'#b9c1c5',-rx,rx);});
      };
      // 蛋形消化槽（鋁皮）＋頂部平台
      const egg=(S,u,v,Rr,Hh,opt={})=>S.o(u+v,(g,n)=>{const c=P(u,v,0),cx=rnd(c[0]),cy=rnd(c[1]),RR=RX(Rr),t0=.16;
        const prof=z=>RR*Math.pow(Math.max(0,Math.sin(Math.PI*(t0+(1-t0)*z/Hh))),.7);
        RC(g,cx-rnd(prof(0))-2,cy-1,rnd(prof(0))*2+5,3,'#b8b4aa');
        revolve(g,cx,cy,Hh-3,prof,opt.tones||['#e9edef','#cdd4d8','#aeb7bc','#8e979d','#6f787e'],{band:9});
        const tz=Hh-3,tr=Math.max(3,rnd(prof(tz))+2);cyl(g,cx,cy-tz,tr,2,['#7f888d','#9aa2a6','#6d767b','#5d666b'],'#b9c1c5',"#8b9398");
        cyl(g,cx,cy-tz-2,2,4,['#c9cfd2','#eef1f2','#aab2b6','#8d9599'],'#f4f6f7');
        RC(g,cx+1,cy-tz-9,1,3,'#59626a');RC(g,cx+1,cy-tz-10,1,1,'#d04535');if(n)RC(n,cx+1,cy-tz-10,1,1,'#ff5a4a');});
      // 雙膜氣囊（沼氣儲槽）
      const gasholder=(S,u,v,r,opt={})=>S.o(u+v,(g,n)=>{const c=P(u,v,0),cx=rnd(c[0]),cy=rnd(c[1]),rho=RX(r),zc=rho*.28,zh=rnd((zc+rho)*.866);
        cyl(g,cx,cy,rho+1,2,['#aaa69c','#d6d2c8','#c2beb4','#aaa69c'],null);
        revolve(g,cx,cy-2,zh,z=>Math.sqrt(Math.max(0,rho*rho-(z/.866-zc)*(z/.866-zc))),opt.tones||['#eef0e8','#dadfd4','#c3cabd','#a7aea1','#8d9487'],{bias:.05});
        RC(g,cx,cy-2-zh-2,1,2,'#6d767b');});
      // 沼氣燃燒塔
      const flare=(S,u,v,h)=>S.t(u+v+.01,(g,n)=>{const p=P(u,v,0),x=rnd(p[0]),y=rnd(p[1]),hl=rnd(h*.5);
        RC(g,x-3,y-1,7,2,'#a9a59b');BL(g,[x-4,y],[x,y-hl],'#7b858b');BL(g,[x+4,y],[x+1,y-hl],'#5f686e');BL(g,[x-4,y],[x+4,y],'#6d767c');
        for(let k=4;k<hl;k+=5){BL(g,[x-4+rnd(4*k/hl),y-k],[x+4-rnd(3*k/hl),y-k],'#8b949a');}
        RC(g,x,y-h,1,h,'#dfe3e5');RC(g,x+1,y-h,1,h,'#8a9398');RC(g,x-1,y-h-3,4,3,'#59626a');RC(g,x-1,y-h-3,1,3,'#7b858b');
        RC(g,x,y-h-6,2,3,'#f0a030');RC(g,x,y-h-8,1,2,'#ffd35a');RC(g,x+1,y-h-4,1,1,'#e06a20');
        if(n){RC(n,x,y-h-6,2,3,'#ffb840');RC(n,x,y-h-8,1,2,'#fff0a0');RC(n,x-1,y-h-4,4,1,'rgba(255,170,60,.5)');}});
      // 滴濾池（碎石濾料＋旋轉布水臂）
      const trickle=(S,u,v,r,th,seed)=>S.o(u+v,(g)=>{const c=P(u,v,0),cx=rnd(c[0]),cy=rnd(c[1]),rx=RX(r),ry=rx>>1,h=7;
        cyl(g,cx,cy,rx,h,['#a8998a','#cdbfae','#c1b3a2','#aa9c8b','#928474'],null);
        for(let x=-rx+3;x<=rx-3;x+=4){const yb=hx(rx,ry,x);RC(g,cx+x,cy+yb-3,2,2,'#5e554b');}
        const ty=cy-h;ell(g,cx,ty,rx,ry,'#ddd1c0');ell(g,cx,ty,rx-2,ry-1,'#6c6a64');
        for(let i=0;i<rx*ry*.9;i++){const a=hsh(seed,i,1)*6.283,d=Math.sqrt(hsh(seed,i,2));RC(g,cx+rnd(Math.cos(a)*d*(rx-3)),ty+rnd(Math.sin(a)*d*(ry-1.5)),1,1,hsh(seed,i,3)<.5?'#8e8c86':'#55534e');}
        for(let k=0;k<4;k++){const a=th+k*Math.PI/2,ex=cx+rnd(Math.cos(a)*(rx-3)),ey=ty+rnd(Math.sin(a)*(ry-1.5));BL(g,[cx,ty-2],[ex,ey-1],'#d6dcdf');BL(g,[cx,ty-1],[ex,ey],'#5f686d');}
        RC(g,cx-1,ty-5,3,5,'#8d969b');RC(g,cx-1,ty-5,1,5,'#c4cbcf');RC(g,cx-1,ty-6,3,1,'#5f686d');});
      // 平頂建築（行政樓／鼓風機房／脫水機房）
      const flatB=(g,u0,v0,du,dv,h,wl,wr,roof)=>{boxZ(g,u0,v0,du,dv,0,h,SH(roof,16),wl,wr);flat(g,u0+.035,v0+.035,du-.07,dv-.07,roof,h);
        BL(g,P(u0+.035,v0+.035,h),P(u0+du-.035,v0+.035,h),SH(roof,-20));BL(g,P(u0+.035,v0+.035,h),P(u0+.035,v0+dv-.035,h),SH(roof,-14));BL(g,P(u0,v0+dv,h),P(u0+du,v0+dv,h),SH(wl,18));};
      const gableB=(g,u0,v0,du,dv,h,rh,ridge,wl,wr,rl,rd,ov=.03)=>{const u1=u0+du,v1=v0+dv;boxZ(g,u0,v0,du,dv,0,h,wl,wl,wr);
        if(ridge==='v'){const um=u0+du/2;fp(g,[P(u0-ov,v0-ov,h-1),P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),P(u0-ov,v1+ov,h-1)],rl);
          fp(g,[P(u0,v1,h),P(u1,v1,h),P(um,v1,h+rh)],wl);fp(g,[P(um,v0-ov,h+rh),P(u1+ov,v0-ov,h-1),P(u1+ov,v1+ov,h-1),P(um,v1+ov,h+rh)],rd);BL(g,P(um,v0-ov,h+rh),P(um,v1+ov,h+rh),SH(rl,26));}
        else{const vm=v0+dv/2;fp(g,[P(u0-ov,v0-ov,h-1),P(u1+ov,v0-ov,h-1),P(u1+ov,vm,h+rh),P(u0-ov,vm,h+rh)],rd);
          fp(g,[P(u1,v0,h),P(u1,v1,h),P(u1,vm,h+rh)],wr);fp(g,[P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),P(u1+ov,v1+ov,h-1),P(u0-ov,v1+ov,h-1)],rl);BL(g,P(u0-ov,vm,h+rh),P(u1+ov,vm,h+rh),SH(rl,26));}};
      const admin=(S,u0,v0,du,dv,fl,seed,opt={})=>S.o(u0+v0+(du+dv)*.5,(g,n)=>{const h=fl*7+3,wl=opt.wl||'#ece5d6',wr=opt.wr||'#c6bca9',gl=opt.glass||'#4d7896';
        flatB(g,u0,v0,du,dv,h,wl,wr,opt.roof||'#9ea4a6');
        for(let f=0;f<fl;f++){rowL(g,n,u0+.02,u0+du-.02,v0+dv,3+f*7,3,3,2,gl,seed+f,.6);rowR(g,n,u0+du,v0+.02,v0+dv-.02,3+f*7,3,3,3,gl,seed+f*5,.45);}
        faceL(g,v0+dv,u0,u0+du,h-2,h-1,opt.band||'#3f6f9a');
        const um=u0+du*.5;boxZ(g,um-.12,v0+dv,.24,.08,6,1,'#eef0f1','#f6f7f8','#b8bfc3');winL(g,um-.06,v0+dv,0,5,6,'#2f4c63');if(n)winL(n,um-.06,v0+dv,0,5,6,'#ffe6a8');
        boxZ(g,u0+du*.2,v0+dv*.25,.14,.12,h,3,'#c9ced1','#dde1e3','#a9b0b4');boxZ(g,u0+du*.62,v0+dv*.3,.1,.1,h,2,'#b9c0c4','#ced4d7','#9aa2a6');
        if(opt.solar){for(let k=0;k<3;k++)boxZ(g,u0+.08,v0+.08+k*.1,du*.5,.07,h+1,1,'#2f5878','#4a78a0','#244660');}});
      const blower=(S,u0,v0,du,dv,h,seed)=>S.o(u0+v0+(du+dv)*.5,(g,n)=>{flatB(g,u0,v0,du,dv,h,'#d8ddda','#a9b1ae','#8f9896');
        for(let uu=u0+.06;uu<u0+du-.1;uu+=.14)louvL(g,uu,v0+dv,3,4,2);louvR(g,u0+du,v0+dv-.06,3,4,2);
        winR(g,u0+du,v0+dv*.45,0,5,7,'#6b7479');
        for(let k=0;k<2;k++){const p=P(u0+du*(.3+k*.35),v0+dv*.45,h);cyl(g,p[0],p[1],2,2,['#7e878c','#aab2b6','#8d9599','#6f787c'],'#4d555a');}
        const lp=P(u0+du,v0+dv*.45-.05,8);RC(g,lp[0],lp[1],2,1,'#efe2b0');if(n)RC(n,lp[0],lp[1],2,1,'#ffe6a0');});
      const hall=(S,u0,v0,du,dv,h,rh,ridge,seed,opt={})=>S.o(u0+v0+(du+dv)*.5,(g,n)=>{const wl=opt.wl||'#d3d9dc',wr=opt.wr||'#a4acb1';
        gableB(g,u0,v0,du,dv,h,rh,ridge,wl,wr,opt.rl||'#8f9aa0',opt.rd||'#6c767c');
        for(let uu=u0+.04;uu<u0+du;uu+=.06)BL(g,P(uu,v0+dv,1),P(uu,v0+dv,h-1),SH(wl,-12));
        for(let vv=v0+.04;vv<v0+dv;vv+=.06)BL(g,P(u0+du,vv,1),P(u0+du,vv,h-1),SH(wr,-12));
        rowL(g,n,u0+.02,u0+du-.02,v0+dv,h-5,4,2,3,'#5a7f99',seed,.5);
        const dp=opt.door!=null?opt.door:.55;winL(g,u0+du*dp,v0+dv,0,9,9,'#7a8388');for(let z=1;z<9;z+=2)winL(g,u0+du*dp,v0+dv,z,9,1,'#646d72');
        winR(g,u0+du,v0+dv*.7,0,3,5,'#4f585d');const lp=P(u0+du*dp,v0+dv,11);RC(g,lp[0]+3,lp[1],3,1,'#efe2b0');if(n)RC(n,lp[0]+3,lp[1],3,1,'#ffe6a0');});
      // 污泥料倉（高架，下方可停車）
      const silo=(S,u,v,r,z,h)=>S.o(u+v+.05,(g)=>{const c=P(u,v,0),cx=rnd(c[0]),cy=rnd(c[1]),rx=RX(r),ry=rx>>1;
        for(const dx of[-rx+1,rx-1]){RC(g,cx+dx,cy-z,1,z+1,'#5d676d');}RC(g,cx-1,cy+ry-1-z,1,z+1,'#7a848a');
        for(let x=-rx;x<=rx;x++){const yb=hx(rx,ry,x),tip=rnd(6*(1-Math.abs(x)/(rx+.5)));g.fillStyle=x<-rx/3?'#c7ccce':x<rx/3?'#aab1b5':'#8d9599';g.fillRect(cx+x,cy-z,1,Math.max(yb,tip)+1);}
        cyl(g,cx,cy-z,rx,h,['#b7bec2','#e1e5e7','#d0d6d9','#b7bec2','#9aa2a6'],'#eef1f2','#c5cbce');arcF(g,cx,cy-z-4,rx,ry,'#a3abaf');
        RC(g,cx+2,cy-z-h-3,1,3,'#6d767b');});
      // 化學藥品槽（PAC）
      const chemTank=(S,u,v,r,h,col)=>S.o(u+v,(g)=>{const c=P(u,v,0);cyl(g,c[0],c[1],RX(r),h,[SH(col,-16),SH(col,22),SH(col,8),SH(col,-12),SH(col,-30)],SH(col,26),SH(col,-6));arcF(g,c[0],c[1]-3,RX(r),RX(r)>>1,SH(col,-36));});
      // 氧化溝（跑道形渠道＋中央導流牆＋轉刷曝氣機）
      const oxDitch=(S,uc,vc,Lu,Wv,seed)=>{const h=5,rr=Wv/2,uL=uc-Lu/2+rr,uR=uc+Lu/2-rr;
        const outline=(ins)=>{const pts=[],r=rr-ins;for(let k=0;k<=12;k++){const a=-Math.PI/2+Math.PI*k/12;pts.push([uR+r*Math.cos(a),vc+r*Math.sin(a)]);}
          for(let k=0;k<=12;k++){const a=Math.PI/2+Math.PI*k/12;pts.push([uL+r*Math.cos(a),vc+r*Math.sin(a)]);}return pts;};
        S.o(uc+vc,(g,n)=>{const o=outline(0),m=o.length;
          for(let i=0;i<m;i++){const a=o[i],b=o[(i+1)%m],nu=(b[1]-a[1]),nv=-(b[0]-a[0]);if(nu+nv<=1e-6)continue;const tt=(nv-nu)/Math.hypot(nu,nv);
            fp(g,[P(a[0],a[1],0),P(b[0],b[1],0),P(b[0],b[1],h),P(a[0],a[1],h)],tt>.35?CLt:tt>-.35?'#cdc9bf':CRt);}
          const top=o.map(q=>P(q[0],q[1],h));fp(g,top,CT);
          const inn=outline(.07).map(q=>P(q[0],q[1],h));fp(g,inn,'#8a867d');
          clipPoly(g,inn,()=>{fp(g,outline(.07).map(q=>P(q[0],q[1],h-2)),'#76704e');
            for(let i=0;i<rnd(Lu*Wv*26);i++){const uu=uL-rr+hsh(seed,i,1)*(Lu),vv=vc-rr+hsh(seed,i,2)*Wv,p=P(uu,vv,h-2),l=2+rnd(hsh(seed,i,4)*3);RC(g,p[0],p[1],l,1,hsh(seed,i,3)<.5?'#8e8765':'#665f43');}
            for(const [ru,side] of [[uL+.15,-1],[uR-.3,1],[uc,-1]]){const vv0=side<0?vc-rr+.08:vc+.06,vv1=side<0?vc-.06:vc+rr-.08;
              for(let k=0;k<46;k++){const q=hsh(seed,k,rnd(ru*10)),du=.01+q*q*.5,vv=vv0+hsh(seed,k+40,rnd(ru*10))*(vv1-vv0),uu=side<0?ru+.1+du:ru-.01-du,p=P(uu,vv,h-2);
                RC(g,p[0],p[1],q<.3?3:2,1,q<.35?'#f4f2e6':q<.7?'#dcd8c0':'#b3ad8e');}}});
          boxZ(g,uL,vc-.035,uR-uL,.07,h-2,2,CT,CLt,CRt);
          for(const [ru,side] of [[uL+.15,-1],[uR-.3,1],[uc,-1]]){const vv0=side<0?vc-rr+.02:vc,vv1=side<0?vc:vc+rr-.02;boxZ(g,ru,vv0,.09,vv1-vv0,h,2,'#dfe3e5','#eef1f2','#aeb6ba');
            const mo=side<0?vv0-.08:vv1;boxZ(g,ru-.01,mo,.11,.08,h-1,4,'#3f6f96','#5a8ab2','#335d80');}
        });
        S.t(uc+vc+rr+.01,(g)=>{const o=outline(0);for(let i=0;i<o.length-1;i++){const a=o[i],b=o[i+1];if((b[1]-a[1])-(b[0]-a[0])>0)rail(g,P(a[0],a[1],h),P(b[0],b[1],h),3,'#a3acb1',8);}});
      };
      // 覆蓋式池體（拱形除臭蓋）
      const covered=(S,u0,v0,du,dv,lanes,seed)=>S.o(u0+v0+(du+dv)*.5,(g)=>{const h=3,lw=dv/lanes;boxZ(g,u0,v0,du,dv,0,h,CT,CLt,CRt);
        for(let Ln=0;Ln<lanes;Ln++){const a=v0+Ln*lw+.02,b=a+lw-.04,vh=5,N=8;
          for(let k=0;k<N;k++){const s0=a+(b-a)*k/N,s1=a+(b-a)*(k+1)/N,z0=h+vh*Math.sqrt(Math.max(0,1-Math.pow((s0-(a+b)/2)/((b-a)/2),2))),z1=h+vh*Math.sqrt(Math.max(0,1-Math.pow((s1-(a+b)/2)/((b-a)/2),2)));
            const col=k<N/2-1?'#aeb8bd':k<N/2?'#c2cbcf':k<N/2+2?'#d6dee1':'#c7d0d4';fp(g,[P(u0+.03,s0,z0),P(u0+du-.03,s0,z0),P(u0+du-.03,s1,z1),P(u0+.03,s1,z1)],col);}
          for(let uu=u0+.1;uu<u0+du-.05;uu+=.16){for(let k=0;k<N;k++){const s=a+(b-a)*(k+.5)/N,z=h+vh*Math.sqrt(Math.max(0,1-Math.pow((s-(a+b)/2)/((b-a)/2),2)));const p=P(uu,s,z);RC(g,p[0],p[1],1,1,'#8e989d');}}
          const e=[];for(let k=0;k<=N;k++){const s=a+(b-a)*k/N,z=h+vh*Math.sqrt(Math.max(0,1-Math.pow((s-(a+b)/2)/((b-a)/2),2)));e.push(P(u0+du-.03,s,z));}e.push(P(u0+du-.03,b,h));e.push(P(u0+du-.03,a,h));fp(g,e,'#8f999e');}
      });
      // 污泥乾燥床
      const dryBeds=(g,u0,v0,nu,nv,cw,cd,seed)=>{const C=['#5e4e3b','#7a6549','#9a8465','#b5a283','#6d5a42'];
        for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const u=u0+i*(cw+.05),v=v0+j*(cd+.05),col=C[rnd(hsh(seed,i,j)*4.99)%5];boxZ(g,u-.025,v-.025,cw+.05,cd+.05,0,2,'#c9c5bb','#d6d2c8','#aaa69c');flat(g,u,v,cw,cd,col,2);
          for(let k=0;k<rnd(cw*cd*90);k++){const p=P(u+hsh(seed+i,k,j)*cw,v+hsh(seed+j,k,i+3)*cd,2);RC(g,p[0],p[1],1,1,SH(col,hsh(k,i,j)<.5?-14:16));}}};

      return [
        // v0 傳統活性污泥法：三廊道曝氣池＋雙圓形二沉池＋雙圓柱消化槽＋燃燒塔＋脫水機房＋行政樓
        (g,ng,S)=>{
          L.ground(g,15600,[['c',.18,.18,2.26,1.34],['c',2.82,.14,1.04,1.46],['c',2.82,1.66,1.04,1.2],['A',.1,2.94,3.8,.26],['a',.42,3.2,.5,.8],['a',2.52,.1,.24,2.84],['a',2.26,3.34,.94,.5],['k',3.25,3.3,.6,.55]]);
          L.stalls(g,2.3,3.36,.86,5,.2);
          L.shadow(g,[['b',.25,.25,2.1,1.2,5],['c',.8,2.25,.46,5],['c',1.9,2.25,.46,5],['c',3.3,.42,.26,30],['c',2.88,.84,.26,30],['b',2.9,1.72,.85,.5,15],['b',2.9,2.36,.42,.44,9],['b',1.15,3.3,.9,.48,17],['b',3.25,.95,.5,.5,11]]);
          tank(S,.25,.25,2.1,1.2,3,'aer',{seed:31});
          clarifier(S,.8,2.25,.46,{th:-2.4,seed:5});clarifier(S,1.9,2.25,.46,{th:-1.2,seed:9});
          S.t(1.35+2.25,(s)=>{pipe(s,P(1.26,2.25,1),P(1.44,2.25,1));const p=P(1.35,2.25,0);RC(s,p[0]-2,p[1]-4,5,4,'#cfcbc1');RC(s,p[0]-2,p[1]-4,5,1,'#e8e4da');});
          digester(S,3.3,.42,.26,30,{a0:-1.2});digester(S,2.88,.84,.26,30,{a0:-.9});
          flare(S,3.78,.22,26);
          admin(S,3.25,.95,.5,.5,1,77,{wl:'#d8cfbf',wr:'#b3a996',band:'#8b5a3a'});
          S.t(3.8,(s)=>{const p=P(3.62,1.2,11);RC(s,p[0],p[1]-12,2,12,'#8c7b6c');RC(s,p[0]+2,p[1]-12,1,12,'#5f5247');RC(s,p[0],p[1]-13,3,1,'#3d3530');});
          hall(S,2.9,1.72,.85,.5,15,6,'u',41);
          L.truck(S,3.35,2.4,false);silo(S,3.52,2.56,.13,11,10);
          blower(S,2.9,2.36,.42,.44,9,51);
          admin(S,1.15,3.3,.9,.48,2,61);
          L.car(S,2.36,3.44,false,'#b8433a');L.car(S,2.72,3.44,false,'#e8ecee');L.car(S,2.9,3.44,false,'#3d5f8a');
          for(const [u,v,s,k] of [[.2,3.35,1,0],[.22,3.75,.9,2],[3.72,3.1,1,0],[3.7,3.55,.9,1],[3.45,3.78,.8,2],[1.02,3.62,.8,1],[.12,1.7,.9,0],[.14,2.3,.85,2]])L.tree(S,u,v,0,s,k);
          L.lamp(S,.98,2.9);L.lamp(S,2.46,2.9);L.lamp(S,2.46,.14);L.lamp(S,3.84,2.9);
          L.hydrant(S,2.42,1.6);L.sign(S,.3,3.86);
          return{gate:[.08,.26]};
        },
        // v1 大型現代廠：初沉池（行車刮泥）＋四廊道曝氣＋蛋形消化槽群＋雙膜氣囊＋汽電共生機房
        (g,ng,S)=>{
          L.ground(g,15610,[['c',.18,.18,2.02,2.3],['A',.1,2.55,3.8,.24],['a',2.26,.1,.24,2.45],['c',2.56,.14,1.3,1.2],['c',2.56,1.4,1.3,1.1],['a',2.3,2.79,.52,1.2],['a',2.92,3.42,.9,.42],['c',.2,2.85,1.95,.95]]);
          L.stalls(g,2.96,3.44,.82,5,.18);
          L.shadow(g,[['b',.25,.25,1.9,.6,4],['b',.25,1.0,1.9,1.35,5],['c',3.45,.42,.3,50],['c',2.85,1.02,.3,50],['c',3.42,1.95,.3,18],['b',2.6,1.5,.6,.45,13],['b',2.95,2.9,.85,.45,17],['c',.75,3.3,.4,5],['c',1.65,3.3,.4,5]]);
          tank(S,.25,.25,1.9,.6,2,'prim',{h:4,seed:21,bridge:.55});
          tank(S,.25,1.0,1.9,1.35,4,'aer',{seed:23,anox:.22});
          egg(S,3.45,.42,.3,50);egg(S,2.85,1.02,.3,50);
          S.o(3.15+.72+.01,(s,n)=>{L.boxZ(s,3.12,.66,.12,.12,0,54,'#6f8796','#9fb4c1','#5b707d');for(let z=6;z<52;z+=6){L.winL(s,3.12,.78,z,3,3,'#cfe0ea');L.winR(s,3.24,.78,z,3,3,'#9fb9c9');}const t=P(3.18,.72,56);L.RC(s,t[0],t[1]-1,1,1,'#d04535');if(n)L.RC(n,t[0],t[1]-1,1,1,'#ff5a4a');});
          S.t(3.9,(s)=>{const a=P(3.18,.72,49),b=P(3.45,.42,47),c=P(2.85,1.02,47);BL(s,a,b,'#e6eaec');BL(s,[a[0],a[1]+1],[b[0],b[1]+1],'#6d777c');BL(s,[a[0],a[1]-3],[b[0],b[1]-3],'#9aa3a8');BL(s,a,c,'#e6eaec');BL(s,[a[0],a[1]+1],[c[0],c[1]+1],'#6d777c');BL(s,[a[0],a[1]-3],[c[0],c[1]-3],'#9aa3a8');});
          gasholder(S,3.42,1.95,.3);flare(S,3.82,1.45,24);
          hall(S,2.6,1.5,.6,.45,13,5,'v',91,{wl:'#e0d6c4',wr:'#b8ad98',rl:'#a45a44',rd:'#7d4535',door:.2});
          S.t(2.6+1.5+.6,(s)=>{for(const k of[0,1]){const p=P(2.72+k*.14,1.58,18);L.RC(s,p[0],p[1]-12,2,12,'#9aa3a8');L.RC(s,p[0]+1,p[1]-12,1,12,'#6d767b');L.RC(s,p[0],p[1]-13,2,1,'#3f474c');}});
          clarifier(S,.75,3.3,.4,{th:-2.0,seed:13});clarifier(S,1.65,3.3,.4,{th:-.9,seed:17});
          admin(S,2.95,2.9,.85,.45,2,63,{wl:'#e9ecee',wr:'#bcc3c8',glass:'#3f6f91',band:'#2f8f6f',solar:true});
          L.car(S,3.02,3.5,false,'#e8ecee');L.car(S,3.4,3.5,false,'#4d6f3a');
          for(const [u,v,s,k] of [[2.18,3.1,.9,0],[2.18,3.62,1,2],[3.8,2.62,.8,1],[.12,2.75,.8,0],[3.82,3.9,.8,2]])L.tree(S,u,v,0,s,k);
          L.lamp(S,2.22,2.52);L.lamp(S,.9,2.52);L.lamp(S,3.86,2.52);L.hydrant(S,2.54,1.3);L.sign(S,2.2,3.88);
          return{gate:[.57,.72]};
        },
        // v2 都會型緊湊廠：MBR 膜處理大廳＋加蓋除臭初沉池＋生物濾床＋單座鋼構消化槽＋氣囊＋環境教育館＋景觀綠地
        (g,ng,S)=>{
          L.ground(g,15620,[['c',.18,.18,2.2,1.9],['A',.1,2.08,3.8,.24],['a',2.46,.1,.24,1.98],['c',2.76,.14,1.1,1.9],['p',.3,2.4,3.3,.14],['p',1.9,2.54,.14,1.3],['a',.42,2.32,.5,1.68]]);
          L.shadow(g,[['b',.3,.3,2.05,.75,18],['b',.3,1.2,2.05,.7,8],['c',3.3,.52,.3,34],['c',3.3,1.5,.25,16],['b',2.78,1.3,.5,.6,5],['b',1.05,2.62,.8,.55,14],['b',2.15,2.62,1.2,.34,3]]);
          S.o(.3+.3+1.4,(s,n)=>{flatB(s,.3,.3,2.05,.75,18,'#e3e7e8','#b3bbbf','#8f989d');
            for(let k=0;k<5;k++){const uu=.42+k*.38;L.boxZ(s,uu,.42,.22,.5,18,2,'#bcd3e0','#d7e6ee','#8fb0c4');}
            rowL(s,n,.32,2.33,1.05,11,5,4,3,'#5d8aa8',101,.5);rowL(s,n,.32,2.33,1.05,3,5,4,3,'#5d8aa8',103,.35);rowR(s,n,2.35,.32,1.03,9,4,6,4,'#5d8aa8',105,.4);
            faceL(s,1.05,.3,2.35,15,16,'#2f8f6f');for(let k=0;k<3;k++){const p=P(.5+k*.7,.75,18);cyl(s,p[0],p[1],2,3,['#8e979c','#c9d0d3','#aab2b6','#8d9599'],'#5f686d');}});
          covered(S,.3,1.2,2.05,.7,3,71);
          S.o(2.78+1.3+.55,(s)=>{for(let k=0;k<2;k++){const u0=2.78,v0=1.3+k*.32;L.boxZ(s,u0,v0,.5,.28,0,4,'#8a6a4a','#c2b8a8','#9a9080');L.flat(s,u0+.03,v0+.03,.44,.22,'#7a5c3e',4);
              for(let i=0;i<30;i++){const p=P(u0+.03+hsh(7,i,k)*.44,v0+.03+hsh(9,i,k)*.22,4);L.RC(s,p[0],p[1],1,1,hsh(i,k,2)<.5?'#5e4630':'#9a7a52');}}});
          S.t(2.78+1.3+.7,(s)=>{const a=P(2.52,1.55,12),b=P(2.8,1.55,12);pipe(s,a,b,['#d0d6d9','#9aa3a8','#6d767b']);const c=P(3.05,1.95,0);L.RC(s,c[0],c[1]-20,3,20,'#b9c1c5');L.RC(s,c[0]+2,c[1]-20,1,20,'#7e878c');L.RC(s,c[0]-1,c[1]-21,5,1,'#5f686d');});
          digester(S,3.3,.52,.3,34,{tones:['#6f8a78','#9fbaa8','#8eaa97','#7a9583','#62796a'],roof:['#c9ced1','#dfe3e5','#c3c9cc','#a7aeb2','#8d9599'],a0:-1.1});
          gasholder(S,3.3,1.5,.25,{tones:['#f2f3ec','#e0e4d8','#c9cfc1','#aeb5a7','#939a8c']});flare(S,3.82,1.12,22);
          L.boxZ;S.o(2.15+2.62+.6,(s)=>{L.boxZ(s,2.15,2.62,1.2,.3,0,3,CT,CLt,CRt);L.flat(s,2.19,2.66,1.12,.22,'#3e86ad',3);for(let k=0;k<6;k++){const p=P(2.3+k*.18,2.66,4);L.BL(s,p,P(2.3+k*.18,2.88,4),'#d7dde0');}
            for(let k=0;k<4;k++){L.boxZ(s,2.2+k*.26,2.95,.26,.1,0,2-k*.4<0?0:3-k,'#cfe3ec','#e3eff4','#a9c3cf');}});
          admin(S,1.05,2.62,.8,.55,2,111,{wl:'#d9c2a3',wr:'#ae977a',glass:'#4a7a8c',band:'#5c7f3f',roof:'#6f9150'});
          for(const [u,v,s,k] of [[.2,2.5,.9,0],[.2,3.0,1,1],[.25,3.55,.9,0],[1.2,3.5,1,2],[1.6,3.75,.8,0],[2.3,3.4,1.1,1],[2.9,3.7,.9,2],[3.4,3.3,1,0],[3.75,3.75,.8,1],[3.7,2.75,.9,2]])L.tree(S,u,v,0,s,k);
          L.bush(S,2.2,3.2);L.bush(S,3.1,3.1,0,2);L.bench(S,1.7,2.45);L.lamp(S,1.85,2.5);L.lamp(S,2.4,2.02);L.lamp(S,.98,2.02);L.sign(S,.3,3.86,'#2f8f6f');
          return{gate:[.08,.26]};
        },
        // v3 早期滴濾池廠：三座滴濾池＋初沉池＋腐植質沉澱池＋紅磚機房與煙囪＋浮蓋消化槽＋污泥乾燥床
        (g,ng,S)=>{
          L.ground(g,15630,[['k',.16,.16,2.1,2.1],['A',.1,2.3,3.8,.22],['a',2.28,.1,.22,2.2],['c',2.56,.16,1.28,.7],['k',.18,2.58,1.9,.78],['a',.42,2.52,.5,1.5]]);
          L.shadow(g,[['c',.66,.66,.46,7],['c',1.66,.66,.46,7],['c',.66,1.66,.46,7],['b',2.6,.22,1.2,.58,4],['c',1.72,1.72,.32,5],['b',2.9,1.12,.8,.5,16],['c',3.5,1.9,.05,40],['c',3.12,2.62,.32,12],['b',2.2,3.2,.6,.4,10]]);
          trickle(S,.66,.66,.46,.3,1);trickle(S,1.66,.66,.46,.9,2);trickle(S,.66,1.66,.46,1.4,3);
          tank(S,2.6,.22,1.2,.58,2,'prim',{h:4,seed:33,bridge:.3});
          clarifier(S,1.72,1.72,.32,{th:-1.8,seed:19,h:4});
          S.o(2.9+1.12+.65,(s,n)=>{gableB(s,2.9,1.12,.8,.5,14,7,'u','#b0553f','#8a3f2f','#6f6a66','#55504c');
            for(let z=2;z<14;z+=3)L.BL(s,P(2.9,1.62,z),P(3.7,1.62,z),'#9b4a37');for(let z=2;z<14;z+=3)L.BL(s,P(3.7,1.12,z),P(3.7,1.62,z),'#733527');
            for(let k=0;k<4;k++){const uu=2.98+k*.18;L.winL(s,uu,1.62,4,4,7,'#e8e0cc');L.winL(s,uu+.01,1.62,5,3,5,'#4f6d80');if(n&&k%2===0)L.winL(n,uu+.01,1.62,5,3,5,'#ffd890');}
            L.winR(s,3.7,1.5,0,6,9,'#5b4636');});
          S.o(3.5+1.9+.02,(s)=>{const p=P(3.5,1.9,0);L.RC(s,p[0]-3,p[1]-40,6,40,'#a24c38');L.RC(s,p[0]-3,p[1]-40,2,40,'#c0634c');L.RC(s,p[0]+2,p[1]-40,1,40,'#7a3526');L.RC(s,p[0]-4,p[1]-42,8,2,'#5a4a40');for(let z=6;z<40;z+=7)L.RC(s,p[0]-3,p[1]-z,6,1,'#8a3f2f');});
          S.o(3.12+2.62,(s)=>{const c=P(3.12,2.62,0),rx=RX(.32);cyl(s,c[0],c[1],rx,12,['#8f8577','#b5ab9c','#a89e8f','#948a7b','#7c7264'],null);L.arcF(s,c[0],c[1]-5,rx,rx>>1,'#7c7264');
            L.ell(s,c[0],c[1]-12,rx,rx>>1,'#d5cfc3');L.ell(s,c[0],c[1]-11,rx-2,(rx>>1)-1,'#4f5a5f');L.ell(s,c[0],c[1]-11,rx-3,(rx>>1)-2,'#6d7a80');L.ring(s,c[0],c[1]-11,rx-6,(rx>>1)-3,'#58656b');
            L.RC(s,c[0]-1,c[1]-15,3,4,'#8d969b');L.RC(s,c[0]-1,c[1]-15,1,4,'#bcc3c7');});
          dryBeds(g,.22,2.62,3,2,.32,.3,41);
          S.o(2.2+3.2+.5,(s,n)=>{gableB(s,2.2,3.2,.6,.4,9,5,'v','#e7dcc4','#bfb29a','#8a5a44','#6c4535');rowL(s,n,2.22,2.78,3.6,3,3,3,4,'#4f6d80',121,.6,'#f4efe2');rowR(s,n,2.8,3.22,3.58,3,3,3,4,'#4f6d80',123,.5);});
          for(const [u,v,s,k] of [[.2,3.55,1,2],[3.8,3.0,1.1,0],[3.55,3.5,1.2,1],[3.0,3.8,1,0],[1.35,1.3,1,2],[1.25,1.9,.9,0],[1.9,3.62,1,1],[3.8,2.2,.9,2]])L.tree(S,u,v,0,s,k);
          L.conifer(S,2.1,.2,0,1);L.conifer(S,.14,2.2,0,.9);L.lamp(S,.98,2.28);L.lamp(S,2.26,2.28);L.sign(S,.3,3.86,'#8a3f2f');
          return{gate:[.08,.26]};
        },
        // v4 延長曝氣氧化溝廠：跑道形氧化溝＋四座圓形二沉池＋迴流污泥泵站＋濃縮池＋脫水機房料倉＋藥槽＋太陽能車棚
        (g,ng,S)=>{
          L.ground(g,15640,[['c',.2,.2,2.4,1.36],['A',.1,1.62,3.8,.24],['a',2.66,.1,.24,1.52],['c',.22,1.9,1.9,1.9],['c',2.96,.16,.9,1.4],['a',2.2,1.86,.5,2.14],['a',2.76,2.6,1.1,1.1]]);
          L.stalls(g,2.8,2.62,1.02,6,.24);
          L.shadow(g,[['b',.3,.3,2.2,1.16,5],['c',.66,2.3,.34,5],['c',1.5,2.3,.34,5],['c',.66,3.2,.34,5],['c',1.5,3.2,.34,5],['c',2.98,1.98,.26,7],['b',3.0,.2,.82,.52,15],['b',2.9,3.02,.9,.5,14]]);
          oxDitch(S,1.4,.88,2.2,1.16,55);
          for(const [u,v,th,sd] of [[.66,2.3,-2.3,61],[1.5,2.3,-1.4,63],[.66,3.2,-.4,65],[1.5,3.2,.7,67]])clarifier(S,u,v,.34,{th,seed:sd,h:4});
          S.o(1.08+2.75+.1,(s,n)=>{flatB(s,.98,2.66,.2,.2,8,'#dfe3e1','#b0b7b4','#98a09d');L.winR(s,1.18,2.82,0,3,5,'#5f686d');});
          S.t(1.08+2.76,(s)=>{pipe(s,P(1.0,2.76,1),P(.66,2.76,1),['#c3d0d6','#8c9ba3','#5e6c73']);pipe(s,P(1.18,2.76,1),P(1.5,2.76,1),['#c3d0d6','#8c9ba3','#5e6c73']);});
          S.o(2.98+1.98,(s)=>{const c=P(2.98,1.98,0),rx=RX(.26),ry=rx>>1;cyl(s,c[0],c[1],rx,7,['#c2beb4','#e2ded4','#d6d2c8','#c2beb4','#aaa69c'],null);
            L.revolve(s,c[0],c[1]-7,6,z=>rx*Math.sqrt(Math.max(0,1-Math.pow(z/7,2))),['#e9eff1','#d3dde1','#b9c6cc','#9eadb4','#84939a']);L.RC(s,c[0]-1,c[1]-15,3,2,'#5f686d');});
          hall(S,3.0,.2,.82,.52,15,6,'u',131,{wl:'#e4e8ea',wr:'#b4bcc0',rl:'#4f7f9f',rd:'#3a6581',door:.15});
          L.truck(S,3.3,.95,false,'#3f8f5f');silo(S,3.5,1.1,.13,12,11);
          chemTank(S,3.72,.9,.08,12,'#d7d9cf');chemTank(S,3.72,1.22,.08,12,'#d7d9cf');
          S.t(3.72+1.06+.2,(s)=>{L.boxZ(s,3.6,.78,.25,.58,0,1,'#b9b5ab','#c9c5bb','#a29e94');});
          admin(S,2.9,3.02,.9,.5,2,141,{wl:'#eef0ee',wr:'#c1c7c4',glass:'#3c6d8e',band:'#3a7fb8'});
          S.o(2.76+2.6+1.2,(s)=>{for(let k=0;k<2;k++){const u0=2.8+k*.52;for(const q of[[u0+.02,2.66],[u0+.44,2.66],[u0+.02,2.82],[u0+.44,2.82]]){const p=P(q[0],q[1],0);L.RC(s,p[0],p[1]-9,1,9,'#6d767b');}
            L.boxZ(s,u0,2.6,.5,.3,9,1,'#2f5878','#4a78a0','#244660');for(let t=u0+.06;t<u0+.5;t+=.08)L.BL(s,P(t,2.6,10),P(t,2.9,10),'#6a96b8');}});
          L.car(S,2.84,2.68,false,'#c9cdd0');L.car(S,3.2,2.68,false,'#a33a32');
          for(const [u,v,s,k] of [[2.2,.16,.9,2],[.16,3.75,1,0],[2.1,3.8,.9,1],[3.84,2.3,.9,0],[2.66,3.84,.8,2]])L.tree(S,u,v,0,s,k);
          L.lamp(S,2.62,1.6);L.lamp(S,.92,1.6);L.lamp(S,3.86,1.6);L.lamp(S,2.14,2.9);L.hydrant(S,2.62,.6);L.sign(S,2.3,3.86,'#3a7fb8');
          return{gate:[.54,.66]};
        },
      ];
    };
    const K156L=(L)=>K156(L);
    const lay=[0,1,2,3,4].map(i=>(g,ng,S,L,K)=>K156L(L)[i](g,ng,S));
    build(156,lay,5);
  }catch(e){console.error('infra575 k156',e);errs.push('k156:'+(e&&e.stack||e));}

  // ================= 地形共用（k159／k160） =================
  const TER=L=>{
    const {P,hsh,RC,BL,rail}=L;
    const clamp=(x,a,b)=>x<a?a:x>b?b:x;
    const rrect=(u,v,u0,v0,u1,v1,r)=>{const cu=(u0+u1)/2,cv=(v0+v1)/2,hu=(u1-u0)/2-r,hv=(v1-v0)/2-r,qx=Math.abs(u-cu)-hu,qy=Math.abs(v-cv)-hv;
      return -(Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r);};          // 內部為正（距邊 u 單位）
    const ellD=(u,v,cu,cv,ru,rv)=>(1-Math.hypot((u-cu)/ru,(v-cv)/rv))*Math.min(ru,rv);            // 近似距離，內部為正
    const dseg=(u,v,a,b)=>{const px=u-a[0],py=v-a[1],bx=b[0]-a[0],by=b[1]-a[1],t=clamp((px*bx+py*by)/(bx*bx+by*by),0,1);return[Math.hypot(px-bx*t,py-by*t),(px*bx+py*by)/(bx*bx+by*by)];};
    const dpoly=(u,v,pts)=>{let best=1e9;for(let i=0;i<pts.length-1;i++){const d=dseg(u,v,pts[i],pts[i+1])[0];if(d<best)best=d;}return best;};
    const prof=(d,segs)=>{if(d<=segs[0][0])return segs[0][1];for(let i=0;i+1<segs.length;i++){const a=segs[i],b=segs[i+1];if(d<=b[0])return a[1]+(b[1]-a[1])*(d-a[0])/(b[0]-a[0]);}return segs[segs.length-1][1];};
    // 光：L=(-.5,.75,.45)；rel＞0 較亮（面向 +v）、rel＜0 較暗（面向 +u）；s＝坡度（≥1.6 視為擋土牆）
    const LU=(gu,gv)=>{const su=gu/39.2,sv=gv/39.2,nn=Math.sqrt(su*su+sv*sv+1);return{rel:(.5*su-.75*sv+.45)/nn/1.007-.447,s:Math.sqrt(su*su+sv*sv)};};
    const tone=(pal,gu,gv)=>{const{rel}=LU(gu,gv);return pal[rel>.2?0:rel>.07?1:rel>-.07?2:rel>-.2?3:4];};
    const GT=['#a2cb73','#8bb663','#78a255','#668f49','#56803f'];      // 草坡
    const CT5=['#eeebe3','#dcd8ce','#c9c5bb','#aba79d','#908c83'];     // 混凝土
    const AT5=['#a09d95','#8d8a83','#7b7872','#6a6762','#5a5752'];     // 瀝青
    const GB5=['#b9b29f','#a8a18e','#999281','#857e6e','#716b5d'];     // 蛇籠石
    const WT={base:'#4f8d96',lite:'#86bfc2',deep:'#437f89',shal:'#6aa3a3'};
    const grassT=(i,j,s)=>{const t=hsh(s,i,j*64+1);return t<.05?'#6a9449':t>.965?'#8ab463':'#78a255';};
    const paver=(i,j)=>((i>>1)+(j>>1))%2?'#cbbda3':'#d6c9b0';
    const gravel=(i,j,s)=>{const t=hsh(s,i,j*64+7);return t<.25?'#aaa493':t>.8?'#c3bdab':'#b7b19f';};
    const riprap=(i,j,s)=>{const t=hsh(s,i,j*64+9);return t<.3?'#8a867c':t<.6?'#a9a59a':t<.85?'#bebaaf':'#6f6b63';};
    const water=(i,j,s,W=WT)=>{const t=hsh(s,i,j*64+3);return t<.045?W.lite:t>.95?W.deep:W.base;};
    const gabion=(i,j,gu,gv,s)=>{const b=tone(GB5,gu,gv);return (i%3===0||j%3===0)?SH(b,-22):(hsh(s,i,j*64+11)<.3?SH(b,14):b);};
    const turf=(u,v)=>Math.floor((u+v)*5)%2?'#6fa04f':'#79aa57';
    // 蘆葦叢（細線層）：幾根直立葉片＋穗
    const reeds=(S,u,v,z,seed,n=5,kind=0)=>S.t(u+v+.012,(g)=>{const p=P(u,v,z),x=rnd(p[0]),y=rnd(p[1]),C=kind?['#7da646','#5f8a37','#a8c46a','#8a6a3a']:['#8fae4e','#6a8c3a','#b8c978','#7a5a34'];
      for(let k=0;k<n;k++){const dx=rnd((hsh(seed,k,1)-.5)*6),dy=rnd((hsh(seed,k,2)-.5)*2),hh=3+rnd(hsh(seed,k,3)*3);RC(g,x+dx,y+dy-hh,1,hh,C[k%2]);if(hsh(seed,k,4)<.35)RC(g,x+dx,y+dy-hh-2,1,2,C[3]);else RC(g,x+dx,y+dy-hh,1,1,C[2]);}});
    const rrPts=(u0,v0,u1,v1,r,off)=>{const pts=[],cs=[[u1-r,v0+r,-Math.PI/2],[u1-r,v1-r,0],[u0+r,v1-r,Math.PI/2],[u0+r,v0+r,Math.PI]];
      for(const[cu,cv,a0]of cs)for(let k=0;k<=4;k++){const a=a0+Math.PI/2*k/4;pts.push([cu+(r+off)*Math.cos(a),cv+(r+off)*Math.sin(a)]);}pts.push(pts[0]);return pts;};
    const railPath=(S,pts,z,skip,col='#b3bcc1')=>{for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],mu=(a[0]+b[0])/2,mv=(a[1]+b[1])/2;if(skip&&skip(mu,mv))continue;
      S.t(mu+mv+.06,(g)=>rail(g,P(a[0],a[1],z),P(b[0],b[1],z),3,col,7));}};
    const edges=S=>S.t(99,(g)=>{A.diaEdge(g,6,'#5d8540',AX,K0.TOPY,32*SZ);A.diaEdge(g,9,'#90b86c',AX,K0.TOPY,32*SZ);});
    return{clamp,rrect,ellD,dseg,dpoly,prof,LU,tone,GT,CT5,AT5,GB5,WT,grassT,paver,gravel,riprap,water,gabion,turf,reeds,rrPts,railPath,edges};
  };
  const K0=A.iso575(W,H,AX,AY,SZ);

  // ================= k159 都市滯洪池 =================
  try{
    const K159=L=>{
      const T=TER(L);
      const {P,hsh,RC,BL,flat,boxZ,faceL,faceR,winL,winR,pg,RX,ell,ring,cyl,rail,terrain,lamp,tree,bush,bench,sign,conifer}=L;
      const {clamp,rrect,ellD,dseg,dpoly,prof,LU,tone,GT,CT5,AT5,GB5,WT,grassT,paver,gravel,riprap,water,gabion,turf,reeds,rrPts,railPath,edges}=T;
      // 涼亭（四坡頂＋柱）
      const pavilion=(S,u0,v0,du,dv,col='#8a4a3a')=>S.o(u0+v0+du+dv,(g,n)=>{const h=9,u1=u0+du,v1=v0+dv;flat(g,u0,v0,du,dv,'#bdb3a0',1);
        for(const[q,w]of[[u0+.02,v1-.02],[u1-.02,v1-.02],[u1-.02,v0+.02]]){const p=P(q,w,1);RC(g,p[0],p[1]-h,1,h,'#6e5238');}
        const ap=P(u0+du/2,v0+dv/2,h+6),a=P(u0-.04,v0-.04,h),b=P(u1+.04,v0-.04,h),c=P(u1+.04,v1+.04,h),d=P(u0-.04,v1+.04,h);
        L.fp(g,[a,b,ap],SH(col,-30));L.fp(g,[a,d,ap],SH(col,6));L.fp(g,[d,c,ap],SH(col,22));L.fp(g,[b,c,ap],SH(col,-18));BL(g,c,ap,SH(col,40));
        const bp=P(u0+du*.5,v0+dv*.5,1);RC(g,bp[0]-3,bp[1]-3,6,2,'#9b7653');const lp=P(u0+du/2,v0+dv/2,h);if(n)RC(n,lp[0],lp[1]-1,2,1,'#ffe6a0');});
      // 閘門啟閉機
      const hoist=(S,u,v,z,c='#e0a83a')=>S.o(u+v+.05,(g)=>{boxZ(g,u-.05,v-.04,.1,.08,z,5,SH(c,24),c,SH(c,-44));const p=P(u,v,z+5);RC(g,p[0],p[1]-6,1,6,'#59636a');RC(g,p[0]-2,p[1]-6,5,1,'#8b959a');const m=P(u+.05,v,z+2);RC(g,m[0]-1,m[1]-3,3,3,'#4f6f8f');});
      // 水尺（白底紅刻度）
      const gaugeR=(g,u,v,z0,h)=>{const p=P(u,v,z0);RC(g,p[0],p[1]-h,2,h,'#f2f2ee');for(let z=1;z<h;z+=3)RC(g,p[0],p[1]-z-1,1,1,'#c0392b');RC(g,p[0]+2,p[1]-h,1,h,'#9aa3a8');};
      const flood=(S,u,v,h=28)=>S.t(u+v+.05,(g,n)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x,y-h,2,h,'#7e878c');RC(g,x+1,y-h,1,h,'#5a6368');RC(g,x-3,y-h-4,8,4,'#4d565b');RC(g,x-3,y-h-2,8,2,'#f4f0da');
        if(n){RC(n,x-3,y-h-2,8,2,'#fff4c8');RC(n,x-4,y-h,10,1,'rgba(255,240,190,.5)');}});
      const shed=(S,u0,v0,du,dv,h,wl,wr,roof,seed)=>S.o(u0+v0+(du+dv)*.5,(g,n)=>{boxZ(g,u0,v0,du,dv,0,h,roof,wl,wr);L.flat(g,u0+.03,v0+.03,du-.06,dv-.06,SH(roof,-14),h);
        winL(g,u0+du*.2,v0+dv,0,4,7,'#5b4a3c');L.rowR(g,n,u0+du,v0+.02,v0+dv-.02,4,3,2,3,'#5d86a2',seed,.6);const lp=P(u0+du*.2,v0+dv,9);RC(g,lp[0]+1,lp[1],3,1,'#efe2b0');if(n)RC(n,lp[0]+1,lp[1],3,1,'#ffe6a0');});
      const ducks=(S,list,z)=>S.t(9,(g)=>{for(const[u,v]of list){const p=P(u,v,z);RC(g,p[0],p[1]-1,3,1,'#f4f4ee');RC(g,p[0]+2,p[1]-2,1,1,'#f4f4ee');RC(g,p[0]+3,p[1]-2,1,1,'#e0a030');RC(g,p[0],p[1],3,1,'#3f7f89');}});

      return [
        // v0 階梯草坡滯洪池：兩層護坡＋維修步道、蜿蜒低水路與出口積水、雙孔進流箱涵、出流工（孔口＋攔污柵＋水尺＋啟閉機）、階梯溢流道、斜向維修坡道、環池步道公園
        (g,ng,S)=>{
          const sd=(u,v)=>rrect(u,v,.45,.45,3.55,3.35,.5),PR=[[0,0],[.3,-8],[.45,-8],[.75,-18]];
          const chan=[[2.45,1.22],[2.32,1.7],[1.9,1.96],[1.52,2.2],[1.22,2.47]];
          const inT=(u,v)=>u>=2.2&&u<=2.7&&v>=.8&&v<=1.22,outT=(u,v)=>u>=.8&&u<=1.22&&v>=2.25&&v<=2.7,spill=(u,v)=>u>=2.98&&u<=3.3&&v<1.3&&v>.3;
          const ramp=(u,v)=>v>=1.3&&v<=1.52&&u>=.42&&u<=1.24,pool=(u,v)=>Math.pow((u-1.46)/.4,2)+Math.pow((v-2.34)/.27,2);
          const zt=(u,v)=>{const d=sd(u,v);if(d<=0)return 0;let z=prof(d,PR);if(inT(u,v))z=Math.max(z,-9);if(outT(u,v))z=Math.max(z,-8);
            if(spill(u,v))z=3*Math.round(z/3);
            if(ramp(u,v))z=-18*clamp((u-.42)/.8,0,1);
            if(d>.75){if(dpoly(u,v,chan)<.1)z=-20;const e=pool(u,v);if(e<1)z=Math.min(z,-18-3*(1-e));}return z;};
          const wl=(u,v)=>{if(sd(u,v)<=.72)return -99;if(dpoly(u,v,chan)<.085)return -19;if(pool(u,v)<.92)return -18.6;return -99;};
          const zf=(u,v)=>Math.max(zt(u,v),wl(u,v));
          const cf=(u,v,z,gu,gv,i,j)=>{const d=sd(u,v),{s}=LU(gu,gv);
            if(s>1.6)return tone(CT5,gu,gv);
            if(d<=0)return d<-.27?grassT(i,j,1591):d<-.07?paver(i,j):'#86ae60';
            if((inT(u,v)&&zt(u,v)<=-8.9)||(outT(u,v)&&zt(u,v)<=-7.9))return '#d4d0c6';
            const w=wl(u,v);if(w>-99&&zt(u,v)<w-.2)return water(i,j,1592);
            if(ramp(u,v))return j%3===0?SH(tone(CT5,gu,gv),-16):tone(CT5,gu,gv);
            if(spill(u,v))return tone(CT5,gu,gv);
            if(d>.75){if(dpoly(u,v,chan)<.1)return tone(CT5,gu,gv);if(u>2.08&&u<2.82&&v<1.55)return riprap(i,j,1593);if(pool(u,v)<1.5)return '#6d7d52';return Math.floor(v*7)%2?'#74a153':'#6b974c';}
            if(d>.3&&d<.45)return gravel(i,j,1594);
            const c=tone(GT,gu,gv);return hsh(1595,i,j*64+11)<.06?SH(c,-10):c;};
          terrain(S,0,0,4,4,1/16,zf,cf);
          // 進流箱涵：頭牆雙孔＋流水
          S.t(2.75+1.2+.12,(s)=>{for(const u of[2.27,2.47]){winL(s,u+.03,1.25,-18,6,7,'#1e2a30');winL(s,u+.03,1.25,-18,6,1,'#5f98a8');}
            L.faceL(s,1.225,2.2,2.7,-9.5,-9,'#eeebe3');BL(s,P(2.33,1.26,-18),P(2.36,1.42,-19),'#86bfc2');BL(s,P(2.56,1.26,-18),P(2.45,1.45,-19),'#86bfc2');});
          // 出流工：孔口＋攔污柵＋水尺
          S.t(1.22+2.7+.12,(s)=>{winR(s,1.25,2.6,-18,7,6,'#1b262c');for(let k=0;k<7;k+=2){const p=P(1.25,2.6,-18);RC(s,p[0]+k,p[1]-6-Math.floor(k*.5),1,6,'#a9b2b6');}
            gaugeR(s,1.25,2.36,-18,10);L.faceR(s,1.225,2.25,2.7,-8.5,-8,'#eeebe3');});
          hoist(S,1.05,2.48,-8);
          S.t(1.22+2.7+.2,(s)=>{rail(s,P(1.22,2.25,-8),P(1.22,2.7,-8),3,'#b3bcc1',7);rail(s,P(2.2,1.22,-9),P(2.7,1.22,-9),3,'#b3bcc1',7);});
          railPath(S,rrPts(.45,.45,3.55,3.35,.5,.035),0,(u,v)=>(u<.6&&v>1.28&&v<1.55));
          S.t(.45+1.52+.3,(s)=>{rail(s,P(.42,1.3,0),P(1.22,1.3,-18),3,'#b3bcc1',6);rail(s,P(.42,1.52,0),P(1.22,1.52,-18),3,'#b3bcc1',6);});
          pavilion(S,.18,3.55,.3,.26);
          for(const[u,v,s,k]of[[.15,.2,1,0],[.2,.9,.9,2],[1.4,.16,1,1],[3.3,.14,.9,0],[3.84,.6,1,2],[3.84,1.6,.9,1],[3.84,2.6,1,0],[3.8,3.6,.9,2],[2.6,3.82,.9,1],[1.5,3.8,.8,0],[.15,2.0,.9,1]])tree(S,u,v,0,s,k);
          bench(S,1.6,3.5);bench(S,3.64,2.0,false);bench(S,1.9,.3);lamp(S,1.0,3.52);lamp(S,3.66,1.2);lamp(S,3.1,3.52);lamp(S,.3,.9);
          sign(S,.3,1.62,'#e0a030');edges(S);
          return{fence:false};
        },
        // v1 多功能運動滯洪池：看台式混凝土階梯、草坡、池底足球場、周邊截流溝、圓管進流口、池底集水井、照明塔、管理室
        (g,ng,S)=>{
          const u0=.35,v0=.4,u1=3.65,v1=3.25;
          const inT=(u,v)=>u>=.55&&u<=.88&&v>=1.55&&v<=1.95;
          const zt=(u,v)=>{const a=u-u0,b=v-v0,c=u1-u,e=v1-v,d=Math.min(a,b,c,e);if(d<=0)return 0;if(inT(u,v))return Math.max(-8,-Math.min(18,18*d/.53));
            if(b<=Math.min(a,c,e)&&u>u0+.3&&u<u1-.3)return -Math.min(18,3*Math.ceil((b-.012)/.085));
            if(a<=Math.min(b,c,e)&&v>2.5&&v<2.76)return -Math.min(18,3*Math.ceil((a-.012)/.085));
            let z=-Math.min(18,18*d/.53);if(d>.53&&d<.62)z=-19.5;return z;};
          const zf=(u,v)=>{const z=zt(u,v);const a=u-u0,b=v-v0,c=u1-u,e=v1-v,d=Math.min(a,b,c,e);return (d>.53&&d<.62&&(u>2.4||v>2.2))?Math.max(z,-18.8):z;};
          const line=(u,v)=>{const w=.022;const inF=u>1.08-w&&u<3.0+w&&v>1.02-w&&v<2.64+w;if(!inF)return false;
            if(Math.abs(u-1.08)<w||Math.abs(u-3.0)<w||Math.abs(v-1.02)<w||Math.abs(v-2.64)<w||Math.abs(u-2.04)<w)return true;
            const rc=Math.hypot(u-2.04,v-1.83);if(Math.abs(rc-.26)<w)return true;
            if((u<1.5||u>2.58)&&Math.abs(v-1.4)<w&&(u<1.5?u>1.08:u<3.0))return true;if((u<1.5||u>2.58)&&Math.abs(v-2.26)<w&&(u<1.5?u>1.08:u<3.0))return true;
            if((Math.abs(u-1.5)<w||Math.abs(u-2.58)<w)&&v>1.4&&v<2.26)return true;return false;};
          const cf=(u,v,z,gu,gv,i,j)=>{const a=u-u0,b=v-v0,c=u1-u,e=v1-v,d=Math.min(a,b,c,e),{s}=LU(gu,gv);
            if(d<=0)return d<-.26?grassT(i,j,1601):d<-.06?paver(i,j):'#86ae60';
            if(inT(u,v)&&zt(u,v)<=-7.9)return '#d4d0c6';
            const seat=(b<=Math.min(a,c,e)&&u>u0+.3&&u<u1-.3)||(a<=Math.min(b,c,e)&&v>2.5&&v<2.76);
            if(s>1.6||seat){const t=tone(CT5,gu,gv);if(seat&&s<1&&b<=Math.min(a,c,e)&&Math.ceil((b-.012)/.085)%2===0&&(i%5)<3)return '#3f78b0';return t;}
            if(d>.53&&d<.62){return z<-18.7?water(i,j,1602):tone(CT5,gu,gv);}
            if(d>=.62){if(line(u,v))return '#eef2ea';if(u>.88&&u<1.02&&v>1.55&&v<1.95)return riprap(i,j,1603);return turf(u,v);}
            const cc=tone(GT,gu,gv);return hsh(1604,i,j*64+11)<.06?SH(cc,-10):cc;};
          terrain(S,0,0,4,4,1/16,zf,cf);
          S.t(.88+1.95+.1,(s)=>{const p=P(.9,1.84,-18),x=rnd(p[0]),y=rnd(p[1]);L.ell(s,x,y-4,4,4,'#aaa69c');L.ell(s,x,y-4,3,3,'#1d282e');for(let k=-2;k<=2;k+=2)RC(s,x+k,y-7,1,7,'#9aa3a8');RC(s,x-3,y,7,1,'#86bfc2');L.faceR(s,.885,1.55,1.95,-8.5,-8,'#eeebe3');});
          for(const uu of[1.08,3.0])S.t(uu+1.83+.02,(s)=>{const a=P(uu,1.72,-18),b=P(uu,1.94,-18);RC(s,a[0],a[1]-6,1,6,'#f4f6f5');RC(s,b[0],b[1]-6,1,6,'#f4f6f5');BL(s,[a[0],a[1]-6],[b[0],b[1]-6],'#f4f6f5');BL(s,[a[0]+(uu<2?-2:2),a[1]-5],[b[0]+(uu<2?-2:2),b[1]-5],'#c9cfcf');});
          S.o(3.1+2.7+.1,(s)=>{boxZ(s,3.02,2.62,.12,.12,-18,2,'#5d666b','#c9c5bb','#a9a59b');for(let k=0;k<4;k++)BL(s,P(3.04+k*.027,2.64,-16),P(3.04+k*.027,2.72,-16),'#8e979c');});
          S.t(.35+2.76+.2,(s)=>{rail(s,P(.35,2.5,0),P(.9,2.5,-18),3,'#b3bcc1',6);rail(s,P(.35,2.76,0),P(.9,2.76,-18),3,'#b3bcc1',6);});
          railPath(S,rrPts(.35,.4,3.65,3.25,.05,.035),0,(u,v)=>(u<.5&&v>2.45&&v<2.8));
          S.t(.88+1.95+.3,(s)=>{rail(s,P(.88,1.55,-8),P(.88,1.95,-8),3,'#b3bcc1',7);});
          flood(S,.18,.22);flood(S,3.82,.24);flood(S,.16,3.44);flood(S,3.84,3.44);
          shed(S,3.2,3.5,.5,.32,9,'#e2ddd0','#b9b2a2','#8d7f6c',1605);
          for(const[u,v,s,k]of[[1.2,.16,.9,0],[2.2,.14,1,2],[3.0,.16,.9,1],[3.84,1.2,1,0],[3.84,2.2,.9,2],[.16,1.2,.9,1],[.14,2.2,.8,0],[1.2,3.72,.9,2],[2.3,3.75,1,1]])tree(S,u,v,0,s,k);
          bench(S,1.7,3.46);bench(S,2.6,3.46);lamp(S,1.1,3.48);lamp(S,3.62,1.7);sign(S,.46,3.52,'#e0a030');
          S.t(99.5,(s)=>{for(const[u,v]of[[3.3,3.66],[3.34,3.66],[3.38,3.66]]){const p=P(u,v);RC(s,p[0],p[1]-4,1,4,'#5f686e');RC(s,p[0]-2,p[1]-3,5,1,'#8e979c');}});
          edges(S);
          return{fence:false};
        },
        // v2 濕式滯洪池（常水池）：圓潤池岸、拋石護岸帶、挺水植物緣、生態島、噴泉曝氣、出流豎井與維修便橋、木棧觀景平台、野鴨
        (g,ng,S)=>{
          const sd=(u,v)=>rrect(u,v,.4,.4,3.6,3.4,.95),PR=[[0,0],[.16,-3],[.3,-5],[.46,-9],[.9,-16]],WL=-8;
          const isl=(u,v)=>ellD(u,v,2.3,2.15,.42,.34);
          const zt=(u,v)=>{const d=sd(u,v);if(d<=0)return 0;let z=prof(d,PR);const di=isl(u,v);if(di>0)z=Math.max(z,-9+clamp(di/.2,0,1)*7);return z;};
          const zf=(u,v)=>{const d=sd(u,v);const z=zt(u,v);return d>.3?Math.max(z,WL):z;};
          const cf=(u,v,z,gu,gv,i,j)=>{const d=sd(u,v),zz=zt(u,v),{s}=LU(gu,gv);
            if(d<=0)return d<-.26?grassT(i,j,1611):d<-.06?paver(i,j):'#86ae60';
            if(d>.3&&zz<WL-.15){const W=zz>WL-2.2?{base:'#5e9b9b',lite:'#93c7c4',deep:'#4f8d96'}:WT;return water(i,j,1612,W);}
            if(isl(u,v)>0)return zz>-6.5?tone(GT,gu,gv):'#6f7a4f';
            if(d>.14&&d<.31)return riprap(i,j,1613);
            if(zz<-5.2)return '#6f7a4f';
            const c=tone(GT,gu,gv);return hsh(1614,i,j*64+11)<.06?SH(c,-10):c;};
          terrain(S,0,0,4,4,1/16,zf,cf);
          for(let a=0;a<64;a++){const t=a/64*Math.PI*2;const cu=2,cv=1.9,ru=1.28,rv=1.18;for(let k=0;k<3;k++){const f=1+(k-1)*.035,u=cu+Math.cos(t)*ru*f,v=cv+Math.sin(t)*rv*f;const zz=zt(u,v);
            if(zz<-5.4&&zz>-8.6&&hsh(1615,a,k)<.55)reeds(S,u,v,WL,a*7+k,4+(a%3),k%2);}}
          for(let a=0;a<14;a++){const t=a/14*Math.PI*2,u=2.3+Math.cos(t)*.38,v=2.15+Math.sin(t)*.3;reeds(S,u,v,WL,300+a,4,a%2);}
          tree(S,2.28,2.1,-3,.9,2);tree(S,2.42,2.2,-4,.7,0);
          // 出流豎井＋便橋
          S.o(3.03+1.13,(s)=>{boxZ(s,2.85,.95,.18,.18,-14,15,'#8e979c','#dcd8ce','#aba79d');L.flat(s,2.87,.97,.14,.14,'#5f686d',1);for(let k=0;k<4;k++)BL(s,P(2.88+k*.035,.97,1),P(2.88+k*.035,1.11,1),'#aab2b6');
            winL(s,2.89,1.13,-8,6,4,'#1e2a30');gaugeR(s,3.03,1.08,-10,11);});
          S.o(2.95+.62,(s)=>{boxZ(s,2.89,.3,.1,.66,-1,1,'#9b7a55','#b58d66','#7b5c40');});
          S.t(2.95+.97,(s)=>{rail(s,P(2.89,.3,0),P(2.89,.96,0),3,'#8c6c4c',6);rail(s,P(2.99,.3,0),P(2.99,.96,0),3,'#8c6c4c',6);});
          // 木棧觀景平台
          S.o(1.5+1.3,(s)=>{boxZ(s,1.28,.3,.16,.78,-2,1,'#a4825a','#b89468','#7b5c40');boxZ(s,1.16,1.04,.4,.26,-2,1,'#a4825a','#b89468','#7b5c40');
            for(let t=.35;t<1.28;t+=.07)BL(s,P(1.28,t,-1),P(1.44,t,-1),'#8a6a48');for(const[q,w]of[[1.18,1.28],[1.54,1.28],[1.54,1.06]]){const p=P(q,w,-2),zz=Math.max(zt(q,w),WL);RC(s,p[0],p[1],1,Math.max(1,rnd(-2-zz)),'#5e4630');}});
          S.t(1.56+1.3+.05,(s)=>{rail(s,P(1.16,1.3,-2),P(1.56,1.3,-2),3,'#7b5c40',5);rail(s,P(1.56,1.04,-2),P(1.56,1.3,-2),3,'#7b5c40',5);rail(s,P(1.28,.3,-2),P(1.28,1.04,-2),3,'#7b5c40',6);});
          // 噴泉曝氣
          S.t(1.35+2.55+.05,(s)=>{const p=P(1.35,2.55,WL),x=rnd(p[0]),y=rnd(p[1]);L.ring(s,x,y,6,3,'#b5dcdc');L.ring(s,x,y,3,1,'#e8f4f2');for(let k=0;k<9;k++)RC(s,x,y-k-1,1,1,k<6?'#f4fbfa':'#cfe8e8');
            RC(s,x-2,y-6,1,2,'#e1f1f0');RC(s,x+2,y-6,1,2,'#e1f1f0');RC(s,x-3,y-3,1,2,'#cfe8e8');RC(s,x+3,y-3,1,2,'#cfe8e8');});
          ducks(S,[[1.8,1.5],[1.92,1.58],[2.9,2.6]],WL);
          railPath(S,rrPts(.4,.4,3.6,3.4,.95,.04),0,(u,v)=>(u>1.1&&u<1.6&&v<.6)||(u>2.8&&u<3.1&&v<.6));
          pavilion(S,.16,3.5,.34,.3,'#5f6f4a');
          for(const[u,v,s,k]of[[.18,.2,1.1,2],[.2,1.1,.9,0],[.16,2.2,1,1],[2.2,.14,.9,0],[3.6,.2,1,2],[3.84,1.4,.9,1],[3.84,2.6,1,0],[3.7,3.72,.9,2],[2.5,3.8,1,1],[1.3,3.82,.9,0]])tree(S,u,v,0,s,k);
          bench(S,1.9,3.55);bench(S,3.6,1.9,false);lamp(S,.9,3.54);lamp(S,3.62,2.3);lamp(S,2.4,.3);sign(S,1.2,.24,'#2f8f6f');edges(S);
          return{fence:false};
        },
        // v3 都市水廣場（下凹式雨水廣場）：清水混凝土階梯看台、垂直擋牆、彩色球場鋪面、不鏽鋼導水槽與落水口、樹穴花台
        (g,ng,S)=>{
          const u0=.75,v0=.7,u1=3.25,v1=3.05,TG=[[1.25,.36],[2.75,.36],[.38,1.2],[.38,2.6],[3.62,1.1],[3.62,2.6],[1.1,3.45],[2.7,3.45]];
          const zt=(u,v)=>{const a=u-u0,b=v-v0,c=u1-u,e=v1-v,d=Math.min(a,b,c,e);if(d<=0)return 0;
            if(a<=Math.min(b,c,e)||b<=Math.min(a,c,e)){const x=Math.min(a,b);return -Math.min(12,4*Math.ceil((x-.01)/.15));}
            let z=-12;const pd=Math.pow((u-2.95)/.3,2)+Math.pow((v-2.72)/.26,2);if(pd<1)z=-12.6;return z;};
          const zf=(u,v)=>{const z=zt(u,v);const pd=Math.pow((u-2.95)/.3,2)+Math.pow((v-2.72)/.26,2);return pd<.9?Math.max(z,-12.2):z;};
          const cf=(u,v,z,gu,gv,i,j)=>{const a=u-u0,b=v-v0,c=u1-u,e=v1-v,d=Math.min(a,b,c,e),{s}=LU(gu,gv);
            if(d<=0){if((Math.abs(v-1.9)<.03&&u<u0)||(Math.abs(u-2.0)<.03&&v<v0))return '#d9e0e3';for(const q of TG)if(Math.abs(u-q[0])<.09&&Math.abs(v-q[1])<.09)return (i+j)%2?'#5a5048':'#6b6056';if(d>-.07)return '#bdb6a8';return (i%4===0||j%4===0)?'#bcb5a8':(hsh(1622,i>>2,j>>2)<.3?'#d6d0c3':'#cdc7ba');}
            if(s>1.6)return tone(CT5,gu,gv);
            if(a<=Math.min(b,c,e)||b<=Math.min(a,c,e))return z>-11.5?(Math.ceil((Math.min(a,b)-.01)/.15)%2?'#d9d5cb':'#cfcbc0'):'#3f6e8f';
            const pd=Math.pow((u-2.95)/.3,2)+Math.pow((v-2.72)/.26,2);if(pd<.9)return water(i,j,1621);
            const rc=Math.hypot(u-2.05,v-1.95);if(Math.abs(rc-.42)<.03||(Math.abs(u-2.05)<.025&&v>1.53&&v<2.37))return '#f2efe6';
            if(rc<.18)return '#e08a3a';if(Math.abs(v-1.2)<.02||Math.abs(u-1.25)<.02)return '#f2efe6';
            if(Math.abs((u-v)-.35)<.03)return '#2d4a5c';
            return (Math.floor(u*3)+Math.floor(v*3))%2?'#3f6e8f':'#4a7a9a';};
          terrain(S,0,0,4,4,1/16,zf,cf);
          // 不鏽鋼導水槽落水口（瀑布）
          S.t(u0+1.9+.05,(s)=>{const p=P(u0,1.9,0),x=rnd(p[0]),y=rnd(p[1]);RC(s,x-3,y-1,6,2,'#9aa3a8');for(let k=0;k<12;k+=1)RC(s,x+rnd(k*.9)-1,y+k,2,1,k%3?'#9fd0dc':'#e6f5f8');});
          S.t(2.0+v0+.05,(s)=>{const p=P(2.0,v0,0),x=rnd(p[0]),y=rnd(p[1]);RC(s,x-1,y-1,5,2,'#9aa3a8');for(let k=0;k<12;k++)RC(s,x-rnd(k*.9)+1,y+k,2,1,k%3?'#9fd0dc':'#e6f5f8');});
          // 籃球架
          S.t(1.25+1.95+.03,(s)=>{const p=P(1.1,1.95,-12),x=rnd(p[0]),y=rnd(p[1]);RC(s,x,y-13,1,13,'#56606a');RC(s,x+1,y-14,5,4,'#f4f6f5');RC(s,x+2,y-12,3,2,'#c0392b');RC(s,x+3,y-10,2,1,'#e67e22');});
          // 樹穴花台
          const planter=(u,v)=>{S.o(u+v+.25,(s)=>{boxZ(s,u,v,.36,.36,0,3,'#bcb6a8','#d9d4c8','#a8a295');L.flat(s,u+.03,v+.03,.3,.3,'#6b5a45',3);});tree(S,u+.18,v+.18,3,1.1,(rnd(u*3)+rnd(v*3))%3);};
          planter(.12,.14);planter(3.5,.16);planter(.12,3.48);planter(3.52,3.5);planter(1.9,3.5);
          railPath(S,[[u0,v0],[u1,v0],[u1,v1],[u0,v1],[u0,v0]],0,(u,v)=>(v<v0+.01&&u>1.9&&u<2.1)||(u<u0+.01&&v>1.8&&v<2.0),'#9aa3a8');
          for(const[u,v,al]of[[1.5,.34,true],[2.35,.34,true],[.36,1.45,false],[.36,2.3,false],[1.5,3.42,true]])bench(S,u,v,al);TG.forEach((q,k)=>tree(S,q[0],q[1],0,.95,k%3));
          S.o(3.45+1.85+.2,(s,n)=>{boxZ(s,3.42,1.62,.4,.44,0,9,'#8f9aa0','#e6e0d2','#bcb3a2');L.flat(s,3.44,1.64,.36,.4,'#6f7a80',9);L.rowL(s,n,3.44,3.8,2.06,2,4,5,2,'#5d86a2',1623,.8);L.rowR(s,n,3.82,1.66,2.04,2,4,5,3,'#5d86a2',1624,.7);
            boxZ(s,3.4,2.06,.44,.1,7,1,'#d9534f','#e46a5f','#b8433b');for(let k=0;k<6;k++)L.winL(s,3.42+k*.07,2.16,7,2,1,k%2?'#f4f0e6':'#d9534f');});
          lamp(S,.6,.55);lamp(S,3.45,.55);lamp(S,.55,3.2);lamp(S,3.45,3.25);
          S.t(99.2,(s)=>{for(const[u,v]of[[3.55,2.2],[3.55,2.35],[3.55,2.5]]){const p=P(u,v);RC(s,p[0],p[1]-4,2,4,'#e0a030');RC(s,p[0],p[1]-4,2,1,'#3a3f44');}});
          sign(S,3.62,1.1,'#2f6fb0');edges(S);
          return{fence:false};
        },
        // v4 雙池式自然滯洪池：沉砂前池（常水＋淤泥帶＋進流雙管＋維修坡道）、蛇籠溢流堰與人行便橋、主池草地低窪濕地＋香蒲、穿孔出流豎管、賞鳥屋
        (g,ng,S)=>{
          const sdF=(u,v)=>rrect(u,v,.4,.3,3.05,1.45,.35);
          const sdM=(u,v)=>Math.max(ellD(u,v,1.6,2.68,1.15,.8),ellD(u,v,2.85,2.78,.75,.72));
          const notch=(u,v)=>u>=1.6&&u<=2.2&&v>=1.3&&v<=1.9;
          const swale=[[1.9,1.95],[1.75,2.35],[1.5,2.62],[1.3,2.85]];
          const inT=(u,v)=>u>=1.0&&u<=1.45&&v>=.4&&v<=.62,pud=(u,v)=>sdM(u,v)>.46&&dpoly(u,v,swale)<.06&&hsh(1644,rnd(u*5),rnd(v*5))<.55;
          const rampF=(u,v)=>Math.abs(v-.98)<.1&&u<1.2;
          const zt=(u,v)=>{const f=sdF(u,v),m=sdM(u,v);let z=0;
            if(f>0){z=prof(f,[[0,0],[.3,-14]]);if(rampF(u,v))z=-14*clamp((u-.36)/.8,0,1);if(inT(u,v))z=Math.max(z,-3);}
            if(m>0){z=Math.min(z,prof(m,[[0,0],[.34,-11],[.44,-12]]));if(m>.4&&dpoly(u,v,swale)<.12)z=-13;}
            if(notch(u,v)){if(v<1.72&&v>1.46)z=-6;else if(v>=1.72)z=Math.min(z,Math.max(-12,-6-3*Math.ceil((v-1.72)/.06)));else z=Math.min(z,-6);}
            return z;};
          const pool=(u,v)=>sdM(u,v)>.44&&Math.hypot(u-1.3,v-2.86)<.2;
          const zf=(u,v)=>{const z=zt(u,v);if(sdF(u,v)>.08)return Math.max(z,-9);if(pool(u,v))return Math.max(z,-12.5);if(pud(u,v))return Math.max(z,-12.6);return z;};
          const WF={base:'#5a8d86',lite:'#8fbfb5',deep:'#4c7f78'};
          const cf=(u,v,z,gu,gv,i,j)=>{const f=sdF(u,v),m=sdM(u,v),zz=zt(u,v),{s}=LU(gu,gv);
            if(notch(u,v)&&zz<-.5)return gabion(i,j,gu,gv,1631);
            if(s>1.6)return inT(u,v)||rampF(u,v)?tone(CT5,gu,gv):gabion(i,j,gu,gv,1632);
            if(inT(u,v)&&f>0&&zz<=-2.9)return '#d4d0c6';
            if(f>0){if(zz<-9.15)return water(i,j,1633,WF);if(rampF(u,v))return (j%3===0)?SH(tone(CT5,gu,gv),-16):tone(CT5,gu,gv);if(zz<-6.5)return (hsh(1645,i,j*64+11)<.2?'#6e644b':'#7a6f55');if(u>.9&&u<1.55&&v<.62)return riprap(i,j,1634);
              const c=tone(GT,gu,gv);return hsh(1635,i,j*64+11)<.06?SH(c,-10):c;}
            if(m>0){if(pool(u,v)&&zz<-12.2)return water(i,j,1636,WF);if(pud(u,v)&&zz<-12.7)return water(i,j,1637,WF);if(m>.4&&dpoly(u,v,swale)<.12)return (hsh(1638,i,j*64+11)<.3?'#5f7a45':'#678a4a');
              if(m>.44){const nz=hsh(1642,i>>3,j>>3),b=nz<.33?'#6c9a4c':nz<.66?'#76a454':'#80ac5b',t=hsh(1643,i,j*64+11);return t<.08?SH(b,-14):t>.95?SH(b,14):b;}
              const c=tone(GT,gu,gv);return hsh(1639,i,j*64+11)<.06?SH(c,-10):c;}
            if(v>1.5&&v<1.68&&u>.4&&u<3.1)return gravel(i,j,1640);
            const pm=Math.max(f,m);if(pm>-.2)return paver(i,j);return grassT(i,j,1630);};
          terrain(S,0,0,4,4,1/16,zf,cf);
          S.t(1.45+.62+.12,(s)=>{for(const u of[1.1,1.27]){const p=P(u,.64,-9),x=rnd(p[0]),y=rnd(p[1]);L.ell(s,x+3,y-3,3,3,'#aaa69c');L.ell(s,x+3,y-3,2,2,'#1d282e');RC(s,x+1,y,5,1,'#8fbfb5');RC(s,x+3,y-1,1,2,'#8fbfb5');}L.faceL(s,.625,1.0,1.45,-3.5,-3,'#eeebe3');rail(s,P(1.0,.625,-3),P(1.45,.625,-3),3,'#b3bcc1',6);});
          S.o(1.95+2.5,(s)=>{boxZ(s,1.35,2.4,.6,.1,-12,1,'#a4825a','#b89468','#7b5c40');for(let t=1.38;t<1.95;t+=.05)BL(s,P(t,2.4,-11),P(t,2.5,-11),'#8a6a48');});
          for(let k=0;k<44;k++){const t=k/43,u=1.9+(1.3-1.9)*t+(hsh(1640,k,1)-.5)*.42,v=1.95+(2.85-1.95)*t+(hsh(1640,k,2)-.5)*.36;if(sdM(u,v)>.42&&!pud(u,v)&&!pool(u,v))reeds(S,u,v,zt(u,v),500+k,5+(k%3),k%2);}
          for(let k=0;k<30;k++){const u=.8+hsh(1641,k,1)*2.1,v=.5+hsh(1641,k,2)*.9,zz=zt(u,v);if(zz<-6.2&&zz>-9.3&&!rampF(u,v))reeds(S,u,v,zz,600+k,4,1);}
          S.o(1.3+2.86+.05,(s)=>{const p=P(1.3,2.86,-12);cyl(s,p[0],p[1],4,8,['#a9a59b','#dcd8ce','#cbc7bd','#aba79d','#928e85'],'#5f686d','#c9c5bb');for(let k=-2;k<=2;k+=2)RC(s,rnd(p[0])+k,rnd(p[1])-4,1,1,'#3a4247');
            for(let k=-3;k<=3;k+=2)RC(s,rnd(p[0])+k,rnd(p[1])-13,1,4,'#8e979c');RC(s,rnd(p[0])-4,rnd(p[1])-13,9,1,'#8e979c');});
          S.o(2.3+1.66,(s)=>{boxZ(s,1.5,1.52,.8,.14,-1,2,'#a4825a','#b89468','#7b5c40');for(let t=1.54;t<2.3;t+=.05)BL(s,P(t,1.52,1),P(t,1.66,1),'#8a6a48');});
          S.t(2.3+1.66+.05,(s)=>{rail(s,P(1.5,1.52,1),P(2.3,1.52,1),3,'#7b5c40',5);rail(s,P(1.5,1.66,1),P(2.3,1.66,1),3,'#7b5c40',5);});
          S.o(3.25+1.45+.3,(s,n)=>{const u0=3.2,v0=1.38,du=.36,dv=.28,h=8;boxZ(s,u0,v0,du,dv,0,h,'#8a6a48','#a4825a','#7b5c40');for(let z=2;z<h;z+=2)BL(s,P(u0,v0+dv,z),P(u0+du,v0+dv,z),'#8a6a48');
            winL(s,u0+.08,v0+dv,5,10,2,'#2b2622');const um=u0+du/2;L.fp(s,[P(u0-.03,v0-.03,h),P(um,v0-.03,h+5),P(um,v0+dv+.03,h+5),P(u0-.03,v0+dv+.03,h)],'#6f7f55');
            L.fp(s,[P(u0,v0+dv,h),P(u0+du,v0+dv,h),P(um,v0+dv,h+5)],'#a4825a');L.fp(s,[P(um,v0-.03,h+5),P(u0+du+.03,v0-.03,h),P(u0+du+.03,v0+dv+.03,h),P(um,v0+dv+.03,h+5)],'#56643f');});
          railPath(S,[[.4,.26],[3.05,.26]],0);
          S.t(.4+1.2,(s)=>{rail(s,P(.36,.88,0),P(1.16,.88,-14),3,'#b3bcc1',6);rail(s,P(.36,1.08,0),P(1.16,1.08,-14),3,'#b3bcc1',6);});
          for(const[u,v,s,k]of[[.18,.2,1,2],[.18,1.3,.9,0],[.2,2.4,1.1,1],[3.35,.2,1,0],[3.8,.9,.9,2],[3.84,2.0,1,1],[3.8,3.65,.9,0],[2.2,3.82,1,2],[.5,3.7,1,1],[2.75,2.85,.9,2],[2.3,3.2,.8,0]])tree(S,u,v,zt(u,v),s,k);
          conifer(S,.18,3.2,0,1);bench(S,2.6,1.54);bench(S,.8,1.54);lamp(S,1.45,1.7);lamp(S,3.1,1.7);sign(S,.26,1.1,'#2f8f6f');edges(S);
          return{fence:false};
        },
      ];
    };
    const lay=[0,1,2,3,4].map(i=>(g,ng,S,L,K)=>K159(L)[i](g,ng,S));
    build(159,lay,5);
  }catch(e){console.error('infra575 k159',e);errs.push('k159:'+(e&&e.stack||e));}

  // ================= k160 人工濕地 =================
  try{
    const K160=L=>{
      const T=TER(L);
      const {P,hsh,RC,BL,fp,flat,boxZ,faceL,faceR,winL,winR,rowL,rowR,RX,ell,ring,cyl,rail,terrain,lamp,tree,bush,bench,conifer,truck,car}=L;
      const {clamp,rrect,ellD,dseg,dpoly,prof,LU,tone,GT,CT5,GB5,grassT,paver,gravel,riprap,water,reeds,railPath,edges}=T;
      const WW={base:'#4d8a86',lite:'#86bdb2',deep:'#41797a'};
      const HB=(sd,a,b)=>hsh(sd,(a*73856093)^(b*19349663),a+b*131);
      // 植物量體：頂面（穗／花序點綴）＋直立側面（莖稈直紋）；高度逐角點雜湊起伏
      const PL={
        reed:{h:7,top:['#a9bb6c','#98ad5f','#c3cd8a','#8c6f4f'],L:['#a0b567','#8aa057'],D:['#72873f','#647836']},
        cat:{h:6,top:['#6d9a46','#5d8a3c','#8ab15c','#6e4a2c'],L:['#79a44e','#658f42'],D:['#4f7433','#44672c']},
        sedge:{h:3,top:['#7fa86f','#77a067','#8db27c','#a3b584'],L:['#90b383','#7ca16f'],D:['#5f8453','#557849']},
        rush:{h:4,top:['#5f8f5c','#517f4f','#79a470','#cdb77e'],L:['#6b9b67','#5b8b58'],D:['#436f42','#3b6239']},
        row:{h:5,top:['#9fb866','#8ca85a','#b8c67f','#8a6d4c'],L:['#98b061','#839b52'],D:['#6b813c','#5d7234']},
      };
      const pz=(p,u,v,base,seed)=>base+p.h+(hsh(seed,Math.floor(u*5),Math.floor(v*5))<.35?1:0);
      const pcol=(p,gu,gv,i,j,seed)=>{const{rel,s}=LU(gu,gv);
        if(s>1.1){const k=(Math.abs(gv)>Math.abs(gu)?i:j)%2;return rel>0?p.L[k]:p.D[k];}
        const b=HB(seed,i>>1,j>>1),t=HB(seed+3,i,j);return t<.035?p.top[3]:t>.965?p.top[2]:b<.45?p.top[1]:p.top[0];};
      const lily=(i,j,seed)=>{const q=HB(seed+5,i>>1,j>>1),t=HB(seed,i>>1,j>>1);if(q<.38)return HB(seed+9,i,j)<.035?'#f0a0c0':(t<.55?'#5f9c4c':'#6fa956');return water(i,j,seed,WW);};
      const signB=(S,u,v)=>S.o(u+v+.03,(g)=>{const p=P(u,v),x=rnd(p[0]),y=rnd(p[1]);RC(g,x-3,y-4,1,4,'#5e4630');RC(g,x+3,y-4,1,4,'#5e4630');RC(g,x-4,y-9,9,6,'#7b5c40');RC(g,x-3,y-8,7,4,'#e9e2c8');RC(g,x-3,y-8,7,1,'#4f8a5a');RC(g,x-2,y-6,3,1,'#6a9ad0');RC(g,x+1,y-6,2,2,'#c98a4a');});
      const deckU=(S,u0,u1,v,w,z,rails=true)=>{S.o(u1+v+w,(g)=>{boxZ(g,u0,v,u1-u0,w,z-1,1,'#b08a5e','#c49a6a','#86663f');for(let t=u0+.04;t<u1;t+=.05)BL(g,P(t,v,z),P(t,v+w,z),'#96744c');
          for(let t=u0+.1;t<u1;t+=.3){const p=P(t,v+w,z-1);RC(g,p[0],p[1],1,2,'#5e4630');}});
        if(rails)S.t(u1+v+w+.01,(g)=>{rail(g,P(u0,v,z),P(u1,v,z),3,'#7b5c40',5);rail(g,P(u0,v+w,z),P(u1,v+w,z),3,'#7b5c40',5);});};
      const deckV=(S,v0,v1,u,w,z,rails=true)=>{S.o(u+w+v1,(g)=>{boxZ(g,u,v0,w,v1-v0,z-1,1,'#b08a5e','#c49a6a','#86663f');for(let t=v0+.04;t<v1;t+=.05)BL(g,P(u,t,z),P(u+w,t,z),'#96744c');
          for(let t=v0+.1;t<v1;t+=.3){const p=P(u+w,t,z-1);RC(g,p[0],p[1],1,2,'#5e4630');}});
        if(rails)S.t(u+w+v1+.01,(g)=>{rail(g,P(u,v0,z),P(u,v1,z),3,'#7b5c40',5);rail(g,P(u+w,v0,z),P(u+w,v1,z),3,'#7b5c40',5);});};
      // 木構觀察塔（兩層平台＋四坡頂＋折梯）
      const tower=(S,u,v,s=.24,h=16)=>S.o(u+v+s+.05,(g,n)=>{const u1=u+s,v1=v+s;
        for(const[a,b]of[[u,v],[u1,v],[u,v1],[u1,v1]]){const p=P(a,b,0);RC(g,p[0],p[1]-h-9,1,h+9,'#6e5238');}
        BL(g,P(u,v1,1),P(u1,v1,h-1),'#8a6a48');BL(g,P(u1,v1,1),P(u,v1,h-1),'#8a6a48');BL(g,P(u1,v,1),P(u1,v1,h-1),'#5e4630');
        boxZ(g,u-.03,v-.03,s+.06,s+.06,h,1,'#b99366','#c9a06f','#8a6a48');
        faceL(g,v1+.03,u-.03,u1+.03,h+1,h+4,'#9a7650');faceR(g,u1+.03,v-.03,v1+.03,h+1,h+4,'#7b5c40');for(let t=u;t<u1;t+=.06)BL(g,P(t,v1+.03,h+1),P(t,v1+.03,h+3),'#c9a06f');
        const ap=P(u+s/2,v+s/2,h+14),a=P(u-.05,v-.05,h+9),b=P(u1+.05,v-.05,h+9),c=P(u1+.05,v1+.05,h+9),d=P(u-.05,v1+.05,h+9);
        fp(g,[a,b,ap],'#5b4a3a');fp(g,[a,d,ap],'#7d5f45');fp(g,[d,c,ap],'#9a7552');fp(g,[b,c,ap],'#6b513c');BL(g,c,ap,'#b48a62');
        const st0=P(u1+.02,v1+.12,0),st1=P(u1+.02,v1-.02,h);BL(g,st0,st1,'#5e4630');BL(g,[st0[0]+1,st0[1]],[st1[0]+1,st1[1]],'#b08a5e');});
      // 賞鳥屋
      const hide=(S,u0,v0,du,dv,h=7)=>S.o(u0+v0+du+dv,(g)=>{boxZ(g,u0,v0,du,dv,0,h,'#8a6a48','#a4825a','#7b5c40');for(let z=2;z<h;z+=2)BL(g,P(u0,v0+dv,z),P(u0+du,v0+dv,z),'#8a6a48');
        winL(g,u0+du*.2,v0+dv,h-3,rnd(du*20),2,'#2b2622');const um=u0+du/2;fp(g,[P(u0-.03,v0-.03,h),P(um,v0-.03,h+4),P(um,v0+dv+.03,h+4),P(u0-.03,v0+dv+.03,h)],'#6f7f55');
        fp(g,[P(u0,v0+dv,h),P(u0+du,v0+dv,h),P(um,v0+dv,h+4)],'#a4825a');fp(g,[P(um,v0-.03,h+4),P(u0+du+.03,v0-.03,h),P(u0+du+.03,v0+dv+.03,h),P(um,v0+dv+.03,h+4)],'#56643f');});
      const woods=(S,list)=>list.forEach(([u,v,s,k],i)=>k===9?conifer(S,u,v,0,s):tree(S,u,v,0,s,k));

      return [
        // v0 表面流人工濕地（三列並聯×兩級串聯）：配水渠與堰板、進流深水區→挺水植物（蘆葦／香蒲／燈心草）→出流深水區（睡蓮）、土堤碎石維修道、橫越木棧道與木構觀察塔、解說牌、林帶
        (g,ng,S)=>{
          const WL=-2,cols=[[.45,1.42],[1.55,2.45],[2.58,3.55]],sp=[['reed','sedge'],['cat','reed'],['rush','cat']];
          const cell=(u,v)=>{for(let c=0;c<3;c++){const[a,b]=cols[c];if(u>a&&u<b){if(v>.62&&v<1.84)return{c,r:0,a,b,v0:.62,v1:1.84};if(v>1.96&&v<3.22)return{c,r:1,a,b,v0:1.96,v1:3.22};}}return null;};
          const band=(q,u,v)=>{const inset=Math.min(u-q.a,q.b-u,v-q.v0,q.v1-v);if(inset<.05)return'edge';
            if(q.r===0)return v<.92?'deep':'plant';return v>2.72?'lily':'plant';};
          const zf=(u,v)=>{const q=cell(u,v);if(!q){const inW=u>.35&&u<3.65&&v>.52&&v<3.32;return inW?1:0;}const b=band(q,u,v);
            if(b==='plant'){const p=PL[sp[q.c][q.r]];return pz(p,u,v,WL,1600+q.c*3+q.r);}return WL;};
          const cf=(u,v,z,gu,gv,i,j)=>{const q=cell(u,v),{s}=LU(gu,gv);
            if(!q){const inW=u>.35&&u<3.65&&v>.52&&v<3.32;if(inW){if(s>.9)return tone(GT,gu,gv);return (Math.abs(u-1.485)<.035||Math.abs(u-2.515)<.035||Math.abs(v-1.9)<.035)?gravel(i,j,1601):'#7fa85b';}
              if(u>.2&&u<3.8&&v>.37&&v<3.47)return gravel(i,j,1602);return grassT(i,j,1603);}
            const b=band(q,u,v);if(b==='plant')return pcol(PL[sp[q.c][q.r]],gu,gv,i,j,1604+q.c);if(b==='lily')return lily(i,j,1605+q.c);
            return water(i,j,1606,b==='deep'?{base:'#447f80',lite:'#7fb5ad',deep:'#3a7274'}:WW);};
          terrain(S,0,0,4,4,1/16,zf,cf);
          // 配水渠＋堰板
          S.o(.4+.38+3.2,(s)=>{boxZ(s,.42,.36,3.16,.14,0,4,'#d6d2c8','#e4e0d6','#b1ada3');flat(s,.45,.39,3.1,.08,'#4d8a86',3);for(let t=.5;t<3.5;t+=.13){const p=P(t,.43,3);RC(s,p[0],p[1],2,1,'#86bdb2');}
            for(const[a,b]of cols){const um=(a+b)/2;boxZ(s,um-.06,.5,.12,.03,1,3,'#7b5c40','#8a6a48','#5e4630');}});
          S.t(.4+.5+3.21,(s)=>{for(const[a,b]of cols){const um=(a+b)/2,p=P(um-.04,.53,1);for(let k=0;k<5;k++){RC(s,p[0]+k*2,p[1]+1+k,2,1,k%2?'#e8f4f2':'#9fd0cc');}}});
          deckV(S,.4,3.35,1.98,.1,1);
          tower(S,1.9,1.78);
          for(const[u,v]of[[1.2,.95],[2.3,1.0],[3.3,.95],[.8,2.7],[3.1,2.65]])reeds(S,u,v,WL,rnd(u*97+v*31),4,1);
          signB(S,.3,3.55);signB(S,2.2,3.45);bench(S,1.3,3.42);bench(S,2.7,3.42);
          S.o(3.72+3.45+.3,(s,n)=>{boxZ(s,3.62,3.36,.28,.24,0,8,'#8d7f6c','#e2ddd0','#b9b2a2');flat(s,3.65,3.39,.22,.18,'#7a6e5d',8);winL(s,3.68,3.6,0,4,6,'#5b4a3c');winR(s,3.9,3.52,3,3,3,'#5d86a2');});
          woods(S,[[.15,.2,1.1,2],[.14,.7,.9,9],[.16,1.3,1.1,0],[.14,1.9,.9,1],[.16,2.5,1,2],[.15,3.1,1,9],[1.0,.14,.9,0],[1.9,.16,1,9],[2.8,.14,.9,1],[3.5,.18,1,2],[3.84,.8,.9,0],[3.86,1.5,1.1,9],[3.84,2.2,.9,2],[3.85,2.9,1,1],[.6,3.8,.9,0],[3.0,3.82,.8,2]]);
          lamp(S,.32,3.4);edges(S);
          return{fence:false};
        },
        // v1 自然式表面流濕地：蜿蜒開放水域、兩座生態島、挺水植物帶依水深分區（香蒲／蘆葦→莎草濕草甸）、L 形木棧道與觀景平台、賞鳥屋、進流跌水石、濃密林帶
        (g,ng,S)=>{
          const WL=-2;
          const wd=(u,v)=>Math.max(ellD(u,v,1.35,1.3,.85,.6),ellD(u,v,2.3,1.95,.75,.55),ellD(u,v,2.9,2.7,.55,.5),ellD(u,v,1.55,2.55,.5,.35));
          const isl=(u,v)=>Math.max(ellD(u,v,1.45,1.3,.22,.16),ellD(u,v,2.45,2.0,.2,.18));
          const bank=(u,v)=>rrect(u,v,.3,.35,3.7,3.45,.8);
          const zone=(u,v)=>{if(bank(u,v)<=0)return 'out';const d=wd(u,v),di=isl(u,v);if(di>0)return di>.08?'island':'reedI';
            if(d>.12)return (d<.26&&hsh(1611,Math.floor(u*1.5),Math.floor(v*1.5))<.35)?'lily':'water';if(d>0)return ((u+v)<3.9)?'reed':'cat';if(d>-.2)return 'sedge';return 'meadow';};
          const zf=(u,v)=>{const zn=zone(u,v);if(zn==='water'||zn==='lily')return WL;if(zn==='cat'||zn==='reed'||zn==='reedI')return pz(PL[zn==='reedI'?'reed':zn],u,v,WL,1613);if(zn==='sedge')return pz(PL.sedge,u,v,-2,1614);if(zn==='island')return 2;return 0;};
          const cf=(u,v,z,gu,gv,i,j)=>{const zn=zone(u,v);
            if(zn==='water')return water(i,j,1615,WW);if(zn==='lily')return lily(i,j,1616);
            if(zn==='cat'||zn==='reed'||zn==='reedI')return pcol(PL[zn==='reedI'?'reed':zn],gu,gv,i,j,1617);if(zn==='sedge')return pcol(PL.sedge,gu,gv,i,j,1618);
            if(zn==='island')return tone(GT,gu,gv);
            if(zn==='meadow'){const t=hsh(1619,i,j*64+11);return t<.015?'#f0d060':t<.025?'#e8e0f0':t<.08?'#6f9a4e':'#7fa85b';}
            if(Math.abs(bank(u,v)+.12)<.06)return gravel(i,j,1620);return grassT(i,j,1621);};
          terrain(S,0,0,4,4,1/16,zf,cf);
          tree(S,1.45,1.3,2,.8,2);tree(S,2.45,2.0,2,.7,0);
          deckU(S,.55,2.24,2.98,.1,1);deckV(S,2.12,2.98,2.14,.1,1);
          S.o(2.14+2.12+.3,(s)=>{boxZ(s,1.98,1.86,.36,.26,0,1,'#b08a5e','#c49a6a','#86663f');for(let t=2.02;t<2.34;t+=.05)BL(s,P(t,1.86,1),P(t,2.12,1),'#96744c');});
          S.t(2.14+2.12+.31,(s)=>{rail(s,P(1.98,1.86,1),P(2.34,1.86,1),3,'#7b5c40',5);rail(s,P(1.98,1.86,1),P(1.98,2.12,1),3,'#7b5c40',5);rail(s,P(2.34,1.86,1),P(2.34,2.12,1),3,'#7b5c40',5);});
          hide(S,3.1,1.02,.32,.24);
          S.o(.6+.5,(s)=>{for(let k=0;k<7;k++){const u=.45+k*.07,v=.62+k*.05,p=P(u,v,0);L.ell(s,p[0],p[1]-1,3,2,k%2?'#9d998f':'#bdb9ae');}RC(s,P(.55,.7,0)[0],P(.55,.7,0)[1]-1,3,1,'#e8f4f2');});
          for(const[u,v,sc]of[[1.0,.9,1],[.78,1.6,.8],[3.05,1.6,1],[3.35,2.2,.8],[2.6,3.1,.9],[.95,2.2,.8]])reeds(S,u,v,-2,rnd(u*57+v*13),5,1);
          woods(S,[[.14,.2,1.2,2],[.5,.14,1,9],[1.1,.15,1.1,0],[1.8,.12,.9,9],[2.5,.15,1.1,1],[3.2,.16,1,2],[3.8,.3,1.1,9],[3.84,1.0,1,0],[3.86,1.7,.9,9],[3.84,2.5,1.1,2],[.15,.9,1,9],[.14,1.6,1.1,1],[.16,2.4,.9,2],[.2,3.3,1,0],[3.82,3.4,.9,1],[1.2,3.82,.9,9]]);
          signB(S,.45,3.2);bench(S,1.0,3.3);edges(S);
          return{fence:false};
        },
        // v2 水平潛流礫石濕地（HSSF）：雙礫石床成排蘆葦、進出流卵石區、穿孔配水管與檢查豎管、前處理化糞槽（人孔蓋）、控制箱、拋光水池、碎石維修道與工作車、圍籬
        (g,ng,S)=>{
          const beds=[[.5,.55,3.5,1.5],[.5,1.85,3.5,2.8]];
          const bed=(u,v)=>{for(let k=0;k<2;k++){const[a,b,c,d]=beds[k];if(u>a&&u<c&&v>b&&v<d)return{k,a,b,c,d};}return null;};
          const pond=(u,v)=>ellD(u,v,2.2,3.35,.6,.28);
          const zf=(u,v)=>{const q=bed(u,v);if(q){const inset=Math.min(u-q.a,q.c-u,v-q.b,q.d-v);if(inset<.06)return 4;
              if(u<q.a+.28||u>q.c-.24)return 3;return (rnd(v*16)%4)!==3?pz(PL.row,u,v,3,1620+q.k):3;}
            const pd=pond(u,v);if(pd>0)return pd>.1?-3:-2+(-1*pd/.1);return 0;};
          const cf=(u,v,z,gu,gv,i,j)=>{const q=bed(u,v),{s}=LU(gu,gv);
            if(q){const inset=Math.min(u-q.a,q.c-u,v-q.b,q.d-v);if(inset<.06)return s>1?tone(CT5,gu,gv):'#d9d5cb';if(u<q.a+.28||u>q.c-.24)return riprap(i,j,1621);
              return (Math.floor(v*16)%4)!==3?pcol(PL.row,gu,gv,i,j,1622):gravel(i,j,1623);}
            if(s>1.3)return tone(CT5,gu,gv);
            const pd=pond(u,v);if(pd>.04)return water(i,j,1624,WW);if(pd>-.06)return pcol(PL.sedge,gu,gv,i,j,1625);
            if(v>1.55&&v<1.8&&u>.3&&u<3.75)return gravel(i,j,1626);if(u>3.55&&v>.4&&v<3.0)return gravel(i,j,1627);
            if(u>.28&&u<1.25&&v>2.98&&v<3.65)return (i%6===0||j%6===0)?'#bfbbb1':'#cfcbc1';return grassT(i,j,1628);};
          terrain(S,0,0,4,4,1/16,zf,cf);
          // 配水管＋檢查豎管
          for(const[a,b,c,d]of beds){S.t(a+b+.2,(s)=>{BL(s,P(a+.14,b+.08,4),P(a+.14,d-.08,4),'#e8ecee');BL(s,P(a+.14,b+.08,5),P(a+.14,d-.08,5),'#b9c1c5');});
            for(const[u,v]of[[a+.14,b+.12],[a+.14,d-.12],[c-.12,b+.12],[c-.12,d-.12],[(a+c)/2,(b+d)/2]])S.o(u+v+.02,(s)=>{const p=P(u,v,3);cyl(s,p[0],p[1],2,6,['#c9cfd2','#f1f3f4','#dfe3e5','#b9c1c5'],'#8e979c','#eef1f2');});}
          // 前處理槽（人孔）＋控制箱
          S.t(1.25+3.65,(s)=>{for(const[u,v]of[[.5,3.18],[.82,3.18],[.5,3.45],[.82,3.45]]){const p=P(u,v,0);ell(s,p[0],p[1],4,2,'#6f7478');ell(s,p[0],p[1],3,1,'#8e9396');RC(s,p[0]-1,p[1],3,1,'#5a5f63');}});
          S.o(1.05+3.3+.2,(s,n)=>{boxZ(s,1.02,3.22,.16,.2,0,7,'#c9ced1','#dde1e3','#a9b0b4');winL(s,1.05,3.42,1,3,4,'#8e979c');RC(s,P(1.1,3.42,6)[0],P(1.1,3.42,6)[1],1,1,'#58cf96');if(n)RC(n,P(1.1,3.42,6)[0],P(1.1,3.42,6)[1],1,1,'#7dffc0');});
          S.o(3.7+2.9,(s)=>{boxZ(s,3.58,2.6,.28,.3,0,8,'#9aa3a8','#dfe3e5','#b4bcc0');winL(s,3.62,2.9,0,5,6,'#6b7479');L.flat(s,3.6,2.62,.24,.26,'#8e979c',8);});
          truck(S,3.62,1.2,false,'#e8ecee');
          for(const[u,v]of[[1.6,3.1],[2.8,3.2],[2.0,3.6]])reeds(S,u,v,-2,rnd(u*41+v*7),5,0);
          woods(S,[[.15,.25,1,9],[.14,1.0,.9,2],[.16,1.7,1,9],[.15,2.5,.9,0],[3.84,.2,.9,1],[1.6,3.82,.8,2],[2.9,3.8,.9,0],[3.8,3.5,.9,9]]);
          lamp(S,.4,1.7);lamp(S,3.5,1.7);L.sign(S,1.5,3.86,'#2f6fb0');edges(S);
          return{fence:true,gate:[.3,.44]};
        },
        // v3 階梯式跌水濕地：三級抬升濕地池（蘆葦→香蒲睡蓮→莎草）逐級溢流、石砌擋牆與跌水口、側邊石階步道、底部親水觀景木平台、林帶
        (g,ng,S)=>{
          const ter=[[.55,.45,3.45,1.3,10],[.55,1.4,3.45,2.3,6],[.55,2.4,3.45,3.3,2]],sp=['reed','cat','sedge'];
          const tI=(u,v)=>{for(let k=0;k<3;k++){const[a,b,c,d]=ter[k];if(u>=a&&u<=c&&v>=b&&v<=d)return k;}return -1;};
          const notch=(k,u)=>Math.abs(u-[1.3,2.6,1.9][k])<.1;
          const zf=(u,v)=>{const k=tI(u,v);if(k<0){if(u>.4&&u<.55&&v>.45&&v<3.3)return rnd(10-(v-.45)/(3.3-.45)*9);return 0;}
            const[a,b,c,d,zt]=ter[k],inset=Math.min(u-a,c-u,v-b,d-v),WL=zt-1;
            if(inset<.07)return (v>d-.07&&notch(k,u))?WL:zt;
            const band=(v-b)/(d-b);if(k===1&&band>.6)return WL;if(k===2&&u>2.4)return WL;
            return (hsh(1630+k,rnd(u*3.5),rnd(v*3.5))<.25)?WL:pz(PL[sp[k]],u,v,WL,1631+k);};
          const cf=(u,v,z,gu,gv,i,j)=>{const k=tI(u,v),{rel,s}=LU(gu,gv);
            if(k<0){if(u>.4&&u<.55&&v>.45&&v<3.3)return s>1?tone(GB5,gu,gv):((i+j)%3?'#bdb6a4':'#a9a290');if(u>.25&&u<3.7&&v>.3&&v<3.45)return gravel(i,j,1634);return grassT(i,j,1635);}
            const[a,b,c,d,zt]=ter[k],inset=Math.min(u-a,c-u,v-b,d-v);
            if(s>1.3&&inset<.1){if(v>d-.1&&notch(k,u))return (j+i)%2?'#e8f4f2':'#9fd0cc';const base=tone(GB5,gu,gv);return (i%3===0||j%4===0)?SH(base,-20):base;}
            if(inset<.07)return (v>d-.07&&notch(k,u))?water(i,j,1636,WW):'#a9a290';
            const band=(v-b)/(d-b);if(k===1&&band>.6)return lily(i,j,1637);if(k===2&&u>2.4)return water(i,j,1638,WW);
            if(z<=zt-1+.2)return water(i,j,1639,WW);return pcol(PL[sp[k]],gu,gv,i,j,1640+k);};
          terrain(S,0,0,4,4,1/16,zf,cf);
          for(let k=0;k<3;k++){const[a,b,c,d,zt]=ter[k],nu=[1.3,2.6,1.9][k];S.t(nu+d+.12,(s)=>{const p=P(nu-.06,d+.02,zt-1);for(let r=0;r<zt;r++){RC(s,p[0]+rnd(r*.2),p[1]+r,5,1,r%3===0?'#f4fbfa':r%3===1?'#b5dcdc':'#8fc7c7');}
              const q=P(nu-.1,d+.06,0);ell(s,q[0]+4,q[1]+1,5,2,'#d6eeee');});}
          deckU(S,.7,1.7,3.42,.14,1);
          for(const[u,v]of[[3.3,.6],[3.3,1.1],[.7,.6],[3.3,1.55],[.7,2.0],[3.3,2.55]])reeds(S,u,v,[10,6,2][tI(u,v)]-1,rnd(u*23+v*37),5,1);
          woods(S,[[.15,.2,1.1,9],[.14,.8,1,2],[.16,1.5,1.1,0],[.15,2.2,.9,9],[.18,2.9,1,1],[1.2,.14,1,2],[2.1,.15,.9,9],[3.0,.14,1.1,0],[3.84,.5,1,1],[3.86,1.3,.9,9],[3.84,2.1,1.1,2],[3.84,2.9,.9,0],[3.4,3.8,.9,1]]);
          signB(S,2.2,3.55);bench(S,2.6,3.5);lamp(S,1.9,3.55);edges(S);
          return{fence:false};
        },
        // v4 濕地公園與環境教育中心：木構教育館（斜屋頂太陽能板＋觀景露台）、中央開放水池與蘆葦環帶、長木棧道通往圓形觀景平台、野花草甸、鳥巢柱、停車場
        (g,ng,S)=>{
          const WL=-2,pd=(u,v)=>ellD(u,v,2.25,1.55,1.3,1.05);
          const zf=(u,v)=>{const d=pd(u,v);if(d>.32)return WL;if(d>.1)return pz(hsh(1650,rnd(u*2),rnd(v*2))<.5?PL.reed:PL.cat,u,v,WL,1651);if(d>0)return WL;if(d>-.18)return pz(PL.sedge,u,v,-2,1652);return 0;};
          const cf=(u,v,z,gu,gv,i,j)=>{const d=pd(u,v);
            if(d>.32)return (d<.5&&hsh(1653,rnd(u*4),rnd(v*4))<.3)?lily(i,j,1654):water(i,j,1655,WW);
            if(d>.1)return pcol(hsh(1650,rnd(u*2),rnd(v*2))<.5?PL.reed:PL.cat,gu,gv,i,j,1656);if(d>0)return water(i,j,1657,WW);if(d>-.18)return pcol(PL.sedge,gu,gv,i,j,1658);
            if(u>1.5&&u<2.75&&v>3.22&&v<3.85)return (i%5===0&&v<3.6)?'#dedad0':'#7b7872';
            if((u>2.12&&u<2.38&&v>2.55&&v<3.25)||(u>1.35&&u<2.4&&v>3.02&&v<3.22))return paver(i,j);
            const t=hsh(1659,i,j*64+11);return t<.014?'#f0d060':t<.024?'#e87a9a':t<.031?'#f4f2f8':t<.11?'#6f9a4e':'#7fa85b';};
          terrain(S,0,0,4,4,1/16,zf,cf);
          deckV(S,1.95,2.62,2.2,.14,1);
          S.o(2.27+1.85,(s)=>{const c=P(2.27,1.72,0),x=rnd(c[0]),y=rnd(c[1]);ell(s,x,y,15,7,'#86663f');ell(s,x,y-1,15,7,'#c49a6a');ell(s,x,y-1,13,6,'#b08a5e');for(let k=-12;k<=12;k+=3)RC(s,x+k,y-1-L.hx(15,7,k)+1,1,L.hx(15,7,k)*2-1,'#9c7a50');});
          S.t(2.27+1.72+.3,(s)=>{const c=P(2.27,1.72,0),x=rnd(c[0]),y=rnd(c[1]);for(let a=0;a<28;a++){const t=a/28*Math.PI*2;if(Math.sin(t)>-.1||true){const px=x+rnd(Math.cos(t)*15),py=y-1+rnd(Math.sin(t)*7);RC(s,px,py-3,1,3,'#7b5c40');}}
            L.arcF(s,x,y-4,15,7,'#9a7650');L.arcB(s,x,y-4,15,7,'#9a7650');});
          // 教育館
          S.o(.35+2.9+1.1,(s,n)=>{const u0=.35,v0=2.9,du=1.0,dv=.55,h=12,um=u0+du/2;boxZ(s,u0,v0,du,dv,0,h,'#b08a5e','#c79e6c','#96744c');
            for(let t=u0+.05;t<u0+du;t+=.05)BL(s,P(t,v0+dv,1),P(t,v0+dv,h-1),'#b48b5c');
            rowL(s,n,u0+.05,u0+du-.05,v0+dv,3,6,6,3,'#4f7896',1660,.8,'#6e5238');rowR(s,n,u0+du,v0+.05,v0+dv-.05,4,4,5,3,'#4f7896',1661,.7);
            fp(s,[P(u0-.04,v0-.04,h),P(u0+du+.04,v0-.04,h),P(u0+du+.04,v0+dv*.5,h+7),P(u0-.04,v0+dv*.5,h+7)],'#55606a');
            fp(s,[P(u0+du,v0,h),P(u0+du,v0+dv,h),P(u0+du,v0+dv*.5,h+7)],'#96744c');
            fp(s,[P(u0-.04,v0+dv*.5,h+7),P(u0+du+.04,v0+dv*.5,h+7),P(u0+du+.04,v0+dv+.04,h-1),P(u0-.04,v0+dv+.04,h-1)],'#2f5878');
            for(let t=u0+.08;t<u0+du;t+=.12)BL(s,P(t,v0+dv*.5+.02,h+6),P(t,v0+dv+.02,h),'#6a96b8');BL(s,P(u0-.04,v0+dv*.5,h+7),P(u0+du+.04,v0+dv*.5,h+7),'#8fb4d0');
            boxZ(s,u0+du*.55,v0-.2,.4,.2,2,1,'#b08a5e','#c49a6a','#86663f');});
          S.t(.35+2.7+1.4,(s)=>{rail(s,P(.9,2.7,3),P(1.3,2.7,3),3,'#7b5c40',5);rail(s,P(1.3,2.7,3),P(1.3,2.9,3),3,'#7b5c40',5);});
          for(const[u,v,c]of[[1.62,3.3,'#c9cdd0'],[1.9,3.3,'#3d5f8a'],[2.35,3.3,'#b8433a']])car(S,u,v,false,c);
          for(const[u,v]of[[3.3,.55],[.7,1.0]])S.t(u+v+.05,(s)=>{const p=P(u,v,0);RC(s,p[0],p[1]-16,1,16,'#6e5238');RC(s,p[0]-2,p[1]-18,5,2,'#8a6a48');RC(s,p[0]-1,p[1]-19,3,1,'#5e4630');});
          signB(S,1.45,3.1);signB(S,2.5,2.6);bench(S,1.6,3.05);lamp(S,1.4,3.2);lamp(S,2.7,3.2);lamp(S,2.1,2.5);
          woods(S,[[.15,.2,1.1,9],[.6,.14,1,2],[1.3,.15,1.1,0],[2.0,.14,.9,9],[2.7,.15,1.1,1],[3.4,.14,1,2],[3.84,.6,1,9],[3.86,1.4,1.1,0],[3.84,2.2,.9,2],[3.84,3.0,1.1,1],[3.5,3.6,1,9],[.14,.9,1,2],[.16,1.6,.9,9],[.15,2.3,1,0],[3.0,3.75,.9,2]]);
          edges(S);
          return{fence:false};
        },
      ];
    };
    const lay=[0,1,2,3,4].map(i=>(g,ng,S,L,K)=>K160(L)[i](g,ng,S));
    build(160,lay,5);
  }catch(e){console.error('infra575 k160',e);errs.push('k160:'+(e&&e.stack||e));}

  if(DEV_THROW&&errs.length)throw new Error(errs.join(' | '));
});
