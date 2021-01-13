import React, { useState, Component, useContext, createContext } from "react";
const fetch = require("node-fetch");
import imageViewStyles from "../styles/imageview.module.scss";
import { File, Step, Lines } from "../typescript/types/app_types";
import { motion, AnimatePresence } from "framer-motion";
import { DraftContext } from "../contexts/draft-context";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { toBase64 } from "../lib/imageUtils";

type ImageViewProps = {};

type ImageViewState = {
  upload: boolean;
  uploadFailed: boolean;
  imageName: string;
};
let selectedImage: any;
export default function ImageView(props: ImageViewProps) {
  const { currentlyEditingBlock, updateSlateSectionToBackend } = useContext(
    DraftContext
  );
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
      <div className={imageViewStyles["img-view"]}>
        <button
          className={imageViewStyles["remove-button"]}
          onClick={(e) => handleImageDelete()}
        >
          X
        </button>
        {currentlyEditingBlock && (
          <img src={currentlyEditingBlock?.imageUrl}></img>
        )}
      </div>
    );
  };

  async function handleImageDelete() {
    const backendId = currentlyEditingBlock?.backendId;
    if (!backendId) {
      return;
    }
    setState({ ...state, upload: false });
    updateSlateSectionToBackend(
      backendId,
      undefined,
      undefined,
      undefined,
      null
    );
  }

  async function handleImageSubmit() {
    const backendId = currentlyEditingBlock?.backendId;
    if (!backendId) {
      return;
    }
    // 5 MB max on image uploads
    if (selectedImage.size > 5000000) {
      setState({ ...state, uploadFailed: true });
    } else {
      // optimistic mutate
      let optimisticUrl = URL.createObjectURL(selectedImage);
      updateSlateSectionToBackend(
        backendId,
        undefined,
        undefined,
        undefined,
        optimisticUrl
      );
      setState({ ...state, upload: false });

      let data = {
        requestedAPI: "saveImage",
        imageFile: await toBase64(selectedImage),
      };

      await fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(data),
      })
        .then(async (res: Response) => {
          let resJSON = await res.json();
          let newUrl = resJSON.url;
          updateSlateSectionToBackend(
            backendId,
            undefined,
            undefined,
            undefined,
            newUrl
          );
        })
        .catch((error: any) => {
          console.log(error);
          console.log("upload failed.");
        });
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

    let imageUrlPresent = currentlyEditingBlock?.imageUrl !== undefined;

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
        <label className={imageViewStyles["add-image"]}>
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

  // const show = currentlyEditingBlock?.imageUrl ? true : false;
  const show = currentlyEditingBlock?.type === ContentBlockType.CodeSteps;
  return (
    <div className={imageViewStyles["options-wrapper"]}>
      <AnimatePresence>
        {show && (
          <motion.div
            style={{
              // overflow: "hidden",
              paddingBottom: "8px",
            }}
            initial={{
              height: 0,
              opacity: 0,
            }}
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
    <div className={imageViewStyles["title-with-divider"]}>
      <label>Image Options</label>
      <div></div>
    </div>
  );
}
