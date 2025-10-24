import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Users,
  Store,
  CreditCard,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const salesData = [
  { month: "Jun", sales: 42000, orders: 145 },
  { month: "Jul", sales: 58000, orders: 198 },
  { month: "Aug", sales: 67000, orders: 234 },
  { month: "Sep", sales: 71000, orders: 267 },
  { month: "Oct", sales: 85000, orders: 312 },
];

const categoryData = [
  { name: "Electronics", value: 45, color: "#3b82f6" },
  { name: "Furniture", value: 25, color: "#10b981" },
  { name: "Accessories", value: 20, color: "#f59e0b" },
  { name: "Stationery", value: 10, color: "#ef4444" },
];

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$85,240",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: "312",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Products",
      value: "1,245",
      change: "+15",
      trend: "up",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Low Stock Items",
      value: "12",
      change: "+3",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-2024-001",
      customer: "Acme Corporation",
      amount: 1249.95,
      status: "Completed",
    },
    {
      id: "ORD-2024-002",
      customer: "Tech Startup Inc",
      amount: 2599.97,
      status: "Processing",
    },
    {
      id: "ORD-2024-003",
      customer: "Local Business LLC",
      amount: 899.92,
      status: "Pending",
    },
  ];

  const lowStockItems = [
    { name: "Wireless Mouse Logitech", current: 5, minimum: 20, status: "Low" },
    { name: "USB-C Cable 2m", current: 3, minimum: 50, status: "Critical" },
    { name: "Keyboard Mechanical", current: 8, minimum: 15, status: "Low" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your inventory today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp
                  className={`h-3 w-3 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                />
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales ($)" />
                <Bar dataKey="orders" fill="#10b981" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Low Stock */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.amount.toFixed(2)}</p>
                    <Badge
                      variant={
                        order.status === "Completed"
                          ? "default"
                          : order.status === "Processing"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alerts</CardTitle>
            <Badge variant="destructive">12 Items</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {item.current} / Min: {item.minimum}
                    </p>
                  </div>
                  <Badge
                    variant={
                      item.status === "Critical" ? "destructive" : "secondary"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">1,428</div>
            <p className="text-xs text-muted-foreground">+24 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3</div>
            <p className="text-xs text-muted-foreground">All operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Debts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$5,550</div>
            <p className="text-xs text-muted-foreground">
              5 customers with outstanding debt
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
