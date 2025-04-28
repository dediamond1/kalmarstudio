"use client";

import { useCheckout } from "../context";
import { CheckoutStep } from "../types";

const steps: CheckoutStep[] = ["customer", "shipping", "payment", "review"];

export default function CheckoutStepper() {
  const { state } = useCheckout();

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${
              state.step === step
                ? "bg-primary text-white"
                : index < steps.indexOf(state.step)
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {index + 1}
          </div>
          <span className="mt-2 text-sm capitalize">{step}</span>
        </div>
      ))}
    </div>
  );
}
