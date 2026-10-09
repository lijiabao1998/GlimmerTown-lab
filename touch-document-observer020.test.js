'use strict';
const assert=require('node:assert/strict'),{observeDocument020}=require('./touch-document-observer020');
const url='http://127.0.0.1:8199/index.html';
async function fixture(options={}){let event,closed=0;const sends=[];const q=await observeDocument020({ws:'test',url,frameId:'frame',timeoutMs:options.timeoutMs||1000,connect:async(ws,onEvent)=>{event=onEvent;return{send:async(method,params)=>{sends.push({method,params});if(method==='Network.getResponseBody'){if(options.bodyError)throw Error('body unavailable');if(options.malformedBody)return{body:123,base64Encoded:false};return{body:options.base64?'aGVsbG8=':'hello',base64Encoded:!!options.base64};}return{};},close(){closed++;}};}});return{q,event,sends,get closed(){return closed;}};}
const request=()=>({method:'Network.requestWillBeSent',params:{type:'Document',requestId:'request',frameId:'frame',loaderId:'loader',request:{url}}});
const response=()=>({method:'Network.responseReceived',params:{type:'Document',requestId:'request',frameId:'frame',loaderId:'loader',response:{url,status:200,mimeType:'text/html'}}});
const finished=()=>({method:'Network.loadingFinished',params:{requestId:'request'}});
(async()=>{let negatives=0;
 for(const base64 of [false,true]){const f=await fixture({base64});assert.equal(f.sends[0].method,'Network.enable');f.event(request());f.event(response());f.event(finished());const got=await f.q.read();assert.equal(got.bytes.toString(),'hello');assert.equal(got.frameId,'frame');assert.equal(got.loaderId,'loader');assert.equal(got.method,'Network.getResponseBody');f.q.close();f.q.close();assert.equal(f.closed,1);}
 for(const mutate of [q=>q.params.request.url+='?wrong',q=>q.params.frameId='',q=>q.params.frameId='other',q=>q.params.loaderId='',q=>q.params.redirectResponse={}]){const f=await fixture(),r=request();mutate(r);f.event(r);await assert.rejects(f.q.read());f.q.close();negatives++;}
 for(const mutate of [q=>q.params.requestId='wrong',q=>q.params.frameId='wrong',q=>q.params.loaderId='wrong',q=>q.params.response.url+='?wrong',q=>q.params.response.status=404,q=>q.params.response.mimeType='application/json']){const f=await fixture();f.event(request());const r=response();mutate(r);f.event(r);await assert.rejects(f.q.read());f.q.close();negatives++;}
 for(const mode of ['duplicate request','duplicate response','missing response','loading failed','body error','malformed body','duplicate completion','timeout']){const f=await fixture({bodyError:mode==='body error',malformedBody:mode==='malformed body',timeoutMs:mode==='timeout'?10:1000});f.event(request());if(mode==='duplicate request')f.event(request());else if(mode==='loading failed')f.event({method:'Network.loadingFailed',params:{requestId:'request',errorText:'blocked'}});else if(mode==='missing response')f.event(finished());else if(mode!=='timeout'){f.event(response());if(mode==='duplicate response')f.event(response());else{f.event(finished());if(mode==='duplicate completion')f.event(finished());}}await assert.rejects(f.q.read());f.q.close();negatives++;}
 // The same deadline covers connection and domain setup, with late resource cleanup.
 let lateConnect,lateClosed=0;
 const stalled=observeDocument020({ws:'test',url,frameId:'frame',timeoutMs:10,connect:()=>new Promise(resolve=>{lateConnect=resolve;})});
 await assert.rejects(stalled,/Timed out/);negatives++;
 lateConnect({send:async()=>({}),close(){lateClosed++;}});await new Promise(resolve=>setImmediate(resolve));assert.equal(lateClosed,1);negatives++;
 let setupClosed=0;
 await assert.rejects(observeDocument020({ws:'test',url,frameId:'frame',timeoutMs:10,connect:async()=>({send:()=>new Promise(()=>{}),close(){setupClosed++;}})}),/Timed out/);assert.equal(setupClosed,1);negatives++;
 await assert.rejects(observeDocument020({ws:'test',url,frameId:'frame',connect:async()=>{throw Error('connect failed');}}),/connect failed/);negatives++;
 let rejectedSetupClosed=0;
 await assert.rejects(observeDocument020({ws:'test',url,frameId:'frame',connect:async()=>({send:async()=>{throw Error('enable failed');},close(){rejectedSetupClosed++;}})}),/enable failed/);assert.equal(rejectedSetupClosed,1);negatives++;
 console.log(JSON.stringify({ok:true,sourceOnly:true,gameExecuted:false,positive:2,negative:negatives}));
})().catch(error=>{console.error(error);process.exitCode=1;});
