import React, { useState, useEffect } from "react";
import { GetStaticProps, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  getUserPosts,
  getUidFromUsername,
  getProfileData,
  getUserDataFromUsername,
  getCustomDomainByUsername,
} from "../../lib/userUtils";
import { useLoggedIn } from "../../lib/UseLoggedIn";
import appStyles from "../../styles/app.module.scss";
import profileStyles from "../../styles/profile.module.scss";
import Header, { HeaderUnAuthenticated } from "../../components/Header";
import ErroredPage from "../404";
import { Post } from "../../typescript/types/app_types";
import { useUserInfo } from "../../lib/useUserInfo";
import { motion, AnimatePresence } from "framer-motion";
const dayjs = require("dayjs");
import TextareaAutosize from "react-autosize-textarea";
import UserContent from "../../components/UserPage/UserPage";
import { UserPageProps } from "../../typescript/types/backend/userTypes";
import { PostPageProps } from "../../typescript/types/frontend/postTypes";
import { getPostDataFromPostIdAndDomain } from "../../lib/postUtils";
import FinishedPost from "../../components/FinishedPost";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let host = context.req.headers.host || "";
  if (!context.params) {
    return {
      notFound: true,
    };
  }
  let usernameOrPostId = context.params.usernameOrPostId as string;
  // if default return profile page page
  if (host === "getleaf.app" || host === "localhost:3000") {
    let hasCustomDomain = await getCustomDomainByUsername(usernameOrPostId);
    if (hasCustomDomain !== "") {
      return {
        notFound: true,
      };
    }

    let userPageProps = await getUserDataFromUsername(usernameOrPostId);
    console.log(userPageProps);
    let finalProps: PostOrUserPageProps = { userPage: true, ...userPageProps };
    return {
      props: finalProps,
    };
  } else {
    try {
      let postPageProps = await getPostDataFromPostIdAndDomain(
        host,
        usernameOrPostId
      );
      let finalProps: PostOrUserPageProps = {
        userPage: false,
        customDomain: true,
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

type PostOrUserPageProps = { userPage: boolean; customDomain: boolean } & (
  | UserPageProps
  | PostPageProps
);

export default function PostOrUserPage(props: PostOrUserPageProps) {
  const { userPage } = props;

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
    customDomain,
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
            customDomain={customDomain}
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
            customDomain={customDomain}
          />
        )}
      </main>
    </div>
  );
}
