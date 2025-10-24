import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Download, Receipt, TrendingUp } from "lucide-react";
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
} from "recharts";

const taxByMonth = [
  { month: "Jun", collected: 4200, remitted: 4200 },
  { month: "Jul", collected: 5800, remitted: 5800 },
  { month: "Aug", collected: 6700, remitted: 6200 },
  { month: "Sep", collected: 7100, remitted: 7100 },
  { month: "Oct", collected: 8524, remitted: 7100 },
];

const taxByEmployee = [
  {
    employee: "Jane Doe",
    totalSales: 125000,
    taxCollected: 12500,
    orders: 145,
    avgTaxPerOrder: 86.21,
  },
  {
    employee: "John Smith",
    totalSales: 89000,
    taxCollected: 8900,
    orders: 98,
    avgTaxPerOrder: 90.82,
  },
  {
    employee: "Mike Wilson",
    totalSales: 156000,
    taxCollected: 15600,
    orders: 187,
    avgTaxPerOrder: 83.42,
  },
];

export function TaxManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Tax Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage tax collection and reporting
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2024-10">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-10">October 2024</SelectItem>
              <SelectItem value="2024-09">September 2024</SelectItem>
              <SelectItem value="2024-08">August 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-employee">By Employee</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tax Collected (MTD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">$8,524</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12.5%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tax Remitted (MTD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">$7,100</div>
                <p className="text-xs text-muted-foreground">
                  Last payment: Oct 1
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending Remittance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-yellow-600">$1,424</div>
                <p className="text-xs text-muted-foreground">Due: Oct 15</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Average Tax Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">10.0%</div>
                <p className="text-xs text-muted-foreground">Standard rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Tax Collection Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Collection Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={taxByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="collected"
                    stroke="#3b82f6"
                    name="Tax Collected ($)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="remitted"
                    stroke="#10b981"
                    name="Tax Remitted ($)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Tax Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tax Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Tax Rate</TableHead>
                    <TableHead>Tax Amount</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-10-12</TableCell>
                    <TableCell className="font-medium">ORD-2024-001</TableCell>
                    <TableCell>Acme Corporation</TableCell>
                    <TableCell>$1,124.96</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell>$124.99</TableCell>
                    <TableCell className="font-medium">$1,249.95</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-10-12</TableCell>
                    <TableCell className="font-medium">ORD-2024-002</TableCell>
                    <TableCell>Tech Startup Inc</TableCell>
                    <TableCell>$2,339.98</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell>$259.99</TableCell>
                    <TableCell className="font-medium">$2,599.97</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-10-11</TableCell>
                    <TableCell className="font-medium">ORD-2024-003</TableCell>
                    <TableCell>Local Business LLC</TableCell>
                    <TableCell>$809.93</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell>$89.99</TableCell>
                    <TableCell className="font-medium">$899.92</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-employee" className="space-y-6">
          {/* Employee Tax Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Collection by Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taxByEmployee}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="employee" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="taxCollected"
                    fill="#3b82f6"
                    name="Tax Collected ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Employee Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Tax Collection Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Tax Collected</TableHead>
                    <TableHead>Number of Orders</TableHead>
                    <TableHead>Avg Tax per Order</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxByEmployee.map((emp) => (
                    <TableRow key={emp.employee}>
                      <TableCell className="font-medium">
                        {emp.employee}
                      </TableCell>
                      <TableCell>${emp.totalSales.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">
                        ${emp.taxCollected.toLocaleString()}
                      </TableCell>
                      <TableCell>{emp.orders}</TableCell>
                      <TableCell>${emp.avgTaxPerOrder.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(emp.taxCollected / 15600) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {((emp.taxCollected / 15600) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Tax Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Total Sales (Oct 2024)</p>
                    <p className="text-sm text-muted-foreground">Before tax</p>
                  </div>
                  <p className="text-xl font-semibold">$85,240</p>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Tax Collected</p>
                    <p className="text-sm text-muted-foreground">At 10% rate</p>
                  </div>
                  <p className="text-xl font-semibold">$8,524</p>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Tax Remitted</p>
                    <p className="text-sm text-muted-foreground">
                      Payments made
                    </p>
                  </div>
                  <p className="text-xl font-semibold">$7,100</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Balance Due</p>
                    <p className="text-sm text-muted-foreground">
                      Due by Oct 15
                    </p>
                  </div>
                  <p className="text-xl font-semibold text-yellow-600">
                    $1,424
                  </p>
                </div>
                <Button className="w-full mt-4">
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Full Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">October Filing</p>
                    <p className="text-sm text-muted-foreground">
                      Due: Oct 15, 2024
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Pending
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">September Filing</p>
                    <p className="text-sm text-muted-foreground">
                      Filed: Sep 14, 2024
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Complete
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">August Filing</p>
                    <p className="text-sm text-muted-foreground">
                      Filed: Aug 13, 2024
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Complete
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Filing History
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
