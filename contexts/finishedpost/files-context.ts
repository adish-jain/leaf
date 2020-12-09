import { createContext, Dispatch, SetStateAction } from "react";
import { Node } from "slate";
import {
  contentBlock,
  fileObject,
} from "../../typescript/types/frontend/postTypes";

export const PublishedFilesContext = createContext(
  <PublishedFilesContextType>{}
);

type PublishedFilesContextType = {
  files: fileObject[];
  selectedFileIndex: number;
  updateFileIndex: (newFileIndex: number) => void;
};
