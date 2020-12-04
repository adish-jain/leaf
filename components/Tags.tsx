import React, { Component, SetStateAction } from "react";
import tagStyles from "../styles/tags.module.scss";
import { TagsHeader } from "../components/Headers";

type TagsProps = {
  showTags: boolean;
  updateShowTags?: (value: SetStateAction<boolean>) => void;
  title: string;
  selectedTags: Array<String>;
  toggleTag: (value: string) => void;
};

type TagsState = {};

export default class TagsView extends Component<TagsProps, TagsState> {
  constructor(props: TagsProps) {
    super(props);
    this.state = {};

    this.TagButtons = this.TagButtons.bind(this);
    this.NoSelectedTags = this.NoSelectedTags.bind(this);
    this.SomeSelectedTags = this.SomeSelectedTags.bind(this);
  }

  TagButtons() {
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
    return (
      <div className={tagStyles["tags"]}>
        {typeof this.props.selectedTags === "undefined" ? (
          <this.NoSelectedTags tagsList={tagsList} />
        ) : (
          <this.SomeSelectedTags tagsList={tagsList} />
        )}
      </div>
    );
  }

  NoSelectedTags(props: { tagsList: string[] }) {
    return (
      <>
        {props.tagsList.map((tag: string) => (
          <button
            id={tag}
            className={tagStyles["tag-button"]}
            onClick={() => this.props.toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </>
    );
  }

  SomeSelectedTags(props: { tagsList: string[] }) {
    return (
      <>
        {props.tagsList.map((tag: string) =>
          this.props.selectedTags.includes(tag) ? (
            <button
              id={tag}
              className={tagStyles["selected-tag-button"]}
              onClick={() => this.props.toggleTag(tag)}
            >
              {tag}
            </button>
          ) : (
            <button
              id={tag}
              className={tagStyles["tag-button"]}
              onClick={() => this.props.toggleTag(tag)}
            >
              {tag}
            </button>
          )
        )}
      </>
    );
  }

  render() {
    return (
      <div>
        <div className={tagStyles["options-wrapper"]}>
          <TagsHeader
            updateShowTags={this.props.updateShowTags}
            showTags={this.props.showTags}
          />
        </div>
        <div className={tagStyles["tags-header"]}>
          <h1>Tags help readers find your content</h1>
          <h2>Select up to 3 tags for '{this.props.title}'</h2>
        </div>
        <this.TagButtons />
        <div className={tagStyles["filebar-wrapper"]}></div>
      </div>
    );
  }
}
