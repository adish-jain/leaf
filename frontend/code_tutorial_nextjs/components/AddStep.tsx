import React, { useState } from "react";
const descriptionStyles = require("../styles/Publishing.module.scss");

type AddStepProps = {};

type AddStepState = {
  steps: PublishingComponent[];
};

type PublishingComponent = {
  publishingComponentType: PublishingComponentType;
};

enum PublishingComponentType {
  description = "description",
  step = "step",
}

export default function AddStep(props: PublishingProps) {

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const [count, setCount] = useState(0);
  };

  return (
    <div className={descriptionStyles.steps}>
      <div className={descriptionStyles.header}>
        <h1>
        Add
        </h1>
        <div className={descriptionStyles.stepButtons}>
          <div onClick={handleClick}>
            <button className={descriptionStyles.step}>New Step</button>
            <button className={descriptionStyles.desc}>New Description</button>
          </div>
        </div>
      </div>
    </div>
  );
}
