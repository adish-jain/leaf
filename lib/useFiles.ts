import useSWR from "swr";
import Router from "next/router";
import { useEffect } from "react";
import { useState } from "react";
var shortId = require("shortid");
const fetch = require("node-fetch");

type File = {
  //replace with enum
  id: string;
  language: string;
  code: string;
  name: string;
};

export function useFiles(
  draftId: any, 
  draftFiles: any, 
  draftTitle: any,
  storedSteps: any,
  mutate: any) {
    let files = [...draftFiles];
    let numOfUntitleds = files.length; //shouldn't be len, but maxNum

    // Manages the files within the filebar.
    // var [files, updateFiles] = useState<File[]>(draftFiles,
      // draftFiles[0],
      // {
      //   id: shortId.generate(),
      //   name: "untitled.txt",
      //   code: "// Write some code here ...",
      //   language: "jsx",
      // },
      // getFirstFileData(),
    // );

    // getFirstFileData();
    // // retrieves the first file information from Firebase & adds to `files`
    // function getFirstFileData(): File { 
    //   var data = {
    //     requestedAPI: "get_first_file_data",
    //     draftId: draftId,
    //   }
    //   let results;
    //   fetch("/api/endpoint", {
    //     method: "POST",
    //     headers: new Headers({ "Content-Type": "application/json" }),
    //     body: JSON.stringify(data),
    //   }).then(async (res: any) => {
    //     console.log(res);
    //     results = res;
    //   });
    //   console.log(results);
    //   //@ts-ignore
    //   return results;
    // }
    
    // saveFile(files[0]["id"], files[0]["name"], files[0]["code"], files[0]["language"]);

    /* Manages which file is selected in the filebar.
    * files[selectedfileIndex] will give you the current selected file
    */
    const [selectedFileIndex, changeSelectedFileIndex] = useState(0);

    /*
    * Update the code in DynamicCodeEditor in the correct file
    */
    function changeCode(value: string) {
      // let duplicateFiles = [...files];
      console.log(value);
      files[selectedFileIndex].code = value;
      // updateFiles(duplicateFiles);
      // draftFiles = duplicateFiles;
      // console.log(duplicateFiles);
      // files = duplicateFiles;
      let title = draftTitle;
      let optimisticSteps = storedSteps;
      // let files = draftFiles;
      console.log(files);
      let mutateState = { title, optimisticSteps, files };
      // let mutateState = { title, optimisticSteps, code, language };
      mutate(mutateState, false);
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

      // updateFiles(
      //   files.concat({
      //     name: newFileName,
      //     id: newFileId,
      //     code: newFileCode,
      //     language: newFileLang,
      //   })
      // );
      // console.log(files);
      let title = draftTitle;
      let optimisticSteps = storedSteps;
      // let files = draftFiles;
      let mutateState = { title, optimisticSteps, files };
      // // let mutateState = { title, optimisticSteps, code, language };
      mutate(mutateState, false);
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
      let title = draftTitle;
      let optimisticSteps = storedSteps;
      // let files = draftFiles;
      let mutateState = { title, optimisticSteps, files };
      // // let mutateState = { title, optimisticSteps, code, language };
      mutate(mutateState, false);
      // updateFiles(cloneFiles);
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
      // let duplicateFiles = [...files];
      files[selectedFileIndex].language = language;
      // files = duplicateFiles;
      // updateFiles(duplicateFiles);

      let title = draftTitle;
      let optimisticSteps = storedSteps;
      let mutateState = { title, optimisticSteps, files };
      mutate(mutateState, true); // true, not false
      console.log(files);
      
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
      let code = files[selectedFileIndex].code;
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
        addFile, 
        removeFile, 
        changeCode, 
        changeSelectedFileIndex, 
        changeFileLanguage,
        saveFileCode,
    }
  }
