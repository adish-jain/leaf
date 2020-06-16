import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";

const landingStyles = require("../styles/App.module.scss");

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

export default function Landing() {
  const { authenticated, error, loading } = useLoggedIn('/', true);

  return (
    <div className="container">
      <Head>
        <title>Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={landingStyles.Landing}></div>
      </main>
    </div>
  );
}
