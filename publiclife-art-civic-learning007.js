// GPT-007 / UKL01–06. Original civic and learning forms.
// Concatenated inside the PUBLICLIFE007 art closure. Only Scene primitives are
// shared with earlier rounds; plans, sections and facade compositions are new.
// All coordinates are plot-local (16 units/tile); the public street is +j.

function plCivicStone007(right,seed) {
  const pal=right?[C('9f957d'),C('a99d83'),C('a3977d')]:[C('cbb994'),C('d5c49f'),C('cfbe98')];
  return (u,z)=>{
    const row=Math.floor(z/2.3),v=u+(row&1)*1.65,n=hash(Math.floor(v/3.3),row,seed);
    if(z<2)return right?C('887e6d'):C('afa084');
    if(mod(z,2.3)<.14||mod(v,3.3)<.13)return right?C('928973'):C('b5a789');
    return pal[n%3];
  };
}

function plCivicBrick007(right,seed) {
  const pal=right?[C('824c40'),C('8b5144'),C('7d493e')]:[C('b36a50'),C('bb7055'),C('ad644c')];
  return (u,z)=>{
    const row=Math.floor(z/1.7),v=u+(row&1)*1.15,n=hash(Math.floor(v/2.3),row,seed);
    if(z<2.4)return right?P.stoneD:P.stoneR;
    if(mod(z,1.7)<.13||mod(v,2.3)<.10)return right?C('6f4a40'):C('96664f');
    return pal[n%3];
  };
}

function plCivicWall007(S,a,b,h,right,seed,stone) {
  const F=S.face(a,b);F.panel(0,F.length,0,h,stone?plCivicStone007(right,seed):plCivicBrick007(right,seed),0);return F;
}

function plCivicBlock007(S,i0,i1,j0,j1,h,seed,stone) {
  const F=plCivicWall007(S,[i0,j1],[i1,j1],h,false,seed,stone);
  const R=plCivicWall007(S,[i1,j0],[i1,j1],h,true,seed+1,stone);
  S.flat(i0,i1,j0,j1,h,stone?P.stoneR:P.brickR[0]);
  return {F,R};
}

function plCivicBand007(F,z,h,right,terracotta) {
  const a=terracotta?(right?C('a57253'):C('cf9c70')):(right?P.stoneR:P.stone);
  F.panel(0,F.length,z,z+h,a,.10);
  F.panel(0,F.length,z+h-.12,z+h+.27,terracotta?(right?C('966449'):C('ddae80')):(right?P.stoneD:P.stoneHi),.15);
}

function plCivicWindow007(S,F,u,z,w,h,opt) {
  opt=opt||{};const r=!!opt.right,stone=r?P.stoneR:P.stoneHi,frame=r?P.frameR:P.frame;
  const top=x=>opt.pointed?h-(opt.rise||4)*(Math.abs(x-w/2)/(w/2)):opt.round?h-w*.48+w*.48*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2)):h;
  F.panel(u-.42,u+w+.42,z-.5,z+h+.65,(x,y)=>y>top(Math.max(0,Math.min(w,x-.42)))+.58?null:stone,.13);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const t=top(x);if(y>t)return null;
    if(x<.33||x>w-.33||y<.5||y>t-.5)return frame;
    const cols=opt.cols||2,rows=opt.rows||2;
    for(let k=1;k<cols;k++)if(Math.abs(x-w*k/cols)<(opt.mullion||.18))return frame;
    for(let k=1;k<rows;k++)if(Math.abs(y-h*k/rows)<.20)return frame;
    if(opt.leaded&&mod(x*1.5+y*.52,2.6)<.10)return r?P.iron:P.ironHi;
    if(opt.bars&&mod(x,1.2)<.15)return P.iron;
    return [y>h*.68?(r?P.glass:P.glassHi):(r?P.glassR:P.glass),opt.lit?P.warm[opt.warm||0]:0];
  },.23);
  F.panel(u-.58,u+w+.58,z-.52,z+.18,r?P.stoneR:P.stone,.27);
  if(!opt.pointed&&!opt.round)F.panel(u-.45,u+w+.45,z+h+.1,z+h+1.0,r?P.stoneD:P.stone,.18);
}

function plCivicDoor007(S,F,u,z,w,h,opt) {
  opt=opt||{};const r=!!opt.right,arch=opt.arch!==false,top=x=>arch?h-w*.38+w*.38*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2)):h;
  F.panel(u-.65,u+w+.65,z,z+h+.9,(x,y)=>y>top(Math.max(0,Math.min(w,x-.65)))+.8?null:(r?P.stoneR:P.stone),.14);
  F.panel(u,u+w,z,z+h,(x,y)=>{
    const t=top(x);if(y>t)return null;
    if(x<.3||x>w-.3||y>t-.4)return r?P.wood:P.frameR;
    if(y>h-3.3){if(Math.abs(x-w/2)<.17||Math.abs(y-h+3.0)<.2)return P.frameR;return [r?P.glassR:P.glass,opt.lit?P.warm[1]:0];}
    if(y<.8||Math.abs(x-w/2)<.13)return P.iron;
    if(mod(x-.4,1.25)<.1)return r?C('34463e'):C('41594c');
    if((y>2.1&&y<5.7)||(y>7.3&&y<h-4.1))return r?P.greenD:P.greenHi;
    if(y>6.1&&y<6.8&&(Math.abs(x-w*.39)<.2||Math.abs(x-w*.61)<.2))return P.gold;
    return opt.color||P.green;
  },.27);
}

function plCivicFrontRoof007(S,i0,i1,j0,j1,z,rise,seed,stone) {
  const m=(i0+i1)/2,roof=right=>stone?plCivicStoneRoof007(right,seed,'j'):tileRoof(right,seed,'j');
  S.poly([[i0,j0,z],[m,j0,z+rise],[m,j1,z+rise],[i0,j1,z]],roof(false));
  S.poly([[m,j0,z+rise],[i1,j0,z],[i1,j1,z],[m,j1,z+rise]],roof(true));
  S.poly([[i0,j1,z],[i1,j1,z],[m,j1,z+rise]],(i,j,h)=>(stone?plCivicStone007(false,seed):plCivicBrick007(false,seed))(i,h),.01);
  for(const a of [i0,i1])S.line([a,j1+.04,z],[m,j1+.04,z+rise],P.stone,1);
  ridge(S,[m,j0],[m,j1],z+rise,stone?C('c0b391'):P.lead);
  S.line([i1,j0,z],[i1,j1,z],P.iron,1);
  return S.face([i0,j1],[i1,j1]);
}

function plCivicStoneRoof007(right,seed,axis) {
  return (i,j,z)=>{
    const across=axis==='j'?j:i,down=axis==='j'?i:j;
    const row=Math.floor(down/1.3),n=hash(Math.floor((across+(row&1)*1.3)/2.6),row,seed);
    if(mod(down,1.3)<.13)return right?C('827a64'):C('a39679');
    return right?[C('948a71'),C('9b9077'),C('8e856e')][n%3]:[C('baac89'),C('c0b38f'),C('b5a885')][n%3];
  };
}

function plCivicLongHip007(S,i0,i1,j0,j1,z,rise,seed) {
  // Unlike hipRoof's transverse ridge, this hall ridge runs into the plot.
  // Keeping its face topology explicit prevents bow-tie roof polygons.
  const m=(i0+i1)/2,end=(i1-i0)*.32,R=[m,j0+end,z+rise],Q=[m,j1-end,z+rise];
  const A=[i0,j0,z],B=[i1,j0,z],D=[i1,j1,z],E=[i0,j1,z];
  S.poly([A,R,Q,E],tileRoof(false,seed,'j'));
  S.poly([B,D,Q,R],tileRoof(true,seed+1,'j'));
  S.poly([A,B,R],tileRoof(true,seed+2,'i'));
  S.poly([E,Q,D],tileRoof(false,seed+3,'i'));
  for(const [a,b]of [[A,B],[B,D],[D,E],[E,A]])S.line(a,b,P.roofEdge,1);
  ridge(S,R,Q,z+rise,P.lead);
}

function plCivicStoneRangeRoof007(S,i0,i1,j0,j1,z,rise,seed) {
  const m=(j0+j1)/2;
  S.poly([[i0,j0,z],[i1,j0,z],[i1,m,z+rise],[i0,m,z+rise]],plCivicStoneRoof007(true,seed));
  S.poly([[i0,m,z+rise],[i1,m,z+rise],[i1,j1,z],[i0,j1,z]],plCivicStoneRoof007(false,seed));
  S.poly([[i1,j0,z],[i1,j1,z],[i1,m,z+rise]],(i,j,h)=>plCivicStone007(true,seed)(j,h));
  S.line([i1,j0,z],[i1,m,z+rise],P.stoneR,1);S.line([i1,m,z+rise],[i1,j1,z],P.stoneR,1);
  ridge(S,[i0,m],[i1,m],z+rise,C('c6b994'));
  S.line([i0,j1,z],[i1,j1,z],C('8b806b'),1);
}

function plCivicQuoins007(F,h,right,terracotta) {
  for(let z=3;z<h-1;z+=3.3)for(const a of [0,F.length-.85])
    F.panel(a,a+.85,z,z+2.2,terracotta?(right?C('ad815e'):C('d3aa7c')):(right?P.stoneR:P.stone),.09);
}

function plCivicRoundel007(F,u,z,r,clock) {
  F.panel(u-r-.4,u+r+.4,z-r*1.6-.6,z+r*1.6+.6,(x,y)=>{
    const dx=(x-r-.4)/r,dy=(y-r*1.6-.6)/(r*1.6),d=dx*dx+dy*dy;
    if(d>1.14)return null;if(d>.79)return P.stoneHi;
    if(clock){if((Math.abs(dx)<.095&&dy>-.08&&dy<.62)||(Math.abs(dy)<.095&&dx>-.05&&dx<.56))return P.iron;
      if(d>.59&&(Math.abs(dx)<.13||Math.abs(dy)<.13))return P.iron;return C('d8cfb1');}
    return mod(y,1.6)<.3?P.iron:P.dark;
  },.27);
}

function plCivicPlaque007(F,u,z,w,text) {
  F.panel(u-.25,u+w+.25,z-.4,z+4.3,P.stone,.14);F.panel(u,u+w,z,z+3.7,P.greenD,.23);
  const unit=Math.min(.34,(w-.8)/(text.length*4)),start=u+(w-text.length*4*unit)/2;
  for(let k=0;k<text.length;k++){
    if(text[k]!=='P'){letters(F,text[k],start+k*4*unit,z+.5,unit,P.frame);continue;}
    // The shared alphabet has no P; supply this glyph locally, without changing
    // that alphabet or altering any legacy plaque.
    const glyph=['110','101','110','100','100'];
    for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(glyph[y][x]==='1')
      F.panel(start+(k*4+x)*unit,start+(k*4+x+1)*unit,z+.5+(4-y)*unit*1.8,z+.5+(5-y)*unit*1.8,P.frame,.38);
  }
}

function plCivicStairs007(S,i0,i1,j0,j1,h,n) {
  for(let k=0;k<n;k++)S.box(i0,i1,j0,j1-k*(j1-j0)/n,0,(k+1)*h/n,P.stoneR,P.stoneD,P.stone);
}

function plCivicOgee007(S,i,j,z,r,h) {
  // Eight ruled facets per level, with a swelling shoulder and pinched neck.
  const levels=[[0,1],[.24,.88],[.51,.48],[.73,.22],[.90,.20],[1,0]];
  for(let q=0;q<levels.length-1;q++)for(let k=0;k<8;k++){
    const a=Math.PI*k/4,b=Math.PI*(k+1)/4,[za,ra]=levels[q],[zb,rb]=levels[q+1];
    S.poly([[i+Math.cos(a)*r*ra,j+Math.sin(a)*r*ra,z+h*za],[i+Math.cos(b)*r*ra,j+Math.sin(b)*r*ra,z+h*za],[i+Math.cos(b)*r*rb,j+Math.sin(b)*r*rb,z+h*zb],[i+Math.cos(a)*r*rb,j+Math.sin(a)*r*rb,z+h*zb]],k<3?C('6d807d'):k<6?C('91a19a'):C('7d9289'));
  }
  S.line([i,j,z+h],[i,j,z+h+3.5],P.iron,1);
}

function plHistoricTownHall007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Long irregular two-storey stone hall, with a lower open-sided east pentice.
  const A=plCivicBlock007(S,3.0,34,5.5,27,37.5,1201,true);
  for(const [u,z,w,h]of [[2.4,4.2,5.3,11.4],[12.1,5.4,4.0,9.4],[22.5,4.3,5.5,12.4],[1.8,22,6.3,11],[11.6,23.1,4.8,10],[21.5,22,6.2,11]])
    plCivicWindow007(S,A.F,u,z,w,h,{cols:w>5?3:2,rows:2,leaded:true,lit:z>20&&u>20});
  for(const [u,z,w,h]of [[2.1,6.0,5.2,10.5],[11.8,4.8,5.8,12.0],[2.2,23.4,5.3,10.4],[12,22.1,5.6,11.5]])
    plCivicWindow007(S,A.R,u,z,w,h,{right:true,cols:3,rows:2,leaded:true,lit:z>20&&u<5});
  plCivicBand007(A.F,19.1,.55,false);plCivicBand007(A.R,19.1,.55,true);
  plCivicStoneRangeRoof007(S,2.6,34.4,5.1,27.4,38,14.0,1203);
  // Projecting council chamber is a real cross-gabled block, not a false gable.
  const B=plCivicBlock007(S,4.2,17.6,22.0,36.0,40,1204,true);
  plCivicWindow007(S,B.F,1.7,5.0,10.0,13.2,{cols:4,rows:2,lit:false,leaded:true});
  plCivicWindow007(S,B.F,2.0,23.4,9.4,12.5,{cols:3,rows:2,lit:true,leaded:true});
  for(const z of [5,24])plCivicWindow007(S,B.R,6.8,z,4.8,11.5,{right:true,cols:2,rows:2,lit:z>20});
  const G=plCivicFrontRoof007(S,3.8,18,21.6,36.4,40.6,14.8,1205,true);
  plCivicRoundel007(G,7.1,46.7,1.8,false);
  for(const i of [4.2,16.4]){S.box(i,i+1.15,36.0,37.2,0,22,P.stone,P.stoneR,P.stoneHi);S.poly([[i,36,25],[i+1.15,36,25],[i+1.15,37.3,21],[i,37.3,21]],P.stone);}
  // Small entrance lobby in the angle, accessible from the +j pavement.
  const E=plCivicBlock007(S,19,29.2,26.7,32.5,23,1206,true);
  plCivicDoor007(S,E.F,2.5,2.0,5.2,16.5,{lit:true});
  plCivicStoneRangeRoof007(S,18.7,29.5,26.4,32.8,23.6,5,1207);
  plCivicStairs007(S,20.9,27.4,32.5,37.0,2.1,3);
  plCivicPlaque007(A.F,19.5,34,9.3,'HALL');
  // The shelter floor and three posts are visible below the independent pentice.
  S.box(34,44.8,13,29.5,0,.8,P.stoneR,P.stoneD,P.path[2]);
  for(const j of [14,21.3,28.9]){S.box(43.4,44.1,j-.35,j+.35,.8,16.4,P.stone,P.stoneR,P.stoneHi);S.line([43.7,j,14],[40.8,j,17.4],P.wood,1);}
  S.poly([[33.7,12.6,22],[33.7,29.7,22],[44.6,29.7,16.8],[44.6,12.6,16.8]],plCivicStoneRoof007(true,1208));
  S.line([44.6,12.6,16.8],[44.6,29.7,16.8],P.iron,1);bench(S,35.4,27.5,6.5);
  // Compact belfry stands on the main ridge; all louvers are opaque recesses.
  const T=plCivicBlock007(S,24.8,30.6,12.9,18.7,65,1209,true);
  for(const F of [T.F,T.R])F.panel(.9,4.9,55.1,63.4,(x,y)=>x<.25||x>3.75?P.stoneR:mod(y,1.35)<.42?P.ironHi:P.dark,.21);
  S.box(24.4,31,12.5,19.1,64.7,66.1,P.stone,P.stoneR,P.stoneHi);
  plCivicOgee007(S,27.7,15.8,66.1,4.4,13.2);
  downpipe(S,34.25,26.8,37);downpipe(S,18,35.9,40);
  bench(S,32.7,39.7,7.2);bush(S,5.1,43.0,1.8,3.8,false);bush(S,42.1,40.8,1.7,3.4,false);
  return S.finish();
}

function plMagistratesCourt007(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Tall cross-gabled courtroom and deliberately unequal low waiting wing.
  const A=plCivicBlock007(S,4.7,22.3,6.4,33.5,47.0,1221,false);
  plCivicBand007(A.F,17.3,1.0,false);plCivicBand007(A.R,17.3,1.0,true);
  for(const u of [2.0,7.0,12])plCivicWindow007(S,A.F,u,21.7,3.8,20.5,{pointed:true,rise:4,cols:1,rows:3,lit:u===7,leaded:true});
  for(const u of [3.1,11.8,20.1])plCivicWindow007(S,A.R,u,19.8,4.5,21.3,{right:true,pointed:true,cols:2,rows:3,lit:u<4,leaded:true});
  for(const u of [2.2,11.7])plCivicWindow007(S,A.F,u,5.0,3.5,8.4,{cols:2,rows:2,lit:false,bars:true});
  const G=plCivicFrontRoof007(S,4.3,22.7,6.0,33.9,47.8,21.5,1223,false);
  plCivicRoundel007(G,9.2,55.6,2.1,false);
  for(const i of [4.7,21.1]){S.box(i,i+1.2,33.5,35.1,0,39,P.stone,P.stoneR,P.stoneHi);S.poly([[i,33.5,42],[i+1.2,33.5,42],[i+1.2,35.2,38.6],[i,35.2,38.6]],P.stone);}
  const B=plCivicBlock007(S,22.3,43.8,11.1,29.7,27.5,1224,false);
  for(const u of [1.6,8.0,14.5])plCivicWindow007(S,B.F,u,6,4.8,15.2,{pointed:true,rise:3.2,cols:2,rows:2,lit:u<3});
  for(const u of [2.5,10.6])plCivicWindow007(S,B.R,u,6,4.8,15.2,{right:true,pointed:true,cols:2,rows:2,lit:false});
  plCivicBand007(B.F,23.7,.9,false);plCivicBand007(B.R,23.7,.9,true);
  gableRoof(S,22,44.1,10.8,30,28.3,11.0,1226);
  // Raised public door and shallow gabled porch remain in the visible forecourt.
  const E=plCivicBlock007(S,27,37.2,27.5,35.2,25.2,1227,false);
  plCivicDoor007(S,E.F,2.3,4.2,5.6,15.2,{lit:true});
  plCivicFrontRoof007(S,26.6,37.6,27.2,35.6,25.8,9.7,1228,false);
  plCivicPlaque007(E.F,1.4,21,7.3,'COURT');
  plCivicStairs007(S,28.6,35.6,35.2,42.2,4.2,6);
  for(const i of [28.4,35.8]){S.line([i,35.5,8],[i,42,3.8],P.iron,1);for(let j=36;j<42;j+=1.5)S.line([i,j,4.2*(42.2-j)/7],[i,j,3.8+4.2*(42.2-j)/7],P.iron,1);}
  // Genuine low cell annex on the right, leaving its paved side court exposed.
  const Cb=plCivicBlock007(S,35.0,43.8,2.6,11.1,17.2,1229,false);
  for(const u of [1.2,5.2])plCivicWindow007(S,Cb.R,u,8,2,5.4,{right:true,cols:1,rows:1,bars:true,lit:false});
  gableRoof(S,34.7,44.1,2.3,11.4,17.8,5.5,1230);
  chimney(S,7.0,10,59,2.8,2.5,2,1231);chimney(S,39.5,16,35,2.4,2.3,2,1232);
  downpipe(S,22.55,33.2,47);downpipe(S,44,29.3,27);
  railing(S,[1.3,45.7],[26.7,45.7],5);railing(S,[38.1,45.7],[46.7,45.7],5);
  bench(S,7.7,40.6,8);bush(S,43.4,41.4,1.35,3.7,false);
  return S.finish();
}

function plBoroughPolice007(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Two forward gables flank a short recessed public range. The charge yard is
  // on the camera-visible +i side, not hidden behind a tall front curtain wall.
  const M=plCivicBlock007(S,2.3,20.1,4.1,20.5,31.5,1241,false);
  gableRoof(S,2.0,20.4,3.8,20.8,32.1,8.7,1242);
  for(const [i0,i1,h,sd]of [[2.3,9.1,35.7,1243],[13.2,20.1,35.7,1247]]){
    const A=plCivicBlock007(S,i0,i1,6.6,23.4,h,sd,false);
    plCivicBand007(A.F,19.4,.9,false,true);plCivicBand007(A.R,19.4,.9,true,true);
    plCivicQuoins007(A.F,h,false,true);
    if(i0<3)plCivicWindow007(S,A.F,1.05,5,4.7,11.7,{round:true,cols:2,rows:2,lit:true});
    else plCivicDoor007(S,A.F,1.12,1.4,4.6,15.8,{lit:true});
    plCivicWindow007(S,A.F,1.2,23,4.3,9.5,{cols:3,rows:3,lit:i0>10});
    const G=plCivicFrontRoof007(S,i0-.25,i1+.25,6.3,23.75,36.2,11.2,sd+2,false);
    plCivicRoundel007(G,(i1-i0)/2+.25,40.6,1.4,false);
    if(i0>10)for(const u of [2.4,9.5])plCivicWindow007(S,A.R,u,23,3.4,9.2,{right:true,cols:2,rows:3,lit:false});
  }
  plCivicWindow007(S,M.F,7.45,5.5,3.0,10.5,{cols:2,rows:2,lit:false});
  plCivicWindow007(S,M.F,7.4,22,3.1,8,{cols:2,rows:2,lit:false});
  plCivicPlaque007(S.face([13.2,23.43],[20.1,23.43]),.3,18,6.3,'POLICE');
  plCivicStairs007(S,14.0,19.1,23.4,26.3,1.4,2);
  // A low rear charge-room wing encloses an exposed stone-paved service yard.
  const Cb=plCivicBlock007(S,20.1,29.6,3.5,11.4,13.6,1251,false);
  for(const u of [1.3,5.5])plCivicWindow007(S,Cb.F,u,6.3,2.4,5.0,{cols:1,rows:1,bars:true,lit:false});
  plCivicWindow007(S,Cb.R,2.2,6.3,3.1,4.8,{right:true,cols:2,rows:1,bars:true,lit:false});
  S.poly([[19.9,3.2,18.2],[29.9,3.2,18.2],[29.9,11.7,14.0],[19.9,11.7,14.0]],tileRoof(false,1252,'i'));
  S.flat(21,30.4,12.0,28.9,.12,(i,j)=>mod(i,3)<.12||mod(j,3)<.12?C('83877e'):C('a9aa9b'),.03,1);
  S.box(30.0,30.8,11.4,29.3,0,5.2,P.brick[1],P.brickR[0],P.stone);
  S.box(20.8,24.5,28.8,29.6,0,5.2,P.brick[1],P.brickR[0],P.stone);
  for(const i of [24.6,30.2])S.box(i-.35,i+.35,28.8,29.6,0,7.2,P.brick[1],P.brickR[0],P.stoneHi);
  for(let i=25.0;i<30;i+=.7)S.line([i,29.1,.5],[i,29.1,6.6],P.iron,1);
  S.line([24.8,29.1,6.0],[30,29.1,6.0],P.iron,1);
  // Two small yard fixtures on the ground, with no fake emissive security lights.
  S.box(27.4,29.0,13.0,14.6,0,2.8,P.ironHi,P.iron,P.lead);
  S.line([21.7,14.0,.2],[29.3,14.0,.2],C('7b827a'),1);
  chimney(S,4,8.5,43.4,2,2.3,2,1253);chimney(S,15.1,8,44,2,2.2,2,1254);
  downpipe(S,20.35,22.9,35.5);
  railing(S,[1.2,29.9],[12.7,29.9],4.7);bush(S,4.3,26.8,1.1,2.9,false);
  return S.finish();
}

function plEdwardianFireStation007(spec) {
  const S=Scene(spec);ground(S,'paved');
  // Two deep appliance bays under crew rooms; the whole south strip is apron.
  const A=plCivicBlock007(S,3.8,34.8,7.4,31.0,43.0,1261,false);
  plCivicBand007(A.F,22.8,1.1,false);plCivicBand007(A.R,22.8,1.1,true);
  for(const u of [2.3,16.1]){
    const w=11.6,h=19.7,top=x=>h-3+3*Math.sqrt(Math.max(0,1-((x-w/2)/(w/2))**2));
    A.F.panel(u-.6,u+w+.6,.8,h+1.7,(x,y)=>y>top(Math.max(0,Math.min(w,x-.6)))+.65?null:P.stone,.13);
    A.F.panel(u,u+w,1.2,h+1.2,(x,y)=>{
      if(y>top(x))return null;
      if(x<.45||x>w-.45||y>top(x)-.4)return P.iron;
      if(y>11.7){if(mod(x,2.3)<.18||Math.abs(y-15.5)<.22)return C('835044');return [P.glass,u<10?P.warm[0]:0];}
      if(mod(x,2.3)<.15||Math.abs(y-4.9)<.23||Math.abs(y-9.0)<.23)return C('633c35');
      if(y<.7)return P.iron;return C('9b493b');
    },.26);
    S.flat(3.8+u,3.8+u+w,31.0,42.6,.04,(i,j)=>mod(j,2.4)<.13?C('999b90'):P.path[1],.05,1);
  }
  for(const u of [2.1,9.6,17.1,24.6])plCivicWindow007(S,A.F,u,28.4,4.7,10.2,{cols:3,rows:2,lit:u<5||u>22});
  for(const u of [3.0,10.4,17.7])plCivicWindow007(S,A.R,u,28.4,4.2,10.2,{right:true,cols:2,rows:2,lit:u>15});
  plCivicPlaque007(A.F,6.3,24.1,18.7,'FIRE STATION');
  hipRoof(S,[[3.4,7],[35.2,7],[35.2,31.4],[3.4,31.4]],[10.5,19.2],[28.5,19.2],43.7,15,1263);
  chimney(S,7,13,54.6,2.8,2.5,3,1264);chimney(S,29.7,13,54.6,2.8,2.5,3,1265);
  // Watch-room steps and its own front door are separate from the vehicle bays.
  const W=plCivicBlock007(S,34.8,44.8,21,34.7,23.8,1266,false);
  plCivicDoor007(S,W.F,2.5,1.3,4.7,15.0,{lit:true});
  plCivicWindow007(S,W.R,5,6.4,5,11.6,{right:true,cols:3,rows:2,lit:true});
  plCivicPlaque007(W.F,1.0,18.7,8.1,'FIRE');
  hipRoof(S,[[34.5,20.7],[45.1,20.7],[45.1,35],[34.5,35]],[38,27.7],[41.7,27.7],24.5,6.1,1267);
  plCivicStairs007(S,36.7,42.6,34.7,38.1,1.3,2);
  // Narrow functional side drill tower: stacked openings, landings and hose rails.
  const T=plCivicBlock007(S,35.9,44.6,4.0,15.8,83.5,1268,false);
  for(const z of [8.8,27.2,45.6,64.0]){
    plCivicWindow007(S,T.F,2.1,z,4.5,12,{cols:1,rows:1,lit:false});
    T.F.panel(2.5,6.2,z+.8,z+11.0,(x,y)=>mod(y,2.6)<.5?C('5d665f'):P.dark,.28);
    plCivicWindow007(S,T.R,3.5,z,4.5,12,{right:true,cols:1,rows:1,lit:false});
    S.box(36.1,44.4,15.8,17.5,z-1.6,z-.7,P.stoneR,P.stoneD,P.stone);
    for(const i of [36.3,40.2,44.1])S.line([i,17.3,z-.7],[i,17.3,z+3.2],P.iron,1);
    S.line([36.3,17.3,z+2.8],[44.1,17.3,z+2.8],P.iron,1);
  }
  for(const F of [T.F,T.R])plCivicBand007(F,80.6,1.0,F===T.R);
  S.box(35.5,45,3.6,16.2,83.3,85,P.stone,P.stoneR,P.stoneHi);
  S.flat(36.2,44.3,4.3,15.5,85.1,C('65716f'));
  for(const i of [36.0,44.5])S.wall([i,4],[i,15.8],85,88,P.iron,.02);
  S.wall([35.9,15.8],[44.6,15.8],85,88,(i,j,z)=>mod(i,1.4)<.13||z>87.6?P.iron:null,.02);
  downpipe(S,35.1,30.5,43);downpipe(S,45.0,34.5,24);
  // Apron drain, threshold edging and paired bollards leave both exits clear.
  S.line([3,43.7,.15],[34.5,43.7,.15],C('7c817c'),1);
  for(let i=3;i<34;i+=1.4)S.line([i,43.4,.18],[i,44.0,.18],P.iron,1);
  for(const i of [2.7,35.2])S.box(i-.35,i+.35,40.7,41.4,0,4.1,P.ironHi,P.iron,P.stone);
  return S.finish();
}

function plTechnicalInstitute007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Broad practical-teaching frontage, tall corner stair, and a lower workshop
  // return around a visible paved right-hand entrance court.
  const A=plCivicBlock007(S,3.5,35.6,5.8,26.4,43,1281,false);
  for(const F of [A.F,A.R]){plCivicBand007(F,22.1,1.0,F===A.R,true);plCivicBand007(F,39.8,1.0,F===A.R,true);}
  for(const z of [5.4,27.0])for(const u of [2.0,11.6,21.3])plCivicWindow007(S,A.F,u,z,7.3,z>20?10.4:13.2,{cols:4,rows:3,lit:z>20&&u<15});
  for(const z of [5.4,27.0])for(const u of [2.2,11.6])plCivicWindow007(S,A.R,u,z,6.2,z>20?10.4:13.2,{right:true,cols:3,rows:3,lit:z<10&&u<5});
  hipRoof(S,[[3.1,5.4],[36,5.4],[36,26.8],[3.1,26.8]],[9.8,16.1],[29.3,16.1],43.8,11.8,1283);
  // Raised nine-light stair window dominates this corner tower rather than a
  // domestic stack of little windows; its cap is a separate shallow hip roof.
  const T=plCivicBlock007(S,29.2,41.1,20.5,32.5,58,1284,false);
  plCivicQuoins007(T.F,58,false,true);plCivicQuoins007(T.R,58,true,true);
  plCivicWindow007(S,T.F,2.0,24,7.9,22.6,{round:true,cols:3,rows:3,mullion:.24,lit:true});
  plCivicWindow007(S,T.R,2.2,27,7.2,19.4,{right:true,cols:3,rows:3,lit:false});
  plCivicDoor007(S,T.F,2.9,2.2,6.2,17.1,{lit:true});
  plCivicBand007(T.F,50.0,1.1,false,true);plCivicBand007(T.R,50.0,1.1,true,true);
  plCivicPlaque007(T.F,1.1,52.4,9.8,'INSTITUTE');
  hipRoof(S,[[28.8,20.1],[41.5,20.1],[41.5,32.9],[28.8,32.9]],[33,26.5],[37.3,26.5],58.7,8.1,1286);
  S.line([35.2,26.5,66.8],[35.2,26.5,70.3],P.iron,1);
  plCivicStairs007(S,31.3,38.9,32.5,37.2,2.2,3);
  // Low shop wing with wider glazing and a monitor clerestory on real surfaces.
  const W=plCivicBlock007(S,5.0,24.3,25.8,39.1,23.5,1287,false);
  for(const u of [1.7,10.3])plCivicWindow007(S,W.F,u,4.3,7.1,14.9,{cols:4,rows:3,lit:u>5});
  plCivicWindow007(S,W.R,3.4,4.3,7.2,14.9,{right:true,cols:4,rows:3,lit:false});
  S.poly([[4.6,25.4,27.2],[24.7,25.4,27.2],[24.7,39.5,24.1],[4.6,39.5,24.1]],tileRoof(false,1288,'i'));
  S.box(8.0,21.0,28.2,34.0,26.2,31.0,P.frame,P.frameR,P.roof[0]);
  const MF=S.face([8,34],[21,34]),MR=S.face([21,28.2],[21,34]);
  for(const u of [1,4.1,7.2,10.3])plCivicWindow007(S,MF,u,27.4,2.1,2.5,{cols:1,rows:1,lit:false});
  plCivicWindow007(S,MR,1,27.4,3.8,2.5,{right:true,cols:2,rows:1,lit:false});
  gableRoof(S,7.7,21.3,27.9,34.3,31.5,2.8,1289);
  // Technical-school identity: stone relief panel and glazed-brick dado.
  A.F.panel(10.4,21.0,18.8,21.5,C('5d705d'),.12);
  for(const u of [10.9,13.2,15.5,17.8,20.1])A.F.panel(u,u+.45,19.1,21.1,P.stone,.20);
  chimney(S,5.6,10,49.7,2.6,2.6,2,1290);chimney(S,27,8.5,50,2.6,2.5,2,1291);
  downpipe(S,24.5,38.8,24);downpipe(S,41.3,32.3,58);
  railing(S,[2,45.6],[25.4,45.6],4.8);railing(S,[42.1,45.6],[46.4,45.6],4.8);
  bench(S,38.7,40.8,6.2);bush(S,9.0,43.0,1.5,3.2,false);
  return S.finish();
}

function plGrammarSchool007(spec) {
  const S=Scene(spec);ground(S,'civic');
  // Tall axial hall behind two short projecting gabled entrance pavilions.
  // Low connecting classrooms spread across almost the full 3×3 footprint.
  const H=plCivicBlock007(S,15.1,33.0,5.2,31.0,44.5,1301,false);
  for(const u of [1.8,6.9,12.0])plCivicWindow007(S,H.F,u,19.2,3.8,20.1,{round:true,cols:2,rows:3,lit:u<5,leaded:true});
  for(const u of [3.1,11.9,20.0])plCivicWindow007(S,H.R,u,20,4.2,18.7,{right:true,cols:2,rows:3,lit:u>18});
  plCivicBand007(H.F,15.9,1.0,false);plCivicBand007(H.R,15.9,1.0,true);
  plCivicLongHip007(S,14.7,33.4,4.8,31.4,45.2,17.0,1303);
  for(const [i0,i1,seed]of [[2.1,15.1,1304],[33.0,46.0,1307]]){
    const W=plCivicBlock007(S,i0,i1,8.1,27.0,24.3,seed,false);
    for(const u of [1.7,7.4])plCivicWindow007(S,W.F,u,5.1,4.1,14.3,{cols:3,rows:3,lit:i0>20&&u>5});
    if(i0>20)for(const u of [2.2,10.6])plCivicWindow007(S,W.R,u,5.1,4.8,14.3,{right:true,cols:3,rows:3,lit:u<5});
    plCivicBand007(W.F,21.1,.9,false);plCivicBand007(W.R,21.1,.9,true);
    gableRoof(S,i0-.3,i1+.3,7.8,27.3,25,8.4,seed+2);
  }
  for(const [i0,i1,seed]of [[7.7,17.6,1311],[30.5,40.4,1315]]){
    const A=plCivicBlock007(S,i0,i1,21.8,35.4,35.6,seed,false);
    plCivicQuoins007(A.F,35,false,false);plCivicQuoins007(A.R,35,true,false);
    plCivicDoor007(S,A.F,2.25,2.0,5.4,15.2,{lit:i0<20});
    plCivicWindow007(S,A.F,2.15,22.1,5.6,9.7,{cols:3,rows:3,lit:i0>20});
    plCivicBand007(A.F,19.0,1.0,false);plCivicBand007(A.R,19.0,1.0,true);
    for(const u of [2.6,8.7])plCivicWindow007(S,A.R,u,22,3.0,9.6,{right:true,cols:2,rows:2,lit:false});
    const G=plCivicFrontRoof007(S,i0-.35,i1+.35,21.45,35.8,36.3,14.1,seed+2,false);
    plCivicRoundel007(G,5.3,41.9,1.55,false);
    // Coped stepped verges distinguish these from the court's acute straight verge.
    for(let k=0;k<4;k++)for(const sign of [-1,1]){
      const x=(i0+i1)/2+sign*(4.8-k*1.0),z=37.2+k*2.8;
      S.box(x-.52,x+.52,35.65,36.15,z,z+1.0,P.stone,P.stoneR,P.stoneHi);
    }
    plCivicStairs007(S,i0+1.4,i1-1.4,35.4,39.3,2.0,3);
    downpipe(S,i1+.25,35.1,35.6);
  }
  // Hall front stays visible between the projecting gables, including its
  // central crest, triple transomed glazing and lower assembly-room doors.
  plCivicDoor007(S,H.F,6.4,1.4,5.1,12.0,{lit:true,arch:false});
  H.F.panel(6.8,11.0,40.4,43.2,P.stone,.18);
  H.F.panel(7.9,9.9,40.8,42.8,(x,y)=>y<.7&&Math.abs(x-1)>.5?null:P.gold,.26);
  // Octagonal open-louver cupola with a compact slate spire on the hall ridge.
  const ci=23.9,cj=17.8,base=61.3,rad=3.3;
  const oct=[];for(let k=0;k<8;k++)oct.push([ci+Math.cos(k*Math.PI/4)*rad,cj+Math.sin(k*Math.PI/4)*rad]);
  for(let k=0;k<8;k++){
    const a=oct[k],b=oct[(k+1)%8],F=S.face(a,b),right=k<3;
    F.panel(0,F.length,base,base+9.3,right?P.stoneR:P.stone,0);
    F.panel(.35,F.length-.35,base+1.9,base+7.9,(x,y)=>mod(y,1.2)<.35?(right?P.iron:P.ironHi):P.dark,.18);
    S.poly([[a[0]*1.02-ci*.02,a[1]*1.02-cj*.02,base+9.6],[b[0]*1.02-ci*.02,b[1]*1.02-cj*.02,base+9.6],[ci,cj,base+20.0]],right?P.roofR[0]:P.roof[1]);
  }
  S.line([ci,cj,base+19.5],[ci,cj,base+23.8],P.iron,1);
  chimney(S,3.4,13.5,29.5,2.4,2.4,2,1321);chimney(S,42,13.2,29.5,2.4,2.4,2,1322);
  railing(S,[1.2,44.9],[8.1,44.9],5);railing(S,[17.8,44.9],[30.6,44.9],5);railing(S,[40.5,44.9],[46.8,44.9],5);
  for(const i of [8.3,17.6,30.8,40.3])S.box(i-.55,i+.55,44.2,45.3,0,6.5,P.brick[1],P.brickR[0],P.stoneHi);
  bench(S,19.7,38.1,8.1);bush(S,3.7,39.5,1.5,3.8,false);bush(S,44.5,39.5,1.5,3.8,false);
  return S.finish();
}
