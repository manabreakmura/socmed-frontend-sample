"use client";

import { type ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          setAuth(null);
        } else {
          setAuth(await response.json());
        }
      } catch (err) {
        console.error(err);
      }
    };

    getCurrentUser();
  }, [setAuth]);

  return <>{children}</>;
}
