import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { Lines, timeStamp } from "../typescript/types/app_types";
import { createContext, Dispatch, SetStateAction } from "react";
import { Node } from "slate";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { mutateCallback } from "swr/dist/types";

export const DraftContext = createContext(<DraftContextType>{});

type DraftContextType = {
  addBackendBlock: (
    backendDraftBlockEnum: ContentBlockType,
    atIndex: number
  ) => Promise<void>;
  deleteBlock: (backendId: string) => void;
  updateSlateSectionToBackend: (
    backendId: string,
    order?: number | undefined,
    value?: Node[] | undefined,
    lines?: Lines | null | undefined,
    imageUrl?: string | null | undefined,
    fileId?: string | null | undefined
  ) => Promise<void>;
  currentlyEditingBlock: contentBlock | undefined;
  changeEditingBlock: (backendId: string) => void;
  username: string;
  postId: string;
  draftId: string;
  removeFileFromCodeSteps: (fileId: string) => void;
  nextBlockType: (backendId: string) => ContentBlockType | undefined;
  profileImage: string;
  createdAt: timeStamp;
};
