import Head from "next/head";
import { useLoggedIn } from "../lib/UseLoggedIn";
import { HeaderUnAuthenticated } from "../components/Header";
import Header from "../components/Header";
import { useRouter } from "next/router";
import "../styles/explore.scss";
import useSWR from "swr";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserInfo } from "../lib/useUserInfo";
import { Post } from "../typescript/types/app_types";
const dayjs = require("dayjs");

export default function Pages() {
  const rawData = {
    requestedAPI: "getAllPostsData",
  };

  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rawData),
  };

  const fetcher = (url: string) =>
    fetch("/api/endpoint", myRequest).then((res: any) => res.json());

  const initialData: any = {
    posts: [
      {
        postId: "",
        postURL: "",
        title: "",
        publishedAt: "",
        tags: [],
        username: "",
        profileImage: "",
      },
    ],
  };

  let { data: postsData, mutate } = useSWR("getAllPostsData", fetcher, {
    initialData,
    revalidateOnMount: true,
  });

  const [filteredPosts, filterPosts] = useState(postsData);
  const [searchFilter, updateSearchFilter] = useState("");
  const [tagFilter, updateTagFilter] = useState("All");
  const [sortFilter, updateSortFilter] = useState("Date");
  const [tagSelectOpened, toggleTagSelectOpened] = useState(false);
  const [sortSelectOpened, toggleSortSelectOpened] = useState(false);

  const { authenticated, error, loading } = useLoggedIn();
  const { username } = useUserInfo(authenticated);

  useEffect(() => {
    searchAndFilterPosts(
      filterPosts,
      postsData,
      searchFilter,
      tagFilter,
      sortFilter
    );
  }, [searchFilter, tagFilter, sortFilter]);

  // TODO this needs to be fixed (re-loads anytime new post)
  useEffect(() => {
    filterPosts(postsData);
  }, [postsData]);

  return (
    <div className="container">
      <Head>
        <title>Explore</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"explore-main-wrapper"}>
        {authenticated ? (
          <Header
            username={username}
            profile={true}
            settings={true}
            logout={true}
          />
        ) : (
          <HeaderUnAuthenticated login={true} signup={true} about={true} />
        )}
        <TitleText />
        <div className={"search-and-filter"}>
          <AnimatePresence>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <SearchBar updateSearchFilter={updateSearchFilter} />
            </motion.div>
          </AnimatePresence>
          <div className={"selections"}>
            <AnimatePresence>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <TagSelect
                  updateTagFilter={updateTagFilter}
                  tagFilter={tagFilter}
                  tagSelectOpened={tagSelectOpened}
                  toggleTagSelectOpen={toggleTagSelectOpened}
                  toggleSortSelectOpen={toggleSortSelectOpened}
                />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <SortSelect
                  updateSortFilter={updateSortFilter}
                  sortFilter={sortFilter}
                  sortSelectOpened={sortSelectOpened}
                  toggleTagSelectOpen={toggleTagSelectOpened}
                  toggleSortSelectOpen={toggleSortSelectOpened}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <DisplayPosts
          posts={filteredPosts}
          updateTagFilter={updateTagFilter}
        />
      </main>
    </div>
  );
}

function TitleText() {
  return (
    <div className={"explore-title"}>
      <div className={"explore-title-text"}>Discover Library</div>
    </div>
  );
}

// this will combine searchFilter, tagFilter, and sortFilter to give filtered results
function searchAndFilterPosts(
  filterPosts: Dispatch<any>,
  allPosts: Post[],
  searchFilter: string,
  tagFilter: string,
  sortFilter: string
) {
  var newPosts = Array.from(allPosts).filter((post: Post) =>
    post["title"].toLowerCase().includes(searchFilter.toLowerCase())
  );
  if (tagFilter !== "All") {
    newPosts = Array.from(newPosts).filter(
      (post: Post) => typeof post["tags"] !== "undefined"
    );
    newPosts = newPosts.filter((post: Post) => post["tags"].includes(tagFilter));
  }
  switch (sortFilter) {
    case "Date": {
      newPosts.sort(function (a: Post, b: Post) {
        var keyA = a.publishedAt,
          keyB = b.publishedAt;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      break;
    }
    case "Recent": {
      newPosts.sort(function (a: Post, b: Post) {
        var keyA = a.publishedAt,
          keyB = b.publishedAt;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
      break;
    }
    case "Title": {
      newPosts.sort(function (a: Post, b: Post) {
        var keyA = a.title.toLowerCase(),
          keyB = b.title.toLowerCase();
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      break;
    }
    case "Author": {
      newPosts.sort(function (a: Post, b: Post) {
        var keyA = a.username.toLowerCase(),
          keyB = b.username.toLowerCase();
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      break;
    }
  }
  filterPosts(newPosts);
}

// TODO want to implement google-search like suggestions for tags
function SearchBar(props: { updateSearchFilter: Dispatch<SetStateAction<string>> }) {
  return (
    <div className={"search"}>
      <input
        className={"search-bar"}
        placeholder="Search for a title"
        onChange={(e) => props.updateSearchFilter(e.target.value)}
      />
      <img src="images/search.svg" />
    </div>
  );
}

function TagSelect(props: {
  updateTagFilter: Dispatch<SetStateAction<string>>;
  tagFilter: string;
  tagSelectOpened: boolean;
  toggleTagSelectOpen: Dispatch<SetStateAction<boolean>>;
  toggleSortSelectOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const webdev = [
    "Angular",
    "Front End",
    "HTML",
    "Javascript",
    "PHP",
    "React",
    "Web Dev",
  ];
  const lang = ["Go", "Java", "Python", "Ruby"];
  const backend = [
    "APIs",
    "AWS",
    "Back End",
    "Django",
    "Google Cloud",
    "NextJS",
  ];
  const mobile = ["Android", "iOS"];
  const data = ["Algorithms", "Data Science", "Machine Learning"];
  const other = ["All", "Design", "Documentation", "Other"];
  const allTags = [backend, data, lang, mobile, webdev, other];
  const order = ["Backend", "Data", "Languages", "Mobile", "Web", "Other"];
  return (
    <div className={"filter"}>
      <div className={"filter-dropdown"}>
        <button
          className={"filter-dropbtn"}
          onClick={function () {
            props.toggleTagSelectOpen(!props.tagSelectOpened);
            props.toggleSortSelectOpen(false);
          }}
        >
          <img src="images/filter.svg" />
        </button>
        <AnimatePresence>
          {props.tagSelectOpened && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              {props.tagSelectOpened ? (
                <TagSelectDropDown
                  allTags={allTags}
                  order={order}
                  tagFilter={props.tagFilter}
                  updateTagFilter={props.updateTagFilter}
                />
              ) : (
                <div></div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TagSelectDropDown(props: {
  allTags: string[][];
  order: string[];
  tagFilter: string;
  updateTagFilter: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className={"filter-dropdown-content"}>
      <div className={"filter-row"}>
        {props.allTags.map((tagsArr: Array<string>, index: number) => (
          <div className={"filter-column"}>
            <h3>{props.order[index]}</h3>
            {tagsArr.map((tag: string) =>
              tag === props.tagFilter ? (
                <a
                  className={"filter-selected-option"}
                  onClick={(e) => props.updateTagFilter(tag)}
                >
                  {tag}
                </a>
              ) : (
                <a onClick={(e) => props.updateTagFilter(tag)}>{tag}</a>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SortSelect(props: {
  updateSortFilter: Dispatch<SetStateAction<string>>;
  sortFilter: string;
  sortSelectOpened: boolean;
  toggleSortSelectOpen: Dispatch<SetStateAction<boolean>>;
  toggleTagSelectOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const sortOptions = ["Date", "Recent", "Title", "Author"];
  return (
    <div>
      <div className={"sort-dropdown"}>
        <button
          className={"sort-dropbtn"}
          onClick={function () {
            props.toggleSortSelectOpen(!props.sortSelectOpened);
            props.toggleTagSelectOpen(false);
          }}
        >
          <img src="images/sort.svg" />
        </button>
        <AnimatePresence>
          {props.sortSelectOpened && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              {props.sortSelectOpened ? (
                <SortSelectDropDown
                  sortOptions={sortOptions}
                  sortFilter={props.sortFilter}
                  updateSortFilter={props.updateSortFilter}
                />
              ) : (
                <div></div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SortSelectDropDown(props: {
  sortOptions: string[];
  sortFilter: string;
  updateSortFilter: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className={"sort-dropdown-content"}>
      <div>
        {props.sortOptions.map((option: string) =>
          option === props.sortFilter ? (
            <a
              className={"sort-selected-option"}
              onClick={(e) => props.updateSortFilter(option)}
            >
              {option}
            </a>
          ) : (
            <a onClick={(e) => props.updateSortFilter(option)}>{option}</a>
          )
        )}
      </div>
    </div>
  );
}

function DisplayPosts(props: {
  posts: Post[];
  updateTagFilter: Dispatch<SetStateAction<string>>;
}) {
  try {
    const router = useRouter();
    return (
      <div>
        {props.posts.length === 0 ? (
          <h3>No posts found</h3>
        ) : (
          <div>
            {Array.from(props.posts).map((post: Post) => {
              return (
                <div
                  className={"post-explore"}
                  onClick={() => router.push(post["postURL"])}
                >
                  <div className={"post-title-explore"}>{post["title"]}</div>
                  <div className={"post-date"}>
                    {dayjs(post["publishedAt"]).format("MMMM D YYYY")}
                  </div>
                  <div className={"post-tags-author"}>
                    {post["tags"] !== undefined ? (
                      post["tags"].map((tag: string) => {
                        return (
                          <div
                            className={"post-tag"}
                            onClick={function (e) {
                              props.updateTagFilter(tag);
                              e.stopPropagation();
                            }}
                          >
                            {tag}
                          </div>
                        );
                      })
                    ) : (
                      <div></div>
                    )}
                     <div 
                      className={"post-author-name-and-img"}
                      onClick={function (e) {
                        router.push(post["username"]);
                        e.stopPropagation();
                      }}
                     >
                      {post["profileImage"] !== undefined &&
                        <div className={"published-post-author-img"}>
                          <img src={post["profileImage"]}/>
                        </div>
                      }
                      <div>{post["username"]}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch {
    console.log("error fetching posts");
    return <div><h3>Error Fetching Posts</h3></div>;
  }
}
