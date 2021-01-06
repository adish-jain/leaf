import { createContext, Dispatch, SetStateAction } from "react";

export const ProfilePageContext = createContext(<ProfilePageContextType>{});

type ProfilePageContextType = {
  username: string;
  customDomain: boolean;
};
