#!/usr/bin/env node
'use strict';
// Exact historical T722 street-life runtime; only independently verified
// source/version/full-fingerprint gates are extended for sixteen new assets.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm'),{execFileSync,spawnSync}=require('child_process');
if(process.env.GITHUB_ACTIONS!=='true')throw Error('Isolated GitHub Actions only');
const ROOT=__dirname,{BASE,verifyStatic010}=require('./museum-static-contract010'),{readPreflight010}=require('./museum-fingerprint-qa010');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==process.env.GITHUB_SHA)throw Error('Exact head required');
const proof=verifyStatic010(),native=readPreflight010(),file='streetlife-integration-qa009.js',original=fs.readFileSync(path.join(ROOT,file),'utf8'),pinned=execFileSync('git',['show',BASE+':'+file],{encoding:'utf8',maxBuffer:8*1024*1024});if(original!==pinned)throw Error('Prior runtime source changed');
const edits=[
 ["const {verifyStatic009,BASE,expectedAdditions}=require('./streetlife-static-contract009');","const {verifyStatic010:verifyStatic009,BASE,expectedAdditions}=require('./museum-static-contract010');"],
 ["const {verifyFingerprint009}=require('./streetlife-fingerprint-qa009');","const {verifyFingerprint010:verifyFingerprint009}=require('./museum-fingerprint-qa010');"],
 ["report.static.ok&&report.static.protectedExact&&((report.static.release===false&&report.static.version==='14.25'&&report.static.anchor==='T721')||(report.static.release===true&&report.static.version==='14.26'&&report.static.anchor==='T722'))","report.static.ok&&report.static.protectedExact"],
 ["'strict24 additions, complete old records and aggregates exact'","'strict16 museum additions over all2879 approved complete records and aggregates exact'"]
];
let adapted=original;for(const[from,to]of edits){if(adapted.split(from).length!==2)throw Error('Nonunique gate anchor '+from);adapted=adapted.replace(from,to);}
const start='function setupStreet009(',end='(async()=>';if(original.slice(original.indexOf(start),original.indexOf(end))!==adapted.slice(adapted.indexOf(start),adapted.indexOf(end)))throw Error('Prior runtime functions changed');
const tail=" report.locks=await ev(";if(original.slice(original.indexOf(tail))!==adapted.slice(adapted.indexOf(tail)))throw Error('Prior gameplay assertions changed');
new vm.Script(adapted);const OUT=path.join(ROOT,'museum-evidence/prior-streetlife/guards');fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'runtime-adapter.json'),JSON.stringify({checkedSHA:head,sourceSHA256:proof.sourceSHA256,originalSHA256:hash(original),adaptedSHA256:hash(adapted),edits,proof:native.proof,runtimeFunctionsExact:true,gameplayAssertionsExact:true},null,2));
const tmp=path.join(ROOT,'.museum-streetlife-runtime010.js');try{fs.writeFileSync(tmp,adapted);const r=spawnSync(process.execPath,[tmp],{cwd:ROOT,env:{...process.env,SL009_MODE:'gameplay'},stdio:'inherit',timeout:40*60*1000});if(r.error)throw r.error;process.exitCode=r.status??1;}finally{fs.rmSync(tmp,{force:true});}
