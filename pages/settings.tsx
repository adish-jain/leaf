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
    sendEmailVerificationStatus,
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
        
        <h1>Settings</h1>

        <Username 
          changeNewUsername={changeNewUsername}
          username={username}
          newUsername={newUsername}
          saveNewUsername={saveNewUsername}
          usernameTaken={usernameTaken}/>

        <Password 
          password={password}
          updatePassword={updatePassword}
          newPassword={newPassword}
          saveNewPassword={saveNewPassword}
          changeNewPassword={changeNewPassword}
          passwordStatus={passwordStatus}
        />

        <Email 
          email={email}
          newEmail={newEmail}
          changeNewEmail={changeNewEmail}
          saveNewEmail={saveNewEmail}
          emailError={emailError}
          emailVerified={emailVerified}
          sendEmailVerification={sendEmailVerification}
          sendEmailVerificationStatus={sendEmailVerificationStatus}
        />
      
      </main>
    </div>
  );
}

function Username(
  props: {
    changeNewUsername: any,
    username: string,
    newUsername: string,
    saveNewUsername: any,
    usernameTaken: boolean
  }) {
    return (
      <div>
        <div>
          <h2>Username</h2>
            <p>Your username is {props.username}</p>
            <input
              value={props.newUsername}
              onChange={(e) => props.changeNewUsername(e.target.value)}
            ></input>
            <button onClick={props.saveNewUsername}>Change username</button>
        </div>
        <UsernameTaken usernameTaken={props.usernameTaken} />
    </div>
    );
}

function Password(
  props: {
    password: string,
    updatePassword: any,
    newPassword: string,
    saveNewPassword: any,
    changeNewPassword: any,
    passwordStatus: string
  }) {
    return (
      <div>
        <div>
          <h2>Password</h2>
          <input
            value={props.password}
            placeholder={"current password"}
            onChange={(e) => props.updatePassword(e.target.value)}
          ></input>
          <input
            value={props.newPassword}
            placeholder={"new password"}
            onChange={(e) => props.changeNewPassword(e.target.value)}
          ></input>
          <button onClick={props.saveNewPassword}>Change password</button>
        </div>
        <PasswordStatus passwordStatus={props.passwordStatus} />
      </div>
    );
}

function Email(
  props: {
    email: string,
    newEmail: string,
    changeNewEmail: any,
    saveNewEmail: any,
    emailError: string,
    emailVerified: boolean,
    sendEmailVerification: any,
    sendEmailVerificationStatus: string
  }) {
    return (
      <div>
        <div>
          <h2>Email</h2>
          <p>Your email is {props.email}</p>
          <input
            value={props.newEmail}
            onChange={(e) => props.changeNewEmail(e.target.value)}
          ></input>
          <button onClick={props.saveNewEmail}>Change email</button>
          <EmailError emailError={props.emailError} />
          <p>Your email is {props.emailVerified ? "verified" : "unverified"}</p>
          <button onClick={(e) => props.sendEmailVerification()}>
            Send email verification
          </button>
          <EmailVerificationStatus 
            sendEmailVerificationStatus={props.sendEmailVerificationStatus} />
        </div>
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

function EmailVerificationStatus(props: { sendEmailVerificationStatus: string }) {
  return (
    <div>
      {props.sendEmailVerificationStatus === "" ? 
        <div></div> 
        : 
        <p>{props.sendEmailVerificationStatus}</p> }
    </div>
  );
}
