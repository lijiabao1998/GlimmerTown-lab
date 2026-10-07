'use strict';
// Inert observer regression only: fake objects, fixed byte arrays and recorded
// callbacks. No browser, game, native Canvas API or pixel painter is executed.
const assert=require('node:assert/strict'),vm=require('node:vm');
const witness=require('./waterfront-quarter-native019').functions019.find(f=>f.name==='quarterLampWitnessNative019');
const expected=Uint8ClampedArray.from([240,180,100,255,0,0,0,0]);
function exercise({bytes=expected,composite='screen',alpha=.8,args=[12,34,2,1],throwDraw=false,noWarm=false}={}){
 const forwarded=[],referenceOps=[];
 class Context{drawImage(...a){forwarded.push({self:this,args:a});}fillRect(...a){referenceOps.push(['fill',...a]);}getImageData(){return{data:expected};}}
 const original=Context.prototype.drawImage,source={width:2,height:1,getContext:()=>({getImageData:()=>({data:expected})})};
 const actual={width:2,height:1,getContext:()=>({getImageData:()=>({data:Uint8ClampedArray.from(bytes)})})};
 const target=new Context();target.globalCompositeOperation=composite;target.globalAlpha=alpha;
 const context={window:{__quarterQA019:{paths:[{theme:'harbourLantern',x:1,y:2}]},__noWarmWin649:noWarm,BritishWaterfrontQuarter019:{layersFor:()=>({raisedNight:source})}},CanvasRenderingContext2D:Context,document:{createElement:()=>({width:0,height:0,getContext:()=>new Context()})},GV:{quarterAt019:()=>({turn:0,lighting:{service:1}}),art574:{SPR:()=>({waterfrontQuarter019:{harbourLantern_0:{}}})},rot:()=>0,daylightDbg:()=>({b:.34}),forceDraw:()=>{target.drawImage(actual,...args);if(throwDraw)throw Error('synthetic draw failure');}}};
 let result,error;try{result=new vm.Script('('+witness.toString()+')()').runInNewContext(context);}catch(e){error=e;}
 assert.equal(Context.prototype.drawImage,original,'observer always restores prototype');
 assert.equal(forwarded.at(-1).self,target);assert.equal(forwarded.at(-1).args[0],actual);assert.deepEqual(forwarded.at(-1).args.slice(1),args,'actual arguments forwarded unchanged');
 assert.equal(referenceOps.length,1,'reference tint operation stays outside observed actual draws');
 return{result,error};
}
let positive=0,negative=0;
for(const noWarm of[false,true]){const q=exercise({noWarm});assert.equal(q.result.hits.length,1);assert.equal(q.result.errors.length,0);assert(q.result.hits[0].fullRGBAExact);positive++;}
for(const index of[0,3,4,7]){const bytes=Uint8ClampedArray.from(expected);bytes[index]^=1;assert.equal(exercise({bytes}).result.hits.length,0);negative++;}
for(const options of[{composite:'source-over'},{composite:'destination-in'},{alpha:0},{args:[0,0]}]){assert.equal(exercise(options).result.hits.length,0);negative++;}
assert.match(String(exercise({throwDraw:true}).error),/synthetic draw failure/);
console.log(JSON.stringify({warmCacheObserverRegression:true,positive,negative,passThroughAndFinally:true,syntheticCallbacksOnly:true}));
