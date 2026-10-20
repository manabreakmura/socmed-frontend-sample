"use client";

import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Moon, Search, Sun, UserIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { http } from "@/lib/http";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";
import { AvatarSmallComponent } from "./users-components";

export function NavbarComponent() {
  const { data: me, isLoading: is_loading } = useMe();
  const { mutate: signout } = useSignout();
  const { theme, setTheme } = useTheme();

  return (
    <NavigationMenu className="bg-background p-2 h-14 min-w-full fixed top-0 left-0 right-0 z-50">
      <NavigationMenuList className="items-center gap-2">
        <NavigationMenuItem className={cn("flex-1", me && "hidden md:block")}>
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            socmed-frontend-sample
          </Link>
        </NavigationMenuItem>
        {!is_loading && !me && (
          <NavigationMenuItem className="flex gap-2">
            <Link href="/signin" className={buttonVariants()}>
              Signin
            </Link>
            <Link href="/signup" className={buttonVariants()}>
              Signup
            </Link>
          </NavigationMenuItem>
        )}

        {!is_loading && me && (
          <>
            <NavigationMenuItem className="flex flex-1 justify-center">
              <SearchComponent />
            </NavigationMenuItem>

            <div className="flex md:flex-1 justify-end items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <AvatarSmallComponent />
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
                      onClick={() =>
                        theme === "dark" ? setTheme("light") : setTheme("dark")
                      }
                    >
                      {theme === "dark" ? (
                        <>
                          <Moon />
                          Dark
                        </>
                      ) : (
                        <>
                          <Sun />
                          Light
                        </>
                      )}
                    </DropdownMenuItem>
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
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function SearchComponent() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, { wait: 500 });
  const is_searching = query !== debouncedQuery;
  const is_query_empty = query === "";

  const { data: results = [] } = useQuery({
    queryKey: ["users", debouncedQuery],
    queryFn: async () => {
      return (await http.get<User[]>(`/api/v1/users?search=${debouncedQuery}`))
        .data;
    },
    enabled: !!debouncedQuery,
  });

  return (
    <div className="relative w-full max-w-xl">
      <InputGroup
        className={cn(
          "py-4 border-2 border-primary focus-within:border-primary! focus-within:ring-0!",
          query && "border-primary!",
        )}
      >
        <InputGroupInput
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        {is_searching && !is_query_empty && (
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        )}
      </InputGroup>
      {!is_searching && !is_query_empty && (
        <Card className="absolute mt-2 z-50 border-2 border-primary w-full">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">
              {results.length > 0
                ? `Results found: ${results.length}`
                : "No results found"}
            </CardTitle>
            <Button onClick={() => setQuery("")}>Clear</Button>
          </CardHeader>
          {results.length > 0 && (
            <CardContent className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <Link
                  href={`/${result.id}`}
                  onClick={() => setQuery("")}
                  className="flex items-center gap-2 mb-2"
                  key={result.id}
                >
                  <AvatarSmallComponent />
                  {result.username}
                </Link>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
