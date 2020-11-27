import { createContext, Dispatch, SetStateAction } from "react";
import { Lines } from "../typescript/types/app_types";
import { fileObject } from "../typescript/types/frontend/postTypes";
import { supportedLanguages } from "../typescript/types/language_types";

export const FilesContext = createContext(<FilesContextType>{});

type FilesContextType = {
  addFile: () => void;
  changeCode: (value: string) => void;
  removeFile: (toDeleteIndex: number) => void;
  changeSelectedFileIndex: (newFileIndex: number) => void;
  changeFileLanguage: (language: supportedLanguages, external: boolean) => void;
  saveFileName: (value: string, external: boolean) => void;
  selectedFile: fileObject | undefined;
  currentlySelectedLines: Lines;
  changeSelectedLines: Dispatch<SetStateAction<Lines>>;
  files: fileObject[];
  saveFileCode: () => void;
};
