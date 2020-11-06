// @refresh reset
import React, { useEffect, useMemo, useState, useCallback } from "react";
import "../styles/slate-editor.scss";
import { Block } from "../typescript/enums/app_enums";
import { Lines, Step } from "../typescript/types/app_types";

// Import the Slate editor factory.
import { createEditor, Node, Editor, Text, Transforms, Range } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor } from "slate-react";

type SlateEditorProps = {};

export default function SlateEditor(props: SlateEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Node[]>([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!event.ctrlKey) {
      return;
    }
    switch (event.key) {
      // When "`" is pressed, keep our existing code block logic.
      case "`": {
        event.preventDefault();
        const [match] = Editor.nodes(editor, {
          match: (n) => n.type === "code",
        });
        Transforms.setNodes(
          editor,
          { type: match ? "paragraph" : "code" },
          { match: (n) => Editor.isBlock(editor, n) }
        );
        break;
      }

      // When "B" is pressed, bold the text in the selection.
      case "b": {
        // console.log("case b");
        event.preventDefault();
        const [match] = Editor.nodes(editor, {
          match: (n) => {
            return n.bold === true;
          },
        });
        let shouldBold = match === undefined;
        // console.log(shouldBold);
        let selection = editor.selection;

        let selected = editor.children[selection!.anchor.path[0]];
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
        break;
      }
    }
  }

  return (
    <div className={"slate-wrapper"}>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
        />
      </Slate>
    </div>
  );
}

// Define a React component renderer for our code blocks.
const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

// Define a React component to render leaves with bold text.
const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
