"use client";

import { useParams } from "next/navigation";
import {
  CreatePostComponent,
  PostsComponent,
} from "@/components/posts-components";
import { Card, CardContent } from "@/components/ui/card";
import {
  AvatarLargeComponent,
  FollowButton,
  UserPlaceholderComponent,
} from "@/components/users-components";
import { useMe } from "@/hooks/auth-hooks";
import { useGetUserPosts } from "@/hooks/posts-hooks";
import { useGetUser } from "@/hooks/users-hooks";

export default function UserPage() {
  const { user_id } = useParams<{ user_id: string }>();
  const { data: me } = useMe();
  const { data: user, isLoading: is_loading } = useGetUser(user_id);

  const postsQuery = useGetUserPosts(user_id);

  if (is_loading) {
    return (
      <div className="pt-16 md:max-w-xl md:mx-auto sm:w-full px-2 md:px-0">
        <UserPlaceholderComponent />
      </div>
    );
  }

  return (
    <div className="pt-16 md:max-w-xl md:mx-auto sm:w-full px-2 md:px-0">
      <Card className="border-2 border-primary ring-0 h-36 md:h-50 mb-2">
        <CardContent className="flex items-center gap-2">
          <AvatarLargeComponent />
          <div className="flex flex-col justify-between h-full">
            <div className="text-2xl">{user?.username}</div>
            {user && user?.id !== me?.id && <FollowButton user={user} />}
          </div>
        </CardContent>
      </Card>
      {user_id === me?.id && <CreatePostComponent />}
      <PostsComponent query={postsQuery} />
    </div>
  );
}
