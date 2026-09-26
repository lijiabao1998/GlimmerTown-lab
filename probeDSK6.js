// probeDSK6.js — DSK-006 有廊客棧（k194，2×2）
// 用法：
//   node probeDSK6.js --mode=sprite            精靈放大 3 倍（白天／夜晚／穹頂特寫）——美術迭代用
//   node probeDSK6.js --mode=place             種子城放一座音樂廳，近景（z=2）／遠景（z=0.6）／夜景
//   node probeDSK6.js --mode=ascii             精靈半尺度 ASCII 剪影（白天層，實心像素）
//
// 邊界：自用埠 8199；harness 進城前一律設 slot=3，不碰業主存檔（AUTORUN.md）。
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const MODE = arg('mode', 'sprite');
const SEED = +arg('seed', 5162026);
const OUT = arg('out', 'shotsDSK6');
const KEY = arg('key', '194_1_0');

(async () => {
  const shots = [];
  const session = await withGame({ port: 8199, timeout: 300, log: () => {} }, async ({ cdp }) => {
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

    if (MODE === 'ascii') {
      const txt = await ev(`(()=>{
        const S=GV.art574.SPR(),sp=S.bld&&S.bld['${KEY}'];
        if(!sp)return '（${KEY} 不存在）';
        const d=sp.img.getContext('2d').getImageData(0,0,sp.w,sp.h).data,out=[];
        for(let y=0;y<sp.h;y+=2){let s='';
          for(let x=0;x<sp.w;x+=2){let hit=false,blue=false,red=false,cream=false;
            for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const i=((y+dy)*sp.w+(x+dx))*4;if(d[i+3]<=150)continue;hit=true;
              if(d[i+2]>d[i]+10)blue=true;else if(d[i]>d[i+2]+35)red=true;else if(d[i]>195&&d[i+1]>185)cream=true;}
            s+=hit?(blue?'G':red?'#':cream?'o':'.'):' ';}
          out.push(('   '+y).slice(-3)+'|'+s);}
        return out.join('\\n');})()`);
      console.log(txt);
      return { shots };
    }

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
      await shot('dome_day', { x: info.day.x, y: info.day.y, width: info.day.w, height: 260, scale: 2 });
      await shot('dome_night', { x: info.night.x, y: info.night.y, width: info.night.w, height: 260, scale: 2 });
      return { info, shots };
    }

    if (MODE === 'place') {
      const info = await ev(`(()=>{
        const N=GV.N();let spot=null;
        for(let y=6;y<N-6&&!spot;y++)for(let x=6;x<N-6;x++){
          const row=GV.art574.tileAt613(x,y,2,2);if(!row)continue;
          const tt=row.split(' ').join('').split(String.fromCharCode(10)).join('').split(String.fromCharCode(13)).join('');
          if(tt.length>=4&&tt.split('.').join('')===''){let ok=true;
            for(let dy=-1;dy<=2&&ok;dy++)for(let dx=-1;dx<=2;dx++){const c=(GV.art574.tileAt613(x+dx,y+dy,1,1)||'').trim();if(c.indexOf('B')>=0||c.indexOf('r')>=0)ok=false;}
            if(ok){spot=[x,y];break;}}}
        if(!spot)return {err:'找不到 2×2 空地'};
        const [x,y]=spot;const ok=GV.place('georgeInn',x,y);
        const b=GV.art574.tileAt613(x,y,2,2);
        return {spot:[x,y],placed:ok,cell:b};
      })()`);
      if (info.err) return { err: info.err, shots };
      const [x, y] = info.spot;
      await ev(`GV.art574.plant574([{k:194,lv:1,v:0,x:${x},y:${y}}]);1`);
      await ev(`GV.setVisT(${CY * 0.5});GV.lookAt(${x},${y});GV.art574.zoom574(2);GV.forceDraw();1`);
      await shot('place_near');
      const vp = await ev('JSON.stringify({w:innerWidth,h:innerHeight})');
      const V = JSON.parse(vp);
      await shot('place_zoom', { x: Math.round(V.w / 2 - 220), y: Math.round(V.h / 2 - 300), width: 440, height: 560, scale: 2 });
      await ev(`GV.lookAt(${x},${y});GV.art574.zoom574(0.6);GV.forceDraw();1`);
      await shot('place_far');
      await ev(`GV.setVisT(${CY * 0.85});GV.lookAt(${x},${y});GV.art574.zoom574(2);GV.forceDraw();1`);
      await shot('place_near_night');
      await shot('place_night_zoom', { x: Math.round(V.w / 2 - 220), y: Math.round(V.h / 2 - 300), width: 440, height: 560, scale: 2 });
      return { info, shots };
    }

    if (MODE === 'near') {
      const info = await ev(`(()=>{
        const N=GV.N();let spot=null;
        for(let y=6;y<N-6&&!spot;y++)for(let x=6;x<N-6;x++){
          const row=GV.art574.tileAt613(x,y,2,2);if(!row)continue;
          const tt=row.split(' ').join('').split(String.fromCharCode(10)).join('').split(String.fromCharCode(13)).join('');
          if(tt.length>=4&&tt.split('.').join('')===''){spot=[x,y];break;}}
        if(!spot)return {err:'找不到 2×2 空地'};
        const [x,y]=spot;const ok=GV.place('georgeInn',x,y);
        return {spot:[x,y],placed:ok};})()`);
      if (info.err) return { err: info.err, shots };
      const [x, y] = info.spot;
      await ev(`GV.art574.plant574([{k:194,lv:1,v:0,x:${x},y:${y}}]);1`);
      await ev(`GV.setVisT(${CY*0.5});GV.lookAt(${x},${y});GV.art574.zoom574(1.3);GV.forceDraw();1`);
      await shot('near_day');
      const vp = await ev('JSON.stringify({w:innerWidth,h:innerHeight})');
      const V = JSON.parse(vp);
      await shot('near_day_zoom', {x: Math.round(V.w/2-250), y: Math.round(V.h/2-350), width: 500, height: 640, scale: 2});
      await ev(`GV.setVisT(${CY*0.85});GV.forceDraw();1`);
      await shot('near_night');
      await shot('near_night_zoom', {x: Math.round(V.w/2-250), y: Math.round(V.h/2-350), width: 500, height: 640, scale: 2});
      return { info, shots };
    }


    if (MODE === 'guard') {
      const g1 = await ev(`(()=>{
        const S=GV.art574.SPR(),sp=S.bld&&S.bld['${KEY}'];
        if(!sp)return {err:'${KEY} 不存在'};
        const CX=sp.ax,CY=sp.ay-64,RX=64,RY=32;                 // 2×2 台基橢圓（A.dia R=64）
        const d=sp.img.getContext('2d').getImageData(0,0,sp.w,sp.h).data;
        const ymax=new Array(sp.w).fill(-1);let n=0,edge=0,x0=1e9,x1=-1,y0=1e9,y1=-1;
        for(let y=0;y<sp.h;y++)for(let x=0;x<sp.w;x++){
          const i=(y*sp.w+x)*4;if(d[i+3]<=120)continue;n++;
          if(y>ymax[x])ymax[x]=y;
          if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
          if(x<=1||y<=1||x>=sp.w-2||y>=sp.h-2)edge++;}
        // 台基＝2×2 等距菱形（實測：中心 (ax, ay-32)、半寬 64、半高 31.5）；每欄最低實心像素不得越過前緣
        let bad=0,maxOver=0,hist={};const sample=[];
        for(let x=0;x<sp.w;x++){if(ymax[x]<0)continue;
          const u=Math.abs(x-CX)/64;if(u>1)continue;
          const rim=CY+32+(1-u)*31.5;                // 菱形前緣（左肩 (4,150) → 前角 (68,181.5)）
          const over=ymax[x]-rim;
          if(over>0.5){bad++;if(over>maxOver)maxOver=over;const k='dx'+((Math.floor((x-CX)/8))*8);
            hist[k]=(hist[k]||0)+1;if(sample.length<10)sample.push([x,ymax[x],Math.round(rim),+over.toFixed(1)]);}}
        return {solid:n,edge,bbox:[x0,x1,y0,y1],badCols:bad,maxOver:+maxOver.toFixed(1),hist,sample,w:sp.w,h:sp.h};
      })()`);
      return { guard: g1, shots };
    }

    if (MODE === 'shape') {
      const s1 = await ev(`(()=>{
        const S=GV.art574.SPR();
        const one=k=>{const sp=S.bld&&S.bld[k];if(!sp)return {k,err:'無'};
          const d=sp.img.getContext('2d').getImageData(0,0,sp.w,sp.h).data;
          const prof=[];for(let x=0;x<sp.w;x++){let lo=-1,hi=-1;
            for(let y=0;y<sp.h;y++){const i=(y*sp.w+x)*4;if(d[i+3]<=120)continue;if(hi<0)hi=y;lo=y;}
            prof.push([x,hi,lo]);}
          return {k,ax:sp.ax,ay:sp.ay,CY:sp.ay-64,
            pick:[4,20,36,52,68,84,100,116,131].map(x=>prof[x]),
            loMaxAll:prof.reduce((a,p)=>Math.max(a,p[2]),-1)};};
        return {shipped192:one('192_1_0'),mine193:one('${KEY}')};
      })()`);
      return { shape: s1, shots };
    }

    return { err: '未知 mode：' + MODE, shots };
  });
  console.log(JSON.stringify(session.result || session, null, 1));
})().catch(e => { console.error('FAIL', e && e.message); process.exit(1); });
