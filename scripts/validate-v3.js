const fs=require("node:fs"),cp=require("node:child_process"),path=require("node:path");
function read(p){return JSON.parse(fs.readFileSync(p,"utf8"))}
function fail(m){throw new Error("VoltPRo validation: "+m)}
for(const p of fs.readdirSync("platform").filter(x=>x.endsWith(".js"))){const r=cp.spawnSync(process.execPath,["--check",path.join("platform",p)],{stdio:"inherit"});if(r.status!==0)fail("syntax error in "+p)}
const models=read("data/component-models.v3.json"),schema=read("data/component-schema.json"),ch=read("data/challenges.json"),tu=read("data/tutorials.json"),fa=read("data/faults.json");
if(models.format!=="voltpro-component-models"||models.version!==3||!Array.isArray(models.components)||models.components.length<10)fail("component model contract");
for(const x of models.components){for(const k of ["id","category","pins","simulation"])if(!x[k])fail("model missing "+k+": "+x.id);if(!Array.isArray(x.pins)||!x.pins.length)fail("model pins: "+x.id)}
if(schema.type!=="object"||!schema.required?.includes("id")||!schema.required?.includes("simulation"))fail("component JSON schema contract");
if(ch.format!=="voltpro-challenges"||!Array.isArray(ch.challenges)||!ch.challenges.length)fail("challenge contract");
if(tu.format!=="voltpro-tutorials"||!Array.isArray(tu.tutorials)||!tu.tutorials.length)fail("tutorial contract");
if(fa.format!=="voltpro-faults"||!Array.isArray(fa.faults)||!fa.faults.length)fail("fault contract");
const manifest=read("pwa.webmanifest");if(!manifest.name||!manifest.start_url||!Array.isArray(manifest.icons)||manifest.icons.length<2)fail("PWA manifest");
console.log("VoltPRo v3 data, module and PWA validation: OK");