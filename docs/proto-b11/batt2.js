
  /* ======================== k192 巴特西發電站 2×2【第十一批決策單草案】 ========================
     取材 Battersea Power Station：橫長磚造主量體（壁柱分格、細長高窗、白石簷口）、四角磚砌塔座（Art Deco 退台）
     各頂一根白色凹槽煙囪（頂端航空障礙紅燈）、屋頂中段長條天窗。2×2、136×184、ax=68 ay=182。 */
  if(!window.__noBattersea192)try{(function(){const K=192,OL=[46,34,28];
    const BR='#9a5a44',BRL='#b06f54',BRD='#7c4433',BRX='#633324',RED='#c8503a',
          WH='#efeae0',WHL='#f7f4ec',WHD='#d6cfc2',GL='#3a4658',LIT='#ffe3a6',GD='#d7ae38',LEAD='#8f9ca6',RT='#7a6a60';
    const W=136,H=184,ax=68,ay=182,LU=!window.__noBatterseaNight192;
    const G2=(i,j,z)=>[ax+2*i-2*j,ay-64+i+j-(z||0)];
    const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
    A.dia(base.g,ax,ay-64,64,'#9a968c');A.diaEdge(base.g,6,'#867f74',ax,ay-64,64);A.diaEdge(base.g,9,'#aaa79c',ax,ay-64,64);
    const I0=3,I1=29,J0=8,J1=24,hB=34,hT=16,S=G2(I1,J1),nL=2*(I1-I0),nR=2*(J1-J0);
    box(g,S,I1-I0,J1-J0,hB,BR,BRD,RT);                                                   // 磚造主量體
    band(g,S,-1,0,nL,0,3,'#8a8074');band(g,S,1,0,nR,0,3,'#7c7268');                      // 石台基
    for(let d=0;d<nL;d+=4)P(g,fx(S,-1,d),fy(S,d)-hB,1,hB-3,BRL);                         // 壁柱（凹槽感）
    for(let d=0;d<nR;d+=4)P(g,fx(S,1,d),fy(S,d)-hB,1,hB-3,BRX);
    for(let d=1;d<nL-1;d+=4){const lit=((d*7)%5)<3;faceRect(g,S,-1,d+1,2,6,22,GL,true);if(LU&&lit)faceRect(ng,S,-1,d+1,2,6,22,LIT,true);}   // 細長高窗
    for(let d=1;d<nR-1;d+=4){const lit=((d*3+1)%5)<3;faceRect(g,S,1,d+1,2,6,22,GL,true);if(LU&&lit)faceRect(ng,S,1,d+1,2,6,22,LIT,true);}
    band(g,S,-1,0,nL,hB-3,3,WH);band(g,S,1,0,nR,hB-3,3,WHD);                              // 白石簷口
    faceRect(g,S,-1,nL/2-3,6,0,12,'#3a2e24',true);                                        // 正門
    function tower(ci,cj,front){                                                          // 塔座＋退台＋煙囪；(ci,cj)＝塔南角
      const St=G2(ci,cj,hB);box(g,St,5,5,hT,BRL,BRD,RT,{noAO:true});
      for(const side of [-1,1]){P(g,fx(St,side,4),fy(St,4)-hT,1,hT,side<0?BRD:BRX);P(g,fx(St,side,5),fy(St,5)-hT,1,hT,side<0?BRD:BRX);
        faceRect(g,St,side,2,1,3,9,GL,false);faceRect(g,St,side,7,1,3,9,GL,false);
        if(LU&&front){faceRect(ng,St,side,2,1,3,9,LIT,false);faceRect(ng,St,side,7,1,3,9,LIT,false);}
        band(g,St,side,0,10,hT-2,2,side<0?WHL:WHD);}
      const S2=G2(ci-1,cj-1,hB+hT);box(g,S2,3,3,4,BRL,BRD,RT,{noAO:true});band(g,S2,-1,0,6,3,1,WHL);band(g,S2,1,0,6,3,1,WHD);
      const C=G2(ci-2.5,cj-2.5,hB+hT+4),cx=C[0],cy=C[1],hC=58,top=cy-hC;                 // 白色凹槽煙囪
      for(let dx=-3;dx<=3;dx++){const u=dx/3.6,e=R(1.6*Math.sqrt(Math.max(0,1-u*u)));
        P(g,cx+dx,top+e,1,hC,u<-.5?WHL:(dx%2===0?WH:WHD));}
      ell(g,cx,cy,3.8,1.8,WHD);
      for(const yy of [top+12,top+30])for(let dx=-3;dx<=3;dx++){const u=dx/3.6,e=R(1.6*Math.sqrt(Math.max(0,1-u*u)));P(g,cx+dx,yy+e,1,2,'#cfc8ba');}
      ell(g,cx,top,4,1.8,WHL);ell(g,cx,top-1,3,1.2,'#5a524c');
      P(g,cx,top-4,1,3,'#8a8274');P(g,cx,top-5,1,1,RED);if(LU)disc(ng,cx,top-5,2,'rgba(255,90,70,.75)');}
    tower(I0+5,J0+5,false);                                                               // 北（最後面）
    {const Sc=G2(22,18,hB);box(g,Sc,14,4,6,BRL,BRD,LEAD,{noAO:true});                    // 屋頂長條天窗
      for(let d=1;d<28;d+=3)P(g,fx(Sc,-1,d),fy(Sc,d)-5,1,3,GL);if(LU)for(let d=1;d<28;d+=6)P(ng,fx(Sc,-1,d),fy(Sc,d)-5,1,3,LIT);}
    tower(I0+5,J1,false);tower(I1,J0+5,false);                                            // 西、東
    tower(I1,J1,true);                                                                    // 南（最前面）
    lamp(g,ng,63,175,7,'#6e6a60',GD,'rgba(255,214,120,.55)');lamp(g,ng,72,177,7,'#6e6a60',GD,'rgba(255,214,120,.55)');
    finish(K,0,base,st,nt,ax,ay,OL);
  })();}catch(e){console.error('v574 k192',e);}
