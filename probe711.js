// T711 守衛（太陽能園區 v3/v4、離岸風電、抽蓄水力重畫）：同一份遊戲開機兩次——①閥門 __noRenew711（舊畫法）②預設（新畫法）；逐鍵比較全部建築精靈（白天＋夜圖）的像素雜湊。
//   斷言：②跟①不同的精靈剛好是宣告的 12 張（每張都變、沒有別張變）；兩次開機精靈鍵一樣；variants574 批次跑完沒錯；②的常駐自檢 renewSelftest711 全綠。
// 由 scratchpad/fix/fixreg.js 產生。用法：node probe711.js [--port=8199]   退出碼 0＝守衛成立
'use strict';
const path=require('path');const PORT=+((process.argv.find(a=>a.startsWith('--port='))||'--port=8199').slice(7));
const KEYS=["143_1_3","143_1_4","144_1_0","144_1_1","144_1_2","144_1_3","144_1_4","147_1_0","147_1_1","147_1_2","147_1_3","147_1_4"],EXTRA=[];
const HASH=`(()=>{const B=GV.art574.SPR().bld,out={};const h=c=>{if(!c||!c.getContext)return 'none';const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let a=2166136261>>>0;for(let i=0;i<d.length;i++){a^=d[i];a=Math.imul(a,16777619)>>>0;}return c.width+'x'+c.height+':'+a.toString(16);};
  for(const k of Object.keys(B)){const s=B[k];if(!s||!s.img)continue;out[k]=h(s.img)+'|'+h(s.night)+'|'+s.ax+','+s.ay+(s.sc!==undefined?'|sc'+s.sc:'');}
  let st=null;try{st=GV.renewSelftest711();}catch(e){st={ok:false,checks:['擲錯 '+e.message]};}
  return JSON.stringify({out,st,t574:window.__t574||null});})()`;
async function run(pre){const {withGame}=require(path.join(__dirname,'harness.js'));
  const r=await withGame({port:PORT,timeout:300,log:()=>{},preScript:pre||undefined},async({cdp})=>{const q=await cdp.send('Runtime.evaluate',{expression:HASH,returnByValue:true,awaitPromise:true});if(q.exceptionDetails)throw new Error(JSON.stringify(q.exceptionDetails).slice(0,300));return JSON.parse(q.result.value);});
  if(!r.result)throw new Error('開不起來 '+JSON.stringify(r.fails));return r.result;}
(async()=>{const A=await run('window.__noRenew711=true;'),C=await run();const checks=[],add=(t,ok)=>checks.push((ok?'✓ ':'✗ ')+t);
  const ka=Object.keys(A.out),kc=Object.keys(C.out),diff=ka.filter(k=>k in C.out&&A.out[k]!==C.out[k]);
  const extra=diff.filter(k=>!KEYS.includes(k)&&!EXTRA.includes(k)),same=KEYS.filter(k=>!diff.includes(k));
  add('閥門關：'+ka.length+' 個建築精靈裡，跟閥門版不同的剛好是宣告的 '+KEYS.length+' 張（多出：'+(extra.join(',')||'無')+'；沒變：'+(same.join(',')||'無')+'）',extra.length===0&&same.length===0);
  add('兩次開機精靈鍵一樣（多出：'+(kc.filter(k=>!(k in A.out)).join(',')||'無')+'；少了：'+(ka.filter(k=>!(k in C.out)).join(',')||'無')+'）',ka.length===kc.length&&kc.every(k=>k in A.out));
  const tC=C.t574||{};add('variants574 批次全部跑完、沒有錯（'+tC.ok+'/'+tC.batches+'）',!!tC.batches&&(tC.err||[]).length===0&&tC.ok===tC.batches);
  add('常駐自檢 renewSelftest711 全綠：'+(C.st&&C.st.checks||[]).join('；'),!!(C.st&&C.st.ok));
  console.log(checks.join('\n'));const ok=checks.every(c=>c.startsWith('✓'));console.log(ok?'全綠 '+checks.length+'/'+checks.length:'有紅');process.exit(ok?0:1);
})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
