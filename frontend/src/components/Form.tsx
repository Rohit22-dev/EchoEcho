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
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import supabase from "../../supabase";
import { initializeUser } from "@/lib/store";

export function ProfileForm({ register = false }) {
    const [load, setLoad] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { email, password, username } = values;

        try {
            setLoad(true);
            if (register) {
                await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                        data: { username: username },
                    },
                });
                toast({
                    description: "Open email to confirm your account.",
                });
                router.refresh();
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                // console.log(res)
                if (error) {
                    throw error;
                }
                const { access_token, refresh_token, expires_at } =
                    data.session;
                const expirationTime = expires_at! * 1000;

                const expirationDate = new Date(expirationTime);
                Cookies.set("access_token", access_token, {
                    expires: expirationDate,
                });
                Cookies.set("refresh_token", refresh_token);
                toast({
                    description: "Login successful",
                });
                router.push("/");
                // console.log("Logging in user...", res);mu
                await initializeUser();
            }
            setLoad(false);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function googleAuth() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            });
            if (error) {
                throw error;
            }
            console.log(data);
        } catch (error) {
            // Handle sign-in error
            console.error("Error:", error);
        }
    }

    let buttonText = "Submit";
    if (load) {
        buttonText = register ? "Registering..." : "loading...";
    }

    return (
        <div className="flex flex-col gap-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {register && (
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
                                            {...field}
                                            value={field.value as string}
                                        />
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
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        {...field}
                                    />
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
                                    Password must be at least 8 characters long
                                    and contain at least <br /> one lowercase
                                    letter, one uppercase letter, and one
                                    symbol.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={load} className="w-full">
                        {load && (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {buttonText}
                    </Button>

                    <div className="flex items-center gap-1.5">
                        <span className="border border-secondary flex-1 h-0 " />
                        <p>OR CONTINUE WITH</p>
                        <span className="border border-secondary flex-1 h-0" />
                    </div>
                </form>
            </Form>

            {/* SignIn buttons */}
            <div className="flex gap-8">
                <Button
                    variant="secondary"
                    className="w-full"
                    onClick={googleAuth}
                    disabled
                >
                    <FcGoogle className="mr-2" size={18} /> Google
                </Button>
                <Button variant="secondary" className="w-full" disabled>
                    <FaLinkedin className="mr-2 text-primary" size={18} />{" "}
                    Linkedin
                </Button>
            </div>
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
        </div>
    );
}
