"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/store/auth-store";
import { ThemeToggle } from "./theme-toggle";
import { UserNavbar } from "./user-navbar";

export function Navbar() {
  const { user } = useAuthStore();

  return (
    <NavigationMenu className="h-12">
      <NavigationMenuList className="justify-between min-w-screen p-2">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">socmed-frontend-sample</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <div className="flex gap-1">
          {!user ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/auth/login">LOGIN</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/auth/signup">SIGN UP</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <UserNavbar />
          )}
          <ThemeToggle />
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
