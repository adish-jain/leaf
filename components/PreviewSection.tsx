import React, { Component } from "react";
const previewSectionStyles = require("../styles/PreviewSection.module.scss");

type PreviewSectionProps = {};

export default class PreviewSection extends Component<PreviewSectionProps> {
  constructor(props: PreviewSectionProps) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className={previewSectionStyles.PreviewSection}>
        
    </div>;
  }
}
