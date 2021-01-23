import Head from "next/head";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import landingStyles from "../styles/landing.module.scss";
import headerStyles from "../styles/header.module.scss";
import appStyles from "../styles/app.module.scss";
import { useLoggedIn, logOut, goToIndex } from "../lib/UseLoggedIn";
import { useDrafts } from "../lib/useDrafts";
import { useUserInfo } from "../lib/useUserInfo";
import { usePosts, goToPost } from "../lib/usePosts";
const dayjs = require("dayjs");
import { LandingHeader } from "../components/Headers";
import { YourPosts } from "../components/Landing/YourPosts";
import { YourFeed } from "../components/Landing/YourFeed";
import { YourDrafts } from "../components/Landing/YourDrafts";
import { DomainContext } from "../contexts/domain-context";
import { useHost } from "../lib/api/useHost";
import { AuthContext } from "../contexts/auth-context";
import { GetStaticProps } from "next";
import { getUidFromUsername } from "../lib/userUtils";
import { getFeedForUser, getAllPostsHandler } from "../lib/postUtils";
import { Post } from "../typescript/types/app_types";

// export async function getStaticPaths() {
//     return {
//       paths: [],
//       fallback: true, // See the "fallback" section below
//     };
//   }

// export const getStaticProps: GetStaticProps = async (context) => {
//     // ...
//     console.log("IN STATIC PROPS");
//     console.log(context);
//     let params = context.params;
//     console.log(params);
//     if (params === undefined || params.username === undefined) {
//         return {
//             revalidate: 1,
//             props: {
//                 feed: [],
//             },
//         };
//     }
//     let username = params.username as string;
//     let uid: string;
//     try {
//         uid = await getUidFromUsername(username);
//         const feed = await getFeedForUser(uid);
//         console.log("feed is " + feed);
//         return {
//             props: {
//                 feed: feed,
//             },
//             revalidate: 1,
//         };
//     } catch {
//         return {
//           props: {
//             feed: [],
//           },
//           revalidate: 1,
//         };
//       }
// };

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
  console.log(context);
  const feed = await getAllPostsHandler();

  return {
    props: {
      feed: feed,
    },
    revalidate: 1,
  };
};

type LandingPageProps = {
  feed: Post[];
};

export default function Landing(props: LandingPageProps) {
  // authenticate
  const { authenticated, error, loading } = useLoggedIn();
  const { onCustomDomain } = useHost();
  const feedData = props.feed;
  console.log("feed data is: " + feedData);

  // Fetch user ifno
  const { username, userHost, uid } = useUserInfo(authenticated);
  // Fetch data for posts
  const { posts, deletePost, postsEditClicked, togglePostsEdit } = usePosts(
    authenticated
  );

  return (
    <AuthContext.Provider value={{ authenticated }}>
      <div className={"container"}>
        <Head>
          <title>Leaf</title>
          <link rel="icon" href="/favicon.ico" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
          if (document.cookie) {
            if (!document.cookie.includes('authed')) {
              window.location.href = "/"
            }
          }
          else {
            window.location.href = '/'
          }
        `,
            }}
          />
        </Head>
        <DomainContext.Provider
          value={{
            onCustomDomain: onCustomDomain,
            username,
            userHost,
          }}
        >
          <main>
            <LandingHeader username={username} />
            <div className={landingStyles["landing"]}>
              <YourDrafts />
              <YourFeed feed={feedData}/>
            </div>
          </main>
        </DomainContext.Provider>
      </div>
    </AuthContext.Provider>
  );
}
