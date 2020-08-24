import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";

const exampleStyles = require("../styles/Examples.module.scss");

export default function Pages() {
  const router = useRouter();

  const { authenticated, error, loading } = useLoggedIn();

  if (authenticated) {
    window.location.href = "/landing";
  }

  const goToIndex = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/");
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
      <main className={exampleStyles.MainWrapper}>
        <Header goToIndex={goToIndex}/>
        <TitleText />
        <Tutorials />
      </main>
    </div>
  );
}

/*
Header Components
*/
function Header(props: {goToIndex: any}) {
  return (
    <div className={exampleStyles.Header}>
      <NavBar goToIndex={props.goToIndex}/>
    </div>
  );
}

function NavBar(props: {goToIndex: any}) {
  return (
    <div className={exampleStyles.NavBar}>
      <Logo goToIndex={props.goToIndex}/>
        <Signup />
        <Login />
        <About />
    </div>
  );
}

function Logo(props: {goToIndex: any}) {
  return (
    <div className={exampleStyles.Logo} onClick={props.goToIndex}> 
      <img src="/images/logo.svg"/>
    </div>    
  );
}

function Login() {
  return (
    <div className={exampleStyles.Login}>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  );
}

function Signup() {
  return (
    <div className={exampleStyles.Login}>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </div>
  );
}

function About() {
  return (
    <div className={exampleStyles.Login}>
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}

function TitleText() {
  return (
    <div className={exampleStyles.Title}>
      <div className={exampleStyles.Text}>
        Example Tutorials
      </div>
    </div>
  );
}

function Tutorials() {
  return (
    <div className={exampleStyles.Tutorials}>
      <a 
        href="https://getleaf.app/dsps301/binarysearch-58opqzc9"
        target="_blank">
        <div className={exampleStyles.Tutorial}>
            Binary Search
        </div>
      </a>
      <a 
        href="https://getleaf.app/outofthebot/howdostepsandscrollingworkintheleafcodebase-y4qrlau9"
        target="_blank">
        <div className={exampleStyles.Tutorial}>
            Steps & Scrolling in the Leaf Codebase
        </div>
      </a>
      <a 
        href="https://getleaf.app/dsps301/kanyewestspower-pm6ne39l"
        target="_blank">
        <div className={exampleStyles.Tutorial}>
            Kanye West's 'Power'
        </div>
      </a>
    </div>
  );
}
