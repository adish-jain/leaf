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

    // TODO: add in button to be able to re-modify OldSteps and mutate their values in Firestore

    onChange = (stepText: any) => {
        this.setState({
            stepText,
        });
      };

    deleteStoredStep(e: React.MouseEvent<any>) {
        let data = {
            requestedAPI: "delete_step",
            draftId: this.props.draftId,
            stepId: this.props.id,
        };

        fetch("/api/endpoint", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(data),
        }).then(async (res: any) => {
            let updatedSteps = res.json();
            mutate("/api/endpoint", updatedSteps);
            console.log(res);
        });
    }

    editStoredStep(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            editing: true,
        });
    }

    updateStoredStep(e: React.MouseEvent<HTMLButtonElement>) {
        let data = {
            requestedAPI: "update_step",
            text: this.state.stepText,
            draftId: this.props.draftId,
            stepId: this.props.id,
        };
        
        fetch("/api/endpoint", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(data),
        }).then(async (res: any) => {
            let updatedSteps = res.json();
            mutate("/api/endpoint", updatedSteps);
            console.log(res);
        });

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
                (<EditingStoredStep updateStoredStep={this.updateStoredStep} onChange={this.onChange} editorState={editorState} />) 
                : 
                (<RenderedStoredStep editStoredStep={this.editStoredStep} deleteStoredStep={this.deleteStoredStep} editorState={editorState} />)
        );
    }
}
