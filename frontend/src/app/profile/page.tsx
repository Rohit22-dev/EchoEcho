"use client";

import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import EditProfileForm from "@/components/Form/EditProfileForm";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FetchProfile,Loader } from "@/components/helper/Helper";

type ProfileData = {
  id: string;
  full_name: string;
  avatar_url: string;
  username: string;
  email: string;
  about: string;
};

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const { status, data, error } = await FetchProfile();
      if (status === "failed") {
        toast({
          variant: "destructive",
          description: error,
          title: "Error fetching profile",
        });
        router.push("/login");
      }
      setProfile(data);
    };

    if (!updating) {
      getProfile();
    }
  }, [router,updating]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col bg-background gap-4 h-full">
        <Header />
       {updating && <Loader loadState={updating} text="Updating" />}

        <div className="flex gap-10 flex-grow flex-col border rounded-md m-4 p-4 w-1/3">
          <div className="flex h-fit justify-between w-full text-2xl font-semibold ">
            <p className="text-primary italic">{profile?.username}</p>
            <EditProfileForm updating={updating} setUpdating={setUpdating} />
          </div>
          {profile?.avatar_url && (
            <Image
              src={profile.avatar_url}
              className="self-center rounded-full ring-2 ring-primary"
              alt="avatar"
              width={180}
              height={180}
            />
          )}
          <div className="flex flex-col gap-4">
            {Object.entries(profile ?? {})
              .filter(([key]) => ["full_name", "email", "about"].includes(key))
              .map(([key, value]) => (
                <p
                  className="text-left font-semibold flex items-center text-lg"
                  key={key}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} :&nbsp;
                  <span className="border p-1 rounded-md flex-grow text-sm ">
                    {value}
                  </span>
                </p>
              ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Profile;
