import { User } from "./User";

export type UserContextType = {
    user: User;
    setUser: (user: User) => void;
    token: string;
    setToken: (token: string) => void;
    refreshUser: boolean;
    setRefreshUser: (refreshUser: boolean) => void;
}