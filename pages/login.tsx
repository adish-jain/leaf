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
  const { authenticated, error, loading } = useLoggedIn();

  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");
  const [forgotPassword, changeForgotPassword] = useState(false);
  const [loggingIn, changeLoggingIn] = useState(false);
  const [resetting, changeResetting] = useState(false);
  const [errorMessage, updateErrorMessage] = useState("");
  const [errored, updateErrored] = useState(false);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    changeEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    changePassword(e.target.value);
  };

  const handleLoginClick = (e: React.MouseEvent<HTMLElement>) => {
    if (email === "") {
      updateErrorMessage("Invalid Email");
      updateErrored(true);
      return;
    }
    if (password === "") {
      updateErrorMessage("No Password Set");
      updateErrored(true);
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
          updateErrored(false);
        }
        if (res.status === 403) {
          res.json().then((resJson) => {
            updateErrorMessage(resJson.error);
            updateErrored(true);
            changeLoggingIn(false);
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  const handleResetClick = (e: React.MouseEvent<HTMLElement>) => {
    changeResetting(true);

    let data = {
      email: email,
      requestedAPI: "passwordReset",
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
        }
        if (res.status === 403) {
          res.json().then((resJson) => {
            updateErrorMessage(resJson.error);
            updateErrored(true);
            changeResetting(false);
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }

  const handleForgotPassword = (e: React.MouseEvent<HTMLElement>) => {
    changeForgotPassword(true);
    changeLoggingIn(false);
    updateErrored(false);
  }

  const handleBackToLogin = (e: React.MouseEvent<HTMLElement>) => {
    changeForgotPassword(false);
    changeLoggingIn(false);
    changeResetting(false);
    updateErrored(false);
  }

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
          {forgotPassword ? 
          ( 
            <div className={loginStyles.LoginBox}>
              <h1>Password Reset</h1>
              <div className={loginStyles.FormWrapper}>
                <div className={loginStyles.InputBox}>
                  <label>Email</label>
                  <input onChange={handleChangeEmail}></input>
                </div>
                {!errored ? (
                  <div></div>
                ) : (
                  <p className={loginStyles.ErrorMessage}>{errorMessage}</p>
                )}
                <button className={loginStyles.LoginButton} onClick={handleResetClick}>
                  {resetting ? "Sending Reset Email..." : "Reset Password"}
                </button>
                <div 
                  className={loginStyles.ForgotPassword} 
                  onClick={handleBackToLogin}>
                    <br></br>Back to Login
                </div>
              </div>
            </div>
          ) : (
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
                {!errored ? (
                  <div></div>
                ) : (
                  <p className={loginStyles.ErrorMessage}>{errorMessage}</p>
                )}
                <button className={loginStyles.LoginButton} onClick={handleLoginClick}>
                  {loggingIn ? "Logging In..." : "Login"}
                </button>
                <div 
                  className={loginStyles.ForgotPassword} 
                  onClick={handleForgotPassword}>
                    <br></br>Forgot Password?
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
