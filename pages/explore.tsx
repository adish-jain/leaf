import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";
import Header, { HeaderUnAuthenticated } from "../components/Header";
import { useRouter } from "next/router";

import "../styles/explore.scss";
import useSWR from "swr";

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
        title: "",
        publishedAt: "",
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
        <AllPosts posts={postsData} />

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

function AllPosts(props: {posts: any}) {
  return (
      <div>
        {props.posts.map((arr: any) => (
            <div>
              {arr["title"] + " published at " + arr["publishedAt"] + " with post ID " + arr["postId"]}
            </div>
        ))}
      </div>
  );
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
