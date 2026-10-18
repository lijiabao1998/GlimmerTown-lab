/* GPT-032 CAPACITY SELFTEST START */
function bldCapacitySelftest032(){
  const checks=[],add=(name,ok)=>checks.push([name,!!ok]),registry=SPR.bld,entries=Object.entries(registry),within=entries.length<=2000;
  const expected=within?entries.filter(([,s])=>s?.img?.getContext).map(([k])=>'bld.'+k):[],wanted=new Set(expected);
  const world=JSON.stringify(window.GV.stats()),storage=JSON.stringify(localStorage);
  const fp=window.GV.fp536(),sheet=window.GV.sheet536('bld'),style=window.GV.style536();
  const fpKeys=Object.keys(fp.subs||{}).filter(k=>k.startsWith('bld.')),sheetKeys=(sheet.leaves||[]).map(s=>s.p),styleKeys=Object.keys(style.leaves||{}).filter(k=>k.startsWith('bld.'));
  const exact=keys=>keys.length===wanted.size&&keys.every(k=>wanted.has(k));
  add('capacity032 fingerprint covers the bounded bld registry',fp.ok&&exact(fpKeys));
  add('capacity032 sheet covers the bounded bld registry',sheet.ok&&exact(sheetKeys));
  add('capacity032 style covers the bounded bld registry',style.ok&&exact(styleKeys));
  add('capacity032 registry identities unchanged',SPR.bld===registry&&entries.length===Object.keys(registry).length&&entries.every(([k,s])=>registry[k]===s));
  add('capacity032 native world unchanged',JSON.stringify(window.GV.stats())===world);
  add('capacity032 storage unchanged',JSON.stringify(localStorage)===storage);
  return{ok:checks.every(c=>c[1]),checks:checks.map(c=>c[0]+(c[1]?' ✓':' ✗')),counts:{registry:entries.length,expected:expected.length,fp:fpKeys.length,sheet:sheetKeys.length,style:styleKeys.length},limit:{bldRoot:2000,otherObjects:1200}};
}
window.GV.bldCapacity032=Object.freeze({selftest:bldCapacitySelftest032});
/* GPT-032 CAPACITY SELFTEST END */
