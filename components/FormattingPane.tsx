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

export default function FormattingPane(props: {
  editor: Editor & ReactEditor & HistoryEditor;
  updateSlashPosition: React.Dispatch<React.SetStateAction<Range | null>>;
  slashPosition: Range | null;
}) {
  let { slashPosition, editor, updateSlashPosition } = props;

  function addHeaderOne() {
    // if beginning of line
    if (slashPosition?.anchor.path[1] === 0) {
      console.log("deleting slashpoint");
      //   Transforms.delete(editor, {
      //     at: slashPosition.anchor,
      //     unit: 'line',
      //     distance: slashPosition.focus.offset - slashPosition.anchor.offset,
      //   });
      Transforms.insertText(editor, "# ", {
        at: slashPosition.anchor.path,
      });
    } else {
      let newNode: Node = {
        type: "default",
        children: [
          {
            text: "# ",
          },
        ],
      };
      Transforms.insertNodes(editor, newNode, {
        at: slashPosition!,
      });
    }
    ReactEditor.focus(editor);
    Transforms.select(editor, slashPosition!);
    updateSlashPosition(null);
  }

  return (
    <AnimatePresence>
      {slashPosition && (
        <motion.div
          style={{
            position: "absolute",
            zIndex: 1,
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
            <div onClick={addHeaderOne}>Header</div>
            <div>Header 2</div>
            <div>Header 3</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
