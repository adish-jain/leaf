import useSWR from "swr";
import Router from "next/router";
import { useEffect } from "react";
import { useState } from "react";
var shortId = require("shortid");
const fetch = require("node-fetch");

type File = {
  id: string;
  language: string; //replace with enum
  code: string;
  name: string;
};

type codeFile = {
  code: string;
}

export function useFiles(
  draftId: any, 
  draftFiles: any, 
  draftTitle: any,
  storedSteps: any,
  mutate: any) {

    // Manages the files within filebar.
    // The id, language, & name fields are guaranteed to be correct.
    let files = [...draftFiles];

    // Manages the code within the files.
    // The code field is guaranteed to be correct.
    var [codeFiles, updateFiles] = useState<File[]>(files.slice());
    if (files[0]["id"] !== codeFiles[0]["id"] || files.length !== codeFiles.length) {
      updateFiles(files.slice());
    }

    // Need to fix this to be maxNum of files so far to avoid duplicate keys  
    let numOfUntitleds = files.length; 

    /* Manages which file is selected in the filebar.
    * files[selectedfileIndex] will give you the current selected file
    */
    const [selectedFileIndex, changeSelectedFileIndex] = useState(0);

    /*
    * Update the code in DynamicCodeEditor in the correct file
    */
    function changeCode(value: string) {
      let duplicateFiles = [...codeFiles];
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
      let newFileCode = "// Write some code here ...";
      let newFileLang = "jsx";
      let newFileId = shortId.generate();

      files.push({
        name: newFileName,
        id: newFileId,
        code: newFileCode,
        language: newFileLang,
      })

      codeFiles.push({
        name: newFileName,
        id: newFileId,
        code: newFileCode,
        language: newFileLang,
      })

      let title = draftTitle;
      let optimisticSteps = storedSteps;
      let mutateState = { title, optimisticSteps, files };

      mutate(mutateState, true);
      saveFile(newFileId, newFileName, newFileCode, newFileLang);
    }

    function saveFile(
      fileId: string,
      fileName: string,
      fileCode: string,
      fileLang: string) {
      // save file 
      var data = {
        requestedAPI: "save_file",
        draftId: draftId,
        fileId: fileId,
        fileName: fileName,
        fileCode: fileCode,
        fileLang: fileLang,
      }

      fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }).then(async (res: any) => {
        console.log(res);
      });
    }

      /*
    * Delete a file in the filebar. Makes sure that the selected file is set correctly after deletion.
    */
    function removeFile(toDeleteIndex: number) {
      // can have minimum one file
      if (files.length === 1) {
        return;
      }
      if (toDeleteIndex < 0 || toDeleteIndex > files.length - 1) {
        return;
      }

      let cloneFiles = [...files];
      let toDeleteFileId = files[toDeleteIndex].id;
      if (toDeleteIndex <= selectedFileIndex) {
        // shift selected file index back by one, with minimum index of 0
        let newIndex = Math.max(selectedFileIndex - 1, 0);
        changeSelectedFileIndex(newIndex);
      }
     
      cloneFiles.splice(toDeleteIndex, 1);
      files = cloneFiles;
      codeFiles = cloneFiles;

      let title = draftTitle;
      let optimisticSteps = storedSteps;
      
      let mutateState = { title, optimisticSteps, files };
      mutate(mutateState, false);
      deleteFile(toDeleteFileId);
    }

    function deleteFile(fileId: string) {
      var data = {
        requestedAPI: "delete_file",
        draftId: draftId,
        fileId: fileId,
      }

      fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }).then(async (res: any) => {
        console.log(res);
      });
    }

    function changeFileLanguage(language: string) {
      let fileId = files[selectedFileIndex].id;
      let duplicateFiles = [...files];
      duplicateFiles[selectedFileIndex].language = language;
      files = duplicateFiles;
      codeFiles = duplicateFiles;

      let title = draftTitle;
      let optimisticSteps = storedSteps;

      let mutateState = { title, optimisticSteps, files };
      mutate(mutateState, true); 
      
      var data = {
        requestedAPI: "change_file_language",
        draftId: draftId,
        fileId: fileId,
        language: language,
      }

      fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }).then(async (res: any) => {
        console.log(res);
      });
    }

    function saveFileCode() {
      let fileId = files[selectedFileIndex].id;
      let code = codeFiles[selectedFileIndex].code;

      var data = {
        requestedAPI: "save_file_code",
        draftId: draftId,
        fileId: fileId,
        code: code,
      }

      fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }).then(async (res: any) => {
        console.log(res);
      });
    }
    
    return { 
        selectedFileIndex, 
        codeFiles,
        addFile, 
        removeFile, 
        changeCode, 
        changeSelectedFileIndex, 
        changeFileLanguage,
        saveFileCode,
    }
}
