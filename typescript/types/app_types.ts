import { Block } from "../enums/app_enums";
import { SetStateAction } from "react";

export type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

export type Step = {
  text: string;
  id: string;
  lines?: Lines;
  fileId?: string;
  blockType?: Block;
  imageURL?: string;
};

export type Lines = {
  start: number;
  end: number;
};

export type FinishedPostProps = {
  steps: Step[];
  title: string;
  files: File[];
  username: string;
  previewMode: boolean;
  updateShowPreview?: (value: SetStateAction<boolean>) => void;
  publishedAtSeconds: number;
};

export type timeStamp = {
  _nanoseconds: number;
  _seconds: number;
};
