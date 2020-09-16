import { Block } from "../enums/app_enums";

export type File = {
  id: string;
  language: string;
  code: string;
  name: string;
};

export type Step = {
  text: string;
  id: string;
  lines?: Lines;
  fileId?: string;
  blockType?: Block
};

type Lines = {
  start: number;
  end: number;
};
