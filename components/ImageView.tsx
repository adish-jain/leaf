import React, { useState, Component } from "react";
const fetch = require("node-fetch");
import "../styles/imageview.scss";
let selectedImage: any;
import { File, Step, Lines } from "../typescript/types/app_types";

type ImageViewProps = {
  addStepImage: (image: any, stepId: string) => void;
  deleteStepImage: (stepId: string) => void;
  currentlyEditingStep: Step;
};

type ImageViewState = {
  upload: boolean;
  uploadFailed: boolean;
};

export default class ImageView extends Component<
  ImageViewProps,
  ImageViewState
> {
  constructor(props: ImageViewProps) {
    super(props);
    this.state = {
      upload: false,
      uploadFailed: false,
    };

    this.UploadScreen = this.UploadScreen.bind(this);
    this.SelectScreen = this.SelectScreen.bind(this);
    this.ImageScreen = this.ImageScreen.bind(this);

    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleImageSelect = this.handleImageSelect.bind(this);
    this.handleImageSubmit = this.handleImageSubmit.bind(this);
    this.handleImageDelete = this.handleImageDelete.bind(this);
  }

  handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    selectedImage = e.target.files![0];
    this.setState({ upload: true });
    this.setState({ uploadFailed: false });
  }

  handleImageSelect() {
    this.setState({ upload: false });
    this.setState({ uploadFailed: false });
  }

  async handleImageSubmit() {
    // 5 MB max on image uploads
    if (selectedImage.size > 5000000) {
      this.setState({ uploadFailed: true });
    } else {
      // optimistic mutate
      var url = URL.createObjectURL(selectedImage);
      this.props.currentlyEditingStep.imageURL = url;
      this.setState({ upload: false });
      let stepId = this.props.currentlyEditingStep.id;
      await this.props.addStepImage(selectedImage, stepId);
      // this.setState({ upload: false });
    }
  }

  async handleImageDelete() {
    let stepId = this.props.currentlyEditingStep.id;
    this.props.deleteStepImage(stepId);
    this.setState({ upload: false });
  }

  ImageScreen() {
    return (
      <div className={"imgView"}>
        <div className={"remove"} onClick={(e) => this.handleImageDelete()}>
          X
        </div>
        <img src={this.props.currentlyEditingStep.imageURL}></img>
      </div>
    );
  }

  UploadScreen() {
    return (
      <div className={"preview"}>
        <label className={"previewButtons"}>
          Upload File
          <input
            type="file"
            id="myFile"
            name="filename"
            accept="image/*"
            onChange={this.handleImageUpload}
          />
        </label>
      </div>
    );
  }

  SelectScreen() {
    return (
      <div className={"preview"}>
        <div className={"submit"}>
          <p>Selected {"name"}</p>
          <div className={"submitButtons"}>
            <button onClick={(e) => this.handleImageSelect()}>Go Back</button>
            <button onClick={(e) => this.handleImageSubmit()}>Submit</button>
          </div>
          {this.state.uploadFailed ? (
            <div>
              <br></br>Image size is too big! Select an image size up to 5mb.
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {!this.state.upload ? (
          // Image is in display or the upload option is available
          this.props.currentlyEditingStep?.imageURL !== undefined ? (
            // Image is in display
            <this.ImageScreen />
          ) : (
            // Upload screen is in display
            <this.UploadScreen />
          )
        ) : (
          // Image has been selected, and "Go Back" & "Submit" options are available
          // If selected file size was too big, error is displayed
          <this.SelectScreen />
        )}
      </div>
    );
  }
}
