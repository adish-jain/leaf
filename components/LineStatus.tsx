import { AnimatePresence, motion } from "framer-motion";
import { LinesContext } from "../contexts/lines-context";
import lineStatusStyles from "../styles/linestatus.module.scss";
import { useContext } from "react";
import { DraftContext } from "../contexts/draft-context";
import { Lines } from "../typescript/types/app_types";
import { FilesContext } from "../contexts/files-context";
import { fileObject } from "../typescript/types/frontend/postTypes";

export function LineStatus(props: {
  selected: boolean;
  backendId: string;
  lines?: Lines;
  fileId?: string;
}) {
  const { selected, backendId, lines, fileId } = props;
  const { currentlySelectedLines } = useContext(LinesContext);
  const { getFileFromFileId } = useContext(FilesContext);
  const attachedFile = getFileFromFileId(fileId);
  return (
    <div
      style={{
        height: "48px",
      }}
    >
      <div className={lineStatusStyles["line-status"]}>
        {currentlySelectedLines && <ConfirmLines backendId={backendId} />}
        {!currentlySelectedLines && !lines && <LinesPrompt />}
        {!currentlySelectedLines && lines && attachedFile && (
          <LinesDisplay
            backendId={backendId}
            lines={lines}
            file={attachedFile}
          />
        )}
      </div>
    </div>
  );
}

function NotSelected() {
  return <div></div>;
}

function ConfirmLines(props: { backendId: string }) {
  const { backendId } = props;
  const { currentlySelectedLines, changeSelectedLines } = useContext(
    LinesContext
  );
  const { selectedFile } = useContext(FilesContext);
  const { updateSlateSectionToBackend } = useContext(DraftContext);
  //   const linesText =
  return (
    <motion.div
      style={{
        position: "relative",
        // margin: "auto",
        // bottom: 0,
        // right: 0,
        // left: "30%",
      }}
      initial={{
        bottom: "-80px",
        opacity: 0,
      }}
      animate={{
        bottom: "0px",
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        bottom: "-80px",
      }}
      transition={{
        duration: 0.4,
      }}
      className={lineStatusStyles["status-content"]}
    >
      <div>
        Attach Lines{" "}
        <span className={lineStatusStyles["line-color"]}>
          {currentlySelectedLines!.start}
        </span>{" "}
        through{" "}
        <span className={lineStatusStyles["line-color"]}>
          {currentlySelectedLines!.end}
        </span>{" "}
        to this step?{" "}
      </div>
      <button
        onClick={(e) => {
          updateSlateSectionToBackend(
            backendId,
            undefined,
            undefined,
            currentlySelectedLines,
            undefined,
            selectedFile?.fileId
          );
          changeSelectedLines(undefined);
        }}
        className={lineStatusStyles["attach-button"]}
      >
        Attach
      </button>
    </motion.div>
  );
}

function LinesDisplay(props: {
  lines: Lines;
  file: fileObject;
  backendId: string;
}) {
  const { lines, file, backendId } = props;
  const { updateSlateSectionToBackend } = useContext(DraftContext);

  return (
    <motion.div
      style={{
        position: "relative",
        // margin: "auto",
        // bottom: 0,
        // right: 0,
        // left: "30%",
      }}
      initial={{
        bottom: "-80px",
        opacity: 0,
      }}
      animate={{
        bottom: "0px",
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        bottom: "-80px",
      }}
      transition={{
        duration: 0.4,
      }}
      className={lineStatusStyles["status-content"]}
    >
      <div>
        Selected lines{" "}
        <span className={lineStatusStyles["line-color"]}>{lines.start}</span> to{" "}
        <span className={lineStatusStyles["line-color"]}>{lines.end}</span> in{" "}
        <span className={lineStatusStyles["file-border"]}>
          {" "}
          {file.fileName}
        </span>
      </div>
      <button
        onClick={(e) =>
          updateSlateSectionToBackend(
            backendId,
            undefined,
            undefined,
            null
          )
        }
        className={lineStatusStyles["clear-lines"]}
      >
        Clear Lines
      </button>
    </motion.div>
  );
}

function LinesPrompt() {
  return (
    <motion.div
      style={{
        position: "relative",
        // margin: "auto",
        // bottom: 0,
        // right: 0,
        // left: "30%",
      }}
      initial={{
        bottom: "-80px",
        opacity: 0,
      }}
      animate={{
        bottom: "0px",
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        bottom: "-80px",
      }}
      transition={{
        duration: 0.4,
      }}
      className={lineStatusStyles["status-content"]}
    >
      No lines selected | Highlight lines in the code editor.
    </motion.div>
  );
}
