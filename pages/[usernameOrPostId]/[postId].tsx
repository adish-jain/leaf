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
  handlePostIdDevelopment,
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

// if in development,
// if local host
// show postId page
// if ngrok
// ERROR
// if other
// ERROR

// if in production,
// if getleaf.app
// show postId page
// if custom domain
// ERROR
// if other
// ERROR

// if in preview, check if url has vercel, redirect to errored page

// if in production, default is getleaf.app with postId,

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   let host = context.req.headers.host || "";

//   if (host === "localhost:3000" || "getleaf.app") {
//     return {

//     }
//   }
//   // console.log(context.req.headers.host);
//   if (process.env.NODE_ENV === "development") {
//     let returnProps = await handlePostIdDevelopment(host, context);
//     if (returnProps.errored) {
//       return {
//         notFound: true
//       }
//     }
//   }
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// };

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
    // console.log(postData);

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
