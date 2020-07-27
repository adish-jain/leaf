import Head from "next/head";
import React, { useState } from "react";
import { useLoggedIn } from "../lib/UseLoggedIn";
import useSWR, { SWRConfig } from "swr";
import { useUserInfo } from "../lib/useUserInfo";
const settingStyles = require("../styles/Settings.module.scss");

export default function SignUp() {
  const initialData: any = {};
  const { authenticated, error } = useLoggedIn();
  const {
    username,
    saveNewUsername,
    newUsername,
    changeNewUsername,
    changeUsernameLoading,
    usernameTaken,
    email,
    emailVerified,
    sendEmailVerification,
  } = useUserInfo(authenticated);
  return (
    <div className="container">
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (document.cookie) {
            if (!document.cookie.includes('authed')) {
              window.location.href = "/"
            }
          }
          else {
            window.location.href = '/'
          }
        `,
          }}
        />
      </Head>
      <main>
        <div>
          <h1>Settings</h1>
          <p>Your username is {username}</p>
          <input
            value={newUsername}
            onChange={(e) => changeNewUsername(e.target.value)}
          ></input>
          <button onClick={saveNewUsername}>Change username</button>
        </div>
        <UsernameTaken usernameTaken={usernameTaken} />
        <div>
          <h2>Email Settings</h2>
          <p>Your email is {email}</p>
          <p>Your email is {emailVerified ? "verified" : "unverified"}</p>
          <button onClick={(e) => sendEmailVerification()}>
            Send email verification
          </button>
        </div>
      </main>
    </div>
  );
}

function UsernameTaken(props: { usernameTaken: boolean }) {
  return (
    <div>
      {props.usernameTaken ? <p>Username is already taken</p> : <div></div>}
    </div>
  );
}
