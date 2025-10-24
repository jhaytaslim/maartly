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
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertTriangle, Mail, Package } from "lucide-react";
import { Progress } from "../components/ui/progress";

const lowStockProducts = [
  {
    id: "PRD-002",
    name: "Wireless Mouse Logitech",
    sku: "LOG-M185-BLK",
    category: "Accessories",
    supplier: "Tech Distributors Ltd",
    currentStock: 5,
    minStock: 20,
    maxStock: 100,
    store: "Main Warehouse",
    status: "Low",
    daysUntilOut: 3,
  },
  {
    id: "PRD-004",
    name: "USB-C Cable 2m",
    sku: "CBL-USBC-2M",
    category: "Accessories",
    supplier: "Cable World",
    currentStock: 3,
    minStock: 50,
    maxStock: 200,
    store: "Store B",
    status: "Critical",
    daysUntilOut: 1,
  },
  {
    id: "PRD-008",
    name: "Keyboard Mechanical",
    sku: "KEY-MECH-RGB",
    category: "Accessories",
    supplier: "Tech Distributors Ltd",
    currentStock: 8,
    minStock: 15,
    maxStock: 75,
    store: "Store A",
    status: "Low",
    daysUntilOut: 5,
  },
];

export function LowStockAlertsPage() {
  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "Low":
        return <Badge variant="secondary">Low Stock</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Low Stock Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and manage low stock inventory
          </p>
        </div>
        <Button>
          <Mail className="h-4 w-4 mr-2" />
          Email Report
        </Button>
      </div>

      {/* Alert Summary */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>12 Products Require Attention</AlertTitle>
        <AlertDescription>
          3 products are critically low and may run out within the next 24-48
          hours. Consider contacting suppliers immediately.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Critical Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-destructive">3</div>
            <p className="text-xs text-muted-foreground">
              Immediate action needed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600">9</div>
            <p className="text-xs text-muted-foreground">
              Below minimum threshold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">12</div>
            <p className="text-xs text-muted-foreground">
              Products requiring restock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Estimated Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">$8,450</div>
            <p className="text-xs text-muted-foreground">Total restock cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle>Products Below Minimum Stock Level</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.map((product) => {
                const stockPercentage = getStockPercentage(
                  product.currentStock,
                  product.maxStock
                );
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.supplier}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.status === "Critical"
                            ? "text-destructive font-semibold"
                            : ""
                        }
                      >
                        {product.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>{product.minStock}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={stockPercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {stockPercentage.toFixed(0)}% of capacity
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{product.store}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact Supplier
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Automated Restock Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Suggested order: {product.maxStock - product.currentStock}{" "}
                      units
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From: {product.supplier}
                    </p>
                  </div>
                </div>
                <Button size="sm">Create Order</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Depletion Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Estimated {product.daysUntilOut} days until out of stock
                  </p>
                </div>
                <Badge
                  variant={
                    product.daysUntilOut <= 2 ? "destructive" : "secondary"
                  }
                >
                  {product.daysUntilOut}d
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
