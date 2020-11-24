import React, { useState, Component } from "react";
import useSWR from "swr";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { getUserPosts, getUidFromUsername } from "../../lib/userUtils";
import { useLoggedIn } from "../../lib/UseLoggedIn";
import "../../styles/profile.scss";
import Header, { HeaderUnAuthenticated } from "../../components/Header";
import ErroredPage from "../404";
import { Post } from "../../typescript/types/app_types";
import { useUserInfo } from "../../lib/useUserInfo";
// import About from "../about";
const dayjs = require("dayjs");

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
    // uid = await getUidFromUsername(username);
    // let posts = await getUserPosts(uid);
    // let publishedPosts = [];
    // for (let i = 0; i < posts.length; i++) {
    //   let currentPost = posts[i];
    //   publishedPosts.push({
    //     uid: uid,
    //     title: currentPost.title,
    //     postId: currentPost.postId,
    //     id: currentPost.id,
    //     published: currentPost.published,
    //     // postId: currentPost.postId,
    //     // postURL: "/" + username + "/" + currentPost.postId,
    //     // title: currentPost.title,
    //     // publishedAt: currentPost.publishedAt,
    //     // tags: currentPost.tags,
    //     // likes: currentPost.likes,
    //     // username: username,
    //   });
    // }
    return {
      props: {
        username: username,
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
  username: string;
  errored: boolean;
};

export default function UserPage(props: UserPageProps) {
  const [editingBio, toggleEditingBio] = useState(false);

  const { authenticated, error, loading } = useLoggedIn();
  const {
    about,
    twitter,
    github,
    website,
    newAbout,
    newTwitter,
    newGithub,
    newWebsite,
    changeNewAbout,
    changeNewTwitter,
    changeNewGithub,
    changeNewWebsite,
    saveNewProfile,
  } = useUserInfo(authenticated);

  const rawData = {
    requestedAPI: "getPosts",
  };

  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rawData),
  };

  const fetcher = (url: string) =>
    fetch("/api/endpoint", myRequest).then((res: any) => res.json());

  const initialData: any = {
    posts: [
      {
        postId: "",
        postURL: "",
        title: "",
        publishedAt: "",
        tags: [],
      },
    ],
  };

  let { data: postsData, mutate } = useSWR("getPosts", fetcher, {
    initialData,
    revalidateOnMount: true,
  });

  return (
    <div className="container">
      <Head>
        <title>{props.username}'s Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {authenticated ? (
          <Header profile={false} explore={true} settings={true} logout={true} />
        ) : (
          <HeaderUnAuthenticated />
        )}
        <h1 className={"profile-header"}>{props.username}</h1>
        <div className={"profile-content"}>
          <div className={"profile-left-pane"}>
            <div className={"profile-img"}>AJ</div>
            <About
              editingBio={editingBio}
              about={about}
              twitter={twitter}
              github={github}
              website={website}
              newAbout={newAbout}
              newTwitter={newTwitter}
              newGithub={newGithub}
              newWebsite={newWebsite}
              toggleEditingBio={toggleEditingBio}
              changeNewAbout={changeNewAbout}
              changeNewTwitter={changeNewTwitter}
              changeNewGithub={changeNewGithub}
              changeNewWebsite={changeNewWebsite}
              saveNewProfile={saveNewProfile}
            />
          </div>
          <div className={"profile-right-pane"}>
            <DisplayPosts posts={postsData} username={props.username}/>
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
  about: string,
  twitter: string,
  github: string,
  website: string,
  newAbout: string,
  newTwitter: string,
  newGithub: string,
  newWebsite: string,
  toggleEditingBio: React.Dispatch<React.SetStateAction<boolean>>,
  changeNewAbout: React.Dispatch<React.SetStateAction<string>>,
  changeNewTwitter: React.Dispatch<React.SetStateAction<string>>,
  changeNewGithub: React.Dispatch<React.SetStateAction<string>>,
  changeNewWebsite: React.Dispatch<React.SetStateAction<string>>,
  saveNewProfile: any,
}) {
  return (
    <div className={"profile-left-pane"}>
      <div className={"profile-about-header"}>ABOUT</div>
        <div className={"profile-about-content"}>
          {props.about}
          {props.editingBio && (
           <input 
            className={"default-input"}
            value={props.newAbout}
            onChange={(e) => props.changeNewAbout(e.target.value)}
            ></input>
          )}
          {/* I am really interested in problems having to do with educational systems, and how tech can be used to foster better learning and improve the transfer of knowledge. I'm located in the San Francisco, Bay Area 📌 and am always down to discuss big ideas over a cup of coffee ☕️ */}
        </div>
        <div className={"profile-about-icons"}>
          <img src="/images/twittericon.svg" />
          {props.twitter}
          {props.editingBio && (
           <input 
            className={"default-input"}
            value={props.newTwitter}
            onChange={(e) => props.changeNewTwitter(e.target.value)}
            ></input>
          )}
          <img src="/images/githubicon.svg" />
          {props.github}
          {props.editingBio && (
           <input 
            className={"default-input"}
            value={props.newGithub}
            onChange={(e) => props.changeNewGithub(e.target.value)}
            ></input>
          )}
          <img src="/images/webicon.svg" />
          {props.website}
          {props.editingBio && (
           <input 
            className={"default-input"}
            value={props.newWebsite}
            onChange={(e) => props.changeNewWebsite(e.target.value)}
            ></input>
          )}
        </div>
        {props.editingBio ? 
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
        )}
    </div>
  );
}

function DisplayPosts(props: {
  posts: Post[];
  username: string;
}) {
  try {
    const router = useRouter();
    return (
      <div>
        {props.posts.length === 0 ? (
          <h3>No posts found</h3>
        ) : (
          <div>
            {Array.from(props.posts).map((post: Post) => {
              return (
                <div
                  className={"profile-post"}
                  onClick={() => router.push(post["postURL"])}
                >
                  <div className={"profile-post-title"}>{post["title"]}</div>
                  <div className={"profile-post-date"}>
                    {dayjs(post["publishedAt"]).format("MMMM D YYYY")}
                  </div>
                  <div className={"profile-post-tags-author"}>
                    {post["tags"] !== undefined ? (
                      post["tags"].map((tag: string) => {
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
