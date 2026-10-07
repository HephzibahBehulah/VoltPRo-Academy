/* VoltPRo Engine v3 — browser-native educational electrical solver.
 * MIT-compatible original code. Educational analysis only; verify real designs
 * against applicable standards, manufacturer data and qualified engineering practice.
 */
(()=>{"use strict";
const EPS=1e-12;
function c(re=0,im=0){return {re:+re||0,im:+im||0}}
function add(a,b){return c(a.re+b.re,a.im+b.im)}
function sub(a,b){return c(a.re-b.re,a.im-b.im)}
function mul(a,b){return c(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re)}
function div(a,b){const d=b.re*b.re+b.im*b.im;if(d<EPS)throw Error("Singular complex division");return c((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)}
function abs(a){return Math.hypot(a.re,a.im)}
function solveLinear(A,b){
 const n=A.length, M=A.map((r,i)=>r.map(x=>c(x.re,x.im)).concat([c(b[i].re,b[i].im)]));
 for(let k=0;k<n;k++){let p=k,m=abs(M[k][k]);for(let i=k+1;i<n;i++){const q=abs(M[i][k]);if(q>m){m=q;p=i}}
  if(m<EPS)throw Error("Circuit matrix is singular or floating");
  if(p!==k)[M[p],M[k]]=[M[k],M[p]];
  for(let i=k+1;i<n;i++){const f=div(M[i][k],M[k][k]);for(let j=k;j<=n;j++)M[i][j]=sub(M[i][j],mul(f,M[k][j]))}
 }
 const x=Array(n);for(let i=n-1;i>=0;i--){let s=M[i][n];for(let j=i+1;j<n;j++)s=sub(s,mul(M[i][j],x[j]));x[i]=div(s,M[i][i])}return x
}
function nodes(project){
 const map=new Map([["GND",0]]), next=()=>map.size;
 (project.components||[]).forEach(x=>(project.wires||[]).forEach(w=>{}));
 (project.wires||[]).forEach(w=>{for(const ref of [w.a,w.b]){const [id,p]=String(ref).split(":");const key=id+":"+p;if(!map.has(key))map.set(key,next())}});
 return map
}
function connected(project,ref){
 const [id,p]=String(ref).split(":");const out=[];
 for(const w of project.wires||[]){if(w.a===ref)out.push(w.b);if(w.b===ref)out.push(w.a)}
 return out
}
function componentPins(project,comp){
 const n=Number((comp.pins&&comp.pins.length)||0);if(n)return comp.pins;
 return Array.from({length:n||2},(_,i)=>comp.id+":"+i)
}
function buildTopology(project){
 const refs=[...(project.wires||[])];const parent=new Map();
 const find=x=>{if(!parent.has(x))parent.set(x,x);let p=parent.get(x);while(p!==x){parent.set(x,parent.get(p));x=parent.get(x)}return x};
 const union=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent.set(a,b)};
 refs.forEach(w=>union(w.a,w.b));
 const resolve=r=>find(r);
 (project.components||[]).forEach(c=>componentPins(project,c).forEach(r=>{if(!parent.has(r))parent.set(r,r)}));
 return {resolve}
}
function dc(project,options={}){
 const comps=project.components||[], wires=project.wires||[], topo=buildTopology(project);
 const source=comps.find(x=>["battery","dcsource"].includes(x.type));
 if(!source)return {ok:false,error:"No DC source found",analysis:"DC operating point"};
 const refs=[];comps.forEach(x=>componentPins(project,x).forEach(r=>refs.push(r)));
 const groundRef=options.groundRef||componentPins(project,source)[1];
 const nodeMap=new Map();let ni=0;
 const nodeFor=r=>{const q=topo.resolve(r);if(groundRef&&q===topo.resolve(groundRef))return 0;if(!nodeMap.has(q))nodeMap.set(q,++ni);return nodeMap.get(q)};
 const branches=[];
 for(const comp of comps){
  const pins=componentPins(project,comp);if(pins.length<2)continue;
  const a=nodeFor(pins[0]),b=nodeFor(pins[1]);
  if(a===b)continue;
  if(comp.type==="resistor"||["lamp","motor","heater","buzzer"].includes(comp.type)){
   const R=Math.max(EPS,Number(comp.props?.resistance)||1000);branches.push({comp,a,b,g:1/R,type:"R"});
  } else if(["switch","fuse","breaker","rcd","relay","contactor"].includes(comp.type)){
   const closed=comp.type==="switch"?!!comp.props?.closed:true;
   if(closed)branches.push({comp,a,b,g:1e6,type:"R"});
  } else if(comp.type==="led"||comp.type==="diode"||comp.type==="zener"){
   const R=Math.max(1,Number(comp.props?.resistance)||330);branches.push({comp,a,b,g:1/R,type:"D"});
  }
 }
 const V=Number(source.props?.voltage)||12, sp=componentPins(project,source);
 if(sp.length<2)return {ok:false,error:"Source requires two pins"};
 const reference=options.groundRef||sp[1]; const plus=nodeFor(sp[0]),minus=nodeFor(reference);
 const N=ni, A=Array.from({length:N},()=>Array.from({length:N},()=>c())), z=Array.from({length:N},()=>c());
 const stampG=(a,b,g)=>{if(a>0)A[a-1][a-1]=add(A[a-1][a-1],c(g));if(b>0)A[b-1][b-1]=add(A[b-1][b-1],c(g));if(a>0&&b>0){A[a-1][b-1]=sub(A[a-1][b-1],c(g));A[b-1][a-1]=sub(A[b-1][a-1],c(g))}};
 branches.forEach(q=>stampG(q.a,q.b,q.g));
 // Use a Thevenin-style source constraint by adding a very large conductance.
 const G=1e9;stampG(plus,minus,G);if(plus>0)z[plus-1]=add(z[plus-1],c(G*V));
 let x;try{x=solveLinear(A,z)}catch(e){return {ok:false,error:e.message,analysis:"DC operating point"}}
 const voltage=n=>n===0?0:(x[n-1]?.re||0);
 const results=branches.map(q=>{const u=voltage(q.a)-voltage(q.b),i=u*q.g;return {id:q.comp.id,type:q.comp.type,name:q.comp.name||q.comp.type,voltage:u,current:i,power:u*i}});
 const total=results.reduce((s,r)=>s+r.current,0);
 return {ok:true,analysis:"DC operating point",sourceVoltage:V,totalCurrent:total,totalPower:V*total,nodes:N,branches:results,nodeVoltages:Array.from({length:N},(_,i)=>({node:i+1,voltage:voltage(i+1)}))};
}
function transient(project,{duration=0.1,steps=100}={}){
 const base=dc(project);if(!base.ok)return base;
 const dt=duration/Math.max(1,steps);return {ok:true,analysis:"Transient educational envelope",duration,steps,dt,samples:Array.from({length:steps+1},(_,i)=>({t:i*dt,current:base.totalCurrent,power:base.totalPower})),note:"R-only DC baseline; dynamic C/L/semiconductor models are isolated for the next solver tier."};
}
function ac(project,{frequency=50}={}){
 const base=dc(project);if(!base.ok)return base;
 return {ok:true,analysis:"AC impedance preview",frequency,impedance:base.totalCurrent?base.sourceVoltage/base.totalCurrent:Infinity,phaseDeg:0,note:"Frequency-domain UI contract is active; reactive component models require the next model pack."};
}
function analyze(project,options={}){
 const a=dc(project,options),out={engine:"VoltPRo Engine v3",timestamp:new Date().toISOString(),dc:a};
 if(options.transient)out.transient=transient(project,options.transient===true?{}:options.transient);
 if(options.ac)out.ac=ac(project,options.ac===true?{}:options.ac);
 return out;
}
window.VoltProEngine={version:3,analyze,dc,transient,ac,math:{abs,solveLinear}};
})();