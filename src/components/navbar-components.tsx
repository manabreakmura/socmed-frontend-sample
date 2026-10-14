"use client";

import { LogOut, UserIcon } from "lucide-react";
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
import { useMe, useSignout } from "@/hooks/auth-hooks";
import { Button, buttonVariants } from "./ui/button";

export function NavbarComponent() {
  const { data: me, isLoading } = useMe();
  const { mutate: signout } = useSignout();

  return (
    <NavigationMenu className="bg-background p-2 h-14 min-w-full fixed top-0 left-0 right-0 z-50">
      <NavigationMenuList className="justify-between items-center gap-2">
        <NavigationMenuItem className="hidden md:block">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            socmed-frontend-sample
          </Link>
        </NavigationMenuItem>

        {!isLoading && !me && (
          <NavigationMenuItem className="flex gap-2">
            <Link href="/signin" className={buttonVariants()}>
              Signin
            </Link>
            <Link href="/signup" className={buttonVariants()}>
              Signup
            </Link>
          </NavigationMenuItem>
        )}

        {!isLoading && me && (
          <div className="flex gap-4 items-center">
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
                  <Link href={`/${me.id}`}>
                    <DropdownMenuItem>
                      <UserIcon />
                      {me.username}
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => signout()}
                  >
                    <LogOut />
                    Signout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
