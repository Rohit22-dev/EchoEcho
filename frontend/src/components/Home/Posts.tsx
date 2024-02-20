import React, { useEffect, useState } from "react";
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
import { BsRocket, BsFillRocketFill } from "react-icons/bs";
import { HiMiniHandThumbUp, HiOutlineHandThumbUp } from "react-icons/hi2";
import { BiCommentDetail, BiSolidCommentDetail } from "react-icons/bi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SkeletonCard } from "../SkeletonCard";
import supabase from "../../../supabase";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "../ui/use-toast";
import { FetchProfile } from "../helper/Helper";

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

const Post = ({ item }: { item: any }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const { status, data, error } = await FetchProfile();
      if (status === "failed") {
        toast({
          variant: "destructive",
          description: error,
          title: "Error fetching profile",
        });
        router.push("/login");
      }
      setProfile(data);
    };

    getProfile();
  }, [router]);

  const [isLiked, setIsLiked] = React.useState(false);
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
    fetchInitialLikeStatus();
  }, [item.id, profile?.id]);

  const [isCommentOpen, setIsCommentOpen] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [isRocket, setIsRocket] = React.useState(true);

  const toggleLike = async () => {
    setIsLiked(!isLiked);
    {
      !isLiked
        ? await supabase
            .from("post_likes")
            .insert({ post_id: item.id, user_id: profile?.id })
        : await supabase.from("post_likes").delete().eq("post_id", item.id);
    }
  };

  const toggleRocket = () => {
    setIsRocket(!isRocket);
  };

  const toggleComment = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false); // Set isImageLoading to false when image is loaded
  };

  return (
    <Card className="w-full bg-secondary/20">
      <CardHeader>
        <CardTitle className="text-primary">{item.username}</CardTitle>
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
                    <HiMiniHandThumbUp className="icon" size={24} />
                  ) : (
                    <HiOutlineHandThumbUp className="icon" size={24} />
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
                    <BsFillRocketFill className="icon" size={24} />
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
                    <BiSolidCommentDetail className="icon" size={24} />
                  ) : (
                    <BiCommentDetail className="icon" size={24} />
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
      {/* <CardFooter className="flex justify-between p-0">
        <div
          className={`${
            isCommentOpen ? "max-h-80" : "hidden"
          } ease-in-out transition-all duration-500 bg-background flex-1 rounded-md p-4 m-6`}
        >
          <h2 className="text-xl mb-2">Comments</h2>
          {data.comments?.map((comment: any, i: number) => {
            return (
              <div
                key={i}
                className="flex justify-between bg-secondary/30 my-2 p-2 rounded-md"
              >
                <p>{`• ${comment.content}`}</p>
                <p className="italic text-emerald-700">{`@_${comment?.user?.username}`}</p>
              </div>
            );
          })}
          <div className="flex w-full mt-6 items-center space-x-2 ">
            <Input type="email" placeholder="Comment" />
            <Button type="submit">
              Send <PaperPlaneIcon className="ml-1" />
            </Button>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
};

const Posts = () => {
  const numberOfSkeletons = 3;
  const [posts, setPosts] = React.useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getPosts = async () => {
      const { data, error } = await supabase.from("posts").select();
      if (error) {
        console.log("error", error);
      } else {
        setPosts(data);
      }
    };
    getPosts();
  }, []);

  return (
    <ScrollArea className="w-full md:w-[80%] p-4 mt-2 gap-4">
      {/* <h4 className="mb-4 text-lg font-medium leading-none text-center">Posts</h4> */}
      <div className="grid grid-cols-2 gap-6">
        {posts.length > 0 // Check if dummy_posts is not empty
          ? posts.map((item: any) => (
              <div key={item.id} className="mb-6">
                <Post item={item} />
              </div>
            ))
          : Array.from({ length: numberOfSkeletons }).map((_, index) => (
              <div key={index} className="mb-6">
                <SkeletonCard />
              </div>
            ))}
      </div>
    </ScrollArea>
  );
};

export default Posts;
