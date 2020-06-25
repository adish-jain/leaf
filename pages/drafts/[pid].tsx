import { useRouter } from "next/router";
import { useLoggedIn, logOut } from "../..//lib/UseLoggedIn";
import useSWR, { mutate } from "swr";
import Publishing from "../../components/Publishing";
import CodeEditor from '../../components/CodeEditor'
import Head from "next/head";

const appStyles = require("../../styles/App.module.scss");

const DraftView = () => {
  const { authenticated, error, loading } = useLoggedIn("/", true);
  const router = useRouter();

  // Draft ID
  const { pid } = router.query;

  // TODO: fetch draftData using SWR here

  // this page should look similar to how pages/article looks right now

  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Publishing draftid={pid}/>
          <CodeEditor />
        </div>
      </main>
    </div>
  );
};

export default DraftView;



