// import Head from "next/head";
// import Link from "next/link";

// import { useLoggedIn, logOut } from "../lib/UseLoggedIn";

// import { useRouter } from "next/router";

// const indexStyles = require("../styles/Index.module.scss");

// export default function Pages() {
//   const router = useRouter();

//   const { authenticated, error, loading } = useLoggedIn();

//   if (authenticated) {
//     window.location.href = "/landing";
//   }

//   const handleClick = (e: React.MouseEvent<HTMLElement>) => {
//     e.preventDefault();
//     router.push("/login");
//   };

//   const goToIndex = (e: React.MouseEvent<HTMLElement>) => {
//     e.preventDefault();
//     router.push("/");
//   };

//   return (
//     <div className="container">
//       <Head>
//         <title>Leaf</title>
//         <link rel="icon" href="/favicon.ico" />
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//           if (document.cookie && document.cookie.includes('authed')) {
//             window.location.href = "/landing"
//           }
//         `,
//           }}
//         />
//       </Head>
//       <main className={indexStyles.MainWrapper}>
//         <Header goToIndex={goToIndex}/>
//         <Body handleClick={handleClick} />
//       </main>
//     </div>
//   );
// }

// /*
// Header Components
// */
// function Header(props: {goToIndex: any}) {
//   return (
//     <div className={indexStyles.Header}>
//       <NavBar goToIndex={props.goToIndex}/>
//       <HeaderText />
//     </div>
//   );
// }

// function NavBar(props: {goToIndex: any}) {
//   return (
//     <div className={indexStyles.NavBar}>
//       <Logo goToIndex={props.goToIndex}/>
//       <Login />
//       <Signup />
//       <About />
//     </div>
//   )
// }

// function Logo(props: {goToIndex: any}) {
//   return (
//     <div className={indexStyles.Logo} onClick={props.goToIndex}> 
//       <img src="/images/logo.svg"/>
//     </div>    
//   );
// }

// function Login() {
//   return (
//     <div className={indexStyles.Login}>
//       <Link href="/login">
//         <a>Login</a>
//       </Link>
//     </div>
//   );
// }

// function Signup() {
//   return (
//     <div className={indexStyles.Login}>
//       <Link href="/signup">
//         <a>Signup</a>
//       </Link>
//     </div>
//   );
// }

// function About() {
//   return (
//     <div className={indexStyles.Login}>
//       <Link href="/about">
//         <a>About</a>
//       </Link>
//     </div>
//   );
// }

// function HeaderText() {
//   return (
//     <div>
//       <div className={indexStyles.HeaderText}>
//           A New Way to Convey
//       </div>
//       <GetStarted />
//     </div>
//   );
// }

// function GetStarted() {
//   return (
//       <Link href="/signup">
//         <div className={indexStyles.GetStarted}>
//           <div className={indexStyles.button}>
//             Get Started
//           </div>
//         </div>
//       </Link>
//   );
// }

// /*
// Body Components
// */
// function Body(props: {handleClick: any}) {
//   return (
//     <div className={indexStyles.Body}> 
//       <BodyBox />
//       <BodyText handleClick={props.handleClick}/>
//     </div>
//   );
// }

// function BodyText(props: {handleClick: any}) {
//   return (
//       <div>
//         <div className={indexStyles.BodyTextH1}>
//           Coding tutorials <br></br> to the next level<br></br> 
//         </div>
//         <div className={indexStyles.BodyTextH2}>
//            Steps & code editor <br></br> side-by-side for a <br></br> seamless experience
//         </div>
//         <div onClick={props.handleClick} className={indexStyles.Preview}>
//           <h2>Example</h2>
//         </div>
//       </div>
//   );
// }

// function BodyBox() {
//   return (
//     <div>
//       <img alt="tutorial" src='/images/tutorial.svg' />
//     </div>
//   );
// }

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
        <Stripe1 />

        <Title />
        {/* <Tutorial /> */}
        <Row1 />
        <Stripe2 />
        <Row2 />
        <Row3 />
        <Stripe3 />
        <Row4 />
        <Footer goToIndex={goToIndex}/>
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
    </div>
  );
}

function NavBar(props: {goToIndex: any}) {
  return (
    <div className={indexStyles.NavBar}>
      <Logo goToIndex={props.goToIndex}/>
      <Signup />
      <Login />
      <About />
    </div>
  )
}

function Logo(props: {goToIndex: any}) {
  return (
    <div className={indexStyles.Logo} onClick={props.goToIndex}> 
      <img src="/images/logo.svg"/>
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

function Title() {
  return (
      <div className={indexStyles.Title}> 
        <TitleText />
        {/* <GetStarted /> */}
      </div>
  )
}

function TitleText() {
  return (
    <div className={indexStyles.Title}>
      {/* <img src="/images/web.svg"/> */}
      <div className={indexStyles.Banner}>
        <div className={indexStyles.Text}>
          <div className={indexStyles.h1Text}>
              A new way to convey
          </div>
          <div className={indexStyles.h2Text}>
            Leaf is a platform built from the ground up, for coding tutorials
          </div>
          <div className={indexStyles.TitleButtons}>
              <Link href="/signup">
                <div className={indexStyles.GetStarted}>
                  <div className={indexStyles.button}>
                    Get Started
                  </div>
                </div>
              </Link>
              <Link href="/signup">
                <div className={indexStyles.Examples}>
                  <div className={indexStyles.button}>
                    Learn More
                  </div>
                </div>
              </Link>
          </div>
			  </div>
        <div className={indexStyles.computer}>
          <img src="/images/laptop3.svg"/>
            {/* <img src="https://www.bebold.ch/img/home/macbook-white.png"/> */}
            {/* <div className={indexStyles.tutorial}></div> */}
        </div>
      </div>
    </div>
  );
}

// function GetStarted() {
//   return (
//     <div className={indexStyles.Title}>
//       <div className={indexStyles.Banner}>
//         <div className={indexStyles.Text}>
//           <div className={indexStyles.TitleButtons}>
//               <Link href="/signup">
//                 <div className={indexStyles.GetStarted}>
//                   <div className={indexStyles.button}>
//                     Get Started
//                   </div>
//                 </div>
//               </Link>
//               <Link href="/signup">
//                 <div className={indexStyles.Examples}>
//                   <div className={indexStyles.button}>
//                     Learn More
//                   </div>
//                 </div>
//               </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

function GetStarted2() {
  return (
      <Link href="/signup">
        <div className={indexStyles.GetStarted2}>
          <div className={indexStyles.button}>
            Sign Up
          </div>
        </div>
      </Link>
  );
}

// function Tutorial() {
//   return (
//     <div className={indexStyles.Tutorial}> 
//       <img src="/images/ex.svg"/>
//     </div>
//   )
// }

function Row1() {
  return (
      <div className={indexStyles.Row1}> 
        <div className={indexStyles.RowHeader}>
          <img src="/images/steps.svg" />
        </div>
        <img src="/images/ex.svg" />
    </div>
  );
}

function Row2() {
  return (
      <div className={indexStyles.Row2}> 
        <div className={indexStyles.Row2Header}>
          <img src="/images/code.svg" />
        </div>
        <img src="/images/ex.svg" />
    </div>
  );
}

function Row3() {
  return (
      <div className={indexStyles.Row3}> 
        <div className={indexStyles.RowHeader}>
          <img src="/images/publish.svg" />
        </div>
        <img src="/images/ex.svg" />
    </div>
  );
}

function Row4() {
  return (
    <div className={indexStyles.Row4}> 
      <div className={indexStyles.Row4Text}>
        Say goodbye to publishing code snippets on Medium
      </div>
      <GetStarted2 />
    </div>
  );
}

function Footer(props: {goToIndex: any}) {
  return (
    <div className={indexStyles.Footer}>
      <NavBar goToIndex={props.goToIndex}/>
    </div>
  );
}

function Stripe1() {
  return (
    <div className={indexStyles.Stripe1}>
    </div>
  )
}

function Stripe2() {
  return (
    <div className={indexStyles.Stripe2}>
    </div>
    // <div className={indexStyles.relativeStripe2}>
    //   <div className={indexStyles.Stripe2}>
    //   </div>
    // </div>
  )
}


function Stripe3() {
  return (
    <div className={indexStyles.Stripe3}>
    </div>
  )
}