"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, MailIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSignup } from "@/lib/auth";

export const schema = z.object({
  email: z.email(),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(64, "Username must be at most 64 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(64, "Password must be at most 64 characters."),
});

export default function SigninPage() {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { mutate: signup } = useSignup();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={form.handleSubmit((payload) => signup(payload))}
        method="POST"
        className="max-w-md w-full"
      >
        <Card>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                  <InputGroupInput id="email" {...form.register("email")} />
                </InputGroup>
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <UserIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="username"
                    {...form.register("username")}
                  />
                </InputGroup>
                {form.formState.errors.username && (
                  <FieldError>
                    {form.formState.errors.username.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupButton
                      onClick={() => setIsPasswordHidden(!isPasswordHidden)}
                    >
                      {isPasswordHidden ? <EyeOffIcon /> : <EyeIcon />}
                    </InputGroupButton>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    type={isPasswordHidden ? "password" : "text"}
                    {...form.register("password")}
                  />
                </InputGroup>
                {form.formState.errors.password && (
                  <FieldError>
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Signin
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
