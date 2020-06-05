import React, { useState } from "react";
const descriptionStyles = require("../styles/Step.module.scss");

export default function Step() {
  const [text, onceWritten] = useState('');

  const handleChange = (event) => {
    onceWritten(event.target.value);
  };

  const handleSubmit = (event) => {
    
  };

  return (
    <div className={descriptionStyles.stepForm}>
      <form onSubmit={handleSubmit}>
        <div className={descriptionStyles.header}>
          <label className={descriptionStyles.titleName}>
            Enter Here:
            <textarea className={descriptionStyles.textarea} value={text} onChange={handleChange} />
          </label>
        </div>
        <div className={descriptionStyles.stepButtons}>
          <input className={descriptionStyles.done} type="submit" value="Done" />
        </div>
      </form>
      <div>
        <p>
          {text}
        </p>
      </div>
    </div>
    );
}
