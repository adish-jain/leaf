import React, { Component, SetStateAction } from "react";
import "../styles/tags.scss";
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
      <div className={"tags"}>
        {typeof this.props.selectedTags === "undefined" ? (
          <this.NoSelectedTags tagsList={tagsList} />
        ) : (
          <this.SomeSelectedTags tagsList={tagsList} />
        )}
      </div>
    );
  }

  NoSelectedTags(props: { tagsList: any }) {
    return props.tagsList.map((tag: string) => (
      <button
        id={tag}
        className={"tag-button"}
        onClick={() => this.props.toggleTag(tag)}
      >
        {tag}
      </button>
    ));
  }

  SomeSelectedTags(props: { tagsList: any }) {
    return props.tagsList.map((tag: string) =>
      this.props.selectedTags.includes(tag) ? (
        <button
          id={tag}
          className={"selected-tag-button"}
          onClick={() => this.props.toggleTag(tag)}
        >
          {tag}
        </button>
      ) : (
        <button
          id={tag}
          className={"tag-button"}
          onClick={() => this.props.toggleTag(tag)}
        >
          {tag}
        </button>
      )
    );
  }

  render() {
    return (
      <div>
        <div className={"options-wrapper"}>
          <TagsHeader
            updateShowTags={this.props.updateShowTags}
            showTags={this.props.showTags}
          />
        </div>
        <div className={"tags-header"}>
          <h1>Tags help readers find your content</h1>
          <h2>Select up to 3 tags for '{this.props.title}'</h2>
        </div>
        <this.TagButtons />
        <div className={"filebar-wrapper"}></div>
      </div>
    );
  }
}
