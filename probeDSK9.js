// probeDSK9.js — DSK-009 英式炸魚薯條店（k195，1×1）
// 用法：
//   node probeDSK9.js --mode=sprite            精靈放大 3 倍（白天／夜晚）
//   node probeDSK9.js --mode=place             市景放一間（近景 z=2／遠景 z=0.6／夜）
// 邊界：自用埠 8199；harness 進城前一律設 slot=3，不碰業主存檔。
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const MODE = arg('mode', 'sprite');
const SEED = +arg('seed', 5162026);
const OUT = arg('out', 'shotsDSK9');
const KEY = arg('key', '195_1_0');

(async () => {
  const shots = [];
  await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
    const ev = async e => {
      const r = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    const shot = async (name, clip) => {
      await sleep(900);
      const p = { format: 'png' };
      if (clip) p.clip = clip;
      const s = await cdp.send('Page.captureScreenshot', p);
      const dest = path.join(ROOT, OUT, name + '.png');
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(s.data, 'base64'));
      shots.push(path.relative(ROOT, dest));
    };

    await ev(`window.GV.metroArtSeedWorld516(${SEED})`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}return 1;})()`);
    const CY = await ev('GV.art574.cycle574()');

    if (MODE === 'sprite') {
      const info = await ev(`(()=>{
        const S=GV.art574.SPR(),sp=S.bld&&S.bld['${KEY}'];
        if(!sp){return {err:'${KEY} 不存在'};}
        const SC=3,pad=6;
        const mk2=(src,bg,left)=>{const c=document.createElement('canvas');c.width=sp.w*SC+pad*2;c.height=sp.h*SC+pad*2;
          c.style.cssText='position:fixed;left:'+left+'px;top:0;z-index:99999;image-rendering:pixelated';
          const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);
          if(src)g.drawImage(src,pad,pad,sp.w*SC,sp.h*SC);
          g.fillStyle='#ffd27a';g.font='12px monospace';g.fillText(src===sp.img?'day':'night',pad+2,pad+13);
          document.body.appendChild(c);return c;};
        const cd=mk2(sp.img,'#3a4756',0),cn=mk2(sp.night,'#141821',sp.w*SC+pad*3);
        const r1=cd.getBoundingClientRect(),r2=cn.getBoundingClientRect();
        return {day:{x:r1.x,y:r1.y,w:r1.width,h:r1.height},night:{x:r2.x,y:r2.y,w:r2.width,h:r2.height},ax:sp.ax,ay:sp.ay,sw:sp.w,sh:sp.h};
      })()`);
      if (info.err) return { err: info.err, shots };
      await shot('sprite_day', { x: info.day.x, y: info.day.y, width: info.day.w, height: info.day.h, scale: 1 });
      await shot('sprite_night', { x: info.night.x, y: info.night.y, width: info.night.w, height: info.night.h, scale: 1 });
      return { info, shots };
    }

    if (MODE === 'place') {
      const info = await ev(`(()=>{
        const N=GV.N();let spot=null;
        for(let y=6;y<N-6&&!spot;y++)for(let x=6;x<N-6;x++){
          const row=GV.art574.tileAt613(x,y,1,1);if(!row)continue;
          const tt=row.split(' ').join('').split(String.fromCharCode(10)).join('').split(String.fromCharCode(13)).join('');
          if(tt.length>=1&&tt.split('.').join('')===''){spot=[x,y];break;}}
        if(!spot)return {err:'找不到空地'};
        const [x,y]=spot;const ok=GV.place('chippy',x,y);
        const b=GV.art574.tileAt613(x,y,1,1);
        return {spot:[x,y],placed:ok,cell:b};
      })()`);
      if (info.err) return { err: info.err, shots };
      const [x, y] = info.spot;
      await ev(`GV.art574.plant574([{k:195,lv:1,v:0,x:${x},y:${y}}]);1`);
      await ev(`GV.setVisT(${CY * 0.5});GV.lookAt(${x},${y});GV.art574.zoom574(2.4);GV.forceDraw();1`);
      await shot('place_near');
      const vp = await ev('JSON.stringify({w:innerWidth,h:innerHeight})');
      const V = JSON.parse(vp);
      await shot('place_zoom', { x: Math.round(V.w / 2 - 220), y: Math.round(V.h / 2 - 260), width: 440, height: 520, scale: 2 });
      await ev(`GV.lookAt(${x},${y});GV.art574.zoom574(0.8);GV.forceDraw();1`);
      await shot('place_far');
      await ev(`GV.setVisT(${CY * 0.85});GV.lookAt(${x},${y});GV.art574.zoom574(2.4);GV.forceDraw();1`);
      await shot('place_night_zoom', { x: Math.round(V.w / 2 - 220), y: Math.round(V.h / 2 - 260), width: 440, height: 520, scale: 2 });
      return { info, shots };
    }

    if (MODE === 'near') {
      const info = await ev(`(()=>{
        const N=GV.N();let spot=null;
        for(let y=6;y<N-6&&!spot;y++)for(let x=6;x<N-6;x++){
          const row=GV.art574.tileAt613(x,y,1,1);if(!row)continue;
          const tt=row.split(' ').join('').split(String.fromCharCode(10)).join('').split(String.fromCharCode(13)).join('');
          if(tt.length>=1&&tt.split('.').join('')===''){spot=[x,y];break;}}
        if(!spot)return {err:'找不到空地'};
        const [x,y]=spot;const ok=GV.place('chippy',x,y);
        return {spot:[x,y],placed:ok};})()`);
      if (info.err) return { err: info.err, shots };
      const [x, y] = info.spot;
      await ev(`GV.art574.plant574([{k:195,lv:1,v:0,x:${x},y:${y}}]);1`);
      await ev(`GV.setVisT(${CY*0.5});GV.lookAt(${x},${y});GV.art574.zoom574(2.4);GV.forceDraw();1`);
      const vp = await ev('JSON.stringify({w:innerWidth,h:innerHeight})');
      const V = JSON.parse(vp);
      await shot('near_day_zoom', {x: Math.round(V.w/2-220), y: Math.round(V.h/2-260), width: 440, height: 520, scale: 2});
      await ev(`GV.setVisT(${CY*0.85});GV.forceDraw();1`);
      await shot('near_night_zoom', {x: Math.round(V.w/2-220), y: Math.round(V.h/2-260), width: 440, height: 520, scale: 2});
      return { info, shots };
    }

    return { err: '未知 mode：' + MODE, shots };
  });
  console.log(JSON.stringify({ shots }, null, 1));
})().catch(e => { console.error('FAIL', e && e.message); process.exit(1); });
