"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Hydration mismatch এড়ানোর জন্য mount হওয়া পর্যন্ত অপেক্ষা করা
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        className="h-10 w-10 rounded-full border border-border bg-card"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-10 w-10 rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:border-primary hover:text-foreground dark:hover:text-primary"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px] transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Moon className="h-[18px] w-[18px] transition-transform duration-200 rotate-0 scale-100" />
      )}
    </Button>
  );
}