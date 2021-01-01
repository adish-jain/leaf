import { createContext, Dispatch, SetStateAction } from "react";
import { Range } from "slate";
import { Editor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { MarkState } from "../lib/useToolbar";
import { slateMarkTypes, saveStatusEnum } from "../typescript/enums/app_enums";

export const ToolbarContext = createContext(<ToolbarContextType>{});

type ToolbarContextType = {
  setBold: (editor: Editor & ReactEditor & HistoryEditor) => void;
  setItalic: (editor: Editor & ReactEditor & HistoryEditor) => void;
  setCode: (editor: Editor & ReactEditor & HistoryEditor) => void;
  saveState: saveStatusEnum;
  updateSaving: (saveState: saveStatusEnum) => void;
  currentMarkType: MarkState;
  updateMarkType: Dispatch<SetStateAction<MarkState>>;
  selectionCoordinates: DOMRect | undefined;
  updateSelectionCoordinates: (dimensions: DOMRect | undefined) => void;
  linkSelection: Range | undefined;
  updateLinkSelection: (newRange: Range | undefined) => void;
};
