import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import { useLoggedIn, logOut } from "../..//lib/UseLoggedIn";
import useSWR, { mutate } from "swr";
import Publishing from "../../components/Publishing";
import CodeEditor from '../../components/CodeEditor'
import Head from "next/head";
// import useForceUpdate from 'use-force-update';

const appStyles = require("../../styles/App.module.scss");

const DraftView = () => {
  // const [, updateState] = useState();
  // const forceUpdate = useCallback(() => updateState({}), []);
  // const forceUpdate = useForceUpdate();
  const { authenticated, error, loading } = useLoggedIn("/", true);
  const router = useRouter();

  // Draft ID
  const { pid } = router.query;

  // if there are any steps in this draft, they will be fetched & repopulated
  const rawData = {
    requestedAPI: "get_steps",
    draftid: pid,
  };
  
  const myRequest = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(rawData),
  };

  const fetcher = (url: string) =>
    fetch(url, myRequest).then((res: any) => res.json());
  
  const initialData: any = [];


  let { data: steps } = useSWR(
    authenticated ? "/api/endpoint" : null,
    fetcher,
    { initialData, revalidateOnMount: true }
  );
  
  console.log(steps);


  // this page should look similar to how pages/article looks right now
  /* storedSteps={steps}  rerender={retrieveSteps}*/
  return (
    <div className="container">
      <Head>
        <title>Code Tutorials</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={appStyles.App}>
          <Publishing draftid={pid} storedSteps={steps} /> 
          <CodeEditor />
        </div>
      </main>
    </div>
  );
};

export default DraftView;



