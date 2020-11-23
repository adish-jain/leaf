import {
  Block,
  formattingPaneBlockType,
  backendDraftBlockEnum,
} from "../enums/app_enums";
import { ProgrammingLanguage } from "../types/language_types";
import { Node } from "slate";
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

export type backendType = {
  order: number;
  type: backendDraftBlockEnum;
  backendId?: string;
} & (textEditorObject | codeStepObject);

// backend representation of Slate Editor
type textEditorObject = {
  slateContent: string;
};

// backend representation of a code step section
type codeStepObject = {
  fileId?: string;
  slateContent: string;
  lines?: Lines;
};

export type fileObject = {
  fileId: string;
  fileName: string;
  language: string;
  code: string;
  parentFolderId?: string;
  order: number;
};

export type folderObject = {
  folderName: string;
  folderId: string;
};

export type draftBackendRepresentation = {
  title: string;
  draftContent: backendType[];
  folders: folderObject[];
  files: fileObject[];
  createdAt: timeStamp;
  published: boolean;
  tags: string[];
  username: string;
  errored: boolean;
};

export type publishedPostBackendRepresentation = {
  private: boolean;
  publishedAt: timeStamp;
  postId: string;
  postURL: string;
} & draftBackendRepresentation;
