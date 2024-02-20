import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useRef, useState } from "react";
import zod from "zod";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import supabase from "../../../supabase";
import { FetchProfile } from "../helper/Helper";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PostForm = ({ setPosting }: { setPosting: (value: boolean) => void }) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const router = useRouter()


  const formSchema = z.object({
    description: z.string().min(1, {
      message: "Description is required.",
    }),
    postImage: z.any(),
  });

  // const [selectedImage, setSelectedImage] = (useState < File) | (null > []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      postImage: undefined,
    },
  });

  function getImageData(event: ChangeEvent<HTMLInputElement>) {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer();
  
    // Add newly uploaded images
    Array.from(event.target.files!).forEach((image) =>
      dataTransfer.items.add(image)
    );
  
    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files![0]);
  
    return { files, displayUrl };
  }

  const onSubmit = async (data: z.infer<typeof formSchema>, e: any) => {
    const { postImage,description } = data;
    setPosting(true);

    let image_url = "";
    const profile = await FetchProfile();

    // console.log(image,profile)

    if (postImage) {
      const { data, error } = await supabase.storage
        .from("images/posts")
        .upload("post_" + uuidv4(), postImage[0]);
      if (error) {
        console.log(error);
      } else {
        image_url = `https://ruyrfyewnfhvqdfygbck.supabase.co/storage/v1/object/public/images/posts/${data.path}`;
      }
    }

    const postData = {
      user_id: profile?.data.id,
      description: description,
      image_url: image_url,
      username: profile?.data.username,
    };

    const { error } = await supabase.from("posts").insert(postData);
    form.reset();
    router.refresh()

    setPosting(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full font-bold text-2xl h-fit text-background drop-shadow-2xl">
          <PlusIcon height={30} width={30} />
          &nbsp; Post
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Post</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
            <Image className="rounded-md content-center mx-auto my-6" src={imagePreview||"https://github.com/shadcn.png"} alt="Image Preview" height={200} width={200}/>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="postImage"
              render={({ field: { onChange, value, ...rest }  }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...rest}
                      onChange={(event) => {
                        const { files, displayUrl} = getImageData(event)
                        setImagePreview(displayUrl);
                        onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Select an image to upload. Only .jpg, .png files.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="What's on your mind?" {...field} />
                  </FormControl>
                  <FormDescription>
                    Write a description for your post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PostForm;
