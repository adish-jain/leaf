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
