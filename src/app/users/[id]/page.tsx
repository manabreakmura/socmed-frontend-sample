"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

interface User {
  id: number;
  username: string;
  created_at: string;
}

export default function User() {
  const router = useRouter();
  const { auth } = useAuthStore();
  const [user, setUser] = useState<User>();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (!auth) {
      router.push("/");
      return;
    }

    async function getUsers() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${params.id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }
    getUsers();
  }, [auth, router, params]);

  return (
    <Card className="w-full max-w-sm mx-2">
      <CardHeader>
        <CardTitle>{user?.username}</CardTitle>
      </CardHeader>
    </Card>
  );
}
