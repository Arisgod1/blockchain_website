import{p as c,l as w,C as m,E as p,J as g}from"./vendor-vue-KPUYMlG2.js";/**
 * @license lucide-vue-next v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),_=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(o,t,r)=>r?r.toUpperCase():t.toLowerCase()),k=e=>{const o=_(e);return o.charAt(0).toUpperCase()+o.slice(1)},v=(...e)=>e.filter((o,t,r)=>!!o&&o.trim()!==""&&r.indexOf(o)===t).join(" ").trim(),d=e=>e==="";/**
 * @license lucide-vue-next v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=({name:e,iconNode:o,absoluteStrokeWidth:t,"absolute-stroke-width":r,strokeWidth:i,"stroke-width":l,size:n=s.width,color:C=s.stroke,...a},{slots:u})=>c("svg",{...s,...a,width:n,height:n,stroke:C,"stroke-width":d(t)||d(r)||t===!0||r===!0?Number(i||l||s["stroke-width"])*24/Number(n):i||l||s["stroke-width"],class:v("lucide",a.class,...e?[`lucide-${h(k(e))}-icon`,`lucide-${h(e)}`]:["lucide-icon"])},[...o.map(f=>c(...f)),...u.default?[u.default()]:[]]);/**
 * @license lucide-vue-next v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=(e,o)=>(t,{slots:r,attrs:i})=>c(x,{...i,...t,iconNode:o,name:e},r),z=["width","height"],A=w({__name:"XIcon",props:{size:{default:24}},setup(e){return(o,t)=>(g(),m("svg",{viewBox:"0 0 24 24",fill:"currentColor",width:e.size,height:e.size},[...t[0]||(t[0]=[p("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},null,-1)])],8,z))}}),B=["width","height"],I=w({__name:"SearchIcon",props:{size:{default:24}},setup(e){return(o,t)=>(g(),m("svg",{viewBox:"0 0 24 24",fill:"currentColor",width:e.size,height:e.size},[...t[0]||(t[0]=[p("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"},null,-1)])],8,B))}});export{I as _,A as a,L as c};
//# sourceMappingURL=SearchIcon.vue_vue_type_script_setup_true_lang-BvzwYyad.js.map
