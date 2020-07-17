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
  onHighlight: () => void;
  unHighlight: () => void;
  id: string;
  draftId: any;
};

type StepState = {
  stepText: any;
  highlight: boolean;
};

export default class Step extends Component<StepProps, StepState> {
  focus: any;
  editor: any;

  constructor(props: StepProps) {
    super(props);
    this.state = { stepText: "" , highlight: false };
    this.focus = () => this.editor.focus();
    this.saveStep = this.saveStep.bind(this);
    this.highlight = this.highlight.bind(this);
    this.unHighlight = this.unHighlight.bind(this);
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
  
  render() {
    const highlight = this.state.highlight;
    return (
      <div className={StepStyles.Step}>
        <div className={StepStyles.Draft}>
          {// @ts-ignore 
            <DynamicEditor onChange={this.onChange} />
          }
        </div>
        <div className={StepStyles.Buttons}>
          { highlight ? 
            ( <button onClick={(e) => {this.unHighlight(e)}} className={StepStyles.Highlight}>un-Select</button> ) 
            : 
            ( <button onClick={(e) => {this.highlight(e)}} className={StepStyles.Save}>Code Select</button> ) 
          }
          <button onClick={(e) => {this.saveStep(e)}} className={StepStyles.Save}>Save</button>
          <div onClick={(e) => {this.props.closeStep(this.props.id)}} className={StepStyles.Close}>X</div>
        </div>
        <div className={StepStyles["LineInfo"]}></div>
      </div>
    );
  }
}
