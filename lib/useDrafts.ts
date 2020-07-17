import { useState } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";

type DraftType = {
  id: string;
  title: string;
  edit?: boolean;
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
  const [draftsEditClicked, changeEditClicked] = useState(false);
  const initialDraftsData: DraftType[] = [];
  let { data: drafts } = useSWR<DraftType[]>(
    authenticated ? "getDrafts" : null,
    draftsFetcher,
    {
      initialData: initialDraftsData,
      revalidateOnMount: true,
    }
  );

  function findDraftIndex(draftId: string) {
    let searchIndex = 0;
    for (let i = 0; i < drafts!.length; i++) {
      if (drafts![i].id === draftId) {
        searchIndex = i;
        return searchIndex;
      }
    }
  }

  // Deletes a draft
  async function deleteDraft(draft_id: string) {
    // helper function to remove a draft before API call finishes
    function removeSpecificDraft() {
      let searchIndex = findDraftIndex(draft_id) as number;
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

  // Redirects to a draft
  function openDraft(draft_id: string) {
    Router.push("/drafts/" + draft_id);
  }

  // Creates a new draft
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

  // Toggles the edit button for drafts
  async function toggleDraftsEdit() {
    changeEditClicked(!draftsEditClicked);
  }

  return {
    drafts,
    deleteDraft,
    openDraft,
    createNewDraft,
    draftsEditClicked,
    toggleDraftsEdit,
  };
}
