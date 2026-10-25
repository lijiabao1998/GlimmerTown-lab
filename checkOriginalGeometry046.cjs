'use strict';
// Pure source recording only. No Scene, canvas, browser or game is loaded.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
// Independent immutable identity/specification copy from the first-card freeze.
const frozenRows=[
  {
    "id": "merememorial",
    "nm": "澤花追思館",
    "en": "Merebloom Memorial Hall",
    "v": 840,
    "shape": "single-aisleless-stone-memorial-nave-twin-open-front-bellcote-narrow-five-sided-apse-low-side-vestry",
    "design": "one aisleless, long stone hall with a steep slate gable; a substantially narrower five-sided rear apse; one low rectangular side vestry/records room under an outward lean-to. A thin but physically thick stone bellcote rises from the front gable, with two genuinely open round-headed apertures and a short shared saddle cap. No tower body or long side aisles. a recessed pointed front double door below a three-light lancet; paired narrow pointed side windows between low stepped buttresses; smaller square vestry lights. Apse windows follow its actual angled faces. the nave dominates the footprint; the apse is about half its width and clearly lower; the bellcote adds a narrow vertical accent rather than becoming a clock tower. Suggested total height around 34–38 world units, within the existing sprite envelope.",
    "distinctionFromPublished170": "Rookwood Lantern Hall, wave11, `rookhall`, v568: broad transverse clipped-gable T, clerestory and half-round apse; Elderwick Debating Hall, wave17, `elderdebate`, v812: high centre with two full-length low aisles; Hospital of St Cross, wave08, `stcross`, v448: compound cruciform church and tower. Reject if: it becomes Elderdebate with a decorative bell, copies Rookhall's T plan, hides a filled bellcote behind dark paint, or relies on crosses/signage to read differently. The narrow polygonal rear extension, single nave, open front bellcote and one-sided low vestry must remain substantive geometry.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "guelderlace",
    "nm": "莢蒾蕾絲學舍",
    "en": "Guelderfield Lace School",
    "v": 844,
    "shape": "parallel-unequal-gabled-brick-ranges-low-diagonal-enclosed-link-two-true-triangular-courts-N-plan",
    "design": "a true N plan made from two parallel, unequal-height long brick classroom ranges joined by a lower, enclosed diagonal classroom/gallery at opposite ends. The remaining two triangular outside courts stay open to the sky. Main ranges have complete, ordinary slate gables; the diagonal link has its own low straight mono-pitch roof, physically meeting both ranges. long sides have broad three-light work windows; end gables have paired upper sashes; two court-facing timber entrances are set in the angled link. No faux gap painted onto a solid rectangle. roughly 7-unit-wide ranges separated by a 10–12-unit clear band; the diagonal enclosed link is wide enough to read as a room, not a wire or screen-space bridge. Its roof stays below both main eaves.",
    "distinctionFromPublished170": "Birchfold Bindery, wave13, `birchbind`, v640: H plan with perpendicular central bridge and barrel roofs; Alderbrook Joinery, wave14, `alderjoinery`, v680: E plan with three gabled fingers and a rear spine; Knapwell Mediation, wave17, `knapmediation`, v800: two solid triangles around one diagonal court. Reject if: the diagonal is straightened into an H crossbar, the side bars collapse into two triangular Knapwell rooms, or the courtyards are filled by a hidden common roof/floor above ground. N topology plus three different actual roof alignments is essential.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "gorsepicture",
    "nm": "金雀溪映畫館",
    "en": "Gorsebrook Picture House",
    "v": 848,
    "shape": "keyhole-plan-narrow-tall-gabled-foyer-wide-low-clipped-octagonal-auditorium-single-shallow-hip",
    "design": "a narrow, taller two-storey brick street foyer joins the centre of a much wider, lower clipped-octagonal auditorium. This produces a clear keyhole plan. The foyer has a steep short gable; the auditorium has one shallow, broad hipped slate roof over its clipped corners, not a dome, sawtooth or tiered lecture wedge. The neck is enclosed and grounded. the foyer has two entrance doors under one shallow stone canopy and a large upper fanlight over three narrow lights; the auditorium has sparse small high side windows and a separate plain rear service door, leaving its broad walls solid. No giant sign substitutes for architecture. auditorium width about 23–25 units; foyer about 9–10; auditorium roof apex below foyer ridge. The broad low rear mass must remain obvious from rear and side views.",
    "distinctionFromPublished170": "Dreamland, wave07, `dreamland`, v404: L compound with very tall blade, glass-block cube and low restaurant wing; Coppicefield Lecture Rooms, wave17, `coppicelecture`, v824: one uninterrupted raked wedge; Rookswell Piano Workshop, wave16, `rookspiano`, v780: kidney plan and raised sound room; Royal Shakespeare Theatre, wave07, `royalshakespeare`, v432: bowed foyer and separate large stage/viewing towers. Reject if: it becomes a simple gabled rectangle with a sign, duplicates the Dreamland fin, or uses an oval/kidney auditorium. The wider clipped-octagon body and narrow front neck must be actual plan geometry.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "comfreyambulance",
    "nm": "聚合草救護車舍",
    "en": "Comfreyford Ambulance House",
    "v": 852,
    "shape": "single-high-wall-barrel-carriage-garage-rear-side-two-storey-hipped-keeper-house-low-recessed-entry",
    "design": "one broad brick carriage garage with high straight side walls and a single full-width curved metal barrel roof. Attach a compact two-storey keeper/dispatch house at one rear side, with its own complete hipped slate roof. The house and garage meet through a low enclosed recessed entry bay, leaving a genuinely open front apron next to the garage. a single extra-wide, round-headed timber double carriage door with a fanlight; high horizontal garage side lights; the keeper house has small vertically paired sashes and a separate ordinary pedestrian door. Do not add an ambulance sprite or medical emblem to carry identity. garage walls about 12–15 units before its 6–8-unit roof rise; keeper house visibly narrower, with a higher domestic eave/ridge. This differs sharply from the near-ground shell in item10.",
    "distinctionFromPublished170": "Foxmere Engine Lodge, wave12, `foxengine`, v612: two parallel gabled engine bays plus a tall open hose frame; Beckstone Valve House, wave14, `beckvalve`, v692: squat single shallow barrel and four stepped buttresses with a low front porch; Cromer Lifeboat Station, wave05, `cromer`, v356: multiple shallow tiered barrels, piles and slipway. Reject if: the keeper house becomes a hose tower, the garage is split into Foxmere's two gables, or the whole structure is simply Beckvalve plus signage. Require the side house, low recessed neck and unequal domestic/garage window scales.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "marjoramkitchen",
    "nm": "馬鬱蘭社區廚房",
    "en": "Marjoram Community Kitchen",
    "v": 856,
    "shape": "low-square-brick-kitchen-closed-four-plane-inverted-pyramid-lead-roof-low-flat-pantry-entry",
    "design": "a low square brick hall with a closed, four-plane inward-draining lead roof: four high eaves slope to one visibly lower central drain point. The roof is a real inverted pyramid, not a bowl, hole, open court, flat slab or longitudinal valley. Add only one low, narrow projecting rectangular pantry/entrance box with a flat lead cap. alternating broad low kitchen windows and two narrow high ventilation windows; a solid wide pantry door and a separate glazed public entrance. Corner brick piers and a real perimeter fascia make support legible. Drainage is static small hardware, not water simulation. the centre roof stays comfortably above occupied floor height; the diagonal roof creases and central low point must survive native scale. Avoid exaggerated sculptural fins or coloured roof quadrants.",
    "distinctionFromPublished170": "Osierbrook Oral History, wave17, `osieroral`, v816: one-axis concave trough constant along length; Willowmere Music, wave11, `willowmusic`, v588: V plan with planar butterfly valleys; Fennelfold Honey, wave15, `fennelhoney`, v732: annular roof around a large true open court; Pondwick Badminton, wave15, `pondbadminton`, v724: saddle with two high and two low corners. Reject if: any central roof opening appears, the geometry reduces to two planar slopes/one trough, or only shading implies the dip. All four eaves must be high and all four planes meet at one lower closed point.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "boragedental",
    "nm": "琉璃苣牙科診所",
    "en": "Borage Dental Rooms",
    "v": 860,
    "shape": "compact-square-two-storey-hipped-core-three-sided-low-wrap-rooms-true-recessed-front-porch",
    "design": "a compact two-storey square consultation house with a complete four-sided hipped roof. A substantially lower C-shaped wrap gallery runs continuously around its front and both sides, turning both corners. Its side wings are enclosed waiting/support rooms; the central front is a genuinely recessed open covered porch with masonry piers. The back of the high house is exposed, not a complete outer ring or court. two paired upper sashes per exposed high face; low side rooms have broad horizontal three-light windows; the front porch contains the real recessed public door, with distinct solid service door at one side end. the high square core is shorter than Elderdebate's long central nave; the low wrap returns across the front, which Elderdebate does not do. Lower roofs sit well below the high eaves and visibly turn both corners.",
    "distinctionFromPublished170": "Elderwick Debating Hall, wave17, `elderdebate`, v812: long high nave and only two parallel full-length low aisles; Brassfield Foundry, wave15, `brassbell`, v740: tall single chamfered hall, two-stage roof and tiny one-sided mould strip; Chiswick House, wave01, `chiswick`, v180: domed villa, portico and exterior stair. Reject if: it becomes a scaled Elderdebate with a changed main roof, Brassbell with its tower cap removed, or a single box with painted lower lines. The C-shaped grounded low rooms, two turned roof corners and actual front porch recess are the defining compound.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "hyssopupholstery",
    "nm": "牛膝草軟墊工房",
    "en": "Hyssop Upholstery Works",
    "v": 864,
    "shape": "grounded-L-two-unequal-perpendicular-gambrel-brick-workranges-open-rectangular-loading-yard",
    "design": "two unequal, perpendicular grounded brick ranges make an L around a clear rectangular loading yard. Both have genuinely double-pitch gambrel roofs, one broad and low and the other narrow and taller. They join only at the rear corner, with a physically resolved lower-to-higher roof junction. No loft bridge, detached shed or projecting oriel. the broad low range has wide segmental-headed work windows and one large double loading door into the yard; the narrow taller wing has tall two-light windows, small attic lights in its gambrel end, and an ordinary side entrance. Main yard door is not elevated behind an unusable stair. neither roof is an incidental small cap. Their perpendicular ridges, two break-of-slope lines and the open right-angled yard must be readable as the main silhouette in four views.",
    "distinctionFromPublished170": "Fenditch Cooperage, wave14, `fencooper`, v704: one very tall narrow timber gambrel store and detached low mono-pitch steam shed separated by a gap; Hawthorn Loom House, wave11, `hawthornloom`, v592: one raised gambrel bridge on two anchors; Bracken Fold Reading House, wave11, `brackenread`, v560: L with unequal ordinary gables, tall oriel and separate porch. Reject if: it is Fencooper with a nominal connecting strip, Brackenread with only roof textures changed, or Hawthorn brought to ground. Both large double-pitch roof masses, the right-angle yard and industrial door/window organisation are mandatory.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "dittanygeology",
    "nm": "白鮮地質會舍",
    "en": "Dittany Geological Society Rooms",
    "v": 868,
    "shape": "single-round-stone-reading-room-centred-cone-opposed-unequal-rectangular-gabled-specimen-wings",
    "design": "one central round stone reading room with a moderately steep centred conical slate roof. Two rectangular sample wings extend in opposite directions along one straight axis, one longer and lower, the other short and higher. Each wing has its own ordinary gable; both are grounded and visibly abut the round wall, rather than forming a low rectangular pedestal under it. The exposed front arc houses the entrance. the rotunda uses four widely spaced round-headed window groups and one deep stone door; the long specimen wing has several small high paired windows; the short wing has one broad mullioned work window and a side loading door. No roof lantern above the cone. use one drum only. The wings are straight and long enough to read as separate bars, not rounded lobes. Do not let an oversized cone consume the entire footprint.",
    "distinctionFromPublished170": "Thistledene Nursery, wave12, `thistlenursery`, v628: octagonal core, raised clerestory and two half-round wings; Celandine Telegraph, wave13, `celandinewire`, v676: two separated unequal drums joined by glazing with disc/eccentric-cone caps; Arnos Grove, wave02, `arnos`, v208: elevated drum on a low square block and oversailing flat disc. Reject if: the wings become apses, the cone becomes a high lantern on an octagon, a second drum appears, or a full rectangular base fills beneath the rotunda. The one round central room plus opposed unequal straight gabled bars is essential.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "chamomilestory",
    "nm": "洋甘菊故事小屋",
    "en": "Chamomile Story Cottage",
    "v": 872,
    "shape": "low-long-stone-cottage-dominant-thick-convex-rounded-hip-thatch-two-real-eyebrow-eave-window-cuts",
    "design": "a low elongated stone cottage beneath one thick, fully rounded hipped thatch roof. Both end hips and the two long roof slopes are genuinely convex curved surfaces with a soft broad ridge, not flat hips, an ogee inflection or a pointed keel. Two eyebrow window openings locally raise and cut the front eave, with real window heads and roof thickness. One short squat stone chimney is offset near the rear, not a tower or second roof body. a central low timber door, two small paired front casements under the eyebrow cuts, and very small end-wall windows. The wall is visibly low beneath the dominant wide roof. long-to-wide footprint around 1.4–1.7, low wall height around 8–10 units, rounded roof rise around 10–12. Eyebrows must alter geometry, not be painted arcs. Reuse existing approved straw/wood palette values; no global material or lighting changes.",
    "distinctionFromPublished170": "Pennyfen Boathouse, wave11, `pennyfen`, v584: tall pointed, concave-sided inverted-keel section, straight vertical ends and stone side stair annex; Asterwick Post House, wave12, `asterpost`, v600: planar bellcast clipped roof, five-sided entrance and extra gabled wing; Globe, wave07, `globe`, v428: three-storey polygonal annular thatch around open courtyard; Velvetcombe, wave17, `velvetcostume`, v832: square four-sided inflected ogee taper. Reject if: only changing slate to straw distinguishes it, the roof remains a flat hip, its cross-section duplicates Pennyfen, or eyebrows are tiny decorative dormers. Convex rounded end hips, thick low eaves and two true roof-head cuts must carry the identity without colour.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "myrtlewireless",
    "nm": "香桃木無線電會舍",
    "en": "Myrtlefield Wireless Club",
    "v": 876,
    "shape": "single-full-semicylindrical-corrugated-shell-low-brick-plinth-closed-round-ends-offset-low-brick-entry",
    "design": "one long full semicylindrical corrugated metal shell whose spring line begins at a low brick plinth, with no normal-height long side walls. Its ends are closed masonry semicircles. A small off-axis rectangular brick vestibule with a flat lead roof attaches to one end, below the shell's midpoint. No tower, second barrel, buttress battery or piles. the semicircular front has a broad rectangular three-light window following below the curved wall head; a smaller circular rear light; the vestibule contains the actual ordinary timber entrance and one narrow side light. Small side rooflights sit flush in the real curved shell, not floating above it. shell spring line at about 1.5–2.5 units; radius around 10–11 and length around 23–26. Thus the roof constitutes almost the whole side elevation. This is intentionally distinct from item4's high brick garage walls and hipped keeper house.",
    "distinctionFromPublished170": "Beckstone Valve House, wave14, `beckvalve`, v692: high masonry walls (source eave11.2) under a shallow roof (rise5.1), four buttresses and a centred hipped porch; Cromer, wave05, `cromer`, v356: shallow roof tiers, piles and slipway; Dewbank Wash House, wave12, `dewbankwash`, v620: four narrow low barrels above brick rooms and a rear spine; Pennyfen, wave11, `pennyfen`, v584: tall pointed keel and normal walls. Reject if: it becomes Beckvalve without buttresses, a compressed four-barrel wash house, or item4 without its keeper house. Require the near-ground semicircular spring, absence of tall long walls, single continuous shell and off-axis low entry volume.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village community architecture using unchanged in-repository art634 kit; no external photo or real-landmark claim.",
    "note": "原創英式展示外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  }
];
const scope={rows:frozenRows};
if(fs.existsSync('wave046-original-scope.json'))assert.deepEqual(JSON.parse(fs.readFileSync('wave046-original-scope.json','utf8')).rows,frozenRows);
const source=fs.readFileSync('british-wave18-art046.js','utf8');
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
    const sample=typeof material==='function'?material(points[0][0],points[0][1],points[0][2]):material;
    assert((Array.isArray(sample)?sample:[sample]).every(c=>Number.isInteger(c)&&c>=0&&c<=0xffffff),'hard opaque native palette values only');
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
const sandbox={BritishUseScalesKit021:{create:kit},__wave046GeometryOnly:true};
vm.runInNewContext(source,sandbox,{filename:'british-wave18-art046.js'});
const art=sandbox.BritishWaveArchitecture046,rows=JSON.parse(JSON.stringify(art.rows));
assert.deepEqual(rows,scope.rows);assert.equal(art.candidateRows().length,10);
assert.equal(new Set(rows.map(r=>r.id)).size,10);assert.equal(new Set(rows.map(r=>r.shape)).size,10);
rows.forEach((r,i)=>{assert.equal(r.v,840+i*4);assert.equal(r.evidenceStatus,'original-code-native-design');assert(!r.url);});
const summaries=[],modelTraces={};
for(const row of rows)for(let view=0;view<4;view++){
  const s=art.build(row.id,view),t=traces.at(-1),pts=t.polygons.flat();
  if(view===0)modelTraces[row.id]=t;
  assert.equal(s.id,row.id);assert.equal(s.view,view);assert(s.details.originalDesign);
  assert.equal(s.__britishWave046,1);assert(t.polygons.length>35);assert(t.pairedMaterials>5,row.id+' authored paired glazing required');
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
assert(!/\b(?:document|SPR|tiles|dispatch|nightPowerRate|trafClock|pw)\b/.test(source.slice(source.indexOf('  function context('))),'pure geometry source isolation');
assert(!/BritishWaveArchitecture(?!046)\d+|\brequire\s*\(|\beval\s*\(/.test(source.slice(source.indexOf('  function context('))),'no prior model dispatch or dynamic source access');
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
  const opaque=t.polygons.filter((p,i)=>t.materials[i]!=='emissive');
  for(const p of materialPolygons(t,'emissive')){
    const wallBack=t.faces.some(F=>{
      const ds=p.map(q=>(q[0]-F.a[0])*F.nx+(q[1]-F.a[1])*F.ny);
      return ds.every(d=>d>.18&&d<.41&&close(d,ds[0]))&&p.every(q=>opaque.some(w=>pointOnPoly([q[0]-F.nx*ds[0],q[1]-F.ny*ds[0],q[2]],w)));
    });
    const roofBack=opaque.some(w=>p.every(q=>{
      const a=w[0],b=w[1],c=w[2],u=b.map((x,i)=>x-a[i]),v=c.map((x,i)=>x-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n);if(len<1e-8)return false;
      const d=q.reduce((s,x,i)=>s+(x-a[i])*n[i]/len,0);return Math.abs(d)<.041&&Math.abs(d)>.02&&opaque.some(back=>pointOnPoly(q.map((x,i)=>x-d*n[i]/len),back));
    }));
    assert(wallBack||roofBack,label+' opaque glazing is backed by an actual wall or flush roof facet');
  }
}
// Frozen structural expectations are explicit world-space constructions below.
// They do not call art helpers, read details flags, or bake answers from the model.
const isPoly=(t,q)=>t.polygons.some(p=>polykey(p)===polykey(q));
const wallQ=(a,b,z0,z1)=>[[...a,z0],[...b,z0],[...b,z1],[...a,z1]];
function requireWall(t,a,b,z0,z1,label){assert(isPoly(t,wallQ(a,b,z0,z1)),label);}
function requireBoxWalls(t,x0,x1,y0,y1,z0,z1,label){for(const [a,b]of[[[x0,y0],[x1,y0]],[[x1,y0],[x1,y1]],[[x1,y1],[x0,y1]],[[x0,y1],[x0,y0]]])requireWall(t,a,b,z0,z1,label);}
function cast(t,axis,u,v){
  const ij=[0,1,2].filter(i=>i!==axis),hits=[];
  for(const p of t.polygons)for(let k=1;k<p.length-1;k++){
    const tri=[p[0],p[k],p[k+1]],q=tri.map(p=>[p[ij[0]],p[ij[1]]]),d=cross(...q);if(Math.abs(d)<1e-9)continue;
    const a=cross([u,v],q[1],q[2])/d,b=cross(q[0],[u,v],q[2])/d,c=1-a-b;
    if(Math.min(a,b,c)>-1e-8)hits.push(tri[0][axis]*a+tri[1][axis]*b+tri[2][axis]*c);
  }return hits;
}
const topsWith=(t,values,min=0)=>t.polygons.filter((p,i)=>values.includes(t.materialValues[i])&&Math.abs(area(p))>1e-8&&minz(p)>=min-1e-8);
const barrelTops=(t,z)=>topsWith(t,[P.lead,P.slateHi],z);
function assertMere(t){
  requireWall(t,[9,8],[9,28],.6,16.8,'Mere single long grounded nave');requireWall(t,[23,28],[23,8],.6,16.8,'Mere single long grounded nave');
  const ap=[[12,8],[12,4.5],[16,2.2],[20,4.5],[20,8]];for(let i=0;i<5;i++)requireWall(t,ap[i],ap[(i+1)%5],.6,11.8,'Mere five-sided narrower lower apse');
  requireBoxWalls(t,23,29,12,20,.6,8.2,'Mere single short side vestry');
  requireBoxWalls(t,12.1,19.9,27.4,28.8,22.1,29.4,'Mere bellcote solid base intersects gable');
  for(const [x0,x1]of[[12.1,13],[15.4,16.6],[19,19.9]])requireBoxWalls(t,x0,x1,27.4,28.8,27.8,34.2,'Mere three physically thick bellcote piers');
  for(const x of[14.2,17.8])for(const z of[30,31.2,32.3])assert(cast(t,1,x,z).every(y=>y<27.4-1e-7||y>28.8+1e-7),'Mere twin real through-open bellcote apertures');
  const intrados=t.polygons.filter((p,i)=>t.materialValues[i]===P.stoneD&&minz(p)>=31.6-1e-8&&maxz(p)<=32.8+1e-8);assert.equal(intrados.length,24,'Mere twenty-four curved thick intrados panels');
  for(const q of intrados){assert(close(Math.max(...q.map(p=>p[1]))-Math.min(...q.map(p=>p[1])),1.4),'Mere full aperture depth');for(const p of q)assert([14.2,17.8].some(x=>close((p[0]-x)**2+(p[2]-31.6)**2,1.44)),'Mere round aperture heads not triangular paint');}
  assert(isPoly(t,[[14,27.35,.6],[18,27.35,.6],[18,27.35,8],[16,27.35,10.4],[14,27.35,8]]),'Mere actually recessed pointed timber door');
  assert(cast(t,1,16,5).every(y=>y<=27.45||y>28.2),'Mere front door is not hidden behind a filled wall');
  assert(hasVertex(roofPolygons(t).flat(),[11.8,28.1,36.6]),'Mere short shared saddle cap');assertUndersides(t,roofPolygons(t),.4,'Mere');assertGlazingBacking(t,'Mere');
}
function assertGuelder(t){
  requireBoxWalls(t,3,10,4,28,.6,14.4,'Guelder west full classroom range');requireBoxWalls(t,22,29,4,28,.6,17.4,'Guelder east higher classroom range');
  const q=[[10,4],[22,23],[22,28],[10,9]];for(let i=0;i<4;i++)requireWall(t,q[i],q[(i+1)%4],.6,8.4,'Guelder actual diagonal enclosed link');
  assertOpen(t,[[15,7],[17,25],[20,10],[12,23]],'Guelder two triangular sky courts');assertSolid(t,[[16,16],[10.01,6],[21.99,25]],8.8,'Guelder direct N-plan joins');
  const roof=roofPolygons(t),link=roof.filter(p=>maxz(p)<12);assert.equal(link.length,2,'Guelder one complete low diagonal mono-pitch');assert(link.flat().every(p=>close(p[2],10.8-(p[0]-10)/12)),'Guelder diagonal roof has its own straight slope');
  assert(roof.some(p=>hasVertex(p,[6.5,4,21.2]))&&roof.some(p=>hasVertex(p,[25.5,28,25])),'Guelder unequal complete parallel gables');assertPartition(roof,'Guelder');assertMeshClosed(t,roof,.4,'Guelder');assertGlazingBacking(t,'Guelder');
}
function assertGorse(t){
  const q=[[7,3],[25,3],[28,6],[28,17],[25,20],[7,20],[4,17],[4,6]];for(let i=0;i<8;i++)requireWall(t,q[i],q[(i+1)%8],.6,12,'Gorse eight clipped auditorium walls');
  requireBoxWalls(t,11,21,20,29,.6,21.2,'Gorse narrow tall grounded foyer');assertSolid(t,[[16,19.9],[16,20.1]],12,'Gorse enclosed touching neck');assertOpen(t,[[7,26],[25,26]],'Gorse genuine keyhole shoulders');
  const roofs=roofPolygons(t),aud=roofs.filter(p=>maxz(p)<20);assert.equal(aud.length,10,'Gorse single complete clipped hip');assert(aud.flat().filter(p=>p[2]>12.4).every(p=>close(p[1],11.5)&&close(p[2],17.4)&&[10,22].includes(p[0])),'Gorse shallow hip short central ridge');
  assert(hasVertex(roofs.flat(),[16,29,29.2]),'Gorse foyer ridge visibly higher than auditorium');assertPartition(roofs,'Gorse');assertMeshClosed(t,roofs,.4,'Gorse');assertGlazingBacking(t,'Gorse');
}
function assertComfrey(t){
  requireBoxWalls(t,3,19,6,28,.6,13.6,'Comfrey high garage masonry walls');requireBoxWalls(t,23,30,4,15,.6,21.8,'Comfrey compact two-storey keeper house');requireBoxWalls(t,19,23,8,15,.6,8.4,'Comfrey recessed grounded connecting bay');
  assertOpen(t,[[24,20],[28,24]],'Comfrey genuinely open side apron');const roof=barrelTops(t,14);assert.equal(roof.length,48,'Comfrey single complete curved barrel');
  for(const p of roof.flat())assert(close(((p[0]-11)/8)**2+((p[2]-14)/7)**2,1),'Comfrey high-wall elliptical barrel profile');
  assert.equal(materialPolygons(t,'brick').filter(p=>p.length===4&&close(minz(p),.6)&&p.every(q=>close(q[1],6)||close(q[1],28))&&maxz(p)>13.6).length,48,'Comfrey both shaped barrel ends closed');
  assert.equal(roofPolygons(t).filter(p=>minz(p)>21).length,6,'Comfrey complete domestic hipped roof');assertUndersides(t,roof,.4,'Comfrey barrel');assertMeshClosed(t,roofPolygons(t),.4,'Comfrey slate');assertGlazingBacking(t,'Comfrey');
}
function assertMarjoram(t){
  requireBoxWalls(t,5,27,4,26,.6,16.8,'Marjoram square grounded hall');requireBoxWalls(t,12,20,26,30,.6,7.4,'Marjoram only low projecting pantry');
  const roof=barrelTops(t,11.2);assert.equal(roof.length,4,'Marjoram exactly four inward roof planes');
  const corners=[[5,4,17.2],[27,4,17.2],[27,26,17.2],[5,26,17.2]];
  for(let i=0;i<4;i++)assert(roof.some(p=>polykey(p)===polykey([corners[i],corners[(i+1)%4],[16,15,11.2]])),'Marjoram four high eaves meet single lower closed drain');
  assert(heightsAt(t,16,15).some(z=>close(z,11.2))&&heightsAt(t,16,15).every(z=>z<=11.221),'Marjoram true closed low centre without hidden flat cap');
  assertPartition(roof,'Marjoram');assertMeshClosed(t,roof,.4,'Marjoram');assertGlazingBacking(t,'Marjoram');
}
function assertBorage(t){
  requireBoxWalls(t,10,22,7,19,.6,21,'Borage compact square two-storey core');requireBoxWalls(t,4,10,7,25,.6,9.6,'Borage left continuous low wrap room');requireBoxWalls(t,22,28,7,25,.6,9.6,'Borage right continuous low wrap room');
  const roof=roofPolygons(t),low=roof.filter(p=>maxz(p)<14);assert.equal(low.length,10,'Borage seven turned C-wrap roof patches');
  assertSolid(t,[[6,10],[26,10],[16,22],[8,23],[24,23]],9.8,'Borage three-sided covered wrap');assertOpen(t,[[16,4],[6,4],[26,4]],'Borage rear stays exposed not closed ring');
  for(const x of[13,16,19])assert(cast(t,1,x,5).every(y=>y<=19.6||y>=26),'Borage actual deep open front porch');
  requireBoxWalls(t,10,11.5,23.5,25,.6,9.6,'Borage left masonry porch pier');requireBoxWalls(t,20.5,22,23.5,25,.6,9.6,'Borage right masonry porch pier');
  assert(low.some(p=>hasVertex(p,[4,25,10])&&hasVertex(p,[10,19,13]))&&low.some(p=>hasVertex(p,[28,25,10])&&hasVertex(p,[22,19,13])),'Borage both real turned roof corners');assertPartition(roof,'Borage');assertMeshClosed(t,roof,.4,'Borage');assertGlazingBacking(t,'Borage');
}
function assertHyssop(t){
  requireBoxWalls(t,3,29,3,13,.6,11.8,'Hyssop broad grounded low range');requireBoxWalls(t,3,11,13,29,.6,17,'Hyssop narrower grounded tall return');assertOpen(t,[[18,20],[25,25]],'Hyssop real rectangular loading yard');
  const roof=roofPolygons(t),lo=roof.filter(p=>p.every(q=>q[1]<=13)),hi=roof.filter(p=>p.every(q=>q[1]>=13));assert.equal(lo.length,8,'Hyssop broad complete double-pitch roof');assert.equal(hi.length,8,'Hyssop tall complete perpendicular double-pitch roof');
  const lp=[[3,12.2],[5.5,18.104],[8,20.4],[10.5,18.104],[13,12.2]],hp=[[3,17.4],[5,24.312],[7,27],[9,24.312],[11,17.4]];
  assert(lo.flat().every(p=>lp.some(q=>close(p[1],q[0])&&close(p[2],q[1]))),'Hyssop low actual gambrel break lines');assert(hi.flat().every(p=>hp.some(q=>close(p[0],q[0])&&close(p[2],q[1]))),'Hyssop high actual perpendicular gambrel break lines');
  requireWall(t,[3,13],[11,13],.6,17,'Hyssop lower roof joins grounded high rear wall');assert(roof.some(p=>hasVertex(p,[3,13,12.2])),'Hyssop lower gambrel eave physically reaches junction');assertPartition(roof,'Hyssop');assertMeshClosed(t,roof,.4,'Hyssop');assertGlazingBacking(t,'Hyssop');
}
function assertDittany(t){
  const circle=materialPolygons(t,'stone').filter(p=>p.length===4&&close(minz(p),.6)&&close(maxz(p),14.8));assert.equal(circle.length,24,'Dittany one complete round stone drum');
  for(const p of circle.flat())assert(close(Math.hypot(p[0]-16,p[1]-16),7.5),'Dittany truly circular central room');
  requireBoxWalls(t,2.2,10,12,20,.6,9.4,'Dittany long lower straight specimen wing');requireBoxWalls(t,22,29.8,13,19,.6,12.4,'Dittany short higher straight specimen wing');
  const cone=roofPolygons(t).filter(p=>maxz(p)>20);assert.equal(cone.length,24,'Dittany one centred conical roof');assert(cone.every(p=>hasVertex(p,[16,16,25.2])),'Dittany single centred cone apex');
  assertSolid(t,[[9.9,16],[22.1,16]],9,'Dittany both wings meet round room');assertOpen(t,[[5,5],[27,5],[5,26],[27,26]],'Dittany no filled rectangular pedestal');assertUndersides(t,roofPolygons(t),.4,'Dittany');assertGlazingBacking(t,'Dittany');
}
const thatchTops=t=>topsWith(t,[P.wood,P.woodHi],9);
function assertChamomile(t){
  const roof=thatchTops(t);assert(roof.length>500,'Chamomile continuous finely faceted curved thatch');
  const pts=uniquePoints(roof.flat()),section=pts.filter(p=>close(p[0],16)&&p[1]>=16).sort((a,b)=>a[2]-b[2]);assert.equal(section.length,7,'Chamomile seven real convex cross-section levels');
  for(const p of section)assert(close(((p[1]-16)/8.5)**2+((p[2]-9)/10.8)**2,1),'Chamomile convex rounded long slope not planar or ogee');
  const end=pts.filter(p=>close(p[1],16)&&p[0]<=11).sort((a,b)=>a[2]-b[2]);assert.equal(end.length,7,'Chamomile seven rounded end hip levels');for(const p of end)assert(close(((p[0]-11)/8)**2+((p[2]-9)/10.8)**2,1),'Chamomile true convex rounded end hip');
  assert(hasVertex(pts,[11,16,19.8])&&hasVertex(pts,[21,16,19.8]),'Chamomile broad short soft ridge');
  const eave=pts.filter(p=>close(p[1],24.5));for(const [lo,hi]of[[11.6,14],[18,20.4]])assert(eave.some(p=>p[0]>lo&&p[0]<hi&&p[2]>11),'Chamomile both eyebrow heads actually raise and cut eave');assert(eave.some(p=>close(p[0],16)&&close(p[2],9)),'Chamomile eave descends between two distinct eyebrows');
  const headwalls=materialPolygons(t,'stone').filter(p=>close(minz(p),.6)&&maxz(p)>10.5&&p.every(q=>close(q[1],23.4)));assert(headwalls.length>=4,'Chamomile actual raised masonry window heads');
  const soffits=t.polygons.filter((p,i)=>t.materialValues[i]===P.woodR&&p.length===4&&close(p[0][2]+.4,p[3][2])&&close(p[1][2]+.4,p[2][2]));assert.equal(soffits.length,64,'Chamomile complete overhang soffit joins low wall plate');
  requireBoxWalls(t,22.8,24.6,12.4,14.2,17.6,22,'Chamomile one short offset stone chimney');assertPartition(roof,'Chamomile');assertMeshClosed(t,roof,.8,'Chamomile');assertGlazingBacking(t,'Chamomile');
}
function assertMyrtle(t){
  requireBoxWalls(t,5.5,26.5,3,27,.6,1.6,'Myrtle only low grounded brick plinth');const roof=barrelTops(t,2).filter(p=>maxz(p)>6.1||minz(p)<5.99);assert.equal(roof.length,48,'Myrtle one complete semicylindrical shell');
  for(const p of roof.flat())assert(close((p[0]-16)**2+(p[2]-2)**2,110.25),'Myrtle near-ground full semicircle not high-wall barrel');
  const ends=materialPolygons(t,'brick').filter(p=>p.length===4&&close(minz(p),.6)&&maxz(p)>1.6+1e-8&&Math.max(...p.map(q=>q[0]))-Math.min(...p.map(q=>q[0]))<1.5&&p.every(q=>close(q[1],3)||close(q[1],27)));assert.equal(ends.length,48,'Myrtle both complete closed round masonry ends');
  requireBoxWalls(t,8,14,27,30,.6,5.6,'Myrtle offset low flat vestibule');
  const tallSide=materialPolygons(t,'brick').filter(p=>p.every(q=>close(q[0],5.5)||close(q[0],26.5))&&maxz(p)>2);assert.equal(tallSide.length,0,'Myrtle no normal-height long masonry walls');
  const rooflights=materialPolygons(t,'emissive').filter(p=>p.every(q=>q[1]>=9&&q[1]<=20));assert.equal(rooflights.length,4,'Myrtle four flush real curved-shell rooflights');assertUndersides(t,roof,.4,'Myrtle');assertGlazingBacking(t,'Myrtle');
}
const checks={merememorial:assertMere,guelderlace:assertGuelder,gorsepicture:assertGorse,comfreyambulance:assertComfrey,marjoramkitchen:assertMarjoram,boragedental:assertBorage,hyssopupholstery:assertHyssop,dittanygeology:assertDittany,chamomilestory:assertChamomile,myrtlewireless:assertMyrtle};
for(const [id,check]of Object.entries(checks)){check(modelTraces[id]);console.log('STRUCTURE',id,'PASS');}

// Every sabotage changes actual recorded polygons, not a report flag or a count.
// The exact named invariant must be the first assertion to fail; restored source
// is checked after each mutation and again for all forty construction paths.
const clone=t=>JSON.parse(JSON.stringify(t)),controls=[];
function removePolygon(t,i){assert(i>=0,'negative fixture must locate a real surface');t.polygons.splice(i,1);t.materials.splice(i,1);t.materialValues.splice(i,1);}
function removeExact(t,q){removePolygon(t,t.polygons.findIndex(p=>polykey(p)===polykey(q)));}
function addPolygon(t,q,kind='solid',value=P.stoneR){t.polygons.push(q);t.materials.push(kind);t.materialValues.push(value);}
function negative(name,id,mutate,pattern){const bad=clone(modelTraces[id]);const before=digest(bad.polygons);mutate(bad);assert.notEqual(digest(bad.polygons),before,'sabotage must change actual drawn geometry');assert.throws(()=>checks[id](bad),pattern,name+' must first fail at the targeted structural assertion');checks[id](modelTraces[id]);controls.push({name,firstRed:'structural:'+id,target:pattern.source,restored:true,sourceOnly:true});}
negative('paint-over-first-bellcote-opening','merememorial',t=>addPolygon(t,[[13,28.8,29.4],[15.4,28.8,29.4],[15.4,28.8,32.8],[13,28.8,32.8]]),/twin real through-open/);
negative('remove-bellcote-grounded-support','merememorial',t=>removeExact(t,wallQ([12.1,28.8],[19.9,28.8],22.1,29.4)),/solid base intersects gable/);
negative('distort-round-bellcote-intrados','merememorial',t=>{const p=t.polygons.find((p,i)=>t.materialValues[i]===P.stoneD&&minz(p)>=31.6&&maxz(p)<=32.8);p[1][0]+=.15;},/round aperture heads/);
negative('fill-recessed-memorial-door','merememorial',t=>addPolygon(t,[[14,28,.6],[18,28,.6],[18,28,8],[14,28,8]]),/door is not hidden/);
negative('roof-over-N-plan-court','guelderlace',t=>addPolygon(t,[[12,5,7],[20,5,7],[20,11,7],[12,11,7]]),/two triangular sky courts/);
negative('straighten-lace-diagonal-link','guelderlace',t=>{const p=t.polygons.find(p=>polykey(p)===polykey(wallQ([10,4],[22,23],.6,8.4)));for(const q of p)if(q[0]===22)q[1]=9;},/actual diagonal enclosed link/);
negative('tilt-lace-link-roof-off-its-pitch','guelderlace',t=>{roofPolygons(t).find(p=>maxz(p)<12)[0][2]+=.5;},/own straight slope/);
negative('erase-cinema-clipped-corner','gorsepicture',t=>removeExact(t,wallQ([25,3],[28,6],.6,12)),/eight clipped auditorium walls/);
negative('detach-cinema-foyer-masonry','gorsepicture',t=>removeExact(t,wallQ([11,20],[11,29],.6,21.2)),/narrow tall grounded foyer/);
negative('bend-cinema-hip-ridge','gorsepicture',t=>{for(const p of roofPolygons(t).flat())if(close(p[2],17.4))p[1]+=.7;},/shallow hip short central ridge/);
negative('float-garage-long-bearing-wall','comfreyambulance',t=>{const p=t.polygons.find(p=>polykey(p)===polykey(wallQ([3,6],[3,28],.6,13.6)));for(const q of p)if(close(q[2],.6))q[2]=4;},/high garage masonry walls/);
negative('remove-ambulance-domestic-house','comfreyambulance',t=>removeExact(t,wallQ([23,4],[30,4],.6,21.8)),/compact two-storey keeper house/);
negative('flatten-high-garage-barrel','comfreyambulance',t=>{const p=barrelTops(t,14).flat().find(p=>p[2]>18);p[2]-=1;},/high-wall elliptical barrel profile/);
negative('raise-inverted-kitchen-drain','marjoramkitchen',t=>{for(const p of barrelTops(t,11.2).flat())if(close(p[2],11.2))p[2]=17.2;},/four high eaves meet single lower closed drain/);
negative('remove-one-inverted-kitchen-plane','marjoramkitchen',t=>removePolygon(t,t.polygons.findIndex((p,i)=>[P.lead,P.slateHi].includes(t.materialValues[i])&&p.length===3&&hasVertex(p,[16,15,11.2]))),/exactly four inward roof planes/);
negative('hide-inverted-roof-under-flat-cap','marjoramkitchen',t=>addPolygon(t,[[5,4,17],[27,4,17],[27,26,17],[5,26,17]]),/true closed low centre/);
negative('fill-dental-open-covered-porch','boragedental',t=>addPolygon(t,[[11.5,24,.6],[20.5,24,.6],[20.5,24,8],[11.5,24,8]]),/actual deep open front porch/);
negative('remove-dental-wrap-corner','boragedental',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materials[i]==='slate'&&hasVertex(p,[4,25,10])&&hasVertex(p,[10,19,13]))),/seven turned C-wrap roof patches/);
negative('close-dental-exposed-rear-ring','boragedental',t=>addPolygon(t,[[4,2,9],[28,2,9],[28,7,9],[4,7,9]]),/rear stays exposed/);
negative('fill-upholstery-loading-yard','hyssopupholstery',t=>addPolygon(t,[[11,13,7],[29,13,7],[29,29,7],[11,29,7]]),/real rectangular loading yard/);
negative('erase-low-gambrel-break-line','hyssopupholstery',t=>{for(const p of roofPolygons(t).flat())if(close(p[1],5.5))p[1]=6;},/low actual gambrel break lines/);
negative('bend-perpendicular-high-gambrel','hyssopupholstery',t=>{for(const p of roofPolygons(t).flat())if(close(p[2],27))p[0]=8;},/high actual perpendicular gambrel break lines/);
negative('make-geology-drum-elliptical','dittanygeology',t=>{const p=materialPolygons(t,'stone').find(p=>p.length===4&&close(minz(p),.6)&&close(maxz(p),14.8));p[0][0]+=.7;},/truly circular central room/);
negative('move-geology-cone-off-centre','dittanygeology',t=>{for(const p of roofPolygons(t).flat())if(close(p[2],25.2))p[0]=18;},/single centred cone apex/);
negative('fill-geology-rectangular-pedestal','dittanygeology',t=>addPolygon(t,[[2,2,4],[30,2,4],[30,30,4],[2,30,4]]),/no filled rectangular pedestal/);
negative('flatten-convex-thatch-cross-section','chamomilestory',t=>{for(const p of thatchTops(t).flat())if(close(p[0],16)&&p[1]>16&&close(p[2],14.4))p[2]=14;},/convex rounded long slope/);
negative('flatten-rounded-thatch-end-hip','chamomilestory',t=>{for(const p of thatchTops(t).flat())if(close(p[1],16)&&p[0]<11&&close(p[2],14.4))p[0]+=1;},/true convex rounded end hip/);
negative('paint-only-thatch-eyebrows','chamomilestory',t=>{for(const p of thatchTops(t).flat())if(close(p[1],24.5))p[2]=9;},/both eyebrow heads actually raise/);
negative('remove-thatch-bearing-soffit','chamomilestory',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materialValues[i]===P.woodR&&p.length===4&&close(p[0][2]+.4,p[3][2])&&close(p[1][2]+.4,p[2][2]))),/complete overhang soffit joins/);
negative('remove-thatch-roof-thickness','chamomilestory',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materialValues[i]===P.woodR&&p.length===3&&minz(p)>8)),/exact matching triangulated underside/);
negative('raise-wireless-semicylinder-spring','myrtlewireless',t=>{const p=barrelTops(t,2).flat().find(p=>close(p[0],5.5)&&close(p[2],2));p[2]=4;},/near-ground full semicircle/);
negative('open-wireless-masonry-end','myrtlewireless',t=>removePolygon(t,t.polygons.findIndex((p,i)=>t.materials[i]==='brick'&&p.length===4&&close(minz(p),.6)&&maxz(p)>10&&p.every(q=>close(q[1],3)))),/both complete closed round masonry ends/);
negative('erase-wireless-offset-entry','myrtlewireless',t=>removeExact(t,wallQ([8,30],[14,30],.6,5.6)),/offset low flat vestibule/);
negative('float-wireless-rooflight','myrtlewireless',t=>{const p=materialPolygons(t,'emissive').find(p=>p.every(q=>q[1]>=9&&q[1]<=20));for(const q of p)q[2]+=2;},/opaque glazing is backed/);
assert(controls.length>=30,'at least thirty targeted true surface sabotage controls');
const duplicate=roofPolygons(modelTraces.guelderlace);assert.throws(()=>assertPartition([...duplicate,duplicate[0]],'duplicate N roof'),/must not overlap/);controls.push({name:'duplicate-real-N-roof-facet',firstRed:'roof-partition',restored:true,sourceOnly:true});

// Source-level sabotage executes a changed model body through the same recording
// stub, proving the guard is not merely checking retained golden summaries.
const sourceControls=[];
function sourceNegative(name,from,to,id,pattern){assert(source.includes(from));assert.equal(source.split(from).length,2,'source mutation must have one exact target');const changed=source.replace(from,to),box={BritishUseScalesKit021:{create:kit},__wave046GeometryOnly:true};vm.runInNewContext(changed,box);box.BritishWaveArchitecture046.build(id,0);assert.throws(()=>checks[id](traces.at(-1)),pattern,name);checks[id](modelTraces[id]);sourceControls.push({name,firstRed:'source-model:'+id,target:pattern.source,restored:true,sourceOnly:true});}
sourceNegative('source-fill-open-bellcote',"for(const cx of[14.2,17.8])for(let i=0;i<12;i++){","S.wall([13,28.8],[15.4,28.8],29.4,32.8,P.stone);for(const cx of[14.2,17.8])for(let i=0;i<12;i++){",'merememorial',/twin real through-open/);
sourceNegative('source-raise-inverted-drain',"drain=[16,15,11.2]","drain=[16,15,17.2]",'marjoramkitchen',/four high eaves meet single lower closed drain/);
sourceNegative('source-flatten-eyebrow-cut',"?2.4*Math.cos((x-c)*Math.PI/3.6)**2:0","?0*Math.cos((x-c)*Math.PI/3.6)**2:0",'chamomilestory',/both eyebrow heads actually raise/);
const invalidInputs=[];
for(const view of[-1,4,1.5,NaN,Infinity,-Infinity,'0',null,undefined,true]){assert.throws(()=>art.build('merememorial',view),/four world rotations only/);invalidInputs.push({kind:'invalid-view',value:String(view),rejected:true});}
for(const id of['not-frozen','__proto__','constructor','',null,undefined,840]){assert.throws(()=>art.build(id,0),/unknown frozen original/);invalidInputs.push({kind:'invalid-id',value:String(id),rejected:true});}
assert(Object.isFrozen(art)&&Object.isFrozen(art.rows)&&art.rows.every(Object.isFrozen),'immutable public rows and API');
assert.equal(art.buildAll().length,40,'complete native buildAll interface');
for(const row of rows)for(let view=0;view<4;view++){art.build(row.id,view);checks[row.id](traces.at(-1));}
for(const row of rows)assert.equal(new Set(summaries.filter(s=>s.id===row.id).map(s=>s.geometrySHA256)).size,1,'four callers construct identical world geometry, not screen-space substitutes');
const structuralChecks={actualRecordedPolygons:true,independentFrozenRows:true,allFortyWorldConstructionPaths:true,tenUniqueColourIndependentGeometryHashes:true,bellcoteThroughOpenAndSupported:true,realNPlanCourtsAndJoins:true,keyholeOctagonalAuditorium:true,highWallBarrelAndKeeperHouse:true,closedFourPlaneInvertedPyramid:true,CWrapWithRecessedPorch:true,perpendicularCompleteGambrels:true,oneRoundRoomAndUnequalStraightWings:true,convexThatchHipsAndRealEyebrowCuts:true,nearGroundSemicylinderAndFlushRooflights:true,allGlazingHasActualOpaqueBacking:true,roofUndersidesClosedEdgesAndPartitions:true,hardMaterialsOnly:true,noPreviousModelCalls:true,sourceOnly:true};
const out={ok:true,kind:'source-only-recording-stub-audit',gameExecuted:false,rasterizerExecuted:false,renderedSprites:0,models:10,authoredViewPaths:40,nativeCanvasContract:{w:160,h:196,sz:2,ax:80,ay:194,verifiedBy:'source/stub contract; no local raster'},negativeControls:controls.length+sourceControls.length+invalidInputs.length,structuralNegativeControls:controls,sourceMutationControls:sourceControls,invalidInputs,structuralChecks,sourceSHA256:crypto.createHash('sha256').update(source).digest('hex'),summaries};
fs.writeFileSync('wave046-source-geometry-report.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({...out,summaries:undefined}));
