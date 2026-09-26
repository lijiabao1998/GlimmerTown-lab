function mewsB(ctx){ // 第十一批草案：兩層、每戶一開間（油漆立面、一樓馬車拱門／車庫門／馬房門輪替、二樓兩扇窗、戶界煙囪）
  const {g,ng,G}=ctx,T=tools(ctx),{sh,rc,foot,cols,wall,poly}=T;
  const slate='#5c6772',ring='#efe6d2',trim='#efe9dc',glass='#6a8494';
  const wallH=Math.max(16,ctx.wallH|0),gF=Math.min(12,Math.round(wallH*.5)),v=Math.abs(ctx.v|0);
  const up=(p,h)=>[p[0],p[1]-h];
  const roof={N:up(G.N,wallH),E:up(G.E,wallH),S:up(G.S,wallH),W:up(G.W,wallH)};
  poly(g,[roof.N,roof.E,roof.S,roof.W],slate);
  poly(g,[roof.N,roof.E,up(G.S,wallH-1),up(G.W,wallH-1)],'#4a5560');
  const PAINT=['#c4a36a','#e6ddca','#d8c49c','#b9c6c8','#d6b2a4','#c9ad7e'],DOOR=['#1f3c32','#5b2028','#243554','#2a2522','#6a4a1f'];
  const side='#8f7550';
  wall(g,G.S,G.E,wallH,side);
  cols(G.S,G.E,(x,y)=>{rc(g,x,y-3,1,3,sh(side,-18));rc(g,x,y-wallH,1,2,'#3e4650');rc(g,x,y-gF-1,1,1,sh(side,14));});
  {const sx=R((G.S[0]*.6+G.E[0]*.4)),sy=foot(G.S,G.E,sx);rc(g,sx,sy-gF-8,3,5,sh(glass,-28));rc(g,sx-1,sy-gF-3,5,1,sh(trim,-24));if(ng)rc(ng,sx,sy-gF-8,3,5,'#d9c78f');
    const dx=R((G.S[0]*.3+G.E[0]*.7)),dy=foot(G.S,G.E,dx);rc(g,dx,dy-9,3,8,sh(DOOR[v%DOOR.length],-20));}
  const x0=R(Math.min(G.W[0],G.S[0])),x1=R(Math.max(G.W[0],G.S[0])),fw=x1-x0;
  const nb=Math.max(1,Math.round(fw/15)),bw=fw/nb,dp=[(G.E[0]-G.S[0])*.5,(G.E[1]-G.S[1])*.5],stacks=[];
  for(let b=0;b<nb;b++){
    const col=PAINT[(b*7+v*3)%PAINT.length],door=DOOR[(b*3+v)%DOOR.length],bx0=R(x0+b*bw),bx1=b===nb-1?x1:R(x0+(b+1)*bw)-1;
    for(let x=bx0;x<=bx1;x++){const y=foot(G.W,G.S,x);rc(g,x,y-wallH,1,wallH,col);rc(g,x,y-wallH,1,2,'#4a5560');rc(g,x,y-1,1,1,sh(col,-28));rc(g,x,y-gF-1,1,1,sh(col,18));}
    if(b>0){const y=foot(G.W,G.S,bx0);rc(g,bx0,y-wallH,1,wallH,sh(col,-26));stacks.push([bx0+dp[0],y+dp[1]]);}
    const mid=R((bx0+bx1)/2),kind=(b+v)%3;
    if(kind===0){for(let x=mid-5;x<=mid+5;x++){const y=foot(G.W,G.S,x),adx=Math.abs(x-mid),rise=Math.round(Math.sqrt(Math.max(0,25-adx*adx))),lip=y-3-rise;
        rc(g,x,lip,1,1,ring);if(adx<=4)rc(g,x,lip+1,1,Math.max(1,(y-2)-(lip+1)),'#241c16');if(adx===5)rc(g,x,lip+1,1,Math.max(1,(y-2)-(lip+1)),sh(col,-22));}
      const lx=mid-7,ly=foot(G.W,G.S,lx);rc(g,lx,ly-7,1,3,'#2c3036');rc(g,lx,ly-8,2,1,'#efe6c0');if(ng){ng.fillStyle='#fff2c4';ng.fillRect(lx,ly-8,2,1);}}
    else if(kind===1){for(let x=mid-4;x<=mid+3;x++){const y=foot(G.W,G.S,x);rc(g,x,y-10,1,1,trim);rc(g,x,y-9,1,8,door);rc(g,x,y-7,1,1,sh(door,22));rc(g,x,y-4,1,1,sh(door,22));}}
    else{for(let x=mid-5;x<=mid-2;x++){const y=foot(G.W,G.S,x);rc(g,x,y-10,1,1,trim);rc(g,x,y-9,1,8,door);}
      const wx=mid+1,wy=foot(G.W,G.S,wx);rc(g,wx,wy-8,3,4,glass);rc(g,wx-1,wy-4,5,1,trim);if(ng)rc(ng,wx,wy-8,3,4,'#ffdca0');}
    for(const [i,f] of [[0,.28],[1,.7]]){const wx=R(bx0+bw*f)-1,y=foot(G.W,G.S,wx),wy=y-gF-8;
      rc(g,wx-1,wy-1,5,1,sh(col,-24));rc(g,wx,wy,3,5,glass);rc(g,wx,wy+2,3,1,trim);rc(g,wx-1,wy+5,5,1,trim);
      if(ng&&((b*2+i+v)%3)!==0)rc(ng,wx,wy,3,5,'#ffdca0');
      if(((b+i+v)%2)===0){rc(g,wx-1,wy+6,5,1,'#3f6b35');rc(g,wx,wy+6,1,1,'#d85a7a');rc(g,wx+2,wy+6,1,1,'#f0d060');}}
  }
  for(const [px,py] of stacks){const cx=R(px),cy=R(py)-wallH;rc(g,cx-1,cy-6,2,6,'#a0704f');rc(g,cx+1,cy-6,1,6,'#6e4a36');rc(g,cx-2,cy-7,5,1,'#4a423b');rc(g,cx-1,cy-9,1,2,'#a35a37');rc(g,cx+1,cy-9,1,2,'#b46a43');}
  const cx=R(G.E[0])-2, cy=foot(G.S,G.E,cx);
  rc(g,cx,cy-wallH-7,3,8,sh('#c4a36a',-8));rc(g,cx+2,cy-wallH-7,1,8,sh('#8a6238',-30));rc(g,cx-1,cy-wallH-8,5,1,'#4a423b');rc(g,cx,cy-wallH-10,1,2,'#a35a37');
  if(ctx.chim)ctx.chim(cx,cy-wallH-11,'#a35a37');
  return {pitch:true};
}
