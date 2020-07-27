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
          <button onClick={saveNewUsername}>Choose ID</button>
          {usernameTaken ? <p>Username is already taken</p> : <div></div>}
        </div>
      </main>
    </div>
  );
}
