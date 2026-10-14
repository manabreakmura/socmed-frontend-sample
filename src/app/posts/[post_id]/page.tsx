"use client";

import { useParams } from "next/navigation";
import {
  CommentsComponent,
  CreateCommentComponent,
} from "@/components/comments-components";
import {
  EmptyPostComponent,
  LoadingPostComponent,
  PostComponent,
} from "@/components/posts-components";
import { useGetComments } from "@/hooks/comments-hooks";
import { useGetPost } from "@/hooks/posts-hooks";

export default function PostPage() {
  const { post_id } = useParams<{ post_id: string }>();
  const { data, isLoading } = useGetPost(post_id);
  const commentsQuery = useGetComments(post_id);

  if (isLoading) {
    return (
      <div className="pt-16 md:max-w-xl md:mx-auto sm:w-full px-2">
        <LoadingPostComponent />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-16 md:max-w-xl md:mx-auto sm:w-full px-2">
        <EmptyPostComponent />
      </div>
    );
  }

  return (
    <div className="pt-16 md:max-w-xl md:mx-auto sm:w-full px-2">
      <PostComponent post={data} />
      <CreateCommentComponent post_id={post_id} />
      <CommentsComponent post_id={post_id} query={commentsQuery} />
    </div>
  );
}
