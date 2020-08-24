import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../../components/Scrolling";
import { getUserPosts, getUidFromUsername } from "../../lib/userUtils";
import { goToLanding, useLoggedIn } from "../../lib/UseLoggedIn";
import getUsernames from "../../lib/api/getUsernames";
const profileStyles = require("../../styles/Profile.module.scss");
import Header, { HeaderUnAuthenticated } from "../../components/Header";
import ErroredPage from "../404";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // See the "fallback" section below
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  let params = context.params;
  if (params === undefined || params.username === undefined) {
    return {
      revalidate: 1,
      props: {
        publishedPosts: [],
        errored: true,
      },
    };
  }
  let username = params.username as string;
  let uid: string;
  try {
    uid = await getUidFromUsername(username);
    let posts = await getUserPosts(uid);
    let publishedPosts = [];
    for (let i = 0; i < posts.length; i++) {
      let currentPost = posts[i];
      publishedPosts.push({
        uid: uid,
        title: currentPost.title,
        postId: currentPost.postId,
        id: currentPost.id,
        published: currentPost.published,
      });
    }
    return {
      props: {
        revalidate: 1,
        publishedPosts: publishedPosts,
        username: username,
        errored: false,
      },
    };
  } catch {
    return {
      props: {
        errored: true,
      },
    };
  }
};

type PostType = {
  createdAt: Date;
  publishedat: Date;
  uid: string;
  title: string;
  postId: string;
  id: string;
  published: boolean;
};

type UserPageProps = {
  publishedPosts: PostType[];
  username: string;
  errored: boolean;
};

const UserPage = (props: UserPageProps) => {
  const [currentStep, updateStep] = useState(0);
  const { authenticated, error, loading } = useLoggedIn();
  const router = useRouter();

  if (props.errored) {
    return <ErroredPage />;
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  let posts = props.publishedPosts;
  return (
    <div className="container">
      <Head>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {authenticated ? (
          <Header profile={false} settings={true} />
        ) : (
          <HeaderUnAuthenticated />
        )}
        <div className={profileStyles["Content"]}>
          <h1 className={profileStyles["Header"]}>{props.username}</h1>
          {posts.length === 0 ? (
            <p>This user has not published anything yet.</p>
          ) : (
            <div></div>
          )}
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
    console.log("called");
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
