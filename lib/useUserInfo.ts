import { useState } from "react";
import useSWR, { SWRConfig, mutate } from "swr";
import Router from "next/router";

const myRequest = (requestedAPI: string) => {
  return {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      requestedAPI: requestedAPI,
    }),
  };
};

const userInfoFetcher = () =>
  fetch("api/endpoint", myRequest("get_userInfo")).then((res: any) =>
    res.json()
  );

export function useUserInfo(authenticated: boolean) {
  const initialUserInfo: any = { username: "" };
  let { data: userInfo } = useSWR(
    authenticated ? "getUserInfo" : null,
    userInfoFetcher,
    {
      initialData: initialUserInfo,
      revalidateOnMount: true,
    }
  );
  return {
    userInfo,
  };
}
