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
    email,
    password,
    updatePassword,
    saveNewUsername,
    saveNewEmail,
    saveNewPassword,
    newUsername,
    newEmail,
    newPassword,
    changeNewUsername,
    changeNewEmail,
    changeNewPassword,
    changeUsernameLoading,
    usernameTaken,
    emailError,
    passwordStatus,
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
          <h2>Username</h2>
          <p>Your username is {username}</p>
          <input
            value={newUsername}
            onChange={(e) => changeNewUsername(e.target.value)}
          ></input>
          <button onClick={saveNewUsername}>Change username</button>
        </div>
        <UsernameTaken usernameTaken={usernameTaken} />

        <div>
          <h2>Password</h2>
          <input
            value={password}
            placeholder={"current password"}
            onChange={(e) => updatePassword(e.target.value)}
          ></input>
          <input
            value={newPassword}
            placeholder={"new password"}
            onChange={(e) => changeNewPassword(e.target.value)}
          ></input>
          <button onClick={saveNewPassword}>Change password</button>
        </div>
        <PasswordStatus passwordStatus={passwordStatus} />
        
        <div>
          <h2>Email</h2>
          <p>Your email is {email}</p>
          <input
            value={newEmail}
            onChange={(e) => changeNewEmail(e.target.value)}
          ></input>
          <button onClick={saveNewEmail}>Change email</button>
          <EmailError emailError={emailError} />
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

function EmailError(props: { emailError: string }) {
  return (
    <div>
      {props.emailError === "" ? <div></div> : <p>{props.emailError}</p> }
    </div>
  );
}

function PasswordStatus(props: { passwordStatus: string }) {
  return (
    <div>
      {props.passwordStatus === "" ? <div></div> : <p>{props.passwordStatus}</p> }
    </div>
  );
}
