import React, { Component } from "react";
import { Editor } from 'draft-js';
const StepStyles = require("../styles/Step.module.scss");

type RenderedStoredStepProps = {
    editStoredStep: (
        e: React.MouseEvent<HTMLButtonElement>
    ) => void;
    deleteStoredStep: (
        e: React.MouseEvent<any>
    ) => void;
    editorState: any;
};
  
type RenderedStoredStepState = {
};

export default class Step extends Component<RenderedStoredStepProps, RenderedStoredStepState> {
    constructor(props: RenderedStoredStepProps) {
        super(props);
    }

    render() {
        return (
            <div className={StepStyles.Step}>
                <div className={StepStyles.Draft}>
                {// @ts-ignore 
                <Editor editorState={this.props.editorState} readOnly={true}/>
                }
                </div>
                <div className={StepStyles.Buttons}>
                    <button onClick={(e) => {this.props.editStoredStep(e)}} className={StepStyles.Save}>Edit</button>
                    <div onClick={(e) => {this.props.deleteStoredStep(e)}} className={StepStyles.Close}>X</div>
                </div>
            </div>
        );
    }
}
