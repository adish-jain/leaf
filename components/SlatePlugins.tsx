// @refresh reset

import React, { useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import {
  ParagraphPlugin,
  BoldPlugin,
  EditablePlugins,
  ItalicPlugin,
  UnderlinePlugin,
  pipe,
  SlateDocument,
  ToolbarElement
} from "@udecode/slate-plugins";

const options = {
  p: {
    type: "paragraph",
  },
  bold: {
    type: "bold",
  },
  italic: {
    type: "italic",
  },
  h1: {
    type: 'h1',
  },
  underline: {
    type: "underline",
  },
};

const initialValue: Node[] = [
  {
    type: options.p.type,
    children: [
      {
        text: "This text is bold, italic and underlined.",
        [options.bold.type]: true,
        [options.italic.type]: true,
        [options.underline.type]: true,
      },
    ],
  },
];

const plugins = [
  ParagraphPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
];

const withPlugins = [withReact, withHistory] as const;

const PluginEditor = () => {
  const [value, setValue] = useState(initialValue);

  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue as SlateDocument)}
    >
      <ToolbarElement type={options.h1.type} icon={<LooksOne />}/>
      <EditablePlugins plugins={plugins} placeholder="Enter some text..." />
    </Slate>
  );
};

export default PluginEditor;
