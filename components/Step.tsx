import React, { Component } from "react";
import fetch from "isomorphic-fetch";
import Router from "next/router";
const StepStyles = require("../styles/Step.module.scss");
import dynamic from "next/dynamic";

const DynamicEditor = dynamic((() => import("./DynamicEditor")) as any, {
  ssr: false,
});

import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
type StepProps = {
  closeStep: (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => void;
  id: string;
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
    };
    fetch("api/endpoint", {
      method: "POST",
      // eslint-disable-next-line no-undef
      credentials: "same-origin",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
    }).then((res) => {
      console.log(res);
      // reload the page to reset useSWR
      // location.reload();
      // Router.replace(`/signup`); // does this need to be changed ?
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
          <div onClick={(e) => {this.props.closeStep(e, this.props.id)}} className={StepStyles.Close}>X</div>
        </div>
        <div></div>
      </div>
    );
  }
}
