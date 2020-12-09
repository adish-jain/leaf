import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { DraftContext } from "../contexts/draft-context";
import { LinesContext } from "../contexts/lines-context";
import { opacityFade } from "../styles/framer_animations/opacityFade";
import lineStyles from "../styles/linemodal.module.scss";
import stepStyles from "../styles/step.module.scss";

export function LineModal(props: any) {
  const { currentlySelectedLines } = useContext(LinesContext);
  const { currentlyEditingBlock } = useContext(DraftContext);
  return (
    <AnimatePresence>
      {currentlySelectedLines && (
        <motion.div
          style={{
            position: "absolute",
            margin: "auto",
            // bottom: 0,
            // right: 0,
            // left: "30%",
            width: "100%",
            bottom: "20px",
            zIndex: 1,
          }}
          initial={{
            bottom: "-40px",
            opacity: 0,
          }}
          animate={{
            bottom: "40px",
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            bottom: "0px",
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <div className={lineStyles["linemodal"]}>
            {currentlyEditingBlock?.type !== "codestep" ? (
              <SelectPrompt />
            ) : (
              <AttachPrompt />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SelectPrompt(props: {}) {
  const { currentlySelectedLines } = useContext(LinesContext);

  return (
    <div>
      Select a step to attach lines
      <span className={stepStyles["line-color"]}>
        {currentlySelectedLines?.start || 0}
      </span>{" "}
      through{" "}
      <span className={stepStyles["line-color"]}>
        {currentlySelectedLines?.end || 0}
      </span>{" "}
      to a step
    </div>
  );
}

function AttachPrompt(props: {}) {
  const { currentlySelectedLines } = useContext(LinesContext);
  return (
    <div>
      <div>
        Attach Lines{" "}
        <span className={stepStyles["line-color"]}>
          {currentlySelectedLines?.start || 0}
        </span>{" "}
        through{" "}
        <span className={stepStyles["line-color"]}>
          {currentlySelectedLines?.end || 0}
        </span>{" "}
        to step?
      </div>
      <button className={stepStyles["attach-button"]}>
        {" "}
        Attach lines to step
      </button>
    </div>
  );
}

// need current step coordinates, up to date on scroll
// need currently selected lines
