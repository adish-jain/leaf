import draftHeaderStyles from "../styles/draftheader.module.scss";
import landingHeaderStyles from "../styles/landingheader.module.scss";
import { SetStateAction, useContext } from "react";
import Link from "next/link";
import { goToIndex, goToLanding, logOut } from "../lib/UseLoggedIn";
import { DraftContext } from "../contexts/draft-context";
import { PreviewContext } from "./preview-context";
import { Router, useRouter } from "next/router";

type DraftHeaderProps = {
  updateShowTags: (value: SetStateAction<boolean>) => void;
};

type LandingHeaderProps = {
  username: string;
};

export function LandingHeader(props: LandingHeaderProps) {
  return (
    <div className={landingHeaderStyles["landing-header"]}>
      <div className={landingHeaderStyles["inner-content"]}>
        <img
          className={landingHeaderStyles["landing-img"]}
          src="/images/LeafLogo.svg"
        />
        <div className={landingHeaderStyles["links"]}>
          <Link href={`/${props.username}`}>
            <a>Profile</a>
          </Link>
          <Link href={`/explore`}>
            <a>Explore</a>
          </Link>
          <Link href={`/settings`}>
            <a>Settings</a>
          </Link>
          <div
            className={landingHeaderStyles["logout-button"]}
            onClick={logOut}
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

function Buttons(props: { updateShowTags: (toggle: boolean) => void }) {
  const { updatePreviewMode, published } = useContext(PreviewContext);
  const { updateShowTags } = props;
  return (
    <div className={draftHeaderStyles["buttons"]}>
      <TagsButton updateShowTags={updateShowTags} />
      <button
        className={draftHeaderStyles["preview-button"]}
        onClick={(e) => {
          if (updatePreviewMode) {
            updatePreviewMode(true);
          }
        }}
      >
        Preview Post
      </button>
      <PublishButtonChoice />
    </div>
  );
}

function PublishButtonChoice() {
  const router = useRouter();
  const { draftId, postId, username } = useContext(DraftContext);
  const { published } = useContext(PreviewContext);

  function publishPost() {
    fetch("/api/endpoint", {
      method: "POST",
      redirect: "follow",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ requestedAPI: "publishPost", draftId: draftId }),
    })
      .then(async (res: any) => {
        let resJson = await res.json();
        let newUrl = resJson.newURL;
        if (newUrl === "unverified") {
          alert("Please verify your email before publishing.");
        } else {
          router.push(newUrl);
        }
        // Router.push(newUrl);
      })
      .catch(function (err: any) {
        console.log(err);
      });
  }

  function goToPublishedPost() {
    window.location.href = `/${username}/${postId}`;
  }
  const PublishButton = () => (
    <button
      className={draftHeaderStyles["publish-button"]}
      onClick={publishPost}
    >
      {"Publish Post"}
    </button>
  );

  const GoToPublishedPostButton = () => (
    <button
      className={draftHeaderStyles["publish-button"]}
      onClick={(e) => goToPublishedPost()}
    >
      {"Go to Published Post"}
    </button>
  );
  return (
    <div>{published ? <GoToPublishedPostButton /> : <PublishButton />}</div>
  );
}

export function DraftHeader(props: DraftHeaderProps) {
  const { updateShowTags } = props;
  function Links() {
    return (
      <DraftContext.Consumer>
        {({ username }) => (
          <div className={draftHeaderStyles["links"]}>
            <Link href="/landing">
              <a>Home</a>
            </Link>
            <Link href={`/${username}`}>
              <a>Profile</a>
            </Link>
          </div>
        )}
      </DraftContext.Consumer>
    );
  }

  return (
    <div className={draftHeaderStyles["draft-header"]}>
      <div className={draftHeaderStyles["header-wrapper"]}>
        <Links />
        <Buttons updateShowTags={updateShowTags} />
      </div>
    </div>
  );
}

function TagsButton(props: { updateShowTags: (toggle: boolean) => void }) {
  return (
    <button
      onClick={() => props.updateShowTags(true)}
      className={draftHeaderStyles["publish-button"]}
    >
      Tags
    </button>
  );
}

type FinishedPostHeaderProps = {
  previewMode: boolean;
  authenticated: boolean;
  updatePreviewMode: ((previewMode: boolean) => void) | undefined;
  username?: string;
};

function Links() {
  return (
    <div className={draftHeaderStyles["links"]}>
      <Link href="/landing">
        <a>Home</a>
      </Link>
      <Link href="/explore">
        <a>Explore</a>
      </Link>
    </div>
  );
}

export function FinishedPostHeader(props: FinishedPostHeaderProps) {
  return (
    <div className={draftHeaderStyles["draft-header"]}>
      <div className={draftHeaderStyles["header-wrapper"]}>
        <Links />
        <div className={draftHeaderStyles["buttons"]}>
          {props.previewMode ? (
            <ExitPreview updatePreviewMode={props.updatePreviewMode!} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExitPreview(props: {
  updatePreviewMode: (previewMode: boolean) => void;
}) {
  return (
    <button
      className={draftHeaderStyles["preview-button"]}
      onClick={(e) => {
        props.updatePreviewMode(false);
      }}
    >
      Exit Preview
    </button>
  );
}

type TagsHeaderProps = {
  showTags: boolean;
  updateShowTags?: (value: boolean) => void;
};

export function TagsHeader(props: TagsHeaderProps) {
  function Links() {
    return (
      <div className={draftHeaderStyles["links"]}>
        <Link href="/landing">
          <a>Home</a>
        </Link>
      </div>
    );
  }

  return (
    <div className={draftHeaderStyles["draft-header"]}>
      <div className={draftHeaderStyles["header-wrapper"]}>
        <Links />
        <div className={draftHeaderStyles["buttons"]}>
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

function ExitTags(props: { updateShowTags?: (value: boolean) => void }) {
  return (
    <button
      className={draftHeaderStyles["preview-button"]}
      onClick={(e) => {
        props.updateShowTags!(false);
      }}
    >
      Continue Drafting
    </button>
  );
}
