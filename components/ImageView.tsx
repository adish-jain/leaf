import React, { useState, Component, useContext, createContext } from "react";
const fetch = require("node-fetch");
import "../styles/imageview.scss";
let selectedImage: any;
import { File, Step, Lines } from "../typescript/types/app_types";
import { motion, AnimatePresence } from "framer-motion";
import { DraftContext } from "../contexts/draft-context";

type ImageViewProps = {};

type ImageViewState = {
  upload: boolean;
  uploadFailed: boolean;
  imageName: string;
};

export default function ImageView(props: ImageViewProps) {
  const { currentlyEditingBlock } = useContext(DraftContext);
  const [state, setState] = useState({
    upload: false,
    uploadFailed: false,
    imageName: "",
  });

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    selectedImage = e.target.files![0];
    setState({
      upload: true,
      uploadFailed: false,
      imageName: selectedImage.name,
    });
  }

  function handleImageSelect() {
    setState({ ...state, upload: false, imageName: "", uploadFailed: false });
  }

  const ImageScreen = () => {
    return (
      <div className={"img-view"}>
        <button
          className={"remove-button"}
          onClick={(e) => handleImageDelete()}
        >
          X
        </button>
        <img src={currentlyEditingStep.imageURL}></img>
      </div>
    );
  };

  async function handleImageDelete() {
    deleteStepImage();
    setState({ ...state, upload: false });
  }

  async function handleImageSubmit() {
    // 5 MB max on image uploads
    if (selectedImage.size > 5000000) {
      setState({ ...state, uploadFailed: true });
    } else {
      // optimistic mutate
      let url = URL.createObjectURL(selectedImage);
      setState({ ...state, upload: false });
      await addStepImage(selectedImage, currentlyEditingStep.stepId);
      // this.setState({ upload: false });
    }
  }

  const SelectScreen = () => {
    return (
      <div className={"preview"}>
        <div className={"submit"}>
          <p>Selected {state.imageName}</p>
          <div className={"submitButtons"}>
            <button onClick={(e) => handleImageSelect()}>Go Back</button>
            <button onClick={(e) => handleImageSubmit()}>Submit</button>
          </div>
          {state.uploadFailed ? (
            <div>
              <br></br>Image size is too big! Select an image size up to 5mb.
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  };

  const ChooseScreen = () => {
    let { upload } = state;

    let imageUrlPresent = currentlyEditingStep?.imageUrl !== undefined;

    if (!upload) {
      // Image is in display or the upload option is available
      if (imageUrlPresent) {
        // Image is in display
        return <ImageScreen />;
      } else {
        // Upload screen is in display
        return <UploadScreen />;
      }
    }
    // Image has been selected, and "Go Back" & "Submit" options are available
    // If selected file size was too big, error is displayed
    return <SelectScreen />;
  };

  const UploadScreen = () => {
    return (
      <div>
        <label className={"add-image"}>
          + Add Image
          <input
            type="file"
            id="myFile"
            name="filename"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>
    );
  };

  const show = currentlyEditingBlock?.imageUrl ? true : false;

  return (
    <div className={"options-wrapper"}>
      <AnimatePresence>
        {show && (
          <motion.div
            style={{
              // overflow: "hidden",
              paddingBottom: "8px",
            }}
            initial={
              {
                height: 0,
                opacity: 0,
              } as any
            }
            animate={{ isOpen: show, height: "auto", opacity: 1 } as any}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <TitleAndDivider />
            <ChooseScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TitleAndDivider() {
  return (
    <div className={"title-with-divider"}>
      <label>Image Options</label>
      <div></div>
    </div>
  );
}
