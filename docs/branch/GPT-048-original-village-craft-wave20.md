# GPT-048：第20波十款原創英式村鎮工藝與公共建築

## 動手前範圍（首commit凍結，不改鬆）

- 從最新main 4346a96543b01ffd47ac3696480661b5de8638ae 接續。第19波PR63／T773／v14.66／r220已正式完成，main CI40162795551、既有自動Pages40163187956、真公開Chrome40160465127 attempt2/job121079351468全部成功。HTTP及Chrome均11933765bytes、SHA256 3ec1acaea20088ee66130c5ae03a647f191279756894f1b0d377919444d3eb63；34負控、零runtime/network錯誤。公開menu/city/catalog原PNG已實看，artifact12587227279原ZIP SHA256 2b4bca3b66b86ab9b23296eea60d5a4c4659abba503f04ee00f7d125089606ef。正式19／20波190座，不重做已發布內容。
- 本分支gpt/british-wave20-048。首commit唯一宣告fp家族：**bld**。只新增24_1_920..959共40葉；全部既有4143葉（bld1779）、其餘165家族、block1728／CRC5ef6eb67及env不變。沿用k24／Lv1／2×2／$2000，不改價格／供電／財政／模擬／RNG／存檔／密度／全局光照與歷史模型。
- 十款均為原創虛構英式外觀，不冒稱真古蹟，不新增工藝／教育／洗衣／產業鏈等玩法。真原生四向、160×196圖，不調整舊素材或共用renderer補救新模型。
- 已讀AGENTS／CLAUDE／方向／迭代不改壞標準；main與Pages全綠且方向運行。依業主2026-10-24明確18～20波實作、驗收、合法合併發布授權完成最後十款。獨立自有worktree；本卡單檔先推，之後才開始模型與新守衛。首卡不是產品，不預佔T號或改版本。
- 準備階段源碼核對190款及更早15款，非聲稱全部歷史實圖都看。原08上層gablet屋頂太近Asterpost已淘汰；原09剪切jettied house只屬幾何微變已淘汰；雙翼洗衣院接近既有H／U院落未採用。改為下列真正六邊三山牆低屋與60°四臂交巷廳，仍須正式原圖驗證，不以新名字或數值代替差異。

## 十款凍結身份、用途、量體與實體要求

### 01. foxglovecharter — Foxglove Charter House / 毛地黃鄉約館

`v920..923`. Fictional use: local charter and community-history reading rooms.

**Whole-building idea.** A long low timber hall has two substantial enclosed, two-storey end bays. Only those end bays project/jettied outward at upper-storey height. The entire central hall facade stays recessed behind them from ground to eaves. One uninterrupted long, ordinary hipped roof covers the whole composition. A real eaves beam spans the shallow centre setback. There is no upper bridge room across the central hall, no ground-level tunnel and no internal courtyard.

**Plan and section.** Use one common roof rectangle `x3..29, y7..26` (26×19), covering the complete end-room and central-hall envelope. End bays occupy roughly `x4..11` and `x21..28`, with rear walls at `y8`; their ground fronts end at `y22`, upper fronts at `y25`. The common front roof eave is at `y26`, one unit beyond both upper end fronts; its rear eave is at `y7`, one unit beyond their rear walls. Thus neither end-room body protrudes outside the common roof. The central enclosed hall is `x11..21`, its front at `y21`. All room bases are grounded. End-floor level about 9, shared eave about 20, ridge about 29. The central facade's 4-unit recession against the upper end bays is large enough to carry the form without deep hollow-space lighting. Between `x11..21,y21..26` there is only the covered exterior eaves recess: an actual spanning eaves beam supported at the two end-room sides, roof above, and open air below. No upper bridge room, spanning intermediate floor or hidden upper wall fills this recess. Rear walls stay continuous and readable.

**Roof and openings.** One long hip, no separate end gables, no dormer forest. One tall central three-light hall window reads across the missing intermediate floor line; each end bay has separate lower casements and upper leaded rectangles. The public door is in the recessed central wall at ground level, with a small side-service door in an end wall. Give projecting end floors real soffits and short grounded-wall corbels. Timber framing supports the volume; it is not the only distinction.

**Nearest prior assets.** `lavenham v100` has one continuously jettied upper hall across its frontage and a separate small porch; `hawthornloom v592` is a raised gambrel bridge spanning between two anchor rooms; `bessie v244` is a pair of five-storey narrow merchant houses; `brackenread v560` is an L with unequal crossing gables and an oriel. Also check `victorianGabledSemi006` / `UKR05`, whose two projecting gabled wings make a broad H-like house.

**Material structural difference.** Two local end jetties + a full-height recessed **enclosed** centre + one unbroken hip; no bridge, two-gable pair, L, or all-frontage upper projection. Its central two-height facade and end domestic window scale are complementary.

**Implementation/readability risk: low–medium.** Construct three closed room envelopes and two genuine upper projections, then a common hip. The centre setback must not be filled by a hidden generic upper box. Reject if all upper walls form one flat facade, if a bridge floor appears across the centre, or if tiny trim alone distinguishes it from Lavenham. Compare at native scale against Lavenham and Hawthorn before freezing.

### 02. silverweedalpine — Silverweed Alpine House / 銀葉委陵菜高山植物屋

`v924..927`. Fictional use: small village alpine-plant study/display house; no plant simulation.

**Whole-building idea.** One broad square **pyramidal glazed enclosure** rises almost from ground level. All four faces are actual large triangular sloping roof/wall planes meeting a single apex. The building is predominantly the pyramid, not a tall glass room with a little pyramid cap. A modest low rectangular entrance vestibule penetrates one lower face.

**Plan and section.** Main square about `x5..28, y6..29`, knee wall `z2.4`, apex about `z27` at the actual square centre. Front vestibule approximately `x13..20, y2..10`, door-head about 7.5 and low lead cap about 8.5. Resolve its finite intersection with the sloping front face by clipping that roof face into separate convex pieces. Do not leave a full triangular roof polygon running through the vestibule door or its occupied interior.

**Roof and openings.** Four planar glazed slopes with a sparse, structural mullion grid and actual diagonal corner bars; low stone kerb/base. Opaque native glazing is intentional: this is not a request for transparent rendering or visible plants inside. A vertical timber/glass entrance door belongs to the vestibule, not a tilted door painted on the pyramid. There is no central lantern, sphere, open roof hole or ornamental needle.

**Nearest prior assets.** `holtscout v728` is a long A-shell with two near-ground roof planes and vertical triangular end walls; `ferncourt v564` has two high, six-sided glazed pavilion walls below pointed roofs; `periwinklebell v912` is a solid square room with a dominant octagonal broach spire; `thistlenursery v628` has an upright central octagon, clerestory and apsidal wings. Pre-wave `manorConservatory014` and `UKF021-M` use upright-wall multi-span glasshouses. The superseded, unimplemented real wave11 garden list is not a source to copy.

**Material structural difference.** Four near-ground triangular enclosure planes, a single apex, low knee wall and one modest penetrative entrance. This cannot be produced by recolouring the six-sided Fern Court or truncating an A-frame.

**Implementation/readability risk: medium, bounded.** Planar pyramidal faces are simple; the only nontrivial operation is the finite door-vestibule intersection. Reject if normal-height square walls are added, if the roof becomes a mere cap, if it collapses into a long A-frame, or if the vestibule door is obstructed by roof geometry. This model should need no cavity or transparency repair.

### 03. maddartutors — Madder Tutors' Rooms / 茜草分科學舍

`v928..931`. Fictional use: four small tuition/work rooms connected by a shared foyer, without education-service changes.

**Whole-building idea.** Four substantial square brick rooms occupy the corners of a compact plot. A much lower, fully enclosed cross-shaped foyer connects their inward corners. The four room roofs are separate complete pyramidal hips; the middle is a low flat lead roof. There is **no courtyard or open central hole**. Midpoint notches between outer rooms remain open outdoor recesses, making the four room blocks and low central connector legible.

**Plan and section.** Use corner rooms approximately `[3,14]×[3,14]`, `[18,29]×[3,14]`, `[3,14]×[18,29]`, `[18,29]×[18,29]`. A low cross made from `x10..22,y14..18` plus `x14..18,y10..22` has finite 4-unit wall contacts with the inward portions of each room; do not join corners at one point. Room eaves may be 14, 18, 12 and 16, with 5-unit hips; the foyer roof stays around 8.5. Roof overhangs must not close the 4-unit exterior gaps.

**Roof and openings.** Outer room faces each use a different useful aperture grouping: broad three-light study window, paired sashes, high horizontal art-work window, two tall narrow lights. Keep those restrained, not four arbitrary styles. The public ground door is on an outer corner-room face with direct foyer access inside; no hidden entrance deep in a four-unit slot is required. Foyer end faces can have modest rectangular glazing. All foundations are grounded.

**Nearest prior assets.** `broomtranslations v836` is three contiguous collinear stepped hip-roof ranges; `rowdenmortuary v712` has two square pavilions and a recessed entrance; `rushfordlav v688` has one low cruciform body and outward monopitches under a small central cap; `elmglass v656` is three Y arms around a high central triangular lantern; `knapmediation v800` is two triangles around an open diagonal court.

**Material structural difference.** Four detached-in-the-upper-section corner rooms tied by a **low solid cross**, with four separate dominant hips and no courtyard. It is not four copies of a windowed box pushed together into one square roof or an expanded Broom row. The low-middle/high-corner section is the reverse of high-central-hall families.

**Implementation/readability risk: low–medium.** All walls and roofs are axis-aligned closed pieces. Critical checks are finite connector contact, no covered outside notch, no coplanar roof crossings and a visibly low centre from every oblique view. Reject if the centre becomes a tower, a courtyard hole appears, or only the count of roofs differentiates it from a contiguous row.

### 04. restharrowsalt — Restharrow Road-Salt Store / 芒柄花道鹽庫

`v932..935`. Fictional use: village road-maintenance material store exhibit; no inventories, snow clearing or road-service effects.

**Whole-building idea.** A single long, heavy stone store has a **trapezoidal transverse section**: both long side walls lean conspicuously inward from a broad grounded base to a much narrower flat lead roof. The two short end walls remain vertical trapezoids. It is not a normal rectangular room with a pitched roof, a cone, a tapered circular tower or an earth-covered vault.

**Plan and section.** Length `y5..28`; broad lower width `x4..28`; wall top at `z19`, narrowed to `x10..22`. Flat roof closes only this top 12-unit-wide strip. The long side-wall plane moves inward 6 units over its height, giving a visible section even without texture. No roof over the full broad base and no earth bank. A tiny attached low side cabinet, if retained at all, must remain subordinate and is not a novelty requirement.

**Roof and openings.** A single narrow planar lead roof with modest coping, no pyramid cap. The principal closed double loading door is centred in a vertical trapezoid end wall, approximately 6 units wide and 9 high, at ground level. One side-person door belongs to the opposite vertical end; three sparse high vent lights follow the actual sloping long wall planes. Recess/frame geometry is mapped to those planes. There are no falsely vertical panes floating in front of sloped stone.

**Nearest prior assets.** `coppicelecture v824` is a rectangular plan with vertical side walls and one continuously rising **roof along its length**; `heatherdye v664` has two square bodies widening upwards; `tamargauge v776` is a single concave-waisted six-rib tower; `cressice v716` is an earth-banked low vault; `landmarktheatre v400` consists of twin truncated circular cones; pre-wave warehouses are upright walls under ordinary gables.

**Material structural difference.** One elongated inward-battered **wall body** under a narrow flat lid, with vertical trapezoidal door ends. The tapered dimension is transverse wall width, not roof rise, radius or a tower waist.

**Implementation/readability risk: low.** Six main planar solid faces, plus apertures and coping. Keep vertical short-end door geometry straightforward. Reject if the side slopes become a gable roof resting above a normal room, the taper is merely a stone pattern, or the form becomes a truncated round cone. Native review must confirm both low broad foot and narrower top are visible.

### 05. betonymarionette — Betony Marionette Rooms / 水蘇木偶工藝館

`v936..939`. Fictional use: puppet making, storage and small display rooms; no theatre or animation mechanic.

**Whole-building idea.** Three substantial enclosed gabled room volumes telescope **in one straight axis**, progressively narrowing and lowering toward the entrance. This is a single attached building with three clearly stepped eaves/ridges, not a tall box with a token porch. The largest rear room is a high assembly/storage room, the middle is a sizeable making room, the front is a smaller but real reception/display room.

**Plan and section.** Rear `x4..28,y4..13`, eave24/ridge33; middle `x7..25,y13..22`, eave16/ridge24; front `x10..22,y22..29`, eave10/ridge16. All three ridge axes run north–south. They meet over finite whole-wall widths; the higher body's front wall visibly rises above the lower roof. Tune lengths to prevent the main rear gable from appearing to be an attached tower.

**Roof and openings.** Three complete simple slate gables, with actual step walls and resolved lower-roof-to-higher-wall flashing. Rear room: high vertical pairs and broad side loading doors. Middle: wide work windows. Front: one low public door and two modest square-paned windows. No roof holes, fake loading doors, theatre emblem, puppets or tall sign needed. Do not project a front door above ground to manufacture height difference.

**Nearest prior assets.** `gorsepicture v848` has one narrow **tall front** foyer joined to a broad **lower rear** clipped-octagonal auditorium; `brooktools v632` is a cranked Z of three skillions; `coppicelecture v824` is one uninterrupted wedge; `rowanclock v648` is a four-storey vertically stepped narrow town house with M roof; `cardington v192` is one uninterrupted high hangar; pre-wave ordinary barns have only a small porch/annex.

**Material structural difference.** Three co-axial, co-dominant progressively wider/taller rooms with separate ordinary gables and two real full-width section steps. No angular plan, slope roof, rear polygon or tall entrance blade.

**Implementation/readability risk: low.** Straight closed boxes and gables. Check end-wall/roof intersections explicitly; no overlapping internal end facade should show through the front room. Reject if middle/front rooms shrink into decorative porches, if there is only one roof with painted step bands, or if the front becomes the tallest mass. The side silhouette must show all three physical sizes.

### 06. burnetterrace — Burnet Terrace Teaching House / 地榆露臺講習所

`v940..943`. Fictional use: small-town demonstration/teaching rooms with an upper outdoor terrace; no path routing or capacity change.

**Whole-building idea.** A broad low grounded masonry base contains two forward side rooms. A **wide, central external straight stair** occupies the opening between them and reaches a real upper terrace. A narrower high gabled teaching room sits at the back of that terrace. The staircase, low roof terrace and rear upper room form the principal stepped section. There is no central elevated bridge, undercroft, earth bank, dome or front column portico.

**Plan and section.** Lower rear/base room around `x4..28,y4..17,z.6..9`; forward low side rooms around `x4..12,y17..28` and `x20..28,y17..28`, also ending at z9. Upper rear room `x7..25,y4..12,z9..23`, gable ridge around 30. Actual upper terrace floor is the low base roof in front of the upper room, `y12..17`, and the two lower side-room roofs. Central stair `x12..20,y17..29` rises from .6 to9 over its whole 12-unit run. Every stair landing and upper door threshold is at z9; lower ground doors enter the side rooms directly. Guard terrace edges with modest physically grounded parapets.

**Roof and openings.** One ordinary high rear gable plus the low lead terrace roofs, not a series of roofed stair ramps. The upstairs door opens onto the terrace; upper side windows are tall paired sashes. Low forward rooms have broad horizontal windows and separate ground-level doors. Retain closed occupied base walls behind the stair, not an accidental tunnel under the terrace.

**Nearest prior assets.** `chiswick v180` has a domed villa and a projecting six-column portico reached by two side stairs; `norfolk v364` is an extended stepped housing system; `campionbarn v900` is rear-banked upper loading with a genuinely open lower front arcade; `catmintbridge v908` uses two opposed enclosed stairs and an open raised central bridge; `gorsepicture v848` has a high narrow front entrance and low broad rear auditorium.

**Material structural difference.** One open central stair inserted between two low occupied front rooms reaches a broad exposed roof terrace in front of one high **rear** room. This is a stepped occupied section, not a paired outside-stair portico, earth approach or bridge.

**Implementation/readability risk: medium, bounded.** Axis-aligned boxes and actual treads suffice. The rise/run is deliberately modest; no two-level deep cavity or long stair hidden inside walls. Reject if steps are reduced to painted stripes, the upper door has no landing, the terrace is filled by another roof, or side rooms become stair supports for a bridge. Check tread/landing continuity and the step silhouette in the two side-oblique views.

### 07. figwortcolour — Figwort Watercolour Rooms / 玄參水彩工房

`v944..947`. Fictional use: three daylit painting/work bays with a shared backing gallery.

**Whole-building idea.** One high narrow straight brick backing gallery serves **three lower grounded triangular workrooms**, each attached to the gallery by its entire broad base. Their outer ends are genuine sharp plan corners, producing three triangular teeth across the front, not three rectangular fingers, a continuous fan-wedge building or roof-only sawteeth. Each triangular room has its own simple three-plane hip; the backing gallery has one long complete gable.

**Plan and section.** Back gallery `x3..29,y5..13`, eave18/ridge25. Frozen triangle roots and tips: `(3,13),(11,13),(7,25)`; `(12,13),(20,13),(16,29)`; `(21,13),(29,13),(25,25)`. Their eaves are 8.5–10; each roof's high point sits close to its broad attached base, rising to 13–16, below the gallery eave. These are finite enclosed rooms, not wedge-shaped exterior paving. The middle tooth is longer; the two outside teeth stay lower and shorter. Clear open outdoor V gaps remain between them.

**Roof and openings.** The long rear hall has small high sash windows and a plain ground door on an end wall. Each triangular room has broad small-paned glazing on both oblique faces, with real solid corner posts and enough opaque low wall to ground the room. Public entry may be on a broad side near the base, never on an impossibly narrow sharp tip. Roofs stay three planar slopes with visible thickness; no cone or bowl.

**Nearest prior assets.** `alderjoinery v680` is an E with three **rectangular gabled fingers** and open rectangular courts; `flintchart v644` is one continuous fan-wedge beneath **radial northlight sawtooth roofs**, not separate pointed rooms; `knapmediation v800` is two separated triangular rooms around a diagonal court joined at one end; `coventry v224` has folded glazing along a large church nave and a bowed baptistery; `teaselhat v744` is one narrow three-storey triangular wedge.

**Material structural difference.** Three substantial low triangular glazed rooms, each with broad full-base attachment to one taller straight gallery, form a true serrated **ground plan** with three separate planar hip roofs. No copied E fingers with triangular painted window patterns; no one-piece fan envelope.

**Implementation/readability risk: low–medium.** Each triangular room and roof is convex and individually closed. Separate the backs correctly at the higher gallery wall; no universal concave roof polygon. Reject if triangles become roof decorations on a rectangle, if gaps are roofed over, or if the gallery/three-teeth silhouette is lost under oversized hips. Native side views must establish the different low bay and high gallery sections.

### 08. damewortcruck — Damewort Three-Gable Cruck Hall / 香花芥三山牆工藝館

v948..951.

**Damewort Three-Gable Cruck Hall**, a fictional communal cutting hall, is the frozen eighth model. Source geometry and official native verification are still required.

- One continuous **hexagonal, near-ground roof enclosure**, not a normal-height house with a novel cap. Centre `(16,16)`; regular hexagon radius 13, vertices approximately `(29,16), (22.5,27.258), (9.5,27.258), (3,16), (9.5,4.742), (22.5,4.742)`. Derive every vertex from the same formula.
- A low stone knee wall ends at z3. On alternating edges 0, 2 and 4, a full-width vertical triangular timber/glazed gable rises from the two edge corners to its edge midpoint at z27. The other three edges remain low knee walls. A central roof junction is `(16,16,27)`.
- For each gabled edge, use **two** closed triangular roof planes from its corner, its high midpoint and the high centre. For each remaining edge, use **one** triangular hip plane from its two low corners to the high centre. The nine planes partition the hexagon without a roof hole or concave fan fill. Three horizontal radial ridges meet centrally; three broad gable ends alternate with three low hipped flanks.
- Put the public door and a separate material door at the centres of two actual vertical gable ends, with ground thresholds, jamb thickness and upper triangular glazing. The third gable gets a broad workshop window. No tilted roof door, tiny dormer, extra lantern or machinery is needed. A sparse true timber frame supports the low-eave/high-gable section.
- Distinguish from Holt Scout v728's **one longitudinal A-shell**, Fern Court v564's **two upright hexagonal pavilions**, and Rushton v112's **three-storey triangular lodge**. Here the single low hexagonal body, three dominant gable-front enclosure faces and three alternating low flanks are inseparable. It is not a recoloured pavilion or just another roof on Damewort's original box.
- Reject if ordinary tall hexagonal walls are added, if the three gables become dormers, or if the central roof is replaced by a pointed pavilion cap. The common ridge junction, roof thickness, wall-head seams and aperture margins still need normal geometric guards and official native review. This is a stronger structural candidate, not a guarantee of visual success. 


### 09. pimpernelcross — Pimpernel Cross-Lane Reading Rooms / 琉璃繁縷交巷閱覽館

v952..955. Fictional original village reading/work rooms, no education service or path changes.

Whole building: two substantial grounded enclosed rectangular halls cross at a real 60-degree angle, producing four unequal occupied gabled arms. This is one continuous connected X-plan building with four exterior re-entrant valleys between arms; no courtyard, tower, roof lantern, raised undercroft or ornamental wings. The high central ridge intersection belongs to the two continuous roofs rather than an extra central pavilion. Each arm ends in its own complete vertical gable face. Roof intersection is a genuine closed union, not overlapping complete roof meshes.

Frozen structural coordinates: centre C=(16,16), hall A unit longitudinal axis (1,0), lateral (0,1), t=-13..11 and v=-3.5..3.5. Hall B unit longitudinal axis (1/2,sqrt(3)/2), lateral (-sqrt(3)/2,1/2), t=-10..13 and v=-3.5..3.5. Ground floor z=.6, eaves18, common ridge28. Both rooms are fully grounded and have the same seven-unit occupied width. Coordinates are derived from these shared bases, not independently rounded endpoints. Roof plane for either hall is 28-(10/3.5)*abs(v). Across the overlap, retain the higher roof plane, with a deterministic single ownership at equal-height seams. Outside the other footprint, retain the hall's own roof. The equality lines vA=vB and vA=-vB define the true valley seams; split plane polygons at those lines and both footprint boundaries. The union has no roof opening, vertical step or buried double roof. Trim internal wall segments inside the other occupied footprint; close each remaining exterior wall to its actual roof soffit. Roof thickness/end closures and any finite eave extensions use the same clipped boundary, not overlapping generic full gables. The central floor is continuous, no duplicated occupied floor slabs.

Four end gables must remain substantial and unequal: each extends beyond the maximum shared crossing length 3.5*cot(30 degrees)=6.0621778265, leaving clear arm lengths approximately6.938,4.938,3.938,6.938. The different relative endpoints still distinguish A/B. Window/door placement uses the arm-local basis. Put a ground public door and generous upper gable light on A positive end; a distinct ordinary material/service entrance on B negative end; other ends have broad work windows. Side windows must lie on exposed arm walls outside the crossing. No inaccessible door at an acute internal junction or tilted window stuck on an axis-aligned plane.

Nearest existing: rushfordlav v688 has an orthogonal low cross with four outward monopitches and a small central cap; elmglass v656 has three Y arms around an independent high triangular clerestory; hyssopupholstery v864 has only two perpendicular gambrel ranges in an L; guelderlace v844 has separated parallel gables and a low diagonal link. Older cruciform churches have longitudinal nave/aisles, a short orthogonal transept and often a tower, not two equal-width obliquely crossing four-ended workshop halls. Do not call a rotated ordinary cross a new X: the actual 60-degree intersection and four unequal full gabled arms must survive all native views. New eighth model is one hexagonal low roof enclosure with three alternating gable edges, not this four-arm rectangular-room union.

Reject if it is only a sheared old jettied house, if one arm shrinks to a porch, if generic roofs penetrate each other, if a dark panel masks a central gap, if a tower or cover hides the intersection, if the angle is 90degrees, or if only signs/colour supply the identity. Geometry controls must remove one arm, rotate B to90, leave a duplicate/buried roof, open a valley seam, or restore an internal crossing wall and obtain a precise first RED. Actual original four-view PNGs, rather than mathematical angle alone, determine visible whole-building distinction.

### 10. fumitorygin — Fumitory Horse-Gin Barn / 紫堇馬力棚穀舍

`v956..959`. Fictional use: a rural mechanical-history barn with a static sheltered horse-gin exhibition area. No animal, engine, wheel, power or production simulation is introduced; movable machinery is not needed to establish the design.

**Whole-building idea.** One tall narrow enclosed gabled barn is joined along its long side to a **broad, much lower open octagonal engine shelter**. The shelter has its own complete low pyramidal roof on substantial spaced timber posts, with a genuine full-width shared flat facet against the barn. The barn and low polygonal shelter are co-dominant; this is not a tiny gazebo accessory or a closed oast cylinder.

**Plan and section.** Define the regular octagon once: centre `cx=21.5, cy=16`, circumradius `r=8`, vertex angles `π/8 + i·π/4`. Derive the shared interface from that same polygon: `xJoin = cx − r·cos(π/8)` (approximately 14.1089637399), `yJoinLow = cy − r·sin(π/8)` (approximately 12.9385325411), and `yJoinHigh = cy + r·sin(π/8)` (approximately 19.0614674589). The barn is exactly `x4..xJoin,y4..28`, eave22/ridge30; the shelter's complete left facet is exactly `(xJoin,yJoinLow)..(xJoin,yJoinHigh)`. Both builders must use the same derived coordinates/vertices, not independently rounded literals. The finite shared chord is `2r·sin(π/8)` (approximately 6.1229349178 units); there is no 0.009-unit gap, point tangency, arbitrary epsilon overlap or depth-bias disguise.

Shelter eave around9.5, apex16; roof planes and posts remain below the barn eave. Its far-right extent is `cx+r·cos(π/8)` (approximately 28.8910362601). Trim the shelter roof and floor to the exact octagon boundary at `xJoin`; neither may cross into the barn. Do not retain a second coincident shelter-side wall, a roof face crossing the shared plane, or any concealed duplicate internal face. The barn's side wall is the sole real boundary at the shared facet, with its ordinary access doorway explicitly opened/closed by the intended door construction rather than covered by a second solid wall. Exterior seven facets remain openly framed; the barn-side eighth facet is the exact shared interface, not an extra painted partition. Use its two derived endpoints for any wall/post/roof-edge junction, so all contacts remain exact.

**Roof and openings.** Barn: narrow high slit work windows, one tall but closed end loading door and one ordinary grounded service door. An ordinary door through the shared barn facet opens into the sheltered zone. Shelter: single shallow eight-plane slate hip/pyramid, no lantern, dormers, cupola or finial; sparse corner posts and short visible braces, true open sides, simple grounded floor. Give the roof a real underside, not a flat cap blackened to imply depth. Keep clear sides wide enough that posts and open air survive native sampling.

**Nearest prior assets.** `hopdrying v888` has a **tall closed round cone/kiln** joined off-axis to a long two-storey gabled sorting house; `dunster v164` is a standalone open octagonal market with eight dormers and a lantern; `elmstone v700` is a rectangular open cutting shed plus low rear tool strip; `bramblewheel v660` is a low semicircular open cart shed forming a true D court against a rear workshop; `dittanygeology v868` is a closed round central room with two opposed gabled wings. The older farm compounds have raised granaries, sheds and courts, not a broad side-attached polygonal open engine bay.

**Material structural difference.** A tall thin closed spine beside a wide low **fully covered open polygon**, directly joined on a full flat facet. It lacks the tall closed cone of Hopdrying, the free-standing symmetry/lantern of Dunster and the open-sky central D yard of Bramblewheel.

**Implementation/readability risk: low–medium.** Standard barn plus a convex eight-plane roof, eight simple post positions and a finite shared wall facet. The roof is shallow enough that side openings are obvious without needing a deep hollow. Reject if the shelter becomes an enclosed round kiln, its roof shrinks into an incidental porch, it opens an unroofed courtyard, or the barn is merely a token attached cupboard. The side-by-side height and enclosure contrast must remain clear with all machinery omitted.

## 首卡前幾何收束（下列為正式驗收的一部分）

- 01 roof plan coverage alone is insufficient: close wall heads to the actual hip soffit, including end-bay forward walls and rear wall. Central covered exterior recess stays open below its real spanning eaves beam; no hidden upper room/floor fills it.
- 02 derive the vestibule/roof crossing from one exact plane equation. Clip the penetrated pyramid face and vestibule ceiling consistently, remove the interior knee-wall segment, retain real closed exterior joints. No duplicate roof under the glazed slope or entry-door obstruction.
- 03 keep each four-unit finite connector contact and exterior recess open; remove coincident internal walls and do not put a common square roof over the compound.
- 04 omit the optional cabinet. The tapered long walls themselves carry real planar windows; all six enclosing faces are closed.
- 05 stepped gabled-room contacts at y13/y22 retain exposed upper wall while removing interior portions below the lower roof. No roof overhang projects into the taller room.
- 06 stair HIGH landing z9 at y17, LOW foot z.6 at y29; use a correctly oriented real tread construction, not inherited increasing-y steps. Upper door threshold/terrace finished surface both z9. Leave clear x12..20 stair opening in parapet and five-unit terrace before y12 upper door.
- 07 roof edges at triangle roots must be clipped inside their exact triangle plan; preserve the full one-unit root gaps and wider outdoor V gaps. No half-unit overhangs sealing the gaps. The three rooms remain solid occupied triangles joined along their complete bases to the high gallery, not painted rectangular fingers.
- 08 derive all hex vertices and nine roof planes from the same centre/radius, with exact shared boundaries and real thickness/soffit closure. Gable doors/glazing lie in their true vertical planes. No tall generic hex room or three small dormers.
- 09 exact plane-clipped roof union above is required, including analytical single-surface coverage over the full occupied footprint, edge matching at valleys and finite four-arm emergence. Record source-only proof separately from native visible acceptance.
- 10 shared octagonal facet and barn wall use identical derived xJoin=21.5-8*cos(pi/8), y endpoints=16±8*sin(pi/8). Clip roof thickness and end posts too. Seven exterior sides remain genuinely open below the roof. No epsilon overlap or cosmetic cover hides a gap.

## 凍結驗收（保留前波全部適用門檻與真反例）

1. 本卡單檔先推；同一原始main Git物件作獨立BASE。新增三個明確art／CSS／runtime區塊與原生安裝尾；剝除後完整index逐byte回BASE。舊smoke只新增自己的自檢，舊斷言、fp.js、harness、gallery、probe既有判準、pins、規則與其他已發布來源都保持原文。發布時僅明列三版本標籤與日誌／方向紀錄的嚴格插入例外；每個例外均須真破壞首紅。
2. 十款各四向＝40日／40night原生160×196／ax80／ay194／sz2精靈，無缺項、半透明軟邊、裁切或光漏；夜光只在白天可見實體窗及燈具。去共用鋪地後十個結構剪影必須不同，四向是世界幾何旋轉，實際安裝像素等於獨立建模；不得用換名或換色填數。保留缺葉、重複幾何、錯尺寸、裁切、天空夜光、軟像素、空圖與錯安裝等首紅及精確恢復。
3. CI真Chrome、原生目錄與付費建造，十款選取／40向、完整root與ref、扣款、undo／redo／拆除及refund、slot3存讀與歷史完整欄位不變。三種子31／71／103、九checkpoint的正常BASE／HEAD決定性比較；至少86原生斷言與12類真首紅。失鎖／缺項時不可選，逃生閥保留，不改既有儲存語義。
4. 原生供電on／斷道路／關電源／恢復四態，各十款四向＝160案例、275遊戲PNG、1920固定交通相位見證。保留全畫布嚴格相等、窗光移除與交通相位擾動負控、未通電精確相等與供電恢復；不遮罩、不裁切比較、不改容忍、不賦pw／capacity／dispatch／nightPowerRate真值，不把fixture帶進production，不排除存檔欄位。
5. 日夜、四季含冬雪／無雪、四向、遠景、邊緣、施工、懸停與疊層，保留57場景與40實際邊緣案例、至少113場景PNG、8組BASE／valve整幀逐位相等、兩次完整舊檔roundtrip及實際一元／單像素破壞負控。保留17行人深度遮擋案例及兩負控，不能拿靜態圖代遊戲驗收。
6. 同runner、同視窗、交錯BASE／HEAD各40組原生效能樣本；保暖draw新增幾何0，原門檻不變。保留30樣本實際延遲注入負控與恢復，列median／p90，不宣稱真機手機效能。
7. 常規push／PR最後head smoke3連綠、fp零差、財務53項／10負控全綠。首次預期美術fp紅保留完整結果；僅採同一精確CI的原始fp／style附件，核恰bld新增40且舊葉／其他族／block／env不變。任何分數下降列前後七軸及total，在卡／PR／方向表依連續授權披露；不手改分數、基線metadata或門檻，不重跑賭綠。
8. 留80單圖、3接觸表、10近景、真實遊戲預覽與manifest／SHA／producer head／artifact；作者與獨立看圖、實際檢視與產物存在分開。原PNG用已核可訪問專案連結交付，不無限重試Library。沒有實看不能說看過；實機手機／Safari／觸控沒有測就保持未測。適用圖片審閱沿用方向與AGENTS，不逐波重問同一製作授權。
9. 臨時workflow僅本分支、contents:read，無部署或遠端寫入；最後run全綠後只刪workflow的獨立commit，之後它保持不存在。最新head所有必要CI及第8節自檢如實記錄；T／版本／r取當時main最大+1。符合規則才合併，核main CI、既有自動Pages、實際公開完整HTML SHA／版本與瀏覽器；不手動觸發Pages。正式發布才計20／20波200座；完成原定數量，不擅自開第21波。


10. 額外施工就緒不是替換原57場景：保留原冷draw兩次，另真原生付費建十款age7，固定12個自然rAF，不flush／加速／提前挑幀，終點pending、shell／LayerA miss均0且十棟量體可見。另開全新瀏覽器明示單次既有flush fixture及固定66自然幀；不可冒稱正常冷啟效能。兩路日夜整畫布RGBA嚴格重畫相等及單像素破壞／恢復，原X13G與8ms idle／3ms fallback／2shell／6個6ms LayerA預算逐byte保持，不失敗後延長時間賭綠。
11. 本卡十個身份及上述實體結構要求須由真實繪圖面、實體記錄與source mutation負控驗證；不可只檢查details旗標或設計文字。所有完整曲面／屋面／牆頭／入口／支承必須閉合或依卡面真開放，既有門檻一律不放寬。首卡後若需要改變凍結量體要求，保留原版本並先取得適用授權。

## 初始狀態與第8節自檢

- [x] 第19波精確main／Pages／公網成功，正式190；本卡先凍結單一bld與十身份。
- [ ] 本波模型0／10、原生40向0／40、CI與實圖未跑；不把準備解析當產品。
- [ ] 全部同種子、供電160案例、275PNG、原生操作、存讀、完整場景、財務、真反例與效能須實作後官方CI驗收。
- [x] 不本地跑遊戲／Chrome／Canvas／fp／像素烘焙；僅source與recording-stub幾何可在本地檢查。

## 沒做成的事

已淘汰兩個近似舊模型草案，保留原因，不把湊數當成果。本波尚未實作或原生驗證；第08三山牆接縫、第09斜交屋谷及第02入口切面須真幾何和原圖雙驗，不能只看解析綠。實體手機、Safari、觸控未驗證。原冷啟動與非同步烘焙限制不隱藏、不改共用排程或延長原閘門取得綠燈。

## C3 全套正式候選驗收收束（2026-10-25 06:25 UTC）

本節追加當前結果；上方首卡與初始狀態保留，不能再把歷史0/10當成現況。C3 `5fc1718845a97b74fea3c325bb5343ed904c2db5` 的完整原生 [40166524238](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524238) 已於06:19:52 UTC完成，29/29工作成功；標準push [40166524277](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166524277) 與PR [40166527305](https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/40166527305) 成功。29工作含20個來源／圖片／manifest運輸工作，不冒稱29種不同產品測試。完整來源、版本、圖像與性能數字見 [C3最終證據](GPT-048-C3-final-evidence.md)。

第8節自檢更新：
- [x] 首卡002f14f在施工前推；本附錄不改任何凍結驗收、量體或門檻。
- [x] C3三種子原生交易及完整正常前後比較成功；兩輪舊存檔完整欄位比較成功，原生writer唯一明列遷移gameVer14.66→14.67。
- [x] C3常規fp與倉庫葉子零變動，與獨立main相比只bld新增40／改0／刪0；8組關閥整幀嚴格相等，沒有envLeaves警告；七軸下降仍據實列出。
- [x] 原生四向／日夜／四季／雪有無／遠近／邊緣／疊層矩陣完成。人工範圍仍依visual-review，不冒稱275供電圖全部人工看過；C1/C3唯一不同construction-late原圖另成對實看，保留非同步施工瞬間，固定12自然幀終點十棟完整可見。
- [x] C3原生86檢查／12負控、52幾何負控、160供電案例／275PNG／1920相位、完整場景與原有財務負控成功；性能負控本次實際注入61ms（不是C1歷史59ms），精確紅後恢復綠。
- [x] C3煙霧三次／fp／財務及完整native全綠，保留全部首紅，未重跑賭綠。
- [x] 未測的實體手機／Safari／觸控仍明列；尚未合併／部署，正式仍190，不把候選寫成200。

只在上述完整native最後run成功後，另以獨立提交刪除本分支專屬`.github/workflows/wave048-native.yml`；再等待刪除後最新head標準push／PR CI。T774／v14.67／r221已配置，main仍4346a965且main CI／自動Pages全綠。符合全部規則才Ready／合併，接著驗main CI／既有自動Pages／實際公網完整HTML及Chromium；全部成功才正式20/20、200座。不手動觸發Pages，不開第21波。
