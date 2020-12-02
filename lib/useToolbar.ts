import { useState } from "react";
import { Editor, Element, Text, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, useSlate } from "slate-react";
import { saveStatusEnum, slateMarkTypes } from "../typescript/enums/app_enums";

export function boldSelection(editor: Editor & ReactEditor & HistoryEditor) {
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

export function italicizeSelection(
  editor: Editor & ReactEditor & HistoryEditor
) {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      return n.italicize === true;
    },
  });
  let shouldItalicize = match === undefined;
  Transforms.setNodes(
    editor,
    { italicize: shouldItalicize },
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

export function codeSelection(editor: Editor & ReactEditor & HistoryEditor) {
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
  const [currentMarkType, updateMarkType] = useState<MarkState>({
    italics: false,
    bold: false,
    code: false,
    link: false,
    default: true,
  });

  return { saveState, updateSaving, currentMarkType, updateMarkType };
}

const toggleMark = (editor: Editor, format: slateMarkTypes) => {
  const isActive = isMarkActive(editor, format);

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
