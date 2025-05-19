"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types/order";

interface OrdersFiltersProps {
  orders: Order[];
  setFilteredOrders: (orders: Order[]) => void;
  onRefresh: () => void;
}

export function OrdersFilters({
  orders,
  setFilteredOrders,
  onRefresh,
}: OrdersFiltersProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(searchTerm) ||
        order.customerId.toLowerCase().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm)
    );
    setFilteredOrders(filtered);
  };

  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  return (
    <div className="space-y-4 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search orders..."
          onChange={handleSearch}
          className="w-sm"
        />
        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
      <div className="w-sm">
        <Select onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
