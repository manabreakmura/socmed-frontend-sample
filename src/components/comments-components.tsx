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

export function CommentComponent({
  post_id,
  comment,
}: {
  post_id: string;
  comment: Comment;
}) {
  const { data: me } = useMe();
  const { mutate } = useDeleteComment();

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
            <DropdownMenuContent>
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  mutate({ post_id: post_id, comment_id: comment.id })
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

export function CreateCommentComponent({ post_id }: { post_id: string }) {
  const { mutate, isPending } = useCreateComment(post_id);

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
        mutate(payload, {
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
              <InputGroup className="border-2 border-primary">
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
                    disabled={isPending}
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

export function CommentsComponent({
  post_id,
  query,
}: {
  query: UseInfiniteQueryResult<InfiniteData<Comment[]>, Error>;
  post_id: string;
}) {
  const comments = query.data?.pages.flat() ?? [];

  return (
    <div className="flex flex-col">
      {comments.length > 0 && (
        <Card className="border-2 border-primary mb-2">
          <CardContent>
            {comments.map((comment) => (
              <div key={comment.id}>
                <CommentComponent post_id={post_id} comment={comment} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
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
