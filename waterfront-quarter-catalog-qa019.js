'use strict';
// Serialized into the actual Actions browser. Requiring this module does not
// launch a browser, load the game, or execute any DOM/painter operation.
function quarterBoxUI019(selector,scrollSelector=null){
 const e=document.querySelector(selector);if(!e)throw Error('Missing UI target '+selector);
 if(scrollSelector){
  if(!['#catalogCats458','#catalogResults458'].includes(scrollSelector))throw Error('Undesignated UI scroller');
  const s=document.querySelector(scrollSelector);if(!s||!s.contains(e))throw Error('Target outside designated UI scroller');
  const r=e.getBoundingClientRect(),b=s.getBoundingClientRect(),left=b.left+s.clientLeft,top=b.top+s.clientTop;
  if(scrollSelector==='#catalogCats458'){if(r.left<left)s.scrollLeft+=r.left-left;else if(r.right>left+s.clientWidth)s.scrollLeft+=r.right-left-s.clientWidth;}
  else{if(r.top<top)s.scrollTop+=r.top-top;else if(r.bottom>top+s.clientHeight)s.scrollTop+=r.bottom-top-s.clientHeight;}
 }
 const r=e.getBoundingClientRect();let left=Math.max(0,r.left),top=Math.max(0,r.top),right=Math.min(innerWidth,r.right),bottom=Math.min(innerHeight,r.bottom);
 for(let p=e.parentElement;p;p=p.parentElement){const c=getComputedStyle(p),b=p.getBoundingClientRect();if(/^(auto|scroll|hidden|clip)$/.test(c.overflowX)){left=Math.max(left,b.left+p.clientLeft);right=Math.min(right,b.left+p.clientLeft+p.clientWidth);}if(/^(auto|scroll|hidden|clip)$/.test(c.overflowY)){top=Math.max(top,b.top+p.clientTop);bottom=Math.min(bottom,b.top+p.clientTop+p.clientHeight);}}
 const visible=right>left&&bottom>top,x=(left+right)/2,y=(top+bottom)/2,hit=visible?document.elementFromPoint(x,y):null;
 return{x,y,w:r.width,h:r.height,left:r.left,top:r.top,right:r.right,bottom:r.bottom,visible,tappable:!!hit&&(e===hit||e.contains(hit)),fullyVisible:visible&&left<=r.left+1&&right>=r.right-1&&top<=r.top+1&&bottom>=r.bottom-1,clip:{left,top,right,bottom}};
}
function quarterCatalogUI019(){
 const rect=r=>({left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height});
 const box=e=>{if(!e)return null;const c=getComputedStyle(e);return{...rect(e.getBoundingClientRect()),clientLeft:e.clientLeft,clientTop:e.clientTop,clientWidth:e.clientWidth,clientHeight:e.clientHeight,scrollWidth:e.scrollWidth,scrollHeight:e.scrollHeight,scrollLeft:e.scrollLeft,scrollTop:e.scrollTop,overflowX:c.overflowX,overflowY:c.overflowY,columns:c.gridTemplateColumns};};
 const q=s=>document.querySelector(s),notice=q('[data-quarter-guide019]'),textRects=[];
 if(notice){const range=document.createRange();range.selectNodeContents(notice);for(const r of range.getClientRects())textRects.push(rect(r));}
 return{viewport:{left:0,top:0,right:innerWidth,bottom:innerHeight},documentWidth:document.documentElement.scrollWidth,enabled:q('#buildCatalog458').hasAttribute('data-quarter-catalog-fit019'),root:box(q('#buildCatalog458')),sheet:box(q('.catalogSheet458')),header:box(q('.catalogHead458')),title:box(q('.catalogHead458 h3')),close:box(q('#catalogClose458')),search:box(q('#catalogSearch458')),mode:box(q('#catalogMode458')),categoryWrapper:box(q('#catalogCats458').parentElement),categories:box(q('#catalogCats458')),results:box(q('#catalogResults458')),notice:box(notice),noticeText:notice?.textContent||'',noticeTextRects:textRects,cards:[...document.querySelectorAll('#catalogResults458 [data-card458]')].map(e=>({id:e.dataset.card458,box:box(e),size:e.querySelector('.catalogTag458')?.textContent||''}))};
}
// Geometry predicates are also exercised against deliberately invalid plain
// JSON. Positive dimensions/document.scrollWidth alone never establish fit.
function quarterCatalogBounds019(q){
 const eps=1,horizontal=(a,b)=>!!a&&!!b&&a.width>0&&a.left>=b.left-eps&&a.right<=b.right+eps;
 const inside=(a,b)=>horizontal(a,b)&&a.height>0&&a.top>=b.top-eps&&a.bottom<=b.bottom+eps;
 const viewport={...q.viewport,width:q.viewport.right-q.viewport.left,height:q.viewport.bottom-q.viewport.top};
 const content=b=>({left:b.left+b.clientLeft,top:b.top+b.clientTop,right:b.left+b.clientLeft+b.clientWidth,bottom:b.top+b.clientTop+b.clientHeight,width:b.clientWidth,height:b.clientHeight});
 const sheet=content(q.sheet),results=content(q.results),horizontalTargets=['header','title','close','search','mode','categoryWrapper','categories','results'];
 const horizontalFailures=horizontalTargets.filter(k=>!horizontal(q[k],sheet)||!horizontal(q[k],viewport));
 const cardFailures=q.cards.filter(c=>!horizontal(c.box,results)||!horizontal(c.box,viewport)).map(c=>c.id);
 const headerFits=['header','title','close','search','mode','categoryWrapper','categories'].every(k=>inside(q[k],sheet)&&inside(q[k],viewport));
 const noticeReadable=!!q.notice&&q.noticeText.includes('視覺')&&q.noticeTextRects.length>0&&inside(q.notice,results)&&q.noticeTextRects.every(r=>inside(r,results)&&inside(r,viewport));
 const hallIds=['lifeboatHeritageHall018','canalTollhouseExhibit018'];
 const truthfulSizes=q.cards.length===16&&new Set(q.cards.map(c=>c.id)).size===16&&hallIds.every(id=>q.cards.some(c=>c.id===id&&c.size==='2×2'))&&q.cards.every(c=>c.size===(hallIds.includes(c.id)?'2×2':'1×1'));
 return{fits:inside(q.sheet,viewport)&&headerFits&&horizontalFailures.length===0&&cardFailures.length===0&&q.sheet.scrollWidth<=q.sheet.clientWidth+eps&&q.sheet.scrollLeft===0&&q.sheet.scrollTop===0&&q.results.scrollWidth<=q.results.clientWidth+eps,headerFits,horizontalFailures,cardFailures,noticeReadable,truthfulSizes};
}
module.exports={quarterBoxUI019,quarterCatalogUI019,quarterCatalogBounds019};
