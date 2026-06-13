import{c as a,r as x,af as f,j as s,d as p}from"./main-BRkvpGQx.js";import{a as y,b as g,c as m,d as z}from"./tooltip-CydHbyKN.js";import{z as u}from"./index-DE3jboEo.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]],k=a("brain",b);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],v=a("eye",j);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}]],M=a("file",w);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]],N=a("wrench",S);function C(e){const[i,o]=x.useState(void 0);return f(()=>{if(e){o({width:e.offsetWidth,height:e.offsetHeight});const t=new ResizeObserver(r=>{if(!Array.isArray(r)||!r.length)return;const h=r[0];let n,c;if("borderBoxSize"in h){const d=h.borderBoxSize,l=Array.isArray(d)?d[0]:d;n=l.inlineSize,c=l.blockSize}else n=e.offsetWidth,c=e.offsetHeight;o({width:n,height:c})});return t.observe(e,{box:"border-box"}),()=>t.unobserve(e)}else o(void 0)},[e]),i}function T({capabilities:e,className:i}){if(!e||e.length===0)return null;const o=[...e].sort((t,r)=>t.localeCompare(r));return s.jsx("div",{className:p("flex items-center gap-1",i),children:o.map(t=>s.jsxs(y,{children:[s.jsx(g,{children:s.jsx("div",{className:p("text-[10px] font-medium text-primary p-1 rounded-lg z-1",u(t).with("reasoning",()=>"bg-pink-400/10").with("vision",()=>"bg-blue-400/10").with("documents",()=>"bg-yellow-400/10").with("tools",()=>"bg-green-400/10").exhaustive()),children:u(t).with("reasoning",()=>s.jsx(k,{className:"size-3.5 text-pink-400"})).with("vision",()=>s.jsx(v,{className:"size-3.5 text-blue-400"})).with("documents",()=>s.jsx(M,{className:"size-3.5 text-yellow-400"})).with("tools",()=>s.jsx(N,{className:"size-3.5 text-green-400"})).exhaustive()})}),s.jsx(m,{children:s.jsx(z,{children:t.charAt(0).toUpperCase()+t.slice(1)})})]},t))})}function E(e){return((e??0)/1e6).toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:2})}export{T as C,E as f,C as u};
