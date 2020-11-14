import Head from "next/head";
import fetch from "isomorphic-unfetch";
import React, { useState } from "react";
import { HeaderUnAuthenticated } from "../components/Header";
import { useRouter } from "next/router";
import { GoogleLogin } from "react-google-login";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/header.scss";
import "../styles/login.scss";

let NEXT_PUBLIC_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;

export default function Login() {
  const router = useRouter();
  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");
  const [forgotPassword, changeForgotPassword] = useState(false);
  const [loggingIn, changeLoggingIn] = useState(false);
  const [resetting, changeResetting] = useState(false);
  const [errorMessage, updateErrorMessage] = useState("");
  const [errored, updateErrored] = useState(false);
  const [normalLogin, changeNormalLogin] = useState(false);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    if (e.target.value !== "") {
      changeNormalLogin(true);
    }
    if (e.target.value === "" && password == "") {
      changeNormalLogin(false);
    }
    changeEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    if (e.target.value === "" && email == "") {
      changeNormalLogin(false);
    }
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
        <main className={"LoginMain"}>
          <HeaderUnAuthenticated
            signup={true}
            about={true}
            explore={true}
            login={false}
          />
          <div className={"Login"}>
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
                router={router}
                normalLogin={normalLogin}
              />
            )}
          </div>
        </main>
      </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ForgotPassword(props: {
  handleChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleBackToLogin: (e: React.MouseEvent<HTMLElement>) => void;
  errored: boolean;
  errorMessage: string;
  resetting: boolean;
}) {
  return (
    <div className={"LoginBox"}>
      <h1>Password Reset</h1>
      <div className={"FormWrapper"}>
        <div className={"InputBox"}>
          <label>Email</label>
          <input onChange={props.handleChangeEmail}></input>
        </div>
        {!props.errored ? (
          <div></div>
        ) : (
          <p className={"ErrorMessage"}>{props.errorMessage}</p>
        )}
        <button className={"LoginButton"} onClick={props.handleResetClick}>
          {props.resetting ? "Reset Email Sent" : "Reset Password"}
        </button>
        <div className={"ForgotPassword"} onClick={props.handleBackToLogin}>
          <br></br>Back to Login
        </div>
      </div>
    </div>
  );
}

function LoginScreen(props: {
  handleChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleForgotPassword: (e: React.MouseEvent<HTMLElement>) => void;
  errored: boolean;
  loggingIn: boolean;
  normalLogin: boolean;
  errorMessage: string;
  router: any;
}) {
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
        props.router.push("/landing");
      }
      if (res.status === 403) {
        res.json().then((resJson) => {
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }  
  return (
    <div className={"LoginBox"}>
      <h1>Login</h1>
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
          <input 
            autoComplete={"username email"} 
            name={"email"} 
            type={"text"} 
            onChange={props.handleChangeEmail}
          ></input>
        </div>
        {props.normalLogin && 
          <NormalLogin 
            handleChangePassword={props.handleChangePassword}
            errored={props.errored}
            errorMessage={props.errorMessage}
          />
        }
        <button className={"LoginButton"} onClick={props.handleLoginClick}>
          {props.loggingIn ? "Logging In..." : "Login"}
        </button>
        <div className={"ForgotPassword"} onClick={props.handleForgotPassword}>
          <br></br>Forgot Password?
        </div>
      </div>
    </div>
  );
}

function NormalLogin (props: {
  handleChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errored: boolean;
  errorMessage: string;
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
            <label>Password</label>
            <input 
              name={"password"}
              autoComplete={"new-password"} 
              type="password" 
              onChange={props.handleChangePassword}
            ></input>
          </div>
          {!props.errored ? (
            <div></div>
          ) : (
            <p className={"ErrorMessage"}>{props.errorMessage}</p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

