import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  ShoppingCart,
  Search,
  Package,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Store,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { api } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  category?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface TenantInfo {
  id: string;
  businessName: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentMethods: {
    paystack: boolean;
    stripe: boolean;
  };
}

interface CustomerStorefrontProps {
  tenantSlug: string;
}

export function CustomerStorefrontPage({
  tenantSlug,
}: CustomerStorefrontProps) {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "paystack" as "paystack" | "stripe",
  });

  useEffect(() => {
    loadStorefront();
  }, [tenantSlug]);

  const loadStorefront = async () => {
    try {
      setLoading(true);
      // Load tenant info and products
      const [tenantData, productsData] = await Promise.all([
        api.getTenantBySlug(tenantSlug),
        api.getPublicProducts(tenantSlug),
      ]);

      setTenant(tenantData);
      setProducts(productsData);
    } catch (err: any) {
      setError(err.message || "Failed to load storefront");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) return item;
          if (newQuantity > item.stock) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    setProcessingPayment(true);

    try {
      const orderData = {
        tenantSlug,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        customer: {
          name: checkoutData.customerName,
          email: checkoutData.email,
          phone: checkoutData.phone,
          address: checkoutData.address,
        },
        notes: checkoutData.notes,
        paymentMethod: checkoutData.paymentMethod,
        totalAmount: getTotalAmount(),
      };

      // Process payment and create order
      const result = await api.createCustomerOrder(orderData);

      if (result.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = result.paymentUrl;
      } else {
        // Order created successfully
        setOrderSuccess(true);
        setCart([]);
        setShowCheckout(false);

        setTimeout(() => {
          setOrderSuccess(false);
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process order");
    } finally {
      setProcessingPayment(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Store Not Found</CardTitle>
            <CardDescription>
              The store you're looking for doesn't exist or is currently
              unavailable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary">
                <Store className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">
                  {tenant?.businessName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Online Store
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="relative w-full sm:w-auto"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cart.length > 0 && (
                <Badge className="ml-2 absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Success Message */}
      {orderSuccess && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Order placed successfully! You'll receive a confirmation email
              shortly.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery
                ? "No products found matching your search"
                : "No products available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  {product.category && (
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {product.category}
                    </Badge>
                  )}
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Contact Us</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                {tenant?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {tenant.email}
                  </p>
                )}
                {tenant?.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {tenant.phone}
                  </p>
                )}
                {tenant?.address && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {tenant.address}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">About</h3>
              <p className="text-sm text-muted-foreground">
                {tenant?.businessName} - Your trusted online store.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Powered by</h3>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-semibold">Maartly</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
            <DialogDescription>
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b last:border-0"
                >
                  <div className="w-20 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    ${getTotalAmount().toFixed(2)}
                  </span>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCart(false)}
                  className="w-full sm:w-auto"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="w-full sm:w-auto"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your order</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Customer Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={checkoutData.customerName}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        customerName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={checkoutData.email}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={checkoutData.phone}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  value={checkoutData.address}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      address: e.target.value,
                    })
                  }
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={checkoutData.notes}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, notes: e.target.value })
                  }
                  rows={2}
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  {tenant?.paymentMethods.paystack && (
                    <Button
                      type="button"
                      variant={
                        checkoutData.paymentMethod === "paystack"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setCheckoutData({
                          ...checkoutData,
                          paymentMethod: "paystack",
                        })
                      }
                      className="flex-1"
                    >
                      Paystack
                    </Button>
                  )}
                  {tenant?.paymentMethods.stripe && (
                    <Button
                      type="button"
                      variant={
                        checkoutData.paymentMethod === "stripe"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setCheckoutData({
                          ...checkoutData,
                          paymentMethod: "stripe",
                        })
                      }
                      className="flex-1"
                    >
                      Stripe
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCheckout(false);
                setShowCart(true);
              }}
              disabled={processingPayment}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={
                processingPayment ||
                !checkoutData.customerName ||
                !checkoutData.email ||
                !checkoutData.phone ||
                !checkoutData.address
              }
              className="w-full sm:w-auto"
            >
              {processingPayment ? (
                <>Processing...</>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Place Order (${getTotalAmount().toFixed(2)})
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
