import syllableData from "../data/syllable-data.json";

interface SyllableDataInterface {
  [key: string]: string[][];
}

const SyllableData = syllableData as SyllableDataInterface;

export default SyllableData;
