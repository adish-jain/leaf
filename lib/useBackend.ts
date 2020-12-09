import { Lines } from "../typescript/types/app_types";
import { ContentBlockType } from "../typescript/enums/backend/postEnums";
import { contentBlock } from "../typescript/types/frontend/postTypes";

import {
  Node,
  Text,
  createEditor,
  Editor,
  Element,
  Transforms,
  Path,
  Range,
  NodeEntry,
  Operation,
  Point,
} from "slate";
const shortId = require("shortid");
import useSWR, { SWRConfig } from "swr";
import { useState, useEffect } from "react";

function prepareFetching(draftId: string) {
  const myRequest = (requestedAPI: string) => {
    return {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: requestedAPI,
        draftId,
      }),
    };
  };

  const contentFetcher = () =>
    fetch("../api/endpoint", myRequest("getDraftContent")).then((res: any) =>
      res.json()
    );
  return contentFetcher;
}
export function useBackend(authenticated: boolean, draftId: string) {
  const initialDraftContent: contentBlock[] = [];
  let timer: NodeJS.Timeout;
  const contentFetcher = prepareFetching(draftId);
  let { data, mutate } = useSWR<contentBlock[]>(
    authenticated ? "getContent" : null,
    contentFetcher,
    {
      initialData: initialDraftContent,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  const draftContent = data || initialDraftContent;
  const [currentlyEditingBlockIndex, changeEditingBlockIndex] = useState(-1);
  let currentlyEditingBlock: contentBlock | undefined;
  // if out of bounds
  if (
    currentlyEditingBlockIndex < 0 ||
    currentlyEditingBlockIndex > draftContent.length - 1
  ) {
    currentlyEditingBlock = undefined;
  } else {
    currentlyEditingBlock = draftContent[currentlyEditingBlockIndex];
  }
  //   console.log(draftContent);
  async function updateSlateSectionToBackend(
    backendId: string,
    order?: number,
    value?: Node[],
    lines?: Lines | null,
    imageUrl?: string | null,
    fileId?: string | null
  ) {
    let data = {
      requestedAPI: "handleSaveDraftContent",
      slateContent: JSON.stringify(value),
      draftId: draftId,
      backendId: backendId,
      lines: lines,
      order: order,
      fileId: fileId,
      imageUrl: imageUrl,
    };

    const atIndex = findBlockById(backendId);
    const currentBlock = draftContent[atIndex];

    const modifiedItem: contentBlock = {
      backendId: backendId,
      slateContent: value ? JSON.stringify(value) : currentBlock.slateContent,
      type: draftContent[atIndex].type,
      fileId: fileId ? fileId : currentBlock.fileId,
      lines: lines ? lines : currentBlock.lines,
      imageUrl: imageUrl ? imageUrl : currentBlock.imageUrl,
    };
    if (lines === null) {
      modifiedItem.lines = undefined;
    }
    if (imageUrl === null) {
      modifiedItem.imageUrl = undefined;
    }
    if (fileId === null) {
      modifiedItem.fileId = undefined;
    }

    mutate(async (mutateState) => {
      return [
        ...mutateState.slice(0, atIndex),
        modifiedItem,
        ...mutateState.slice(atIndex + 1),
      ];
    }, false);

    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      //   let resJSON = await res.json();
    });
  }

  async function addBackendBlock(
    backendDraftBlockEnum: ContentBlockType,
    atIndex: number
  ) {
    const backendId = shortId.generate();
    await mutate(async (mutateState) => {
      // let's update the todo with ID `1` to be completed,
      // this API returns the updated data
      let newItem: contentBlock;
      switch (backendDraftBlockEnum) {
        case ContentBlockType.Text:
          newItem = {
            type: backendDraftBlockEnum,
            slateContent: JSON.stringify(slateNode),
            backendId: backendId,
          };
          break;
        case ContentBlockType.CodeSteps:
          newItem = {
            type: backendDraftBlockEnum,
            slateContent: JSON.stringify(slateNode),
            fileId: undefined,
            lines: undefined,
            backendId: backendId,
          };
          break;
        default:
          newItem = {
            type: backendDraftBlockEnum,
            slateContent: JSON.stringify(slateNode),
            backendId: backendId,
          };
      }
      return insertItem(mutateState, newItem, atIndex + 1);
    }, false);
    const data = {
      requestedAPI: "addDraftContent",
      draftId: draftId,
      atIndex: atIndex,
      backendDraftBlockEnum: backendDraftBlockEnum,
      backendId: backendId,
    };
    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      //   let resJSON = await res.json();
    });
  }

  async function addCodeStepImage(selectedImage: any, stepId: string) {
    let data = {
      requestedAPI: "saveImage",
      draftId: draftId,
      stepId: stepId,
      imageFile: await toBase64(selectedImage),
    };

    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    })
      .then(async (res: any) => {
        let resJSON = await res.json();
        let url = resJSON.url;
        console.log("new url is ", url);
        let optimisticSteps = storedSteps!.slice();
        optimisticSteps[editingStep].imageURL = url;
        console.log("updated image");
        mutate(optimisticSteps, false);

        await mutate(async (mutateState) => {
          // let's update the todo with ID `1` to be completed,
          // this API returns the updated data
          let newItem: contentBlock;

          return insertItem(mutateState, newItem, atIndex + 1);
        }, false);
      })
      .catch((error: any) => {
        console.log(error);
        console.log("upload failed.");
      });
  }

  function changeEditingBlock(backendId: string) {
    const newIndex = findBlockById(backendId);
    changeEditingBlockIndex(newIndex);
  }

  function findBlockById(backendId: string) {
    let newIndex = 0;
    for (let i = 0; i < draftContent.length; i++) {
      if (draftContent[i].backendId === backendId) {
        newIndex = i;
        break;
      }
    }
    return newIndex;
  }

  function deleteBlock(backendId: string) {
    let toDeleteIndex = 0;
    for (let i = 0; i < draftContent.length; i++) {
      if (draftContent[i].backendId === backendId) {
        toDeleteIndex = i;
        break;
      }
    }
    const data = {
      requestedAPI: "deleteDraftContent",
      draftId: draftId,
      atIndex: toDeleteIndex,
      backendId: backendId,
    };
    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      //   let resJSON = await res.json();
    });

    mutate(async (mutateState) => {
      return [
        ...mutateState.slice(0, toDeleteIndex),
        ...mutateState.slice(toDeleteIndex + 1),
      ];
    }, false);
  }

  function nextBlockType(backendId: string): ContentBlockType | undefined {
    const currentBlockIndex = findBlockById(backendId);
    if (currentBlockIndex + 1 > draftContent.length - 1) {
      return undefined;
    } else {
      return draftContent[currentBlockIndex + 1].type;
    }
  }

  /**
   * Removes fileId and lines from all codesteps associated with a file being deleted
   *
   * @param fileId the file being deleted
   */
  function removeFileFromCodeSteps(fileId: string) {
    for (let i = 0; i < draftContent.length; i++) {
      if (draftContent[i].fileId === fileId) {
        updateSlateSectionToBackend(
          draftContent[i].backendId,
          undefined,
          undefined,
          null,
          undefined,
          null
        );
      }
    }
  }

  return {
    draftContent,
    updateSlateSectionToBackend,
    addBackendBlock,
    currentlyEditingBlock,
    changeEditingBlock,
    deleteBlock,
    nextBlockType,
    removeFileFromCodeSteps,
  };
}

const slateNode: Node[] = [
  {
    type: "default",
    children: [
      {
        text: "Start editing here",
      },
    ],
  },
];

function insertItem(array: any[], newItem: any, insertIndex: number) {
  console.log("inserting at a ", insertIndex);
  return [...array.slice(0, insertIndex), newItem, ...array.slice(insertIndex)];
}

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
