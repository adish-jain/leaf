import Head from "next/head";
import React, { useState } from "react";
import { useLoggedIn } from "../lib/UseLoggedIn";
const settingStyles = require("../styles/Settings.module.scss");


export default function SignUp() {
  const { authenticated, error } = useLoggedIn();

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
        </div>
      </main>
    </div>
  );
}
