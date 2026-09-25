#!/usr/bin/env node
/* GPT-001 integration helper.
 * GitHub Actions runs this on gpt/visual-place-identity because the GitHub connector cannot upload the 8MB index blob reliably.
 * It only edits this GPT branch checkout. No version/log/fp/DECISIONS changes.
 */
'use strict';
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const indexPath=path.join(ROOT,'index.html');
const smokePath=path.join(ROOT,'smoke.js');
const sourcePath=path.join(ROOT,'variants574','facade_gpt001.js');
const cardPath=path.join(ROOT,'docs','branch','GPT-001-victorian-corner-shop.md');

function once(s,a,b,label){
  const n=s.split(a).length-1;
  if(n!==1)throw new Error(label+' anchor count='+n);
  return s.replace(a,b);
}

function integrate(){
  let index=fs.readFileSync(indexPath,'utf8');
  let smoke=fs.readFileSync(smokePath,'utf8');
  const src=fs.readFileSync(sourcePath,'utf8');

  if(!index.includes("fs:'ukCornerShopGPT001'")){
    index=once(index,
      "{n:'townShop',   box:[.08,.84,.16,.94],hm:0.88,wd:[5,6],win:'arch'}",
      "{n:'townShop',fs:'ukCornerShopGPT001',box:[.08,.84,.16,.94],hm:0.88,wd:[5,6],win:'arch'}",
      'townShop');
  }

  if(!index.includes("_gptcs0")){
    index=once(index,
      "(window.__noDock650?'_dk0':'')+(window.__noOccWin653?'_ow0':'');",
      "(window.__noDock650?'_dk0':'')+(window.__noOccWin653?'_ow0':'')+(window.__noGPTCornerShop001?'_gptcs0':'');",
      'cache key');
  }

  if(!index.includes("GPT-001 source: variants574/facade_gpt001.js")){
    const marker="<!-- T578 英式美式立面風格（原樣整合自 variants574/facade_us1.js；驗證圖見 shots577/） -->";
    const embed="<!-- GPT-001 source: variants574/facade_gpt001.js -->\n<script>\n"+src+"\n</script>\n";
    index=once(index,marker,embed+marker,'US facade marker');
  }

  if(!smoke.includes("['gptCornerShop001'")){
    const anchor="      ['terrainTree655', \`(window.GV && window.GV.terrainTreeSelftest655) ? window.GV.terrainTreeSelftest655() : {ok:false,checks:['API 不存在']}\`],";
    const row="\n      ['gptCornerShop001', \`(window.GV && window.GV.gptCornerShopSelftest001) ? window.GV.gptCornerShopSelftest001() : {ok:false,checks:['API 不存在']}\`],";
    smoke=once(smoke,anchor,anchor+row,'smoke selftest');
  }

  // Static invariants before CI opens a browser.
  if(!index.includes("fs:'ukCornerShopGPT001'"))throw new Error('townShop dispatch missing');
  if(!index.includes("REG.ukCornerShopGPT001"))throw new Error('facade registry missing');
  if(!index.includes("_gptcs0"))throw new Error('cache isolation missing');
  if((index.match(/\{n:'townShop'/g)||[]).length!==1)throw new Error('townShop duplicated');

  fs.writeFileSync(indexPath,index);
  fs.writeFileSync(smokePath,smoke);
  console.log('GPT-001 integrated: index='+Buffer.byteLength(index)+' bytes; smoke hook=yes');
}

function markGreen(){
  let card=fs.readFileSync(cardPath,'utf8');
  const run=process.env.GITHUB_RUN_ID||'';
  const repo=process.env.GITHUB_REPOSITORY||'lijiabao1998/GlimmerTown-lab';
  const url=run?'https://github.com/'+repo+'/actions/runs/'+run:'GitHub Actions';
  card=card.replace('**狀態**：卡面（動手前）','**狀態**：🟢 GPT-001 施工完成；CI smoke 綠');
  card=card.replace('尚未施工。  \n**沒做成的事**：目前尚無；施工後如實補。',
`已施工：townShop 接入 ukCornerShopGPT001；新增 facade 原始碼、逃生閥快取隔離、smoke 自檢與 probeGPT001.js。  
**煙霧測試**：GitHub Actions 綠 — ${url}  
**像素守衛**：未跑，待合併者跑（依 AGENTS.md §5）。  
**樣張**：本次 GPT 無本機瀏覽器；待合併者執行 probeGPT001.js 產生。  
**沒做成的事**：GPT 端無法本機跑像素 probe / fp.js；未把這兩項寫成通過。`);
  fs.writeFileSync(cardPath,card);
  console.log('GPT-001 card marked with CI run '+url);
}

if(process.argv.includes('--mark-green'))markGreen();
else integrate();
