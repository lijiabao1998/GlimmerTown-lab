// T653 守衛（精靈層，不進城）：
//   ① k1 lv2 2×4 v10（後棟平頂樓的窗燈亮在前棟紅瓦屋頂上的那一張）：夜圖燈像素落在紅色面（R > G+40、R > B+40）上的，新版比關閥門（__noOccWin653）少九成以上；
//   ② 抽樣 k1～k3 × lv1～3 × 5 種尺寸 × v 0/3/6/9：逐張記夜圖燈像素（α>0）新舊數量，減少超過一半的列出來（要看圖確認不是誤擦），另存那幾張的新舊對照；
//   ③ 同一批精靈新舊各建一次的時間（只記不判）。
// 用法：node probe653.js [--shots=shots653/T653]   退出碼 0＝①成立
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    return await ev(`(()=>{const sv=window.__noOccWin653,o={rows:[],big:[]};
      const stat=s=>{const g=s.img.getContext('2d').getImageData(0,0,s.img.width,s.img.height).data,n=s.night.getContext('2d').getImageData(0,0,s.night.width,s.night.height).data;let lit=0,red=0;for(let i=0;i<n.length;i+=4)if(n[i+3]>0){lit++;if(g[i]>g[i+1]+40&&g[i]>g[i+2]+40)red++;}return {lit,red};};
      const pair=(k,lv,w,h,v,keep)=>{window.__noOccWin653=true;const so=GV.makeBlockSprite547(k,lv,w,h,v);window.__noOccWin653=false;const sn=GV.makeBlockSprite547(k,lv,w,h,v);const a=stat(so),b=stat(sn);
        let url=null;if(keep){const W=so.img.width,H=so.img.height,c=document.createElement('canvas');c.width=W*2;c.height=H;const q=c.getContext('2d');q.fillStyle='#101428';q.fillRect(0,0,W*2,H);q.globalAlpha=.35;q.drawImage(so.img,0,0);q.drawImage(sn.img,W,0);q.globalAlpha=1;q.drawImage(so.night,0,0);q.drawImage(sn.night,W,0);url=c.toDataURL();}
        return {key:[k,lv,w,h,v].join('_'),old:a,nw:b,url};};
      try{const t0=pair(1,2,2,4,10,${!!SHOTS});o.target=t0;
        for(const k of [1,2,3])for(const lv of [1,2,3])for(const [w,h] of [[1,1],[2,1],[1,2],[2,2],[3,2]])for(const v of [0,3,6,9]){const p=pair(k,lv,w,h,v,false);o.rows.push([p.key,p.old.lit,p.nw.lit]);}
        const ks=[];for(const k of [1,2,3])for(const lv of [1,2,3])for(const [w,h] of [[2,2],[3,2]])for(const v of [0,6])ks.push([k,lv,w,h,v]);
        for(const [lab,off] of [['old',true],['new',false],['old2',true],['new2',false]]){window.__noOccWin653=off;const t=performance.now();for(const a of ks)GV.makeBlockSprite547(...a);o['ms_'+lab]=+(performance.now()-t).toFixed(0);}
        o.nBuild=ks.length;
      }finally{window.__noOccWin653=sv;}
      for(const r of o.rows)if(r[1]>0&&r[2]<r[1]*.5)o.big.push(r);
      return o;})()`);
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  if (q.target.url) { const dest = path.join(ROOT, `${SHOTS}_k1_lv2_2x4_v10.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(q.target.url.split(',')[1], 'base64')); console.log('樣張 ' + path.relative(ROOT, dest)); }
  const T = q.target, sumO = q.rows.reduce((a, r) => a + r[1], 0), sumN = q.rows.reduce((a, r) => a + r[2], 0);
  console.log(`① ${T.key}：燈像素 新 ${T.nw.lit}／舊 ${T.old.lit}；落在紅色面上 新 ${T.nw.red}／舊 ${T.old.red}`);
  console.log(`② 抽樣 ${q.rows.length} 張：燈像素總數 新 ${sumN}／舊 ${sumO}（${(100 - sumN / Math.max(1, sumO) * 100).toFixed(1)}% 被擦）；減少超過一半 ${q.big.length} 張：${q.big.map(r => r[0] + '(' + r[2] + '/' + r[1] + ')').join(' ')}`);
  console.log(`③ 建 ${q.nBuild} 張精靈：新 ${q.ms_new}/${q.ms_new2} ms、舊 ${q.ms_old}/${q.ms_old2} ms（只記不判）`);
  const checks = [[`① 紅色面上的燈 新 ${T.nw.red} < 舊 ${T.old.red} 的一成`, T.old.red > 0 && T.nw.red < T.old.red * 0.1]];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T653 守衛成立' : 'X T653 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
