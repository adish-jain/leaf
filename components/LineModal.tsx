import { useContext } from "react";
import { LinesContext } from "../contexts/lines-context";
import lineStyles from "../styles/linemodal.module.scss";

export function LineModal(props: any) {
  const { currentlySelectedLines } = useContext(LinesContext);
  return <div className={lineStyles["linemodal"]}></div>;
}

// need current step coordinates, up to date on scroll
// need currently selected lines
