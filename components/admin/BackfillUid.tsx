import { useState } from "react";
import adminStyles from "../../styles/admin.module.scss";

export function BackFillUid() {
  const [state, setState] = useState({
    errored: false,
    success: false,
  });

  async function backFillUids() {
    const data = {
      requestedAPI: "backFillUid",
    };
    await fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        setState({ ...state, success: true });
      })
      .catch((error) => {
        console.log("erroedf");
        setState({ ...state, errored: true });
        console.log(error);
      });
  }

  return (
    <div className={adminStyles["transfer"]}>
      <h1>Backfill UIDs</h1>
      <p>
        This script will iterate through all documents in the user collection
        and set the uid as a field.
      </p>

      <button onClick={backFillUids}>Backfill UIDs</button>
      {state.errored && <Errored />}
      {state.success && <Success />}
    </div>
  );
}

function Errored() {
  return <div className={adminStyles["errored"]}>{"failed"}</div>;
}

function Success() {
  return <div className={adminStyles["success"]}>{"success"}</div>;
}
