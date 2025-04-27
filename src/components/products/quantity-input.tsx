"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  selected: boolean;
  disabled?: boolean;
}

export function QuantityInput({
  value,
  onChange,
  selected,
  disabled = false,
}: QuantityInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const increment = () => onChange(value + 1);
  const decrement = () => onChange(Math.max(1, value - 1));

  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-md transition-all ${
        selected ? "bg-primary/10 border border-primary" : "bg-muted/20"
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={decrement}
        disabled={value <= 1}
        className="h-8 w-8 p-0"
      >
        -
      </Button>
      <Input
        type="number"
        min="1"
        max="99"
        value={value}
        onChange={handleChange}
        className="w-12 h-8 text-center border-none bg-transparent focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={increment}
        className="h-8 w-8 p-0"
      >
        +
      </Button>
    </div>
  );
}
