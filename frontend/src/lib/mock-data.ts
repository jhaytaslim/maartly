export const mockProducts = [
  {
    id: 'PRD-001',
    name: 'Laptop HP ProBook 450',
    sku: 'HPL-450-2024',
    category: 'Electronics',
    supplier: 'Tech Distributors Ltd',
    quantity: 45,
    minStock: 10,
    price: 899.99,
    cost: 650.00,
    status: 'In Stock',
    store: 'Main Warehouse'
  },
  {
    id: 'PRD-002',
    name: 'Wireless Mouse Logitech',
    sku: 'LOG-M185-BLK',
    category: 'Accessories',
    supplier: 'Tech Distributors Ltd',
    quantity: 5,
    minStock: 20,
    price: 19.99,
    cost: 12.00,
    status: 'Low Stock',
    store: 'Main Warehouse'
  },
  {
    id: 'PRD-003',
    name: 'Office Chair Ergonomic',
    sku: 'OFF-CH-ERG-01',
    category: 'Furniture',
    supplier: 'Office Supplies Co',
    quantity: 120,
    minStock: 15,
    price: 249.99,
    cost: 180.00,
    status: 'In Stock',
    store: 'Store A'
  },
  {
    id: 'PRD-004',
    name: 'USB-C Cable 2m',
    sku: 'CBL-USBC-2M',
    category: 'Accessories',
    supplier: 'Cable World',
    quantity: 3,
    minStock: 50,
    price: 12.99,
    cost: 5.00,
    status: 'Critical',
    store: 'Store B'
  },
  {
    id: 'PRD-005',
    name: 'Monitor Dell 27" 4K',
    sku: 'DEL-MON-27-4K',
    category: 'Electronics',
    supplier: 'Tech Distributors Ltd',
    quantity: 28,
    minStock: 8,
    price: 549.99,
    cost: 380.00,
    status: 'In Stock',
    store: 'Main Warehouse'
  }
];

export const mockCategories = [
  { id: 'CAT-001', name: 'Electronics', productCount: 156, description: 'Electronic devices and components' },
  { id: 'CAT-002', name: 'Furniture', productCount: 89, description: 'Office and home furniture' },
  { id: 'CAT-003', name: 'Accessories', productCount: 234, description: 'Computer and office accessories' },
  { id: 'CAT-004', name: 'Stationery', productCount: 178, description: 'Office stationery and supplies' },
  { id: 'CAT-005', name: 'Software', productCount: 45, description: 'Software licenses and subscriptions' }
];

export const mockSuppliers = [
  {
    id: 'SUP-001',
    name: 'Tech Distributors Ltd',
    contact: 'John Smith',
    email: 'john@techdist.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    productsSupplied: 45,
    status: 'Active'
  },
  {
    id: 'SUP-002',
    name: 'Office Supplies Co',
    contact: 'Sarah Johnson',
    email: 'sarah@officesupplies.com',
    phone: '+1-555-0124',
    address: '456 Office Ave, New York, NY 10001',
    productsSupplied: 32,
    status: 'Active'
  },
  {
    id: 'SUP-003',
    name: 'Cable World',
    contact: 'Mike Brown',
    email: 'mike@cableworld.com',
    phone: '+1-555-0125',
    address: '789 Cable Rd, Austin, TX 78701',
    productsSupplied: 28,
    status: 'Active'
  }
];

export const mockOrders = [
  {
    id: 'ORD-2024-001',
    customer: 'Acme Corporation',
    date: '2024-10-12',
    items: 5,
    total: 1249.95,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Completed',
    employee: 'Jane Doe',
    tax: 124.99
  },
  {
    id: 'ORD-2024-002',
    customer: 'Tech Startup Inc',
    date: '2024-10-12',
    items: 3,
    total: 2599.97,
    paymentMethod: 'Digital Wallet',
    paymentStatus: 'Paid',
    status: 'Processing',
    employee: 'John Smith',
    tax: 259.99
  },
  {
    id: 'ORD-2024-003',
    customer: 'Local Business LLC',
    date: '2024-10-11',
    items: 8,
    total: 899.92,
    paymentMethod: 'Credit',
    paymentStatus: 'Pending',
    status: 'Pending',
    employee: 'Jane Doe',
    tax: 89.99
  },
  {
    id: 'ORD-2024-004',
    customer: 'Enterprise Solutions',
    date: '2024-10-11',
    items: 12,
    total: 4599.88,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    status: 'Completed',
    employee: 'Mike Wilson',
    tax: 459.98
  }
];

export const mockEmployees = [
  {
    id: 'EMP-001',
    name: 'Jane Doe',
    email: 'jane.doe@stockly.com',
    role: 'Sales Manager',
    phone: '+1-555-0201',
    status: 'Active',
    hireDate: '2023-01-15',
    totalSales: 125000,
    engagementTime: '42h 15m'
  },
  {
    id: 'EMP-002',
    name: 'John Smith',
    email: 'john.smith@stockly.com',
    role: 'Sales Associate',
    phone: '+1-555-0202',
    status: 'Active',
    hireDate: '2023-03-20',
    totalSales: 89000,
    engagementTime: '38h 30m'
  },
  {
    id: 'EMP-003',
    name: 'Mike Wilson',
    email: 'mike.wilson@stockly.com',
    role: 'Warehouse Manager',
    phone: '+1-555-0203',
    status: 'Active',
    hireDate: '2022-11-10',
    totalSales: 156000,
    engagementTime: '45h 20m'
  }
];

export const mockCustomers = [
  {
    id: 'CUS-001',
    name: 'Acme Corporation',
    contact: 'Robert Johnson',
    email: 'robert@acme.com',
    phone: '+1-555-0301',
    totalPurchases: 45000,
    outstandingDebt: 0,
    status: 'Active',
    lastPurchase: '2024-10-12'
  },
  {
    id: 'CUS-002',
    name: 'Tech Startup Inc',
    contact: 'Emily Davis',
    email: 'emily@techstartup.com',
    phone: '+1-555-0302',
    totalPurchases: 78000,
    outstandingDebt: 2500,
    status: 'Active',
    lastPurchase: '2024-10-12'
  },
  {
    id: 'CUS-003',
    name: 'Local Business LLC',
    contact: 'Tom Anderson',
    email: 'tom@localbiz.com',
    phone: '+1-555-0303',
    totalPurchases: 23000,
    outstandingDebt: 1200,
    status: 'Active',
    lastPurchase: '2024-10-11'
  }
];

export const mockStores = [
  {
    id: 'STR-001',
    name: 'Main Warehouse',
    address: '100 Warehouse Blvd, Industrial Park',
    manager: 'Mike Wilson',
    capacity: 10000,
    currentStock: 7845,
    status: 'Active',
    phone: '+1-555-0401'
  },
  {
    id: 'STR-002',
    name: 'Store A - Downtown',
    address: '25 Main Street, Downtown District',
    manager: 'Jane Doe',
    capacity: 5000,
    currentStock: 3420,
    status: 'Active',
    phone: '+1-555-0402'
  },
  {
    id: 'STR-003',
    name: 'Store B - Mall Location',
    address: '50 Shopping Mall, Level 2',
    manager: 'John Smith',
    capacity: 3000,
    currentStock: 2156,
    status: 'Active',
    phone: '+1-555-0403'
  }
];

export const mockDebts = [
  {
    id: 'DEBT-001',
    customer: 'Tech Startup Inc',
    orderId: 'ORD-2024-002',
    amount: 2500,
    dueDate: '2024-10-25',
    daysOverdue: 0,
    status: 'Current'
  },
  {
    id: 'DEBT-002',
    customer: 'Local Business LLC',
    orderId: 'ORD-2024-003',
    amount: 1200,
    dueDate: '2024-10-18',
    daysOverdue: 0,
    status: 'Current'
  },
  {
    id: 'DEBT-003',
    customer: 'Small Shop Co',
    orderId: 'ORD-2024-045',
    amount: 850,
    dueDate: '2024-10-05',
    daysOverdue: 7,
    status: 'Overdue'
  }
];

export const translations = {
  en: {
    dashboard: 'Dashboard',
    products: 'Products',
    categories: 'Categories',
    suppliers: 'Suppliers',
    orders: 'Orders',
    customers: 'Customers',
    employees: 'Employees',
    stores: 'Stores'
  },
  es: {
    dashboard: 'Tablero',
    products: 'Productos',
    categories: 'Categorías',
    suppliers: 'Proveedores',
    orders: 'Pedidos',
    customers: 'Clientes',
    employees: 'Empleados',
    stores: 'Tiendas'
  },
  fr: {
    dashboard: 'Tableau de bord',
    products: 'Produits',
    categories: 'Catégories',
    suppliers: 'Fournisseurs',
    orders: 'Commandes',
    customers: 'Clients',
    employees: 'Employés',
    stores: 'Magasins'
  }
};
