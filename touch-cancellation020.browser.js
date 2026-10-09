'use strict';
// Runs only inside the existing CI smoke browser, using the shipped GV test APIs.
// No profile, save, fixture import, production URL or external storage is used.
async function runTouchCancellation020(cdp) {
  const reports = [];
  for (const [width, height] of [[390,844], [360,800]]) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:true});
    await cdp.send('Emulation.setTouchEmulationEnabled', {enabled:true,maxTouchPoints:5});
    // A real trusted input grants sticky user activation for navigator.vibrate
    // during long-hold cases. Do not hide/whitelist console permission errors.
    await cdp.evalJs(`GV.selectTool434('pan')`);
    await cdp.send('Input.dispatchMouseEvent', {type:'mousePressed',x:width/2,y:height/2,button:'left',clickCount:1});
    await cdp.send('Input.dispatchMouseEvent', {type:'mouseReleased',x:width/2,y:height/2,button:'left',clickCount:1});
    if (!await cdp.evalJs('navigator.userActivation.hasBeenActive')) throw new Error('Trusted CI activation missing');
    const report = await cdp.evalJs(`(${browserCases020.toString()})(${width},${height})`);
    reports.push(report);
    if (!report.ok) throw new Error(JSON.stringify(report));
  }
  await cdp.send('Emulation.setTouchEmulationEnabled', {enabled:false});
  await cdp.send('Emulation.clearDeviceMetricsOverride');
  return reports;
}
async function browserCases020(width, height) {
  const checks=[];
  const check=(name,ok)=>{checks.push({name,ok:!!ok});if(!ok)throw new Error(name);};
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const canvas=document.getElementById('game');
  let nextId=2000;
  let n=0;while(GV.tile(n,0))n++;
  GV.setSpeed(0);GV.ai(false);GV.setRot(0);GV.setZoom(1);
  await wait(100); // allow the real resize listener to update canvas dimensions
  // Work on valid fixture cells from this disposable smoke world.
  const find=(tool,landOnly=false)=>{
    for(let y=4;y<n-4;y++)for(let x=4;x<n-4;x++){
      if(landOnly&&!([1,2].includes(GV.tile(x,y).t)))continue;
      if(GV.canPlaceTool(tool,x,y))continue;
      if(tool==='zr'&&GV.tile(x,y).zone===1&&!GV.tile(x,y).tree)continue; // require a real positive-control change
      if(tool==='road'&&[0,1,2].some(dx=>GV.canPlaceTool(tool,x+dx,y)))continue;
      return [x,y];
    }
    throw new Error('No valid '+tool+' fixture cell');
  };
  const select=(tool,at)=>{
    check(tool+' selectable',GV.selectTool434(tool));
    GV.setZoom(1);GV.lookAt(at[0],at[1]);
    // camLookWorld centers the diamond top; half a tile lands safely inside.
    return {x:canvas.clientWidth/2,y:canvas.clientHeight/2+8};
  };
  const event=(type,id,p,extra={})=>canvas.dispatchEvent(new PointerEvent(type,
    {bubbles:true,pointerId:id,pointerType:'touch',isPrimary:true,button:0,
     buttons:type==='pointerup'||type==='pointercancel'?0:1,clientX:p.x,clientY:p.y,...extra}));
  const snapshot=()=>JSON.stringify({money:GV.stats().money,
    tiles:Array.from({length:n*n},(_,i)=>GV.tile(i%n,(i/n)|0))});
  const camera=()=>{const c=GV.camera436();return JSON.stringify({x:c.x,y:c.y,z:c.z});};
  const clean=()=>GV.camera436().pointers===0&&GV.camera436().roadDraft===null;
  const stale=(id,p)=>{event('pointercancel',id,p);event('lostpointercapture',id,p);event('pointerup',id,p);event('pointermove',id,{x:p.x+60,y:p.y+30});};
  try {
    check('viewport '+width+'x'+height,innerWidth===width&&innerHeight===height);
    // Every abort starts and terminates in one event-loop turn, before 430 ms.
    for(const kind of ['pointercancel','lostpointercapture'])for(const tool of ['plant','road','zr']){
      const at=find(tool),p=select(tool,at),id=++nextId,before=snapshot(),undo=GV.txn460().undo;
      event('pointerdown',id,p);
      if(tool!=='plant')event('pointermove',id,{x:p.x+64,y:p.y+32});
      event(kind,id,p);stale(id,p);
      check(kind+' '+tool+' does not commit',snapshot()===before&&GV.txn460().undo===undo&&clean());
      await wait(460);
      check(kind+' '+tool+' timer stays cancelled',snapshot()===before&&clean());
    }
    // A legitimate release commits once, implicit capture loss/stale terminals do not.
    for(const tool of ['plant','road','zr']){
      const at=find(tool),p=select(tool,at),id=++nextId,before=snapshot(),undo=GV.txn460().undo;
      event('pointerdown',id,p);
      if(tool!=='plant')event('pointermove',id,{x:p.x+64,y:p.y+32});
      event('pointerup',id,p);const committed=snapshot();stale(id,p);
      check('normal '+tool+' commits once',committed!==before&&snapshot()===committed&&GV.txn460().undo===undo+1&&clean());
      check('normal '+tool+' Undo',GV.undo()&&snapshot()===before);
    }
    // Pending older IDs cannot steer or finish a newer preview.
    {
      const at=find('road'),p=select('road',at),old=++nextId,id=++nextId,before=snapshot();
      event('pointerdown',old,p);event('pointercancel',old,p);event('pointerdown',id,p);
      const draft=JSON.stringify(GV.camera436().roadDraft);stale(old,p);
      check('stale events leave new gesture intact',GV.camera436().pointers===1&&JSON.stringify(GV.camera436().roadDraft)===draft&&snapshot()===before);
      event('pointercancel',id,p);check('new preview abort',snapshot()===before&&clean());
    }
    // Once long-hold painting has happened, cancellation closes its transaction.
    for(const kind of ['pointercancel','lostpointercapture','pinch']){
      const at=find('plant'),p=select('plant',at),id=++nextId,before=snapshot(),undo=GV.txn460().undo;
      event('pointerdown',id,p);await wait(480);const painted=snapshot();
      check('long-hold really painted '+kind,painted!==before);
      if(kind==='pinch'){
        const second=++nextId;event('pointerdown',second,{x:p.x+60,y:p.y});
        event('pointercancel',id,p);stale(second,p);
      }else event(kind,id,p);
      stale(id,p);
      check('long-hold retained once '+kind,snapshot()===painted&&GV.txn460().undo===undo+1&&clean());
      check('long-hold Undo '+kind,GV.undo()&&snapshot()===before);
    }
    // Partial pinch cancellation must swallow both fingers and pending build.
    {
      const at=find('plant'),p=select('plant',at),a=++nextId,b=++nextId,before=snapshot();
      event('pointerdown',a,p);event('pointerdown',b,{x:p.x+60,y:p.y});
      event('pointermove',b,{x:p.x+80,y:p.y+10});event('pointercancel',a,p);
      const after=camera();stale(a,p);stale(b,p);
      check('partial pinch leaves no placement or stale movement',snapshot()===before&&camera()===after&&clean());
    }
    // Pan remains usable, but an aborted stationary press never inspects.
    {
      const at=find('plant'),p=select('pan',at),id=++nextId,info=JSON.stringify(GV.t461());
      event('pointerdown',id,p);event('pointercancel',id,p);stale(id,p);
      check('pan abort does not inspect',JSON.stringify(GV.t461())===info&&clean());
      const a=++nextId,before=camera();event('pointerdown',a,p);event('pointermove',a,{x:p.x+30,y:p.y+20});event('pointerup',a,p);
      check('normal pan moves',camera()!==before&&clean());
    }
    // Route selection must not fire on cancellation. A real bus stop makes the
    // positive assertion meaningful rather than clicking an empty map square.
    {
      const at=find('road',true);
      check('route road fixture placed',GV.placeUndo('road',...at));
      check('bus fixture accepts stop',!GV.canPlaceTool('bus',...at));
      check('bus fixture placed',GV.placeUndo('bus',...at));
      const p=select('busrt',at),id=++nextId,before=JSON.stringify(GV.busRoutes());
      event('pointerdown',id,p);event('pointercancel',id,p);stale(id,p);
      check('route abort keeps stops',JSON.stringify(GV.busRoutes())===before&&clean());
      const a=++nextId;event('pointerdown',a,p);event('pointerup',a,p);
      check('normal route tap updates stops',JSON.stringify(GV.busRoutes())!==before&&clean());
      // Toggle the same stop out again before removing our fixture.
      const b=++nextId;event('pointerdown',b,p);event('pointerup',b,p);GV.selectTool434('pan');GV.undo();GV.undo();
    }
    GV.selectTool434('pan');
    return {ok:true,width,height,checks};
  }catch(error){return {ok:false,width,height,error:error.message,checks};}
}
module.exports={runTouchCancellation020};
