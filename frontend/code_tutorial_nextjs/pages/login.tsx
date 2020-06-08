import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";
import React, { useState } from "react";

const loginStyles = require("../styles/Login.module.scss");
const axios = require("axios").default;

export default function Login() {
  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    axios
      .post("/api/login", { email: email, password: password })
      .then(function (response: any) {
        // handle success
        console.log(response);
      })
      .catch(function (error: any) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
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
            <div className={loginStyles.InputBox}>
              <label>Username</label>
              <input></input>
            </div>
            <div className={loginStyles.InputBox}>
              <label>Password</label>
              <input></input>
            </div>
            <button onClick={handleClick}>Login</button>
          </div>
        </div>
      </main>
    </div>
  );
}
