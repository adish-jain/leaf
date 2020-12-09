import { createContext, Dispatch, SetStateAction } from "react";
import { Node } from "slate";
import { contentBlock } from "../../typescript/types/frontend/postTypes";

export const ContentContext = createContext(<ContentContextType>{});

type ContentContextType = {
  postContent: contentBlock[];
  selectedContentIndex: number;
  updateContentIndex: (newIndex: number) => void;
};
