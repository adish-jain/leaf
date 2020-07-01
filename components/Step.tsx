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
  saveStep: (
    stepId: any,
    text: any,
  ) => void;
  id: string;
  draftId: any;
};

type StepState = {
  stepText: any;
};

export default class Step extends Component<StepProps, StepState> {
  focus: any;
  editor: any;

  constructor(props: StepProps) {
    super(props);
    this.state = { stepText: "" };
    this.focus = () => this.editor.focus();
    this.saveStep = this.saveStep.bind(this);
  }

  onChange = (stepText: any) => {
    this.setState({
      stepText,
    });
  };

  saveStep(e: React.MouseEvent<HTMLButtonElement>) {
    let stepId = this.props.id;
    let text = this.state.stepText;
    this.props.saveStep(stepId, text);
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
