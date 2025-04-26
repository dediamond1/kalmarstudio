// src/components/dashboard/orders/product-selector.tsx

"use client";

import { useState, useEffect } from "react";
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
import { Check, ChevronsUpDown, Package, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { getProductsForOrderSelection } from "@/lib/api/products";
import Link from "next/link";

interface ProductSelectorProps {
  value: { id: string; name: string };
  onChange: (value: { id: string; name: string }) => void;
  onPriceChange?: (price: number) => void;
}

export function ProductSelector({
  value,
  onChange,
  onPriceChange,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsForOrderSelection();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.category && product.category.name.toLowerCase().includes(query))
    );
  });

  const selectedProduct = products.find((p) => p.id === value.id);

  const handleSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);

    if (product) {
      // Update product in form
      onChange({
        id: product.id,
        name: product.name,
      });

      // Update price if callback is provided
      if (onPriceChange) {
        onPriceChange(product.basePrice);
      }
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value.id && "text-muted-foreground"
          )}
        >
          {selectedProduct ? (
            <div className="flex flex-col items-start gap-1 text-left">
              <span className="font-medium">{selectedProduct.name}</span>
              <span className="text-xs text-muted-foreground">
                ${selectedProduct.basePrice.toFixed(2)}
                {selectedProduct.category &&
                  ` • ${selectedProduct.category.name}`}
              </span>
            </div>
          ) : (
            <span>{value.name || "Select product"}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start" sideOffset={5}>
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="py-6 text-center text-sm">
                  Loading products...
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm">No products found</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/dashboard/products/new">
                      <Plus className="mr-1 h-4 w-4" />
                      Create product
                    </Link>
                  </Button>
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {!loading && filteredProducts.length === 0 ? (
                <CommandEmpty>No products found</CommandEmpty>
              ) : (
                filteredProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id}
                    onSelect={handleSelect}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ${product.basePrice.toFixed(2)}
                          {product.category && ` • ${product.category.name}`}
                        </span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        product.id === value.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
            <div className="p-2 border-t">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/products/new">
                  <Plus className="mr-1 h-4 w-4" />
                  Create new product
                </Link>
              </Button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
