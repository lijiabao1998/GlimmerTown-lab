// T694 守衛：白塔夜燈修正（N）＋伊莉莎白塔鐘盤方框圓盤、指針 3:00（D）。精靈開機時烘，開兩次遊戲：預設／開機前設閥門 __noKeepNight694、__noDial694。
//   ① 閥門版四張精靈（188_1_0、188_1_1、190_1_0、191_1_0）的數字等於動手前在 T693 程式量的舊值；新版數字成立；
//   ② 四張精靈新舊像素雜湊都不同、其他地標（187、189、192）相同；
//   ③ 兩局的自檢 keepNightDial694 都綠（閥門那局只驗尺寸）。
// 用法：node probe694.js   退出碼 0＝守衛成立
'use strict';
const { withGame } = require('./harness.js');
const MEAS = `(()=>{const S=GV.art574.SPR().bld,out={};const px=c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data;
  const h=d=>{let a=2166136261>>>0;for(let i=0;i<d.length;i++){a^=d[i];a=Math.imul(a,16777619)>>>0;}return a.toString(16);};
  for(const k of ['188_1_0','188_1_1','190_1_0','191_1_0','187_1_0','189_1_0','192_1_0']){const s=S[k];if(!s){out[k]=null;continue;}const d=px(s.img),n=s.night?px(s.night):null;let leadLit=0,nLit=0,nBright=0;
    for(let i=0;i<d.length;i+=4){if(!n||n[i+3]<=40)continue;nLit++;const r=d[i],g=d[i+1],b=d[i+2];if(d[i+3]>200&&b>r+6&&b>=g&&r>90&&r<200)leadLit++;if(n[i]>230&&n[i+1]>220&&n[i+2]>170)nBright++;}
    out[k]={leadLit,nLit,nBright,h:h(d)+'/'+(n?h(n):'-')};}
  out.self=window.GV.keepNightDialSelftest694();return out;})()`;
const boot = async pre => { const r = await withGame({ port: 8199, timeout: 400, log: () => {}, preScript: pre }, async ({ cdp }) => {
  const q = await cdp.send('Runtime.evaluate', { expression: MEAS, returnByValue: true, awaitPromise: true }); if (q.exceptionDetails) throw new Error(JSON.stringify(q.exceptionDetails).slice(0, 400)); return q.result.value; });
  if (!r.result) throw new Error('遊戲局失敗 ' + JSON.stringify(r.fails)); await new Promise(s => setTimeout(s, 1200)); return r.result; };
(async () => {
  const N = await boot(''), O = await boot('window.__noKeepNight694=true;window.__noDial694=true;');
  for (const k of ['188_1_0', '188_1_1', '190_1_0', '191_1_0']) console.log(k + '　新 ' + JSON.stringify(N[k]) + '　閥門 ' + JSON.stringify(O[k]));
  console.log('自檢 新 ' + JSON.stringify(N.self.ok) + '／閥門 ' + JSON.stringify(O.self.ok));
  const old = { '188_1_0': [12, 131], '188_1_1': [4, 130] };
  const checks = [
    ['閥門版等於 T693 的舊精靈：白塔鉛皮上夜光 12／4、夜光像素 131／130；鐘盤最亮 150／707', O['188_1_0'].leadLit === 12 && O['188_1_0'].nLit === 131 && O['188_1_1'].leadLit === 4 && O['188_1_1'].nLit === 130 && O['190_1_0'].nBright === 150 && O['191_1_0'].nBright === 707],
    ['新版：白塔鉛皮上夜光 0／0、夜光像素 96／101；鐘盤最亮 170／727（跟決策單原型逐像素相同那一份）', N['188_1_0'].leadLit === 0 && N['188_1_1'].leadLit === 0 && N['188_1_0'].nLit === 96 && N['188_1_1'].nLit === 101 && N['190_1_0'].nBright === 170 && N['191_1_0'].nBright === 727],
    ['四張精靈新舊雜湊都不同', ['188_1_0', '188_1_1', '190_1_0', '191_1_0'].every(k => N[k].h !== O[k].h)],
    ['聖保羅 187、巴特西 189／192 新舊相同', ['187_1_0', '189_1_0', '192_1_0'].every(k => N[k] && O[k] && N[k].h === O[k].h)],
    ['兩局自檢 keepNightDial694 都綠', N.self.ok && O.self.ok],
  ];
  for (const [k, ok] of checks) console.log((ok ? '  ✓ ' : '  ✗ ') + k);
  const ok = checks.every(c => c[1]);
  console.log(ok ? 'OK T694 守衛成立' : 'X T694 守衛不成立'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
