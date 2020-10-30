import React, { useEffect, useMemo, useState, useCallback } from "react";
import ContentEditable from "react-contenteditable";
import "../styles/mdx-section.scss";
import { Block } from "../typescript/enums/app_enums";
import { Lines, Step } from "../typescript/types/app_types";

// Import the Slate editor factory.
import { createEditor, Node, Editor, Transforms } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

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

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "`" && event.ctrlKey) {
      event.preventDefault();
      // Determine whether any of the currently selected blocks are code blocks.
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === "code",
      });
      console.log("match is");
      console.log(match);
      // Toggle the block type depending on whether there's already a match.
      Transforms.setNodes(
        editor,
        { type: match ? "paragraph" : "code" },
        { match: (n) => Editor.isBlock(editor, n) }
      );
    }
  }

  return (
    <div className={"mdx-wrapper"}>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <Editable renderElement={renderElement} onKeyDown={handleKeyDown} />
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
