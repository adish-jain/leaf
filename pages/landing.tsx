import Head from "next/head";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import landingStyles from "../styles/landing.module.scss";
import headerStyles from "../styles/header.module.scss";
import appStyles from "../styles/app.module.scss";
import { useLoggedIn, logOut, goToIndex } from "../lib/UseLoggedIn";
import { useDrafts } from "../lib/useDrafts";
import { useUserInfo } from "../lib/useUserInfo";
import { usePosts, goToPost } from "../lib/usePosts";
const dayjs = require("dayjs");
import { LandingHeader } from "../components/Headers";
import { YourPosts } from "../components/Landing/YourPosts";
type DraftType = {
  id: string;
  title: string;
  createdAt: {
    _nanoseconds: number;
    _seconds: number;
  };
};

const myRequest = (requestedAPI: string) => {
  return {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      requestedAPI: requestedAPI,
    }),
  };
};

export default function Landing() {
  // authenticate
  const { authenticated, error, loading } = useLoggedIn();

  // Fetch data for drafts
  const {
    drafts,
    deleteDraft,
    openDraft,
    createNewDraft,
    draftsEditClicked,
    toggleDraftsEdit,
  } = useDrafts(authenticated);
  // Fetch user ifno
  const { username } = useUserInfo(authenticated);
  // Fetch data for posts
  const {
    posts,
    deletePost,
    goToDraft,
    postsEditClicked,
    togglePostsEdit,
  } = usePosts(authenticated);

  return (
    <div className={"container"}>
      <Head>
        <title>Leaf</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (document.cookie) {
            if (!document.cookie.includes('authed')) {
              window.location.href = "/"
            }
          }
          else {
            window.location.href = '/'
          }
        `,
          }}
        />
      </Head>
      <main>
        <LandingHeader username={username} />
        <div className={landingStyles["landing"]}>
          <YourDrafts
            deleteDraft={deleteDraft}
            openDraft={openDraft}
            drafts={drafts}
            createNewDraft={createNewDraft}
            toggleDraftsEdit={toggleDraftsEdit}
            draftsEditClicked={draftsEditClicked}
          />
          <YourPosts
            deletePost={deletePost}
            posts={posts}
            goToPost={goToPost}
            goToDraft={goToDraft}
            togglePostsEdit={togglePostsEdit}
            postsEditClicked={postsEditClicked}
            username={username}
          />
        </div>
      </main>
    </div>
  );
}

function YourDrafts(props: {
  drafts: DraftType[] | undefined;
  createNewDraft: () => void;
  deleteDraft: (draft_id: string) => void;
  openDraft: (id: string) => void;
  draftsEditClicked: boolean;
  toggleDraftsEdit: () => void;
}) {
  function renderDrafts() {
    let { drafts, draftsEditClicked } = props;
    if (drafts === undefined) {
      return (
        <div>
          <p>You have no drafts.</p>
          <button
            className={landingStyles["create-button"]}
            onClick={createNewDraft}
          >
            Create New Draft
          </button>
        </div>
      );
    }
    return drafts.map((draft: any) => (
      <Draft
        draftsEditClicked={draftsEditClicked}
        deleteDraft={deleteDraft}
        key={draft.id}
        title={draft.title ? draft.title : "Untitled"}
        id={draft.id}
        openDraft={openDraft}
      />
    ));
  }

  let {
    drafts,
    deleteDraft,
    openDraft,
    createNewDraft,
    draftsEditClicked,
    toggleDraftsEdit,
  } = props;
  return (
    <div className={`${landingStyles.left} ${landingStyles.Section}`}>
      <YourDraftsHeader
        toggleDraftsEdit={toggleDraftsEdit}
        draftsEditClicked={draftsEditClicked}
        createNewDraft={createNewDraft}
        drafts={drafts}
      />
      {renderDrafts()}
    </div>
  );
}

function YourDraftsHeader(props: {
  createNewDraft: () => void;
  drafts: DraftType[] | undefined;
  toggleDraftsEdit: () => void;
  draftsEditClicked: boolean;
}) {
  let { createNewDraft, drafts, toggleDraftsEdit, draftsEditClicked } = props;
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
        <button onClick={toggleDraftsEdit}>
          {draftsEditClicked ? "Done" : "Edit"}
        </button>
      </div>
    </div>
  );
}

type DraftProps = {
  title: string;
  id: string;
  key: string;
  deleteDraft: (draft_id: string) => void;
  openDraft: (id: string) => void;
  draftsEditClicked: boolean;
};

function Draft(props: DraftProps) {
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
