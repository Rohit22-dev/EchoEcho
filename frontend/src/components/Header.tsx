import React, { useEffect, useState } from "react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    MagnifyingGlassIcon,
    BellIcon,
    CheckIcon,
    Cross2Icon,
} from "@radix-ui/react-icons";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePersonStore } from "@/lib/store";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import supabase from "../../supabase";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
];

const NavigationMenuDemo = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                        Getting started
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        {/* <Icons.logo className="h-6 w-6" /> */}
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Beautifully designed components
                                            built with Radix UI and Tailwind
                                            CSS.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Introduction">
                                Re-usable components built using Radix UI and
                                Tailwind CSS.
                            </ListItem>
                            <ListItem
                                href="/docs/installation"
                                title="Installation"
                            >
                                How to install dependencies and structure your
                                app.
                            </ListItem>
                            <ListItem
                                href="/docs/primitives/typography"
                                title="Typography"
                            >
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                        Components
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/chat" legacyBehavior passHref>
                        <NavigationMenuLink
                            className={cn(
                                navigationMenuTriggerStyle(),
                                "bg-transparent"
                            )}
                        >
                            Chat
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

const Header = () => {
    const [notification, setNotification] = useState<any | null>(null);
    const router = useRouter();
    const setUser = usePersonStore((state) => state.setUser);
    const user = usePersonStore((state) => state.user);

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from("friends")
                .select()
                .eq("user_b", user?.id)
                .eq("status", "pending");
            if (error) {
                console.error("Error fetching notifications", error);
                return;
            }
            setNotification(data);
        };
        fetchNotifications();
    }, []);

    const requestAccepted = async () => {
        const { data, error } = await supabase
            .from("friends")
            .update({ status: "accepted" })
            .eq("user_b", user?.id)
            .eq("status", "pending");
        if (error) {
            console.error("Error accepting request", error);
            return;
        }
    };

    const requestDenied = async () => {
        const { data, error } = await supabase
            .from("friends")
            .delete()
            .eq("user_b", user?.id)
            .eq("status", "pending");
        if (error) {
            console.error("Error denying request", error);
            return;
        }
    };

    async function signOut() {
        try {
            await supabase.auth.signOut();
            setUser({ user: null });

            router.push("/login");
        } catch (error) {
            // Handle sign-in error
            console.error("Error:", error);
        }
    }

    return (
        <div className="h-fit w-full p-4">
            <div className="bg-secondary/30 p-2 px-4 rounded-xl justify-between flex items-center mx-auto">
                <Button
                    variant="link"
                    className="text-xl font-bold cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    Echo Echo
                </Button>
                <NavigationMenuDemo />
                <div className="flex w-full max-w-md items-center space-x-2">
                    <Input type="text" placeholder="search" />
                    <Button type="submit" variant="secondary">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex gap-2 ">
                    <Popover>
                        <PopoverTrigger className="relative">
                            {/* <span className="absolute translate-x-3 -translate-y-3 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span> */}
                            <BellIcon className="h-5 w-5 " />
                        </PopoverTrigger>
                        <PopoverContent>
                            {notification?.length === 0 ? (
                                <p>No new notifications</p>
                            ) : (
                                <>
                                    <Link
                                        href="/"
                                        className="text-primary underline underline-offset-1"
                                    >
                                        {notification && notification[0]?.user_a_name}
                                    </Link>
                                    &nbsp; wants to be your friend.
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="hover:bg-primary/50"
                                        onClick={requestAccepted}
                                    >
                                        <CheckIcon />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="hover:bg-destructive/50"
                                        onClick={requestDenied}
                                    >
                                        <Cross2Icon />
                                    </Button>
                                </>
                            )}
                        </PopoverContent>
                    </Popover>

                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer ring-1">
                                <AvatarImage
                                    src={
                                        user?.avatar_url ??
                                        "https://github.com/shadcn.png"
                                    }
                                    alt="@shadcn"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => router.push("/profile")}
                                >
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Invite users
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>
                                                Email
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Message
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                More...
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem>New Team</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={signOut}>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default Header;
