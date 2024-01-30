"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

export function ProfileForm({ register = false }) {
  const [load, setLoad] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const cookieStore = cookies();
  const formSchema = z.object({
    email: z.string().email({
      message: "Invalid email format.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one symbol.",
      }),
    ...(register && {
      username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
      }),
    }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoad(true);
      if (register) {
        const res = await axios.post(
          "http://localhost:8000/auth/signup",
          values
        );
        toast({
          description: "User created successfully",
        });
        const oneDay = 24 * 60 * 60 * 1000;
        cookieStore.set("access_token", res.data.access_token, {
          expires: Date.now() - oneDay,
        });
        router.push("/");
      } else {
        const res = await axios.post(
          "http://localhost:8000/auth/login",
          values
        );
        toast({
          description: "Login successful",
        });
        const oneDay = 24 * 60 * 60 * 1000;
        cookieStore.set("access_token", res.data.access_token, {
          expires: Date.now() - oneDay,
        });
        router.push("/");
        // console.log("Logging in user...", res);
      }
      setLoad(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {register && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>
                Please enter a valid email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long and contain at least{" "}
                <br /> one lowercase letter, one uppercase letter, and one
                symbol.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={load}>
          {load && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          {load ? (register ? "Registering..." : "loading...") : "Submit"}
        </Button>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </Form>
  );
}
