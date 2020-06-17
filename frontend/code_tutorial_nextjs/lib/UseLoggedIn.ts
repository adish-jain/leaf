import useSWR from "swr";
import Router from "next/router";
import { useEffect } from "react";

const data = {
  requestedAPI: "token",
};
const fetcher = (url: string) =>
  fetch(url, {
    body: JSON.stringify(data),
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" })
  }).then((res) => res.json());

/* redirectURL: the URL to redirect to depending on if the user is 
authenticated or unauthenticated

 redirectToAuthenticate: if true, redirects when user is unauthenticated, if 
 false redirects when authenticated */
export function useLoggedIn(
  redirectURL: string,
  redirectToAuthenticate: boolean
) {
  const { data, error } = useSWR("/api/endpoint", fetcher);
  let loading: boolean;

  useEffect(() => {
    if (data === undefined) {
      loading = true;
      return;
    }

    Router.prefetch(redirectURL);
    let loggedIn = data.authenticated;
    // Go to redirect URL if user is unauthenticated
    if (loggedIn && !redirectToAuthenticate) {
      Router.push(redirectURL);
    }

    // Go to redirect URL if user is authenticated
    if (!loggedIn && redirectToAuthenticate) {
      Router.push(redirectURL);
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
    // reload the page to reset useSWR
    location.reload();
    Router.replace(`/login`);
  });
}
