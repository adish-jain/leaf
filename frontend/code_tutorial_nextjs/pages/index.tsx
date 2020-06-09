import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";

import { useLoggedIn } from "../lib/checkAuth";

import { useRouter } from "next/router";

const appStyles = require("../styles/App.module.scss");

export default function Pages() {
  const router = useRouter();

  const { authenticated, error } = useLoggedIn();

  if (!authenticated) {
    console.log("not signed in");
  } else {
    console.log("signed in");
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/article");
  };

  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {authenticated ? <SignedIn /> : <SignedOut handleClick={handleClick} />}
      </main>
    </div>
  );
}

function SignedIn() {
  const router = useRouter();

  function logOut() {
    fetch("/api/logout", {
      method: "POST",
      // eslint-disable-next-line no-undef
      credentials: "same-origin",
    }).then((res) => {
      console.log(res);
      router.push("/");
    });
  }

  return (
    <div>
      <h1>You are signed in</h1>
      <Link href="/article">
        <a>View a sample article</a>
      </Link>
      <button onClick={logOut}>Logout</button>
    </div>
  );
}

type SignedOutProps = {
  handleClick: (e: React.MouseEvent<HTMLElement>) => void;
};

function SignedOut(props: SignedOutProps) {
  return (
    <div>
      <Header />
      <div className={appStyles.Landing}>
        <h1>This is a platform to view coding tutorials in a better format.</h1>
        <h3>Check out an example tutorial</h3>
        <div onClick={props.handleClick} className={appStyles.Preview}>
          <h2>Example Tutorial</h2>
        </div>
      </div>
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
      <Link href="/logout">
        <a>Logout</a>
      </Link>
    </div>
  );
}
