import React, { Component } from "react";
const StepStyles = require("../styles/Step.module.scss");

type StepProps = {};

type StepState = {};

export default class Step extends Component<StepProps, StepState> {
  constructor(props: StepProps) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div className={StepStyles.Step}>
        <div className={StepStyles.Buttons}>
          <button className={StepStyles.Save}>Save</button>
          <div className={StepStyles.Close}>X</div>
        </div>
      </div>
    );
  }
}
