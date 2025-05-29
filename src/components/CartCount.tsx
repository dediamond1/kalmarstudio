"use client";

import { useCartStore, type CartState } from "@/store/cart";
import { useEffect, useState } from "react";

interface CartCountProps {
  className?: string;
}

export default function CartCount({ className }: CartCountProps) {
  const [mounted, setMounted] = useState(false);
  const count = useCartStore((state: CartState) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <span
      className={`absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${className}`}
    >
      {count > 0 ? count : null}
    </span>
  );
}
