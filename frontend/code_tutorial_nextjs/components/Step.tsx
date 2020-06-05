import React, { useState } from "react";
const descriptionStyles = require("../styles/Step.module.scss");

type StepProps = {
  clicked: boolean;
};

export default function Step(props: StepProps) {
  const [text, onceWritten] = useState("");
  const [published, publish] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    publish(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onceWritten(event.target.value);
  };

  return (
    <div className={descriptionStyles.stepForm}>
      {!published && (
        <form onSubmit={handleSubmit}>
          <div className={descriptionStyles.header}>
            <label className={descriptionStyles.titleName}>
              Enter Here:
              <textarea
                className={descriptionStyles.textarea}
                value={text}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className={descriptionStyles.stepButtons}>
            <input
              className={descriptionStyles.done}
              type="submit"
              value="Done"
            />
          </div>
        </form>
      )}
      <div>
        <p>{text}</p>
      </div>
    </div>
  );
}
