import React, { Component } from "react";
import DraftEditor, { Editor } from "draft-js";
import "../styles/renderedstep.scss";
import { motion, AnimatePresence } from "framer-motion";

type RenderedStoredStepProps = {
  changeEditingStep: (editingStep: number) => void;
  deleteStoredStep: (e: React.MouseEvent<any>) => void;
  moveStepUp: () => void;
  moveStepDown: () => void;
  editorState: any;
  lines?: { start: number; end: number };
  attachedFileName: string;
  index: number;
};

type RenderedStoredStepState = {
  hovered: boolean;
};

export default class Step extends Component<
  RenderedStoredStepProps,
  RenderedStoredStepState
> {
  constructor(props: RenderedStoredStepProps) {
    super(props);

    this.state = {
      hovered: false,
    };

    this.sideButtons = this.sideButtons.bind(this);
  }

  LineStatus = () => {
    let { lines, attachedFileName } = this.props;

    return (
      <label className={"block-status"}>
        {" "}
        Selected lines {lines?.start} to {lines?.end} in {attachedFileName}
      </label>
    );
  };

  NoLines() {
    return (
      <label className={"block-status"}>Code Editor. No lines selected.</label>
    );
  }

  sideButtons() {
    let { hovered } = this.state;
    return (
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={
              {
                opacity: 0,
                position: "relative",
                left: "-100px",
                top: "-60px",
              } as any
            }
            animate={
              { opacity: 1, position: "relative", left: "-128px" } as any
            }
            exit={{ 
              opacity: 0, 
              // left: "-100px" 
            }}
            transition={{ duration: 0.25 }}
          >
            <div className={"side-buttons-wrapper"}>
              <div className={"side-buttons"}>
                <button className={"up"}>
                  <span>↑</span>
                </button>
                <button className={"down"}>
                  <span>↓</span>
                </button>
                <button className={"close"}>
                  <span>X</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  render() {
    let { lines, attachedFileName, index, changeEditingStep } = this.props;
    return (
      <div
        onClick={(e) => changeEditingStep(index)}
        className={"renderedstep-wrapper"}
        onMouseEnter={(e) => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={(e) => {
          this.setState({ hovered: false });
        }}
      >
        <div className={"main-content"}>
          <Editor
            editorState={this.props.editorState}
            readOnly={true}
            onChange={(e) => null}
          />
        </div>
        {lines === undefined ? <this.NoLines /> : <this.LineStatus />}
        {/* <div className={"divider"}></div> */}
        <this.sideButtons />
      </div>
    );
  }
}
