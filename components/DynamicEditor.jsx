import React, { Component } from "react";
import { convertToRaw, EditorState, SelectionState } from "draft-js";
import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";
import createToolbarPlugin, { Separator } from "draft-js-static-toolbar-plugin";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from "draft-js-buttons";
import EditorStyles from "../styles/EditorStyles.module.scss";
import "!style-loader!css-loader!draft-js-static-toolbar-plugin/lib/plugin.css";

var shortId = require("shortid");

/* 
Component rendered when Headlines Button is clicked to present option of H1, H2, or H3. 
*/
class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  onWindowClick = () => this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button) => (
          <Button key={shortId.generate()} {...this.props} />
        ))}
      </div>
    );
  }
}

/* 
The Header button option in the toolbar, 'H'. Once clicked, the HeadlinesPicker 
component will be rendered to allow selection of H1, H2, or H3. 
*/
class HeadlinesButton extends Component {
  onClick = () => this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div className={EditorStyles["headline-button-wrapper"]}>
        <button
          onClick={this.onClick}
          className={EditorStyles["headline-button"]}
        >
          H
        </button>
      </div>
    );
  }
}

/* 
The static toolbar component plugin. Contains all buttons in it. 
Creates a static toolbar for each editor, for in-sync editing.
*/
export default class DynamicEditor extends Component {
  constructor(props) {
    console.log("constructor");
    super(props);
    const toolbarPlugin = createToolbarPlugin();
    const text = "Begin Writing...";
    this.PluginComponents = {
      Toolbar: toolbarPlugin.Toolbar,
    };
    this.plugins = [toolbarPlugin];

    this.state = {
      editorState: this.props.editorState
        ? this.props.editorState
        : createEditorStateWithText(text),
    };
  }

  componentDidMount() {
    this.focus();
    this.moveSelectionToEnd();
  }

  moveSelectionToEnd() {
    let { editorState } = this.state;
    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();

    const key = blockMap.last().getKey();
    const length = blockMap.last().getLength();

    // On Chrome and Safari, calling focus on contenteditable focuses the
    // cursor at the first character. This is something you don't expect when
    // you're clicking on an input element but not directly on a character.
    // Put the cursor back where it was before the blur.
    const selection = new SelectionState({
      anchorKey: key,
      anchorOffset: length,
      focusKey: key,
      focusOffset: length,
    });
    this.setState({
      editorState: EditorState.forceSelection(editorState, selection),
    });
  }

  componentWillUnmount() {
    // save to API if the step exits out of edit mode
    const value = JSON.stringify(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    this.props.immediateUpdate(value);
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
    const value = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    // trigger timer
    this.props.onChange(value);
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    const { Toolbar } = this.PluginComponents;
    return (
      <div>
        <div onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={this.plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
          <Toolbar>
            {(externalProps) => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlinesButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </div>
            )}
          </Toolbar>
        </div>
      </div>
    );
  }
}
