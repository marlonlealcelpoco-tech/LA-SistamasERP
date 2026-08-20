export type Category={id:number;name:string};
export type Product={id:number;name:string;categoryId:number|null;category:string|null;salePrice:string|number;unitsPerBox:number};
export type Supplier={id:number;name:string;contact:string|null};
export type Quotation={id:number;productId:number;supplierId:number;productName:string;supplierName:string;priceType:"un"|"cx";value:string|number;unitsPerBox:number;costUnit:number;salePrice:string|number;profit:number;margin:number};
export type AuthUser={id:number;name:string;email:string;active:boolean;roles:string[]};
let token=localStorage.getItem("la_cotacoes_token")||"";
export function setToken(value:string){token=value;localStorage.setItem("la_cotacoes_token",value)}
export function clearToken(){token="";localStorage.removeItem("la_cotacoes_token")}
const DEFAULT_API_URL="https://qutcnisrxwzgebgtogqk.supabase.co/functions/v1/la-cotacoes-api-v2";
export function getApiUrl(){return (localStorage.getItem("la_cotacoes_api_url")||(import.meta.env.VITE_API_URL||DEFAULT_API_URL)).replace(/\/$/,"")}
export function setApiUrl(value:string){localStorage.setItem("la_cotacoes_api_url",value.trim().replace(/\/$/,""))}
async function request<T>(path:string,init:RequestInit={}){const headers=new Headers(init.headers);headers.set("Content-Type","application/json");if(token)headers.set("Authorization",`Bearer ${token}`);const r=await fetch(`${getApiUrl()}${path}`,{...init,headers});const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.message||"Falha na comunicação com o servidor");return body as T}
export async function login(email:string,password:string){const data=await request<{token:string;user:AuthUser}>("/auth/login",{method:"POST",body:JSON.stringify({email,password})});setToken(data.token);return data}
export async function authStatus(){return request<{setupRequired:boolean}>("/auth/status")}
export async function setupAdmin(name:string,email:string,password:string){const data=await request<{token:string;user:AuthUser}>("/auth/setup",{method:"POST",body:JSON.stringify({name,email,password})});setToken(data.token);return data}
export async function bootstrap(){return request<{categories:Category[];products:Product[];suppliers:Supplier[];quotations:Quotation[]}>("/quotations/bootstrap")}
export const api={category:(name:string)=>request<{category:Category}>("/quotations/categories",{method:"POST",body:JSON.stringify({name})}),productCreate:(p:Omit<Product,"id"|"category">)=>request<{product:Product}>("/quotations/products",{method:"POST",body:JSON.stringify(p)}),productUpdate:(id:number,p:Omit<Product,"id"|"category">)=>request<{product:Product}>(`/quotations/products/${id}`,{method:"PUT",body:JSON.stringify(p)}),productDelete:(id:number)=>request(`/quotations/products/${id}`,{method:"DELETE"}),supplierCreate:(s:{name:string;contact:string|null})=>request<{supplier:Supplier}>("/quotations/suppliers",{method:"POST",body:JSON.stringify(s)}),supplierUpdate:(id:number,s:{name:string;contact:string|null})=>request<{supplier:Supplier}>(`/quotations/suppliers/${id}`,{method:"PUT",body:JSON.stringify(s)}),supplierDelete:(id:number)=>request(`/quotations/suppliers/${id}`,{method:"DELETE"}),quotationCreate:(q:{productId:number;supplierId:number;priceType:"un"|"cx";value:number})=>request("/quotations",{method:"POST",body:JSON.stringify(q)}),quotationDelete:(id:number)=>request(`/quotations/${id}`,{method:"DELETE"})};
export const hasToken=()=>Boolean(token);
