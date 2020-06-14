import React, { Component } from "react";
import NewStep from "./NewStep";
import Step from "./Step";
const descriptionStyles = require("../styles/Description.module.scss");

type PublishingProps = {};

type PublishingState = {
  steps: any[];
};

type PublishingComponent = {
  publishingComponentType: PublishingComponentType;
};

enum PublishingComponentType {
  description = "description",
  step = "step",
}

export default class Publishing extends Component<
  PublishingProps,
  PublishingState
> {
  constructor(props: PublishingProps) {
    super(props);

    this.addStep = this.addStep.bind(this);

    this.state = {
      steps: [{}],
    };
  }

  addStep(e: React.MouseEvent<HTMLButtonElement>) {
    let steps = this.state.steps;
    let new_step = {};
    steps.push(new_step);
    console.log("addstep");
    this.setState({ steps });
  }

  render() {
    return (
      <div className={descriptionStyles.publishing}>
        <div className={descriptionStyles.PublishingButtonsWrapper}>
          <div className={descriptionStyles.publishingButtons}>
            <button className={descriptionStyles.preview}>Preview</button>
            <button className={descriptionStyles.publish}>Publish</button>
          </div>
        </div>
        <div className={descriptionStyles.header}>
          <h1>Title</h1>
        </div>
        <NewStep addStep={this.addStep} />
        {this.state.steps.map((step) => {
          return <Step />;
        })}
      </div>
    );
  }
}
