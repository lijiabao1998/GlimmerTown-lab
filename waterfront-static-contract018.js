'use strict';
// Source/data only: no browser, painter or game execution.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),os=require('node:os'),{execFileSync}=require('node:child_process');
const ROOT=__dirname,BASE='1400301238f7a46ab6d3c489422a48f9f90cac9d',CARD_COMMIT='75568284a3266a6d6cb5a8346dcc5b7fd2e54b1a';
const BASE_HTML_SHA256='f43910b13ff2d0d341e36ebed9b1332439286bb97e39fab3e5d2fedf103e7a99',BASE_FP_SHA256='426bc4f942e9632b87e32a358263ff286dd44109212a26b9df39e7208c7d0927';
const REPAIR_CARD_COMMIT='d33d5a5a19b44c19e55f6f24d59196581c00fdbc',PRE_REPAIR_HEAD='52924698c88ec2f9cafe37828b8d966a6f962488';
const CARD='docs/branch/GPT-018-british-waterfront-heritage.md',THEMES=Object.freeze(['lifeboatHall','canalTollhouse']);
const expectedAdditions=THEMES.flatMap(t=>[0,1,2,3].map(v=>'waterfront018.'+t+'_'+v)).sort();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const at=(ref,p)=>execFileSync('git',['show',ref+':'+p],{cwd:ROOT,maxBuffer:32*1024*1024});
const baseFile=p=>at(BASE,p);
function verifyStatic018(){
 const baseline=baseFile('index.html'),current=fs.readFileSync(path.join(ROOT,'index.html')),html=current.toString();
 if(hash(baseline)!==BASE_HTML_SHA256||hash(baseFile('fp.json'))!==BASE_FP_SHA256)throw Error('Exact immutable released T730 baseline required');
 const card=fs.readFileSync(path.join(ROOT,CARD),'utf8'),original=at(CARD_COMMIT,CARD).toString();
 if(!card.startsWith(original)||!original.includes('Acceptance card written before implementation'))throw Error('Published pre-code acceptance card must remain exact');
 const repairCard=at(REPAIR_CARD_COMMIT,CARD).toString();if(!card.startsWith(repairCard)||!repairCard.includes('Acceptance written before repair implementation'))throw Error('Published owner-directed repair acceptance must precede implementation');
 const oldFiles=execFileSync('git',['ls-tree','-r','-z','--name-only',BASE],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),protectedManifest={};
 for(const file of oldFiles){if(['index.html','smoke.js'].includes(file))continue;const old=baseFile(file),now=fs.readFileSync(path.join(ROOT,file));if(!old.equals(now))throw Error('Protected complete T730 source changed: '+file);protectedManifest[file]=hash(now);}
 const oldSmoke=baseFile('smoke.js').toString(),smoke=fs.readFileSync(path.join(ROOT,'smoke.js'),'utf8'),rows=smoke.split('\n');
 if(rows.filter(l=>l.includes('waterfrontSelftest018')).length!==1||rows.filter(l=>!l.includes('waterfrontSelftest018')).join('\n')!==oldSmoke)throw Error('Keep every original smoke row; add exactly one waterfront selftest');
 for(const re of[/const GAME_VER='[^']*'/g,/const GAME_ANCHOR='[^']*'/g,/id="startVersion456">[^<]*/g])if(JSON.stringify(html.match(re))!==JSON.stringify(baseline.toString().match(re)))throw Error('Candidate keeps exact T730 release labels');
 const cold=JSON.parse(baseFile('coldload-patch011.json'));if(html.split(cold.to).length!==2)throw Error('Original native load invalidation must stay exact');
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];scripts.forEach((m,i)=>new vm.Script(m[1],{filename:'waterfront-inline-'+i+'.js'}));
 const art=fs.readFileSync(path.join(ROOT,'british-waterfront-heritage-art018.js'),'utf8'),game=fs.readFileSync(path.join(ROOT,'gameplay018.js'),'utf8');new vm.Script(art);new vm.Script(game);
 if(html.split(art).length!==2||/Math\s*\.\s*random\s*\(|\b(?:fillText|strokeText)\s*\(|\blocalStorage\b|\bsessionStorage\b|\bfetch\s*\(/.test(art))throw Error('Original art embeds once without RNG, fonts, storage or network');
 if(!game.includes("b.k===287")||!game.includes('waterfrontLoad018(raw)')||!game.includes('window.__noWaterfrontArt018')||!game.includes('window.__noWaterfront018'))throw Error('Exact bounded native appearance integration required');
 const edge=fs.readFileSync(path.join(ROOT,'mapedge-render018.js'),'utf8'),oldArt=at(PRE_REPAIR_HEAD,'british-waterfront-heritage-art018.js').toString(),oldGame=at(PRE_REPAIR_HEAD,'gameplay018.js').toString();
 const edgeSmoke="  add('original map-edge sprite selects only outward faces',window.MapEdgeRepair018?.selftest018().ok===true);\n";
 if(art!==oldArt||game.split(edgeSmoke).length!==2||game.replace(edgeSmoke,'')!==oldGame)throw Error('Approved heritage geometry and simulation stay exact; only one pure edge selftest added');
 if(html.split(edge).length!==2||/Math\s*\.\s*random\s*\(|\blocalStorage\b|\bsessionStorage\b|\bfetch\s*\(/.test(edge))throw Error('Map-edge helper embeds once without RNG, storage or network');
 if(html.split("+(window.__noMapEdgeFix018?'_me018old':'')").length!==2||html.split('window.MapEdgeRepair018.drawMapEdge018(gc,SPR.cliff,vp388[0],vp388[1],N,sx,sy,z,!!window.__noMapEdgeFix018)').length!==2)throw Error('Exact native outward-face call and cache-key valve required');
 new vm.Script(edge);

 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'waterfront018-source-'));
 try{const src=path.join(tmp,'baseline.html'),out=path.join(tmp,'candidate.html');fs.writeFileSync(src,baseline);execFileSync('python3',[path.join(ROOT,'integrate-waterfront018.py'),'--input',src,'--output',out],{cwd:ROOT,maxBuffer:8*1024*1024});if(!fs.readFileSync(out).equals(current)||!fs.readFileSync(src).equals(baseline))throw Error('Product differs from declared reversible additive assembly');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
 return{ok:true,base:BASE,version:'14.34',anchor:'T730',release:false,phase:'candidate',publicationApproved:false,htmlExact:true,protectedExact:true,fpExact:true,logExact:true,coldLoadFixExact:true,sourceSHA256:hash(current),baselineSHA256:BASE_HTML_SHA256,protectedManifest,inlineScripts:scripts.length,additionCount:8,expectedAdditions,cardCommit:CARD_COMMIT,originalCardSHA256:hash(original),artSHA256:hash(art),gameplaySHA256:hash(game),repairCardCommit:REPAIR_CARD_COMMIT,approvedHeritageHead:PRE_REPAIR_HEAD,approvedHeritageSourceExact:true,mapEdgeRepairReviewPending:true,mapEdgeHelperSHA256:hash(edge),integrationSHA256:hash(fs.readFileSync(path.join(ROOT,'integrate-waterfront018.py')))};
}
module.exports={ROOT,BASE,CARD_COMMIT,REPAIR_CARD_COMMIT,PRE_REPAIR_HEAD,CARD,BASE_HTML_SHA256,BASE_FP_SHA256,THEMES,expectedAdditions,hash,baseFile,verifyStatic018};
if(require.main===module){const q=verifyStatic018();q.protectedFiles=Object.keys(q.protectedManifest).length;delete q.protectedManifest;console.log(JSON.stringify(q,null,2));}
