import { useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { DomainContext } from "../../contexts/domain-context";
import { goToPost } from "../../lib/usePosts";
import landingStyles from "../../styles/landing.module.scss";

export function PublishedPost(props: {
  title: string;
  postId: string;
  postUid: string;
  postsEditClicked: boolean;
  username: string;
  formattedDate: string;
  draftId: string;
  goToDraft: (draftId: string) => void;
}) {
  let { username, postId, postUid, goToDraft } = props;
  const { customDomain } = useContext(DomainContext);
  const { authenticated } = useContext(AuthContext);

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
        onClick={(e) => props.goToPost(username, postId)}
        className={landingStyles["draft"]}
      >
        <p className={landingStyles["Draft-Title"]}>{props.title}</p>
        <p>Published on {props.formattedDate}</p>
      </div>
    </div>
  );
}
