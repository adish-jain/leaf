import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { TransferPost } from "../components/admin/TransferPost";
import { useAdmin } from "../lib/useAdmin";
import adminStyles from "../styles/admin.module.scss";

const AdminPage = () => {
  const { authenticated, error, loading } = useAdmin();

  if (!loading && !authenticated) {
    window.location.href = "/";
  }
  async function checkUsername() {
    const data = {
      requestedAPI: "transferPost",
    };
    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    })
      .then(async (res: any) => {})
      .catch((error: any) => {
        console.log(error);
      });
  }

  return (
    <div>
      <Head>
        <title>Admin Page</title>
      </Head>
      <main>{!loading && authenticated && <AdminPageContent />}</main>
    </div>
  );
};

function AdminPageContent() {
  return (
    <div className={adminStyles["admin"]}>
      <TransferPost />
    </div>
  );
}

export default AdminPage;
