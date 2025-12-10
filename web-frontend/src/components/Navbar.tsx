"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAppContext();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: ShoppingBag },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
  ];

  if (isAuthenticated) {
    navItems.push({
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    });
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="font-bold text-lg">Voice Commerce</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isCart = item.href === "/cart";
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "flex items-center gap-2 relative",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.label}</span>
                  {isCart && cartItemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Auth Button */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Logout</span>
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="default" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline-block">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
