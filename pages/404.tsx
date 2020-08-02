import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";

const appStyles = require("../styles/App.module.scss");
const indexStyles = require("../styles/Index.module.scss");

export default function ErroredPage() {
  return (
    <div className="container">
      <Head>
        <title>Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>404. Page not Found.</div>
      </main>
    </div>
  );
}
