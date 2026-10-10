"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("Academy workbench JavaScript parses without syntax errors", () => {
  assert.doesNotThrow(() => new Function(read("academy-workbench.js")));
});

test("workbench declares all major learning and engineering sections", () => {
  const html = read("academy-workbench.html");
  for (const id of ["overview", "faults", "challenges", "demos", "engineering", "color-led", "tutorials", "projects", "wire-lab", "tool-index"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.match(html, /academy-workbench\.js/);
  assert.match(html, /academy-workbench\.css/);
});

test("fault and challenge banks are parameterised to the requested sizes", () => {
  const js = read("academy-workbench.js");
  assert.match(js, /Array\.from\(\{length:1000\}/);
  assert.match(js, /Array\.from\(\{length:10000\}/);
  assert.match(js, /function openFault/);
  assert.match(js, /function openChallenge/);
});

test("curated template inventory contains only relevant technical domains", () => {
  const index = JSON.parse(read("data/electrical-tool-index.json"));
  assert.equal(index.count, index.tools.length);
  assert.ok(index.count >= 350);
  const allowed = new Set(["Electrical & Electronics", "Electrical Installation", "Automation & PLC", "Units & Engineering"]);
  assert.ok(index.tools.every(tool => allowed.has(tool.category)));
  assert.ok(index.tools.some(tool => tool.category === "Electrical Installation"));
  assert.ok(index.tools.some(tool => tool.category === "Automation & PLC"));
});

test("simulator links to the workbench and supports its project handoff", () => {
  const html = read("simulator.html");
  const js = read("simulator.js");
  assert.match(html, /academy-workbench\.html/);
  assert.match(js, /voltpro-library-import/);
  assert.match(js, /libraryImport/);
  assert.match(js, /loadProject\(pending\)/);
});

test("colour console accepts standard HEX lengths but not five-digit HEX", () => {
  const js = read("academy-workbench.js");
  assert.match(js, /\[0-9a-f\]\{3\}\|\[0-9a-f\]\{4\}\|\[0-9a-f\]\{6\}\|\[0-9a-f\]\{8\}/i);
  assert.match(js, /Invalid or incomplete HEX \/ RGB/);
});

test("simulator toolbar is organised into task groups without duplicate workbench shortcuts", () => {
  const html = read("simulator.html");
  assert.match(html, /role="toolbar" aria-label="Simulator controls"/);
  const header = html.slice(html.indexOf('<header class="sim-top"'), html.indexOf("</header>"));
  for (const id of ["newBtn", "saveBtn", "loadBtn", "exportBtn", "pngBtn"]) {
    assert.doesNotMatch(header, new RegExp('id="' + id + '"'));
  }
  for (const id of ["runBtn", "stopBtn", "undoBtn", "redoBtn", "deleteBtn", "wireBtn", "wireMenuBtn", "paletteBtn", "fitBtn", "newBtn", "saveBtn", "loadBtn", "exportBtn", "pngBtn"]) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.equal((html.match(/href="academy-workbench\.html"/g) || []).length, 1);
  assert.doesNotMatch(html, /href="academy-workbench\.html#(faults|challenges|demos)"/);
  assert.match(html, /href="academy-workbench\.html#projects"/);
  assert.match(read("simulator.js"), /getBoundingClientRect\(\)/);
});

test("primary destinations are consistent across the practical and engineering pages", () => {
  const workbench = read("academy-workbench.html");
  const engineering = read("engineering.html");
  for (const page of [workbench, engineering]) {
    assert.match(page, /aria-label="Primary destinations"/);
    assert.ok(page.includes('href="index.html"'));
    assert.ok(page.includes('href="simulator.html"'));
  }
  assert.ok(workbench.includes('href="engineering.html"'));
  assert.ok(engineering.includes('href="academy-workbench.html"'));
});
