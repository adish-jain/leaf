import { useState, useContext } from "react";
import { fileObject } from "../typescript/types/frontend/postTypes";
import {
  getLanguageFromExtension,
  getExtensionFromLanguage,
} from "./utils/languageUtils";
import useSWR, { SWRConfig } from "swr";
import { FilesContext } from "../contexts/files-context";
import {
  ProgrammingLanguage,
  supportedLanguages,
} from "../typescript/types/language_types";
import { Lines } from "../typescript/types/app_types";
import { Node } from "slate";
import { ReactEditor } from "slate-react";
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

function prepareFetching(draftId: string) {
  const myRequest = (requestedAPI: string) => {
    return {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        requestedAPI: requestedAPI,
        draftId,
      }),
    };
  };

  const contentFetcher = () =>
    fetch("../api/endpoint", myRequest("getFiles")).then((res: any) =>
      res.json()
    );
  return contentFetcher;
}
/*
 * Manages the files within filebar.
 */
export function useFiles(draftId: any, authenticated: boolean) {
  const contentFetcher = prepareFetching(draftId);
  const initialFilesData: fileObject[] = [];
  let { data: fileData, mutate } = useSWR<fileObject[]>(
    authenticated ? "getFiles" : null,
    contentFetcher,
    {
      initialData: initialFilesData,
      revalidateOnMount: true,
      revalidateOnFocus: true,
    }
  );
  const files = fileData || [];

  // What lines are currently highlighted?
  const [currentlySelectedLines, changeSelectedLines] = useState<Lines>({
    start: 0,
    end: 0,
  });
  // Need to fix this to be maxNum of files so far to avoid duplicate keys
  let numOfUntitleds = files?.length || 0;

  /* 
    Manages which file is selected in the filebar.
    files[selectedfileIndex] will give you the current selected file
    */
  const [selectedFileIndex, changeSelectedFileIndex] = useState(0);
  let selectedFile: fileObject | undefined;
  // if out of bounds
  if (selectedFileIndex < 0 || selectedFileIndex > files.length - 1) {
    selectedFile = undefined;
  } else {
    selectedFile = files[selectedFileIndex];
  }

  /*
    Update the code in DynamicCodeEditor in the correct file
    */
  function changeCode(value: Node[]) {
    const newObject = {
      fileName: selectedFile!.fileName.slice(),
      language: selectedFile!.language.slice(),
      code: value,
      order: selectedFile!.order,
      fileId: selectedFile!.fileId,
      testing: shortId.generate(),
    };

    mutate(async (mutateState) => {
      return [
        ...mutateState.slice(0, selectedFileIndex),
        newObject,
        ...mutateState.slice(selectedFileIndex + 1),
      ];
    }, false);
  }

  /*
    Gets a list of currently existing file names.
    Unused, but leaving in case useful for later.
    */
  function getFileNames() {
    let names: string[] = [];
    files.forEach((file) => {
      names.push(file.fileName);
    });
    return names;
  }

  /*
    Checks to see if the fileName already exists in our list of files.
    */
  function fileNameExistsFullSearch(fileName: string): boolean {
    let exists = false;
    files.forEach((file) => {
      if (file.fileName == name) {
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

  /** 
    When a files name is changed, we update the name field.
    Triggered from `FileName.tsx`.
    */
  function onNameChange(name: string) {
    duplicateFiles[selectedFileIndex].name = name;

    updateFiles(duplicateFiles);
  }

  /** 
    Saves the file name to Firebase. Triggered from `FileName.tsx`. 
    Also updates the language selection for the file to match the new file name.
    If the file name is already taken, use `getNewFileName` to name file & throw alert.
    If no extension is given, file defaults to a text file. 
      `value` is the file name as a string.
      `external` is true when triggered from `FileName.tsx` & false otherwise.
    */
  function saveFileName(value: string, external: boolean) {
    value = value.trim();

    let modifiedItem: fileObject = files[selectedFileIndex];
    if (fileNameExistsPartialSearch(value)) {
      alert("This file name already exists. Please try another name.");
      modifiedItem.fileName = getNewFileName();
    } else {
      modifiedItem.fileName = value;
    }

    if (external) {
      setLangFromName(modifiedItem.fileName);
    }

    mutate(async (mutateState) => {
      let modifiedItem: fileObject = mutateState[selectedFileIndex];
      modifiedItem.fileName = value;
      return [
        ...mutateState.slice(0, selectedFileIndex),
        modifiedItem,
        ...mutateState.slice(selectedFileIndex + 1),
      ];
    }, false);

    let data = {
      requestedAPI: "save_file_name",
      draftId: draftId,
      fileId: files[selectedFileIndex].fileId,
      fileName: value,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {});
  }
  /** 
    Saves the language selection to Firebase. Triggered from `LanguageBar.tsx`. 
    Also updates the file name to match the new language selection. 
      `language` is the language selection as a string.
      `external` is true when triggered from `LanguageBar.tsx` & false otherwise.
    */
  async function changeFileLanguage(language: string, external: boolean) {
    const selectedFile = files[selectedFileIndex];
    if (external) {
      setNameFromLang(language);
    }
    let bodyData = {
      requestedAPI: "change_file_language",
      draftId: draftId,
      fileId: selectedFile.fileId,
      language: language,
    };
    const newObject = {
      fileName: selectedFile.fileName.slice(),
      language: language.slice(),
      code: selectedFile.code,
      order: selectedFile.order,
      fileId: selectedFile.fileId,
      testing: shortId.generate(),
    };
    // console.log("current is ", files[selectedFileIndex].language);
    await mutate(async (mutateState) => {
      fetch("/api/endpoint", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(bodyData),
      }).then(async (res: any) => {});
      return [
        ...mutateState.slice(0, selectedFileIndex),
        newObject,
        ...mutateState.slice(selectedFileIndex + 1),
      ];
    }, false);
  }

  /** 
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

  /** 
    Sets the extension of the file given the language selection. 
    Called by changeFileLanguage (defined above) when `external` is true.
    */
  function setNameFromLang(value: string) {
    let extension = getExtensionFromLanguage(value);
    let fileName = files[selectedFileIndex].fileName;
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

  /** 
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

  /** 
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

  /**
   * Remove a file.
   * @param toDeleteIndex Index of file to be deleted.
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

  /** 
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

  /** 
    Saves file code to Firebase. Triggered from `DynamicCodeEditor.tsx`. 
    */
  function saveFileCode() {
    let fileId = files[selectedFileIndex].fileId;
    let code = files[selectedFileIndex].code;

    files[selectedFileIndex].code = code;
    console.log("save file code");
    // mutate(async (mutateState: fileObject[]) => {
    //   return { ...mutateState, files };
    // }, false);

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
    files,
    onNameChange,
    addFile,
    changeCode,
    removeFile,
    changeSelectedFileIndex,
    changeFileLanguage,
    saveFileName,
    selectedFile,
    currentlySelectedLines,
    changeSelectedLines,
    saveFileCode,
  };
}
