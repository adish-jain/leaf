import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useContext, useEffect, useRef } from "react";
import { ContentContext } from "../../contexts/finishedpost/content-context";
import { ImageDimensionsContext } from "../../contexts/finishedpost/imagedimension-context";
import imageBlockStyles from "../../styles/finishedpost/image_block.module.scss";

export function ImageBlockPublished(props: {}) {
  const { postContent, selectedContentIndex } = useContext(ContentContext);
  const currentContent = postContent[selectedContentIndex];
  const dimensionsRef = useRef<HTMLImageElement>(null);
  const { updateImageDimensions } = useContext(ImageDimensionsContext);

  // useEffect(() => {
  //   const imageDimensions = dimensionsRef.current?.getBoundingClientRect();
  //   console.log("image dims are ");
  //   console.log(imageDimensions);
  //   if (imageDimensions) {
  //     updateImageDimensions(imageDimensions);
  //   }
  // }, [dimensionsRef]);

  const handleScroll = useCallback((event) => {
    // update scroll speed
    // updateScrollSpeed(scrollSpeed);
    // updateScrollPosition(window.scrollY);
    const imageDimensions = dimensionsRef.current?.getBoundingClientRect();

    if (imageDimensions) {
      // console.log("sending dimensions for step", index);
      updateImageDimensions(imageDimensions);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      className={imageBlockStyles["imageblock"]}
      // style={{ overflow: "hidden" }}
    >
      <AnimatePresence
      //  exitBeforeEnter
      >
        <motion.img
          key={currentContent.backendId}
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          className={imageBlockStyles["image-content"]}
          src={currentContent.imageUrl}
          // transition={{
          //   duration: 0.5,
          // }}
          ref={dimensionsRef}
          onLoad={() => {
            updateImageDimensions(
              dimensionsRef.current?.getBoundingClientRect()
            );
          }}
        />
      </AnimatePresence>
    </div>
  );
}
