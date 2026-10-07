(()=>{"use strict";
function validate(project,ch){const comps=project.components||[],types=new Set(comps.map(c=>c.type));const missing=(ch.requiredComponents||[]).filter(t=>!types.has(t));let ok=missing.length===0;
if(ch.rules)for(const r of ch.rules){if(r.type==="minComponents")ok=ok&&comps.length>=r.value;if(r.type==="connected")ok=ok&&(project.wires||[]).length>=r.value}
return {passed:ok,missing,score:ok?100:Math.max(0,100-missing.length*20),message:ok?"Challenge complete":"Missing: "+missing.join(", ")}} 
function run(project,ch){const result=validate(project,ch);return {...result,id:ch.id,title:ch.title}}
window.VoltProChallenge={validate,run};
})();