import { useEffect, useState } from "react";
import useSWR from "swr";

const rawData = {
  requestedAPI: "authenticateAdmin",
};

const fetcher = (url: string) =>
  fetch(url, {
    body: JSON.stringify(rawData),
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
  }).then((res) => res.json());

export function useAdmin() {
  const { data, error } = useSWR<{ isAdmin: boolean }>(
    "/api/endpoint",
    fetcher
  );
  const [loading, updateLoading] = useState(true);
  useEffect(() => {
    if (data === undefined) {
      updateLoading(true);
      return;
    } else {
      updateLoading(false);
      return;
    }
  }, [data]);

  const authenticated = data?.isAdmin || false;
  return {
    authenticated,
    error,
    loading,
  };
}
