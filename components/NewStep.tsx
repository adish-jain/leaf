import React, { Component } from "react";
const newStepStyles = require("../styles/NewStep.module.scss");

type NewStepProps = {
  addStep: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type NewStepState = {};

export default class NewStep extends Component<NewStepProps, NewStepState> {
  constructor(props: NewStepProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={newStepStyles.NewStep}>
        <button onClick={this.props.addStep}>+ Add Step</button>
      </div>
    );
  }
}
