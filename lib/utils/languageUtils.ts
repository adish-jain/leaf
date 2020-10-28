import { languageStrings } from "../../typescript/types/language_types";

/* 
Gathers all the language names that monaco supports from Leaf's supported languages.
*/
export function getMonacoLanguages() {
  let languageArray: string[] = [];
  Object.entries(languageStrings).forEach((record) => {
    let ProgrammingLanguageObject = record[1];
    languageArray.push(ProgrammingLanguageObject.monacoName);
  });
  let uniqueElements = new Set(languageArray);
  let filteredList = Array.from(uniqueElements);
  return filteredList;
}

/* 
Languages listed here: https://github.com/microsoft/monaco-editor-webpack-plugin
*/
export function getMonacoLanguageFromBackend(backendLanguage: string) {
  let monacoLanguage: string = "markdown";
  Object.entries(languageStrings).forEach((record) => {
    let ProgrammingLanguageObject = record[1];
    if (record[0] === backendLanguage) {
      monacoLanguage = ProgrammingLanguageObject.monacoName;
    }
  });
  return monacoLanguage;
}

export function getLanguageFromExtension(extension: string) {
  let language: string = "markdown";
  Object.entries(languageStrings).forEach((record) => {
    let ProgrammingLanguageObject = record[1];
    if (ProgrammingLanguageObject.fileExtension === extension) {
      language = record[0];
      return;
    }
  });
  // default
  return language;
}

export function getExtensionFromLanguage(language: string) {
  let extension: string = "md";
  Object.entries(languageStrings).forEach((record) => {
    let ProgrammingLanguageObject = record[1];
    if (record[0] === language) {
      extension = ProgrammingLanguageObject.fileExtension;
      return;
    }
  });
  // default
  return extension;
}
