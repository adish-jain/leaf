import React, { useState } from "react";
const descriptionStyles = require("../styles/AddStep.module.scss");
import Step from "./Step";

export default function AddStep() {
  const [clicked, onceClicked] = useState(false);

  const handleClick = () => {
    onceClicked(!clicked);
  };

  const [published, publishText] = useState(false);

  return (
    <div className={descriptionStyles.steps}>
      <div className={descriptionStyles.header}>
        <h1>Add</h1>
        <div className={descriptionStyles.stepArea}>
          <div className={descriptionStyles.stepButtons} onClick={handleClick}>
            {!clicked && (
              <button className={descriptionStyles.step}>New Step</button>
            )}
            {!clicked && (
              <button className={descriptionStyles.desc}>
                New Description
              </button>
            )}
          </div>
          <div>{clicked && <Step clicked={clicked} />}</div>
        </div>
      </div>
    </div>
  );
}
