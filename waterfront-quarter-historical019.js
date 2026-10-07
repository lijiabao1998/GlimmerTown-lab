'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),fixed=require('./waterfront-quarter-contract019'),prior=require('./waterfront-historical-bridge018'),{exactTransform018}=require('./waterfront-compatibility018');
function buildBridge019(){
 const original=prior.buildBridge018().adapted,start='function currentProduct014(){',end='\n// Only source contracts advance;',oldProduct=original.slice(original.indexOf(start),original.indexOf(end));
 const currentProduct=`function currentProduct014(){const q=require('./waterfront-quarter-contract019').verifyStatic019();if(!q.ok||q.release!==false||q.publicationApproved!==false||q.phase!=='candidate'||q.version!=='14.35'||q.anchor!=='T731'||q.additionCount!==32)throw Error('Strict current019 unapproved candidate required');return q;}`;
 const changes=[[oldProduct,currentProduct],["native=require('./waterfront-fingerprint018')","native=require('./waterfront-quarter-projection019')"],["require('./waterfront-static-contract018').BASE","require('./waterfront-quarter-contract019').BASE",3],["exact=require('./waterfront-static-contract018').baseFile('AUTORUN-LOG.md')","exact=require('./waterfront-quarter-contract019').baseFile('AUTORUN-LOG.md')"],["of[['T730',require('./quayside-static-contract017')]","of[['T731',require('./waterfront-static-contract018')],['T730',require('./quayside-static-contract017')]"]];
 const q=exactTransform018(original,changes),holder={exports:{}};new vm.Script('(function(require,module,exports,__dirname){'+q.adapted+'\n})').runInThisContext()(require,holder,holder.exports,__dirname);
 return{exports:holder.exports,proof:{...q.proof,original018Proof:prior.sourceAdapterProof018,historicalLeaves:3147,currentLeaves:3179,projectionOnlyAfterIndependentFull3179:true,currentPublicationApproved:false,oldReleaseSourceApprovalUsed:false}};
}
const built=buildBridge019();module.exports={...built.exports,buildBridge019,sourceAdapterProof018:built.proof};
