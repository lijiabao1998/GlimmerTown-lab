'use strict';
// Source-only structural audit. This does not load the game, canvas, kit rasterizer
// or browser. Recording stubs can catch bad coordinates and incomplete builders;
// they cannot establish rendered pixels, projection, crop, lighting or acceptance.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const frozenRows=[
  {
    "id": "lindenmaps",
    "nm": "椴木地圖修護館",
    "en": "Lindenwick Map Conservation House",
    "v": 760,
    "shape": "square-stone-hall-four-arched-heads-true-intersecting-groin-vault-roof",
    "design": "矮方形厚石牆修護館、兩個垂直相交的淺桶拱構成真交叉拱頂、四面半圓高窗、可見對角屋面交線與角墩；沒有塔或附加院落",
    "distinctionFromPublished150": "Beckstone只有單一縱向淺桶拱與扶壁，Dewbank為四個平行桶拱；本款四面拱頭與雙方向交叉屋面必須真實成立，不能在單桶拱貼十字線",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "wrenumbrella",
    "nm": "鷦鷯修傘工房",
    "en": "Wrenfold Umbrella Works",
    "v": 764,
    "shape": "enclosed-tapering-brick-hall-single-conoid-slate-roof-high-arched-front-low-straight-rear",
    "design": "封閉漸寬磚工房、單一連續板岩曲頂由後方低直簷升至前方高半圓拱頭、可見縱向木肋與實牆承托、前大扇形工作窗及側低橫窗；高前採光端服務修傘工作區",
    "distinctionFromPublished150": "Sedge是單片陡平玻璃頂加低橢圓接待室，Gorse是真開放梯形折棚，Pennyfen是兩端曲倒船殼；本款只有一個高拱端和一個低直端，連續變截面封閉屋面",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "meadowsweetherb",
    "nm": "繡線菊植物標本館",
    "en": "Meadowsweet Herbarium",
    "v": 768,
    "shape": "continuous-quatrefoil-brick-lodge-four-half-dome-lobes-low-square-roof-lantern",
    "design": "連續四葉形低磚館、四個半圓外凸葉瓣而非分離小亭、四片半穹板岩屋面接低方形頂燈、葉瓣三聯拱窗與葉間凹入口；中央為實室而非開院",
    "distinctionFromPublished150": "Thistle為中央高八角尖頂加兩個不等半圓翼，Fern為雙分離六角玻璃亭；本款四葉等級的連續低輪廓、低方燈與凹接縫，不能化成中央八角加附房",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "sorrelglove",
    "nm": "酸模製手套館",
    "en": "Sorrelwick Glovers’ Hall",
    "v": 772,
    "shape": "closed-bow-tie-plan-two-flared-polygonal-workrooms-low-solid-waist-twin-hip-roofs",
    "design": "封閉領結形量體、兩端寬多邊裁剪及整理工房、中間窄矮實接待腰部、兩個向外展開低四坡頂、端面寬三聯窗與腰部窄玻璃；沒有院落或亭間缺口",
    "distinctionFromPublished150": "Rowden為兩方亭加凹中央入口，Celandine為兩鼓樓及玻璃直橋；本款牆身真向中央收腰、兩端同軸外張，不能只用兩個普通方盒換名",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "tamargauge",
    "nm": "塔瑪水位量測屋",
    "en": "Tamar Water-Gauge House",
    "v": 776,
    "shape": "shallow-concave-waisted-stone-gauge-tower-six-continuous-grounded-ribs-modest-upper-collar",
    "design": "淺內收腰石造量測塔、六條從加寬基腳連續承托至上圈的可見石肋、小幅外挑上觀測圈及單層淺板岩帽、腰部錯層窄窗與上圈環列窗；不能細腰懸托巨大頭部",
    "distinctionFromPublished150": "Briar為直收分六角木瞭望樓與外階雙帽，Heather為向上外張雙方樓；本款單塔中段先收後放且有連續承重肋，無外階、帆葉或雙帽；不新增水務模擬",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "rookspiano",
    "nm": "鴉井鋼琴工房",
    "en": "Rookswell Piano Workshop",
    "v": 780,
    "shape": "solid-asymmetric-kidney-plan-workshop-curved-hip-apron-offset-raised-sound-room",
    "design": "不對稱實心腎形低工房、前緣深凹入口咬口而非開院、連續低曲四坡簷及偏置長方高音室、弧面寬工作窗與高音室細縫窗；兩端寬窄與曲率不同",
    "distinctionFromPublished150": "Ash是開放月牙及偏置犬舍，Withe是連續長S形，Honey是四分圓扇店；本款寬實心腎形、只有一處凹口、沒有兩條S翼或中央庭院",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "hartcurrier",
    "nm": "鹿谷皮革整飾樓",
    "en": "Hartcombe Currier’s Loft",
    "v": 784,
    "shape": "broad-upper-workroom-over-single-perpendicular-masonry-spine-two-open-side-undercrofts-braced-jetties",
    "design": "寬矩形上工房跨在一條垂直方向落地厚磚脊上、兩側真開放底廊、清楚由脊牆接上樓的木斜托架、淺橫向山牆頂、上層長木格窗及下脊門；不是漂浮盒體",
    "distinctionFromPublished150": "Hawthorn為兩端磚錨房托跨院橋，Faversham為柱列托會堂；本款只有一條完整垂直實脊及兩側底廊，跨度與受力由真托架表達，無雙錨穿院或柱市場",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "sainwax",
    "nm": "紅豆草製蠟屋",
    "en": "Sainfoin Wax House",
    "v": 788,
    "shape": "single-pentagonal-three-tier-setback-workhouse-pentagonal-slate-ledges-truncated-cap",
    "design": "單體五邊三級退縮工屋、每層真五面實牆、寬五邊板岩層簷與頂部截尖低帽、深窄工作窗和斜面地層門；五邊輪廓與退台不能由方盒加貼片假造",
    "distinctionFromPublished150": "Brass為單高方鑄造室配雙四坡頂，Norfolk為直角階梯住宅翼，Sissinghurst為多座烘房；本款單一五邊實體逐層退縮，沒有方塔群、住宅階梯翼或環形院",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "brackenlast",
    "nm": "蕨橋鞋楦工房",
    "en": "Brackenbridge Lastmakers’ House",
    "v": 792,
    "shape": "octagonal-ashlar-ground-shop-rectangular-jettied-timber-upper-room-four-corbel-brackets-steep-gable",
    "design": "寬八角石造底店、上方真正長方且明顯挑出的半木工房、四組落在石牆上的木托架、單陡橫山牆、上大方木格窗與下各斜面小窗；上下平面輪廓清楚不同",
    "distinctionFromPublished150": "Arnos為方矮底座上高圓鼓，Briar為通高六角木塔，Bessie為成對高懸挑街屋；本款是八角底店轉長方上工作房的低兩層異形交接，非圓鼓換色或整棟多角屋",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  },
  {
    "id": "harecase",
    "nm": "兔林樂器箱工房",
    "en": "Harewood Instrument-Case Works",
    "v": 796,
    "shape": "separated-perpendicular-unequal-gabled-workshops-low-bowed-glazed-corner-link-open-exterior-wedge",
    "design": "長低裁切房與短高組裝房兩座磚山牆工房互成直角且真正分離、只在相對角以低弧玻璃廊連接、外側保留真開楔形空地；長屋大方卸料門、高屋成對圓拱工作窗、廊細直窗梃",
    "distinctionFromPublished150": "Wold為同向錯位高四坡低平頂磚樓配寬實連接，Fen為高雙折庫與低單坡棚且不相連，Fern為玻璃六角亭；本款直角不同高度山牆加低彎廊，不能退化成平行雙盒或院落環",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English craft and specialist-service design using the unchanged in-repository art634 kit; no external image or real-landmark claim.",
    "note": "原創英式展示外觀，沿用原生2×2地標規則。"
  }
];
const scope={rows:frozenRows};
if(fs.existsSync('wave044-original-scope.json'))assert.deepEqual(JSON.parse(fs.readFileSync('wave044-original-scope.json','utf8')).rows,frozenRows);
const source=fs.readFileSync('british-wave16-art044.js','utf8');
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
const sandbox={BritishUseScalesKit021:{create:kit},__wave044GeometryOnly:true};
vm.runInNewContext(source,sandbox,{filename:'british-wave16-art044.js'});
const art=sandbox.BritishWaveArchitecture044,rows=JSON.parse(JSON.stringify(art.rows));
assert.deepEqual(rows,scope.rows);assert.equal(art.candidateRows().length,10);
assert.equal(new Set(rows.map(r=>r.id)).size,10);assert.equal(new Set(rows.map(r=>r.shape)).size,10);
rows.forEach((r,i)=>{assert.equal(r.v,760+i*4);assert.equal(r.evidenceStatus,'original-code-native-design');assert(!r.url);});
const summaries=[],modelTraces={};
for(const row of rows)for(let view=0;view<4;view++){
  const s=art.build(row.id,view),t=traces.at(-1),pts=t.polygons.flat();
  if(view===0)modelTraces[row.id]=t;
  assert.equal(s.id,row.id);assert.equal(s.view,view);assert(s.details.originalDesign);
  assert.equal(s.__britishWave044,1);assert(t.polygons.length>35);assert(t.pairedMaterials>5,'authored paired glazing required');
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
function assertLinden(t){
  const tops=roofPolygons(t);assert.equal(tops.length,512,'Linden crossed barrels tessellate both axes');
  for(const p of tops.flat()){const u=Math.abs((p[0]-16)/11),v=Math.abs((p[1]-16)/11),expected=13.8+8.2*Math.max(Math.sqrt(Math.max(0,1-u*u)),Math.sqrt(Math.max(0,1-v*v)));assert(close(p[2],expected),'Linden genuine perpendicular barrel envelope');}
  for(const p of[[16,5,22],[27,16,22],[16,27,22],[5,16,22],[5,5,13.8]])assert(tops.flat().some(q=>q.every((x,i)=>close(x,p[i]))),'Linden four arched heads and low groin corners');
  assertPartition(tops,'Linden');assertMeshClosed(t,tops,.4,'Linden');
}
function assertWren(t){
  const tops=roofPolygons(t);assert.equal(tops.length,384,'Wren continuous conoid cells');
  for(const p of tops.flat()){const t=(p[1]-4.3)/23.4,u=(p[0]-16)/(5.4+5.6*t);assert(close((p[2]-13.4)**2,(11*t)**2*Math.max(0,1-u*u)),'Wren continuously changing conoid section');}
  const rear=tops.flat().filter(p=>close(p[1],4.3)),front=tops.flat().filter(p=>close(p[1],27.7));
  assert(rear.every(p=>close(p[2],13.4)),'Wren straight low rear');assert(close(Math.max(...front.map(p=>p[2]))-Math.min(...front.map(p=>p[2])),11),'Wren high semicircular front radius equals half-width');
  assertPartition(tops,'Wren');assertMeshClosed(t,tops,.4,'Wren');
}
function assertMeadowsweet(t){
  const walls=wallsAt(t,.6,10.8);assert.equal(walls.length,48,'Meadowsweet continuous four half-disc perimeter');
  const tops=roofPolygons(t).filter(p=>maxz(p)<19);assertPartition(tops,'Meadowsweet low domes');assertUndersides(t,tops,.4,'Meadowsweet');
  for(const p of[[28.2,16],[16,28.2],[3.8,16],[16,3.8]])assert(walls.some(w=>[w.a,w.b].some(q=>q.every((x,i)=>close(x,p[i])))),'Meadowsweet has four true semicircular lobes');
  assertSolid(t,[[16,16],[12,16],[20,16],[16,12],[16,20]],10,'Meadowsweet central room');
  assertOpen(t,[[6,6],[26,26],[6,26],[26,6]],'Meadowsweet reentrant outer corners');
}
function assertSorrel(t){
  const wings=wallsAt(t,.6,14.1),waist=wallsAt(t,.6,9.7);assert.equal(wings.length,8,'Sorrel two genuinely flared quadrilateral wings');assert.equal(waist.length,4,'Sorrel low solid waist');
  assert(wings.filter(w=>Math.abs(w.a[0]-w.b[0])>8&&Math.abs(w.a[1]-w.b[1])>5).length===4,'Sorrel four inward-converging side walls');
  assertSolid(t,[[7,16],[16,16],[25,16]],9,'Sorrel closed bow-tie');assertOpen(t,[[16,8],[16,24]],'Sorrel narrowed external waist');
  assertPartition(roofPolygons(t).filter(p=>minz(p)>14),'Sorrel two hipped wings');
}
function assertTamar(t){
  const body=t.polygons.filter((p,i)=>t.materials[i]==='stone'&&p.length===4&&minz(p)>=.6-1e-9&&maxz(p)<=32.1+1e-9&&maxz(p)-minz(p)>3);
  for(const [z,r]of[[.6,8.4],[4.1,8],[13.1,7.15],[23.1,7.05],[32.1,7.75]]){
    const points=body.flat().filter(p=>close(p[2],z));assert(points.length>=12,'Tamar complete profile station');assert(points.every(p=>close(Math.hypot(p[0]-16,p[1]-16),r)),'Tamar shallow concave waist profile');
  }
  const ribs=t.beams.filter((b,i)=>t.beamMaterials[i]===P.stoneHi&&close(b[2],.9));assert.equal(ribs.length,24,'Tamar exactly six continuous four-segment ribs');
  for(let i=0;i<6;i++){
    const angle=Math.PI/12+i*Math.PI/3,chain=ribs.filter(b=>Math.abs(Math.sin(Math.atan2(b[0][1]-16,b[0][0]-16)-angle))<1e-8&&((b[0][0]-16)*Math.cos(angle)+(b[0][1]-16)*Math.sin(angle))>0).sort((a,b)=>a[0][2]-b[0][2]);
    assert.equal(chain.length,4,'Tamar each rib follows the entire waist');assert(close(chain[0][0][2],.6)&&close(chain[3][1][2],32.1),'Tamar rib foot and collar anchorage');
    for(let j=0;j<3;j++)assert(chain[j][1].every((v,k)=>close(v,chain[j+1][0][k])),'Tamar rib chain cannot float');
  }
  const ring=wallsAt(t,32.1,39.4);assert.equal(ring.length,12,'Tamar modest observation ring');assert(ring.flatMap(w=>[w.a,w.b]).every(p=>close(Math.hypot(p[0]-16,p[1]-16),8.3)),'Tamar collar must not balloon');
  const collarUnder=39.1+(43.3-39.5)*.4/(8.7-2.7);assert(ring.every(w=>w.z1>=collarUnder),'Tamar collar meets actual roof underside');
  assertPartition(roofPolygons(t),'Tamar single cap');assertUndersides(t,roofPolygons(t),.4,'Tamar');
}
function assertRooks(t){
  const walls=wallsAt(t,.6,11.2);assert.equal(walls.length,24,'Rooks continuous sampled kidney perimeter');
  const q=walls.map(w=>w.a);assert(q.some((p,i)=>cross(p,q[(i+1)%q.length],q[(i+2)%q.length])<-.5),'Rooks genuine concave entrance bite');
  assertSolid(t,[[16,13],[9,17],[24,17]],11,'Rooks broad solid kidney');assertOpen(t,[[16,24],[16,26]],'Rooks entrance bite is not falsely capped');
  assertPartition(roofPolygons(t).filter(p=>maxz(p)<=15.2+1e-8),'Rooks triangulated concave curved roof');
  const sound=wallsAt(t,11.2,23.4);assert.equal(sound.length,4,'Rooks offset rectangular sound room');assert(sound.every(w=>w.a[0]>18&&w.b[0]>18),'Rooks genuinely offset sound room');
}
function assertHart(t){
  const spine=wallsAt(t,.6,14.1),upper=wallsAt(t,14.1,28.3);assert.equal(spine.length,4,'Hart single grounded spine');assert.equal(upper.length,4,'Hart one broad upper room');
  assert(spine.every(w=>w.a[0]>=13&&w.a[0]<=19&&w.b[0]>=13&&w.b[0]<=19),'Hart narrow perpendicular spine bounds');
  const braces=t.beams.filter(b=>close(b[0][2],7.5)&&close(b[1][2],14.1));assert.equal(braces.length,4,'Hart four structural knee braces');
  for(const b of braces)assert((close(b[0][0],13)||close(b[0][0],19))&&(close(b[1][0],5)||close(b[1][0],27))&&close(b[0][1],b[1][1]),'Hart braces anchor from the spine to upper floor');
  for(const p of[[7,16],[25,16]]){const heights=heightsAt(t,...p);assert(heights.some(z=>close(z,14.1)),'Hart closed upper underside');assert(heights.every(z=>z>=13.9||z<=.61),'Hart two genuine open low side aisles');}
  assertPartition(roofPolygons(t),'Hart');assertMeshClosed(t,roofPolygons(t),.4,'Hart');
}
function assertSainfoin(t){
  for(const [r,z0,z1]of[[13,.6,11.2],[9.8,12.7,22.1],[6.8,23.6,31.7]]){
    const walls=wallsAt(t,z0,z1);assert.equal(walls.length,5,'Sainfoin tier must have exactly five real wall planes');
    const vertices=new Set(walls.flatMap(w=>[key(w.a),key(w.b)]));assert.equal(vertices.size,5,'Sainfoin five shared corners');
    for(const w of walls)assert([w.a,w.b].every(p=>close(Math.hypot(p[0]-16,p[1]-16),r)),'Sainfoin nested pentagonal tier radius');
  }
  for(const [r,z1,outerZ,nextR,nextZ]of[[13,11.2,11.6,9.8,12.7],[9.8,22.1,22.5,6.8,23.6],[6.8,31.7,32.1,2.6,36]]){
    const underside=z1+(nextZ-outerZ)*.55/(r+.55-nextR);assert.equal(wallsAt(t,z1,underside).length,5,'Sainfoin five closed roof-under perimeter bands');
  }
  for(const [lo,hi]of[[11.6,12.7],[22.5,23.6],[32.1,36]])assertPartition(roofPolygons(t).filter(p=>minz(p)>=lo-1e-7&&maxz(p)<=hi+1e-7),'Sainfoin pentagonal tier roof');
  assertUndersides(t,roofPolygons(t),.4,'Sainfoin');
}
function assertBracken(t){
  assert.equal(wallsAt(t,.6,12.7).length,8,'Bracken eight real ground-storey walls');const upper=wallsAt(t,13.4,25.6);assert.equal(upper.length,4,'Bracken upper workshop truly rectangular');
  const braces=t.beams.filter(b=>close(b[0][2],7.5)&&close(b[1][2],13.4));assert.equal(braces.length,4,'Bracken four actual corbel groups');
  for(const b of braces)assert((close(b[0][0],5)&&close(b[1][0],2.9)||close(b[0][0],27)&&close(b[1][0],29.1))&&[11.2,20.8].some(y=>close(y,b[0][1]))&&close(b[0][1],b[1][1]),'Bracken corbels must connect octagon to rectangular floor');
  assert(heightsAt(t,3.5,16).some(z=>close(z,12.7)),'Bracken overhanging floor has real underside');
  const floorSides=t.polygons.filter(p=>p.length===4&&close(minz(p),12.7)&&close(maxz(p),13.4));assert.equal(floorSides.length,4,'Bracken solid floor layer closes stone-to-timber gap');
  assertPartition(roofPolygons(t),'Bracken');assertMeshClosed(t,roofPolygons(t),.4,'Bracken');
}
function assertHare(t){
  const low=wallsAt(t,.6,12.2),high=wallsAt(t,.6,20.5);assert.equal(low.length,4,'Hare distinct low block');assert.equal(high.length,4,'Hare distinct high block');
  const bounds=walls=>[0,1].map(k=>[Math.min(...walls.flatMap(w=>[w.a[k],w.b[k]])),Math.max(...walls.flatMap(w=>[w.a[k],w.b[k]]))]);
  const L=bounds(low),H=bounds(high);assert(L[0][1]-L[0][0]>2*(L[1][1]-L[1][0])&&H[1][1]-H[1][0]>H[0][1]-H[0][0],'Hare unequal perpendicular long axes');assert(L[0][1]<H[0][0]&&L[1][1]<H[1][0],'Hare truly separated main blocks');
  const link=wallsAt(t,.6,2);assert.equal(link.length,28,'Hare actual bowed passage perimeter');
  assert([link[0].b,link[1].a].every(p=>p[0]>3.7&&p[0]<21.7&&p[1]<12&&p[1]>4.5),'Hare entire low-end section embedded in host');
  assert([link[26].a,link[27].b].every(p=>p[0]>22&&p[0]<29.1&&p[1]>18&&p[1]<29),'Hare entire high-end section embedded in host');
  const glazing=t.polygons.filter((p,i)=>t.materials[i]==='emissive'&&close(minz(p),2.5)&&close(maxz(p),6.6));assert.equal(glazing.length,28,'Hare physical passage glazing bays');
  for(let i=0;i<28;i++){const q=glazing[i],w=link[i];assert((q[1][0]-q[0][0])*(w.b[0]-w.a[0])+(q[1][1]-q[0][1])*(w.b[1]-w.a[1])>0,'Hare narrow-bay glazing must not invert');}
  const p=link.flatMap(w=>[w.a,w.b]);assert(Math.min(...p.map(v=>v[0]))<17,'Hare link visibly bows away from straight corner chord');
  assertSolid(t,[[17.85,18.3],[20.8,21]],5,'Hare continuous low link');assertOpen(t,[[25,15],[28,15],[23,14]],'Hare exterior wedge');
  assertPartition(roofPolygons(t),'Hare separated main roofs');
}
const checks={lindenmaps:assertLinden,wrenumbrella:assertWren,meadowsweetherb:assertMeadowsweet,sorrelglove:assertSorrel,tamargauge:assertTamar,rookspiano:assertRooks,hartcurrier:assertHart,sainwax:assertSainfoin,brackenlast:assertBracken,harecase:assertHare};
for(const [id,check]of Object.entries(checks))check(modelTraces[id]);
// All four callers supply identical world geometry to the unchanged native kit;
// the kit, not arbitrary screen transforms or repainted variants, owns rotation.
for(const row of rows)assert.equal(new Set(summaries.filter(s=>s.id===row.id).map(s=>s.geometrySHA256)).size,1,'view-independent world construction');
const clone=t=>JSON.parse(JSON.stringify(t)),controls=[];
function negative(name,id,mutate,pattern){const bad=clone(modelTraces[id]);mutate(bad);assert.throws(()=>checks[id](bad),pattern,name+' must fail at its target structural guard');checks[id](modelTraces[id]);controls.push({name,firstRed:'structural:'+id,restored:true,sourceOnly:true});}
function removePolygon(t,i){t.polygons.splice(i,1);t.materials.splice(i,1);t.materialValues.splice(i,1);}
negative('flatten-one-cross-vault-head','lindenmaps',t=>{for(const p of t.polygons)for(const q of p)if(close(q[0],16)&&close(q[1],5))q[2]-=2;},/perpendicular barrel/);
negative('remove-cross-vault-underside','lindenmaps',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materialValues[i]===P.woodR&&p.length===3)),/matching triangulated underside/);
negative('flatten-conoid-front','wrenumbrella',t=>{for(const p of t.polygons)for(const q of p)if(close(q[1],27.7)&&q[2]>13.4)q[2]=13.4;},/changing conoid/);
negative('cut-one-herbarium-lobe-wall','meadowsweetherb',t=>t.walls.splice(t.walls.findIndex(w=>close(w.z0,.6)&&close(w.z1,10.8)),1),/four half-disc perimeter/);
negative('open-glovers-solid-waist','sorrelglove',t=>{t.walls=t.walls.filter(w=>!close(w.z1,9.7));},/low solid waist/);
negative('break-one-continuous-stone-rib','tamargauge',t=>{const i=t.beams.findIndex(b=>close(b[2],.9));t.beams.splice(i,1);t.beamMaterials.splice(i,1);},/six continuous/);
negative('balloon-gauge-collar','tamargauge',t=>{for(const w of t.walls)if(close(w.z0,32.1))for(const p of[w.a,w.b]){p[0]=16+(p[0]-16)*1.5;p[1]=16+(p[1]-16)*1.5;}},/collar must not balloon/);
negative('fan-fill-kidney-entrance','rookspiano',t=>{t.polygons.push([[14,22,11],[18,22,11],[18,26,11],[14,26,11]]);t.materials.push('solid');t.materialValues.push(P.stoneR);},/true empty vertical opening/);
negative('float-currier-brace-off-spine','hartcurrier',t=>{const b=t.beams.find(b=>close(b[0][2],7.5)&&close(b[1][2],14.1));b[0][0]-=2;},/anchor from the spine/);
negative('delete-fifth-wax-house-plane','sainwax',t=>t.walls.splice(t.walls.findIndex(w=>close(w.z0,12.7)),1),/exactly five real wall planes/);
negative('detach-lastmakers-corbel','brackenlast',t=>{const b=t.beams.find(b=>close(b[0][2],7.5)&&close(b[1][2],13.4));b[1][0]=16;},/connect octagon/);
negative('remove-wax-roof-closure-band','sainwax',t=>{const i=t.walls.findIndex(w=>close(w.z0,11.2));t.walls.splice(i,1);},/five closed roof-under/);
negative('remove-lastmakers-floor-fascia','brackenlast',t=>removePolygon(t,t.polygons.findIndex(p=>p.length===4&&close(minz(p),12.7)&&close(maxz(p),13.4))),/solid floor layer/);
negative('unembed-passage-high-end','harecase',t=>{const link=wallsAt(t,.6,2);link[26].a[0]=21.5;},/entire high-end section/);
negative('invert-narrow-passage-pane','harecase',t=>{const q=t.polygons.find((p,i)=>t.materials[i]==='emissive'&&close(minz(p),2.5)&&close(maxz(p),6.6));const a=q[0];q[0]=q[1];q[1]=a;},/narrow-bay glazing/);
negative('fill-instrument-case-wedge','harecase',t=>{t.polygons.push([[22,13,5],[29,13,5],[29,17,5],[22,17,5]]);},/true empty vertical opening/);
const duplicate=roofPolygons(modelTraces.wrenumbrella);assert.throws(()=>assertPartition([...duplicate,duplicate[0]],'duplicate roof mutation'),/must not overlap/);controls.push({name:'duplicate-roof-geometry',firstRed:'roof-partition',restored:true,sourceOnly:true});
for(const [id,check]of Object.entries(checks))check(modelTraces[id]);
const structuralChecks={actualRecordedGeometry:true,allTenFrozenIdentities:true,fourWorldViewPaths:true,crossedBarrelHeads:true,closedConoid:true,continuousQuatrefoil:true,solidBowTieWaist:true,sixGroundedGaugeRibs:true,solidConcaveKidney:true,groundedLoftSpineAndBraces:true,fiveRealPlanesPerWaxTier:true,octagonToRectangleWithCorbels:true,separatedPerpendicularBlocksAndBowedLink:true,sourceOnly:true};
const out={ok:true,kind:'source-only-recording-stub-audit',gameExecuted:false,rasterizerExecuted:false,renderedSprites:0,models:10,authoredViewPaths:40,negativeControls:3+controls.length,structuralNegativeControls:controls,structuralChecks,sourceSHA256:crypto.createHash('sha256').update(source).digest('hex'),summaries};
fs.writeFileSync('wave044-source-geometry-report.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({...out,summaries:undefined}));
