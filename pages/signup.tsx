import Head from "next/head";
import fetch from "isomorphic-unfetch";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useLoggedIn } from "../lib/UseLoggedIn";
import { useRouter } from "next/router";
import { HeaderUnAuthenticated } from "../components/Header";
// import { GoogleLogin } from "react-google-login";
const GoogleLogin = dynamic(import("react-google-login"), { ssr: false });
import { motion, AnimatePresence } from "framer-motion";
import "../styles/header.scss";
import "../styles/login.scss";

let NEXT_PUBLIC_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;

export default function SignUp() {
  const router = useRouter();
  const { authenticated, error } = useLoggedIn();
  const [email, changeEmail] = useState("");
  const [username, changeUsername] = useState("");
  const [password, changePassword] = useState("");
  const [verifyPassword, changeVerifyPassword] = useState("");
  const [errorMsg, updateErrorMsg] = useState("");
  const [errored, updateErrored] = useState(false);
  const [signingUp, changeSigningUp] = useState(false);
  const [normalSignup, changeNormalSignup] = useState(false);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    if (e.target.value !== "") {
      changeNormalSignup(true);
    }
    if (e.target.value === "" && username === "" && password ==  "" && verifyPassword == "") {
      changeNormalSignup(false);
    }
    changeEmail(e.target.value);
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    if (e.target.value === "" && email === "" && password ==  "" && verifyPassword == "") {
      changeNormalSignup(false);
    }
    changeUsername(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    if (e.target.value === "" && username === "" && email ==  "" && verifyPassword == "") {
      changeNormalSignup(false);
    }
    changePassword(e.target.value);
  };

  const handleChangeVerifyPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateErrored(false);
    if (e.target.value === "" && username === "" && password ==  "" && email == "") {
      changeNormalSignup(false);
    }
    changeVerifyPassword(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (password != verifyPassword) {
      updateErrored(true);
      updateErrorMsg("Passwords don't match.");
      return;
    }

    if (username === "") {
      updateErrored(true);
      updateErrorMsg("Invalid Username.");
      return;
    }

    changeSigningUp(true);
    let data = {
      requestedAPI: "signup",
      email: email,
      username: username,
      password: password
    };
    fetch("/api/endpoint", {
      method: "POST",
      // eslint-disable-next-line no-undef
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          updateErrored(false);
          router.push("/landing");
        }
        if (res.status === 403) {
          res.json().then((resJson) => {
            updateErrored(true);
            updateErrorMsg(resJson.errorMsg);
            changeSigningUp(false);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const responseGoogle = (response: any) => {
    let data = {
      requestedAPI: "googleAuthentication",
      tokenId: response.tokenId
    };
    fetch("/api/endpoint", {
      method: "POST",
      // eslint-disable-next-line no-undef
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify(data),
    })
    .then((res) => {
      if (res.status === 200) {
        updateErrored(false);
        router.push("/landing");
      }
      if (res.status === 403) {
        res.json().then((resJson) => {
          updateErrored(true);
          updateErrorMsg(resJson.errorMsg);
          changeSigningUp(false);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }  

  return (
    <div className="container">
      <Head>
        <title>Sign Up</title>
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
      <main className={"LoginMain"}>
        <HeaderUnAuthenticated
          explore={true}
          login={true}
          about={true}
          signup={false}
        />
        <style jsx global>{`
          html {
            height: 100%;
          }
        `}</style>
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <div className={"Login"}>
              <div className={"LoginBox"}>
                <h1>Sign Up</h1>
                <GoogleLogin
                  // @ts-ignore
                  clientId={NEXT_PUBLIC_OAUTH_CLIENT_ID}
                  buttonText="Continue with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  theme="light"
                />
                <div className={"FormWrapper"}>
                  <div className={"Bar"}></div>
                  <div className={"InputBox"}>
                    <label>Email</label>
                    <input id="email" value={email} onChange={handleChangeEmail} />
                  </div>
                  {normalSignup && 
                    <NormalSignup 
                      username={username}
                      handleChangeUsername={handleChangeUsername}
                      handleChangePassword={handleChangePassword}
                      handleChangeVerifyPassword={handleChangeVerifyPassword}
                    />
                  }
                  {!errored ? (
                    <div></div>
                  ) : (
                    <p className={"ErrorMessage"}>{errorMsg}</p>
                  )}
                  <button className={"LoginButton"} onClick={handleClick}>  
                    {signingUp ? "Signing Up..." : "Signup"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </main>
      </div>

  );
}

function NormalSignup (props: {
  username: string;
  handleChangeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeVerifyPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <div>
          <div className={"InputBox"}>
            <label>Username</label>
            <input
              id="username"
              value={props.username}
              onChange={props.handleChangeUsername}
            />
          </div>
          <div className={"InputBox"}>
            <label>Password</label>
            <input
              onChange={props.handleChangePassword}
              type="password"
              id="password"
            ></input>
          </div>
          <div className={"InputBox"}>
            <label>Confirm Password</label>
            <input
              onChange={props.handleChangeVerifyPassword}
              type="password"
              id="verify-password"
            ></input>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
