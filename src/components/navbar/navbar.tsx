"use client";

import { FilesIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserNavbar } from "./user-navbar";

export function Navbar() {
  const { auth } = useAuthStore();

  return (
    <NavigationMenu className="h-12">
      <NavigationMenuList className="justify-between min-w-screen p-2">
        <div className="flex">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/">socmed-frontend-sample</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {!auth ? (
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
            <>
              <NavigationMenuItem>
                <Button
                  asChild
                  className={navigationMenuTriggerStyle()}
                  variant="ghost"
                >
                  <Link href="/users">
                    <UsersIcon /> USERS
                  </Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  asChild
                  className={navigationMenuTriggerStyle()}
                  variant="ghost"
                >
                  <Link href="/posts">
                    <FilesIcon /> POSTS
                  </Link>
                </Button>
              </NavigationMenuItem>
            </>
          )}
        </div>

        <div>
          {auth ? <UserNavbar /> : ""}
          <ThemeToggle />
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
