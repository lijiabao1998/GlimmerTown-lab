'use strict';
// All eight original world/observation/timing functions remain byte-exact.
// Both compared products now carry the unchanged T727 labels, so no save or
// metadata normalization is permitted for this unreleased streetscape candidate.
const vm=require('node:vm'),{isDeepStrictEqual:eq}=require('node:util'),old=require('./complexes-compatibility014'),fixed=require('./streetscape-static-contract015');
function buildNormalizer015(){
 const source=old.normalizeCompatibility014.toString();let adapted=source;const edits=[];
 const rep=(a,b,n=1)=>{if(adapted.split(a).length-1!==n)throw Error('Unique normalization source anchor required: '+a);adapted=adapted.split(a).join(b);edits.push({from:a,to:b,count:n});};
 rep("const candidate=product?.release===false&&product.phase==='candidate'&&product.version==='14.30'&&product.anchor==='T726',release=product?.release===true&&product.phase==='release'&&product.version==='14.31'&&product.anchor==='T727';","const candidate=product?.release===false&&product.phase==='candidate'&&product.version==='14.31'&&product.anchor==='T727',release=false;");
 rep("const version=label==='candidate'?product.version:'14.30',anchor=label==='candidate'?product.anchor:'T726';","const version=label==='candidate'?product.version:'14.31',anchor=label==='candidate'?product.anchor:'T727';");
 rep("to:{version:'14.30',anchor:'T726'}","to:{version:'14.31',anchor:'T727'}");
 let reverse=adapted;for(const q of [...edits].reverse()){if(reverse.split(q.to).length-1!==q.count)throw Error('Unique reversal required');reverse=reverse.split(q.to).join(q.from);}if(reverse!==source)throw Error('Undeclared normalizer edit');
 const bindings={eq,structuredClone,WORLD_SEEDS014:old.WORLD_SEEDS014,CHECKPOINT_COUNTS014:old.CHECKPOINT_COUNTS014,METADATA_PATHS014:old.METADATA_PATHS014,SAVE_PATHS014:old.SAVE_PATHS014,validateNativeSave014:old.validateNativeSave014,validateTimingShape014:old.validateTimingShape014};
 const fn=new vm.Script('(function('+Object.keys(bindings).join(',')+'){return ('+adapted+');})').runInThisContext()(...Object.values(bindings));
 return{fn,proof:{originalSourceSHA256:fixed.hash(source),adaptedSourceSHA256:fixed.hash(adapted),edits,reverseExact:true,rawSaveNormalizationPermitted:false,oldRuntimeFunctionsExact:true}};
}
function normalizeCompatibility015(runs,product){const q=buildNormalizer015(),result=q.fn(runs,product);if(result.metadataNormalization.normalizedFields!==0||result.metadataNormalization.applied)throw Error('T727-to-T727 comparison cannot normalize any field');return{...result,streetscapeSourceAdapter:q.proof};}
module.exports={...old,normalizeCompatibility015,buildNormalizer015};
