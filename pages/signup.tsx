import Head from "next/head";
import fetch from "isomorphic-unfetch";
import React, { useState } from "react";
import { useLoggedIn } from "../lib/UseLoggedIn";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeaderUnAuthenticated } from "../components/Header";

import "../styles/header.scss";
import "../styles/login.scss";

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

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    changeEmail(e.target.value);
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    changeUsername(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateErrored(false);
    changePassword(e.target.value);
  };

  const handleChangeVerifyPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateErrored(false);
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
      password: password,
      google: false,
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

  function googleSignIn(googleUser: any) {
    var profile = googleUser.getBasicProfile();
    console.log("Google Auth Response", googleUser.getBasicProfile());
    console.log("Name: ", profile.getName());
    let data = {
      requestedAPI: "googleSignup",
      googleUser: googleUser,
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

  const goToIndex = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/");
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
        <script src="https://apis.google.com/js/platform.js"></script>
        <meta name="google-signin-client_id" content="969806278278-q6o19gcraf5rfqofo73b0loo9s88o1ln.apps.googleusercontent.com"></meta>
        <meta name="google-signin-cookiepolicy" content="single_host_origin"></meta>
        <meta name="google-signin-scope" content="profile email"></meta>
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
        <div className={"Login"}>
          <div className={"LoginBox"}>
            <h1>Sign Up</h1>
            <div className={"FormWrapper"}>
              <div className={"InputBox"}>
                <label>Email</label>
                <input id="email" value={email} onChange={handleChangeEmail} />
              </div>
              <div className={"InputBox"}>
                <label>Username</label>
                <input
                  id="username"
                  value={username}
                  onChange={handleChangeUsername}
                />
              </div>
              <div className={"InputBox"}>
                <label>Password</label>
                <input
                  onChange={handleChangePassword}
                  type="password"
                  id="password"
                ></input>
              </div>
              <div className={"InputBox"}>
                <label>Confirm Password</label>
                <input
                  onChange={handleChangeVerifyPassword}
                  type="password"
                  id="verify-password"
                ></input>
              </div>
              {!errored ? (
                <div></div>
              ) : (
                <p className={"ErrorMessage"}>{errorMsg}</p>
              )}
              <button className={"LoginButton"} onClick={handleClick}>  
                {signingUp ? "Signing Up..." : "Signup"}
              </button>
              <p>OR</p>
              <div className={"g-signin2"} data-onsuccess={"googleSignIn"}></div>
              {/* <button className={"LoginButton"} onClick={handleGoogleClick}>
                Google Sign in
              </button> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Logo(props: { goToIndex: any }) {
  return (
    <div className={"Logo"} onClick={props.goToIndex}>
      <img src="/images/LeafLogo.svg" />
    </div>
  );
}
