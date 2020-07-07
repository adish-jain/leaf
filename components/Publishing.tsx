import React, { Component } from "react";
import { useState } from "react";
import { mutate } from "swr";
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
  title: string;
  storedSteps: any[];
  saveStep: (
    stepId: string,
    text: any,
  ) => void;
  updateStoredStep: (
    stepId: string,
    text: any,
    oldLines: any,
    removeLines: any,
  ) => void;
  deleteStoredStep: (
    stepId: any,
  ) => void;
  onHighlight: () => void;
  unHighlight: () => void;
  moveStepUp: (
    stepId: any,
  ) => void;
  moveStepDown: (
    stepId: any,
  ) => void;
  saveTitle: (
    title: string,
  ) => void;
};

type PublishingState = {
  steps: any[];
  title: string;
  saveTitle: boolean;
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
    this.saveTitle = this.saveTitle.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);

    this.state = {
      steps: [],
      title: props.title,
      saveTitle: false,
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

  saveTitle(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (this.state.saveTitle) {
      this.props.saveTitle(this.state.title);
    }
    this.setState({
      saveTitle: false,
    })
  }

  onTitleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      title: e.target.value,
      saveTitle: true,
    });
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
          <form>
            <textarea 
              className={descriptionStyles.textArea}
              placeholder={"Untitled"}
              defaultValue={this.props.title}
              onChange={this.onTitleChange}
              onBlur={this.saveTitle}
              name="title"/>
          </form>
        </div>
        {this.props.storedSteps.map((storedStep) => {
          return (
            <StoredStep
              id={storedStep.id}
              draftId={this.props.draftId}
              text={JSON.parse(storedStep.text)}
              lines={storedStep.lines}
              deleteStoredStep={this.props.deleteStoredStep}
              updateStoredStep={this.props.updateStoredStep}
              onHighlight={this.props.onHighlight}
              unHighlight={this.props.unHighlight}
              moveStepUp={this.props.moveStepUp}
              moveStepDown={this.props.moveStepDown}
              key={storedStep.id}
            />
          );
        })}
        {this.state.steps.map((step) => {
          return (
            <Step
              closeStep={this.closeStep}
              saveStep={this.props.saveStep}
              onHighlight={this.props.onHighlight}
              unHighlight={this.props.unHighlight}
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
