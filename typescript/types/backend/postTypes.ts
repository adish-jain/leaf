import { ContentBlockType } from "../../enums/backend/postEnums";
import { Lines, timeStamp } from "../app_types";

export type backendContentBlock = {
  order: number;
  type: ContentBlockType;
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
  imageUrl?: string;
};

export type backendFileObject = {
  fileName?: string;
  language?: string;
  code?: string;
  parentFolderId?: string;
  order?: number;
};

export type fireBasePostType = {
  createdAt: timeStamp;
  errored: boolean;
  likes?: number;
  postId: string;
  published?: boolean;
  publishedAt?: timeStamp;
  tags?: string[];
  title: string;
  username: string;
};
