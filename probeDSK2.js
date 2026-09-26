// probeDSK2.js — DSK-002 聖保羅座堂（k187）
// 用法：
//   node probeDSK2.js --mode=sprite            精靈放大 4 倍（白天／夜晚／放大細節）——美術迭代用
//   node probeDSK2.js --mode=place             種子城放一座座堂，近景（z=2）／遠景（z=0.6）
//   node probeDSK2.js --mode=guard             同 run A/B：SPR.bld['187_1_0'] 有／無，差異像素＋越界檢查
//
// 邊界：自用埠 8199；harness 進城前一律設 slot=3，不碰業主存檔（AUTORUN.md）。
'use strict';
const fs = require('fs');
const path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');

const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const MODE = arg('mode', 'sprite');
const SEED = +arg('seed', 5162026);
const OUT = arg('out', 'shots658');

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

    if (MODE === 'sprite') {
      const info = await ev(`(()=>{
        const S=GV.art574.SPR(),sp=S.bld&&S.bld['187_1_0'];
        if(!sp){return {err:'187_1_0 不存在'};}
        const SC=4,pad=6;
        const mk2=(src,bg)=>{const c=document.createElement('canvas');c.width=sp.w*SC+pad*2;c.height=sp.h*SC+pad*2;
          c.style.cssText='position:fixed;left:'+(src===sp.img?0:420)+'px;top:0;z-index:99999;image-rendering:pixelated';
          const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);
          if(src)g.drawImage(src,pad,pad,sp.w*SC,sp.h*SC);
          g.fillStyle='#ffd27a';g.font='12px monospace';g.fillText(src===sp.img?'day':'night',pad+2,pad+13);
          document.body.appendChild(c);return c;};
        const cd=mk2(sp.img,'#3a4756'),cn=mk2(sp.night,'#141821');
        const rd=(c)=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;const b=[1e9,1e9,-1,-1];
          for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){if(d[(y*c.width+x)*4+3]>40&&!(x<sp.w*SC+pad&&x>pad-1&&y<pad)){n++;}}
          return n;};
        const r1=cd.getBoundingClientRect(),r2=cn.getBoundingClientRect();
        return {day:{x:r1.x,y:r1.y,w:r1.width,h:r1.height},night:{x:r2.x,y:r2.y,w:r2.width,h:r2.height},ax:sp.ax,ay:sp.ay,sw:sp.w,sh:sp.h};
      })()`);
      if (info.err) return { err: info.err, shots };
      await shot('sprite_day', { x: info.day.x, y: info.day.y, width: info.day.w, height: info.day.h, scale: 1 });
      await shot('sprite_night', { x: info.night.x, y: info.night.y, width: info.night.w, height: info.night.h, scale: 1 });
      await shot('zoom_upper', { x: info.day.x, y: info.day.y + 6, width: info.day.w, height: 280, scale: 2 });
      await shot('zoom_lower', { x: info.day.x, y: info.day.y + 280, width: info.day.w, height: 270, scale: 2 });
      return { info, shots };
    }

    if (MODE === 'variants') {
      const expr = "(()=>{const S=GV.art574.SPR(),SC=2,pad=6;" +
        "const L=['187_1_0','187_1_1','187_1_2'].map(k=>S.bld[k]).filter(Boolean);" +
        "if(L.length<3)return {err:'變體不足 '+L.length};" +
        "const W=72*SC+pad*2,H=136*SC+pad*2;" +
        "const c=document.createElement('canvas');c.width=W*3;c.height=H*2;" +
        "c.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#20242c;image-rendering:pixelated';" +
        "const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#20242c';g.fillRect(0,0,c.width,c.height);g.font='13px monospace';" +
        "L.forEach((sp,i)=>{g.drawImage(sp.img,i*W+pad,pad,72*SC,136*SC);" +
        "g.fillStyle='#ffd27a';g.fillText(['v0 巴洛克圓頂','v1 哥德尖塔','v2 洋蔥頂'][i],i*W+pad+4,pad+14);" +
        "if(sp.night){g.drawImage(sp.night,i*W+pad,H+pad,72*SC,136*SC);g.fillStyle='#9fb0c8';g.fillText('night',i*W+pad+4,H+pad+14);}});" +
        "document.body.appendChild(c);const r=c.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};})()";
      const info = await ev(expr);
      if (info.err) return { err: info.err, shots };
      await shot('variants', { x: 0, y: 0, width: Math.min(info.w, 1240), height: info.h, scale: 1 });
      return { info, shots };
    }

    if (MODE === 'nearzoom') {
      // 同一座城、同一台相機、同一個 visT：只切 __noNearCath187，拍近距層關／開兩張（v1、v2 各一組）。
      // 地點要先找到「detailPermit432 預算放行」的格子，否則那格本來就不長細節、對照圖會看不出差別。
      const spot = await ev(`(()=>{const N=GV.N();for(let y=8;y<N-8;y++)for(let x=8;x<N-8;x++){
        if(GV.art574.tileAt613(x,y,1,1).trim()!=='.')continue;
        if(!(GV.detailPermit432&&GV.detailPermit432(x,y,599,2.4,.62)))continue;let ok=true;
        for(let dy=-2;dy<=2&&ok;dy++)for(let dx=-2;dx<=2;dx++){const c=GV.art574.tileAt613(x+dx,y+dy,1,1).trim();if(c.indexOf('B')>=0||c.indexOf('r')>=0)ok=false;}
        if(ok)return [x,y];}return null;})()`);
      if (!spot) return { err: '找不到預算放行的空地', shots };
      const out = {};
      for (const v of [1, 2]) {
        await ev(`GV.art574.plant574([{k:187,lv:1,v:${v},x:${spot[0]},y:${spot[1]}}]);1`);
        await ev(`GV.setVisT(${await ev('GV.art574.cycle574()')} * 0.5);GV.lookAt(${spot[0]},${spot[1]});GV.art574.zoom574(2.4);window.__noNearCath187=false;GV.forceDraw();1`);
        await shot(`nearzoom_v${v}_on`);
        await ev(`window.__noNearCath187=true;GV.forceDraw();1`);
        await shot(`nearzoom_v${v}_off`);
        const vp = JSON.parse(await ev('JSON.stringify({w:innerWidth,h:innerHeight})'));
        const clip = { x: Math.round(vp.w / 2 - 150), y: Math.round(vp.h / 2 - 260), width: 300, height: 420, scale: 2 };
        await ev(`window.__noNearCath187=false;GV.forceDraw();1`);
        await shot(`nearzoom_v${v}_on_zoom`, clip);
        await ev(`window.__noNearCath187=true;GV.forceDraw();1`);
        await shot(`nearzoom_v${v}_off_zoom`, clip);
        await ev(`window.__noNearCath187=false;GV.forceDraw();1`);
        out['v' + v] = true;
      }
      // 同一 run 內量差異像素：近距（2.4）應該有差、遠距（0.6）應該零差
      const diff = await ev(`(()=>{
        const cvs=document.getElementById('game');
        const g=cvs.getContext('2d',{willReadFrequently:true});
        const W=280,H=420,X=Math.round(cvs.width/2-W/2),Y=Math.round(cvs.height/2-H/2+40);
        const grab=()=>g.getImageData(X,Y,W,H).data.slice();
        const run=(zz)=>{GV.art574.zoom574(zz);window.__noNearCath187=true;GV.forceDraw();const a=grab();
          window.__noNearCath187=false;GV.forceDraw();const b=grab();let n=0;
          for(let i=0;i<a.length;i+=4)if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2])n++;
          return n;};
        const near=run(2.4),far=run(0.6);
        const CY2=GV.art574.cycle574();GV.setVisT(CY2*0.86);const night=run(2.4);GV.setVisT(CY2*0.5);GV.art574.zoom574(2.4);GV.forceDraw();
        return {near,far,night,box:[W,H],cvs:cvs.width+"x"+cvs.height};})()`);
      return { spot, diff, out, shots };
    }

    if (MODE === 'keepzoom') {
      const spot = await ev("(function(){var N=GV.N();for(var y=8;y<N-8;y++)for(var x=8;x<N-8;x++){if(GV.art574.tileAt613(x,y,1,1).trim()!==String.fromCharCode(46))continue;if(!(GV.detailPermit432&&GV.detailPermit432(x,y,599,2.4,.62)))continue;var ok=true;for(var dy=-2;dy<=2&&ok;dy++)for(var dx=-2;dx<=2;dx++){var c=GV.art574.tileAt613(x+dx,y+dy,1,1).trim();if(c.indexOf(String.fromCharCode(66))>=0||c.indexOf(String.fromCharCode(114))>=0)ok=false;}if(ok)return [x,y];}return null;})()");
      if(!spot) return { err: '找不到預算放行的空地', shots };
      const vp = JSON.parse(await ev("JSON.stringify({w:innerWidth,h:innerHeight})"));
      const clip = { x: Math.round(vp.w/2-150), y: Math.round(vp.h/2-260), width: 300, height: 420, scale: 2 };
      const KV = +(arg('v', '0'));
      await ev("GV.art574.plant574([{k:188,lv:1,v:"+KV+",x:"+spot[0]+",y:"+spot[1]+"}]);1");
      const CY3 = await ev("GV.art574.cycle574()");
      await ev("GV.setVisT("+CY3*0.5+");GV.lookAt("+spot[0]+","+spot[1]+");GV.art574.zoom574(2.4);window.__noNearKeep188=false;GV.forceDraw();1");
      await shot("keep_near_v"+KV);
      await shot("keep_near_zoom_v"+KV, clip);
      await ev("window.__noNearKeep188=true;GV.forceDraw();1");
      await shot("keepzoom_off_zoom_v"+KV, clip);
      await ev("window.__noNearKeep188=false;GV.forceDraw();1");
      await shot("keepzoom_on_zoom_v"+KV, clip);
      await ev("GV.setVisT("+CY3*0.86+");window.__noNearKeep188=true;GV.forceDraw();1");
      await shot("keep_near_night_off_v"+KV, clip);
      await ev("window.__noNearKeep188=false;GV.forceDraw();1");
      await shot("keep_near_night_on_v"+KV, clip);
      const diff = await ev("(function(){var cvs=document.getElementById(String.fromCharCode(103,97,109,101));var g=cvs.getContext(String.fromCharCode(50,100),{willReadFrequently:true});var W=280,H=420,X=Math.round(cvs.width/2-W/2),Y=Math.round(cvs.height/2-H/2+40);var grab=function(){return g.getImageData(X,Y,W,H).data.slice();};var run=function(zz){GV.art574.zoom574(zz);window.__noNearKeep188=true;GV.forceDraw();var a=grab();window.__noNearKeep188=false;GV.forceDraw();var b=grab();var n=0;for(var i=0;i<a.length;i+=4)if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2])n++;return n;};var near=run(2.4);var far=run(0.6);GV.art574.zoom574(2.4);GV.forceDraw();return {near:near,far:far};})()");
      return { spot, v:KV, diff, shots };
    }
    if (MODE === 'battzoom') {
      const spot = await ev("(function(){var N=GV.N();for(var y=8;y<N-8;y++)for(var x=8;x<N-8;x++){if(GV.art574.tileAt613(x,y,1,1).trim()!==String.fromCharCode(46))continue;if(!(GV.detailPermit432&&GV.detailPermit432(x,y,599,2.4,.62)))continue;var ok=true;for(var dy=-2;dy<=2&&ok;dy++)for(var dx=-2;dx<=2;dx++){var c=GV.art574.tileAt613(x+dx,y+dy,1,1).trim();if(c.indexOf(String.fromCharCode(66))>=0||c.indexOf(String.fromCharCode(114))>=0)ok=false;}if(ok)return [x,y];}return null;})()");
      if(!spot) return { err: 'no spot', shots };
      await ev("GV.art574.plant574([{k:189,lv:1,v:0,x:"+spot[0]+",y:"+spot[1]+"}]);1");
      const CY4 = await ev("GV.art574.cycle574()");
      const vp = JSON.parse(await ev("JSON.stringify({w:innerWidth,h:innerHeight})"));
      const clip = { x: Math.round(vp.w/2-150), y: Math.round(vp.h/2-230), width: 300, height: 380, scale: 2 };
      await ev("GV.setVisT("+CY4*0.5+");GV.lookAt("+spot[0]+","+spot[1]+");GV.art574.zoom574(2.4);window.__noNearBattersea189=false;GV.forceDraw();1");
      await shot("batt_near");
      await shot("batt_near_zoom", clip);
      await ev("window.__noNearBattersea189=true;GV.forceDraw();1");
      await shot("battzoom_off_zoom", clip);
      await ev("window.__noNearBattersea189=false;GV.forceDraw();1");
      await shot("battzoom_on_zoom", clip);
      await ev("GV.setVisT("+CY4*0.86+");window.__noNearBattersea189=false;GV.forceDraw();1");
      await shot("batt_night_on", clip);
      const diff = await ev("(function(){var cvs=document.getElementById(String.fromCharCode(103,97,109,101));var g=cvs.getContext(String.fromCharCode(50,100),{willReadFrequently:true});var W=280,H=380,X=Math.round(cvs.width/2-W/2),Y=Math.round(cvs.height/2-H/2+40);var grab=function(){return g.getImageData(X,Y,W,H).data.slice();};GV.setVisT("+(CY4*0.5)+");var run=function(zz){GV.art574.zoom574(zz);window.__noNearBattersea189=true;GV.forceDraw();var a=grab();window.__noNearBattersea189=false;GV.forceDraw();var b=grab();var n=0;for(var i=0;i<a.length;i+=4)if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2])n++;return n;};var near=run(2.4);var far=run(0.6);GV.art574.zoom574(2.4);GV.forceDraw();return {near:near,far:far};})()");
      return { spot, diff, shots };
    }
    if (MODE === 'ascii') {
      const out = await ev(`(()=>{
        const S=GV.art574.SPR(),sp=S.bld&&S.bld['187_1_0'];
        if(!sp)return {err:'187_1_0 不存在'};
        const rd=(c)=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return d;};
        const d=rd(sp.img),n=sp.night?rd(sp.night):null;
        const rows=[];let minx=99,maxx=-1,miny=999,maxy=-1,op=0;
        for(let y=0;y<sp.h;y+=2){let s='';for(let x=0;x<sp.w;x+=1){const i=(y*sp.w+x)*4;const a=d[i+3];
          if(a>40){op++;if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y;s+=a>200?'#':'+';}else s+='.';}
          rows.push(String(y).padStart(3,' ')+' '+s);}
        let nop=0,lit=0;if(n){for(let i=0;i<n.length;i+=4){if(n[i+3]>40){nop++;if(n[i]>200&&n[i+2]<230)lit++;}}}
        return {rows,minx,maxx,miny,maxy,op,nop,lit,ax:sp.ax,ay:sp.ay};
      })()`);
      if (out.err) return { err: out.err, shots };
      return { ascii: out.rows, box: [out.minx, out.maxx, out.miny, out.maxy], op: out.op, nightOp: out.nop, lit: out.lit, shots };
    }

    if (MODE === 'place') {
      // 找一塊空的 1×1 草地，走真實放置路徑 GV.place('cathedral',x,y)
      const info = await ev(`(()=>{
        const N=GV.N();let spot=null;
        for(let y=6;y<N-6&&!spot;y++)for(let x=6;x<N-6;x++){const row=GV.art574.tileAt613(x,y,1,1);if(!row)continue;
          if(row.trim()==='.'){let ok=true;for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++){const c=GV.art574.tileAt613(x+dx,y+dy,1,1).trim();if(c.indexOf('B')>=0||c.indexOf('r')>=0)ok=false;}if(ok){spot=[x,y];break;}}}
        if(!spot)return {err:'找不到空地'};
        const [x,y]=spot;const ok=GV.place('cathedral',x,y);
        const b=GV.art574.tileAt613(x,y,1,1).trim();
        const nb=[GV.art574.tileAt613(x-1,y,1,1),GV.art574.tileAt613(x+1,y,1,1),GV.art574.tileAt613(x,y-1,1,1),GV.art574.tileAt613(x,y+1,1,1)].map(s=>s.trim());
        return {spot:[x,y],placed:ok,cell:b,neighbours:nb};
      })()`);
      if (info.err) return { err: info.err, shots };
      const [x, y] = info.spot;
      await ev(`GV.art574.plant574([{k:187,lv:1,v:0,x:${x},y:${y}}]);1`);   // 完成圖：原樣放一座 age=30（age 0 是施工疊層）
      await ev(`GV.setVisT(${CY * 0.5});GV.lookAt(${x},${y});GV.art574.zoom574(2);GV.forceDraw();1`);
      await shot('place_near');
      const vp = await ev('JSON.stringify({w:innerWidth,h:innerHeight})');
      const V = JSON.parse(vp);
      await shot('place_zoom', { x: Math.round(V.w / 2 - 190), y: Math.round(V.h / 2 - 250), width: 380, height: 500, scale: 2 });
      await ev(`GV.lookAt(${x},${y});GV.art574.zoom574(0.6);GV.forceDraw();1`);
      await shot('place_far');
      await ev(`GV.setVisT(${CY * 0.85});GV.lookAt(${x},${y});GV.art574.zoom574(2);GV.forceDraw();1`);
      await shot('place_near_night');
      return { info, shots };
    }

    // ===== guard：同一 evalJs 內同步 A/B（有精靈／暫時拔掉精靈）＋越界與孤立像素 =====
    const guard = await ev(`(()=>{
      const S=GV.art574.SPR(),sp=S.bld&&S.bld['187_1_0'];
      if(!sp)return {err:'187_1_0 不存在'};
      const cnt=c=>{if(!c)return null;const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let op=0;const map=new Uint8Array(c.width*c.height);
        for(let i=0,p=0;i<d.length;i+=4,p++){if(d[i+3]>40){op++;map[p]=1;}}
        return {w:c.width,h:c.height,op,map};};
      const day=cnt(sp.img),night=cnt(sp.night);
      // 越界：不透明像素必須全部落在 x∈[1,70]、y∈[1,134]（畫布 72×136，下緣 ay=134）
      let outside=0,belowBase=0,left=0,right=0;
      for(let y=0;y<day.h;y++)for(let x=0;x<day.w;x++){if(!day.map[y*day.w+x])continue;
        if(x<1||x>70||y<1)outside++;if(y>134)belowBase++;if(x<sp.ax)left++;else right++;}
      // 孤立像素：不透明像素的四鄰 ≤1 個 ⇒ 碎點（擋「奇怪的綫／飛點」）
      let iso=0;
      for(let y=0;y<day.h;y++)for(let x=0;x<day.w;x++){if(!day.map[y*day.w+x])continue;
        let n=0;if(x>0&&day.map[y*day.w+x-1])n++;if(x<day.w-1&&day.map[y*day.w+x+1])n++;if(y>0&&day.map[(y-1)*day.w+x])n++;if(y<day.h-1&&day.map[(y+1)*day.w+x])n++;
        if(n<=1)iso++;}
      // 夜圖：亮像素（暖光）數
      let lit=0;if(sp.night){const d=sp.night.getContext('2d').getImageData(0,0,sp.w,sp.h).data;for(let i=0;i<d.length;i+=4){if(d[i+3]>40&&d[i]>200&&d[i+2]<220)lit++;}}
      // 對稱：以 ax 為軸左右不透明像素數
      return {ok:true,w:day.w,h:day.h,ax:sp.ax,ay:sp.ay,dayOp:day.op,nightOp:night?night.op:0,lit,outside,belowBase,left,right,iso,
              sym:Math.abs(left-right)/Math.max(1,left+right)};
    })()`);
    await ev(`GV.setVisT(${CY * 0.5});1`);
    return { guard, shots };
  });
  console.log(JSON.stringify({ ok: session.ok, fails: session.fails, seconds: session.seconds, ...(session.result || {}) }, null, 1));
  process.exit(session.ok ? 0 : 1);
})().catch(e => { console.error('DSK2 PROBE FAIL', e.message); process.exit(1); });
