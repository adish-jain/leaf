import { timeStamp } from "../typescript/types/app_types";
import useSWR, { SWRConfig } from "swr";

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
    fetch("../api/endpoint", myRequest("getPostTags")).then((res: any) =>
      res.json()
    );
  return contentFetcher;
}

export function useTags(draftId: string, authenticated: boolean) {
  const initialTags: string[] = [];
  const contentFetcher = prepareFetching(draftId);
  let { data: tags, mutate } = useSWR<string[]>(
    authenticated ? "getTags" : null,
    contentFetcher,
    {
      initialData: initialTags,
      revalidateOnMount: true,
    }
  );

  function toggleTag(tag: string) {
    if (typeof tags === "undefined") {
      let data = {
        requestedAPI: "updateTags",
        draftId: draftId,
        tags: [tag],
      };

      let selectedTags: string[] = [tag];

      // optimistic mutate
      mutate(async (mutateState: any) => {
        return { ...mutateState, tags: selectedTags };
      }, false);

      fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }).then(async (res: any) => {
        let resJSON = await res.json();
      });
    } else {
      if (!tags.includes(tag) && tags.length >= 3) {
        console.log("Too many tags selected");
      } else {
        let selectedTags: string[];
        if (tags.includes(tag)) {
          selectedTags = tags.filter((element: string) => element != tag);
        } else {
          selectedTags = [...tags, tag];
        }
        // update tags in firebase
        let data = {
          requestedAPI: "updateTags",
          draftId: draftId,
          tags: selectedTags,
        };

        mutate(async (mutateState: any) => {
          return { ...mutateState, tags: selectedTags };
        }, false);

        fetch("/api/endpoint", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          body: JSON.stringify(data),
        }).then(async (res: any) => {
          let resJSON = await res.json();
        });
      }
    }
  }

  return {
    toggleTag,
    tags,
  };
}
