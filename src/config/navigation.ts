import { LayoutDashboard, ShoppingCart, Settings, Users } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
