import { useEffect, useState } from "react";

export function useHost() {
  const defaultHost =
    process.env.NODE_ENV === "development" ? "localhost" : "getleaf.app";

  const [host, updateHost] = useState(defaultHost);
  useEffect(() => {
    updateHost(window.location.host);
  }, [process.browser]);

  const onCustomDomain = isHostCustomDomain(host);

  return {
    host,
    onCustomDomain,
  };
}

export function isHostCustomDomain(host: string) {
  const onCustomDomain =
    host !== "getleaf.app" &&
    host !== "localhost:3000" &&
    host !== process.env.NEXT_PUBLIC_VERCEL_URL &&
    host !== "";
  return onCustomDomain;
}

export function goToProfileFromLanding(
  onCustomDomain: boolean,
  userHost: string,
  username: string
) {
  if (onCustomDomain) {
    return "/";
  }
  if (userHost !== "") {
    return `https://${userHost}/`;
  }
  return `/${username}`;
}
