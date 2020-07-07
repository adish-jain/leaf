import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
const landingStyles = require("../styles/Landing.module.scss");

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

type DraftType = {
  id: string;
  title: string;
  createdAt: {
    _nanoseconds: number;
    _seconds: number;
  };
};

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

const draftsFetcher = () =>
  fetch("api/endpoint", myRequest("getDrafts")).then((res: any) => res.json());

export default function Landing() {
  // authenticate
  const { authenticated, error, loading } = useLoggedIn();

  // Fetch data for drafts
  const initialDraftsData: DraftType[] = [];
  let { data: drafts } = useSWR<DraftType[]>(
    authenticated ? "getDrafts" : null,
    draftsFetcher,
    {
      initialData: initialDraftsData,
      revalidateOnMount: true,
    }
  );

  // Fetch data for posts
  const initialPostsData: PostsType[] = [];
  let { data: posts } = useSWR<PostsType[]>(
    authenticated ? "getPosts" : null,
    postsFetcher,
    {
      initialData: initialPostsData,
      revalidateOnMount: true,
    }
  );

  async function createNewPost() {
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

  function goToPost(username: string, postId: string) {
    Router.push("/[username]/[postId]", "/" + username + "/" + postId);
  }

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

  function openDraft(draft_id: string) {
    Router.push("/drafts/" + draft_id);
  }

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

  return (
    <div className="container">
      <Head>
        <title>Leaf</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (document.cookie) {
            if (!document.cookie.includes('authed')) {
              window.location.href = "/"
            }
          }
          else {
            window.location.href = '/'
          }
        `,
          }}
        />
      </Head>
      <main>
        <LandingHeader />
        <div className={landingStyles.landing}>
          <YourDrafts
            deleteDraft={deleteDraft}
            openDraft={openDraft}
            drafts={drafts}
            createNewPost={createNewPost}
          />
          <YourPosts
            deletePost={deletePost}
            posts={posts}
            goToPost={goToPost}
          />
        </div>
      </main>
    </div>
  );
}

function YourPosts(props: {
  posts: PostsType[] | undefined;
  goToPost: (username: string, postId: string) => void;
  deletePost: (postUid: string) => void;
}) {
  let { posts, goToPost, deletePost } = props;

  let content;
  if (posts === undefined || posts === []) {
    content = <NonePublished />;
  } else {
    content = (
      <div>
        {posts.map((post: any) => (
          <Post
            username={post.username}
            title={post.title}
            postId={post.postId}
            goToPost={goToPost}
            postUid={post.id}
            deletePost={deletePost}
            key={post.uid}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={landingStyles.right}>
      <h1>Your Published Posts</h1>
      <hr />
      {content}
    </div>
  );
}

function Post(props: {
  title: string;
  postId: string;
  username: string;
  postUid: string;
  deletePost: (postUid: string) => void;
  goToPost: (username: string, postId: string) => void;
}) {
  let { username, postId, deletePost, postUid } = props;
  return (
    <div className={landingStyles["draft"]}>
      <p>{props.title}</p>
      <button onClick={() => deletePost(postUid)}>Delete Post</button>
      <button onClick={(e) => props.goToPost(username, postId)}>
        Open Post
      </button>
    </div>
  );
}

function YourDrafts(props: {
  drafts: DraftType[] | undefined;
  createNewPost: () => void;
  deleteDraft: (
    e: React.MouseEvent<HTMLButtonElement>,
    draft_id: string
  ) => void;
  openDraft: (id: string) => void;
}) {
  function renderDrafts() {
    let { drafts } = props;
    if (drafts === undefined) {
      return (
        <div>
          <p>You have no drafts.</p>
          <button
            className={landingStyles["create-button"]}
            onClick={createNewPost}
          >
            Create New Draft
          </button>
        </div>
      );
    }
    return drafts.map((draft: any) => (
      <Draft
        deleteDraft={deleteDraft}
        key={draft.id}
        title={draft.title}
        id={draft.id}
        openDraft={openDraft}
      />
    ));
  }

  let { drafts, deleteDraft, openDraft, createNewPost } = props;
  return (
    <div className={landingStyles.left}>
      <YourDraftsHeader createNewPost={createNewPost} drafts={drafts} />
      {renderDrafts()}
    </div>
  );
}

function YourDraftsHeader(props: {
  createNewPost: () => void;
  drafts: DraftType[] | undefined;
}) {
  let { createNewPost, drafts } = props;
  return (
    <div>
      <div className={landingStyles["left-header"]}>
        <h1>Your Drafts</h1>
        <div
          onClick={createNewPost}
          className={landingStyles["create-button-plus"]}
        >
          +
        </div>
      </div>
      {drafts ? <div></div> : <div></div>}
      <hr />
    </div>
  );
}

type DraftProps = {
  title: string;
  id: string;
  key: string;
  deleteDraft: (
    e: React.MouseEvent<HTMLButtonElement>,
    draft_id: string
  ) => void;
  openDraft: (id: string) => void;
};

function Draft(props: DraftProps) {
  return (
    <div className={landingStyles["draft"]}>
      <p>{props.title}</p>
      {props.id}
      <button onClick={(e) => props.deleteDraft(e, props.id)}>
        Delete Draft
      </button>
      <button onClick={(e) => props.openDraft(props.id)}>Open Draft</button>
    </div>
  );
}

function LandingHeader() {
  return (
    <div className={landingStyles.header}>
      <div className={landingStyles.settings}></div>
      <div className={landingStyles.settings}>
        <button onClick={logOut}></button>
      </div>
    </div>
  );
}

function NonePublished() {
  return (
    <div>
      <p>You have no published posts. Create a draft to get started.</p>
    </div>
  );
}
