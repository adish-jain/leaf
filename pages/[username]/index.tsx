import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../../components/Scrolling";

import getUsernames from "../../lib/api/getUsernames";
import { format } from "path";
const appStyles = require("../../styles/App.module.scss");

export async function getStaticPaths() {
  let usernames = await getUsernames();
  let paths = usernames.map((username) => ({
    params: {
      username: username,
    },
  }));
  console.log(paths);
  return {
    paths,
    fallback: true, // See the "fallback" section below
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      publishedPosts: [],
    },
  };
};

type UserPageProps = {};

const UserPage = (props: UserPageProps) => {
  const [currentStep, updateStep] = useState(0);
  const router = useRouter();

  return (
    <div className="container">
      <Head>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>{router.isFallback ? "is fallback" :"not fallback"}</div>
      </main>
    </div>
  );
};

export default UserPage;
