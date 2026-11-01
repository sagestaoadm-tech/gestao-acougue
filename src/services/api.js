import { useMemo, useState } from 'react';
import { apiLogin, apiRegister } from './services/api';

const modules = [
  { id: 'overview', label: 'Visão geral', icon: '📊' },
  { id: 'pdv', label: 'Ponto de venda', icon: '🧾' },
  { id: 'products', label: 'Produtos e estoque', icon: '🥩' },
  { id: 'clients', label: 'Clientes', icon: '👥' },
  { id: 'deliveries', label: 'Entregas', icon: '🚚' },
  { id: 'employees', label: 'Funcionários', icon: '🧑‍💼' },
  { id: 'payroll', label: 'Folha de pagamento', icon: '💸' },
  { id: 'suppliers', label: 'Fornecedores', icon: '🏭' },
  { id: 'purchases', label: 'Compras', icon: '🛒' },
  { id: 'cash', label: 'Caixa', icon: '💰' },
  { id: 'sales', label: 'Vendas', icon: '📈' },
  { id: 'finance', label: 'Visão financeira', icon: '🏦' },
  { id: 'expenses', label: 'Despesas', icon: '🧾' },
  { id: 'payables', label: 'Contas a pagar', icon: '📄' },
  { id: 'reports', label: 'Relatórios', icon: '📊' },
  { id: 'profitability', label: 'Lucratividade', icon: '📉' },
  { id: 'integrations', label: 'Integrações', icon: '🔗' },
  { id: 'company', label: 'Configurações', icon: '⚙️' },
  { id: 'receivables', label: 'Contas a receber', icon: '💳' },
];

const products = [
  { id: 1, name: 'Picanha', sku: 'A-001', stock: 42, unit: 'kg', cost: 62.5, sale: 89.9, margin: 30 },
  { id: 2, name: 'Contra Filé', sku: 'A-002', stock: 51, unit: 'kg', cost: 49.9, sale: 72.9, margin: 31 },
  { id: 3, name: 'Costela', sku: 'A-003', stock: 18, unit: 'kg', cost: 31.5, sale: 47.8, margin: 34 },
  { id: 4, name: 'Frango inteiro', sku: 'A-004', stock: 30, unit: 'un', cost: 17.4, sale: 24.9, margin: 30 },
  { id: 5, name: 'Linguiça', sku: 'A-005', stock: 64, unit: 'kg', cost: 22.9, sale: 39.5, margin: 42 },
];

const employees = [
  { id: 1, name: 'Marcos Silva', role: 'Gerente', salary: 4200, payment: 'Quinzenal' },
  { id: 2, name: 'Fernanda Costa', role: 'Caixa', salary: 2850, payment: 'Semanal' },
  { id: 3, name: 'João Pereira', role: 'Vendedor', salary: 3100, payment: 'Quinzenal' },
  { id: 4, name: 'Letícia Almeida', role: 'Entrega', salary: 2600, payment: 'Mensal' },
  { id: 5, name: 'Renato Souza', role: 'Estoquista', salary: 2950, payment: 'Semanal' },
  { id: 6, name: 'Aline Mendes', role: 'Atendente', salary: 2780, payment: 'Mensal' },
];

const sales = [
  { client: 'João M.', total: 348.9, payment: 'PIX', employee: 'Fernanda', date: '09/11/2026' },
  { client: 'Ana L.', total: 298.2, payment: 'Dinheiro', employee: 'Marcos', date: '09/11/2026' },
  { client: 'Carlos G.', total: 512.6, payment: 'Cartão de crédito', employee: 'João', date: '08/11/2026' },
  { client: 'Maria P.', total: 246.4, payment: 'Débito', employee: 'Aline', date: '08/11/2026' },
];

const cashFlow = [
  { label: 'Abertura de caixa', value: 1200, type: 'entrada' },
  { label: 'Sangria', value: 250, type: 'saida' },
  { label: 'Suprimento', value: 800, type: 'entrada' },
  { label: 'Despesas', value: 640, type: 'saida' },
];

const recentActivities = [
  'Recebimento de compra de 25 kg de picanha',
  'Venda de 15 kg em caixa com PIX',
  'Entrada de 8 clientes na fila de entrega',
  'Reajuste do preço da costela em 4%',
];

const dashboardCards = [
  { title: 'Faturamento hoje', value: 'R$ 18.480,00', accent: 'green' },
  { title: 'Pedidos ativos', value: '14', accent: 'blue' },
  { title: 'Estoque crítico', value: '3 itens', accent: 'amber' },
  { title: 'Lucro bruto', value: 'R$ 5.240,00', accent: 'purple' },
];

const formatMoney = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('gestao_acougue_token')));
  const [activeModule, setActiveModule] = useState('overview');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [formMode, setFormMode] = useState('login');
  const [statusMessage, setStatusMessage] = useState('');
  const [saleMessage, setSaleMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [cart, setCart] = useState([
    { id: 1, name: 'Picanha', price: 89.9, quantity: 1, type: 'kg' },
    { id: 2, name: 'Linguiça', price: 39.5, quantity: 2, type: 'kg' },
  ]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');

    try {
      if (formMode === 'register') {
        await apiRegister({
          companyName: 'Empresa Demo',
          name: loginData.name || 'Administrador',
          email: loginData.email,
          password: loginData.password,
        });
        setStatusMessage('Empresa criada com sucesso. Faça login para continuar.');
        setFormMode('login');
        return;
      }

      const response = await apiLogin(loginData);
      localStorage.setItem('gestao_acougue_token', response.token);
      setIsAuthenticated(true);
      setStatusMessage('Login realizado com sucesso.');
    } catch (error) {
      setStatusMessage(error.message || 'Não foi possível concluir a autenticação.');
    }
  };

  const handleAddToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { id: product.id, name: product.name, price: product.sale, quantity: 1, type: product.unit }];
    });
  };

  const handleQtyChange = (id, value) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, Number(value) || 1) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const finishSale = () => {
    setSaleMessage(`Venda finalizada com ${paymentMethod}. Total: ${formatMoney(total)}`);
    setCart([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('gestao_acougue_token');
    setIsAuthenticated(false);
    setStatusMessage('Sessão encerrada.');
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-shell">
        <div className="login-card">
          <div className="brand-badge">s.a ADM</div>
          <h1>GESTÃO Açougue</h1>
          <p>Controle comercial, estoque, financeiro e PDV em um único painel.</p>

          <div className="auth-toggle">
            <button
              className={formMode === 'login' ? 'toggle-button active' : 'toggle-button'}
              onClick={() => setFormMode('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={formMode === 'register' ? 'toggle-button active' : 'toggle-button'}
              onClick={() => setFormMode('register')}
              type="button"
            >
              Registrar empresa
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="login-form">
            {formMode === 'register' && (
              <label>
                Nome do responsável
                <input
                  type="text"
                  value={loginData.name || ''}
                  onChange={(event) => setLoginData({ ...loginData, name: event.target.value })}
                  placeholder="Ex.: João da Silva"
                />
              </label>
            )}
            <label>
              E-mail
              <input
                type="email"
                value={loginData.email}
                onChange={(event) => setLoginData({ ...loginData, email: event.target.value })}
                placeholder="admin@empresa.com"
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={loginData.password}
                onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                placeholder="Digite sua senha"
                required
              />
            </label>
            <button type="submit" className="primary-button">
              {formMode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          {statusMessage && <div className="status-message">{statusMessage}</div>}
          <small>
            {formMode === 'login'
              ? 'Autenticação via API PostgreSQL e JWT.'
              : 'Crie a empresa e o primeiro usuário administrador.'}
          </small>
        </div>
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'overview':
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Painel</span>
                <h2>Visão geral</h2>
              </div>
              <button className="primary-button small">Exportar relatório</button>
            </div>

            <div className="stats-grid">
              {dashboardCards.map((card) => (
                <div key={card.title} className={`stat-card ${card.accent}`}>
                  <span>{card.title}</span>
                  <strong>{card.value}</strong>
                </div>
              ))}
            </div>

            <div className="two-column">
              <section className="panel">
                <h3>Últimas movimentações</h3>
                <ul className="activity-list">
                  {recentActivities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="panel">
                <h3>Resumo financeiro</h3>
                <div className="mini-stat">
                  <span>Entradas</span>
                  <strong>R$ 22.840,00</strong>
                </div>
                <div className="mini-stat">
                  <span>Saídas</span>
                  <strong>R$ 9.360,00</strong>
                </div>
                <div className="mini-stat">
                  <span>Saldo</span>
                  <strong>R$ 13.480,00</strong>
                </div>
              </section>
            </div>
          </div>
        );
      case 'pdv':
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Operação</span>
                <h2>Ponto de venda</h2>
              </div>
            </div>

            <div className="pdv-layout">
              <section className="panel pdv-panel">
                <div className="search-row">
                  <input type="text" placeholder="Buscar produto por nome ou código" />
                  <button className="primary-button small">Buscar</button>
                </div>

                <div className="product-list">
                  {products.map((product) => (
                    <div key={product.id} className="product-item">
                      <div>
                        <strong>{product.name}</strong>
                        <small>
                          {product.sku} • {product.stock} {product.unit} em estoque
                        </small>
                      </div>
                      <div className="product-actions">
                        <span>{formatMoney(product.sale)}</span>
                        <button className="secondary-button small" onClick={() => handleAddToCart(product)}>Adicionar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="panel cart-panel">
                <h3>Carrinho</h3>
                {cart.length === 0 ? (
                  <p className="empty-state">Nenhum item no carrinho.</p>
                ) : (
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.type} • {formatMoney(item.price)}</small>
                        </div>
                        <div className="cart-item-controls">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(event) => handleQtyChange(item.id, event.target.value)}
                          />
                          <button className="ghost-button" onClick={() => removeItem(item.id)}>Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="payment-methods">
                  {['PIX', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito'].map((method) => (
                    <button
                      key={method}
                      className={paymentMethod === method ? 'payment-button active' : 'payment-button'}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <div className="total-box">
                  <span>Subtotal</span>
                  <strong>{formatMoney(total)}</strong>
                </div>
                <div className="discount-box">
                  <span>Desconto autorizado</span>
                  <input type="number" defaultValue={0} />
                </div>

                <button className="primary-button full" onClick={finishSale}>Finalizar venda</button>
                <button className="secondary-button full">Cancelar venda</button>
                {saleMessage && <div className="sale-message">{saleMessage}</div>}
              </aside>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Cadastro</span>
                <h2>Produtos e estoque</h2>
              </div>
              <button className="primary-button small">Novo produto</button>
            </div>
            <div className="panel">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Código</th>
                    <th>Estoque</th>
                    <th>Custo/kg</th>
                    <th>Venda/kg</th>
                    <th>Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.stock} {product.unit}</td>
                      <td>{formatMoney(product.cost)}</td>
                      <td>{formatMoney(product.sale)}</td>
                      <td>{product.margin}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'clients':
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Clientes</span>
                <h2>Cadastro de clientes</h2>
              </div>
              <button className="primary-button small">Adicionar cliente</button>
            </div>
            <div className="panel">
              <ul className="stack-list">
                <li><strong>Maria Oliveira</strong> • WhatsApp • 18 pedidos</li>
                <li><strong>Rafaela Costa</strong> • Entrega agendada • 9 pedidos</li>
                <li><strong>Pedro Almeida</strong> • Fiado • 3 pendências</li>
              </ul>
            </div>
          </div>
        );
      case 'deliveries':
        return <div className="content-block"><h2>Entregas</h2><div className="panel"><ul className="stack-list"><li>Pedido 1002 • Bairro Centro • Em rota</li><li>Pedido 1004 • Jardim São Paulo • Agendado</li></ul></div></div>;
      case 'employees':
        return (
          <div className="content-block">
            <div className="section-heading"><div><span className="eyebrow">Colaboradores</span><h2>Funcionários</h2></div><button className="primary-button small">Novo funcionário</button></div>
            <div className="card-grid simple-grid">
              {employees.map((person) => (
                <div className="panel employee-card" key={person.id}>
                  <span className="employee-role">{person.role}</span>
                  <h3>{person.name}</h3>
                  <p>Salário: {formatMoney(person.salary)}</p>
                  <p>Pagamento: {person.payment}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'payroll':
        return <div className="content-block"><h2>Folha de pagamento</h2><div className="panel"><table><thead><tr><th>Funcionário</th><th>Período</th><th>Bruto</th><th>Liquido</th></tr></thead><tbody><tr><td>Marcos Silva</td><td>09/11</td><td>R$ 4.200</td><td>R$ 3.870</td></tr></tbody></table></div></div>;
      case 'suppliers':
        return <div className="content-block"><h2>Fornecedores</h2><div className="panel"><ul className="stack-list"><li>Frigorífico Norte • Carnes e cortes</li><li>Distribuidora Campo Verde • Produtos secos</li></ul></div></div>;
      case 'purchases':
        return <div className="content-block"><h2>Compras</h2><div className="panel"><ul className="stack-list"><li>Compra de 80 kg de contra filé – R$ 3.960,00</li><li>Compra de 15 caixas de conservas – R$ 640,00</li></ul></div></div>;
      case 'cash':
        return <div className="content-block"><h2>Caixa</h2><div className="card-grid simple-grid">{cashFlow.map((item) => <div className="panel" key={item.label}><span className={item.type === 'entrada' ? 'success-span' : 'danger-span'}>{item.type === 'entrada' ? 'Entrada' : 'Saída'}</span><h3>{item.label}</h3><strong>{formatMoney(item.value)}</strong></div>)}</div></div>;
      case 'sales':
        return <div className="content-block"><h2>Vendas</h2><div className="panel"><table><thead><tr><th>Cliente</th><th>Valor</th><th>Pagamento</th><th>Vendedor</th></tr></thead><tbody>{sales.map((sale) => <tr key={sale.client + sale.date}><td>{sale.client}</td><td>{formatMoney(sale.total)}</td><td>{sale.payment}</td><td>{sale.employee}</td></tr>)}</tbody></table></div></div>;
      case 'finance':
        return <div className="content-block"><h2>Visão financeira</h2><div className="panel"><div className="mini-stat"><span>Fluxo de caixa</span><strong>R$ 13.480,00</strong></div><div className="mini-stat"><span>Contas a receber</span><strong>R$ 4.960,00</strong></div><div className="mini-stat"><span>Contas a pagar</span><strong>R$ 2.300,00</strong></div></div></div>;
      case 'expenses':
        return <div className="content-block"><h2>Despesas</h2><div className="panel"><ul className="stack-list"><li>Energia elétrica – R$ 480,00</li><li>Internet – R$ 180,00</li><li>Frete de entrega – R$ 310,00</li></ul></div></div>;
      case 'payables':
        return <div className="content-block"><h2>Contas a pagar</h2><div className="panel"><ul className="stack-list"><li>Fornecedor do frigorífico • vence em 2 dias • R$ 1.960,00</li><li>Cartão de crédito • vence em 6 dias • R$ 640,00</li></ul></div></div>;
      case 'reports':
        return <div className="content-block"><h2>Relatórios</h2><div className="card-grid simple-grid"><div className="panel"><h3>Diário</h3><p>R$ 4.360,00</p></div><div className="panel"><h3>Semanal</h3><p>R$ 18.460,00</p></div><div className="panel"><h3>Mensal</h3><p>R$ 72.340,00</p></div></div></div>;
      case 'profitability':
        return <div className="content-block"><h2>Lucratividade</h2><div className="panel"><table><thead><tr><th>Produto</th><th>Margem</th><th>Lucro</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.margin}%</td><td>{formatMoney(product.sale * product.stock * (product.margin / 100))}</td></tr>)}</tbody></table></div></div>;
      case 'integrations':
        return <div className="content-block"><h2>Integrações</h2><div className="card-grid simple-grid"><div className="panel"><h3>Filizola</h3><p>Pronto para integração futura via etiqueta e leitura digital. Necessário validar protocolo e drivers reais.</p></div><div className="panel"><h3>API de pedidos online</h3><p>Lista de pedidos em fila para receber do e-commerce corporativo.</p></div></div></div>;
      case 'company':
        return <div className="content-block"><h2>Configurações da empresa</h2><div className="panel form-grid"><label>Nome da empresa<input value="Açougue S.A. ADM" /></label><label>CNPJ<input value="12.345.678/0001-90" /></label><label>Endereço<input value="Rua das Flores, 128" /></label><label>Telefone<input value="(11) 3333-7777" /></label></div></div>;
      case 'receivables':
        return <div className="content-block"><h2>Contas a receber</h2><div className="panel"><ul className="stack-list"><li>Cliente: João M. • R$ 640,00 • vencer em 2 dias</li><li>Cliente: Maria P. • R$ 480,00 • vencida</li></ul></div></div>;
      default:
        return <div className="content-block"><h2>Selecione um módulo</h2></div>;
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-logo">s.a</div>
          <div>
            <strong>s.a ADM</strong>
            <span>GESTÃO Açougue</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {modules.map((module) => (
            <button
              key={module.id}
              className={activeModule === module.id ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveModule(module.id)}
            >
              <span>{module.icon}</span>
              {module.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <span className="eyebrow">Empresa</span>
            <h1>Açougue S.A. ADM</h1>
          </div>
          <div className="top-actions">
            <button className="secondary-button">Notificações</button>
            <button className="primary-button" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        {renderModule()}
      </main>
    </div>
  );
}

export default App;
