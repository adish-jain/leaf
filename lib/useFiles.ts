import useSWR from "swr";
import Router from "next/router";
import { useEffect } from "react";
import { useState } from "react";

type File = {
  //replace with enum
  language: string;
  code: string;
  name: string;
};

let numOfUntitleds = 1;

export function useFiles() {
  // Manages the files within the filebar.
  const [files, updateFiles] = useState<File[]>([
    {
      name: "untitled.txt",
      code: "",
      language: "jsx",
    },
  ]);

  /* Manages which file is selected in the filebar.
   * files[selectedfileIndex] will give you the current selected file
   */
  const [selectedFileIndex, changeSelectedFileIndex] = useState(0);

  /*
   * Update the code in DynamicCodeEditor in the correct file
   */
  function changeCode(value: string) {
    let duplicateFiles = [...files];
    duplicateFiles[selectedFileIndex].code = value;
    updateFiles(duplicateFiles);
  }

  /*
   * Adds a new file to the Filebar. Currently does not store the new file in firebase.
   */
  function addFile() {
    // make sure file is untitled2, untitled3, etc.
    numOfUntitleds++;
    let newFileName = `untitled${numOfUntitleds}.txt`;

    updateFiles(
      files.concat({
        name: newFileName,
        code: "",
        language: "jsx",
      })
    );
  }

    /*
   * Delete a file in the filebar. Makes sure that the selected file is set correctly after deletion.
   */
  function deleteFile(toDeleteIndex: number) {
    // can have minimum one file
    if (files.length === 1) {
      return;
    }
    if (toDeleteIndex < 0 || toDeleteIndex > files.length - 1) {
      return;
    }

    let cloneFiles = [...files];
    if (toDeleteIndex <= selectedFileIndex) {
      // shift selected file index back by one, with minimum index of 0
      let newIndex = Math.max(selectedFileIndex - 1, 0);
      changeSelectedFileIndex(newIndex);
    }
    cloneFiles.splice(toDeleteIndex, 1);
    updateFiles(cloneFiles);
  }
  
  return {
      files, selectedFileIndex, addFile, deleteFile, changeCode, changeSelectedFileIndex
  }
}
