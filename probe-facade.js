// T577 立面風格探針。兩種模式：
//  接觸表：node probe-facade.js --style=ukTerrace --snippet=variants574/facade_uk1.js --k=1 --lv=1 --sizes=1x1,2x1,3x2,4x3 --vs=0,1,2 --port=8271 --scale=2 --out=shots577/uk1_iter1.png
//  街景：  node probe-facade.js --style=ukTerrace --snippet=... --k=1 --lv=1 --street=6x2,3x1,2x2 --v=0 --port=8271 --zoom=1 --out=shots577/uk1_street
// 接觸表輸出 PNG＋同名 .json（每格尺寸、是否走了風格繪製器、console 錯誤）。街景在種子城清一塊地、鋪一條路、種幾片同 k/lv/v 的 RCI 地格（遊戲自動合成超街區），日夜各一張。
'use strict';
const fs = require('fs'), path = require('path');
const { withGame, sleep, ROOT } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };
const STYLE = arg('style', ''), SNIP = arg('snippet', ''), PORT = +arg('port', 8271), K = +arg('k', 1), LV = +arg('lv', 1);
const SIZES = arg('sizes', '1x1,2x1,3x2,4x3').split(',').map(s => s.split('x').map(Number));
const VS = arg('vs', '0,1,2').split(',').map(Number), S = +arg('scale', 2), OUT = arg('out', 'shots577/facade.png');
const STREET = arg('street', ''), V1 = +arg('v', 0), ZOOM = +arg('zoom', 1);
if ([8123, 8199].includes(PORT)) { console.error('埠 8123／8199 禁用'); process.exit(2); }
const preScript = SNIP ? fs.readFileSync(SNIP, 'utf8') : '';
fs.mkdirSync(path.dirname(path.join(ROOT, OUT)), { recursive: true });

(async () => {
  const r = await withGame({ port: PORT, timeout: 300, preScript, log: () => {} }, async ({ cdp }) => {
    const ev = async e => { const q = await cdp.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (q.exceptionDetails) throw new Error((q.exceptionDetails.exception && q.exceptionDetails.exception.description) || q.exceptionDetails.text); return q.result.value; };
    await ev(`window.__facErr577=[];const __ce=console.error.bind(console);console.error=(...a)=>{try{window.__facErr577.push(a.map(x=>x&&x.stack?x.stack.split('\\n').slice(0,3).join(' | '):String(x)).join(' '));}catch(e){}__ce(...a);};window.__facadeForce577=${JSON.stringify(STYLE)}||undefined;GV.block559.cache().clear();1`);
    const registered = await ev(`Object.keys(window.__facade577||{})`);
    if (!STREET) {
      const rep = await ev(`(()=>{const B=GV.block559,S=${S},SIZES=${JSON.stringify(SIZES)},VS=${JSON.stringify(VS)},K=${K},LV=${LV};
        const cells=[];for(const v of VS)for(const [bw,bh] of SIZES){B.cache().clear();let sp=null,err=null;try{sp=B.make(K,LV,bw,bh,v);}catch(e){err=String(e&&e.stack||e).slice(0,200);}cells.push({v,bw,bh,sp,err});}
        const cw=Math.max(...cells.map(c=>c.sp?c.sp.w:64))*S+8,ch=Math.max(...cells.map(c=>c.sp?c.sp.h:64))*S+22,C=SIZES.length,R=VS.length;
        const cc=document.createElement('canvas');cc.width=cw*C*2+12;cc.height=ch*R;const g=cc.getContext('2d');g.imageSmoothingEnabled=false;
        g.font='bold 13px sans-serif';
        cells.forEach((c,i)=>{const col=i%C,row=Math.floor(i/C);for(const night of [0,1]){const X=col*cw+(night?cw*C+12:0),Y=row*ch;
          g.fillStyle=night?'#141a2c':'#5f8f4a';g.fillRect(X,Y,cw-2,ch-2);g.fillStyle=night?'#8aa0c8':'#1f2d18';g.fillText((night?'夜 ':'日 ')+'v'+c.v+' '+c.bw+'x'+c.bh+(c.sp&&c.sp.__t547&&c.sp.__t547.sty?' '+c.sp.__t547.sty:' (內建)'),X+4,Y+15);
          if(!c.sp){g.fillStyle='#e05050';g.fillText(c.err||'null',X+4,Y+40);continue;}
          const dx=X+((cw-2)-c.sp.w*S)/2,dy=Y+ch-4-c.sp.h*S;
          if(night){g.save();g.filter='brightness(0.36) saturate(0.7)';g.drawImage(c.sp.img,dx,dy,c.sp.w*S,c.sp.h*S);g.restore();if(c.sp.night)g.drawImage(c.sp.night,dx,dy,c.sp.w*S,c.sp.h*S);}
          else g.drawImage(c.sp.img,dx,dy,c.sp.w*S,c.sp.h*S);}});
        return {png:cc.toDataURL('image/png').split(',')[1],cells:cells.map(c=>({v:c.v,size:c.bw+'x'+c.bh,w:c.sp&&c.sp.w,h:c.sp&&c.sp.h,sty:c.sp&&c.sp.__t547&&c.sp.__t547.sty,err:c.err})),errors:window.__facErr577};})()`);
      fs.writeFileSync(path.join(ROOT, OUT), Buffer.from(rep.png, 'base64')); delete rep.png;
      fs.writeFileSync(path.join(ROOT, OUT.replace(/\.png$/, '.json')), JSON.stringify({ registered, ...rep }, null, 1));
      return { registered, cells: rep.cells, errors: rep.errors };
    }
    // 街景模式
    const grids = STREET.split(',').map(s => s.split('x').map(Number));
    await ev(`window.GV.metroArtSeedWorld516(5162026)`);
    await ev(`(()=>{const st=document.getElementById('start');if(st)st.style.display='none';const ov=document.getElementById('startOverlay456');if(ov){ov.classList.remove('show');ov.style.display='none';}document.querySelectorAll('.toast,#toast,#toasts,.hint,#hint,.coach,#coach456').forEach(e=>e.style.display='none');return 1;})()`);
    const placed = await ev(`(()=>{const A=GV.art574,G=${JSON.stringify(grids)},K=${K},LV=${LV},V=${V1};const CX=36,CY=36;A.clear574(CX-14,CY-14,28,28);
      // 路沿格 x 軸（畫面上是左上→右下的斜線），街屋列平行於路、亮面（+y 面）朝路
      const road=[];for(let i=-13;i<=13;i++)road.push([CX+i,CY+1]);A.road577(road);
      const list=[];let off=-12;for(const [gw,gh] of G){list.push({k:K,lv:LV,v:V,grid:[gw,gh],x:CX+off,y:CY-gh+1});off+=gw+1;}
      const out=A.plant574(list);GV.block559.cache().clear();GV.lookAt(CX,CY-1);A.zoom574(${ZOOM});return out;})()`);
    const CY = await ev('GV.art574.cycle574()'); const shots = {};
    for (const [tag, vt] of [['day', CY * 0.5], ['night', 0]]) {
      await ev(`GV.setVisT(${vt});(typeof GV.forceDraw==='function')&&GV.forceDraw();1`); await sleep(1300);
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }); const dest = path.join(ROOT, `${OUT}_${tag}.png`);
      fs.writeFileSync(dest, Buffer.from(shot.data, 'base64')); shots[tag] = path.relative(ROOT, dest);
    }
    const errors = await ev('window.__facErr577');
    return { registered, placed, shots, errors };
  });
  console.log(JSON.stringify({ ok: r.ok, fails: r.fails, seconds: r.seconds, ...(r.result || {}) }, null, 1)); process.exit(r.ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
