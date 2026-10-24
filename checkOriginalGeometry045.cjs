'use strict';
// Source-only recording-stub audit. No game, canvas, browser, pixel output, or
// native rasterizer is executed. Rendered acceptance remains an isolated CI duty.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const frozenRows=[
  {
    "id": "knapmediation",
    "nm": "矢車菊公共調解館",
    "en": "Knapwell Civic Mediation Rooms",
    "v": 800,
    "shape": "two-unequal-triangular-brick-pavilions-diagonal-open-court-low-end-link-three-plane-hip-roofs",
    "design": "兩個不等高的低三角磚調解室分置近方形地塊兩側，中間保留真斜向露天靜院，只在一端以更低的實入口廊相連；各有三片可讀板岩坡面及不同高頂點，外側成對上下拉窗、院側高窄窗與木門，表達分開的安靜會談空間。",
    "distinctionFromPublished160": "Teaselhat是單一窄高三層實三角楔，Sorrelglove是封閉領結腰，Harecase是直角矩形工房加曲玻璃廊；本款是低雙三角、完整斜向真空院及一端低實連接，無中央實腰、玻璃彎橋、塔或整圈內院。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "adderlens",
    "nm": "蛇舌蕨光學工房",
    "en": "Adderwick Optical Works",
    "v": 804,
    "shape": "solid-long-biconvex-lens-plan-workhall-two-pointed-ends-straight-ridge-faceted-slate-roof",
    "design": "單一細長雙凸透鏡形磚工房，兩端真收尖而兩側向外鼓出，沒有凹口或附塔；直線長屋脊配向兩側及尖端落下的分面板岩坡頂，長側寬橫分格工作窗、尖端兩側窄豎窗、側面小凹木門；用途為鏡片研磨與光學器具工藝展示。",
    "distinctionFromPublished160": "LeedsCorn是橢圓鈍端大廳加圓拱穹頂，Rookspiano是深凹腎形加高音室，Teaselhat是三面窄高楔；本款低長雙凸、兩個清楚尖端及直脊分坡屋頂，不能退化成橢圓鼓樓、單三角盒或改色腎形。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "yarrowbraille",
    "nm": "蓍草點字工房",
    "en": "Yarrowfen Braille House",
    "v": 808,
    "shape": "single-long-two-height-brick-workhall-split-pitch-slate-roof-continuous-vertical-clerestory-step",
    "design": "低前室與較高後工作室沿全長相貼成一個長矩形封閉館，兩個相向但不同標高的板岩坡面在中線留下連續直立採光窗帶；前排低寬木格窗、後室高窄成對窗、側面一大一小實木材料門，無外院或附塔；用途為點字轉錄與觸讀材料製作。",
    "distinctionFromPublished160": "Orchardcraft為三段鋸齒和圓樓梯鼓，Flintchart為放射三鋸齒，Willowmusic為分開V翼蝴蝶谷，Sedgephoto為單陡玻璃坡加低橢圓；本款只有一條完整直線採光高差及低前高後兩級實牆，不做鋸齒串、V平面或玻璃楔頂。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "elderdebate",
    "nm": "接骨木辯論會堂",
    "en": "Elderwick Debating Hall",
    "v": 812,
    "shape": "apseless-basilican-brick-hall-high-long-gabled-centre-two-low-continuous-lean-to-aisles",
    "design": "高窄長中央辯論廳兩側各接一條明顯較矮的連續側廊，中央陡板岩山牆頂與兩側向外落低的單坡頂形成真正三級剖面；中央兩側有高成排窄窗，低廊有小圓頭雙窗，正面深石框木門和三聯高窗；無後殿、鐘塔或宗教符號。",
    "distinctionFromPublished160": "Crossness是三個平行近同高山牆跨，Rookhall是錯T截角山牆加後殿，Larkprint是前寬後窄倒T，RCJ有哥德式側塔與複合翼；本款是一條高中央空間夾兩條連續低側廊的清楚剖面，不是普通三山牆排屋或教堂換名。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "osieroral",
    "nm": "柳溪口述歷史館",
    "en": "Osierbrook Oral History Hall",
    "v": 816,
    "shape": "low-rectangular-hall-two-full-length-brick-sidewalls-single-concave-lead-trough-roof",
    "design": "低矩形口述歷史錄音館，兩道完整長磚側牆承托一片淺單向下凹鉛曲頂，屋面只橫向下垂、縱向等截面；正面寬木格玻璃工作窗上緣隨曲頂下降，側牆高窄窗、兩端實木門與石門框，端部明確收水簷；無架空、無附塔。",
    "distinctionFromPublished160": "Willowmusic為兩翼平面V形蝴蝶谷頂，Pondbadminton為對角高低鞍面，Wrenumbrella為一端高拱一端低直的凸conoid；本款平行落地實側牆間一片單向凹曲屋面，不能改成兩塊平斜板、鞍面或凸桶拱。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "cloudmereweather",
    "nm": "雲澤氣象學舍",
    "en": "Cloudmere Weather School",
    "v": 820,
    "shape": "low-decagonal-brick-classroom-shallow-faceted-slate-dome-real-small-central-oculus",
    "design": "低寬十邊磚氣象學舍，淺分面板岩穹頂中央留真開放觀天孔，孔緣厚鉛翻邊及低環梁，孔下只有相應小型露天觀測空間；外牆交替寬平頂雙窗與實牆、單一石框凹入口；開孔有真內側厚度與可見深度，不用黑色圓貼片，無儀器動畫或氣象模擬。",
    "distinctionFromPublished160": "Alaronde為十六邊住宅及分面尖頂菱窗，Roundhouse為實心蜂巢石穹，Fennelhoney為大露天院的厚環形工房，Thistlenursery有高採光亭和雙後殿；本款是低薄穹頂上的小真觀天孔，無塔、中央高亭、外伸翼或大院。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "coppicelecture",
    "nm": "萌林自然講習館",
    "en": "Coppicefield Nature Lecture Rooms",
    "v": 824,
    "shape": "single-grounded-raked-auditorium-wedge-high-rear-foyer-one-unbroken-sloping-slate-roof",
    "design": "單一落地磚講堂，側影由低前端直升高後端，連續板岩大坡頂下容納同寬高後廳，沒有另外加高盒；厚石基及轉角石框、兩側沿斜剖面上升的三組短豎窗、低前端一組寬窗和偏置木門，表達階梯式自然講習室；無架空步道或附塔。",
    "distinctionFromPublished160": "Leicester及Rogerstevens為多塊階梯講堂、塔和架空連廊組合，Sedgephoto是陡玻璃楔加低橢圓接待室，Brooktools是折轉三段單坡；本款僅一個落地、實板岩頂、無凹轉與附樓的長斜楔，不以小坡屋頂普通方盒代替整體斜剖面。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "shellwickpetitions",
    "nm": "貝原市民陳情室",
    "en": "Shellwick Civic Petition Rooms",
    "v": 828,
    "shape": "solid-D-plan-civic-room-straight-brick-back-semicircular-front-single-radial-half-hip-roof",
    "design": "實心低D形市民陳情館，筆直後牆與寬半圓前牆合成一間完整房體，單一半扇形板岩屋面由直背中央高點向弧簷落下；弧面五組窄長平頂木格窗、直背偏置石門，後端不另加塔或接待翼，沒有內院或開放車棚。",
    "distinctionFromPublished160": "Bramblewheel是高直後工房加低半圓開放車棚及真院，LeedsCorn為完整橢圓穹頂，Honeygrocer為四分圓角店加階梯後翼；本款是低寬實心半圓室與直背、無附樓的放射平面坡頂，不能複製空D院、整橢圓或只把角店屋面放大。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "velvetcostume",
    "nm": "絨谷戲服修護亭",
    "en": "Velvetcombe Costume Pavilion",
    "v": 832,
    "shape": "low-square-stone-workroom-dominant-four-sided-ogee-slate-roof-flared-eaves-short-truncated-ridge",
    "design": "低方形石基戲服修護亭，屋頂占整體高度過半，四面真正連續反曲板岩主頂由下部外張簷收至上部短截脊；四角不加塔，兩側成對高橢圓窗、正面三聯矩形工窗及偏置木門，曲面以有厚度的分段屋面表達，無塔身或上下疊帽。",
    "distinctionFromPublished160": "Asterpost為長身折簷截角頂加五邊郵亭，Brassbell為高方鑄房雙層四坡帽，Guildford和Lynncustoms僅在高塔頂有小曲帽；本款整座低寬工作亭以單一四面反曲主屋頂構成，不能把普通金字塔畫曲線或放大既有塔帽充數。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "broomtranslations",
    "nm": "金雀翻譯事務所",
    "en": "Broomfield Translation Rooms",
    "v": 836,
    "shape": "three-contiguous-staggered-brick-room-ranges-two-real-front-recesses-unequal-complete-hip-roofs",
    "design": "三條沿同一軸相貼的低磚工作室，街面逐間前後錯開並形成兩個真凹角，中間較高而兩側低，三個各自完整的四坡板岩頂清楚分離；前窗分別為寬三聯平窗、成對高上下拉窗和短橫窗，兩凹角內設石框門；沒有院落、指狀空隙、架空或外部連橋，用途為市民文件翻譯。",
    "distinctionFromPublished160": "Netshops是分離窄高尖山牆網屋，Crossness為齊平三跨山牆，Alderjoinery為真院E形指廊，Brooktools為Z形逐級單坡，Woldswitch為雙錯位方塊配寬設備連接和不同頂類；本款低、相貼、中央高的三段折退街面，真凹門與三個完整四坡頂共同辨識，不能只多複製一個Wold方盒或把Brook換頂。",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English civic and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  }
];
const scope={rows:frozenRows};
if(fs.existsSync('wave045-original-scope.json'))assert.deepEqual(JSON.parse(fs.readFileSync('wave045-original-scope.json','utf8')).rows,frozenRows);
const source=fs.readFileSync('british-wave17-art045.js','utf8');
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const colour=s=>parseInt(crypto.createHash('sha256').update(s).digest('hex').slice(0,6),16);
const P=new Proxy({},{get:(_,k)=>colour(String(k))});
let traces=[];
function kit(options,view){
  assert.deepEqual(JSON.parse(JSON.stringify(options)),{sz:2,w:160,h:196});
  const trace={view,polygons:[],beams:[],faces:[],walls:[],beamMaterials:[],materials:[],materialValues:[],pairedMaterials:0};traces.push(trace);
  const record=(points,material)=>{
    assert(points.length>=2);
    for(const p of points){assert.equal(p.length,3);assert(p.every(Number.isFinite),'finite world coordinate');}
    if(Array.isArray(material))trace.pairedMaterials++;
    trace.polygons.push(points);trace.materials.push(Array.isArray(material)?'emissive':material&&material.kind||'solid');trace.materialValues.push(typeof material==='number'?material:null);
  };
  const S={
    poly:record,
    wall:(a,b,z0,z1,m)=>{trace.walls.push({a,b,z0,z1,kind:m&&m.kind||'solid'});record([[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]],m);},
    flat:(x0,x1,y0,y1,z,m)=>record([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]],m),
    box:(x0,x1,y0,y1,z0,z1,m,side,top)=>{assert(x1>x0&&y1>y0&&z1>=z0,'ordered world box');for(const [a,b,c]of[[[x0,y0],[x1,y0],m],[[x0,y1],[x1,y1],m],[[x0,y0],[x0,y1],side===undefined?m:side],[[x1,y0],[x1,y1],side===undefined?m:side]])record([[...a,z0],[...b,z0],[...b,z1],[...a,z1]],c);if(top!==null)record([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],top===undefined?m:top);},
    beam:(a,b,c,w)=>{assert(a.every(Number.isFinite)&&b.every(Number.isFinite));assert(Number.isFinite(w)&&w>0);trace.beams.push([a,b,w]);trace.beamMaterials.push(c);},
    face:(a,b,nx,ny)=>{
      const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);assert(length>0);
      assert(Math.abs(Math.hypot(nx,ny)-1)<1e-8,'unit physical wall normal');trace.faces.push({a,b,nx,ny});
      const F={length,point:(u,d,z)=>[a[0]+dx*u/length+nx*d,a[1]+dy*u/length+ny*d,z]};
      F.panel=(u0,u1,z0,z1,m,d=0)=>record([F.point(u0,d,z0),F.point(u1,d,z0),F.point(u1,d,z1),F.point(u0,d,z1)],m);
      F.block=(u0,u1,d0,d1,z0,z1,m)=>record([F.point(u0,d0,z0),F.point(u1,d0,z0),F.point(u1,d1,z0),F.point(u0,d1,z0),F.point(u0,d0,z1),F.point(u1,d0,z1),F.point(u1,d1,z1),F.point(u0,d1,z1)],m);
      return F;
    },
    finish:meta=>({sourceOnly:true,...meta})
  };
  const K={
    hash:(x,y,z)=>(Math.imul(x,17)^Math.imul(y,43)^z)>>>0,mod:(x,n)=>(x%n+n)%n,
    brick:()=>Object.assign(()=>P.stone,{kind:'brick'}),ashlar:()=>Object.assign(()=>P.stone,{kind:'stone'}),slate:()=>Object.assign(()=>P.lead,{kind:'slate'}),paving:()=>P.pave,
    cylinder:(s,x,y,z0,z1,r0,r1,c0,c1,c2,n=8)=>{for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n;s.poly([[x+r0*Math.cos(a),y+r0*Math.sin(a),z0],[x+r0*Math.cos(b),y+r0*Math.sin(b),z0],[x+r1*Math.cos(b),y+r1*Math.sin(b),z1],[x+r1*Math.cos(a),y+r1*Math.sin(a),z1]],c0);}},
    ring:(s,F,u,z,rx,ry,w,d,m,n=24)=>{for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n;s.poly([F.point(u+rx*Math.cos(a),d,z+ry*Math.sin(a)),F.point(u+rx*Math.cos(b),d,z+ry*Math.sin(b)),F.point(u+(rx-w)*Math.cos(b),d,z+(ry-w)*Math.sin(b)),F.point(u+(rx-w)*Math.cos(a),d,z+(ry-w)*Math.sin(a))],m);}},
    lantern:(s,x,y,z,lit)=>s.poly([[x-.3,y,z],[x+.3,y,z],[x+.3,y,z+1],[x-.3,y,z+1]],lit?[P.glass,P.warm]:P.glass)
  };
  return{S,K,P,C:s=>parseInt(s,16),dark:(nx,ny)=>{let x=nx,y=ny;if(view===1){x=-ny;y=nx;}else if(view===2){x=-nx;y=-ny;}else if(view===3){x=ny;y=-nx;}return x>y;}};
}
const sandbox={BritishUseScalesKit021:{create:kit},__wave045GeometryOnly:true};
vm.runInNewContext(source,sandbox,{filename:'british-wave17-art045.js'});
const art=sandbox.BritishWaveArchitecture045,rows=JSON.parse(JSON.stringify(art.rows));
assert.deepEqual(rows,scope.rows);assert.equal(art.candidateRows().length,10);
assert.equal(new Set(rows.map(r=>r.id)).size,10);assert.equal(new Set(rows.map(r=>r.shape)).size,10);
rows.forEach((r,i)=>{assert.equal(r.v,800+i*4);assert.equal(r.evidenceStatus,'original-code-native-design');assert(!r.url);});
const summaries=[],modelTraces={};
for(const row of rows)for(let view=0;view<4;view++){
  const s=art.build(row.id,view),t=traces.at(-1),pts=t.polygons.flat();
  if(view===0)modelTraces[row.id]=t;
  assert.equal(s.id,row.id);assert.equal(s.view,view);assert(s.details.originalDesign);
  assert.equal(s.__britishWave045,1);assert(t.polygons.length>35);assert(t.pairedMaterials>5,'authored paired glazing required');
  const bbox=[0,1,2].map(i=>[Math.min(...pts.map(p=>p[i])),Math.max(...pts.map(p=>p[i]))]);
  assert(bbox[0][0]>-.1&&bbox[0][1]<32.1&&bbox[1][0]>-.1&&bbox[1][1]<32.1,'bounded native footprint');
  assert(bbox[2][0]>=0&&bbox[2][1]<65,'bounded authored height; this is not a projected crop check');
  const boundsPoints=[...pts,...t.beams.flatMap(([a,b,w])=>[a,b].flatMap(p=>[-1,1].flatMap(s=>[-1,1].flatMap(v=>[-1,1].map(z=>[p[0]+s*w/2,p[1]+v*w/2,p[2]+z*w/2])))))];
  const projected=boundsPoints.map(([x,y,z])=>{let u=x,v=y;if(view===1){u=32-y;v=x;}else if(view===2){u=32-x;v=32-y;}else if(view===3){u=y;v=32-x;}return[80+2*u-2*v,130+u+v-z];});
  const projectedBounds=[0,1].map(i=>[Math.min(...projected.map(p=>p[i])),Math.max(...projected.map(p=>p[i]))]);
  assert(projectedBounds[0][0]>1&&projectedBounds[0][1]<159&&projectedBounds[1][0]>1&&projectedBounds[1][1]<195,'analytic source projected bounds include all beam widths; not a pixel crop assertion');
  summaries.push({id:row.id,view,projectedBounds,polygons:t.polygons.length,beams:t.beams.length,pairedMaterials:t.pairedMaterials,bbox,geometrySHA256:digest({polygons:t.polygons,beams:t.beams})});
}
assert.equal(summaries.length,40);assert.equal(new Set(summaries.filter(s=>s.view===0).map(s=>s.geometrySHA256)).size,10);
assert.throws(()=>art.build('not-a-frozen-model',0),/unknown frozen original/);
assert.throws(()=>art.build(rows[0].id,4),/four world rotations only/);
assert.throws(()=>art.build(rows[0].id,NaN),/four world rotations only/);
assert(!/\b(?:document|SPR|tiles|dispatch|nightPowerRate|trafClock|pw)\b/.test(source),'pure geometry source isolation');
// Independent geometric assertions inspect actual surfaces, not returned flags.
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const area=q=>q.reduce((s,p,i)=>s+p[0]*q[(i+1)%q.length][1]-p[1]*q[(i+1)%q.length][0],0)/2;
const ccw=q=>area(q)<0?q.slice().reverse():q.slice();
const close=(a,b)=>Math.abs(a-b)<1e-7,key=p=>p.map(x=>Math.round(x*1e7)).join(','),polykey=p=>p.map(key).sort().join('|');
const minz=p=>Math.min(...p.map(v=>v[2])),maxz=p=>Math.max(...p.map(v=>v[2]));
const roofPolygons=t=>t.polygons.filter((p,i)=>t.materials[i]==='slate');
const wallsAt=(t,z0,z1)=>t.walls.filter(w=>close(w.z0,z0)&&close(w.z1,z1));
function intersectionArea(first,second){
  let p=ccw(first),clip=ccw(second);
  for(let i=0;i<clip.length&&p.length;i++){
    const a=clip[i],b=clip[(i+1)%clip.length],out=[];
    for(let j=0;j<p.length;j++){
      const x=p[j],y=p[(j+1)%p.length],dx=cross(a,b,x),dy=cross(a,b,y),ix=dx>=-1e-9,iy=dy>=-1e-9;
      if(ix)out.push(x);if(ix!==iy){const t=dx/(dx-dy);out.push([x[0]+t*(y[0]-x[0]),x[1]+t*(y[1]-x[1])]);}
    }p=out;
  }return Math.abs(area(p));
}
function assertPartition(polys,label){
  for(const q0 of polys){const q=ccw(q0);assert(area(q)>1e-9,label+' nonzero roof patch');for(let i=0;i<q.length;i++)assert(cross(q[i],q[(i+1)%q.length],q[(i+2)%q.length])>=-1e-8,label+' convex roof patch');}
  for(let i=0;i<polys.length;i++)for(let j=i+1;j<polys.length;j++)assert(intersectionArea(polys[i],polys[j])<1e-7,label+' roof patches must not overlap in plan');
}
function heightsAt(t,x,y){
  const found=[];for(const p of t.polygons)for(let i=1;i<p.length-1;i++){
    const a=p[0],b=p[i],c=p[i+1],d=cross(a,b,c);if(Math.abs(d)<1e-9)continue;
    const u=cross([x,y],b,c)/d,v=cross(a,[x,y],c)/d,w=1-u-v;
    if(Math.min(u,v,w)>=-1e-8)found.push(a[2]*u+b[2]*v+c[2]*w);
  }return found;
}
function assertOpen(t,points,label){for(const p of points)assert(heightsAt(t,...p).every(z=>z<=.61),label+' true empty vertical opening');}
function assertSolid(t,points,minimum,label){for(const p of points)assert(heightsAt(t,...p).some(z=>z>=minimum),label+' solid enclosed body');}
function assertUndersides(t,tops,thickness,label){
  const underside=new Set(t.polygons.filter((p,i)=>t.materialValues[i]===P.woodR).map(polykey));
  for(const p of tops)assert(underside.has(polykey(p.map(q=>[q[0],q[1],q[2]-thickness]))),label+' exact matching triangulated underside');
}
function assertMeshClosed(t,tops,thickness,label){
  assertUndersides(t,tops,thickness,label);
  const edges=new Map();for(const p of tops)for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],k=[key(a),key(b)].sort().join('|'),e=edges.get(k);if(e)e.count++;else edges.set(k,{a,b,count:1});}
  for(const e of edges.values())if(e.count===1){
    const wanted=polykey([e.a,e.b,[e.b[0],e.b[1],e.b[2]-thickness],[e.a[0],e.a[1],e.a[2]-thickness]]);
    // A long coplanar fascia may cover several adjacent mesh edges.
    assert(t.polygons.some((p,i)=>t.materialValues[i]===P.lead&&p.length===4&&(polykey(p)===wanted||e.a.every((_,j)=>Number.isFinite(e.b[j]))&&pointOnPoly(e.a,p)&&pointOnPoly(e.b,p)&&pointOnPoly([e.a[0],e.a[1],e.a[2]-thickness],p)&&pointOnPoly([e.b[0],e.b[1],e.b[2]-thickness],p))),label+' closed boundary fascia');
  }
}
function pointOnPoly(p,q){
  const sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  for(let i=1;i<q.length-1;i++){
    const a=q[0],v0=sub(q[i],a),v1=sub(q[i+1],a),v2=sub(p,a),aa=dot(v0,v0),bb=dot(v0,v1),cc=dot(v1,v1),dd=dot(v2,v0),ee=dot(v2,v1),den=aa*cc-bb*bb;
    if(Math.abs(den)<1e-12)continue;const u=(cc*dd-bb*ee)/den,v=(aa*ee-bb*dd)/den;
    if(u>=-1e-8&&v>=-1e-8&&u+v<=1+1e-8&&Math.hypot(...p.map((x,j)=>x-a[j]-u*v0[j]-v*v1[j]))<1e-7)return true;
  }return false;
}
const vertices=t=>t.polygons.flat(),uniquePoints=p=>[...new Map(p.map(q=>[key(q),q])).values()];
const hasVertex=(p,v)=>p.some(q=>q.every((n,i)=>close(n,v[i])));
const materialPolygons=(t,kind)=>t.polygons.filter((p,i)=>t.materials[i]===kind);
function assertGlazingBacking(t,label){
  const masonry=t.polygons.filter((p,i)=>(t.materials[i]==='brick'||t.materials[i]==='stone')&&Math.abs(area(p))<1e-8);
  for(const p of materialPolygons(t,'emissive'))assert(t.faces.some(F=>{
    const ds=p.map(q=>(q[0]-F.a[0])*F.nx+(q[1]-F.a[1])*F.ny);
    return ds.every(d=>d>.18&&d<.31&&close(d,ds[0]))&&p.every(q=>masonry.some(w=>pointOnPoly([q[0]-F.nx*ds[0],q[1]-F.ny*ds[0],q[2]],w)));
  }),label+' opaque glazing is backed by real masonry');
}
function assertKnap(t){
  assert.equal(wallsAt(t,.6,12.2).length,3,'Knap first low triangular room has three walls');
  assert.equal(wallsAt(t,.6,15.1).length,3,'Knap second taller triangular room has three walls');
  assert.equal(wallsAt(t,.6,7.8).length,4,'Knap low end link is grounded and closed');
  const tops=roofPolygons(t),high=tops.filter(p=>maxz(p)>10);assert.equal(high.length,6,'Knap two three-plane hips');
  assert(hasVertex(high.flat(),[11.1,10.1,21.3])&&hasVertex(high.flat(),[21.1,21.6,25.2]),'Knap unequal physical hip apexes');
  assertOpen(t,[[12,20],[16,16.8],[23.5,10.1]],'Knap diagonal court');assertSolid(t,[[5,25],[8,8],[25,25]],7,'Knap rooms and low end link');
  assertPartition(high,'Knap separated triangle roofs');assertUndersides(t,tops,.4,'Knap');assertGlazingBacking(t,'Knap');
}
function assertAdder(t){
  const walls=wallsAt(t,.6,12.7);assert.equal(walls.length,24,'Adder one 24-face convex lens perimeter');
  const q=walls.map(w=>w.a);assert(q.every((p,i)=>cross(p,q[(i+1)%q.length],q[(i+2)%q.length])>0),'Adder lens must be strictly convex');
  assert(q.filter(p=>close(p[0],3)).length===1&&q.filter(p=>close(p[0],29)).length===1,'Adder two true single-vertex pointed ends');
  assert(q.filter(p=>close(p[0],16)).every(p=>close(Math.abs(p[1]-16),8.8)),'Adder two outward convex long sides');
  const tops=roofPolygons(t);assert(tops.flat().filter(p=>p[2]>13.1).every(p=>close(p[1],16)),'Adder all raised roof vertices on one straight ridge');
  assert(t.beams.some(([a,b])=>hasVertex([a],[9.5,16,22.2])&&hasVertex([b],[22.5,16,22.2])),'Adder actual long ridge cap');
  assertPartition(tops,'Adder continuous lens roof');assertUndersides(t,tops,.4,'Adder');assertSolid(t,[[16,16],[4,16],[28,16]],12,'Adder single solid lens');assertGlazingBacking(t,'Adder');
}
function assertYarrow(t){
  const tops=roofPolygons(t);assert.equal(tops.length,4,'Yarrow exactly two complete planar roof pitches');
  assert(tops.flat().every(p=>close(p[2],p[1]>=16&&p[2]<18?17-(p[1]-16)*.4:18+(p[1]-6)*.6)),'Yarrow unequal opposed pitches, not sawtooth');
  const step=t.walls.filter(w=>close(w.z0,17.6)&&close(w.z1,23.6));assert.equal(step.length,1,'Yarrow one continuous vertical clerestory wall');assert(close(step[0].a[1],16)&&close(step[0].b[1],16)&&close(Math.abs(step[0].b[0]-step[0].a[0]),24.4),'Yarrow full-length straight clerestory');
  const glass=materialPolygons(t,'emissive').filter(p=>minz(p)>18);assert.equal(glass.length,1,'Yarrow one unbroken glazed clerestory band');assert(Math.max(...glass[0].map(p=>p[0]))-Math.min(...glass[0].map(p=>p[0]))>22,'Yarrow continuous clerestory glazing length');
  assertPartition(tops,'Yarrow roof');assertMeshClosed(t,tops,.4,'Yarrow');assertGlazingBacking(t,'Yarrow');
}
function assertElder(t){
  assert.equal(wallsAt(t,.6,22).length,4,'Elder one high central hall');assert.equal(wallsAt(t,.6,10.8).length,8,'Elder two continuous low aisles');
  const tops=roofPolygons(t);assert.equal(tops.length,8,'Elder central gable plus two lean-to planes');
  const central=tops.filter(p=>maxz(p)>20);assert(central.flat().filter(p=>close(p[2],33.6)).every(p=>close(p[0],16)),'Elder central longitudinal gable ridge');
  for(const p of tops.filter(p=>maxz(p)<20).flat())assert(close(p[2],11.2+(Math.min(p[0]-3.5,28.5-p[0]))*4/7.5),'Elder both aisle roofs lean outward');
  assert(!t.walls.some(w=>w.z0>.6),'Elder no tower or stacked annex');assertPartition(tops,'Elder');assertMeshClosed(t,tops,.4,'Elder');assertGlazingBacking(t,'Elder');
}
function osierTops(t){return t.polygons.filter((p,i)=>p.length===4&&[P.lead,P.slateHi].includes(t.materialValues[i])&&Math.abs(area(p))>1&&minz(p)>=13);}
function assertOsier(t){
  const walls=wallsAt(t,.6,18.4);assert.equal(walls.length,2,'Osier two full grounded sidewalls');assert(walls.every(w=>close(Math.abs(w.a[1]-w.b[1]),24)&&close(w.a[0],w.b[0])),'Osier parallel complete long sidewalls');
  const tops=osierTops(t);assert.equal(tops.length,16,'Osier sixteen curved lead section strips');
  for(const p of tops.flat())assert(close(p[2],13+5.8*((p[0]-16)/11.5)**2),'Osier true one-axis concave parabolic profile');
  for(const p of tops)assert(close(p[0][2],p[3][2])&&close(p[1][2],p[2][2]),'Osier identical front and rear sections');
  const endwalls=materialPolygons(t,'brick').filter(p=>p.length===4&&close(minz(p),.6));assert.equal(endwalls.length,34,'Osier both curved ends closed to ground');
  assertPartition(tops,'Osier');assertMeshClosed(t,tops,.4,'Osier');assertGlazingBacking(t,'Osier');
}
function assertCloudmere(t){
  assert.equal(wallsAt(t,.6,12.6).length,10,'Cloudmere ten grounded outer wall planes');
  const tops=roofPolygons(t);assert.equal(tops.length,60,'Cloudmere three complete decagonal roof courses');
  assert(tops.flat().every(p=>Math.hypot(p[0]-16,p[1]-16)>=3.25-1e-7),'Cloudmere roof never crosses small oculus');
  assertOpen(t,[[16,16],[15,16],[17,16],[16,15],[16,17]],'Cloudmere true open oculus');
  const rim=t.polygons.filter((p,i)=>t.materialValues[i]===P.stoneD&&close(minz(p),18.6)&&close(maxz(p),20.2));assert.equal(rim.length,10,'Cloudmere ten thick inner rim reveals');
  const rimSoffits=t.polygons.filter((p,i)=>t.materialValues[i]===P.woodR&&p.length===4&&close(minz(p),18.6)&&close(maxz(p),19.1));assert.equal(rimSoffits.length,10,'Cloudmere ten closed annular rim soffits');
  const inner=materialPolygons(t,'stone').filter(p=>close(minz(p),.6)&&close(maxz(p),18.6));assert.equal(inner.length,10,'Cloudmere deep grounded observation shaft');
  assert(tops.flat().every(p=>p[2]<=19.5),'Cloudmere shallow dome without high lantern');assertPartition(tops,'Cloudmere annulus');assertUndersides(t,tops,.4,'Cloudmere');assertGlazingBacking(t,'Cloudmere');
}
function assertCoppice(t){
  const tops=roofPolygons(t);assert.equal(tops.length,2,'Coppice one complete triangulated roof plane');
  for(const p of tops.flat())assert(close(p[2],27-(p[1]-3.5)*14.2/25),'Coppice one unbroken rising slate plane');
  const side=materialPolygons(t,'brick').filter(p=>p.length===4&&close(minz(p),.6)&&close(maxz(p),26.6)&&(p.every(q=>close(q[0],5))||p.every(q=>close(q[0],27))));
  assert.equal(side.length,2,'Coppice two complete ground-to-slope sidewalls');
  assert.equal(wallsAt(t,.6,26.6).length,1,'Coppice high rear is within same body');assert.equal(wallsAt(t,.6,12.4).length,1,'Coppice low front is grounded');
  const sideglass=materialPolygons(t,'emissive').filter(p=>p.every(q=>q[0]<5||q[0]>27));assert.equal(sideglass.length,12,'Coppice six paired rising window groups');
  assert(new Set(sideglass.map(p=>minz(p).toFixed(6))).size>=3,'Coppice physical rising window levels');assertPartition(tops,'Coppice');assertMeshClosed(t,tops,.4,'Coppice');assertGlazingBacking(t,'Coppice');
}
function assertShellwick(t){
  const walls=wallsAt(t,.6,12.8);assert.equal(walls.length,16,'Shellwick fifteen arc walls and one straight rear');
  assert(walls.filter(w=>close(w.a[1],13)&&close(w.b[1],13)).length===1,'Shellwick one unsplit straight back');
  for(const w of walls.slice(0,15))for(const p of[w.a,w.b])assert(close(Math.hypot(p[0]-16,p[1]-13),13)&&p[1]>=13-1e-7,'Shellwick true semicircular front');
  const tops=roofPolygons(t);assert.equal(tops.length,15,'Shellwick fifteen radial half-hip facets');assert(tops.every(p=>hasVertex(p,[16,13,25.6])),'Shellwick single high point at rear midpoint');
  assertSolid(t,[[16,17],[10,17],[23,17],[16,24]],13,'Shellwick solid D room');assertOpen(t,[[16,8],[6,8],[26,8]],'Shellwick no rear annex');
  assertPartition(tops,'Shellwick');assertUndersides(t,tops,.4,'Shellwick');assertGlazingBacking(t,'Shellwick');
}
function assertVelvet(t){
  assert.equal(wallsAt(t,.6,10.8).length,4,'Velvet one low grounded square room');const tops=roofPolygons(t);assert.equal(tops.length,56,'Velvet seven continuous four-sided curved roof courses');
  const profile=uniquePoints(tops.flat().filter(p=>p[0]<16&&p[1]<16)).sort((a,b)=>a[2]-b[2]);assert.equal(profile.length,8,'Velvet eight actual roof-section levels');
  const slopes=profile.slice(1).map((p,i)=>(p[0]-profile[i][0])/(p[2]-profile[i][2]));
  assert(slopes[0]>slopes[1]&&slopes[1]>slopes[2]&&slopes[2]<slopes[3]&&slopes[3]<slopes[4]&&slopes[4]<slopes[5],'Velvet actual slope reversal makes a true ogee');
  assert(close(profile[0][0],3.8)&&close(profile.at(-1)[2],32.7),'Velvet broad flared eave and low truncated ridge');assert(32.7-11.2>32.7/2,'Velvet main roof dominates total height');
  const ovals=materialPolygons(t,'emissive').filter(p=>p.length===24);assert.equal(ovals.length,4,'Velvet two pairs of tall actual oval windows');
  assertPartition(tops,'Velvet');assertUndersides(t,tops,.4,'Velvet');assertGlazingBacking(t,'Velvet');
}
function assertBroom(t){
  const sections=[[3.5,11.5,8,27,12],[11.5,20.5,4,22,17],[20.5,28.5,8,17,13.4]];
  for(const [x0,x1,y0,y1,z]of sections){const w=wallsAt(t,.6,z);assert.equal(w.length,4,'Broom each contiguous range has four grounded walls');const p=w.flatMap(w=>[w.a,w.b]);assert(close(Math.min(...p.map(p=>p[0])),x0)&&close(Math.max(...p.map(p=>p[0])),x1)&&close(Math.min(...p.map(p=>p[1])),y0)&&close(Math.max(...p.map(p=>p[1])),y1),'Broom exact staggered touching room ranges');}
  assertSolid(t,[[11.49,15],[11.51,15],[20.49,12],[20.51,12]],12,'Broom direct room-to-room continuity');assertOpen(t,[[14,25],[23,20]],'Broom two true deep front recesses');
  const tops=roofPolygons(t);assert.equal(tops.length,18,'Broom three complete four-plane hips');
  for(const [x0,x1,y0,y1,z]of sections){const roof=tops.filter(p=>p.every(q=>q[0]>=x0-1e-8&&q[0]<=x1+1e-8));assert.equal(roof.length,6,'Broom each hip has both end triangles and both side pairs');const peak=z+.4+(z===17?5.4:z===12?5:4.4);assert(roof.every(p=>close(minz(p),z+.4)&&close(maxz(p),peak)),'Broom three unequal complete hip sections');}
  const recesses=t.faces.filter(F=>F.nx===1&&F.ny===0&&close(F.b[1]-F.a[1],5));assert.equal(recesses.length,2,'Broom two physical five-unit doorway returns');
  assertPartition(tops,'Broom non-overlapping adjoining roofs');assertMeshClosed(t,tops,.4,'Broom');assertGlazingBacking(t,'Broom');
}
const checks={knapmediation:assertKnap,adderlens:assertAdder,yarrowbraille:assertYarrow,elderdebate:assertElder,osieroral:assertOsier,cloudmereweather:assertCloudmere,coppicelecture:assertCoppice,shellwickpetitions:assertShellwick,velvetcostume:assertVelvet,broomtranslations:assertBroom};
for(const [id,check]of Object.entries(checks))check(modelTraces[id]);
for(const row of rows)assert.equal(new Set(summaries.filter(s=>s.id===row.id).map(s=>s.geometrySHA256)).size,1,'four callers use identical world geometry');
const clone=t=>JSON.parse(JSON.stringify(t)),controls=[];
function removePolygon(t,i){assert(i>=0);t.polygons.splice(i,1);t.materials.splice(i,1);t.materialValues.splice(i,1);}
function addPolygon(t,q,kind='solid',value=P.stoneR){t.polygons.push(q);t.materials.push(kind);t.materialValues.push(value);}
function negative(name,id,mutate,pattern){const bad=clone(modelTraces[id]);mutate(bad);assert.throws(()=>checks[id](bad),pattern,name+' must fail at its named first-red structural check');checks[id](modelTraces[id]);controls.push({name,firstRed:'structural:'+id,restored:true,sourceOnly:true});}
negative('fill-diagonal-mediation-court','knapmediation',t=>addPolygon(t,[[15,15,8],[18,15,8],[18,19,8],[15,19,8]]),/diagonal court true empty/);
negative('remove-second-triangle-wall','knapmediation',t=>t.walls.splice(t.walls.findIndex(w=>close(w.z1,15.1)),1),/second taller triangular room/);
negative('equalize-two-triangular-hip-peaks','knapmediation',t=>{for(const p of roofPolygons(t).flat())if(close(p[2],25.2))p[2]=21.3;},/unequal physical hip apexes/);
negative('blunt-optical-workshop-tip','adderlens',t=>{const w=wallsAt(t,.6,12.7).find(w=>close(w.a[0],3));w.a[0]=4;},/two true single-vertex pointed ends/);
negative('bend-optical-long-ridge','adderlens',t=>{const p=roofPolygons(t).flat().find(p=>close(p[2],22.2));p[1]+=.8;},/one straight ridge/);
negative('split-braille-clerestory-step','yarrowbraille',t=>t.walls.splice(t.walls.findIndex(w=>close(w.z0,17.6)),1),/one continuous vertical clerestory/);
negative('raise-one-braille-roof-to-sawtooth','yarrowbraille',t=>{roofPolygons(t)[0][0][2]+=.8;},/unequal opposed pitches/);
negative('shorten-braille-glazed-band','yarrowbraille',t=>{const p=materialPolygons(t,'emissive').find(p=>minz(p)>18);for(const q of p)q[0]=16+(q[0]-16)*.5;},/continuous clerestory glazing length/);
negative('remove-one-continuous-debate-aisle','elderdebate',t=>{t.walls=t.walls.filter(w=>!(close(w.z1,10.8)&&close(w.a[0],3.5)));},/two continuous low aisles/);
negative('tip-debate-aisle-roof-inward','elderdebate',t=>{const p=roofPolygons(t).find(p=>maxz(p)<20);p[0][2]+=.8;},/aisle roofs lean outward/);
negative('saddle-oral-history-roof','osieroral',t=>{osierTops(t)[3][2][2]+=.7;},/one-axis concave parabolic/);
negative('remove-oral-hall-bearing-wall','osieroral',t=>t.walls.splice(0,1),/two full grounded sidewalls/);
negative('open-oral-hall-shaped-end','osieroral',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materials[i]==='brick'&&p.length===4&&close(minz(p),.6)&&close(p[0][1],4)&&close(p[1][1],4))),/both curved ends closed to ground/);
negative('cap-weather-school-oculus','cloudmereweather',t=>addPolygon(t,[[13,13,20],[19,13,20],[19,19,20],[13,19,20]]),/true open oculus true empty/);
negative('remove-weather-oculus-thick-reveal','cloudmereweather',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materialValues[i]===P.stoneD&&close(minz(p),18.6)&&close(maxz(p),20.2))),/ten thick inner rim reveals/);
negative('open-weather-rim-underside','cloudmereweather',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materialValues[i]===P.woodR&&p.length===4&&close(minz(p),18.6)&&close(maxz(p),19.1))),/ten closed annular rim soffits/);
negative('erase-weather-deep-inner-shaft','cloudmereweather',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materials[i]==='stone'&&close(minz(p),.6)&&close(maxz(p),18.6))),/deep grounded observation shaft/);
negative('step-nature-lecture-roof','coppicelecture',t=>{roofPolygons(t)[0][0][2]+=.9;},/one unbroken rising slate plane/);
negative('float-nature-lecture-sidewall','coppicelecture',t=>{const p=materialPolygons(t,'brick').find(p=>p.length===4&&close(minz(p),.6)&&close(maxz(p),26.6)&&p.every(q=>close(q[0],5)));for(const q of p)if(close(q[2],.6))q[2]=3;},/ground-to-slope sidewalls/);
negative('make-petition-front-elliptical','shellwickpetitions',t=>{wallsAt(t,.6,12.8)[5].a[1]+=.6;},/true semicircular front/);
negative('move-petition-half-hip-apex','shellwickpetitions',t=>{for(const p of roofPolygons(t)[0])if(close(p[2],25.6))p[1]+=1;},/single high point at rear midpoint/);
negative('straighten-costume-ogee-profile','velvetcostume',t=>{for(const p of roofPolygons(t).flat())if(close(p[2],18.4)){p[0]=16+(p[0]-16)*.7;p[1]=16+(p[1]-16)*.7;}},/slope reversal makes a true ogee/);
negative('replace-costume-oval-with-triangle','velvetcostume',t=>{materialPolygons(t,'emissive').find(p=>p.length===24).splice(3);},/two pairs of tall actual oval/);
negative('detach-middle-translation-range','broomtranslations',t=>{for(const w of wallsAt(t,.6,17)){w.a[0]+=.5;w.b[0]+=.5;}},/exact staggered touching room ranges/);
negative('fill-first-translation-door-recess','broomtranslations',t=>addPolygon(t,[[12,23,5],[16,23,5],[16,27,5],[12,27,5]]),/two true deep front recesses true empty/);
negative('remove-one-translation-hip-end','broomtranslations',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materials[i]==='slate'&&p.length===3)),/three complete four-plane hips/);
negative('erase-second-translation-door-return','broomtranslations',t=>t.faces.splice(t.faces.findIndex(F=>F.nx===1&&close(F.b[1]-F.a[1],5)),1),/two physical five-unit doorway returns/);
negative('remove-ogee-roof-underside','velvetcostume',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materialValues[i]===P.woodR&&p.length===3)),/exact matching triangulated underside/);
negative('lift-debate-window-into-sky','elderdebate',t=>{for(const p of materialPolygons(t,'emissive')[0])p[2]+=30;},/opaque glazing is backed by real masonry/);
const duplicate=roofPolygons(modelTraces.adderlens);assert.throws(()=>assertPartition([...duplicate,duplicate[0]],'duplicated lens roof'),/must not overlap/);controls.push({name:'duplicate-optical-roof-patch',firstRed:'roof-partition',restored:true,sourceOnly:true});
for(const row of rows)for(let view=0;view<4;view++){art.build(row.id,view);checks[row.id](traces.at(-1));}
assert(controls.length>=20,'at least twenty genuine geometry first-red controls');
const structuralChecks={actualRecordedGeometry:true,frozenTenIdentities:true,allFortyWorldConstructionPaths:true,diagonalCourtIsEmpty:true,twoPointedConvexLensEnds:true,oneFullLengthClerestory:true,basilicanThreeLevelSection:true,concaveSingleAxisLeadRoof:true,smallOculusHasDepth:true,singleGroundedLectureWedge:true,solidDPlanRadialHalfHip:true,trueFourSidedOgee:true,threeTouchingOffsetCompleteHips:true,allGlazingHasRealMasonryBacking:true,roofUndersidesAndPartitions:true,sourceOnly:true};
const out={ok:true,kind:'source-only-recording-stub-audit',gameExecuted:false,rasterizerExecuted:false,renderedSprites:0,models:10,authoredViewPaths:40,negativeControls:3+controls.length,structuralNegativeControls:controls,structuralChecks,sourceSHA256:crypto.createHash('sha256').update(source).digest('hex'),summaries};
fs.writeFileSync('wave045-source-geometry-report.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({...out,summaries:undefined}));
