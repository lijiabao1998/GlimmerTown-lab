// 第十一批決策單：臨時實驗碼（拍完 git checkout -- index.html 還原）
'use strict';
const fs = require('fs'), path = require('path');
const F = '/home/user/GlimmerTown-lab/index.html';
let s = fs.readFileSync(F, 'utf8');
const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error('錨點出現 ' + n + ' 次：' + a.slice(0, 80)); s = s.replace(a, () => b); };
const BB = fs.readFileSync(path.join(__dirname, 'bigben.js'), 'utf8');
rep("  })();}catch(e){console.error('v574 k189',e);}\n\n  /* @@NEXT@@ */", "  })();}catch(e){console.error('v574 k189',e);}\n" + BB + "\n  /* @@NEXT@@ */");
fs.writeFileSync(F, s);
console.log('patched');
