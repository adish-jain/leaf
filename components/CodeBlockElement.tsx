import { RenderElementProps, useFocused, useSelected } from "slate-react";
import { ChangeEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import codeBlockStyles from "../styles/codeblock.module.scss";
//html, xml
import "prismjs/components/prism-markup.min";
// css, scss
import "prismjs/components/prism-css.min";
import "prismjs/components/prism-scss.min";
// yaml
import "prismjs/components/prism-yaml.min";
// json
import "prismjs/components/prism-json";
// typescript
import "prismjs/components/prism-typescript.min";
// tsx, jsx, javascript
import "prismjs/components/prism-javascript.min";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-tsx.min";
// python
import "prismjs/components/prism-python.min";
// java
import "prismjs/components/prism-java.min";
import "prismjs/components/prism-clike.min";
// go
import "prismjs/components/prism-go.min";
// php
import "prismjs/components/prism-php.min";
import "prismjs/components/prism-markup-templating.min";
// ruby
import "prismjs/components/prism-ruby.min";
// rust
import "prismjs/components/prism-rust.min";
// swift
import "prismjs/components/prism-swift.min";
// c
import "prismjs/components/prism-c.min";
// objectivec
import "prismjs/components/prism-objectivec";
// c++
import "prismjs/components/prism-cpp.min";
// textile/plaintext
import "prismjs/components/prism-textile.min";
// markdown
import "prismjs/components/prism-markdown.min";
// dockerfile
import "prismjs/components/prism-docker.min";
// bash
import "prismjs/components/prism-bash.min";

export const CodeBlockElement = (
  props: RenderElementProps & {
    changeLanguage?: (
      event: ChangeEvent<HTMLSelectElement>,
      domNode: globalThis.Node
    ) => void;
  }
) => {
  const selected = useSelected();
  const focused = useFocused();
  const nodeText = props.element.children[0].text;
  const numOfLines = (nodeText as string).split(/\r\n|\r|\n/).length;
  let nodeRef: globalThis.Node = props.attributes.ref.current;
  let emptyText = props.element.children[0].text === "";
  let language: string | undefined = props.element.language as
    | string
    | undefined;
  const [hovered, toggleHover] = useState(false);
  let { changeLanguage } = props;
  return (
    <div
      className={codeBlockStyles["codeblock"]}
      onMouseLeave={(e) => toggleHover(false)}
      onMouseEnter={(e) => toggleHover(true)}
    >
      <span
        className={codeBlockStyles["codeblock-content"]}
        {...props.attributes}
      >
        {props.children}
      </span>
      {focused && selected && emptyText && (
        <label
          contentEditable={false}
          // onClick={(e) => e.preventDefault()}
          className={codeBlockStyles["codeblock-placeholder"]}
        >
          {"Enter code here"}
        </label>
      )}
      {changeLanguage && (
        <ChooseLanguage
          nodeRef={nodeRef}
          changeLanguage={changeLanguage}
          hovered={hovered}
          language={language}
        />
      )}

      <CodeBlockLines numOfLines={numOfLines} />
    </div>
  );
};

export function CodeBlockLines(props: { numOfLines: number }) {
  const toRender = [];
  for (let i = 0; i < props.numOfLines; i++) {
    toRender.push(
      <div key={i} className={codeBlockStyles["codeline"]}>
        {i + 1}
      </div>
    );
  }
  return (
    <div contentEditable={false} className={codeBlockStyles["codelines"]}>
      {toRender}
    </div>
  );
}

const ChooseLanguage = (props: {
  hovered: boolean;
  changeLanguage: (
    event: ChangeEvent<HTMLSelectElement>,
    domNode: globalThis.Node
  ) => void;
  nodeRef: globalThis.Node;
  language: string | undefined;
}) => {
  let { hovered, changeLanguage, nodeRef, language } = props;

  return (
    <AnimatePresence>
      {true && (
        <motion.div
          style={{
            position: "absolute",
            top: "2px",
            right: "4px",
            // bottom: 0,
            zIndex: 3,
            cursor: "pointer",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
          }}
        >
          <LanguageOptions
            nodeRef={nodeRef}
            changeLanguage={changeLanguage}
            language={language}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function LanguageOptions(props: {
  changeLanguage: (
    event: ChangeEvent<HTMLSelectElement>,
    domNode: globalThis.Node
  ) => void;
  nodeRef: globalThis.Node;
  language: string | undefined;
}) {
  let { changeLanguage, nodeRef, language } = props;
  return (
    <div
      // onClick={(e) => e.preventDefault()}
      contentEditable={false}
      className={codeBlockStyles["choose-languages"]}
      draggable={true}
    >
      <select
        onChange={(e) => {
          changeLanguage(e, nodeRef);
        }}
        value={language ? language : "plaintext"}
      >
        <option value="html">HTML</option>
        <option value="xml">XML</option>
        <option value="css">CSS</option>
        <option value="scss">SCSS</option>
        <option value="yaml">YAML</option>
        <option value="json">JSON</option>
        <option value="typescript">Typescript</option>
        <option value="javascript">Javascript</option>
        <option value="tsx">Typescript React</option>
        <option value="jsx">Javascript React</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="go">Go</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
        <option value="rust">Rust</option>
        <option value="swift">Swift</option>
        <option value="objective-c">Objective C</option>
        <option value="c">C</option>
        <option value="c++">C++</option>
        <option value="plaintext">Text</option>
        <option value="markdown">Markdown</option>
        <option value="dockerfile">Dockerfile</option>
        <option value="bash">Bash</option>
      </select>
    </div>
  );
}
