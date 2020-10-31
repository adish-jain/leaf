import Head from "next/head";
import Link from "next/link";

import { useLoggedIn, logOut } from "../lib/UseLoggedIn";
import Header, { HeaderUnAuthenticated } from "../components/Header";
import { useRouter } from "next/router";

import "../styles/examples.scss";

export default function Pages() {
  const router = useRouter();

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
        <title>Examples</title>
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
      <main className={"ExampleMainWrapper"}>
        <HeaderUnAuthenticated login={true} signup={true} about={true} />
        <TitleText />
        <Tutorials />
      </main>
    </div>
  );
}

function TitleText() {
  return (
    <div className={"example-title"}>
      <div className={"Text"}>Example Tutorials</div>
    </div>
  );
}

function Tutorials() {
  return (
    <div className={"Tutorials"}>
      <Link href="/dsps301/binarysearch-58opqzc9">
        <a>
          <div className={"Tutorial"}>Binary Search</div>
        </a>
      </Link>
      <Link href="/outofthebot/howdostepsandscrollingworkintheleafcodebase-y4qrlau9">
        <a>
          <div className={"Tutorial"}>
            Steps & Scrolling in the Leaf Codebase
          </div>
        </a>
      </Link>
      <Link href="dsps301/kanyewestspower-pm6ne39l">
        <a>
          <div className={"Tutorial"}>Kanye West's 'Power'</div>
        </a>
      </Link>
    </div>
  );
}
