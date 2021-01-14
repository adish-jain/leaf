import { Post } from "../../typescript/types/app_types";
import landingStyles from "../../styles/landing.module.scss";
import { PublishedPost } from "./PublishedPost";
import { NonePublished } from "./NonePublished";
import dayjs from "dayjs";
import { createContext, useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { goToDraft, goToPost, usePosts } from "../../lib/usePosts";
import { DomainContext } from "../../contexts/domain-context";

const PostsContext = createContext({});

export function YourPosts(props: {}) {
  const { authenticated } = useContext(AuthContext);
  const { username } = useContext(DomainContext);
  let { posts, loading, togglePostsEdit, postsEditClicked } = usePosts(
    authenticated
  );

  return (
    <div className={`${landingStyles.right} ${landingStyles.Section}`}>
      <h1>Your Published Posts</h1>
      <hr />
      <PostsContext.Provider
        value={{
          posts,
          loading,
          togglePostsEdit,
          postsEditClicked,
        }}
      >
        <EditButton />
        <Content />
      </PostsContext.Provider>
    </div>
  );
}

const Content = () => {
  const context = useContext(PostsContext);
  noPosts = posts.length === 0;
  if (loading) {
    return <div></div>;
  }
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

const EditButton = (props: { noPosts: boolean }) => {
  const { noPosts } = props;
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
