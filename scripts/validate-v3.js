const fs=require("node:fs");
const files=["data/component-models.v3.json","data/component-schema.json","data/challenges.json","data/tutorials.json","data/faults.json"];
for(const f of files){JSON.parse(fs.readFileSync(f,"utf8"))}
const manifest=JSON.parse(fs.readFileSync("pwa.webmanifest","utf8"));
if(!manifest.name||!manifest.start_url||!Array.isArray(manifest.icons)||manifest.icons.length<2)throw new Error("PWA manifest icon contract failed");
console.log("VoltPRo v3 data/PWA validation: OK");