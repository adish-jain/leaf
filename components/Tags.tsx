import React, { useState, Component, SetStateAction } from "react";
const fetch = require("node-fetch");
import "../styles/tags.scss";
import { TagsHeader } from "../components/Headers";

type TagsProps = { 
  showTags: boolean;
  updateShowTags?: (value: SetStateAction<boolean>) => void;
  title: string;
  selectedTags: Array<String>;
  toggleTag: (value: string) => void;
};

type TagsState = {
};

export default class TagsView extends Component<
  TagsProps,
  TagsState
> {
  constructor(props: TagsProps,
    ) {
    super(props);
    this.state = {
    };

    this.TagButtons = this.TagButtons.bind(this);
    this.toggleTag = this.toggleTag.bind(this);
  }

  toggleTag(tag: string) {
      this.props.toggleTag(tag);
    // if (this.props.selectedTags.includes(tag)) {
    //     this.setState({
    //         selectedTags: this.props.selectedTags.filter((element) => element != tag)
    //     });
    //     var button = document.getElementById(tag);
    //     button!.style.color = "black";
    //     button!.style.background = "#F5F5F5"
    // } else if (this.props.selectedTags.length < 3) {
    //     this.setState({
    //         selectedTags: [...this.props.selectedTags, tag],
    //     });
    //     var button = document.getElementById(tag);
    //     button!.style.color = "white";
    //     button!.style.background = "#349AE9"
    // } else {
    //     console.log("too many tags selected");
    // }
  }

  TagButtons() {
      const tagsList = ["Algorithms", "Android", "Angular", "APIs", "AWS", 
      "Back End", "Data Science", "Design", "Django", "Documentation", "Front End", "Go", "Google Cloud", "HTML", "iOS", 
      "Java", "Javascript", "Machine Learning", "NextJS", "PHP", "Python", "React", "Ruby", "Web Dev", "Other"];
      return (
          <div className={"tags"}>
            {tagsList.map((tag: string) => (
                <button id={tag} className={"tag-buttons"} onClick={() => this.toggleTag(tag)}>{tag}</button>
            ))}
          </div>
      );
  }

  render() {
    console.log(this.props.selectedTags);
    return (
        <div>
            <div className={"options-wrapper"}>
                <TagsHeader
                    updateShowTags={this.props.updateShowTags}
                    showTags={this.props.showTags}
                />
            </div>
            <div className={"tags-header"}>
                <h1>'{this.props.title}' is almost ready to be published</h1>
                <h2>Select up to 3 tags to help readers find your article</h2>
            </div>
            <this.TagButtons />
            <div className={"filebar-wrapper"}>
            </div>
        </div>
    );
  }
}
