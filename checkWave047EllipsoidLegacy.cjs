'use strict';
// Explicit historical-only replay. Never call it current B geometry acceptance.
const fs=require('fs'),cp=require('child_process'),path=require('path'),assert=require('assert/strict');
const C=require('./wave047-ellipsoid-repair-contract.cjs'),old=C.restore(fs.readFileSync('british-wave19-art047.js','utf8')),spec=require('./wave047-ellipsoid-repair.json');assert.equal(old,cp.execFileSync('git',['show',spec.c7Commit+':british-wave19-art047.js'],{encoding:'utf8',maxBuffer:3e6}));
const file=path.resolve('shots/wave047/historical-c7-source.js');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,old);
for(const f of ['checkOriginalGeometryClearance047.cjs','checkWave047ClearanceShell.cjs','checkWave047ClearanceStage.cjs']){cp.execFileSync(process.execPath,['-e',"require('./wave047-geometry-harness.cjs').source=require('fs').readFileSync("+JSON.stringify(file)+",'utf8');require('./"+f+"');"],{stdio:'inherit'});}
for(const f of ['checkWave047InwardFloorMaterial.cjs','checkWave047InwardRays.cjs'])cp.execFileSync(process.execPath,[f,process.cwd(),file],{stdio:'inherit'});
cp.execFileSync(process.execPath,['-e',"const fs=require('fs'),read=fs.readFileSync;fs.readFileSync=function(f,...args){if(require('path').resolve(String(f))===require('path').resolve('british-wave19-art047.js'))return read("+JSON.stringify(file)+",...args);return read(f,...args);};require('./checkWave047InwardMaterial.cjs');"],{stdio:'inherit'});
console.log(JSON.stringify({ok:true,kind:'immutable C7 historical replay only',currentEllipsoidAcceptance:false,originalGeometryNegatives:111,shellNegatives:20,stageNegatives:32,floorMaterialNegatives:8,rayNegatives:4,inwardMaterialNegatives:5}));
