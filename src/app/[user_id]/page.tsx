"use client";

import { useParams } from "next/navigation";
import {
  CreatePostComponent,
  PostsComponent,
} from "@/components/posts-components";
import { useMe } from "@/hooks/auth-hooks";
import { useGetUserPosts } from "@/hooks/posts-hooks";

export default function UserPage() {
  const { data: me } = useMe();
  const { user_id } = useParams<{ user_id: string }>();
  const postsQuery = useGetUserPosts(user_id);

  return (
    <div className="pt-16 md:max-w-xl md:mx-auto sm:w-full px-2">
      {user_id === me?.id && <CreatePostComponent />}
      <PostsComponent query={postsQuery} />
    </div>
  );
}
