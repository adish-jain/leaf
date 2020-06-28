import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";
import React, { useState } from "react";

import { useLoggedIn } from "../lib/UseLoggedIn";

import { useRouter } from "next/router";

const loginStyles = require("../styles/Login.module.scss");

export default function Login() {
  const router = useRouter();
  const { authenticated, error, loading } = useLoggedIn("/landing", false);

  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");
  const [loggingIn, changeLoggingIn] = useState(false);
  const [errorMessage, updateErrorMessage] = useState("");

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    changePassword(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (email === "") {
      updateErrorMessage("Invalid Email");
      return;
    }
    if (password === "") {
      updateErrorMessage("No Password Set");
      return;
    }

    changeLoggingIn(true);

    let data = {
      email: email,
      password: password,
      requestedAPI: "login",
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
          router.push("/landing");
        }
        if (res.status === 403) {
          res.json().then((resJson) => {
            updateErrorMessage(resJson.error);
            changeLoggingIn(false);
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  return (
    <div className="container">
      <Head>
        <title>Login</title>
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
        <div className={loginStyles.Login}>
          <div className={loginStyles.LoginBox}>
            <h1>Login</h1>
            <div className={loginStyles.FormWrapper}>
              <div className={loginStyles.InputBox}>
                <label>Email</label>
                <input onChange={handleChangeEmail}></input>
              </div>
              <div className={loginStyles.InputBox}>
                <label>Password</label>
                <input type="password" onChange={handleChangePassword}></input>
              </div>
              {errorMessage === "" ? (
                <div></div>
              ) : (
                <p className={loginStyles.ErrorMessage}>{errorMessage}</p>
              )}
              <button className={loginStyles.LoginButton} onClick={handleClick}>
                {loggingIn ? "Logging In..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
