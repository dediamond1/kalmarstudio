"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCartStore, type CartState } from "@/store/cart";
import CartCount from "@/components/CartCount";
import Container from "./ui/Container";
import { HiOutlineMenu } from "react-icons/hi";

const navLinks = [
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Container>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-2xl">Kalmar Studio</span>
          </a>
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
          <a href="/cart">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <div>
                <ShoppingCart className="h-5 w-5" />
                <CartCount />
              </div>
            </Button>
          </a>
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
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
