export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  STORE_MANAGER = 'STORE_MANAGER',
  CASHIER = 'CASHIER',
}

export enum Permission {
  // Dashboard
  VIEW_PLATFORM_DASHBOARD = 'view_platform_dashboard',
  VIEW_TENANT_DASHBOARD = 'view_tenant_dashboard',
  VIEW_STORE_DASHBOARD = 'view_store_dashboard',
  VIEW_PERSONAL_DASHBOARD = 'view_personal_dashboard',

  // Pricing & Plans
  MANAGE_PRICING_PLANS = 'manage_pricing_plans',
  VIEW_PRICING_PLANS = 'view_pricing_plans',
  CHANGE_SUBSCRIPTION = 'change_subscription',

  // Payment Methods
  MANAGE_GLOBAL_PAYMENT_METHODS = 'manage_global_payment_methods',
  CONFIGURE_TENANT_PAYMENT_METHODS = 'configure_tenant_payment_methods',
  VIEW_PAYMENT_METHODS = 'view_payment_methods',

  // Tenant Management
  MANAGE_TENANTS = 'manage_tenants',
  VIEW_TENANT_USAGE = 'view_tenant_usage',
  MODIFY_TENANT_PLAN = 'modify_tenant_plan',

  // Products
  MANAGE_PRODUCTS = 'manage_products',
  VIEW_PRODUCTS = 'view_products',

  // Categories
  MANAGE_CATEGORIES = 'manage_categories',
  VIEW_CATEGORIES = 'view_categories',

  // Suppliers
  MANAGE_SUPPLIERS = 'manage_suppliers',
  VIEW_SUPPLIERS = 'view_suppliers',

  // Product Transfers
  APPROVE_TRANSFERS = 'approve_transfers',
  REQUEST_TRANSFERS = 'request_transfers',
  VIEW_TRANSFERS = 'view_transfers',

  // Low Stock Alerts
  VIEW_ALL_STOCK_ALERTS = 'view_all_stock_alerts',
  VIEW_STORE_STOCK_ALERTS = 'view_store_stock_alerts',

  // Orders
  MANAGE_ALL_ORDERS = 'manage_all_orders',
  MANAGE_STORE_ORDERS = 'manage_store_orders',
  VIEW_ORDERS = 'view_orders',

  // Tax Management
  MANAGE_TAXES = 'manage_taxes',
  VIEW_TAXES = 'view_taxes',

  // Employees
  MANAGE_ALL_EMPLOYEES = 'manage_all_employees',
  MANAGE_STORE_EMPLOYEES = 'manage_store_employees',
  VIEW_EMPLOYEE_REPORTS = 'view_employee_reports',
  VIEW_PERSONAL_PERFORMANCE = 'view_personal_performance',

  // Customers
  MANAGE_CUSTOMERS = 'manage_customers',
  VIEW_CUSTOMERS = 'view_customers',

  // Stores
  MANAGE_STORES = 'manage_stores',
  VIEW_STORES = 'view_stores',

  // Debt Management
  MANAGE_ALL_DEBTS = 'manage_all_debts',
  MANAGE_STORE_DEBTS = 'manage_store_debts',
  MANAGE_PERSONAL_DEBTS = 'manage_personal_debts',

  // Point of Sale
  USE_POS = 'use_pos',

  // Settings
  MANAGE_COMPANY_SETTINGS = 'manage_company_settings',
  MANAGE_STORE_SETTINGS = 'manage_store_settings',
  MANAGE_PERSONAL_SETTINGS = 'manage_personal_settings',
}

// Permission mapping for each role
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.VIEW_PLATFORM_DASHBOARD,
    Permission.MANAGE_PRICING_PLANS,
    Permission.VIEW_PRICING_PLANS,
    Permission.MANAGE_GLOBAL_PAYMENT_METHODS,
    Permission.MANAGE_TENANTS,
    Permission.VIEW_TENANT_USAGE,
    Permission.MODIFY_TENANT_PLAN,
    Permission.MANAGE_COMPANY_SETTINGS,
  ],

  [UserRole.TENANT_ADMIN]: [
    Permission.VIEW_TENANT_DASHBOARD,
    Permission.VIEW_PRICING_PLANS,
    Permission.CHANGE_SUBSCRIPTION,
    Permission.CONFIGURE_TENANT_PAYMENT_METHODS,
    Permission.VIEW_PAYMENT_METHODS,
    Permission.MANAGE_PRODUCTS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_CATEGORIES,
    Permission.VIEW_CATEGORIES,
    Permission.MANAGE_SUPPLIERS,
    Permission.VIEW_SUPPLIERS,
    Permission.APPROVE_TRANSFERS,
    Permission.VIEW_TRANSFERS,
    Permission.VIEW_ALL_STOCK_ALERTS,
    Permission.MANAGE_ALL_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_TAXES,
    Permission.VIEW_TAXES,
    Permission.MANAGE_ALL_EMPLOYEES,
    Permission.VIEW_EMPLOYEE_REPORTS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_STORES,
    Permission.VIEW_STORES,
    Permission.MANAGE_ALL_DEBTS,
    Permission.MANAGE_COMPANY_SETTINGS,
  ],

  [UserRole.STORE_MANAGER]: [
    Permission.VIEW_STORE_DASHBOARD,
    Permission.MANAGE_PRODUCTS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_CATEGORIES,
    Permission.VIEW_CATEGORIES,
    Permission.MANAGE_SUPPLIERS,
    Permission.VIEW_SUPPLIERS,
    Permission.REQUEST_TRANSFERS,
    Permission.VIEW_TRANSFERS,
    Permission.VIEW_STORE_STOCK_ALERTS,
    Permission.MANAGE_STORE_ORDERS,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_TAXES,
    Permission.VIEW_TAXES,
    Permission.MANAGE_STORE_EMPLOYEES,
    Permission.VIEW_EMPLOYEE_REPORTS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_STORE_DEBTS,
    Permission.MANAGE_STORE_SETTINGS,
    Permission.MANAGE_PERSONAL_SETTINGS,
  ],

  [UserRole.CASHIER]: [
    Permission.VIEW_PERSONAL_DASHBOARD,
    Permission.USE_POS,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_STORE_STOCK_ALERTS,
    Permission.VIEW_PERSONAL_PERFORMANCE,
    Permission.MANAGE_PERSONAL_DEBTS,
    Permission.MANAGE_PERSONAL_SETTINGS,
  ],
};

// Page to permissions mapping
export const PagePermissions: Record<string, Permission[]> = {
  dashboard: [
    Permission.VIEW_PLATFORM_DASHBOARD,
    Permission.VIEW_TENANT_DASHBOARD,
    Permission.VIEW_STORE_DASHBOARD,
    Permission.VIEW_PERSONAL_DASHBOARD,
  ],
  pos: [Permission.USE_POS],
  products: [Permission.VIEW_PRODUCTS],
  categories: [Permission.VIEW_CATEGORIES],
  suppliers: [Permission.VIEW_SUPPLIERS],
  'product-transfer': [Permission.VIEW_TRANSFERS],
  'low-stock-alerts': [
    Permission.VIEW_ALL_STOCK_ALERTS,
    Permission.VIEW_STORE_STOCK_ALERTS,
  ],
  orders: [Permission.VIEW_ORDERS],
  'tax-management': [Permission.VIEW_TAXES],
  'pricing-plans': [
    Permission.MANAGE_PRICING_PLANS,
    Permission.VIEW_PRICING_PLANS,
    Permission.CHANGE_SUBSCRIPTION,
  ],
  employees: [
    Permission.MANAGE_ALL_EMPLOYEES,
    Permission.MANAGE_STORE_EMPLOYEES,
    Permission.VIEW_PERSONAL_PERFORMANCE,
  ],
  customers: [Permission.VIEW_CUSTOMERS],
  stores: [Permission.VIEW_STORES],
  'debt-management': [
    Permission.MANAGE_ALL_DEBTS,
    Permission.MANAGE_STORE_DEBTS,
    Permission.MANAGE_PERSONAL_DEBTS,
  ],
  settings: [
    Permission.MANAGE_COMPANY_SETTINGS,
    Permission.MANAGE_STORE_SETTINGS,
    Permission.MANAGE_PERSONAL_SETTINGS,
  ],
};

// Check if user has permission
export function hasPermission(
  userRole: UserRole,
  permission: Permission,
): boolean {
  const rolePermissions = RolePermissions[userRole] || [];
  return rolePermissions.includes(permission);
}

// Check if user can access a page
export function canAccessPage(userRole: UserRole, page: string): boolean {
  const requiredPermissions = PagePermissions[page] || [];
  if (requiredPermissions.length === 0) return true;

  const userPermissions = RolePermissions[userRole] || [];
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  );
}

// Get accessible pages for a role
export function getAccessiblePages(userRole: UserRole): string[] {
  return Object.keys(PagePermissions).filter((page) =>
    canAccessPage(userRole, page),
  );
}

// Check if user has any of the required permissions
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[],
): boolean {
  const userPermissions = RolePermissions[userRole] || [];
  return permissions.some((permission) => userPermissions.includes(permission));
}
