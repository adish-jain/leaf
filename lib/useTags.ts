export function useTags(
  tags: string[],
  draftId: string,
  draftFiles: any,
  errored: boolean,
  draftPublished: boolean,
  postId: string,
  username: string,
  mutate: any
) {
  function toggleTag(tag: string) {
    if (typeof tags === "undefined") {
      let data = {
        requestedAPI: "updateTags",
        draftId: draftId,
        tags: [tag],
      };

      let selectedTags: string[] = [tag];

      // optimistic mutate
      mutate(
        {
          files: draftFiles,
          errored: errored,
          published: draftPublished,
          postId: postId,
          tags: selectedTags,
          username: username,
        },
        false
      );

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

        // optimistic mutate
        mutate(
          {
            files: draftFiles,
            errored: errored,
            published: draftPublished,
            postId: postId,
            tags: selectedTags,
            username: username,
          },
          false
        );

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
  };
}
