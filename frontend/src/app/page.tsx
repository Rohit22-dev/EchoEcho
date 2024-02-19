"use client";

import React,{useEffect, useState} from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import User from "@/components/User";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import Posts from '@/components/Home/Posts'
import PostForm from "@/components/Home/PostForm";
import { Loader } from "@/components/helper/Helper";

const useAccessTokenCheck = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const checkCookie = async () => {
      const timer = setTimeout(() => {
        const accessToken = Cookies.get("access_token");
        if (accessToken) {
          router.push("/");
        } else {
          router.push("/login");
        }
        setLoading(false);
      }, 5000);

      () => clearTimeout(timer);
    };

    checkCookie();
  }, []);

  return loading;
};

// Define the Page component
const Page = () => {
  const loading = useAccessTokenCheck();
  const [posting, setPosting] = useState<boolean>(false);


  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-background h-screen w-screen flex flex-col gap-10">
          <Header />
          <div className="flex w-11/12 xl:w-4/5 mx-auto h-[83vh]">

            <div className="justify-center p-6 w-1/4 hidden md:flex h-full">
              <User />
              <PostForm setPosting={setPosting} />
              {posting && <Loader text="Posting" loadState={posting}/>}
            </div>

            <Separator orientation="vertical" />

            {/* Posts for the home page. */}
            <Posts />

            <Separator orientation="vertical" />

            <div className="justify-center p-6 w-1/4 hidden md:flex h-full">
              <div className="text-2xl">Page3</div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </ThemeProvider>
  );
};

// Export the Page component
export default Page;
