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
import { searchBlocks } from "../lib/blockUtils";
import { HistoryEditor } from "slate-history";
import { formattingPaneBlockType } from "../typescript/enums/app_enums";
import { FormattingPaneBlockList } from "../typescript/types/app_types";

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
  updateSelectedRichText: React.Dispatch<React.SetStateAction<number>>,
  searchedBlocksLength: number
) {
  if (slashPosition) {
    event.preventDefault();
    safeUpdateSelectedRichText(
      updateSelectedRichText,
      searchedBlocksLength,
      selectedRichTextIndex,
      false
    );
  }
  return;
}

function handleArrowDown(
  event: React.KeyboardEvent<HTMLDivElement>,
  selectedRichTextIndex: number,
  slashPosition: Range | null,
  updateSelectedRichText: React.Dispatch<React.SetStateAction<number>>,
  searchedBlocksLength: number
) {
  if (slashPosition) {
    event.preventDefault();
    safeUpdateSelectedRichText(
      updateSelectedRichText,
      searchedBlocksLength,
      selectedRichTextIndex,
      true
    );
  }
  return;
}

function handleEnter(
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor & ReactEditor & HistoryEditor,
  slashPosition: Range | null,
  addBlock: (blockType: formattingPaneBlockType) => void,
  searchedBlocks: FormattingPaneBlockList,
  selectedRichTextIndex: number
) {
  if (slashPosition) {
    event.preventDefault();
    let selectedBlock = searchedBlocks[selectedRichTextIndex].blockType;
    console.log("if slash pos inside enter");
    addBlock(selectedBlock);
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
    currentNode.type === "h3" ||
    currentNode.type === "ul" ||
    currentNode.type === "ol" ||
    currentNode.type === "blockquote";
  // if at beginning of line and header type and empty, set back to default element
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
    return;
  }

  if (currentNode.type === "ol") {
    console.log("inside curr");
    event.preventDefault();
    let newNode: Node = {
      type: "ol",
      order: (currentNode.order as number) + 1,
      children: [
        {
          text: "",
        },
      ],
    };
    Transforms.insertNodes(editor, newNode, {});
  }

  if (currentNode.type === "ul") {
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
    event.preventDefault();
    Editor.deleteBackward(editor, { unit: "character" });
    if (Range.isCollapsed(slashPosition)) {
      updateSlashPosition(null);
      return;
    }
    let newSlashPosition: Range = {
      anchor: slashPosition.anchor,
      focus: editor.selection!.focus,
    };

    // shorten slash selection
    updateSlashPosition(newSlashPosition);
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
        { type: "default", order: undefined },
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

// updates selected rich text index without array out of bounds
function safeUpdateSelectedRichText(
  updateSelectedRichText: React.Dispatch<React.SetStateAction<number>>,
  searchedBlocksLength: number,
  selectedRichTextIndex: number,
  increment: boolean
) {
  if (increment) {
    let newIndex = selectedRichTextIndex + 1;
    if (newIndex > searchedBlocksLength - 1) {
      newIndex = 0;
    }
    updateSelectedRichText(newIndex);
    return;
  } else {
    let newIndex = selectedRichTextIndex - 1;
    if (newIndex < 0) {
      newIndex = 0;
    }
    updateSelectedRichText(newIndex);
    return;
  }
}
