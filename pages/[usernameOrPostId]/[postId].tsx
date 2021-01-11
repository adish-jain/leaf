import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import FinishedPost from "../../components/FinishedPost";
import { getPostDataFromPostIdAndUsername } from "../../lib/postUtils";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import { PostPageProps } from "../../typescript/types/frontend/postTypes";

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
  const {
    title,
    postContent,
    files,
    username,
    profileImage,
    tags,
    likes,
    publishedAtSeconds,
    customDomain,
  } = props;
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
          title={title}
          postContent={postContent}
          files={files}
          username={username}
          profileImage={profileImage}
          tags={tags}
          likes={likes}
          previewMode={false}
          publishedAtSeconds={publishedAtSeconds}
          published={true}
          publishedView={true}
          customDomain={customDomain}
        />
      </main>
    </div>
  );
};

export default Post;
