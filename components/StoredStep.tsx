import React, { Component } from "react";
import { mutate } from "swr";
import { EditorState, convertFromRaw } from 'draft-js';
import EditingStoredStep from "./EditingStoredStep";
import RenderedStoredStep from "./RenderedStoredStep";
const fetch = require("node-fetch");

type StoredStepProps = {
    id: string;
    draftId: any;
    text: any;
    lines: any;
    updateStoredStep: (
        text: any,
        stepId: any,
        oldLines: any,
        removeLines: any,
    ) => void;
    deleteStoredStep: (
        stepId: any,
    ) => void;
    onHighlight: () => void;
    unHighlight: () => void;
};
  
type StoredStepState = {
    stepText: any;
    editing: boolean;
};
  
export default class StoredStep extends Component<StoredStepProps, StoredStepState> {

    constructor(props: StoredStepProps) {
        super(props);
        this.deleteStoredStep = this.deleteStoredStep.bind(this);
        this.editStoredStep = this.editStoredStep.bind(this);
        this.updateStoredStep = this.updateStoredStep.bind(this);
        this.state = {
            stepText: this.props.text,
            editing: false,
        };
    }

    onChange = (stepText: any) => {
        this.setState({
            stepText,
        });
      };

    deleteStoredStep(e: React.MouseEvent<any>) {
        this.props.deleteStoredStep(this.props.id);
    }

    editStoredStep(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            editing: true,
        });
    }

    updateStoredStep(e: React.MouseEvent<HTMLButtonElement>, removeLines: boolean) {
        let text = this.state.stepText;
        let stepId =  this.props.id;
        this.props.updateStoredStep(stepId, text, this.props.lines, removeLines);
        
        this.setState({
            editing: false,
        });
    }

    render() {
        const contentState = convertFromRaw(this.props.text);
        const editorState = EditorState.createWithContent(contentState);
        const editing = this.state.editing;
        return (
            editing ?
                (<EditingStoredStep 
                    updateStoredStep={this.updateStoredStep} 
                    onChange={this.onChange} 
                    editorState={editorState} 
                    onHighlight={this.props.onHighlight}
                    unHighlight={this.props.unHighlight} />) 
                : 
                (<RenderedStoredStep 
                    editStoredStep={this.editStoredStep} 
                    deleteStoredStep={this.deleteStoredStep} 
                    lines={this.props.lines}
                    editorState={editorState} />)
        );
    }
}
