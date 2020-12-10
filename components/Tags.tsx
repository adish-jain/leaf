import React, { Component, SetStateAction, useContext } from "react";
import tagStyles from "../styles/tags.module.scss";
import { TagsHeader } from "../components/Headers";
import { TagsContext } from "../contexts/tags-context";
import { DraftContext } from "../contexts/draft-context";
const tagsList = [
  "Algorithms",
  "Android",
  "Angular",
  "APIs",
  "AWS",
  "Back End",
  "Data Science",
  "Design",
  "Django",
  "Documentation",
  "Front End",
  "Go",
  "Google Cloud",
  "HTML",
  "iOS",
  "Java",
  "Javascript",
  "Machine Learning",
  "NextJS",
  "PHP",
  "Python",
  "React",
  "Ruby",
  "Web Dev",
  "Other",
];
export default function Tags(props: { title: string }) {
  const { showTags, updateShowTags } = useContext(TagsContext);
  const { title } = props;
  return (
    <div>
      <div className={tagStyles["options-wrapper"]}>
        <TagsHeader updateShowTags={updateShowTags} showTags={showTags} />
      </div>
      <div className={tagStyles["tags-header"]}>
        <h1>Tags help readers find your content</h1>
        <h2>Select up to 3 tags for '{title}'</h2>
      </div>
      <TagButtons />
      <div className={tagStyles["filebar-wrapper"]}></div>
    </div>
  );
}

function TagButtons() {
  const { selectedTags } = useContext(TagsContext);

  return (
    <div className={tagStyles["tags"]}>
      {typeof selectedTags === "undefined" ? (
        <NoSelectedTags />
      ) : (
        <SomeSelectedTags />
      )}
    </div>
  );
}

function NoSelectedTags(props: {}) {
  const { toggleTag } = useContext(TagsContext);

  return (
    <>
      {tagsList.map((tag: string) => (
        <button
          id={tag}
          className={tagStyles["tag-button"]}
          onClick={() => toggleTag(tag)}
        >
          {tag}
        </button>
      ))}
    </>
  );
}

function SomeSelectedTags(props: {}) {
  const { selectedTags, toggleTag } = useContext(TagsContext);
  console.log("selected tags is ");
  console.log(selectedTags);
  return (
    <>
      {tagsList.map((tag: string) =>
        selectedTags.includes(tag) ? (
          <button
            id={tag}
            className={tagStyles["selected-tag-button"]}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ) : (
          <button
            id={tag}
            className={tagStyles["tag-button"]}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        )
      )}
    </>
  );
}
