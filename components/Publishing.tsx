import React, { Component } from "react";
import NewStep from "./NewStep";
import Step from "./Step";
import StoredStep from "./StoredStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import { convertToRaw, convertFromRaw } from "draft-js";
import Router from "next/router";
const descriptionStyles = require("../styles/Description.module.scss");

var shortId = require("shortid");

type PublishingProps = {
  draftId: any;
  storedSteps: any[];
  associateLines: (
    stepId: string,
  ) => void;
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

export default class Publishing extends Component<
  PublishingProps,
  PublishingState
> {
  constructor(props: PublishingProps) {
    super(props);

    this.addStep = this.addStep.bind(this);
    this.closeStep = this.closeStep.bind(this);
    this.previewDraft = this.previewDraft.bind(this);

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

  previewDraft(e: React.MouseEvent<HTMLButtonElement>) {
    let { draftId } = this.props;
    let url = `/api/preview?draftId=${draftId}`;
    // window.location.href = url;

    fetch(url, {
      method: "POST",
      // redirect: "follow",
      headers: new Headers({ "Content-Type": "application/json" }),
    })
      .then((res: any) => {
        if (res.redirected) {
          Router.push("/preview");
        }
        // HTTP 301 response
      })
      .catch(function (err: any) {
        console.info(err + " url: " + url);
      });
  }

  render() {
    return (
      <div className={descriptionStyles.publishing}>
        <div className={descriptionStyles.PublishingButtonsWrapper}>
          <div className={descriptionStyles.publishingButtons}>
            <button
              onClick={this.previewDraft}
              className={descriptionStyles.preview}
            >
              Preview
            </button>
            <button className={descriptionStyles.publish}>Publish</button>
          </div>
        </div>
        <div className={descriptionStyles.header}>
          <h1>Title</h1>
        </div>
        {this.props.storedSteps.map((storedStep) => {
          return (
            <StoredStep
              id={storedStep.id}
              draftId={this.props.draftId}
              text={JSON.parse(storedStep.text)}
              key={storedStep.id}
            />
          );
        })}
        {this.state.steps.map((step) => {
          return (
            <Step
              closeStep={this.closeStep}
              associateLines={this.props.associateLines}
              id={step}
              draftId={this.props.draftId}
              key={step}
            />
          );
        })}
        <NewStep addStep={this.addStep} />
      </div>
    );
  }
}
