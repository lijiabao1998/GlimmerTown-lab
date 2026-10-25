/* GPT-048 ten original English village structures; no historical model calls. */
(function(root){
'use strict';
const ROWS=Object.freeze([
  {
    "id": "foxglovecharter",
    "nm": "毛地黃鄉約館",
    "en": "Foxglove Charter House",
    "v": 920,
    "shape": "two-jettied-end-rooms-fullheight-recessed-central-hall-one-common-hip",
    "design": "`v920..923`. Fictional use: local charter and community-history reading rooms.\n\n**Whole-building idea.** A long low timber hall has two substantial enclosed, two-storey end bays. Only those end bays project/jettied outward at upper-storey height. The entire central hall facade stays recessed behind them from ground to eaves. One uninterrupted long, ordinary hipped roof covers the whole composition. A real eaves beam spans the shallow centre setback. There is no upper bridge room across the central hall, no ground-level tunnel and no internal courtyard.\n\n**Plan and section.** Use one common roof rectangle `x3..29, y7..26` (26×19), covering the complete end-room and central-hall envelope. End bays occupy roughly `x4..11` and `x21..28`, with rear walls at `y8`; their ground fronts end at `y22`, upper fronts at `y25`. The common front roof eave is at `y26`, one unit beyond both upper end fronts; its rear eave is at `y7`, one unit beyond their rear walls. Thus neither end-room body protrudes outside the common roof. The central enclosed hall is `x11..21`, its front at `y21`. All room bases are grounded. End-floor level about 9, shared eave about 20, ridge about 29. The central facade's 4-unit recession against the upper end bays is large enough to carry the form without deep hollow-space lighting. Between `x11..21,y21..26` there is only the covered exterior eaves recess: an actual spanning eaves beam supported at the two end-room sides, roof above, and open air below. No upper bridge room, spanning intermediate floor or hidden upper wall fills this recess. Rear walls stay continuous and readable.\n\n**Roof and openings.** One long hip, no separate end gables, no dormer forest. One tall central three-light hall window reads across the missing intermediate floor line; each end bay has separate lower casements and upper leaded rectangles. The public door is in the recessed central wall at ground level, with a small side-service door in an end wall. Give projecting end floors real soffits and short grounded-wall corbels. Timber framing supports the volume; it is not the only distinction.\n\n**Nearest prior assets.** `lavenham v100` has one continuously jettied upper hall across its frontage and a separate small porch; `hawthornloom v592` is a raised gambrel bridge spanning between two anchor rooms; `bessie v244` is a pair of five-storey narrow merchant houses; `brackenread v560` is an L with unequal crossing gables and an oriel. Also check `victorianGabledSemi006` / `UKR05`, whose two projecting gabled wings make a broad H-like house.\n\n**Material structural difference.** Two local end jetties + a full-height recessed **enclosed** centre + one unbroken hip; no bridge, two-gable pair, L, or all-frontage upper projection. Its central two-height facade and end domestic window scale are complementary.\n\n**Implementation/readability risk: low–medium.** Construct three closed room envelopes and two genuine upper projections, then a common hip. The centre setback must not be filled by a hidden generic upper box. Reject if all upper walls form one flat facade, if a bridge floor appears across the centre, or if tiny trim alone distinguishes it from Lavenham. Compare at native scale against Lavenham and Hawthorn before freezing.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "silverweedalpine",
    "nm": "銀葉委陵菜高山植物屋",
    "en": "Silverweed Alpine House",
    "v": 924,
    "shape": "four-near-ground-planar-glazed-pyramid-enclosure-clipped-low-entrance",
    "design": "`v924..927`. Fictional use: small village alpine-plant study/display house; no plant simulation.\n\n**Whole-building idea.** One broad square **pyramidal glazed enclosure** rises almost from ground level. All four faces are actual large triangular sloping roof/wall planes meeting a single apex. The building is predominantly the pyramid, not a tall glass room with a little pyramid cap. A modest low rectangular entrance vestibule penetrates one lower face.\n\n**Plan and section.** Main square about `x5..28, y6..29`, knee wall `z2.4`, apex about `z27` at the actual square centre. Front vestibule approximately `x13..20, y2..10`, door-head about 7.5 and low lead cap about 8.5. Resolve its finite intersection with the sloping front face by clipping that roof face into separate convex pieces. Do not leave a full triangular roof polygon running through the vestibule door or its occupied interior.\n\n**Roof and openings.** Four planar glazed slopes with a sparse, structural mullion grid and actual diagonal corner bars; low stone kerb/base. Opaque native glazing is intentional: this is not a request for transparent rendering or visible plants inside. A vertical timber/glass entrance door belongs to the vestibule, not a tilted door painted on the pyramid. There is no central lantern, sphere, open roof hole or ornamental needle.\n\n**Nearest prior assets.** `holtscout v728` is a long A-shell with two near-ground roof planes and vertical triangular end walls; `ferncourt v564` has two high, six-sided glazed pavilion walls below pointed roofs; `periwinklebell v912` is a solid square room with a dominant octagonal broach spire; `thistlenursery v628` has an upright central octagon, clerestory and apsidal wings. Pre-wave `manorConservatory014` and `UKF021-M` use upright-wall multi-span glasshouses. The superseded, unimplemented real wave11 garden list is not a source to copy.\n\n**Material structural difference.** Four near-ground triangular enclosure planes, a single apex, low knee wall and one modest penetrative entrance. This cannot be produced by recolouring the six-sided Fern Court or truncating an A-frame.\n\n**Implementation/readability risk: medium, bounded.** Planar pyramidal faces are simple; the only nontrivial operation is the finite door-vestibule intersection. Reject if normal-height square walls are added, if the roof becomes a mere cap, if it collapses into a long A-frame, or if the vestibule door is obstructed by roof geometry. This model should need no cavity or transparency repair.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "maddartutors",
    "nm": "茜草分科學舍",
    "en": "Madder Tutors' Rooms",
    "v": 928,
    "shape": "four-high-corner-hipped-rooms-low-enclosed-cross-foyer-open-exterior-notches",
    "design": "`v928..931`. Fictional use: four small tuition/work rooms connected by a shared foyer, without education-service changes.\n\n**Whole-building idea.** Four substantial square brick rooms occupy the corners of a compact plot. A much lower, fully enclosed cross-shaped foyer connects their inward corners. The four room roofs are separate complete pyramidal hips; the middle is a low flat lead roof. There is **no courtyard or open central hole**. Midpoint notches between outer rooms remain open outdoor recesses, making the four room blocks and low central connector legible.\n\n**Plan and section.** Use corner rooms approximately `[3,14]×[3,14]`, `[18,29]×[3,14]`, `[3,14]×[18,29]`, `[18,29]×[18,29]`. A low cross made from `x10..22,y14..18` plus `x14..18,y10..22` has finite 4-unit wall contacts with the inward portions of each room; do not join corners at one point. Room eaves may be 14, 18, 12 and 16, with 5-unit hips; the foyer roof stays around 8.5. Roof overhangs must not close the 4-unit exterior gaps.\n\n**Roof and openings.** Outer room faces each use a different useful aperture grouping: broad three-light study window, paired sashes, high horizontal art-work window, two tall narrow lights. Keep those restrained, not four arbitrary styles. The public ground door is on an outer corner-room face with direct foyer access inside; no hidden entrance deep in a four-unit slot is required. Foyer end faces can have modest rectangular glazing. All foundations are grounded.\n\n**Nearest prior assets.** `broomtranslations v836` is three contiguous collinear stepped hip-roof ranges; `rowdenmortuary v712` has two square pavilions and a recessed entrance; `rushfordlav v688` has one low cruciform body and outward monopitches under a small central cap; `elmglass v656` is three Y arms around a high central triangular lantern; `knapmediation v800` is two triangles around an open diagonal court.\n\n**Material structural difference.** Four detached-in-the-upper-section corner rooms tied by a **low solid cross**, with four separate dominant hips and no courtyard. It is not four copies of a windowed box pushed together into one square roof or an expanded Broom row. The low-middle/high-corner section is the reverse of high-central-hall families.\n\n**Implementation/readability risk: low–medium.** All walls and roofs are axis-aligned closed pieces. Critical checks are finite connector contact, no covered outside notch, no coplanar roof crossings and a visibly low centre from every oblique view. Reject if the centre becomes a tower, a courtyard hole appears, or only the count of roofs differentiates it from a contiguous row.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "restharrowsalt",
    "nm": "芒柄花道鹽庫",
    "en": "Restharrow Road-Salt Store",
    "v": 932,
    "shape": "long-inward-battered-stone-room-narrow-flat-roof-vertical-trapezoid-ends",
    "design": "`v932..935`. Fictional use: village road-maintenance material store exhibit; no inventories, snow clearing or road-service effects.\n\n**Whole-building idea.** A single long, heavy stone store has a **trapezoidal transverse section**: both long side walls lean conspicuously inward from a broad grounded base to a much narrower flat lead roof. The two short end walls remain vertical trapezoids. It is not a normal rectangular room with a pitched roof, a cone, a tapered circular tower or an earth-covered vault.\n\n**Plan and section.** Length `y5..28`; broad lower width `x4..28`; wall top at `z19`, narrowed to `x10..22`. Flat roof closes only this top 12-unit-wide strip. The long side-wall plane moves inward 6 units over its height, giving a visible section even without texture. No roof over the full broad base and no earth bank. A tiny attached low side cabinet, if retained at all, must remain subordinate and is not a novelty requirement.\n\n**Roof and openings.** A single narrow planar lead roof with modest coping, no pyramid cap. The principal closed double loading door is centred in a vertical trapezoid end wall, approximately 6 units wide and 9 high, at ground level. One side-person door belongs to the opposite vertical end; three sparse high vent lights follow the actual sloping long wall planes. Recess/frame geometry is mapped to those planes. There are no falsely vertical panes floating in front of sloped stone.\n\n**Nearest prior assets.** `coppicelecture v824` is a rectangular plan with vertical side walls and one continuously rising **roof along its length**; `heatherdye v664` has two square bodies widening upwards; `tamargauge v776` is a single concave-waisted six-rib tower; `cressice v716` is an earth-banked low vault; `landmarktheatre v400` consists of twin truncated circular cones; pre-wave warehouses are upright walls under ordinary gables.\n\n**Material structural difference.** One elongated inward-battered **wall body** under a narrow flat lid, with vertical trapezoidal door ends. The tapered dimension is transverse wall width, not roof rise, radius or a tower waist.\n\n**Implementation/readability risk: low.** Six main planar solid faces, plus apertures and coping. Keep vertical short-end door geometry straightforward. Reject if the side slopes become a gable roof resting above a normal room, the taper is merely a stone pattern, or the form becomes a truncated round cone. Native review must confirm both low broad foot and narrower top are visible.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "betonymarionette",
    "nm": "水蘇木偶工藝館",
    "en": "Betony Marionette Rooms",
    "v": 936,
    "shape": "three-coaxial-progressively-narrower-lower-gabled-occupied-rooms",
    "design": "`v936..939`. Fictional use: puppet making, storage and small display rooms; no theatre or animation mechanic.\n\n**Whole-building idea.** Three substantial enclosed gabled room volumes telescope **in one straight axis**, progressively narrowing and lowering toward the entrance. This is a single attached building with three clearly stepped eaves/ridges, not a tall box with a token porch. The largest rear room is a high assembly/storage room, the middle is a sizeable making room, the front is a smaller but real reception/display room.\n\n**Plan and section.** Rear `x4..28,y4..13`, eave24/ridge33; middle `x7..25,y13..22`, eave16/ridge24; front `x10..22,y22..29`, eave10/ridge16. All three ridge axes run north–south. They meet over finite whole-wall widths; the higher body's front wall visibly rises above the lower roof. Tune lengths to prevent the main rear gable from appearing to be an attached tower.\n\n**Roof and openings.** Three complete simple slate gables, with actual step walls and resolved lower-roof-to-higher-wall flashing. Rear room: high vertical pairs and broad side loading doors. Middle: wide work windows. Front: one low public door and two modest square-paned windows. No roof holes, fake loading doors, theatre emblem, puppets or tall sign needed. Do not project a front door above ground to manufacture height difference.\n\n**Nearest prior assets.** `gorsepicture v848` has one narrow **tall front** foyer joined to a broad **lower rear** clipped-octagonal auditorium; `brooktools v632` is a cranked Z of three skillions; `coppicelecture v824` is one uninterrupted wedge; `rowanclock v648` is a four-storey vertically stepped narrow town house with M roof; `cardington v192` is one uninterrupted high hangar; pre-wave ordinary barns have only a small porch/annex.\n\n**Material structural difference.** Three co-axial, co-dominant progressively wider/taller rooms with separate ordinary gables and two real full-width section steps. No angular plan, slope roof, rear polygon or tall entrance blade.\n\n**Implementation/readability risk: low.** Straight closed boxes and gables. Check end-wall/roof intersections explicitly; no overlapping internal end facade should show through the front room. Reject if middle/front rooms shrink into decorative porches, if there is only one roof with painted step bands, or if the front becomes the tallest mass. The side silhouette must show all three physical sizes.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "burnetterrace",
    "nm": "地榆露臺講習所",
    "en": "Burnet Terrace Teaching House",
    "v": 940,
    "shape": "low-occupied-base-central-exposed-stair-high-rear-room-real-roof-terrace",
    "design": "`v940..943`. Fictional use: small-town demonstration/teaching rooms with an upper outdoor terrace; no path routing or capacity change.\n\n**Whole-building idea.** A broad low grounded masonry base contains two forward side rooms. A **wide, central external straight stair** occupies the opening between them and reaches a real upper terrace. A narrower high gabled teaching room sits at the back of that terrace. The staircase, low roof terrace and rear upper room form the principal stepped section. There is no central elevated bridge, undercroft, earth bank, dome or front column portico.\n\n**Plan and section.** Lower rear/base room around `x4..28,y4..17,z.6..9`; forward low side rooms around `x4..12,y17..28` and `x20..28,y17..28`, also ending at z9. Upper rear room `x7..25,y4..12,z9..23`, gable ridge around 30. Actual upper terrace floor is the low base roof in front of the upper room, `y12..17`, and the two lower side-room roofs. Central stair `x12..20,y17..29` rises from .6 to9 over its whole 12-unit run. Every stair landing and upper door threshold is at z9; lower ground doors enter the side rooms directly. Guard terrace edges with modest physically grounded parapets.\n\n**Roof and openings.** One ordinary high rear gable plus the low lead terrace roofs, not a series of roofed stair ramps. The upstairs door opens onto the terrace; upper side windows are tall paired sashes. Low forward rooms have broad horizontal windows and separate ground-level doors. Retain closed occupied base walls behind the stair, not an accidental tunnel under the terrace.\n\n**Nearest prior assets.** `chiswick v180` has a domed villa and a projecting six-column portico reached by two side stairs; `norfolk v364` is an extended stepped housing system; `campionbarn v900` is rear-banked upper loading with a genuinely open lower front arcade; `catmintbridge v908` uses two opposed enclosed stairs and an open raised central bridge; `gorsepicture v848` has a high narrow front entrance and low broad rear auditorium.\n\n**Material structural difference.** One open central stair inserted between two low occupied front rooms reaches a broad exposed roof terrace in front of one high **rear** room. This is a stepped occupied section, not a paired outside-stair portico, earth approach or bridge.\n\n**Implementation/readability risk: medium, bounded.** Axis-aligned boxes and actual treads suffice. The rise/run is deliberately modest; no two-level deep cavity or long stair hidden inside walls. Reject if steps are reduced to painted stripes, the upper door has no landing, the terrace is filled by another roof, or side rooms become stair supports for a bridge. Check tread/landing continuity and the step silhouette in the two side-oblique views.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "figwortcolour",
    "nm": "玄參水彩工房",
    "en": "Figwort Watercolour Rooms",
    "v": 944,
    "shape": "high-backing-gallery-three-grounded-triangular-hipped-glazed-rooms",
    "design": "`v944..947`. Fictional use: three daylit painting/work bays with a shared backing gallery.\n\n**Whole-building idea.** One high narrow straight brick backing gallery serves **three lower grounded triangular workrooms**, each attached to the gallery by its entire broad base. Their outer ends are genuine sharp plan corners, producing three triangular teeth across the front, not three rectangular fingers, a continuous fan-wedge building or roof-only sawteeth. Each triangular room has its own simple three-plane hip; the backing gallery has one long complete gable.\n\n**Plan and section.** Back gallery `x3..29,y5..13`, eave18/ridge25. Frozen triangle roots and tips: `(3,13),(11,13),(7,25)`; `(12,13),(20,13),(16,29)`; `(21,13),(29,13),(25,25)`. Their eaves are 8.5–10; each roof's high point sits close to its broad attached base, rising to 13–16, below the gallery eave. These are finite enclosed rooms, not wedge-shaped exterior paving. The middle tooth is longer; the two outside teeth stay lower and shorter. Clear open outdoor V gaps remain between them.\n\n**Roof and openings.** The long rear hall has small high sash windows and a plain ground door on an end wall. Each triangular room has broad small-paned glazing on both oblique faces, with real solid corner posts and enough opaque low wall to ground the room. Public entry may be on a broad side near the base, never on an impossibly narrow sharp tip. Roofs stay three planar slopes with visible thickness; no cone or bowl.\n\n**Nearest prior assets.** `alderjoinery v680` is an E with three **rectangular gabled fingers** and open rectangular courts; `flintchart v644` is one continuous fan-wedge beneath **radial northlight sawtooth roofs**, not separate pointed rooms; `knapmediation v800` is two separated triangular rooms around a diagonal court joined at one end; `coventry v224` has folded glazing along a large church nave and a bowed baptistery; `teaselhat v744` is one narrow three-storey triangular wedge.\n\n**Material structural difference.** Three substantial low triangular glazed rooms, each with broad full-base attachment to one taller straight gallery, form a true serrated **ground plan** with three separate planar hip roofs. No copied E fingers with triangular painted window patterns; no one-piece fan envelope.\n\n**Implementation/readability risk: low–medium.** Each triangular room and roof is convex and individually closed. Separate the backs correctly at the higher gallery wall; no universal concave roof polygon. Reject if triangles become roof decorations on a rectangle, if gaps are roofed over, or if the gallery/three-teeth silhouette is lost under oversized hips. Native side views must establish the different low bay and high gallery sections.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "damewortcruck",
    "nm": "香花芥三山牆工藝館",
    "en": "Damewort Three-Gable Cruck Hall",
    "v": 948,
    "shape": "low-hexagonal-cruck-enclosure-three-alternating-full-gable-ends-nine-roof-planes",
    "design": "v948..951.\n\n**Damewort Three-Gable Cruck Hall**, a fictional communal cutting hall, is the frozen eighth model. Source geometry and official native verification are still required.\n\n- One continuous **hexagonal, near-ground roof enclosure**, not a normal-height house with a novel cap. Centre `(16,16)`; regular hexagon radius 13, vertices approximately `(29,16), (22.5,27.258), (9.5,27.258), (3,16), (9.5,4.742), (22.5,4.742)`. Derive every vertex from the same formula.\n- A low stone knee wall ends at z3. On alternating edges 0, 2 and 4, a full-width vertical triangular timber/glazed gable rises from the two edge corners to its edge midpoint at z27. The other three edges remain low knee walls. A central roof junction is `(16,16,27)`.\n- For each gabled edge, use **two** closed triangular roof planes from its corner, its high midpoint and the high centre. For each remaining edge, use **one** triangular hip plane from its two low corners to the high centre. The nine planes partition the hexagon without a roof hole or concave fan fill. Three horizontal radial ridges meet centrally; three broad gable ends alternate with three low hipped flanks.\n- Put the public door and a separate material door at the centres of two actual vertical gable ends, with ground thresholds, jamb thickness and upper triangular glazing. The third gable gets a broad workshop window. No tilted roof door, tiny dormer, extra lantern or machinery is needed. A sparse true timber frame supports the low-eave/high-gable section.\n- Distinguish from Holt Scout v728's **one longitudinal A-shell**, Fern Court v564's **two upright hexagonal pavilions**, and Rushton v112's **three-storey triangular lodge**. Here the single low hexagonal body, three dominant gable-front enclosure faces and three alternating low flanks are inseparable. It is not a recoloured pavilion or just another roof on Damewort's original box.\n- Reject if ordinary tall hexagonal walls are added, if the three gables become dormers, or if the central roof is replaced by a pointed pavilion cap. The common ridge junction, roof thickness, wall-head seams and aperture margins still need normal geometric guards and official native review. This is a stronger structural candidate, not a guarantee of visual success.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "pimpernelcross",
    "nm": "琉璃繁縷交巷閱覽館",
    "en": "Pimpernel Cross-Lane Reading Rooms",
    "v": 952,
    "shape": "two-grounded-halls-sixtydegree-cross-four-unequal-gabled-arms-true-clipped-roof-union",
    "design": "v952..955. Fictional original village reading/work rooms, no education service or path changes.\n\nWhole building: two substantial grounded enclosed rectangular halls cross at a real 60-degree angle, producing four unequal occupied gabled arms. This is one continuous connected X-plan building with four exterior re-entrant valleys between arms; no courtyard, tower, roof lantern, raised undercroft or ornamental wings. The high central ridge intersection belongs to the two continuous roofs rather than an extra central pavilion. Each arm ends in its own complete vertical gable face. Roof intersection is a genuine closed union, not overlapping complete roof meshes.\n\nFrozen structural coordinates: centre C=(16,16), hall A unit longitudinal axis (1,0), lateral (0,1), t=-13..11 and v=-3.5..3.5. Hall B unit longitudinal axis (1/2,sqrt(3)/2), lateral (-sqrt(3)/2,1/2), t=-10..13 and v=-3.5..3.5. Ground floor z=.6, eaves18, common ridge28. Both rooms are fully grounded and have the same seven-unit occupied width. Coordinates are derived from these shared bases, not independently rounded endpoints. Roof plane for either hall is 28-(10/3.5)*abs(v). Across the overlap, retain the higher roof plane, with a deterministic single ownership at equal-height seams. Outside the other footprint, retain the hall's own roof. The equality lines vA=vB and vA=-vB define the true valley seams; split plane polygons at those lines and both footprint boundaries. The union has no roof opening, vertical step or buried double roof. Trim internal wall segments inside the other occupied footprint; close each remaining exterior wall to its actual roof soffit. Roof thickness/end closures and any finite eave extensions use the same clipped boundary, not overlapping generic full gables. The central floor is continuous, no duplicated occupied floor slabs.\n\nFour end gables must remain substantial and unequal: each extends beyond the maximum shared crossing length 3.5*cot(30 degrees)=6.0621778265, leaving clear arm lengths approximately6.938,4.938,3.938,6.938. The different relative endpoints still distinguish A/B. Window/door placement uses the arm-local basis. Put a ground public door and generous upper gable light on A positive end; a distinct ordinary material/service entrance on B negative end; other ends have broad work windows. Side windows must lie on exposed arm walls outside the crossing. No inaccessible door at an acute internal junction or tilted window stuck on an axis-aligned plane.\n\nNearest existing: rushfordlav v688 has an orthogonal low cross with four outward monopitches and a small central cap; elmglass v656 has three Y arms around an independent high triangular clerestory; hyssopupholstery v864 has only two perpendicular gambrel ranges in an L; guelderlace v844 has separated parallel gables and a low diagonal link. Older cruciform churches have longitudinal nave/aisles, a short orthogonal transept and often a tower, not two equal-width obliquely crossing four-ended workshop halls. Do not call a rotated ordinary cross a new X: the actual 60-degree intersection and four unequal full gabled arms must survive all native views. New eighth model is one hexagonal low roof enclosure with three alternating gable edges, not this four-arm rectangular-room union.\n\nReject if it is only a sheared old jettied house, if one arm shrinks to a porch, if generic roofs penetrate each other, if a dark panel masks a central gap, if a tower or cover hides the intersection, if the angle is 90degrees, or if only signs/colour supply the identity. Geometry controls must remove one arm, rotate B to90, leave a duplicate/buried roof, open a valley seam, or restore an internal crossing wall and obtain a precise first RED. Actual original four-view PNGs, rather than mathematical angle alone, determine visible whole-building distinction.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  },
  {
    "id": "fumitorygin",
    "nm": "紫堇馬力棚穀舍",
    "en": "Fumitory Horse-Gin Barn",
    "v": 956,
    "shape": "long-gabled-barn-finite-shared-facet-low-open-octagonal-horse-gin-shelter",
    "design": "`v956..959`. Fictional use: a rural mechanical-history barn with a static sheltered horse-gin exhibition area. No animal, engine, wheel, power or production simulation is introduced; movable machinery is not needed to establish the design.\n\n**Whole-building idea.** One tall narrow enclosed gabled barn is joined along its long side to a **broad, much lower open octagonal engine shelter**. The shelter has its own complete low pyramidal roof on substantial spaced timber posts, with a genuine full-width shared flat facet against the barn. The barn and low polygonal shelter are co-dominant; this is not a tiny gazebo accessory or a closed oast cylinder.\n\n**Plan and section.** Define the regular octagon once: centre `cx=21.5, cy=16`, circumradius `r=8`, vertex angles `π/8 + i·π/4`. Derive the shared interface from that same polygon: `xJoin = cx − r·cos(π/8)` (approximately 14.1089637399), `yJoinLow = cy − r·sin(π/8)` (approximately 12.9385325411), and `yJoinHigh = cy + r·sin(π/8)` (approximately 19.0614674589). The barn is exactly `x4..xJoin,y4..28`, eave22/ridge30; the shelter's complete left facet is exactly `(xJoin,yJoinLow)..(xJoin,yJoinHigh)`. Both builders must use the same derived coordinates/vertices, not independently rounded literals. The finite shared chord is `2r·sin(π/8)` (approximately 6.1229349178 units); there is no 0.009-unit gap, point tangency, arbitrary epsilon overlap or depth-bias disguise.\n\nShelter eave around9.5, apex16; roof planes and posts remain below the barn eave. Its far-right extent is `cx+r·cos(π/8)` (approximately 28.8910362601). Trim the shelter roof and floor to the exact octagon boundary at `xJoin`; neither may cross into the barn. Do not retain a second coincident shelter-side wall, a roof face crossing the shared plane, or any concealed duplicate internal face. The barn's side wall is the sole real boundary at the shared facet, with its ordinary access doorway explicitly opened/closed by the intended door construction rather than covered by a second solid wall. Exterior seven facets remain openly framed; the barn-side eighth facet is the exact shared interface, not an extra painted partition. Use its two derived endpoints for any wall/post/roof-edge junction, so all contacts remain exact.\n\n**Roof and openings.** Barn: narrow high slit work windows, one tall but closed end loading door and one ordinary grounded service door. An ordinary door through the shared barn facet opens into the sheltered zone. Shelter: single shallow eight-plane slate hip/pyramid, no lantern, dormers, cupola or finial; sparse corner posts and short visible braces, true open sides, simple grounded floor. Give the roof a real underside, not a flat cap blackened to imply depth. Keep clear sides wide enough that posts and open air survive native sampling.\n\n**Nearest prior assets.** `hopdrying v888` has a **tall closed round cone/kiln** joined off-axis to a long two-storey gabled sorting house; `dunster v164` is a standalone open octagonal market with eight dormers and a lantern; `elmstone v700` is a rectangular open cutting shed plus low rear tool strip; `bramblewheel v660` is a low semicircular open cart shed forming a true D court against a rear workshop; `dittanygeology v868` is a closed round central room with two opposed gabled wings. The older farm compounds have raised granaries, sheds and courts, not a broad side-attached polygonal open engine bay.\n\n**Material structural difference.** A tall thin closed spine beside a wide low **fully covered open polygon**, directly joined on a full flat facet. It lacks the tall closed cone of Hopdrying, the free-standing symmetry/lantern of Dunster and the open-sky central D yard of Bramblewheel.\n\n**Implementation/readability risk: low–medium.** Standard barn plus a convex eight-plane roof, eight simple post positions and a finite shared wall facet. The roof is shallow enough that side openings are obvious without needing a deep hollow. Reject if the shelter becomes an enclosed round kiln, its roof shrinks into an incidental porch, it opens an unroofed courtyard, or the barn is merely a token attached cupboard. The side-by-side height and enclosure contrast must remain clear with all machinery omitted.",
    "distinctionFromPublished190": "See frozen first-card design and nearest prior assets.",
    "evidenceStatus": "original-code-native-design",
    "designSource": "Original fictional English village craft architecture; unchanged art634/021 materials, no photograph or real-landmark reproduction claim.",
    "note": "原創英式外觀，非具名真實古蹟復刻；沿用原生2×2地標規則。"
  }
].map(Object.freeze));
// Shared native material and geometric primitives only; no historical model body.
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
    if(!root.__wave048GeometryOnly){S.box(.65,31.35,.65,31.35,0,.42,P.pave,P.paveR,P.pave);S.flat(.65,31.35,.65,31.35,.43,K.paving);}
    function finish(){
      if(!root.__wave048GeometryOnly){K.lantern(S,1.4,30.5,4.3,true);K.lantern(S,30.6,30.5,4.3,true);}
      return S.finish({id:row.id,design:row.shape,originalDesignName:row.nm,view,smoke:[],lightPolicy:'opaque-visible-glazing-and-display-fixtures-only',__britishWave048:1});
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
      if(!cut)throw Error('wave048 non-simple or degenerate plan');
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

/* WAVE048 NEW AUTHORED MODELS */

// New candidate-only planar solid construction helpers. No renderer changes.
function clip048(poly,fn,positive=true){
  if(!poly.length)return[];const out=[],sign=positive?1:-1;
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=fn(a)*sign,db=fn(b)*sign,ia=da>=-1e-9,ib=db>=-1e-9;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push(a.map((v,j)=>v+t*(b[j]-v)));}}
  return out.filter((p,i)=>!i||Math.hypot(...p.map((v,j)=>v-out[i-1][j]))>1e-8);
}
function cutConvex048(poly,edges){let inside=poly,out=[];for(const fn of edges){const q=clip048(inside,fn,false);if(q.length>=3)out.push(q);inside=clip048(inside,fn,true);if(inside.length<3)break;}return{inside,out};}
function rect048(x0,x1,y0,y1){return[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];}
function rectEdges048(x0,x1,y0,y1){return[p=>p[0]-x0,p=>x1-p[0],p=>p[1]-y0,p=>y1-p[1]];}
function polygonWalls048(A,q,z0,z1,kind){const faces=[];for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],F=edgeFace(A,a,b);A.S.wall(a,b,z0,z1,A.mat(kind,F.nx,F.ny));faces.push(F);}return faces;}
function flatPlan048(A,q,z,m){for(const t of triangulatePlan(q.map(p=>[...p,z])))A.S.poly(t,m);}
function glassFace048(A,q,normal,lit=true){
 const {S,P}=A,c=q.reduce((a,p)=>a.map((v,j)=>v+p[j]/q.length),[0,0,0]),len=Math.hypot(...normal),n=normal.map(v=>v/len),inner=q.map(p=>p.map((v,j)=>c[j]+(v-c[j])*.87+n[j]*.12));
 S.poly(q,A.dark(n[0],n[1])?P.woodR:P.wood);const glass=A.dark(n[0],n[1])?P.glassR:P.glass;S.poly(inner,lit?[glass,P.warm]:glass);
 for(let i=0;i<q.length;i++)S.beam(q[i],q[(i+1)%q.length],P.frame,.24);
}
function wallWithOpening048(A,a,b,z0,z1,kind,open0,open1,openTop){
 const F=edgeFace(A,a,b);if(open0===undefined){A.S.wall(a,b,z0,z1,A.mat(kind,F.nx,F.ny));return F;}
 for(const [lo,hi,bottom,top]of[[0,open0,z0,z1],[open1,F.length,z0,z1],[open0,open1,openTop,z1]])if(hi>lo+1e-8&&top>bottom+1e-8)F.panel(lo,hi,bottom,top,A.mat(kind,F.nx,F.ny));return F;
}
function finish048(A,details){return{...A.finish(),details:{originalDesign:true,newModelBody:true,...details}};}

// GPT-048 original bodies 1–5; authored after frozen card002f14fc.
function foxglovecharter(row,view){
 const A=context(row,view),{S,P}=A;
 const low=[[4,8],[28,8],[28,22],[21,22],[21,21],[11,21],[11,22],[4,22]],up=[[4,8],[28,8],[28,25],[21,25],[21,21],[11,21],[11,25],[4,25]];
 const lf=polygonWalls048(A,low,.6,9,'stone'),uf=polygonWalls048(A,up,9,20,'whiteplaster');
 for(const [x0,x1]of[[4,11],[21,28]]){S.flat(x0,x1,22,25,9,P.woodR);S.beam([x0,25,9],[x1,25,9],P.woodD,.55);for(const x of[x0+.8,x1-.8])S.beam([x,22,7],[x,24.7,9],P.woodD,.5);}
 // One real common hip, closed soffit meets every upper wall head exactly.
 hipRoof(A,3,29,7,26,20,9,true);S.beam([11,25.7,19.6],[21,25.7,19.6],P.woodD,.7);
 const centre=face(A,[11,21],[21,21],0,1);solidDoor(A,centre,.8,.6,3,6.3);A.pane(centre,5,3,3.7,13,'mullion',true);
 for(const F of[uf[2],uf[6]]){A.pane(F,1.3,12,4.2,5,'mullion',true);for(const u of[.2,F.length-.2])S.beam(F.point(u,.17,9),F.point(u,.17,19.7),P.woodD,.3);F.panel(0,F.length,10,10.35,P.woodD,.18);}
 for(const F of[lf[2],lf[6]])A.pane(F,1.5,2.4,3.8,3.4,'rect',true);
 A.windows(uf[0],1,4,12,0,3.2,4.5,'rect');A.windows(uf[1],1,3,12,0,3,4,'rect');A.windows(uf[7],1,3,12,0,3,4,'rect');solidDoor(A,lf[7],4,.6,3,6);
 return finish048(A,{twoEndJetties:true,fullHeightCentralRecess:true,singleCommonHip:true});
}
function silverweedalpine(row,view){
 const A=context(row,view),{S,P}=A,c=[16.5,17.5,27],q=rect048(5,28,6,29),knee=2.4,join=6+(8.5-knee)*11.5/(27-knee);
 const faces=[];for(let i=0;i<4;i++){const a=q[i],b=q[(i+1)%4];faces.push(i===0?wallWithOpening048(A,a,b,.6,knee,'stone',8,15,knee):wallWithOpening048(A,a,b,.6,knee,'stone'));}
 for(let i=0;i<4;i++){
  const a=[...q[i],knee],b=[...q[(i+1)%4],knee],tri=[a,b,c],normal=[((a[0]+b[0])/2-c[0])*24.6/11.5,((a[1]+b[1])/2-c[1])*24.6/11.5,11.5];
  const pieces=i===0?cutConvex048(tri,rectEdges048(13,20,2,join)).out:[tri];
  for(const piece of pieces)glassFace048(A,piece,normal,true);
  S.beam(a,c,P.frame,.4);S.beam(a,b,P.stoneHi,.45);
  // Sparse true sloping glazing members, not an upright room under a cap.
  for(const t of[.33,.66])S.beam(a.map((v,j)=>v+(c[j]-v)*t),b.map((v,j)=>v+(c[j]-v)*t),P.frame,.22);
 }
 const front=face(A,[20,2],[13,2],0,-1);S.wall([20,2],[13,2],.6,8.1,A.mat('wood',0,-1));S.wall([13,2],[13,join],.6,8.1,A.mat('wood',-1,0));S.wall([20,join],[20,2],.6,8.1,A.mat('wood',1,0));
 roofShell(A,[[13,2,8.5],[20,2,8.5],[20,join,8.5],[13,join,8.5]]);solidDoor(A,front,2,.6,3,6.6);A.pane(face(A,[13,2],[13,join],-1,0),1.2,2.2,2.8,3.5,'rect',true);
 return finish048(A,{nearGroundFourPlanePyramid:true,finiteClippedVestibule:true,vestibuleJoin:join});
}
function maddartutors(row,view){
 const A=context(row,view),{S,P}=A;
 const rs=[[3,14,3,14,14],[18,29,3,14,18],[3,14,18,29,12],[18,29,18,29,16]],connector=[[14,10],[18,10],[18,14],[22,14],[22,18],[18,18],[18,22],[14,22],[14,18],[10,18],[10,14],[14,14]];
 // Solid cross top and four corner contacts; its end caps are indoor interfaces.
 flatPlan048(A,connector,8.5,P.lead);flatPlan048(A,connector,.6,P.stoneR);
 for(let i=0;i<connector.length;i++){const a=connector[i],b=connector[(i+1)%connector.length],mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];if(rs.some(r=>mid[0]>=r[0]&&mid[0]<=r[1]&&mid[1]>=r[2]&&mid[1]<=r[3]))continue;const F=edgeFace(A,a,b);S.wall(a,b,.6,8.5,A.mat('stone',F.nx,F.ny));}
 rs.forEach((r,j)=>{const[x0,x1,y0,y1,h]=r,plan=rect048(x0,x1,y0,y1),ff=[];for(let i=0;i<4;i++){const a=plan[i],b=plan[(i+1)%4],F=edgeFace(A,a,b),dx=(b[0]-a[0])/F.length,dy=(b[1]-a[1])/F.length;let intervals=[];for(let u=0;u<F.length;u+=.25){const m=[a[0]+dx*(u+.125),a[1]+dy*(u+.125)];const contact=(m[0]>=14&&m[0]<=18&&m[1]>=10&&m[1]<=22)||(m[1]>=14&&m[1]<=18&&m[0]>=10&&m[0]<=22);intervals.push({u,contact});}let start=0;while(start<intervals.length){let end=start+1;while(end<intervals.length&&intervals[end].contact===intervals[start].contact)end++;const z0=intervals[start].contact?8.5:.6;F.panel(start*.25,Math.min(end*.25,F.length),z0,h,A.mat('brick',F.nx,F.ny));start=end;}ff.push(F);}
  const apex=[(x0+x1)/2,(y0+y1)/2,h+5];for(let i=0;i<4;i++)roofSheet(A,[[...plan[i],h+.4],[...plan[(i+1)%4],h+.4],apex]);for(let i=0;i<4;i++)fascia(A,[...plan[i],h+.4],[...plan[(i+1)%4],h+.4]);
  for(const i of[j<2?0:2,j%2?1:3])A.windows(ff[i],1,2,3.2,0,3,4.4,j===2?'ribbon':'rect');if(j===2)solidDoor(A,ff[2],4,.6,3,6);
 });return finish048(A,{fourCornerHips:true,lowSolidCross:true,noCourtyard:true});
}
function restharrowsalt(row,view){
 const A=context(row,view),{S,P}=A,z0=.6,z1=19;
 for(const side of[-1,1]){const xb=side<0?4:28,xt=side<0?10:22,normal=[side,0,6/(z1-z0)];S.poly([[xb,5,z0],[xb,28,z0],[xt,28,z1],[xt,5,z1]],A.mat('stone',side,0));
  for(const yc of[10,17,24]){const pts=[[yc-1.6,7],[yc+1.6,7],[yc+1.6,11],[yc-1.6,11]].map(([y,z])=>[xb+(xt-xb)*(z-z0)/(z1-z0)+side*.08,y,z]);glassFace048(A,pts,normal,true);}}
 for(const y of[5,28])S.poly([[4,y,z0],[28,y,z0],[22,y,z1],[10,y,z1]],A.mat('stone',0,y===5?-1:1));
 roofShell(A,[[10,5,19.4],[22,5,19.4],[22,28,19.4],[10,28,19.4]]);const F=face(A,[4,28],[28,28],0,1);solidDoor(A,F,9,.6,6,8);louver(A,F,10.5,12,3,3.5);louver(A,face(A,[28,5],[4,5],0,-1),10.5,12,3,3.5);
 return finish048(A,{trueBatteredSidePlanes:true,closedTrapezoidEnds:true,narrowFlatRoof:true});
}
function betonymarionette(row,view){
 const A=context(row,view),{S,P}=A,rs=[[4,28,4,13,24,33],[7,25,13,22,16,24],[10,22,22,29,10,16]];
 rs.forEach((r,i)=>{const[x0,x1,y0,y1,h,ridge]=r,F={front:face(A,[x0,y1],[x1,y1],0,1),back:face(A,[x1,y0],[x0,y0],0,-1),left:face(A,[x0,y0],[x0,y1],-1,0),right:face(A,[x1,y1],[x1,y0],1,0)};
  for(const f of[F.left,F.right])f.panel(0,f.length,.6,h,A.mat('brick',f.nx,f.ny));
  if(i===0)F.back.panel(0,F.back.length,.6,h,A.mat('brick',0,-1));
  if(i===2)F.front.panel(0,F.front.length,.6,h,A.mat('brick',0,1));else{const next=rs[i+1],nx0=next[0],nx1=next[1],nh=next[4],nr=next[5],cx=(nx0+nx1)/2;
   F.front.panel(0,nx0-x0,.6,h,A.mat('brick',0,1));F.front.panel(nx1-x0,x1-x0,.6,h,A.mat('brick',0,1));
   for(const [a,b,ha,hb]of[[nx0,cx,nh,nr],[cx,nx1,nr,nh]])S.poly([[a,y1,ha],[b,y1,hb],[b,y1,h],[a,y1,h]],A.mat('brick',0,1));
  }
  const cx=(x0+x1)/2;roofSheet(A,[[x0,y0,h+.4],[cx,y0,ridge+.4],[cx,y1,ridge+.4],[x0,y1,h+.4]]);roofSheet(A,[[cx,y0,ridge+.4],[x1,y0,h+.4],[x1,y1,h+.4],[cx,y1,ridge+.4]]);
  for(const y of[i===0?y0:null,y1].filter(x=>x!==null)){S.poly([[x0,y,h],[x1,y,h],[cx,y,ridge]],A.mat('brick',0,y===y0?-1:1));fascia(A,[x0,y,h+.4],[cx,y,ridge+.4]);fascia(A,[cx,y,ridge+.4],[x1,y,h+.4]);}
  for(const x of[x0,x1])fascia(A,[x,y0,h+.4],[x,y1,h+.4]);S.beam([cx,y0,ridge+.5],[cx,y1,ridge+.5],P.lead,.26);
  for(const f of[F.left,F.right])A.windows(f,1,2,i===0?12:3,0,2.5,i===0?6:3,'rect');if(i===2)solidDoor(A,F.front,4.5,.6,3,6);if(i===0)solidDoor(A,F.left,3,.6,3.5,8);
 });return finish048(A,{threeCoaxialOccupiedGables:true,twoRealSectionSteps:true,groundedFrontDoor:true});
}

// GPT-048 original bodies 6–10, with actual plane intersections rather than masks.
function burnetterrace(row,view){
 const A=context(row,view),{S,P}=A,outline=[[4,4],[28,4],[28,28],[20,28],[20,17],[12,17],[12,28],[4,28]];
 const ff=polygonWalls048(A,outline,.6,8.6,'stone');flatPlan048(A,outline,9,P.lead);flatPlan048(A,outline,8.6,P.woodR);for(let i=0;i<outline.length;i++)fascia(A,[...outline[i],9],[...outline[(i+1)%outline.length],9]);
 const upper=A.volume(7,25,4,12,9,23,'brick',false);gableBodyRoof(A,7,25,4,12,23.4,6.6,'x','brick');solidDoor(A,upper.front,7.5,9,3,7);A.windows(upper.back,1,3,12,0,3,6,'rect');A.windows(upper.left,1,1,12,0,3,6,'rect');A.windows(upper.right,1,1,12,0,3,6,'rect');
 for(let i=0;i<14;i++){const y0=17+12*i/14,y1=17+12*(i+1)/14,z=9-8.4*i/14;S.box(12,20,y0,y1,.6,z,P.stone,P.stoneR,P.stoneHi);}
 // Stair rises toward decreasing y; no parapet crosses its actual landing.
 for(const [x0,x1,y0,y1]of[[4,7,4,4.5],[25,28,4,4.5],[4,4.5,4,28],[27.5,28,4,28],[4,12,27.5,28],[20,28,27.5,28],[11.5,12,17,28],[20,20.5,17,28]])S.box(x0,x1,y0,y1,9,10.5,P.stone,P.stoneR,P.stoneHi);
 for(const F of[ff[2],ff[6]])solidDoor(A,F,2.5,.6,3,6);A.windows(ff[1],1,3,2.5,0,3.5,3.6,'ribbon');A.windows(ff[7],1,3,2.5,0,3.5,3.6,'ribbon');
 return finish048(A,{wideExternalStairHighAtY17:true,realTerraceZ9:true,groundedOccupiedBase:true});
}
function figwortcolour(row,view){
 const A=context(row,view),{S,P}=A,triangles=[{q:[[3,13],[11,13],[7,25]],z:8.5,apex:[7,16,13]},{q:[[12,13],[20,13],[16,29]],z:10,apex:[16,17,16]},{q:[[21,13],[29,13],[25,25]],z:8.5,apex:[25,16,13]}];
 const back={back:face(A,[29,5],[3,5],0,-1),left:face(A,[3,5],[3,13],-1,0),right:face(A,[29,13],[29,5],1,0)};
 for(const F of Object.values(back))F.panel(0,F.length,.6,18,A.mat('brick',F.nx,F.ny));
 for(const [x0,x1,z0]of[[3,11,8.5],[11,12,.6],[12,20,10],[20,21,.6],[21,29,8.5]])S.wall([x0,13],[x1,13],z0,18,A.mat('brick',0,1));
 for(const t of triangles){const F=edgeFace(A,t.q[1],t.q[2]),G=edgeFace(A,t.q[2],t.q[0]);for(const f of[F,G]){f.panel(0,f.length,.6,t.z,A.mat('brick',f.nx,f.ny));A.pane(f,2.1,2.5,Math.min(5,f.length-4),3.8,'mullion',true);}triangleHip(A,t.q,t.z+.4,t.apex);}
 gableBodyRoof(A,3,29,5,13,18.4,6.6,'x','brick');A.windows(back.back,1,4,8,0,3.5,5,'rect');solidDoor(A,back.left,2,.6,3,6.5);
 return finish048(A,{threeRealTriangularRooms:true,fullOneUnitRootGaps:true,highBackingGallery:true});
}
function damewortcruck(row,view){
 const A=context(row,view),{S,P}=A,q=Array.from({length:6},(_,i)=>[16+13*Math.cos(i*Math.PI/3),16+13*Math.sin(i*Math.PI/3)]),centre=[16,16,27];
 polygonWalls048(A,q,.6,3,'stone');
 for(let i=0;i<6;i++){const a=[...q[i],3.4],b=[...q[(i+1)%6],3.4],F=edgeFace(A,q[i],q[(i+1)%6]);
  if(i%2===0){const mid=[(a[0]+b[0])/2,(a[1]+b[1])/2,27];roofSheet(A,[a,mid,centre]);roofSheet(A,[mid,b,centre]);
   const wall=[[a[0],a[1],3],[b[0],b[1],3],[mid[0],mid[1],26.6]];glassFace048(A,wall,[F.nx,F.ny,0],true);fascia(A,a,mid);fascia(A,mid,b);S.beam(mid,centre,P.lead,.35);
   for(const t of[.25,.5,.75]){const z=3+(26.6-3)*(1-Math.abs(t*2-1));S.beam(F.point(F.length*t,.23,3),F.point(F.length*t,.23,z),P.woodD,.38);}
   if(i===0||i===4)solidDoor(A,F,F.length/2-1.6,.6,3.2,6.5);else A.pane(F,F.length/2-2,4,4,6,'mullion',true);
  }else{roofSheet(A,[a,b,centre]);fascia(A,a,b);}
 }
 return finish048(A,{singleLowHexagonalEnclosure:true,threeFullWidthGableEnds:true,nineClosedRoofPlanes:true});
}
function pimpernelcross(row,view){
 const A=context(row,view),{S,P}=A,rooms=[orientedRect(16,16,0,-13,11,3.5),orientedRect(16,16,Math.PI/3,-10,13,3.5)],extents=[[-13,11],[-10,13]],h=3.5;
 const coords=(R,p)=>[(p[0]-16)*R.ux+(p[1]-16)*R.uy,(p[0]-16)*R.vx+(p[1]-16)*R.vy];
 const edges=(R,lim)=>[p=>coords(R,p)[0]-lim[0],p=>lim[1]-coords(R,p)[0],p=>coords(R,p)[1]+h,p=>h-coords(R,p)[1]];
 const z=(R,p)=>28-10*Math.abs(coords(R,p)[1])/h;
 const boundary=[];
 rooms.forEach((R,i)=>{const O=rooms[1-i],ee=edges(O,extents[1-i]);
  // Four explicit combinations of roof slopes cover only the higher surface.
  for(const sign of[-1,1]){
   const own=clip048(R.points,p=>coords(R,p)[1]*sign),cut=cutConvex048(own,ee),parts=cut.out;
   for(const os of[-1,1]){let overlap=clip048(cut.inside,p=>coords(O,p)[1]*os);overlap=clip048(overlap,p=>z(R,p)-z(O,p));if(overlap.length>=3)parts.push(overlap);}
   for(const q of parts)if(Math.abs(q.reduce((s,p,j)=>s+p[0]*q[(j+1)%q.length][1]-p[1]*q[(j+1)%q.length][0],0))>1e-7)roofSheet(A,q.map(p=>[...p,z(R,p)+.4]));
  }
  // Exact segment splitting at the other footprint boundary retains only the
  // outer union walls. No full wall continues through the occupied crossing.
  R.points.forEach((a,j)=>{const b=R.points[(j+1)%4],ts=[0,1];for(const fn of ee){const fa=fn(a),fb=fn(b);if(fa*fb<0)ts.push(fa/(fa-fb));}ts.sort((a,b)=>a-b);
   for(let k=0;k<ts.length-1;k++){const lo=ts[k],hi=ts[k+1],at=t=>a.map((v,j)=>v+t*(b[j]-v)),mid=at((lo+hi)/2);if(ee.every(fn=>fn(mid)>-1e-8))continue;const x=at(lo),y=at(hi),F=edgeFace(A,x,y),split=[0,1],va=coords(R,x)[1],vb=coords(R,y)[1];if(va*vb<0)split.splice(1,0,va/(va-vb));
    for(let s=0;s<split.length-1;s++){const u=split[s],v=split[s+1],p=x.map((a,j)=>a+u*(y[j]-a)),q=x.map((a,j)=>a+v*(y[j]-a));S.poly([[...p,.6],[...q,.6],[...q,z(R,q)],[...p,z(R,p)]],A.mat('brick',F.nx,F.ny));fascia(A,[...p,z(R,p)+.4],[...q,z(R,q)+.4]);}
    boundary.push({F,room:i,edge:j});
   }
  });
  const floor=i===0?[R.points]:cutConvex048(R.points,edges(rooms[0],extents[0])).out;for(const q of floor)flatPlan048(A,q,.6,P.stoneR);
 });
 // Complete exposed end gables, plus actual side windows clear of the junction.
 for(const b of boundary){const {F,room,edge}=b;if(F.length<2.8)continue;if(edge===1||edge===3){if((room===0&&edge===1)||(room===1&&edge===3))solidDoor(A,F,F.length/2-1.5,.6,3,7);else A.pane(F,F.length/2-1.8,3,3.6,5,'mullion',true);A.pane(F,F.length/2-1.25,15,2.5,5,'pointed',true);}else if(F.length>4.5)A.pane(F,(F.length-2.5)/2,5,2.5,5,'rect',true);}
 return finish048(A,{trueSixtyDegreeFourArmUnion:true,roofUpperEnvelopeClipped:true,internalCrossingWallsRemoved:true});
}
function fumitorygin(row,view){
 const A=context(row,view),{S,P}=A,cx=21.5,cy=16,r=8,join=cx-r*Math.cos(Math.PI/8),lo=cy-r*Math.sin(Math.PI/8),hi=cy+r*Math.sin(Math.PI/8),q=Array.from({length:8},(_,i)=>[cx+r*Math.cos(Math.PI/8+i*Math.PI/4),cy+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
 const barn=A.volume(3,join,4,28,.6,17,'brick',false);gableBodyRoof(A,3,join,4,28,17.4,7.6,'y','brick');solidDoor(A,barn.front,3,.6,4,7);A.windows(barn.left,1,4,8,0,2.5,4,'rect');A.windows(barn.back,1,2,5,0,2.6,4,'rect');
 const apex=[cx,cy,11.8];
 for(let i=0;i<8;i++){const a=q[i],b=q[(i+1)%8],shared=Math.abs(a[0]-join)<1e-7&&Math.abs(b[0]-join)<1e-7;
  roofSheet(A,[[...a,8.4],[...b,8.4],apex]);if(!shared)fascia(A,[...a,8.4],[...b,8.4]);
  if(Math.abs(a[0]-join)>1e-7)S.box(a[0]-.3,a[0]+.3,a[1]-.3,a[1]+.3,.6,8,P.wood,P.woodR,P.woodHi);
  if(!shared){S.beam([...a,7.85],[...b,7.85],P.woodD,.45);const p=a.map((v,j)=>v+(b[j]-v)*.28);S.beam([...a,5.5],[...p,7.85],P.woodR,.35);}
 }
 // One exact barn interface, no second shelter wall. Door meets the common floor.
 const shared=face(A,[join,hi],[join,lo],1,0);solidDoor(A,shared,(hi-lo-3)/2,.6,3,6);flatPlan048(A,q,.6,P.stoneR);
 return finish048(A,{lowOpenOctagonSevenOuterFacets:true,finiteExactSharedBarnFacet:true,joinX:join});
}

const MODELS=Object.freeze({foxglovecharter,silverweedalpine,maddartutors,restharrowsalt,betonymarionette,burnetterrace,figwortcolour,damewortcruck,pimpernelcross,fumitorygin});
function build(id,view){const row=ROWS.find(q=>q.id===id);if(!row)throw Error('wave048 unknown frozen original '+id);if(!Number.isInteger(view)||view<0||view>3)throw Error('wave048 four world rotations only');return MODELS[id](row,view);}
function buildAll(){return ROWS.flatMap(row=>[0,1,2,3].map(view=>({row,view,sprite:build(row.id,view)})));}
root.BritishWaveArchitecture048=Object.freeze({rows:ROWS,build,buildAll,candidateRows:()=>ROWS});
})(typeof window==='undefined'?globalThis:window);
