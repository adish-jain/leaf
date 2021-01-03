import { useContext } from "react";
import { DimensionsContext } from "../../contexts/dimensions-context";
import { Introduction } from "./Introduction";
import { PostContent } from "./PostContent";
import postBodyStyles from "../../styles/postbody.module.scss";

export function PostBody(props: { scrollSpeed: number; title: string }) {
  const { title, scrollSpeed } = props;

  return (
    <div className={postBodyStyles["postbody-wrapper"]}>
      <Introduction title={title} />
      <PostContent scrollSpeed={scrollSpeed} />
    </div>
  );
}
