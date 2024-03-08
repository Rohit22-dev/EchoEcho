"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Posts from "@/components/Home/Posts";
import SideBar from "@/components/Home/SideBar";

const useAccessTokenCheck = () => {
  const router = useRouter();
  // const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkCookie = async () => {
      const accessToken = Cookies.get("access_token");
      if (accessToken) {
        router.push("/");
      } else {
        router.push("/login");
      }
      // setLoading(false);
    };

    checkCookie();
  }, []);

  // return loading;
};

// Define the Page component
const Page = () => {
  // const loading = useAccessTokenCheck();
  // const [posting, setPosting] = useState<boolean>(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      <div className="bg-background h-full flex flex-col w-4/5 mx-auto">
        <Header />
        <div className="flex w-full mx-auto h-[90vh]">
          <div className="justify-center p-4 w-1/6 hidden md:flex h-full flex-col gap-10">
            {/* <User /> */}
            <SideBar />
            {/* <PostForm setPosting={setPosting} />
              {posting && <Loader text="Posting" loadState={posting}/>} */}
          </div>

          {/* Posts for the home page. */}
          <Posts />

          <div className="justify-center p-4 w-1/4 hidden md:flex h-full">
            <div className="text-2xl bg-secondary/30 w-full h-full rounded-xl flex flex-col p-6">
              Page3
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

// Export the Page component
export default Page;
