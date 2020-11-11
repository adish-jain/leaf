import { blockType } from "../typescript/enums/app_enums";
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

export function useBlocks(editor: Editor & ReactEditor & HistoryEditor) {
  const [slashPosition, updateSlashPosition] = useState<Range | null>(null);

  function addBlock(blockType: blockType) {
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
  blockType: blockType,
  editor: Editor,
  slashPosition: Range | null
) {
  // extend slash selection so that all characters can be deleted
  let newBefore =
    Editor.before(editor, slashPosition!.anchor) || slashPosition!.anchor;
  let newAfter =
    Editor.after(editor, slashPosition!.focus) || slashPosition!.focus;
  let replaceRange: Range = {
    anchor: newBefore,
    focus: newAfter,
  };
  // create the new node with desired block type
  let newNode: Node = {
    type: blockType,
    children: [
      {
        text: "",
      },
    ],
  };
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
  let currentNodeEntry = Editor.above(editor, {
    match: (node) => {
      return Node.isNode(node);
    },
    at: slashPosition!,
  })!;
  let currentNodePath = currentNodeEntry[1];
  let lineNum = slashPosition!.focus.path[0];
  let insertPath = Editor.after(editor, slashPosition!, {
    unit: "character",
  });
  let nextPath = Path.next(currentNodePath);
  let insertPathLineNum = insertPath?.path[0];
  if (insertPathLineNum !== lineNum) {
    // slash is at end of line,
    // Transforms.insertNodes(editor, newNode, {
    //   at: Editor.before(editor, slashPosition!.focus),
    // });
    Transforms.insertNodes(editor, newNode, {
      at: nextPath,
    });
  } else {
    Transforms.insertNodes(editor, newNode, {
      at: Editor.after(editor, slashPosition!, {
        unit: "line",
      }),
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
  blockType: blockType,
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
  // if nondefault, add new block
  let nodeText = Node.string(currentNode);
  if (currentNode.type !== "default") {
    let newNode: Node = {
      type: blockType,
      children: [
        {
          text: "",
        },
      ],
    };
    Transforms.insertNodes(editor, newNode, {
      at: Path.next(currentNodePath),
    });
    Transforms.delete(editor, {
      at: slashPosition!,
      distance: 1,

      // reverse: true,
    });
    // Transforms.insertText(editor, "", { at: slashPosition! });
    // Replace the slash
    let newBefore =
      Editor.before(editor, slashPosition!.anchor) || slashPosition!.anchor;
    let newAfter =
      Editor.after(editor, slashPosition!.focus) || slashPosition!.focus;
    let replaceRange: Range = {
      anchor: newBefore,
      focus: newAfter,
    };
    Transforms.delete(editor, { at: replaceRange });
    // Transforms.select(editor, currentNodePath);
    Transforms.select(editor, Path.next(currentNodePath));
  }
  // if default, change default to header
  else {
    Transforms.setNodes(
      editor,
      { type: blockType },
      {
        match: (n: Node) => {
          return Editor.isBlock(editor, n);
        },
        at: slashPosition!.anchor,
      }
    );

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
      // Transforms.delete(editor, { at: replaceRange });
      Transforms.insertText(editor, "", {
        at: replaceRange,
      });
    }
    Transforms.select(editor, currentNodePath);
  }
}

export function searchBlocks(
  searchString: string,
  Blocks: { display: string; blockType: blockType }[]
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
  Blocks: { display: string; blockType: blockType }[]
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
