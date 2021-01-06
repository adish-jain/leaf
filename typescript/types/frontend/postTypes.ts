import { FrontendSectionType } from "../../enums/frontend/postEnums";
import { ContentBlockType } from "../../enums/backend/postEnums";
import { timeStamp } from "../../types/app_types";
import { ProgrammingLanguage, supportedLanguages } from "../language_types";
import { Node } from "slate";

export type contentSection = {
  type: FrontendSectionType;
  startIndex: number;
} & (CodeSection | TextSection);

export type CodeSection = {
  codeSteps: contentBlock[];
};

export type TextSection = {
  slateSection: contentBlock;
};

export type Lines = {
  start: number;
  end: number;
};

export type contentBlock = {
  type: ContentBlockType;
  slateContent: string;
  backendId: string;
} & codeStepBlock;

type codeStepBlock = {
  fileId?: string;
  lines?: Lines;
  imageUrl?: string;
};

export type draftFrontendRepresentation = {
  title: string;
  draftContent: contentBlock[];
  folders: folderObject[];
  files: fileObject[];
  createdAt: timeStamp;
  published: boolean;
  tags: string[];
  username: string;
  errored: boolean;
  private: boolean;
  publishedAt?: timeStamp;
  postURL?: string;
  postId?: string;
  likes?: number;
};

export type folderObject = {
  folderName: string;
  folderId: string;
};

export type fileObject = {
  fileName: string;
  language: string;
  code: Node[];
  parentFolderId?: string;
  order: number;
  fileId: string;
};

export type draftMetaData = {
  title: string;
  createdAt: timeStamp;
  username: string;
  errored: boolean;
  published: boolean;
  postId?: string;
  profileImage?: string;
};

export type PostPageProps = {
  postContent: contentBlock[];
  title: string;
  tags: string[];
  likes: number;
  errored: boolean;
  files: fileObject[];
  username: string;
  profileImage: string;
  publishedAtSeconds: number;
};
