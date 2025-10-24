import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Printer,
  ScanLine,
  Monitor,
  CreditCard,
  Wallet,
  Banknote,
} from "lucide-react";
import { mockOrders } from "../lib/mock-data";
import { Separator } from "../components/ui/separator";

const mockProductsList = [
  { id: "P001", name: "Laptop HP ProBook", price: 899.99, sku: "HPL-450" },
  { id: "P002", name: "Wireless Mouse", price: 19.99, sku: "LOG-M185" },
  { id: "P003", name: "Office Chair", price: 249.99, sku: "OFF-CH-01" },
  { id: "P004", name: "USB-C Cable", price: 12.99, sku: "CBL-USBC" },
  { id: "P005", name: 'Monitor Dell 27"', price: 549.99, sku: "DEL-MON-27" },
];

export function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScanToSellOpen, setIsScanToSellOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<
    (typeof mockOrders)[0] | null
  >(null);
  const [scannedProducts, setScannedProducts] = useState<any[]>([]);
  const [scanInput, setScanInput] = useState("");

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-600">Paid</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "Processing":
        return <Badge className="bg-blue-600">Processing</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handlePrintReceipt = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order);
    setIsReceiptDialogOpen(true);
  };

  const handleScanProduct = () => {
    if (!scanInput.trim()) return;

    const product = mockProductsList.find(
      (p) =>
        p.sku.toLowerCase() === scanInput.toLowerCase() ||
        p.id.toLowerCase() === scanInput.toLowerCase()
    );

    if (product) {
      const existing = scannedProducts.find((p) => p.id === product.id);
      if (existing) {
        setScannedProducts(
          scannedProducts.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        );
      } else {
        setScannedProducts([...scannedProducts, { ...product, quantity: 1 }]);
      }
      setScanInput("");
    }
  };

  const removeScannedProduct = (id: string) => {
    setScannedProducts(scannedProducts.filter((p) => p.id !== id));
  };

  const scannedTotal = scannedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const scannedTax = scannedTotal * 0.1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Order Management</h1>
          <p className="text-muted-foreground">
            Manage sales orders and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsScanToSellOpen(true)}>
            <ScanLine className="h-4 w-4 mr-2" />
            Scan to Sell
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>
                  Add products and process payment
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cus1">Acme Corporation</SelectItem>
                        <SelectItem value="cus2">Tech Startup Inc</SelectItem>
                        <SelectItem value="cus3">Local Business LLC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee">Sales Person</Label>
                    <Input id="employee" value="Jane Doe" disabled />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Add Products</Label>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prod1">
                          Laptop HP ProBook 450 - $899.99
                        </SelectItem>
                        <SelectItem value="prod2">
                          Wireless Mouse - $19.99
                        </SelectItem>
                        <SelectItem value="prod3">
                          Monitor Dell 27" - $549.99
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Qty" className="w-20" />
                    <Button>Add</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="mb-3">Order Items</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        No items added yet
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <CreditCard className="h-6 w-6 mb-1" />
                      <span>Card</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Banknote className="h-6 w-6 mb-1" />
                      <span>Cash</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Wallet className="h-6 w-6 mb-1" />
                      <span>Digital Wallet</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <CreditCard className="h-6 w-6 mb-1" />
                      <span>Credit</span>
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%):</span>
                      <span>$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Complete Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">312</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$85,240</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">8</div>
            <p className="text-xs text-muted-foreground">$5,550 outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Credit Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">15</div>
            <p className="text-xs text-muted-foreground">
              Active credit accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePrintReceipt(order)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Scan to Sell Dialog */}
      <Dialog
        open={isScanToSellOpen}
        onOpenChange={(open) => {
          setIsScanToSellOpen(open);
          if (!open) {
            setScannedProducts([]);
            setScanInput("");
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Scan to Sell</DialogTitle>
            <DialogDescription>
              Scan product QR codes or barcodes to add to cart
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <ScanLine className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Position product QR code or barcode in front of camera
                </p>
                <Input
                  placeholder="Enter SKU or Product ID..."
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleScanProduct();
                    }
                  }}
                  className="mb-4"
                  autoFocus
                />
                <Button onClick={handleScanProduct}>Add to Cart</Button>
              </div>
              <div className="space-y-2">
                <Label>Quick Add (Test)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {mockProductsList.slice(0, 4).map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setScanInput(product.sku);
                        setTimeout(() => handleScanProduct(), 100);
                      }}
                    >
                      {product.sku}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4>Scanned Items</h4>
                <Monitor className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-2 min-h-[200px] max-h-[300px] overflow-auto">
                {scannedProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center mt-8">
                    No items scanned yet
                  </p>
                ) : (
                  scannedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.quantity} × ${product.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          ${(product.price * product.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeScannedProduct(product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${scannedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${scannedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${(scannedTotal + scannedTax).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsScanToSellOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={scannedProducts.length === 0}>
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          <div className="bg-white text-black p-6 font-mono text-sm">
            <div className="text-center border-b-2 border-dashed pb-4 mb-4">
              <h2 className="font-bold">STOCKLY</h2>
              <p className="text-xs">Inventory Management System</p>
              <p className="text-xs">123 Business St, Suite 100</p>
              <p className="text-xs">Phone: +1-555-0000</p>
            </div>

            {selectedOrder && (
              <>
                <div className="mb-4 text-xs">
                  <p>Order: {selectedOrder.id}</p>
                  <p>Date: {selectedOrder.date}</p>
                  <p>Customer: {selectedOrder.customer}</p>
                  <p>Served by: {selectedOrder.employee}</p>
                </div>

                <div className="border-t border-b border-dashed py-2 mb-2">
                  <div className="flex justify-between mb-1">
                    <span>Items ({selectedOrder.items})</span>
                    <span>
                      ${(selectedOrder.total - selectedOrder.tax).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold mb-4">
                  <span>TOTAL</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>

                <div className="text-xs mb-4">
                  <p>Payment: {selectedOrder.paymentMethod}</p>
                  <p>Status: {selectedOrder.paymentStatus}</p>
                </div>
              </>
            )}

            <div className="border-t-2 border-dashed pt-4 text-center text-xs">
              <p>Thank you for your business!</p>
              <p className="mt-2">Returns accepted within 30 days</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReceiptDialogOpen(false)}
            >
              Close
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
