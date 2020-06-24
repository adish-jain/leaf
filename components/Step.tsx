import React, { Component } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
const StepStyles = require("../styles/Step.module.scss");
const fetch = require("node-fetch");


const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
  ssr: false,
});

import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
type StepProps = {
  closeStep: (
    id: string
  ) => void;
  // saveStep: (
  //   id: string
  // ) => void;
  id: string;
  draftid: any;
  key: string;
};

type StepState = {
  steptext: any;
};

export default class Step extends Component<StepProps, StepState> {
  // onChange: any;
  focus: any;
  editor: any;

  constructor(props: StepProps) {
    super(props);
    this.state = { steptext: "" };
    this.focus = () => this.editor.focus();
    //this.onChange = (editorState: any) => this.setState({ editorState });
  }

  onChange = (steptext: any) => {
    this.setState({
      steptext,
    });
    // console.log(this.state.steptext);
  };

  saveStep(e: React.MouseEvent<HTMLButtonElement>) {
    let data = {
      requestedAPI: "save_step",
      text: this.state.steptext,
      draftid: this.props.draftid,
      stepid: this.props.id,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });

    this.props.closeStep(this.props.id);
    // this.props.saveStep(this.props.id);
  }

  deleteStep(e: React.MouseEvent<HTMLDivElement>) {
    this.props.closeStep(this.props.id);
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
      console.log(res);
    });

  }
  
  render() {
    return (
      <div className={StepStyles.Step}>
        <div className={StepStyles.Draft}>
          {// @ts-ignore 
            <DynamicEditor onChange={this.onChange}/>
          }
        </div>
        <div className={StepStyles.Buttons}>
          <button onClick={(e) => {this.saveStep(e)}} className={StepStyles.Save}>Save</button>
          <div onClick={(e) => {this.deleteStep(e)}} className={StepStyles.Close}>X</div>
        </div>
        <div></div>
      </div>
    );
  }
}
