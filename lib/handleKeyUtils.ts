import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactElement,
  useRef,
} from "react";
import { useBlocks } from "../lib/blockUtils";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  useSelected,
  useFocused,
  RenderLeafProps,
} from "slate-react";
import {
  Node,
  Text,
  createEditor,
  Editor,
  Element,
  Transforms,
  Path,
  Range,
  NodeEntry,
  Operation,
  Point,
} from "slate";
import { HistoryEditor } from "slate-history";
import { blockType } from "../typescript/enums/app_enums";

function handleArrowLeft(
  event: React.KeyboardEvent<HTMLDivElement>,
  slashPosition: Range | null,
  updateSlashPosition: React.Dispatch<React.SetStateAction<Range | null>>
) {
  if (slashPosition) {
    updateSlashPosition(null);
  }
}

function handleArrowRight(
  event: React.KeyboardEvent<HTMLDivElement>,
  slashPosition: Range | null
) {
  if (slashPosition) {
    event.preventDefault();
  }
  return;
}

function handleArrowUp(
  event: React.KeyboardEvent<HTMLDivElement>,
  selectedRichTextIndex: number,
  slashPosition: Range | null,
  updateSelectedRichText: React.Dispatch<React.SetStateAction<number>>
) {
  if (slashPosition) {
    event.preventDefault();
    updateSelectedRichText(selectedRichTextIndex - 1);
  }
  return;
}

function handleArrowDown(
  event: React.KeyboardEvent<HTMLDivElement>,
  selectedRichTextIndex: number,
  slashPosition: Range | null,
  updateSelectedRichText: React.Dispatch<React.SetStateAction<number>>
) {
  if (slashPosition) {
    event.preventDefault();
    updateSelectedRichText(selectedRichTextIndex + 1);
  }
  return;
}

function handleEnter(
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor & ReactEditor & HistoryEditor,
  slashPosition: Range | null,
  blockType: blockType,
  addBlock: (blockType: blockType) => void
) {
  if (slashPosition) {
    event.preventDefault();
    addBlock(blockType);
    return;
  }
  let currentNodeEntry = Editor.above(editor, {
    match: (node) => Node.isNode(node),
  });
  if (!currentNodeEntry) {
    event.preventDefault();
    return;
  }
  // if at beginning of line, and header and empty, turn into a default node
  let currentNode = currentNodeEntry[0];
  let currentPath = currentNodeEntry[1];
  let nodeText = Node.string(currentNode);
  let isHeader =
    currentNode.type === "h1" ||
    currentNode.type === "h2" ||
    currentNode.type === "h3";
  // if at beginning of line and header type and empty
  if (editor.selection?.anchor.offset === 0 && isHeader && nodeText === "") {
    event.preventDefault();
    Transforms.setNodes(
      editor,
      { type: "default" },
      {
        match: (n: Node) => {
          return Editor.isBlock(editor, n);
        },
        at: editor.selection,
      }
    );
    let newNode: Node = {
      type: "default",
      children: [
        {
          text: "",
        },
      ],
    };
    Transforms.insertNodes(editor, newNode, {});
    Transforms.select(editor, Editor.after(editor, editor.selection)!);
    return;
  }

  // if is header, disable header on new line
  if (isHeader) {
    event.preventDefault();
    let newNode: Node = {
      type: "default",
      children: [
        {
          text: "",
        },
      ],
    };
    Transforms.insertNodes(editor, newNode, {});
  }
}

function handleBackSpace(
  event: React.KeyboardEvent<HTMLDivElement>,
  slashPosition: Range | null,
  editor: Editor & ReactEditor & HistoryEditor,
  updateSlashPosition: React.Dispatch<React.SetStateAction<Range | null>>
) {
  if (slashPosition) {
    let newSlashPosition = {
      anchor: slashPosition.anchor,
      focus: editor.selection!.anchor,
    };
    // shorten slash selection
    updateSlashPosition(newSlashPosition);
    // if slash is deleted, remove slashPosition
    if (Range.equals(newSlashPosition, editor.selection!)) {
      updateSlashPosition(null);
    }
    return;
  }
  // if begining of line
  if (editor.selection?.anchor.offset === 0) {
    let currentNodeEntry = Editor.above(editor, {
      match: (node) => Node.isNode(node),
    });
    // if not a default element
    if (currentNodeEntry && currentNodeEntry[0].type !== "default") {
      event.preventDefault();
      // set to a default element
      Transforms.setNodes(
        editor,
        { type: "default" },
        {
          match: (n: Node) => {
            return Editor.isBlock(editor, n) && n.type !== "default";
          },
        }
      );
    } else {
      // if is a default element
    }
  }
  return;
}

export {
  handleArrowLeft,
  handleArrowRight,
  handleArrowUp,
  handleArrowDown,
  handleEnter,
  handleBackSpace,
};
