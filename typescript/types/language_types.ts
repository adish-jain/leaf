export const languageStrings: supportedLanguages = {
  html: {
    fileExtension: "html",
    prismName: "html",
    monacoName: "html",
  },
  css: {
    fileExtension: "css",
    prismName: "css",
    monacoName: "css",
  },
  scss: {
    fileExtension: "scss",
    prismName: "scss",
    monacoName: "css",
  },
  yaml: {
    fileExtension: "yaml",
    prismName: "yml",
    monacoName: "yaml",
  },
  json: {
    fileExtension: "json",
    prismName: "json",
    monacoName: "json",
  },
  typescript: {
    fileExtension: "ts",
    prismName: "typescript",
    monacoName: "typescript",
  },
  javascript: {
    fileExtension: "js",
    prismName: "javascript",
    monacoName: "typescript",
  },
  tsx: {
    fileExtension: "tsx",
    prismName: "tsx",
    monacoName: "typescript",
  },
  jsx: {
    fileExtension: "jsx",
    prismName: "jsx",
    monacoName: "typescript",
  },
  python: {
    fileExtension: "py",
    prismName: "python",
    monacoName: "python",
  },
  java: {
    fileExtension: "java",
    prismName: "java",
    monacoName: "java",
  },
  go: {
    fileExtension: "go",
    prismName: "go",
    monacoName: "go",
  },
  php: {
    fileExtension: "php",
    prismName: "php",
    monacoName: "php",
  },
  ruby: {
    fileExtension: "rb",
    prismName: "ruby",
    monacoName: "ruby",
  },
  "objective-c": {
    fileExtension: "c",
    prismName: "objectivec",
    monacoName: "objective-c",
  },
  c: {
    fileExtension: "c",
    prismName: "c",
    monacoName: "cpp",
  },
  "c++": {
    fileExtension: "cpp",
    prismName: "cpp",
    monacoName: "cpp",
  },
  plaintext: {
    fileExtension: "txt",
    prismName: "textile",
    monacoName: "markdown",
  },
  xml: {
    fileExtension: "xml",
    prismName: "xml",
    monacoName: "xml",
  },
  rust: {
    fileExtension: "rs",
    prismName: "rust",
    monacoName: "rust",
  },
  markdown: {
    fileExtension: "md",
    prismName: "markdown",
    monacoName: "markdown",
  },
  swift: {
    fileExtension: "swift",
    prismName: "swift",
    monacoName: "swift",
  },
  dockerfile: {
    fileExtension: "dockerfile",
    prismName: "dockerfile",
    monacoName: "dockerfile",
  },
};

export type supportedLanguages = {
  html: ProgrammingLanguage;
  xml: ProgrammingLanguage;
  css: ProgrammingLanguage;
  scss: ProgrammingLanguage;
  yaml: ProgrammingLanguage;
  json: ProgrammingLanguage;
  typescript: ProgrammingLanguage;
  javascript: ProgrammingLanguage;
  tsx: ProgrammingLanguage;
  jsx: ProgrammingLanguage;
  python: ProgrammingLanguage;
  java: ProgrammingLanguage;
  go: ProgrammingLanguage;
  php: ProgrammingLanguage;
  ruby: ProgrammingLanguage;
  rust: ProgrammingLanguage;
  swift: ProgrammingLanguage;
  "objective-c": ProgrammingLanguage;
  c: ProgrammingLanguage;
  "c++": ProgrammingLanguage;
  plaintext: ProgrammingLanguage;
  markdown: ProgrammingLanguage;
  dockerfile: ProgrammingLanguage;
};

export type ProgrammingLanguage = {
  fileExtension: string;
  prismName: string;
  monacoName: string;
};
