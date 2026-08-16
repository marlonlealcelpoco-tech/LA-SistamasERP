import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell, ChevronDown, CircleDollarSign, ClipboardList, Home, Package,
  PanelLeftClose, Search, Settings, ShoppingCart, Truck, Users, Warehouse
} from 'lucide-react';
import './styles.css';

const menu = [
  { label: 'Visão geral', icon: Home, active: true },
  { label: 'Vendas', icon: ShoppingCart },
  { label: 'Compras', icon: ClipboardList },
  { label: 'Estoque', icon: Warehouse },
  { label: 'Produtos', icon: Package },
  { label: 'Clientes', icon: Users },
  { label: 'Fornecedores', icon: Truck },
  { label: 'Financeiro', icon: CircleDollarSign },
];

function Logo({ watermark = false }) {
  return (
    <div className={watermark ? 'logo watermark' : 'logo'} aria-label="LA-Sistemas">
      <span className="logo-mark"><i>L</i><i>A</i></span>
      <span className="logo-name">LA-SISTEMAS</span>
    </div>
  );
}

function Card({ title, value, detail, icon: Icon }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <span className="metric-icon"><Icon size={19} /></span>
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-area"><Logo /></div>
        <div className="company-chip">
          <div className="company-avatar">LA</div>
          <div><b>Minha empresa</b><small>Ambiente ERP</small></div>
          <ChevronDown size={16} />
        </div>
        <nav>
          <span className="section-label">MENU PRINCIPAL</span>
          {menu.map(({ label, icon: Icon, active }) => (
            <button className={active ? 'nav-item active' : 'nav-item'} key={label}>
              <Icon size={18} /> <span>{label}</span>
            </button>
          ))}
          <span className="section-label">CONFIGURAÇÕES</span>
          <button className="nav-item"><Settings size={18} /><span>Configurações</span></button>
        </nav>
        <div className="sidebar-footer">LA-Sistemas ERP <span>v0.1</span></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="top-left"><button className="icon-button"><PanelLeftClose size={19} /></button><div className="breadcrumb">Início <b>/</b> Visão geral</div></div>
          <div className="top-actions">
            <div className="search"><Search size={17} /><input placeholder="Pesquisar no sistema..." /></div>
            <button className="icon-button notification"><Bell size={19} /><em>3</em></button>
            <div className="user-menu"><div className="user-avatar">MR</div><div><b>Administrador</b><small>Acesso completo</small></div><ChevronDown size={16} /></div>
          </div>
        </header>

        <section className="page">
          <div className="watermark-wrap"><Logo watermark /></div>
          <div className="page-heading">
            <div><p className="eyebrow">LA-SISTEMAS ERP</p><h1>Visão geral</h1><p>Bem-vindo ao seu ambiente de gestão.</p></div>
            <button className="primary-button">+ Novo lançamento</button>
          </div>

          <div className="metrics">
            <Card title="Vendas do mês" value="R$ 48.650,00" detail="↑ 12,4% em relação ao mês anterior" icon={CircleDollarSign} />
            <Card title="Pedidos" value="186" detail="↑ 8,2% novos pedidos" icon={ShoppingCart} />
            <Card title="Produtos em estoque" value="1.248" detail="32 itens abaixo do mínimo" icon={Package} />
            <Card title="Clientes ativos" value="524" detail="18 novos este mês" icon={Users} />
          </div>

          <div className="content-grid">
            <section className="panel large-panel">
              <div className="panel-heading"><div><h2>Movimentação de vendas</h2><p>Desempenho dos últimos 7 dias</p></div><button className="period">Últimos 7 dias <ChevronDown size={15} /></button></div>
              <div className="chart">
                {[32, 48, 41, 64, 55, 78, 69].map((height, i) => <div className="bar-group" key={i}><div className="bar" style={{height: `${height}%`}}></div><small>{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i]}</small></div>)}
              </div>
            </section>
            <section className="panel">
              <div className="panel-heading"><div><h2>Resumo financeiro</h2><p>Competência atual</p></div></div>
              <div className="finance-list"><div><span>Receitas</span><b>R$ 58.420,00</b></div><div><span>Despesas</span><b>R$ 31.870,00</b></div><div className="total"><span>Resultado</span><b>R$ 26.550,00</b></div></div>
              <div className="progress"><span style={{width:'72%'}}></span></div><small className="muted">72% da meta mensal alcançada</small>
            </section>
          </div>

          <section className="panel table-panel">
            <div className="panel-heading"><div><h2>Últimos pedidos</h2><p>Acompanhe as movimentações recentes</p></div><button className="text-button">Ver todos →</button></div>
            <div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Valor</th><th>Status</th></tr></thead><tbody>
              {[['#000186','Comercial Alfa','15/08/2026','R$ 2.480,00','Concluído'],['#000185','Transportes Rio','15/08/2026','R$ 1.920,00','Em andamento'],['#000184','Auto Peças Brasil','14/08/2026','R$ 780,00','Concluído'],['#000183','Mecânica União','14/08/2026','R$ 3.150,00','Pendente']].map(r => <tr key={r[0]}>{r.slice(0,4).map((v,i)=><td key={i}>{v}</td>)}<td><span className={`status ${r[4].toLowerCase().replace(' ','-')}`}>{r[4]}</span></td></tr>)}
            </tbody></table></div>
          </section>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
