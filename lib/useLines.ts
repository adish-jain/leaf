import { useState } from "react";
import { Lines } from "../typescript/types/app_types";

export function useLines() {
  // What lines are currently highlighted?
  const [currentlySelectedLines, changeSelectedLines] = useState<
    Lines | undefined
  >(undefined);

  return {
    currentlySelectedLines,
    changeSelectedLines,
  };
}
