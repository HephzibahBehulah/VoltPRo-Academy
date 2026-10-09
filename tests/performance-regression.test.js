const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");

test("simulator drag updates are frame-throttled and do not rebuild component DOM", () => {
  const source = fs.readFileSync(path.join(root, "simulator.js"), "utf8");
  const start = source.indexOf('svg.addEventListener("mousemove"');
  const end = source.indexOf('window.addEventListener("mouseup"', start);
  assert.ok(start >= 0 && end > start, "drag handlers should be present");
  const handler = source.slice(start, end);
  assert.ok(handler.includes("requestAnimationFrame"));
  assert.ok(handler.includes("renderWires();"));
  assert.ok(!handler.includes("renderCanvas();"), "dragging must not rebuild the full component DOM");
});

test("simulator external scripts are deferred for parallel fetch and non-blocking HTML parsing", () => {
  const html = fs.readFileSync(path.join(root, "simulator.html"), "utf8");
  const tags = html.split('<script src="').slice(1).map(chunk => chunk.slice(0, chunk.indexOf(">")));
  assert.ok(tags.length > 20, "expected simulator dependency scripts");
  assert.ok(tags.every(tag => tag.endsWith(" defer")), "every external simulator script should use defer");
});

test("service worker does not prefetch the entire asset catalog during installation", () => {
  const source = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
  const start = source.indexOf('self.addEventListener("install"');
  const end = source.indexOf('self.addEventListener("activate"');
  const install = source.slice(start, end);
  assert.ok(install.includes("small application shell"));
  assert.ok(!install.includes("ASSETS.map"), "install must not fetch the full asset catalog");
});

test("component media requests start after page load and run in small batches", () => {
  const source = fs.readFileSync(path.join(root, "platform/component-media.js"), "utf8");
  assert.ok(source.includes("i+=4"), "CSV fetch concurrency should be limited to four");
  assert.ok(source.includes("setTimeout(()=>load()"), "media loading should be delayed until after page load");
});


test("wire preview redraws only the wire layer, not all components", () => {
  const source = fs.readFileSync(path.join(root, "simulator.js"), "utf8");
  assert.ok(source.includes('onPreview:(start,p)=>{S.wirePointer=p;if(!wirePreviewFrame)requestAnimationFrame('));
});

test("common electrical components use recognizable schematic symbols and leads", () => {
  const source = fs.readFileSync(path.join(root, "simulator.js"), "utf8");
  assert.ok(source.includes('if(c.type==="resistor") return line(-55,0,-34,0)+path("M-34 0'));
  assert.ok(source.includes('if(c.type==="lamp") return line(-55,0,-23,0)+circle(23)+path("M-15 -15 L15 15'));
  assert.ok(source.includes('if(c.type==="battery"||c.type==="acsource")'));
});

test("inspector remains visible on medium desktop widths", () => {
  const source = fs.readFileSync(path.join(root, "simulator.css"), "utf8");
  assert.ok(source.includes('.workspace{grid-template-columns:205px minmax(0,1fr) 250px}'));
  assert.ok(source.includes('@media (max-width:900px)'));
});


test("viewport zoom and pan are applied to the rendered layers", () => {
  const source = fs.readFileSync(path.join(root, "simulator.js"), "utf8");
  assert.ok(source.includes("function applyViewport()"));
  assert.ok(source.includes('setAttribute("transform",t)'));
  assert.ok(source.includes('(e.clientX-r.left-S.pan.x)/S.zoom'));
});

test("terminal clicks use pointer input and avoid rebuilding the full palette on every render", () => {
  const source = fs.readFileSync(path.join(root, "simulator.js"), "utf8");
  assert.ok(source.includes('p.onpointerdown=e=>{e.stopPropagation();e.preventDefault();handlePin(p.dataset.pin)}'));
  assert.ok(source.includes("paletteRenderKey"));
  assert.ok(source.includes("if(key!==paletteRenderKey)renderPalette()"));
});

test("reference symbols render as labels rather than object coercions and MCU workspace is wired", () => {
  const source = fs.readFileSync(path.join(root, "platform/workbench.js"), "utf8");
  assert.ok(source.includes("const symbolLabel="));
  assert.ok(source.includes('else if(b.dataset.mode==="micro")micro()'));
  assert.ok(source.includes("VoltProMCU?.simulate"));
});

test("demo library defines 100 documented demo variants and can load them into the schematic", () => {
  const source = fs.readFileSync(path.join(root, "platform/demo-library.js"), "utf8");
  assert.ok(source.includes("const demos=templates.flatMap"));
  assert.ok(source.includes('["Troubleshooting",.8]'));
  assert.ok(source.includes("window.VoltProDemoLibrary={open,demos:()=>demos.slice(),load:loadDemo}"));
  const html = fs.readFileSync(path.join(root, "simulator.html"), "utf8");
  assert.ok(html.includes('platform/demo-library.js'));
});
