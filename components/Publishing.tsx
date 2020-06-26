import React, { Component } from "react";
import NewStep from "./NewStep";
import Step from "./Step";
import StoredStep from "./StoredStep"
import { convertToRaw, convertFromRaw } from 'draft-js';
const descriptionStyles = require("../styles/Description.module.scss");

var shortId = require('shortid');

type PublishingProps = {
  draftId: any;
  storedSteps: any[];
};

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

export default class Publishing extends Component<PublishingProps, PublishingState> {
  constructor(props: PublishingProps) {
    super(props);

    this.addStep = this.addStep.bind(this);
    this.closeStep = this.closeStep.bind(this);

    this.state = {
      steps: [],
    };
  }

  closeStep(id: string) {
    let steps = this.state.steps;
    let idx = steps.indexOf(id, 0);
    steps.splice(idx, 1);
    this.setState({ steps: steps });
  }

  addStep(e: React.MouseEvent<HTMLButtonElement>) {
    let steps = this.state.steps;
    let new_step = shortId.generate();
    steps.push(new_step);
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
        {this.props.storedSteps.map(storedStep => {
          return <StoredStep id={storedStep.id} draftId={this.props.draftId} text={JSON.parse(storedStep.text)} key={storedStep.id}/>
        })}
        {this.state.steps.map(step => {
          return <Step closeStep={this.closeStep} id={step} draftId={this.props.draftId} key={step} />;
        })}
        <NewStep addStep={this.addStep} />
      </div>
    );
  }
}
