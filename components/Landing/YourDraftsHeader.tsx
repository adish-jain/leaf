import { useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { useDrafts } from "../../lib/useDrafts";
import landingStyles from "../../styles/landing.module.scss";
import { LandingDraftType } from "../../typescript/types/frontend/postTypes";

export function YourDraftsHeader(props: {
  draftsEditClicked: boolean;
  changeEditClicked: (draftsEditClicked: boolean) => void;
}) {
  const { authenticated } = useContext(AuthContext);
  const { drafts, createNewDraft } = useDrafts(authenticated);
  const { draftsEditClicked, changeEditClicked } = props;
  return (
    <div>
      <div className={landingStyles["left-header"]}>
        <h1>Your Drafts</h1>
      </div>
      {drafts ? <div></div> : <div></div>}
      <hr />
      <div className={landingStyles["DraftButtons"]}>
        <button
          className={landingStyles["CreateButton"]}
          onClick={(e) => createNewDraft()}
        >
          Create New Post
        </button>
        <button onClick={(e) => changeEditClicked(!draftsEditClicked)}>
          {draftsEditClicked ? "Done" : "Edit"}
        </button>
      </div>
    </div>
  );
}
