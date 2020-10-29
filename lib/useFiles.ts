import { useState } from "react";
import {
  getLanguageFromExtension,
  getExtensionFromLanguage,
} from "./utils/languageUtils";
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
};

export function useFiles(draftId: any, draftFiles: any, mutate: any) {
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
  if (
    (files.length != 0 && files[0]["id"] !== codeFiles[0]["id"]) ||
    files.length !== codeFiles.length
  ) {
    updateFiles(files.slice());
  }

  // Need to fix this to be maxNum of files so far to avoid duplicate keys
  let numOfUntitleds = files.length;

  /* 
    Manages which file is selected in the filebar.
    files[selectedfileIndex] will give you the current selected file
    */
  const [selectedFileIndex, changeSelectedFileIndex] = useState(0);

  /*
    Update the code in DynamicCodeEditor in the correct file
    */
  function changeCode(value: string) {
    let duplicateFiles = [...codeFiles];
    duplicateFiles[selectedFileIndex].code = value;
    updateFiles(duplicateFiles);
  }

  /*
    Gets a list of currently existing file names.
    Unused, but leaving in case useful for later.
    */
  function getFileNames() {
    let names: string[] = [];
    files.forEach((file) => {
      names.push(file.name);
    });
    return names;
  }

  /*
    Checks to see if the fileName already exists in our list of files.
    */
  function fileNameExistsFullSearch(name: string): boolean {
    let exists = false;
    files.forEach((file) => {
      if (file.name == name) {
        exists = true;
      }
    });
    return exists;
  }

  /*
    Checks to see if the fileName already exists in our list of files by
    checking every index except the selectedFileIndex.
    */
  function fileNameExistsPartialSearch(name: string): boolean {
    let exists = false;
    files.forEach((file, index) => {
      if (file.name === name && index != selectedFileIndex) {
        exists = true;
      }
    });
    return exists;
  }

  function getNewFileName() {
    let newFileName = `untitled${numOfUntitleds}`;
    while (fileNameExistsFullSearch(newFileName)) {
      numOfUntitleds++;
      newFileName = `untitled${numOfUntitleds}`;
    }
    return newFileName;
  }

  /*
    When a files name is changed, we update the name field.
    Triggered from `FileName.tsx`.
    */
  function onNameChange(name: string) {
    let duplicateFiles = [...files];
    duplicateFiles[selectedFileIndex].name = name;
    updateFiles(duplicateFiles);
  }

  /*
    Saves the file name to Firebase. Triggered from `FileName.tsx`. 
    Also updates the language selection for the file to match the new file name.
    If the file name is already taken, use `getNewFileName` to name file & throw alert.
    If no extension is given, file defaults to a text file. 
      `value` is the file name as a string.
      `external` is true when triggered from `FileName.tsx` & false otherwise.
    */
  function saveFileName(value: string, external: boolean) {
    let duplicateFiles = [...files];
    value = value.trim();

    if (fileNameExistsPartialSearch(value)) {
      alert("This file name already exists. Please try another name.");
      duplicateFiles[selectedFileIndex].name = getNewFileName();
    } else {
      duplicateFiles[selectedFileIndex].name = value;
    }

    files = duplicateFiles;
    updateFiles(duplicateFiles);
    if (external) {
      setLangFromName(files[selectedFileIndex].name);
    }

    mutate(async (mutateState: any) => {
      return { ...mutateState, files };
    }, false);

    var data = {
      requestedAPI: "save_file_name",
      draftId: draftId,
      fileId: files[selectedFileIndex].id,
      fileName: value,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {});
  }

  /*
    Saves the language selection to Firebase. Triggered from `LanguageBar.tsx`. 
    Also updates the file name to match the new language selection. 
      `language` is the language selection as a string.
      `external` is true when triggered from `LanguageBar.tsx` & false otherwise.
    */
  function changeFileLanguage(language: string, external: boolean) {
    let fileId = files[selectedFileIndex].id;
    let duplicateFiles = [...files];
    duplicateFiles[selectedFileIndex].language = language;
    files = duplicateFiles;
    codeFiles = duplicateFiles;
    if (external) {
      setNameFromLang(language);
    }

    mutate(async (mutateState: any) => {
      return { ...mutateState, files };
    }, false);

    var data = {
      requestedAPI: "change_file_language",
      draftId: draftId,
      fileId: fileId,
      language: language,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {});
  }

  /*
    Sets the language of the file given the file name. 
    Called by saveFileName (defined above) when `external` is true. 
    If no extension is included in the filename, default to text file.
    Throws an alert if an unsupported extension is given, and defaults to text file.
    */
  function setLangFromName(value: string) {
    let fileNameTokens = value.split(".");
    let langType;
    if (fileNameTokens.length === 1) {
      // no extension defaults to txt
      langType = "txt";
    } else {
      langType = fileNameTokens[fileNameTokens.length - 1];
    }
    langType = langType.trim();
    let newLanguage = getLanguageFromExtension(langType);
    changeFileLanguage(newLanguage, false);
  }

  /*
    Sets the extension of the file given the language selection. 
    Called by changeFileLanguage (defined above) when `external` is true.
    */
  function setNameFromLang(value: string) {
    let extension = getExtensionFromLanguage(value);
    let fileName = files[selectedFileIndex].name;
    let newName;
    if (!fileName.includes(".")) {
      newName = fileName + "." + extension;
    } else {
      let extIdx = fileName.lastIndexOf(".");
      let beforeExt = fileName.slice(0, extIdx);
      if (value == "textile" || value == "plaintext") {
        newName = beforeExt;
      } else {
        newName = beforeExt + "." + extension;
      }
    }

    saveFileName(newName, false);
  }

  /*
    Adds a new file to the Filebar. 
    Calls saveFile to save file to Firebase.
    New files are by default text files. 
    Triggered from `FileBar.tsx`.
    */
  function addFile() {
    // make sure file is untitled2, untitled3, etc.
    numOfUntitleds++;
    let newFileName = getNewFileName();
    let newFileCode = "// Write some code here ...";
    let newFileLang = "plaintext";
    let newFileId = shortId.generate();

    files.push({
      name: newFileName,
      id: newFileId,
      code: newFileCode,
      language: newFileLang,
    });

    codeFiles.push({
      name: newFileName,
      id: newFileId,
      code: newFileCode,
      language: newFileLang,
    });

    mutate(async (mutateState: any) => {
      return { ...mutateState, files };
    }, false);

    saveFile(newFileId, newFileName, newFileCode, newFileLang);
  }

  /*
    Saves a file to Firebase. 
    */
  function saveFile(
    fileId: string,
    fileName: string,
    fileCode: string,
    fileLang: string
  ) {
    // save file
    var data = {
      requestedAPI: "save_file",
      draftId: draftId,
      fileId: fileId,
      fileName: fileName,
      fileCode: fileCode,
      fileLang: fileLang,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let updatedFiles = await res.json();
    });
  }

  /*
    Deletes a file in the filebar. 
    Makes sure that the selected file is set correctly after deletion.
    Triggered from `FileName.tsx`.
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

    mutate(async (mutateState: any) => {
      return { ...mutateState, files };
    }, false);

    deleteFile(toDeleteFileId);
  }

  /*
    Removes file from Firebase.
    */
  function deleteFile(fileId: string) {
    var data = {
      requestedAPI: "delete_file",
      draftId: draftId,
      fileId: fileId,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      let updatedFiles = await res.json();
    });
  }

  /*
    Saves file code to Firebase. Triggered from `DynamicCodeEditor.tsx`. 
    */
  function saveFileCode() {
    let fileId = files[selectedFileIndex].id;
    let code = codeFiles[selectedFileIndex].code;

    files[selectedFileIndex].code = code;

    mutate(async (mutateState: any) => {
      return { ...mutateState, files };
    }, false);

    var data = {
      requestedAPI: "save_file_code",
      draftId: draftId,
      fileId: fileId,
      code: code,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {});
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
    onNameChange,
    saveFileCode,
  };
}
