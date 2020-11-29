import React, { useState, Component, useEffect } from "react";
import useSWR from "swr";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { getUserPosts, getUidFromUsername, userNameErrorMessage, getProfileData } from "../../lib/userUtils";
import { useLoggedIn } from "../../lib/UseLoggedIn";
import "../../styles/profile.scss";
import "../../styles/imageview.scss";
import Header, { HeaderUnAuthenticated } from "../../components/Header";
import ErroredPage from "../404";
import { Post } from "../../typescript/types/app_types";
import { useUserInfo } from "../../lib/useUserInfo";
// import About from "../about";
const dayjs = require("dayjs");
import TextareaAutosize from "react-autosize-textarea";
import getProfileDataHandler from "../../lib/api/getProfileData";
import { lastEventId } from "@sentry/node";

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
        tags: currentPost.tags !== undefined ? currentPost.tags.join(",") : null,
        // tags: currentPost.tags !== undefined ? JSON.stringify(currentPost.tags) : null,
        // postId: currentPost.postId,
        // postURL: "/" + username + "/" + currentPost.postId,
        // title: currentPost.title,
        // publishedAt: currentPost.publishedAt,
        // tags: currentPost.tags,
        // likes: currentPost.likes,
        // username: username,
      });
    }
    return {
      props: {
        profileUsername: username,
        profileData: profileData,
        // about: profileData.about,
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
      revalidate: 1
    };
  }
};

// type PostType = {
//   createdAt: Date;
//   publishedat: Date;
//   uid: string;
//   title: string;
//   postId: string;
//   id: string;
//   published: boolean;
// };

type UserPageProps = {
  profileUsername: string;
  profileData: any;
  errored: boolean;
  uid: string;
  posts: any;
};

async function saveProfileImage(selectedImage: any, changeProfileImage: any) {
  const toBase64 = (file: any) =>
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
        console.log("new url is ", url);
        changeProfileImage(url);
        // mutate(optimisticSteps, false);
      })
      .catch((error: any) => {
        console.log(error);
        console.log("upload failed.");
      });
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, changeImageName: any,
  changeUpload: any, changeUploadFailed: any, changeProfileImage: any) {
  let selectedImage = e.target.files![0];
  console.log(selectedImage);

  if (selectedImage.size > 5000000) {
    changeUploadFailed(true);
  } else {
    // var url = URL.createObjectURL(selectedImage);
    saveProfileImage(selectedImage, changeProfileImage);
    changeUploadFailed(false);
  }
  changeUpload(true);
  changeImageName(selectedImage.name);
}


export default function UserPage(props: UserPageProps) {
  console.log(props.posts);
  const router = useRouter();
  // const { username } = router.query;
  // const { username } = await getStaticProps();
  const [editingBio, toggleEditingBio] = useState(false);
  const [canEditBio, toggleCanEditBio] = useState(false);
  const [profileImage, changeProfileImage] = useState("");
  const [upload, changeUpload] = useState(false);
  const [uploadFailed, changeUploadFailed] = useState(false);
  const [imageName, changeImageName] = useState("");
  
  const { authenticated, error, loading } = useLoggedIn();
  const {
    username,
    about,
    twitter,
    github,
    website,
    // newAbout,
    // newTwitter,
    // newGithub,
    // newWebsite,
    changeAbout,
    changeTwitter,
    changeGithub,
    changeWebsite,
    // changeNewAbout,
    // changeNewTwitter,
    // changeNewGithub,
    // changeNewWebsite,
    saveNewProfile,
  } = useUserInfo(authenticated);
  console.log(username);
  console.log(props.profileUsername);
  console.log(props.uid);
  console.log("PROPS PROFILE DATA");
  console.log(props.profileData);

  // console.log("Router username: " + username);
  // console.log("Props username: " + props.username);

  // const rawData = {
  //   requestedAPI: "getProfileData",
  //   uid: props.uid,
  // };

  // const myRequest = {
  //   method: "POST",
  //   headers: new Headers({ "Content-Type": "application/json" }),
  //   body: JSON.stringify(rawData),
  // };

  // const fetcher = (url: string) =>
  //   fetch("/api/endpoint", myRequest).then((res: any) => res.json());

  // const initialData: any = {
  //   about: "",
  //   email: "",
  //   github: "",
  //   twitter: "",
  //   username: "",
  //   website: "",
  // };

  // let { data: userInfo, mutate } = useSWR("getProfileData", fetcher, {
  //   initialData,
  //   revalidateOnMount: true,
  // });

  // const about = props.profileData.about;
  // const twitter = props.profileData.twitter;
  // const github = props.profileData.github;
  // const website = props.profileData.website;

  // const [filteredPosts, filterPosts] = useState(postsData);

  useEffect(() => {
    toggleCanEditBio(username === props.profileUsername);
  }, [username, props.profileUsername]);

  // useEffect(() => {
  //   console.log(props.profileData.about);
  //   changeAbout(props.profileData.about);
  //   // changeTwitter(props.profileData.twitter);
  //   // changeGithub(props.profileData.github);
  //   // changeWebsite(props.profileData.website);
  // }, [props.profileData.about]);

  useEffect(() => {
    console.log("IN USE EFFECT");
    console.log(props.profileData);
    if (props.profileData !== undefined) {
      props.profileData.about !== undefined ? changeAbout(props.profileData.about) : changeAbout("404, About not found");
      props.profileData.twitter !== undefined ? changeTwitter(props.profileData.twitter) : null;
      props.profileData.github !== undefined ? changeGithub(props.profileData.github) : null;
      props.profileData.website !== undefined ? changeWebsite(props.profileData.website) : null;
      props.profileData.profileImage !== undefined ? changeProfileImage(props.profileData.profileImage) : "";
    }
    
    // changeGithub(props.profileData.github);
    // changeWebsite(props.profileData.website);
  }, [props.profileData]);

  return (
    <div className="container">
      <Head>
        <title>{props.profileUsername}'s Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {authenticated ? (
          <Header profile={false} explore={true} settings={true} logout={true} />
        ) : (
          <HeaderUnAuthenticated />
        )}
        <h1 className={"profile-header"}></h1>
        <div className={"profile-content"}>
          <div className={"profile-left-pane"}>
          {canEditBio ? 
            (<div className={"profile-img"}>
              {profileImage === "" ? 
                (props.profileUsername !== undefined ? props.profileUsername.substr(0,2) : "")
                : 
                (<img src={profileImage}/>)
              }
              <div className={"profile-img-shade"}></div>
              <div className={"profile-img-button"}>
                <label className={"add-image"}>
                  Upload Photo
                  <input
                    type="file"
                    id="myFile"
                    name="filename"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, changeImageName, changeUpload, changeUploadFailed, changeProfileImage)}
                  />
                </label>
              </div>
            </div>) 
            : 
            (
            <div className={"profile-img-uneditable"}>
              {profileImage === "" ? 
                (props.profileUsername !== undefined ? props.profileUsername.substr(0,2) : "")
                : 
                (<img src={profileImage}/>)
              }
            </div>
            )
            }
            <div className={"profile-name"}>{props.profileUsername}</div>
              <About
                editingBio={editingBio}
                canEditBio={canEditBio}
                // profileData={props.profileData}
                about={about}
                twitter={twitter}
                github={github}
                website={website}
                changeAbout={changeAbout}
                changeTwitter={changeTwitter}
                changeGithub={changeGithub}
                changeWebsite={changeWebsite}
                // newAbout={newAbout}
                // newTwitter={newTwitter}
                // newGithub={newGithub}
                // newWebsite={newWebsite}
                toggleEditingBio={toggleEditingBio}
                // changeNewAbout={changeNewAbout}
                // changeNewTwitter={changeNewTwitter}
                // changeNewGithub={changeNewGithub}
                // changeNewWebsite={changeNewWebsite}
                saveNewProfile={saveNewProfile}
              />
            </div>
          <div className={"profile-right-pane"}>
             {// @ts-ignore 
            <DisplayPosts posts={props.posts} username={props.profileUsername}/>
             }
          </div>
          {/* {posts.length === 0 ? (
            <p>This user has not published anything yet.</p>
          ) : (
            <div></div>
          )} */}
          {/* {posts.map((post) => (
            <Post
              title={post.title}
              postId={post.postId}
              username={props.username}
              key={post.postId}
            />
          ))} */}
        </div>
      </main>
    </div>
  )
}

function About(props: {
  editingBio: boolean,
  canEditBio: boolean,
  // profileData: any;
  about: string,
  twitter: string,
  github: string,
  website: string,
  changeAbout: React.Dispatch<React.SetStateAction<string>>,
  changeTwitter: React.Dispatch<React.SetStateAction<string>>,
  changeGithub: React.Dispatch<React.SetStateAction<string>>,
  changeWebsite: React.Dispatch<React.SetStateAction<string>>,
  // newAbout: string,
  // newTwitter: string,
  // newGithub: string,
  // newWebsite: string,
  toggleEditingBio: React.Dispatch<React.SetStateAction<boolean>>,
  // changeNewAbout: React.Dispatch<React.SetStateAction<string>>,
  // changeNewTwitter: React.Dispatch<React.SetStateAction<string>>,
  // changeNewGithub: React.Dispatch<React.SetStateAction<string>>,
  // changeNewWebsite: React.Dispatch<React.SetStateAction<string>>,
  saveNewProfile: any,
}) {
  // if (props.profileData !== undefined) {
  //   props.changeAbout(props.profileData.about); 
  //   props.changeTwitter(props.profileData.twitter); 
  //   props.changeGithub(props.profileData.github); 
  //   props.changeWebsite(props.profileData.website); 
  //   // props.changeNewAbout(props.about);
  //   // props.changeNewTwitter(props.twitter);
  //   // props.changeNewGithub(props.github);
  //   // props.changeNewWebsite(props.website);
  // }
  // const about = props.profileData !== undefined ? props.profileData.about : "";
  // const twitter = props.profileData !== undefined ? props.profileData.twitter : "";
  // const github = props.profileData !== undefined ? props.profileData.github : "";
  // const website = props.profileData !== undefined ? props.profileData.website : "";
  // props.changeNewAbout(props.about);
  // props.changeNewTwitter(props.twitter);
  // props.changeNewGithub(props.github);
  // props.changeNewWebsite(props.website);
  return (
    <div>
      <div className={"profile-about-header"}>ABOUT</div>
        <div className={"profile-about-content"}>
          {props.editingBio ? (
            <div className={"about-icon-and-input"}>
              <img src="/images/usericon.svg" />
              <TextareaAutosize
                placeholder={"About yourself"}
                value={props.about}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  let myTarget = e.target as HTMLTextAreaElement;
                  props.changeAbout(myTarget.value);
                  // props.changeAbout(myTarget.value);
                }}
                style={{
                  fontSize: "15px",
                  color: "D0D0D0",
                }}
                maxLength={300}
                name="title"
              />
            </div>
          //  <input 
          //   className={"default-input"}
          //   value={props.newAbout}
          //   onChange={(e) => props.changeNewAbout(e.target.value)}
          //   ></input>
          ) : (
            props.about
          )}
          {/* I am really interested in problems having to do with educational systems, and how tech can be used to foster better learning and improve the transfer of knowledge. I'm located in the San Francisco, Bay Area 📌 and am always down to discuss big ideas over a cup of coffee ☕️ */}
        </div>
        <div className={"profile-about-icons"}>
          {props.editingBio ? (
            <div className={"profile-icon-and-input"}>
              <img src="/images/twittericon.svg" />
              <TextareaAutosize
                placeholder={"Twitter Handle"}
                value={props.twitter}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  let myTarget = e.target as HTMLTextAreaElement;
                  props.changeTwitter(myTarget.value);
                  // props.changeTwitter(myTarget.value);
                }}
                style={{
                  fontSize: "15px",
                  color: "D0D0D0",
                }}
                name="twitter"
              />
            </div>
          //  <input 
          //   className={"default-input"}
          //   value={props.newTwitter}
          //   placeholder="Twitter Profile"
          //   onChange={(e) => props.changeNewTwitter(e.target.value)}
          //   ></input>
          ) : (
            props.twitter !== "" ? (
              <div className={"profile-icon-and-link"}>
                <a 
                  href={"https://twitter.com/" + props.twitter}
                  target="blank"
                >
                  <img src="/images/twittericon.svg" />
                </a>
                <a 
                  href={"https://twitter.com/" + props.twitter}
                  target="blank"
                >
                  <p>@{props.twitter}</p>
                </a>
              </div>
            ) : (
              <div></div>
            )
          )}
          {props.editingBio ? (
            <div className={"profile-icon-and-input"}>
              <img src="/images/githubicon.svg" />
              <TextareaAutosize
              placeholder={"Github Username"}
              value={props.github}
              onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                let myTarget = e.target as HTMLTextAreaElement;
                props.changeGithub(myTarget.value);
                // props.changeGithub(myTarget.value);
              }}
              style={{
                fontSize: "15px",
                color: "D0D0D0",
              }}
              name="github"
            />
          </div>
          //  <input 
          //   className={"default-input"}
          //   value={props.newGithub}
          //   placeholder="Github Profile"
          //   onChange={(e) => props.changeNewGithub(e.target.value)}
          //   ></input>
          ) : (
            props.github !== "" ? (
              <div className={"profile-icon-and-link"}>
                <a 
                  href={"https://github.com/" + props.github}
                  target="blank"
                >
                  <img src="/images/githubicon.svg" />
                </a>
                <a 
                  href={"https://github.com/" + props.github}
                  target="blank"
                ><p>{props.github}</p></a>
                
              </div>
            ) : (
              <div></div>
            )
          )}
          {props.editingBio ? (
            <div className={"profile-icon-and-input"}>
              <img src="/images/webicon.svg" />
              <TextareaAutosize
                placeholder={"Personal Website"}
                value={props.website}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  let myTarget = e.target as HTMLTextAreaElement;
                  props.changeWebsite(myTarget.value);
                  // props.changeWebsite(myTarget.value);
                }}
                style={{
                  fontSize: "15px",
                  color: "D0D0D0",
                }}
                name="website"
              />
            </div>
          //  <input 
          //   className={"default-input"}
          //   value={props.newWebsite}
          //   placeholder="Website"
          //   onChange={(e) => props.changeNewWebsite(e.target.value)}
          //   ></input>
          ) : (
            props.website !== "" ? (
              <div className={"profile-icon-and-link"}>
                <a 
                  href={props.website}
                  target="blank"
                >
                  <img src="/images/webicon.svg" />
                </a>
                <a 
                  href={props.website}
                  target="blank"
                ><p>{props.website}</p></a>
              </div>
            ) : (
              <div></div>
            )
          )}
        </div>
        {props.canEditBio ? 
          (props.editingBio ? 
            (<div 
              className={"profile-edit-button"} 
              onClick={(e) => {props.toggleEditingBio(!props.editingBio); props.saveNewProfile()}}
            >
              Save Profile
            </div>
            )
          :
            (<div 
              className={"profile-edit-button"} 
              onClick={(e) => props.toggleEditingBio(!props.editingBio)}
            >
              Edit Profile
            </div>
          )) : (<div></div>)
        }
    </div>
  );
}

function DisplayPosts(props: {
  posts: any;
  username: string;
}) {
  // console.log(props.posts);
  try {
    const router = useRouter();
    return (
      <div>
        {props.posts === undefined || props.posts.length === 0 ? (
          <h3>No posts found</h3>
        ) : (
          <div>
            {Array.from(props.posts).map((post: any) => {
              // console.log(post["tags"]);
              // console.log(typeof post["tags"]);
              // const tags = post["tags"].split(",");
              // post["tags"] = JSON.
              const tags = post["tags"] === null ? null : post["tags"].split(",");
              // console.log("AFTER" + post["tags"]);
              return (
                <div
                  className={"profile-post"}
                  onClick={() => router.push(post["postURL"])}
                >
                  <div className={"profile-post-title"}>{post["title"]}</div>
                  <div className={"profile-post-date"}>
                    {post["publishedAt"]}
                  </div>
                  <div className={"profile-post-tags-author"}>
                    {tags !== null ? (
                      tags.map((tag: any) => {
                        return (
                          <div
                            className={"profile-post-tag"}
                          >
                            {tag}
                          </div>
                        );
                      })
                    ) : (
                      <div></div>
                    )}
                    {/* <div className={"profile-post-author"}>{props.username}</div> */}
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
    return <div><h3>Error Fetching Posts</h3></div>;
  }
}


// const UserPage = (props: UserPageProps) => {
//   const [currentStep, updateStep] = useState(0);
//   const { authenticated, error, loading } = useLoggedIn();
//   const router = useRouter();

//   if (props.errored) {
//     return <ErroredPage />;
//   }

//   if (router.isFallback) {
//     return <div>Loading...</div>;
//   }

//   let posts = props.publishedPosts;
//   return (
//     <div className="container">
//       <Head>
//         <title>{props.username}'s Leaf</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main>
//         {authenticated ? (
//           <Header profile={false} explore={true} settings={true} logout={true} />
//         ) : (
//           <HeaderUnAuthenticated />
//         )}
//         <h1 className={"profile-header"}>{props.username}</h1>
//         <div className={"profile-content"}>
//           <div className={"profile-left-pane"}>
//             <div className={"profile-img"}>AJ</div>
//             <div className={"profile-about-header"}>ABOUT</div>
//             <div className={"profile-about-content"}>
//               I am really interested in problems having to do with educational systems, and how tech can be used to foster better learning and improve the transfer of knowledge. I'm located in the San Francisco, Bay Area 📌 and am always down to discuss big ideas over a cup of coffee ☕️
//             </div>
//             <div className={"profile-about-icons"}>
//               <img src="/images/twittericon.svg" />
//               <img src="/images/githubicon.svg" />
//               <img src="/images/webicon.svg" />
//             </div>
//             <div className={"profile-edit-button"}>Edit Profile</div>
//           </div>
//           <div className={"profile-right-pane"}>
//             <DisplayPosts posts={posts} />
//           </div>
//           {/* {posts.length === 0 ? (
//             <p>This user has not published anything yet.</p>
//           ) : (
//             <div></div>
//           )} */}
//           {/* {posts.map((post) => (
//             <Post
//               title={post.title}
//               postId={post.postId}
//               username={props.username}
//               key={post.postId}
//             />
//           ))} */}
//         </div>
//       </main>
//     </div>
//   );
// };

// function Post(props: { title: string; postId: string; username: string }) {
//   let router = useRouter();

//   function goToPost() {
//     router.push(
//       "/[username]/[postId]",
//       "/" + props.username + "/" + props.postId
//     );
//   }

//   return (
//     <div onClick={goToPost} className={"user-post"}>
//       <div className={"user-title"}>
//         <h1>{props.title}</h1>
//       </div>
//     </div>
//   );
// }

// export default UserPage;
