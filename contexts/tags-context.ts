import { createContext, Dispatch, SetStateAction } from "react";
import { Node } from "slate";

export const TagsContext = createContext(<TagsContextType>{});

type TagsContextType = {
  showTags: boolean;
  updateShowTags: (showTags: boolean) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
};
