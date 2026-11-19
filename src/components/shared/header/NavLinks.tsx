"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";

interface NavLinksProps {
  items: NavItem[];
  isAuthenticated: boolean;
}

export function NavLinks({ items, isAuthenticated }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {items.map((item) => {
        if (item.requiresAuth && !isAuthenticated) return null;

        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative py-1.5 text-[14px] font-medium transition-colors duration-200",
              isActive
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-1 mx-auto h-2 w-2 rounded-full bg-indicator ring-1 ring-border/40" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}