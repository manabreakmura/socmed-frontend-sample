"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Ellipsis, Trash } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { useMe } from "@/hooks/auth-hooks";
import { useCreateComment, useDeleteComment } from "@/hooks/comments-hooks";
import type { Comment } from "@/lib/types";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Field, FieldGroup } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { Skeleton } from "./ui/skeleton";

export function CommentComponent({
  post_id,
  comment,
}: {
  post_id: string;
  comment: Comment;
}) {
  const { data: me } = useMe();
  const { mutate: submit } = useDeleteComment();

  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Link href={`/${comment.user.id}`}>{comment.user.username}</Link>
          <div className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleString()}
          </div>
        </div>
        {comment.user.id === me?.id && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size="icon" variant="ghost">
                  <Ellipsis />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  submit({ post_id: post_id, comment_id: comment.id })
                }
              >
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="text-muted-foreground wrap-break-word">
        {comment.body}
      </div>
    </div>
  );
}

export function CommentsComponent({
  post_id,
  query,
}: {
  query: UseInfiniteQueryResult<InfiniteData<Comment[]>, Error>;
  post_id: string;
}) {
  if (query.isLoading) {
    return <CommentsPlaceholderComponent />;
  }

  if (!query.data?.pages.flat().length) {
    return (
      <Card className="border-2 border-primary ring-0 mb-2">
        <CardContent>No Comments</CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col">
      <Card className="border-2 border-primary ring-0 mb-2">
        <CardContent>
          {query.data?.pages.flat().map((comment) => (
            <CommentComponent
              key={comment.id}
              post_id={post_id}
              comment={comment}
            />
          ))}
        </CardContent>
      </Card>

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

export function CreateCommentComponent({ post_id }: { post_id: string }) {
  const { mutate: submit, isPending: is_pending } = useCreateComment(post_id);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        body: z
          .string()
          .min(1, "Comment must be at least 1 character.")
          .max(500, "Comment must be at most 500 characters."),
      }),
    ),
    defaultValues: { body: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit((payload) => {
        submit(payload, {
          onSuccess: () => {
            form.reset();
          },
        });
      })}
      className="mb-2"
    >
      <FieldGroup>
        <Controller
          name="body"
          control={form.control}
          render={({ field }) => (
            <Field>
              <InputGroup className="border-2 border-primary focus-within:border-primary! focus-within:ring-0!">
                <InputGroupTextarea
                  id="body"
                  placeholder="Add a comment..."
                  {...field}
                  maxLength={500}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupButton
                    variant="default"
                    size="sm"
                    type="submit"
                    className="ml-auto"
                    disabled={is_pending}
                  >
                    Comment
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}

export function CommentsPlaceholderComponent() {
  return (
    <Card className="border-2 border-primary ring-0 mb-2">
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
