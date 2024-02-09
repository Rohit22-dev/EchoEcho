import { ProfileForm } from "@/components/Form";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const Login = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="bg-background h-screen w-screen flex flex-col">
        {/* <Header /> */}
        <div className="flex flex-1">
          <div className="hidden lg:flex container w-2/5 h-full border-r bg-primary justify-center p-8">Hello</div>
          <div className="w-full sm:w-3/5 p-8 mx-auto">
            <Tabs defaultValue="login" className="space-y-6 mt-8 mx-auto xl:w-1/2">
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
