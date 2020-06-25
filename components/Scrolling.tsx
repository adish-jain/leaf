import React, { Component } from "react";
import PublishedStep from "./PublishedStep";
const scrollingStyles = require("../styles/Scrolling.module.scss");

var shortid = require("shortid");

const steps = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
];

type ScrollingProps = {
  changeStep: (newStep: number) => void;
};

export default class Scrolling extends Component<ScrollingProps> {
  // myRef: React.CreateRef;
  private myRef = React.createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.state = {
      inView: 0,
    };
  }

  render() {
    return (
      <div className={scrollingStyles["scrolling"]}>
        {steps.map((step) => (
          <PublishedStep
            index={step}
            key={step}
            changeStep={this.props.changeStep}
          >
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum."
          </PublishedStep>
        ))}
      </div>
    );
  }
}
