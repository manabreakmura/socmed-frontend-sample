"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  Bookmark,
  Ellipsis,
  Heart,
  MessageCircle,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/auth-hooks";
import {
  useBookmarkPost,
  useCreatePost,
  useDeletePost,
  useLikePost,
  useUpdatePost,
} from "@/hooks/posts-hooks";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Field, FieldError, FieldGroup } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";

export function CreatePostComponent() {
  const { mutate: submit, isPending: is_pending } = useCreatePost();
  const form = useForm({
    resolver: zodResolver(
      z.object({
        body: z
          .string()
          .min(1, "Post must be at least 1 character.")
          .max(2000, "Post must be at most 2000 characters."),
      }),
    ),
    defaultValues: { body: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit((payload) =>
        submit(payload, {
          onSuccess: () => {
            form.reset();
          },
        }),
      )}
      method="POST"
      className="mb-2"
    >
      <Controller
        name="body"
        control={form.control}
        render={({ field }) => (
          <Field>
            <InputGroup className="border-2 border-primary">
              <InputGroupTextarea
                id="body"
                placeholder="Add a post..."
                {...field}
                maxLength={2000}
              />
              <InputGroupAddon align="block-end">
                <InputGroupButton
                  variant="default"
                  size="sm"
                  className="ml-auto"
                  type="submit"
                  disabled={is_pending}
                >
                  Post
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        )}
      />
    </form>
  );
}

export function PostComponent({ post }: { post: Post }) {
  const { data: me } = useMe();
  const { mutate: del } = useDeletePost();
  const { mutate: update } = useUpdatePost();
  const { mutate: like } = useLikePost();
  const { mutate: bookmark } = useBookmarkPost();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        body: z
          .string()
          .min(1, "Post must be at least 1 character.")
          .max(2000, "Post must be at most 2000 characters."),
      }),
    ),
    defaultValues: { body: post.body },
  });

  return (
    <Card className="border-2 border-primary mb-2">
      <CardHeader>
        <CardTitle className="flex gap-2 justify-between items-center">
          <div className="flex gap-2">
            <Link href={`/${post.user.id}`}>
              <Avatar size="lg">
                <AvatarImage
                  src="#"
                  alt={post.user.username.slice(0, 2).toUpperCase()}
                />
                <AvatarFallback>
                  {post.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex flex-col">
              <Link href={`/${post.user.id}`}>{post.user.username}</Link>
              <div className="text-xs text-muted-foreground">
                <Link href={`/posts/${post.id}`}>
                  {new Date(post.created_at).toLocaleString()}
                </Link>
              </div>
            </div>
          </div>

          {post.user.id === me?.id && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button size="icon" variant="ghost">
                    <Ellipsis className="size-6" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => del({ post_id: post.id })}
                >
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing && <div className="wrap-break-word">{post.body}</div>}
        {isEditing && (
          <form
            onSubmit={form.handleSubmit((payload) =>
              update(
                { post_id: post.id, payload },
                {
                  onSuccess: () => {
                    form.reset({ body: payload.body });
                    setIsEditing(false);
                  },
                },
              ),
            )}
          >
            <FieldGroup>
              <Field>
                <InputGroup>
                  <InputGroupTextarea id="body" {...form.register("body")} />
                </InputGroup>
                {form.formState.errors.body && (
                  <FieldError>{form.formState.errors.body.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
            <div className="flex justify-between gap-2">
              <Button
                className="w-auto mt-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button className="w-auto mt-2" type="submit">
                Confirm
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex justify-center items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => like({ post_id: post.id, is_liked: post.is_liked })}
          >
            <Heart
              className={cn(
                "size-6",
                post.is_liked && "fill-red-500 text-red-500",
              )}
            />
          </Button>
          <Button size="icon" variant="ghost">
            <Link href={`/posts/${post.id}`}>
              <MessageCircle className={cn("size-6")} />
            </Link>
          </Button>
        </div>

        <Button
          onClick={() =>
            bookmark({
              post_id: post.id,
              is_bookmarked: post.is_bookmarked,
            })
          }
          size="icon"
          variant="ghost"
        >
          <Bookmark
            className={cn(
              "size-6",
              post.is_bookmarked &&
                "fill-accent-foreground text-accent-foreground",
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PostsComponent({
  query,
}: {
  query: UseInfiniteQueryResult<InfiniteData<Post[]>, Error>;
}) {
  const posts = query.data?.pages.flat() ?? [];

  if (query.isLoading) {
    return <LoadingPostComponent />;
  }

  if (!posts?.length) {
    return <EmptyPostComponent />;
  }

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <PostComponent key={post.id} post={post} />
      ))}
      {query.hasNextPage && (
        <Button
          className="mx-auto mb-2"
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        >
          {query.isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}

export function LoadingPostComponent() {
  return (
    <Card className="border-2 border-primary mb-2">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-1/3" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/3" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <div className="flex w-full gap-2">
          <Skeleton className="h-4 w-1/12" />
          <Skeleton className="h-4 w-1/12" />
        </div>

        <Skeleton className="h-4 w-1/12" />
      </CardFooter>
    </Card>
  );
}

export function EmptyPostComponent() {
  return (
    <Card className="mb-2">
      <CardContent>
        <p>No Posts</p>
      </CardContent>
    </Card>
  );
}
