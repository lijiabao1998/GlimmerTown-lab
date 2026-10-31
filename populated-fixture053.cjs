'use strict';
// Native fixture feasibility probe. Never sets population, bld objects or simulation fields.
const fs=require('node:fs'),path=require('node:path');const {withGame}=require('./harness.js'),{setup053}=require('./benchmark053.cjs');
function connectFixture053(){
 const G=GV,n=G.N(),placed=[],failed={};G.setSpeed(0);G.ai(false);
 function put(tool,x,y){const e=G.canPlaceTool(tool,x,y);if(e){failed[e]=(failed[e]||0)+1;return false;}const ok=G.place(tool,x,y);if(ok)placed.push({tool,x,y});return ok;}
 // Preserve normal native placement rules; connect each existing residential street.
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(G.tile(x,y)?.road){put('lvline',x,y);put('wpipe',x,y);}
 for(let row=5;row<n-5;row+=4){let power=false,water=false;for(let x=4;x<n-4&&(!power||!water);x++){const y=row-1,t=G.tile(x,row);if(!t?.road)continue;if(!power){power=put('geo',x,y);if(power)continue;}if(!water)water=put('water',x,y);}}
 G.ai(true);G.setSpeed(0);return{placed,failed};
}
(async()=>{if(!process.env.GITHUB_ACTIONS)throw Error('Native fixture probe is GitHub Actions only');const out=path.resolve('shots/populated053');fs.mkdirSync(out,{recursive:true});const r=await withGame({port:8199,fresh:true,timeout:300,log:console.log},async({cdp})=>{const fixture=await cdp.evalJs('('+setup053.toString()+')('+JSON.stringify({scene:'small',seed:87,ai:true})+')');const connections=await cdp.evalJs('('+connectFixture053.toString()+')()'),history=[];for(let i=0;i<6;i++){history.push(await cdp.evalJs('(()=>{GV.step(20);GV.setSpeed(0);return GV.stats();})()'));if(history.at(-1).pop>0)break;}fs.writeFileSync(out+'/fixture.json',JSON.stringify({fixture,connections,history},null,2));const png=await cdp.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(out+'/fixture.png',Buffer.from(png.data,'base64'));if(history.at(-1).pop<=0)throw Error('Native fixture failed population gate; not mature-city evidence');return{population:history.at(-1).pop,day:history.at(-1).day};});fs.writeFileSync(out+'/receipt.json',JSON.stringify(r,(k,v)=>k==='cdp'?undefined:v,2));if(!r.ok)throw Error(r.fails.join(';'));console.log('POPULATED FIXTURE',JSON.stringify(r.result));})().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={connectFixture053};
