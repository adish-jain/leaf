import dayjs from "dayjs";
import Link from "next/link";
import { useContext } from "react";
import { DomainContext } from "../../../contexts/domain-context";
import { ContentContext } from "../../../contexts/finishedpost/content-context";
import finishedPostStyles from "../../../styles/finishedpost.module.scss";

export function PostIntro() {
  const { username, profileImage, publishedAtSeconds } = useContext(
    ContentContext
  );

  const { customDomain } = useContext(DomainContext);
  let date = new Date(publishedAtSeconds * 1000);
  let formattedDate = dayjs(date).format("MMMM D YYYY");
  return (
    <div className={finishedPostStyles["published-by"]}>
      <span> {"Published by "}</span>
      <Link href={profileLink(customDomain, username)}>
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

function profileLink(customDomain: boolean, username: string) {
  if (customDomain) {
    return "/";
  } else {
    return `/${username}`;
  }
}
