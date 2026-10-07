/* GPT-018: retain only the outward half of the existing 64 x 56 cliff.
   The caller supplies native view coordinates and the unchanged screen anchor.
   mask 1 = view-y boundary / left half; 2 = view-x / right half; 3 = both.
   Retained RGBA is copied unchanged; no repainting or terrain edits. */
(function(root){
  'use strict';
  // Weak keys release both unregistered copies when a replaced canonical atlas
  // is no longer live. Values never refer back to the canonical sprite.
  const mapEdgeCopies018=new WeakMap();
  function mapEdgeHalves018(sprite){
    let halves=mapEdgeCopies018.get(sprite);
    if(halves)return halves;
    if(sprite.width!==64||sprite.height!==56)throw Error('GPT-018 cliff must be 64 x 56');
    const sourceContext=sprite.getContext('2d');
    if(!sourceContext)throw Error('GPT-018 cliff context unavailable');
    const source=sourceContext.getImageData(0,0,64,56);
    if(source.width!==64||source.height!==56||source.data.length!==64*56*4)throw Error('GPT-018 cliff RGBA dimensions');
    halves=[];
    for(let side=1;side<=2;side++){
      const image=document.createElement('canvas');image.width=64;image.height=56;
      const context=image.getContext('2d');
      if(!context)throw Error('GPT-018 copy context unavailable');
      const bytes=new Uint8ClampedArray(source.data);
      for(let y=0;y<56;y++)for(let x=0;x<64;x++)if(side===1?x>=32:x<32)bytes.fill(0,(y*64+x)*4,(y*64+x)*4+4);
      context.putImageData(new ImageData(bytes,64,56),0,0);
      halves.push(image);
    }
    // Publish only a complete pair. A failed read/copy leaves no partial cache.
    mapEdgeCopies018.set(sprite,halves);
    return halves;
  }
  function mapEdgeMask018(vx,vy,n){
    return (vy===n-1?1:0)|(vx===n-1?2:0);
  }
  function drawMapEdge018(ctx,sprite,vx,vy,n,sx,sy,z,legacyDisabledFlag){
    const mask=mapEdgeMask018(vx,vy,n);
    if(!sprite||!mask)return mask;
    // Preserve full-size sampling without clip-induced resampling. Only the
    // unwanted half of each cached 64 x 56 source has transparent RGBA.
    if(legacyDisabledFlag||mask===3)ctx.drawImage(sprite,sx,sy,64*z,56*z);
    else ctx.drawImage(mapEdgeHalves018(sprite)[mask-1],sx,sy,64*z,56*z);
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
