import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";
import { useState } from "react";

let indexStyles = require("../styles/index.module.scss");

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
    <div className={indexStyles["container"]}>
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
      <main className={indexStyles["MainWrapper"]}>
        <Header goToIndex={goToIndex} />
        <HeaderDropDown goToIndex={goToIndex} />
        <Stripe1 />
        <Title />
        <Row1 />
        <Row2 />
        <Row3 />
        <Row4 />
        <Footer goToIndex={goToIndex} />
      </main>
    </div>
  );
}

/*
Header Components
*/
function Header(props: { goToIndex: any }) {
  return (
    <div className={indexStyles["IndexHeader"]}>
      <NavBar goToIndex={props.goToIndex} />
    </div>
  );
}

function NavBar(props: { goToIndex: any }) {
  return (
    <div className={indexStyles["IndexNavBar"]}>
      <Logo goToIndex={props.goToIndex} />
      <Signup />
      <Login />
      <Explore />
      <About />
    </div>
  );
}

function HeaderDropDown(props: { goToIndex: any }) {
  return (
    <div className={indexStyles["HeaderDropDown"]}>
      <NavBarDropDown goToIndex={props.goToIndex} />
    </div>
  );
}

function NavBarDropDown(props: { goToIndex: any }) {
  const [opened, toggleOpen] = useState(false);
  return (
    <div className={indexStyles["NavBarDropDown"]}>
      <Logo goToIndex={props.goToIndex} />
      <div className={indexStyles["dropdown"]}>
        <button onClick={(e) => toggleOpen(!opened)} className={"dropbtn"}>
          ☰
        </button>
        <div className={indexStyles["dropdownContent"]}>
          {opened ? (
            <div>
              <Signup />
              <Login />
              <Explore />
              <About />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

function Logo(props: { goToIndex: any }) {
  return (
    <div className={indexStyles["Logo"]} onClick={props.goToIndex}>
      <img src="/images/logo.svg" />
    </div>
  );
}

function Login() {
  return (
    <div className={indexStyles["Login"]}>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  );
}

function Signup() {
  return (
    <div className={indexStyles["Login"]}>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </div>
  );
}

function Explore() {
  return (
    <div className={indexStyles["Login"]}>
      <Link href="/explore">
        <a>Explore</a>
      </Link>
    </div>
  );
}

function About() {
  return (
    <div className={indexStyles["Login"]}>
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}

function Title() {
  return (
    <div className={indexStyles["Title"]}>
      <TitleText />
    </div>
  );
}

function TitleText() {
  return (
    <div className={indexStyles["Title"]}>
      <div className={indexStyles["Banner"]}>
        <div className={indexStyles["Text"]}>
          <div className={indexStyles["h1Text"]}>
            Leaf is a platform built from the ground up, for coding tutorials
          </div>
          <div className={indexStyles["h2Text"]}>
            Say goodbye to publishing code snippets on Medium
          </div>
          <div className={indexStyles["TitleButtons"]}>
            <Link href="/signup">
              <div className={indexStyles["GetStarted"]}>
                <div className={indexStyles["button"]}>
                  Get Started
                  <img src="/images/warrow.svg" />
                </div>
              </div>
            </Link>
            <Link href="/explore">
              <div className={indexStyles["Explore"]}>
                <div className={indexStyles["button"]}>
                  Learn More
                  <img src="/images/arrow.svg" />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className={indexStyles["computer"]}>
          <img src="/images/laptop3.svg" />
          <div className={indexStyles["screen"]}>
            <video className={indexStyles["demo"]} autoPlay muted loop>
              <source src={"/videos/frontpage.mp4"} />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

function GetStarted2() {
  return (
    <Link href="/signup">
      <div className={indexStyles["GetStarted2"]}>
        <div className={indexStyles["button"]}>Sign Up</div>
      </div>
    </Link>
  );
}

function Row1() {
  return (
    <div className={indexStyles["Row1"]}>
      <div className={indexStyles["RowHeader"]}>
        <img src="/images/steps.svg" />
      </div>
      <div className={indexStyles["Screen"]}>
        <video className={indexStyles["Demo"]} autoPlay muted loop>
          <source src={"/videos/steps.mp4"} />
        </video>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className={indexStyles["Row2"]}>
      <Stripe2 />
      <div className={indexStyles["Row2Header"]}>
        <img src="/images/code.svg" />
      </div>
      <div className={indexStyles["Screen"]}>
        <video className={indexStyles["Demo"]} autoPlay muted loop>
          <source src={"/videos/code.mp4"} />
        </video>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className={indexStyles["Row3"]}>
      <div className={indexStyles["RowHeader"]}>
        <img src="/images/publish.svg" />
      </div>
      <div className={indexStyles["Screen"]}>
        <video className={indexStyles["Demo"]} autoPlay muted loop>
          <source src={"/videos/scroll.mp4"} />
        </video>
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className={indexStyles["Row4"]}>
      <Stripe3 />
      <div className={indexStyles["Row4Text"]}>
        Start making beautiful tutorials with Leaf
      </div>
      <GetStarted2 />
    </div>
  );
}

function Footer(props: { goToIndex: any }) {
  return (
    <div className={indexStyles["IndexFooter"]}>
      <div className={indexStyles["FooterNavBar"]}>
        <Logo goToIndex={props.goToIndex} />
        <Signup />
        <Login />
        <Explore />
        <About />
      </div>
    </div>
  );
}

function Stripe1() {
  return <div className={indexStyles["Stripe1"]}></div>;
}

function Stripe2() {
  return <div className={indexStyles["Stripe2"]}></div>;
}

function Stripe3() {
  return <div className={indexStyles["Stripe3"]}></div>;
}
