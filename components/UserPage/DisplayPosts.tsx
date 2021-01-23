import { useRouter } from "next/router";
import profileStyles from "../../styles/profile.module.scss";
import landingStyles from "../../styles/landing.module.scss";
import { Post } from "../../typescript/types/app_types";
import dayjs from "dayjs";
import { useContext } from "react";
import { DomainContext } from "../../contexts/domain-context";
import { goToDraft, goToPost, usePosts } from "../../lib/usePosts";


function createPostUrl(
  username: string,
  postId: string,
  onCustomDomain: boolean
) {
  if (onCustomDomain) {
    return postId + "/";
  } else {
    return username + "/" + postId;
  }
}

export function DisplayPosts(props: { 
  posts: Post[]; 
  postsEditClicked: boolean 
  deletePost: any;
}) {
  const { onCustomDomain, username } = useContext(DomainContext);
  // const { deletePost } = usePosts(true);
  try {
    const router = useRouter();
    return (
      <div>
        {props.posts === undefined || props.posts.length === 0 ? (
          <div className={profileStyles["profile-no-posts"]}>
            {username} hasn't published anything yet
          </div>
        ) : (
          <div>
            {Array.from(props.posts).map((post: Post) => {
              const postUid = post.firebaseId;
              const draftId = post.firebaseId;
              const Editbuttons = () => {
                return (
                  <div className={landingStyles["EditButtons"]}>
                    <button
                      onClick={(e) => props.deletePost(postUid)}
                      className={landingStyles["Edit"]}
                    >
                      X
                    </button>
                    <button
                      className={landingStyles["edit-post-button"]}
                      onClick={(e) => goToDraft(draftId)}
                    >
                      Edit 
                    </button>
                  </div>
                );
              };
              const tags = post.tags;
              const publishedAtSeconds = post.publishedAt._seconds;
              let date = new Date(publishedAtSeconds * 1000);
              let formattedDate = dayjs(date).format("MMMM D YYYY");
              const postUrl = createPostUrl(
                username,
                post.postId,
                onCustomDomain
              );
              return (
                <div className={landingStyles["DraftWrapper"]}>
                  {props.postsEditClicked ? <Editbuttons /> : <div></div>}
                  <div
                    className={profileStyles["profile-post"]}
                    onClick={() => router.push(postUrl)}
                    key={post.firebaseId}
                  >
                    <div className={profileStyles["profile-post-title"]}>
                      {post["title"]}
                    </div>
                    <div className={profileStyles["profile-post-date"]}>
                      {formattedDate}
                    </div>
                    <div className={profileStyles["profile-post-tags-author"]}>
                      {tags.map((tag: string) => {
                        return (
                          <div
                            className={profileStyles["profile-post-tag"]}
                            key={tag}
                          >
                            <div className={profileStyles["profile-post-tag-text"]}>
                                {tag}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.log(err);
    return (
      <div>
        <h3>Error Fetching Posts</h3>
      </div>
    );
  }
}
