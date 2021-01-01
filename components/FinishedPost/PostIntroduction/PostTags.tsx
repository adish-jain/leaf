import { useContext } from "react";
import { ContentContext } from "../../../contexts/finishedpost/content-context";
import finishedPostStyles from "../../../styles/finishedpost.module.scss";

export function PostTags(props: {}) {
  const { tags } = useContext(ContentContext);
  return (
    <div className={finishedPostStyles["post-tags"]}>
      {tags === null || tags === undefined ? (
        <div></div>
      ) : (
        tags.map((tag: string) => (
          <div key={tag} className={finishedPostStyles["post-tag"]}>
            {tag}
          </div>
        ))
      )}
    </div>
  );
}
