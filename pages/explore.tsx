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
  // console.log(postsData);
  const [filteredPosts, filterPosts] = useState(postsData);
  const [searchFilter, updateSearchFilter] = useState("");
  const [tagFilter, updateTagFilter] = useState("All");
  const [sortFilter, updateSortFilter] = useState("date");
  // console.log(filteredPosts);
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
        <SearchBar updateSearchFilter={updateSearchFilter}/>
        <div className={"selections"}>
          <TagSelect updateTagFilter={updateTagFilter}/>
          <SortSelect updateSortFilter={updateSortFilter}/>
        </div>
        <DisplayPosts posts={filteredPosts} router={router}/>
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
    case "date": {
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
    case "recent": {
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
    case "title": {
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
    case "username": {
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
        onChange={(e) => props.updateSearchFilter(e.target.value)}
      />
      <img src="images/search.svg" />
    </div>
  );
}

function TagSelect(props: {updateTagFilter: any}) {
  const [opened, toggleOpen] = useState(false);
  const tagsList = ["All", "Algorithms", "Android", "Angular", "APIs", "AWS", 
      "Back End", "Data Science", "Design", "Django", "Documentation", "Front End", "Go", "Google Cloud", "HTML", "iOS", 
      "Java", "Javascript", "Machine Learning", "NextJS", "PHP", "Python", "React", "Ruby", "Web Dev", "Other"];
  return (
    <div className={"NavBarDropDown"}>
      <div className={"dropdown"}>
        <button onClick={(e) => toggleOpen(!opened)} className={"dropbtn"}>
          tag
        </button>
        <div className={"dropdownContent"}>
          {opened ? (
            <div>
              {tagsList.map((tag: string) => (
                  <option value={tag} onClick={(e) => props.updateTagFilter(tag)}>{tag}</option>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
  // const tagsList = ["All", "Algorithms", "Android", "Angular", "APIs", "AWS", 
  //     "Back End", "Data Science", "Design", "Django", "Documentation", "Front End", "Go", "Google Cloud", "HTML", "iOS", 
  //     "Java", "Javascript", "Machine Learning", "NextJS", "PHP", "Python", "React", "Ruby", "Web Dev", "Other"];
  // return (
  //   <select 
  //     className={"select-dropdown"} 
  //     onChange={(e) => props.updateTagFilter(e.target.value)}
  //   >
      // {tagsList.map((tag: string) => (
      //     <option value={tag}>{tag}</option>
      // ))}
  //   </select>
  //  );


function SortSelect(props: {updateSortFilter: any}) {
  const [opened, toggleOpen] = useState(false);
  return (
    <div className={"NavBarDropDown"}>
      <div className={"dropdown"}>
        <button onClick={(e) => toggleOpen(!opened)} className={"dropbtn"}>
          ☰
        </button>
        <div className={"dropdownContent"}>
          {opened ? (
            <div>
              <option value="date" onClick={(e) => props.updateSortFilter("date")}>Date</option>
              <option value="recent" onClick={(e) => props.updateSortFilter("recent")}>Most Recent</option>
              <option value="title" onClick={(e) => props.updateSortFilter("title")}>Title</option>
              <option value="username" onClick={(e) => props.updateSortFilter("username")}>Author</option>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
  // return (
  //   <select 
  //     className={"select-dropdown"} 
  //     onChange={(e) => props.updateSortFilter(e.target.value)}
  //   >
  //     <option value="date">Date</option>
  //     <option value="recent">Most Recent</option>
  //     <option value="title">Title</option>
  //     <option value="username">Author</option>
  //   </select>
  // )
}

function DisplayPosts(props: {posts: any, router: any}) {
  try {
    return (
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
                      <div className={"post-tag"}>
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
    );
  } catch {
    console.log("error fetching posts");
    return (<div></div>);
  }
}
