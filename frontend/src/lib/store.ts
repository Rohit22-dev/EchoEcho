import { FetchProfile } from "@/components/helper/Helper";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
    id: string;
    full_name: string;
    avatar_url: string;
    username: string;
    email: string;
    about: string;
};

type State = {
    user: User | null;
};

type Action = {
    setUser: (user: any) => void;
};

// export const usePersonStore = create<State & Action>((set) => ({
//     user: null,
//     setUser: (user) => set({ user }),

// }));

export const usePersonStore = create(
    persist<State & Action>(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => sessionStorage), 
        }
    )
);

export const initializeUser = async () => {
    const profile = await FetchProfile();
    if (profile.status === "success" && profile.data) {
        usePersonStore.setState({ user: profile.data });
    }
};
