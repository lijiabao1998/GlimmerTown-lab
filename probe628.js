// T628 探針：街區精靈快取鍵 v%6 ⇒ 同一座城先看哪裡、長相就不同。
//   ① 順序無關：種子城，同一個鏡頭（住宅近景・白天 (12,12) z=2），用兩種參觀順序把快取暖好再拍，比逐像素差異。
//   ② 影響規模：逛遍全城（5×5 個鏡頭，z=0.75）後，逐塊查「畫出來的精靈是替哪個 v 做的」；
//      和自己的 v 不同的算一塊，其中和自己該有的圖逐像素也不同的，算「看得出來」。
//   ③ 快取張數：逛完 Pages 的 8 個鏡頭後，快取裡有幾張街區精靈。
//   閥門 __noVkey628 開關各跑一次（每次先清快取）。
// 用法：node probe628.js [--shots=shots628/T628]
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const SHOTS = arg('shots', '');
const PAGES = [[36, 36, .75, .5], [36, 36, .75, .02], [36, 36, 1.5, .5], [36, 36, 1.5, .02], [12, 12, 2, .5], [12, 12, 2, .73], [12, 12, 2, .02], [22, 44, .45, .5]];
const HOME = [12, 12, 2, .5];
(async () => {
  const r = await withGame({ port: 8199, timeout: 400, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';GV.setSpeed(0);GV.setRot(0);return 1;})()`);
    await sleep(800);
    const shoot = (v, img) => `(()=>{GV.lookAt(${v[0]},${v[1]});GV.art574.zoom574(${v[2]});GV.setVisT(GV.art574.cycle574()*${v[3]});GV.forceDraw();${img ? "return document.getElementById('game').toDataURL('image/png');" : 'return 1;'}})()`;
    const out = {};
    for (const [tag, off] of [['new', false], ['old', true]]) {
      await ev(`(()=>{window.__noVkey628=${off};GV.block559.cache().clear();return 1;})()`);
      // ① 順序 A：先看住宅，再看港區與遠景，回到住宅拍
      for (const v of [HOME, PAGES[0], PAGES[2], PAGES[7]]) await ev(shoot(v, false));
      const imgA = await ev(shoot(HOME, true));
      // 順序 B：先看港區與遠景，最後才看住宅
      await ev(`(()=>{GV.block559.cache().clear();return 1;})()`);
      for (const v of [PAGES[7], PAGES[2], PAGES[0]]) await ev(shoot(v, false));
      const imgB = await ev(shoot(HOME, true));
      // ③ Pages 順序逛 8 個鏡頭，數快取；同時存樣張
      await ev(`(()=>{GV.block559.cache().clear();return 1;})()`);
      const t0 = Date.now(), pages = [];
      for (const v of PAGES) pages.push(await ev(shoot(v, true)));
      const pagesMs = Date.now() - t0;
      const cacheN = await ev(`GV.block559.cache().size`);
      // ② 逛遍全城，逐塊查
      for (const y of [6, 21, 36, 51, 66]) for (const x of [6, 21, 36, 51, 66]) await ev(shoot([x, y, .75, .5], false));
      const imp = await ev(`(()=>{const B=GV.block559;let blocks=0,wrong=0,visible=0,wrongTiles=0;const kinds={};
        for(let y=0;y<72;y++)for(let x=0;x<72;x++){const t=GV.tile(x,y);const b=t&&t.bld;if(!b||b.ref||b.k<1||b.k>3||(b.sz&&b.sz>=2))continue;
          const o=B.origin(x,y);if(!o)continue;const w=o.w||1,h=o.h||1,v=b.v||0,lv=b.lv||1;blocks++;
          const sp=B.get(b.k,lv,w,h,v);if(!sp||!sp.__t547||sp.__t547.v===v)continue;
          wrong++;wrongTiles+=w*h;const own=B.make(b.k,lv,w,h,v);
          const same=own&&own.img&&sp.img&&own.img.width===sp.img.width&&own.img.height===sp.img.height&&own.img.toDataURL()===sp.img.toDataURL();
          if(!same){visible++;const kk='k'+b.k;kinds[kk]=(kinds[kk]||0)+1;}}
        return {blocks,wrong,visible,wrongTiles,kinds};})()`);
      if (SHOTS) {
        const save = (name, u) => { const dest = path.resolve(ROOT, `${SHOTS}_${name}_${tag}.png`); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(u.split(',')[1], 'base64')); };
        save('orderA_home', imgA); save('orderB_home', imgB);
        ['mid_day', 'mid_night', 'near_day', 'near_night', 'home_day', 'home_dusk', 'home_night', 'far_day'].forEach((n, i) => save(n, pages[i]));
      }
      out[tag] = { sameAB: imgA === imgB, cacheN, pagesMs, imp, imgA, imgB };
    }
    await ev(`(()=>{window.__noVkey628=false;GV.block559.cache().clear();return 1;})()`);
    return out;
  });
  if (!r.ok) { console.log(JSON.stringify(r.fails)); process.exit(1); }
  const res = r.result;
  // 兩種順序的逐像素差（PNG dataURL 相同 ⇒ 像素相同；不同時另算差異像素要解碼，這裡只記是否相同）
  for (const tag of ['new', 'old']) {
    const q = res[tag];
    console.log(`${tag === 'new' ? '修正後' : '修正前'}：兩種參觀順序拍住宅近景 ${q.sameAB ? '逐像素相同' : '不同'}｜全城 ${q.imp.blocks} 塊，畫成別的 v 的圖 ${q.imp.wrong} 塊（${q.imp.wrongTiles} 格），其中看得出來 ${q.imp.visible} 塊 ${JSON.stringify(q.imp.kinds)}｜Pages 8 鏡頭後快取 ${q.cacheN} 張、${q.pagesMs}ms`);
  }
  const pass = res.new.sameAB && res.new.imp.wrong === 0 && !res.old.sameAB && res.old.imp.wrong > 0;
  console.log(pass ? 'PASS' : 'FAIL'); process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
