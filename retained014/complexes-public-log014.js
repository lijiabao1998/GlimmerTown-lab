'use strict';
// Pure-data classification of one proven Chrome duplicate diagnostic.
// No network, browser, product code, suppression of unknown errors, or mutation.
const OFFICIAL013='https://lijiabao1998.github.io/GlimmerTown-lab/';
const MANIFEST013=OFFICIAL013+'manifest.json';
const MANIFEST_TEXT013='Manifest fetch from '+MANIFEST013+' failed, code 404';
function isOfficialDocument013(value){
  if(typeof value!=='string'||/\s/.test(value))return false;
  try{const u=new URL(value),site=new URL(OFFICIAL013);return u.origin===site.origin&&u.pathname===site.pathname&&!u.username&&!u.password;}catch{return false;}
}
function isManifestDuplicate013(entry){return entry?.level==='error'&&entry.text===MANIFEST_TEXT013&&isOfficialDocument013(entry.url);}
function reconcileManifestDuplicates013(entries,networkResponses){
  const proof=(networkResponses||[]).find(q=>q?.url===MANIFEST013&&q.status===404),known=[],errors=[];
  for(const entry of entries||[]){
    if(isManifestDuplicate013(entry)&&proof)known.push({url:entry.url,text:entry.text,manifestURL:MANIFEST013,networkProof:{url:proof.url,status:proof.status},classification:'exact Chrome manifest duplicate with independent Network.responseReceived 404'});
    else errors.push('Browser log: '+entry?.text+' @ '+(entry?.url||''));
  }
  return{known,errors};
}
// Known resource-attributed browser diagnostics require their own exact 404.
// Every unknown error remains blocking, including a log that merely mentions PWA.
function reconcilePublicLogs013(entries, networkResponses) {
  const known = [], errors = [];
  for (const entry of entries || []) {
    if (isManifestDuplicate013(entry)) {
      const q = reconcileManifestDuplicates013([entry], networkResponses);
      known.push(...q.known); errors.push(...q.errors); continue;
    }
    const resource = ['manifest.json','icon.svg','sw.js'].map(p => OFFICIAL013 + p)
      .find(url => url === entry?.url);
    const proof = resource && (networkResponses || []).find(q => q?.url === resource && q.status === 404);
    const text = entry?.text;
    const knownText = text === 'Failed to load resource: the server responded with a status of 404 ()' ||
      text === 'Failed to load resource: the server responded with a status of 404 (Not Found)' ||
      (resource === OFFICIAL013 + 'sw.js' && text === 'A bad HTTP response code (404) was received when fetching the script.');
    if (entry?.level === 'error' && proof && knownText) known.push({url:entry.url,text,
      networkProof:{url:proof.url,status:proof.status},classification:'exact known PWA resource log with independent Network.responseReceived 404'});
    else errors.push('Browser log: ' + text + ' @ ' + (entry?.url || ''));
  }
  return {known, errors};
}
module.exports={OFFICIAL013,MANIFEST013,MANIFEST_TEXT013,isOfficialDocument013,isManifestDuplicate013,reconcileManifestDuplicates013,reconcilePublicLogs013};
