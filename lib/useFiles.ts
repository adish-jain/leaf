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
  draftTitle: string,
  storedSteps: any,
  mutate: any) {

    /*
    Manages the files within filebar.
    The id, language, & name fields are guaranteed to be correct.
    */
    let files = [...draftFiles];

    /*
    Manages the code within the files. 
    The code field is guaranteed to be correct.
    Create this separation to maintain consistency between local state 
    of `files` and Firebase `files` collection. `codeFiles` maintains 
    local changes to code until it is saved, propagated to Firebase,
    and then `files` is updated to reflect the new code changes. 
    */
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
    
    type tExtToName = {
      [key: string]: string
    }

    type tNameToExt = {
      [key: string]: string
    }

    const extToName: tExtToName = {
      "py": "python", 
      "jsx": "jsx", 
      "js": "javascript", 
      "html": "xml",
      "go": "go",
      "css": "css",
      "c": "text/x-csrc",
      "h": "text/x-csrc",
      "cpp": "text/x-c++src",
      "java": "text/x-java",
      "php": "php",
      "rb": "ruby",
      "txt": "textile",
    }
    Object.freeze(extToName);

    const nameToExt: tNameToExt = {
      "python": "py", 
      "jsx": "jsx", 
      "javascript": "js", 
      "xml": "html", 
      "go": "go",
      "css": "css",
      "text/x-csrc": "c",
      "text/x-c++src": "cpp",
      "text/x-java": "java",
      "php": "php",
      "ruby": "rb",
      "textile": "txt",
    }
    Object.freeze(nameToExt);

    /*
    * Update the code in DynamicCodeEditor in the correct file
    */
    function changeCode(value: string) {
      let duplicateFiles = [...codeFiles];
      duplicateFiles[selectedFileIndex].code = value;
      updateFiles(duplicateFiles);
    }

    function saveFileName(value: string, external: boolean) {
      let duplicateFiles = [...files];
      duplicateFiles[selectedFileIndex].name = value;
      files = duplicateFiles;
      updateFiles(duplicateFiles);
      if (external) {
        setLangFromName(value);
      }
      
      let title = draftTitle;
      let optimisticSteps = storedSteps;
      let mutateState = { title, optimisticSteps, files };

      mutate(mutateState, false);

      var data = {
        requestedAPI: "save_file_name",
        draftId: draftId,
        fileId: files[selectedFileIndex].id,
        fileName: value,
      }

      fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
      }).then(async (res: any) => {
        console.log(res);
      });
    }

    function changeFileLanguage(language: string, external: boolean) {
      let fileId = files[selectedFileIndex].id;
      let duplicateFiles = [...files];
      duplicateFiles[selectedFileIndex].language = language;
      files = duplicateFiles;
      codeFiles = duplicateFiles;
      if (external) {
        setNameFromLang(language);
      }

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

    function setLangFromName(value: string) {
      let fileNameTokens = value.split(".");
      let langType;
      if (fileNameTokens.length === 1) { // no extension defaults to txt
        langType = "txt";
      } else {
        langType = fileNameTokens[fileNameTokens.length - 1];
      }

      langType = langType.trim();

      if (!(langType in extToName)) { // if extension type isn't supported
        alert("This file extension is not supported yet!");
        langType = "txt";
      }

      changeFileLanguage(extToName[langType], false);
    }

    function setNameFromLang(value: string) {
      let extension = nameToExt[value];
      let fileName = files[selectedFileIndex].name;
      let newName;
      if (!(fileName.includes("."))) {
        newName = fileName + "." + extension;
      } else {
        let extIdx = fileName.lastIndexOf(".");
        let beforeExt = fileName.slice(0, extIdx);
        if (value == "textile") {
          newName = beforeExt;
        } else {
          newName = beforeExt + "." + extension;
        }
      }
      
      saveFileName(newName, false);
    }

    /*
    * Adds a new file to the Filebar. Currently does not store the new file in firebase.
    */
    function addFile() {
      // make sure file is untitled2, untitled3, etc.
      numOfUntitleds++;
      let newFileName = `untitled${numOfUntitleds}`;
      let newFileCode = "// Write some code here ...";
      let newFileLang = "textile";
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

    function saveFileCode() {
      let fileId = files[selectedFileIndex].id;
      let code = codeFiles[selectedFileIndex].code;

      files[selectedFileIndex].code = code;
      let title = draftTitle;
      let optimisticSteps = storedSteps;
      
      let mutateState = { title, optimisticSteps, files };
      mutate(mutateState, false);

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
        saveFileName,
        saveFileCode,
    }
}
