import finishedPostStyles from "../../styles/finishedpost.module.scss";
import { PostTags } from "./PostIntroduction/PostTags";
import PostTitle from "./PostIntroduction/PostTitle";
import { PostIntro } from "./PostIntroduction/PostIntro";
import { useContext } from "react";
import { DimensionsContext } from "../../contexts/dimensions-context";
import { MOBILE_WIDTH } from "../../pages/_app";

export function Introduction(props: { title: string }) {
  const { title } = props;
  const { width } = useContext(DimensionsContext);

  return (
    <div className={finishedPostStyles["introduction"]}>
      <PostTitle title={title} />
      <PostIntro />
      <PostTags />
    </div>
  );
}
