import dayjs from "dayjs";
import Link from "next/link";
import { useContext } from "react";
import { ContentContext } from "../../../contexts/finishedpost/content-context";
import finishedPostStyles from "../../../styles/finishedpost.module.scss";

export function PostIntro() {
  const { username, profileImage, publishedAtSeconds } = useContext(
    ContentContext
  );
  let date = new Date(publishedAtSeconds * 1000);
  let formattedDate = dayjs(date).format("MMMM D YYYY");
  return (
    <div className={finishedPostStyles["published-by"]}>
      <span> {"Published by "}</span>
      <Link href={`/${username}`}>
        <div className={finishedPostStyles["author-name-and-img"]}>
          {profileImage !== "" && profileImage !== null && (
            <div className={finishedPostStyles["published-post-author-img"]}>
              <img src={profileImage} />
            </div>
          )}
          <a>{username}</a>
        </div>
      </Link>
      <span>on {formattedDate}</span>
    </div>
  );
}
