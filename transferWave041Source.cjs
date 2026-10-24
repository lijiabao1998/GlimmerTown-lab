'use strict';
// Evidence transport only: no game execution, source edits, network or credentials.
if(process.env.GITHUB_ACTIONS!=='true')throw Error('wave041 source transfer runs on GitHub Actions only');
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const source=fs.readFileSync('fp-rebake/index.html'),p=JSON.parse(fs.readFileSync('fp-rebake/source-index-provenance.json'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),part=Number(process.env.WAVE041_SOURCE_PART),chunk=1500000;
assert(Number.isInteger(part)&&part>=0&&part<8,'wave041 exactly eight bounded source parts');
assert.equal(p.head,process.env.GITHUB_SHA,'wave041 source producer head');
assert.equal(p.tree,cp.execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim(),'wave041 source producer tree');
assert.equal(p.gitBlob,cp.execFileSync('git',['rev-parse','HEAD:index.html'],{encoding:'utf8'}).trim(),'wave041 source producer Git object');
assert.equal(source.length,p.bytes);assert.equal(hash(source),p.sha256);
const gitBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(gitBlob,p.gitBlob,'wave041 actual full source bytes bind to committed Git blob');
assert.equal(Math.ceil(source.length/chunk),8,'wave041 bounded full-source transport count');
const offset=part*chunk,b=source.subarray(offset,Math.min(offset+chunk,source.length)),name='index.html.part'+part;
assert(b.length>0,'wave041 nonempty source part');
console.log('WAVE041_SOURCE_BEGIN '+JSON.stringify({name,head:p.head,tree:p.tree,gitBlob,part,parts:8,offset,bytes:b.length,sha256:hash(b),totalBytes:source.length,fullSHA256:p.sha256}));
const text=b.toString('base64');for(let i=0;i<text.length;i+=4096)console.log('WAVE041_SOURCE_DATA '+text.slice(i,i+4096));
console.log('WAVE041_SOURCE_END '+name);
