import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../../components/Scrolling";
import { getArticlesFromUsername } from "../../lib/userUtils";
import getUsernames from "../../lib/api/getUsernames";
const profileStyles = require("../../styles/Profile.module.scss");

export async function getStaticPaths() {
  let usernames = await getUsernames();
  let paths = usernames.map((username) => ({
    params: {
      username: username,
    },
  }));
  return {
    paths,
    fallback: true, // See the "fallback" section below
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  let params = context.params;
  if (params === undefined || params.username === undefined) {
    return {
      props: {
        publishedPosts: [],
      },
    };
  }
  let username = params.username as string;
  let posts = await getArticlesFromUsername(username);
  return {
    props: {
      unstable_revalidate: 1,
      publishedPosts: posts,
      username: username,
    },
  };
};

type PostType = {
  createdAt: Date;
  uid: string;
  title: string;
  postId: string;
  id: string;
};

type UserPageProps = {
  publishedPosts: PostType[];
  username: string;
};

const UserPage = (props: UserPageProps) => {
  const [currentStep, updateStep] = useState(0);
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  let posts = props.publishedPosts;
  return (
    <div className="container">
      <Head>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={profileStyles["Content"]}>
          <h1 className={profileStyles["Header"]}>{props.username}</h1>
          {posts.map((post) => (
            <Post
              title={post.title}
              postId={post.postId}
              username={props.username}
              key={post.postId}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

function Post(props: { title: string; postId: string; username: string }) {
  let router = useRouter();

  function goToPost() {
    router.push(
      "/[username]/[postId]",
      "/" + props.username + "/" + props.postId
    );
  }

  return (
    <div onClick={goToPost} className={profileStyles["Post"]}>
      <div className={profileStyles["Title"]}>
        <h1>{props.title}</h1>
      </div>
    </div>
  );
}

export default UserPage;
