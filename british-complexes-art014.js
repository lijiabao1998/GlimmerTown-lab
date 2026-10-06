/* GPT-014: bounded original four-ensemble art catalog. No runtime simulation. */
(function(root){
 'use strict';
 const themes=Object.freeze(['collegeGate','collegeCloister','collegeLibraryWalk','collegeGarden','manorGate','manorTerrace','manorParterre','manorPond','bathsPromenade','bathsFountain','bathsTowelGarden','bathsLaundryWalk','fireApron','fireHoseWalk','fireMemorialGarden','fireBrigadeWalk']);
 function buildAll(){
  if(!root.BritishComplexPrimitives014||!root.BritishCollegeManor014||!root.BritishBathsFire014)throw Error('All original GPT-014 art modules must load before installation');
  const a=root.BritishCollegeManor014.buildAll(),b=root.BritishBathsFire014.buildAll(),buildings={...a.buildings,...b.buildings},modules={...a.modules,...b.modules};
  if(Object.keys(a.buildings).some(k=>Object.hasOwn(b.buildings,k))||Object.keys(a.modules).some(k=>Object.hasOwn(b.modules,k)))throw Error('Duplicated GPT-014 art identity');
  if(Object.keys(buildings).sort((a,b)=>+a-+b).join(',')!=='282,283,284,285,286,287,288,289,290,291,292,293')throw Error('Exactly twelve GPT-014 original building identities required');
  const keys=themes.flatMap(t=>[0,1,2,3].map(v=>t+'_'+v)).sort();
  if(JSON.stringify(Object.keys(modules).sort())!==JSON.stringify(keys))throw Error('Exactly sixteen four-view independent walking themes required');
  for(const [k,views]of Object.entries(buildings)){const main=[282,285,288,291].includes(+k),sz=main?4:2,w=main?304:160,h=main?320:196;if(!Array.isArray(views)||views.length!==4)throw Error('Four authored building views required: '+k);for(let v=0;v<4;v++){const s=views[v];if(!s?.img||!s.night||s.sz!==sz||s.view!==v||s.w!==w||s.h!==h||s.ax!==w/2||s.ay!==h-2)throw Error('Original building geometry/anchor mismatch: '+k+'/'+v);}}
  for(const key of keys){const s=modules[key],v=+key.slice(-1);if(!s?.img||!s.night||s.sz!==1||s.view!==v||s.w!==72||s.h!==92||s.ax!==36||s.ay!==90)throw Error('Original walking geometry/anchor mismatch: '+key);}
  return{buildings,modules};
 }
 root.BritishComplexesArchitecture014=Object.freeze({buildAll,themes});
})(typeof window==='undefined'?globalThis:window);
