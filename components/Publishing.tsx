import React, { Component } from "react";
import NewStep from "./NewStep";
import Step from "./Step";
import StoredStep from "./StoredStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import Router from "next/router";
const publishingStyles = require("../styles/Publishing.module.scss");

var shortId = require("shortid");

type PublishingProps = {
  draftId: any;
  title: string;
  storedSteps: any[];
  saveStep: (stepId: string, text: any) => void;
  updateStoredStep: (
    stepId: string,
    text: any,
    oldLines: any,
    removeLines: any
  ) => void;
  deleteStoredStep: (stepId: any) => void;
  onHighlight: () => void;
  unHighlight: () => void;
  moveStepUp: (stepId: any) => void;
  moveStepDown: (stepId: any) => void;
  saveTitle: (title: string) => void;
};

type PublishingState = {
  steps: any[];
  title: string;
  saveTitle: boolean;
  previewLoading: boolean;
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
    this.publishDraft = this.publishDraft.bind(this);
    this.saveTitle = this.saveTitle.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);

    this.state = {
      steps: [],
      title: props.title,
      saveTitle: false,
      previewLoading: false,
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

  publishDraft(e: React.MouseEvent<HTMLButtonElement>) {
    let { draftId } = this.props;
    fetch("/api/endpoint", {
      method: "POST",
      redirect: "follow",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ requestedAPI: "publishPost", draftId: draftId }),
    })
      .then(async (res: any) => {
        let resJson = await res.json();
        let newUrl = resJson.newURL;
        if (newUrl === "unverified") {
          alert("Please verify your email before publishing.");
        } else {
          Router.push(newUrl);
        }
        // Router.push(newUrl);
      })
      .catch(function (err: any) {
        console.log(err);
      });
  }
  saveTitle(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (this.state.saveTitle) {
      this.props.saveTitle(this.state.title);
    }
    this.setState({
      saveTitle: false,
    });
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

    this.setState({
      previewLoading: true
    });

    fetch(url, {
      method: "POST",
      // redirect: "follow",
      headers: new Headers({ "Content-Type": "application/json" }),
    })
      .then((res: any) => {
        if (res.redirected) {
          window.location.href = "/preview";
        }
        // HTTP 301 response
      })
      .catch(function (err: any) {
        console.info(err + " url: " + url);
      });
  }

  render() {
    return (
      <div className={publishingStyles.publishing}>
        <div className={publishingStyles.PublishingButtonsWrapper}>
          <div className={publishingStyles.publishingButtons}>
            <button
              onClick={this.previewDraft}
              className={publishingStyles.preview}
            >
              {this.state.previewLoading ? "Loading Preview..." : "Preview"}
            </button>
            <button
              onClick={this.publishDraft}
              className={publishingStyles.publish}
            >
              Publish
            </button>
          </div>
        </div>
        <div className={publishingStyles.header}>
          <form>
            <textarea
              className={publishingStyles.textArea}
              placeholder={"Untitled"}
              defaultValue={this.props.title}
              onChange={this.onTitleChange}
              onBlur={this.saveTitle}
              name="title"
            />
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
