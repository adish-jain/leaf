import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import useSWR, { SWRConfig } from "swr";
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
  const { data: drafts } = useSWR(
    authenticated ? "/api/endpoint" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  function createNewPost() {
    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "create",
      }),
    }).then((res) => {
      console.log(res);
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

        <div className={landingStyles.Landing}>
          <div className={landingStyles.Left}>
            <h1>Your Drafts</h1>
            <hr />
            <p>You have no drafts.</p>
            <button onClick={createNewPost}>Create New Draft</button>
            {drafts ? (
              drafts.map((draft: any) => <div>{draft.title}</div>)
            ) : (
              <div></div>
            )}
          </div>
          <div className={landingStyles.Right}>
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

function Header() {
  return (
    <div className={landingStyles.Header}>
      <div className={landingStyles.Settings}></div>
      <div className={landingStyles.Settings}>
        <button onClick={logOut}></button>
      </div>
    </div>
  );
}
