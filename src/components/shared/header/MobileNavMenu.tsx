"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarCheck,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "./nav-items";

interface MobileNavMenuProps {
  navItems: NavItem[];
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

export function MobileNavMenu({ navItems, user }: MobileNavMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    setOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:border-primary hover:text-foreground dark:hover:text-primary hover:shadow-[0_0_15px_rgba(198,242,78,0.35)]">
          <Menu className="h-5 w-5" />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-[300px] flex-col justify-between border-l border-border bg-background p-6 text-foreground"
        >
          <div className="space-y-6">
            <SheetHeader className="text-left">
              <SheetTitle className="text-lg font-extrabold tracking-tight text-foreground">
                Studio<span className="text-foreground dark:text-primary">Space</span>
              </SheetTitle>
            </SheetHeader>

            {/* Primary Navigation Links */}
            <nav className="flex flex-col space-y-1.5">
              {navItems.map((item) => {
                if (item.requiresAuth && !user) return null;

                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors",
                      isActive
                        ? "bg-card font-semibold text-foreground dark:text-primary"
                        : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Authenticated Links */}
            {user && (
              <div className="space-y-1.5 border-t border-border pt-4">
                <p className="px-3.5 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Workspace
                </p>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-card"
                >
                  <LayoutDashboard className="h-4 w-4 text-foreground dark:text-primary" />
                  Dashboard
                </Link>
                <Link
                  href="/studios/new"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-card"
                >
                  <PlusCircle className="h-4 w-4 text-secondary-foreground dark:text-secondary" />
                  Add New Studio
                </Link>
                <Link
                  href="/dashboard/studios"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-card"
                >
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  My Studio Listings
                </Link>
                <Link
                  href="/dashboard/bookings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-card"
                >
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  My Bookings
                </Link>
              </div>
            )}
          </div>

          {/* Bottom User Profile or Auth Buttons */}
          <div className="border-t border-border pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start rounded-full px-4 text-sm font-semibold text-destructive hover:bg-destructive/15 hover:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-full border-border bg-card text-sm font-semibold text-foreground hover:bg-muted"
                >
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(198,242,78,0.45)]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}