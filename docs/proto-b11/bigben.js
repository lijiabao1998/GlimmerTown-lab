
  /* ======================== k190 大笨鐘／k191 西敏宮（英式地標）【第十一批決策單草案】 ========================
     取材：Elizabeth Tower（1859，Pugin 哥德復興）——淺黃 Anston 石灰岩方塔身、直向哥德飾板、四面鐘盤（金框、乳白玻璃、黑指針）、
     鐘室拱廊、陡峭鑄鐵尖頂（深灰藍、金飾）、Ayrton 燈、金色十字尖。Palace of Westminster——垂直式哥德長立面、密集尖窗、
     女兒牆小尖塔、深灰石板屋頂；西南角 Victoria Tower（方形巨塔、四角八角小塔、旗）。
     k190：1×1、72×220、ax=36 ay=218。k191：2×2、136×250、ax=68 ay=248。 */
  if(!window.__noBigBen190)try{(function(){
    const ST='#d6c28c',STL='#e6d5a4',STD='#b8a270',STX='#9c8658',
          SLL='#4e5c6e',SLD='#2a3340',SLT='#5a6676',GD='#d8b24a',GD2='#f0d27a',DIAL='#f2ecd8',DIALD='#d8d0b8',HAND='#20242c',
          GL='#2e3a4c',LIT='#ffe7b0',DLIT='rgba(255,246,214,.95)';
    // 伊莉莎白塔：SB＝台基南角地面點；回傳頂端十字尖的 y
    function clockTower(g,ng,SB,hS,LU){
      box(g,SB,5,5,6,'#b2aa98','#9a9282','#c4bcaa');                                     // 台基
      const S1=[SB[0],SB[1]-6];box(g,S1,4.5,4.5,hS,STL,ST,null);                          // 塔身
      for(let d=1;d<9;d+=2){P(g,fx(S1,-1,d),fy(S1,d)-hS+2,1,hS-4,STD);P(g,fx(S1,1,d),fy(S1,d)-hS+2,1,hS-4,STX);}   // 直向飾板
      for(let z=14;z<hS;z+=15){band(g,S1,-1,0,9,z,1,STD);band(g,S1,1,0,9,z,1,STX);}     // 層帶
      for(let z=24;z<hS-8;z+=30){faceRect(g,S1,-1,3,2,z,6,GL,true);faceRect(g,S1,1,4,2,z,6,GL,true);   // 尖拱小窗
        if(LU){faceRect(ng,S1,-1,3,2,z,6,LIT,true);faceRect(ng,S1,1,4,2,z,6,LIT,true);}}
      const S2=[S1[0],S1[1]-hS],hC=22;box(g,S2,4.5,4.5,hC,STL,ST,null);                  // 鐘室
      for(const side of [-1,1]){const cd=4.5,r=4,up=11;                                  // 鐘盤
        for(let d=0;d<9;d++){const u=d+.5-cd,hh=Math.sqrt(Math.max(0,(r+1.2)*(r+1.2)-u*u));if(hh<=0)continue;P(g,fx(S2,side,d),R(fy(S2,d)-up-hh),1,R(2*hh),GD);}
        for(let d=0;d<9;d++){const u=d+.5-cd,hh=Math.sqrt(Math.max(0,r*r-u*u));if(hh<=0)continue;const x=fx(S2,side,d),y=fy(S2,d)-up;
          P(g,x,R(y-hh),1,R(2*hh),side<0?DIAL:DIALD);if(LU)P(ng,x,R(y-hh),1,R(2*hh),DLIT);}
        const cx=fx(S2,side,4),cy=fy(S2,4)-up;P(g,cx,cy-3,1,3,HAND);P(g,cx+side,cy,2,1,HAND);if(LU)P(ng,cx,cy-3,1,3,'rgba(40,44,52,.9)');
        band(g,S2,side,0,9,hC,1,side<0?STD:STX);band(g,S2,side,0,9,2,1,side<0?STD:STX);}
      for(const [side,d] of [[-1,0],[-1,8],[1,8]]){const x=fx(S2,side,d),y=fy(S2,d)-hC;P(g,x,y-6,1,6,STD);P(g,x,y-8,1,2,GD2);}   // 鐘室角尖塔
      P(g,S2[0],S2[1]-hC-6,1,6,STD);P(g,S2[0],S2[1]-hC-8,1,2,GD2);
      const S3=[S2[0],S2[1]-hC],hB=12;box(g,S3,4.5,4.5,hB,STL,ST,null);                  // 鐘樓拱廊
      for(const side of [-1,1])for(let d=1;d<9;d+=3){faceRect(g,S3,side,d,2,2,8,'#2a2622',true);if(LU)faceRect(ng,S3,side,d,2,2,8,'rgba(255,214,140,.55)',true);}
      band(g,S3,-1,0,9,hB,1,GD);band(g,S3,1,0,9,hB,1,'#b8923a');
      const S4=[S3[0],S3[1]-hB],ap=pyramid(g,S4,4.5,38,SLL,SLD,GD);                        // 鑄鐵尖頂
      for(const f of [.35,.6]){const y=R(S4[1]-4.5-38*f),w=R(9*(1-f));P(g,S4[0]-w,y,2*w+1,1,GD);}
      {const y=R(S4[1]-4.5-38*.5);P(g,S4[0]-2,y-3,5,3,'#1e2530');P(g,S4[0]-1,y-3,3,2,GD2);if(LU)P(ng,S4[0]-1,y-3,3,2,'rgba(255,230,150,.95)');}   // Ayrton 燈
      P(g,ap[0],ap[1]-7,1,8,GD);P(g,ap[0]-1,ap[1]-5,3,1,GD2);                             // 十字尖
      return ap[1]-7;}
    /* k190 大笨鐘 1×1 */
    {const K=190,OL=[40,34,24],W=72,H=220,ax=36,ay=218,G=GP(ax,ay);const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      plate(base.g,ax,ay,'#a8a294','#948c7c','#b8b2a4');
      clockTower(g,ng,G(10,10),104,!window.__noBigBenNight190);
      lamp(g,ng,22,196,7,'#6e6a60',GD,'rgba(255,214,120,.55)');lamp(g,ng,50,196,7,'#6e6a60',GD,'rgba(255,214,120,.55)');
      finish(K,0,base,st,nt,ax,ay,OL);}
    /* k191 西敏宮 2×2：東北角伊莉莎白塔（後）、中段宮殿長立面、西南角維多利亞塔（前） */
    {const K=191,OL=[40,34,24],W=136,H=250,ax=68,ay=248,LU=!window.__noBigBenNight190;
      const G2=(i,j,z)=>[ax+2*i-2*j,ay-64+i+j-(z||0)];const base=mk(W,H),st=mk(W,H),nt=mk(W,H),g=st.g,ng=nt.g;
      A.dia(base.g,ax,ay-64,64,'#a8a294');A.diaEdge(base.g,6,'#948c7c',ax,ay-64,64);A.diaEdge(base.g,9,'#b8b2a4',ax,ay-64,64);
      for(let t=0;t<14;t++){const p=G2(30,4+t*1.8,0);P(base.g,p[0]-2,p[1],4,1,'#8fb8d0');}   // 右後側河岸欄杆感（淡藍）
      clockTower(g,ng,G2(29,11),96,LU);                                                   // 伊莉莎白塔（東北角，最先畫）
      {const S=G2(28,26),hW=34;box(g,S,18,10,hW,STL,ST,null);                              // 宮殿主量體
        for(let d=0;d<36;d+=2){P(g,fx(S,-1,d),fy(S,d)-hW+2,1,hW-4,STD);}                   // 直向飾板
        for(let d=0;d<20;d+=2){P(g,fx(S,1,d),fy(S,d)-hW+2,1,hW-4,STX);}
        for(const up of [5,16,25])for(let d=1;d<36;d+=2){faceRect(g,S,-1,d,1,up,6,GL,false);if(LU&&((d*7+up)%5)<3)faceRect(ng,S,-1,d,1,up,6,LIT,false);}
        for(const up of [5,16,25])for(let d=1;d<20;d+=2){faceRect(g,S,1,d,1,up,6,GL,false);if(LU&&((d*5+up)%5)<3)faceRect(ng,S,1,d,1,up,6,LIT,false);}
        for(const z of [13,23]){band(g,S,-1,0,36,z,1,STD);band(g,S,1,0,20,z,1,STX);}
        const T=[S[0],S[1]-hW];topFace(g,T,18,10,SLT,SLD,SLL);                              // 石板屋頂
        for(let i=0;i<5;i++){const p=[T[0]-4-i*7,T[1]-3-((4+i*7)>>1)];pyramid(g,p,1.5,7,SLL,SLD,null);P(g,p[0],p[1]-10,1,3,GD);}   // 屋頂小尖塔
        for(let d=0;d<36;d+=3){const x=fx(S,-1,d),y=fy(S,d)-hW;P(g,x,y-4,1,4,STD);P(g,x,y-5,1,1,GD2);}   // 女兒牆小尖塔
        for(let d=0;d<20;d+=3){const x=fx(S,1,d),y=fy(S,d)-hW;P(g,x,y-4,1,4,STX);P(g,x,y-5,1,1,GD2);}}
      {const S=G2(11,31),hV=88;box(g,S,5,5,hV,STL,ST,null);                                 // 維多利亞塔（西南角，最後畫）
        for(let d=1;d<10;d+=2){P(g,fx(S,-1,d),fy(S,d)-hV+2,1,hV-4,STD);P(g,fx(S,1,d),fy(S,d)-hV+2,1,hV-4,STX);}
        for(let z=16;z<hV;z+=18){band(g,S,-1,0,10,z,1,STD);band(g,S,1,0,10,z,1,STX);}
        faceRect(g,S,-1,3,4,4,14,'#3a2e24',true);                                           // 大拱門
        for(let z=26;z<hV-6;z+=18){faceRect(g,S,-1,2,2,z,8,GL,true);faceRect(g,S,-1,6,2,z,8,GL,true);faceRect(g,S,1,3,2,z,8,GL,true);
          if(LU){faceRect(ng,S,-1,2,2,z,8,LIT,true);faceRect(ng,S,-1,6,2,z,8,LIT,true);faceRect(ng,S,1,3,2,z,8,LIT,true);}}
        const T=[S[0],S[1]-hV];topFace(g,T,5,5,SLT,SLD,SLL);
        for(const [side,d] of [[-1,0],[-1,9],[1,9]]){const x=fx(S,side,d),y=fy(S,d)-hV;P(g,x-1,y-8,3,8,STL);P(g,x-1,y-10,3,2,SLL);P(g,x,y-12,1,2,GD);}   // 角塔
        P(g,S[0]-1,S[1]-hV-8,3,8,STL);P(g,S[0]-1,S[1]-hV-10,3,2,SLL);
        const fp=[T[0],T[1]-5];P(g,fp[0],fp[1]-22,1,22,'#5a5a62');{const fx0=fp[0]+1,fy0=fp[1]-22;P(g,fx0,fy0,7,5,'#233f8e');P(g,fx0,fy0+1,7,3,'#f2f2f2');P(g,fx0+2,fy0,3,5,'#f2f2f2');P(g,fx0,fy0+2,7,1,'#c8202a');P(g,fx0+3,fy0,1,5,'#c8202a');}}   // 英國旗（簡化：藍底、白邊紅十字）
      lamp(g,ng,52,236,7,'#6e6a60',GD,'rgba(255,214,120,.55)');lamp(g,ng,84,236,7,'#6e6a60',GD,'rgba(255,214,120,.55)');
      finish(K,0,base,st,nt,ax,ay,OL);}
  })();}catch(e){console.error('v574 k190/191',e);}
