import { createContext, Dispatch, SetStateAction } from "react";
import { Post } from "../typescript/types/app_types";

export const LandingContext = createContext(<LandingContextType>{});

type LandingContextType = {
  posts: Post[];
};
