// probeDSK1.js — DSK-001 冬季樹相（T655 遺留②：亞熱帶樹在雪地照畫、落葉樹冬天不禿）
// 用法：
//   node probeDSK1.js --mode=entry  施工前現況量測（樹種組成＋樣張）
//   node probeDSK1.js --mode=guard  施工後守衛：同 run 內同步 A/B/C ＋像素計數 ＋樣張
//
// 邊界：自用埠 8199；harness 進城前一律設 slot=3，不碰業主存檔（AUTORUN.md）。
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const MODE = arg('mode', 'entry');
const SEED = +arg('seed', 5162026);
const OUT = arg('out', 'shotsDSK1');

// 五個亞熱帶／不耐寒樹種（1 起算，同 t.tree）
const SUB = [9, 18, 19, 20, 21];

(async () => {
  const shots = [];
  const session = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    const shot = async (name) => {
      await sleep(1100);
      const s = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const dest = path.join(ROOT, OUT, name + '.png');
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(s.data, 'base64'));
      shots.push(path.relative(ROOT, dest));
    };

    await ev(`window.GV.metroArtSeedWorld516(${SEED})`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}return 1;})()`);
    await ev(`GV.setSeason(3)`);                 // 冬：day=301 ⇒ inWinter() 為真
    const CY = await ev('GV.art574.cycle574()');
    await ev(`GV.setVisT(${CY * 0.5})`);         // 正午，光影穩定

    // 全圖樹格普查：tileAt613 逐列抓 't'（tree 旗標），再看地形分類與冬季畫出來的樹種
    const scan = await ev(`(()=>{
      const N=GV.N(),S=${JSON.stringify(SUB)},spots=[];
      for(let y=0;y<N;y++){const row=GV.art574.tileAt613(0,y,N,1);if(!row)continue;const line=row.split('\\n')[0];
        for(let x=0;x<N;x++){const c=line.substr(x*3,3);if(c.indexOf('t')>=0)spots.push([x,y]);}}
      const cls=[0,0,0,0],dom={},share=[0,0,0,0],listSub=[0,0,0,0],listN=[0,0,0,0];
      const TER=GV.TERRAIN_SP655;
      for(let c=0;c<4;c++){let n=0;for(const v of TER[c])if(S.indexOf(v)>=0)n++;listSub[c]=n;listN[c]=TER[c].length;}
      for(const [x,y] of spots){
        const c=GV.terrainClass655(x,y);cls[c]++;
        const tally={};for(let v=1;v<=13;v++){const r=GV.terrainTree655(v,x,y);tally[r]=(tally[r]||0)+1;}
        let best=0,bn=-1;for(const k in tally)if(tally[k]>bn){bn=tally[k];best=+k;}
        dom[best]=(dom[best]||0)+1;
        share[c]+=(S.indexOf(best)>=0)?1:0;
      }
      const domSub=Object.keys(dom).filter(k=>S.indexOf(+k)>=0).reduce((a,k)=>a+dom[k],0);
      // 期望值：主樹種 75% ＋ 其餘 25% 由 t.tree（1–13 均勻）映進清單
      let exp=0;for(const [x,y] of spots){const c=GV.terrainClass655(x,y);
        const tally={};for(let v=1;v<=13;v++){const r=GV.terrainTree655(v,x,y);tally[r]=(tally[r]||0)+1;}
        let best=0,bn=-1;for(const k in tally)if(tally[k]>bn){bn=tally[k];best=+k;}
        const L=TER[c];let m=0;for(let v=1;v<=13;v++)if(S.indexOf(L[(v-1)%L.length])>=0)m++;
        exp+=.75*((S.indexOf(best)>=0)?1:0)+.25*(m/13);}
      return {trees:spots.length,cls,clsSub:share.slice(),domSub,dom,expSub:+(exp/Math.max(1,spots.length)).toFixed(4),
              listSub,listN,lists:TER,after:spots.filter(([x,y])=>GV.terrainClass655(x,y)===2).slice(0,8)};
    })()`);

    if (MODE === 'sheet') {
      // 精靈對照表：四族（白天／禿／禿雪／冬）各 21 種，橫向 21 欄、縱向 4 列，放大 3 倍截圖
      const info = await ev(`(()=>{
        const S=GV.art574.SPR(),fams=[['tree',S.tree],['treeWBare',S.treeWBare],['treeWBareSnow',S.treeWBareSnow],['treeW',S.treeW]];
        const cw=48,ch=52;
        const c=document.createElement('canvas');c.id='dsk1sheet';c.width=21*cw;c.height=fams.length*ch;
        c.style.cssText='position:fixed;left:0;top:0;z-index:99999;image-rendering:pixelated';
        const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#262a33';g.fillRect(0,0,c.width,c.height);
        fams.forEach((f,ri)=>{g.fillStyle=ri?'#2f3542':'#3a4150';g.fillRect(0,ri*ch,c.width,ch-1);
          const arr=f[1]||[];for(let i=0;i<21;i++){const sp=arr[i];if(!sp||!sp.img)continue;g.drawImage(sp.img,i*cw+4,ri*ch+3,40,48);}
          g.fillStyle='#9fb0c8';g.font='9px monospace';g.fillText(f[0],2,ri*ch+11);});
        document.body.appendChild(c);
        const r=c.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,fams:fams.map(f=>f[0])};
      })()`);
      const s = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { x: info.x, y: info.y, width: info.w, height: info.h, scale: 3 } });
      fs.mkdirSync(path.join(ROOT, OUT), { recursive: true });
      const dest = path.join(ROOT, OUT, 'sheet.png');
      fs.writeFileSync(dest, Buffer.from(s.data, 'base64'));
      return { info, shots: [path.relative(ROOT, dest)] };
    }

    if (MODE === 'entry') {
      await ev(`GV.lookAt(30,30);GV.art574.zoom574(0.6);GV.forceDraw();1`);
      await shot('entry_wide');
      for (const [nm, x, y] of [['water', 67, 4], ['sand', 55, 31], ['high', 62, 27], ['flat', 20, 40]]) {
        await ev(`GV.lookAt(${x},${y});GV.art574.zoom574(2);GV.forceDraw();1`);
        await shot('entry_' + nm);
      }
      await ev(`GV.showArt516('atlas');1`).catch(() => {});
      await shot('entry_atlas');
      return { scan, shots };
    }

    // ===== guard：同一個 evalJs 內同步 A/B/C 三檔＋計數（不跨呼叫，避免活城漂移）=====
    const guard = await ev(`(()=>{
      const SPR=GV.art574.SPR();
      const S=${JSON.stringify(SUB)};
      const spots=[];const N=GV.N();
      for(let y=0;y<N;y++){const row=GV.art574.tileAt613(0,y,N,1);if(!row)continue;const line=row.split('\\n')[0];
        for(let x=0;x<N;x++){const c=line.substr(x*3,3);if(c.indexOf('t')>=0)spots.push([x,y]);}}
      const res={spots:spots.length};
      // A/B：起點＝冬季耐寒清單開或關，逐一對同一批座標抽樣樹種
      const sample=[];for(let k=0;k<400&&k<spots.length;k++){const [x,y]=spots[Math.floor(k*spots.length/400)];sample.push([x,y]);}
      const tallyOf=(on)=>{let sub=0;const dom={};
        for(const [x,y] of sample){let best=-1,bn=-1;const t={};
          for(let v=1;v<=13;v++){const r=on?GV.terrainTree655(v,x,y):GV.terrainTreeOldDSK1(v,x,y);t[r]=(t[r]||0)+1;}
          for(const k in t)if(t[k]>bn){bn=t[k];best=+k;}
          dom[best]=(dom[best]||0)+1;if(S.indexOf(best)>=0)sub++;}
        return {sub,dom};};
      res.winter=tallyOf(true);res.pre=tallyOf(false);
      // 冬季清單四類：不含亞熱帶、非空
      res.winterLists=[];let bad=0;
      for(let c=0;c<4;c++){const L=GV.terrainListWinterDSK1(c);res.winterLists.push(L);if(!L.length)bad++;for(const v of L)if(S.indexOf(v)>=0)bad++;}
      res.listBad=bad;
      // 落葉禿枝精靈：葉數（不透明像素）比一比
      res.bare=[];const bare=SPR.treeWBare,base=SPR.tree,snowB=SPR.treeWBareSnow;
      const cnt=c=>{if(!c)return -1;const d=c.getContext('2d').getImageData(0,0,40,48).data;let n=0;for(let k=3;k<d.length;k+=4)if(d[k]>40)n++;return n;};
      for(let i=0;i<21;i++)res.bare.push([i+1,cnt(base&&base[i]&&base[i].img),cnt(bare&&bare[i]&&bare[i].img),cnt(snowB&&snowB[i]&&snowB[i].img)]);
      return res;
    })()`);

    // 三檔對照（同 run 內切閥門重畫同一幀；每次重畫前把守衛計數歸零）
    const style = async (noSeason, styleName, name, x, y) => {
      await ev(`window.__noTreeSeasonDSK1=${noSeason ? 'true' : 'false'};window.__treeBareStyleDSK1='${styleName}';window.__tSubDSK1=0;window.__tBareDSK1=0;GV.lookAt(${x},${y});GV.art574.zoom574(2);GV.forceDraw();1`);
      await sleep(500);
      const drawn = await ev(`({sub:window.__tSubDSK1|0,bare:window.__tBareDSK1|0})`);
      await shot(name);
      return drawn;
    };
    const frames = {};
    for (const [nm, x, y] of [['flat', 30, 42], ['sand', 55, 31], ['high', 62, 27]]) {
      frames[nm] = {
        A: await style(true, 'off', 'guard_' + nm + '_A', x, y),
        B: await style(false, 'bare', 'guard_' + nm + '_B', x, y),
        C: await style(false, 'snow', 'guard_' + nm + '_C', x, y),
        D: await style(false, 'off', 'guard_' + nm + '_D', x, y),
      };
    }
    await ev(`window.__noTreeSeasonDSK1=false;window.__treeBareStyleDSK1='snow';GV.lookAt(30,30);GV.art574.zoom574(0.6);GV.forceDraw();1`);
    await shot('guard_wide_C');
    return { scan, guard, frames, shots };
  });
  console.log(JSON.stringify({ ok: session.ok, fails: session.fails, seconds: session.seconds, ...(session.result || {}) }, null, 1));
  process.exit(session.ok ? 0 : 1);
})().catch(e => { console.error('DSK1 PROBE FAIL', e.message); process.exit(1); });
