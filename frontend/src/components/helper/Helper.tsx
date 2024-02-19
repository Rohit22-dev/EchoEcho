import { jwtDecode } from "jwt-decode";
import supabase from "../../../supabase";
import Cookies from "js-cookie";
import { ReloadIcon } from "@radix-ui/react-icons";

export const FetchProfile = async () => {
  let result = { status: "failed", data: null, error: "" };
  const token = Cookies.get("access_token");
  if (!token) {
    result.error = "No token found";
    return result;
  }
  const token_data = jwtDecode(token!);

  let { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", token_data?.sub);

  if (error) {
    result.error = error.message;
    return result;
  }

  return { status: "success", data: data ? data[0] : null, error: "" };
};

export const Loader = ({loadState,text}:{loadState:boolean,text:string}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0">
      <div
        className={`fixed left-[50%] top-[50%] z-50 grid place-items-center text-2xl w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 ${
          loadState ? "slide-in-from-left-1/2" : "slide-out-to-left-1/2"
        } ${
          loadState ? "slide-in-from-top-[48%]" : "slide-out-to-top-[48%]"
        } sm:rounded-lg`}
      >
        {text}...
        <ReloadIcon className="mr-2 h-10 w-10 animate-spin opacity-70" />
      </div>
    </div>
  );
};
