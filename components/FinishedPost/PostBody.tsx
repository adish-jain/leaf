import { useContext } from "react";
import { DimensionsContext } from "../../contexts/dimensions-context";
import { Introduction } from "./Introduction";
import { PostContent } from "./PostContent";

export function PostBody(props: { scrollSpeed: number; title: string }) {
  const { title, scrollSpeed } = props;
  const { width } = useContext(DimensionsContext);

  let style = width < 450 ? { width: "calc(100% - 16px)", margin: "auto" } : {};
  return (
    <div style={style}>
      <Introduction title={title} />
      <PostContent scrollSpeed={scrollSpeed} />
    </div>
  );
}
