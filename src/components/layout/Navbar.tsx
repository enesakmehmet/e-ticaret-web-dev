"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingCart, User, LogOut, Search, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount: cartCount } = useCart();
  const { itemCount: favCount } = useFavorites();
  const { locale, dict, changeLanguage } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* Mobile Logo & Desktop Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 transition-opacity hover:opacity-80">
            STEP SPACE
          </Link>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-1 sm:gap-3">
          
          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-secondary/60 p-0.5 sm:p-1 rounded-full text-[10px] sm:text-xs font-bold mr-1 sm:mr-2 border border-border/50">
            <button 
              onClick={() => changeLanguage("tr")}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all duration-300 ${locale === "tr" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              TR
            </button>
            <button 
              onClick={() => changeLanguage("en")}
              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all duration-300 ${locale === "en" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              EN
            </button>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/products" className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95" title={dict.navbar.products}>
              <Search className="h-[22px] w-[22px]" strokeWidth={1.5} />
            </Link>

            <Link href="/favorites" className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95" title={dict.navbar.favorites}>
              <Heart className="h-[22px] w-[22px]" strokeWidth={1.5} />
              {favCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-foreground text-background text-[10px] font-bold h-[18px] w-[18px] rounded-full flex items-center justify-center ring-2 ring-background">
                  {favCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95" title={dict.navbar.cart}>
              <ShoppingCart className="h-[22px] w-[22px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[10px] font-bold h-[18px] w-[18px] rounded-full flex items-center justify-center ring-2 ring-background">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-2 border-l border-border/40 pl-2 sm:pl-4 ml-1 sm:ml-2">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-all active:scale-95">
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <button onClick={() => logout()} className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                  <LogOut className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95">
                  <User className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </Link>
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    href="/login" 
                    className={cn(buttonVariants({ variant: "ghost" }), "rounded-full font-medium hover:bg-secondary px-6")}
                  >
                    {dict.navbar.login}
                  </Link>
                  <Link 
                    href="/register" 
                    className={cn(buttonVariants({ variant: "default" }), "rounded-full font-semibold px-6 shadow-md hover:shadow-lg transition-all")}
                  >
                    {dict.navbar.register}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
