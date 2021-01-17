import { useEffect, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import { getFollowingFromUsername } from "./userUtils";
import { SignUpMethods } from "../typescript/enums/backend/userEnums";
type userInfoType = {
  about: string;
  email: string;
  emailVerified: boolean;
  github: string;
  method: SignUpMethods;
  twitter: string;
  uid: string;
  userHost: string;
  username: string;
  website: string;
  following: Array<string>;
};
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
  const initialUserInfo: userInfoType = {
    about: "",
    email: "",
    emailVerified: false,
    github: "",
    method: SignUpMethods.Leaf,
    twitter: "",
    uid: "",
    userHost: "",
    username: "",
    website: "",
    following: [],
  };

  /* Settings-Related State */
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

  /* Profile-Related State */
  const [about, changeAbout] = useState("");
  const [twitter, changeTwitter] = useState("");
  const [github, changeGithub] = useState("");
  const [website, changeWebsite] = useState("");

  let { data, mutate } = useSWR<userInfoType>(
    authenticated ? "getUserInfo" : null,
    userInfoFetcher,
    {
      initialData: initialUserInfo,
      revalidateOnMount: true,
    }
  );

  const userInfo = data || initialUserInfo;
  const { emailVerified, method, email, username, userHost, following } = userInfo;
  // console.log("the username is" + username);
  
  // const [following, updateFollowing] = useState([]);

  // useEffect(() => {
  //   console.log("username is " + username);
  //   console.log("CALLING GETFOLLOWING");
  //   getFollowing();
  // }, [username]);
  // console.log("username is " + username);
  // console.log("following is" + following);
  // async function getFollowing() {
  //   const getFollowingRequest = {
  //     method: "POST",
  //     headers: new Headers({ "Content-Type": "application/json" }),
  //     body: JSON.stringify({
  //       requestedAPI: "getFollowing",
  //       username: username,
  //     }),
  //   };
  //   await fetch("api/endpoint", getFollowingRequest)
  //     .then((res) => {
  //       console.log("IN THEN");
  //       // return res.json();
  //       // res.json().then((resJson) => {
  //       //   console.log(resJson);
  //       //   // updateFollowing(resJson.error);
  //       // });
  //     })
  //     .catch(function (error: any) {
  //       console.log("IN ERROR");
  //       // console.log(error);
  //     });
  //   // console.log("FINAL RETURN");
  //   // updateFollowing(followingRes);
  //   // console.log(following);
  // }

  async function saveNewProfile() {
    const changeProfileRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "set_userProfile",
        about: about,
        twitter: twitter,
        github: github,
        website: website,
      }),
    };
    await fetch("api/endpoint", changeProfileRequest)
      .then((res) => {})
      .catch(function (error: any) {
        console.log(error);
      });
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
      mutate({ ...userInfo, username: newUsername }, true);
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
          mutate({ ...userInfo, email: newEmail }, true);
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
          mutate({ ...userInfo, method: SignUpMethods.Leaf }, true);
          updateEmailAndPasswordStatus(
            "Email & password were successfully reset"
          );
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
    signInMethod: method,
    about,
    twitter,
    github,
    website,
    changeAbout,
    changeTwitter,
    changeGithub,
    changeWebsite,
    saveNewProfile,
    userHost,
    following,
  };
}
