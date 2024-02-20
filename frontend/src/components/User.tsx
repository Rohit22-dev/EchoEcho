import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const User = () => {
  return (
    <Card className="w-full h-full p-2 flex flex-col items-center gap-2">
      <CardHeader>
        <Avatar className="w-[7vw] h-[7vw]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </CardHeader>
      <Separator />
      <CardContent>
        <h1 className="text-lg">Username</h1>
      </CardContent>
    </Card>
  );
};

export default User;
