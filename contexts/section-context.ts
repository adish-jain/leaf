import { createContext } from "react";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";

export const SectionContext = createContext(<SectionContextType>{});

type SectionContextType = {
  sectionType: ContentBlockType;
};
