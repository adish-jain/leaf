import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../../components/Scrolling";

import getUsernames from "../../lib/api/getUsernames";
import { getAllPosts } from "../../lib/api/publishPost";
import { getUsernameFromUid } from "../../lib/userUtils";
import { format } from "path";
import { getHeapCodeStatistics } from "v8";
const appStyles = require("../../styles/App.module.scss");

export async function getStaticPaths() {
  // get username from router query
  // get articles from username

  let paths: any[] = [];

  let posts = await getAllPosts();
  // console.log(posts);
  for (let i = 0; i < posts.length; i++) {
    let uid = posts[i].uid;
    let postId = posts[i].postId;
    let username = await getUsernameFromUid(uid);
    paths.push({
      params: {
        username: username,
        postId: postId,
      },
    });
  }

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

const Post = (props: UserPageProps) => {
  const [currentStep, updateStep] = useState(0);
  const router = useRouter();

  return (
    <div className="container">
      <Head>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>{router.isFallback ? "is fallback" : "not fallback"}</div>
      </main>
    </div>
  );
};

export default Post;
