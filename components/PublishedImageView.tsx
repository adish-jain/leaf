import React, { Component } from "react";
import "../styles/imageview.scss";
import { File, Step } from "../typescript/types/app_types";
import { motion, AnimatePresence } from "framer-motion";

type PublishedImageViewProps = {
  steps: Step[];
  currentStepIndex: number;
  imageViewRef: React.RefObject<HTMLDivElement>;
  scrollSpeed: number;
};

type PublishedImageViewState = {};
var highest = 0;
const SPEED_SCROLL_LIMIT = 30;
export default class PublishedImageView extends Component<
  PublishedImageViewProps,
  PublishedImageViewState
> {
  constructor(props: PublishedImageViewProps) {
    super(props);

    this.state = {};
  }

  onComplete() {
    console.log("animation completed");
  }

  render() {
    let { currentStepIndex, steps, imageViewRef, scrollSpeed } = this.props;
    let currentStep = steps[currentStepIndex];
    let speed = Math.abs(scrollSpeed);

    return (
      <div ref={imageViewRef}>
        <AnimatePresence>
          {currentStep?.imageURL && (
            <motion.div
              initial={{
                // opacity: 0,
                // maxHeight: "0px",
                height: "0px",
                // transform: "scaleY(0)"
              }}
              style={
                {
                  // height: "0px",
                  overflow: "hidden",
                  // maxHeight: "600px",
                }
              }
              animate={{
                // opacity: 1,
                // transform: "scaleY(1)"
                // maxHeight: "600px",
                height: "250px",
              }}
              exit={{
                // opacity: 0,
                // transform: "scaleY(0)"
                // maxHeight: "0px",
                height: "0px",
              }}
              transition={{
                duration: speed < SPEED_SCROLL_LIMIT ? 0.4 : 0,
              }}
              onAnimationComplete={this.onComplete}
            >
              <div className={"published-img"}>
                <img src={currentStep?.imageURL} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
}
