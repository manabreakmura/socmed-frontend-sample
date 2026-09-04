import { useMutation, useQuery } from "@tanstack/react-query";
import { toFormData } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { http } from "./http";

export function useSignin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      return await http.post("/api/v1/auth/signin", toFormData(payload));
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      toast.add({
        title: "Error:",
        description: error.message,
        type: "error",
      });
    },
  });
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      username: string;
      password: string;
    }) => {
      return await http.post("/api/v1/auth/signup", payload);
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      toast.add({
        title: "Error:",
        description: error.message,
        type: "error",
      });
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return (await http.get("/api/v1/auth/me")).data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 0,
  });
}

export function useSignout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      return await http.post("/api/v1/auth/signout");
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      toast.add({
        title: "Error:",
        description: error.message,
        type: "error",
      });
    },
  });
}
