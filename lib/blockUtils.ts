import { formattingPaneBlockType } from "../typescript/enums/app_enums";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactElement,
  useRef,
} from "react";
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
import { HistoryEditor } from "slate-history";

const defaultNode = {
  type: "default",
  order: undefined,
  children: [
    {
      text: "",
    },
  ],
};

export function useBlocks(editor: Editor & ReactEditor & HistoryEditor) {
  const [slashPosition, updateSlashPosition] = useState<Range | null>(null);

  function addBlock(blockType: formattingPaneBlockType) {
    // if beginning of line
    if (slashPosition?.anchor.offset === 1) {
      handleBeginningLine(blockType, editor, slashPosition);
    } else {
      handleMiddleLine(blockType, editor, slashPosition);
    }

    ReactEditor.focus(editor);
    updateSlashPosition(null);
  }

  return { addBlock, slashPosition, updateSlashPosition };
}

// if in the middle of line
function handleMiddleLine(
  blockType: formattingPaneBlockType,
  editor: Editor,
  slashPosition: Range | null
) {
  let currentNodeEntry = Editor.above(editor, {
    match: (node) => {
      return Node.isNode(node);
    },
    at: slashPosition!,
  })!;
  let currentNode = currentNodeEntry[0];
  let currentNodePath = currentNodeEntry[1];

  // extend slash selection so that all characters can be deleted
  let newBefore =
    Editor.before(editor, slashPosition!.anchor) || slashPosition!.anchor;
  let replaceRange: Range = {
    anchor: newBefore,
    focus: slashPosition!.focus,
  };
  // create the new node with desired block type
  let order = undefined;
  if (blockType === formattingPaneBlockType.OL) {
    if (currentNode.type === "ol") {
      order = (currentNode.order as number) + 1;
    } else {
      order = 1;
    }
  }
  let newNode: Node | Node[];
  if (
    blockType === formattingPaneBlockType.Image ||
    blockType === formattingPaneBlockType.CodeBlock
  ) {
    newNode = [
      {
        type: blockType,
        order: order,
        children: [
          {
            text: "",
          },
        ],
      },
      defaultNode,
    ];
  } else {
    newNode = {
      type: blockType,
      order: order,
      children: [
        {
          text: "",
        },
      ],
    };
  }
  // deletes the slash range
  if (Range.isCollapsed(slashPosition!)) {
    Transforms.delete(editor, {
      at: slashPosition!,
      unit: "character",
      reverse: true,
    });
  } else {
    Transforms.insertText(editor, "", { at: replaceRange });
  }

  // insert new block in
  let lineNum = slashPosition!.focus.path[0];
  let insertPath = Editor.after(editor, slashPosition!, {
    unit: "character",
  });
  let nextPath = Path.next(currentNodePath);
  let insertPathLineNum = insertPath?.path[0];
  if (insertPathLineNum !== lineNum) {
    Transforms.insertNodes(editor, newNode, {
      at: nextPath,
    });
  } else {
    Transforms.insertNodes(editor, newNode, {
      at: nextPath,
    });
  }

  let correctPos = Editor.after(editor, slashPosition!.focus, {
    unit: "line",
  });

  if (correctPos) {
    Transforms.select(editor, Editor.after(editor, currentNodePath)!);
  }
}

function handleBeginningLine(
  blockType: formattingPaneBlockType,
  editor: Editor,
  slashPosition: Range | null
) {
  // get current node at selection
  let currentNodeEntry = Editor.above(editor, {
    match: (node) => {
      return Node.isNode(node);
    },
    at: slashPosition!,
  });
  if (!currentNodeEntry) {
    return;
  }
  let currentNode = currentNodeEntry[0];
  let currentNodePath = currentNodeEntry[1];
  if (currentNode.type !== "default") {
    addBlockUnderNonDefault(
      currentNode,
      currentNodePath,
      blockType,
      editor,
      slashPosition
    );
  }
  // if default, change default to block
  else {
    addBlockAtDefault(blockType, editor, slashPosition, currentNodePath);
  }
}

export function searchBlocks(
  searchString: string,
  Blocks: { display: string; blockType: formattingPaneBlockType }[]
) {
  let shortCutIndex = shortCuts(searchString, Blocks);
  if (shortCutIndex !== -1) {
    let returnArray = [];
    returnArray.push(Blocks[shortCutIndex]);
    return returnArray;
  }
  let searchedBlocks = [];
  for (let i = 0; i < Blocks.length; i++) {
    let block = Blocks[i];
    let elementName = block.display;
    if (elementName.toLowerCase().includes(searchString.toLowerCase())) {
      searchedBlocks.push(block);
    }
  }
  return searchedBlocks;
}

function shortCuts(
  searchString: string,
  Blocks: { display: string; blockType: formattingPaneBlockType }[]
) {
  switch (searchString.toLowerCase()) {
    case "h1":
      return 0;
    case "h2":
      return 1;
    case "h3":
      return 2;
    default:
      return -1;
  }
}

function deleteSlash(slashPosition: Range | null, editor: Editor) {
  // Replace the slash
  let newBefore =
    Editor.before(editor, slashPosition!.anchor) || slashPosition!.anchor;
  let newAfter =
    Editor.after(editor, slashPosition!.focus) || slashPosition!.focus;
  let replaceRange: Range = {
    anchor: newBefore,
    focus: newAfter,
  };

  // deletes the slash range
  if (Range.isCollapsed(replaceRange!)) {
    Transforms.delete(editor, {
      at: slashPosition!,
      unit: "character",
      reverse: true,
    });
  } else {
    Transforms.insertText(editor, "", {
      at: replaceRange,
    });
  }
}

// if nondefault, add new block
/* 
  If at beginning of line, and inside a non default block
  add new block
  */
function addBlockUnderNonDefault(
  currentNode: Node,
  currentNodePath: Path,
  blockType: formattingPaneBlockType,
  editor: Editor,
  slashPosition: Range | null
) {
  let newNode: Node | Node[];
  if (currentNode.type === "ol") {
    newNode = {
      type: blockType,
      order: (currentNode.order as number) + 1,
      children: [
        {
          text: "",
        },
      ],
    };
  } else if (
    blockType === formattingPaneBlockType.CodeBlock ||
    blockType === formattingPaneBlockType.Image
  ) {
    newNode = [
      {
        type: blockType,
        order: undefined,
        children: [
          {
            text: "",
          },
        ],
      },
      defaultNode,
    ];
  } else {
    newNode = {
      type: blockType,
      order: blockType === "ol" ? 1 : undefined,
      children: [
        {
          text: "",
        },
      ],
    };
  }

  Transforms.insertNodes(editor, newNode, {
    at: Path.next(currentNodePath),
  });
  // Replace the slash
  let newBefore =
    Editor.before(editor, slashPosition!.anchor) || slashPosition!.anchor;
  let newAfter =
    Editor.after(editor, slashPosition!.focus) || slashPosition!.focus;
  let replaceRange: Range = {
    anchor: newBefore,
    focus: slashPosition!.focus,
  };

  Transforms.insertText(editor, "", {
    at: replaceRange,
  });
  Transforms.select(editor, Path.next(currentNodePath));
}

function addBlockAtDefault(
  blockType: formattingPaneBlockType,
  editor: Editor,
  slashPosition: Range | null,
  currentNodePath: Path
) {
  Transforms.setNodes(
    editor,
    {
      type: blockType,
      order: blockType === formattingPaneBlockType.OL ? 1 : undefined,
    },
    {
      match: (n: Node) => {
        return Editor.isBlock(editor, n);
      },
      at: slashPosition!.anchor,
    }
  );

  if (
    blockType === formattingPaneBlockType.Image ||
    blockType === formattingPaneBlockType.CodeBlock
  ) {
    Transforms.insertNodes(editor, defaultNode, {
      at: Editor.after(editor, currentNodePath),
    });
  }
  if (blockType !== formattingPaneBlockType.Image) {
    deleteSlash(slashPosition, editor);
    Transforms.select(editor, currentNodePath);
  }
}
