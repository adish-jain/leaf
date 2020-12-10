import { useContext } from "react";
import { ToolbarContext } from "../contexts/toolbar-context";
import { toggleMark } from "../lib/useToolbar";
import formattingToolbarStyles from "../styles/formattingtoolbar.module.scss";
import { saveStatusEnum, slateMarkTypes } from "../typescript/enums/app_enums";

export function FormattingToolbar(props: {}) {
  const toolbarContext = useContext(ToolbarContext);
  const { saveState, currentMarkType } = toolbarContext;
  return (
    <div className={formattingToolbarStyles["formatting-toolbar"]}>
      <div className={formattingToolbarStyles["buttons"]}>
        {/* <MarkButton name={"T"} markType={slateMarkTypes.unstyled} /> */}
        <MarkButton name={"B"} markType={slateMarkTypes.bold} />
        <MarkButton name={"I"} markType={slateMarkTypes.italic} />
        <MarkButton name={"<>"} markType={slateMarkTypes.code} />
      </div>
      <SaveStatus saveState={saveState} />
    </div>
  );
}

function MarkButton(props: { name: string; markType: slateMarkTypes }) {
  const toolbarContext = useContext(ToolbarContext);
  const { currentMarkType } = toolbarContext;
  const selected = currentMarkType[props.markType as string];
  let style = {};
  if (selected) {
    //@ts-ignore
    style["color"] = "blue";
  }
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        // toggleMark();
      }}
      className={formattingToolbarStyles["mark-button"]}
      style={style}
    >
      {props.name}
    </div>
  );
}

function SaveStatus(props: { saveState: saveStatusEnum }) {
  const toolbarContext = useContext(ToolbarContext);
  const { saveState } = toolbarContext;
  return (
    <div className={formattingToolbarStyles["save-state"]}> {saveState}</div>
  );
}
