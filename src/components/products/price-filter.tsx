"use client";

import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function PriceFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState([0, 1000]);

  // Initialize from URL params
  useEffect(() => {
    const min = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : 0;
    const max = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : 1000;
    setValue([min, max]);
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue);
    const [min, max] = newValue;
    router.push(
      `${pathname}?${createQueryString("minPrice", min.toString())}&${createQueryString("maxPrice", max.toString())}`
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Price Range</h3>
      <Slider
        min={0}
        max={1000}
        step={10}
        value={value}
        onValueChange={handleValueChange}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
    </div>
  );
}
