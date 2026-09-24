// T632 探針：旋轉 180°（rot 2）時街道蒸汽、其他粒子往哪飄。種子城商業區（看 (24,24)、z=2、正午），閥門 __noPartView632 開關各跑一次：
//   推進 5 秒讓人孔蓋冒蒸汽，再追蹤同一批粒子 0.3 秒後在畫面上的位移（GV.fxLive632 取活的粒子物件），
//   蒸汽要往上（y 位移為負）；修正前 rot 2 會往下。並存修前修後樣張。
// 用法：node probe632.js [--shots=shots632/T632]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
(async () => {
  const r = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';GV.setSpeed(0);return 1;})()`);
    await sleep(600);
    const out = {};
    for (const [tag, off] of [['new', false], ['old', true]]) {
      out[tag] = await ev(`(()=>{window.__noPartView632=${off};GV.setRot(2);GV.lookAt(24,24);GV.art574.zoom574(2);GV.advanceN(.05,100);GV.setVisT(GV.art574.cycle574()*.5);
        const L=GV.fxLive632(),pos=p=>p.view632?[p.wx,p.wy]:null;const iso=(p)=>{const a=pos(p);if(a)return a;return null;};
        // 舊式粒子沒有 view 座標：用畫面上的位置差（同一個物件 0.3 秒前後各轉一次）
        const cam=GV.camera436(),z=cam.z,W=document.getElementById('game').width,H=document.getElementById('game').height;
        const scr=p=>{const v=p.view632?[p.wx,p.wy]:GV.isoW2Vt632(p.wx,p.wy,GV.fxOff632(p.ty));return v;};
        const before=new Map();for(const p of L)before.set(p,scr(p));
        GV.advanceN(.05,6);GV.forceDraw();
        const d={};for(const p of GV.fxLive632()){if(!before.has(p))continue;const a=before.get(p),b=scr(p),t=p.ty;d[t]=d[t]||{n:0,dy:0};d[t].n++;d[t].dy+=b[1]-a[1];}
        for(const t in d)d[t].dy=+(d[t].dy/d[t].n).toFixed(2);
        return {d,u:document.getElementById('game').toDataURL('image/png')};})()`);
    }
    await ev(`(()=>{window.__noPartView632=false;GV.setRot(0);return 1;})()`);
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const res = r.result;
  if (SHOTS) for (const tag of ['new', 'old']) { const dest = path.resolve(ROOT, `${SHOTS}_rot2_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(res[tag].u.split(',')[1], 'base64')); }
  const st = t => res[t].d.steam || { n: 0, dy: 0 };
  console.log(`rot 2 街道蒸汽 0.3 秒位移：修正後 ${st('new').n} 顆、平均 y ${st('new').dy}（負＝往上）｜修正前 ${st('old').n} 顆、平均 y ${st('old').dy}`);
  console.log('其他粒子（修正後）：' + JSON.stringify(res.new.d) + '｜（修正前）：' + JSON.stringify(res.old.d));
  const pass = st('new').n > 0 && st('new').dy < 0 && st('old').n > 0 && st('old').dy > 0;
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
