import Head from "next/head";
import React, { useState } from "react";
import { useLoggedIn } from "../lib/UseLoggedIn";
import { useUserInfo } from "../lib/useUserInfo";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import settingStyles from "../styles/Settings.module.scss";

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
    saveNewEmailAndPassword,
    newUsername,
    newEmail,
    newPassword,
    changeNewUsername,
    changeNewEmail,
    changeNewPassword,
    changeUsernameLoading,
    userNameError,
    emailError,
    passwordStatus,
    emailAndPasswordStatus,
    emailVerified,
    sendEmailVerification,
    sendEmailVerificationStatus,
    signInMethod,
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
        <Header
          settings={false}
          profile={true}
          explore={true}
          logout={true}
          username={username}
        />
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
            <div className={settingStyles["settings"]}>
              <div className={settingStyles["settings-title"]}>Settings</div>
              <hr />
              <Username
                changeNewUsername={changeNewUsername}
                username={username}
                newUsername={newUsername}
                saveNewUsername={saveNewUsername}
                userNameError={userNameError}
              />
              {signInMethod != "google" ? (
                <div>
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
                </div>
              ) : (
                <SetEmailAndPassword
                  email={email}
                  newEmail={newEmail}
                  changeNewEmail={changeNewEmail}
                  saveNewEmail={saveNewEmail}
                  emailError={emailError}
                  emailVerified={emailVerified}
                  sendEmailVerification={sendEmailVerification}
                  sendEmailVerificationStatus={sendEmailVerificationStatus}
                  newPassword={newPassword}
                  saveNewPassword={saveNewPassword}
                  saveNewEmailAndPassword={saveNewEmailAndPassword}
                  changeNewPassword={changeNewPassword}
                  passwordStatus={passwordStatus}
                  emailAndPasswordStatus={emailAndPasswordStatus}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Username(props: {
  changeNewUsername: React.Dispatch<React.SetStateAction<string>>;
  saveNewUsername: () => Promise<void>;
  username: string;
  newUsername: string;
  userNameError: string;
}) {
  return (
    <div className={settingStyles["username-section"]}>
      <div>
        <h2>Username</h2>
        <p>Your username is {props.username}</p>
        <input
          className={settingStyles["default-input"]}
          value={props.newUsername}
          onChange={(e) => props.changeNewUsername(e.target.value)}
        ></input>
        <button
          className={settingStyles["input-button"]}
          onClick={props.saveNewUsername}
        >
          Change username
        </button>
      </div>
      <UserNameError userNameError={props.userNameError} />
    </div>
  );
}

function Password(props: {
  updatePassword: React.Dispatch<React.SetStateAction<string>>;
  saveNewPassword: () => Promise<void>;
  changeNewPassword: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  newPassword: string;
  passwordStatus: string;
}) {
  return (
    <div>
      <div>
        <h2>Password</h2>
        <input
          className={settingStyles["round-input"]}
          value={props.password}
          placeholder={"current password"}
          onChange={(e) => props.updatePassword(e.target.value)}
        ></input>
        <input
          className={settingStyles["default-input"]}
          value={props.newPassword}
          placeholder={"new password"}
          onChange={(e) => props.changeNewPassword(e.target.value)}
        ></input>
        <button
          className={settingStyles["input-button"]}
          onClick={props.saveNewPassword}
        >
          Change password
        </button>
      </div>
      <PasswordStatus passwordStatus={props.passwordStatus} />
    </div>
  );
}

function Email(props: {
  changeNewEmail: React.Dispatch<React.SetStateAction<string>>;
  sendEmailVerification: () => Promise<void>;
  saveNewEmail: () => Promise<void>;
  email: string;
  newEmail: string;
  emailError: string;
  sendEmailVerificationStatus: string;
  emailVerified: boolean;
}) {
  return (
    <div>
      <div>
        <h2>Email</h2>
        <p>Your email is {props.email} & it is {props.emailVerified ? "verified" : "unverified"}</p>
        <input
          className={settingStyles["default-input"]}
          value={props.newEmail}
          onChange={(e) => props.changeNewEmail(e.target.value)}
        ></input>
        <button
          className={settingStyles["input-button"]}
          onClick={props.saveNewEmail}
        >
          Change email
        </button>
        <EmailError emailError={props.emailError} />
        <button
          className={settingStyles["verification-rounded-button"]}
          onClick={(e) => props.sendEmailVerification()}
        >
          Send email verification
        </button>
        <EmailVerificationStatus
          sendEmailVerificationStatus={props.sendEmailVerificationStatus}
        />
      </div>
    </div>
  );
}

function SetEmailAndPassword(props: {
  changeNewEmail: React.Dispatch<React.SetStateAction<string>>;
  saveNewEmail: () => Promise<void>;
  saveNewPassword: () => Promise<void>;
  saveNewEmailAndPassword: () => Promise<void>;
  changeNewPassword: React.Dispatch<React.SetStateAction<string>>;
  sendEmailVerification: () => Promise<void>;
  email: string;
  newEmail: string;
  emailError: string;
  emailVerified: boolean;
  sendEmailVerificationStatus: string;
  newPassword: string;
  passwordStatus: string;
  emailAndPasswordStatus: string;
}) {
  return (
    <div className={settingStyles["email-and-password"]}>
      <div>
        <h2>Email & Password</h2>
        <p>Your email is {props.email} & it is {props.emailVerified ? "verified" : "unverified"}</p>
        <input
          className={settingStyles["default-input"]}
          value={props.newEmail}
          placeholder={"new email"}
          onChange={(e) => props.changeNewEmail(e.target.value)}
        ></input>
      </div>
      <div>
        <input
          className={settingStyles["default-input"]}
          value={props.newPassword}
          placeholder={"new password"}
          onChange={(e) => props.changeNewPassword(e.target.value)}
        ></input>
        <button
          className={settingStyles["input-button"]}
          onClick={props.saveNewEmailAndPassword}
        >
          Change email & set password
        </button>
      </div>
      <EmailAndPasswordStatus emailAndPasswordStatus={props.emailAndPasswordStatus} />
    </div>
  );
}

function UserNameError(props: { userNameError: string }) {
  return (
    <div>
      {props.userNameError !== "" ? <p>{props.userNameError}</p> : <div></div>}
    </div>
  );
}

function EmailError(props: { emailError: string }) {
  return (
    <div>
      {props.emailError === "" ? <div></div> : <p>{props.emailError}</p>}
    </div>
  );
}

function PasswordStatus(props: { passwordStatus: string }) {
  return (
    <div>
      {props.passwordStatus === "" ? (
        <div></div>
      ) : (
        <p>{props.passwordStatus}</p>
      )}
    </div>
  );
}

function EmailVerificationStatus(props: {
  sendEmailVerificationStatus: string;
}) {
  return (
    <div>
      {props.sendEmailVerificationStatus === "" ? (
        <div></div>
      ) : (
        <p>{props.sendEmailVerificationStatus}</p>
      )}
    </div>
  );
}

function EmailAndPasswordStatus(props: {
  emailAndPasswordStatus: string;
}) {
  return (
    <div>
      {props.emailAndPasswordStatus === "" ? (
        <div></div>
      ) : (
        <p>{props.emailAndPasswordStatus}</p>
      )}
    </div>
  );
}
