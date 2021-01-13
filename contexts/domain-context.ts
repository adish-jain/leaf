import { createContext, Dispatch, SetStateAction } from "react";

export const DomainContext = createContext(<DomainContextType>{});

type DomainContextType = {
  username: string;
  onCustomDomain: boolean;
  userHost: string;
};
