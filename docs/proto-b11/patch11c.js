// 第十一批（續）：巴特西 2×2、白塔打磨、街角店屋／馬廄加高。臨時實驗碼（拍完 git checkout -- index.html 還原）
'use strict';
const fs = require('fs'), path = require('path');
const F = '/home/user/GlimmerTown-lab/index.html';
let s = fs.readFileSync(F, 'utf8');
const cnt = (h, a) => h.split(a).length - 1;
const rep = (a, b) => { const n = cnt(s, a); if (n !== 1) throw new Error('錨點出現 ' + n + ' 次：' + a.slice(0, 80)); s = s.replace(a, () => b); };
// 只在某一段裡換（白塔 v0 與 v1 有同樣的字串）
const repIn = (from, to, a, b) => { const i0 = s.indexOf(from), i1 = s.indexOf(to, i0 + 1); if (i0 < 0 || i1 < 0) throw new Error('段落找不到 ' + from.slice(0, 40));
  let seg = s.slice(i0, i1); const n = cnt(seg, a); if (n !== 1) throw new Error('段內錨點出現 ' + n + ' 次：' + a.slice(0, 80)); seg = seg.replace(a, () => b); s = s.slice(0, i0) + seg + s.slice(i1); };

// ① 巴特西 2×2（k192）
const BT = fs.readFileSync(path.join(__dirname, 'batt2.js'), 'utf8');
rep("  })();}catch(e){console.error('v574 k189',e);}\n\n  /* @@NEXT@@ */", "  })();}catch(e){console.error('v574 k189',e);}\n" + BT + "\n  /* @@NEXT@@ */");

// ② 白塔 v0 打磨（開機旗標 __x11Keep）：壁柱、圓頭窗、四角塔鉛蔥頂＋風標、旗移到蔥頂上
const K0 = '/* ======================== k188 白塔', K1 = '/* v1：主樓與三座角塔同 v0';
repIn(K0, K1, "      const S1=[SB[0],SB[1]-4];\n",
  "      const S1=[SB[0],SB[1]-4];\n      const X11=!!window.__x11Keep,cup=(cx,cy)=>{ell(g,cx,cy-2,2.6,1.3,WHX);dome(g,cx,cy-3,2,1,4,[LEADL,LEAD,'#7e8a95','#69758a']);P(g,cx,cy-9,1,2,LEAD);P(g,cx-1,cy-8,3,1,'#7e8a95');P(g,cx,cy-12,1,3,'#a9a394');P(g,cx,cy-12,2,1,GD);};\n");
repIn(K0, K1, "      box(g,S1,5.4,5.4,hK,WH,WHD,WHL);\n",
  "      box(g,S1,5.4,5.4,hK,WH,WHD,WHL);\n      if(X11)for(const d of [3,7]){P(g,fx(S1,-1,d),fy(S1,d)-hK,1,hK,WHL);P(g,fx(S1,-1,d+1),fy(S1,d+1)-hK,1,hK,WHD);P(g,fx(S1,1,d),fy(S1,d)-hK,1,hK,WH);P(g,fx(S1,1,d+1),fy(S1,d+1)-hK,1,hK,WHX);}\n");
repIn(K0, K1, "      for(let d=2;d<10;d+=3){P(g,fx(S1,1,d),fy(S1,d)-26,1,5,GL);",
  "      if(X11)for(const d0 of [1,5,9])for(const side of [-1,1]){faceRect(g,S1,side,d0,2,22,6,GL,true);band(g,S1,side,d0,d0+2,21,1,WHL);if(!(side>0&&d0===5)){faceRect(g,S1,side,d0,2,12,5,GL,true);band(g,S1,side,d0,d0+2,11,1,WHL);}\n        if(LU&&((d0+side+3)%3)!==0)faceRect(ng,S1,side,d0,2,22,6,LIT,true);}\n      if(!X11)for(let d=2;d<10;d+=3){P(g,fx(S1,1,d),fy(S1,d)-26,1,5,GL);");
repIn(K0, K1, "        if(LU&&(ti+tj)<28)P(ng,fx(TS,1,1),fy(TS,1)-(hK+10),1,4,'rgba(255,214,120,.5)');}",
  "        if(LU&&(ti+tj)<28)P(ng,fx(TS,1,1),fy(TS,1)-(hK+10),1,4,'rgba(255,214,120,.5)');\n        if(X11)cup(TS[0],TS[1]-(hK+7));}");
repIn(K0, K1, "{const TF=G(15,15),ty=TF[1]-(hK+7)-2;", "{const TF=G(15,15),ty=TF[1]-(hK+7)-2-(X11?7:0);");

// ③ 街角店屋、馬廄（執行期旗標 __x11Shop＝1 加高＋戶界煙囪／2 再加孟莎屋頂老虎窗；__x11Mews＝兩層開間；切換後清街區快取）
rep("    return {n:'mews',fs:'ukMews',box:[.12,.88,.28,.86],hm:0.58,wd:[8,9],win:'punch'};\n  return L[vv%L.length];",
    "    return {n:'mews',fs:'ukMews',box:[.12,.88,.28,.86],hm:window.__x11Mews?1.35:0.58,wd:[8,9],win:'punch'};\n  {const r=L[vv%L.length];if(window.__x11Shop&&r&&r.fs==='ukCornerShopGPT001')return Object.assign({},r,{hm:1.9});return r;}");
rep("  const {g,ng,G,v,wallH}=ctx;\n  const xW=R(G.W[0])", "  const {g,ng,G,v,wallH}=ctx,X11S=window.__x11Shop|0;\n  const xW=R(G.W[0])");
rep("    rc(g,x-1,y-d-5,5,1,lc); rc(g,x-1,y-d,5,1,tc); rc(g,x,y-d-4,3,4,gc); rc(g,x,y-d-2,3,1,sh(tc,-20));\n    if(ng&&lit)rc(ng,x,y-d-4,3,4,sideFace?'#d9c78f':'#ffdca0');",
    "    const wh=X11S?wh11:4; rc(g,x-1,y-d-wh-1,5,1,lc); rc(g,x-1,y-d,5,1,tc); rc(g,x,y-d-wh,3,wh,gc); rc(g,x,y-d-(wh>>1),3,1,sh(tc,-20));\n    if(ng&&lit)rc(ng,x,y-d-wh,3,wh,sideFace?'#d9c78f':'#ffdca0');");
rep("  const upper=H-shopH-4, nFloors=upper>=16?2:1;\n  for(let f=0;f<nFloors;f++){\n    const d=shopH+3+f*8,",
    "  const upper=H-shopH-4, nFloors=X11S?Math.max(1,Math.min(3,Math.round(upper/9))):(upper>=16?2:1), step11=X11S?Math.floor((upper-1)/nFloors):8; var wh11=step11>=10?6:5;\n  for(let f=0;f<nFloors;f++){\n    const d=shopH+3+f*step11,");
rep("  // 後縮煙囪＋陶土 chimney pots，完全留在建築 footprint 內。\n  const cp=A.paraPt559(G,.28,.28), cx=R(cp[0]), cy=R(cp[1])-H;",
`  let mh11=0;
  if(X11S===2){mh11=7;const ctr=[(roof.N[0]+roof.E[0]+roof.S[0]+roof.W[0])/4,(roof.N[1]+roof.E[1]+roof.S[1]+roof.W[1])/4];
    const inn=p=>[p[0]+(ctr[0]-p[0])*.14,p[1]+(ctr[1]-p[1])*.14-mh11],iN=inn(roof.N),iE=inn(roof.E),iS=inn(roof.S),iW=inn(roof.W);
    poly(g,[roof.W,roof.N,iN,iW],'#3e4650');poly(g,[roof.N,roof.E,iE,iN],'#3e4650');poly(g,[iN,iE,iS,iW],'#4c5158');
    poly(g,[roof.W,roof.S,iS,iW],'#5c6772');poly(g,[roof.S,roof.E,iE,iS],'#48525c');
    const lerp=(a,b,s)=>[a[0]+(b[0]-a[0])*s,a[1]+(b[1]-a[1])*s],nD=clamp(Math.floor(fw/16),2,4);
    for(let i=0;i<nD;i++){const s=(i+.5)/nD,e=lerp(roof.W,roof.S,s),q=lerp(iW,iS,s),x=R((e[0]+q[0])/2),y=R((e[1]+q[1])/2)+1;
      rc(g,x-2,y-6,5,6,'#d8d0bf');rc(g,x-1,y-5,3,4,glass);rc(g,x-3,y-7,7,1,'#3e4650');rc(g,x-2,y-8,5,1,'#4a5560');if(ng&&((i+v)%2===0))rc(ng,x-1,y-5,3,4,'#ffdca0');}
    if(sw>=7){const e=lerp(roof.S,roof.E,.5),q=lerp(iS,iE,.5),x=R((e[0]+q[0])/2),y=R((e[1]+q[1])/2)+1;rc(g,x-2,y-6,5,6,'#bdb5a4');rc(g,x-1,y-5,3,4,glassSide);rc(g,x-3,y-7,7,1,'#3e4650');}}
  if(X11S){const stack=(u,vv)=>{const p=A.paraPt559(G,u,vv),x=R(p[0]),y=R(p[1])-H-mh11;
      rc(g,x-3,y-8,3,8,sh(brick,4));rc(g,x,y-8,3,8,sh(brick,-28));rc(g,x-4,y-9,8,1,'#6c4a3a');rc(g,x-4,y-6,8,1,sh(brick,-40));
      for(const dx of [-3,-1,1])rc(g,x+dx,y-11,1,2,dx<0?'#a55b3a':'#b46a43');};
    stack(X11S===2?.16:.05,.55);stack(.6,X11S===2?.16:.05);
    if(X11S===1){const p=A.paraPt559(G,.55,.62),x=R(p[0]),y=R(p[1])-H;rc(g,x-3,y-3,6,2,'#9aa3aa');rc(g,x-3,y-1,6,1,'#6d757c');}}
  // 後縮煙囪＋陶土 chimney pots，完全留在建築 footprint 內。
  const cp=A.paraPt559(G,.28,.28), cx=R(cp[0]), cy=R(cp[1])-H-mh11;`);
const MB = fs.readFileSync(path.join(__dirname, 'mewsB.js'), 'utf8');
rep("REG.ukMews={name:'ukMews',draw(ctx){\n", MB + "REG.ukMews={name:'ukMews',draw(ctx){\n  if(window.__x11Mews)return mewsB(ctx);\n");

fs.writeFileSync(F, s);
console.log('patched');
