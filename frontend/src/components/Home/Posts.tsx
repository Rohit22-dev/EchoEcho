import React from "react";
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
  HandThumbUpIcon as OutlineHandThumbUpIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineComment,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as SolidHandThumbUpIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidComment,
} from "@heroicons/react/24/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { SkeletonCard } from "../SkeletonCard";

const dummy_posts = [
  {
    _id: "1",
    user: { id: 1, username: "John Doe" },
    image: {
      image_id: 123,
      url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    content: "This is a dummy post for the frontend.",
    likes: [{ id: 2, username: "Jane Doe" }],
    comments: [
      { 
        user: { id: 3, username: "Foo Bar" },
        content: "This is a dummy comment.",
      },
    ],
    date: 1677982800,
  },
  {
    _id: "2",
    user: { id: 2, username: "Jane Doe" },
    image: {
      image_id: 234,
      url: "https://images.unsplash.com/photo-1488716656724-3c8820d714a0?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    content: "This is another dummy post for the frontend.",
    likes: [],
    comments: [],
    date: 1678242000,
  },
  {
    _id: "3",
    user: { id: 3, username: "Foo Bar" },
    image: {
      image_id: 345,
      url: "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    content: "This is a third dummy post for the frontend.",
    likes: [{ id: 1, username: "John Doe" }],
    comments: [
      {
        user: { id: 2, username: "Jane Doe" },
        content: "This is another dummy comment.",
      },
    ],
    date: 1677468400,
  },
  {
    _id: "4",
    user: { id: 4, username: "Lorem Ipsum" },
    image: {
      image_id: 456,
      url: "https://images.unsplash.com/photo-1505058567159-6f2a114a1a70?q=80&w=2046&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    content: "This is a fourth dummy post for the frontend.",
    likes: [],
    comments: [],
    date: 1677727600,
  },
  {
    _id: "5",
    user: { id: 5, username: "Dolor Sit Amet" },
    image: {
      image_id: 567,
      url: "https://images.unsplash.com/photo-1480109866847-0b432ceb666a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    content: "This is a fifth dummy post for the frontend.",
    likes: [{ id: 4, username: "Lorem Ipsum" }],
    comments: [
      {
        user: { id: 3, username: "Foo Bar" },
        content: "This is another dummy comment.",
      },
    ],
    date: 1678070000,
  },
];

const Post = ({ data }: { data: any }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isCommentOpen, setIsCommentOpen] = React.useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleComment = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  return (
    <Card className="w-full bg-secondary/20">
      <CardHeader>
        <CardTitle>{data.user.username}</CardTitle>
        <CardDescription>{data.content}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Image
          src={data.image.url}
          loading="lazy"
          width={1200}
          height={1200}
          alt="image"
          className="w-full max-h-[500px] object-cover"
        />
        <TooltipProvider>
          <div className="flex rounded-md h-16">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={toggleLike}
                  className="m-3 flex-1 flex text-primary justify-center gap-1 "
                >
                  {isLiked ? (
                    <SolidHandThumbUpIcon className="icon" />
                  ) : (
                    <OutlineHandThumbUpIcon className="icon" />
                  )}
                  <p className="my-auto text-xl">{data.likes.length}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like</p>
              </TooltipContent>
            </Tooltip>
            <RocketLaunchIcon className="m-3 flex-1 cursor-pointer" />
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={toggleComment}
                  className="m-3 flex-1 flex justify-center text-rose-800 gap-1"
                >
                  {isCommentOpen ? (
                    <SolidComment className="icon" />
                  ) : (
                    <OutlineComment className="icon" />
                  )}
                  <p className="my-auto text-xl">{data.comments.length}</p>
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
            <Button type="submit">Send <PaperPlaneIcon className="ml-1"/></Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const posts = () => {
  const numberOfSkeletons = 3;
  return (
    <ScrollArea className="w-full md:w-1/2 p-4 mt-2 gap-4">
      {/* <h4 className="mb-4 text-lg font-medium leading-none text-center">Posts</h4> */}
      {dummy_posts.length > 0 ? ( // Check if dummy_posts is not empty
        dummy_posts.map((item: any) => (
          <div key={item._id} className="mb-6">
            <Post data={item} />
          </div>
        ))
      ) : (
        Array.from({ length: numberOfSkeletons }).map((_, index) => (
          <div key={index} className="mb-6">
            <SkeletonCard />
          </div>
        ))
      )}
    </ScrollArea>
  );
};

export default posts;
