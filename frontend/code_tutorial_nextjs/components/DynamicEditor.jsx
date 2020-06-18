import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
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
} from 'draft-js-buttons';
import EditorStyles from '../styles/EditorStyles.module.scss';
import '!style-loader!css-loader!draft-js-static-toolbar-plugin/lib/plugin.css';

class HeadlinesPicker extends Component {

  componentDidMount() {
    setTimeout(() => { window.addEventListener('click', this.onWindowClick); });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick = () =>
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button, i) =>
          <Button key={i} {...this.props} />
        )}
      </div>
    );
  }
}

class HeadlinesButton extends Component {
  onClick = () =>
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div className={EditorStyles.headlineButtonWrapper}>
        <button onClick={this.onClick} className={EditorStyles.headlineButton}>
          H
        </button>
      </div>
    );
  }
}

export default class CustomToolbarEditor extends Component {

  constructor(props) {
    super(props);
    const toolbarPlugin = createToolbarPlugin();
    const text = 'Begin Writing...\n\n\n\n';
    this.PluginComponents = {
      Toolbar: toolbarPlugin.Toolbar
    };
    this.plugins = [toolbarPlugin];
    this.state = {
      editorState: createEditorStateWithText(text),
    }
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
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
            ref={(element) => { this.editor = element; }}
          />
          <Toolbar>
            {
              (externalProps) => (
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
              )
            }
          </Toolbar>
        </div>
      </div>
    );
  }
}
