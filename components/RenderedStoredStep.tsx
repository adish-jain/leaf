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
    moveStepUp: () => void;
    moveStepDown: () => void;
    editorState: any;
    lines: any;
};
  
type RenderedStoredStepState = {
};

export default class Step extends Component<RenderedStoredStepProps, RenderedStoredStepState> {
    constructor(props: RenderedStoredStepProps) {
        super(props);
        // console.log(this.props.lines);
    }

    render() {
        let highlightedLines;
        if (this.props.lines) {
            highlightedLines = "lines " + this.props.lines['start']  + "-" + this.props.lines['end'];
        } else {
            highlightedLines = false;
        }
        return (
            <div className={StepStyles.Step}>
                <div className={StepStyles.Draft}>
                {// @ts-ignore 
                <Editor editorState={this.props.editorState} readOnly={true}/>
                }
                </div>
                <div className={StepStyles.Buttons}>
                    {highlightedLines && 
                    (<div className={StepStyles.Save}>{highlightedLines}</div>)} 
                    <button onClick={(e) => {this.props.editStoredStep(e)}} className={StepStyles.Save}>Edit</button>
                    <div onClick={(e) => {this.props.moveStepUp()}} className={StepStyles.Up}>↑</div>
                    <div onClick={(e) => {this.props.moveStepDown()}} className={StepStyles.Down}>↓</div>
                    <div onClick={(e) => {this.props.deleteStoredStep(e)}} className={StepStyles.Close}>X</div>
                </div>
            </div>
        );
    }
}
