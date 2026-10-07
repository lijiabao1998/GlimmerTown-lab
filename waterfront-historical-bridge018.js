'use strict';
// The complete original017 historical adapter is retained with audited,
// reversible source spans. Full3147 proof precedes every old data projection.
// Historical source/release validators never approve the current018 candidate.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const fixed=require('./waterfront-static-contract018'),{exactTransform018}=require('./waterfront-compatibility018');
function buildBridge018(){
 const file='quayside-historical-bridge017.js',source=fs.readFileSync(path.join(__dirname,file),'utf8');
 if(source!==fixed.baseFile(file).toString())throw Error('Complete original017 historical bridge must remain byte-exact');
 const start='function currentProduct014(){',end='\n// Only source contracts advance;';
 if(source.split(start).length!==2||source.split(end).length!==2)throw Error('Unique original017 current-product boundaries required');
 const oldProduct=source.slice(source.indexOf(start),source.indexOf(end));
 const newProduct=`function currentProduct014(){
 const q=require('./waterfront-static-contract018').verifyStatic018();
 if(['ok','htmlExact','protectedExact','fpExact','logExact','coldLoadFixExact'].some(k=>q[k]!==true)||q.release!==false||q.phase!=='candidate'||q.publicationApproved!==false||q.version!=='14.34'||q.anchor!=='T730'||q.additionCount!==8)throw Error('Current independently verified unapproved GPT-018 candidate required');
 return q;
}`;
 const q=exactTransform018(source,[
  ["native=require('./quayside-fingerprint017')","native=require('./waterfront-fingerprint018')"],
  [oldProduct,newProduct],
  ["BASE:require('./quayside-static-contract017').BASE","BASE:require('./waterfront-static-contract018').BASE",2],
  ['\n\nfunction verifyStatic010()',"\nconst native017Contract={...require('./quayside-static-contract017'),BASE:require('./waterfront-static-contract018').BASE,verifyStatic017:currentProduct014};\n\nfunction verifyStatic010()"],
  ['native.project017(fp,blocks)','native.project018(fp,blocks)'],
  ["[...require('./quayside-static-contract017').expectedAdditions","[...require('./waterfront-static-contract018').expectedAdditions,...require('./quayside-static-contract017').expectedAdditions",3],
  ["remove=new Set([...require('./gardenlife-static-contract016').expectedAdditions","remove=new Set([...require('./quayside-static-contract017').expectedAdditions,...require('./gardenlife-static-contract016').expectedAdditions"],
  ['keys.length!==192||new Set(keys).size!==192','keys.length!==200||new Set(keys).size!==200'],
  ['Only24 quayside,24 garden-life,32 streetscape and112 known complex leaves','Only8 waterfront,24 quayside,24 garden-life,32 streetscape and112 known complex leaves'],
  ['projectedOnlyDeclared192','projectedOnlyDeclared200',3],
  ['projectedOnlyDeclared220','projectedOnlyDeclared228'],
  ['projectedOnlyDeclared244','projectedOnlyDeclared252'],
  ['currentLeaves:3139','currentLeaves:3147',3],
  ['currentNativeFamilies:163','currentNativeFamilies:164',3],
  ['currentNativeLeaves:3139','currentNativeLeaves:3147',2],
  ['native.readPreflight017()','native.readPreflight018()'],
  ['Object.keys(qaBaseline.subs).length!==3139||qaBaseline.stats.leaves!==3139||qaBaseline.stats.families!==163','Object.keys(qaBaseline.subs).length!==3147||qaBaseline.stats.leaves!==3147||qaBaseline.stats.families!==164'],
  ['Nested QA baseline must retain every current3139 complete record','Nested QA baseline must retain every current3147 complete record'],
  ["exact=require('./quayside-static-contract017').baseFile('AUTORUN-LOG.md')","exact=require('./waterfront-static-contract018').baseFile('AUTORUN-LOG.md')"],
  ["if(product.release){const entry=product.releaseLogEntry;if(!entry||log.split(entry).length!==2)throw Error('One exact verified T730 log entry required');log=log.replace(entry,'');}","if(product.release)throw Error('Current GPT-018 source cannot claim publication approval');"],
  ['Historical T729 log must recover byte-exact after only the approved T730 entry','Historical T730 log must remain byte-exact for the unapproved GPT-018 candidate'],
  ["of[['T729',require('./gardenlife-static-contract016')]","of[['T730',require('./quayside-static-contract017')],['T729',require('./gardenlife-static-contract016')]"],
  ['module.exports={native015Contract,native016Contract,','module.exports={native015Contract,native016Contract,native017Contract,']
 ]);
 const holder={exports:{}};new vm.Script('(function(require,module,exports,__dirname){'+q.adapted+'\n})',{filename:'.waterfront-historical-runtime018.js'}).runInThisContext()(require,holder,holder.exports,__dirname);
 return{exports:holder.exports,adapted:q.adapted,proof:{...q.proof,originalFile:file,everyUnlistedAssertionByteExact:true,currentLeaves:3147,currentFamilies:164,currentCandidateApproval:false,approvalScope:'historical projected records only',currentProductSourceValidator:'waterfront-static-contract018.verifyStatic018',oldReleaseSourceValidatorsUsed:false}};
}
const built=buildBridge018();
module.exports={...built.exports,buildBridge018,sourceAdapterProof018:built.proof};
