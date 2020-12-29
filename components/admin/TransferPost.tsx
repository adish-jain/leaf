import { useState } from "react";
import adminStyles from "../../styles/admin.module.scss";

export function TransferPost() {
  const [state, setState] = useState({
    currentOwner: "",
    postId: "",
    newUsername: "",
    errored: false,
    success: false,
  });

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    let name = (event.target as HTMLInputElement).name;
    event.persist();
    let value = (event.target as HTMLInputElement).value;
    setState({ ...state, [name]: value });
  }

  async function transferPost() {
    const data = {
      requestedAPI: "transferPost",
      currentOwner: state.currentOwner,
      newUsername: state.newUsername,
      postId: state.postId,
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
      <h1>Transfer Post</h1>
      <div className={adminStyles["input-row"]}>
        <label>Transfer from</label>
        <input
          name={"currentOwner"}
          onChange={(e) => handleChange(e)}
          placeholder={"current post owner"}
          value={state.currentOwner}
        />
        <label>/</label>
        <input
          name={"postId"}
          onChange={(e) => handleChange(e)}
          placeholder={"post ID"}
          value={state.postId}
        />
      </div>
      <div className={adminStyles["input-row"]}>
        <label>to</label>
        <input
          name={"newUsername"}
          onChange={(e) => handleChange(e)}
          placeholder={"new username"}
          value={state.newUsername}
        />
      </div>
      <button onClick={transferPost}>Transfer Post</button>
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
