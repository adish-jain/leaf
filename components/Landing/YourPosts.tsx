import { Post } from "../../typescript/types/app_types";
import landingStyles from "../../styles/landing.module.scss";
import { PublishedPost } from "./PublishedPost";
import { NonePublished } from "./NonePublished";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { goToDraft, goToPost, usePosts } from "../../lib/usePosts";
import { DomainContext } from "../../contexts/domain-context";

export function YourPosts(props: {}) {
  const { authenticated } = useContext(AuthContext);
  const { username } = useContext(DomainContext);

  let { posts, togglePostsEdit, postsEditClicked } = usePosts(authenticated);

  const noPosts = posts.length === 0;

  const Content = () => {
    if (noPosts) {
      return <NonePublished />;
    } else {
      return (
        <div>
          {posts.map((post) => {
            let formattedDate = dayjs(post.publishedAt._seconds * 1000).format(
              "MMMM D YYYY"
            );
            return (
              <PublishedPost
                formattedDate={formattedDate}
                title={post.title}
                postId={post.postId}
                draftId={post.firebaseId}
                postUid={post.firebaseId}
                key={post.firebaseId}
                postsEditClicked={postsEditClicked}
              />
            );
          })}
        </div>
      );
    }
  };

  const EditButton = () => {
    if (noPosts) {
      return <div></div>;
    }
    return (
      <div className={landingStyles["DraftButtons"]}>
        <button onClick={togglePostsEdit}>
          {postsEditClicked ? "Done" : "Edit"}
        </button>
      </div>
    );
  };

  return (
    <div className={`${landingStyles.right} ${landingStyles.Section}`}>
      <h1>Your Published Posts</h1>
      <hr />
      <EditButton />
      <Content />
    </div>
  );
}
