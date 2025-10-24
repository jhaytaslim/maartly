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
  ArrowRightLeft,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Textarea } from "../components/ui/textarea";

const mockTransfers = [
  {
    id: "TRF-001",
    product: "Laptop HP ProBook 450",
    fromStore: "Main Warehouse",
    toStore: "Store A",
    quantity: 10,
    requestedBy: "Jane Doe",
    date: "2024-10-12",
    status: "Completed",
  },
  {
    id: "TRF-002",
    product: "Office Chair Ergonomic",
    fromStore: "Store A",
    toStore: "Store B",
    quantity: 5,
    requestedBy: "John Smith",
    date: "2024-10-12",
    status: "In Transit",
  },
  {
    id: "TRF-003",
    product: 'Monitor Dell 27" 4K',
    fromStore: "Main Warehouse",
    toStore: "Store B",
    quantity: 3,
    requestedBy: "Mike Wilson",
    date: "2024-10-11",
    status: "Pending",
  },
];

export function ProductTransferPage() {
  const [transfers, setTransfers] = useState(mockTransfers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "In Transit":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "In Transit":
        return <Badge className="bg-blue-600">In Transit</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Product Transfer</h1>
          <p className="text-muted-foreground">
            Transfer products between stores and warehouses
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Transfer Request</DialogTitle>
              <DialogDescription>
                Transfer products between locations
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prod1">Laptop HP ProBook 450</SelectItem>
                    <SelectItem value="prod2">
                      Office Chair Ergonomic
                    </SelectItem>
                    <SelectItem value="prod3">Monitor Dell 27" 4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromStore">From Store</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Warehouse</SelectItem>
                      <SelectItem value="store-a">
                        Store A - Downtown
                      </SelectItem>
                      <SelectItem value="store-b">Store B - Mall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toStore">To Store</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Warehouse</SelectItem>
                      <SelectItem value="store-a">
                        Store A - Downtown
                      </SelectItem>
                      <SelectItem value="store-b">Store B - Mall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Available Stock</Label>
                  <Input value="45 units" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Transfer Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this transfer"
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
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Create Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">124</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">8</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">12</div>
            <p className="text-xs text-muted-foreground">Currently moving</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">104</div>
            <p className="text-xs text-muted-foreground">
              Successfully transferred
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transfer History */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.id}</TableCell>
                  <TableCell className="font-medium">
                    {transfer.product}
                  </TableCell>
                  <TableCell>{transfer.fromStore}</TableCell>
                  <TableCell>{transfer.toStore}</TableCell>
                  <TableCell>{transfer.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {transfer.requestedBy}
                  </TableCell>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transfer.status)}
                      {getStatusBadge(transfer.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {transfer.status === "Pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </div>
                    )}
                    {transfer.status === "In Transit" && (
                      <Button size="sm" variant="outline">
                        Mark Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
