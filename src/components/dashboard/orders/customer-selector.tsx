// src/components/dashboard/orders/customer-selector.tsx

"use client";

import { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

interface CustomerSelectorProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
}

export function CustomerSelector({
  form,
  name,
  label = "Customer",
}: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Track selected customer as a state in addition to form value
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Get form field value
  const value = form.watch(name);

  // Load customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/customers");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error loading customers:", error);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // When form value changes, find the customer and update selectedCustomer state
  useEffect(() => {
    if (value && customers.length > 0) {
      const customer = customers.find((c) => c.id === value || c._id === value);
      setSelectedCustomer(customer || null);
    } else {
      setSelectedCustomer(null);
    }
  }, [value, customers]);

  // Filter customers based on search
  const filteredCustomers =
    search === ""
      ? customers
      : customers.filter((customer) => {
          const searchLower = search.toLowerCase();
          return (
            customer.name.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower) ||
            (customer.company &&
              customer.company.toLowerCase().includes(searchLower))
          );
        });

  // Handle customer selection
  const handleSelect = (customerId: string) => {
    const customer = customers.find(
      (c) => c.id === customerId || c._id === customerId
    );

    // Update both the form state and local state
    if (customer) {
      const id = customer.id || customer._id;
      form.setValue(name, id);
      setSelectedCustomer(customer);
    }

    setOpen(false);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={selectedCustomer ? "default" : "outline"}
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between px-3 py-2 h-auto min-h-10",
                    !selectedCustomer && "text-muted-foreground"
                  )}
                  onClick={() => setOpen(!open)}
                >
                  {selectedCustomer ? (
                    <div className="flex flex-col items-start gap-1 text-left">
                      <span className="font-semibold">
                        {selectedCustomer.name}
                      </span>
                      <span className="text-xs">
                        {selectedCustomer.email}
                        {selectedCustomer.company &&
                          ` • ${selectedCustomer.company}`}
                      </span>
                    </div>
                  ) : (
                    <span>Select customer</span>
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search customers..."
                  value={search}
                  onValueChange={setSearch}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No customers found.</CommandEmpty>
                  <CommandGroup>
                    {loading ? (
                      <div className="p-2 text-center">
                        Loading customers...
                      </div>
                    ) : (
                      filteredCustomers.map((customer) => {
                        const customerId =
                          customer.id || (customer._id as string);
                        const isSelected = customerId === value;

                        return (
                          <CommandItem
                            key={customerId}
                            value={customerId}
                            onSelect={handleSelect}
                            className="flex justify-between py-2"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {customer.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {customer.email}
                                {customer.company && ` • ${customer.company}`}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </CommandItem>
                        );
                      })
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
