import { useState } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";

type DraftType = {
  id: string;
  title: string;
  createdAt: {
    _nanoseconds: number;
    _seconds: number;
  };
};

const myRequest = (requestedAPI: string) => {
  return {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      requestedAPI: requestedAPI,
    }),
  };
};

const draftsFetcher = () =>
  fetch("api/endpoint", myRequest("getDrafts")).then((res: any) => res.json());

export function useDrafts(authenticated: boolean) {
  const initialDraftsData: DraftType[] = [];
  let { data: drafts } = useSWR<DraftType[]>(
    authenticated ? "getDrafts" : null,
    draftsFetcher,
    {
      initialData: initialDraftsData,
      revalidateOnMount: true,
    }
  );

  async function deleteDraft(
    event: React.MouseEvent<HTMLButtonElement>,
    draft_id: string
  ) {
    // helper function to remove a draft before API call finishes
    function removeSpecificDraft() {
      let searchIndex = 0;
      for (let i = 0; i < drafts!.length; i++) {
        if (drafts![i].id === draft_id) {
          searchIndex = i;
          break;
        }
      }
      let cloneDrafts = drafts?.slice();
      cloneDrafts!.splice(searchIndex, 1);
      mutate("getDrafts", cloneDrafts, false);
    }

    const requestBody = {
      requestedAPI: "delete_draft",
      draft_id: draft_id,
    };

    const myRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(requestBody),
    };

    removeSpecificDraft();

    fetch("api/endpoint", myRequest).then(async (res: any) => {
      let updatedDrafts = await res.json();
      mutate("getDrafts", updatedDrafts);
    });
  }

  function openDraft(draft_id: string) {
    Router.push("/drafts/" + draft_id);
  }

  async function createNewDraft() {
    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "add_draft",
      }),
    }).then(async (res: any) => {
      let updatedDrafts = await res.json();
      mutate("getDrafts", updatedDrafts, false);
      let new_draft_id = updatedDrafts[0].id;
      openDraft(new_draft_id);
    });
  }

  return {
    drafts, deleteDraft, openDraft, createNewDraft
  };
}
