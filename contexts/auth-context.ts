import { createContext } from "react";

export const AuthContext = createContext(<AuthContextType>{});

type AuthContextType = {
  authenticated: boolean;
};
