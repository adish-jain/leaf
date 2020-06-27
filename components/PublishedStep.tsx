import React, { Component, useEffect } from "react";
const StepStyles = require("../styles/PublishedStep.module.scss");
import { useInView, InView } from "react-intersection-observer";
const draftToHtml = require("draftjs-to-html");

type PublishedStepProps = {
  index: number;
  changeStep: (newStep: number, yPos: number, entered: boolean) => void;
  text: string;
  selected: boolean;
  currentStep: number;
};

class PublishedStep extends Component<PublishedStepProps> {
  //   private myRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  private myRef = React.createRef<HTMLDivElement>();

  constructor(props: PublishedStepProps) {
    super(props);
    ``;
    this.handleChange = this.handleChange.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
    this.myRef = React.createRef();

    this.state = {};
  }

  //   setRefs(node: HTMLDivElement) {
  //     this.myRef.current = node;
  //   }

  renderDraftJS() {
    let rawContentState = JSON.parse(this.props.text);
    let markup = draftToHtml(rawContentState);
    return { __html: markup };
  }

  handleChange(inView: boolean, entry: IntersectionObserverEntry) {
    this.props.changeStep(this.props.index, 0, inView);
  }

  scrollIntoView() {
    console.log(this.myRef.current);
    this.myRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }

  render() {
    let { selected, index } = this.props;

    let stepStyle = selected ? "Step--Selected" : "Step";

    return (
      <div ref={this.myRef} onClick={this.scrollIntoView}>
        <InView
          threshold={1}
          rootMargin={"0% 0% 0% 0%"}
          onChange={this.handleChange}
        >
          {({ inView, ref, entry }) => (
            <div ref={ref} className={StepStyles[stepStyle]}>
              <h1>{index}</h1>
              <div dangerouslySetInnerHTML={this.renderDraftJS()} />
            </div>
          )}
        </InView>
      </div>
    );
  }
}

// function PublishedStep1(props: PublishedStepProps) {
//   const [ref, inView, entry] = useInView({
//     /* Optional options */
//     // root: props.root,
//     threshold: 1,
//     rootMargin: "0% 0% 0% 0%",
//   });

//   useEffect(() => {
//     //   console.log("showing observer for", props.index);
//     //   console.log(entry)
//     props.changeStep(props.index, 0, inView);
//   }, [inView]);

//   function renderDraftJS() {
//     let rawContentState = JSON.parse(props.text);
//     let markup = draftToHtml(rawContentState);
//     return { __html: markup };
//   }

//   let stepStyle = props.selected ? "Step--Selected" : "Step";
//   return (
//     <div ref={ref} className={StepStyles[stepStyle]}>
//       <h1>{props.index}</h1>
//       <div dangerouslySetInnerHTML={renderDraftJS()} />
//     </div>
//   );
// }

export default PublishedStep;
