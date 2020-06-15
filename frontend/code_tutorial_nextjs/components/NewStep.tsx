import React, { Component } from "react";
const newStepStyles = require("../styles/NewStep.module.scss");

type NewStepProps = {
  addStep: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type NewStepState = {
};

export default class NewStep extends Component<NewStepProps, NewStepState> {
  constructor(props: NewStepProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className={newStepStyles.NewStep}>
        <p>Add New</p>
        <div className={newStepStyles.Line}></div>
    
        <div className={newStepStyles.Buttons}>
          <button onClick={this.props.addStep}>Description</button>
          <button>Step</button>
        </div>
      </div>
    );
  }
}
