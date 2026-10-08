'use strict';
// Preserve historical names/themes while current product approval belongs to019.
const prior=require('./waterfront-static-contract018'),current=require('./waterfront-quarter-contract019');
module.exports={...prior,BASE:current.BASE,BASE_HTML_SHA256:current.BASE_HTML_SHA256,verifyStatic018:current.verifyStatic019};
