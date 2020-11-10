import { motion, AnimatePresence } from "framer-motion";
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
  Ancestor,
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
import "../styles/formattingpane.scss";
import { isAncestor } from "@udecode/slate-plugins";

enum blockType {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  UL = "ul",
}

export default function FormattingPane(props: {
  editor: Editor & ReactEditor & HistoryEditor;
  updateSlashPosition: React.Dispatch<React.SetStateAction<Range | null>>;
  slashPosition: Range | null;
}) {
  let { slashPosition, editor, updateSlashPosition } = props;

  // if in the middle of line
  function handleMiddleLine(blockType: blockType) {
    let newBefore =
      Editor.before(editor, slashPosition!.anchor) || slashPosition!.anchor;
    let newAfter =
      Editor.after(editor, slashPosition!.focus) || slashPosition!.focus;
    let replaceRange: Range = {
      anchor: newBefore,
      focus: newAfter,
    };

    let newNode: Node = {
      type: blockType,
      children: [
        {
          text: "",
        },
      ],
    };

    if (Range.isCollapsed(slashPosition!)) {
      let end = Editor.end(editor, slashPosition!);
      Transforms.delete(editor, {
        at: slashPosition!,
        unit: "character",
        reverse: true,
      });
    } else {
      Transforms.insertText(editor, "", { at: replaceRange });
    }

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
    let insertPathLineNum = insertPath?.path[0];

    if (insertPathLineNum !== lineNum) {
      Transforms.insertNodes(editor, newNode, {
        at: Editor.before(editor, slashPosition!.focus),
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

  function handleBeginningLine(blockType: blockType) {
    // get current node at selection
    let currentNodeEntry = Editor.above(editor, {
      match: (node) => {
        return Node.isNode(node);
      },
      at: slashPosition!,
    });
    if (currentNodeEntry) {
      let currentNode = currentNodeEntry[0];
      let currentPath = currentNodeEntry[1];
      console.log(currentPath);
      console.log(currentNode);
      let nodeText = currentNode.children[0].text;
      // Editor.string(editor, )
      Editor.insertBreak(editor);
      // if nondefault, add new header
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
          at: slashPosition!.focus,
        });
        Transforms.delete(editor, {
          at: slashPosition!,
          unit: "character",
          distance: 1,
          reverse: true,
        });
        Transforms.select(editor, Editor.after(editor, slashPosition!.anchor)!);
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
        Transforms.select(editor, slashPosition!.anchor);
        Editor.deleteForward(editor, {
          unit: "line",
        });
        // delete the slash
        Editor.deleteBackward(editor, { unit: "character" });
      }
    }
  }

  function addBlock(blockType: blockType) {
    // if beginning of line
    if (slashPosition?.anchor.offset === 1) {
      handleBeginningLine(blockType);
    } else {
      handleMiddleLine(blockType);
    }

    ReactEditor.focus(editor);
    updateSlashPosition(null);
  }

  // find position to place formatting pane
  let currentNodeEntry = Editor.above(editor, {
    match: (node) => Node.isNode(node),
  });
  let top: number = 0;
  if (slashPosition && currentNodeEntry && editor.selection) {
    let currentNode = currentNodeEntry[0];
    let domNode = ReactEditor.toDOMNode(editor, currentNode);
    let domNodeDimensions = domNode.getBoundingClientRect();
    top = domNodeDimensions.bottom;
  }

  return (
    <AnimatePresence>
      {slashPosition && (
        <motion.div
          style={{
            position: "absolute",
            zIndex: 1,
            top: top + window.pageYOffset,
            transformOrigin: "top left",
          }}
          initial={{
            opacity: 0,
            transform: "scale(0.9)",
          }}
          animate={{
            opacity: 1,
            transform: "scale(1)",
          }}
          exit={{
            opacity: 0,
            transform: "scale(0.9)",
          }}
          transition={{
            duration: 0.15,
          }}
        >
          <div className={"formatting-pane"}>
            <div
              onClick={(e) => {
                addBlock(blockType.H1);
              }}
            >
              Header
            </div>
            <div
              onClick={(e) => {
                addBlock(blockType.H2);
              }}
            >
              Header 2
            </div>
            <div
              onClick={(e) => {
                addBlock(blockType.H3);
              }}
            >
              Header 3
            </div>
            <div
              onClick={(e) => {
                addBlock(blockType.UL);
              }}
            >
              Bulleted List
            </div>
            <div>Numbered List</div>
            <div>Code Block</div>
            <div>Image</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
