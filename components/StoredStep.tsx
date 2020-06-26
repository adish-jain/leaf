import React, { Component } from "react";
import useSWR, { SWRConfig, mutate } from "swr";

import Router from "next/router";
import dynamic from "next/dynamic";
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
const StepStyles = require("../styles/Step.module.scss");
const fetch = require("node-fetch");

const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
    ssr: false,
  });

type StoredStepProps = {
    id: string;
    draftid: any;
    text: any;
};
  
type StoredStepState = {
    steptext: any;
    editing: boolean;
};
  
export default class StoredStep extends Component<StoredStepProps, StoredStepState> {

    constructor(props: StoredStepProps) {
        super(props);
        this.state = {
            steptext: this.props.text,
            editing: false,
        };
    }

    // TODO: add in button to be able to re-modify OldSteps and mutate their values in Firestore

    onChange = (steptext: any) => {
        this.setState({
          steptext,
        });
      };

    deleteStoredStep(e: React.MouseEvent<any>) {
        console.log("deleteStoredStep")
        let data = {
            requestedAPI: "delete_step",
            draftid: this.props.draftid,
            stepid: this.props.id,
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
        console.log("editStoredStep");
        this.setState({
            editing: true,
        });
    }

    updateStoredStep(e: React.MouseEvent<HTMLButtonElement>) {
        console.log("updateStoredStep");
        let data = {
            requestedAPI: "update_step",
            text: this.state.steptext,
            draftid: this.props.draftid,
            stepid: this.props.id,
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
                (<div className={StepStyles.Step}>
                    <div className={StepStyles.Draft}>
                      {// @ts-ignore 
                        <DynamicEditor onChange={this.onChange} editorState={editorState}/>
                      }
                    </div>
                    <div className={StepStyles.Buttons}>
                      <button onClick={(e) => {this.updateStoredStep(e)}} className={StepStyles.Save}>Save</button>
                    </div>
                    <div></div>
                </div>) : 
                (<div className={StepStyles.Step}>
                    <div className={StepStyles.Draft}>
                    {// @ts-ignore 
                    <Editor editorState={editorState} readOnly={true}/>
                    }
                    </div>
                    <div className={StepStyles.Buttons}>
                        <button onClick={(e) => {this.editStoredStep(e)}} className={StepStyles.Save}>Edit</button>
                        <div onClick={(e) => {this.deleteStoredStep(e)}} className={StepStyles.Close}>X</div>
                    </div>
                </div>)
        );
    }
}
