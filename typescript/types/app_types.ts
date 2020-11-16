import { Block, formattingPaneBlockType } from "../enums/app_enums";
import { SetStateAction } from "react";

export type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

export type FormattingPaneBlockList = {
  display: string;
  blockType: formattingPaneBlockType;
}[];

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
  tags: string[];
  files: File[];
  username: string;
  previewMode: boolean;
  updateShowPreview?: (value: SetStateAction<boolean>) => void;
  publishedAtSeconds: number;
};

export type Post = {
  postId: string;
  postURL: string;
  title: string;
  publishedAt: timeStamp;
  tags: string[];
  username: string;
};

export type timeStamp = {
  _nanoseconds: number;
  _seconds: number;
};
