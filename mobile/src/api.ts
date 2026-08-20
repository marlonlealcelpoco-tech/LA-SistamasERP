export type Category={id:number;name:string};
export type Product={id:number;name:string;categoryId:number|null;category:string|null;salePrice:string|number;saleUnit:string;unitsPerBox:number};
export type Supplier={id:number;name:string;contact:string|null};
export type Batch={id:number;name:string;quoteDate:string;createdAt:string};
export type Quotation={id:number;batchId:number;productId:number;supplierId:number;productName:string;supplierName:string;priceType:"un"|"cx";value:string|number;unitsPerBox:number;salePrice:string|number;saleUnit:string;costUnit:number;profit:number;margin:number};
const DEFAULT_API_URL="https://qutcnisrxwzgebgtogqk.supabase.co/functions/v1/la-cotacoes-api-v2";
export function getApiUrl(){return (localStorage.getItem("la_cotacoes_api_url")||(import.meta.env.VITE_API_URL||DEFAULT_API_URL)).replace(/\/$/,"")}
export function setApiUrl(value:string){localStorage.setItem("la_cotacoes_api_url",value.trim().replace(/\/$/,""))}
async function request<T>(path:string,init:RequestInit={}){const headers=new Headers(init.headers);headers.set("Content-Type","application/json");const r=await fetch(`${getApiUrl()}${path}`,{...init,headers});const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.error||body.message||"Falha na comunicação com o servidor");return body as T}
export async function bootstrap(){return request<{categories:Category[];products:Product[];suppliers:Supplier[];batches:Batch[];quotations:Quotation[]}>("/quotations/bootstrap")}
export const api={
 category:(name:string)=>request<{category:Category}>("/quotations/categories",{method:"POST",body:JSON.stringify({name})}),
 productCreate:(p:{name:string;categoryId:number|null;salePrice:number;saleUnit:string;unitsPerBox:number})=>request<{product:Product}>("/quotations/products",{method:"POST",body:JSON.stringify(p)}),
 productUpdate:(id:number,p:{name:string;categoryId:number|null;salePrice:number;saleUnit:string;unitsPerBox:number})=>request<{product:Product}>(`/quotations/products/${id}`,{method:"PUT",body:JSON.stringify(p)}),
 productDelete:(id:number)=>request(`/quotations/products/${id}`,{method:"DELETE"}),
 supplierCreate:(s:{name:string;contact:string|null})=>request<{supplier:Supplier}>("/quotations/suppliers",{method:"POST",body:JSON.stringify(s)}),
 supplierUpdate:(id:number,s:{name:string;contact:string|null})=>request<{supplier:Supplier}>(`/quotations/suppliers/${id}`,{method:"PUT",body:JSON.stringify(s)}),
 supplierDelete:(id:number)=>request(`/quotations/suppliers/${id}`,{method:"DELETE"}),
 batchCreate:(b:{name:string;quoteDate:string})=>request<{batch:Batch}>("/quotations/batches",{method:"POST",body:JSON.stringify(b)}),
 quotationCreate:(q:{batchId:number;productId:number;supplierId:number;priceType:"un"|"cx";value:number})=>request<{quotation:Quotation}>("/quotations",{method:"POST",body:JSON.stringify(q)}),
 quotationDelete:(id:number)=>request(`/quotations/${id}`,{method:"DELETE"})
};
