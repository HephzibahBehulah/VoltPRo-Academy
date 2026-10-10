const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '..', 'simulator.js'), 'utf8');
const workflow = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'wiring-workflow.js'), 'utf8');

test('component body cancels a pending wire and continues into pointer drag setup', () => {
  const start = source.indexOf('g.onpointerdown=e=>');
  const end = source.indexOf('g.ondblclick=', start);
  assert.notEqual(start, -1, 'component body pointer handler exists');
  const handler = source.slice(start, end);
  assert.match(handler, /if\(e\.target\.classList\.contains\("pin"\)\|\|e\.button!==0\)return/);
  assert.match(handler, /if\(wiring\?\.active\)wiring\.cancel\(\)/);
  assert.match(handler, /dragging=\{id,start:posFromEvent\(e\),orig:\{\.\.\.c\},pointerId:e\.pointerId/);
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

test('components expose a transparent hit target so symbol strokes cannot pass clicks through to the blank canvas', () => {
  assert.match(source, /class="component-hit" x="-64" y="-30" width="128" height="64" fill="transparent" pointer-events="all"/);
});


test('Run and Stop expose distinct accessible visual states and report simulation errors as stopped', () => {
  assert.ok(source.includes('function syncRunControls(state=S.running?"running":"stopped")'));
  assert.ok(source.includes('runButton.classList.toggle("is-running",current==="running")'));
  assert.ok(source.includes('stopButton.classList.toggle("is-stopped",current==="stopped"||current==="error")'));
  assert.ok(source.includes('status.dataset.state=current'));
  assert.ok(source.includes('syncRunControls("error");return}'));
  assert.ok(source.includes('function stop(){S.running=false;renderCanvas();syncRunControls()}'));
  const html = fs.readFileSync(path.join(__dirname, '..', 'simulator.html'), 'utf8');
  assert.ok(html.includes('id="simStatus" role="status" aria-live="polite" data-state="stopped"'));
  assert.ok(html.includes('id="runBtn" class="primary" aria-label="Run simulation" aria-pressed="false"'));
  assert.ok(html.includes('id="stopBtn" aria-label="Stop simulation" aria-pressed="true"'));
  const css = fs.readFileSync(path.join(__dirname, '..', 'simulator.css'), 'utf8');
  assert.ok(css.includes('#runBtn.is-running'));
  assert.ok(css.includes('#stopBtn.is-stopped'));
  assert.ok(css.includes('.status[data-state="running"] .status-dot'));
  assert.ok(css.includes('.status[data-state="error"]'));
});


test('wire inspector exposes AWG and metric cross-section with synchronized approximate conversions', () => {
  assert.ok(source.includes('const AWG_MM2={24:0.205,22:0.326,20:0.518,18:0.823,16:1.31,14:2.08,12:3.31,10:5.26,8:8.37,6:13.3,4:21.2,2:33.6}'));
  assert.ok(source.includes('function nearestAwg(size)'));
  assert.ok(source.includes('function nearestMetricSize(gauge)'));
  assert.ok(source.includes('data-wire-prop="gauge"'));
  assert.ok(source.includes('wire.gauge=String(v);wire.size=nearestMetricSize(v)'));
  assert.ok(source.includes('wire.size=String(v);wire.gauge=String(nearestAwg(v))'));
  assert.ok(source.includes('data-wire-prop="color" type="color"'));
  assert.ok(source.includes('data-wire-prop="cableType"'));
  assert.ok(source.includes('data-wire-prop="size"'));
  assert.ok(source.includes('Drawing thickness only. It does not calculate current capacity or electrical safety.'));
  const html = fs.readFileSync(path.join(__dirname, '..', 'simulator.html'), 'utf8');
  assert.ok(html.includes('simulator.js?v=20261010k'));
  assert.ok(html.includes('simulator.css?v=20261010f'));
});


test('toolbar wire menu exists', () => {
 const html = fs.readFileSync(path.join(__dirname, '..', 'simulator.html'), 'utf8');
 assert.ok(html.includes('id="wireMenu" class="wire-menu" hidden'));
 assert.ok(source.includes('function setWireMenu(open)'));
 assert.ok(source.includes('...S.wireStyle'));
});
