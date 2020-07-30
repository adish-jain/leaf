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
      <Link href="/login">
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
           Steps & code editor <br></br> side-by-side for a <br></br> seamless experience
        </div>
        <div onClick={props.handleClick} className={indexStyles.Preview}>
          <h2>Example</h2>
        </div>
      </div>
  );
}

function BodyBox() {
  return (
    <div>
      <div className={indexStyles.BodyBoxDiagram}>
        <BodyBoxSteps />
        <BodyBoxCode />
      </div>
    </div>
  );
}

function BodyBoxSteps () {
  return (
    <div className={indexStyles.BodyBoxLeft}>
      <UnfocusedStep />
      <FocusedStep />
      <UnfocusedStep />
    </div>
  );
}

function UnfocusedStep () {
  return (
    <div className={indexStyles.BodyBoxUnfocusedBox}>
      <div className={indexStyles.Description1}></div>
      <div className={indexStyles.Description2}></div>
      <div className={indexStyles.Description3}></div>
    </div>
  );
}

function FocusedStep () {
  return (
    <div className={indexStyles.BodyBoxFocusedBox}>
      <div className={indexStyles.Description1}></div>
      <div className={indexStyles.Description2}></div>
      <div className={indexStyles.Description3}></div>
    </div>
  );
}

function BodyBoxCode() {
  return (
    <div className={indexStyles.BodyBoxRight}>
      <FileHeader />
      <UnfocusedFunction />
      <FocusedFunction />
      <UnfocusedFunction />
      <LanguageFooter />
    </div>
  );
}

function FileHeader () {
  return (
    <div>
      <div className={indexStyles.File}>
        test.jsx
      </div>
      <div className={indexStyles.FileBar}>
      </div>
    </div>
  );
}

function LanguageFooter () {
  return (
    <div>
      <div className={indexStyles.LanguageBar}></div>
      <div className={indexStyles.Language}>
        JSX
      </div>
    </div>
  )
}
 
function UnfocusedFunction () {
  return (
    <div>
      <div className={indexStyles.functionSignatureUnfocused}></div>
      <div className={indexStyles.firstLineUnfocused}></div>
      <div className={indexStyles.firstLineUnfocused}></div>
      <div className={indexStyles.ifUnfocused}></div>
      <div className={indexStyles.ifBlockUnfocused}></div>
      <div className={indexStyles.ifUnfocused}></div>
      <div className={indexStyles.ifBlockUnfocused}></div>
    </div>
  );
}

function FocusedFunction () {
  return (
    <div>
      <div className={indexStyles.functionSignatureFocused}></div>
      <div className={indexStyles.firstLineFocused}></div>
      <div className={indexStyles.firstLineFocused}></div>
      <div className={indexStyles.ifFocused}></div>
      <div className={indexStyles.ifBlockFocused}></div>
      <div className={indexStyles.elseFocused}></div>
      <div className={indexStyles.elseBlockFocused}></div>
    </div>
  );
}
