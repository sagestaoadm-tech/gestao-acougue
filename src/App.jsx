import { useMemo, useState, useEffect } from 'react';

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

const initialProducts = [
  { id: 1, name: 'Picanha', sku: 'A-001', stock: 42, unit: 'kg', costPerKg: 62.5, salePricePerKg: 89.9, minimumStock: 15, costHistory: [{ date: '2026-10-01', costPerKg: 62.5 }] },
  { id: 2, name: 'Contra Filé', sku: 'A-002', stock: 51, unit: 'kg', costPerKg: 49.9, salePricePerKg: 72.9, minimumStock: 18, costHistory: [{ date: '2026-10-01', costPerKg: 49.9 }] },
  { id: 3, name: 'Costela', sku: 'A-003', stock: 18, unit: 'kg', costPerKg: 31.5, salePricePerKg: 47.8, minimumStock: 12, costHistory: [{ date: '2026-10-01', costPerKg: 31.5 }] },
  { id: 4, name: 'Frango inteiro', sku: 'A-004', stock: 30, unit: 'un', costPerKg: 17.4, salePricePerKg: 24.9, minimumStock: 10, costHistory: [{ date: '2026-10-01', costPerKg: 17.4 }] },
  { id: 5, name: 'Linguiça', sku: 'A-005', stock: 64, unit: 'kg', costPerKg: 22.9, salePricePerKg: 39.5, minimumStock: 20, costHistory: [{ date: '2026-10-01', costPerKg: 22.9 }] },
];

const initialSuppliers = [
  { id: 1, name: 'Frigorífico Norte', phone: '(11) 3322-0101', cnpj: '12.345.678/0001-99', category: 'Carnes', address: 'Rua da Carne, 120' },
  { id: 2, name: 'Distribuidora Campo Verde', phone: '(11) 3322-0202', cnpj: '98.765.432/0001-88', category: 'Mercadorias', address: 'Avenida do Pescado, 45' },
];

const initialPurchases = [
  {
    id: 1,
    supplierId: 1,
    supplierName: 'Frigorífico Norte',
    purchaseDate: '2026-11-01',
    paymentType: 'prazo',
    total: 1760,
    status: 'recebido',
    items: [{ productId: 1, productName: 'Picanha', quantity: 10, weight: 10, costPerKg: 62.5, total: 625 }],
    notes: 'Compra semanal de carnes.',
  },
  {
    id: 2,
    supplierId: 2,
    supplierName: 'Distribuidora Campo Verde',
    purchaseDate: '2026-11-05',
    paymentType: 'avista',
    total: 980,
    status: 'recebido',
    items: [{ productId: 5, productName: 'Linguiça', quantity: 20, weight: 20, costPerKg: 22.9, total: 458 }],
    notes: 'Reposição de mercadorias.',
  },
];

const initialSales = [
  { id: 1, date: '2026-11-01', client: 'João M.', product: 'Picanha', quantity: 3, unit: 'kg', total: 269.7, payment: 'PIX', employee: 'Fernanda', status: 'concluida' },
  { id: 2, date: '2026-11-02', client: 'Ana L.', product: 'Linguiça', quantity: 4, unit: 'kg', total: 158, payment: 'Dinheiro', employee: 'Marcos', status: 'concluida' },
  { id: 3, date: '2026-11-03', client: 'Carlos G.', product: 'Contra Filé', quantity: 2.5, unit: 'kg', total: 182.25, payment: 'Cartão de crédito', employee: 'João', status: 'concluida' },
  { id: 4, date: '2026-11-04', client: 'Maria P.', product: 'Costela', quantity: 3, unit: 'kg', total: 143.4, payment: 'Cartão de débito', employee: 'Aline', status: 'concluida' },
  { id: 5, date: '2026-11-05', client: 'Pedro R.', product: 'Frango inteiro', quantity: 6, unit: 'un', total: 149.4, payment: 'PIX', employee: 'Fernanda', status: 'concluida' },
  { id: 6, date: '2026-11-05', client: 'Lucia S.', product: 'Picanha', quantity: 1.5, unit: 'kg', total: 134.85, payment: 'Dinheiro', employee: 'Marcos', status: 'cancelado' },
  { id: 7, date: '2026-11-06', client: 'Léo N.', product: 'Linguiça', quantity: 5, unit: 'kg', total: 197.5, payment: 'Cartão de débito', employee: 'João', status: 'devolvido' },
  { id: 8, date: '2026-11-07', client: 'Renata H.', product: 'Picanha', quantity: 2.2, unit: 'kg', total: 197.58, payment: 'Cartão de crédito', employee: 'Aline', status: 'concluida' },
  { id: 9, date: '2026-11-08', client: 'Alberto F.', product: 'Contra Filé', quantity: 3.4, unit: 'kg', total: 247.86, payment: 'PIX', employee: 'Fernanda', status: 'concluida' },
  { id: 10, date: '2026-11-09', client: 'Sofia T.', product: 'Costela', quantity: 4, unit: 'kg', total: 191.2, payment: 'Dinheiro', employee: 'Marcos', status: 'concluida' },
];

const initialExpenses = [
  { id: 1, date: '2026-11-01', description: 'Energia elétrica', amount: 480 },
  { id: 2, date: '2026-11-02', description: 'Internet', amount: 180 },
  { id: 3, date: '2026-11-05', description: 'Frete e entrega', amount: 310 },
  { id: 4, date: '2026-11-06', description: 'Material de embalagem', amount: 210 },
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

const safeNumber = (value) => Number(value || 0);

const formatMoney = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(safeNumber(value));

const formatDate = (value) => {
  if (!value) return '—';
  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const getTodaysDate = () => new Date().toISOString().slice(0, 10);

const getPeriodLabel = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Sem data';
  return `${date.toLocaleDateString('pt-BR', { month: 'short' })}/${date.getFullYear()}`;
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

  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_products');
      return stored ? JSON.parse(stored) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [suppliers, setSuppliers] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_suppliers');
      return stored ? JSON.parse(stored) : initialSuppliers;
    } catch {
      return initialSuppliers;
    }
  });

  const [purchases, setPurchases] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_purchases');
      return stored ? JSON.parse(stored) : initialPurchases;
    } catch {
      return initialPurchases;
    }
  });

  const [sales, setSales] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_sales');
      return stored ? JSON.parse(stored) : initialSales;
    } catch {
      return initialSales;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_expenses');
      return stored ? JSON.parse(stored) : initialExpenses;
    } catch {
      return initialExpenses;
    }
  });

  const [employees, setEmployees] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_employees');
      return stored ? JSON.parse(stored) : initialEmployees;
    } catch {
      return initialEmployees;
    }
  });

  const [payrollData, setPayrollData] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_acougue_payroll');
      return stored ? JSON.parse(stored) : payrollSeed;
    } catch {
      return payrollSeed;
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

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    phone: '',
    cnpj: '',
    category: 'Carnes',
    address: '',
  });

  const [purchaseDraft, setPurchaseDraft] = useState({
    supplierId: '',
    purchaseDate: getTodaysDate(),
    paymentType: 'prazo',
    notes: '',
    items: [{ productId: '', quantity: '', weight: '', costPerKg: '', total: 0 }],
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeId: '',
    period: new Date().toISOString().slice(0, 7),
    advanceAmount: '0',
    status: 'pendente',
    note: '',
    paidAt: '',
  });

  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    product: 'all',
    period: 'mensal',
  });

  const [employeeMessage, setEmployeeMessage] = useState('');
  const [supplierMessage, setSupplierMessage] = useState('');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [payrollFilterEmployee, setPayrollFilterEmployee] = useState('all');
  const [payrollFilterStatus, setPayrollFilterStatus] = useState('all');
  const [payrollFilterPeriod, setPayrollFilterPeriod] = useState('all');

  useEffect(() => {
    localStorage.setItem('gestao_acougue_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gestao_acougue_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('gestao_acougue_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('gestao_acougue_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('gestao_acougue_expenses', JSON.stringify(expenses));
  }, [expenses]);

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

  const lowStockProducts = useMemo(
    () => products.filter((product) => Number(product.stock || 0) <= Number(product.minimumStock || 0)),
    [products]
  );

  const purchaseSummary = useMemo(() => {
    const totalPurchases = purchases.reduce((sum, purchase) => sum + Number(purchase.total || 0), 0);
    const pendingPayables = purchases
      .filter((purchase) => purchase.paymentType === 'prazo' && purchase.status !== 'cancelado')
      .reduce((sum, purchase) => sum + Number(purchase.total || 0), 0);

    return {
      totalPurchases,
      pendingPayables,
    };
  }, [purchases]);

  const supplierSummary = useMemo(() => {
    return suppliers.map((supplier) => ({
      supplier,
      total: purchases
        .filter((purchase) => purchase.supplierId === supplier.id)
        .reduce((sum, purchase) => sum + Number(purchase.total || 0), 0),
    }));
  }, [suppliers, purchases]);

  const currentPurchaseTotal = useMemo(() => {
    return purchaseDraft.items.reduce((sum, item) => sum + safeNumber(item.total), 0);
  }, [purchaseDraft.items]);

  const reportSales = useMemo(() => {
    const start = reportFilters.startDate ? new Date(reportFilters.startDate) : null;
    const end = reportFilters.endDate ? new Date(reportFilters.endDate) : null;

    return sales.filter((sale) => {
      if (sale.status === 'cancelado' || sale.status === 'devolvido') return false;
      const saleDate = new Date(sale.date);
      if (start && saleDate < start) return false;
      if (end && saleDate > end) return false;
      if (reportFilters.product !== 'all' && sale.product !== reportFilters.product) return false;
      return true;
    });
  }, [sales, reportFilters]);

  const reportProductBreakdown = useMemo(() => {
    const map = {};
    reportSales.forEach((sale) => {
      const key = sale.product;
      if (!map[key]) {
        map[key] = { product: key, quantity: 0, revenue: 0, cost: 0 };
      }
      const productRef = products.find((item) => item.name === key);
      const unitCost = Number(productRef?.costPerKg || 0);
      const qty = Number(sale.quantity || 0);
      map[key].quantity += qty;
      map[key].revenue += safeNumber(sale.total);
      map[key].cost += qty * unitCost;
    });

    return Object.values(map)
      .map((item) => ({
        ...item,
        profit: item.revenue - item.cost,
        margin: item.revenue > 0 ? ((item.revenue - item.cost) / item.revenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [reportSales, products]);

  const reportSummary = useMemo(() => {
    const totalRevenue = reportSales.reduce((sum, sale) => sum + safeNumber(sale.total), 0);
    const totalCost = reportProductBreakdown.reduce((sum, item) => sum + safeNumber(item.cost), 0);
    const totalExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date || new Date());
        const start = reportFilters.startDate ? new Date(reportFilters.startDate) : null;
        const end = reportFilters.endDate ? new Date(reportFilters.endDate) : null;
        if (start && expenseDate < start) return false;
        if (end && expenseDate > end) return false;
        return true;
      })
      .reduce((sum, expense) => sum + safeNumber(expense.amount), 0);

    const estimatedProfit = totalRevenue - totalCost - totalExpenses;

    return {
      totalRevenue,
      totalCost,
      totalExpenses,
      estimatedProfit,
      totalQuantum: reportSales.length,
    };
  }, [reportSales, reportProductBreakdown, expenses, reportFilters]);

  const paymentBreakdown = useMemo(() => {
    const map = {};
    reportSales.forEach((sale) => {
      map[sale.payment] = safeNumber(map[sale.payment]) + safeNumber(sale.total);
    });

    return Object.entries(map).map(([payment, total]) => ({ payment, total }));
  }, [reportSales]);

  const topProducts = useMemo(() => [...reportProductBreakdown].sort((a, b) => b.quantity - a.quantity).slice(0, 5), [reportProductBreakdown]);
  const lessProducts = useMemo(() => [...reportProductBreakdown].sort((a, b) => a.quantity - b.quantity).slice(0, 5), [reportProductBreakdown]);

  const periodSummary = useMemo(() => {
    const ranges = [
      { id: 'diario', label: 'Diário', value: reportSales.filter((sale) => sale.date === getTodaysDate()).reduce((sum, sale) => sum + safeNumber(sale.total), 0) },
      { id: 'semanal', label: 'Semanal', value: reportSales.filter((sale) => {
        const date = new Date(sale.date);
        const now = new Date();
        const diffDays = Math.floor((now - date) / 86400000);
        return diffDays <= 7 && diffDays >= 0;
      }).reduce((sum, sale) => sum + safeNumber(sale.total), 0) },
      { id: 'quinzenal', label: 'Quinzenal', value: reportSales.filter((sale) => {
        const date = new Date(sale.date);
        const now = new Date();
        const diffDays = Math.floor((now - date) / 86400000);
        return diffDays <= 15 && diffDays >= 0;
      }).reduce((sum, sale) => sum + safeNumber(sale.total), 0) },
      { id: 'mensal', label: 'Mensal', value: reportSales.reduce((sum, sale) => sum + safeNumber(sale.total), 0) },
    ];

    return ranges;
  }, [reportSales]);

  const handleLogin = (event) => {
    event.preventDefault();
    if (loginData.email && loginData.password) {
      localStorage.setItem('gestao_acougue_token', 'demo');
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
      return [...current, { id: product.id, name: product.name, price: product.salePricePerKg, quantity: 1, type: product.unit }];
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
    const newSale = {
      id: Date.now(),
      date: getTodaysDate(),
      client: 'Cliente final',
      product: cart[0]?.name || 'Venda direta',
      quantity: cart.reduce((sum, item) => sum + safeNumber(item.quantity), 0),
      unit: 'kg',
      total,
      payment: paymentMethod,
      employee: 'Sistema',
      status: 'concluida',
    };

    setSales((current) => [newSale, ...current]);
    setSaleMessage(`Venda finalizada com ${paymentMethod}. Total: ${formatMoney(total)}`);
    setCart([]);
  };

  const addSupplier = (event) => {
    event.preventDefault();
    setSupplierMessage('');

    if (!supplierForm.name || !supplierForm.phone || !supplierForm.address) {
      setSupplierMessage('Preencha nome, telefone e endereço do fornecedor.');
      return;
    }

    const nextSupplier = {
      id: Date.now(),
      name: supplierForm.name,
      phone: supplierForm.phone,
      cnpj: supplierForm.cnpj || 'Não informado',
      category: supplierForm.category,
      address: supplierForm.address,
    };

    setSuppliers((current) => [...current, nextSupplier]);
    setSupplierForm({ name: '', phone: '', cnpj: '', category: 'Carnes', address: '' });
    setSupplierMessage('Fornecedor cadastrado com sucesso.');
  };

  const updatePurchaseItem = (index, field, value) => {
    setPurchaseDraft((current) => {
      const nextItems = [...current.items];
      nextItems[index] = { ...nextItems[index], [field]: value };

      const selectedProduct = products.find((product) => String(product.id) === String(nextItems[index].productId));
      const quantity = Number(nextItems[index].quantity || 0);
      const weight = Number(nextItems[index].weight || 0);
      const costPerKg = Number(nextItems[index].costPerKg || selectedProduct?.costPerKg || 0);
      const effectiveWeight = weight > 0 ? weight : quantity;
      nextItems[index].total = effectiveWeight * costPerKg;

      return { ...current, items: nextItems };
    });
  };

  const addPurchaseItem = () => {
    setPurchaseDraft((current) => ({
      ...current,
      items: [...current.items, { productId: '', quantity: '', weight: '', costPerKg: '', total: 0 }],
    }));
  };

  const removePurchaseItem = (index) => {
    setPurchaseDraft((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const registerPurchase = (event) => {
    event.preventDefault();
    setPurchaseMessage('');

    if (!purchaseDraft.supplierId) {
      setPurchaseMessage('Selecione um fornecedor para registrar a compra.');
      return;
    }

    const validItems = purchaseDraft.items.filter((item) => item.productId && (Number(item.weight || 0) > 0 || Number(item.quantity || 0) > 0));
    if (!validItems.length) {
      setPurchaseMessage('Inclua ao menos um produto para a compra.');
      return;
    }

    const supplier = suppliers.find((entry) => String(entry.id) === String(purchaseDraft.supplierId));
    if (!supplier) {
      setPurchaseMessage('Fornecedor não encontrado.');
      return;
    }

    const newPurchase = {
      id: Date.now(),
      supplierId: Number(purchaseDraft.supplierId),
      supplierName: supplier.name,
      purchaseDate: purchaseDraft.purchaseDate || getTodaysDate(),
      paymentType: purchaseDraft.paymentType,
      total: currentPurchaseTotal,
      status: 'recebido',
      notes: purchaseDraft.notes || 'Recebimento confirmado.',
      items: validItems.map((item) => {
        const product = products.find((entry) => String(entry.id) === String(item.productId));
        const qty = Number(item.weight || item.quantity || 0);
        const costPerKg = Number(item.costPerKg || product?.costPerKg || 0);
        return {
          productId: Number(item.productId),
          productName: product?.name || 'Produto',
          quantity: Number(item.quantity || qty),
          weight: Number(item.weight || qty),
          costPerKg,
          total: Number((Number(item.weight || item.quantity || 0) * costPerKg).toFixed(2)),
        };
      }),
    };

    setProducts((current) => current.map((product) => {
      const matchedItem = newPurchase.items.find((item) => item.productId === product.id);
      if (!matchedItem) return product;

      const previousStock = Number(product.stock || 0);
      const incomingStock = Number(matchedItem.weight || matchedItem.quantity || 0);
      const previousAverage = Number(product.costPerKg || 0);
      const previousTotal = previousAverage * previousStock;
      const incomingTotal = Number(matchedItem.total || 0);
      const nextStock = previousStock + incomingStock;
      const nextAverage = nextStock > 0 ? (previousTotal + incomingTotal) / nextStock : previousAverage;

      return {
        ...product,
        stock: nextStock,
        costPerKg: Number(nextAverage.toFixed(2)),
        costHistory: [
          ...(product.costHistory || []),
          { date: newPurchase.purchaseDate, costPerKg: Number(nextAverage.toFixed(2)) },
        ],
      };
    }));

    setPurchases((current) => [newPurchase, ...current]);
    setPurchaseDraft({
      supplierId: '',
      purchaseDate: getTodaysDate(),
      paymentType: 'prazo',
      notes: '',
      items: [{ productId: '', quantity: '', weight: '', costPerKg: '', total: 0 }],
    });
    setPurchaseMessage('Compra registrada com sucesso e estoque atualizado.');
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

  const handleExportReports = () => {
    const rows = [
      ['Produto', 'Quantidade', 'Faturamento', 'Custo estimado', 'Lucro bruto', 'Margem'],
      ...reportProductBreakdown.map((item) => [
        item.product,
        item.quantity,
        item.revenue,
        item.cost,
        item.profit,
        `${item.margin.toFixed(2)}%`,
      ]),
    ];

    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio-acougue.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              <input type="email" value={loginData.email} onChange={(event) => setLoginData({ ...loginData, email: event.target.value })} />
            </label>
            <label>
              Senha
              <input type="password" value={loginData.password} onChange={(event) => setLoginData({ ...loginData, password: event.target.value })} />
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
                        <small>{product.sku} • {product.stock} {product.unit} em estoque</small>
                      </div>
                      <div className="product-actions">
                        <span>{formatMoney(product.salePricePerKg)}</span>
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
                          <input type="number" min="1" value={item.quantity} onChange={(event) => handleQtyChange(item.id, event.target.value)} />
                          <button className="ghost-button" onClick={() => removeItem(item.id)}>Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="payment-methods">
                  {['PIX', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito'].map((method) => (
                    <button key={method} className={paymentMethod === method ? 'payment-button active' : 'payment-button'} onClick={() => setPaymentMethod(method)}>
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

            {lowStockProducts.length > 0 && (
              <div className="panel">
                <h3>Avisos de reposição</h3>
                <ul className="stack-list">
                  {lowStockProducts.map((product) => (
                    <li key={product.id}><strong>{product.name}</strong> • estoque: {product.stock} • mínimo: {product.minimumStock}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="panel">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Código</th>
                    <th>Estoque</th>
                    <th>Custo/kg</th>
                    <th>Venda/kg</th>
                    <th>Estoque mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.stock} {product.unit}</td>
                      <td>{formatMoney(product.costPerKg)}</td>
                      <td>{formatMoney(product.salePricePerKg)}</td>
                      <td>{product.minimumStock}</td>
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
                  <input value={employeeForm.name} onChange={(event) => setEmployeeForm({ ...employeeForm, name: event.target.value })} placeholder="Ex.: Carlos Souza" />
                </label>
                <label>
                  Telefone
                  <input value={employeeForm.phone} onChange={(event) => setEmployeeForm({ ...employeeForm, phone: event.target.value })} placeholder="(11) 99999-9999" />
                </label>
                <label>
                  Função
                  <input value={employeeForm.role} onChange={(event) => setEmployeeForm({ ...employeeForm, role: event.target.value })} placeholder="Ex.: Vendedor" />
                </label>
                <label>
                  Salário
                  <input type="number" min="0" step="0.01" value={employeeForm.salary} onChange={(event) => setEmployeeForm({ ...employeeForm, salary: event.target.value })} placeholder="0.00" />
                </label>
                <label>
                  Data de admissão
                  <input type="date" value={employeeForm.admissionDate} onChange={(event) => setEmployeeForm({ ...employeeForm, admissionDate: event.target.value })} />
                </label>
                <label>
                  Pagamento
                  <select value={employeeForm.paymentCycle} onChange={(event) => setEmployeeForm({ ...employeeForm, paymentCycle: event.target.value })}>
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
                  <select value={payrollForm.employeeId} onChange={(event) => setPayrollForm({ ...payrollForm, employeeId: event.target.value })}>
                    <option value="">Selecione</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Período
                  <input type="month" value={payrollForm.period} onChange={(event) => setPayrollForm({ ...payrollForm, period: event.target.value })} />
                </label>
                <label>
                  Vale / adiantamento
                  <input type="number" min="0" step="0.01" value={payrollForm.advanceAmount} onChange={(event) => setPayrollForm({ ...payrollForm, advanceAmount: event.target.value })} />
                </label>
                <label>
                  Situação
                  <select value={payrollForm.status} onChange={(event) => setPayrollForm({ ...payrollForm, status: event.target.value })}>
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                  </select>
                </label>
                <label>
                  Data do pagamento
                  <input type="date" value={payrollForm.paidAt} onChange={(event) => setPayrollForm({ ...payrollForm, paidAt: event.target.value })} />
                </label>
                <label>
                  Observação
                  <input value={payrollForm.note} onChange={(event) => setPayrollForm({ ...payrollForm, note: event.target.value })} placeholder="Motivo ou observação" />
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
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Fornecedores</span>
                <h2>Cadastro e consulta</h2>
              </div>
            </div>

            <div className="panel">
              <form onSubmit={addSupplier} className="form-grid">
                <label>
                  Nome
                  <input value={supplierForm.name} onChange={(event) => setSupplierForm({ ...supplierForm, name: event.target.value })} />
                </label>
                <label>
                  Telefone
                  <input value={supplierForm.phone} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} />
                </label>
                <label>
                  CNPJ
                  <input value={supplierForm.cnpj} onChange={(event) => setSupplierForm({ ...supplierForm, cnpj: event.target.value })} />
                </label>
                <label>
                  Categoria
                  <select value={supplierForm.category} onChange={(event) => setSupplierForm({ ...supplierForm, category: event.target.value })}>
                    <option>Carnes</option>
                    <option>Mercadorias</option>
                    <option>Embalagens</option>
                    <option>Outros</option>
                  </select>
                </label>
                <label style={{ gridColumn: '1 / -1' }}>
                  Endereço
                  <input value={supplierForm.address} onChange={(event) => setSupplierForm({ ...supplierForm, address: event.target.value })} />
                </label>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary-button">Salvar fornecedor</button>
                </div>
              </form>
              {supplierMessage && <div className="status-message small-status">{supplierMessage}</div>}
            </div>

            <div className="panel">
              <table>
                <thead>
                  <tr>
                    <th>Fornecedor</th>
                    <th>Categoria</th>
                    <th>Telefone</th>
                    <th>Compras</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierSummary.map(({ supplier, total }) => (
                    <tr key={supplier.id}>
                      <td>{supplier.name}</td>
                      <td>{supplier.category}</td>
                      <td>{supplier.phone}</td>
                      <td>{formatMoney(total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'purchases':
        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Compras</span>
                <h2>Registro e histórico</h2>
              </div>
            </div>

            <div className="panel">
              <form onSubmit={registerPurchase} className="form-grid">
                <label>
                  Fornecedor
                  <select value={purchaseDraft.supplierId} onChange={(event) => setPurchaseDraft({ ...purchaseDraft, supplierId: event.target.value })}>
                    <option value="">Selecione</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Data da compra
                  <input type="date" value={purchaseDraft.purchaseDate} onChange={(event) => setPurchaseDraft({ ...purchaseDraft, purchaseDate: event.target.value })} />
                </label>
                <label>
                  Forma de pagamento
                  <select value={purchaseDraft.paymentType} onChange={(event) => setPurchaseDraft({ ...purchaseDraft, paymentType: event.target.value })}>
                    <option value="avista">À vista</option>
                    <option value="prazo">À prazo</option>
                  </select>
                </label>
                <label>
                  Observações
                  <input value={purchaseDraft.notes} onChange={(event) => setPurchaseDraft({ ...purchaseDraft, notes: event.target.value })} />
                </label>

                {purchaseDraft.items.map((item, index) => (
                  <div key={index} style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px', border: '1px solid #e7ece9', padding: '12px', borderRadius: '12px' }}>
                    <label>
                      Produto
                      <select value={item.productId} onChange={(event) => updatePurchaseItem(index, 'productId', event.target.value)}>
                        <option value="">Selecione</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Quantidade
                      <input type="number" min="0" step="0.01" value={item.quantity} onChange={(event) => updatePurchaseItem(index, 'quantity', event.target.value)} />
                    </label>
                    <label>
                      Peso (kg)
                      <input type="number" min="0" step="0.01" value={item.weight} onChange={(event) => updatePurchaseItem(index, 'weight', event.target.value)} />
                    </label>
                    <label>
                      Custo/kg
                      <input type="number" min="0" step="0.01" value={item.costPerKg} onChange={(event) => updatePurchaseItem(index, 'costPerKg', event.target.value)} />
                    </label>
                    <label>
                      Total
                      <input value={formatMoney(item.total)} readOnly />
                    </label>
                    {purchaseDraft.items.length > 1 && (
                      <button style={{ gridColumn: '1 / -1', justifySelf: 'end' }} type="button" className="ghost-button" onClick={() => removePurchaseItem(index)}>Remover item</button>
                    )}
                  </div>
                ))}

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <button type="button" className="secondary-button" onClick={addPurchaseItem}>Adicionar item</button>
                  <strong>Total da compra: {formatMoney(currentPurchaseTotal)}</strong>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className="primary-button">Confirmar recebimento</button>
                </div>
              </form>
              {purchaseMessage && <div className="status-message small-status">{purchaseMessage}</div>}
            </div>

            <div className="panel">
              <table>
                <thead>
                  <tr>
                    <th>Fornecedor</th>
                    <th>Data</th>
                    <th>Pagamento</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td>{purchase.supplierName}</td>
                      <td>{formatDate(purchase.purchaseDate)}</td>
                      <td>{purchase.paymentType === 'prazo' ? 'À prazo' : 'À vista'}</td>
                      <td>{formatMoney(purchase.total)}</td>
                      <td>
                        <span className={purchase.paymentType === 'prazo' ? 'danger-span' : 'success-span'}>
                          {purchase.paymentType === 'prazo' ? 'A prazo' : 'À vista'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'cash':
        return <div className="content-block"><h2>Caixa</h2><div className="card-grid simple-grid">{cashFlow.map((item) => <div className="panel" key={item.label}><span className={item.type === 'entrada' ? 'success-span' : 'danger-span'}>{item.type === 'entrada' ? 'Entrada' : 'Saída'}</span><h3>{item.label}</h3><strong>{formatMoney(item.value)}</strong></div>)}</div></div>;
      case 'sales':
        return <div className="content-block"><h2>Vendas</h2><div className="panel"><table><thead><tr><th>Cliente</th><th>Valor</th><th>Pagamento</th><th>Vendedor</th></tr></thead><tbody>{sales.map((sale) => <tr key={`${sale.client}-${sale.date}`}><td>{sale.client}</td><td>{formatMoney(sale.total)}</td><td>{sale.payment}</td><td>{sale.employee}</td></tr>)}</tbody></table></div></div>;
      case 'finance':
        return <div className="content-block"><h2>Visão financeira</h2><div className="panel"><div className="mini-stat"><span>Fluxo de caixa</span><strong>R$ 13.480,00</strong></div><div className="mini-stat"><span>Contas a receber</span><strong>R$ 4.960,00</strong></div><div className="mini-stat"><span>Contas a pagar</span><strong>{formatMoney(purchaseSummary.pendingPayables)}</strong></div></div></div>;
      case 'expenses':
        return <div className="content-block"><h2>Despesas</h2><div className="panel"><ul className="stack-list">{expenses.map((expense) => <li key={expense.id}><strong>{expense.description}</strong> • {formatDate(expense.date)} • {formatMoney(expense.amount)}</li>)}</ul></div></div>;
      case 'payables':
        return (
          <div className="content-block">
            <h2>Contas a pagar</h2>
            <div className="panel">
              <ul className="stack-list">
                {purchases.filter((purchase) => purchase.paymentType === 'prazo').map((purchase) => (
                  <li key={purchase.id}><strong>{purchase.supplierName}</strong> • {purchase.paymentType === 'prazo' ? 'À prazo' : 'À vista'} • {formatMoney(purchase.total)} • {formatDate(purchase.purchaseDate)}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'reports': {
        const maxPayment = Math.max(...paymentBreakdown.map((item) => item.total), 1);
        const maxProduct = Math.max(...reportProductBreakdown.map((item) => item.revenue), 1);

        return (
          <div className="content-block">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Relatórios</span>
                <h2>Faturamento e lucratividade</h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="secondary-button" onClick={() => window.print()}>Imprimir</button>
                <button type="button" className="primary-button small" onClick={handleExportReports}>Exportar CSV</button>
              </div>
            </div>

            <div className="panel">
              <div className="form-grid">
                <label>
                  Data inicial
                  <input type="date" value={reportFilters.startDate} onChange={(event) => setReportFilters({ ...reportFilters, startDate: event.target.value })} />
                </label>
                <label>
                  Data final
                  <input type="date" value={reportFilters.endDate} onChange={(event) => setReportFilters({ ...reportFilters, endDate: event.target.value })} />
                </label>
                <label>
                  Produto
                  <select value={reportFilters.product} onChange={(event) => setReportFilters({ ...reportFilters, product: event.target.value })}>
                    <option value="all">Todos</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.name}>{product.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Período
                  <select value={reportFilters.period} onChange={(event) => setReportFilters({ ...reportFilters, period: event.target.value })}>
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                    <option value="quinzenal">Quinzenal</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="card-grid simple-grid">
              <div className="panel">
                <h3>Faturamento</h3>
                <p><strong>{formatMoney(reportSummary.totalRevenue)}</strong></p>
              </div>
              <div className="panel">
                <h3>Custo estimado</h3>
                <p><strong>{formatMoney(reportSummary.totalCost)}</strong></p>
              </div>
              <div className="panel">
                <h3>Despesas</h3>
                <p><strong>{formatMoney(reportSummary.totalExpenses)}</strong></p>
              </div>
              <div className="panel">
                <h3>Resultado estimado</h3>
                <p><strong>{formatMoney(reportSummary.estimatedProfit)}</strong></p>
              </div>
            </div>

            <div className="two-column">
              <div className="panel">
                <h3>Relatório por forma de pagamento</h3>
                {paymentBreakdown.map((item) => (
                  <div key={item.payment} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>{item.payment}</span>
                      <strong>{formatMoney(item.total)}</strong>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: '#edf2ef', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(item.total / maxPayment) * 100}%`, height: '100%', background: '#1d8f5c', borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="panel">
                <h3>Resumo por período</h3>
                {periodSummary.map((item) => (
                  <div key={item.id} className="mini-stat">
                    <span>{item.label}</span>
                    <strong>{formatMoney(item.value)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <h3>Vendas por produto</h3>
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Faturamento</th>
                    <th>Custo</th>
                    <th>Lucro bruto</th>
                    <th>Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {reportProductBreakdown.map((item) => (
                    <tr key={item.product}>
                      <td>{item.product}</td>
                      <td>{item.quantity}</td>
                      <td>{formatMoney(item.revenue)}</td>
                      <td>{formatMoney(item.cost)}</td>
                      <td>{formatMoney(item.profit)}</td>
                      <td>{item.margin.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="two-column">
              <div className="panel">
                <h3>Produtos mais vendidos</h3>
                <ul className="stack-list">
                  {topProducts.map((item) => (
                    <li key={item.product}><strong>{item.product}</strong> • {item.quantity} unidades • {formatMoney(item.revenue)}</li>
                  ))}
                </ul>
              </div>

              <div className="panel">
                <h3>Produtos menos vendidos</h3>
                <ul className="stack-list">
                  {lessProducts.map((item) => (
                    <li key={item.product}><strong>{item.product}</strong> • {item.quantity} unidades • {formatMoney(item.revenue)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="panel">
              <h3>Gráfico de faturamento por produto</h3>
              {reportProductBreakdown.map((item) => (
                <div key={item.product} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>{item.product}</span>
                    <strong>{formatMoney(item.revenue)}</strong>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: '#edf2ef', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${(item.revenue / maxProduct) * 100}%`, height: '100%', background: '#7a5af8', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'profitability':
        return (
          <div className="content-block">
            <h2>Lucratividade</h2>
            <div className="panel">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Custo</th>
                    <th>Preço venda</th>
                    <th>Margem</th>
                    <th>Lucro bruto</th>
                  </tr>
                </thead>
                <tbody>
                  {reportProductBreakdown.map((item) => {
                    const product = products.find((entry) => entry.name === item.product);
                    const salePrice = product?.salePricePerKg || 0;
                    const costValue = product?.costPerKg || 0;
                    const margin = salePrice > 0 ? ((salePrice - costValue) / salePrice) * 100 : 0;
                    return (
                      <tr key={item.product}>
                        <td>{item.product}</td>
                        <td>{formatMoney(costValue)}</td>
                        <td>{formatMoney(salePrice)}</td>
                        <td>{margin.toFixed(2)}%</td>
                        <td>{formatMoney(item.profit)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
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
            <button key={module.id} className={activeModule === module.id ? 'nav-item active' : 'nav-item'} onClick={() => setActiveModule(module.id)}>
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
            <button className="primary-button" onClick={() => {
              localStorage.removeItem('gestao_acougue_token');
              setIsAuthenticated(false);
            }}>Sair</button>
          </div>
        </header>

        {renderModule()}
      </main>
    </div>
  );
}

export default App;
