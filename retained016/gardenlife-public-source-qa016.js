#!/usr/bin/env node
'use strict';
// Source-only observer tests. No game, renderer, browser, network or test fixture.
const assert=require('node:assert/strict');
const {OFFICIAL013,MANIFEST013,MANIFEST_TEXT013,isManifestDuplicate013,reconcileManifestDuplicates013,reconcilePublicLogs013}=require('./retained015/retained014/complexes-public-log014');
const entry={level:'error',url:OFFICIAL013+'?publicqa013=verified-sha&check=reload',text:MANIFEST_TEXT013};
const proof=[{url:MANIFEST013,status:404,type:'Manifest'}];
let checks=0;function check(name,fn){fn();checks++;console.log('PASS '+name);}
check('exact document-attributed manifest duplicate including query is recognized',()=>assert.equal(isManifestDuplicate013(entry),true));
check('exact independent network 404 proves duplicate and retains explicit disclosure',()=>{const r=reconcileManifestDuplicates013([entry],proof);assert.equal(r.known.length,1);assert.deepEqual(r.known[0].networkProof,{url:MANIFEST013,status:404});assert.equal(r.known[0].text,MANIFEST_TEXT013);assert.equal(r.errors.length,0);});
check('every repeated known duplicate remains individually disclosed',()=>{const r=reconcileManifestDuplicates013([entry,entry,entry,entry],proof);assert.equal(r.known.length,4);assert.equal(r.errors.length,0);});
for(const[name,bad]of[
 ['unknown manifest host',{...entry,text:MANIFEST_TEXT013.replace('lijiabao1998.github.io','example.com')}],
 ['unknown manifest path',{...entry,text:MANIFEST_TEXT013.replace('manifest.json','other.json')}],
 ['unknown manifest status',{...entry,text:MANIFEST_TEXT013.replace('404','403')}],
 ['unknown manifest text',{...entry,text:MANIFEST_TEXT013+' unexpected failure'}],
 ['changed text case',{...entry,text:MANIFEST_TEXT013.replace('Manifest','manifest')}],
 ['unknown source host',{...entry,url:'https://example.com/GlimmerTown-lab/'}],
 ['unknown source path',{...entry,url:'https://lijiabao1998.github.io/other/'}],
 ['source manifest resource rather than actual game document',{...entry,url:MANIFEST013}],
 ['missing source',{...entry,url:undefined}],
 ['malformed source',{...entry,url:'not a URL'}],
 ['source credentials',{...entry,url:'https://user:pass@lijiabao1998.github.io/GlimmerTown-lab/'}],
 ['source wrong protocol',{...entry,url:OFFICIAL013.replace('https:','http:')}],
 ['source whitespace',{...entry,url:entry.url+'\n'}],
 ['non-error log level',{...entry,level:'warning'}]
])check('reject '+name,()=>{assert.equal(isManifestDuplicate013(bad),false);const r=reconcileManifestDuplicates013([bad],proof);assert.equal(r.known.length,0);assert.equal(r.errors.length,1);});
for(const[name,rows]of[
 ['missing network proof',[]],
 ['unrelated network 404',[{url:'https://example.com/manifest.json',status:404}]],
 ['different manifest path',[{url:OFFICIAL013+'other.json',status:404}]],
 ['wrong network status',[{url:MANIFEST013,status:500}]],
 ['string status without actual numeric 404',[{url:MANIFEST013,status:'404'}]],
 ['query-modified network resource',[{url:MANIFEST013+'?different=1',status:404}]]
])check('reject '+name,()=>{const r=reconcileManifestDuplicates013([entry],rows);assert.equal(r.known.length,0);assert.equal(r.errors.length,1);});
check('out-of-order log followed by matching network proof resolves only at final reconciliation',()=>{assert.equal(reconcileManifestDuplicates013([entry],[]).errors.length,1);assert.equal(reconcileManifestDuplicates013([entry],proof).known.length,1);});
check('classifier never mutates recorded browser or network evidence',()=>{const e=JSON.stringify(entry),p=JSON.stringify(proof);reconcileManifestDuplicates013([entry],proof);assert.equal(JSON.stringify(entry),e);assert.equal(JSON.stringify(proof),p);});


const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const c=require('./gardenlife-public-contract016'),s=require('./gardenlife-public-state016'),extra=require('./gardenlife-public-extra016'),new015=require('./gardenlife-public-streetscape016');
const root=__dirname,releaseRoot=path.resolve(process.env.EXPECTED_RELEASE_ROOT||process.env.GL016_SOURCE_ROOT||path.join(root,'../glimmer-garden016'));
const runner=fs.readFileSync(path.join(root,'gardenlife-public-qa016.js'),'utf8'),addedRunner=fs.readFileSync(path.join(root,'gardenlife-public-prior-gameplay016.js'),'utf8'),workflow=fs.readFileSync(path.join(root,'.github/workflows/gardenlife-public016.yml'),'utf8');
function goodState(){
 const q={version:'14.33',slot:'3',difficulty:1,developer:{sandbox:false,god:false},menuVisible:false,coldFixDisabled:false,stats:{day:10,money:100000,pop:1000,poweredBld:70},physical:{poweredRoads:100,sources:2},districtCache:{districts:1},cells:[],paths:[],water:Array.from({length:70},(_,n)=>({x:n,y:50,t:0})),shoreline:Array.from({length:13},(_,n)=>({x:n,y:49,land:1,water:0})),retained:[],oldMuseums:[],stations:[],otherSlots:{}};
 const add=(k,x,y,sz)=>{const root=y*72+x,r={root,k,sz,v:0,built:true,age:9,operational:true,power:true,powerState:1,powerAllocation:{root,pool:0},water:true,waterState:{code:4},waterDelivered:3.4,waterDemand:3.4,employed:16,positions:16,road:[root-72],refCells:[],activity:{work:16,publicJobs:16,enterpriseJobs:0,shopping:0,education:0,services:0,leisure:200,parking:0}};q.cells.push({i:root,k,ref:null,sz,lv:1,v:0,age:9});for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++)if(dx||dy){const i=(y+dy)*72+x+dx,bld={k,ref:[x,y]};q.cells.push({i,k,ref:[x,y],sz:1,lv:null,v:null,age:null});r.refCells.push({i,bld});}return r;};
 const r=add(281,58,64,3);Object.assign(r,{id:'edwardianTheatre013',staff:{k:281,potentialJobs:16,capacityFactor:1,staffFill:1},factors:{availability:1},capacityFactor:1,coverageStamp:{field:'theater',radius:7},upkeep:10});q.theatre={day:10,roots:[r]};
 q.market={roots:[add(278,58,50,3),add(279,62,50,1),add(280,64,50,1)]};q.market.roots.forEach(r=>r.activity.shopping=30);
 q.street={roots:[add(274,58,20,3),add(275,63,20,2),add(276,67,20,1)]};q.museum={tourists:0,roots:[add(277,58,40,4)]};
 for(let n=0;n<47;n++){const x=(n%10)*4,y=Math.floor(n/10)*4,k=219+n;add(k,x,y,2);q.retained.push({k,x,y,sz:2,bld:{k,sz:2},cells:[{k,sz:2},{k,ref:[x,y]},{k,ref:[x,y]},{k,ref:[x,y]}]});}
 for(let n=0;n<2;n++){q.oldMuseums.push({k:35+n,sz:2,x:64+n*3,y:40,bld:{k:35+n,sz:2}});add(35+n,64+n*3,40,2);q.stations.push({root:26*72+10+n*10,k:139,v:3,age:9,ownedRail:Array(10).fill(1)});}
 q.themes=['ticket','plaza','rail','bench','planter','lamp'].map(theme=>({theme,at:{theme,am502:1,baseWalkCost:.72,amx502:{british013:theme,turn013:0}}}));q.stats.buildings=q.cells.length;return q;
}
const positive=goodState();
check('synthetic fully supplied native theatre and every retained footprint pass',()=>assert.equal(s.functionalPublicState013(positive),true));
for(const [name,change]of[
 ['wrong release',q=>q.version='14.30'],['wrong slot',q=>q.slot='1'],['sandbox',q=>q.developer.sandbox=true],['god mode',q=>q.developer.god=true],['menu still visible',q=>q.menuVisible=true],['cold fix disabled',q=>q.coldFixDisabled=true],['no residents',q=>q.stats.pop=0],['no powered roads',q=>q.physical.poweredRoads=0],['no source',q=>q.physical.sources=0],['no dispatch district',q=>q.districtCache.districts=0],['duplicate theatre',q=>q.theatre.roots.push(q.theatre.roots[0])],['wrong native identity',q=>q.theatre.roots[0].k=36],['unfinished theatre',q=>q.theatre.roots[0].age=8],['not operational',q=>q.theatre.roots[0].operational=false],['power missing',q=>q.theatre.roots[0].powerState=0],['water missing',q=>q.theatre.roots[0].waterDelivered=0],['road missing',q=>q.theatre.roots[0].road=[]],['no public workforce',q=>q.theatre.roots[0].employed=0],['wrong workforce authority',q=>q.theatre.roots[0].staff.k=36],['invented leisure',q=>q.theatre.roots[0].activity.leisure++],['invented shopping',q=>q.theatre.roots[0].activity.shopping=1],['missing native coverage',q=>q.theatre.roots[0].coverageStamp=null],['wrong upkeep',q=>q.theatre.roots[0].upkeep=0],['missing new reference cell',q=>q.cells.splice(q.cells.findIndex(c=>c.ref?.[0]===58&&c.ref[1]===64),1)],['wrong new reference owner',q=>q.cells.find(c=>c.ref?.[0]===58&&c.ref[1]===64).ref[0]++],['wrong old native footprint',q=>q.retained[0].cells[1].ref[0]++],['missing retained building',q=>q.retained.pop()],['old museum identity changed',q=>q.oldMuseums[0].bld.k=999],['station track lost',q=>q.stations[0].ownedRail[0]=0],['missing earlier district',q=>q.market.roots.pop()],['missing native path',q=>q.themes.pop()],['duplicate native path',q=>q.themes[0]=q.themes[1]],['wrong native theme metadata',q=>q.themes[0].at.amx502.british013='rail'],['wrong native path ownership',q=>q.themes[0].at.am502=0],['changed native walk cost',q=>q.themes[0].at.baseWalkCost=1],['water land filled',q=>q.water[0].t=1],['shore frontage lost',q=>q.shoreline[0].water=1]
])check('functional guard rejects '+name,()=>{const q=structuredClone(positive);change(q);assert.equal(s.functionalPublicState013(q),false);});
const completed=()=>({checks:Array.from({length:26},(_,n)=>({name:'functional proof '+n,scope:'functional',ok:true})),functionalChecksPassed:true,ordinaryDays:Array(9).fill({}),coldReloads:[1,2].map(cycle=>({cycle,days:Array.from({length:3},()=>({ok:true,state:structuredClone(positive)}))})),rawBrowserErrors:[],rawRuntimeErrors:[],warnings:[],consoleErrors:[],knownPWALogs:[],networkFailures:[]});
check('complete two-cycle functional proof can pass independently of diagnostics',()=>{const q=completed();q.rawBrowserErrors=[{text:'URL-less script 404'}];q.consoleErrors=['URL-less script 404'];q.warnings=['sw warning'];const r=s.summarizePublicResult013(q);assert.equal(r.functionalSummary.passed,true);assert.equal(r.browserDiagnosticSummary.strictErrorGatePassed,false);assert.equal(r.browserDiagnosticSummary.rawConsoleClean,false);});
for(const [name,change]of[['missing functional check',q=>q.checks.pop()],['missing final flag',q=>q.functionalChecksPassed=false],['only one reload',q=>q.coldReloads.pop()],['missing third ordinary day',q=>q.coldReloads[1].days.pop()],['bad first ordinary day',q=>q.coldReloads[0].days[0].state.theatre.roots[0].power=false],['failed functional check',q=>q.checks[0].ok=false]])check('cannot claim completion with '+name,()=>{const q=completed();change(q);assert.equal(s.summarizePublicResult013(q).functionalSummary.passed,false);});
for(const [name,change]of[['known raw browser error',q=>{q.rawBrowserErrors=[{text:'known'}];q.knownPWALogs=[{text:'known'}];}],['unknown error',q=>q.consoleErrors=['x']],['runtime exception',q=>q.rawRuntimeErrors=[{exception:'x'}]],['warning alone',q=>q.warnings=['x']],['network failure',q=>q.networkFailures=[{status:404}]]])check('strict clean gate rejects '+name,()=>{const q=completed();change(q);assert.equal(s.summarizePublicResult013(q).browserDiagnosticSummary.strictErrorGatePassed,false);});
check('healthy state with failed full native-day or identity proof cannot be labeled passed',()=>{const q=completed();q.coldReloads[0].days[0].ok=false;q.checks.push({name:'cold reload 1: FIRST unaided ordinary day identity mismatch',scope:'functional',ok:false});const r=s.summarizePublicResult013(q);assert.equal(r.functionalSummary.passed,false);assert.equal(r.functionalSummary.coldReloads[0].firstOrdinaryDay,'failed');assert.equal(r.functionalSummary.coldReloads[0].ordinaryDaysPassed,2);});
check('strict clean gate accepts only truly empty diagnostics',()=>assert.equal(s.summarizePublicResult013(completed()).browserDiagnosticSummary.strictErrorGatePassed,true));
check('URL-less 404 remains unknown despite an independent service-worker 404',()=>{const q=reconcilePublicLogs013([{level:'error',text:'A bad HTTP response code (404) was received when fetching the script.'}],[{url:OFFICIAL013+'sw.js',status:404}]);assert.equal(q.known.length,0);assert.equal(q.errors.length,1);});
function goodComplexState(){
 const q=goodState();q.complexDisabled=false;q.complexArtDisabled=false;const roots=[];
 for(const [n,s]of c.sourcePins.complexCatalog.buildings.entries()){
  const x=6+12*Math.floor(n/3)+(n%3?5:0),y=n%3===2?67:64,root=y*72+x,housing=s.role==='housing';
  const r={root,k:s.k,id:s.id,group:s.group,role:s.role,sz:s.sz,built:true,age:9,operational:true,power:true,powerState:1,powerAllocation:{root,pool:0},water:true,waterState:{code:4},waterDelivered:1,waterDemand:1,road:[root-72],upkeep:s.upkeep,positions:s.jobs,employed:s.jobs,staff:housing?null:{k:s.k,potentialJobs:s.jobs,staffFill:1,capacityFactor:1},factors:{serviceFactor:1},capacityFactor:housing?0:1,activity:{work:s.jobs,publicJobs:s.jobs,enterpriseJobs:0,shopping:0,parking:0,leisure:s.leisure,education:s.seats,services:s.services},coverageStamp:s.coverage?{field:s.coverage,radius:7}:null,housing:housing?{capacity:s.capacity,population:s.capacity,occupancy:1,eligible:true}:null,emergencyReady:s.role==='fire',emergency:s.role==='fire'?{sourceRegistered:true,fieldOnline:true}:null,refCells:[]};
  q.cells.push({i:root,k:s.k,ref:null,sz:s.sz,lv:1,v:0,age:9});
  for(let dy=0;dy<s.sz;dy++)for(let dx=0;dx<s.sz;dx++)if(dx||dy){const i=(y+dy)*72+x+dx;q.cells.push({i,k:s.k,ref:[x,y],sz:1,lv:null,v:null,age:null});r.refCells.push({i,bld:{k:s.k,ref:[x,y]}});}
  roots.push(r);
 }
 q.complexThemes=c.sourcePins.complexCatalog.paths.map(s=>({...s,at:{theme:s.theme,group:s.group,am502:1,baseWalkCost:.72,cost:12,amx502:{british014:s.theme,turn014:0}}}));
 q.complex={day:q.stats.day,roots,paths:q.complexThemes.map(p=>p.at),daily:{syntheticRevenue:0,publicJobs:roots.reduce((n,r)=>n+r.positions,0),upkeep:roots.reduce((n,r)=>n+r.upkeep,0)}};q.stats.buildings=q.cells.length;return q;
}
check('synthetic fully supplied 12-root 16-theme city satisfies new and retained gates',()=>assert.equal(extra.functionalComplexState014(goodComplexState()),true));
for(const [name,mutate]of [
 ['missing independent root',q=>q.complex.roots.pop()],['duplicate independent root',q=>q.complex.roots[1]=q.complex.roots[0]],['wrong saved kind',q=>q.complex.roots[0].k=32],['unfinished root',q=>q.complex.roots[0].age=8],['wrong footprint',q=>q.complex.roots[0].sz=3],['no power',q=>q.complex.roots[0].powerState=0],['no actual allocation',q=>q.complex.roots[0].powerAllocation=null],['no delivered water',q=>q.complex.roots[0].waterDelivered=0],['no native road',q=>q.complex.roots[0].road=[]],['no genuine workforce',q=>q.complex.roots[0].employed=0],['wrong staff authority',q=>q.complex.roots[0].staff.k=32],['unfunded education',q=>q.complex.roots[0].activity.education++],['invented leisure',q=>q.complex.roots[3].activity.leisure++],['invented services',q=>q.complex.roots[8].activity.services++],['missing housing',q=>q.complex.roots[2].housing.population=0],['wrong capacity',q=>q.complex.roots[2].housing.capacity++],['fake coverage',q=>q.complex.roots[0].coverageStamp.field='school'],['no emergency source',q=>q.complex.roots[9].emergency.sourceRegistered=false],['emergency field offline',q=>q.complex.roots[10].emergency.fieldOnline=false],['unpaid upkeep',q=>q.complex.roots[0].upkeep=0],['synthetic revenue',q=>q.complex.daily.syntheticRevenue=1],['missing theme',q=>q.complexThemes.pop()],['duplicate theme',q=>q.complexThemes[0]=q.complexThemes[1]],['changed walk metadata',q=>q.complexThemes[0].at.amx502.british014='wrong'],['free paid path',q=>q.complexThemes[0].at.cost=0],['wrong native walk cost',q=>q.complexThemes[0].at.baseWalkCost=1],['feature disabled',q=>q.complexDisabled=true],['art disabled',q=>q.complexArtDisabled=true],['old retained defect',q=>q.theatre.roots[0].power=false]
])check('complex guard rejects '+name,()=>{const q=goodComplexState();mutate(q);assert.equal(extra.functionalComplexState014(q),false);});
const completedComplex=()=>({checks:Array.from({length:26},(_,n)=>({name:'complex proof '+n,scope:'complexes',ok:true})),complexChecksPassed:true,complexOrdinaryDays:Array(9).fill({}),complexColdReloads:[1,2].map(cycle=>({cycle,days:Array.from({length:3},()=>({ok:true,state:goodComplexState()}))}))});
check('new summary requires all26 gates and both full cold cycles',()=>assert.equal(extra.summarizeComplexResult014(completedComplex()).passed,true));
for(const [name,mutate]of [['missing gate',q=>q.checks.pop()],['failed gate',q=>q.checks[0].ok=false],['one cycle',q=>q.complexColdReloads.pop()],['missing normal day',q=>q.complexColdReloads[1].days.pop()],['failed first day',q=>q.complexColdReloads[0].days[0].ok=false],['no confirmed completion',q=>q.complexChecksPassed=false]])check('complex summary rejects '+name,()=>{const q=completedComplex();mutate(q);assert.equal(extra.summarizeComplexResult014(q).passed,false);});

check('all new observer JavaScript and historical passive bodies parse without game execution',()=>{
 for(const file of fs.readdirSync(root).filter(p=>/^gardenlife-public-.*016\.js$/.test(p)))new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
 for(const fn of [s.passivePublicState013,extra.passiveComplexState014,new015.passiveStreetscapeState015])new vm.Script('('+fn.toString()+')');
 new vm.Script(c.fixtureSource013(releaseRoot));new vm.Script(c.complexFixtureSource014(releaseRoot));
});
check('all exact historical sources and reversible predicate adapters pass import-time hashes',()=>assert.equal(Object.keys(c.pins016.retainedObserverFiles).length,27));
const approvedBytes=fs.readFileSync(path.join(root,'gardenlife-public-approved-native016.json')),native=JSON.parse(approvedBytes);
check('approved native source and all complete current fingerprint evidence is exact',()=>{
 assert.equal(c.hash(approvedBytes),c.pins016.approvedFingerprintSHA256);assert.equal(native.checkedSHA,c.APPROVED);assert.equal(native.sourceSHA256,c.pins016.approvedSourceSHA256);assert.equal(c.verifyApprovedRecords013(native.fp,native.blocks),true);
});
const oldLeaf=Object.keys(native.fp.subs).find(k=>!c.expectedAdditions.includes(k)),add=c.expectedAdditions[0],block=Object.keys(native.blocks.entries)[0];
for(const[name,change]of [
 ['old opacity',q=>q.fp.subs[oldLeaf].op++],['old extra field',q=>q.fp.subs[oldLeaf].extra=true],['new day CRC',q=>q.fp.subs[add].d+='bad'],['new night CRC',q=>q.fp.subs[add].n+='bad'],['new dimensions',q=>q.fp.subs[add].w++],['missing old leaf',q=>delete q.fp.subs[oldLeaf]],['missing new leaf',q=>delete q.fp.subs[add]],['extra leaf',q=>q.fp.subs.extra=q.fp.subs[add]],['full family aggregate',q=>q.fp.families.bld.crc+='bad'],['full stats',q=>q.fp.stats.leaves++],['complete block record',q=>q.blocks.entries[block].d+='bad'],['missing block',q=>delete q.blocks.entries[block]],['extra block record field',q=>q.blocks.entries[block].extra=true],['block family',q=>q.blocks.fam+='bad'],['block count',q=>q.blocks.count--],['false native result',q=>q.fp.ok=false],['truthy nonboolean native result',q=>q.fp.ok=1],['unknown full fingerprint field',q=>q.fp.unproved=true]
])check('full approved native pins reject '+name,()=>{const q=structuredClone(native);change(q);assert.throws(()=>c.verifyApprovedRecords013(q.fp,q.blocks));});
check('release HTML reverses exactly three labels to image-approved source',()=>{
 const expected=c.expectedReleaseHTML(releaseRoot),approved=c.gitFile(releaseRoot,c.APPROVED,'index.html');assert.deepEqual(c.normalizeRelease013(expected),approved);assert.throws(()=>c.normalizeRelease013(approved));assert.throws(()=>c.normalizeRelease013(Buffer.from(expected+"const GAME_VER='14.33'")));assert.notEqual(c.hash(Buffer.from(expected+'\n')),c.hash(expected));
});
const fakePins={releaseCandidateSHA:'c'.repeat(40),releaseCandidateTree:'b'.repeat(40),releaseSHA:'a'.repeat(40),releaseTree:'b'.repeat(40),releaseSubject:'release(T729): British garden-life details v14.33 (#21)',release:'T729',version:'14.33',officialURL:c.OFFICIAL,approvedSHA:c.APPROVED,approvedSourceSHA256:c.pins016.approvedSourceSHA256,sourceSHA256:c.hash(c.expectedReleaseHTML(releaseRoot)),fingerprintSHA256:c.pins016.expectedReleaseBaselineSHA256};
check('final receipt structure has exact source candidate identity and full commit/tree fields',()=>assert.equal(c.verifyPins013(fakePins),fakePins));
for(const [name,mutate]of [['absent SHA',p=>p.releaseSHA=null],['short SHA',p=>p.releaseSHA='abcd'],['absent tree',p=>p.releaseTree=null],['wrong version',p=>p.version='14.31'],['wrong anchor',p=>p.release='T727'],['wrong official URL',p=>p.officialURL='http://localhost:8199/'],['wrong candidate SHA',p=>p.approvedSHA='a'.repeat(40)],['wrong candidate product',p=>p.approvedSourceSHA256='b'.repeat(64)],['missing subject',p=>p.releaseSubject=null],['wrong subject',p=>p.releaseSubject='T727: old version'],['wrong release source hash',p=>p.sourceSHA256='a'.repeat(64)],['wrong promoted baseline hash',p=>p.fingerprintSHA256='a'.repeat(64)]])check('receipt rejects '+name,()=>{const q=structuredClone(fakePins);mutate(q);assert.throws(()=>c.verifyPins013(q));});
check('new exact catalog has no buildings jobs revenue or services',()=>{assert.equal(new015.verifyStreetscapeCatalog015(c.pins015.streetscapeCatalog),true);assert.equal(c.pins015.streetscapeCatalog.paths.length,8);});
for(const[name,mutate]of[['missing theme',q=>q.paths.pop()],['duplicate theme',q=>q.paths[1]=q.paths[0]],['free theme',q=>q.paths[0].cost=0],['invented income',q=>q.authority.extraIncome=1],['lower rank',q=>q.paths[0].rank=1],['renamed theme',q=>q.paths[0].theme='wrong']])check('strict new catalog rejects '+name,()=>{const q=structuredClone(c.pins015.streetscapeCatalog);mutate(q);assert.equal(new015.verifyStreetscapeCatalog015(q),false);});
function goodStreetscapeState(){
 const q=goodComplexState();q.streetscapeDisabled=false;q.streetscapeArtDisabled=false;
 q.streetscapeThemes=c.pins015.streetscapeCatalog.paths.map((s,n)=>{const x=6+n,y=68,turn=n%4,at={root:y*72+x,x,y,theme:s.theme,am502:1,amx502:{british015:s.theme,turn015:turn},baseWalkCost:.72,cost:12,lighting:{ready:true,service:1,source:{x,y:y+1}}};return{...s,x,y,turn,at,roadSource:{road:1}};});
 q.streetscape={day:q.stats.day,art:{total:32,builds:1},paths:q.streetscapeThemes.map(p=>p.at)};return q;
}
check('strict supplied old-plus-new state accepts all eight themes and actual lamp source',()=>assert.equal(new015.functionalStreetscapeState015(goodStreetscapeState()),true));
for(const[name,mutate]of[
 ['wrong release',q=>q.version='14.31'],['old city defect',q=>q.theatre.roots[0].power=false],['complex power lost',q=>q.complex.roots[0].power=false],['missing theme',q=>q.streetscapeThemes.pop()],['extra theme',q=>q.streetscape.paths.push(q.streetscape.paths[0])],['duplicate theme',q=>q.streetscapeThemes[1]=q.streetscapeThemes[0]],['wrong native path type',q=>q.streetscapeThemes[0].at.am502=2],['wrong metadata',q=>q.streetscapeThemes[0].at.amx502.british015='wrong'],['wrong direction',q=>q.streetscapeThemes[0].at.amx502.turn015=3],['wrong root',q=>q.streetscapeThemes[0].at.root++],['free path',q=>q.streetscapeThemes[0].at.cost=0],['wrong walk cost',q=>q.streetscapeThemes[0].at.baseWalkCost=1],['stale evidence day',q=>q.streetscape.day--],['missing canonical views',q=>q.streetscape.art.total=31],['repeated art build',q=>q.streetscape.art.builds=2],['disabled feature',q=>q.streetscapeDisabled=true],['disabled art',q=>q.streetscapeArtDisabled=true],['lamp dispatch unready',q=>q.streetscapeThemes[0].at.lighting.ready=false],['lamp service missing',q=>q.streetscapeThemes[0].at.lighting.service=0],['lamp source not adjacent',q=>q.streetscapeThemes[0].at.lighting.source.x+=2],['lamp source not road',q=>q.streetscapeThemes[0].roadSource.road=0]
])check('old-plus-new functional guard rejects '+name,()=>{const q=goodStreetscapeState();mutate(q);assert.equal(new015.functionalStreetscapeState015(q),false);});
const completedStreetscape=()=>({checks:Array.from({length:31},(_,n)=>({name:'streetscape proof '+n,scope:'streetscape',ok:true})),streetscapeChecksPassed:true,streetscapeOrdinaryDays:Array(9).fill({}),streetscapeColdReloads:[1,2].map(cycle=>({cycle,days:Array.from({length:3},()=>({ok:true,state:goodStreetscapeState()}))}))});
check('new summary requires all31 gates plus two complete cold cycles',()=>assert.equal(new015.summarizeStreetscapeResult015(completedStreetscape()).passed,true));
for(const[name,mutate]of[['missing gate',q=>q.checks.pop()],['failed gate',q=>q.checks[0].ok=false],['one cycle',q=>q.streetscapeColdReloads.pop()],['missing ordinary day',q=>q.streetscapeColdReloads[1].days.pop()],['bad first day',q=>q.streetscapeColdReloads[0].days[0].state.streetscapeThemes[0].at.lighting.ready=false],['missing confirmation',q=>q.streetscapeChecksPassed=false]])check('new summary rejects '+name,()=>{const q=completedStreetscape();mutate(q);assert.equal(new015.summarizeStreetscapeResult015(q).passed,false);});
check('all three cold suites remain passive and require exactly two reloads with first-day blocking',()=>{
 for(const[text,start,end]of[[runner,'// BEGIN MEASURED COLD PHASE','// END MEASURED COLD PHASE'],[runner,'// BEGIN MEASURED COMPLEX COLD PHASE','// END MEASURED COMPLEX COLD PHASE'],[addedRunner,'// BEGIN MEASURED STREETSCAPE COLD PHASE','// END MEASURED STREETSCAPE COLD PHASE']]){
  const measured=c.range(text,start,end);for(const t of ['cycle<=2','day<=3',"cdp.send('Page.reload',{ignoreCache:true})","document.getElementById('bContinue').click()",'GV.step(1)','menu.raw===raw','menu.fixtureAbsent','equal(next.state.paths,row.before.paths)','equal(next.state.water,row.before.water)','equal(next.state.otherSlots,row.before.otherSlots)'])assert.ok(measured.includes(t),t);
  for(const t of ['GV.load(','.step014(','.step013(','.setupComplexes014(','.setupStreetscape015(','.nativeScene014(','GV.forceDraw(','ensurePower','ensureWater','GV.rebuild','GV.recompute','GV.place(','GV.devAge','GV.devMoney','GV.loadJson'])assert.ok(!measured.includes(t),t);
 }
});
check('new passive reader contains only allowed native reads',()=>{
 const text=new015.passiveStreetscapeState015.toString(),calls=[...text.matchAll(/GV\.([A-Za-z0-9_]+)\s*\(/g)].map(q=>q[1]);assert.deepEqual(calls,['streetscapeAt015','tile','streetscapeEvidence015']);assert.ok(!/localStorage\.(?:setItem|clear|removeItem)|GV\.[\w.]+\s*=/.test(text));
});
check('no local game server or console suppression is introduced',()=>{
 for(const text of[runner,addedRunner])for(const token of ['startServer(','withGame(','--ignore-certificate-errors','--disable-web-security','Network.setBlockedURLs','Network.setRequestInterception','Fetch.enable'])assert.ok(!text.includes(token),token);
 for(const token of ['sourceObserver.observe(message)','enableConsoleSourceDomains015(cdp,sourceObserver)','console-source-attribution.json','report.rawConsoleClean && report.networkFailures.length === 0','report.warnings.length===0'])assert.ok(runner.includes(token),token);
});
check('all nine true official Chrome documents and exact response bytes are mandatory',()=>{
 for(const token of ['Network.getResponseBody','bytes.equals(localBytes)','proof.sha256 === sourceSHA256','!row.fromServiceWorker','report.documents.length===9','expectedDocuments:9',"await publicFetch('before-browser')","await publicFetch('after-browser')","process.env.GITHUB_ACTIONS !== 'true'",'observerHead!==process.env.GITHUB_SHA','refs/heads/gpt/gardenlife-public016'])assert.ok(runner.includes(token),token);
 assert.ok(runner.indexOf('verifyRelease013(ROOT,')<runner.indexOf("require(path.join(ROOT,'harness.js'))"));
});
check('workflow uses only read-only permissions, exact separate source checkout and no dispatch input overrides',()=>{
 for(const token of ["branches: ['gpt/gardenlife-public016']",'contents: read','actions: read','path: observer','path: deployed','persist-credentials: false','EXPECTED_RELEASE_HTML_SHA256','verifyRelease013','git -C observer diff --exit-code','git -C deployed diff --exit-code','set -euo pipefail','CHROME_PATH: /usr/bin/google-chrome'])assert.ok(workflow.includes(token),token);
 assert.ok(!/inputs:|pages: write|contents: write|continue-on-error|pull_request:/.test(workflow));assert.equal((workflow.match(/actions\/upload-artifact@v4/g)||[]).length,8);
 const pack=fs.readFileSync(path.join(root,'gardenlife-public-package016.py'),'utf8');for(const token of['28*1024*1024','assert size<=limit','completeFileCount','payloadSHA256','gzip.compress','assert n<8'])assert.ok(pack.includes(token),token);
});
require('./gardenlife-public-additional-source016')({assert,check,fs,path,vm,c,s,extra,new015,root,releaseRoot,runner,addedRunner,workflow,goodStreetscapeState,native});
console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,checks}));
