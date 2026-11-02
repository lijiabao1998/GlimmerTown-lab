'use strict';
const fs = require('node:fs');
const s = fs.readFileSync('index.html', 'utf8');
const start = s.indexOf('const HIGHSTREET005=Object.freeze({');
const end = s.indexOf('\n});', start);
const body = s.slice(start, end);
const rows = [];
const re = /(\d+):Object\.freeze\(\{([\s\S]*?)\}\),\n/g;
let m;
while ((m = re.exec(body))) {
  const k = Number(m[1]);
  const props = m[2];
  const role = (/role:'([^']+)'/.exec(props) || [])[1] || null;
  const id = (/id:'([^']+)'/.exec(props) || [])[1] || null;
  rows.push({ k, id, role });
}
console.log(JSON.stringify({ total: rows.length, commerce: rows.filter((r) => r.role === 'commerce').map((r) => r.k), all: rows.slice(0, 40) }));
