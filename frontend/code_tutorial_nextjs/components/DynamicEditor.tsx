import React, { Component } from "react";

import { Editor, EditorState } from "draft-js";

type DynamicEditorProps = {};

type DynamicEditorState = {
  editorState: any;
};

export default class DynamicEditor extends Component<
  DynamicEditorProps,
  DynamicEditorState
> {
  onChange: any;

  constructor(props: DynamicEditorProps) {
    super(props);

    this.onChange = (editorState: any) => this.setState({ editorState });

    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }
  render() {
    return (
      <div>
        <Editor
          placeholder="Write here"
          onChange={this.onChange}
          editorState={this.state.editorState}
        />
      </div>
    );
  }
}
