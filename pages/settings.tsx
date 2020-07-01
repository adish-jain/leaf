import Head from "next/head";
import React, { useState } from "react";
import { useLoggedIn } from "../lib/UseLoggedIn";
import useSWR, { SWRConfig } from "swr";
const settingStyles = require("../styles/Settings.module.scss");

const fetcher = (url: string) => {
  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      requestedAPI: "get_userInfo",
    }),
  };
  return fetch(url, myRequest).then((res: any) => res.json());
};

export default function SignUp() {
  const initialData: any = {};
  const [username, updateUsername] = useState("");
  const { authenticated, error } = useLoggedIn();
  let { data: userInfo, mutate } = useSWR(
    authenticated ? "api/endpoint" : null,
    fetcher,
    {
      initialData,
      revalidateOnMount: true,
    }
  );

  async function changeUsername() {
    const changeUsernameRequest = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: "set_userId",
        username: username,
      }),
    };
    mutate({ username: username }, false);
    let updateUsernameResponse = await fetch(
      "api/endpoint",
      changeUsernameRequest
    ).then((res: any) => res.json());
    mutate({ username: username }, true);
  }

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
          <p>Your username is {userInfo.username}</p>
          <input
            value={username}
            onChange={(e) => updateUsername(e.target.value)}
          ></input>
          <button onClick={changeUsername}>Choose ID</button>
        </div>
      </main>
    </div>
  );
}
