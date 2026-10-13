'use strict';
// Owner-authorized merge bookkeeping. Literal, bounded label replacements;
// every renderer, gameplay function and approved artwork byte remains exact.
const LABELS022=Object.freeze([
  ['<span id="startVersion456">v14.40 · T738</span>','<span id="startVersion456">v14.41 · T739</span>'],
  ["const GAME_VER='14.40';","const GAME_VER='14.41';"],
  ["const GAME_ANCHOR='T738';","const GAME_ANCHOR='T739';"]
].map(pair=>Object.freeze(pair)));
function releaseLabels022(input){
  let text=input.toString('utf8');
  for(const [before,after] of LABELS022){if(text.split(before).length!==2)throw Error('Exactly one pinned release label required: '+before);text=text.replace(before,after);}
  return text;
}
module.exports={releaseLabels022,LABELS022};
