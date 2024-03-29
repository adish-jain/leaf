import Head from "next/head";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import landingStyles from "../styles/landing.module.scss";
import { useLoggedIn, logOut, goToIndex } from "../lib/UseLoggedIn";
import { useUserInfo } from "../lib/useUserInfo";
import { usePosts } from "../lib/usePosts";
const dayjs = require("dayjs");
import { LandingHeader } from "../components/Headers";
import { YourFeed } from "../components/Landing/YourFeed";
import { YourDrafts } from "../components/Landing/YourDrafts";
import { DomainContext } from "../contexts/domain-context";
import { useHost } from "../lib/api/useHost";
import { AuthContext } from "../contexts/auth-context";


const Landing = () => {
  // authenticate
  const { authenticated, error, loading } = useLoggedIn();
  const { onCustomDomain } = useHost();

  // Fetch user ifno
  const { username, userHost, uid } = useUserInfo(authenticated);
  
  // Fetch data for posts
  // const { posts, deletePost, postsEditClicked, togglePostsEdit } = usePosts(
  //   authenticated
  // );

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
              <YourFeed />
            </div>
          </main>
        </DomainContext.Provider>
      </div>
    </AuthContext.Provider>
  );
}

export default Landing;
