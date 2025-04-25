"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    MoreHorizontal,
    Plus,
    Search,
    ArrowUpDown,
    Calendar,
    User,
    Package,
    CreditCard,
    Truck,
    Filter
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatsCards } from "@/components/dashboard/orders/OrderStatsCards";
import Link from "next/link";
import { NewOrderForm } from "@/components/dashboard/new-order-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { Order } from "@/types/order";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [newOrderDialogOpen, setNewOrderDialogOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<string>("createdAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/orders");
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to fetch orders");
            }

            setOrders(result.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to fetch orders"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to delete order");
            }

            setOrders(orders.filter((order) => order.id !== id));
            toast.success("Order deleted successfully");
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete order"
            );
        }
    };

    // Filter orders by status and search query
    const filteredOrders = orders.filter((order) => {
        // First apply status filter
        if (statusFilter !== "all" && order.status !== statusFilter) {
            return false;
        }

        // Then apply search query
        if (!searchQuery) return true;

        const searchLower = searchQuery.toLowerCase();
        return (
            order.customer.name.toLowerCase().includes(searchLower) ||
            order.customer.email.toLowerCase().includes(searchLower) ||
            order.id.toLowerCase().includes(searchLower) ||
            order.status.toLowerCase().includes(searchLower)
        );
    });

    // Sort orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
            case "customer":
                aValue = a.customer.name.toLowerCase();
                bValue = b.customer.name.toLowerCase();
                break;
            case "status":
                aValue = a.status.toLowerCase();
                bValue = b.status.toLowerCase();
                break;
            case "total":
                aValue = a.payment.total;
                bValue = b.payment.total;
                break;
            case "dueDate":
                aValue = new Date(a.dueDate).getTime();
                bValue = new Date(b.dueDate).getTime();
                break;
            case "createdAt":
            default:
                aValue = new Date(a.createdAt).getTime();
                bValue = new Date(b.createdAt).getTime();
                break;
        }

        if (sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    // Map status to appropriate badge variant
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "Completed":
                return "secondary";
            case "Processing":
                return "default";
            case "Shipped":
                return "outline";
            case "Pending":
                return "default"; // Changed from "warning" which isn't a valid variant
            case "Cancelled":
                return "destructive";
            default:
                return "outline";
        }
    };

    // Toggle sort direction or set new sort field
    const handleSort = (field: string) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Calculate order stats
    const orderStats = {
        total: orders.length,
        pending: orders.filter(order => order.status === "Pending").length,
        processing: orders.filter(order => order.status === "Processing").length,
        completed: orders.filter(order => order.status === "Completed").length,
        cancelled: orders.filter(order => order.status === "Cancelled").length,
        value: orders.reduce((sum, order) => sum + order.payment.total, 0).toFixed(2)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Orders</h1>
                        <p className="text-muted-foreground">
                            Manage and track your custom printing orders
                        </p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                        <Dialog open={newOrderDialogOpen} onOpenChange={setNewOrderDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Order
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Create New Order</DialogTitle>
                                    <DialogDescription>
                                        Fill out the details to create a new custom print order
                                    </DialogDescription>
                                </DialogHeader>
                                <NewOrderForm
                                    onSuccess={() => {
                                        setNewOrderDialogOpen(false);
                                        fetchOrders();
                                    }}
                                    onCancel={() => setNewOrderDialogOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <OrderStatsCards
                    total={orderStats.total}
                    pending={orderStats.pending}
                    processing={orderStats.processing}
                    completed={orderStats.completed}
                    cancelled={orderStats.cancelled}
                    value={orderStats.value}
                />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="w-full md:w-72">
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="relative flex w-full md:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search orders..."
                            className="pl-8 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchOrders()}>
                        Refresh
                    </Button>
                    <Link href="/dashboard/orders/new">
                        <Button variant="default" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Order
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center py-8">
                            <p>Loading orders...</p>
                        </div>
                    </CardContent>
                </Card>
            ) : sortedOrders.length === 0 ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                            <p className="text-muted-foreground">No orders found</p>
                            {searchQuery && (
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search query
                                </p>
                            )}
                            {!searchQuery && statusFilter === "all" && (
                                <Button asChild>
                                    <Link href="/dashboard/orders/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create your first order
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => handleSort("createdAt")}
                                    >
                                        Order ID
                                        {sortField === "createdAt" && (
                                            <ArrowUpDown className="ml-2 h-3 w-3" />
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => handleSort("customer")}
                                    >
                                        Customer
                                        {sortField === "customer" && (
                                            <ArrowUpDown className="ml-2 h-3 w-3" />
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => handleSort("status")}
                                    >
                                        Status
                                        {sortField === "status" && (
                                            <ArrowUpDown className="ml-2 h-3 w-3" />
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => handleSort("total")}
                                    >
                                        Total
                                        {sortField === "total" && (
                                            <ArrowUpDown className="ml-2 h-3 w-3" />
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => handleSort("dueDate")}
                                    >
                                        Due Date
                                        {sortField === "dueDate" && (
                                            <ArrowUpDown className="ml-2 h-3 w-3" />
                                        )}
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>#{order.id.substring(0, 8)}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.customer.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {order.customer.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {order.items.length === 1
                                            ? typeof order.items[0].product === "string"
                                                ? order.items[0].product
                                                : order.items[0].product?.name || "Unknown"
                                            : `${order.items.length} items`}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${order.payment.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        {format(new Date(order.dueDate), "MMM d, yyyy")}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
