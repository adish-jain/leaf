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
      <MarkButton name={"default"} markType={slateMarkTypes.unstyled} />
      <MarkButton name={"bold"} markType={slateMarkTypes.bold} />
      <MarkButton name={"italics"} markType={slateMarkTypes.italic} />
      <MarkButton name={"code"} markType={slateMarkTypes.code} />
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
    style["color"] = "blue";
  }
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        toggleMark();
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
