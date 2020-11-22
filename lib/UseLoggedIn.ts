import useSWR from "swr";
import Router from "next/router";
import { useEffect } from "react";

const rawData = {
  requestedAPI: "token",
};
const fetcher = (url: string) =>
  fetch(url, {
    body: JSON.stringify(rawData),
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
  }).then((res) => res.json());

export function useLoggedIn() {
  const { data, error } = useSWR("/api/auth", fetcher);
  let loading: boolean;
  useEffect(() => {
    if (data === undefined) {
      loading = true;
      return;
    }
  }, [data]);

  if (data === undefined) {
    loading = true;
    return { false: Boolean, error, loading };
  }
  let authenticated = data.authenticated;
  loading = false;
  return { authenticated, error, loading };
}

export function logOut() {
  let data = {
    requestedAPI: "logout",
  };
  fetch("/api/endpoint", {
    method: "POST",
    // eslint-disable-next-line no-undef
    credentials: "same-origin",
    body: JSON.stringify(data),
    headers: new Headers({ "Content-Type": "application/json" }),
  }).then((res) => {
    console.log(res);
    // Router.replace(`/login`);
    window.location.href = "/login";
  });
}

export function goToIndex() {
  Router.replace(`/`);
}

export function goToLanding() {
  Router.replace("/landing");
}
