// T671 守衛：倫敦馬廄（住宅 lv1 v=5，ukMews）的煙囪冒煙點。
//   精靈：馬廄 1 個冒煙點、點下方是煙囪帽色 #a35a37；關閥門 __noMewsSmoke671 回到 0 個；開關閥門精靈像素相同。
//   其他 5 種英式立面：冒煙點開關閥門完全相同。
//   種子城：住宅 lv1 v=5、是街區起點、畫出來是馬廄的格子，冒煙點查詢 smokeViewSrc626（畫煙用的同一條）每格 ≥1、關閥門全部 0。
// 用法：node probe671.js   退出碼 0＝守衛成立
'use strict';
const { withGame, sleep } = require('./harness.js');

(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    const spr = await ev(`(()=>{const B=GV.block559,sv=window.__noMewsSmoke671,sf=window.__facadeForce577,o={};
      const hash=s=>{const d=s.img.getContext('2d').getImageData(0,0,s.img.width,s.img.height).data;let h=2166136261>>>0;for(let i=0;i<d.length;i++){h^=d[i];h=Math.imul(h,16777619)>>>0;}return h;};
      const rgb=(s,x,y)=>{const d=s.img.getContext('2d').getImageData(x,y,1,1).data;return '#'+[d[0],d[1],d[2]].map(n=>n.toString(16).padStart(2,'0')).join('');};
      const mk=(off,bw,bh)=>{window.__noMewsSmoke671=off;B.cache().clear();return B.make(1,1,bw,bh,5);};
      try{
        o.mews=[];for(const [bw,bh] of [[1,1],[2,1],[3,1],[2,2]]){const a=mk(false,bw,bh),b=mk(true,bw,bh);const pa=a.smoke608||[],pb=b.smoke608||[];
          o.mews.push({bw,bh,sty:a.__t547&&a.__t547.sty,on:pa.length,off:pb.length,below:pa.map(p=>rgb(a,p[0],p[1]+1)),same:hash(a)===hash(b)});}
        o.others=[];for(const nm of ['ukTerrace','ukSemi','ukVictorian','ukMansion','ukHighStreet']){window.__facadeForce577=nm;
          const a=mk(false,3,1),b=mk(true,3,1);o.others.push({nm,on:JSON.stringify(a.smoke608||[]),off:JSON.stringify(b.smoke608||[]),n:(a.smoke608||[]).length});}
      }finally{window.__noMewsSmoke671=sv;window.__facadeForce577=sf;B.cache().clear();}
      return o;})()`);
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}GV.setSpeed(0);return 1;})()`);
    await sleep(600);
    const city = await ev(`(()=>{const sv=window.__noMewsSmoke671,o={tiles:0,on:0,off:0,onZero:0};
      try{const L=[];for(let y=0;y<250;y++){if(!GV.tile(0,y))break;for(let x=0;x<250;x++){const t=GV.tile(x,y),b=t&&t.bld;if(!(b&&!b.ref&&b.k===1&&(b.lv|0)===1&&(b.v|0)===5))continue;const blk=GV.block559.origin(x,y);if(!blk){o.notOrigin=(o.notOrigin|0)+1;continue;}const sp=GV.block559.get(1,1,blk.w||1,blk.h||1,5);if(String(sp&&sp.__t547&&sp.__t547.sty).indexOf('ukMews')<0){o.notMews=(o.notMews|0)+1;continue;}L.push([x,y,b]);}}
        o.tiles=L.length;
        window.__noMewsSmoke671=false;GV.block559.cache().clear();for(const [x,y,b] of L){const n=(GV.smokeViewSrc626(x,y,b)||[]).length;o.on+=n;if(!n)o.onZero++;}
        window.__noMewsSmoke671=true;GV.block559.cache().clear();for(const [x,y,b] of L)o.off+=(GV.smokeViewSrc626(x,y,b)||[]).length;
      }finally{window.__noMewsSmoke671=sv;GV.block559.cache().clear();}return o;})()`);
    return { spr, city };
  });
  const q = r.result;
  if (!q) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  for (const m of q.spr.mews) console.log(`馬廄 ${m.bw}×${m.bh}（${m.sty}）：冒煙點 新 ${m.on}／舊 ${m.off}；點下方 ${m.below.join(',') || '-'}；像素相同 ${m.same}`);
  for (const o of q.spr.others) console.log(`${o.nm}：冒煙點 ${o.n}；開關閥門相同 ${o.on === o.off}`);
  console.log(`種子城住宅 lv1 v=5：不是起點 ${q.city.notOrigin|0} 格、起點但不是馬廄 ${q.city.notMews|0} 格、馬廄起點 ${q.city.tiles} 格：冒煙點 新 ${q.city.on}（0 個的 ${q.city.onZero} 格）／舊 ${q.city.off}`);
  const mews = q.spr.mews.filter(m => String(m.sty).indexOf('ukMews') >= 0);
  const checks = [
    ['馬廄精靈（' + mews.length + ' 種尺寸）修後都有冒煙點、點下方都是 #a35a37', mews.length > 0 && mews.every(m => m.on >= 1 && m.below.every(c => c === '#a35a37'))],
    ['關閥門回到 0 個冒煙點（原病）', mews.every(m => m.off === 0)],
    ['開關閥門馬廄精靈像素相同', mews.every(m => m.same)],
    ['其他 5 種英式立面冒煙點開關閥門相同', q.spr.others.every(o => o.on === o.off)],
    ['種子城馬廄起點格每格都有冒煙點、關閥門全部 0', q.city.tiles > 0 && q.city.onZero === 0 && q.city.off === 0],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = r.ok && checks.every(c => c[1]);
  console.log(ok ? 'OK T671 守衛成立' : 'X T671 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
