import Head from "next/head";
import fetch from "isomorphic-unfetch";
import React, { useState } from "react";
import { useLoggedIn } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";

const loginStyles = require("../styles/Login.module.scss");

export default function SignUp() {
  const router = useRouter();
  // const { authenticated, error } = useLoggedIn();

  const [email, changeEmail] = useState("");
  const [username, changeUsername] = useState("");
  const [password, changePassword] = useState("");
  const [verifyPassword, changeVerifyPassword] = useState("");
  const [errorMsg, updateMsg] = useState("");
  const [signup, clicked] = useState(false);
  const [error, errored] = useState(true);
  const [match, passwordsMatch] = useState(true);


  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    errored(false);
    updateMsg("");
    clicked(false);
    changeEmail(e.target.value);
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    errored(false);
    updateMsg("");
    clicked(false);
    changeUsername(e.target.value);
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    errored(false);
    updateMsg("");
    clicked(false);
    changePassword(e.target.value);
    if (e.target.value != verifyPassword) {
      // console.log(password);
      // console.log(verifyPassword);
      passwordsMatch(false);
      errored(true);
    } else {
      passwordsMatch(true);
      // errored(false);
    }
  };

  const handleChangeVerifyPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    errored(false);
    updateMsg("");
    clicked(false);
    changeVerifyPassword(e.target.value);
    // console.log(e.target.value);
    // console.log(verifyPassword);
    if (password != e.target.value) {
      // console.log(password);
      // console.log(verifyPassword);
      passwordsMatch(false);
      errored(true);
    } else {
      passwordsMatch(true);
      // errored(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    errored(true);
    clicked(true);
    if (!match) {
      return;
    }
    let data = {
      requestedAPI: "signup",
      email: email,
      username: username,
      password: password,
    };
    fetch("/api/endpoint", {
      method: "POST",
      // eslint-disable-next-line no-undef
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify(data),
    })
      .then(async (res: any) => {
        let resJson = await res.json();
        let msg = resJson.msg;
        // console.log(msg);
        if (msg === "") {
          errored(false);
          router.push("/landing");
        } else {
          // errored(true);
          updateMsg(msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      <main className={loginStyles.LoginMain}>
        <div className={loginStyles.Logo}></div>
        <style jsx global>{`
          html {
            height: 100%;
          }
        `}</style>
        <div className={loginStyles.Login}>
          <div className={loginStyles.LoginBox}>
            <h1>Sign Up</h1>
            <div className={loginStyles.FormWrapper}>
              <div className={loginStyles.InputBox}>
                <label>Email</label>
                <input 
                  id="email" 
                  value={email} 
                  onChange={handleChangeEmail} />
              </div>
              <div className={loginStyles.InputBox}>
                <label>Username</label>
                <input 
                  id="username" 
                  value={username} 
                  onChange={handleChangeUsername} />
              </div>
              <div className={loginStyles.InputBox}>
                <label>Password</label>
                <input
                  onChange={handleChangePassword}
                  type="password"
                  id="password"
                ></input>
              </div>
              <div className={loginStyles.InputBox}>
                <label>Confirm Password</label>
                <input
                  onChange={handleChangeVerifyPassword}
                  type="password"
                  id="verify-password"
                ></input>
              </div>
              <button className={loginStyles.LoginButton} onClick={handleClick}>
                Sign Up
              </button>
              {signup && 
                !error && 
                (<div><br/>Email Verification Sent. Welcome to Leaf! 🍃</div>)}
              {error 
                && (<div><br/>{errorMsg}</div>)}
              {!match 
                && (<div><br/>Passwords don't match</div>)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
