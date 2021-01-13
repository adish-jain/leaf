import landingStyles from "../../styles/landing.module.scss";

type DraftProps = {
  title: string;
  id: string;
  key: string;
  deleteDraft: (draft_id: string) => void;
  openDraft: (id: string) => void;
  draftsEditClicked: boolean;
};

export function LandingDraft(props: DraftProps) {
  return (
    <div className={landingStyles["DraftWrapper"]}>
      {props.draftsEditClicked ? (
        <button
          onClick={(e) => props.deleteDraft(props.id)}
          className={landingStyles["Edit"]}
        >
          X
        </button>
      ) : (
        <div></div>
      )}

      <div
        onClick={(e) => props.openDraft(props.id)}
        className={landingStyles["draft"]}
      >
        <p className={landingStyles["Draft-Title"]}>{props.title}</p>
      </div>
    </div>
  );
}
