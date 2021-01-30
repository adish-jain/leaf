import { createContext } from "react";

export const ImageDimensionsContext = createContext(
  <ImageDimensionsContextTyoe>{}
);

type ImageDimensionsContextTyoe = {
  imageDimensions: DOMRect | undefined;
  updateImageDimensions: (updatedImageDimensions: DOMRect | undefined) => void;
};
