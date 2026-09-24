// T635 探針：施工中的超街區。種子城住宅近景（z=2，rot 0），把視野內的超街區設成升起期（age 5），閥門 __noBlockConstr635 開關各拍一張：
//   ① 施工疊層（T599 鷹架層、T168 鷹架網）畫幾次、切片在分段裁切裡畫幾次；② 修前修後差異像素；③ 完工狀態（age 還原）修前修後差異像素（應為 0）。
// 用法：node probe635.js [--shots=shots635/T635]
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
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(500);
    return await ev(`(()=>{const O=GV.block559.origin,B=[];for(let y=6;y<20;y++)for(let x=6;x<20;x++){const t=GV.tile(x,y);if(!t||!t.bld||t.bld.ref||t.bld.k<1||t.bld.k>3)continue;const o=O(x,y);if(o&&o.w*o.h>=2)B.push({x,y,w:o.w,h:o.h});}
      const cv=document.getElementById('game'),c=cv.getContext('2d');
      const shot=(valve)=>{window.__noBlockConstr635=valve;GV.lookAt(12,12);GV.art574.zoom574(2);GV.setVisT(GV.art574.cycle574()*.5);window.__t599Constr=0;window.__t635Clip=0;window.__t635Net=0;window.__t635Sil=0;GV.forceDraw();
        return {ov:window.__t599Constr|0,clip:window.__t635Clip|0,net:window.__t635Net|0,sil:window.__t635Sil|0,d:c.getImageData(0,0,cv.width,cv.height).data.slice(),u:cv.toDataURL('image/png')};};
      const diff=(a,b)=>{let n=0;for(let i=0;i<a.length;i+=4)if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>8)n++;return n;};
      const olds=B.map(b=>GV.testAge635(b.x,b.y,b.w,b.h,5));
      const strips=B.reduce((s,b)=>s+b.w+b.h-1,0);
      const Cn=shot(false),Co=shot(true);
      B.forEach((b,i)=>{let j=0;for(let dy=0;dy<b.h;dy++)for(let dx=0;dx<b.w;dx++)GV.testAge635(b.x+dx,b.y+dy,1,1,olds[i][j++]);});
      const Dn=shot(false),Do=shot(true);window.__noBlockConstr635=false;
      return {blocks:B.length,strips,constr:{ovNew:Cn.ov,ovOld:Co.ov,clipNew:Cn.clip,clipOld:Co.clip,netNew:Cn.net,netOld:Co.net,silNew:Cn.sil,diff:diff(Cn.d,Co.d),uN:Cn.u,uO:Co.u},done:{diff:diff(Dn.d,Do.d)}};})()`);
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const q = r.result;
  if (SHOTS) for (const [tag, u] of [['old', q.constr.uO], ['new', q.constr.uN]]) { const dest = path.resolve(ROOT, `${SHOTS}_home_constr_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); }
  console.log(`① 住宅近景 ${q.blocks} 塊超街區（共 ${q.strips} 條分段）設成升起期：施工疊層 修正前 ${q.constr.ovOld} 次 → 修正後 ${q.constr.ovNew} 次；切片在裁切裡畫 ${q.constr.clipOld} → ${q.constr.clipNew} 次`);
  console.log(`   T168 鷹架網 修正前 ${q.constr.netOld} 次 → 修正後 ${q.constr.netNew} 次（其中剪進剪影 ${q.constr.silNew}）`);
  console.log(`② 施工中修前修後差異 ${q.constr.diff} 像素`);
  console.log(`③ 完工狀態修前修後差異 ${q.done.diff} 像素（應為 0）`);
  const pass = q.constr.ovNew === q.blocks && q.constr.ovOld === q.strips && q.constr.clipNew === q.strips && q.constr.clipOld === 0 && q.constr.netNew === q.blocks && q.constr.netOld === q.strips && q.constr.silNew === q.blocks && q.constr.diff > 0 && q.done.diff === 0;
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
