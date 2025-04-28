"use client";

import { cn } from "@/lib/utils";

type IconProps = {
  name: "check" | "chevron-right" | "circle";
  className?: string;
  size?: number;
};

export function Icon({ name, className, size = 16 }: IconProps) {
  const baseClasses = "inline-block fill-current";

  switch (name) {
    case "check":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={cn(baseClasses, className)}
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={cn(baseClasses, className)}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      );
    case "circle":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={cn(baseClasses, className)}
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    default:
      return null;
  }
}
