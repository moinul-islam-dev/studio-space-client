import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { Aperture } from "lucide-react";

import { auth } from "@/lib/auth";
import studioLogo from "@/assets/logo.svg"; // Adjust extension (.png / .svg) to match your assets folder
import { navItems } from "./nav-items";
import { DesktopUserMenu } from "./DesktopUserMenu";
import { NavLinks } from "./NavLinks";
import { MobileNavMenu } from "./MobileNavMenu";

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl bg-[#0E0E10] px-3 py-1.5 transition-all duration-200 dark:bg-transparent dark:p-0"
        >
          {studioLogo ? (
            <Image
              src={studioLogo}
              alt="StudioSpace Logo"
              width={38}
              height={38}
              className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-105 dark:h-8 dark:w-8"
              priority
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground dark:h-8 dark:w-8">
              <Aperture className="h-4 w-4 stroke-[2.25] dark:h-5 dark:w-5" />
            </div>
          )}

          <span className="text-xl font-extrabold tracking-[-0.03em] text-white dark:text-foreground">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Desktop Center Navigation with Active Route Indicators */}
        <NavLinks items={navItems} isAuthenticated={Boolean(session)} />

        {/* Desktop Right Actions / User Menu */}
        <div className="hidden lg:block">
          <DesktopUserMenu
            user={
              user
                ? {
                  name: user.name,
                  email: user.email,
                  image: user.image ?? null,
                }
                : null
            }
          />
        </div>

        {/* Mobile Navigation */}
        <MobileNavMenu
          navItems={navItems}
          user={
            user
              ? {
                name: user.name,
                email: user.email,
                image: user.image ?? null,
              }
              : null
          }
        />
      </div>
    </header>
  );
}