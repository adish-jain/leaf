import { useRouter } from "next/router";
import { useLoggedIn, logOut } from "../lib/UseLoggedIn";
import useSWR, { mutate } from "swr";

const Draft = () => {
  const router = useRouter();

  // Draft ID
  const { pid } = router.query;

  // TODO: fetch draftData using SWR here

  // this page should look similar to how pages/article looks right now

  return <p>Draft: {pid}</p>;
};

export default Draft;
