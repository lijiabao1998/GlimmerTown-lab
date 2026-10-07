/* GPT-018: retain only the outward half of the existing 64 x 56 cliff.
   The caller supplies native view coordinates and the unchanged screen anchor.
   mask 1 = view-y boundary / left half; 2 = view-x / right half; 3 = both.
   No new pixels, sprite generation, terrain edits, or per-call allocation. */
(function(root){
  'use strict';
  function mapEdgeMask018(vx,vy,n){
    return (vy===n-1?1:0)|(vx===n-1?2:0);
  }
  function drawMapEdge018(ctx,sprite,vx,vy,n,sx,sy,z,legacyDisabledFlag){
    const mask=mapEdgeMask018(vx,vy,n);
    if(!sprite||!mask)return mask;
    // Keep the original native call exactly for the diagnostic fallback and
    // the front corner. Cropping changes neither the anchor nor the scale.
    if(legacyDisabledFlag||mask===3)ctx.drawImage(sprite,sx,sy,64*z,56*z);
    else if(mask===1)ctx.drawImage(sprite,0,0,32,56,sx,sy,32*z,56*z);
    else ctx.drawImage(sprite,32,0,32,56,sx+32*z,sy,32*z,56*z);
    return mask;
  }
  function selftest018(){
    if(mapEdgeMask018(0,0,72)!==0||mapEdgeMask018(10,71,72)!==1||
       mapEdgeMask018(71,10,72)!==2||mapEdgeMask018(71,71,72)!==3||
       mapEdgeMask018(71,0,72)!==2||mapEdgeMask018(0,71,72)!==1||
       mapEdgeMask018(0,0,1)!==3)throw Error('GPT-018 outward map-edge mask');
    return{ok:true,cases:7,canvasExecuted:false};
  }
  const api=Object.freeze({mapEdgeMask018,drawMapEdge018,selftest018});
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.MapEdgeRepair018=api;
})(typeof window==='object'?window:null);
