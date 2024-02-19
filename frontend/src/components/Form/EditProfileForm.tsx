import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiEdit } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "../ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { FetchProfile } from "../helper/Helper";


type UpdateFormData = {
  [key: string]: string | File | null;
  username: string;
  image: File | null;
  about: string;
  full_name: string;
};

type ProfileData = {
  id: string;
  full_name: string;
  avatar_url: string;
  username: string;
  email: string;
  about: string;
};


interface EditProfileFormProps {
  updating: boolean;
  setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}


const EditProfileForm:React.FC<EditProfileFormProps> = ({ updating, setUpdating }) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
  
    const getProfile = async () => {
      const { status, data, error } = await FetchProfile();
      if(status === "failed"){
        toast({variant:'destructive', description: error,title: "Error fetching profile"})
      }
      setProfile(data);
    }

    getProfile()
  }, []);

  const formData = {
    username: "",
    image: null,
    about: "",
    full_name: "",
  };

  const [updateFormData, setUpdateFormData] =
    useState<UpdateFormData>(formData);

  const handleUpdateForm = async () => {
    setUpdating(true)
    let image_path = "";
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(updateFormData, null, 2)}
          </code>
        </pre>
      ),
    });

    if (updateFormData.image) {
      const { data, error } = await supabase.storage
        .from("images/avatar")
        .upload("avatar_" + uuidv4() + ".jpg", updateFormData.image);
      if (error) {
        console.log(error);
      } else {
        image_path = data.path;
      }
    }

    let filteredData: any = {};

    for (const key in updateFormData) {
      if (updateFormData[key] !== null && updateFormData[key] !== "") {
        if (key === "image") {
          filteredData["avatar_url"] = `https://ruyrfyewnfhvqdfygbck.supabase.co/storage/v1/object/public/images/avatar/${image_path}`;
          continue;
        }
        filteredData[key] = updateFormData[key];
      }
    }

    filteredData["updated_at"] = new Date().toISOString();
    console.log(filteredData)

    const { data, error } = await supabase
      .from("profiles")
      .update(filteredData)
      .eq("id", profile?.id)

    setUpdateFormData(formData);

    setUpdating(false)

    toast({
      description: "Data updated successfully!",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="opacity-50">
          <FiEdit size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {/* <Form  updateFormData={updateFormData} setUpdateFormData={setUpdateFormData}/> */}
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={updateFormData.username}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  username: e.target.value,
                })
              }
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="full_name" className="text-right">
              Full Name
            </Label>
            <Input
              id="full_name"
              value={updateFormData.full_name}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  full_name: e.target.value,
                })
              }
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="image" className="text-left col-span-4">
              Profile Picture
            </Label>
            <Input
              id="image"
              // value={updateFormData?.image}
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setUpdateFormData({
                    ...updateFormData,
                    image: e.target.files[0],
                  });
                }
              }}
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="about" className="text-left">
              About
            </Label>
            <Textarea
              id="about"
              value={updateFormData.about}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  about: e.target.value,
                })
              }
              className="col-span-4"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleUpdateForm} disabled={updating}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditProfileForm;
