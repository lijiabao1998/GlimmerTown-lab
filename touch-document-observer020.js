'use strict';
// Observe the actual navigation response on a separate CDP connection. Never
// replace requests/responses or the harness's original runtime error collector.
async function observeDocument020({ws,url,frameId,connect,timeoutMs=120000}){
 if(typeof frameId!=='string'||!frameId)throw Error('Exact main frame required');
 let observer,request=null,response=null,body=null,failure=null,resolve,reject,rejectDeadline,closed=false;
 const result=new Promise((yes,no)=>{resolve=yes;reject=no;});result.catch(()=>{});
 const deadline=new Promise((yes,no)=>{rejectDeadline=no;});deadline.catch(()=>{});
 const fail=error=>{if(!failure)failure=error instanceof Error?error:Error(String(error));reject(failure);};
 const close=()=>{if(closed)return;closed=true;clearTimeout(timer);observer?.close();};
 const timer=setTimeout(()=>{fail(Error('Timed out observing actual document response'));rejectDeadline(failure);close();},timeoutMs);
 try{
  const connection=Promise.resolve().then(()=>connect(ws,message=>{
   if(closed)return;
   const p=message.params||{};
   try{
    if(message.method==='Network.requestWillBeSent'&&p.type==='Document'){
     if(request||p.request?.url!==url||p.redirectResponse||!p.requestId||p.frameId!==frameId||!p.loaderId)throw Error('Unexpected or duplicate main-document request');
     request={id:p.requestId,frameId:p.frameId,loaderId:p.loaderId};
    }else if(message.method==='Network.responseReceived'&&p.type==='Document'){
     if(!request||response||p.requestId!==request.id||p.frameId!==request.frameId||p.loaderId!==request.loaderId||p.response?.url!==url||p.response?.status!==200||!/^text\/html(?:;|$)/.test(p.response?.mimeType||''))throw Error('Main-document response identity mismatch');
     response=p.response;
    }else if(message.method==='Network.loadingFailed'&&p.requestId===request?.id)throw Error('Main-document loading failed: '+p.errorText);
    else if(message.method==='Network.loadingFinished'&&p.requestId===request?.id){
     if(!response||body)throw Error('Missing or duplicate document completion');
     body=observer.send('Network.getResponseBody',{requestId:request.id}).then(q=>{
      if(typeof q.body!=='string'||typeof q.base64Encoded!=='boolean')throw Error('Malformed actual response body');
      const bytes=Buffer.from(q.body,q.base64Encoded?'base64':'utf8');clearTimeout(timer);resolve({bytes,url,requestId:request.id,frameId:request.frameId,loaderId:request.loaderId,method:'Network.getResponseBody',actualCandidateBytes:true});
     }).catch(fail);
    }
   }catch(error){fail(error);}
  })).then(value=>{if(closed){value.close();throw failure||Error('Observer setup already closed');}observer=value;return value;});
  connection.catch(()=>{});
  observer=await Promise.race([connection,deadline]);
  await Promise.race([observer.send('Network.enable',{maxTotalBufferSize:64*1024*1024,maxResourceBufferSize:32*1024*1024}),deadline]);
 }catch(error){close();throw error;}
 return{async read(){const value=await result;if(failure)throw failure;return value;},close};
}
module.exports={observeDocument020};
