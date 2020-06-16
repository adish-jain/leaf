import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";

const landingStyles = require("../styles/Landing.module.scss");

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Landing() {
  const { authenticated, error, loading } = useLoggedIn("/", true);

  function createNewPost() {
    fetch("/api/endpoint", {
      method: "POST",
      body: JSON.stringify({
        requestedAPI: "create",
      }),
    }).then((res) => {
      console.log(res);
    });
  }

  return (
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
          </div>
          <div className={landingStyles.Right}>
            <h1>Your Published Posts</h1>
            <hr />
            <p>You have no published posts. Create a draft to get started.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <div className={landingStyles.Header}>
      <div className={landingStyles.Settings}></div>
      <div className={landingStyles.Settings}></div>
    </div>
  );
}
