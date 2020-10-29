import Head from "next/head";
const fetch = require("node-fetch");
global.Headers = fetch.Headers;
import "../styles/landing.scss";
import "../styles/header.scss";
import { useLoggedIn, logOut, goToIndex } from "../lib/UseLoggedIn";
import { useDrafts } from "../lib/useDrafts";
import { useUserInfo } from "../lib/useUserInfo";
import { usePosts, goToPost } from "../lib/usePosts";
import Header from "../components/Header";
const dayjs = require("dayjs");
import { LandingHeader } from "../components/Headers";

type DraftType = {
  id: string;
  title: string;
  createdAt: {
    _nanoseconds: number;
    _seconds: number;
  };
};

type PostsType = {
  // url id
  postId: string;
  title: string;
  // user id
  uid: string;
  // unique id
  id: string;
  username: string;
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
    <div className="container">
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
        {/* <Header
          username={username}
          profile={true}
          settings={true}
          logout={true}
        /> */}
        <LandingHeader username={username} />
        <div className={"landing"}>
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

function YourPosts(props: {
  posts: PostsType[] | undefined;
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

  const noPosts = posts === undefined || posts.length === 0;

  const Content = () => {
    if (noPosts) {
      return <NonePublished />;
    } else {
      return (
        <div>
          {posts!.map((post: any) => {
            let date = new Date(post.publishedAt._seconds * 1000);
            let formattedDate = dayjs(date).format("MMMM D YYYY");
            return (
              <Post
                formattedDate={formattedDate}
                title={post.title}
                postId={post.postId}
                goToDraft={goToDraft}
                goToPost={goToPost}
                draftId={post.id}
                postUid={post.id}
                deletePost={deletePost}
                key={post.id}
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
      <div className={"DraftButtons"}>
        <button onClick={togglePostsEdit}>
          {postsEditClicked ? "Done" : "Edit"}
        </button>
      </div>
    );
  };

  return (
    <div className={`${"right"} ${"Section"}`}>
      <h1>Your Published Posts</h1>
      <hr />
      <EditButton />
      <Content />
    </div>
  );
}

function Post(props: {
  title: string;
  postId: string;
  postUid: string;
  deletePost: (postUid: string) => void;
  goToPost: (username: string, postId: string) => void;
  postsEditClicked: boolean;
  username: string;
  formattedDate: string;
  draftId: string;
  goToDraft: (draftId: string) => void;
}) {
  let { username, postId, deletePost, postUid, goToDraft } = props;

  const Editbuttons = () => {
    return (
      <div className={"EditButtons"}>
        <button onClick={(e) => props.deletePost(postUid)} className={"Edit"}>
          X
        </button>
        <button
          className={"edit-post-button"}
          onClick={(e) => goToDraft(props.draftId)}
        >
          Edit Post
        </button>
      </div>
    );
  };

  return (
    <div className={"DraftWrapper"}>
      {props.postsEditClicked ? <Editbuttons /> : <div></div>}
      <div
        onClick={(e) => props.goToPost(username, postId)}
        className={"draft"}
      >
        <p className={"Draft-Title"}>{props.title}</p>
        <p>Published on {props.formattedDate}</p>
      </div>
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
          <button className={"create-button"} onClick={createNewDraft}>
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
    <div className={`left Section`}>
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
      <div className={"left-header"}>
        <h1>Your Drafts</h1>
      </div>
      {drafts ? <div></div> : <div></div>}
      <hr />
      <div className={"DraftButtons"}>
        <button className={"CreateButton"} onClick={(e) => createNewDraft()}>
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
    <div className={"DraftWrapper"}>
      {props.draftsEditClicked ? (
        <button onClick={(e) => props.deleteDraft(props.id)} className={"Edit"}>
          X
        </button>
      ) : (
        <div></div>
      )}

      <div onClick={(e) => props.openDraft(props.id)} className={"draft"}>
        <p className={"Draft-Title"}>{props.title}</p>
      </div>
    </div>
  );
}

function NonePublished() {
  return (
    <div>
      <p>You have no published posts. Create a draft to get started.</p>
    </div>
  );
}
