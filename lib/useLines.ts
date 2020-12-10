import { useState } from "react";
import { Lines } from "../typescript/types/app_types";

export function useLines() {
  // What lines are currently highlighted?
  const [currentlySelectedLines, changeSelectedLines] = useState<
    Lines | undefined
  >(undefined);
  const [stepCoordinates, updateStepCoordinate] = useState<DOMRect | undefined>(
    undefined
  );

  const [selectionCoordinates, updateSelectionCoordinates] = useState<
    DOMRect | undefined
  >(undefined);

  return {
    currentlySelectedLines,
    changeSelectedLines,
    stepCoordinates,
    updateStepCoordinate,
    selectionCoordinates,
    updateSelectionCoordinates,
  };
}
