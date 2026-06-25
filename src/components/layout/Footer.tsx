"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { dict } = useLanguage();
  return (
    <footer className="mt-auto border-t bg-background py-8 md:py-12">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
        <div>
          <h3 className="mb-4 text-lg font-bold tracking-tighter">STEP SPACE</h3>
          <p className="text-sm text-muted-foreground">
            {dict.footer.description}
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">{dict.footer.categories}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <Link href="/products?category=nike" className="py-1 inline-block transition-colors hover:text-primary">
                Nike
              </Link>
            </li>
            <li>
              <Link href="/products?category=adidas" className="py-1 inline-block transition-colors hover:text-primary">
                Adidas
              </Link>
            </li>
            <li>
              <Link href="/products?category=jordan" className="py-1 inline-block transition-colors hover:text-primary">
                Jordan
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">{dict.footer.customerService}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <Link href="/contact" className="py-1 inline-block transition-colors hover:text-primary">
                {dict.footer.contact}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="py-1 inline-block transition-colors hover:text-primary">
                {dict.footer.faq}
              </Link>
            </li>
            <li>
              <Link href="/returns" className="py-1 inline-block transition-colors hover:text-primary">
                {dict.footer.returns}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">{dict.footer.followUs}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a href="#" className="py-1 inline-block transition-colors hover:text-primary">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="py-1 inline-block transition-colors hover:text-primary">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="py-1 inline-block transition-colors hover:text-primary">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-8 md:mt-12 border-t px-4 pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} STEP SPACE. {dict.footer.rights}</p>
      </div>
    </footer>
  );
}
