#!/usr/bin/env node
/* 微光小鎮 實驗線 — 指紋台 fp.js（零依賴，骨架：harness.js）
 *
 * 為什麼要有它：這條線 crc32 命中 0 ⇒ 沒有任何機制能證明「我只改了卡面宣告的那一族」。
 * 美術要能無限迭代而不靜默誤傷，必須先有指紋差。
 *
 * 做什麼：無頭烘焙整份 SPR，逐家族（頂層鍵）與逐葉子（子家族）算 CRC32，dump 成 fp.json。
 *
 * 用法：
 *   node fp.js                 產生／更新 fp.json，並印出與舊版的差異
 *   node fp.js --check         只比對、不寫檔；有差異就 exit 1（每輪驗收用）
 *   node fp.js --inventory     印盤點表（家族大小、夜圖覆蓋率、自基線以來未動的家族）
 *   node fp.js --expect=a,b,c  宣告本輪應該變動的家族；指紋差必須恰好等於這份清單，否則紅
 *   node fp.js --record-env=a.b,c.d  T631：把列出的、目前確實與基線不同的葉子，登記成「本平台環境差」（只改 fp.json 的 envLeaves）
 *   node fp.js --pre="<JS>"    T631：測試用，進城前先執行一段 JS（守衛測試故意改壞東西）
 *   node fp.js --accept-style=a,b  T734：寫入模式專用。業主同意重寫風格基線時，允許列出的家族總分下降並照常寫 style.json；
 *                              每個被接受的下降都印出前後總分與七軸。列了卻沒下降＝紅；跟 --check 並用＝紅；不影響葉子差與超街區判定。
 *
 * T740：T739 的 36 款英式三規模新美術在繪製時才由 b.art021 套上，圖不在 SPR，fp536 掃不到。進城後另取它們的
 * 144 張標準視角（36 款 × 四向；state {}、原生 lv、v0，與 smoke 的 useScales021 自檢同一組），日夜各算 CRC32，
 * 併成偽家族 use021（葉子 use021.<款式>.r<朝向>）；只進葉子與家族指紋，不進七軸記分。改這 36 款的卡用 --expect=use021。
 * 期望值的獨立來源：probeUse021Fp740.js（Node 直接跑核准來源碼，不經遊戲）。
 *
 * T742（CI 用，只讀，不影響紅綠判定）：
 *   --report-base=<檔>  另拿一份基線（CI 給 base 那一版的 fp.json）比對，印「相對 base 動了哪些家族」；
 *                       分支自己的 fp.json 也可能被改過，只看它會變成拿自己檢查自己，所以要另對 base。
 *   --dump=<資料夾>      把這次烘出的 fp.json、style.json 寫到該資料夾（格式同寫入模式），不碰倉庫基線；--check 也能用。
 *                       給不能在本機跑 fp 的寫入者（GPT）從 CI 附件拿新基線。
 *   --report-base-style=<檔>  對 base 的 style.json 報哪些家族風格分下降、掉在哪幾軸（提交 CI 新基線時棘輪不再擋宣告家族，所以要攤開）。
 *   有 GITHUB_STEP_SUMMARY 時，結果另寫進 GitHub Actions 的工作摘要。
 *
 * T631：fp.json 的葉子是業主 Windows 本機烘的；雲端 Linux 有幾葉因字型繪製永遠不同。envLeaves 登記「這個平台上這幾葉的
 * 正確樣子」：葉子與基線不同、但完全等於本平台登記值，就算已登記環境差（登記值本身變了照樣算真變動）。
 * --check 不再提早退出：葉子差、超街區指紋（block559）、七軸棘輪全部跑完、全部印出，最後才判定紅綠。
 *
 * T746：--check 另核對倉庫 style.json 每一族都等於這次算出的（--expect 宣告的家族除外）；讀不到 style.json、
 * style536 沒回資料也算紅。棘輪只擋分數比 style.json 低，不核對就能靠手改 style.json 關掉它。
 *
 * 邊界：自用埠 8199；進城前一律設 slot=3，不碰業主存檔。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const PORT = +arg('port', 8199);
const FP_PATH = path.join(ROOT, 'fp.json');
const CHECK = process.argv.includes('--check');
const INVENTORY = process.argv.includes('--inventory');
const EXPECT = arg('expect', '').split(',').map(s => s.trim()).filter(Boolean);
const RECORD_ENV = arg('record-env', '').split(',').map(s => s.trim()).filter(Boolean);   // T631
const ACCEPT_STYLE = arg('accept-style', '').split(',').map(s => s.trim()).filter(Boolean);   // T734
const PRE = arg('pre', '');                                                                  // T631：測試用
const REPORT_BASE = arg('report-base', '');                                                  // T742
const DUMP = arg('dump', '');                                                                // T742
const REPORT_BASE_STYLE = arg('report-base-style', '');                                      // T742
const PLATFORM = process.platform;

/* T742：GitHub Actions 工作摘要。所有出口（含中途 process.exit）都在這裡補上紅綠。 */
const SUMMARY = [];
process.on('exit', code => {
  const f = process.env.GITHUB_STEP_SUMMARY;
  if (!f || (!SUMMARY.length && !code)) return;
  try { fs.appendFileSync(f, ['### 像素指紋 fp.js：' + (code ? '✗ 紅' : '✓ 綠'), '', ...SUMMARY, ''].join('\n') + '\n'); } catch {}
});

const STYLE_PATH = path.join(ROOT, 'style.json');

/* T740：在頁面裡跑。用遊戲自己的 useScales021 介面產生並取出 144 張標準視角，每張圖帶的 __art021 認款式與朝向；
   CRC 演算法同 fp536（CRC32 over getImageData RGBA）。缺介面、缺任何一款任何一向、缺夜圖都回 ok:false ⇒ 紅。 */
const USE021_FP_JS = `(()=>{
  const U=window.GV&&window.GV.useScales021;
  if(!U||typeof U.rows!=='function'||typeof U.assets!=='function'||typeof U.selftest!=='function')return {ok:false,err:'GV.useScales021 不存在（T739 的介面）'};
  const TB=new Int32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);TB[n]=c;}
  const crcB=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=TB[(c^b[i])&0xFF]^(c>>>8);return ((c^0xFFFFFFFF)>>>0).toString(16).padStart(8,'0');};
  const px=cv=>{if(!cv||typeof cv.getContext!=='function'||!cv.width||!cv.height)return null;const a=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let op=0;for(let i=3;i<a.length;i+=4)if(a[i]>40)op++;return {crc:crcB(new Uint8Array(a.buffer)),op};};
  const st=U.selftest();   // 產生標準視角（快取在 USE021_CACHE）
  const rows=U.rows();if(!rows.length)return {ok:false,err:'useScales021.rows() 是空的'};
  const want=new Map();for(const q of rows)for(let r=0;r<4;r++)want.set(q.id+'|'+r,q);
  const got=new Map();
  for(const s of U.assets()){const m=s&&s.__art021;if(!m)continue;const key=m.id+'|'+m.rot,q=want.get(key);if(!q)continue;
    if(m.v!==0||m.lv!==q.lv||m.bw!==q.bw||m.bh!==q.bh||JSON.stringify(m.state||{})!=='{}')continue;   // 只收標準視角
    if(got.has(key))return {ok:false,err:'標準視角重複：'+key};got.set(key,s);}
  const miss=[...want.keys()].filter(k=>!got.has(k));
  if(miss.length)return {ok:false,err:'缺標準視角 '+miss.length+' 張：'+miss.slice(0,6).join(', ')};
  const subs={},family={leaves:0,crc:'',px:0,op:0,night:0};let dayNonEmpty=0,nightNonEmpty=0;
  for(const key of [...got.keys()].sort()){const s=got.get(key),[id,r]=key.split('|'),p='use021.'+id+'.r'+r;
    const d=px(s.img),n=px(s.night);if(!d)return {ok:false,err:'沒有日圖：'+p};if(!n)return {ok:false,err:'沒有夜圖：'+p};
    subs[p]={d:d.crc,op:d.op,w:s.img.width,h:s.img.height,n:n.crc};
    if(d.op>0){dayNonEmpty++;if(n.op>0)nightNonEmpty++;}
    family.leaves++;family.px+=s.img.width*s.img.height;family.op+=d.op;family.night++;
    family.crc=crcB(new TextEncoder().encode(family.crc+p+':'+d.crc+':'+n.crc));}
  return {ok:true,family,subs,count:family.leaves,dayNonEmpty,nightNonEmpty,selftestOk:!!(st&&st.ok)};
})()`;

/* ===== 七軸計分（定義集中在此，業主可改規則而不必動遊戲檔） =====
   注意：①④⑤ 的滿分門檻是「業界慣例值」，不是 TheoTown 實測值
   （TheoTown 未公開調色上限與道具密度 ⇒ 見 docs/STYLE-THEOTOWN.md §6/§7）。
   因此這三軸只做**自我棘輪**，不做與 TheoTown 的絕對比對。 */
function scoreFamily(f) {
  const L = Math.max(1, f.leaves), op = Math.max(1, f.op);
  const meanColors = f.colors / L;
  const meanBuckets = f.buckets / L;
  const richPer100 = (f.colors / op) * 100;
  const semiRatio = f.semi / op;
  const nightLeafFrac = f.nightLeaves / L;
  const compliance = f.nightOp > 0 ? 1 - (f.nightViol / f.nightOp) : 1;
  const axes = {
    palette:   Math.min(1, meanColors / 16),                     // ① 調色深度
    hardEdge:  Math.max(0, 1 - Math.min(1, semiRatio * 20)),     // ② 日層硬邊（夜層另計）
    lightDir:  f.leftLit / L,                                    // ③ 受光方向一致
    shade:     Math.max(0, Math.min(1, (meanBuckets - 2) / 4)),  // ④ 陰影階數
    density:   Math.min(1, richPer100 / 4),                      // ⑤ 細節密度
    nightRule: 0.5 * nightLeafFrac + 0.5 * compliance,           // ⑥ 夜圖規約
    variants:  Math.min(1, f.leaves / 8),                        // ⑦ 變體數
  };
  const total = Object.values(axes).reduce((a, b) => a + b, 0) / 7;
  return { axes: axes, total: total };
}
function buildStyle(raw) {
  const out = {};
  for (const k of Object.keys(raw.families)) {
    const f = raw.families[k];
    const sc = scoreFamily(f);
    out[k] = { leaves: f.leaves, op: f.op, raw: f, axes: sc.axes, total: +sc.total.toFixed(4) };
  }
  return out;
}
function loadJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }

function loadBaseline() {
  try { return JSON.parse(fs.readFileSync(FP_PATH, 'utf8')); } catch { return null; }
}

const sameLeaf = (a, b) => !!a && !!b && a.d === b.d && a.n === b.n && a.w === b.w && a.h === b.h;
function diffFp(base, cur) {
  const env = (base.envLeaves && base.envLeaves[PLATFORM]) || {};   // T631：本平台登記的環境差
  const added = [], removed = [], changed = [], envMatched = [];
  const bk = Object.keys(base.subs || {}), ck = Object.keys(cur.subs || {});
  const bset = new Set(bk), cset = new Set(ck);
  for (const k of ck) if (!bset.has(k)) added.push(k);
  for (const k of bk) if (!cset.has(k)) removed.push(k);
  for (const k of ck) {
    if (!bset.has(k)) continue;
    const a = base.subs[k], b = cur.subs[k];
    if (a.d !== b.d || a.n !== b.n || a.w !== b.w || a.h !== b.h) {
      if (sameLeaf(env[k], b)) envMatched.push(k);   // 與基線不同、但完全等於本平台登記值
      else changed.push(k);
    }
  }
  const famOf = k => k.split('.')[0];
  const explained = new Set(envMatched.map(famOf)), dirty = new Set([...added, ...removed, ...changed].map(famOf));
  const famChanged = [];
  for (const k of Object.keys(cur.families || {})) {
    const a = (base.families || {})[k], b = cur.families[k];
    if (!a || a.crc !== b.crc) { if (explained.has(k) && !dirty.has(k)) continue; famChanged.push(k); }   // 只有已登記環境差的家族不算觸及
  }
  for (const k of Object.keys(base.families || {})) if (!(cur.families || {})[k]) famChanged.push(k);   // T741：基線有、這次整族沒烘出來也算觸及（原本只印「移除」就判綠）
  return { added, removed, changed, famChanged, envMatched };
}

(async () => {
  const log = (...a) => console.log('  ' + a.join(' '));
  console.log('');
  console.log('=== 微光小鎮 指紋台 ===');
  if (ACCEPT_STYLE.length && CHECK) { console.log('X --accept-style 會改寫 style.json，只能用在寫入模式，不能跟 --check 並用'); process.exit(1); }   // T734

  const NOSILL = process.argv.includes('--nosill');   // 嚴謹 A/B：關掉 T539 窗台重建基線，再開著跑 --expect
  const NOLEFT = process.argv.includes('--noleft');   // T541：關掉左受光＋夜暈，對同一份代碼做開/關比較
  const pre = [NOSILL ? 'window.__noSill539=true;' : '', NOLEFT ? 'window.__noLeftLight541=true;' : '', PRE ? PRE + ';' : ''].join('');
const session = await withGame({ port: PORT, timeout: 300, log, fresh: true, preScript: pre || '' }, async ({ cdp }) => {   // fresh：乾淨新城市，季節固定 ⇒ 指紋可重現
    const meta = await cdp.evalJs(`(()=>{const el=document.getElementById('startVersion456');const m=/v([0-9.]+) . (T[0-9]+)/.exec(el?el.textContent:'');if(m)return {version:m[1],anchor:m[2]};return (window.GV&&window.GV.build534)?window.GV.build534():{};})()`); // T606：讀目前版本字串（build534 是 T534 當年凍結的建置紀錄）
    const fp = await cdp.evalJs(`(window.GV && window.GV.fp536) ? window.GV.fp536() : {ok:false,err:'fp536 不存在'}`);
    const style = await cdp.evalJs(`(window.GV && window.GV.style536) ? window.GV.style536() : {ok:false,err:'style536 不存在'}`);
    const blocks = await cdp.evalJs(`(window.GV && window.GV.blockFp536) ? window.GV.blockFp536() : {ok:false,err:'blockFp536 不存在'}`);
    if (!fp || !fp.ok) throw new Error('指紋失敗: ' + JSON.stringify(fp && (fp.err || fp.skipped || fp)));
    const use021 = await cdp.evalJs(USE021_FP_JS);   // T740
    if (!use021 || !use021.ok) throw new Error('use021 指紋失敗: ' + JSON.stringify(use021 && (use021.err || use021)));
    return { meta, fp, style, blocks, use021 };
  });

  if (!session.result) {
    console.log('X 紅燈：' + session.fails.join(' / '));
    process.exit(1);
  }

  const { meta, fp, style, blocks, use021 } = session.result;
  /* T740：use021 併進葉子與家族指紋（style 不含它，七軸記分照舊只算 SPR） */
  fp.families.use021 = use021.family;
  Object.assign(fp.subs, use021.subs);
  fp.stats.families++; fp.stats.leaves += use021.count;
  fp.stats.dayNonEmpty += use021.dayNonEmpty; fp.stats.nightNonEmpty += use021.nightNonEmpty;
  const checkFail = [];   // T631：--check 的所有失敗原因，全部檢查跑完才判定
  const cur = {
    generatedAt: new Date().toISOString(),
    version: meta.version || '?',
    anchor: meta.anchor || '?',
    stats: fp.stats,
    families: fp.families,
    subs: fp.subs,
    blocks: blocks && blocks.ok ? { fam: blocks.fam, count: blocks.count } : null,
  };

  log('版本 ' + cur.version + ' / ' + cur.anchor);
  log('家族 ' + fp.stats.families + ' 個、葉子 ' + fp.stats.leaves + ' 片');
  log('非空日圖 ' + fp.stats.dayNonEmpty + '、有夜圖 ' + fp.stats.nightNonEmpty
    + '、夜空畫布 ' + fp.stats.nightEmptyCanvas);
  const cov = fp.stats.dayNonEmpty ? (fp.stats.nightNonEmpty / fp.stats.dayNonEmpty * 100) : 0;
  log('夜圖覆蓋率 ' + cov.toFixed(1) + '%');
  SUMMARY.push('- 版本 ' + cur.version + '／' + cur.anchor + '：' + fp.stats.families + ' 族、' + fp.stats.leaves + ' 葉');

  if (DUMP) {   // T742：本次烘出的指紋另存，不動倉庫基線
    fs.mkdirSync(DUMP, { recursive: true });
    fs.writeFileSync(path.join(DUMP, 'fp.json'), JSON.stringify(cur, null, 1));
    log('本次烘出的指紋另存到 ' + path.join(DUMP, 'fp.json') + '（--dump）');
  }
  if (REPORT_BASE) {   // T742：對 base 的基線報「這次動了哪些家族」；只報告，不影響紅綠
    const rb = loadJson(REPORT_BASE);
    if (!rb || !rb.subs) { log('相對 base：讀不到 ' + REPORT_BASE + '，略過'); SUMMARY.push('- 相對 base：讀不到基線檔，略過'); }
    else {
      const d2 = diffFp(rb, cur), fams2 = [...new Set(d2.famChanged)];
      const bChg = !!(rb.blocks && cur.blocks && rb.blocks.fam !== cur.blocks.fam);
      const line = '新增 ' + d2.added.length + ' / 變更 ' + d2.changed.length + ' / 移除 ' + d2.removed.length + ' 葉，觸及家族 ' + fams2.length + (bChg ? '，超街區（block559）也變了' : '');
      log('');
      log('相對 base（' + (rb.anchor || '?') + ' ' + (rb.version || '?') + '）：' + line);
      if (fams2.length) log('  觸及：' + fams2.join(', '));
      SUMMARY.push('- **相對 base**（' + (rb.anchor || '?') + ' ' + (rb.version || '?') + '）：' + line + (fams2.length ? '：' + fams2.map(f => '`' + f + '`').join('、') : ''));
    }
  }

  const base = loadBaseline();
  let envFams = new Set();   // T746：只因本平台已登記環境差而不同的家族；style.json 核對對它們放行（只剩棘輪）
  if (base) {
    const d = diffFp(base, cur);
    const famTouched = [...new Set(d.famChanged)];
    envFams = new Set(d.envMatched.map(k => k.split(/[.#]/)[0]).filter(f => !famTouched.includes(f)));   // 葉子鍵有 a.b 與 a#0 兩種
    log('');
    log('與 fp.json（' + (base.anchor || '?') + ' ' + (base.version || '?') + '）相比：');
    log('  新增 ' + d.added.length + ' / 變更 ' + d.changed.length + ' / 移除 ' + d.removed.length
      + ' / 觸及家族 ' + famTouched.length + '（其餘 ' + (fp.stats.families - famTouched.length) + ' 族零變動）');
    if (famTouched.length) log('  觸及：' + famTouched.slice(0, 40).join(', ') + (famTouched.length > 40 ? ' …' : ''));
    SUMMARY.push('- 與倉庫的 fp.json 相比：新增 ' + d.added.length + ' / 變更 ' + d.changed.length + ' / 移除 ' + d.removed.length + ' 葉' + (famTouched.length ? '，觸及 ' + famTouched.map(f => '`' + f + '`').join('、') : '，零變動'));
    if (d.added.length) log('  新增葉子：' + d.added.slice(0, 8).join(', ') + (d.added.length > 8 ? ' …' : ''));
    if (d.changed.length) log('  變更葉子：' + d.changed.slice(0, 8).join(', ') + (d.changed.length > 8 ? ' …' : ''));
    if (d.removed.length) log('  移除葉子：' + d.removed.slice(0, 8).join(', ') + (d.removed.length > 8 ? ' …' : ''));
    if (d.envMatched.length) log('  已登記環境差（' + PLATFORM + '）：' + d.envMatched.length + ' 葉（' + d.envMatched.slice(0, 8).join(', ') + (d.envMatched.length > 8 ? ' …' : '') + '），不算變動');

    /* T631：--record-env 只登記列出的、目前確實與基線不同的葉子；其餘內容照原本的基線寫回（不重錄） */
    if (RECORD_ENV.length) {
      const bad = RECORD_ENV.filter(k => !d.changed.includes(k));
      if (bad.length) { console.log('X --record-env 拒絕：這些葉子目前與基線沒有差異（或不存在／已登記）：' + bad.join(', ')); process.exit(1); }
      base.envLeaves = base.envLeaves || {};
      base.envLeaves[PLATFORM] = Object.assign({}, base.envLeaves[PLATFORM] || {});
      for (const k of RECORD_ENV) base.envLeaves[PLATFORM][k] = cur.subs[k];
      fs.writeFileSync(FP_PATH, JSON.stringify(base, null, 1));
      console.log('OK 已登記 ' + PLATFORM + ' 環境差 ' + RECORD_ENV.length + ' 葉：' + RECORD_ENV.join(', ') + '（fp.json 只改 envLeaves）');
      process.exit(0);
    }

    /* 每輪驗收：指紋差必須恰好等於卡面宣告的家族清單 */
    if (EXPECT.length) {
      const expectSet = new Set(EXPECT);
      const unexpected = famTouched.filter(f => !expectSet.has(f));
      const missing = EXPECT.filter(f => f !== 'block559' && !famTouched.includes(f)); // block559 為偽家族，由上方專責分支對帳
      // 超街區快取偽家族：--expect 可含 'block559'（宣告「本輪改了超街區繪製」）
      const bFam = (blocks && blocks.ok) ? blocks.fam : null;
      const bPrev = (base && base.blocks) ? base.blocks.fam : null;
      if (expectSet.has('block559')) {
        if (bPrev && bFam && bPrev !== bFam) log('  OK block559：超街區快取已變動（如宣告）');
        else if (bPrev) { log('  X block559：宣告了但快取 CRC 與基線相同'); process.exit(1); }
      } else if (bPrev && bFam && bPrev !== bFam) {
        log('  X 多改了：block559（超街區快取變動未宣告）');
        process.exit(1);
      }
      log('');
      log('宣稱變動家族：' + EXPECT.join(', '));
      if (unexpected.length) log('  X 多改了：' + unexpected.join(', '));
      if (missing.length) log('  X 宣告了但沒動：' + missing.join(', '));
      if (unexpected.length || missing.length) {
        SUMMARY.push('- ✗ 指紋差與宣告不符：' + (unexpected.length ? '多改了 ' + unexpected.join('、') : '') + (missing.length ? ' 宣告了但沒動 ' + missing.join('、') : ''));
        console.log('X 指紋差與宣告不符');
        process.exit(1);
      }
      log('  OK 指紋差 == 宣告清單');
    } else if (CHECK) {
      if (famTouched.length) checkFail.push('指紋有變動（未宣告）：' + famTouched.slice(0, 12).join(', ') + (famTouched.length > 12 ? ' …' : ''));   // T631：不提早退出，block559 與棘輪照跑
      else log('  OK 葉子零變動' + (d.envMatched.length ? '（已登記環境差 ' + d.envMatched.length + ' 葉）' : ''));
    }
  } else {
    log('');
    log('（尚未有 fp.json，這是基線）');
  }

  if (!CHECK) {
    fs.writeFileSync(FP_PATH, JSON.stringify(cur, null, 1));
    log('');
    log('已寫入 fp.json');
  }

  /* ===== 超街區快取指紋（T579）===== */
  let blockFam = null, blockPrevFam = null, blockCount = 0;
  if (blocks && blocks.ok) {
    blockFam = blocks.fam; blockCount = blocks.count;
    log('');
    log('超街區快取：' + blockCount + ' 個決定性枚舉條目，家族 CRC ' + blockFam);
    if (base && base.blocks && base.blocks.fam) {
      blockPrevFam = base.blocks.fam;
      log('  ' + (blockPrevFam === blockFam ? '與基線一致' : '與基線不同（' + blockPrevFam + ' → ' + blockFam + '）'));
      if (CHECK && !EXPECT.length && blockPrevFam !== blockFam) checkFail.push('block559 與基線不同（' + blockPrevFam + ' → ' + blockFam + '）');   // T631
    }
  }

  /* ===== 七軸記分卡 + 棘輪 ===== */
  if (style && style.ok) {
    const curStyle = buildStyle(style);
    const prevStyle = loadJson(STYLE_PATH);
    const famNames = Object.keys(curStyle);

    // 全域平均（各軸）
    const axNames = ['palette','hardEdge','lightDir','shade','density','nightRule','variants'];
    const avg = {};
    for (const a of axNames) avg[a] = famNames.reduce((s2, k) => s2 + curStyle[k].axes[a], 0) / Math.max(1, famNames.length);
    let grand = famNames.reduce((s2, k) => s2 + curStyle[k].total, 0) / Math.max(1, famNames.length);
    const styleOut = { generatedAt: new Date().toISOString(), version: cur.version, anchor: cur.anchor, version_fp: cur.version, averages: avg, grand: +grand.toFixed(4), families: curStyle };
    if (DUMP) fs.writeFileSync(path.join(DUMP, 'style.json'), JSON.stringify(styleOut, null, 1));   // T742：棘輪判定前就先存
    if (REPORT_BASE_STYLE) {   // T742：對 base 的 style.json 報風格分下降（提交 CI 新基線時，宣告家族的下降不會再被棘輪擋，所以要攤在摘要裡）；只報告
      const bs = loadJson(REPORT_BASE_STYLE), out = [];
      for (const k of famNames) {
        const pv = bs && bs.families && bs.families[k], cv = curStyle[k];
        if (!pv || cv.total - pv.total > -1e-6) continue;
        const ax = Object.keys(cv.axes).filter(a => pv.axes && Math.abs(cv.axes[a] - pv.axes[a]) > 1e-6).map(a => a + ' ' + (pv.axes[a] * 100).toFixed(2) + '→' + (cv.axes[a] * 100).toFixed(2));
        out.push(k + ' ' + (pv.total * 100).toFixed(2) + '% → ' + (cv.total * 100).toFixed(2) + '%（葉子 ' + (pv.leaves ?? '?') + '→' + cv.leaves + (ax.length ? '；' + ax.join('，') : '') + '）');
      }
      log('');
      if (!bs || !bs.families) { log('風格分相對 base：讀不到 ' + REPORT_BASE_STYLE + '，略過'); SUMMARY.push('- 風格分相對 base：讀不到基線檔，略過'); }
      else {
        log('風格分相對 base：' + (out.length ? out.length + ' 族下降' : '沒有家族下降'));
        out.forEach(x => log('   - ' + x));
        SUMMARY.push('- **風格分相對 base**：' + (out.length ? out.length + ' 族下降：' + out.join('；') : '沒有家族下降'));
      }
    }

    /* T746：--check 時倉庫 style.json 的每一族都要等於這次算出的（總分、七軸、葉子數、原始計數）。
       棘輪只擋「算出的比 style.json 低」；不核對的話，手改 style.json（壓低分數、刪族）就能關掉往後的棘輪。
       --expect 宣告的家族還沒重烘、只因本平台已登記環境差而不同的家族（envFams），不比。 */
    if (CHECK) {
      const canon = v => JSON.stringify(v, (k, x) => x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(j => [j, x[j]])) : x);
      if (!prevStyle || !prevStyle.families) checkFail.push('讀不到 style.json（--check 要拿它核對）');
      else {
        const expSet = new Set(EXPECT);
        const diff = [...new Set([...famNames, ...Object.keys(prevStyle.families)])].filter(k => !expSet.has(k) && !envFams.has(k) && canon(curStyle[k]) !== canon(prevStyle.families[k]));
        if (envFams.size) log('style.json 核對略過已登記環境差的家族：' + [...envFams].join(', '));
        log('');
        if (diff.length) {
          log('X style.json 與這次算出的不同：' + diff.join(', '));
          checkFail.push('style.json 與這次算出的不同：' + diff.slice(0, 12).join(', ') + (diff.length > 12 ? ' …' : ''));
        } else log('style.json 與這次算出的逐族相同（' + famNames.length + ' 族）');
      }
    }

    log('');
    log('--- 七軸記分卡（全 149 家族平均）---');
    const AX_LABEL = { palette:'(1) 調色深度', hardEdge:'(2) 硬邊', lightDir:'(3) 受光方向',
      shade:'(4) 陰影階數', density:'(5) 細節密度', nightRule:'(6) 夜圖規約', variants:'(7) 變體數' };
    for (const a of axNames) log('  ' + AX_LABEL[a].padEnd(16) + (avg[a] * 100).toFixed(1) + '%');
    log('  總分（七軸平均）  ' + (grand * 100).toFixed(1) + '%');

    // 最低分 × 葉子數最大 ⇒ 下一個該做的家族
    const queue = famNames
      .map(k => ({ k: k, total: curStyle[k].total, leaves: curStyle[k].leaves, gravity: (1 - curStyle[k].total) * curStyle[k].leaves }))
      .sort((a, b) => b.gravity - a.gravity);
    log('');
    log('--- 選題佇列（重力＝(1-總分)×葉子數，前 8）---');
    for (const q of queue.slice(0, 8))
      log('  ' + q.k.padEnd(22) + ' 總分 ' + (q.total * 100).toFixed(1) + '%  葉子 ' + String(q.leaves).padStart(4) + '  重力 ' + q.gravity.toFixed(1));

    if (prevStyle && prevStyle.families) {
      const expSet = new Set(EXPECT);
      const accSet = new Set(ACCEPT_STYLE);   // T734
      const drops = [], accepted = [];
      for (const k of famNames) {
        const pv = prevStyle.families[k];
        if (!pv) continue;                       // 新家族不算退步
        if (expSet.has(k)) continue;             // 本輪宣告的家族允許變動
        const d = curStyle[k].total - pv.total;
        if (d < -1e-6) (accSet.has(k) ? accepted : drops).push(k + ' ' + (pv.total * 100).toFixed(1) + '% → ' + (curStyle[k].total * 100).toFixed(1) + '%');
      }
      log('');
      if (ACCEPT_STYLE.length) {   // T734：列出的家族必須真的下降，並把七軸前後留在紀錄裡
        const notDropped = ACCEPT_STYLE.filter(k => !accepted.some(a => a.startsWith(k + ' ')));
        if (notDropped.length) { console.log('X --accept-style 列了但沒有下降（或不存在）：' + notDropped.join(', ')); process.exit(1); }
        log('接受風格基線下降（--accept-style，業主同意後才用）：');
        for (const k of ACCEPT_STYLE) {
          const pv = prevStyle.families[k], cv = curStyle[k];
          log('   - ' + k + ' 總分 ' + (pv.total * 100).toFixed(2) + '% → ' + (cv.total * 100).toFixed(2) + '%，葉子 ' + (pv.leaves ?? '?') + ' → ' + cv.leaves);
          for (const a of Object.keys(cv.axes)) {
            const b0 = pv.axes ? pv.axes[a] : undefined, b1 = cv.axes[a];
            if (b0 === undefined || Math.abs(b1 - b0) > 1e-6) log('       ' + a.padEnd(10) + (b0 === undefined ? '?' : (b0 * 100).toFixed(2) + '%') + ' → ' + (b1 * 100).toFixed(2) + '%');
          }
        }
      }
      if (drops.length) {
        log('X 棘輪破裂（非本輪宣告家族分數下降）：');
        drops.slice(0, 12).forEach(d => log('   - ' + d));
        SUMMARY.push('- ✗ 棘輪破裂（非宣告家族分數下降）：' + drops.slice(0, 12).join('；'));
        console.log('X 棘輪下降 ⇒ 請 git checkout -- index.html 退回上一個綠點');
        process.exit(1);
      }
      log('棘輪 OK（非宣告家族分數無一下降，共比對 ' + famNames.length + ' 族）');
    } else {
      log('');
      log('（尚未有 style.json，這是記分卡基線）');
    }

    if (!CHECK) {
      fs.writeFileSync(STYLE_PATH, JSON.stringify(styleOut, null, 1));
      log('已寫入 style.json');
    }
  } else if (CHECK) checkFail.push('style536 沒有回傳記分資料，棘輪與 style.json 核對都沒跑');   // T746

  if (INVENTORY) {
    const fams = Object.entries(cur.families).sort((a, b) => b[1].leaves - a[1].leaves);
    log('');
    log('--- 盤點：家族大小前 25 ---');
    for (const [k, v] of fams.slice(0, 25)) {
      log('  ' + k.padEnd(22) + ' 葉子 ' + String(v.leaves).padStart(4)
        + '  夜圖 ' + String(v.night).padStart(4) + '  不透明像素 ' + v.op);
    }
    log('');
    log('--- 盤點：完全沒有夜圖的家族（葉子 ≥ 4）---');
    const noNight = fams.filter(([, v]) => v.night === 0 && v.leaves >= 4).map(([k, v]) => k + '(' + v.leaves + ')');
    log('  ' + (noNight.length ? noNight.join(', ') : '（無）'));
    log('  共 ' + noNight.length + ' 族完全無夜圖');
  }

  if (checkFail.length) {   // T631
    checkFail.forEach(x => SUMMARY.push('- ✗ ' + x));
    console.log('');
    console.log('X --check：' + checkFail.join('；'));
    process.exit(1);
  }
  if (CHECK) log('OK --check：葉子、超街區指紋、棘輪、style.json 全部零變動');
  console.log('');
  console.log('OK 指紋台完成（' + session.seconds.toFixed(1) + 's）');
  process.exit(0);
})().catch(e => { console.error('X 指紋台失敗: ' + e.message); process.exit(1); });
