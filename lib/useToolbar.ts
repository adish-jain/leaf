import { Dimensions } from "framer-motion/types/render/dom/types";
import { link } from "fs";
import { useState } from "react";
import { Editor, Element, Range, Text, Transforms } from "slate";
import { ReactEditor, useEditor, useSlate } from "slate-react";
import { saveStatusEnum, slateMarkTypes } from "../typescript/enums/app_enums";

export function boldSelection(editor: ReactEditor) {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      return n.bold === true;
    },
  });
  console.log(editor.selection);
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

export function linkWrapSelection(
  editor: ReactEditor,
  url: string,
  linkRange: Range
) {
  ReactEditor.focus(editor);
  console.log("fired with");
  console.log(linkRange);
  // const [match] = Editor.nodes(editor, {
  //   match: (n) => {
  //     return n.link === true;
  //   },
  // });
  // let shouldLink = match === undefined;
  Transforms.setNodes(
    editor as Editor,
    {
      bold: true,
      // link: true, url: url
    },
    // Apply it to text nodes, and split the text node up if the
    // selection is overlapping only part of it.
    {
      match: (n) => {
        return Text.isText(n);
      },
      at: linkRange,
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
  const [linkSelection, updateLinkSelection] = useState<Range | undefined>(
    undefined
  );

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
    linkSelection,
    updateLinkSelection,
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
