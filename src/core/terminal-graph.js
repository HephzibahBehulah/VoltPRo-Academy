/* VoltPRo terminal graph: authoritative endpoint index. */
(()=>{'use strict';
function build(project){
 const devices=project.devices||project.components||[], terminals=new Map(), devicesById=new Map(), errors=[];
 for(const d of devices){
  if(!d?.id){errors.push({code:'DEVICE_ID_MISSING'});continue}
  if(devicesById.has(d.id))errors.push({code:'DUPLICATE_DEVICE',deviceId:d.id});
  devicesById.set(d.id,d);
  const ts=Array.isArray(d.terminals)?d.terminals:(Array.isArray(d.pins)?d.pins.map((p,i)=>typeof p==='string'?{id:String(p).split(':').pop(),label:String(p).split(':').pop(),type:'electrical',domain:'dc'}:{id:p.id||String(i),...p}):[]);
  for(const t of ts){const id=t.id?.includes(':')?t.id:d.id+':'+t.id;if(terminals.has(id))errors.push({code:'DUPLICATE_TERMINAL',terminalId:id});terminals.set(id,{...t,id,deviceId:d.id});}
 }
 const resolve=(id)=>terminals.get(id)||null;
 return {devicesById,terminals,resolve,endpointIds:()=>Array.from(terminals.keys()),errors,valid:errors.length===0};
}
function endpoint(deviceId,terminalId){return deviceId+':'+terminalId}
window.VoltProTerminalGraph={build,endpoint};
})();