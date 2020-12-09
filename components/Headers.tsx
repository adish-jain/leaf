import "../styles/draftheader.scss";
import "../styles/landingheader.scss";
import { SetStateAction } from "react";
import Link from "next/link";
import { goToIndex, goToLanding, logOut } from "../lib/UseLoggedIn";

type DraftHeaderProps = {
  username: string;
  updateShowPreview: (shouldShowPreview: boolean) => void;
  updateShowTags: (value: SetStateAction<boolean>) => void;
  goToPublishedPost: () => void;
  publishPost: () => void;
  published: boolean;
};

type LandingHeaderProps = {
  username: string;
};

export function LandingHeader(props: LandingHeaderProps) {
  return (
    <div className={"landing-header"}>
      <div className={"inner-content"}>
        <img className={"landing-img"} src="/images/LeafLogo.svg" />
        <div className={"links"}>
          <Link href={`/${props.username}`}>
            <a>Profile</a>
          </Link>
          <Link href={`/explore`}>
            <a>Explore</a>
          </Link>
          <Link href={`/settings`}>
            <a>Settings</a>
          </Link>
          <div className={"logout-button"} onClick={logOut}>
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

export function DraftHeader(props: DraftHeaderProps) {
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

  function TagsButton() {
    return (
      <button onClick={() => props.updateShowTags(true)} className={"publish-button"}>
        Tags
      </button>
    );
  }

  function Buttons() {
    return (
      <div className={"buttons"}>
         <TagsButton />
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
        <Link href="/explore">
          <a>Explore</a>
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

type TagsHeaderProps = {
  showTags: boolean;
  updateShowTags?: (value: SetStateAction<boolean>) => void;
};

export function TagsHeader(props: TagsHeaderProps) {
  function Links() {
    return (
      <div className={"links"}>
        <Link href="/landing">
          <a>Home</a>
        </Link>
      </div>
    );
  }

  return (
    <div className={"draft-header"}>
      <div className={"header-wrapper"}>
        <Links />
        <div className={"buttons"}>
          {props.showTags ? (
            <ExitTags updateShowTags={props.updateShowTags} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExitTags(props: {
  updateShowTags?: (value: SetStateAction<boolean>) => void;
}) {
  return (
    <button
      className={"preview-button"}
      onClick={(e) => {
        props.updateShowTags!(false);
      }}
    >
      Continue Drafting
    </button>
  );
}
