import React, { useState } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Scrolling from "../../components/Scrolling";
import PublishedCodeEditor from "../../components/PublishedCodeEditor";
import { getAllPosts } from "../../lib/api/publishPost";
import { getUsernameFromUid } from "../../lib/userUtils";
import { getStepsFromPost, getPostData } from "../../lib/postUtils";
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

const stepsInView: { [stepIndex: number]: boolean } = {};

const Post = (props: UserPageProps) => {
  const [currentStep, updateStep] = useState(0);
  const router = useRouter();

  function changeStep(newStep: number, yPos: number, entered: boolean) {
    // stepsInView keeps track of what steps are inside the viewport
    stepsInView[newStep] = entered;

    /* whichever step is the closest to the top of the viewport 
    AND is inside the viewport becomes the selected step */
    for (let step in stepsInView) {
      if (stepsInView[step]) {
        updateStep(Number(step));
        break;
      }
    }
  }

  return (
    <div className="container">
      <Head>
        <title>User Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Scrolling
            currentStep={currentStep}
            changeStep={changeStep}
            steps={props.steps}
            title={props.title}
          />
          <PublishedCodeEditor currentStep={currentStep} />
        </div>
      </main>
    </div>
  );
};

export default Post;
