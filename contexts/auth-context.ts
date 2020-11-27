import { auth } from "firebase";
import { createContext } from "react";
import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

const { authenticated, error, loading } = useLoggedIn();

export const AuthProvider = createContext({
  username: "",
  authenticated: authenticated,
});
