import { FunctionComponent } from "react";
import { FilesContext } from "../contexts/files-context";
import { useFiles } from "../lib/useFiles";

type FilesContextWrapperProps = {
  authenticated: boolean;
  draftId: string;
};

export const FilesContextWrapper: FunctionComponent<FilesContextWrapperProps> = ({
  authenticated,
  draftId,
  children,
}) => {
  const {
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
  } = useFiles(draftId, authenticated);
  return (
    <FilesContext.Provider
      value={{
        addFile: addFile,
        changeCode: changeCode,
        removeFile: removeFile,
        changeSelectedFileIndex: changeSelectedFileIndex,
        changeFileLanguage: changeFileLanguage,
        saveFileName: saveFileName,
        selectedFile: selectedFile,
        files: files,
        saveFileCode: saveFileCode,
        selectedFileIndex: selectedFileIndex,
        modifyFileName,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};
