'use strict';
// Serialized into the public CI browser. Passive native reads only. In
// particular, no ensure/recompute/dispatch/repair API may be used by this probe.
function passivePublicState011(label, retained) {
  const cells = [], paths = [];
  let roads = 0, poweredRoads = 0, sources = 0, poweredSources = 0;
  for (let y = 0; y < 72; y++) for (let x = 0; x < 72; x++) {
    const t = GV.tile(x, y), b = t?.bld, i = y * 72 + x;
    if (t?.road) { roads++; if (t.rp) poweredRoads++; }
    if (b) cells.push({i, k:b.k, ref:b.ref ?? null, sz:b.sz ?? null,
      lv:b.lv ?? null, v:b.v ?? null, age:b.age ?? null});
    if (b && !b.ref && b.k === 5) { sources++; if (b.pw) poweredSources++; }
    if (t?.am502) paths.push({i, am502:t.am502, amx502:t.amx502 ?? null});
  }
  const otherSlots = Object.fromEntries(Object.keys(localStorage).sort()
    .filter(k => /^glimmerville\.v1\.s[12](?:$|[._])/.test(k))
    .map(k => [k, localStorage.getItem(k)]));
  return JSON.parse(JSON.stringify({
    label, stats:GV.stats(), difficulty:GV.diff(), developer:GV.dev516B(),
    version:GV.ver(), slot:localStorage.getItem('glimmerville.v1.slot'),
    menuVisible:getComputedStyle(document.getElementById('start')).display !== 'none',
    physical:{roads, poweredRoads, sources, poweredSources},
    powerReach:window.__t444Power || null, powerDistrictCache:window.__t450Power || null,
    museum:GV.museumEvidence010(), street:GV.streetLifeEvidence009(),
    retained:retained.map(r => ({...r, bld:GV.tile(r.x, r.y).bld})),
    oldMuseums:[[64,40,35],[67,40,206]].map(([x,y,k]) => ({x,y,k,bld:GV.tile(x,y).bld})),
    cells, paths, otherSlots
  }));
}
function functionalPublicState011(q) {
  const museum = q?.museum?.roots || [], street = q?.street?.roots || [];
  return !!q && q.version === '14.28' && q.slot === '3' && q.difficulty === 1 &&
    !q.developer?.sandbox && !q.developer?.god && !q.menuVisible &&
    Number.isFinite(q.stats?.money) && q.stats.pop > 0 && q.stats.poweredBld > 0 &&
    q.physical?.poweredRoads > 0 && q.physical.sources > 0 &&
    q.powerDistrictCache?.districts > 0 &&
    museum.length === 1 && museum.every(r => r.k === 277 && r.built && r.operational &&
      r.power && r.powerState === 1 && r.powerAllocation?.root === r.root &&
      r.water && r.waterState?.code >= 2 && r.waterDelivered > 0 &&
      r.road?.length > 0 && r.positions > 0 && r.employed > 0 &&
      r.staff?.k === 277 && r.activity?.publicJobs > 0 &&
      r.tourism?.currentBase > 0 && !!r.coverageStamp) &&
    street.length === 3 && [274,275,276].every(k => street.some(r => r.k === k &&
      r.operational && r.power && r.powerState === 1 && r.employed > 0)) &&
    q.retained?.length === 47 && q.retained.every(r => r.bld?.k === r.k) &&
    q.oldMuseums?.length === 2 && q.oldMuseums.every(r => r.bld?.k === r.k && r.bld.sz === 2);
}
module.exports = {passivePublicState011, functionalPublicState011};
