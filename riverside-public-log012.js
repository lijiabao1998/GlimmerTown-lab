'use strict';
// Pure-data classification of one proven Chrome duplicate diagnostic.
// No network, browser, product code, suppression of unknown errors, or mutation.
const OFFICIAL012='https://lijiabao1998.github.io/GlimmerTown-lab/';
const MANIFEST012=OFFICIAL012+'manifest.json';
const MANIFEST_TEXT012='Manifest fetch from '+MANIFEST012+' failed, code 404';
function isOfficialDocument012(value){
  if(typeof value!=='string'||/\s/.test(value))return false;
  try{const u=new URL(value),site=new URL(OFFICIAL012);return u.origin===site.origin&&u.pathname===site.pathname&&!u.username&&!u.password;}catch{return false;}
}
function isManifestDuplicate012(entry){return entry?.level==='error'&&entry.text===MANIFEST_TEXT012&&isOfficialDocument012(entry.url);}
function reconcileManifestDuplicates012(entries,networkResponses){
  const proof=(networkResponses||[]).find(q=>q?.url===MANIFEST012&&q.status===404),known=[],errors=[];
  for(const entry of entries||[]){
    if(isManifestDuplicate012(entry)&&proof)known.push({url:entry.url,text:entry.text,manifestURL:MANIFEST012,networkProof:{url:proof.url,status:proof.status},classification:'exact Chrome manifest duplicate with independent Network.responseReceived 404'});
    else errors.push('Browser log: '+entry?.text+' @ '+(entry?.url||''));
  }
  return{known,errors};
}
// Known resource-attributed browser diagnostics require their own exact 404.
// Every unknown error remains blocking, including a log that merely mentions PWA.
function reconcilePublicLogs012(entries, networkResponses) {
  const known = [], errors = [];
  for (const entry of entries || []) {
    if (isManifestDuplicate012(entry)) {
      const q = reconcileManifestDuplicates012([entry], networkResponses);
      known.push(...q.known); errors.push(...q.errors); continue;
    }
    const resource = ['manifest.json','icon.svg','sw.js'].map(p => OFFICIAL012 + p)
      .find(url => url === entry?.url);
    const proof = resource && (networkResponses || []).find(q => q?.url === resource && q.status === 404);
    const text = entry?.text;
    const knownText = text === 'Failed to load resource: the server responded with a status of 404 ()' ||
      text === 'Failed to load resource: the server responded with a status of 404 (Not Found)' ||
      (resource === OFFICIAL012 + 'sw.js' && text === 'A bad HTTP response code (404) was received when fetching the script.');
    if (entry?.level === 'error' && proof && knownText) known.push({url:entry.url,text,
      networkProof:{url:proof.url,status:proof.status},classification:'exact known PWA resource log with independent Network.responseReceived 404'});
    else errors.push('Browser log: ' + text + ' @ ' + (entry?.url || ''));
  }
  return {known, errors};
}
module.exports={OFFICIAL012,MANIFEST012,MANIFEST_TEXT012,isOfficialDocument012,isManifestDuplicate012,reconcileManifestDuplicates012,reconcilePublicLogs012};
