"use client";

import React from "react";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { AiOutlineSend } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const page = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="w-4/5 mx-auto h-screen flex flex-col gap-2">
        <Header />
        <div className="p-4 h-full w-full flex gap-4">
          <div className="w-1/4 bg-secondary/30 h-full rounded-xl flex flex-col p-4">
            <div className="flex w-full max-w-md items-center space-x-2">
              <Input type="text" placeholder="Username" />
              <Button type="submit" variant="secondary">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Button>
            </div>
            <Separator className="my-4" />
          </div>
          <div className="w-3/4 bg-secondary/30 h-full rounded-xl p-4">
            <div className="border rounded-xl h-full flex flex-col overflow-hidden">
              <div className="bg-background p-2 px-4">
                <h1>Hello</h1>
              </div>
              <ScrollArea className="bg-background/50 h-full m-2 rounded-lg"></ScrollArea>
              <div className="flex mt-auto items-center space-x-2 m-2">
                <Input type="email" placeholder="Message" />
                <Button type="submit">
                  Send <AiOutlineSend className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default page;
