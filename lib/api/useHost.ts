import { useEffect, useState } from "react";

export function useHost() {
  const defaultHost =
    process.env.NODE_ENV === "development" ? "localhost" : "getleaf.app";

  const [host, updateHost] = useState(defaultHost);
  useEffect(() => {
    updateHost(window.location.hostname);
  }, [process.browser]);

  const customDomain =
    host !== "getleaf.app" &&
    host !== "localhost" &&
    host !== process.env.NEXT_PUBLIC_VERCEL_URL;

  return {
    host,
    customDomain,
  };
}
