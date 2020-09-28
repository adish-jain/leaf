import Head from "next/head";

export default function ErroredPage() {
  return (
    <div className="container">
      <Head>
        <title>Leaf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>404. Page not Found.</div>
      </main>
    </div>
  );
}
