import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { BackFillUid } from "../components/admin/BackfillUid";
import { TransferPost } from "../components/admin/TransferPost";
import { useAdmin } from "../lib/useAdmin";
import adminStyles from "../styles/admin.module.scss";

const AdminPage = () => {
  const { authenticated, error, loading } = useAdmin();

  if (!loading && !authenticated) {
    window.location.href = "/";
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
      <BackFillUid />
    </div>
  );
}

export default AdminPage;
