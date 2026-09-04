"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useMe, useSignout } from "@/lib/auth";
import { Button, buttonVariants } from "./ui/button";

export function Navbar() {
  const { data: me } = useMe();
  const { mutate: signout } = useSignout();

  return (
    <NavigationMenu className="bg-background p-2 h-14 min-w-full fixed top-0 left-0 right-0 z-50">
      <NavigationMenuList className="justify-between items-center gap-2">
        <NavigationMenuItem className="hidden md:block">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            socmed-frontend-sample
          </Link>
        </NavigationMenuItem>
        {!me ? (
          <NavigationMenuItem className="flex gap-2">
            <Link href="/signin" className={buttonVariants()}>
              Signin
            </Link>
            <Link href="/signup" className={buttonVariants()}>
              Signup
            </Link>
          </NavigationMenuItem>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar size="lg">
                    <AvatarImage
                      src="#"
                      alt={me.username.slice(0, 2).toUpperCase()}
                    />
                    <AvatarFallback>
                      {me.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem>{me.username}</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signout()}
                >
                  Signout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
