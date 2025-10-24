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
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Plus, Edit, Trash2, Store, MapPin } from "lucide-react";
import { mockStores } from "../lib/mock-data";
import { Progress } from "../components/ui/progress";

export function StoresPage() {
  const [stores, setStores] = useState(mockStores);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const toggleStoreStatus = (storeId: string) => {
    setStores(
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              status: store.status === "Active" ? "Inactive" : "Active",
            }
          : store
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Store Management</h1>
          <p className="text-muted-foreground">
            Manage your store locations and capacity
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>Enter store details below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" placeholder="Enter store name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter full address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager">Store Manager</Label>
                  <Input id="manager" placeholder="Enter manager name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1-555-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Storage Capacity</Label>
                  <Input id="capacity" type="number" placeholder="0" />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of items
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch id="status" defaultChecked />
                    <Label htmlFor="status">Active</Label>
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
                Add Store
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3</div>
            <p className="text-xs text-muted-foreground">All locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">3</div>
            <p className="text-xs text-muted-foreground">100% operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">18,000</div>
            <p className="text-xs text-muted-foreground">
              Items across all stores
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">74%</div>
            <p className="text-xs text-muted-foreground">
              Average capacity used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Store Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stores.map((store) => {
          const utilizationPercent =
            (store.currentStock / store.capacity) * 100;

          return (
            <Card key={store.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{store.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {store.manager}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(store.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {store.address}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">
                      {store.currentStock.toLocaleString()} /{" "}
                      {store.capacity.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={utilizationPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {utilizationPercent.toFixed(1)}% utilized
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Available space
                  </span>
                  <span className="font-medium">
                    {(store.capacity - store.currentStock).toLocaleString()}{" "}
                    items
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={store.status === "Active"}
                      onCheckedChange={() => toggleStoreStatus(store.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Store List */}
      <Card>
        <CardHeader>
          <CardTitle>Store Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => {
                const utilizationPercent =
                  (store.currentStock / store.capacity) * 100;

                return (
                  <TableRow key={store.id}>
                    <TableCell>{store.id}</TableCell>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {store.address}
                    </TableCell>
                    <TableCell>{store.manager}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {store.phone}
                    </TableCell>
                    <TableCell>{store.capacity.toLocaleString()}</TableCell>
                    <TableCell>{store.currentStock.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
                          <div
                            className={`h-2 rounded-full ${
                              utilizationPercent > 90
                                ? "bg-red-600"
                                : utilizationPercent > 70
                                ? "bg-yellow-600"
                                : "bg-green-600"
                            }`}
                            style={{ width: `${utilizationPercent}%` }}
                          />
                        </div>
                        <span className="text-sm">
                          {utilizationPercent.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(store.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={store.status === "Active"}
                          onCheckedChange={() => toggleStoreStatus(store.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
