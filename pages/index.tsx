import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";
import { useState } from "react";

// let indexStyles = require("../styles/index.scss");
import "../styles/index.scss";

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
      <main className={"MainWrapper"}>
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
    <div className={"Header"}>
      <NavBar goToIndex={props.goToIndex} />
    </div>
  );
}

function NavBar(props: { goToIndex: any }) {
  return (
    <div className={"NavBar"}>
      <Logo goToIndex={props.goToIndex} />
      <Signup />
      <Login />
      <Examples />
      <About />
    </div>
  );
}

function HeaderDropDown(props: { goToIndex: any }) {
  return (
    <div className={"HeaderDropDown"}>
      <NavBarDropDown goToIndex={props.goToIndex} />
    </div>
  );
}

function NavBarDropDown(props: { goToIndex: any }) {
  const [opened, toggleOpen] = useState(false);
  return (
    <div className={"NavBarDropDown"}>
      <Logo goToIndex={props.goToIndex} />
      <div className={"dropdown"}>
        <button onClick={(e) => toggleOpen(!opened)} className={"dropbtn"}>
          ☰
        </button>
        <div className={"dropdownContent"}>
          {opened ? (
            <div>
              <Signup />
              <Login />
              <Examples />
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
    <div className={"Logo"} onClick={props.goToIndex}>
      <img src="/images/logo.svg" />
    </div>
  );
}

function Login() {
  return (
    <div className={"Login"}>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  );
}

function Signup() {
  return (
    <div className={"Login"}>
      <Link href="/signup">
        <a>Signup</a>
      </Link>
    </div>
  );
}

function Examples() {
  return (
    <div className={"Login"}>
      <Link href="/examples">
        <a>Examples</a>
      </Link>
    </div>
  );
}

function About() {
  return (
    <div className={"Login"}>
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}

function Title() {
  return (
    <div className={"Title"}>
      <TitleText />
    </div>
  );
}

function TitleText() {
  return (
    <div className={"Title"}>
      <div className={"Banner"}>
        <div className={"Text"}>
          <div className={"h1Text"}>Leaf is a platform built from the ground up, for coding tutorials</div>
          <div className={"h2Text"}>
            Say goodbye to publishing code snippets on Medium
          </div>
          <div className={"TitleButtons"}>
            <Link href="/signup">
              <div className={"GetStarted"}>
                <div className={"button"}>
                  Get Started
                  <img src="/images/warrow.svg" />
                </div>
              </div>
            </Link>
            <Link href="/examples">
              <div className={"Examples"}>
                <div className={"button"}>
                  Learn More
                  <img src="/images/arrow.svg" />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className={"computer"}>
          <img src="/images/laptop3.svg" />
          <div className={"screen"}>
            <video className={"demo"} autoPlay muted loop>
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
      <div className={"GetStarted2"}>
        <div className={"button"}>Sign Up</div>
      </div>
    </Link>
  );
}

function Row1() {
  return (
    <div className={"Row1"}>
      <div className={"RowHeader"}>
        <img src="/images/steps.svg" />
      </div>
      <div className={"Screen"}>
        <video className={"Demo"} autoPlay muted loop>
          <source src={"/videos/steps.mp4"} />
        </video>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className={"Row2"}>
      <Stripe2 />
      <div className={"Row2Header"}>
        <img src="/images/code.svg" />
      </div>
      <div className={"Screen"}>
        <video className={"Demo"} autoPlay muted loop>
          <source src={"/videos/code.mp4"} />
        </video>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className={"Row3"}>
      <div className={"RowHeader"}>
        <img src="/images/publish.svg" />
      </div>
      <div className={"Screen"}>
        <video className={"Demo"} autoPlay muted loop>
          <source src={"/videos/scroll.mp4"} />
        </video>
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className={"Row4"}>
      <Stripe3 />
      <div className={"Row4Text"}>
        Start making beautiful tutorials with Leaf
      </div>
      <GetStarted2 />
    </div>
  );
}

function Footer(props: { goToIndex: any }) {
  return (
    <div className={"Footer"}>
      <NavBar goToIndex={props.goToIndex} />
    </div>
  );
}

function Stripe1() {
  return <div className={"Stripe1"}></div>;
}

function Stripe2() {
  return <div className={"Stripe2"}></div>;
}

function Stripe3() {
  return <div className={"Stripe3"}></div>;
}
