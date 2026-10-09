const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");

test("simulator drag updates are frame-throttled and do not rebuild component DOM", () => {
  const source = fs.readFileSync(path.join(root, "simulator.js"), "utf8");
  const handler = source.match(/svg\\.addEventListener\\("mousemove",[\\s\\S]*?\\);\\nwindow\\.addEventListener\\("mouseup"/);
  assert.ok(handler, "drag handlers should be present");
  assert.match(handler[0], /requestAnimationFrame/);
  assert.match(handler[0], /renderWires\\(\\)/);
  assert.doesNotMatch(handler[0], /renderCanvas\\(\\)/);
});

test("simulator external scripts are deferred for parallel fetch and non-blocking HTML parsing", () => {
  const html = fs.readFileSync(path.join(root, "simulator.html"), "utf8");
  const scripts = [...html.matchAll(/<script src="[^"]+"><\\/script>/g)];
  assert.ok(scripts.length > 20, "expected simulator dependency scripts");
  assert.ok(scripts.every(([tag]) => /\\sdefer>/.test(tag)), "every external simulator script should use defer");
});

test("service worker does not prefetch the entire asset catalog during installation", () => {
  const source = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
  const install = source.slice(source.indexOf('self.addEventListener("install"'), source.indexOf('self.addEventListener("activate"'));
  assert.match(install, /small application shell/);
  assert.doesNotMatch(install, /ASSETS\\.map/);
});

test("component media requests start after page load and run in small batches", () => {
  const source = fs.readFileSync(path.join(root, "platform/component-media.js"), "utf8");
  assert.match(source, /i\\+=4/);
  assert.match(source, /setTimeout\\(\\(\\)=>load\\(\\)/);
});
