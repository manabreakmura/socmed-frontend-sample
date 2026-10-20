"use client";

import { UserIcon } from "lucide-react";
import { useFollow, useUnfollow } from "@/hooks/users-hooks";
import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function AvatarSmallComponent() {
  return (
    <Avatar size="lg">
      <AvatarImage src="#" alt="#" />
      <AvatarFallback>
        <UserIcon className="size-1/2" />
      </AvatarFallback>
    </Avatar>
  );
}

export function AvatarLargeComponent() {
  return (
    <Avatar className="size-24 md:size-40">
      <AvatarImage src="#" alt="#" />
      <AvatarFallback>
        <UserIcon className="size-1/2" />
      </AvatarFallback>
    </Avatar>
  );
}

export function FollowButton({ user }: { user: User }) {
  const { mutate: follow } = useFollow(user.id);
  const { mutate: unfollow } = useUnfollow(user.id);
  return (
    <Button
      onClick={() => (user?.is_following ? unfollow() : follow())}
      variant={user?.is_following ? "secondary" : "default"}
    >
      {user?.is_following ? "Following" : "Follow"}
    </Button>
  );
}

export function UserPlaceholderComponent() {
  return (
    <Card className="border-2 border-primary ring-0 h-36 md:h-50 mb-2">
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
