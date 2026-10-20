import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { http } from "@/lib/http";
import type { Comment } from "@/lib/types";

export function useCreateComment(post_id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { body: string }) => {
      return await http.post(`/api/v1/posts/${post_id}/comments`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post_id] });
    },
    onError: (error) => {
      toast.add({
        title: "Error:",
        description: JSON.stringify(error.message),
        type: "error",
      });
    },
  });
}

export function useGetComments(post_id: string) {
  const limit = 20;
  return useInfiniteQuery({
    queryKey: ["comments", post_id],
    queryFn: async ({ pageParam }) => {
      return (
        await http.get<Comment[]>(
          `/api/v1/posts/${post_id}/comments?offset=${pageParam}&limit=${limit}`,
        )
      ).data;
    },
    initialPageParam: 0,
    getNextPageParam: (last, all) => {
      if (last.length < limit) {
        return undefined;
      }

      return all.length * limit;
    },
    enabled: !!post_id,
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      post_id,
      comment_id,
    }: {
      post_id: string;
      comment_id: string;
    }) => {
      await http.delete(`/api/v1/posts/${post_id}/comments/${comment_id}`);
    },
    onSuccess: (_, { post_id }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", post_id] });
    },
    onError: (error) => {
      toast.add({
        title: "Error:",
        description: JSON.stringify(error.message),
        type: "error",
      });
    },
  });
}
