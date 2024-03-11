"use client";

import { ProfileForm } from "@/components/Form";
import { ThemeProvider } from "@/components/theme-provider";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import bar from "../../../public/images/bar.png";
import auth from "../../../public/images/auth.png";


const Login = () => {
  const [typedText, setTypedText] = React.useState("");

  // useEffect(() => {
  //   const slogans = [
  //     "Welcome to the Auth page.",
  //     "Please login or register to continue",
  //   ];
  //   let index = 1;
  //   let sloganIndex = 0;
  //   let direction = 1;
  //   const interval = setInterval(() => {
  //     setTypedText(slogans[sloganIndex].slice(0, index + 1));
  //     if (index === 0 || index === slogans[0].length - 1) {
  //       if (index === 0) sloganIndex = (sloganIndex + 1) % slogans.length;
  //       direction *= -1;
  //     }
  //     index += direction;
  //   }, 250);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="bg-background h-screen w-screen flex flex-col">
        {/* {status === "authenticated" && <Header />} */}
        <div className="flex flex-grow">
          <div className="hidden lg:flex container w-2/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400 to-blue-800 p-8 text-foreground justify-center text-center border-r-8 border-white/50">
            <div className="space-y-10 flex flex-col items-center justify-around">
              {/* <motion.h1
                className={cn(
                  "text-8xl font-semibold drop-shadow-md mb-40 ",
                  alegreyaFont.className
                )}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.1,
                  ease: [0, 0.71, 0.2, 1.01],
                  scale: {
                    type: "keyframes",
                    damping: 3,
                    stiffness: 100,
                    restDelta: 0.001,
                  },
                }}
              >
                EchoEcho
              </motion.h1> */}
              <h1 className="text-8xl font-semibold drop-shadow-md font-alegreya">
                EchoEcho
              </h1>
              <Image src={auth} alt="bar" height={600} />
              {/* <p
                className="text-3xl mx-auto leading-7 tracking-tight after:content-['|'] after:w-[0.125em] after:animate-blinking-bar"
              >
                {typedText}
              </p> */}
              <footer className="">Footer</footer>
            </div>
          </div>

          <div className="w-full sm:w-3/5 p-8 m-auto">
            <Tabs
              defaultValue="login"
              className="space-y-6 mt-8 mx-auto xl:w-1/2"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Regsiter</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <ProfileForm />
              </TabsContent>
              <TabsContent value="register">
                <ProfileForm register={true} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
