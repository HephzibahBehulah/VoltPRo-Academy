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
  assert.match(source, /function syncRunControls\\(state=S\\.running\\?"running":"stopped"\\)/);
  assert.match(source, /runButton\\.classList\\.toggle\\("is-running",current==="running"\\)/);
  assert.match(source, /stopButton\\.classList\\.toggle\\("is-stopped",current==="stopped"\\|\\|current==="error"\\)/);
  assert.match(source, /status\\.dataset\\.state=current/);
  assert.match(source, /if\\(!dc\\.ok\\)\\{S\\.running=false;[\\s\\S]*?syncRunControls\\("error"\\);return\\}/);
  assert.match(source, /function stop\\(\\)\\{S\\.running=false;renderCanvas\\(\\);syncRunControls\\(\\)\\}/);
  const html = fs.readFileSync(path.join(__dirname, '..', 'simulator.html'), 'utf8');
  assert.match(html, /id="simStatus" role="status" aria-live="polite" data-state="stopped"/);
  assert.match(html, /id="runBtn"[^>]*aria-pressed="false"/);
  assert.match(html, /id="stopBtn"[^>]*aria-pressed="true"/);
  const css = fs.readFileSync(path.join(__dirname, '..', 'simulator.css'), 'utf8');
  assert.match(css, /#runBtn\\.is-running/);
  assert.match(css, /#stopBtn\\.is-stopped/);
  assert.match(css, /\\.status\\[data-state="running"\\] \\.status-dot/);
  assert.match(css, /\\.status\\[data-state="error"\\]/);
});
