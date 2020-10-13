import "../styles/draftheader.scss";
import { SetStateAction } from "react";
import Link from "next/link";

type DraftHeaderProps = {
  username: string;
  updateShowPreview: (shouldShowPreview: boolean) => void;
  goToPublishedPost: () => void;
  publishPost: () => void;
  published: boolean;
};
export function DraftHeader(props: DraftHeaderProps) {
  function Links() {
    return (
      <div className={"links"}>
        <Link href="/landing">
          <a>Home</a>
        </Link>
        {/* <Link href={`/${props.username}`}>
          <a>Profile</a>
        </Link> */}
      </div>
    );
  }

  function PublishButtonChoice() {
    if (props.published) {
      return (
        <button className={"publish-button"} onClick={props.goToPublishedPost}>
          Go To Published Post
        </button>
      );
    } else {
      return (
        <button className={"publish-button"} onClick={props.publishPost}>
          Publish Post
        </button>
      );
    }
  }

  function Buttons() {
    return (
      <div className={"buttons"}>
        <button
          className={"preview-button"}
          onClick={(e) => {
            props.updateShowPreview(true);
          }}
        >
          Preview Post
        </button>
        <PublishButtonChoice />
      </div>
    );
  }

  return (
    <div className={"draft-header"}>
      <div className={"header-wrapper"}>
        <Links />
        <Buttons />
      </div>
    </div>
  );
}
type FinishedPostHeaderProps = {
  previewMode: boolean;
  authenticated: boolean;
  updateShowPreview?: (value: SetStateAction<boolean>) => void;
  username?: string;
};

export function FinishedPostHeader(props: FinishedPostHeaderProps) {
  function Links() {
    return (
      <div className={"links"}>
        <Link href="/landing">
          <a>Home</a>
        </Link>
        <Link href={`/${props.username}`}>
          <a>Profile</a>
        </Link>
      </div>
    );
  }

  return (
    <div className={"draft-header"}>
      <div className={"header-wrapper"}>
        <Links />
        <div className={"buttons"}>
          {props.previewMode ? (
            <ExitPreview updateShowPreview={props.updateShowPreview} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExitPreview(props: {
  updateShowPreview?: (value: SetStateAction<boolean>) => void;
}) {
  return (
    <button
      className={"preview-button"}
      onClick={(e) => {
        props.updateShowPreview!(false);
      }}
    >
      Exit Preview
    </button>
  );
}
