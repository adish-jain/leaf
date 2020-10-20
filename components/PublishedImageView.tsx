import React, { Component } from "react";
import "../styles/imageview.scss";
import { File, Step } from "../typescript/types/app_types";
import { motion, AnimatePresence } from "framer-motion";

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

    return (
      <AnimatePresence>
        {currentStep?.imageURL && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
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
