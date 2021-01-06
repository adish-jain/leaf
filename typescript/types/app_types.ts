import { Block, formattingPaneBlockType } from "../enums/app_enums";
import { ProgrammingLanguage } from "../types/language_types";
import { Node } from "slate";
import { SetStateAction } from "react";
import { contentBlock, fileObject } from "./frontend/postTypes";
import admin from "firebase-admin";

export const WAIT_INTERVAL = 5000;

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
  title: string;
  postContent: contentBlock[];
  tags: string[];
  files: fileObject[];
  likes: number;
  username: string;
  profileImage: string;
  previewMode: boolean;
  published: boolean;
  updatePreviewMode?: (previewMode: boolean) => void;
  publishedAtSeconds: number;
  publishedView: boolean;
};

export type GetUserType = {
  uid: string;
  userRecord: admin.auth.UserRecord | undefined;
};

export type Post = {
  postId: string;
  title: string;
  publishedAt: timeStamp;
  tags: string[];
  likes: number;
  username: string;
  profileImage: string;
  createdAt: timeStamp;
  firebaseId: string;
};

export type timeStamp = {
  _nanoseconds: number;
  _seconds: number;
};

export const EMPTY_TIMESTAMP = {
  _nanoseconds: 0,
  _seconds: 0,
};

type CodeSection = {
  codeSteps: codeStepFrontend[];
};

type codeStepFrontend = {
  fileId?: string;
  slateContent: string;
  lines?: Lines;
};

export const newFileNode: Node[] = [
  {
    type: "default",
    children: [
      {
        text: "Start editing here",
      },
    ],
  },
];
