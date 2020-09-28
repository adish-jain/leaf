import React, { Component } from "react";
import "../styles/imageview.scss";
import { File, Step } from "../typescript/types/app_types";

type PublishedImageViewProps = {
  currentStep?: Step;
};

type PublishedImageViewState = {};

export default class PublishedImageView extends Component<
  PublishedImageViewProps,
  PublishedImageViewState
> {
  constructor(props: PublishedImageViewProps) {
    super(props);

    this.state = {};
  }

  render() {
    let { currentStep } = this.props;
    if (!currentStep) {
      return <div></div>;
    }
    return (
      <div className={"published-img"}>
        {currentStep.imageURL ? (
          <img src={currentStep.imageURL} />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
