import{_ as e}from"./Link.4e9a6f0f.js";import{u as a}from"./useConfirmDialog.ba73d887.js";import{c as s}from"./cars.efc7eb58.js";import{_ as o}from"./Table.ec42ea9a.js";import{o as t,f as r,J as l,e as n,t as i,l as m,j as c,u as d}from"./vendor.36c281f3.js";const u={class:"font-bold"},f={props:{cars:{type:Array,default:[]},showOwner:{type:Boolean,default:!0}},emits:["carDropped"],setup(f,{emit:p}){const b=f,{dropCar:y,moveToEditCarPage:v}=s(),{drop:_}=a(),h=[{label:"Автомобиль",key:"car_model"},{label:"Вин номер",key:"vin"},{label:"Гос. номер",key:"number"}];return b.showOwner&&h.push({label:"Владелец",key:"client"}),(a,s)=>(t(),r(o,{onBottomTouched:s[0]||(s[0]=()=>a.$emit("bottomTouched")),fields:h,items:b.cars,onDelete:s[1]||(s[1]=e=>d(_)((()=>(async e=>{const{success:a,message:s}=await y(e);try{return{success:a,message:s}}finally{a&&p("carDropped",e)}})(e)))),onEdit:d(v)},{"th-client":l((({label:e})=>[n("span",u,i(e),1)])),"td-car_model":l((({value:e})=>[m(i("object"==typeof e?`${e.car_mark.name} ${null==e?void 0:e.name}`:e),1)])),"td-client":l((({value:a})=>[c(e,{href:{name:"EditClient",params:{id:a.id}}},{default:l((()=>[m(i(a.name),1)])),_:2},1032,["href"])])),"td-vin":l((({value:a,item:{id:s}})=>[c(e,{onClick:()=>d(v)(s)},{default:l((()=>[m(i(a),1)])),_:2},1032,["onClick"])])),"td-number":l((({value:e})=>[m(i(e),1)])),_:1},8,["items","onEdit"]))}};export{f as _};