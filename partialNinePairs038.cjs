'use strict';
// Explicitly nine-candidate fixture; the complete ten-form probe is unchanged.
function partialPairs038(useNew){
  const out=[],controls=[];
  for(const seed of[31,71,103]){
    GV.setDiff(3);GV.newWorldSeeded(seed);GV.setSpeed(0);if(!GV.dev556B().sandbox)GV.enterSandbox556B();GV.setGod556B(true);GV.setOverride556B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
    const find=()=>{for(let y=4;y<66;y+=3)for(let x=4;x<66;x+=3)if(GV.placePreview459('landmark',x,y)?.ok){let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear)return{x,y};}throw Error('partialPairs038 legal native lot');};
    const placements=[];
    for(let i=0;i<3;i++){
      const p=find(),quote=GV.placePreview459('landmark',p.x,p.y).cost,before=GV.devMoney556B();
      if(useNew&&!GV.britishWave038.select(['leedsCorn','bishoplloyd','harrods'][i]))throw Error('partialPairs038 appearance selection');
      if(!GV.placeUndo('landmark',p.x,p.y))throw Error('partialPairs038 actual paid placement');
      const b=GV.tile(p.x,p.y)?.bld,spent=before-GV.devMoney556B();if(spent!==quote||spent<=0)throw Error('partialPairs038 native fee');placements.push({...p,v:b.v,spent});
    }
    GV.selectTool434('pan');const checkpoints=[];
    for(const ticks of[0,1,3]){if(ticks)GV.step(ticks);GV.save();checkpoints.push({ticks,state:JSON.parse(GV.rawSave()),stats:GV.stats()});}
    if(useNew){
      const cash=GV.devMoney556B();GV.capabilitySetMoney506(cash-1);GV.save();const damaged=JSON.parse(GV.rawSave());
      GV.capabilitySetMoney506(cash);GV.save();const restored=JSON.parse(GV.rawSave());
      controls.push({seed,original:checkpoints.at(-1).state,damaged,restored});
    }
    out.push({seed,placements,checkpoints});
  }
  const early=out[0].checkpoints[0].state,key='glimmerville.v1.s3.sandbox556b';
  localStorage.setItem(key,JSON.stringify(early));if(!GV.load())throw Error('partialPairs038 original pre-update constructor load');GV.save();
  const bootstrap={input:early,output:JSON.parse(GV.rawSave())};
  // Nine real paid lots/undo/redo/ref actions on both independent BASE and
  // the partial fixture. Keep the normal first update and mayor lazy fields;
  // the complete ten-lot probe remains separate and unchanged.
  GV.setDiff(3);GV.newWorldSeeded(87);GV.setSpeed(0);if(!GV.dev556B().sandbox)GV.enterSandbox556B();GV.setGod556B(true);GV.setOverride556B('unlockAll',true);GV.capabilitySetMoney506(1000000);GV.setDiff(1);
  const nineRows=useNew?window.__wave038NineFixture.rows():Array.from({length:9},()=>null),nineLots=[];
  for(let j=0;j<9;j++){
    let p;for(let y=4;y<66&&!p;y+=3)for(let x=4;x<66;x+=3)if(GV.placePreview459('landmark',x,y)?.ok){let clear=true;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)if(GV.tile(x+dx,y+dy)?.tree)clear=false;if(clear){p={x,y};break;}}
    if(!p)throw Error('partialPairs038 matched transaction lot');if(useNew){GV.britishWave038.open();const button=document.querySelector('[data-wave038="'+nineRows[j].id+'"]');if(!button||button.disabled)throw Error('partialPairs038 real catalog unavailable');button.click();if(GV.britishWave038.selection()!==nineRows[j].id)throw Error('partialPairs038 real catalog selection');}else GV.selectTool434('landmark');
    if(!GV.placeUndo('landmark',p.x,p.y)||!GV.undo()||!GV.redo()||!GV.placeUndo('doze',p.x+1,p.y+1)||!GV.undo())throw Error('partialPairs038 matched native transaction sequence');nineLots.push(p);
  }
  const last=nineLots.at(-1);if(!GV.undo()||!GV.redo()||!GV.placeUndo('doze',last.x+1,last.y+1)||!GV.undo())throw Error('partialPairs038 matched final ref transaction');
  const save=()=>{GV.save();return JSON.parse(GV.rawSave());},preUpdate=save();GV.step(1);const afterStep=save();
  document.getElementById('bAI').click();const options=document.querySelector('[data-mtab470="options"]');if(!options)throw Error('partialPairs038 real native mayor options');options.click();document.getElementById('infoX').click();const initialized=save();
  if(initialized.aim!==afterStep.aim||initialized.money!==afterStep.money||initialized.day!==afterStep.day)throw Error('partialPairs038 read-only mayor view changed AI, money or day');
  const loaded=[];for(let j=0;j<2;j++){if(!GV.load())throw Error('partialPairs038 initialized native load');loaded.push(save());}
  return{pairs:out,controls,bootstrap,nineTransactions:{lots:nineLots,preUpdate,afterStep,initialized,loaded}};
}
module.exports=partialPairs038;
