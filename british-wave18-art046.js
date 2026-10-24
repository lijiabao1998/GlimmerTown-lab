/* GPT-046 wave18: ten original English village and community buildings.
 * Entirely new grounded world-space bodies for the immutable first-card designs.
 * Only approved art634/021 projection, materials and depth helpers are shared.
 * No earlier model body is called. Day and opaque glazing share native depth.
 */
(function(root){
  'use strict';
  const ROWS=Object.freeze([
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
].map(Object.freeze));
  function context(row,view){
    const H=root.BritishUseScalesKit021.create({sz:2,w:160,h:196},view),{S,K,P,C,dark}=H;
    const rawBox=S.box;
    S.box=function(x0,x1,y0,y1,z0,z1,front,side,top){
      return(view&1)&&side!==undefined?rawBox(x0,x1,y0,y1,z0,z1,side,front,top===undefined?front:top):rawBox(x0,x1,y0,y1,z0,z1,front,side,top);
    };
    const Q={cream:C('ded8c4'),creamD:C('a4a694'),creamHi:C('eee7d2'),oak:C('625345'),oakD:C('3d4040'),red:C('9f654b'),redD:C('6e493e'),steel:C('7b8f8a'),steelD:C('4a615d'),steelHi:C('a7b9b0'),tar:P.ink,tarD:P.ironD,tarHi:P.woodD,cedar:P.wood,cedarD:P.woodR,cedarHi:P.woodHi};
    function mat(kind,nx,ny){
      const d=dark(nx,ny);
      const uAt=(x,y)=>Math.abs(nx)>.5?y:x;
      if(kind==='whiteplaster')return(x,y,z)=>K.hash(Math.floor(x*2),Math.floor(y*2),3801)%61===0?(d?C('b8bcb2'):Q.creamHi):(d?C('c4c6bc'):C('e5e4d6'));
      if(kind==='terracotta')return(x,y,z)=>K.mod(z,1.65)<.13?(d?C('8b7360'):C('ad9073')):(d?C('a4876b'):C('c5a17c'));
      if(kind==='vitriolite')return(x,y,z)=>K.mod(z,4.5)<.10?(d?C('617c80'):C('c7d1c7')):(d?C('768c90'):C('9eafb0'));
      if(kind==='copper')return d?P.copperR:P.copper;
      if(kind==='whiteboard')return(x,y,z)=>K.mod(z,1.5)<.13?(d?Q.creamD:Q.creamHi):(d?Q.creamD:Q.cream);
      if(kind==='whiteMetal')return(x,y,z)=>K.mod(uAt(x,y),2.3)<.13?(d?P.lead:Q.creamHi):(d?Q.creamD:Q.cream);
      if(kind==='blackwood')return(x,y,z)=>K.mod(z,1.55)<.16?(d?Q.tar:Q.tarHi):(d?Q.tarD:Q.tar);
      if(kind==='cedar')return(x,y,z)=>K.mod(z,1.8)<.15?(d?Q.cedarD:Q.cedarHi):(d?Q.cedarD:Q.cedar);
      if(kind==='zinc')return(x,y,z)=>K.mod(uAt(x,y),2.1)<.16?(d?Q.steelD:Q.steelHi):(d?Q.steelD:Q.steel);
      if(kind==='flint')return(u,z)=>{const n=K.hash(Math.floor(u*2.8),Math.floor(z*2.8),3004);return n%7<2?(d?Q.creamD:Q.creamHi):(d?P.stoneD:P.stoneR);};
      if(kind==='yellowbrick')return(x,y,z)=>{const u=Math.abs(nx)>.5?y:x;return K.mod(z,1.65)<.18||K.mod(u+(Math.floor(z/1.65)%2)*1.7,3.4)<.13?(d?P.stoneD:P.stoneR):(d?Q.creamD:Q.cream);};
      if(kind==='brick')return K.brick(d,3001);
      if(kind==='stone')return K.ashlar(d,3002);
      if(kind==='steel'||kind==='lead')return(x,y,z)=>K.mod(z,3.3)<.16?(d?Q.steel:Q.steelHi):(d?Q.steelD:Q.steel);
      if(kind==='wood')return(x,y,z)=>K.mod(z,1.5)<.15?(d?Q.oakD:Q.oak):(d?P.woodR:P.woodHi);
      return(u,z)=>K.hash(Math.floor(u*2),Math.floor(z*2),3003)%47===0?(d?Q.creamD:Q.creamHi):(d?Q.creamD:Q.cream);
    }
    function volume(x0,x1,y0,y1,z0,z1,kind,cap=true){
      const f={
        front:Object.assign(S.face([x0,y1],[x1,y1],0,1),{nx:0,ny:1}),
        back:Object.assign(S.face([x1,y0],[x0,y0],0,-1),{nx:0,ny:-1}),
        right:Object.assign(S.face([x1,y1],[x1,y0],1,0),{nx:1,ny:0}),
        left:Object.assign(S.face([x0,y0],[x0,y1],-1,0),{nx:-1,ny:0})
      };
      S.wall([x0,y1],[x1,y1],z0,z1,mat(kind,0,1));S.wall([x1,y0],[x0,y0],z0,z1,mat(kind,0,-1));
      S.wall([x1,y1],[x1,y0],z0,z1,mat(kind,1,0));S.wall([x0,y0],[x0,y1],z0,z1,mat(kind,-1,0));
      if(cap)S.flat(x0,x1,y0,y1,z1,kind==='steel'?Q.steelD:P.stoneR);
      return f;
    }
    function roof(x0,x1,y0,y1,z,rise,axis,kind){
      const cx=(x0+x1)/2,cy=(y0+y1)/2,m=(nx,ny)=>K.slate(dark(nx,ny));
      if(axis!=='y'){
        S.poly([[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]],m(0,-1));S.poly([[x0,y1,z],[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z]],m(0,1));
        S.poly([[x0,y0,z],[x0,y1,z],[x0,cy,z+rise]],mat(kind||'stone',-1,0));S.poly([[x1,y0,z],[x1,cy,z+rise],[x1,y1,z]],mat(kind||'stone',1,0));
        S.beam([x0,cy,z+rise],[x1,cy,z+rise],P.lead,.36);
      }else{
        S.poly([[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]],m(-1,0));S.poly([[x1,y0,z],[x1,y1,z],[cx,y1,z+rise],[cx,y0,z+rise]],m(1,0));
        S.poly([[x0,y0,z],[cx,y0,z+rise],[x1,y0,z]],mat(kind||'stone',0,-1));S.poly([[x0,y1,z],[x1,y1,z],[cx,y1,z+rise]],mat(kind||'stone',0,1));
        S.beam([cx,y0,z+rise],[cx,y1,z+rise],P.lead,.36);
      }
    }
    function pane(F,u,z,w,h,type,lit){
      const cx=u+w/2,head=type==='pointed'?h*.64:type==='arch'?h*.66:h;
      let outside,inside;
      if(type==='diamond'){
        outside=[[cx,z-.35],[u+w+.35,z+h/2],[cx,z+h+.35],[u-.35,z+h/2]];
        inside=[[cx,z+.35],[u+w-.35,z+h/2],[cx,z+h-.35],[u+.35,z+h/2]];
      }else if(type==='arch'){
        // A round-headed opening is a semicircle above straight jambs.
        // Keep pointed tracery separate; do not substitute a triangular peak.
        const spring=z+h-w/2;
        const arc=(radius,bottom)=>[[cx-radius,bottom],[cx+radius,bottom],...Array.from({length:13},(_,i)=>{const a=i*Math.PI/12;return[cx+Math.cos(a)*radius,spring+Math.sin(a)*radius];})];
        outside=arc(w/2+.35,z-.35);inside=arc(w/2-.22,z+.22);
      }else if(type==='pointed'){
        outside=[[u-.3,z-.35],[u+w+.3,z-.35],[u+w+.3,z+head],[cx,z+h+.4],[u-.3,z+head]];
        inside=[[u+.3,z+.35],[u+w-.3,z+.35],[u+w-.3,z+head-.2],[cx,z+h-.35],[u+.3,z+head-.2]];
      }else{
        outside=[[u-.3,z-.35],[u+w+.3,z-.35],[u+w+.3,z+h+.35],[u-.3,z+h+.35]];
        inside=[[u+.22,z+.22],[u+w-.22,z+.22],[u+w-.22,z+h-.22],[u+.22,z+h-.22]];
      }
      S.poly(outside.map(p=>F.point(p[0],.13,p[1])),P.stoneHi);
      const glass=dark(F.nx,F.ny)?P.glassR:P.glass;
      S.poly(inside.map(p=>F.point(p[0],.24,p[1])),lit===false?glass:[glass,P.warm]);
      if(type!=='diamond'){
        const bays=type==='ribbon'?Math.max(2,Math.round(w/2.8)):type==='mullion'?3:2;
        for(let b=1;b<bays;b++)F.panel(u+w*b/bays-.10,u+w*b/bays+.10,z+.2,z+h-.3,P.frame,.32);
        if(type!=='ribbon')F.panel(u+.2,u+w-.2,z+h*.48-.10,z+h*.48+.10,P.frame,.33);
      }else{
        S.beam(F.point(cx,.31,z+.45),F.point(cx,.31,z+h-.45),P.frame,.15);
        S.beam(F.point(u+.45,.31,z+h/2),F.point(u+w-.45,.31,z+h/2),P.frame,.15);
      }
    }
    function windows(F,levels,bays,z0,step,w,h,type){
      for(let l=0;l<levels;l++)for(let b=0;b<bays;b++)pane(F,F.length*(b+.5)/bays-w/2,z0+l*step,w,h,type,true);
    }
    function polygon(cx,cy,r,z0,z1,n,kind,phase){
      const points=Array.from({length:n},(_,i)=>{const a=(phase||0)+i*Math.PI*2/n;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r];}),faces=[];
      for(let i=0;i<n;i++){
        const p=points[i],q=points[(i+1)%n],a=(phase||0)+(i+.5)*Math.PI*2/n,nx=Math.cos(a),ny=Math.sin(a);
        S.wall(p,q,z0,z1,mat(kind,nx,ny));faces.push(Object.assign(S.face(p,q,nx,ny),{nx,ny}));
      }
      S.poly(points.map(p=>[...p,z1]),P.stoneR);return faces;
    }
    function cone(cx,cy,r0,r1,z0,z1,n,kind){
      for(let i=0;i<n;i++){
        const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n,m=(a+b)/2;
        const tex=kind==='stone'?K.ashlar(dark(Math.cos(m),Math.sin(m)),3027):kind==='lead'?(dark(Math.cos(m),Math.sin(m))?Q.steelD:Q.steel):K.slate(dark(Math.cos(m),Math.sin(m)));
        S.poly([[cx+Math.cos(a)*r0,cy+Math.sin(a)*r0,z0],[cx+Math.cos(b)*r0,cy+Math.sin(b)*r0,z0],[cx+Math.cos(b)*r1,cy+Math.sin(b)*r1,z1],[cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,z1]],tex);
      }
    }
    function parapet(x0,x1,y0,y1,z,battled){
      for(const [xa,xb,ya,yb]of[[x0,x1,y0,y0+.45],[x0,x1,y1-.45,y1],[x0,x0+.45,y0,y1],[x1-.45,x1,y0,y1]])S.box(xa,xb,ya,yb,z,z+1.7,P.stone,P.stoneR,P.stoneHi);
      if(battled)for(let u=x0;u<x1;u+=2.6)for(const y of[y0,y1-.8])S.box(u,Math.min(u+1.35,x1),y,y+.8,z+1.7,z+3,P.stone,P.stoneR,P.stoneHi);
    }
    function steps(x0,x1,y0,y1,rise,n){for(let i=0;i<n;i++)S.box(x0,x1,y0+(y1-y0)*i/n,y1,.42,.42+rise*(i+1)/n,P.stone,P.stoneR,P.stoneHi);}
    function chimney(x,y,z,h){volume(x-.65,x+.65,y-.7,y+.7,z,z+h,'brick');S.box(x-.9,x+.9,y-.9,y+.9,z+h,z+h+.7,P.stone,P.stoneR,P.stoneHi);for(const dx of[-.38,.38])K.cylinder(S,x+dx,y,z+h+.7,z+h+2.5,.24,.28,Q.red,Q.redD,P.ink,8);}
    if(!root.__wave046GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave046GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave046:1});
    }
    return{...H,S,K,P,Q,mat,volume,roof,pane,windows,polygon,cone,parapet,steps,chimney,finish};
  }
  function face(A,a,b,nx,ny){return Object.assign(A.S.face(a,b,nx,ny),{nx,ny});}

  function planBlock(A,points,z0,z1,kind,cap){
    const {S,P}=A,faces=[];
    for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len;
      S.wall(a,b,z0,z1,A.mat(kind,nx,ny));faces.push(face(A,a,b,nx,ny));
    }
    if(cap!==false)for(const t of triangulatePlan(points.map(p=>[...p,z1])))S.poly(t,cap===undefined?P.stoneHi:cap);
    return faces;
  }

  function roundWindow(A,F,u,z,r,lit=true){
    const {S,K,P}=A,points=Array.from({length:24},(_,j)=>{const t=j*2*Math.PI/24;return F.point(u+r*Math.cos(t),.19,z+r*Math.sin(t));});
    S.poly(points,lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    K.ring(S,F,u,z,r+.3,r+.3,.35,.24,P.stoneHi,24);
    for(const t of[0,Math.PI/3,2*Math.PI/3])S.beam(F.point(u+r*Math.cos(t),.33,z+r*Math.sin(t)),F.point(u-r*Math.cos(t),.33,z-r*Math.sin(t)),P.frame,.16);
  }

  function framedPolygon(A,F,points,lit=true){
    const {S,P}=A,cx=points.reduce((n,p)=>n+p[0],0)/points.length,cz=points.reduce((n,p)=>n+p[1],0)/points.length;
    const inner=points.map(p=>[cx+(p[0]-cx)*.86,cz+(p[1]-cz)*.92]);
    S.poly(points.map(p=>F.point(p[0],.15,p[1])),P.stoneHi);
    S.poly(inner.map(p=>F.point(p[0],.27,p[1])),lit?[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]:P.glassR);
    for(let i=0;i<inner.length;i++){const j=(i+1)%inner.length;S.beam(F.point(inner[i][0],.32,inner[i][1]),F.point(inner[j][0],.32,inner[j][1]),P.frame,.16);}
  }

  function orientedRect(cx,cy,angle,s0,s1,half){
    const ux=Math.cos(angle),uy=Math.sin(angle),vx=-uy,vy=ux,at=(s,t)=>[cx+ux*s+vx*t,cy+uy*s+vy*t];
    return{points:[at(s0,-half),at(s1,-half),at(s1,half),at(s0,half)],at,ux,uy,vx,vy};
  }

  function orientedHip(A,R,s0,s1,half,z,rise){
    const {S,P}=A,q=R.points,inset=Math.min(half,(s1-s0)*.27),a=R.at(s0+inset,0),b=R.at(s1-inset,0);
    const pieces=[[[q[0],q[1],b,a],[-R.vx,-R.vy]],[[q[1],q[2],b],[R.ux,R.uy]],[[q[2],q[3],a,b],[R.vx,R.vy]],[[q[3],q[0],a],[-R.ux,-R.uy]]];
    for(const [poly,n]of pieces)S.poly(poly.map(p=>[...p,p===a||p===b?z+rise:z]),A.K.slate(A.dark(...n)));
    S.beam([...a,z+rise+.06],[...b,z+rise+.06],P.lead,.3);
  }

  function faceSolid(A,F,u0,u1,d0,d1,z0,z1){
    const {S,P}=A,a=F.point(u0,d0,z0),b=F.point(u1,d0,z0),c=F.point(u1,d1,z0),d=F.point(u0,d1,z0),up=p=>[p[0],p[1],z1];
    S.poly([up(a),up(b),up(c),up(d)],P.stoneHi);
    for(const [p,q]of[[a,b],[b,c],[c,d],[d,a]])S.poly([p,q,up(q),up(p)],A.dark(F.nx,F.ny)?P.stoneR:P.stone);
  }

  function worldBand(A,F,z,depth){faceSolid(A,F,-.2,F.length+.2,0,depth,z,z+.65);}

  function hipRoof(A,x0,x1,y0,y1,z,rise,alongX=true){
    const R=orientedRect((x0+x1)/2,(y0+y1)/2,alongX?0:Math.PI/2,-(alongX?x1-x0:y1-y0)/2,(alongX?x1-x0:y1-y0)/2,(alongX?y1-y0:x1-x0)/2);
    orientedHip(A,R,-(alongX?x1-x0:y1-y0)/2,(alongX?x1-x0:y1-y0)/2,(alongX?y1-y0:x1-x0)/2,z,rise);
    A.S.flat(x0,x1,y0,y1,z,A.P.woodR); // Closed overhang soffit, not an open floating hip.
  }

  function solidDoor(A,F,u,z,w,h,kind='wood'){
    const {P}=A;F.panel(u-.28,u+w+.28,z-.1,z+h+.3,P.stoneHi,.13);
    F.panel(u,u+w,z,z+h,A.mat(kind,F.nx,F.ny),.24);
    for(const xx of[u+.14,u+w/2,u+w-.14])F.panel(xx-.08,xx+.08,z+.12,z+h-.12,P.woodD,.35);
    for(const zz of[z+h*.32,z+h*.7])F.panel(u+.18,u+w-.18,zz-.09,zz+.09,P.woodR,.35);
    for(const xx of[u+w/2-.25,u+w/2+.25])F.panel(xx-.08,xx+.08,z+h*.45,z+h*.45+.45,P.ironD,.42);
  }

  function louver(A,F,u,z,w,h){
    const {S,P}=A;
    // Recessed dark backing plus projecting slats and jamb depth, never emissive.
    F.panel(u-.25,u+w+.25,z-.25,z+h+.25,P.stoneR,.12);F.panel(u,u+w,z,z+h,P.ironD,.2);
    for(const x of[u,u+w])S.poly([F.point(x,.2,z),F.point(x,.65,z),F.point(x,.65,z+h),F.point(x,.2,z+h)],P.stoneD);
    for(let zz=z+.16;zz<z+h-.16;zz+=.72)S.poly([F.point(u+.16,.27,zz+.44),F.point(u+w-.16,.27,zz+.44),F.point(u+w-.16,.68,zz+.08),F.point(u+.16,.68,zz+.08)],A.dark(F.nx,F.ny)?P.ironD:P.ironHi);
    F.panel(u-.26,u+w+.26,z+h,z+h+.32,P.stoneHi,.7);
  }

  // Ear clipping is required because a concave plan is not a convex fan.
  // Roof cells and both sides of every curved sheet use the same triangles.
  function triangulatePlan(points){
    const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    let q=points.slice(),area=q.reduce((s,p,i)=>s+p[0]*q[(i+1)%q.length][1]-p[1]*q[(i+1)%q.length][0],0);
    if(area<0)q.reverse();const out=[];
    while(q.length>3){
      let cut=false;
      for(let i=0;i<q.length;i++){
        const a=q[(i+q.length-1)%q.length],b=q[i],c=q[(i+1)%q.length];
        if(cross(a,b,c)<=1e-10)continue;
        if(q.some(p=>p!==a&&p!==b&&p!==c&&cross(a,b,p)>=-1e-10&&cross(b,c,p)>=-1e-10&&cross(c,a,p)>=-1e-10))continue;
        out.push([a,b,c]);q.splice(i,1);cut=true;break;
      }
      if(!cut)throw Error('wave046 non-simple or degenerate plan');
    }
    if(q.length===3&&Math.abs(cross(...q))>1e-10)out.push(q);
    return out;
  }
  function roofFace(A,points){
    for(const [a,b,c]of triangulatePlan(points)){
      const u=b.map((v,j)=>v-a[j]),v=c.map((x,j)=>x-a[j]);
      let nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0];
      if(nz<0){nx=-nx;ny=-ny;}const len=Math.hypot(nx,ny)||1;
      A.S.poly([a,b,c],A.K.slate(A.dark(nx/len,ny/len)));
    }
  }
  function roofSheet(A,points,thick=.4){
    for(const t of triangulatePlan(points)){roofFace(A,t);A.S.poly(t.map(p=>[p[0],p[1],p[2]-thick]),A.P.woodR);}
  }
  function roofShell(A,points,thick=.4){
    roofSheet(A,points,thick);
    for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];A.S.poly([a,b,[b[0],b[1],b[2]-thick],[a[0],a[1],a[2]-thick]],A.P.lead);}
  }
  function fascia(A,a,b,thick=.4){A.S.poly([a,b,[b[0],b[1],b[2]-thick],[a[0],a[1],a[2]-thick]],A.P.lead);}
  function edgeFace(A,a,b,inward=false){
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),sign=inward?-1:1;
    return face(A,a,b,sign*dy/len,-sign*dx/len);
  }
  function slopeWall(A,F,z0,h0,h1,kind){
    if(Math.max(h0,h1)<=z0+1e-9)return;
    const points=[F.point(0,0,z0),F.point(F.length,0,z0)];
    if(h1>z0+1e-9)points.push(F.point(F.length,0,h1));if(h0>z0+1e-9)points.push(F.point(0,0,h0));
    A.S.poly(points,A.mat(kind,F.nx,F.ny));
  }
  function offsetFace(A,F,d){return Object.assign(A.S.face(F.point(0,d,0).slice(0,2),F.point(F.length,d,0).slice(0,2),F.nx,F.ny),{nx:F.nx,ny:F.ny});}

  // Quoins and plinth courses are actual projecting masonry, not image overlays.
  function dress(A,F,z1,quoin=true){
    worldBand(A,F,.65,.3);worldBand(A,F,2.0,.2);
    if(quoin)for(const u of[.05,F.length-.6])for(let z=2.7;z<z1-.6;z+=1.8)faceSolid(A,F,u,u+.55,0,.18,z,Math.min(z+1.2,z1));
  }
  function triangleHip(A,q,z,apex){
    for(let i=0;i<3;i++){roofSheet(A,[[...q[i],z],[...q[(i+1)%3],z],apex]);fascia(A,[...q[i],z],[...q[(i+1)%3],z]);}
    for(const p of q)A.S.beam([...p,z+.04],apex,A.P.lead,.24);
  }
  function completeHip(A,x0,x1,y0,y1,z,rise){
    const inset=Math.min((x1-x0)/2,(y1-y0)*.26),cx=(x0+x1)/2,a=[cx,y0+inset,z+rise],b=[cx,y1-inset,z+rise];
    const q=[[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]];
    for(const pts of[[q[0],q[1],a],[q[1],q[2],b,a],[q[2],q[3],b],[q[3],q[0],a,b]])roofSheet(A,pts);
    for(let i=0;i<4;i++)fascia(A,q[i],q[(i+1)%4]);A.S.beam(a,b,A.P.lead,.3);
  }
  function ovalWindow(A,F,u,z,rx,rz){
    const {S,K,P}=A,pts=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return F.point(u+rx*Math.cos(a),.24,z+rz*Math.sin(a));});
    S.poly(pts,[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]);K.ring(S,F,u,z,rx+.32,rz+.32,.32,.3,P.stoneHi,24);
    S.beam(F.point(u,.35,z-rz+.2),F.point(u,.35,z+rz-.2),P.frame,.18);S.beam(F.point(u-rx+.2,.35,z),F.point(u+rx-.2,.35,z),P.frame,.18);
  }

  // Material-independent closed sheets: every top triangle has a matching
  // underside; exposed edges receive real vertical fascia, never screen lines.
  function sheet(A,q,m,thick=.4){
    for(const t of triangulatePlan(q)){A.S.poly(t,m);A.S.poly(t.map(p=>[p[0],p[1],p[2]-thick]),A.P.woodR);}
  }
  function shell(A,q,m,thick=.4){sheet(A,q,m,thick);for(let i=0;i<q.length;i++)fascia(A,q[i],q[(i+1)%q.length],thick);}
  function gableBodyRoof(A,x0,x1,y0,y1,z,rise,axis,kind='brick'){
    const cx=(x0+x1)/2,cy=(y0+y1)/2;
    if(axis==='x'){
      roofShell(A,[[x0,y0,z],[x1,y0,z],[x1,cy,z+rise],[x0,cy,z+rise]]);
      roofShell(A,[[x0,cy,z+rise],[x1,cy,z+rise],[x1,y1,z],[x0,y1,z]]);
      for(const x of[x0,x1])A.S.poly([[x,y0,z-.4],[x,y1,z-.4],[x,cy,z+rise-.4]],A.mat(kind,x===x0?-1:1,0));
      A.S.beam([x0,cy,z+rise],[x1,cy,z+rise],A.P.lead,.32);
    }else{
      roofShell(A,[[x0,y0,z],[cx,y0,z+rise],[cx,y1,z+rise],[x0,y1,z]]);
      roofShell(A,[[cx,y0,z+rise],[x1,y0,z],[x1,y1,z],[cx,y1,z+rise]]);
      for(const y of[y0,y1])A.S.poly([[x0,y,z-.4],[x1,y,z-.4],[cx,y,z+rise-.4]],A.mat(kind,0,y===y0?-1:1));
      A.S.beam([cx,y0,z+rise],[cx,y1,z+rise],A.P.lead,.32);
    }
  }
  function archTimber(A,F,u,z,w,h){
    const {S,P}=A,c=u+w/2,spring=z+h-w/2;
    const outline=[[u,z],[u+w,z],...Array.from({length:17},(_,i)=>{const a=i*Math.PI/16;return[c+w/2*Math.cos(a),spring+w/2*Math.sin(a)];})];
    S.poly(outline.map(p=>F.point(p[0],.15,p[1])),P.stoneHi);
    S.poly(outline.map(p=>F.point(c+(p[0]-c)*.95,.25,z+.15+(p[1]-z)*.96)),A.mat('wood',F.nx,F.ny));
    // The upper fanlight occupies the arch itself, with timber doors below.
    const fan=Array.from({length:17},(_,i)=>{const a=i*Math.PI/16;return F.point(c+(w/2-.45)*Math.cos(a),.30,spring+(w/2-.45)*Math.sin(a));});
    S.poly(fan,[A.dark(F.nx,F.ny)?P.glassR:P.glass,P.warm]);
    for(let i=1;i<6;i++)F.panel(u+w*i/6-.07,u+w*i/6+.07,z+.3,spring-.15,P.woodD,.36);
    F.panel(u+.25,u+w-.25,spring-.18,spring+.08,P.frame,.38);
    S.beam(F.point(c,.37,z+.3),F.point(c,.37,spring),P.ironD,.16);
    for(const a of[Math.PI/4,Math.PI/2,3*Math.PI/4])S.beam(F.point(c,.38,spring),F.point(c+(w/2-.5)*Math.cos(a),.38,spring+(w/2-.5)*Math.sin(a)),P.frame,.15);
  }
  function barrel(A,cx,r,y0,y1,spring,rise,kind='brick',segments=24){
    const {S,P}=A,at=(i,y)=>{const a=Math.PI-i*Math.PI/segments;return[cx+r*Math.cos(a),y,spring+rise*Math.sin(a)];};
    for(let i=0;i<segments;i++){
      const q=[at(i,y0),at(i+1,y0),at(i+1,y1),at(i,y1)],angle=Math.PI-(i+.5)*Math.PI/segments;
      sheet(A,q,A.dark(Math.cos(angle),0)?P.slateHi:P.lead);
      for(const y of[y0,y1]){const a=at(i,y),b=at(i+1,y);S.poly([[a[0],y,.6],[b[0],y,.6],[b[0],y,b[2]-.4],[a[0],y,a[2]-.4]],A.mat(kind,0,y===y0?-1:1));fascia(A,a,b);}
      // Fine restrained corrugation follows the actual roof rather than a decal.
      for(const y of[y0+1.4,y0+5.4,y0+9.4,y0+13.4,y0+17.4,y0+21.4].filter(y=>y<y1)){
        const a=at(i,y),b=at(i+1,y);S.beam(a,b,P.slateHi,.08);
      }
    }
    for(const i of[0,segments])fascia(A,at(i,y0),at(i,y1));
    return{at};
  }

/* WAVE046 NEW AUTHORED MODELS */
  function merememorial(row,view){
    const A=context(row,view),{S,P}=A;
    // One aisleless nave. The front masonry is genuinely cut around its door.
    const left=face(A,[9,8],[9,28],-1,0),right=face(A,[23,28],[23,8],1,0),front=face(A,[9,28],[23,28],0,1);
    S.wall([9,8],[9,28],.6,16.8,A.mat('stone',-1,0));S.wall([23,28],[23,8],.6,16.8,A.mat('stone',1,0));S.wall([23,8],[9,8],.6,16.8,A.mat('stone',0,-1));
    for(const [x0,x1]of[[9,14],[18,23]])S.wall([x0,28],[x1,28],.6,16.8,A.mat('stone',0,1));
    S.poly([[14,28,8],[16,28,10.4],[16,28,16.8],[14,28,16.8]],A.mat('stone',0,1));S.poly([[16,28,10.4],[18,28,8],[18,28,16.8],[16,28,16.8]],A.mat('stone',0,1));
    const door=[[14,28,.6],[18,28,.6],[18,28,8],[16,28,10.4],[14,28,8]],inner=door.map(p=>[p[0],27.35,p[2]]);
    S.poly(inner,A.mat('wood',0,1));for(let i=0;i<5;i++)S.poly([door[i],door[(i+1)%5],inner[(i+1)%5],inner[i]],P.stoneR);
    S.beam([16,27.42,.8],[16,27.42,10],P.woodD,.18);for(const z of[3,6])S.beam([14.2,27.43,z],[17.8,27.43,z],P.woodD,.18);
    gableBodyRoof(A,9,23,8,28,17.2,11.8,'y','stone');
    for(const u of[4.1,6.1,13.8,15.8])for(const F of[left,right])A.pane(F,u,5.1,1.35,8.4,'pointed',true);
    for(const u of[4.3,6.2,8.1])A.pane(front,u,13.7,1.6,6.8,'pointed',true);
    for(const x of[8.1,23])for(const y of[10,18,25.8]){A.volume(x,x+.9,y,y+1.2,.6,6.4,'stone');A.volume(x+.12,x+.78,y+.1,y+1.1,6.4,9.2,'stone');}
    const ap=[[12,8],[12,4.5],[16,2.2],[20,4.5],[20,8]],af=planBlock(A,ap,.6,11.8,'stone',false),apex=[16,6.3,18.1];
    for(let i=0;i<ap.length;i++){roofShell(A,[[...ap[i],12.2],[...ap[(i+1)%5],12.2],apex]);if(i<4)A.pane(af[i],af[i].length/2-.65,4.1,1.3,5.9,'pointed',true);}
    const ves=A.volume(23,29,12,20,.6,8.2,'stone',false);
    roofShell(A,[[23,12,11.5],[29,12,8.6],[29,20,8.6],[23,20,11.5]]);
    slopeWall(A,ves.front,8.2,11.1,8.2,'stone');slopeWall(A,ves.back,8.2,8.2,11.1,'stone');
    A.pane(ves.right,1.4,3.5,2.2,2.8,'rect',true);solidDoor(A,ves.front,1.8,.65,2.6,6.1);
    // Bellcote: three thick stone piers and two independent curved intrados.
    // No polygon crosses either aperture, and both faces are open through 1.4u.
    for(const [a,b]of[[12.1,13],[15.4,16.6],[19,19.9]])A.volume(a,b,27.4,28.8,27.8,34.2,'stone');
    A.volume(12.1,19.9,27.4,28.8,22.1,29.4,'stone');
    for(const cx of[14.2,17.8])for(let i=0;i<12;i++){
      const a=Math.PI-i*Math.PI/12,b=Math.PI-(i+1)*Math.PI/12,x0=cx+1.2*Math.cos(a),x1=cx+1.2*Math.cos(b),z0=31.6+1.2*Math.sin(a),z1=31.6+1.2*Math.sin(b);
      for(const y of[27.4,28.8])S.poly([[x0,y,z0],[x1,y,z1],[x1,y,34.2],[x0,y,34.2]],A.mat('stone',0,y===27.4?-1:1));
      S.poly([[x0,27.4,z0],[x1,27.4,z1],[x1,28.8,z1],[x0,28.8,z0]],P.stoneD);
    }
    gableBodyRoof(A,11.8,20.2,27.1,29.1,34.6,2,'x','stone');
    for(const F of[left,right])dress(A,F,16.8);worldBand(A,front,.65,.22);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleAislelessNave:true,narrowFiveSidedApse:true,oneSideVestry:true,twinOpenRoundBellcote:true,recessedPointedDoor:true}};
  }

  function guelderlace(row,view){
    const A=context(row,view),{S,P}=A;
    const west=A.volume(3,10,4,28,.6,14.4,'brick',false),east=A.volume(22,29,4,28,.6,17.4,'brick',false);
    gableBodyRoof(A,3,10,4,28,14.8,6.4,'y');gableBodyRoof(A,22,29,4,28,17.8,7.2,'y');
    const q=[[10,4],[22,23],[22,28],[10,9]],fs=planBlock(A,q,.6,8.4,'brick',false),height=x=>10.8-(x-10)/12;
    roofShell(A,q.map(p=>[...p,height(p[0])]));for(const F of fs)slopeWall(A,F,8.4,height(F.point(0,0,0)[0])-.4,height(F.point(F.length,0,0)[0])-.4,'brick');
    for(const [F,u]of[[fs[0],5],[fs[2],5]]){solidDoor(A,F,u,.65,3,6.3);A.pane(F,11,3.9,5.5,3.8,'mullion',true);}
    for(const f of[west,east]){
      for(const F of[f.left,f.right])A.windows(F,1,4,5.1,0,3.9,5.8,'mullion');
      for(const F of[f.front,f.back])for(const u of[.9,4.4])A.pane(F,u,10.3,1.7,4,'rect',true);
      for(const F of Object.values(f))dress(A,F,f===west?14.4:17.4);
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,trueNPlan:true,twoUnequalParallelGables:true,lowEnclosedDiagonalRoom:true,twoOpenTriangularCourts:true}};
  }

  function gorsepicture(row,view){
    const A=context(row,view),{S,P}=A,q=[[7,3],[25,3],[28,6],[28,17],[25,20],[7,20],[4,17],[4,6]],fs=planBlock(A,q,.6,12,'brick',false),a=[10,11.5,17.4],b=[22,11.5,17.4];
    const raised=[a,b,b,b,b,a,a,a];for(let i=0;i<8;i++){const j=(i+1)%8,pts=[[...q[i],12.4],[...q[j],12.4],raised[j]];if(raised[i]!==raised[j])pts.push(raised[i]);roofShell(A,pts);}
    S.beam(a,b,P.lead,.34);
    for(let i=0;i<8;i++){dress(A,fs[i],12);if([1,2,3,6,7].includes(i))A.pane(fs[i],fs[i].length/2-.8,8.1,1.6,2.5,'rect',true);}
    solidDoor(A,fs[0],7,.65,3.2,7);
    const foyer=A.volume(11,21,20,29,.6,21.2,'brick',false);gableBodyRoof(A,11,21,20,29,21.6,7.6,'y');
    for(const u of[.8,5.7])solidDoor(A,foyer.front,u,.65,3.5,7.4);
    A.pane(foyer.front,2,12.0,6,5.8,'arch',true);
    for(const F of[foyer.left,foyer.right])A.windows(F,2,2,3.8,9.7,2,5.4,'rect');
    for(const F of Object.values(foyer))dress(A,F,21.2);
    S.box(10.5,21.5,29,30.2,9.2,9.7,P.stone,P.stoneR,P.stoneHi);
    for(const x of[11.2,20.2])S.poly([[x,29,7.9],[x,30.1,9.2],[x,29,9.2]],P.stoneR);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,keyholePlan:true,clippedOctagonalLowAuditorium:true,narrowTallGabledFoyer:true,oneShallowHip:true,pairedTimberDoorsAndFanlight:true}};
  }

  function comfreyambulance(row,view){
    const A=context(row,view),{S,P}=A,garage=A.volume(3,19,6,28,.6,13.6,'brick',false);
    barrel(A,11,8,6,28,14,7);
    archTimber(A,garage.front,2.5,.65,11,12.2);
    A.windows(garage.left,1,4,9.2,0,3.2,2.7,'ribbon');A.pane(garage.right,2.8,9.2,5.5,2.7,'ribbon',true);
    const house=A.volume(23,30,4,15,.6,21.8,'brick',false);completeHip(A,23,30,4,15,22.2,5.2);
    for(const F of[house.front,house.back,house.right])A.windows(F,2,2,4.5,9,1.7,5.5,'rect');
    const link=A.volume(19,23,8,15,.6,8.4,'brick',false);roofShell(A,[[19,8,8.8],[23,8,8.8],[23,15,8.8],[19,15,8.8]]);solidDoor(A,link.front,.65,.65,2.7,6.1);A.pane(link.back,.75,3.7,2.5,3,'rect',true);
    for(const F of Object.values(house))dress(A,F,21.8);for(const F of[garage.left,garage.right])dress(A,F,13.6);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,highWallSingleBarrelGarage:true,twoStoreyHippedKeeperHouse:true,lowRecessedEntryLink:true,trueOpenFrontApron:true,wideRoundCarriageFanlight:true}};
  }

  function marjoramkitchen(row,view){
    const A=context(row,view),{S,P}=A,f=A.volume(5,27,4,26,.6,16.8,'brick',false),q=[[5,4,17.2],[27,4,17.2],[27,26,17.2],[5,26,17.2]],drain=[16,15,11.2];
    // Inward-draining faces have inward horizontal normals, opposite the walls.
    // Keep the frozen four closed planes and exact low drain; visible standing
    // lead seams are real world-space hardware, never a painted screen outline.
    for(let i=0;i<4;i++){const n=[[0,-1],[1,0],[0,1],[-1,0]][i],at=(j,t)=>q[j].map((v,k)=>v+(drain[k]-v)*t);
      sheet(A,[q[i],q[(i+1)%4],drain],A.dark(-n[0],-n[1])?P.slateHi:P.lead);fascia(A,q[i],q[(i+1)%4]);
      S.beam(q[i],at(i,.91),P.slateR,.36);
      // Two real lead-sheet overlap courses follow the inclined planes. Their
      // nested contours fall towards the drain, unlike a convex hipped roof.
      for(const t of[1/3,2/3])S.beam(at(i,t),at((i+1)%4,t),P.slateR,.24);
    }
    S.flat(15.3,16.7,14.3,15.7,11.22,P.ironD);
    for(const F of[f.left,f.right]){A.pane(F,2.3,3.8,7.4,4.9,'mullion',true);for(const u of[13,17])A.pane(F,u,8.8,2,2.2,'ribbon',true);}
    A.windows(f.back,1,3,3.7,0,4.8,5.1,'mullion');A.pane(f.front,1.2,3.7,4.7,5.1,'mullion',true);A.pane(f.front,16,2.2,3.8,6.5,'rect',true);
    const pantry=A.volume(12,20,26,30,.6,7.4,'brick',false);shell(A,[[12,26,7.8],[20,26,7.8],[20,30,7.8],[12,30,7.8]],P.lead);solidDoor(A,pantry.front,1.3,.65,5.4,6.2);
    for(const F of Object.values(f)){dress(A,F,16.8);worldBand(A,F,15.8,.3);}
    S.beam([5.3,3.7,16.5],[5.3,3.7,1],P.ironD,.25);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,closedFourPlaneInvertedPyramid:true,fourHighEavesOneLowDrain:true,lowFlatPantryEntry:true,realRoofThickness:true,noCentralOpening:true}};
  }

  function boragedental(row,view){
    const A=context(row,view),{S,P}=A,core=A.volume(10,22,7,19,.6,21,'brick',false);completeHip(A,10,22,7,19,21.4,6.5);
    const left=A.volume(4,10,7,25,.6,9.6,'brick',false),right=A.volume(22,28,7,25,.6,9.6,'brick',false);
    const roof=[[[4,7,10],[10,7,13],[10,19,13],[4,19,10]],[[4,19,10],[10,19,13],[4,25,10]],[[4,25,10],[10,19,13],[10,25,10]],[[10,19,13],[22,19,13],[22,25,10],[10,25,10]],[[22,19,13],[28,19,10],[28,25,10]],[[22,19,13],[28,25,10],[22,25,10]],[[22,7,13],[28,7,10],[28,19,10],[22,19,13]]];
    for(const q of roof)roofShell(A,q);
    for(const F of[left.back,right.back])slopeWall(A,F,9.6,F===left.back?12.6:9.6,F===left.back?9.6:12.6,'brick');
    slopeWall(A,face(A,[10,25],[10,19],1,0),9.6,9.6,12.6,'brick');slopeWall(A,face(A,[22,19],[22,25],-1,0),9.6,12.6,9.6,'brick');
    for(const x of[10,20.5])A.volume(x,x+1.5,23.5,25,.6,9.6,'stone');
    S.box(10,22,24.2,25,9.2,9.6,P.stone,P.stoneR,P.stoneHi);S.flat(10,22,19,25,.6,P.pave);
    solidDoor(A,core.front,4.3,.65,3.4,7.9);A.pane(core.front,1,3.2,2.3,4.4,'rect',true);A.pane(core.front,8.7,3.2,2.3,4.4,'rect',true);
    for(const F of Object.values(core))for(const u of[1.8,7.7])A.pane(F,u,14,2.5,5.4,'rect',true);
    for(const F of[left.left,right.right])A.windows(F,1,3,3.2,0,4.2,4.3,'mullion');A.pane(left.front,.8,3.2,4.4,4.3,'mullion',true);solidDoor(A,right.front,1.6,.65,2.8,6.4);
    for(const F of[core.back,left.left,right.right])dress(A,F,F===core.back?21:9.6);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,compactHippedSquareCore:true,continuousLowCWrap:true,twoTurnedRoofCorners:true,trueOpenRecessedFrontPorch:true,exposedHighRear:true}};
  }

  function gambrel(A,x0,x1,y0,y1,z,rise,axis){
    const {S,P}=A,width=axis==='x'?y1-y0:x1-x0,middle=axis==='x'?(y0+y1)/2:(x0+x1)/2;
    const profile=[[-width/2,z],[-width*.25,z+rise*.72],[0,z+rise],[width*.25,z+rise*.72],[width/2,z]];
    const at=(p,end)=>axis==='x'?[end,middle+p[0],p[1]]:[middle+p[0],end,p[1]],lo=axis==='x'?x0:y0,hi=axis==='x'?x1:y1;
    for(let i=0;i<4;i++)roofShell(A,[at(profile[i],lo),at(profile[i],hi),at(profile[i+1],hi),at(profile[i+1],lo)]);
    for(const end of[lo,hi]){
      const points=[at(profile[0],end),...profile.slice(1).map(p=>at(p,end))];
      S.poly(points.map(p=>[p[0],p[1],p[2]-.4]),A.mat('brick',axis==='x'?(end===lo?-1:1):0,axis==='x'?0:(end===lo?-1:1)));
    }
    for(const i of[1,2,3])S.beam(at(profile[i],lo),at(profile[i],hi),P.lead,i===2?.32:.17);
  }
  function hyssopupholstery(row,view){
    const A=context(row,view),low=A.volume(3,29,3,13,.6,11.8,'brick',false),high=A.volume(3,11,13,29,.6,17,'brick',false);
    gambrel(A,3,29,3,13,12.2,8.2,'x');gambrel(A,3,11,13,29,17.4,9.6,'y');
    for(const u of[11,20])A.pane(low.back,u,4.8,5.1,5.6,'arch',true);for(const u of[9,21])A.pane(low.front,u,4.8,3.6,5.6,'arch',true);
    solidDoor(A,low.front,13,.65,6.5,7.2);A.pane(low.right,2.5,4,4.8,5.8,'arch',true);
    for(const F of[high.left,high.right])for(const u of(F===high.left?[2.2,6.8,11.4]:[2.2,11.4]))A.pane(F,u,5.2,2.2,8,'rect',true);
    solidDoor(A,high.right,6.1,.65,2.7,7.5);
    for(const u of[1,4.8])A.pane(high.front,u,18.1,2.1,3.4,'rect',true);A.pane(high.front,2.5,4.5,3,7.1,'rect',true);
    for(const F of[low.back,low.right,high.left,high.right])dress(A,F,F===low.back||F===low.right?11.8:17);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,groundedUnequalLGambrels:true,twoPerpendicularBrokenPitches:true,clearRectangularLoadingYard:true,resolvedLowerRoofAgainstHighWall:true,groundLevelLoadingDoor:true}};
  }

  function dittanygeology(row,view){
    const A=context(row,view),{S,P}=A,N=24,q=Array.from({length:N},(_,i)=>[16+7.5*Math.cos(i*2*Math.PI/N),16+7.5*Math.sin(i*2*Math.PI/N)]),fs=planBlock(A,q,.6,14.8,'stone',false),peak=[16,16,25.2];
    for(let i=0;i<N;i++)roofShell(A,[[...q[i],15.2],[...q[(i+1)%N],15.2],peak]);
    const long=A.volume(2.2,10,12,20,.6,9.4,'stone',false),short=A.volume(22,29.8,13,19,.6,12.4,'stone',false);
    gableBodyRoof(A,2.2,10,12,20,9.8,5.6,'x','stone');gableBodyRoof(A,22,29.8,13,19,12.8,4.4,'x','stone');
    for(const i of[3,5,7,9,15,17,19,21])A.pane(fs[i],.3,5.2,1.25,6.2,'arch',true);
    solidDoor(A,fs[6],.1,.65,1.7,7.1);
    for(const F of[long.front,long.back])for(const u of[1.1,3.6,6.1])A.pane(F,u,5,1.2,2.8,'rect',true);
    A.pane(short.front,1.3,4.5,5.2,5.3,'mullion',true);solidDoor(A,short.right,1.4,.65,3.2,7.3);
    A.pane(long.left,1.7,3,4.5,4.8,'mullion',true);A.pane(short.back,2,4.8,4,5.3,'mullion',true);
    for(let i=0;i<N;i++)dress(A,fs[i],14.8,false);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleRoundStoneReadingRoom:true,centredConicalSlateRoof:true,twoOpposedUnequalStraightGabledWings:true,noCommonRectangularPedestal:true}};
  }

  function chamomilestory(row,view){
    const A=context(row,view),{S,P}=A;
    // Capsule hips are convex in both principal sections. The broad short ridge
    // is not a pointed keel; two local eave lifts form real eyebrow window heads.
    const bump=x=>[12.8,19.2].reduce((n,c)=>n+(Math.abs(x-c)<1.8?2.4*Math.cos((x-c)*Math.PI/3.6)**2:0),0);
    function outline(rx,ry,z,lift){
      const p=[];for(let i=0;i<=12;i++){const a=-Math.PI/2+i*Math.PI/12;p.push([21+rx*Math.cos(a),16+ry*Math.sin(a),z]);}
      for(let i=1;i<20;i++){const x=21-i*.5;p.push([x,16+ry,z+lift*bump(x)]);}
      for(let i=0;i<=12;i++){const a=Math.PI/2+i*Math.PI/12;p.push([11+rx*Math.cos(a),16+ry*Math.sin(a),z]);}
      for(let i=1;i<20;i++)p.push([11+i*.5,16-ry,z]);return p;
    }
    const wall=outline(7,7.4,8.6,1),fs=[];
    for(let i=0;i<wall.length;i++){
      const a=wall[i],b=wall[(i+1)%wall.length],F=edgeFace(A,a,b);fs.push(F);
      slopeWall(A,F,.6,a[2],b[2],'stone');
    }
    const levels=[0,Math.PI/12,Math.PI/6,Math.PI/4,Math.PI/3,5*Math.PI/12],rings=levels.map((a,i)=>outline(8*Math.cos(a),8.5*Math.cos(a),9+10.8*Math.sin(a),i===0?1:i===1?.42:0));
    for(let k=0;k<rings.length-1;k++)for(let i=0;i<rings[k].length;i++){
      const j=(i+1)%rings[k].length,a=rings[k][i],b=rings[k][j],c=rings[k+1][j],d=rings[k+1][i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
      sheet(A,[a,b,c,d],A.dark(dy/len,-dx/len)?P.wood:P.woodHi,.8);
    }
    const top=rings.at(-1);for(let i=0;i<top.length;i++){
      const j=(i+1)%top.length,a=top[i],b=top[j],c=[Math.max(11,Math.min(21,b[0])),16,19.8],d=[Math.max(11,Math.min(21,a[0])),16,19.8],q=[a,b,c];if(Math.hypot(c[0]-d[0],c[1]-d[1])>1e-8)q.push(d);sheet(A,q,a[1]>16?P.woodHi:P.wood,.8);
    }
    for(let i=0;i<rings[0].length;i++){
      const j=(i+1)%rings[0].length;fascia(A,rings[0][i],rings[0][j],.8);
      // Continuous closed overhang soffit physically meets the low wall plate,
      // including the two raised eyebrow heads. No floating rounded roof.
      S.poly([rings[0][i].map((v,k)=>k===2?v-.8:v),rings[0][j].map((v,k)=>k===2?v-.8:v),wall[j],wall[i]],P.woodR);
    }
    const front=face(A,[11,23.4],[21,23.4],0,1),rear=face(A,[21,8.6],[11,8.6],0,-1);
    solidDoor(A,front,4.05,.65,1.9,6.2);
    for(const c of[12.8,19.2])A.pane(front,c-11-1.05,4.0,2.1,5.5,'arch',true);
    for(const u of[1.3,6.8])A.pane(rear,u,3.1,1.9,3.1,'rect',true);
    for(const i of[5,7,39,41]){const F=fs[i];if(F.length>1.2)A.pane(F,F.length/2-.5,3.2,1,2.5,'rect',true);}
    A.volume(22.8,24.6,12.4,14.2,17.6,22,'stone');S.box(22.5,24.9,12.1,14.5,22,22.6,P.stone,P.stoneR,P.stoneHi);S.flat(22.9,24.5,12.5,14.1,22.62,P.ink);
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,lowLongStoneCottage:true,convexRoundedThatchHips:true,broadSoftRidge:true,twoActualRaisedEyebrowEaveCuts:true,thickRoofAndSquatStoneChimney:true}};
  }

  function myrtlewireless(row,view){
    const A=context(row,view),{S,P}=A;
    // Spring is only 2u. The semicylinder, not a tall masonry sidewall, is the
    // dominant long elevation. The same 24 facets close both masonry end walls.
    const plinth=A.volume(5.5,26.5,3,27,.6,1.6,'brick',false),B=barrel(A,16,10.5,3,27,2,10.5,'brick',24),front=face(A,[5.5,27],[26.5,27],0,1),rear=face(A,[26.5,3],[5.5,3],0,-1);
    A.pane(front,9,3.1,8.3,4.4,'mullion',true);roundWindow(A,rear,10.5,7.1,1.6,true);
    const entry=A.volume(8,14,27,30,.6,5.6,'brick',false);shell(A,[[8,27,6],[14,27,6],[14,30,6],[8,30,6]],P.lead);solidDoor(A,entry.front,1.6,.65,2.8,4.7);A.pane(entry.left,.8,2,1.2,2.3,'rect',true);
    for(const index of[5,18])for(const yy of[9,17]){
      const a=B.at(index,yy),b=B.at(index+1,yy),c=B.at(index+1,yy+3),d=B.at(index,yy+3),q=[a,b,c,d];
      const dx=b[0]-a[0],dz=b[2]-a[2],len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;
      const glass=q.map(p=>[p[0]+nx*.035,p[1],p[2]+nz*.035]);S.poly(glass,[A.dark(nx,0)?P.glassR:P.glass,P.warm]);
      for(let i=0;i<4;i++)S.beam(glass[i],glass[(i+1)%4],P.frame,.12);
      S.beam([(glass[0][0]+glass[1][0])/2,yy,(glass[0][2]+glass[1][2])/2],[(glass[2][0]+glass[3][0])/2,yy+3,(glass[2][2]+glass[3][2])/2],P.frame,.12);
    }
    return{...A.finish(),details:{originalDesign:true,newModelBody:true,singleNearGroundSemicylindricalShell:true,lowBrickPlinthOnly:true,closedSemicircularMasonryEnds:true,offsetLowFlatVestibule:true,flushCurvedShellRooflights:true}};
  }

  const MODELS=Object.freeze({merememorial,guelderlace,gorsepicture,comfreyambulance,marjoramkitchen,boragedental,hyssopupholstery,dittanygeology,chamomilestory,myrtlewireless});
  function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave046 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave046 four world rotations only');if(!MODELS[id])throw Error('wave046 complete original model required: '+id);return MODELS[id](row,view);}
  function buildAll(){if(Object.keys(MODELS).length!==10)throw Error('wave046 complete ten models required');return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
  const candidateRows=()=>ROWS.filter(row=>Object.hasOwn(MODELS,row.id));
  root.BritishWaveArchitecture046=Object.freeze({rows:ROWS,build,buildAll,candidateRows});
})(typeof window==='undefined'?globalThis:window);
