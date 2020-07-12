import { useState } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";

type PostsType = {
  // url id
  postId: string;
  title: string;
  // user id
  uid: string;
  // unique id
  id: string;
  username: string;
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

const postsFetcher = () =>
  fetch("api/endpoint", myRequest("getPosts")).then((res: any) => res.json());

export function usePosts(authenticated: boolean) {
  const initialPostsData: PostsType[] = [];
  let { data: posts } = useSWR<PostsType[]>(
    authenticated ? "getPosts" : null,
    postsFetcher,
    {
      initialData: initialPostsData,
      revalidateOnMount: true,
    }
  );

  function deletePost(postUid: string) {
    function removeSpecificPost() {
      let searchIndex = 0;
      for (let i = 0; i < posts!.length; i++) {
        if (posts![i].uid === postUid) {
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

    fetch("api/endpoint", myRequest).then(async (res: any) => {
      let updatedPosts = await res.json();
      mutate("getPosts", updatedPosts);
    });
  }

  function goToPost(username: string, postId: string) {
    Router.push("/[username]/[postId]", "/" + username + "/" + postId);
  }

  return {
    posts,
    deletePost,
    goToPost
  };
}
