import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";

const appStyles = require("../styles/App.module.scss");
const indexStyles = require("../styles/Index.module.scss");

export default function Pages() {
  const router = useRouter();

  const { authenticated, error, loading } = useLoggedIn();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/article");
  };

  return (
    <div className="container">
      <Head>
        <title>Leaf</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (document.cookie && document.cookie.includes('authed')) {
            window.location.href = "/landing"
          }
        `,
          }}
        />
      </Head>
      <main>
        <Header />
        <Body />
      </main>
    </div>
  );
}

/*
Header Components
*/
function Header() {
  return (
    <div className={indexStyles.Header}>
      <Logo />
      <Login />
      <HeaderText />
      <GetStarted />
    </div>
  );
}

function Logo() {
  return (
    <div className={indexStyles.Logo}> 
      Leaf
    </div>  
  );
}

function Login() {
  return (
    <div className={indexStyles.Login}>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  );
}

function HeaderText() {
  return (
    <div className={indexStyles.HeaderText}>
        Coding Tutorials to the Next Level.
    </div>
  );
}

function GetStarted() {
  return (
    <div>
       <Link href="/signup">
         <div className={indexStyles.GetStarted}>
           <div className={indexStyles.button}>
             Get Started
           </div>
         </div>
       </Link>
    </div>
  );
}

/*
Body Components
*/
function Body() {
  return (
    <div className={indexStyles.Body}>
      <BodyText />
      <BodyBox />
    </div>
  );
}

function BodyText() {
  return (
    <div className={indexStyles.BodyText}>
      No more publishing code <br></br> snippets on Medium.
    </div>
  );
}

function BodyBox() {
  return (
    <div className={indexStyles.BodyBox}>
      <div className={indexStyles.BodyBoxLeftColumn}>
      </div>
      <div className={indexStyles.BodyBoxRightColumn}>
      </div>
    </div>
  );
}
