import React, { useState } from "react";
import PostForm from "./PostForm";
import { Loader } from "../helper/Helper";
import {Separator} from '@/components/ui/separator'
import { Button } from "@/components/ui/button";

const SideBar = () => {
  const [posting, setPosting] = useState<boolean>(false);
  return (
    <div className="bg-secondary/30 w-full h-full rounded-xl flex flex-col p-6">
      {[...Array(5)].map((_, i) => (
          <Button variant="ghost" key={i} className="my-2 text-xl">Option {i}
          </Button>
      ))}
      <div className="mt-auto">
        <PostForm setPosting={setPosting} />
      </div>
      {posting && <Loader text="Posting" loadState={posting} />}
    </div>
  );
};

export default SideBar;
