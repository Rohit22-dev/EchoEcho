"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Footer from "@/components/Footer";
import User from "@/components/User";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";

const useAccessTokenCheck = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkCookie = async () => {
      const timer = setTimeout(() => {
        // Your code here
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
  }, [router]);

  return loading;
};

// Define the Page component
const Page = () => {
  const loading = useAccessTokenCheck(); // Use the custom React Hook

  const tags = Array.from({ length: 70 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );

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
          <div className="flex w-11/12 xl:w-4/5 mx-auto h-[82vh]">
            <div className="justify-center p-6 w-1/4 hidden md:flex h-full">
              <User />
            </div>

            <Separator orientation="vertical" />

            <ScrollArea className="w-full md:w-1/2 p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
              {tags.map((tag) => (
                <React.Fragment key={tag}>
                  <div className="text-sm">{tag}</div>
                  <Separator className="my-2" />
                </React.Fragment>
              ))}
            </ScrollArea>

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
