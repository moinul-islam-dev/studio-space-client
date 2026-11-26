"use client";

import {
  AddSquareIcon,
  ArrowRight01Icon,
  Building06Icon,
  Calendar03Icon,
  Cancel01Icon,
  SidebarLeft01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import {
  Sidebar,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

const dashboardLinks = [
  { segment: "add-studio", label: "Add new studio", icon: AddSquareIcon },
  {
    segment: "my-studio-listings",
    label: "My Studio Listings",
    icon: Building06Icon,
  },
  { segment: "my-listings", label: "My bookings", icon: Calendar03Icon },
];

const controlClassName =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function DashboardNavigation({ segment }: { segment: string | null }) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="group-data-[side=left]:border-r-0 md:static md:h-auto"
    >
      <div className="flex size-full flex-col bg-background text-foreground md:bg-transparent">
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-3 group-data-[collapsible=icon]:justify-center">
          <div className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 text-card-foreground shadow-xs group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none">
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground group-data-[collapsible=icon]:size-8">
              <HugeiconsIcon icon={Video01Icon} size={15} aria-hidden="true" />
            </span>
            <span className="truncate text-xs font-semibold group-data-[collapsible=icon]:sr-only">
              StudioSpace
            </span>
          </div>
          <button
            type="button"
            aria-label="Close dashboard navigation"
            className={`${controlClassName} md:hidden`}
            onClick={() => setOpenMobile(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} aria-hidden="true" />
          </button>
        </div>

        <nav
          id="dashboard-navigation"
          aria-label="Dashboard navigation"
          className="px-2 pt-3 pb-4 group-data-[collapsible=icon]:px-0 sm:px-3"
        >
          <p className="mb-2 px-2.5 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:sr-only">
            Workspace
          </p>
          <SidebarMenu className="gap-1">
            {dashboardLinks.map(({ segment: slug, label, icon }) => {
              const isActive = segment === slug;

              return (
                <SidebarMenuItem key={slug}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={label}
                    className="h-9 gap-2.5 rounded-lg border border-transparent px-2.5 text-muted-foreground ring-ring group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center hover:bg-muted hover:text-foreground data-active:border-border data-active:bg-card data-active:text-card-foreground data-active:shadow-xs"
                    render={
                      <Link
                        href={`/dashboard/${slug}`}
                        prefetch={false}
                        aria-current={isActive ? "page" : undefined}
                        onNavigate={() => setOpenMobile(false)}
                      />
                    }
                  >
                    <HugeiconsIcon icon={icon} size={16} aria-hidden="true" />
                    <span className="group-data-[collapsible=icon]:sr-only">
                      {label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </nav>
      </div>
    </Sidebar>
  );
}

function DashboardHeader({ currentPage }: { currentPage?: string }) {
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar();
  const expanded = isMobile ? openMobile : open;
  const action = expanded
    ? isMobile
      ? "Close"
      : "Collapse"
    : isMobile
      ? "Open"
      : "Expand";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-5">
      <button
        type="button"
        aria-label={`${action} dashboard navigation`}
        aria-expanded={expanded}
        aria-controls={
          !isMobile || openMobile ? "dashboard-navigation" : undefined
        }
        className={controlClassName}
        onClick={toggleSidebar}
      >
        <HugeiconsIcon icon={SidebarLeft01Icon} size={17} aria-hidden="true" />
      </button>
      <span aria-hidden="true" className="h-4 w-px shrink-0 bg-border" />
      <nav aria-label="Breadcrumb" className="min-w-0 text-sm">
        <ol className="flex items-center gap-2 text-muted-foreground">
          <li aria-current={currentPage ? undefined : "page"}>Dashboard</li>
          {currentPage && (
            <li className="flex min-w-0 items-center gap-2" aria-current="page">
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                className="shrink-0"
                aria-hidden="true"
              />
              <span className="truncate font-medium text-card-foreground">
                {currentPage}
              </span>
            </li>
          )}
        </ol>
      </nav>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const currentPage = dashboardLinks.find((link) => link.segment === segment);

  // Let the shell fill the space below the site header without growing with its pages.
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-clip p-2 contain-size sm:p-4">
      <SidebarProvider
        className="isolate min-h-0 rounded-2xl border border-border bg-muted/25 shadow-sm"
        style={
          {
            "--sidebar-width": "14rem",
            "--sidebar-width-icon": "3.5rem",
          } as CSSProperties
        }
      >
        <DashboardNavigation segment={segment} />
        <SidebarInset className="min-h-0 min-w-0 overflow-clip rounded-2xl bg-card text-card-foreground md:rounded-l-none md:border-l md:border-border">
          <DashboardHeader currentPage={currentPage?.label} />
          <section
            aria-label="Dashboard content"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: The scroll region needs keyboard focus.
            tabIndex={0}
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            {children}
          </section>
        </SidebarInset>
      </SidebarProvider>
      <Toaster
        toasterId="dashboard"
        position="top-right"
        containerStyle={{ top: "6rem" }}
        toastOptions={{
          style: {
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
    </div>
  );
}
