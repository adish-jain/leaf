import { useState } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";
import { Post } from "../typescript/types/app_types";
import {
  CodeSection,
  contentBlock,
  contentSection,
  ImageSection,
  TextSection as TextSectionType,
} from "../typescript/types/frontend/postTypes";
import { FrontendSectionType } from "../typescript/enums/frontend/postEnums";
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

  // Toggles the edit button for published posts
  async function togglePostsEdit() {
    changeEditClicked(!postsEditClicked);
  }

  return {
    posts,
    deletePost,
    postsEditClicked,
    togglePostsEdit,
  };
}

// Redirects to a published Post
export function goToPost(
  username: string,
  postId: string,
  onCustomDomain: boolean,
  userHost: string
) {
  if (onCustomDomain) {
    Router.push("/" + postId);
  } else {
    if (userHost !== "") {
      Router.replace(`https://${userHost}/${postId}`);
    } else {
      Router.push("/[username]/[postId]", "/" + username + "/" + postId);
    }
  }
}

export function goToDraft(draftId: string) {
  Router.push("/drafts/[draftId]", "/drafts/" + draftId);
}

export function goToPostFromExplore(post: Post) {
  const { customDomain, postId, username } = post;
  if (post.customDomain) {
    window.location.href = `https://${customDomain}/${postId}`;
  } else {
    Router.push("/[username]/[postId]", "/" + username + "/" + postId);
  }
}

export function arrangeContentList(
  draftContent: contentBlock[]
): contentSection[] {
  // iterate through array

  // if code step type
  // add to sub array

  // if not code step type, break sub array
  let finalArray: contentSection[] = [];
  let subArray: contentBlock[] = [];
  let runningSum = 0;
  for (let i = 0; i < draftContent.length; i++) {
    if (
      draftContent[i].type === "codestep" ||
      draftContent[i].type === "image"
    ) {
      // aggregate codesteps into subArray
      subArray.push(draftContent[i]);
      // runningSum += 1;
    } else {
      if (subArray.length > 0) {
        let subArrayType = subArray[0].type;
        let finalArrayType = FrontendSectionType.CodeSection;
        if (subArrayType === "codestep") {
          finalArrayType = FrontendSectionType.CodeSection;
        }
        if (subArrayType === "image") {
          finalArrayType = FrontendSectionType.ImageSection;
        }
        finalArray.push({
          type: finalArrayType,
          contentBlocks: subArray,
          startIndex: runningSum,
        });
        runningSum += subArray.length;
      }
      subArray = [];
      finalArray.push({
        type: FrontendSectionType.TextSection,
        slateSection: draftContent[i],
        startIndex: runningSum,
      });
      runningSum += 1;
    }
  }
  if (subArray.length > 0) {
    let subArrayType = subArray[0].type;
    let finalArrayType = FrontendSectionType.CodeSection;
    if (subArrayType === "codestep") {
      finalArrayType = FrontendSectionType.CodeSection;
    }
    if (subArrayType === "image") {
      finalArrayType = FrontendSectionType.ImageSection;
    }
    finalArray.push({
      type: finalArrayType,
      contentBlocks: subArray,
      startIndex: runningSum,
    });
  }
  return finalArray;
}
