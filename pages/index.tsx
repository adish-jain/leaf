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

  // should redirect to example tutorials or an introductionary explanation of 
  // how Leaf works 
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/login");
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
        <Body handleClick={handleClick}/>
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
      <HeaderText />
      <Login />
      <Signup />
      <About />

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

function Signup() {
  return (
    <div className={indexStyles.Login}>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </div>
  );
}

function About() {
  return (
    <div className={indexStyles.Login}>
      <Link href="">
        <a>About</a>
      </Link>
    </div>
  );
}

function HeaderText() {
  return (
    <div>
      <div className={indexStyles.HeaderText}>
          A New Way to Convey.
      </div>
      <GetStarted />
    </div>
  );
}

function GetStarted() {
  return (
      <Link href="/signup">
        <div>
        <div className={indexStyles.GetStarted}>
          <div className={indexStyles.button}>
            Get Started
          </div>
        </div>
        </div>
      </Link>
  );
}

/*
Body Components
*/
function Body(props: {handleClick: any}) {
  return (
    <div className={indexStyles.Body}> 
      <BodyBox />
      <BodyText handleClick={props.handleClick}/>
    </div>
  );
}

function BodyText(props: {handleClick: any}) {
  return (
      <div>
        <div className={indexStyles.BodyTextH1}>
          Coding tutorials <br></br> to the next level<br></br> 
        </div>
        <div className={indexStyles.BodyTextH2}>
          No more publishing  <br></br> code snippets on<br></br> Medium
        </div>
        <div onClick={props.handleClick} className={indexStyles.Preview}>
          <h3>Examples</h3>
        </div>
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
