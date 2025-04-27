"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  selected: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export function QuantityInput({
  value,
  onChange,
  selected,
  disabled = false,
  min = 1,
  max = 99,
}: QuantityInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > min) onChange(Math.max(min, value - 1));
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-md transition-all border",
        selected
          ? "bg-primary/5 border-primary"
          : "bg-muted/20 border-transparent",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={decrement}
        disabled={disabled || value <= min}
        className="h-8 w-8 p-0"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-12 h-8 text-center border-none bg-transparent focus-visible:ring-0 p-0"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={increment}
        disabled={disabled || value >= max}
        className="h-8 w-8 p-0"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
