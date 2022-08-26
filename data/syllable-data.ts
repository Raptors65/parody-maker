import syllableData from "../data/syllable-data.json";

export interface SyllableDataInterface {
  [key: string]: string[][];
}

export enum Vowel {
  AA = "AA",
  AE = "AE",
  AH = "AH",
  AO = "AO",
  AW = "AW",
  AY = "AY",
  EH = "EH",
  ER = "ER",
  EY = "EY",
  IH = "IH",
  IY = "IY",
  OW = "OW",
  OY = "OY",
  UH = "UH",
  UW = "UW",
}

export enum Stress {
  NONE = "0",
  PRIMARY = "1",
  SECONDARY = "2",
}

const SyllableData = syllableData as SyllableDataInterface;

export default SyllableData;
