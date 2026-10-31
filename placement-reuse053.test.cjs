'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process');
const source=fs.readFileSync(__dirname+'/index.html','utf8'),base=cp.execFileSync('git',['show','a20713a509270f8ce6e37859c1fafe330372b952:index.html'],{cwd:__dirname,maxBuffer:32e6,encoding:'utf8'});
const names=['theatrePathConflict013','complexPathConflict014','streetscapeConflict015','gardenLifeConflict016','quaysideConflict017','quarterConflict019'],themes=['theatreTheme013','complexTheme014','streetscapeTheme015','gardenLifeTheme016','quaysideTheme017','quarterTheme019'];
const func=(s,n)=>{const p=s.indexOf('function '+n+'('),e=s.indexOf('\n}',p)+2;assert(p>=0&&e>p);return s.slice(p,e);};
function env(){let c={N:9,terraBrush:1,window:{},tiles:[],sizeReads:0};c.idx=(x,y)=>y*c.N+x;c.inMap=(x,y)=>x>=0&&x<c.N&&y>=0&&y<c.N;c.toolSize458=id=>{c.sizeReads++;return typeof id==='number'?id:({large:6,alias:1})[id]||1;};c.terraCells=(x,y)=>[[x-1,y],[x,y-1],[x,y],[x+1,y],[x,y+1]];for(let i=0;i<6;i++)c[themes[i]]=t=>t?.am502===1&&t?.themes?.includes(i)?'theme':null;return c;}
const old=env(),now=env();vm.createContext(old);vm.createContext(now);vm.runInContext(names.map(n=>func(base,n)).join('\n'),old);
const h=source.slice(source.indexOf('let placementConflictContext053='),source.indexOf('function theatrePathConflict013('));
vm.runInContext(h+'\n'+names.map(n=>source.split('\n').find(l=>l.startsWith('function '+n+'('))).join('\n')+'\n'+names.map(n=>func(source,n+'Legacy053')).join('\n'),now);
test('exact baseline conflict results across boundaries, size, brush, exemptions and all six ownership families',()=>{
 let count=0;for(let state=0;state<24;state++){
  const tiles=Array.from({length:81},(_,j)=>({am502:(j+state)%3===0?1:0,themes:[(j+state)%6,(j*3+state)%6]}));old.tiles=now.tiles=tiles;
  for(const brush of [1,3]){old.terraBrush=now.terraBrush=brush;
   for(const id of ['road','large','alias',1,2,3,4,5,6,'doze','wpipe','waterMain','sewerMain','udline','ugcable','tdig','tland','traise'])for(const [x,y]of [[-1,-1],[0,0],[1,2],[5,5],[8,8],[9,4]]){
    now.id=id;now.x=x;now.y=y;vm.runInContext('placementConflictContext053={id,x,y}',now);
    for(const n of names){assert.equal(now[n](id,x,y),old[n](id,x,y),[state,brush,id,x,y,n].join('/'));count++;}
    vm.runInContext('placementConflictContext053=null',now);
   }
  }
 }
 assert.equal(count,31104);
});
test('scope reset observes mutation and computes footprint size once for six checks',()=>{
 now.tiles=Array.from({length:81},()=>({am502:0}));now.sizeReads=0;vm.runInContext("placementConflictContext053={id:'large',x:1,y:1}",now);
 for(const n of names)assert.equal(now[n]('large',1,1),null);assert.equal(now.sizeReads,1);
 now.tiles[10]={am502:1,themes:[5]};vm.runInContext("placementConflictContext053={id:'large',x:1,y:1}",now);assert.equal(now.quarterConflict019('large',1,1),'先拆除水岸街區步道');vm.runInContext('placementConflictContext053=null',now);
});
test('negative control first detects a deliberately omitted quarter ownership bit',()=>{
 const wrong=env();vm.createContext(wrong);vm.runInContext(h.replace('mask|=32','mask|=0'),wrong);wrong.tiles=Array.from({length:81},()=>({am502:1,themes:[5]}));assert.throws(()=>assert.equal(vm.runInContext("placementConflictMask053('road',1,1)&32",wrong),32),assert.AssertionError);
});
