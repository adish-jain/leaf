import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";

const indexStyles = require("../styles/Index.module.scss");

export default function Pages() {
  const router = useRouter();

  const { authenticated, error, loading } = useLoggedIn();

  if (authenticated) {
    window.location.href = "/landing";
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/login");
  };

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
      <main className={indexStyles.MainWrapper}>
        <Header goToIndex={goToIndex}/>
        <Body handleClick={handleClick} />
      </main>
    </div>
  );
}

/*
Header Components
*/
function Header(props: {goToIndex: any}) {
  return (
    <div className={indexStyles.Header}>
      <NavBar goToIndex={props.goToIndex}/>
      <HeaderText />
    </div>
  );
}

function NavBar(props: {goToIndex: any}) {
  return (
    <div className={indexStyles.NavBar}>
      <Logo goToIndex={props.goToIndex}/>
      <Login />
      <Signup />
      <About />
    </div>
  )
}

function Logo(props: {goToIndex: any}) {
  return (
    <div className={indexStyles.Logo} onClick={props.goToIndex}> 
      Leaf.
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
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}

function HeaderText() {
  return (
    <div>
      <div className={indexStyles.HeaderText}>
          A New Way to Convey
      </div>
      <GetStarted />
    </div>
  );
}

function GetStarted() {
  return (
      <Link href="/signup">
        <div className={indexStyles.GetStarted}>
          <div className={indexStyles.button}>
            Get Started
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
      <img alt="tutorial" src='/images/tutorial.svg' />
    </div>
  );
}

