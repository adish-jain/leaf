import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";
import React, { useState } from "react";
import useSWR from "swr";

const loginStyles = require("../styles/Login.module.scss");
const axios = require("axios").default;

const fetcher = (...args: any) => fetch(args).then((res: any) => res.json());

export default function SignUp() {
  const { data, error } = useSWR("/api/token", fetcher);

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
    fetch("/api/signup", {
      method: "POST",
      // eslint-disable-next-line no-undef
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ data }),
    }).then((res) => {
      console.log(res);
      // console.log(res.headers.keys());
      console.log(res.headers.get("Set-Cookie"));
    });
  };

  return (
    <div className="container">
      <Head>
        <title>Sign Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={loginStyles.Login}>
          <div className={loginStyles.LoginBox}>
            <h1>Sign Up</h1>
            <div className={loginStyles.InputBox}>
              <label>Username</label>
              <input id="email" value={email} onChange={handleChangeEmail} />
            </div>
            <div className={loginStyles.InputBox}>
              <label>Password</label>
              <input onChange={handleChangePassword} id="password"></input>
            </div>
            <button onClick={handleClick}>Sign Up</button>
          </div>
        </div>
      </main>
    </div>
  );
}
