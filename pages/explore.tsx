import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";
import Header, { HeaderUnAuthenticated } from "../components/Header";
import { useRouter } from "next/router";
// import Router from "next/router";

import "../styles/explore.scss";
import useSWR from "swr";
import { useState } from "react";
import { isNullOrUndefined } from "util";

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
  const [filteredPosts, filterPosts] = useState([]);
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
        <SearchBar filterPosts={filterPosts} allPosts={postsData}/>
        <div className={"selections"}>
          <TagSelect filterPosts={filterPosts} allPosts={filteredPosts.length === 0 ? postsData : filteredPosts}/>
          <SortSelect filterPosts={filterPosts} filteredPosts={filteredPosts.length === 0 ? postsData : filteredPosts}/>
        </div>
        <DisplayPosts posts={filteredPosts.length === 0 ? postsData : filteredPosts} router={router}/>

        {/* <Tutorials /> */}
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

function filter(value: any, filterPosts: any, allPosts: any) {
  const newPosts = Array.from(allPosts).filter((post: any) => post["title"].toLowerCase().includes(value.toLowerCase()));
  filterPosts(newPosts);
}

function sort(value: any, filterPosts: any, filteredPosts: any) {
  const newPosts = Array.from(filteredPosts);
  console.log("entered sort");
  console.log(value);
  switch (value) {
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
    // for when we add likes 
    // case "popular": {
    //   newPosts.sort(function(a: any, b: any) {
    //     var keyA = new Date(a.publishedAt),
    //       keyB = new Date(b.publishedAt);
    //     if (keyA > keyB) return -1;
    //     if (keyA < keyB) return 1;
    //     return 0;
    //   });
    //   filterPosts(newPosts);
    //   break;
    // }
  }
}

// want to implement google-search like suggestions for tags 
function SearchBar(props: {filterPosts: any, allPosts: any}) {
  return (
    <div className={"search"}>
      <input 
        className={"search-bar"} 
        // placeholder="  Search for titles or #tags"
        onChange={(e) => filter(e.target.value, props.filterPosts, props.allPosts)}
      />
      <img src="images/search.svg" />
    </div>
  );
}

function TagSelect(props: {filterPosts: any, allPosts: any}) {
  return (
    <select className={"select-dropdown"}>
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </select>
  )
}

function SortSelect(props: {filterPosts: any, filteredPosts: any}) {
  return (
    <select className={"select-dropdown"} onChange={(e) => sort(e.target.value, props.filterPosts, props.filteredPosts)}>
      <option value="date">Date</option>
      <option value="recent">Most Recent</option>
      {/* <option value="popular">Most Popular</option> */}
      <option value="title">Title</option>
    </select>
  )
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


// function Tutorials() {
//   return (
//     <div className={"Tutorials"}>
//       <a
//         href="https://getleaf.app/dsps301/binarysearch-58opqzc9"
//         target="_blank"
//       >
//         <div className={"Tutorial"}>Binary Search</div>
//       </a>
//       <a
//         href="https://getleaf.app/outofthebot/howdostepsandscrollingworkintheleafcodebase-y4qrlau9"
//         target="_blank"
//       >
//         <div className={"Tutorial"}>Steps & Scrolling in the Leaf Codebase</div>
//       </a>
//       <a
//         href="https://getleaf.app/dsps301/kanyewestspower-pm6ne39l"
//         target="_blank"
//       >
//         <div className={"Tutorial"}>Kanye West's 'Power'</div>
//       </a>
//     </div>
//   );
// }
