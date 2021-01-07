import { useState } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";
import { Post } from "../typescript/types/app_types";

const myRequest = (requestedAPI: string) => {
  return {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      requestedAPI: requestedAPI,
    }),
  };
};

const postsFetcher = () =>
  fetch("api/endpoint", myRequest("getPosts")).then((res) => res.json());

export function usePosts(authenticated: boolean) {
  const [postsEditClicked, changeEditClicked] = useState(false);
  const initialPostsData: Post[] = [];
  let { data } = useSWR<Post[]>(
    authenticated ? "getPosts" : [null],
    postsFetcher,
    {
      initialData: initialPostsData,
      revalidateOnMount: true,
    }
  );

  const posts = data || [];

  // Deletes a published post.
  function deletePost(postUid: string) {
    function removeSpecificPost() {
      let searchIndex = 0;
      for (let i = 0; i < posts!.length; i++) {
        if (posts![i].postId === postUid) {
          searchIndex = i;
          break;
        }
      }
      let clonePosts = posts?.slice();
      clonePosts!.splice(searchIndex, 1);
      mutate("getPosts", clonePosts, false);
    }

    const requestBody = {
      requestedAPI: "deletePost",
      postUid: postUid,
    };

    const myRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(requestBody),
    };

    removeSpecificPost();

    fetch("/api/endpoint", myRequest).then(async (res: any) => {
      let updatedPosts = await res.json();
      mutate("getPosts", updatedPosts);
    });
  }

  function goToDraft(draftId: string) {
    Router.push("/drafts/[draftId]", "/drafts/" + draftId);
  }

  // Toggles the edit button for published posts
  async function togglePostsEdit() {
    changeEditClicked(!postsEditClicked);
  }

  return {
    posts,
    deletePost,
    postsEditClicked,
    togglePostsEdit,
    goToDraft,
  };
}

// Redirects to a published Post
export function goToPost(username: string, postId: string) {
  Router.push("/[username]/[postId]", "/" + username + "/" + postId);
}
