import React from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import FinishedPost from "../../components/FinishedPost";
import { getAllPosts } from "../../lib/api/publishPost";
import { getUsernameFromUid } from "../../lib/userUtils";
import { getDraftDataFromPostId } from "../../lib/postUtils";
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
      revalidate: 1,
      props: {
        steps: [],
      },
    };
  }

  let username = context.params.username as string;
  let postId = context.params.postId as string;
  let postData = await getDraftDataFromPostId(username, postId);
  let steps = postData.optimisticSteps;
  let files = postData.files;
  let title = postData.title;
  let errored = postData.errored;

  // replace undefineds with null to prevent nextJS errors
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].lines === undefined || steps[i].lines === null) {
      steps[i].lines = null;
      steps[i].fileId = null;
      // to be deprecated
    }
    steps[i].fileName = null;
  }

  return {
    revalidate: 1,
    props: {
      steps,
      title,
      files,
      errored,
    },
  };
};

type StepType = {
  text: string;
  id: string;
  fileName: string;
  fileId: string;
  lines: { start: number; end: number };
};

type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

type UserPageProps = {
  steps: StepType[];
  title: string;
  errored: boolean;
  files: File[];
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
          <FinishedPost
            steps={props.steps}
            files={props.files}
            title={props.title}
          />
        )}
      </main>
    </div>
  );
};

export default Post;
