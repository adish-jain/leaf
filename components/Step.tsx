import React, { Component } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";
import dynamic from "next/dynamic";
const StepStyles = require("../styles/Step.module.scss");
const fetch = require("node-fetch");


const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
  ssr: false,
});

type StepProps = {
  closeStep: (
    id: string
  ) => void;
  id: string;
  draftid: any;
};

type StepState = {
  steptext: any;
};

export default class Step extends Component<StepProps, StepState> {
  focus: any;
  editor: any;

  constructor(props: StepProps) {
    super(props);
    this.state = { steptext: ""};
    this.focus = () => this.editor.focus();
  }

  onChange = (steptext: any) => {
    this.setState({
      steptext,
    });
  };

  saveStep(e: React.MouseEvent<HTMLButtonElement>) {
    console.log("savestep");
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
      let updatedSteps = res.json();
      mutate("/api/endpoint", updatedSteps);
      console.log(res);
    });

    this.props.closeStep(this.props.id);
  }
  
  render() {
    return (
      <div className={StepStyles.Step}>
        <div className={StepStyles.Draft}>
          {// @ts-ignore 
            <DynamicEditor onChange={this.onChange} />
          }
        </div>
        <div className={StepStyles.Buttons}>
          <button onClick={(e) => {this.saveStep(e)}} className={StepStyles.Save}>Save</button>
          <div onClick={(e) => {this.props.closeStep(this.props.id)}} className={StepStyles.Close}>X</div>
        </div>
        <div></div>
      </div>
    );
  }
}
