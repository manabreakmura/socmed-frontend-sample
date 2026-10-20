"use client";

import { useParams } from "next/navigation";
import {
  CommentsComponent,
  CreateCommentComponent,
} from "@/components/comments-components";
import { PostComponent } from "@/components/posts-components";
import { useMe } from "@/hooks/auth-hooks";
import { useGetComments } from "@/hooks/comments-hooks";
import { useGetPost } from "@/hooks/posts-hooks";

export default function PostPage() {
  const { post_id } = useParams<{ post_id: string }>();
  const { data: me } = useMe();
  const postQuery = useGetPost(post_id);
  const commentsQuery = useGetComments(post_id);

  return (
    <div className="pt-16 md:max-w-xl md:mx-auto sm:w-full px-2 md:px-0">
      <PostComponent query={postQuery} />
      {me && <CreateCommentComponent post_id={post_id} />}
      <CommentsComponent post_id={post_id} query={commentsQuery} />
    </div>
  );
}
