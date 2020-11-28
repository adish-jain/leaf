import { useState } from "react";
import useSWR, { SWRConfig } from "swr";

const myRequest = (requestedAPI: string) => {
  return {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      requestedAPI: requestedAPI,
    }),
  };
};

const userInfoFetcher = () =>
  fetch("api/endpoint", myRequest("get_userInfo")).then((res: any) =>
    res.json()
  );

export function useUserInfo(authenticated: boolean) {
  const initialUserInfo: any = { username: "" };
  const [newUsername, changeNewUsername] = useState("");
  const [newEmail, changeNewEmail] = useState("");
  const [newPassword, changeNewPassword] = useState("");
  const [password, updatePassword] = useState("");
  const [changeUsernameLoading, updateChangeUsernameLoading] = useState(false);
  const [userNameError, updateUserNameError] = useState("");
  const [emailError, updateEmailError] = useState("");
  const [passwordStatus, updatePasswordStatus] = useState("");
  const [emailAndPasswordStatus, updateEmailAndPasswordStatus] = useState("");
  const [
    sendEmailVerificationStatus,
    updateSendEmailVerificationStatus,
  ] = useState("");

  const [newAbout, changeNewAbout] = useState("");
  const [newTwitter, changeNewTwitter] = useState("");
  const [newGithub, changeNewGithub] = useState("");
  const [newWebsite, changeNewWebsite] = useState("");

  let { data: userInfo, mutate } = useSWR(
    authenticated ? "getUserInfo" : null,
    userInfoFetcher,
    {
      initialData: initialUserInfo,
      revalidateOnMount: true,
    }
  );
  const username = userInfo.username;
  const email = userInfo.email;
  const signInMethod = userInfo.method;
  const emailVerified = userInfo.emailVerified;

  /* Profile Page information */
  // const about = userInfo.about;
  // const twitter = userInfo.twitter;
  // const github = userInfo.github;
  // const website = userInfo.website;

  async function saveNewProfile() {
    const changeProfileRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "set_userProfile",
        about: newAbout,
        twitter: newTwitter,
        github: newGithub,
        website: newWebsite,
      }),
    };
    // updateChangeUsernameLoading(true);
    await fetch(
      "api/endpoint",
      changeProfileRequest
    ).then((res) => {
      if (res.status === 200) {
        mutate({ 
          about: newAbout,
          twitter: newTwitter,
          github: newGithub,
          website: newWebsite, 
        }, true);
      }
      if (res.status === 403) {
        res.json().then((resJson) => {
          // updateEmailError(resJson.error);
        });
      }
    })
    .catch(function (error: any) {
      console.log(error);
    });
    // if (!updateUsernameResponse.error) {
    //   updateUserNameError("");
    //   mutate({ username: newUsername }, true);
    // } else {
    //   updateUserNameError(updateUsernameResponse.error);
    // }
  }

  async function saveNewUsername() {
    const changeUsernameRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "set_userId",
        username: newUsername,
      }),
    };
    updateChangeUsernameLoading(true);
    let updateUsernameResponse = await fetch(
      "api/endpoint",
      changeUsernameRequest
    ).then((res: any) => res.json());
    if (!updateUsernameResponse.error) {
      updateUserNameError("");
      mutate({ username: newUsername }, true);
    } else {
      updateUserNameError(updateUsernameResponse.error);
    }
  }

  async function saveNewEmail() {
    const changeEmailRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "set_userEmail",
        email: newEmail,
      }),
    };

    await fetch("/api/endpoint", changeEmailRequest)
      .then((res) => {
        if (res.status === 200) {
          mutate({ email: newEmail }, true);
          updateEmailError("");
          sendEmailVerification();
        }
        if (res.status === 403) {
          res.json().then((resJson) => {
            updateEmailError(resJson.error);
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }

  async function saveNewPassword() {
    const changePasswordRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "set_userPassword",
        password: password,
        newPassword: newPassword,
      }),
    };

    await fetch("/api/endpoint", changePasswordRequest)
      .then((res) => {
        if (res.status === 200) {
          updatePasswordStatus("Password was successfully reset");
        }
        if (res.status === 403) {
          res.json().then((resJson) => {
            updatePasswordStatus(resJson.error);
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }

  async function saveNewEmailAndPassword() {
    const saveEmailAndPasswordRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "set_email_and_password",
        newPassword: newPassword,
        newEmail: newEmail,
      }),
    };
    await fetch("/api/endpoint", saveEmailAndPasswordRequest)
    .then((res) => {
      if (res.status === 200) {
        mutate({ signInMethod: "leaf" }, true);
        updateEmailAndPasswordStatus("Email & password were successfully reset");
        sendEmailVerification();
      }
      if (res.status === 403) {
        res.json().then((resJson) => {
          updateEmailAndPasswordStatus(resJson.error);
        });
      }
    })
    .catch(function (error: any) {
      console.log(error);
    });
  }

  async function sendEmailVerification() {
    const sendEmailVerificationRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "sendEmailVerification",
      }),
    };

    await fetch("/api/endpoint", sendEmailVerificationRequest)
      .then((res) => {
        if (res.status === 200) {
          updateSendEmailVerificationStatus("Verification email sent");
        }
        if (res.status === 403) {
          res.json().then((resJson) => {
            updateSendEmailVerificationStatus(resJson.error);
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }

  return {
    username,
    email,
    password,
    // uid,
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
    newAbout,
    newTwitter,
    newGithub,
    newWebsite,
    changeNewAbout,
    changeNewTwitter,
    changeNewGithub,
    changeNewWebsite,
    saveNewProfile,
  };
}
