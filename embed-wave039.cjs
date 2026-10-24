'use strict';
// Source composition only. Production requires all ten original models.
const fs=require('node:fs'),assert=require('node:assert/strict'),{compose,parse}=require('./wave039-source.cjs');
const file='index.html',text=fs.readFileSync(file,'utf8');
const out=compose(text,{art:fs.readFileSync('british-wave11-art039.js','utf8'),runtime:fs.readFileSync('wave039-runtime.js','utf8'),css:fs.readFileSync('wave039.css','utf8')});
if(process.argv.includes('--check'))assert.equal(out,text,'wave039 full embedded sources must be exact');else fs.writeFileSync(file,out,'utf8');
console.log('wave039 full ten-model source/CSS/runtime exact; '+parse(out)+' inline blocks parse');
