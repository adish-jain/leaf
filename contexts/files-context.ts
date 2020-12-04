import { createContext, Dispatch, SetStateAction } from "react";
import { Node } from "slate";
import { Lines } from "../typescript/types/app_types";
import { fileObject } from "../typescript/types/frontend/postTypes";
import {
  ProgrammingLanguage,
  supportedLanguages,
} from "../typescript/types/language_types";

export const FilesContext = createContext(<FilesContextType>{});

type FilesContextType = {
  addFile: () => void;
  changeCode: (value: Node[]) => void;
  removeFile: (toDeleteIndex: number) => void;
  changeSelectedFileIndex: (newFileIndex: number) => void;
  changeFileLanguage: (language: string, external: boolean) => void;
  saveFileName: (value: string, external: boolean) => void;
  modifyFileName: (newFileName: string, fileIndex: number) => void;
  selectedFile: fileObject | undefined;
  files: fileObject[];
  saveFileCode: (fileIndex: number) => void;
  // updateFile: (updatedFile: fileObject) => void;
  selectedFileIndex: number;
};
