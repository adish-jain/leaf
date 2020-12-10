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
import imageStyles from "../../styles/imageview.module.scss";
import Header, { HeaderUnAuthenticated } from "../../components/Header";
import ErroredPage from "../404";
import { Post } from "../../typescript/types/app_types";
import { useUserInfo } from "../../lib/useUserInfo";
import { motion, AnimatePresence } from "framer-motion";
const dayjs = require("dayjs");
import TextareaAutosize from "react-autosize-textarea";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // See the "fallback" section below
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
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

type UserPageProps = {
  profileUsername: string;
  profileData: any;
  errored: boolean;
  uid: string;
  posts: Post[];
};

async function saveProfileImage(
  selectedImage: File,
  changeProfileImage: React.Dispatch<React.SetStateAction<string>>
) {
  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  let data = {
    requestedAPI: "saveProfileImage",
    imageFile: await toBase64(selectedImage),
  };

  await fetch("/api/endpoint", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  })
    .then(async (res: any) => {
      let resJSON = await res.json();
      let url = resJSON.url;
      changeProfileImage(url);
    })
    .catch((error: any) => {
      console.log(error);
      console.log("upload failed.");
    });
}

function handleProfileImageUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  changeUploadFailed: React.Dispatch<React.SetStateAction<boolean>>,
  changeProfileImage: React.Dispatch<React.SetStateAction<string>>
) {
  let selectedImage = e.target.files![0];
  if (selectedImage.size > 5000000) {
    changeUploadFailed(true);
  } else {
    saveProfileImage(selectedImage, changeProfileImage);
    changeUploadFailed(false);
  }
}

async function handleProfileImageDelete(
  changeProfileImage: React.Dispatch<React.SetStateAction<string>>
) {
  let data = {
    requestedAPI: "deleteProfileImage",
  };

  //optimistic mutate
  changeProfileImage("");

  await fetch("/api/endpoint", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  }).then(async (res: any) => {});
}

function validateWebsite(websiteURL: string): string {
  var match = websiteURL.match(
    /^(http|https|ftp)?(?:[\:\/]*)([a-z0-9\.-]*)(?:\:([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i
  );
  let protocol = match![1];
  if (protocol === undefined) {
    websiteURL = "http://" + websiteURL;
  }
  return websiteURL;
}

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

  return (
    <div className="container">
      <Head>
        <title>{props.profileUsername}'s Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {authenticated ? (
          <Header
            profile={false}
            explore={true}
            settings={true}
            logout={true}
          />
        ) : (
          <HeaderUnAuthenticated signup={true} login={true} explore={true} />
        )}
        <h1 className={profileStyles["profile-header"]}></h1>
        <div className={profileStyles["profile-content"]}>
          <div className={profileStyles["profile-left-pane"]}>
            {canEditBio ? (
              <AnimatePresence>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <EditableProfileImage
                    profileImage={profileImage}
                    profileUsername={props.profileUsername}
                    uploadFailed={uploadFailed}
                    changeUploadFailed={changeUploadFailed}
                    changeProfileImage={changeProfileImage}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <UneditableProfileImage
                    profileImage={profileImage}
                    profileUsername={props.profileUsername}
                  />
                </motion.div>
              </AnimatePresence>
            )}
            <div className={profileStyles["profile-name"]}>
              {props.profileUsername}
            </div>
            <AnimatePresence>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <About
                  editingBio={editingBio}
                  canEditBio={canEditBio}
                  about={about}
                  twitter={twitter}
                  github={github}
                  website={website}
                  changeAbout={changeAbout}
                  changeTwitter={changeTwitter}
                  changeGithub={changeGithub}
                  changeWebsite={changeWebsite}
                  toggleEditingBio={toggleEditingBio}
                  saveNewProfile={saveNewProfile}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={profileStyles["profile-right-pane"]}>
            {
              <AnimatePresence>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <DisplayPosts
                    posts={props.posts}
                    username={props.profileUsername}
                  />
                </motion.div>
              </AnimatePresence>
            }
          </div>
        </div>
      </main>
    </div>
  );
}

function EditableProfileImage(props: {
  profileImage: string;
  profileUsername: string;
  uploadFailed: boolean;
  changeUploadFailed: React.Dispatch<React.SetStateAction<boolean>>;
  changeProfileImage: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-img"]}>
      <div className={profileStyles["profile-img-wrapper"]}>
        {props.profileImage === "" ? (
          props.profileUsername !== undefined ? (
            props.profileUsername.substr(0, 2)
          ) : (
            ""
          )
        ) : (
          <img src={props.profileImage} />
        )}
      </div>
      <div className={profileStyles["profile-img-shade"]}></div>
      <div className={profileStyles["profile-img-button"]}>
        <label className={imageStyles["add-image"]}>
          {props.uploadFailed ? "Try Image < 5MB" : "Upload Photo"}
          <input
            type="file"
            id="myFile"
            name="filename"
            accept="image/*"
            onChange={(e) =>
              handleProfileImageUpload(
                e,
                props.changeUploadFailed,
                props.changeProfileImage
              )
            }
          />
        </label>
        {props.profileImage !== "" && (
          <label
            className={imageStyles["add-image"]}
            onClick={(e) => handleProfileImageDelete(props.changeProfileImage)}
          >
            Delete Photo
          </label>
        )}
      </div>
    </div>
  );
}

function UneditableProfileImage(props: {
  profileImage: string;
  profileUsername: string;
}) {
  return (
    <div className={profileStyles["profile-img-uneditable"]}>
      {props.profileImage === "" ? (
        props.profileUsername !== undefined ? (
          props.profileUsername.substr(0, 2)
        ) : (
          ""
        )
      ) : (
        <img src={props.profileImage} />
      )}
    </div>
  );
}

function About(props: {
  editingBio: boolean;
  canEditBio: boolean;
  about: string;
  twitter: string;
  github: string;
  website: string;
  changeAbout: React.Dispatch<React.SetStateAction<string>>;
  changeTwitter: React.Dispatch<React.SetStateAction<string>>;
  changeGithub: React.Dispatch<React.SetStateAction<string>>;
  changeWebsite: React.Dispatch<React.SetStateAction<string>>;
  toggleEditingBio: React.Dispatch<React.SetStateAction<boolean>>;
  saveNewProfile: () => Promise<void>;
}) {
  return (
    <div>
      <div className={profileStyles["profile-about-header"]}>ABOUT</div>
      <AboutSection
        editingBio={props.editingBio}
        about={props.about}
        changeAbout={props.changeAbout}
      />
      <div className={profileStyles["profile-about-icons"]}>
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <TwitterSection
              editingBio={props.editingBio}
              twitter={props.twitter}
              changeTwitter={props.changeTwitter}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <GithubSection
              editingBio={props.editingBio}
              github={props.github}
              changeGithub={props.changeGithub}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
            }}
          >
            <WebsiteSection
              editingBio={props.editingBio}
              website={props.website}
              changeWebsite={props.changeWebsite}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <EditProfileButton
            editingBio={props.editingBio}
            canEditBio={props.canEditBio}
            toggleEditingBio={props.toggleEditingBio}
            saveNewProfile={props.saveNewProfile}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AboutSection(props: {
  editingBio: boolean;
  about: string;
  changeAbout: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-about-content"]}>
      {props.editingBio ? (
        <div className={profileStyles["about-icon-and-input"]}>
          <AnimatePresence>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <TextareaAutosize
                placeholder={"About yourself"}
                value={props.about}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  let myTarget = e.target as HTMLTextAreaElement;
                  let myTargetConstrained = myTarget.value.replace(
                    /[\r\n\v]+/g,
                    ""
                  );
                  props.changeAbout(myTargetConstrained);
                }}
                style={{
                  fontSize: "15px",
                  color: "D0D0D0",
                }}
                maxLength={250}
                name="title"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        props.about
      )}
    </div>
  );
}

function TwitterSection(props: {
  editingBio: boolean;
  twitter: string;
  changeTwitter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return props.editingBio ? (
    <EditingTwitterSection
      twitter={props.twitter}
      changeTwitter={props.changeTwitter}
    />
  ) : (
    <SavedTwitterSection twitter={props.twitter} />
  );
}

function EditingTwitterSection(props: {
  twitter: string;
  changeTwitter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-icon-and-input"]}>
      <img src="/images/birdyicon.svg" />
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <TextareaAutosize
            placeholder={"Twitter Handle"}
            value={props.twitter}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              let myTarget = e.target as HTMLTextAreaElement;
              props.changeTwitter(myTarget.value);
            }}
            style={{
              fontSize: "15px",
              color: "D0D0D0",
            }}
            name="twitter"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SavedTwitterSection(props: { twitter: string }) {
  return props.twitter !== "" ? (
    <div className={profileStyles["profile-icon-and-link"]}>
      <a href={"https://twitter.com/" + props.twitter} target="blank">
        <img src="/images/birdyicon.svg" />
      </a>
      <a href={"https://twitter.com/" + props.twitter} target="blank">
        <p>{props.twitter}</p>
      </a>
    </div>
  ) : (
    <div></div>
  );
}

function GithubSection(props: {
  editingBio: boolean;
  github: string;
  changeGithub: React.Dispatch<React.SetStateAction<string>>;
}) {
  return props.editingBio ? (
    <EditingGithubSection
      github={props.github}
      changeGithub={props.changeGithub}
    />
  ) : (
    <SavedGithubSection github={props.github} />
  );
}

function EditingGithubSection(props: {
  github: string;
  changeGithub: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-icon-and-input"]}>
      <img src="/images/githubicon.svg" />
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <TextareaAutosize
            placeholder={"Github Username"}
            value={props.github}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              let myTarget = e.target as HTMLTextAreaElement;
              props.changeGithub(myTarget.value);
            }}
            style={{
              fontSize: "15px",
              color: "D0D0D0",
            }}
            name="github"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SavedGithubSection(props: { github: string }) {
  return props.github !== "" ? (
    <div className={profileStyles["profile-icon-and-link"]}>
      <a href={"https://github.com/" + props.github} target="blank">
        <img src="/images/githubicon.svg" />
      </a>
      <a href={"https://github.com/" + props.github} target="blank">
        <p>{props.github}</p>
      </a>
    </div>
  ) : (
    <div></div>
  );
}

function WebsiteSection(props: {
  editingBio: boolean;
  website: string;
  changeWebsite: React.Dispatch<React.SetStateAction<string>>;
}) {
  return props.editingBio ? (
    <EditingWebsiteSection
      website={props.website}
      changeWebsite={props.changeWebsite}
    />
  ) : (
    <SavedWebsiteSection website={props.website} />
  );
}

function EditingWebsiteSection(props: {
  website: string;
  changeWebsite: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={profileStyles["profile-icon-and-input"]}>
      <img src="/images/webicon.svg" />
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <TextareaAutosize
            placeholder={"Personal Website"}
            value={props.website}
            onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
              let myTarget = e.target as HTMLTextAreaElement;
              props.changeWebsite(myTarget.value);
            }}
            style={{
              fontSize: "15px",
              color: "D0D0D0",
            }}
            name="website"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SavedWebsiteSection(props: { website: string }) {
  return props.website !== "" ? (
    <div className={profileStyles["profile-icon-and-link"]}>
      <a href={validateWebsite(props.website)} target="blank">
        <img src="/images/webicon.svg" />
      </a>
      <a href={validateWebsite(props.website)} target="blank">
        <p>{props.website}</p>
      </a>
    </div>
  ) : (
    <div></div>
  );
}

function EditProfileButton(props: {
  editingBio: boolean;
  canEditBio: boolean;
  toggleEditingBio: React.Dispatch<React.SetStateAction<boolean>>;
  saveNewProfile: () => Promise<void>;
}) {
  return props.canEditBio ? (
    props.editingBio ? (
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <div
            className={profileStyles["profile-edit-button"]}
            onClick={(e) => {
              props.toggleEditingBio(!props.editingBio);
              props.saveNewProfile();
            }}
          >
            Save Profile
          </div>
        </motion.div>
      </AnimatePresence>
    ) : (
      <div
        className={profileStyles["profile-edit-button"]}
        onClick={(e) => props.toggleEditingBio(!props.editingBio)}
      >
        Edit Profile
      </div>
    )
  ) : (
    <div></div>
  );
}

function DisplayPosts(props: { posts: Post[]; username: string }) {
  try {
    const router = useRouter();
    return (
      <div>
        {props.posts === undefined || props.posts.length === 0 ? (
          <div className={profileStyles["profile-no-posts"]}>
            {props.username} hasn't published anything yet
          </div>
        ) : (
          <div>
            {Array.from(props.posts).map((post: Post) => {
              const tags =
                post["tags"] === null ? null : String(post["tags"]).split(",");
              return (
                <div
                  className={profileStyles["profile-post"]}
                  onClick={() => router.push(post["postURL"])}
                >
                  <div className={profileStyles["profile-post-title"]}>
                    {post["title"]}
                  </div>
                  <div className={profileStyles["profile-post-date"]}>
                    {post["publishedAt"]}
                  </div>
                  <div className={profileStyles["profile-post-tags-author"]}>
                    {tags !== null ? (
                      tags.map((tag: string) => {
                        return (
                          <div className={profileStyles["profile-post-tag"]}>
                            {tag}
                          </div>
                        );
                      })
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch {
    console.log("error fetching posts");
    return (
      <div>
        <h3>Error Fetching Posts</h3>
      </div>
    );
  }
}
