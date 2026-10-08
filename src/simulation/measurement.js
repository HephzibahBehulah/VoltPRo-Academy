(()=>{'use strict';
function voltage(state,a,b){return Number(state.nodeVoltages?.[a]??0)-Number(state.nodeVoltages?.[b]??0)}
function current(state,branchId){const x=(state.branches||[]).find(b=>b.id===branchId);return Number(x?.current??0)}
function resistance(state,branchId){const x=(state.branches||[]).find(b=>b.id===branchId);if(!x||Math.abs(x.current)<1e-12)return Infinity;return Math.abs(x.voltage/x.current)}
function continuity(state,branchId,threshold=.1){return resistance(state,branchId)<=threshold}
function threePhase(state){const v=state.threePhase||{};return {L1L2:Number(v.L1L2??0),L2L3:Number(v.L2L3??0),L3L1:Number(v.L3L1??0),frequency:Number(v.frequency??0),sequence:v.sequence||null}}
function measure(type,state,args={}){if(type==='voltage')return voltage(state,args.a,args.b);if(type==='current')return current(state,args.branchId);if(type==='resistance')return resistance(state,args.branchId);if(type==='continuity')return continuity(state,args.branchId,args.threshold);if(type==='three-phase')return threePhase(state);throw Error('Unknown measurement: '+type)}
window.VoltProMeasurement={voltage,current,resistance,continuity,threePhase,measure};
})();