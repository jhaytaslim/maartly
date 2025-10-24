import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  AlertCircle,
  DollarSign,
  TrendingUp,
  CreditCard,
  Mail,
} from "lucide-react";
import { mockDebts } from "../lib/mock-data";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const debtByMonth = [
  { month: "Jun", issued: 3200, collected: 2800, outstanding: 400 },
  { month: "Jul", issued: 4100, collected: 3500, outstanding: 1000 },
  { month: "Aug", issued: 5300, collected: 4200, outstanding: 2100 },
  { month: "Sep", issued: 4800, collected: 3900, outstanding: 3000 },
  { month: "Oct", issued: 5550, collected: 2000, outstanding: 5550 },
];

export function DebtManagementPage() {
  const [debts, setDebts] = useState(mockDebts);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<
    (typeof mockDebts)[0] | null
  >(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Current":
        return <Badge className="bg-green-600">Current</Badge>;
      case "Overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "Paid":
        return <Badge variant="secondary">Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleRecordPayment = (debt: (typeof mockDebts)[0]) => {
    setSelectedDebt(debt);
    setIsPaymentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Debt Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer credit accounts
          </p>
        </div>
        <Button>
          <Mail className="h-4 w-4 mr-2" />
          Send Payment Reminders
        </Button>
      </div>

      {/* Alert for overdue debts */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>1 Overdue Payment</AlertTitle>
        <AlertDescription>
          Small Shop Co has a payment that is 7 days overdue. Consider sending a
          reminder.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Outstanding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-red-600">$5,550</div>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+15.2%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Debts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">$3,700</div>
                <p className="text-xs text-muted-foreground">Not yet due</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Overdue Debts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-red-600">$850</div>
                <p className="text-xs text-muted-foreground">1 customer</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Collection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">87%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Debt Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Debt Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={debtByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="issued"
                    fill="#3b82f6"
                    name="Credit Issued ($)"
                  />
                  <Bar
                    dataKey="collected"
                    fill="#10b981"
                    name="Payments Collected ($)"
                  />
                  <Bar
                    dataKey="outstanding"
                    fill="#ef4444"
                    name="Outstanding ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* All Debts */}
          <Card>
            <CardHeader>
              <CardTitle>All Outstanding Debts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Debt ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell>{debt.id}</TableCell>
                      <TableCell className="font-medium">
                        {debt.customer}
                      </TableCell>
                      <TableCell>{debt.orderId}</TableCell>
                      <TableCell className="font-medium">
                        ${debt.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{debt.dueDate}</TableCell>
                      <TableCell>
                        <span
                          className={
                            debt.daysOverdue > 0
                              ? "text-red-600 font-medium"
                              : "text-green-600"
                          }
                        >
                          {debt.daysOverdue > 0
                            ? `${debt.daysOverdue} days`
                            : "On time"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(debt.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRecordPayment(debt)}
                          >
                            Record Payment
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Debts (Not Yet Due)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Debt ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Until Due</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts
                    .filter((d) => d.status === "Current")
                    .map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>{debt.id}</TableCell>
                        <TableCell className="font-medium">
                          {debt.customer}
                        </TableCell>
                        <TableCell>{debt.orderId}</TableCell>
                        <TableCell className="font-medium">
                          ${debt.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{debt.dueDate}</TableCell>
                        <TableCell className="text-green-600">
                          {Math.max(0, 14 - debt.daysOverdue)} days
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRecordPayment(debt)}
                          >
                            Record Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Debts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Debt ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts
                    .filter((d) => d.status === "Overdue")
                    .map((debt) => (
                      <TableRow key={debt.id} className="bg-red-50">
                        <TableCell>{debt.id}</TableCell>
                        <TableCell className="font-medium">
                          {debt.customer}
                        </TableCell>
                        <TableCell>{debt.orderId}</TableCell>
                        <TableCell className="font-medium text-red-600">
                          ${debt.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{debt.dueDate}</TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {debt.daysOverdue} days
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRecordPayment(debt)}
                            >
                              Record Payment
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Mail className="h-3 w-3 mr-1" />
                              Send Reminder
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Payment from Acme Corporation</p>
                    <p className="text-sm text-muted-foreground">
                      Oct 10, 2024 • Order: ORD-2024-045
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+$1,500</p>
                    <Badge className="bg-green-600 mt-1">Completed</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Payment from Tech Startup Inc</p>
                    <p className="text-sm text-muted-foreground">
                      Oct 8, 2024 • Order: ORD-2024-038
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+$850</p>
                    <Badge className="bg-green-600 mt-1">Completed</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">
                      Payment from Local Business LLC
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Oct 5, 2024 • Order: ORD-2024-029
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+$650</p>
                    <Badge className="bg-green-600 mt-1">Completed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Record Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {selectedDebt?.customer}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Debt ID:</span>
                <span className="font-medium">{selectedDebt?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Amount:
                </span>
                <span className="font-medium">
                  ${selectedDebt?.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount</Label>
              <Input
                id="paymentAmount"
                type="number"
                placeholder="0.00"
                defaultValue={selectedDebt?.amount}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select className="w-full border rounded-md p-2">
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Digital Wallet</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input id="paymentDate" type="date" defaultValue="2024-10-12" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsPaymentDialogOpen(false)}>
              <DollarSign className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
