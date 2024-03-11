"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import EditProfileForm from "@/components/Form/EditProfileForm";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader } from "@/components/helper/Helper";
import supabase from "../../../supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePersonStore } from "@/lib/store";
import Cookies from "js-cookie";

type PostData = {
    id: string;
    user_id: string;
    description: string;
    created_at: string;
    image_url: string;
};

const Profile = () => {
    const [updating, setUpdating] = useState<boolean>(false);
    const [userPosts, setUserPosts] = useState<PostData[]>([]);
    const router = useRouter();
    const user = usePersonStore((state) => state.user);
    const setUser = usePersonStore((state) => state.setUser);

    useEffect(() => {
        const checkCookie = async () => {
            const accessToken = Cookies.get("access_token");
            if (accessToken) {
                router.push("/profile");
            } else {
                router.push("/login");
                setUser({ user: null });
            }
        };

        const getUserPost = async () => {
            const { data: posts } = await supabase
                .from("posts")
                .select("*")
                .eq("user_id", user?.id);
                setUserPosts(posts ?? []);
            };
            
        checkCookie();
        if (!updating) {
            getUserPost();
        }
    }, [router, updating]);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex flex-col bg-background h-screen w-4/5 mx-auto">
                <Header />
                {updating && <Loader loadState={updating} text="Updating" />}

                <div className="flex h-full justify-evenly p-4 gap-4">
                    <div className="flex gap-10 flex-col bg-secondary/30 rounded-md p-4 w-1/4">
                        <div className="flex h-fit justify-between w-full text-xl font-semibold ">
                            <p className="text-primary">{user?.username}</p>
                            <EditProfileForm
                                updating={updating}
                                setUpdating={setUpdating}
                            />
                        </div>
                        {user?.avatar_url && (
                            <Image
                                src={user.avatar_url}
                                className="self-center rounded-full ring-2 ring-primary"
                                alt="avatar"
                                width={180}
                                height={180}
                            />
                        )}
                        <div className="flex flex-col gap-4">
                            {Object.entries(user ?? {})
                                .filter(([key]) =>
                                    ["full_name", "email", "about"].includes(
                                        key
                                    )
                                )
                                .map(([key, value]) => (
                                    <p
                                        className="text-left font-semibold flex items-center text-lg"
                                        key={key}
                                    >
                                        {key.charAt(0).toUpperCase() +
                                            key.slice(1)}{" "}
                                        :&nbsp;
                                        <span className="border p-1 rounded-md flex-grow text-sm ">
                                            {value || "Not set"}
                                        </span>
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="flex gap-10 flex-col border rounded-md p-4 w-3/4">
                        <h1 className="self-center text-2xl drop-shadow-md font-bold bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
                            Posts
                        </h1>
                        <ScrollArea className="grid grid-cols-2 gap-4 h-[70vh]">
                            {userPosts.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-4 p-2 border rounded-md bg-secondary"
                                >
                                    <Image
                                        src={item.image_url}
                                        loading="lazy"
                                        width={1200}
                                        height={1200}
                                        alt="image"
                                        className="w-full max-h-[500px] object-cover"
                                    />
                                    <p>{item.description}</p>
                                    {/* <div className="flex rounded-md h-16">
                    <div
                      className="m-3 flex-1 flex text-primary justify-center gap-1 "
                    >
                      <SolidHandThumbUpIcon className="icon" />
                    </div>
                    <RocketLaunchIcon className="m-3 flex-1 cursor-pointer" />
                    <div
                      className="m-3 flex-1 flex justify-center text-rose-800 gap-1"
                    >
                      <OutlineComment className="icon" />
                    </div>
                  </div> */}
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Profile;
