export function getHomeDomain() {
  if (
    process.env.VERCEL_ENV === "development" ||
    process.env.NODE_ENV === "development"
  ) {
    return "http://localhost:3000";
  }
  if (process.env.VERCEL_ENV === "preview") {
    const previewUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    return `https://${previewUrl}`;
  }

  if (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return "https://getleaf.app";
  }
  return "https://getleaf.app";
}
