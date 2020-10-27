import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";
import Header, { HeaderUnAuthenticated } from "../components/Header";
import { useRouter } from "next/router";
// import Router from "next/router";

import "../styles/explore.scss";
import useSWR from "swr";
import { useState, useEffect } from "react";

export default function Pages() {
  const router = useRouter();

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
      },
    ],
  };

  let { data: postsData, mutate } = useSWR(
    "getAllPostsData",
    fetcher,
    { initialData, revalidateOnMount: true }
  );

  // const posts = postsData["posts"];
  console.log(postsData);
  const [filteredPosts, filterPosts] = useState(postsData);
  const [searchFilter, updateSearchFilter] = useState("");
  const [tagFilter, updateTagFilter] = useState("All");
  const [sortFilter, updateSortFilter] = useState("Date");
  console.log(filteredPosts);
  // filterPosts(postsData);

  const { authenticated, error, loading } = useLoggedIn();

  if (authenticated) {
    window.location.href = "/landing";
  }

  const goToIndex = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push("/");
  };

  useEffect(() => {
    searchAndFilterPosts(filterPosts, postsData, searchFilter, tagFilter, sortFilter);
  }, [searchFilter, tagFilter, sortFilter]);

  useEffect(() => {
    // TODO this needs to be fixed (re-loads anytime new post)
    filterPosts(postsData);
  }, [postsData]);

  return (
    <div className="container">
      <Head>
        <title>Explore</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if (document.cookie && document.cookie.includes('authed')) {
            window.location.href = "/landing"
          }
        `,
          }}
        />
      </Head>
      <main className={"ExploreMainWrapper"}>
        <HeaderUnAuthenticated login={true} signup={true} about={true} />
        <TitleText />
        <div className={"search-and-filter"}>
          <SearchBar updateSearchFilter={updateSearchFilter}/>
          <div className={"selections"}>
            <TagSelect updateTagFilter={updateTagFilter} tagFilter={tagFilter}/>
            <SortSelect updateSortFilter={updateSortFilter} sortFilter={sortFilter}/>
          </div>
        </div>
        <DisplayPosts posts={filteredPosts} router={router} updateTagFilter={updateTagFilter}/>
      </main>
    </div>
  );
}

function TitleText() {
  return (
    <div className={"explore-title"}>
      <div className={"Text"}>Discover Library</div>
    </div>
  );
}

// this will combine searchFilter, tagFilter, and sortFilter to give filtered results 
function searchAndFilterPosts(filterPosts: any, allPosts: any, searchFilter: string, tagFilter: string, sortFilter: string) {
  var newPosts = Array.from(allPosts).filter((post: any) => post["title"].toLowerCase().includes(searchFilter.toLowerCase()));
  if (tagFilter !== "All") {
    newPosts = Array.from(newPosts).filter((post: any) => typeof post["tags"] !== "undefined");
    newPosts = newPosts.filter((post: any) => post["tags"].includes(tagFilter));
  }
  switch (sortFilter) {
    case "Date": {
      newPosts.sort(function(a: any, b: any) {
        var keyA = new Date(a.publishedAt),
          keyB = new Date(b.publishedAt);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      filterPosts(newPosts);
      break;
    }
    case "Recent": {
      newPosts.sort(function(a: any, b: any) {
        var keyA = new Date(a.publishedAt),
          keyB = new Date(b.publishedAt);
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
      filterPosts(newPosts);
      break;
    }
    case "Title": {
      newPosts.sort(function(a: any, b: any) {
        var keyA = a.title.toLowerCase(),
          keyB = b.title.toLowerCase();
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      console.log(newPosts);
      filterPosts(newPosts);
      break;
    }
    case "Author": {
      newPosts.sort(function(a: any, b: any) {
        var keyA = a.username.toLowerCase(),
          keyB = b.username.toLowerCase();
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      console.log(newPosts);
      filterPosts(newPosts);
      break;
    }
  }
}

// want to implement google-search like suggestions for tags 
function SearchBar(props: {updateSearchFilter: any}) {
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

function TagSelect(props: {updateTagFilter: any, tagFilter: string}) {
  const webdev = ["Angular", "Front End", "HTML", "Javascript", "PHP", "React", "Web Dev"]
  const lang = ["Go", "Java", "Python", "Ruby"]
  const backend = ["APIs", "AWS", "Back End", "Django", "Google Cloud", "NextJS"]
  const mobile = ["Android", "iOS"]
  const data = ["Algorithms", "Data Science", "Machine Learning"]
  const other = ["All", "Design", "Documentation", "Other"]
  return (
    <div className={"filter"}>
      <div className={"filter-dropdown"}>
        <button className={"filter-dropbtn"}>
          <img src="images/filter.svg" />
          {/* Filter by: {props.tagFilter} */}
        </button>
        <div className={"filter-dropdown-content"}>
          <div className={"filter-row"}>
            <div className={"filter-column"}>
              <h3>Backend</h3>
              {backend.map((tag: string) => (
                tag === props.tagFilter ? (
                  <option className={"filter-selected-option"} value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                ) : (
                  <option value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                )
              ))}
            </div>
            <div className={"filter-column"}>
              <h3>Data</h3>
              {data.map((tag: string) => (
                tag === props.tagFilter ? (
                  <option className={"filter-selected-option"} value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                ) : (
                  <option value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                )
              ))}
            </div>
            <div className={"filter-column"}>
              <h3>Languages</h3>
              {lang.map((tag: string) => (
                tag === props.tagFilter ? (
                  <option className={"filter-selected-option"} value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                ) : (
                  <option value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                )
              ))}
            </div>
            <div className={"filter-column"}>
              <h3>Mobile</h3>
              {mobile.map((tag: string) => (
                tag === props.tagFilter ? (
                  <option className={"filter-selected-option"} value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                ) : (
                  <option value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                )
              ))}
            </div>
            <div className={"filter-column"}>
              <h3>Web</h3>
              {webdev.map((tag: string) => (
                tag === props.tagFilter ? (
                  <option className={"filter-selected-option"} value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                ) : (
                  <option value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                )
              ))}
            </div>
            <div className={"filter-column"}>
              <h3>Other</h3>
              {other.map((tag: string) => (
                tag === props.tagFilter ? (
                  <option className={"filter-selected-option"} value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                ) : (
                  <option value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SortSelect(props: {updateSortFilter: any, sortFilter: string}) {
  const sortOptions = ["Date", "Recent", "Title", "Author"];
  return (
    <div className={"sort"}>
      <div className={"sort-dropdown"}>
        <button className={"sort-dropbtn"}>
          <img src="images/sort.svg" />
          {/* Sort by: {props.sortFilter} */}
        </button>
        <div className={"sort-dropdownContent"}>
          <div>
            {sortOptions.map((option: string) => (
              option === props.sortFilter ? (
                <option className={"sort-selected-option"} value={option} onClick={(e) => props.updateSortFilter(option)}>{option}</option>
              ) : (
                <option value={option} onClick={(e) => props.updateSortFilter(option)}>{option}</option>
              )
            ))}
          </div>
        </div> 
      </div>
    </div>
  );
}

function DisplayPosts(props: {posts: any, router: any, updateTagFilter: any}) {
  try {
    return (
        <div>
          {props.posts.length === 0 ? (
            <h3>No posts found</h3>
            ) : (
              <div>
                {Array.from(props.posts).map((arr: any) => {
                  return (
                    <div className={"post"} onClick={() => props.router.push(arr["postURL"])}>
                      <div className={"post-title-explore"}>
                        {arr["title"]}
                      </div>
                      <div className={"post-date"}>
                        {new Date(arr["publishedAt"]).toDateString()}
                      </div>
                      <div className={"post-tags-author"}>
                        {arr["tags"] !== undefined ? 
                          (arr["tags"].map((tag: string) => {
                            return (
                            <div className={"post-tag"} onClick={function(e) { props.updateTagFilter(tag); e.stopPropagation()}}>
                              {tag}
                            </div>
                            );
                          })) : (<div></div>)}
                          <div className={"post-author"}>
                          {arr["username"]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
        </div>
    );
  } catch {
    console.log("error fetching posts");
    return (<div></div>);
  }
}
