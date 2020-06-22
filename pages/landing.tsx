import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import fetch from "isomorphic-fetch";
const landingStyles = require("../styles/Landing.module.scss");

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

const rawData = {
  requestedAPI: "get_drafts",
};

const myRequest = {
  method: "POST",
  headers: new Headers({ "Content-Type": "application/json" }),
  body: JSON.stringify(rawData),
};
const fetcher = (url: string) =>
  fetch(url, myRequest).then((res) => res.json());

export default function Landing() {
  const initialData: any = [];
  const { authenticated, error, loading } = useLoggedIn("/", true);
  let { data: drafts } = useSWR(
    authenticated ? "/api/endpoint" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  async function createNewPost() {
    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "add_draft",
      }),
    }).then(async (res) => {
      console.log(res);
      let resJSON = await res.json();
      console.log(resJSON);
      drafts = resJSON;
    });
    mutate("/api/user", { data: drafts });
  }

  async function deleteDraft(
    event: React.MouseEvent<HTMLButtonElement>,
    draft_id: string
  ) {
    const requestBody = {
      requestedAPI: "delete_draft",
      draft_id: draft_id,
    };

    const myRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(requestBody),
    };

    fetch("api/endpoint", myRequest).then(async (res) => {
      let resJSON = await res.json();
      console.log(resJSON);
      drafts = resJSON;
    });
  }

  return (
    // <SWRConfig
    //   value={{
    //     refreshInterval: 3000,
    //     fetcher: (url: string) => {
    //       console.log("fetcher");
    //       fetch(url, {
    //         body: JSON.stringify(rawData),
    //         method: "POST",
    //         headers: new Headers({ "Content-Type": "application/json" }),
    //       }).then((res) => res.json());
    //     },
    //   }}
    // >
    <div className="container">
      <Head>
        <title>Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />

        <div className={landingStyles.landing}>
          <div className={landingStyles.left}>
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

            {drafts ? (
              drafts.map((draft: any) => (
                <Draft
                  deleteDraft={deleteDraft}
                  key={draft.id}
                  title={draft.title}
                  id={draft.id}
                />
              ))
            ) : (
              <div>
                <p>You have no drafts.</p>
                <button
                  className={landingStyles["create-button"]}
                  onClick={createNewPost}
                >
                  Create New Draft
                </button>
              </div>
            )}
          </div>
          <div className={landingStyles.right}>
            <h1>Your Published Posts</h1>
            <hr />
            <p>You have no published posts. Create a draft to get started.</p>
          </div>
        </div>
      </main>
    </div>
    // </SWRConfig>
  );
}

type DraftProps = {
  title: string;
  id: string;
  key: string;
  deleteDraft: (
    e: React.MouseEvent<HTMLButtonElement>,
    draft_id: string
  ) => any;
};

function Draft(props: DraftProps) {
  return (
    <div className={landingStyles["draft"]}>
      <p>{props.title}</p>
      <button onClick={(e) => props.deleteDraft(e, props.id)}>
        Delete Draft
      </button>
    </div>
  );
}

function Header() {
  return (
    <div className={landingStyles.header}>
      <div className={landingStyles.settings}></div>
      <div className={landingStyles.settings}>
        <button onClick={logOut}></button>
      </div>
    </div>
  );
}
