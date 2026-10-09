const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '..', 'simulator.js'), 'utf8');
const workflow = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'wiring-workflow.js'), 'utf8');

test('component body cancels a pending wire and continues into drag setup', () => {
  const start = source.indexOf('g.onmousedown=e=>');
  const end = source.indexOf('g.ondblclick=', start);
  assert.notEqual(start, -1, 'component body mousedown handler exists');
  const handler = source.slice(start, end);
  assert.match(handler, /if\(e\.target\.classList\.contains\("pin"\)\)return/);
  assert.match(handler, /if\(wiring\?\.active\)wiring\.cancel\(\)/);
  assert.match(handler, /dragging=\{id:S\.selected,start:posFromEvent\(e\)/);
  assert.ok(handler.indexOf('wiring.cancel()') < handler.indexOf('dragging='));
  assert.doesNotMatch(handler, /if\(wiring\?\.active\)\{[^}]*return/);
});

test('pin starts wiring through a separate pointer handler', () => {
  assert.match(source, /\$\$\("\.pin"\)\.forEach\(p=>p\.onpointerdown=e=>\{e\.stopPropagation\(\);e\.preventDefault\(\);handlePin\(p\.dataset\.pin\)\}\)/);
});

test('Escape, right-click, and blank-canvas click cancel an active wire', () => {
  assert.match(workflow, /handleKey\(event\).*?event\?\.key==="Escape".*?this\.cancel\(\)/s);
  assert.match(source, /addEventListener\("contextmenu",e=>\{e\.preventDefault\(\);if\(wiring\?\.active\)wiring\.cancel\(\);\}\)/);
  assert.match(source, /addEventListener\("click",e=>\{if\(e\.target===svg\|\|e\.target\.id==="gridRect"\)\{if\(wiring\?\.active\)wiring\.cancel\(\)/);
});

test('wire source receives a visual state without disabling its body handler', () => {
  assert.match(source, /"wire-source "/);
  const css = fs.readFileSync(path.join(__dirname, '..', 'simulator.css'), 'utf8');
  assert.match(css, /\.component\.wire-source/);
  assert.match(css, /cursor:grab!important/);
});
