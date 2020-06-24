import React, { Component } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
const StepStyles = require("../styles/Step.module.scss");
const fetch = require("node-fetch");

type OldStepProps = {
    id: string;
    text: any;
};
  
type OldStepState = {
};
  
export default class Step extends Component<OldStepProps, OldStepState> {
constructor(props: OldStepProps) {
    super(props);
    //console.log(this.props.id);
}

// TODO: add in button to be able to re-modify OldSteps and mutate their values in Firestore

render() {
    const contentState = convertFromRaw(this.props.text);
    const editorState = EditorState.createWithContent(contentState);
    return (
        <div className={StepStyles.Step}>
            <div className={StepStyles.Draft}>
            {// @ts-ignore 
            <Editor editorState={editorState} readOnly={true} />
            }
            </div>
        </div>
    );
    }
}
