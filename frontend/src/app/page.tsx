import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Footer from "@/components/Footer";
import User from "@/components/User";

const page = () => {
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
      <div className="bg-background h-screen w-screen flex flex-col gap-10">
        <Header />
        <div className="flex w-11/12 xl:w-4/5 mx-auto h-[82vh]">
          <div className="justify-center p-6 w-1/4 hidden md:flex h-full">
            <User/>
          </div>

          <Separator orientation="vertical" />

          <ScrollArea className="w-full md:w-1/2 p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {tags.map((tag) => (
              <>
                <div key={tag} className="text-sm">
                  {tag}
                </div>
                <Separator className="my-2" />
              </>
            ))}
          </ScrollArea>

          <Separator orientation="vertical" />

          <div className="justify-center p-6 w-1/4 hidden md:flex h-full">
            <div className="text-2xl">Page3</div>
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default page;
