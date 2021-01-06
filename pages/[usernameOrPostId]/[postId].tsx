import React, { useEffect } from "react";
import { GetStaticProps, GetServerSideProps } from "next";
import Head from "next/head";
import FinishedPost from "../../components/FinishedPost";
import { getAllPosts } from "../../lib/api/publishPost";
import {
  getUsernameFromUid,
  getUidFromUsername,
  getProfileData,
} from "../../lib/userUtils";

import {
  getDraftDataFromPostId,
  getPostDataFromPostIdAndUsername,
} from "../../lib/postUtils";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import ErroredPage from "../404";
import { File, Step, timeStamp } from "../../typescript/types/app_types";
import {
  contentBlock,
  fileObject,
  PostPageProps,
} from "../../typescript/types/frontend/postTypes";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    let host = context.req.headers.host || "";
    // if default return post data
    if (host === "localhost:3000" || host === "getleaf.app") {
      let username = (context.params?.usernameOrPostId || "") as string;
      let postId = (context.params?.postId || "") as string;

      let finalProps: PostPageProps = await getPostDataFromPostIdAndUsername(
        username,
        postId
      );
      return {
        props: finalProps,
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (err) {
    return {
      notFound: true,
    };
  }
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
