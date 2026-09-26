// T670 守衛：種子城工業區 (44,30) z=1、(40,30) z=2 正午（關紅綠燈），新舊（__noIndVariety670）有差異。
//   街區精靈抽樣（k=1/2/3 × lv1–3 × v0–5，2×2）：工業（沒有 T601 物種配色的）每張都變；T601 物種配色的工業原型（mill、warehouse、tankfarm、stack、chimneyHall）照舊（決策單 C 的圖也是）；住宅與商業逐像素不變。--shots 時各存新舊一張。
// 用法：node probe670.js [--shots=shots670/T670]   退出碼 0＝守衛成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const VIEWS = [['mid', 44, 30, 1], ['near', 40, 30, 2]];

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    const spr = await ev(`(()=>{const B=GV.block559,sv=window.__noIndVariety670,h=c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let x=2166136261>>>0;for(let i=0;i<d.length;i++){x^=d[i];x=Math.imul(x,16777619)>>>0;}return x;};
      const run=off=>{window.__noIndVariety670=off;B.cache().clear();const o={};for(const k of [1,2,3])for(let lv=1;lv<=3;lv++)for(let v=0;v<6;v++){const s=B.make(k,lv,2,2,v);o[k+'_'+lv+'_'+v]=s&&s.img?h(s.img):0;}return o;};
      let a,b;try{a=run(false);b=run(true);}finally{window.__noIndVariety670=sv;B.cache().clear();}
      const SP=['mill','mill3','chimneyHall','warehouse','tankfarm','stack'];const res={ind:0,indDiff:0,sp:0,spDiff:0,other:0,otherDiff:0,spNames:[]};
      for(const key in a){const [k,lv,v]=key.split('_').map(Number);const d=a[key]!==b[key];
        if(k===3){const n=(GV.arche568(3,lv,v)||{}).n||'';if(SP.includes(n)){res.sp++;if(d)res.spDiff++;res.spNames.push(n);}else{res.ind++;if(d)res.indDiff++;}}else{res.other++;if(d)res.otherDiff++;}}
      res.spNames=[...new Set(res.spNames)].join('/');return res;})()`);
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const views = [];
    for (const [n, x, y, z] of VIEWS) {
      const q = await ev(`(()=>{const sv=window.__noIndVariety670,sg=window.__noSignal,o={};const cv=document.getElementById('game'),g=cv.getContext('2d');
        try{window.__noSignal=true;GV.lookAt(${x},${y});GV.art574.zoom574(${z});GV.setVisT(GV.art574.cycle574()*.5);
          window.__noIndVariety670=true;GV.block559.cache().clear();GV.testRebake592();GV.forceDraw();const A=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "window.__s670o=cv.toDataURL('image/png');" : ''}
          window.__noIndVariety670=false;GV.block559.cache().clear();GV.testRebake592();GV.forceDraw();const B=g.getImageData(0,0,cv.width,cv.height).data;${SHOTS ? "window.__s670n=cv.toDataURL('image/png');" : ''}
          let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])n++;o.diff=n;
        }finally{window.__noIndVariety670=sv;window.__noSignal=sg;}return o;})()`);
      if (SHOTS) { q.urlOld = await ev('window.__s670o'); q.urlNew = await ev('window.__s670n'); }
      q.name = n; views.push(q);
    }
    return { spr, views };
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const v of q.views) for (const k of ['New', 'Old']) if (v['url' + k]) { const dest = path.join(ROOT, `${SHOTS}_${v.name}_${k.toLowerCase()}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(v['url' + k].split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  console.log(`街區精靈抽樣：工業（無物種配色）${q.spr.indDiff}/${q.spr.ind} 張變｜工業物種配色（${q.spr.spNames}）${q.spr.spDiff}/${q.spr.sp} 張變｜住宅、商業 ${q.spr.otherDiff}/${q.spr.other} 張變`);
  for (const v of q.views) console.log(`${v.name}：差異像素 ${v.diff}`);
  const checks = [
    [`工業（無物種配色）街區精靈每張都變（${q.spr.indDiff}/${q.spr.ind}）`, q.spr.ind > 0 && q.spr.indDiff === q.spr.ind],
    [`T601 物種配色的工業原型（${q.spr.spNames}）照舊（${q.spr.spDiff}/${q.spr.sp}，同決策單 C 的圖）`, q.spr.spDiff === 0],
    [`住宅、商業街區精靈逐像素不變（${q.spr.otherDiff}/${q.spr.other}）`, q.spr.other > 0 && q.spr.otherDiff === 0],
    [`兩個鏡頭新舊有差異`, q.views.every(v => v.diff > 0)],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T670 守衛成立' : 'X T670 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
