import React, { Component } from "react";
import NewStep from "./NewStep";
import Step from "./Step";
const descriptionStyles = require("../styles/Description.module.scss");

var shortid = require("shortid");

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
    this.closeStep = this.closeStep.bind(this);

    this.state = {
      steps: [],
    };
  }

  closeStep(e: React.MouseEvent<HTMLDivElement>, id: string) {
    let steps = this.state.steps;
    let idx = steps.indexOf(id, 0);
    steps.splice(idx, 1);
    console.log("closestep");
    this.setState({ steps: steps });
  }

  addStep(e: React.MouseEvent<HTMLButtonElement>) {
    let steps = this.state.steps;
    let new_step = shortid.generate();
    steps.push(new_step);
    console.log("addstep");
    this.setState({ steps });
  }

  render() {
    return (
      <div className={descriptionStyles.publishing}>
        <div className={descriptionStyles.header}>
          <h1>Title</h1>
        </div>
      </div>
    );
  }
}
