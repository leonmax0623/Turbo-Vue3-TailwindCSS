import{o as e,f as a,j as l,c as t,r,w as s,m as o,p as n,Z as i}from"./vendor.36c281f3.js";function u(t,r){return e(),a("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor"},[l("path",{"fill-rule":"evenodd",d:"M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z","clip-rule":"evenodd"})])}function v(t,r){return e(),a("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor"},[l("path",{"fill-rule":"evenodd",d:"M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z","clip-rule":"evenodd"})])}function c(e,a,l,c=-1){let p,d;const f=t((()=>Object.keys(p))),g=t((()=>Object.keys(p).map((e=>({value:e,label:p[e].label}))))),h=r(!1),m=r(),w=r(),y=t((()=>`${w.value}-${m.value>0?"a":"de"}sc`)),x=t((()=>p[w.value].sort)),C=e=>{m.value=c,e&&(w.value=a)};d=e=>{w.value!==e?(C(),w.value=e):m.value*=-1},p=e;const b=()=>l(((e,a)=>x.value(e,a)*m.value));return C(!0),s(y,b),{active:h,mod:m,criteria:w,key:y,pivot:p,criterias:f,sort:x,reset:C,change:d,comp:(e=[])=>o({setup(){const a=f.value.filter((a=>!e.includes(a))),l=a.length;return()=>n(i,{name:"filter",enterFromClass:"h-0 opacity-0",enterToClass:"h-"+8*l,enterActiveClass:"transition-all ease-out duration-300",leaveFromClass:"h-"+8*l,leaveActiveClass:"transition-all ease-in duration-300",leaveToClass:"h-0 opacity-0"},(()=>[h.value?n("div",{class:"text-gray-600"},a.map((e=>n("div",{key:e,onClick:()=>d(e),class:"py-1 px-4 h-8 border cursor-pointer hover:bg-gray-50 flex justify-between items-center"},[n("span",p[e].label),e===w.value?n(1===m.value?v:u,{class:"w-4 h-4 text-gray-400"}):null])))):null]))}}),criteriaOptions:g,trigger:b}}export{c as o};