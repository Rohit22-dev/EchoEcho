import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

const Loader = () => {
  return (
    <div className="flex space-x-2 justify-center items-center bg-background">
      <span className="sr-only">Loading...</span>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce"></div>
    </div>
  );
};

const loading = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="grid place-items-center h-screen">
        <Loader />
      </div>
    </ThemeProvider>
  );
};

export default loading;
