import React, { Component } from "react";
import dynamic from "next/dynamic";
const StepStyles = require("../styles/Step.module.scss");

const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
    ssr: false,
  });

type EditingStoredStepProps = {
    updateStoredStep: (
        e: React.MouseEvent<HTMLButtonElement>,
        removeLines: any,
    ) => void;
    onChange: (
        stepText: any
    ) => void;
    onHighlight: () => void;
    unHighlight: () => void;
    editorState: any;
};
  
type EditingStoredStepState = {
    remove: boolean,
    highlight: boolean;
};

export default class Step extends Component<EditingStoredStepProps, EditingStoredStepState> {
    constructor(props: EditingStoredStepProps) {
        super(props);
        this.state = { highlight: false, remove: false };
    }
    
    highlight(e: React.MouseEvent<HTMLButtonElement>) {
        this.props.onHighlight();
        this.setState({
            highlight: true,
        });
    }

    unHighlight(e: React.MouseEvent<HTMLButtonElement>) {
        this.props.unHighlight();
        this.setState({
            highlight: false,
        });
    }

    removeSelect(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            remove: true,
            highlight: false,
        });
    }

    saveEditingStoredStep(e: React.MouseEvent<HTMLButtonElement>) {
        this.props.updateStoredStep(e, this.state.remove);
        this.setState({
            highlight: false,
        });
    }

    render() {
        const highlight = this.state.highlight;
        const remove = this.state.remove;
        return (
            <div className={StepStyles.Step}>
                <div className={StepStyles.Draft}>
                {// @ts-ignore 
                    <DynamicEditor onChange={this.props.onChange} editorState={this.props.editorState}/>
                }
                </div>
                <div className={StepStyles.Buttons}>
                { highlight ? 
                    ( <button onClick={(e) => {this.unHighlight(e)}} className={StepStyles.Highlight}>un-Select</button> ) 
                    : 
                    ( <button onClick={(e) => {this.highlight(e)}} className={StepStyles.Save}>Code Select</button> ) 
                }
                { remove ? 
                    ( <button className={StepStyles.Remove}>Removed Select</button> ) 
                    : 
                    ( <button onClick={(e) => {this.removeSelect(e)}} className={StepStyles.Save}>Remove Select</button> ) 
                }
                <button onClick={(e) => {this.saveEditingStoredStep(e)}} className={StepStyles.Save}>Save</button>
                </div>
                <div></div>
            </div>
        );
    }
}
