import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Search,
  ShoppingCart,
  CreditCard,
  Wallet,
  Banknote,
  Trash2,
  Plus,
  Minus,
  Printer,
  User,
  Clock,
  RotateCcw,
  Save,
  X,
  List,
  Table2,
  ScanLine,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  discount?: number;
}

const mockProducts = [
  {
    id: "P001",
    name: "Laptop HP ProBook",
    price: 899.99,
    sku: "HPL-450",
    category: "Electronics",
    stock: 45,
    image: "💻",
  },
  {
    id: "P002",
    name: "Wireless Mouse",
    price: 19.99,
    sku: "LOG-M185",
    category: "Accessories",
    stock: 5,
    image: "🖱️",
  },
  {
    id: "P003",
    name: "Office Chair",
    price: 249.99,
    sku: "OFF-CH-01",
    category: "Furniture",
    stock: 120,
    image: "🪑",
  },
  {
    id: "P004",
    name: "USB-C Cable",
    price: 12.99,
    sku: "CBL-USBC",
    category: "Accessories",
    stock: 3,
    image: "🔌",
  },
  {
    id: "P005",
    name: 'Monitor Dell 27"',
    price: 549.99,
    sku: "DEL-MON-27",
    category: "Electronics",
    stock: 28,
    image: "🖥️",
  },
  {
    id: "P006",
    name: "Keyboard RGB",
    price: 79.99,
    sku: "KEY-RGB-01",
    category: "Accessories",
    stock: 15,
    image: "⌨️",
  },
  {
    id: "P007",
    name: "Desk Lamp LED",
    price: 34.99,
    sku: "LAMP-LED-01",
    category: "Furniture",
    stock: 42,
    image: "💡",
  },
  {
    id: "P008",
    name: "Notebook Pack",
    price: 8.99,
    sku: "NOTE-A4-10",
    category: "Stationery",
    stock: 200,
    image: "📓",
  },
];

interface HeldOrder {
  id: string;
  cart: CartItem[];
  customer: string | null;
  timestamp: number;
}

export function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customer, setCustomer] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "cash" | "wallet" | "credit" | null
  >(null);
  const [cashReceived, setCashReceived] = useState("");
  const [orderId, setOrderId] = useState("");
  const [cartViewMode, setCartViewMode] = useState<"list" | "compact">("list");
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [isHeldOrdersOpen, setIsHeldOrdersOpen] = useState(false);
  const [isScanModeOpen, setIsScanModeOpen] = useState(false);
  const [scanInput, setScanInput] = useState("");

  const categories = [
    "All",
    "Electronics",
    "Accessories",
    "Furniture",
    "Stationery",
  ];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: (typeof mockProducts)[0]) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          sku: product.sku,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
  };

  const holdOrder = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    const heldOrder: HeldOrder = {
      id: `HOLD-${Date.now()}`,
      cart: [...cart],
      customer,
      timestamp: Date.now(),
    };
    setHeldOrders([...heldOrders, heldOrder]);
    clearCart();
    toast.success("Order held successfully");
  };

  const retrieveHeldOrder = (heldOrder: HeldOrder) => {
    setCart(heldOrder.cart);
    setCustomer(heldOrder.customer);
    setHeldOrders(heldOrders.filter((o) => o.id !== heldOrder.id));
    setIsHeldOrdersOpen(false);
    toast.success("Order retrieved");
  };

  const deleteHeldOrder = (orderId: string) => {
    setHeldOrders(heldOrders.filter((o) => o.id !== orderId));
    toast.success("Held order deleted");
  };

  const handleScanInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const product = mockProducts.find(
      (p) =>
        p.sku.toLowerCase() === scanInput.toLowerCase() ||
        p.id.toLowerCase() === scanInput.toLowerCase()
    );

    if (product) {
      addToCart(product);
      toast.success(`Added ${product.name} to cart`);
      setScanInput("");
    } else {
      toast.error("Product not found");
    }
  };

  // Auto-focus scan input when scan mode opens
  useEffect(() => {
    if (isScanModeOpen) {
      const timer = setTimeout(() => {
        const input = document.getElementById("scan-input");
        if (input) input.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isScanModeOpen]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const completeTransaction = () => {
    const newOrderId = `ORD-${Date.now()}`;
    setOrderId(newOrderId);
    setIsCheckoutOpen(false);
    setIsReceiptOpen(true);
    // In real app, save transaction here
  };

  const cashChange = cashReceived ? parseFloat(cashReceived) - total : 0;

  return (
    <div className="h-full flex gap-4">
      {/* Left Side - Product Selection */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Search and Categories */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-12"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat)}
                    size="sm"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="text-4xl text-center mb-2">
                    {product.image}
                  </div>
                  <h4 className="text-sm mb-1 line-clamp-2">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.sku}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">${product.price}</span>
                    {product.stock < 10 && (
                      <Badge variant="destructive" className="text-xs">
                        {product.stock} left
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Sale</CardTitle>
              <Button variant="ghost" size="icon" onClick={clearCart}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 pt-0">
            {/* Customer Selection & Cart View Toggle */}
            <div className="mb-4 space-y-2">
              {customer ? (
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{customer}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCustomer(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCustomer("Walk-in Customer")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              )}

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-muted p-1 rounded">
                <Button
                  variant={cartViewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setCartViewMode("list")}
                >
                  <List className="h-3 w-3 mr-1" />
                  List
                </Button>
                <Button
                  variant={cartViewMode === "compact" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setCartViewMode("compact")}
                >
                  <Table2 className="h-3 w-3 mr-1" />
                  Table
                </Button>
              </div>
            </div>

            <Separator className="mb-3" />

            {/* Cart Items */}
            <div className="flex-1 overflow-auto mb-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-2" />
                  <p className="text-sm">Cart is empty</p>
                  <p className="text-xs">Add items to start</p>
                </div>
              ) : cartViewMode === "list" ? (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium">{item.name}</h5>
                          <p className="text-xs text-muted-foreground">
                            {item.sku}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            ${item.price} each
                          </div>
                          <div className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2 text-xs">Item</th>
                        <th className="text-center p-2 text-xs w-20">Qty</th>
                        <th className="text-right p-2 text-xs w-20">Total</th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2">
                            <div className="font-medium text-xs">
                              {item.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${item.price}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-2 w-2" />
                              </Button>
                              <span className="w-6 text-center text-xs">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-2 w-2" />
                              </Button>
                            </div>
                          </td>
                          <td className="p-2 text-right font-medium text-xs">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={holdOrder}
                disabled={cart.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Hold
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            <Button
              className="w-full mt-2 h-12"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Checkout - ${total.toFixed(2)}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScanModeOpen(true)}
          >
            <ScanLine className="h-4 w-4 mr-1" />
            Scan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHeldOrdersOpen(true)}
            className="relative"
          >
            <Clock className="h-4 w-4 mr-1" />
            Held
            {heldOrders.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                {heldOrders.length}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm">
            Returns
          </Button>
        </div>
      </div>

      {/* Scan Mode Dialog */}
      <Dialog open={isScanModeOpen} onOpenChange={setIsScanModeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Product</DialogTitle>
            <DialogDescription>
              Scan barcode or enter SKU/Product ID manually
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScanInput} className="space-y-4">
            <div className="p-8 border-2 border-dashed rounded-lg text-center">
              <ScanLine className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Position barcode in front of scanner or enter manually
              </p>
              <Input
                id="scan-input"
                placeholder="Scan or enter SKU/Product ID..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="text-center"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Available products for testing:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {mockProducts.slice(0, 4).map((p) => (
                  <Button
                    key={p.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setScanInput(p.sku);
                      setTimeout(
                        () => handleScanInput(new Event("submit") as any),
                        100
                      );
                    }}
                  >
                    {p.sku}
                  </Button>
                ))}
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsScanModeOpen(false);
                setScanInput("");
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Held Orders Dialog */}
      <Dialog open={isHeldOrdersOpen} onOpenChange={setIsHeldOrdersOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Held Orders</DialogTitle>
            <DialogDescription>
              {heldOrders.length} order(s) on hold
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-auto">
            {heldOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2" />
                <p>No held orders</p>
              </div>
            ) : (
              heldOrders.map((order) => {
                const orderTotal = order.cart.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );
                return (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer || "Walk-in Customer"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${orderTotal.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.cart.length} item(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => retrieveHeldOrder(order)}
                        >
                          Retrieve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteHeldOrder(order.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsHeldOrdersOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Total Amount: ${total.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="payment" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="details">Order Details</TabsTrigger>
            </TabsList>

            <TabsContent value="payment" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  className="h-24 flex flex-col"
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="h-8 w-8 mb-2" />
                  <span>Card</span>
                </Button>
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  className="h-24 flex flex-col"
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote className="h-8 w-8 mb-2" />
                  <span>Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === "wallet" ? "default" : "outline"}
                  className="h-24 flex flex-col"
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <Wallet className="h-8 w-8 mb-2" />
                  <span>Digital Wallet</span>
                </Button>
                <Button
                  variant={paymentMethod === "credit" ? "default" : "outline"}
                  className="h-24 flex flex-col"
                  onClick={() => setPaymentMethod("credit")}
                >
                  <CreditCard className="h-8 w-8 mb-2" />
                  <span>Credit</span>
                </Button>
              </div>

              {paymentMethod === "cash" && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cash Received</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>
                  {cashReceived && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Total:
                        </span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Cash Received:
                        </span>
                        <span className="font-medium">
                          ${parseFloat(cashReceived).toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Change:</span>
                        <span
                          className={`text-lg font-bold ${
                            cashChange < 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          ${Math.abs(cashChange).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Quick Cash Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 50, 100].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setCashReceived(amount.toString())}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm">Ready to accept card payment</p>
                  <p className="text-xs text-muted-foreground">
                    Insert, tap, or swipe card
                  </p>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <Wallet className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm">Scan QR code or tap device</p>
                  <p className="text-xs text-muted-foreground">
                    Apple Pay, Google Pay accepted
                  </p>
                </div>
              )}

              {paymentMethod === "credit" && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium">Customer Credit Sale</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Customer: {customer || "Not selected"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Payment due within 14 days
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between p-2 border-b"
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={completeTransaction}
              disabled={
                !paymentMethod || (paymentMethod === "cash" && cashChange < 0)
              }
            >
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Complete</DialogTitle>
          </DialogHeader>
          <div className="bg-white text-black p-6 font-mono text-sm">
            <div className="text-center border-b-2 border-dashed pb-4 mb-4">
              <h2 className="font-bold">STOCKLY</h2>
              <p className="text-xs">Inventory Management System</p>
              <p className="text-xs">123 Business St, Suite 100</p>
            </div>

            <div className="mb-4 text-xs">
              <p>Order: {orderId}</p>
              <p>Date: {new Date().toLocaleString()}</p>
              <p>Customer: {customer || "Walk-in"}</p>
              <p>Payment: {paymentMethod?.toUpperCase()}</p>
            </div>

            <div className="border-t border-b border-dashed py-2 mb-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between mb-1 text-xs"
                >
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mb-2 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold mb-4">
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {paymentMethod === "cash" && cashReceived && (
              <div className="mb-4 text-xs">
                <div className="flex justify-between">
                  <span>Cash:</span>
                  <span>${parseFloat(cashReceived).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span>${cashChange.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="border-t-2 border-dashed pt-4 text-center text-xs">
              <p>Thank you for your business!</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReceiptOpen(false);
                clearCart();
                setPaymentMethod(null);
                setCashReceived("");
              }}
            >
              New Sale
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
