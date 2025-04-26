// src/components/dashboard/orders/customer-selector.tsx

"use client";

import { useState, useEffect } from "react";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Customer } from "@/types/customer";
import { getCustomers } from "@/lib/api/customers";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

interface CustomerSelectorProps {
  form: UseFormReturn<any>;
  name: string;
}

export function CustomerSelector({ form, name }: CustomerSelectorProps) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the value from the form
  const value = form.watch(`${name}.id`);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      (customer.company && customer.company.toLowerCase().includes(query))
    );
  });

  const selectedCustomer = customers.find(
    (c) => c.id === value || c._id === value
  );

  const handleSelect = (customerId: string) => {
    const customer = customers.find(
      (c) => c.id === customerId || c._id === customerId
    );

    if (customer) {
      // Update all customer fields in form
      form.setValue(`${name}.id`, customer.id || customer._id);
      form.setValue(`${name}.name`, customer.name);
      form.setValue(`${name}.email`, customer.email);
      form.setValue(`${name}.phone`, customer.phone);
      form.setValue(`${name}.company`, customer.company || "");
    }

    setOpen(false);
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Customer</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "justify-between",
                !value && "text-muted-foreground"
              )}
            >
              {selectedCustomer ? (
                <div className="flex flex-col items-start gap-1 text-left">
                  <span className="font-medium">{selectedCustomer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {selectedCustomer.email}
                    {selectedCustomer.company &&
                      ` • ${selectedCustomer.company}`}
                  </span>
                </div>
              ) : (
                <span>Select customer</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" sideOffset={5}>
          <Command>
            <CommandInput
              placeholder="Search customers..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? (
                  <div className="py-6 text-center text-sm">
                    Loading customers...
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm">No customers found</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/dashboard/customers/new">
                        <Plus className="mr-1 h-4 w-4" />
                        Create customer
                      </Link>
                    </Button>
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {!loading && filteredCustomers.length === 0 ? (
                  <CommandEmpty>No customers found</CommandEmpty>
                ) : (
                  filteredCustomers.map((customer) => (
                    <CommandItem
                      key={customer.id || customer._id}
                      value={customer.id || (customer._id as string)}
                      onSelect={handleSelect}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{customer.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {customer.email}
                            {customer.company && ` • ${customer.company}`}
                          </span>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          customer.id === value || customer._id === value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
              <div className="p-2 border-t">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/dashboard/customers/new">
                    <Plus className="mr-1 h-4 w-4" />
                    Create new customer
                  </Link>
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
