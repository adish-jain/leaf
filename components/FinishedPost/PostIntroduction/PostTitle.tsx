import finishedPostStyles from "../../../styles/finishedpost.module.scss";

export default function PostTitle(props: { title: string }) {
  const { title } = props;
  return (
    <div className={finishedPostStyles["title"]}>
      <h1>{title}</h1>
    </div>
  );
}
