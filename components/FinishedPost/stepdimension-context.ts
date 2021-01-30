import { createContext } from "react";

export const StepDimensionContext = createContext(<StepDimensionContextType>{});

type StepDimensionContextType = {
  stepDimensions: DOMRect | undefined;
  updateStepDimensions: (updatedStepDimension: DOMRect | undefined) => void;
};
