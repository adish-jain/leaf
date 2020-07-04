import React, { useState, Component } from "react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../../components/Scrolling";
import { getArticlesFromUsername } from "../../lib/api/publishPost";
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
      publishedPosts: posts,
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
};

const UserPage = (props: UserPageProps) => {
  const [currentStep, updateStep] = useState(0);
  const router = useRouter();
  let posts = props.publishedPosts;
  console.log(posts);
  return (
    <div className="container">
      <Head>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          {posts.map((post) => (
            <div>{post.title}</div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserPage;
