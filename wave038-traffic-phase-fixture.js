/* GPT-038 CI TRAFFIC PHASE START: capture fixture only, never production runtime. */
window.__wave038TrafficPhase=Object.freeze({
  scope:'CI capture fixture; original native renderer and signal semantics',
  readCounter:()=>trafClock,
  phaseAt(clock,seed){
    if(!Number.isFinite(clock)||clock<0||clock>=5.7||!Number.isFinite(seed))throw Error('traffic038 finite fixture phase');
    const before=trafClock;
    try{trafClock=clock;return sigPhase(seed);}finally{trafClock=before;}
  },
  drawAt(clock){
    if(!Number.isFinite(clock)||clock<0||clock>=5.7)throw Error('traffic038 finite fixture phase');
    const before=trafClock;let witness;
    try{
      trafClock=clock;
      window.GV.forceDraw();
      witness={requestedClock:clock,capturedClock:trafClock,signals:signalList.map(s=>({x:s.x,y:s.y,manual:!!s.m,seed:s.x*7+s.y*13,phase:sigPhase(s.x*7+s.y*13)}))};
    }finally{trafClock=before;}
    return{...witness,counterBefore:before,counterRestored:trafClock};
  }
});
/* GPT-038 CI TRAFFIC PHASE END */
