"use client";

import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import { useState } from "react";
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
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
            <a href="/cart">
              <Button variant="ghost" size="icon" className="relative" asChild>
                <div>
                  <ShoppingCart className="h-5 w-5" />
                  <CartCount />
                </div>
              </Button>
            </a>
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
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
