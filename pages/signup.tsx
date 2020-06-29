import Head from "next/head";
import fetch from "isomorphic-unfetch";
import React, { useState } from "react";
import { useLoggedIn } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";

const loginStyles = require("../styles/Login.module.scss");

export default function SignUp() {
  const router = useRouter();
  const { authenticated, error } = useLoggedIn();

  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");
  const [verifyPassword, changeVerifyPassword] = useState("");

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    changePassword(e.target.value);
  };

  const handleChangeVerifyPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    changeVerifyPassword(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    let data = {
      requestedAPI: "signup",
      email: email,
      password: password,
    };
    fetch("/api/endpoint", {
      method: "POST",
      // eslint-disable-next-line no-undef
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify(data),
    })
      .then((res) => {
        router.push("/landing");
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
                <input id="email" value={email} onChange={handleChangeEmail} />
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
