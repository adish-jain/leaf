import React, { Component, useContext } from "react";
import { DraftContext } from "../contexts/draft-context";
import { StepContext } from "../contexts/step-context";
import "../styles/newstep.scss";

type NewStepProps = {};

type NewStepState = {};

export function NewStep(props: NewStepProps) {
  const { addBackendBlock } = useContext(DraftContext);
  return (
    <div className={"NewStep"}>
      <button onClick={this.props.addStep}>+ Add Step</button>
    </div>
  );
}
