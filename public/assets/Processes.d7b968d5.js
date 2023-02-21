var e=Object.defineProperty,a=Object.defineProperties,s=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,l=(a,s,r)=>s in a?e(a,s,{enumerable:!0,configurable:!0,writable:!0,value:r}):a[s]=r;import{V as n,o as i,d as c,e as p,j as m,u,r as d,S as f,c as v,H as j,I as b,ag as y,f as _,J as w,l as g,t as h,P as O,av as k,a1 as $}from"./vendor.36c281f3.js";import{_ as P}from"./Office.55bfbecd.js";import{_ as B}from"./Button.4b020695.js";import{_ as D}from"./Badge.4bd69676.js";import{_ as I}from"./Link.4e9a6f0f.js";import{c as A,s as E}from"./useAvatar.7737e550.js";import{$ as S}from"./drop.cce90c26.js";import{p as x}from"./index.a1f0654c.js";import{b as C,a as M}from"./index.8fc70fb6.js";import{u as V}from"./useModalForm.1c23c14e.js";import{_ as F}from"./Input.b03a61c6.js";import{a as R}from"./why.059bca86.js";import{f as T}from"./process.a2988830.js";import{_ as U}from"./Table.ec42ea9a.js";import{u as q}from"./useSuspense.29183c13.js";import"./headlessui.esm.b519f347.js";import"./Avatar.4eeca634.js";import"./Dropdown.df5c89e3.js";import"./NavBar.2f63176e.js";import"./departments.4f88a00d.js";import"./meta.48f5205a.js";import"./useConfirmDialog.ba73d887.js";import"./Dialog.b36041f9.js";import"./Spinner.2e0ab286.js";import"./FormActions.47218f8a.js";import"./ExclamationCircleIcon.22c0ccb9.js";import"./Th.32cd08d3.js";import"./useIntersectionObserver.7ad3d6a4.js";const z={async setup(e){let a,s;const{options:r,load:t}=R,{process:o,atMounted:l,v$:d}=Y();return[a,s]=n((()=>(async()=>{await t(),await l()})())),a=await a,s(),(e,a)=>{var s;return i(),c("div",null,[p("div",null,[m(F,{label:"Название",modelValue:u(o).name,"onUpdate:modelValue":a[0]||(a[0]=e=>u(o).name=e),required:!0,error:null==(s=u(d).name.$errors[0])?void 0:s.$message,onBlured:u(d).name.$touch},null,8,["modelValue","error","onBlured"])])])}}},H=C(),{addItem:J}=x;let L,N,W;const G=function(e){var a,s;e.includes("_id")?N[e]=null==(a=this[e.replace("_id","")])?void 0:a.id:N[e]=null!=(s=this[e])?s:""},K=async()=>{if(!(await L.value.$validate()))return;L.value.$reset();const{message:e,success:n,data:i}=await E.process_category((c=((e,a)=>{for(var s in a||(a={}))t.call(a,s)&&l(e,s,a[s]);if(r)for(var s of r(a))o.call(a,s)&&l(e,s,a[s]);return e})({},N),p={appeal_reason_id:W.value},a(c,s(p))));var c,p;try{return{message:e,success:n}}finally{n&&(J(i.process_category),H.success(e))}},Q=async()=>{const{id:e}=N;if(null!=e){((e={})=>{Object.keys(N).forEach(G,e)})(await S.process_category(e))}},X=()=>{W=void 0};var Y=e=>{W||null!=e&&(W=d(e));return{render:(...e)=>{const a=f();a.run((()=>{const s=v((()=>!!(null==N?void 0:N.id))),{render:r}=V({title:v((()=>A.modal[s.value?"update":"create"].process_category)),RawForm:z,atSubmit:K,atClose:()=>a.stop(),atOpen:e=>{N=j({id:null!=e?e:"",name:""}),L=b(T(),N,{$lazy:!0})}});r(...e),y((()=>{N=void 0}))}))},process:N,atMounted:Q,v$:L,clearAppealReason:X,appeal_reason_id:W}};const Z={async setup(e){let a,s;const{state:r,drop:t,reset:o,fill:l}=x,{render:c,appeal_reason_id:p}=Y(),d=[{label:"Название",key:"name"},{label:"Количество задач",key:"count_tasks"},{label:"Дата создания",key:"created_at"}],f=async(e=!1)=>{e&&o(),console.log(p.value),await l({appeal_reason_id:p.value})};return[a,s]=n((()=>f(!0))),a=await a,s(),(e,a)=>(i(),_(U,{onBottomTouched:a[0]||(a[0]=()=>f()),fields:d,items:u(r).raw,onDelete:u(t),onEdit:u(c)},{"td-name":w((({value:e,item:{id:a,name:s,appeal_reason:r}})=>[m(I,{href:{name:"Process",params:{id:a,name:s,why:r.id}}},{default:w((()=>[g(h(e),1)])),_:2},1032,["href"])])),"td-count_tasks":w((({value:e})=>[m(D,{point:!0,color:"blue"},{default:w((()=>[g(h(null!=e?e:"(Unknown)")+" задач ",1)])),_:2},1024)])),"td-created_at":w((({value:e})=>{var a;return[g(h(null!=(a=null==e?void 0:e.split(" ")[0])?a:"_"),1)]})),_:1},8,["items","onDelete","onEdit"]))}},ee=g("К причинам обращения "),ae=g("Создать "),se={setup(e){const{params:a}=M(),{render:s,clearAppealReason:r}=Y(a.value.why),t=q(Z);y(r);const o=d();return O((async()=>{o.value=(await S.appeal_reason(a.value.why)).name})),(e,a)=>(i(),_(P,{title:(o.value?`${o.value} /`:"")+" Рабочие процессы"},{actions:w((()=>[m(B,{type:"secondary",link:{name:"Why"}},{default:w((()=>[m(u(k),{class:"w-5 h-5 mr-1"}),ee])),_:1}),m(B,{color:"blue",onClick:a[0]||(a[0]=()=>u(s)())},{default:w((()=>[m(u($),{class:"w-5 h-5 mr-1"}),ae])),_:1})])),default:w((()=>[m(u(t),{loadingMsg:"Получение рабочих процессов..."})])),_:1},8,["title"]))}};export{se as default};