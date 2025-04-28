"use client";

import { useCheckout } from "../context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Address } from "../types";

export default function ShippingInfo() {
  const { state, dispatch } = useCheckout();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: state.shippingAddress || {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      phone: "",
    },
  });

  const onSubmit = (data: Address) => {
    dispatch({ type: "SET_SHIPPING_ADDRESS", payload: data });
    dispatch({ type: "SET_STEP", payload: "payment" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Label htmlFor="address1">Address Line 1</Label>
        <Input
          id="address1"
          {...register("address1", { required: "Address is required" })}
        />
        {errors.address1 && (
          <p className="text-red-500 text-sm">{errors.address1.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address2">Address Line 2 (Optional)</Label>
        <Input id="address2" {...register("address2")} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            {...register("state", { required: "State is required" })}
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            {...register("postalCode", { required: "Postal code is required" })}
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
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
          Continue to Payment
        </Button>
      </div>
    </form>
  );
}
