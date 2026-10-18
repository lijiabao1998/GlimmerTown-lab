'use strict';
// Immutable test input only. Reading/validating this file does not execute art.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const FILE=path.join(__dirname,'fixtures','bld-capacity032','british-wave05-art031.js'),SHA='8b0e815ee15ac71c8363f5cd22350861219e5d4e34266ec498b7a01b599a8786';
function validate(bytes){const actual=crypto.createHash('sha256').update(bytes).digest('hex');assert.equal(actual,SHA,'capacity032 immutable native fixture SHA256');return bytes.toString('utf8');}
function readWaveFixture032(){return validate(fs.readFileSync(FILE));}
function selftest(){
  const source=fs.readFileSync(FILE),text=validate(source),damaged=Buffer.from(source);damaged[Math.floor(damaged.length/2)]^=1;
  let first;try{validate(damaged);}catch(e){first=e.message.split('\n')[0];}
  assert(first?.startsWith('capacity032 immutable native fixture SHA256'),'capacity032 changed fixture must first RED at immutable input guard');
  assert.equal(validate(source),text,'capacity032 restored immutable fixture GREEN');
  const report={ok:true,sha256:SHA,bytes:source.length,firstRed:first,restored:true};console.log('CAPACITY032_FIXTURE '+JSON.stringify(report));return report;
}
module.exports={readWaveFixture032,selftest};
