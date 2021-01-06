import { createContext, Dispatch, SetStateAction } from "react";
import { Node } from "slate";
import {
  contentBlock,
  serializedContentBlock,
} from "../../typescript/types/frontend/postTypes";

export const ContentContext = createContext(<ContentContextType>{});

type ContentContextType = {
  postContent: serializedContentBlock[];
  selectedContentIndex: number;
  updateContentIndex: (newIndex: number) => void;
  username: string;
  profileImage: string;
  publishedAtSeconds: number;
  tags: string[];
};
