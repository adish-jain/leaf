import { useState } from "react";
import useSWR, { SWRConfig } from "swr";
import Router from "next/router";

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
  const [changeUsernameLoading, updateChangeUsernameLoading] = useState(false);
  const [usernameTaken, updateUsernameTaken] = useState(false);
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
  const emailVerified = userInfo.emailVerified;

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
    if (!updateUsernameResponse.usernameUpdated) {
      updateUsernameTaken(true);
    } else {
      mutate({ username: newUsername }, true);
      updateUsernameTaken(false);
    }
  }

  async function sendEmailVerification() {
    const sendEmailVerificationRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "sendEmailVerification",
      }),
    };

    let updateUsernameResponse = await fetch(
      "api/endpoint",
      sendEmailVerificationRequest
    );
  }

  return {
    username,
    saveNewUsername,
    newUsername,
    changeNewUsername,
    changeUsernameLoading,
    usernameTaken,
    email,
    emailVerified,
    sendEmailVerification,
  };
}
