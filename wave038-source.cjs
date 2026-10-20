'use strict';
// Source composition only. Parsing does not execute the game or start Chrome.
const assert=require('node:assert/strict'),vm=require('node:vm');
const ART='<!-- GPT-038 PURE ART START -->',ART_END='<!-- GPT-038 PURE ART END -->',CSS='<!-- GPT-038 CSS START -->',CSS_END='<!-- GPT-038 CSS END -->';
const RUNTIME='/* GPT-038 RUNTIME START',RUNTIME_END='/* GPT-038 RUNTIME END */';
const OLD='installBritishWave037(); // GPT-004:',FULL='installBritishWave037();installBritishWave038(); // GPT-004:',NINE='installBritishWave037();installBritishWave038NineFixture(); // GPT-004:';
function unique(text,needle,label){assert.equal(text.split(needle).length,2,'wave038 unique '+(label||needle));}
function parse(text){let n=0;for(const m of text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:'inline-'+(++n)});assert(n>10,'wave038 complete inline script source');return n;}
function compose(text,sources,nineFixture){
  let out=text,runtime=sources.runtime.trimEnd();
  if(nineFixture){unique(runtime,RUNTIME_END,'runtime end');runtime=runtime.replace(RUNTIME_END,nineFixture.trimEnd()+'\n'+RUNTIME_END);}
  const put=(start,end,content,anchor)=>{const a=out.indexOf(start);if(a>=0){unique(out,start);const b=out.indexOf(end,a);assert(b>a,'wave038 block end');out=out.slice(0,a)+content+out.slice(b+end.length);}else{unique(out,anchor);out=out.replace(anchor,()=>content+'\n'+anchor);}};
  put(ART,ART_END,ART+'\n<script>\n'+sources.art.trimEnd()+'\n</script>\n'+ART_END,'<!-- GPT-037 PURE ART START -->');
  put(CSS,CSS_END,CSS+'\n<style>\n'+sources.css.trimEnd()+'\n</style>\n'+CSS_END,ART);
  put(RUNTIME,RUNTIME_END,runtime,'Object.assign(window.GV,{art574:');
  const tail=nineFixture?NINE:FULL;
  if(!out.includes(tail)){unique(out,OLD,'native installation tail');out=out.replace(OLD,tail);}else unique(out,tail,'native installation tail');
  parse(out);return out;
}
function strip(text,partial=false){
  let out=text;
  for(const [start,end]of[[ART,ART_END],[CSS,CSS_END],[RUNTIME,RUNTIME_END]]){
    unique(out,start);unique(out,end);const a=out.indexOf(start),b=out.indexOf(end,a)+end.length;assert(b>a&&out[b]==='\n','wave038 exact block boundary');out=out.slice(0,a)+out.slice(b+1);
  }
  const tail=partial?NINE:FULL;unique(out,tail,'declared installation tail');return out.replace(tail,OLD);
}
module.exports={compose,strip,parse};
