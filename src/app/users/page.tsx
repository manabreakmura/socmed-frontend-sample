"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useAuthStore } from "@/store/auth-store";

interface User {
  id: number;
  username: string;
  created_at: string;
}

export default function Users() {
  const router = useRouter();
  const { auth, isLoading } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (!auth) {
        router.push("/");
        return;
      }
    }

    async function getUsers() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }
    getUsers();
  }, [auth, router, isLoading]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mx-2">
      {users.map((user) => (
        <Item variant="outline" key={user.id}>
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarImage src="#" />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <Link href={`/users/${user.id}`}>{user.username}</Link>
            </ItemTitle>
            <ItemDescription>Last seen 5 months ago</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-full"
              aria-label="Invite"
            >
              <Plus />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
