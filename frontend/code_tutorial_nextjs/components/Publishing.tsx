import React, { Component } from "react";
import NewStep from './NewStep'
const descriptionStyles = require("../styles/Description.module.scss");

type PublishingProps = {};

type PublishingState = {
  steps: PublishingComponent[];
};

type PublishingComponent = {
  publishingComponentType: PublishingComponentType;
};

enum PublishingComponentType {
  description = "description",
  step = "step",
}

export default function Publishing(props: PublishingProps) {
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
      <NewStep />
    </div>
  );
}
