import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";

const page = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="bg-background h-screen w-screen flex gap-5">
        <Header />
      </div>
    </ThemeProvider>
  );
};

export default page;
