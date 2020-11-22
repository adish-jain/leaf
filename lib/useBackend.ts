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
import { backendDraftBlockEnum } from "../typescript/enums/app_enums";

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

  function triggerChange() {
    // api call here
    // const { value } = this.state;
    // this.props.onChange(value);
  }

  async function updateSlateSectionToBackend(
    value: Node[],
    backendId: string,
    order: number,
    lines?: Lines,
    callback: any
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
    //   callback("Not Saved");
    });
  }

  return {
    draftContent,
    updateSlateSectionToBackend,
  };
}
