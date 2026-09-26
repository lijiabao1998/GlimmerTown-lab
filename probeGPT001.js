#!/usr/bin/env node
/* T657（原 GPT-001；合併時樣張改存 shots657/）英國維多利亞街角店屋像素守衛
 * GPT 端只寫不跑；合併者本機執行：node probeGPT001.js
 */
'use strict';
const fs=require('fs'),path=require('path');
const {withGame,ROOT}=require('./harness.js');
const outDir=path.join(ROOT,'shots657');
const dataUrlToFile=(u,f)=>fs.writeFileSync(f,Buffer.from(String(u).split(',')[1]||'','base64'));

(async()=>{
  fs.mkdirSync(outDir,{recursive:true});
  const session=await withGame({port:8199,timeout:300,fresh:true,log:(...a)=>console.log('  '+a.join(' '))},async({cdp})=>{
    return await cdp.evalJs(`(()=>{
      const oldF=window.__facadeForce577,oldO=window.__noGPTCornerShop001;
      const crc=cv=>{const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let h=2166136261>>>0;for(let i=0;i<d.length;i++){h^=d[i];h=Math.imul(h,16777619);}return h>>>0;};
      const stat=s=>{const d=s.img.getContext('2d').getImageData(0,0,s.w,s.h).data,n=s.night&&s.night.getContext('2d').getImageData(0,0,s.w,s.h).data;let day=0,night=0,bad=0;
        for(let i=3;i<d.length;i+=4){if(d[i]>20)day++;if(n&&n[i]>40){night++;if(d[i]<40)bad++;}}
        return {day,night,bad,dayCrc:crc(s.img),nightCrc:s.night?crc(s.night):0,w:s.w,h:s.h,sty:s.__t547&&s.__t547.sty,
          dayPng:s.img.toDataURL('image/png'),nightPng:s.night?s.night.toDataURL('image/png'):null};};
      let a,b;try{
        window.__facadeForce577='ukCornerShopGPT001';window.__noGPTCornerShop001=false;a=stat(GV.makeBlockSprite547(2,1,2,2,4));
        window.__noGPTCornerShop001=true;b=stat(GV.makeBlockSprite547(2,1,2,2,4));
      }finally{window.__facadeForce577=oldF;window.__noGPTCornerShop001=oldO;}
      return {newer:a,old:b};
    })()`);
  });
  if(!session.result){console.error('X probe 失敗',session.fails);process.exit(1);}
  const r=session.result;
  dataUrlToFile(r.newer.dayPng,path.join(outDir,'GPT001_new_day.png'));
  if(r.newer.nightPng)dataUrlToFile(r.newer.nightPng,path.join(outDir,'GPT001_new_night.png'));
  dataUrlToFile(r.old.dayPng,path.join(outDir,'GPT001_old_day.png'));
  if(r.old.nightPng)dataUrlToFile(r.old.nightPng,path.join(outDir,'GPT001_old_night.png'));
  const clean=q=>({day:q.day,night:q.night,bad:q.bad,dayCrc:q.dayCrc,nightCrc:q.nightCrc,w:q.w,h:q.h,sty:q.sty});
  console.log(JSON.stringify({newer:clean(r.newer),old:clean(r.old),dayChanged:r.newer.dayCrc!==r.old.dayCrc},null,2));
  if(r.newer.bad!==0||r.newer.dayCrc===r.old.dayCrc){console.error('X 守衛紅：浮空夜光或新舊日圖相同');process.exit(1);}
  console.log('OK GPT-001 像素守衛；仍需人工查看 shots657 新／舊日夜圖，確認無穿模、怪線、非法交疊。');
})().catch(e=>{console.error('X '+e.message);process.exit(1);});
