import { useEffect, useMemo, useState } from 'react';

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

const initialEmployees = [
  { id: 1, name: 'Marcos Silva', phone: '(11) 99888-1001', role: 'Gerente', salary: 4200, admissionDate: '2024-01-10', paymentCycle: 'Quinzenal' },
  { id: 2, name: 'Fernanda Costa', phone: '(11) 99777-2202', role: 'Caixa', salary: 2850, admissionDate: '2024-05-20', paymentCycle: 'Semanal' },
  { id: 3, name: 'João Pereira', phone: '(11) 99666-3303', role: 'Vendedor', salary: 3100, admissionDate: '2024-03-12', paymentCycle: 'Quinzenal' },
  { id: 4, name: 'Letícia Almeida', phone: '(11) 99555-4404', role: 'Entrega', salary: 2600, admissionDate: '2024-06-15', paymentCycle: 'Mensal' },
  { id: 5, name: 'Renato Souza', phone: '(11) 99444-5505', role: 'Estoquista', salary: 2950, admissionDate: '2024-02-01', paymentCycle: 'Semanal' },
  { id: 6, name: 'Aline Mendes', phone: '(11) 99333-6606', role: 'Atendente', salary: 2780, admissionDate: '2024-07-08', paymentCycle: 'Mensal' },
];

const payrollSeed = [
  { id: 1, employeeId: 1, employeeName: 'Marcos Silva', period: '2026-10', baseSalary: 4200, advanceAmount: 350, totalDue: 4550, status: 'pago', paidAt: '2026-10-15', note: 'Vale de 350,00 registrado no pagamento.' },
  { id: 2, employeeId: 2, employeeName: 'Fernanda Costa', period: '2026-10', baseSalary: 2850, advanceAmount: 0, totalDue: 2850, status: 'pendente', paidAt: '', note: 'Pagto. em aberto.' },
  { id: 3, employeeId: 3, employeeName: 'João Pereira', period: '2026-10', baseSalary: 3100, advanceAmount: 500, totalDue: 3600, status: 'pendente', paidAt: '', note: 'Adiantamento salarial registrado.' },
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
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '—';
  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('gestao_acougue_token')));
  const [activeModule, setActiveModule] = useState('overview');
  const [loginData, setLoginData] = useState({ email: 'admin@sadm.com', password: 'adm@2026' });
  const [saleMessage, setSaleMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [cart, setCart] = useState([
    { id: 1, name: 'Picanha', price: 89.9, quantity: 1, type: 'kg' },
    { id: 2, name: 'Linguiça', price: 39.5, quantity: 2, type: 'kg' },
  ]);

  const [employees, setEmployees] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_employees');
      return stored ? JSON.parse(stored) : initialEmployees;
    } catch (error) {
      return initialEmployees;
    }
  });

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    phone: '',
    role: '',
    salary: '',
    admissionDate: '',
    paymentCycle: 'Semanal',
  });

  const [payrollData, setPayrollData] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_payroll');
      return stored ? JSON.parse(stored) : payrollSeed;
    } catch (error) {
      return payrollSeed;
    }
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeId: '',
    period: new Date().toISOString().slice(0, 7),
    advanceAmount: '0',
    status: 'pendente',
    note: '',
    paidAt: '',
  });

  const [employeeMessage, setEmployeeMessage] = useState('');
  const [payrollFilterEmployee, setPayrollFilterEmployee] = useState('all');
  const [payrollFilterStatus, setPayrollFilterStatus] = useState('all');
  const [payrollFilterPeriod, setPayrollFilterPeriod] = useState('all');

  useEffect(() => {
    localStorage.setItem('gestao_acougue_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('gestao_acougue_payroll', JSON.stringify(payrollData));
  }, [payrollData]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const employeeSummary = useMemo(() => {
    const totalSalary = employees.reduce((sum, employee) => sum + Number(employee.salary || 0), 0);
    const totalPending = payrollData
      .filter((item) => item.status !== 'pago')
      .reduce((sum, item) => sum + Number(item.totalDue || 0), 0);

    return {
      totalSalary,
      totalPending,
      totalPayed: payrollData
        .filter((item) => item.status === 'pago')
        .reduce((sum, item) => sum + Number(item.totalDue || 0), 0),
    };
  }, [employees, payrollData]);

  const filteredPayroll = useMemo(() => {
    return payrollData.filter((record) => {
      const employeeMatches = payrollFilterEmployee === 'all' || String(record.employeeId) === payrollFilterEmployee;
      const statusMatches = payrollFilterStatus === 'all' || record.status === payrollFilterStatus;
      const periodMatches = payrollFilterPeriod === 'all' || record.period === payrollFilterPeriod;
      return employeeMatches && statusMatches && periodMatches;
    });
  }, [payrollData, payrollFilterEmployee, payrollFilterStatus, payrollFilterPeriod]);

  const uniquePeriods = [...new Set(payrollData.map((entry) => entry.period))];

  const handleLogin = (event) => {
    event.preventDefault();
    if (loginData.email && loginData.password) {
      setIsAuthenticated(true);
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

  const addEmployee = (event) => {
    event.preventDefault();
    setEmployeeMessage('');

    if (employees.length >= 6) {
      setEmployeeMessage('A capacidade máxima é de 6 funcionários cadastrados.');
      return;
    }

    const { name, phone, role, salary, admissionDate, paymentCycle } = employeeForm;
    if (!name || !phone || !role || !salary || !admissionDate) {
      setEmployeeMessage('Preencha nome, telefone, função, salário e data de admissão.');
      return;
    }

    const nextEmployee = {
      id: Date.now(),
      name,
      phone,
      role,
      salary: Number(salary),
      admissionDate,
      paymentCycle,
    };

    setEmployees((current) => [...current, nextEmployee]);
    setEmployeeForm({
      name: '',
      phone: '',
      role: '',
      salary: '',
      admissionDate: '',
      paymentCycle: 'Semanal',
    });
    setEmployeeMessage('Funcionário cadastrado com sucesso.');
  };

  const registerPayrollEntry = (event) => {
    event.preventDefault();

    const employeeId = Number(payrollForm.employeeId);
    if (!employeeId) {
      setEmployeeMessage('Selecione um funcionário para registrar a folha.');
      return;
    }

    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) {
      setEmployeeMessage('Funcionário não encontrado.');
      return;
    }

    const baseSalary = Number(employee.salary || 0);
    const advanceAmount = Number(payrollForm.advanceAmount || 0);
    const entry = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      period: payrollForm.period || new Date().toISOString().slice(0, 7),
      baseSalary,
      advanceAmount,
      totalDue: baseSalary + advanceAmount,
      status: payrollForm.status || 'pendente',
      paidAt: payrollForm.status === 'pago' ? payrollForm.paidAt || new Date().toISOString().slice(0, 10) : '',
      note: payrollForm.note || 'Controle gerencial de pagamento.',
    };

    setPayrollData((current) => [entry, ...current]);
    setPayrollForm({
      employeeId: '',
      period: new Date().toISOString().slice(0, 7),
      advanceAmount: '0',
      status: 'pendente',
      note: '',
      paidAt: '',
    });
    setEmployeeMessage('Registro da folha atualizado com sucesso.');
  };

  const togglePayrollStatus = (id) => {
    setPayrollData((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const isPaid = item.status === 'pago';
        return {
          ...item,
          status: isPaid ? 'pendente' : 'pago',
          paidAt: isPaid ? '' : new Date().toISOString().slice(0, 10),
        };
      })
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-shell">
        <div className="login-card">
          <div className="brand-badge">s.a ADM</div>
          <h1>GESTÃO Açougue</h1>
          <p>Controle comercial, estoque, financeiro e PDV em um único painel.</p>
          <form onSubmit={handleLogin} className="login-form">
            <label>
              E-mail
              <input
                type="email"
                value={loginData.email}
                onChange={(event) => setLoginData({ ...loginData, email: event.target.value })}
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={loginData.password}
                onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
              />
            </label>
            <button type="submit" className="primary-button">Entrar</button>
          </form>
          <small>Login demonstrativo para painel administrativo.</small>
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
      case 'employees':
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Colaboradores</span>
                <h2>Funcionários</h2>
              </div>
              <span className="success-span">Máximo: 6 funcionários</span>
            </div>

            <div className="panel">
              <form onSubmit={addEmployee} className="form-grid">
                <label>
                  Nome
                  <input
                    value={employeeForm.name}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, name: event.target.value })}
                    placeholder="Ex.: Carlos Souza"
                  />
                </label>
                <label>
                  Telefone
                  <input
                    value={employeeForm.phone}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, phone: event.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </label>
                <label>
                  Função
                  <input
                    value={employeeForm.role}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, role: event.target.value })}
                    placeholder="Ex.: Vendedor"
                  />
                </label>
                <label>
                  Salário
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={employeeForm.salary}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, salary: event.target.value })}
                    placeholder="0.00"
                  />
                </label>
                <label>
                  Data de admissão
                  <input
                    type="date"
                    value={employeeForm.admissionDate}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, admissionDate: event.target.value })}
                  />
                </label>
                <label>
                  Pagamento
                  <select
                    value={employeeForm.paymentCycle}
                    onChange={(event) => setEmployeeForm({ ...employeeForm, paymentCycle: event.target.value })}
                  >
                    <option>Semanal</option>
                    <option>Quinzenal</option>
                    <option>Mensal</option>
                  </select>
                </label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary-button">Adicionar funcionário</button>
                </div>
              </form>

              {employeeMessage && <div className="status-message small-status">{employeeMessage}</div>}
            </div>

            <div className="card-grid simple-grid">
              {employees.map((person) => (
                <div className="panel employee-card" key={person.id}>
                  <span className="employee-role">{person.role}</span>
                  <h3>{person.name}</h3>
                  <p>Telefone: {person.phone}</p>
                  <p>Salário: {formatMoney(person.salary)}</p>
                  <p>Pagamento: {person.paymentCycle}</p>
                  <p>Admissão: {formatDate(person.admissionDate)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'payroll':
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Folha</span>
                <h2>Folha de pagamento</h2>
              </div>
              <span className="danger-span">Controle gerencial</span>
            </div>

            <div className="card-grid simple-grid">
              <div className="panel">
                <h3>Despesa total</h3>
                <p><strong>{formatMoney(employeeSummary.totalSalary)}</strong></p>
              </div>
              <div className="panel">
                <h3>Pendentes</h3>
                <p><strong>{formatMoney(employeeSummary.totalPending)}</strong></p>
              </div>
              <div className="panel">
                <h3>Pagos</h3>
                <p><strong>{formatMoney(employeeSummary.totalPayed)}</strong></p>
              </div>
              <div className="panel">
                <h3>Funcionários</h3>
                <p><strong>{employees.length}/6</strong></p>
              </div>
            </div>

            <div className="panel">
              <form onSubmit={registerPayrollEntry} className="form-grid">
                <label>
                  Funcionário
                  <select
                    value={payrollForm.employeeId}
                    onChange={(event) => setPayrollForm({ ...payrollForm, employeeId: event.target.value })}
                  >
                    <option value="">Selecione</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Período
                  <input
                    type="month"
                    value={payrollForm.period}
                    onChange={(event) => setPayrollForm({ ...payrollForm, period: event.target.value })}
                  />
                </label>
                <label>
                  Vale / adiantamento
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={payrollForm.advanceAmount}
                    onChange={(event) => setPayrollForm({ ...payrollForm, advanceAmount: event.target.value })}
                  />
                </label>
                <label>
                  Situação
                  <select
                    value={payrollForm.status}
                    onChange={(event) => setPayrollForm({ ...payrollForm, status: event.target.value })}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                  </select>
                </label>
                <label>
                  Data do pagamento
                  <input
                    type="date"
                    value={payrollForm.paidAt}
                    onChange={(event) => setPayrollForm({ ...payrollForm, paidAt: event.target.value })}
                  />
                </label>
                <label>
                  Observação
                  <input
                    value={payrollForm.note}
                    onChange={(event) => setPayrollForm({ ...payrollForm, note: event.target.value })}
                    placeholder="Motivo ou observação"
                  />
                </label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary-button">Registrar pagamento</button>
                </div>
              </form>
            </div>

            <div className="panel">
              <div className="form-grid" style={{ marginBottom: '14px' }}>
                <label>
                  Funcionário
                  <select value={payrollFilterEmployee} onChange={(event) => setPayrollFilterEmployee(event.target.value)}>
                    <option value="all">Todos</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Situação
                  <select value={payrollFilterStatus} onChange={(event) => setPayrollFilterStatus(event.target.value)}>
                    <option value="all">Todas</option>
                    <option value="pendente">Pendentes</option>
                    <option value="pago">Pagos</option>
                  </select>
                </label>
                <label>
                  Período
                  <select value={payrollFilterPeriod} onChange={(event) => setPayrollFilterPeriod(event.target.value)}>
                    <option value="all">Todos</option>
                    {uniquePeriods.map((period) => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </label>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Funcionário</th>
                    <th>Período</th>
                    <th>Salário</th>
                    <th>Vales</th>
                    <th>Total a pagar</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayroll.map((record) => (
                    <tr key={record.id}>
                      <td>{record.employeeName}</td>
                      <td>{record.period}</td>
                      <td>{formatMoney(record.baseSalary)}</td>
                      <td>{formatMoney(record.advanceAmount)}</td>
                      <td>{formatMoney(record.totalDue)}</td>
                      <td>
                        <span className={record.status === 'pago' ? 'success-span' : 'danger-span'}>
                          {record.status === 'pago' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td>
                        <button className="secondary-button small" onClick={() => togglePayrollStatus(record.id)} type="button">
                          {record.status === 'pago' ? 'Marcar pendente' : 'Marcar pago'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'deliveries':
        return <div className="content-block"><h2>Entregas</h2><div className="panel"><ul className="stack-list"><li>Pedido 1002 • Bairro Centro • Em rota</li><li>Pedido 1004 • Jardim São Paulo • Agendado</li></ul></div></div>;
      case 'payroll':
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Folha</span>
                <h2>Folha de pagamento</h2>
              </div>
              <span className="danger-span">Controle gerencial</span>
            </div>

            <div className="card-grid simple-grid">
              <div className="panel">
                <h3>Despesa total</h3>
                <p><strong>{formatMoney(employeeSummary.totalSalary)}</strong></p>
              </div>
              <div className="panel">
                <h3>Pendentes</h3>
                <p><strong>{formatMoney(employeeSummary.totalPending)}</strong></p>
              </div>
              <div className="panel">
                <h3>Pagos</h3>
                <p><strong>{formatMoney(employeeSummary.totalPayed)}</strong></p>
              </div>
              <div className="panel">
                <h3>Funcionários</h3>
                <p><strong>{employees.length}/6</strong></p>
              </div>
            </div>

            <div className="panel">
              <form onSubmit={registerPayrollEntry} className="form-grid">
                <label>
                  Funcionário
                  <select
                    value={payrollForm.employeeId}
                    onChange={(event) => setPayrollForm({ ...payrollForm, employeeId: event.target.value })}
                  >
                    <option value="">Selecione</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Período
                  <input
                    type="month"
                    value={payrollForm.period}
                    onChange={(event) => setPayrollForm({ ...payrollForm, period: event.target.value })}
                  />
                </label>
                <label>
                  Vale / adiantamento
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={payrollForm.advanceAmount}
                    onChange={(event) => setPayrollForm({ ...payrollForm, advanceAmount: event.target.value })}
                  />
                </label>
                <label>
                  Situação
                  <select
                    value={payrollForm.status}
                    onChange={(event) => setPayrollForm({ ...payrollForm, status: event.target.value })}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                  </select>
                </label>
                <label>
                  Data do pagamento
                  <input
                    type="date"
                    value={payrollForm.paidAt}
                    onChange={(event) => setPayrollForm({ ...payrollForm, paidAt: event.target.value })}
                  />
                </label>
                <label>
                  Observação
                  <input
                    value={payrollForm.note}
                    onChange={(event) => setPayrollForm({ ...payrollForm, note: event.target.value })}
                    placeholder="Motivo ou observação"
                  />
                </label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary-button">Registrar pagamento</button>
                </div>
              </form>
            </div>

            <div className="panel">
              <div className="form-grid" style={{ marginBottom: '14px' }}>
                <label>
                  Funcionário
                  <select value={payrollFilterEmployee} onChange={(event) => setPayrollFilterEmployee(event.target.value)}>
                    <option value="all">Todos</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Situação
                  <select value={payrollFilterStatus} onChange={(event) => setPayrollFilterStatus(event.target.value)}>
                    <option value="all">Todas</option>
                    <option value="pendente">Pendentes</option>
                    <option value="pago">Pagos</option>
                  </select>
                </label>
                <label>
                  Período
                  <select value={payrollFilterPeriod} onChange={(event) => setPayrollFilterPeriod(event.target.value)}>
                    <option value="all">Todos</option>
                    {uniquePeriods.map((period) => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </label>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Funcionário</th>
                    <th>Período</th>
                    <th>Salário</th>
                    <th>Vales</th>
                    <th>Total a pagar</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayroll.map((record) => (
                    <tr key={record.id}>
                      <td>{record.employeeName}</td>
                      <td>{record.period}</td>
                      <td>{formatMoney(record.baseSalary)}</td>
                      <td>{formatMoney(record.advanceAmount)}</td>
                      <td>{formatMoney(record.totalDue)}</td>
                      <td>
                        <span className={record.status === 'pago' ? 'success-span' : 'danger-span'}>
                          {record.status === 'pago' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td>
                        <button className="secondary-button small" onClick={() => togglePayrollStatus(record.id)} type="button">
                          {record.status === 'pago' ? 'Marcar pendente' : 'Marcar pago'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'suppliers':
        return <div className="content-block"><h2>Fornecedores</h2><div className="panel"><ul className="stack-list"><li>Frigorífico Norte • Carnes e cortes</li><li>Distribuidora Campo Verde • Produtos secos</li></ul></div></div>;
      case 'purchases':
        return <div className="content-block"><h2>Compras</h2><div className="panel"><ul className="stack-list"><li>Compra de 80 kg de contra filé – R$ 3.960,00</li><li>Compra de 15 caixas de conservas – R$ 640,00</li></ul></div></div>;
      case 'cash':
        return <div className="content-block"><h2>Caixa</h2><div className="card-grid simple-grid">{cashFlow.map((item) => <div className="panel" key={item.label}><span className={item.type === 'entrada' ? 'success-span' : 'danger-span'}>{item.type === 'entrada' ? 'Entrada' : 'Saída'}</span><h3>{item.label}</h3><strong>{formatMoney(item.value)}</strong></div>)}</div></div>;
      case 'sales':
        return <div className="content-block"><h2>Vendas</h2><div className="panel"><table><thead><tr><th>Cliente</th><th>Valor</th><th>Pagamento</th><th>Vendedor</th></tr></thead><tbody>{sales.map((sale) => <tr key={`${sale.client}-${sale.date}`}><td>{sale.client}</td><td>{formatMoney(sale.total)}</td><td>{sale.payment}</td><td>{sale.employee}</td></tr>)}</tbody></table></div></div>;
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
        return <div className="content-block"><h2>Integrações</h2><div className="card-grid simple-grid"><div className="panel"><h3>Filizola</h3><p>Pronto para integração futura via etiqueta e pedido online.</p></div><div className="panel"><h3>API de pedidos</h3><p>Lista de pedidos em fila para receber e registrar no caixa.</p></div></div></div>;
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
            <button className="primary-button" onClick={() => setIsAuthenticated(false)}>Sair</button>
          </div>
        </header>

        {renderModule()}
      </main>
    </div>
  );
}

export default App;
