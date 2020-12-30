import { createContext, Dispatch, SetStateAction } from "react";
import { Lines } from "../typescript/types/app_types";

export const DimensionsContext = createContext(<DimensionsContextType>{});

type DimensionsContextType = {
  height: number;
  width: number;
};
