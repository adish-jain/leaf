import { LandingDraftType } from "../../typescript/types/frontend/postTypes";
import landingStyles from "../../styles/landing.module.scss";
import { LandingDraft } from "./LandingDraft";
import { YourDraftsHeader } from "./YourDraftsHeader";
import { openDraft, useDrafts } from "../../lib/useDrafts";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { auth } from "firebase-admin";

export function YourDrafts(props: {}) {
  const { authenticated } = useContext(AuthContext);
  const { drafts, deleteDraft, createNewDraft } = useDrafts(authenticated);
  const [draftsEditClicked, changeEditClicked] = useState(false);
  return (
    <div className={`${landingStyles.left} ${landingStyles.Section}`}>
      <YourDraftsHeader
        draftsEditClicked={draftsEditClicked}
        changeEditClicked={changeEditClicked}
      />
      <ListOfDrafts draftsEditClicked={draftsEditClicked} />
    </div>
  );
}

function ListOfDrafts(props: { draftsEditClicked: boolean }) {
  const { authenticated } = useContext(AuthContext);
  const { drafts, deleteDraft, createNewDraft } = useDrafts(authenticated);
  const { draftsEditClicked } = props;
  if (drafts.length === 0) {
    return (
      <div>
        <p>You have no drafts. Create a new post to get started</p>
        {/* <button
          className={landingStyles["create-button"]}
          onClick={createNewDraft}
        >
          Create New Draft
        </button> */}
      </div>
    );
  }
  return (
    <>
      {drafts.map((draft) => (
        <LandingDraft
          draftsEditClicked={draftsEditClicked}
          deleteDraft={deleteDraft}
          key={draft.id}
          title={draft.title ? draft.title : "Untitled"}
          id={draft.id}
          openDraft={openDraft}
        />
      ))}
    </>
  );
}
