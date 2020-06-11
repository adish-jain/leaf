import useSWR from "swr";
import Router from "next/router";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLoggedIn() {
  const { data, error } = useSWR("/api/token", fetcher);
  let loading: boolean;

  useEffect(() => {
    if (data === undefined || !data.authenticated) {
      // redirect to login
      loading = true;
    //   Router.replace(`/`);
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
  fetch("/api/logout", {
    method: "POST",
    // eslint-disable-next-line no-undef
    credentials: "same-origin",
  }).then((res) => {
    console.log(res);
    // reload the page to reset useSWR
    location.reload();
    Router.replace(`/login`);
  });
}
