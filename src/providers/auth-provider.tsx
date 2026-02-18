"use client";

import { type ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const { setUser } = useAuthStore();

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
          setUser(null);
        } else {
          setUser(await response.json());
        }
      } catch (err) {
        console.error(err);
      }
    };

    getCurrentUser();
  }, [setUser]);

  return <>{children}</>;
}
