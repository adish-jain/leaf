import { useContext, useState } from "react";
import { DraftContext } from "../contexts/draft-context";
import imageEditorStyles from "../styles/imageeditor.module.scss";
import imageViewStyles from "../styles/imageview.module.scss";
import { contentBlock } from "../typescript/types/frontend/postTypes";
import { toBase64 } from "../lib/imageUtils";

export function ImageEditor() {
  const [imageUrl, updateImageUrl] = useState(undefined);
  const {
    useBackendMutate,
    currentlyEditingBlock,
    currentlyEditingBlockIndex,
    updateSlateSectionToBackend,
  } = useContext(DraftContext);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!currentlyEditingBlock || currentlyEditingBlockIndex < 0) {
      return;
    }
    let selectedImage = e.target.files![0];

    if (selectedImage.size > 5000000) {
      return;
    }
    let optimisticUrl = URL.createObjectURL(selectedImage);
    const {
      backendId,
      slateContent,
      type,
      fileId,
      lines,
    } = currentlyEditingBlock;
    const modifiedItem: contentBlock = {
      backendId,
      slateContent,
      type,
      fileId,
      lines,
      imageUrl: optimisticUrl,
    };
    useBackendMutate(async (mutateState) => {
      return [
        ...mutateState!.slice(0, currentlyEditingBlockIndex),
        modifiedItem,
        ...mutateState!.slice(currentlyEditingBlockIndex + 1),
      ];
    }, false);

    let data = {
      requestedAPI: "saveImage",
      imageFile: await toBase64(selectedImage),
    };

    fetch("/api/endpoint", {
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

  return (
    <div className={imageEditorStyles["imageeditor"]}>
      {currentlyEditingBlock?.imageUrl ? (
        <ShowImage />
      ) : (
        <UploadImage handleImageUpload={handleImageUpload} />
      )}
    </div>
  );
}

function ShowImage() {
  const { currentlyEditingBlock, updateSlateSectionToBackend } = useContext(
    DraftContext
  );

  return (
    <div className={imageViewStyles["image-wrapper"]}>
      <button
        onClick={(e) => {
          if (!currentlyEditingBlock) {
            return;
          }
          updateSlateSectionToBackend(
            currentlyEditingBlock?.backendId,
            undefined,
            undefined,
            undefined,
            null,
            undefined
          );
        }}
      >
        Remove Image
      </button>
      <img
        className={imageViewStyles["uploaded-image"]}
        src={currentlyEditingBlock?.imageUrl}
      />
    </div>
  );
}

function UploadImage(props: {
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { handleImageUpload } = props;
  return (
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
  );
}
