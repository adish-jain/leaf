import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { Lines } from "../typescript/types/app_types";
import { createContext } from "react";
import { Node } from "slate";
import { contentBlock } from "../typescript/types/frontend/postTypes";

export const DraftContext = createContext(<DraftContextType>{});

type DraftContextType = {
  addBackendBlock: (
    backendDraftBlockEnum: ContentBlockType,
    atIndex: number
  ) => Promise<void>;
  updateSlateSectionToBackend: (
    backendId: string,
    order?: number,
    value?: Node[],
    lines?: Lines,
    imageUrl?: string
  ) => Promise<void>;
  previewMode: boolean;
  updatePreviewMode: (previewMode: boolean) => void;
  currentlyEditingBlock: contentBlock | undefined;
  published: boolean;
  username: string;
  postId: string;
  draftId: string;
};
