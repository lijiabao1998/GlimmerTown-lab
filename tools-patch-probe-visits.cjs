'use strict';
const fs = require('node:fs');
const p = 'probeRealVisits10.cjs';
let s = fs.readFileSync(p, 'utf8');

const anchor = '    const v = V.computeShadowVisits({ radius: 24, stations, shops });';
if (s.split(anchor).length !== 2) { console.log('anchor missing'); process.exit(1); }

const block = [
  '    // Real walk distance: BFS over native road tiles between each endpoint\'s nearest road.',
  '    const roadAt = (x, y) => { const t = GV.tile(x, y); return !!(t && t.road); };',
  '    const nearestRoad = (x, y) => {',
  '      for (let r = 0; r <= 2; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {',
  '        const nx = x + dx, ny = y + dy;',
  '        if (nx >= 0 && ny >= 0 && nx < n && ny < n && roadAt(nx, ny)) return [nx, ny];',
  '      }',
  '      return null;',
  '    };',
  '    const distCache = new Map();',
  '    const roadDist = (ax, ay, bx, by) => {',
  '      const A = nearestRoad(Math.round(ax), Math.round(ay)), B = nearestRoad(Math.round(bx), Math.round(by));',
  '      if (!A || !B) return Infinity;',
  '      const key = A[0] + \',\' + A[1] + \'>\' + B[0] + \',\' + B[1];',
  '      if (distCache.has(key)) return distCache.get(key);',
  '      const seen = new Uint8Array(n * n), q = [[A[0], A[1], 0]];',
  '      seen[A[1] * n + A[0]] = 1;',
  '      let ans = Infinity;',
  '      while (q.length) {',
  '        const cur = q.shift(); const x = cur[0], y = cur[1], d = cur[2];',
  '        if (x === B[0] && y === B[1]) { ans = d; break; }',
  '        if (d > 48) continue;',
  '        const nb = [[1,0],[-1,0],[0,1],[0,-1]];',
  '        for (let i = 0; i < 4; i++) {',
  '          const nx = x + nb[i][0], ny = y + nb[i][1];',
  '          if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;',
  '          const kk = ny * n + nx;',
  '          if (seen[kk] || !roadAt(nx, ny)) continue;',
  '          seen[kk] = 1; q.push([nx, ny, d + 1]);',
  '        }',
  '      }',
  '      distCache.set(key, ans); return ans;',
  '    };',
  '    const v = V.computeShadowVisits({ radius: 24, stations, shops, walkDistance: roadDist });'
].join('\n');

s = s.replace(anchor, block);
fs.writeFileSync(p, s);
console.log('probe now uses road BFS distance');
