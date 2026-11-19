export interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
}

export const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Explore Studios",
    href: "/studios",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
  },
  {
    label: "About Us",
    href: "/about",
  },
];

export const userMenuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Add New Studio",
    href: "/studios/new",
  },
  {
    label: "My Studio Listings",
    href: "/dashboard/studios",
  },
  {
    label: "My Bookings",
    href: "/dashboard/bookings",
  },
] as const;