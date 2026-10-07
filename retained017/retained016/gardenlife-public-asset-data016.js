#!/usr/bin/env node
'use strict';
// Optional local/CI SOURCE-DATA check of previously produced PNG bytes.
// This never imports the game or creates/decodes/renders an image.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const c=require('./gardenlife-public-contract016');
if(process.argv.length!==4||process.argv[2]!=='--approved-assets')throw Error('Usage: node gardenlife-public-asset-data016.js --approved-assets /directory/containing/assets');
const root=path.resolve(process.argv[3]);let accepted=0,rejected=0;
for(const[file,pin]of Object.entries(c.pins016.canonicalAssets)){
 const b=fs.readFileSync(path.join(root,file)),night=file.endsWith('-night.png');
 const q=c.verifyCanonicalAsset016(pin.key,night,b);assert.equal(q.sha256,pin.sha256);accepted++;
 const changed=Buffer.from(b);changed[changed.length-1]^=1;
 assert.throws(()=>c.verifyCanonicalAsset016(pin.key,night,changed));rejected++;
}
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,accepted,rejected}));
