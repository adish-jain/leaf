import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  getUserPosts,
  getUidFromUsername,
  getProfileData,
} from "../../lib/userUtils";
import { useLoggedIn } from "../../lib/UseLoggedIn";
import appStyles from "../../styles/app.module.scss";
import profileStyles from "../../styles/profile.module.scss";
import Header, { HeaderUnAuthenticated } from "../../components/Header";
import ErroredPage from "../404";
import { Post, UserPageProps } from "../../typescript/types/app_types";
import { useUserInfo } from "../../lib/useUserInfo";
import { motion, AnimatePresence } from "framer-motion";
const dayjs = require("dayjs");
import TextareaAutosize from "react-autosize-textarea";
import UserContent from "../../components/UserPage";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // See the "fallback" section below
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context);
  let params = context.params;
  if (params === undefined || params.username === undefined) {
    return {
      revalidate: 1,
      props: {
        publishedPosts: [],
        errored: true,
      },
    };
  }
  let username = params.username as string;
  let uid: string;
  try {
    uid = await getUidFromUsername(username);
    let posts = await getUserPosts(uid);
    let profileData = await getProfileData(uid);
    let publishedPosts = [];
    for (let i = 0; i < posts.length; i++) {
      let currentPost = posts[i];
      publishedPosts.push({
        title: currentPost.title,
        postId: currentPost.postId,
        postURL: "/" + username + "/" + currentPost.postId,
        publishedAt: dayjs(currentPost.publishedAt).format("MMMM D YYYY"),
        tags:
          currentPost.tags !== undefined ? currentPost.tags.join(",") : null,
      });
    }
    return {
      props: {
        profileUsername: username,
        profileData: profileData,
        uid: uid,
        posts: publishedPosts,
        errored: false,
      },
      revalidate: 1,
    };
  } catch {
    return {
      props: {
        errored: true,
      },
      revalidate: 1,
    };
  }
};

export default function UserPage(props: UserPageProps) {
  const [editingBio, toggleEditingBio] = useState(false);
  const [canEditBio, toggleCanEditBio] = useState(false);
  const [profileImage, changeProfileImage] = useState("");
  const [uploadFailed, changeUploadFailed] = useState(false);
  const { authenticated, error, loading } = useLoggedIn();
  const {
    username,
    about,
    twitter,
    github,
    website,
    changeAbout,
    changeTwitter,
    changeGithub,
    changeWebsite,
    saveNewProfile,
  } = useUserInfo(authenticated);

  useEffect(() => {
    toggleCanEditBio(username === props.profileUsername);
  }, [username, props.profileUsername]);

  useEffect(() => {
    if (props.profileData !== undefined) {
      props.profileData.about !== undefined
        ? changeAbout(props.profileData.about)
        : changeAbout(props.profileUsername + " hasn't written a bio");
      props.profileData.twitter !== undefined
        ? changeTwitter(props.profileData.twitter)
        : null;
      props.profileData.github !== undefined
        ? changeGithub(props.profileData.github)
        : null;
      props.profileData.website !== undefined
        ? changeWebsite(props.profileData.website)
        : null;
      props.profileData.profileImage !== undefined
        ? changeProfileImage(props.profileData.profileImage)
        : "";
    }
  }, [props.profileData]);

  const { profileUsername, profileData, errored, uid, posts } = props;

  return (
    <div className="container">
      <Head>
        <title>{props.profileUsername}'s Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <UserContent
          profileUsername={profileUsername}
          profileData={profileData}
          errored={errored}
          uid={uid}
          posts={posts}
        />
      </main>
    </div>
  );
}
