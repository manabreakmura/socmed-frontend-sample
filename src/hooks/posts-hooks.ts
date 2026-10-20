import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { http } from "@/lib/http";
import type { Post } from "@/lib/types";

export function useGetPost(id: string) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      return (await http.get<Post>(`/api/v1/posts/${id}`)).data;
    },
  });
}

export function useGetPosts(feed: boolean) {
  const limit = 20;
  return useInfiniteQuery({
    queryKey: ["posts", "feed", feed],
    queryFn: async ({ pageParam }) => {
      return (
        await http.get<Post[]>(
          `/api/v1/posts?feed=${feed}&offset=${pageParam}&limit=${limit}`,
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
  });
}

export function useGetUserPosts(id: string) {
  const limit = 20;
  return useInfiniteQuery({
    queryKey: ["posts", "users", id],
    queryFn: async ({ pageParam }) => {
      return (
        await http.get<Post[]>(
          `/api/v1/posts?feed=false&user_id=${id}&offset=${pageParam}&limit=${limit}`,
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
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { body: string }) => {
      return await http.post("/api/v1/posts", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      post_id,
      payload,
    }: {
      post_id: string;
      payload: { body: string };
    }) => {
      return await http.patch(`/api/v1/posts/${post_id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ post_id }: { post_id: string }) => {
      await http.delete(`/api/v1/posts/${post_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      post_id,
      is_liked,
    }: {
      post_id: string;
      is_liked: boolean;
    }) => {
      is_liked
        ? await http.delete(`/api/v1/posts/${post_id}/like`)
        : await http.post(`/api/v1/posts/${post_id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      post_id,
      is_bookmarked,
    }: {
      post_id: string;
      is_bookmarked: boolean;
    }) => {
      is_bookmarked
        ? await http.delete(`/api/v1/posts/${post_id}/bookmark`)
        : await http.post(`/api/v1/posts/${post_id}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
