import { useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { DomainContext } from "../../contexts/domain-context";
import { goToDraft, goToPost, usePosts } from "../../lib/usePosts";
import landingStyles from "../../styles/landing.module.scss";

export function PublishedPost(props: {
  title: string;
  postId: string;
  postUid: string;
  postsEditClicked: boolean;
  formattedDate: string;
  draftId: string;
}) {
  let { postId, postUid } = props;
  const { customDomain, username } = useContext(DomainContext);
  const { authenticated } = useContext(AuthContext);
  const { deletePost } = usePosts(authenticated);
  const Editbuttons = () => {
    return (
      <div className={landingStyles["EditButtons"]}>
        <button
          onClick={(e) => deletePost(postUid)}
          className={landingStyles["Edit"]}
        >
          X
        </button>
        <button
          className={landingStyles["edit-post-button"]}
          onClick={(e) => goToDraft(props.draftId)}
        >
          Edit Post
        </button>
      </div>
    );
  };

  return (
    <div className={landingStyles["DraftWrapper"]}>
      {props.postsEditClicked ? <Editbuttons /> : <div></div>}
      <div
        onClick={(e) => goToPost(username, postId, customDomain)}
        className={landingStyles["draft"]}
      >
        <p className={landingStyles["Draft-Title"]}>{props.title}</p>
        <p>Published on {props.formattedDate}</p>
      </div>
    </div>
  );
}
