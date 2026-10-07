(()=>{"use strict";
const PIN_RE=/pinMode\s*\(\s*(\d+)\s*,\s*(OUTPUT|INPUT|INPUT_PULLUP)\s*\)/g,WRITE_RE=/digitalWrite\s*\(\s*(\d+)\s*,\s*(HIGH|LOW|\d+)\s*\)/g;
function simulate(code,opts={}){const pins={},serial=[];let m;while((m=PIN_RE.exec(code||""))){pins[m[1]]={mode:m[2],state:0}}while((m=WRITE_RE.exec(code||""))){pins[m[1]]??={mode:"OUTPUT",state:0};pins[m[1]].state=m[2]==="HIGH"?1:m[2]==="LOW"?0:Number(m[2])?1:0}const prints=(code||"").match(/Serial\.println?\s*\(([^)]*)\)/g)||[];prints.forEach(x=>serial.push(x.replace(/^.*?\((.*)\).*$/,"$1")));return {target:opts.target||"Arduino UNO",pins,serial,mode:"safe-static-simulation",executable:false,note:"No native compiler is executed; supported pin/serial statements are modeled deterministically."}}
window.VoltProMCU={simulate};
})();