"use client";

import { useCheckout } from "../context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Customer } from "../types";

export default function CustomerInfo() {
  const { state, dispatch } = useCheckout();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>({
    defaultValues: state.customer || {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      isGuest: false,
    },
  });

  const onSubmit = (data: Customer) => {
    dispatch({ type: "SET_CUSTOMER", payload: data });
    dispatch({ type: "SET_STEP", payload: "shipping" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone", { required: "Phone is required" })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Continue to Shipping
        </Button>
      </div>
    </form>
  );
}
