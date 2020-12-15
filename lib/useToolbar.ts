import { Dimensions } from "framer-motion/types/render/dom/types";
import { useState } from "react";
import { Editor, Element, Text, Transforms } from "slate";
import { ReactEditor, useEditor, useSlate } from "slate-react";
import { saveStatusEnum, slateMarkTypes } from "../typescript/enums/app_enums";

export function boldSelection(editor: ReactEditor) {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      return n.bold === true;
    },
  });
  let shouldBold = match === undefined;
  Transforms.setNodes(
    editor,
    { bold: shouldBold },
    // Apply it to text nodes, and split the text node up if the
    // selection is overlapping only part of it.
    {
      match: (n) => {
        return Text.isText(n);
      },
      split: true,
    }
  );
}

export function italicizeSelection(editor: ReactEditor) {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      return n.italic === true;
    },
  });
  let shouldItalicize = match === undefined;
  Transforms.setNodes(
    editor,
    { italic: shouldItalicize },
    // Apply it to text nodes, and split the text node up if the
    // selection is overlapping only part of it.
    {
      match: (n) => {
        return Text.isText(n);
      },
      split: true,
    }
  );
}

export function codeSelection(editor: ReactEditor) {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      return n.code === true;
    },
  });
  let shouldCode = match === undefined;
  Transforms.setNodes(
    editor,
    { code: shouldCode },
    // Apply it to text nodes, and split the text node up if the
    // selection is overlapping only part of it.
    {
      match: (n) => {
        return Text.isText(n);
      },
      split: true,
    }
  );
}

export function useToolbar() {
  const [saveState, updateSaving] = useState(saveStatusEnum.saved);
  const [selectionCoordinates, updateSelectionCoordinates] = useState<
    DOMRect | undefined
  >(undefined);
  const [currentMarkType, updateMarkType] = useState<MarkState>({
    italic: false,
    bold: false,
    code: false,
    link: false,
    default: true,
  });

  return {
    saveState,
    updateSaving,
    currentMarkType,
    updateMarkType,
    selectionCoordinates,
    updateSelectionCoordinates,
  };
}

export const toggleMark = (editor: Editor, format: slateMarkTypes) => {
  const isActive = isMarkActive(editor, format);
  const currentEditor = useEditor();
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
const isMarkActive = (editor: Editor, format: slateMarkTypes) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export type MarkState = {
  [key: string]: boolean;
};
