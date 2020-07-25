import { useState } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";

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

  /*
  Saves the title of the draft in Firestore. 
  Triggered from `Publishing.tsx`.
  */
  function saveTitle(title: string) {
    var data = {
      requestedAPI: "save_title",
      draftId: draftId,
      title: title,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      console.log(res);
    });
  }

  return {
    saveTitle,
    draftTitle,
  };
}
