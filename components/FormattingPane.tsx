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

enum headerType {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
}

export default function FormattingPane(props: {
  editor: Editor & ReactEditor & HistoryEditor;
  updateSlashPosition: React.Dispatch<React.SetStateAction<Range | null>>;
  slashPosition: Range | null;
}) {
  let { slashPosition, editor, updateSlashPosition } = props;

  function addHeader(headerType: headerType) {
    // if beginning of line
    if (slashPosition?.anchor.offset === 1) {
      // change current line to h1
      let currentNodeEntry = Editor.above(editor, {
        match: (node) => {
          return Node.isNode(node);
        },
        at: slashPosition,
      });

      if (currentNodeEntry) {
        let currentNode = currentNodeEntry[0];
        let currentPath = currentNodeEntry[1];
        // if nondefault, add new header
        if (currentNode.type !== "default") {
          let newNode: Node = {
            type: headerType,
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
            at: slashPosition,
            unit: "character",
            distance: 1,
            reverse: true,
          });
          console.log("hit");
          console.log(slashPosition.anchor.path);
          Transforms.select(
            editor,
            Editor.after(editor, slashPosition.anchor)!
          );
          // Editor.after();
          // Editor.insertText(editor, "");
        }
        // change default to header
        else {
          Transforms.setNodes(
            editor,
            { type: headerType },
            {
              match: (n: Node) => {
                return Editor.isBlock(editor, n);
              },
              at: slashPosition.anchor,
            }
          );

          // Replace the slash
          Transforms.select(editor, slashPosition.anchor);
          Editor.deleteForward(editor, {
            unit: "line",
          });
          // delete the slash
          Editor.deleteBackward(editor, { unit: "character" });
        }
      }
    } else {
      // if in the middle of line
      let newBefore =
        Editor.before(editor, slashPosition!.anchor) || slashPosition!.anchor;
      let newAfter =
        Editor.after(editor, slashPosition!.focus) || slashPosition!.focus;
      let replaceRange: Range = {
        anchor: newBefore,
        focus: newAfter,
      };
      // Transforms.insertText(editor, "", {
      //   at: replaceRange,
      // });
      let newNode: Node = {
        type: headerType,
        children: [
          {
            text: "",
          },
        ],
      };
      Transforms.insertNodes(editor, newNode, {
        at: slashPosition!.focus,
      });
      let correctPos = Editor.after(editor, slashPosition!.focus, {
        unit: "line",
        distance: 1,
      });
      if (correctPos) {
        Transforms.select(editor, correctPos);
      }
    }
    ReactEditor.focus(editor);
    updateSlashPosition(null);
  }
  // let selection = editor.selection;
  // let selectedNode: Node;
  // if (selection) {
  //   selectedNode = editor.children[selection.anchor.path[0]];
  //   console.log("selected node is ", selectedNode);
  //   console.log(domNode.getBoundingClientRect());
  // }
  let currentNodeEntry = Editor.above(editor, {
    match: (node) => Node.isNode(node),
  });
  console.log("current node entry is");
  console.log(currentNodeEntry);
  let top: number = 0;
  if (slashPosition && currentNodeEntry) {
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
            top: top,
          }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <div className={"formatting-pane"}>
            <div
              onClick={(e) => {
                addHeader(headerType.H1);
              }}
            >
              Header
            </div>
            <div
              onClick={(e) => {
                addHeader(headerType.H2);
              }}
            >
              Header 2
            </div>
            <div
              onClick={(e) => {
                addHeader(headerType.H3);
              }}
            >
              Header 3
            </div>
            <div>Bulleted List</div>
            <div>Numbered List</div>
            <div>Code Block</div>
            <div>Image</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
