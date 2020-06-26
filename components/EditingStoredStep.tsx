import React, { Component } from "react";
import dynamic from "next/dynamic";
const StepStyles = require("../styles/Step.module.scss");

const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
    ssr: false,
  });

type EditingStoredStepProps = {
    updateStoredStep: (
        e: React.MouseEvent<HTMLButtonElement>
    ) => void;
    onChange: (
        stepText: any
    ) => void;
    editorState: any;
};
  
type EditingStoredStepState = {
};

export default class Step extends Component<EditingStoredStepProps, EditingStoredStepState> {
    constructor(props: EditingStoredStepProps) {
        super(props);
    }

    render() {
        return (
            <div className={StepStyles.Step}>
                <div className={StepStyles.Draft}>
                {// @ts-ignore 
                    <DynamicEditor onChange={this.props.onChange} editorState={this.props.editorState}/>
                }
                </div>
                <div className={StepStyles.Buttons}>
                <button onClick={(e) => {this.props.updateStoredStep(e)}} className={StepStyles.Save}>Save</button>
                </div>
                <div></div>
            </div>
        );
    }
}
