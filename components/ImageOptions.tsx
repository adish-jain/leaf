import React, { Component } from "react";
import ImageOptionsStyles from "../styles/ImageOptions.module.scss";

type ImageOptionsProps = {};

type ImageOptionsState = {};

export default class ImageOptions extends Component<ImageOptionsState> {
  constructor(props: ImageOptionsProps) {
    super(props);
    this.state = {};
  }

  render() {
    let {} = this.props;

    return (
      <div className={ImageOptionsStyles["options-wrapper"]}>
        <div className={ImageOptionsStyles["title-with-divider"]}>
          <label>Image Options</label>
          <div></div>
        </div>
        <div className={ImageOptionsStyles["buttons"]}>
          <button>+ Add Image</button>
          <button>Use Image From A Previous Step</button>
        </div>
      </div>
    );
  }
}
