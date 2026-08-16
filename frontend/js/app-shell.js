const session=JSON.parse(sessionStorage.getItem('la_session')||'null');
const rolePermissions={};
const fallbackModules=['Dashboard','Vendas','Caixa','Estoque','Compras','Cadastros','Financeiro','Relatórios','Configurações'];
const allowed=session?.permissions?.length?session.permissions:fallbackModules;
const items=[...document.querySelectorAll('.menu-item')];
items.forEach(item=>{if(!allowed.includes(item.dataset.module))item.hidden=true});
document.getElementById('userName').textContent=session?.nome||'Usuário';
document.getElementById('userRole').textContent=session?.perfil||'Sessão';
if(session?.nome){document.getElementById('avatar').textContent=session.nome.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
const title=document.getElementById('pageTitle');
items.forEach(item=>item.addEventListener('click',e=>{e.preventDefault();if(item.hidden)return;items.forEach(x=>x.classList.remove('active'));item.classList.add('active');title.textContent=item.querySelector('span').textContent;history.replaceState(null,'','#'+item.dataset.module.toLowerCase());document.querySelector('.sidebar').classList.remove('hidden')}));
document.getElementById('logout').onclick=()=>{sessionStorage.removeItem('la_session');location.href='./login.html'};
document.getElementById('mobileMenu').onclick=()=>document.querySelector('.sidebar').classList.toggle('hidden');
document.getElementById('currentDate').textContent=new Intl.DateTimeFormat('pt-BR',{dateStyle:'full'}).format(new Date());
