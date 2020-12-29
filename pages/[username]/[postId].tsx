import React, { useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import FinishedPost from "../../components/FinishedPost";
import { getAllPosts } from "../../lib/api/publishPost";
import {
  getUsernameFromUid,
  getUidFromUsername,
  getProfileData,
} from "../../lib/userUtils";
import { getDraftDataFromPostId } from "../../lib/postUtils";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import ErroredPage from "../404";
import { File, Step, timeStamp } from "../../typescript/types/app_types";
import { ContentBlock } from "draft-js";
import {
  contentBlock,
  fileObject,
} from "../../typescript/types/frontend/postTypes";

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
    let uid = await getUidFromUsername(username);
    let profileData = await getProfileData(uid);
    let files = postData.files;
    let title = postData.title;
    let tags = postData.tags;
    let likes = postData.likes;
    let draftContent = postData.draftContent;
    let publishedAt = postData.publishedAt;
    let errored = postData.errored;
    let profileImage = profileData!.profileImage;
    // console.log(postData);
    // replace undefineds with null to prevent nextJS errors
    for (let i = 0; i < draftContent.length; i++) {
      if (
        draftContent[i].lines === undefined ||
        draftContent[i].lines === null
      ) {
        //@ts-ignore
        draftContent[i].lines = null;
        //@ts-ignore
        draftContent[i].fileId = null;
        // to be deprecated
      }
      if (draftContent[i].imageUrl === undefined) {
        //@ts-ignore
        draftContent[i].imageUrl = null;
      }
    }
    if (likes === undefined) {
      likes = 0;
    }
    if (profileImage === undefined) {
      profileImage = null;
    }
    if (tags === undefined) {
      tags = [];
    }
    return {
      revalidate: 1,
      props: {
        title,
        postContent: draftContent,
        tags,
        likes,
        files,
        errored,
        username,
        profileImage,
        publishedAtSeconds: publishedAt?._seconds || 0,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      revalidate: 1,
      props: {
        errored: true,
      },
    };
  }
};

type PostPageProps = {
  postContent: contentBlock[];
  title: string;
  tags: string[];
  likes: number;
  errored: boolean;
  files: fileObject[];
  username: string;
  profileImage: string;
  publishedAtSeconds: number;
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
        {/* <script src="https://unpkg.com/intersection-observer-debugger"></script> */}
      </Head>
      <main>
        <FinishedPost
          title={props.title}
          postContent={props.postContent}
          files={props.files}
          username={props.username}
          profileImage={props.profileImage}
          tags={props.tags}
          likes={props.likes}
          previewMode={false}
          publishedAtSeconds={props.publishedAtSeconds}
          published={true}
          publishedView={true}
        />
      </main>
    </div>
  );
};

export default Post;
