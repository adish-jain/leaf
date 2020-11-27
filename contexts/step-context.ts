import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { Lines } from "../typescript/types/app_types";
import { createContext } from "react";
import { Node } from "slate";
import { ContentBlock } from "draft-js";

export const StepContext = createContext({
  changeLines: (start: number, end: number) => {},
});


type StepContextType = {
  changeLines: (start: number; end: number) => void;
  currentlySelectedLines: Lines;
}