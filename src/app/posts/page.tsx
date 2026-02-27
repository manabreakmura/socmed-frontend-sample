"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

interface Post {
  id: number;
  title: string;
  body: string;
  user_id: number;
  created_at: string;
}

export default function Posts() {
  const router = useRouter();
  const { auth, isLoading } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (!auth) {
        router.push("/");
        return;
      }
    }

    async function getPosts() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/?limit=100`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    }
    getPosts();
  }, [auth, router, isLoading]);

  return (
    <>
      {posts.map((post) => (
        <Card className="mx-auto my-2 w-full max-w-lg" key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              user_id: {post.user_id} created_at: {post.created_at}
            </CardDescription>
          </CardHeader>
          <CardContent className="break-all">
            <p>{post.body}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
