import { useState } from "react";
import { Lines } from "../typescript/types/app_types";

export function useLines() {
  // What lines are currently highlighted?
  const [currentlySelectedLines, changeSelectedLines] = useState<Lines>({
    start: 0,
    end: 0,
  });
  const [stepCoords, updateStepCoordinate] = useState<DOMRect | undefined>(
    undefined
  );

  const [selectionCoordinates, updateSelectionCoordinate] = useState<
    DOMRect | undefined
  >(undefined);

  return {
    currentlySelectedLines,
    changeSelectedLines,
    stepCoords,
    updateStepCoordinate,
    selectionCoordinates,
    updateSelectionCoordinate,
  };
}
