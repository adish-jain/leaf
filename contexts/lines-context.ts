import { createContext, Dispatch, SetStateAction } from "react";
import { Lines } from "../typescript/types/app_types";

export const LinesContext = createContext(<LinesContextType>{});

type LinesContextType = {
  currentlySelectedLines?: Lines;
  changeSelectedLines: Dispatch<SetStateAction<Lines | undefined>>;
};
