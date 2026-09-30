// T701 守衛：地標專屬施工（巴特西 k192、大笨鐘 k190）。種子城 5162026、__waterF695=0，種巴特西 (48,24) 2×2、大笨鐘 (56,19)，清掉附近的樹與大笨鐘後方噴泉。
//   每座：① 施工中（P5.8）新版對閥門 __noConstr701（＝T700 通用施工）不同；② 暖機 6 幀後畫面穩定；③ 專屬施工沒有例外（__x13BesErr 空）；
//   ④ P8.999 對完工只差完工才亮的街燈（≤800 px）；⑤ 夜燈第③級（預設）在 P3.6／5.8／7.2：每個燈框底下都有工地自己的像素（浮空 0 px），投光燈光池亮到的像素都在地塊菱形內。
//   另跑幾何自檢 __x13BesSelfCheck（吊臂、道具、吊桿不穿塔、跟 T700 的包裝）與煙霧自檢 constrSelftest701。
// 用法：node probe701.js   退出碼 0＝守衛成立
'use strict';
const { withGame, sleep } = require('./harness.js');
const SEED = `(()=>{window.__waterF695=0;GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);
  window.__live=(x,y)=>{let got=null;Object.defineProperty(Object.prototype,'toJSON',{configurable:true,writable:true,value:function(){if(!got)got=this;return null;}});try{GV.tile(x,y);}finally{delete Object.prototype.toJSON;}return got;};
  GV.art574.plant574([{x:48,y:24,k:192,v:0,sz:2}]);GV.art574.plant574([{x:56,y:19,k:190,v:0,sz:1}]);
  for(let y=14;y<36;y++)for(let x=44;x<70;x++){const t=__live(x,y);if(t&&t.tree)t.tree=0;}
  for(let y=14;y<=19;y++)for(let x=51;x<=56;x++){if(x===56&&y===19)continue;const t=__live(x,y);if(t&&t.deco)t.deco=0;}
  window.__x13NoQ=1;window.__setP=(x,y,p)=>{const t=__live(x,y);if(t&&t.bld)t.bld.age=p>=9?9:Math.floor(p);window.__x13Frac=p>=9?null:p-Math.floor(p);};
  window.__fd=k=>{for(let i=0;i<(k||1);i++){GV.forceDraw();if(GV.constr13&&GV.constr13.pending())GV.constr13.flush();}};return 1;})()`;
const LM = [['battersea', 48, 24, 2, 49, 25], ['bigben', 56, 19, 1, 54, 17]];
const mkEv = cdp => async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
  if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
const DAY = (x, y, lx, ly) => `(()=>{const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height,snap=()=>g.getImageData(0,0,W,H).data,diff=(a,c)=>{let n=0;for(let i=0;i<a.length;i+=4)if(a[i]!==c[i]||a[i+1]!==c[i+1]||a[i+2]!==c[i+2])n++;return n;};
  window.__noSignal=true;window.__x13BesErr=null;GV.lookAt(${lx},${ly});GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);__setP(${x},${y},5.8);
  window.__noConstr701=true;__fd(6);const v=snap();window.__noConstr701=false;__fd(6);const n1=snap();__fd(1);const n2=snap();const err=window.__x13BesErr;
  __setP(${x},${y},9);__fd(3);const a9=snap();__setP(${x},${y},8.999);__fd(3);const a8=snap();__setP(${x},${y},30);__fd(1);
  return {diff:diff(v,n1),unstable:diff(n1,n2),err:err?String(err).slice(0,200):null,last:diff(a8,a9)};})()`;
const NIGHT = (x, y, sz, lx, ly, P) => `(()=>{__setP(${x},${y},${P});window.__noSignal=true;GV.lookAt(${lx},${ly});GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.02);__fd(5);
  window.__x13BesNLlog=[];GV.forceDraw();const rects=window.__x13BesNLlog;window.__x13BesNLlog=null;
  const cv=document.getElementById('game'),g=cv.getContext('2d'),W=cv.width,H=cv.height;const L0=g.getImageData(0,0,W,H).data;
  window.__x13BesNoNL=1;GV.forceDraw();const A=g.getImageData(0,0,W,H).data;window.__x13BesNoNL=0;
  window.__x13BesHide=1;GV.forceDraw();const Hd=g.getImageData(0,0,W,H).data;window.__x13BesHide=0;
  let px=0,fl=0;for(const q of rects){const x0=Math.max(0,Math.round(q[0])),y0=Math.max(0,Math.round(q[1])),x1=Math.min(W,Math.round(q[0]+q[2])),y1=Math.min(H,Math.round(q[1]+q[3]));
    for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){const i=(yy*W+xx)*4;px++;if(A[i]===Hd[i]&&A[i+1]===Hd[i+1]&&A[i+2]===Hd[i+2])fl++;}}
  window.__x13BesNoPool=1;GV.forceDraw();const Np=g.getImageData(0,0,W,H).data;window.__x13BesNoPool=0;
  const cam=GV.camera436(),z=cam.z,ox=Math.round(W/2-cam.x*z),oy=Math.round(H/2-cam.y*z),pts=[];
  for(let dy=0;dy<${sz};dy++)for(let dx=0;dx<${sz};dx++){const p=GV.w2v(${x}+dx,${y}+dy),sx=ox+((p[0]-p[1])*32-32)*z,sy=oy+((p[0]+p[1])*16)*z;pts.push([sx+32*z,sy],[sx+64*z,sy+16*z],[sx+32*z,sy+32*z],[sx,sy+16*z]);}
  const Wv=pts.reduce((a,b)=>b[0]<a[0]?b:a),Ev=pts.reduce((a,b)=>b[0]>a[0]?b:a),Sv=pts.reduce((a,b)=>b[1]>a[1]?b:a),Nv=pts.reduce((a,b)=>b[1]<a[1]?b:a),yOn=(a,b,xx)=>a[1]+(b[1]-a[1])*((xx-a[0])/((b[0]-a[0])||1e-6));
  const inLot=(xx,yy)=>{const xc=xx+.5,yc=yy+.5;if(xc<Wv[0]-1||xc>Ev[0]+1)return false;const t=xc<Nv[0]?yOn(Wv,Nv,xc):yOn(Nv,Ev,xc),b=xc<Sv[0]?yOn(Wv,Sv,xc):yOn(Sv,Ev,xc);return yc>=t-1&&yc<=b+1;};
  let pp=0,po=0;for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){const i=(yy*W+xx)*4;if(L0[i]!==Np[i]||L0[i+1]!==Np[i+1]||L0[i+2]!==Np[i+2]){pp++;if(!inLot(xx,yy))po++;}}
  __setP(${x},${y},30);return {rects:rects.length,px,float:fl,pool:pp,poolOut:po};})()`;

(async () => {
  const r = await withGame({ port: 8199, timeout: 900, log: () => {} }, async ({ cdp }) => {
    const ev = mkEv(cdp);
    await ev(SEED); await sleep(700);
    const out = { smoke: await ev('GV.constrSelftest701()') };
    for (const [nm, x, y, sz, lx, ly] of LM) {
      out[nm] = await ev(DAY(x, y, lx, ly));
      out[nm].night = []; for (const P of [3.6, 5.8, 7.2]) out[nm].night.push(await ev(NIGHT(x, y, sz, lx, ly, P)));
    }
    out.geo = await ev('window.__x13BesSelfCheck()');
    return out;
  });
  if (!r.result) { console.log('X', JSON.stringify(r.fails)); process.exit(1); }
  const o = r.result, checks = [];
  console.log('煙霧自檢 constr701：' + (o.smoke.ok ? '綠' : '紅') + '｜' + o.smoke.checks.join('｜'));
  checks.push(['煙霧自檢 constr701 綠', !!o.smoke.ok]);
  for (const [nm] of LM) {
    const q = o[nm], nf = q.night.reduce((a, b) => a + b.float, 0), npo = q.night.reduce((a, b) => a + b.poolOut, 0);
    console.log(`${nm}：P5.8 新舊差 ${q.diff} px｜重畫差 ${q.unstable}｜例外 ${q.err || '無'}｜P8.999 對完工 ${q.last} px｜夜燈第③級 ` + q.night.map(n => `燈框 ${n.rects} 個、浮空 ${n.float}/${n.px}、光池 ${n.pool} px 出地塊 ${n.poolOut}`).join('；'));
    checks.push([`${nm}：施工中新版對閥門版（T700 通用）不同`, q.diff > 500]);
    checks.push([`${nm}：暖機後畫面穩定`, q.unstable === 0]);
    checks.push([`${nm}：沒有例外`, !q.err]);
    checks.push([`${nm}：P8.999 對完工 ≤800 px（完工才亮的街燈）`, q.last <= 800]);
    checks.push([`${nm}：夜燈浮空 0 px、光池不出地塊`, nf === 0 && npo === 0 && q.night.every(n => n.rects > 0)]);
  }
  const bad = o.geo.filter(r => /露出/.test(r[1]) ? !(+r[2] > 0) : !(r[2] === 'ok' || r[2] === 0));
  console.log('幾何自檢 ' + (o.geo.length - bad.length) + '/' + o.geo.length + (bad.length ? '：' + JSON.stringify(bad) : ''));
  checks.push(['幾何自檢全過', bad.length === 0]);
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T701 守衛成立' : 'X T701 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
