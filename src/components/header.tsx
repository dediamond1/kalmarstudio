"use client";

import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useUserStore } from "@/store/user";
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

const navLinks = [
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, fetchUserByEmail, clearUser } = useUserStore();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const { data: session, error } = await authClient.getSession();
        if (error) {
          setIsLoggedIn(false);
          return;
        }
        if (session?.user?.email) {
          await fetchUserByEmail(session.user.email);
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuthState();
  }, [fetchUserByEmail]);

  const handleLogout = async () => {
    await authClient.signOut();
    clearUser();
    useCartStore.getState().clearCart();
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
  };

  return (
    <Container>
      <div className="flex items-center justify-between py-4">
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
              className="text-lg font-semibold text-[#00000099] hover:text-primary"
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
                    <ShoppingCart className="h-5 w-5" />
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
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
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
              <div className="container px-4 py-6">
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/cart"
                        className="flex items-center justify-center py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="ghost" className="w-full">
                          <ShoppingCart className="h-5 w-5 mr-2" />
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
                        className="flex items-center justify-center py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="ghost" className="w-full">
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Cart
                          <CartCount className="ml-2" />
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button
                        className="w-full mt-2"
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
