"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useUserStore } from "@/store/user";

type Address = {
  fullName: string;
  email: string;
  contactNo: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: Address) => void;
};

export const AddAddressModal = ({ open, onOpenChange, onSave }: Props) => {
  const userEmail = useUserStore((state) => state.user?.email);
  const [address, setAddress] = useState<Omit<Address, "email">>({
    fullName: "",
    contactNo: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;
    onSave({ ...address, email: userEmail });
    setAddress({
      fullName: "",
      contactNo: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={userEmail || ""} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact Number</Label>
              <Input
                id="contactNo"
                type="tel"
                value={address.contactNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setAddress({ ...address, contactNo: value });
                }}
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={address.zipCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setAddress({ ...address, zipCode: value });
                }}
                pattern="[0-9]*"
                inputMode="numeric"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
