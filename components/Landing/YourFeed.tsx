import { Post } from "../../typescript/types/app_types";
import landingStyles from "../../styles/landing.module.scss";
import { PublishedPost } from "./PublishedPost";
import { NoneFollowed } from "./NoneFollowed";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { goToDraft, goToPost, usePosts, useFeed, goToPostFromExplore } from "../../lib/usePosts";
import { DomainContext } from "../../contexts/domain-context";
import exploreStyles from "../../styles/explore.module.scss";
import { GetStaticProps } from "next";
import { getFeedPostsHandler } from "../../lib/postUtils";
import { useRouter } from "next/router";

// export const getStaticProps: GetStaticProps = async (context) => {
//     // ...
//     const posts = await getFeedForUser();
  
//     return {
//       props: {
//         posts: posts,
//       },
//       revalidate: 1,
//     };
//   };
  
export function YourFeed(props: {}) {
  const { authenticated } = useContext(AuthContext);
  const { username } = useContext(DomainContext);
  const router = useRouter();
  let { feed } = useFeed(authenticated);

  const noPosts = feed.length === 0;

  const Content = () => {
    if (noPosts) {
      return <NoneFollowed />;
    } else {
      return (
        <div>
          {Array.from(feed).map((post: Post) => {
              return (
                <div
                  className={landingStyles["post-landing"]}
                  onClick={() => goToPostFromExplore(post)}
                >
                  <div className={landingStyles["post-title-landing"]}>
                    {post["title"]}
                  </div>
                  <div className={landingStyles["post-date"]}>
                    {dayjs(post["publishedAt"]._seconds * 1000).format(
                      "MMMM D YYYY"
                    )}
                  </div>
                  <div className={landingStyles["post-tags-author"]}>
                    {post["tags"] !== undefined ? (
                      (post["tags"] as string[]).map((tag: string) => {
                        return (
                          <div
                            className={landingStyles["post-tag"]}
                            onClick={function (e) {
                              e.stopPropagation();
                            }}
                          >
                            <div className={landingStyles["post-tag-text"]}>
                              {tag}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div></div>
                    )}
                    <div
                      className={landingStyles["post-author-name-and-img"]}
                      onClick={function (e) {
                        router.push(post["username"]);
                        e.stopPropagation();
                      }}
                    >
                      {post["profileImage"] !== undefined && (
                        <div
                          className={landingStyles["published-post-author-img"]}
                        >
                          {post["profileImage"] !== "" && (
                            <img src={post["profileImage"]} />
                          )}
                        </div>
                      )}
                      <div>{post["username"]}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      );
    }
  };

//   const EditButton = () => {
//     if (noPosts) {
//       return <div></div>;
//     }
//     return (
//       <div className={landingStyles["DraftButtons"]}>
//         <button onClick={togglePostsEdit}>
//           {postsEditClicked ? "Done" : "Edit"}
//         </button>
//       </div>
//     );
//   };

  return (
    <div className={`${landingStyles.right} ${landingStyles.Section}`}>
      <h1>Your Feed</h1>
      <hr />
      {/* <EditButton /> */}
      <Content />
    </div>
  );
}
