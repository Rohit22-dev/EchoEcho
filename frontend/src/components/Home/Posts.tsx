import React, { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
    BsRocket,
    BsFillRocketFill,
    BsFillPersonPlusFill,
    BsPersonPlus,
} from "react-icons/bs";
import { HiMiniHandThumbUp, HiOutlineHandThumbUp } from "react-icons/hi2";
import { AiOutlineSend } from "react-icons/ai";
import { BiCommentDetail, BiSolidCommentDetail } from "react-icons/bi";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SkeletonCard } from "../SkeletonCard";
import supabase from "../../../supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePersonStore } from "@/lib/store";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Post {
    id: string;
    description: string;
    user_id: string;
    username: string;
    image_url: string;
}

type ProfileData = {
    id: string;
    full_name: string;
    avatar_url: string;
    username: string;
    email: string;
    about: string;
};

const Post = ({ item, profile }: { item: any; profile: any }) => {
    const [isLiked, setIsLiked] = React.useState(false);
    const [isCommentOpen, setIsCommentOpen] = React.useState(false);
    const [isImageLoading, setIsImageLoading] = React.useState(true);
    const [isRocket, setIsRocket] = React.useState(false);
    const [isFriend, setIsFriend] = React.useState(false);
    const [comments, setComments] = React.useState<any[] | null>(null);

    useEffect(() => {
        const fetchInitialLikeStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from("post_likes")
                    .select("*")
                    .eq("post_id", item.id)
                    .eq("user_id", profile?.id);
                if (error) {
                    console.error("Error checking like status", error);
                } else {
                    setIsLiked(data?.length > 0);
                }
            } catch (error) {
                console.error("Error checking like status", error);
            }
        };
        const checkFriendship = async () => {
            const { data, error } = await supabase
                .from("friends")
                .select()
                .eq("user_a", profile.id)
                .eq("user_b", item.user_id);

            if (error) {
                console.error("Error checking friendship:", error.message);
                return;
            }
            if (data && data.length > 0) {
                setIsFriend(true);
            } else {
                setIsFriend(false);
            }
        };
        checkFriendship();
        fetchInitialLikeStatus();
    }, []);

    const toggleLike = useCallback(async () => {
        setIsLiked(!isLiked);

        !isLiked
            ? await supabase
                  .from("post_likes")
                  .insert({ post_id: item.id, user_id: profile?.id })
            : await supabase.from("post_likes").delete().eq("post_id", item.id);
    }, [isLiked]);

    const toggleRocket = useCallback(async () => {
        setIsRocket(!isRocket);
    }, [isRocket]);

    const toggleFriend = useCallback(async () => {
        if (!isFriend) {
            const { error } = await supabase.from("friends").insert({
                user_a: profile.id,
                user_b: item.user_id,
                user_a_name: profile.username,
                user_b_name: item.username,
                status: "pending",
            });
            if (error) {
                console.error("Error adding friend:", error.message);
                return;
            }
            setIsFriend(true);
        }
    }, [isFriend]);

    const removeFriend = async () => {
        await supabase
            .from("friends")
            .delete()
            .eq("user_a", profile.id)
            .eq("user_b", item.user_id);
        setIsFriend(false);
    };

    const toggleComment = useCallback(async () => {
        setIsCommentOpen(!isCommentOpen);
        if (!isCommentOpen) {
            const { data } = await supabase
                .from("comments")
                .select()
                .eq("post_id", item.id)
                .order("created_at", { ascending: false });
            setComments(data);
        }
    }, [isCommentOpen]);

    const handleImageLoad = () => {
        setIsImageLoading(false); // Set isImageLoading to false when image is loaded
    };

    return (
        <Card className="bg-secondary/20">
            <CardHeader>
                <CardTitle className="text-primary flex justify-between">
                    <p>{item.username}</p>{" "}
                    {profile.id !== item.user_id && (
                        <div onClick={toggleFriend} className="">
                            {isFriend ? (
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <BsFillPersonPlusFill
                                            className="icon"
                                            // size={24}
                                        />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {item.username} will be removed
                                                from your friends list.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={removeFriend}
                                                className="bg-destructive/70 hover:bg-destructive text-destructive-foreground "
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <BsPersonPlus className="icon" size={24} />
                            )}
                            {/* <p className="my-auto text-xl">{data.comments.length}</p> */}
                        </div>
                    )}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isImageLoading && (
                    <Skeleton className="w-full max-h-[500px] bg-gray-200 animate-pulse" />
                )}
                <Image
                    src={item.image_url}
                    loading="lazy"
                    width={1200}
                    height={1200}
                    alt="image"
                    onLoad={handleImageLoad}
                    className="w-full max-h-[500px] object-cover"
                />
                <TooltipProvider>
                    <div className="flex rounded-md h-fit border">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={toggleLike}
                                    className="m-2 flex-1 flex justify-center gap-1 "
                                >
                                    {isLiked ? (
                                        <HiMiniHandThumbUp
                                            className="icon"
                                            size={24}
                                        />
                                    ) : (
                                        <HiOutlineHandThumbUp
                                            className="icon"
                                            size={24}
                                        />
                                    )}
                                    <p className="my-auto text-xl">
                                        {item.likes > 0 && item.likes}
                                    </p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Like</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={toggleRocket}
                                    className="m-2 flex-1 flex justify-center gap-1 "
                                >
                                    {isRocket ? (
                                        <BsFillRocketFill
                                            className="icon"
                                            size={24}
                                        />
                                    ) : (
                                        <BsRocket className="icon" size={24} />
                                    )}
                                    {/* <p className="my-auto text-xl">{data.likes.length}</p> */}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Rocket</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    onClick={toggleComment}
                                    className="m-2 flex-1 flex justify-center gap-1"
                                >
                                    {isCommentOpen ? (
                                        <BiSolidCommentDetail
                                            className="icon"
                                            size={24}
                                        />
                                    ) : (
                                        <BiCommentDetail
                                            className="icon"
                                            size={24}
                                        />
                                    )}
                                    {/* <p className="my-auto text-xl">{data.comments.length}</p> */}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comment</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </CardContent>
            <CardFooter className="flex justify-between p-0">
                <div
                    className={`${
                        isCommentOpen ? "max-h-80" : "hidden"
                    } ease-in-out transition-all duration-1000 bg-background flex-1 rounded-md p-4 m-6`}
                >
                    <h2 className="text-xl mb-2">
                        Comments&nbsp;{comments?.length}
                    </h2>
                    {comments?.map((item: any, i: number) => {
                        return (
                            <div
                                key={i}
                                className="flex justify-between bg-secondary/30 my-2 p-2 rounded-md"
                            >
                                <p>{`• ${item.comment}`}</p>
                                {/* <p className="italic text-emerald-700">{`@_${item?.user?.username}`}</p> */}
                            </div>
                        );
                    })}
                    <div className="flex w-full mt-6 items-center space-x-2 ">
                        <Input type="email" placeholder="Comment" />
                        <Button type="submit">
                            Send <AiOutlineSend className="ml-1" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

const Posts = () => {
    const numberOfSkeletons = 3;
    const [posts, setPosts] = useState<Post[]>([]);
    const user = usePersonStore((state) => state.user);

    useEffect(() => {
        const getPosts = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select()
                .order("created_at", { ascending: false });
            if (error) {
                console.log("error", error);
            } else {
                setPosts(data);
            }
        };
        getPosts();
    }, []);

    return (
        <ScrollArea className="p-4 w-full ">
            {/* <h4 className="mb-4 text-lg font-medium leading-none text-center">Posts</h4> */}

            <div className="grid grid-cols-2 gap-6 ">
                {posts.length > 0 // Check if dummy_posts is not empty
                    ? posts.map((item: any) => (
                          <div key={item.id} className="col-span-2">
                              <Post item={item} profile={user} />
                          </div>
                      ))
                    : Array.from({ length: numberOfSkeletons }).map(
                          (_, index) => (
                              <div key={index} className="col-span-2">
                                  <SkeletonCard />
                              </div>
                          )
                      )}
            </div>
        </ScrollArea>
    );
};

export default Posts;
