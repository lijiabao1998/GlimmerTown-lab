'use strict';
// Source composition only. Production uses the full installer, never the
// explicitly separate CI nine-candidate fixture.
const fs=require('node:fs'),assert=require('node:assert/strict'),{compose,parse}=require('./wave038-source.cjs');
const file='index.html',text=fs.readFileSync(file,'utf8');
const out=compose(text,{art:fs.readFileSync('british-wave10-art038.js','utf8'),runtime:fs.readFileSync('wave038-runtime.js','utf8'),css:fs.readFileSync('wave038.css','utf8')});
if(process.argv.includes('--check'))assert.equal(out,text,'wave038 full embedded sources must be exact');else fs.writeFileSync(file,out,'utf8');
console.log('wave038 full ten-model source/CSS/runtime exact; '+parse(out)+' inline blocks parse');
