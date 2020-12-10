import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { Lines, timeStamp } from "../typescript/types/app_types";
import { createContext, Dispatch, SetStateAction } from "react";
import { Node } from "slate";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { mutateCallback } from "swr/dist/types";

export const PreviewContext = createContext(<PreviewContexType>{});

type PreviewContexType = {
  previewMode: boolean;
  updatePreviewMode: (previewMode: boolean) => void;
};
