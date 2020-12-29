import { useState, useContext, useEffect } from "react";
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
import {
  Lines,
  newFileNode,
  WAIT_INTERVAL,
} from "../typescript/types/app_types";
import { Node } from "slate";
import { ReactEditor } from "slate-react";
import { ToolbarContext } from "../contexts/toolbar-context";
import { saveStatusEnum } from "../typescript/enums/app_enums";
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
  let timer: NodeJS.Timeout | null = null;
  const contentFetcher = prepareFetching(draftId);
  const toolbarContext = useContext(ToolbarContext);
  const { updateSaving } = toolbarContext;
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
        ...mutateState!.slice(0, selectedFileIndex),
        newObject,
        ...mutateState!.slice(selectedFileIndex + 1),
      ];
    }, false);
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      const fetchProduct = async () => {
        try {
          saveFileCode(selectedFileIndex);
        } catch (err) {
          console.log(err);
        }
      };
      updateSaving(saveStatusEnum.saving);

      fetchProduct().then(() => {
        updateSaving(saveStatusEnum.saved);
      });
    }, WAIT_INTERVAL);
    return () => {
      clearTimeout(timeOutId);
      updateSaving(saveStatusEnum.notsaved);
    };
  }, [files]);

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
      if (file.fileName == fileName) {
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
      if (file.fileName === name && index != selectedFileIndex) {
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
    Saves the file name to Firebase. Triggered from `FileName.tsx`. 
    Also updates the language selection for the file to match the new file name.
    If the file name is already taken, use `getNewFileName` to name file & throw alert.
    If no extension is given, file defaults to a text file. 
      `value` is the file name as a string.
      `external` is true when triggered from `FileName.tsx` & false otherwise.
    */
  function saveFileName(value: string, external: boolean) {
    let newValue = value.trim();
    let selectedFile: fileObject = files[selectedFileIndex];
    const newObject = {
      fileName: value,
      language: selectedFile.language.slice(),
      code: selectedFile.code,
      order: selectedFile.order,
      fileId: selectedFile.fileId,
      testing: shortId.generate(),
    };

    if (fileNameExistsPartialSearch(value)) {
      alert("This file name already exists. Please try another name.");
      newObject.fileName = getNewFileName();
    }

    if (external) {
      newObject.language = setLangFromName(newObject.fileName);
      // modifiedItem.testing = shortId.generate();
    }

    mutate(async (mutateState) => {
      return [
        ...mutateState!.slice(0, selectedFileIndex),
        newObject,
        ...mutateState!.slice(selectedFileIndex + 1),
      ];
    }, false);
    console.log(newObject);
    updateFile(newObject);
  }
  /** 
    Saves the language selection to Firebase. Triggered from `LanguageBar.tsx`. 
    Also updates the file name to match the new language selection. 
      `language` is the language selection as a string.
      `external` is true when triggered from `LanguageBar.tsx` & false otherwise.
    */
  async function changeFileLanguage(language: string, external: boolean) {
    console.log("Changing to ", language);
    const selectedFile = files[selectedFileIndex];
    if (external) {
      setNameFromLang(language);
    }

    const newObject = {
      fileName: selectedFile.fileName.slice(),
      language: language.slice(),
      code: selectedFile.code,
      order: selectedFile.order,
      fileId: selectedFile.fileId,
      testing: shortId.generate(),
    };
    // updateFile();
    // console.log("current is ", files[selectedFileIndex].language);
    await mutate(async (mutateState) => {
      return [
        ...mutateState!.slice(0, selectedFileIndex),
        newObject,
        ...mutateState!.slice(selectedFileIndex + 1),
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
    return newLanguage;
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
    let newFileLang = "plaintext";
    let newFileId = shortId.generate();
    const newFile: fileObject = {
      fileName: getNewFileName(),
      code: newFileNode,
      language: newFileLang,
      order: files.length + 1,
      fileId: newFileId,
    };

    mutate(async (mutateState) => {
      return [...mutateState!.slice(0), newFile];
    }, false);
    updateFile(newFile);
  }

  function updateFile(updatedFile: fileObject) {
    var data = {
      updatedFile,
      requestedAPI: "updateFile",
      draftId: draftId,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      // let updatedFiles = await res.json();
    });
  }

  /**
   * Remove a file.
   * @param toDeleteIndex Index of file to be deleted.
   */
  function removeFile(toDeleteIndex: number) {
    // can have minimum one file
    const deleteFileId = selectedFile?.fileId;
    if (files.length === 1) {
      return;
    }
    if (toDeleteIndex < 0 || toDeleteIndex > files.length - 1) {
      return;
    }

    if (toDeleteIndex <= selectedFileIndex) {
      // shift selected file index back by one, with minimum index of 0
      let newIndex = Math.max(selectedFileIndex - 1, 0);
      changeSelectedFileIndex(newIndex);
    }

    mutate(async (mutateState) => {
      return [
        ...mutateState!.slice(0, toDeleteIndex),
        ...mutateState!.slice(toDeleteIndex + 1),
      ];
    }, false);

    let data = {
      requestedAPI: "delete_file",
      draftId: draftId,
      fileId: deleteFileId,
    };

    fetch("/api/endpoint", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }).then(async (res: any) => {
      // let updatedFiles = await res.json();
    });
  }

  /** 
    Saves file code to Firebase. Triggered from `DynamicCodeEditor.tsx`. 
    */
  function saveFileCode(fileIndex: number) {
    updateFile(files[selectedFileIndex]);
  }

  function modifyFileName(newFileName: string, fileIndex: number) {
    const modifyFile = files[fileIndex];
    const newObject: fileObject = {
      fileName: newFileName,
      fileId: modifyFile.fileId,
      language: modifyFile.language,
      code: modifyFile.code,
      order: modifyFile.order,
    };
    mutate(async (mutateState) => {
      return [
        ...mutateState!.slice(0, selectedFileIndex),
        newObject,
        ...mutateState!.slice(selectedFileIndex + 1),
      ];
    }, false);
  }

  function getFileFromFileId(fileId?: string): fileObject | undefined {
    if (!fileId) {
      return undefined;
    }
    for (let i = 0; i < files.length; i++) {
      if (files[i].fileId === fileId) {
        return files[i];
      }
    }
    return undefined;
  }

  return {
    selectedFileIndex,
    files,
    addFile,
    changeCode,
    removeFile,
    changeSelectedFileIndex,
    changeFileLanguage,
    saveFileName,
    selectedFile,
    saveFileCode,
    modifyFileName,
    getFileFromFileId,
  };
}
