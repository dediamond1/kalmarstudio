"use client";

import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { QuantityInput } from "@/components/products/quantity-input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProductOptionsProps {
  product: Product;
  selectedOptions: {
    color: string | null;
    printType: string | null;
    material: string | null;
  };
  onOptionChange: (
    optionType: "color" | "printType" | "material",
    value: string
  ) => void;
  selections: Record<
    string,
    {
      selected: boolean;
      quantity: number;
    }
  >;
  toggleSelection: (size: string) => void;
  updateQuantity: (size: string, quantity: number) => void;
}

export function ProductOptions({
  product,
  selectedOptions,
  onOptionChange,
  selections,
  toggleSelection,
  updateQuantity,
}: ProductOptionsProps) {
  return (
    <div className="space-y-6">
      {/* Colors */}
      {product.colors?.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Color</Label>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => onOptionChange("color", color)}
                className={cn(
                  "w-12 h-12 rounded-full border-2 transition-all relative flex items-center justify-center shadow-sm hover:shadow-md",
                  selectedOptions.color === color
                    ? "border-primary ring-4 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                )}
                style={{ backgroundColor: color }}
                aria-label={color}
                title={color}
              >
                {selectedOptions.color === color && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-7 h-7 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Print Types */}
      {product.printTypes?.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Print Type</Label>
          <div className="flex flex-wrap gap-3">
            {product.printTypes.map((type) => (
              <Button
                key={type}
                variant={
                  selectedOptions.printType === type ? "default" : "outline"
                }
                className={cn(
                  "min-w-[100px] h-10",
                  selectedOptions.printType === type
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-accent"
                )}
                onClick={() => onOptionChange("printType", type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Materials */}
      {product.materials?.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Material</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {product.materials.map((material) => (
              <Button
                key={material}
                variant={
                  selectedOptions.material === material ? "default" : "outline"
                }
                className={cn(
                  "h-10",
                  selectedOptions.material === material
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-accent"
                )}
                onClick={() => onOptionChange("material", material)}
              >
                {material}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Size and Quantity */}
      {product.availableSizes?.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Size & Quantity</Label>
          <div className="space-y-3">
            {product.availableSizes.map((size) => (
              <div
                key={size}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all",
                  selections[size]?.selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "hover:border-primary/50 hover:bg-accent/50"
                )}
              >
                <div
                  className="flex-1 cursor-pointer flex items-center"
                  onClick={() => toggleSelection(size)}
                >
                  <div className="h-5 w-5 flex items-center justify-center mr-3">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border-2 transition-all flex items-center justify-center",
                        selections[size]?.selected
                          ? "border-primary bg-primary"
                          : "border-muted"
                      )}
                    >
                      {selections[size]?.selected && (
                        <span className="block h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-sm md:text-base">
                    {size}
                  </span>
                </div>
                <QuantityInput
                  value={selections[size].quantity}
                  onChange={(qty) => updateQuantity(size, qty)}
                  selected={selections[size]?.selected}
                  disabled={!selections[size]?.selected}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
