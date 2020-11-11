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

// Define a React component renderer for our code blocks.
const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

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
      <div className={"unordered-list"}>
        <div {...props.attributes}>{props.children}</div>
        {empty && <HeadingPlaceHolder>Block quote</HeadingPlaceHolder>}
      </div>
    );
  };
  

export {
  CodeElement,
  HeaderOneElement,
  HeaderTwoElement,
  HeaderThreeElement,
  UnOrderedListElement,
  BlockQuoteElement
};
