import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Check,
  CreditCard,
  Smartphone,
  DollarSign,
  Globe,
  MapPin,
  Plus,
  Edit,
  Eye,
  Download,
} from "lucide-react";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const initialPlans = [
  {
    id: "plan-1",
    name: "Starter",
    price: 29,
    description: "Perfect for small businesses",
    features: [
      "1 Store Location",
      "Up to 500 Products",
      "Basic Inventory Management",
      "Sales Reports",
      "Email Support",
      "1 User Account",
    ],
    popular: false,
  },
  {
    id: "plan-2",
    name: "Professional",
    price: 79,
    description: "For growing businesses",
    features: [
      "3 Store Locations",
      "Up to 2,000 Products",
      "Advanced Inventory Management",
      "Multi-store Transfers",
      "Low Stock Alerts",
      "Tax Management",
      "Priority Support",
      "5 User Accounts",
      "QR Code Generation",
    ],
    popular: true,
  },
  {
    id: "plan-3",
    name: "Enterprise",
    price: 199,
    description: "For large operations",
    features: [
      "Unlimited Store Locations",
      "Unlimited Products",
      "Full Feature Access",
      "Advanced Analytics",
      "API Access",
      "Custom Integrations",
      "Dedicated Support",
      "Unlimited Users",
      "White Label Option",
      "Custom Training",
    ],
    popular: false,
  },
];

const initialPaymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Accept all major cards",
    vendors: ["Paystack", "Stripe"],
    fees: "2.9% + $0.30",
    enabled: true,
    apiKey: "",
    secretKey: "",
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: Smartphone,
    description: "Apple Pay, Google Pay",
    vendors: ["Stripe"],
    fees: "2.9% + $0.30",
    enabled: true,
    apiKey: "",
    secretKey: "",
  },
  {
    id: "cash",
    name: "Cash",
    icon: DollarSign,
    description: "Traditional cash payments",
    vendors: ["Direct"],
    fees: "No fees",
    enabled: true,
    apiKey: "",
    secretKey: "",
  },
];

const mockInvoices = [
  {
    id: "INV-2024-010",
    date: "2024-10-12",
    amount: 79.0,
    status: "Paid",
    plan: "Professional",
    period: "Oct 2024",
  },
  {
    id: "INV-2024-009",
    date: "2024-09-12",
    amount: 79.0,
    status: "Paid",
    plan: "Professional",
    period: "Sep 2024",
  },
  {
    id: "INV-2024-008",
    date: "2024-08-12",
    amount: 79.0,
    status: "Paid",
    plan: "Professional",
    period: "Aug 2024",
  },
  {
    id: "INV-2024-007",
    date: "2024-07-12",
    amount: 79.0,
    status: "Paid",
    plan: "Professional",
    period: "Jul 2024",
  },
  {
    id: "INV-2024-006",
    date: "2024-06-12",
    amount: 79.0,
    status: "Paid",
    plan: "Professional",
    period: "Jun 2024",
  },
];

export function PricingPlansPage() {
  const [plans, setPlans] = useState(initialPlans);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isInvoicesOpen, setIsInvoicesOpen] = useState(false);
  const [isInvoiceDetailOpen, setIsInvoiceDetailOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    (typeof initialPaymentMethods)[0] | null
  >(null);
  const [selectedInvoice, setSelectedInvoice] = useState<
    (typeof mockInvoices)[0] | null
  >(null);
  const [editingPlan, setEditingPlan] = useState<
    (typeof initialPlans)[0] | null
  >(null);
  const [newPlanData, setNewPlanData] = useState({
    name: "",
    price: 0,
    description: "",
    features: "",
  });

  const handleConfigurePayment = (
    method: (typeof initialPaymentMethods)[0]
  ) => {
    setSelectedPaymentMethod(method);
    setIsConfigureOpen(true);
  };

  const savePaymentConfig = () => {
    if (selectedPaymentMethod) {
      setPaymentMethods(
        paymentMethods.map((m) =>
          m.id === selectedPaymentMethod.id ? selectedPaymentMethod : m
        )
      );
    }
    setIsConfigureOpen(false);
    setSelectedPaymentMethod(null);
  };

  const viewInvoiceDetail = (invoice: (typeof mockInvoices)[0]) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDetailOpen(true);
  };

  const handleAddPlan = () => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      name: newPlanData.name,
      price: newPlanData.price,
      description: newPlanData.description,
      features: newPlanData.features.split("\n").filter((f) => f.trim()),
      popular: false,
    };
    setPlans([...plans, newPlan]);
    setIsAddPlanOpen(false);
    setNewPlanData({ name: "", price: 0, description: "", features: "" });
  };

  const handleEditPlan = (plan: (typeof initialPlans)[0]) => {
    setEditingPlan(plan);
    setIsEditPlanOpen(true);
  };

  const savePlanEdit = () => {
    if (editingPlan) {
      setPlans(plans.map((p) => (p.id === editingPlan.id ? editingPlan : p)));
    }
    setIsEditPlanOpen(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Pricing Plans</h1>
        <p className="text-muted-foreground">
          Choose the perfect plan for your business
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing">Billing Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          {/* Admin Controls */}
          <div className="flex justify-end">
            <Button onClick={() => setIsAddPlanOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Plan
            </Button>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={plan.popular ? "border-primary shadow-lg" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      {plan.popular && (
                        <Badge className="bg-primary">Popular</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.popular ? "Get Started" : "Choose Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>All Plans Include</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Secure Cloud Storage</p>
                    <p className="text-sm text-muted-foreground">
                      Your data is always backed up
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Mobile App Access</p>
                    <p className="text-sm text-muted-foreground">
                      iOS and Android apps included
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Regular Updates</p>
                    <p className="text-sm text-muted-foreground">
                      New features added monthly
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported Payment Methods</CardTitle>
              <CardDescription>
                Accept payments from customers using multiple methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-start gap-4 border-b pb-6 last:border-0 last:pb-0"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{method.name}</h4>
                      <Switch checked={method.enabled} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {method.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Vendors:</span>
                        {method.vendors.map((vendor, idx) => (
                          <Badge key={idx} variant="outline">
                            {vendor}
                          </Badge>
                        ))}
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-sm text-muted-foreground">
                        Fees: {method.fees}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleConfigurePayment(method)}
                  >
                    Configure
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Vendors */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Paystack</CardTitle>
                    <CardDescription>
                      Primary for Local Payments
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    Optimized for payments in Nigeria and African markets
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Local bank transfers</li>
                    <li>• Mobile money</li>
                    <li>• USSD payments</li>
                    <li>• Card payments</li>
                  </ul>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    Status: <Badge className="bg-green-600">Active</Badge>
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  View Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Stripe</CardTitle>
                    <CardDescription>
                      Primary for International Payments
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    Global payment processing for international customers
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Credit/Debit cards</li>
                    <li>• Apple Pay & Google Pay</li>
                    <li>• Bank transfers</li>
                    <li>• 135+ currencies</li>
                  </ul>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    Status: <Badge className="bg-green-600">Active</Badge>
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3>Professional Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Billed monthly
                    </p>
                  </div>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">$79.00/month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Next Billing Date:
                    </span>
                    <span className="font-medium">November 12, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Payment Method:
                    </span>
                    <span className="font-medium">Card ending in 4242</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payment History</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsInvoicesOpen(true)}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInvoices.slice(0, 3).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between pb-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{invoice.period}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.date}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="font-medium">
                            ${invoice.amount.toFixed(2)}
                          </p>
                          <Badge className="bg-green-600 mt-1">
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewInvoiceDetail(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Configure Payment Method Dialog */}
      <Dialog open={isConfigureOpen} onOpenChange={setIsConfigureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedPaymentMethod?.name}</DialogTitle>
            <DialogDescription>
              Enter your payment gateway credentials
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enable Payment Method</Label>
              <Switch
                id="enabled"
                checked={selectedPaymentMethod?.enabled}
                onCheckedChange={(checked) => {
                  if (selectedPaymentMethod) {
                    setSelectedPaymentMethod({
                      ...selectedPaymentMethod,
                      enabled: checked,
                    });
                  }
                }}
              />
            </div>
            {selectedPaymentMethod?.id !== "cash" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key / Public Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="pk_test_xxxxx..."
                    value={selectedPaymentMethod?.apiKey}
                    onChange={(e) => {
                      if (selectedPaymentMethod) {
                        setSelectedPaymentMethod({
                          ...selectedPaymentMethod,
                          apiKey: e.target.value,
                        });
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretKey">Secret Key</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    placeholder="sk_test_xxxxx..."
                    value={selectedPaymentMethod?.secretKey}
                    onChange={(e) => {
                      if (selectedPaymentMethod) {
                        setSelectedPaymentMethod({
                          ...selectedPaymentMethod,
                          secretKey: e.target.value,
                        });
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigureOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePaymentConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Invoices Dialog */}
      <Dialog open={isInvoicesOpen} onOpenChange={setIsInvoicesOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>All Invoices</DialogTitle>
            <DialogDescription>
              View and download your billing history
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.period}</TableCell>
                    <TableCell>{invoice.plan}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-600">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewInvoiceDetail(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvoicesOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Detail Dialog */}
      <Dialog open={isInvoiceDetailOpen} onOpenChange={setIsInvoiceDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice ID</p>
                    <p className="font-medium">{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedInvoice.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Billing Period
                    </p>
                    <p className="font-medium">{selectedInvoice.period}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-green-600">
                      {selectedInvoice.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Plan: {selectedInvoice.plan}</span>
                  <span className="text-sm">
                    ${selectedInvoice.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tax (0%)
                  </span>
                  <span className="text-sm text-muted-foreground">$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    ${selectedInvoice.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Payment Method: Card ending in 4242
                  <br />
                  Charged on: {selectedInvoice.date}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInvoiceDetailOpen(false)}
            >
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Plan Dialog */}
      <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
            <DialogDescription>
              Create a new subscription plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                placeholder="e.g., Business"
                value={newPlanData.name}
                onChange={(e) =>
                  setNewPlanData({ ...newPlanData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planPrice">Monthly Price ($)</Label>
              <Input
                id="planPrice"
                type="number"
                placeholder="0"
                value={newPlanData.price}
                onChange={(e) =>
                  setNewPlanData({
                    ...newPlanData,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planDescription">Description</Label>
              <Input
                id="planDescription"
                placeholder="Short description"
                value={newPlanData.description}
                onChange={(e) =>
                  setNewPlanData({
                    ...newPlanData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planFeatures">Features (one per line)</Label>
              <Textarea
                id="planFeatures"
                rows={5}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                value={newPlanData.features}
                onChange={(e) =>
                  setNewPlanData({ ...newPlanData, features: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPlanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPlan}>Add Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>Update plan details</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editPlanName">Plan Name</Label>
                <Input
                  id="editPlanName"
                  value={editingPlan.name}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPlanPrice">Monthly Price ($)</Label>
                <Input
                  id="editPlanPrice"
                  type="number"
                  value={editingPlan.price}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPlanDescription">Description</Label>
                <Input
                  id="editPlanDescription"
                  value={editingPlan.description}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="editPopular">Mark as Popular</Label>
                <Switch
                  id="editPopular"
                  checked={editingPlan.popular}
                  onCheckedChange={(checked) =>
                    setEditingPlan({ ...editingPlan, popular: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPlanOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePlanEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
