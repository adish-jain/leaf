import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";

const appStyles = require("../styles/App.module.scss");

export default function Pages() {
  const router = useRouter();

  const { authenticated, error, loading } = useLoggedIn("/landing", false);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/article");
  };

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="container">
      <Head>
        <title>Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Header />
          <div className={appStyles.Landing}>
            <h1>
              This is a platform to view coding tutorials in a better format.
            </h1>
            <h3>Check out an example tutorial</h3>
            <div onClick={handleClick} className={appStyles.Preview}>
              <h2>Example Tutorial</h2>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <div className={appStyles.Header}>
      <Link href="/login">
        <a>Login</a>
      </Link>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </div>
  );
}