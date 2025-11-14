const API_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "http://localhost:3001/api/v1";

class APIService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    this.token = localStorage.getItem("access_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };

    // if (this.token) {
    //   headers = { ...headers, Authorization: `Bearer ${this.token}` };
    // }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Authentication
  async signup(data: {
    businessName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    plan: string;
    slug?: string;
  }) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    const result = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (result.access_token) {
      this.setToken(result.access_token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  }

  async verifyEmail(token: string, password: string) {
    return this.request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  // Alias for verifyEmail (used by verify-account-page)
  async verifyAccount(token: string, password: string) {
    return this.verifyEmail(token, password);
  }

  // Verify token validity (without setting password)
  async verifyToken(token: string) {
    return this.request("/auth/verify-token", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  // Users
  async getUsers() {
    return this.request("/users");
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Products
  async getProducts() {
    return this.request("/products");
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async searchProducts(query: string) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async createProduct(data: any) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Categories
  async getCategories() {
    return this.request("/categories");
  }

  async createCategory(data: any) {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any) {
    return this.request(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Suppliers
  async getSuppliers() {
    return this.request("/suppliers");
  }

  async createSupplier(data: any) {
    return this.request("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSupplier(id: string, data: any) {
    return this.request(`/suppliers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteSupplier(id: string) {
    return this.request(`/suppliers/${id}`, {
      method: "DELETE",
    });
  }

  // Orders
  async getOrders() {
    return this.request("/orders");
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(data: any) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Customers
  async getCustomers() {
    return this.request("/customers");
  }

  async createCustomer(data: any) {
    return this.request("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: any) {
    return this.request(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Dashboard
  async getDashboard() {
    return this.request("/dashboard/overview");
  }

  async getSalesAnalytics(period?: string) {
    return this.request(`/dashboard/sales${period ? `?period=${period}` : ""}`);
  }

  // Offline Sync
  async queueOfflineOperation(data: any) {
    return this.request("/offline-sync/queue", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async processOfflineSync() {
    return this.request("/offline-sync/process", {
      method: "POST",
    });
  }

  async getCachedData() {
    return this.request("/offline-sync/cached-data");
  }

  // Stores
  async getStores() {
    return this.request("/stores");
  }

  async getStore(id: string) {
    return this.request(`/stores/${id}`);
  }

  async createStore(data: any) {
    return this.request("/stores", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateStore(id: string, data: any) {
    return this.request(`/stores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteStore(id: string) {
    return this.request(`/stores/${id}`, {
      method: "DELETE",
    });
  }

  // Tenants
  async getTenants() {
    return this.request("/tenants");
  }

  async getTenant(id: string) {
    return this.request(`/tenants/${id}`);
  }

  async updateTenant(id: string, data: any) {
    return this.request(`/tenants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Customer Storefront (public routes)
  async getStorefrontBySlug(slug: string) {
    return this.request(`/tenants/storefront/${slug}`);
  }

  async getStorefrontProducts(slug: string, params?: any) {
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/tenants/storefront/${slug}/products${queryParams}`);
  }

  // Tenant lookup by slug (for customer storefront)
  async getTenantBySlug(slug: string) {
    return this.getStorefrontBySlug(slug);
  }

  // Public products for customer storefront
  async getPublicProducts(slug: string, params?: any) {
    return this.getStorefrontProducts(slug, params);
  }

  // Create customer order from storefront
  async createCustomerOrder(orderData: any) {
    return this.request("/orders/customer", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // Currency Management
  async getCurrencies() {
    return this.request("/currency");
  }

  async getCurrency(id: string) {
    return this.request(`/currency/${id}`);
  }

  async createCurrency(data: any) {
    return this.request("/currency", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCurrency(id: string, data: any) {
    return this.request(`/currency/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteCurrency(id: string) {
    return this.request(`/currency/${id}`, {
      method: "DELETE",
    });
  }

  async setDefaultCurrency(id: string) {
    return this.request(`/currency/${id}/set-default`, {
      method: "PATCH",
    });
  }

  // Debt Management
  async getDebts() {
    return this.request("/debts");
  }

  async getDebt(id: string) {
    return this.request(`/debts/${id}`);
  }

  async createDebt(data: any) {
    return this.request("/debts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDebt(id: string, data: any) {
    return this.request(`/debts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteDebt(id: string) {
    return this.request(`/debts/${id}`, {
      method: "DELETE",
    });
  }

  async recordDebtPayment(id: string, data: any) {
    return this.request(`/debts/${id}/payment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getDebtsByCustomer(customerId: string) {
    return this.request(`/debts/customer/${customerId}`);
  }

  // Tax Management
  async getTaxes() {
    return this.request("/taxes");
  }

  async getTax(id: string) {
    return this.request(`/taxes/${id}`);
  }

  async createTax(data: any) {
    return this.request("/taxes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTax(id: string, data: any) {
    return this.request(`/taxes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteTax(id: string) {
    return this.request(`/taxes/${id}`, {
      method: "DELETE",
    });
  }

  async setDefaultTax(id: string) {
    return this.request(`/taxes/${id}/set-default`, {
      method: "PATCH",
    });
  }

  // Pricing Plans
  async getPlans() {
    return this.request("/plans");
  }

  async getPlan(id: string) {
    return this.request(`/plans/${id}`);
  }

  async createPlan(data: any) {
    return this.request("/plans", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePlan(id: string, data: any) {
    return this.request(`/plans/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deletePlan(id: string) {
    return this.request(`/plans/${id}`, {
      method: "DELETE",
    });
  }

  // Reports & Analytics
  async getSalesReport(params?: any) {
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/reports/sales${queryParams}`);
  }

  async getInventoryReport(params?: any) {
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/reports/inventory${queryParams}`);
  }

  async getProfitLossReport(params?: any) {
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/reports/profit-loss${queryParams}`);
  }

  async getTopProductsReport(params?: any) {
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/reports/top-products${queryParams}`);
  }

  async getCustomerInsights(params?: any) {
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/reports/customer-insights${queryParams}`);
  }

  async getStorePerformance(params?: any) {
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(`/reports/store-performance${queryParams}`);
  }

  async exportReport(reportType: string, format: string, params?: any) {
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request(
      `/reports/${reportType}/export/${format}${queryParams}`
    );
  }

  // Storefront Management
  async getStorefront() {
    return this.request("/storefront");
  }

  async updateStorefront(data: any) {
    return this.request("/storefront", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async updateStorefrontTheme(data: any) {
    return this.request("/storefront/theme", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async updateStorefrontSEO(data: any) {
    return this.request("/storefront/seo", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async previewStorefront(slug: string) {
    return this.request(`/storefront/preview/${slug}`);
  }
}

export const api = new APIService();
