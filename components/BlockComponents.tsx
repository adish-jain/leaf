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
import { getPrismLanguageFromBackend } from "../lib/utils/languageUtils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";

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

const ImageElement = (
  props: RenderElementProps & {
    handleImageUpload: (
      e: React.ChangeEvent<HTMLInputElement>,
      domNode: globalThis.Node
    ) => void;
  }
) => {
  let nodeRef: globalThis.Node = props.attributes.ref.current;
  const [mouseDown, toggleMouseDown] = useState(false);
  const selected = useSelected();
  const focused = useFocused();
  let imageUrl: string | undefined = props.element.imageUrl as
    | string
    | undefined;

  // console.log("inside imageelement ", imageUrl);

  // console.log(props.element);
  let selectedStyle = {};
  if (selected && focused) {
    selectedStyle = {
      boxShadow: "0 0 0 3px #B4D5FF",
    };
  }
  if (imageUrl) {
    return (
      <div
        {...props.attributes}
        style={selectedStyle}
        className={`${"image-element-uploaded"}`}
        onMouseDown={(e) => {
          toggleMouseDown(true);
          e.persist();

          let targetId = (e.target as HTMLDivElement).id;
          if (targetId === "leftimagehandle") {
            toggleMouseDown(true);
          }
        }}
        onMouseUp={(e) => {
          toggleMouseDown(false);
        }}
        onMouseMove={(e) => {
          if (mouseDown) {
            e.persist();
          }
        }}
      >
        <div contentEditable={false}>
          <img src={imageUrl} />
        </div>
        {props.children}
      </div>
    );
  }
  return (
    <div {...props.attributes} className={"image-element"}>
      <label className={"add-image"}>
        + Add Image
        <input
          type="file"
          id="myFile"
          name="filename"
          accept="image/*"
          onChange={(e) => {
            props.handleImageUpload(e, nodeRef);
          }}
        />
      </label>
      {props.children}
    </div>
  );
};

function LeftImageHandle() {
  const [xShift, updateXShift] = useState(0);
  return <div id={"leftimagehandle"} className={"img-handle"}></div>;
}

// Define a React component renderer for h1 blocks.
const HeaderOneElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={"headerOne"}>
      <h1 {...props.attributes}>{props.children}</h1>
      {empty && <HeadingPlaceHolder>Heading 1</HeadingPlaceHolder>}
    </div>
  );
};

function HeadingPlaceHolder(props: any) {
  return (
    <label contentEditable={false} onClick={(e) => e.preventDefault()}>
      {props.children}
    </label>
  );
}

// Define a React component renderer for h2 blocks.
const HeaderTwoElement = (props: any) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={"headerTwo"}>
      <h2 {...props.attributes}>{props.children}</h2>
      {empty && <HeadingPlaceHolder>Heading 2</HeadingPlaceHolder>}
    </div>
  );
};

// Define a React component renderer for h2 blocks.
const HeaderThreeElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";

  return (
    <div className={"headerThree"}>
      <h3 {...props.attributes}>{props.children}</h3>
      {empty && <HeadingPlaceHolder>Heading 3</HeadingPlaceHolder>}
    </div>
  );
};

const UnOrderedListElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={"unordered-list"}>
      <div {...props.attributes}>{props.children}</div>
      {empty && <HeadingPlaceHolder>List Item</HeadingPlaceHolder>}
    </div>
  );
};

const BlockQuoteElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={"blockquote-element"}>
      <div {...props.attributes}>{props.children}</div>
      {empty && <HeadingPlaceHolder>Block quote</HeadingPlaceHolder>}
    </div>
  );
};

const NumberedListElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  let order = props.element.order;
  return (
    <div className={"numbered-element"}>
      <div {...props.attributes}>{props.children}</div>
      <span
        className={"number-label"}
        onClick={(e) => e.preventDefault()}
        contentEditable={false}
      >
        {`${order}. `}
      </span>
      {empty && <HeadingPlaceHolder>Ordered List Item</HeadingPlaceHolder>}
    </div>
  );
};

const CodeBlockElement = (
  props: RenderElementProps & {
    changeLanguage: (
      event: ChangeEvent<HTMLSelectElement>,
      domNode: globalThis.Node
    ) => void;
  }
) => {
  const selected = useSelected();
  const focused = useFocused();
  let nodeRef: globalThis.Node = props.attributes.ref.current;
  let emptyText = props.element.children[0].text === "";
  let language: string | undefined = props.element.language as
    | string
    | undefined;
  const [hovered, toggleHover] = useState(false);
  let { changeLanguage } = props;
  return (
    <div
      className={"codeblock"}
      onMouseLeave={(e) => toggleHover(false)}
      onMouseEnter={(e) => toggleHover(true)}
    >
      <span className={"codeblock-content"} {...props.attributes}>
        {props.children}
      </span>
      {focused && selected && emptyText && (
        <label
          contentEditable={false}
          // onClick={(e) => e.preventDefault()}
          className={"codeblock-placeholder"}
        >
          {"Enter code here"}
        </label>
      )}
      <ChooseLanguage
        nodeRef={nodeRef}
        changeLanguage={changeLanguage}
        hovered={hovered}
        language={language}
      />
    </div>
  );
};

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

// function ChooseLanguage(props: { hovered: boolean }) {
//   let { hovered } = props;
//   return (
//     <AnimatePresence>
//       {hovered && (
//         <motion.div
//           style={{
//             position: "absolute",
//             top: "-2px",
//             left: "4px",
//             // bottom: 0,
//             // top: `${yPos + window.pageYOffset - 26}px`,
//             // left: `${xPos + window.pageXOffset - 4}px`,
//             zIndex: 3,
//             cursor: "pointer",
//           }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{
//             duration: 0.2,
//           }}
//         >
//           <div
//             onClick={(e) => {
//               console.log("click");
//             }}
//             className={"codeblock-select"}
//             contentEditable={false}
//           >
//             <LanguageOptions />
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

const BlockHandle = (props: { hovered: boolean }) => {
  let { hovered } = props;

  return (
    <AnimatePresence>
      {hovered && (
        <motion.div
          style={{
            position: "absolute",
            top: "-2px",
            left: "4px",
            // bottom: 0,
            // top: `${yPos + window.pageYOffset - 26}px`,
            // left: `${xPos + window.pageXOffset - 4}px`,
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
          <div
            // onClick={(e) => e.preventDefault()}
            onClick={(e) => {}}
            contentEditable={false}
            className={"handle"}
            draggable={true}
          >
            <img src="/images/sixdots.svg" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DefaultElement = (props: RenderElementProps) => {
  const selected = useSelected();
  const focused = useFocused();
  let emptyText = props.element.children[0].text === "";
  const [hovered, toggleHover] = useState(false);
  return (
    <div
      className={"prompt"}
      onMouseLeave={(e) => toggleHover(false)}
      onMouseEnter={(e) => toggleHover(true)}
      // ref={defaultElementRef}
    >
      <p className={"prompt-content"} {...props.attributes}>
        {props.children}
      </p>
      {focused && selected && emptyText && (
        <label
          contentEditable={false}
          // onClick={(e) => e.preventDefault()}
          className={"placeholder-text"}
        >
          {"Press '/' for commands"}
        </label>
      )}
      <BlockHandle hovered={hovered} />
    </div>
  );
};

export {
  CodeBlockElement,
  HeaderOneElement,
  HeaderTwoElement,
  HeaderThreeElement,
  UnOrderedListElement,
  BlockQuoteElement,
  NumberedListElement,
  DefaultElement,
  ImageElement,
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
      className={"choose-languages"}
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
      </select>
    </div>
  );
}
