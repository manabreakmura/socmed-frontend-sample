"use client";

import { PostsComponent } from "@/components/posts-components";
import { useGetPosts } from "@/hooks/posts-hooks";

export default function Home() {
  const postsQuery = useGetPosts(true);

  return (
    <div className="pt-16 md:max-w-xl md:mx-auto sm:w-full px-2">
      <PostsComponent query={postsQuery} />
    </div>
  );
}
