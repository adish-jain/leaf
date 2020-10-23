import React, { Component } from "react";
import "../styles/imageview.scss";
import { File, Step } from "../typescript/types/app_types";
import { motion, AnimatePresence } from "framer-motion";

type PublishedImageViewProps = {
  steps: Step[];
  currentStepIndex: number;
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
    let { currentStepIndex, steps } = this.props;
    let currentStep = steps[currentStepIndex];
    return (
      <AnimatePresence>
        {currentStep?.imageURL && (
          <motion.div
            initial={{
              // opacity: 0,
              maxHeight: '0px',
              // transform: "scaleY(0)"
            }}
            style={{
              height: "auto",
              // overflow: "hidden",
              maxHeight: "600px",
            }}
            animate={{
              // opacity: 1,
              // transform: "scaleY(1)"
              maxHeight: "600px",
            }}
            exit={{
              // opacity: 0,
              // transform: "scaleY(0)"
              maxHeight: '0px',
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <div className={"published-img"}>
              <img src={currentStep?.imageURL} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}
