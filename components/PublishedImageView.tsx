import React, { Component, useContext } from "react";
import imageViewStyles from "../styles/imageview.module.scss";
import { File, Step } from "../typescript/types/app_types";
import { motion, AnimatePresence } from "framer-motion";
import { SPEED_SCROLL_LIMIT } from "../components/FinishedPost";
import { ContentContext } from "../contexts/finishedpost/content-context";

type PublishedImageViewProps = {
  scrollSpeed: number;
  animateLines: () => void;
};

export default function PublishedImageView(props: PublishedImageViewProps) {
  const { postContent, selectedContentIndex } = useContext(ContentContext);
  const { scrollSpeed } = props;
  const currentContent = postContent[selectedContentIndex];
  const speed = Math.abs(scrollSpeed);

  function onComplete() {
    props.animateLines();
  }

  return (
    <div>
      <AnimatePresence>
        {currentContent?.imageUrl && (
          <motion.div
            initial={{
              // opacity: 0,
              // maxHeight: "0px",
              height: "0px",
              // transform: "scaleY(0)"
            }}
            style={{
              // height: "0px",
              overflow: "hidden",
              // maxHeight: "600px",
            }}
            animate={{
              // opacity: 1,
              // transform: "scaleY(1)"
              // maxHeight: "600px",
              height: "250px",
            }}
            exit={{
              // opacity: 0,
              // transform: "scaleY(0)"
              // maxHeight: "0px",
              height: "0px",
            }}
            transition={{
              duration: speed < SPEED_SCROLL_LIMIT ? 0.4 : 0,
            }}
            onAnimationComplete={onComplete}
          >
            <div className={imageViewStyles["published-img"]}>
              <img src={currentContent?.imageUrl} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
