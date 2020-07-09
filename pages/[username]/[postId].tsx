import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import FinishedPost from "../../components/FinishedPost";
import { getAllPosts } from "../../lib/api/publishPost";
import { getUsernameFromUid } from "../../lib/userUtils";
import { getPostData } from "../../lib/postUtils";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // See the "fallback" section below
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (context === undefined || context.params === undefined) {
    return {
      unstable_revalidate: 1,
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
  let errored = postData.errored;
  return {
    unstable_revalidate: 1,
    props: {
      steps,
      title,
      errored,
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
  errored: boolean;
};

const Post = (props: UserPageProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Head>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {props.errored ? (
          <DefaultErrorPage statusCode={404} />
        ) : (
          <FinishedPost steps={props.steps} title={props.title} />
        )}
      </main>
    </div>
  );
};

export default Post;
