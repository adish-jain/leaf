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
import React, { useState, ChangeEvent, useContext } from "react";
import Image from "next/image";
import slateEditorStyles from "../styles/slate-editor.module.scss";
import { PreviewContext } from "./preview-context";
const ImageElement = (
  props: RenderElementProps & {
    handleImageUpload?: (
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
        className={slateEditorStyles[`${"image-element-uploaded"}`]}
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
    <div {...props.attributes} className={slateEditorStyles["image-element"]}>
      <label className={slateEditorStyles["add-image"]}>
        + Add Image
        <input
          type="file"
          id="myFile"
          name="filename"
          accept="image/*"
          onChange={(e) => {
            if (props.handleImageUpload) {
              props.handleImageUpload(e, nodeRef);
            }
          }}
        />
      </label>
      {props.children}
    </div>
  );
};

function LeftImageHandle() {
  const [xShift, updateXShift] = useState(0);
  return (
    <div
      id={"leftimagehandle"}
      className={slateEditorStyles["img-handle"]}
    ></div>
  );
}

// Define a React component renderer for h1 blocks.
const HeaderOneElement = (props: RenderElementProps) => {
  const { publishedView, previewMode } = useContext(PreviewContext);
  const showDecorations = publishedView || previewMode;
  let className = showDecorations ? "headerOne" : "headerOne-draft";
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={slateEditorStyles[className]}>
      <h1 {...props.attributes}>{props.children}</h1>
      {empty && !showDecorations && (
        <HeadingPlaceHolder>Heading 1</HeadingPlaceHolder>
      )}
    </div>
  );
};

function HeadingPlaceHolder(props: any) {
  return (
    <>
      {true && (
        <label contentEditable={false} onClick={(e) => e.preventDefault()}>
          {props.children}
        </label>
      )}
    </>
  );
}

// Define a React component renderer for h2 blocks.
const HeaderTwoElement = (props: RenderElementProps) => {
  const { publishedView, previewMode } = useContext(PreviewContext);
  const showDecorations = publishedView || previewMode;
  let className = showDecorations ? "headerTwo" : "headerTwo-draft";
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={slateEditorStyles[className]}>
      <h2 {...props.attributes}>{props.children}</h2>
      {empty && !showDecorations && (
        <HeadingPlaceHolder>Heading 2</HeadingPlaceHolder>
      )}
    </div>
  );
};

// Define a React component renderer for h2 blocks.
const HeaderThreeElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  const { publishedView, previewMode } = useContext(PreviewContext);
  const showDecorations = publishedView || previewMode;
  let className = showDecorations ? "headerThree" : "headerThree-draft";
  return (
    <div className={slateEditorStyles[className]}>
      <h3 {...props.attributes}>{props.children}</h3>
      {empty && !showDecorations && (
        <HeadingPlaceHolder>Heading 3</HeadingPlaceHolder>
      )}
    </div>
  );
};

const UnOrderedListElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={slateEditorStyles["unordered-list"]}>
      <div {...props.attributes}>{props.children}</div>
      {empty && <HeadingPlaceHolder>List Item</HeadingPlaceHolder>}
    </div>
  );
};

const BlockQuoteElement = (props: RenderElementProps) => {
  let currentNode = props.element.children[0];
  let empty = currentNode.text === "";
  return (
    <div className={slateEditorStyles["blockquote-element"]}>
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
    <div className={slateEditorStyles["numbered-element"]}>
      <div {...props.attributes}>{props.children}</div>
      <span
        className={slateEditorStyles["number-label"]}
        onClick={(e) => e.preventDefault()}
        contentEditable={false}
      >
        {`${order}. `}
      </span>
      {empty && <HeadingPlaceHolder>Ordered List Item</HeadingPlaceHolder>}
    </div>
  );
};

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
            className={slateEditorStyles["handle"]}
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
      className={slateEditorStyles["prompt"]}
      onMouseLeave={(e) => toggleHover(false)}
      onMouseEnter={(e) => toggleHover(true)}
      // ref={defaultElementRef}
    >
      <p className={slateEditorStyles["prompt-content"]} {...props.attributes}>
        {props.children}
      </p>
      {focused && selected && emptyText && (
        <label
          contentEditable={false}
          // onClick={(e) => e.preventDefault()}
          className={slateEditorStyles["placeholder-text"]}
        >
          {"Press '/' for commands"}
        </label>
      )}
      {/* <BlockHandle hovered={hovered} /> */}
    </div>
  );
};

export {
  HeaderOneElement,
  HeaderTwoElement,
  HeaderThreeElement,
  UnOrderedListElement,
  BlockQuoteElement,
  NumberedListElement,
  DefaultElement,
  ImageElement,
};
