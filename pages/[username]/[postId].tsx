import React, { useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import FinishedPost from "../../components/FinishedPost";
import { getAllPosts } from "../../lib/api/publishPost";
import { getUsernameFromUid } from "../../lib/userUtils";
import { getDraftDataFromPostId } from "../../lib/postUtils";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import ErroredPage from "../404";
import { File, Step } from "../../typescript/types/app_types";

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
  try {
    let postData = await getDraftDataFromPostId(username, postId);
    let steps = postData.steps;
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
      if (steps[i].imageURL === undefined || steps[i].imageURL === null) {
        steps[i].imageURL = null;
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
        username,
      },
    };
  } catch (error) {
    return {
      revalidate: 1,
      props: {
        errored: true,
      },
    };
  }
};

type PostPageProps = {
  steps: Step[];
  title: string;
  errored: boolean;
  files: File[];
  username: string;
};

const Post = (props: PostPageProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (props.errored) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div className="container">
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <FinishedPost
          username={props.username}
          steps={props.steps}
          files={props.files}
          title={props.title}
          previewMode={false}
        />
      </main>
    </div>
  );
};

export default Post;
