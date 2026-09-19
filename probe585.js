#!/usr/bin/env node
/* T585 旋轉 tie-break 守衛探針 v2（零依賴，骨架：harness.js）
 *
 * v1 教訓：跨 run 的 PNG 位元組比對被模擬動態污染（兩次啟動間車輛／ trafClock 狀態不同，
 * 三斷言全數 diff=-1＝位元組長度不同）。v2 改「同 run 同步 A/B」：種子城 fixture ＋
 * 單一 evalJs 內連續兩次 forceDraw（閥開／閥關），共用同一 visT 與確定性 trafClock 步進
 * （forceDraw=draw(.016) 固定 dt），畫面差異只能來自 tie-break 座標系本身。
 *
 * 三個斷言，全部像素級（PNG 位元組流比對，壓縮確定性 ⇒ 同畫面同位元流）：
 *   G1  rot=0 零回歸：閥開 ≡ 閥關 —— w2v 恆等 ⇒ viewTie585≡y*.001，有 diff 就是施工事故。
 *   G2  修復生效：rot=1 閥開 ≠ 閥關 —— tie-break 換座標系後同 viewDep 條帶排序改變 ⇒ 畫面必須變。
 *   G3  閥確定性：rot=1 第二輪 A/B 的閥開影像 ≡ 第一輪閥開影像 —— 閥的翻轉方向不帶順序雜訊。
 *
 * 用法：node probe585.js            （v2 無需基線檔；shots/T585_rot*_base.png 為 v1 遺留，僅存檔）
 */
'use strict';
const { withGame } = require('./harness.js');

(async () => {
  const log = (...a) => console.log('  ' + a.join(' '));
  console.log('');
  console.log('=== T585 旋轉 tie-break 守衛 v2（同 run 同步 A/B） ===');
  const session = await withGame({ port: 8199, timeout: 300, log }, async ({ cdp }) => {
    // 種子城 fixture：決定性世界、running=false、speed=0（metroArtSeedWorld516 自帶）
    await cdp.evalJs(`(()=>{GV.metroArtSeedWorld516(5162026);const st=document.getElementById('start');if(st)st.style.display='none';return 1})()`);
    const r = await cdp.evalJs(`(() => {
      const cv = document.getElementById('game');
      const shot = () => { GV.setVisT(55); GV.forceDraw(); return cv.toDataURL('image/png'); };
      const ab = () => {
        window.__noTie585 = 1; const on = shot();
        window.__noTie585 = 0; const off = shot();
        return { on: on.length, off: off.length, same: on === off };
      };
      GV.setRot(0); GV.setZoom(1); GV.lookAt(30, 30);
      const rot0 = ab();
      GV.setRot(1);
      const rot1a = ab();
      const rot1b = ab();
      return {
        rot0Same: rot0.same,
        rot1Differs: !rot1a.same,
        rot1Stable: rot1a.on === rot1b.on && rot1a.off === rot1b.off,
        lens: { rot0on: rot0.on, rot0off: rot0.off, rot1on: rot1a.on, rot1off: rot1a.off }
      };
    })()`);
    log('rot0 閥開≡閥關：' + r.rot0Same + '  rot1 閥開≠閥關：' + r.rot1Differs + '  rot1 閥確定性：' + r.rot1Stable);
    log('PNG 大小：' + JSON.stringify(r.lens));
    const fails = [];
    if (r.rot0Same) log('G1 PASS：rot=0 零回歸（閥開/閥關逐位元一致）');
    else fails.push('G1 FAIL：rot=0 畫面變了——預設視角不該動（viewTie585 應恆等於 y*.001）');
    if (r.rot1Differs) log('G2 PASS：rot=1 畫面已變——修復在旋轉視角生效');
    else fails.push('G2 FAIL：rot=1 閥開/閥關完全一致——tie-break 修改沒生效');
    if (r.rot1Stable) log('G3 PASS：rot=1 兩輪 A/B 逐位元可重現——閥翻轉不帶順序雜訊');
    else fails.push('G3 FAIL：rot=1 兩輪 A/B 不一致——forceDraw 之間有非確定性狀態洩入畫面');
    return { fails, raw: r };
  });
  const fails = (session.result && session.result.fails) || session.fails || [];
  if (fails.length) { console.log(''); fails.forEach(f => console.log('X ' + f)); process.exit(1); }
  console.log('');
  console.log('OK T585 守衛全綠（G1 零回歸／G2 修復生效／G3 閥確定性）');
  process.exit(0);
})().catch(e => { console.error('X 探針失敗: ' + e.message); process.exit(1); });
