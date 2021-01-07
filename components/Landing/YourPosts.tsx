import { Post } from "../../typescript/types/app_types";
import landingStyles from "../../styles/landing.module.scss";
import { PublishedPost } from "./PublishedPost";
import { NonePublished } from "./NonePublished";
import dayjs from "dayjs";

export function YourPosts(props: {
  posts: Post[];
  goToPost: (username: string, postId: string) => void;
  deletePost: (postUid: string) => void;
  togglePostsEdit: () => void;
  postsEditClicked: boolean;
  username: string;
  goToDraft: (draftId: string) => void;
}) {
  let {
    posts,
    goToPost,
    deletePost,
    togglePostsEdit,
    postsEditClicked,
    username,
    goToDraft,
  } = props;

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
                goToDraft={goToDraft}
                goToPost={goToPost}
                draftId={post.firebaseId}
                postUid={post.firebaseId}
                deletePost={deletePost}
                key={post.firebaseId}
                postsEditClicked={postsEditClicked}
                username={username}
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
