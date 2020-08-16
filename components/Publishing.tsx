import React, { Component } from "react";
import TextareaAutosize from "react-autosize-textarea";
import NewStep from "./NewStep";
import StoredStep from "./StoredStep";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import Router from "next/router";
const publishingStyles = require("../styles/Publishing.module.scss");

var shortId = require("shortid");

type File = {
  id: string;
  language: string; //replace with enum
  code: string;
  name: string;
};

type Line = {
  lineNumber: number;
  char: number;
};

type PublishingProps = {
  draftId: any;
  title: string;
  storedSteps: any[];
  // what step is currently being edited? -1 means no steps being edited
  editingStep: number;
  changeEditingStep: (editingStep: number) => void;
  saveStep: (stepId: string, text: any) => void;
  mutateStoredStep: (stepId: string, text: string) => void;
  saveStepToBackend: (stepId: string, text: string) => void;
  deleteStoredStep: (stepId: any) => void;
  moveStepUp: (stepId: any) => void;
  moveStepDown: (stepId: any) => void;
  onTitleChange: (title: string) => void;
  selectedFileIndex: number;
  lines: { start: Line; end: Line };
  saveLines: (fileName: string, remove: boolean) => void;
  files: File[];
  published: boolean;
  goToPublishedPost: () => void;
};

type PublishingState = {
  previewLoading: boolean;
};

type PublishingComponent = {
  publishingComponentType: PublishingComponentType;
};

enum PublishingComponentType {
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

    this.state = {
      previewLoading: false,
    };
  }

  closeStep(stepId: string) {
    this.props.deleteStoredStep(stepId);
  }

  addStep(e: React.MouseEvent<HTMLButtonElement>) {
    let stepId = shortId.generate();

    let emptyJSON = {
      blocks: [
        {
          key: stepId,
          text: "Enter content here",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    };

    this.props.saveStep(stepId, JSON.stringify(emptyJSON));
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

  previewDraft(e: React.MouseEvent<HTMLButtonElement>) {
    let { draftId } = this.props;
    let url = `/api/preview?draftId=${draftId}`;
    // window.location.href = url;

    this.setState({
      previewLoading: true,
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

  PublishingButtons = () => {
    return (
      <div className={publishingStyles.PublishingButtonsWrapper}>
        <div className={publishingStyles.publishingButtons}>
          <button
            onClick={this.previewDraft}
            className={publishingStyles.preview}
          >
            {this.state.previewLoading ? "Loading Preview..." : "Preview"}
          </button>
          {this.props.published ? (
            <button
              onClick={(e) => this.props.goToPublishedPost()}
              className={publishingStyles.publish}
            >
              Go to Published Post
            </button>
          ) : (
            <button
              onClick={this.publishDraft}
              className={publishingStyles.publish}
            >
              Publish
            </button>
          )}
        </div>
      </div>
    );
  };

  PublishingHeader = () => {
    return (
      <div className={publishingStyles.header}>
        <TextareaAutosize
          placeholder={this.props.title}
          value={this.props.title}
          onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
            let myTarget = e.target as HTMLTextAreaElement;
            this.props.onTitleChange(myTarget.value);
          }}
          name="title"
        />
      </div>
    );
  };

  render() {
    let {
      storedSteps,
      editingStep,
      changeEditingStep,
      selectedFileIndex,
      files,
      onTitleChange,
      saveLines,
      mutateStoredStep,
      saveStepToBackend,
      deleteStoredStep,
    } = this.props;

    function StoredSteps() {
      return <div></div>;
    }
    return (
      <div className={publishingStyles.publishing}>
        <this.PublishingButtons />
        <this.PublishingHeader />
        {storedSteps.map((storedStep, index) => {
          return (
            <StoredStep
              id={storedStep.id}
              index={index}
              draftId={this.props.draftId}
              text={JSON.parse(storedStep.text)}
              lines={storedStep.lines}
              deleteStoredStep={deleteStoredStep}
              mutateStoredStep={mutateStoredStep}
              saveStepToBackend={saveStepToBackend}
              moveStepUp={this.props.moveStepUp}
              moveStepDown={this.props.moveStepDown}
              key={storedStep.id}
              editing={editingStep === index}
              changeEditingStep={changeEditingStep}
              selectedFileIndex={selectedFileIndex}
              files={files}
              saveLines={saveLines}
              attachedFileId={storedStep.fileId}
            />
          );
        })}
        <NewStep addStep={this.addStep} />
      </div>
    );
  }
}
