import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
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
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Plus, Edit, Trash2, Mail, Phone, AlertCircle } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  productsSupplied: number;
  status: string;
  address?: string;
}

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setError("Failed to load suppliers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async (
    formData: Omit<Supplier, "id" | "productsSupplied" | "status">
  ) => {
    try {
      const newSupplier = await api.createSupplier({
        ...formData,
        // status: "Active",
        // productsSupplied: 0,
      });
      setSuppliers((prev) => [...prev, newSupplier]);
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error("Failed to create supplier", {
        classNames: {
          description: "text-red-500", // Example with Tailwind CSS class
        },
        style: {
          color: "red",
        },
        duration: 14000,
      });
      console.error("Failed to create supplier:", err);
      setError("Failed to create supplier. Please try again.");
    }
  };

  const handleUpdateSupplier = async (
    id: string,
    formData: Partial<Supplier>
  ) => {
    try {
      const updated = await api.updateSupplier(id, formData);
      setSuppliers((prev) => prev.map((s) => (s.id === id ? updated : s)));
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error("Failed to update supplier:", err);
      setError("Failed to update supplier. Please try again.");
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await api.deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete supplier:", err);
      setError("Failed to delete supplier. Please try again.");
    }
  };

  const handleContactSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsContactDialogOpen(true);
  };

  const handleCreateOrder = async (orderData: {
    product: string;
    quantity: number;
    notes: string;
  }) => {
    if (!selectedSupplier) return;
    try {
      await api.createOrder({
        supplierId: selectedSupplier.id,
        ...orderData,
      });
      setIsContactDialogOpen(false);
      // Optionally refetch or show success
    } catch (err) {
      console.error("Failed to create order:", err);
      setError("Failed to send order request. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your supplier relationships
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter supplier details below
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input id="supplierName" placeholder="Enter supplier name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Enter contact person"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="supplier@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1-555-0000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Collect form data
                  const name = (
                    document.getElementById("supplierName") as HTMLInputElement
                  )?.value;
                  const contact = (
                    document.getElementById("contactPerson") as HTMLInputElement
                  )?.value;
                  const email = (
                    document.getElementById("email") as HTMLInputElement
                  )?.value;
                  const phone = (
                    document.getElementById("phone") as HTMLInputElement
                  )?.value;
                  const address = (
                    document.getElementById("address") as HTMLTextAreaElement
                  )?.value;
                  if (name && contact && email && phone) {
                    handleCreateSupplier({
                      name,
                      contact,
                      email,
                      phone,
                      address,
                    });
                  }
                }}
              >
                Add Supplier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Low Stock Alert Information */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Low Stock Alert System</AlertTitle>
        <AlertDescription>
          When products reach low stock levels, you can quickly contact
          suppliers to place orders. The system automatically checks warehouse
          capacity before suggesting order quantities.
        </AlertDescription>
      </Alert>

      {suppliers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No suppliers found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {suppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{supplier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {supplier.contact}
                    </p>
                  </div>
                  <Badge>{supplier.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {supplier.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {supplier.phone}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {supplier.productsSupplied} products supplied
                </p>
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  onClick={() => handleContactSupplier(supplier)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact for Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {supplier.phone}
                  </TableCell>
                  <TableCell>{supplier.productsSupplied}</TableCell>
                  <TableCell>
                    <Badge>{supplier.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`edit-supplier-${supplier.id}`}
                        onClick={() => {
                          setEditingSupplier(supplier);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update supplier details below</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Supplier Name</Label>
                <Input
                  id="editName"
                  defaultValue={editingSupplier?.name}
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editContact">Contact Person</Label>
                <Input
                  id="editContact"
                  defaultValue={editingSupplier?.contact}
                  placeholder="Enter contact person"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  defaultValue={editingSupplier?.email}
                  placeholder="supplier@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  defaultValue={editingSupplier?.phone}
                  placeholder="+1-555-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAddress">Address</Label>
              <Textarea
                id="editAddress"
                defaultValue={editingSupplier?.address}
                placeholder="Enter full address"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!editingSupplier) return;
                const name =
                  (document.getElementById("editName") as HTMLInputElement)
                    ?.value || editingSupplier.name;
                const contact =
                  (document.getElementById("editContact") as HTMLInputElement)
                    ?.value || editingSupplier.contact;
                const email =
                  (document.getElementById("editEmail") as HTMLInputElement)
                    ?.value || editingSupplier.email;
                const phone =
                  (document.getElementById("editPhone") as HTMLInputElement)
                    ?.value || editingSupplier.phone;
                const address =
                  (
                    document.getElementById(
                      "editAddress"
                    ) as HTMLTextAreaElement
                  )?.value || editingSupplier.address;
                handleUpdateSupplier(editingSupplier.id, {
                  name,
                  contact,
                  email,
                  phone,
                  address,
                });
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Supplier Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Contact {selectedSupplier?.name} for restocking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Warehouse capacity check: Main Warehouse has 2,155 units of
                available space
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Input id="product" placeholder="Select product" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Order Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    placeholder="0.00"
                    disabled
                  />
                </div>
              </div>

              <Alert variant="destructive" className="hidden">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Capacity Warning</AlertTitle>
                <AlertDescription>
                  Order quantity exceeds available warehouse capacity. Maximum
                  recommended: 2,155 units
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes for the supplier"
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsContactDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const product = (
                  document.getElementById("product") as HTMLInputElement
                )?.value;
                const quantity = parseInt(
                  (document.getElementById("quantity") as HTMLInputElement)
                    ?.value || "0"
                );
                const notes = (
                  document.getElementById("notes") as HTMLTextAreaElement
                )?.value;
                if (product && quantity > 0) {
                  handleCreateOrder({ product, quantity, notes: notes || "" });
                }
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Order Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
