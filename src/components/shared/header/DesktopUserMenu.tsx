"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesktopUserMenuProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  } | null;
}

export function DesktopUserMenu({ user }: DesktopUserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  // Unauthenticated State
  if (!user) {
    return (
      <div className="flex items-center gap-5">
        <Button
          variant="ghost"
          className="h-10 rounded-full px-4 text-[14px] font-semibold text-foreground hover:bg-card hover:text-foreground dark:hover:text-primary"
        >
          <Link href="/login">Login</Link>
        </Button>

        <Button
          className="h-11 rounded-full bg-primary px-6 text-[14px] font-semibold text-primary-foreground shadow-none transition-all hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(198,242,78,0.4)]"
        >
          <Link href="/register">Register</Link>
        </Button>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Authenticated State: Avatar with Hover & Click Dropdown
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative"
    >
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full border border-border bg-card p-1 pr-3 transition-colors hover:border-primary/60 focus:outline-none">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[120px] truncate text-[13px] font-semibold text-foreground">
            {user.name}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-60 rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl"
        >
          <DropdownMenuGroup className="space-y-0.5 py-1">
            <DropdownMenuLabel className="px-2.5 py-2">
              <p className="truncate text-sm font-bold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              className="cursor-pointer rounded-xl px-2.5 py-2 text-[14px] font-medium text-foreground focus:bg-muted focus:text-foreground dark:focus:text-primary"
            >
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4 text-foreground dark:text-primary" />
                Dashboard
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer rounded-xl px-2.5 py-2 text-[14px] font-medium text-foreground focus:bg-muted focus:text-foreground dark:focus:text-primary"
            >
              <Link href="/studios/new" className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4 text-secondary-foreground dark:text-secondary" />
                Add New Studio
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer rounded-xl px-2.5 py-2 text-[14px] font-medium text-foreground focus:bg-muted focus:text-foreground dark:focus:text-primary"
            >
              <Link
                href="/dashboard/studios"
                className="flex items-center gap-2.5"
              >
                <Building2 className="h-4 w-4 text-muted-foreground" />
                My Studio Listings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer rounded-xl px-2.5 py-2 text-[14px] font-medium text-foreground focus:bg-muted focus:text-foreground dark:focus:text-primary"
            >
              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-2.5"
              >
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                My Bookings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="mt-1 cursor-pointer rounded-xl px-2.5 py-2 text-[14px] font-medium text-destructive focus:bg-destructive/15 focus:text-destructive"
          >
            <LogOut className="mr-2.5 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
