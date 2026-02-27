"use client";

import { EyeIcon, EyeOffIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAuthStore } from "@/store/auth-store";

export default function Login() {
  const router = useRouter();
  const { auth, setAuth } = useAuthStore();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (auth) {
      router.push("/");
    }
  }, [auth, router]);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const loginRequest = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!loginRequest.ok) {
        return;
      }

      await loginRequest.json();

      const getCurrentUserRequest = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!getCurrentUserRequest.ok) {
        setAuth(null);
      } else {
        const currentUser = await getCurrentUserRequest.json();
        setAuth(currentUser);
        setUsername("");
        setPassword("");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] justify-center items-center">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="w-100">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="username"
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <UserIcon />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <InputGroupAddon
                    align="inline-end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
