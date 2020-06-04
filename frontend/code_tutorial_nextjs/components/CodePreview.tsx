import {CodeView} from "./CodeView";
import Preview from "./Preview";
import FileNames from "./FileNames";
import React, { useState } from "react";
const codePreviewStyles = require('../styles/CodePreview.module.scss');

const files = ["index.jsx", "index.css"];

export default function CodePreview() {
  const [selectedFile, changeSelectedFile] = useState(0);

  return (
    <div className={codePreviewStyles.codePreview}>
      <Preview />
      <FileNames
        files={files}
        selectedFile={selectedFile}
        changeSelected={changeSelectedFile}
      />
      <CodeView selected_file={selectedFile} />
    </div>
  );
}
