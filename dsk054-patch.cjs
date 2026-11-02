'use strict';
/* Generate the literal, hash-pinned reverse patch for the DSK-054 perf change.
 * from = the original index.html line (origin/main), to = the candidate line.
 * The projector verifies both directions byte-exactly before accepting.
 */
const fs = require('node:fs');
const cp = require('node:child_process');
const crypto = require('node:crypto');

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const cur = fs.readFileSync('index.html', 'utf8');
const main = cp.execFileSync('git', ['show', 'origin/main:index.html'], { maxBuffer: 64 * 1024 * 1024 }).toString();

const grab = (text, re, label) => {
  const m = text.match(re);
  if (!m) throw new Error('missing ' + label);
  return m[0];
};
const mainLine = grab(main, /function mayorFindSite470A\(tool,s\)\{[^\n]*\n/, 'main findSite line');
const curLine = grab(cur, /let MAYOR_PS054=null[\s\S]*?for\(let y=Math\.max\(1,ctr\[1\]-rad\);[\s\S]*?\n/, 'candidate findSite block');

const patch = {
  schema: 'dsk-054-reverse-patch-v1',
  reason: 'AI mayor site scan: exact blocked-footprint prefix prune',
  from: mainLine,
  to: curLine,
  fromSha256: sha(mainLine),
  toSha256: sha(curLine)
};
fs.writeFileSync('perf-patch054.json', JSON.stringify(patch, null, 2) + '\n');
console.log(JSON.stringify({ fromLen: mainLine.length, toLen: curLine.length, fromSha: patch.fromSha256.slice(0, 12), toSha: patch.toSha256.slice(0, 12) }));
