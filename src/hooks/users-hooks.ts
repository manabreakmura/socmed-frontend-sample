import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { http } from "@/lib/http";
import type { User } from "@/lib/types";

export function useGetUser(user_id: string) {
  return useQuery({
    queryKey: ["users", user_id],
    queryFn: async () => {
      return (await http.get<User>(`/api/v1/users/${user_id}`)).data;
    },
  });
}

export function useFollow(user_id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await http.post(`/api/v1/users/${user_id}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", user_id] });
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

export function useUnfollow(user_id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await http.delete(`/api/v1/users/${user_id}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", user_id] });
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
