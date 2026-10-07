#!/usr/bin/env node
'use strict';
// Original PNG file-data comparison only; no image decoding, drawing or game.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),c=require('./quayside-public-contract017');
const root=path.resolve(process.argv[2]||path.join(__dirname,'approved-native017'));let accepted=0,rejected=0;
for(const[file,pin]of Object.entries(c.pins017.canonicalAssets)){
 const b=fs.readFileSync(path.join(root,file)),night=file.endsWith('-night.png');assert.equal(c.verifyCanonicalAsset017(pin.key,night,b).sha256,pin.sha256);accepted++;
 const changed=Buffer.from(b);changed[changed.length-1]^=1;assert.throws(()=>c.verifyCanonicalAsset017(pin.key,night,changed));rejected++;
}
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,accepted,rejected}));
