import {
  backendType,
  draftBackendRepresentation,
  Lines,
} from "../typescript/types/app_types";
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
import { backendDraftBlockEnum as draftBlockEnum } from "../typescript/enums/app_enums";

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
  const initialDraftContent: backendType[] = [];
  let timer: NodeJS.Timeout;
  const contentFetcher = prepareFetching(draftId);
  let { data: draftContent, mutate } = useSWR<backendType[]>(
    authenticated ? "getContent" : null,
    contentFetcher,
    {
      initialData: initialDraftContent,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  //   console.log(draftContent);
  async function updateSlateSectionToBackend(
    value: Node[],
    backendId: string,
    order: number,
    lines?: Lines
  ) {
    let data = {
      requestedAPI: "handleSaveDraftContent",
      slateContent: JSON.stringify(value),
      draftId: draftId,
      backendId: backendId,
      lines: lines,
      order: order,
    };

    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      //   let resJSON = await res.json();
    });
  }

  async function addBackendBlock(
    backendDraftBlockEnum: draftBlockEnum,
    atIndex: number
  ) {
    const backendId = shortId.generate();
    const data = {
      requestedAPI: "addDraftContent",
      draftId: draftId,
      atIndex: atIndex,
      backendDraftBlockEnum: backendDraftBlockEnum,
      backendId: backendId,
    };
    await mutate(async (mutateState) => {
      // let's update the todo with ID `1` to be completed,
      // this API returns the updated data
      let newItem: backendType;
      switch (backendDraftBlockEnum) {
        case draftBlockEnum.Text:
          newItem = {
            order: atIndex + 1,
            type: backendDraftBlockEnum,
            slateContent: JSON.stringify(slateNode),
            backendId: backendId,
          };
          break;
        case draftBlockEnum.CodeSteps:
          newItem = {
            order: atIndex + 1,
            type: backendDraftBlockEnum,
            slateContent: JSON.stringify(slateNode),
            fileId: undefined,
            lines: undefined,
            backendId: backendId,
          };
          break;
        default:
          newItem = {
            order: atIndex + 1,
            type: backendDraftBlockEnum,
            slateContent: JSON.stringify(slateNode),
            backendId: backendId,
          };
      }
      return insertItem(mutateState, newItem, atIndex + 1);
    }, false);

    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      //   let resJSON = await res.json();
    });
  }

  return {
    draftContent,
    updateSlateSectionToBackend,
    addBackendBlock,
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
