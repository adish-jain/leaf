import React, { Component } from 'react';
import { convertToRaw, convertFromRaw } from 'draft-js';
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

var shortid = require('shortid');

/* 
Component rendered when Headlines Button is clicked to present option of H1, H2, or H3. 
*/
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
        {buttons.map(Button =>
          <Button key={shortid.generate()} {...this.props} />
        )}
      </div>
    );
  }
}

/* 
The Header button option in the toolbar, 'H'. Once clicked, the HeadlinesPicker 
component will be rendered to allow selection of H1, H2, or H3. 
*/
class HeadlinesButton extends Component {
  onClick = () =>
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div className={EditorStyles['headline-button-wrapper']}>
        <button onClick={this.onClick} className={EditorStyles['headline-button']}>
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
    const value = convertToRaw(editorState.getCurrentContent());
    // const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    // const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
    this.props.onChange(value); //added
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
