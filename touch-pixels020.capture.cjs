'use strict';
// Observation-only preload: capture fp.js's existing withGame result unchanged.
// It does not alter browser code, assertions, baselines, exit status, or errors.
if (process.env.GITHUB_ACTIONS !== 'true') throw new Error('Native pixel capture runs only in isolated Actions');
const fs=require('node:fs'),path=require('node:path');
const destination=process.env.GPT020_FP_OUTPUT;
if(!destination||path.dirname(path.resolve(destination))!==path.join(__dirname,'touch-pixel-evidence020'))throw new Error('Bounded evidence destination required');
const harness=require('./harness.js'),original=harness.withGame;
harness.withGame=async(...args)=>{
  const session=await original(...args);
  fs.writeFileSync(destination,JSON.stringify({result:session.result||null,session:{ok:session.ok,fails:session.fails,seconds:session.seconds},errors:session.cdp?.errors||[],benign:session.cdp?.benign||[]},null,2)+'\n');
  return session;
};
