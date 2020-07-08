import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import FinishedPost from "../../components/FinishedPost";
import { getAllPosts } from "../../lib/api/publishPost";
import { getUsernameFromUid } from "../../lib/userUtils";
import { getPostData } from "../../lib/postUtils";

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
  if (context === undefined || context.params === undefined) {
    return {
      props: {
        steps: [],
      },
    };
  }

  let username = context.params.username as string;
  let postId = context.params.postId as string;
  let postData = await getPostData(username, postId);
  let steps = postData.steps;
  let title = postData.title;
  return {
    props: {
      steps,
      title,
    },
  };
};

type StepType = {
  text: string;
  id: string;
};

type UserPageProps = {
  steps: StepType[];
  title: string;
};

const Post = (props: UserPageProps) => {
  return (
    <div className="container">
      <Head>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <FinishedPost steps={props.steps} title={props.title} />
      </main>
    </div>
  );
};

export default Post;
