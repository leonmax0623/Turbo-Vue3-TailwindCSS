import{V as a,o as r,f as e,u as s,S as t,c as o,H as n,I as m,ag as c}from"./vendor.36c281f3.js";import{c as u,s as d}from"./useAvatar.7737e550.js";import{$ as i}from"./drop.cce90c26.js";import{b as l}from"./index.8fc70fb6.js";import{s as p}from"./marks.50b903c7.js";import{u as f}from"./useModalForm.1c23c14e.js";import{_ as v}from"./Input.b03a61c6.js";import{c as k}from"./carModel.5c695b93.js";const j={async setup(t){let o,n;const{mark:m,atMountedCarMarksForm:c,v$:u}=_();return[o,n]=a((()=>c())),o=await o,n(),(a,t)=>{var o;return r(),e(v,{label:"Название маркa автомобиля",modelValue:s(m).name,"onUpdate:modelValue":t[0]||(t[0]=a=>s(m).name=a),required:!0,error:null==(o=s(u).name.$errors[0])?void 0:o.$message,onBlured:s(u).name.$touch},null,8,["modelValue","error","onBlured"])}}},{add:$}=p,b=l();let y,w;const M=async()=>{const{id:a}=y;if(a){((a={})=>{y.id=a.id,y.name=a.name})(await i.car_mark(a))}};function _(a,r){return{render:(...e)=>{const s=t();s.run((()=>{const t=o((()=>!!y.id)),{render:i}=f({title:o((()=>u.modal[t.value?"update":"create"].car_mark)),RawForm:j,mount_point:a,atSubmit:async()=>{const{data:a}=await(async()=>{if(!(await w.value.$validate()))return;w.value.$reset();const{message:a,success:r,data:e}=await d.car_mark(y);try{return{message:a,success:r,data:e}}finally{r&&($(e.car_mark),b.success(a))}})();return r&&r(a),a},atClose:()=>s.stop(),atOpen:a=>{y=n({id:null!=a?a:"",name:""}),w=m(k(),y,{$lazy:!0})}});i(...e),c((()=>{y=void 0,w=void 0}))}))},mark:y,atMountedCarMarksForm:M,v$:w}}export{_ as s};