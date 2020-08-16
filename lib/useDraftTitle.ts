import { useState } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";

const WAIT_INTERVAL = 1000;

/* 
TIMER BEHAVIOR:
Timer makes sure that API requests to save the title are only called 1s after 
the user stops typing. 
*/
let timer: ReturnType<typeof setTimeout>;

export function useDraftTitle(draftId: string, authenticated: boolean) {
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

  const titleFetcher = () =>
    fetch("../api/endpoint", myRequest("getDraftTitle")).then((res: any) =>
      res.json()
    );

  let { data: draftTitleData } = useSWR<{ draftTitle: string }>(
    authenticated ? "getDraftTitle" : null,
    titleFetcher,
    {
      initialData: { draftTitle: "" },
      revalidateOnMount: true,
    }
  );

  let draftTitle = draftTitleData!.draftTitle;

  async function onTitleChange(updatedtitle: string) {
    clearTimeout(timer!);
    let newTitle: string;
    try {
      let newTitleInfo = await mutate(
        "getDraftTitle",
        { draftTitle: updatedtitle },
        false
      );
      newTitle = newTitleInfo.draftTitle;
    } catch (error) {
      // Handle an error while updating the user here
    }

    timer = setTimeout(() => saveTitle(newTitle), WAIT_INTERVAL);
  }
  /*
  Saves the title of the draft in Firestore. 
  Triggered from `Publishing.tsx`.
  */
  function saveTitle(newTitle: string) {
    // mutate("getDraftTitle", { draftTitle: newTitle }, false);
    var data = {
      requestedAPI: "save_title",
      draftId: draftId,
      title: newTitle,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let resJSON = await res.json();
      // mutate("getDraftTitle", { draftTitle: resJSON.draftTitle }, false);
    });
  }

  return {
    saveTitle,
    draftTitle,
    onTitleChange,
  };
}
