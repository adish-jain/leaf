import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";
import React, { useState } from "react";

import { useLoggedIn } from "../lib/checkAuth";

import { useRouter } from "next/router";

const loginStyles = require("../styles/Login.module.scss");

export default function Login() {
  const router = useRouter();
  const { authenticated, error } = useLoggedIn();

  if (!authenticated) {
    console.log("not signed in");
  } else {
    console.log("signed in");
    router.push("/");
  }

  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    changePassword(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    let data = {
      email: email,
      password: password,
    };

    fetch("/api/login", {
      method: "POST",
      // eslint-disable-next-line no-undef
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ data }),
    }).then((res) => {
      router.push("/");
    });
  };

  return (
    <div className="container">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={loginStyles.Login}>
          <div className={loginStyles.LoginBox}>
            <h1>Login</h1>
            <div className={loginStyles.InputBox}>
              <label>Username</label>
              <input onChange={handleChangeEmail}></input>
            </div>
            <div className={loginStyles.InputBox}>
              <label>Password</label>
              <input onChange={handleChangePassword}></input>
            </div>
            <button onClick={handleClick}>Login</button>
          </div>
        </div>
      </main>
    </div>
  );
}
