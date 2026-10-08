(()=>{'use strict';
const scenarios=[
{id:'DOL-OPEN-HOLD',title:'Contactor holding contact open',fault:{type:'stuck-open-contact',target:'KM1'},symptoms:['Motor drops out when START is released','KM1 coil is only energised while START is pressed'],expectedDiagnosis:'KM1 auxiliary NO holding contact is open'},
{id:'DOL-PHASE-LOSS',title:'Motor phase loss',fault:{type:'phase-loss',target:'L2'},symptoms:['Unequal line-line measurements','Motor current imbalance'],expectedDiagnosis:'L2 is unavailable'},
{id:'DOL-OVERLOAD',title:'Motor overload',fault:{type:'overload',target:'OL1'},symptoms:['Motor current exceeds rated value','Overload trips after sustained operation'],expectedDiagnosis:'Mechanical/electrical overload requires investigation'}
];
function get(id){return scenarios.find(x=>x.id===id)||null}
window.VoltProFaultScenarios={scenarios,get};
})();