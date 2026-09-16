// T574 變體接觸表工具：把一個變體批次檔在「開機時」注入（跟正式整合完全同一條路：
// 註冊到 window.__variants574 → 後製鏈尾 runVariants574() 執行 → T573 剪影光影套上），
// 然後把每個分類的 v0/v1/v2 日夜並排渲染成一張圖，並輸出 JSON 報告。
//
// 用法：node variant-sheet.js --snippet=variants574/batch01.js --ks=31,32,35 --port=8211 --out=shots574/batch01.png [--scale=3]
const fs = require('fs');
const path = require('path');
const { withGame } = require('./harness.js');
const arg = (n, d) => { const h = process.argv.find(a => a.startsWith('--' + n + '=')); return h ? h.split('=').slice(1).join('=') : d; };

const SNIP = arg('snippet', '');
const KS = arg('ks', '').split(',').map(x => +x).filter(Boolean);
const PORT = +arg('port', 8211);
const OUT = arg('out', 'shots574/sheet.png');
const SCALE = +arg('scale', 3);
if (!KS.length) { console.error('需要 --ks=31,32'); process.exit(2); }
if ([8123, 8199].includes(PORT)) { console.error('埠 8123（玩家）與 8199（整合用）禁止使用'); process.exit(2); }
const preScript = SNIP ? fs.readFileSync(SNIP, 'utf8') : '';
fs.mkdirSync(path.dirname(OUT), { recursive: true });

(async () => {
  const res = await withGame({ port: PORT, timeout: 300, enterCity: false, preScript, log: () => {} }, async ({ cdp }) => {
    const ev = async expr => {
      const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
      return r.result.value;
    };
    for (let i = 0; i < 120; i++) { if (await ev('!!window.__bootDone453')) break; await new Promise(r => setTimeout(r, 1000)); }
    const expr = `(()=>{
      const A=GV.art574,SPR=A.SPR(),KS=${JSON.stringify(KS)},S=${SCALE};
      const rep={t574:window.__t574||null,cats:[]};
      const keysOf=k=>Object.keys(SPR.bld).filter(x=>x.startsWith(k+'_'));
      const px=c=>{try{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>40)n++;return n;}catch(e){return -1;}};
      const diff=(a,b)=>{try{if(a.width!==b.width||a.height!==b.height)return 'size';
        const x=a.getContext('2d').getImageData(0,0,a.width,a.height).data,y=b.getContext('2d').getImageData(0,0,b.width,b.height).data;
        let n=0;for(let i=0;i<x.length;i+=4)if(Math.abs(x[i]-y[i])+Math.abs(x[i+1]-y[i+1])+Math.abs(x[i+2]-y[i+2])+Math.abs(x[i+3]-y[i+3])>24)n++;return n;}catch(e){return -1;}};
      const rows=[];
      for(const k of KS){
        const ks=keysOf(k);const lv=ks.length?ks[0].split('_')[1]:'1';
        const sp=[0,1,2].map(v=>SPR.bld[k+'_'+lv+'_'+v]||null);
        const cat={k,lv:+lv,keys:ks,v:[]};
        sp.forEach((s,v)=>{cat.v.push(s?{v,w:s.w,h:s.h,ax:s.ax,ay:s.ay,px:px(s.img),hasNight:!!s.night,
          diffVsV0:(v&&sp[0])?diff(sp[0].img,s.img):0}:{v,missing:true});});
        rep.cats.push(cat);rows.push({k,sp});
      }
      const cellW=Math.max(64,...rows.flatMap(r=>r.sp.filter(Boolean).map(s=>s.w)))*S+8;
      const rowH=rows.map(r=>Math.max(40,...r.sp.filter(Boolean).map(s=>s.h))*S+26);
      const W=40+cellW*6+12,H=rowH.reduce((a,b)=>a+b,0)+8;
      const cc=document.createElement('canvas');cc.width=W;cc.height=H;
      const g=cc.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#202428';g.fillRect(0,0,W,H);
      g.font='bold 14px sans-serif';
      let y=4;
      rows.forEach((r,ri)=>{
        g.fillStyle='#e8e8e8';g.fillText('k'+r.k,4,y+18);
        for(let c=0;c<6;c++){
          const v=c%3,night=c>=3,x=40+c*cellW+(night?12:0),s=r.sp[v];
          g.fillStyle=night?'#141a2c':'#5f8f4a';g.fillRect(x,y,cellW-4,rowH[ri]-4);
          g.fillStyle=night?'#8aa0c8':'#1f2d18';g.fillText((night?'夜 v':'日 v')+v,x+4,y+16);
          if(!s){g.fillStyle='#e05050';g.fillText('缺',x+cellW/2-8,y+rowH[ri]/2);continue;}
          const dx=x+((cellW-4)-s.w*S)/2,dy=y+rowH[ri]-4-s.h*S-4;
          if(night){g.save();g.filter='brightness(0.36) saturate(0.7)';g.drawImage(s.img,dx,dy,s.w*S,s.h*S);g.restore();
            if(s.night)g.drawImage(s.night,dx,dy,s.w*S,s.h*S);}
          else g.drawImage(s.img,dx,dy,s.w*S,s.h*S);
        }
        y+=rowH[ri];
      });
      rep.png=cc.toDataURL('image/png').split(',')[1];
      return rep;
    })()`;
    const rep = await ev(expr);
    fs.writeFileSync(OUT, Buffer.from(rep.png, 'base64'));
    delete rep.png;
    fs.writeFileSync(OUT.replace(/\.png$/, '.json'), JSON.stringify(rep, null, 1));
    return rep;
  });
  const r = res.result || {};
  console.log(JSON.stringify({ ok: res.ok, fails: res.fails, seconds: res.seconds, t574: r.t574,
    cats: (r.cats || []).map(c => ({ k: c.k, v: c.v.map(x => x.missing ? 'missing' : `v${x.v}:${x.w}x${x.h} px${x.px} diff${x.diffVsV0}`) })) }, null, 1));
  console.log('wrote', OUT);
  process.exit(res.ok ? 0 : 1);
})().catch(e => { console.error('SHEET FAIL', e.message); process.exit(1); });
