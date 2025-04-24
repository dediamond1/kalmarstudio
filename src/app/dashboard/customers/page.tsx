"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { ICustomer } from "@/models/customer.model";
import Link from "next/link";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  if (loading) return <div className="p-4">Loading customers...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button asChild>
          <Link href="/dashboard/customers/new">Add Customer</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow key={index}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.company}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href={`/dashboard/customers/${customer._id.toString()}`}
                  >
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
