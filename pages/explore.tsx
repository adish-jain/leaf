import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";
import Header, { HeaderUnAuthenticated } from "../components/Header";
import { useRouter } from "next/router";

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
  const [filteredPosts, filterPosts] = useState(postsData);

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
        <DisplayPosts posts={filteredPosts} />

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
  const newPosts = Array.from(allPosts).filter((post: any) => post["title"].includes(value));
  filterPosts(newPosts);
}

function SearchBar(props: {filterPosts: any, allPosts: any}) {
  return (
    <div className={"search"}>
      <div>
        <img src="images/search.svg" />
      </div>
      <input 
        className={"search-bar"} 
        placeholder="Search for titles or #tags"
        onChange={(e) => filter(e.target.value, props.filterPosts, props.allPosts)}
      />
    </div>
  );
}

function DisplayPosts(props: {posts: any}) {
  try {
    return (
        <div>
          {Array.from(props.posts).map((arr: any) => {
            return (
              <a href={"https://getleaf.app" + arr["postURL"]} className={"post-link"}>
                <div className={"post"}>
                  <div className={"post-title"}>
                    {arr["title"]}
                  </div>
                  <div className={"post-date"}>
                    {new Date(arr["publishedAt"]).toDateString()}
                  </div>
                  <div className={"post-tags"}>
                    {arr["tags"] !== undefined ? 
                      (arr["tags"].map((tag: string) => {
                        return (
                        <div className={"post-tag"}>
                          {tag}
                        </div>
                        );
                      })) : (<div></div>)}
                  </div>
                  {/* {arr["username"].then(function(result: any){console.log(result);})} */}
                </div>
              </a>
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
