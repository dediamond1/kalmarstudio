"use client";

import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import {  useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useCartStore } from "@/store/cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import CartCount from "@/components/CartCount";
import Container from "./ui/Container";
import { HiOutlineMenu } from "react-icons/hi";
import LogoImage from "./ui/LogoImage";
import Link from "next/link";
import { User } from "better-auth";

const navLinks = [
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header({
  user,
}: {
  user: User | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);


  const handleLogout = async () => {
    await authClient.signOut();
    useCartStore.getState().clearCart();
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
  };

  return (
    <Container>
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <LogoImage />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-semibold text-[#00000099] hover:text-primary text-lg"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    <CartCount />
                  </Button>
                </Link>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <HiOutlineMenu size={48} />}
        </Button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="md:hidden z-40 fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className={cn(
                "fixed right-0 top-16 w-4/5 max-w-sm h-[calc(100vh-4rem)] bg-background overflow-y-auto",
                "transition-transform duration-300 ease-in-out",
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-6 container">
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="py-2 font-medium hover:text-primary text-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/cart"
                        className="flex justify-center items-center py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="ghost" className="w-full">
                          <ShoppingCart className="mr-2 w-5 h-5" />
                          Cart
                          <CartCount className="ml-2" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Avatar className="cursor-pointer">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href="/profile"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/orders"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Orders
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-500"
                          >
                            Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Link
                        href="/cart"
                        className="flex justify-center items-center py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="ghost" className="w-full">
                          <ShoppingCart className="mr-2 w-5 h-5" />
                          Cart
                          <CartCount className="ml-2" />
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="mt-4 w-full"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button
                        className="mt-2 w-full"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/auth/register">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
