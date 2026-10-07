(()=>{"use strict";
const FALLBACK="en";let locale=localStorage.getItem("voltpro-locale")||FALLBACK,dict={};
async function load(l=locale){try{const r=await fetch("locales/"+l+".json");if(!r.ok)throw Error();dict=await r.json();locale=l;localStorage.setItem("voltpro-locale",l);apply();return dict}catch(e){if(l!==FALLBACK)return load(FALLBACK);throw e}}
function t(key){return key.split(".").reduce((o,k)=>o&&o[k],dict)||key}
function apply(root=document){root.querySelectorAll("[data-i18n]").forEach(el=>{el.textContent=t(el.dataset.i18n)});root.documentElement?.setAttribute("lang",locale);document.documentElement.lang=locale}
function setLocale(l){return load(l)}
window.VoltProI18n={load,setLocale,t,apply,get locale(){return locale}};load().catch(()=>{});
})();