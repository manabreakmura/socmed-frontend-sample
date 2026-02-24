"use client";

import { EyeIcon, EyeOffIcon, MailIcon, UserIcon } from "lucide-react";
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

export default function signup() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    try {
      const signupRequest = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            username: username,
            password: password,
          }),
        },
      );

      if (!signupRequest.ok) {
        return;
      }

      router.push("/auth/login");
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <MailIcon />
                  </InputGroupAddon>
                </InputGroup>
              </Field>

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
                <Button type="submit">Sign Up</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
