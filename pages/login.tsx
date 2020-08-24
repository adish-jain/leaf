import Head from "next/head";
import fetch from "isomorphic-unfetch";
import InferGetStaticPropsType from "next";
import Link from "next/link";
import React, { useState } from "react";
import { HeaderUnAuthenticated } from "../components/Header";
import { useRouter } from "next/router";

const headerStyles = require("../styles/Header.module.scss");
const loginStyles = require("../styles/Login.module.scss");

function About() {
  return (
    <div className={headerStyles.Login}>
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}

export default function Login() {
  const router = useRouter();
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
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLElement>) => {
    changeForgotPassword(true);
    changeLoggingIn(false);
    updateErrored(false);
  };

  const handleBackToLogin = (e: React.MouseEvent<HTMLElement>) => {
    changeForgotPassword(false);
    changeLoggingIn(false);
    changeResetting(false);
    updateErrored(false);
  };

  const goToIndex = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/");
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
        <HeaderUnAuthenticated signup={true} about={true} login={false} />
        <div className={loginStyles.Login}>
          {forgotPassword ? (
            <ForgotPassword
              handleChangeEmail={handleChangeEmail}
              errored={errored}
              errorMessage={errorMessage}
              handleResetClick={handleResetClick}
              resetting={resetting}
              handleBackToLogin={handleBackToLogin}
            />
          ) : (
            <LoginScreen
              handleChangeEmail={handleChangeEmail}
              errored={errored}
              loggingIn={loggingIn}
              errorMessage={errorMessage}
              handleLoginClick={handleLoginClick}
              handleChangePassword={handleChangePassword}
              handleForgotPassword={handleForgotPassword}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function ForgotPassword(props: {
  handleChangeEmail: any;
  errored: boolean;
  errorMessage: string;
  handleResetClick: any;
  resetting: boolean;
  handleBackToLogin: any;
}) {
  return (
    <div className={loginStyles.LoginBox}>
      <h1>Password Reset</h1>
      <div className={loginStyles.FormWrapper}>
        <div className={loginStyles.InputBox}>
          <label>Email</label>
          <input onChange={props.handleChangeEmail}></input>
        </div>
        {!props.errored ? (
          <div></div>
        ) : (
          <p className={loginStyles.ErrorMessage}>{props.errorMessage}</p>
        )}
        <button
          className={loginStyles.LoginButton}
          onClick={props.handleResetClick}
        >
          {props.resetting ? "Sending Reset Email..." : "Reset Password"}
        </button>
        <div
          className={loginStyles.ForgotPassword}
          onClick={props.handleBackToLogin}
        >
          <br></br>Back to Login
        </div>
      </div>
    </div>
  );
}

function LoginScreen(props: {
  handleChangeEmail: any;
  errored: boolean;
  loggingIn: boolean;
  errorMessage: string;
  handleLoginClick: any;
  handleChangePassword: any;
  handleForgotPassword: any;
}) {
  return (
    <div className={loginStyles.LoginBox}>
      <h1>Login</h1>
      <div className={loginStyles.FormWrapper}>
        <div className={loginStyles.InputBox}>
          <label>Email</label>
          <input onChange={props.handleChangeEmail}></input>
        </div>
        <div className={loginStyles.InputBox}>
          <label>Password</label>
          <input type="password" onChange={props.handleChangePassword}></input>
        </div>
        {!props.errored ? (
          <div></div>
        ) : (
          <p className={loginStyles.ErrorMessage}>{props.errorMessage}</p>
        )}
        <button
          className={loginStyles.LoginButton}
          onClick={props.handleLoginClick}
        >
          {props.loggingIn ? "Logging In..." : "Login"}
        </button>
        <div
          className={loginStyles.ForgotPassword}
          onClick={props.handleForgotPassword}
        >
          <br></br>Forgot Password?
        </div>
      </div>
    </div>
  );
}
