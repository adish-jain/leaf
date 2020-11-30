import React, { useState, Component } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { getUserPosts, getUidFromUsername } from "../../lib/userUtils";
import { useLoggedIn } from "../../lib/UseLoggedIn";
import profileStyles from "../../styles/profile.module.scss";
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
        publishedPosts: publishedPosts,
        username: username,
        errored: false,
      },
      revalidate: 1,
    };
  } catch {
    return {
      props: {
        errored: true,
      },
      revalidate: 1
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
        <title>{props.username}'s Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {authenticated ? (
          <Header profile={false} explore={true} settings={true} logout={true} />
        ) : (
          <HeaderUnAuthenticated />
        )}
        <div className={"profile-content"}>
          <h1 className={"profile-header"}>{props.username}</h1>
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
    router.push(
      "/[username]/[postId]",
      "/" + props.username + "/" + props.postId
    );
  }

  return (
    <div onClick={goToPost} className={"user-post"}>
      <div className={"user-title"}>
        <h1>{props.title}</h1>
      </div>
    </div>
  );
}

export default UserPage;
