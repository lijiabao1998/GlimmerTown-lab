"use strict";
const fs=require('node:fs');
const {instrument}=require('./regression053.cjs');
require('./fixed-work053.cjs').runFixedWork053({candidate:fs.readFileSync(__dirname+'/index.html','utf8'),instrument,baselineSha:'8988e7bd7dd5ee9e82344ce2eb83065a51103207',outSuffix:'fixed-work-c5053'}).catch(e=>{console.error(e);process.exitCode=1;});
