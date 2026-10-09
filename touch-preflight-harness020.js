'use strict';
// Explicit preflight-only copy. The real harness and all historical audits stay
// byte-exact. No filesystem/module-loader hooks, request rewrites, or game edits.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const ROOT=__dirname,SOURCE=path.join(ROOT,'harness.js');
const ORIGINAL_SHA256='3e86ecaa828fe32a61ffe88a89f420868a6911dc194c6e6a627efdcb1ac28cf6',ORIGINAL_BLOB='e036a12ab44f4735316febaa0f077f15728fe036';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),blob=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
const NAVIGATE="    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });";
const HOOK="    if (o.beforeNavigate) await o.beforeNavigate({ cdp, ws }); // GPT-020: optional read-only response observer\n";
function buildPreflightHarness020(bytes=fs.readFileSync(SOURCE)){
 const raw=Buffer.from(bytes);if(hash(raw)!==ORIGINAL_SHA256||blob(raw)!==ORIGINAL_BLOB)throw Error('Immutable original harness required');
 const source=raw.toString();if(source.split(NAVIGATE).length!==2||source.includes(HOOK))throw Error('One original navigation site required');
 const adapted=source.replace(NAVIGATE,HOOK+NAVIGATE);
 if(adapted.split(HOOK).length!==2||adapted.replace(HOOK,'')!==source)throw Error('Preflight harness adaptation must reverse byte-exactly');
 const holder={exports:{}};
 new vm.Script('(function(require,module,exports,__dirname,__filename){'+adapted.replace(/^#![^\n]*\n/,'')+'\n})',{filename:'touch-preflight-harness020.generated.js'}).runInThisContext()(require,holder,holder.exports,ROOT,SOURCE);
 if(holder.exports.ROOT!==ROOT)throw Error('Preflight must serve the actual candidate root');
 return {exports:holder.exports,adapted,proof:{scope:'preflight-only compiled copy; unchanged harness used elsewhere',originalSHA256:ORIGINAL_SHA256,originalBlob:ORIGINAL_BLOB,adaptedSHA256:hash(adapted),exactOneInsertion:true,reversedByteExact:true,candidateRoot:ROOT,serverBootAndErrorCollectorUnchanged:true}};
}
const built=buildPreflightHarness020();
module.exports={...built.exports,buildPreflightHarness020,proof020:built.proof};
