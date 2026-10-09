#!/usr/bin/env node
'use strict';

// GPT-020: isolated input-handler unit tests, not a game/browser/smoke run.
// Usage: node touch-cancellation020.test.js [path/to/index.html]
// The actual input and transaction functions are extracted on every run.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const sourcePath = path.resolve(process.argv[2] || path.join(__dirname, 'index.html'));
const source = fs.readFileSync(sourcePath, 'utf8');
function section(start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `Missing source boundaries: ${start} / ${end}`);
  return source.slice(a, b);
}
const input = section('const hover={x:-1,y:-1};', 'function zoomStep(');
const rectangle = section('function commitRect(){', '/* T239');
const restore = section('function restoreTxn460(', 'function txnToast460(');
const history = section('function undo(){', 'function showBuildHistory460(');

function harness(tool = 'plant') {
  let now = 1000;
  let serial = 0;
  const timers = new Map();
  const listeners = new Map();
  const captured = new Set();
  const released = [];
  const releaseStates = [];
  const effects = { placed: [], inspect: [], routes: [], zoom: [], commits: [], tick: 0 };
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, { style: {}, querySelector: () => null });
    return elements.get(selector);
  };
  const context = vm.createContext({
    console, tool, effects, N: 32, W: 800, H: 600, DPR: 1,
    innerWidth: 800, innerHeight: 600, money: 10000, day: 1,
    cam: { x: 0, y: 128, z: 1 },
    tiles: Array.from({ length: 32 * 32 }, () => ({ road: 0, rc: 0, bld: null })),
    performance: { now: () => now },
    navigator: { vibrate: () => {} },
    document: { documentElement: {} },
    getComputedStyle: () => ({ getPropertyValue: () => '46' }),
    $: element,
    setTimeout: (fn, delay) => { const id = ++serial; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    setInterval: (fn, delay) => { const id = ++serial; timers.set(id, { fn, at: now + delay, interval: delay }); return id; },
    clearInterval: id => timers.delete(id),
    cvs: {
      addEventListener: (type, fn) => {
        if (!listeners.has(type)) listeners.set(type, []);
        listeners.get(type).push(fn);
      },
      setPointerCapture: id => captured.add(id),
      hasPointerCapture: id => captured.has(id),
      releasePointerCapture: id => {
        if (!captured.delete(id)) return;
        released.push(id);
        releaseStates.push(evaluate('({count:pointers.size,rect:rect.on,pinch:!!pinchBase,touch:!!touchBuild436,down:!!downInfo,undo:!!undoGroup})'));
        dispatch('lostpointercapture', { pointerId: id });
      },
    },
  });
  function evaluate(expression) { return vm.runInContext(expression, context); }
  // Deliberately small world stubs. Transaction recording/restoration stays real.
  const dependencies = `
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function idx(x,y){return y*N+x;}
    function T(i){return tiles[i];}
    function inMap(x,y){return x>=0&&y>=0&&x<N&&y<N;}
    function v2w(x,y){return [x,y];}
    function roadToolToRc(id){return id==='road'?1:0;}
    function toolMeta434(){return null;}
    function doPlace(id,x,y){
      if(!inMap(x,y))return false;
      const i=idx(x,y),tile=tiles[i];
      if(tile.road||tile.bld)return false;
      snapshotUndoTile460(i);
      if(id==='road'){tile.road=1;tile.rc=1;}
      else tile.bld={k:id==='plant'?5:1,lv:1,tool:id};
      money-=10;if(undoGroup)undoGroup.spent+=10;
      effects.placed.push([id,x,y]);return true;
    }
    function canPlace(id,x,y){return !!(T(idx(x,y)).road||T(idx(x,y)).bld);}
    function placeCost(){return 10;}
    function roadDraftTiles436(){
      const d=roadDraft436,out=[[d.x0,d.y0]];let x=d.x0,y=d.y0;
      while(x!==d.x1){x+=Math.sign(d.x1-x);out.push([x,y]);}
      while(y!==d.y1){y+=Math.sign(d.y1-y);out.push([x,y]);}
      return out;
    }
    function inspect(x,y){effects.inspect.push([x,y]);}
    function busRtClick(x,y){effects.routes.push(['busrt',x,y]);}
    function railRtClick463(x,y,type){effects.routes.push([type+'rt',x,y]);}
    function metroPlannerClick467B(x,y){effects.routes.push(['metrort',x,y]);}
    function zoomStep(d,x,y){effects.zoom.push([d,x,y]);}
    function txnToast460(g,kind){effects.commits.push({kind,spent:g.spent,count:g.snaps.length});}
    function initAudio(){} function sTick(){effects.tick++;}
    function sBuild(){} function sErr(){} function toast(){}
    function drawMini(){} function wakeUi440(){} function clampCam(){}
    function recalcMask(){} function recalcFoamNear(){} function recalcElMaskNear(){}
    function syncWorldAfterTransaction460(){} function markEmergencyDirty455(){}
    function stampCov(){} function stampPolSrc(){} function computePower(){}
    const COVR={plant:1},KNAME={};
  `;
  vm.runInContext(`${input}\n${rectangle}\n${restore}\n${history}\n${dependencies}`, context, { filename: sourcePath + ':isolated-input' });
  function dispatch(type, event = {}) {
    const e = { pointerId: 1, pointerType: 'touch', button: 0, clientX: 400, clientY: 244, preventDefault() {}, ...event };
    if (type === 'lostpointercapture') captured.delete(e.pointerId);
    for (const listener of listeners.get(type) || []) listener(e);
    // Browsers implicitly release capture after up/cancel. The patched handlers
    // may release first; the Set makes both paths idempotent.
    if (type === 'pointerup' || type === 'pointercancel') context.cvs.releasePointerCapture(e.pointerId);
  }
  function point(x, y) {
    const { cam, W, H, DPR } = context;
    return { clientX: (W / 2 + ((x - y) * 32 - cam.x) * cam.z) / DPR,
      clientY: (H / 2 + ((x + y + .5) * 16 - cam.y) * cam.z) / DPR };
  }
  function event(type, id = 1, x = 2, y = 2, options = {}) {
    dispatch(type, { pointerId: id, ...point(x, y), ...options });
  }
  function advance(ms) {
    const until = now + ms;
    let count = 0;
    while (true) {
      const next = [...timers].filter(([, t]) => t.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      assert.ok(++count < 10000, 'Timer loop did not terminate');
      const [id, timer] = next; now = timer.at;
      if (timer.interval) timer.at += timer.interval; else timers.delete(id);
      timer.fn();
    }
    now = until;
  }
  const state = () => JSON.parse(evaluate(`JSON.stringify({
    pointers:[...pointers.keys()],rect:rect.on,pan:panBase,pinch:pinchBase,paint:paintLast,
    down:downInfo,touch:touchBuild436,road:roadDraft436,edge:edgePanState436,
    longPress:longPressT,edgeTimer:edgePanTimer436,first:firstPaint,
    lastTap:lastTapT,twoTap:twoTapT,zoomAnim,
    undo:undoStack.length,redo:redoStack.length,group:undoGroup,money,
    built:tiles.filter(t=>t.road||t.bld).length
  })`));
  function idle() {
    const s = state();
    assert.deepEqual(s.pointers, []);
    for (const key of ['pan','pinch','paint','down','touch','road','edge','group','first']) assert.equal(s[key], null, key);
    assert.equal(s.rect, false);
    assert.equal(timers.size, 0, 'No gesture timer survives');
    assert.equal(captured.size, 0, 'No capture survives');
  }
  return { context, evaluate, event, dispatch, advance, point, state, idle, timers, captured, released, releaseStates, effects };
}

const tests = [];
function test(name, fn) { tests.push([name, fn]); }
function noActions(h) {
  assert.equal(h.state().built, 0);
  assert.equal(h.state().money, 10000);
  assert.equal(h.state().undo, 0);
  assert.equal(h.effects.inspect.length, 0);
  assert.equal(h.effects.routes.length, 0);
  assert.equal(h.effects.zoom.length, 0);
}

for (const ending of ['pointercancel','lostpointercapture']) {
  test(`${ending}: pending touch placement is discarded`, () => {
    const h=harness();h.event('pointerdown');h.event(ending);h.advance(1000);h.idle();noActions(h);
  });
  test(`${ending}: dragged road preview and edge timer are discarded`, () => {
    const h=harness('road');h.event('pointerdown');
    h.dispatch('pointermove',{pointerId:1,clientX:799,clientY:300});
    assert.equal(h.state().road.active,true);assert.ok(h.timers.size);
    h.event(ending);h.advance(1000);h.idle();noActions(h);
  });
  test(`${ending}: pending rectangle is discarded`, () => {
    const h=harness('zr');h.event('pointerdown');h.event('pointermove',1,3,3);h.event(ending);h.advance(1000);h.idle();noActions(h);
  });
  test(`${ending}: pending pan inspect and single/double tap history are discarded`, () => {
    const h=harness('pan');h.evaluate('lastTapT=performance.now()-100;twoTapT=performance.now()-100;lastTapX=400;lastTapY=244;');
    h.event('pointerdown');h.event(ending);h.idle();noActions(h);
    assert.equal(h.state().lastTap,0);assert.equal(h.state().twoTap,0);
  });
  for (const route of ['busrt','railrt','tramrt','metrort']) test(`${ending}: ${route} click is discarded`, () => {
    const h=harness(route);h.event('pointerdown');h.event(ending);h.idle();noActions(h);
  });
  test(`${ending}: applied long-hold paint remains exactly one undoable transaction`, () => {
    const h=harness();h.event('pointerdown');h.advance(431);
    assert.equal(h.state().built,1);assert.ok(h.state().group);
    h.event(ending);h.idle();assert.equal(h.state().undo,1);assert.equal(h.state().money,9990);
    assert.equal(h.evaluate('undo()'),true);assert.equal(h.state().built,0);assert.equal(h.state().money,10000);
    assert.equal(h.evaluate('redo()'),true);assert.equal(h.state().built,1);assert.equal(h.state().money,9990);
  });
  test(`${ending}: cancelling one pinch finger clears both and suppresses stale events`, () => {
    const h=harness();h.event('pointerdown',1);h.event('pointerdown',2,4,2);
    h.event(ending,1);h.event('pointermove',2,6,3);h.event('pointerup',2);h.event('pointerup',1);h.event('lostpointercapture',2);
    h.advance(1000);h.idle();noActions(h);assert.equal(h.state().twoTap,0);
    assert.ok(h.releaseStates.every(s=>s.count===0&&!s.rect&&!s.pinch&&!s.touch&&!s.down&&!s.undo),'State is cleared before synchronous capture loss');
  });
  test(`${ending}: moved pinch cancellation does not settle zoom or register double-tap`, () => {
    const h=harness('pan');h.event('pointerdown',1);h.event('pointerdown',2,4,2);h.event('pointermove',2,6,2);
    assert.equal(h.state().pinch.moved,true);h.event(ending,1);h.idle();noActions(h);
    assert.equal(h.state().zoomAnim,null);assert.equal(h.state().twoTap,0);
  });
  test(`${ending}: cancellation after normal first pinch-up clears retained tap history`, () => {
    const h=harness('pan');h.event('pointerdown',1);h.event('pointerdown',2,4,2);h.event('pointerup',1);
    assert.ok(h.state().twoTap);assert.deepEqual(h.state().pointers,[2]);
    h.event(ending,2);h.idle();assert.equal(h.state().twoTap,0);noActions(h);
  });
}

test('Successful touch tap places once, and duplicate up/lostcapture remain inert', () => {
  const h=harness();h.event('pointerdown');noActions(h);h.event('pointerup');
  assert.equal(h.state().built,1);assert.equal(h.state().undo,1);const before=h.state();
  h.event('pointerup');h.event('pointercancel');h.event('lostpointercapture');assert.deepEqual(h.state(),before);h.idle();
});
test('Successful road drag commits its preview and Undo/Redo restore all tiles and money', () => {
  const h=harness('road');h.event('pointerdown',1,2,2);h.event('pointermove',1,4,2);noActions(h);h.event('pointerup',1,4,2);
  h.idle();assert.equal(h.state().built,3);assert.equal(h.state().money,9970);assert.equal(h.state().undo,1);
  assert.equal(h.evaluate('undo()'),true);assert.equal(h.state().built,0);assert.equal(h.state().money,10000);
  assert.equal(h.evaluate('redo()'),true);assert.equal(h.state().built,3);assert.equal(h.state().money,9970);
});
test('Successful rectangle commits through real commitRect and transaction functions', () => {
  const h=harness('zr');h.event('pointerdown',1,2,2);h.event('pointermove',1,3,3);noActions(h);h.event('pointerup',1,3,3);
  h.idle();assert.equal(h.state().built,4);assert.equal(h.state().money,9960);assert.equal(h.state().undo,1);
});
test('Successful pan tap inspects once and normal double-tap still zooms', () => {
  const h=harness('pan');h.event('pointerdown');h.event('pointerup');h.advance(100);h.event('pointerdown');h.event('pointerup');
  h.idle();assert.equal(h.effects.inspect.length,2);assert.equal(h.effects.zoom.length,1);assert.equal(h.effects.zoom[0][0],1);
});
for (const route of ['busrt','railrt','tramrt','metrort']) test(`Successful ${route} tap invokes the intended route handler once`, () => {
  const h=harness(route);h.event('pointerdown');h.event('pointerup');h.event('pointerup');h.idle();
  assert.deepEqual(JSON.parse(JSON.stringify(h.effects.routes)),[[route,2,2]]);assert.equal(h.state().built,0);
});
test('Second finger preserves applied long-hold paint as one undoable transaction', () => {
  const h=harness();h.event('pointerdown',1);h.advance(431);h.event('pointerdown',2,4,2);
  assert.equal(h.state().built,1);assert.equal(h.state().undo,1);assert.equal(h.state().group,null);
  h.event('pointercancel',2);h.idle();assert.equal(h.state().undo,1);
  assert.equal(h.evaluate('undo()'),true);assert.equal(h.state().built,0);assert.equal(h.state().money,10000);
});
test('Long-hold drag then pinch and cancellation retain every applied tile in one transaction', () => {
  const h=harness();h.event('pointerdown',1,2,2);h.advance(431);h.event('pointermove',1,4,2);
  assert.equal(h.state().built,3);assert.equal(h.state().money,9970);
  h.event('pointerdown',2,5,2);h.event('pointercancel',2);h.idle();
  assert.equal(h.state().undo,1);assert.equal(h.evaluate('undoStack[0].snaps.length'),3);
  assert.equal(h.evaluate('undo()'),true);assert.equal(h.state().built,0);assert.equal(h.state().money,10000);
  assert.equal(h.evaluate('redo()'),true);assert.equal(h.state().built,3);assert.equal(h.state().money,9970);
});
test('Second finger preserves immediate mouse paint without a partial refund', () => {
  const h=harness('road');h.event('pointerdown',1,2,2,{pointerType:'mouse'});h.event('pointerdown',2,4,2);
  assert.equal(h.state().built,1);assert.equal(h.state().money,9990);assert.equal(h.state().undo,1);
  h.event('pointercancel',2);assert.equal(h.evaluate('undo()'),true);assert.equal(h.state().money,10000);assert.equal(h.state().built,0);
});
test('Pending single-finger touch switches to pinch without construction', () => {
  const h=harness('road');h.event('pointerdown',1);h.event('pointermove',1,3,2);h.event('pointerdown',2,4,2);
  assert.equal(h.state().road,null);assert.equal(h.state().touch,null);noActions(h);
  h.event('pointerup',1);h.event('pointerup',2);h.idle();noActions(h);
});
test('Stale move/up/cancel/lostcapture cannot mutate or end a newer active gesture', () => {
  const h=harness('road');h.event('pointerdown',10);h.event('pointercancel',10);h.event('pointerdown',20,4,4);
  const before=h.state();h.event('pointermove',10,10,10);h.event('pointerup',10);h.event('pointercancel',10);h.event('lostpointercapture',10);
  assert.deepEqual(h.state(),before);h.event('pointerup',20,4,4);h.idle();assert.equal(h.state().built,1);
  assert.equal(h.evaluate('T(idx(4,4)).road'),1);assert.equal(h.evaluate('T(idx(10,10)).road'),0);
});
test('Untracked hover changes hover position but cannot move a live pan camera', () => {
  const h=harness('pan');h.event('pointerdown',1);const before={...h.context.cam};h.event('pointermove',999,6,6);
  assert.deepEqual(h.context.cam,before);assert.equal(h.evaluate('hover.x'),6);assert.equal(h.evaluate('downInfo.moved'),false);
  h.event('pointercancel',1);h.idle();
});
test('Duplicate down cannot overwrite or apply a second immediate transaction', () => {
  const h=harness('road');h.event('pointerdown',1,2,2,{pointerType:'mouse'});const before=h.state();
  h.event('pointerdown',1,3,2,{pointerType:'mouse'});assert.deepEqual(h.state(),before);
  h.event('pointerup',1);assert.equal(h.state().undo,1);assert.equal(h.state().built,1);
});
test('Repeated cancellation performs cleanup exactly once', () => {
  const h=harness();h.event('pointerdown');h.event('pointercancel');const before=h.state(),releases=h.released.length;
  h.event('pointercancel');h.event('lostpointercapture');h.event('pointerup');h.advance(1000);
  assert.deepEqual(h.state(),before);assert.equal(h.released.length,releases);h.idle();noActions(h);
});
test('Normal first pinch-up releases only the completed pointer without cancelling the survivor', () => {
  const h=harness('pan');h.event('pointerdown',1);h.event('pointerdown',2,4,2);h.event('pointerup',1);
  assert.deepEqual(h.state().pointers,[2]);assert.ok(h.captured.has(2));assert.ok(h.state().twoTap);
  h.event('pointerup',2);h.idle();assert.ok(h.state().twoTap);
});

let passed=0;
for (const [name, fn] of tests) {
  try { fn(); passed++; console.log(`PASS ${name}`); }
  catch (error) { console.error(`FAIL ${name}\n${error.stack}`); }
}
console.log(`GPT-020 isolated input tests: ${passed}/${tests.length} passed (${sourcePath})`);
if (passed !== tests.length) process.exitCode=1;
