"use client";

import * as React from "react";
import { ToastAction } from "@radix-ui/react-toast";
import { useToast as useRadixToast } from "@/components/ui/toast";

export function useToast() {
  const { toast } = useRadixToast();

  return {
    toast: (props: {
      variant?: "default" | "destructive";
      title: string;
      description?: string;
      action?: React.ReactNode;
    }) => {
      toast({
        ...props,
      });
    },
  };
}
