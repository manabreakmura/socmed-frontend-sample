"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

export default function Users() {
  interface User {
    id: number;
    username: string;
    created_at: string;
  }

  const router = useRouter();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
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
  }, [user, router]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 mx-1">
      {users.map((user) => (
        <Card className="mx-auto w-full" key={user.id}>
          <CardHeader>
            <CardTitle>{user.username}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Follow
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
