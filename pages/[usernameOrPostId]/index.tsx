import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import {
  getUser,
  getUserDataFromUsername,
  getCustomDomainByUsername,
  getFollowingFromUid,
} from "../../lib/userUtils";
import UserContent from "../../components/UserPage/UserPage";
import { UserPageProps } from "../../typescript/types/backend/userTypes";
import { PostPageProps } from "../../typescript/types/frontend/postTypes";
import { getPostDataFromPostIdAndDomain } from "../../lib/postUtils";
import FinishedPost from "../../components/FinishedPost";
import { isHostCustomDomain } from "../../lib/api/useHost";

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  params,
}) => {
  let host = req.headers.host || "";
  if (!params) {
    return {
      notFound: true,
    };
  }
  let usernameOrPostId = params.usernameOrPostId as string;
  // if request is not from custom domain
  if (!isHostCustomDomain(host)) {
    let userHost = await getCustomDomainByUsername(usernameOrPostId);
    if (userHost !== "") {
      res.statusCode = 302;
      let userPageProps = await getUserDataFromUsername(
        usernameOrPostId,
        false
      );
      let finalProps: PostOrUserPageProps = {
        userPage: true,
        ...userPageProps,
      };
      res.setHeader("Location", `https://${userHost}`); // Replace <link> with your url link
      return { props: finalProps };
    }

    let userPageProps = await getUserDataFromUsername(usernameOrPostId, false);
    if (userPageProps.errored) {
      return {
        notFound: true,
      };
    }
    let finalProps: PostOrUserPageProps = { userPage: true, ...userPageProps };
    return {
      props: finalProps,
    };
  } else {
    try {
      let postPageProps = await getPostDataFromPostIdAndDomain(
        host,
        usernameOrPostId,
        true
      );
      let finalProps: PostOrUserPageProps = {
        userPage: false,
        ...postPageProps,
      };
      return {
        props: finalProps,
      };
    } catch (err) {
      return { notFound: true };
    }
  }
};

type PostOrUserPageProps = {
  userPage: boolean;
  userHost: string;
} & (UserPageProps | PostPageProps);

export default function PostOrUserPage(props: PostOrUserPageProps) {
  const { userPage, userHost } = props;
  const onCustomDomain = isHostCustomDomain(userHost);
  let correctTitle: string;
  let correctProps;
  if (userPage) {
    correctProps = props as UserPageProps;
    correctTitle = `${correctProps.profileUsername}'s Leaf`;
  } else {
    correctProps = props as PostPageProps;
    correctTitle = correctProps.title;
  }

  const {
    title,
    postContent,
    files,
    username,
    profileImage,
    tags,
    likes,
    publishedAtSeconds,
  } = props as PostPageProps;

  const {
    profileUsername,
    profileData,
    errored,
    uid,
    posts,
  } = props as UserPageProps;

  return (
    <div className="container">
      <Head>
        <title>{correctTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {userPage ? (
          <UserContent
            profileUsername={profileUsername}
            profileData={profileData}
            errored={errored}
            uid={uid}
            posts={posts}
            userHost={userHost}
            onCustomDomain={onCustomDomain}
          />
        ) : (
          <FinishedPost
            title={title}
            postContent={postContent}
            tags={tags}
            files={files}
            likes={likes}
            username={username}
            profileImage={profileImage}
            previewMode={false}
            published={true}
            publishedAtSeconds={publishedAtSeconds}
            publishedView={true}
            userHost={userHost}
            onCustomDomain={onCustomDomain}
          />
        )}
      </main>
    </div>
  );
}
