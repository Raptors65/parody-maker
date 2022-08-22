import React, { useState } from "react";
import syllableStressData from "../data/syllable-stress.json";

interface SyllableStressData {
  [key: string]: number[][];
}

/**
 *
 * @return {JSX.Element}
 */
export default function EditableLine({
  originalLine,
}: {
  originalLine: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [lineValue, setLineValue] = useState(originalLine);

  const getSyllableStress = (lineString: string) => {
    const syllableStress = [];

    const words = lineString.split(" ").map((word) => {
      let newWord = word;
      if (newWord.endsWith("'s")) {
        newWord = newWord.slice(0, -2);
      }
      return newWord.replaceAll(new RegExp("[,?!.()]", "g"), "").toLowerCase();
    });

    for (const word of words) {
      if (word in syllableStressData) {
        syllableStress.push(
          ...(syllableStressData as SyllableStressData)[word][0]
        );
      } else {
        return null;
      }
    }

    return syllableStress;
  };

  const checkSyllableStress = () => {
    const editedSyllableStress = getSyllableStress(lineValue);
    enum LineStatus {
      Ideal = "#0a0",
      Unideal = "#d80",
      Wrong = "#f00",
      Unknown = "#555",
    }

    if (originalLineSS === null || editedSyllableStress === null) {
      return LineStatus.Unknown;
    } else if (editedSyllableStress.length !== originalLineSS.length) {
      return LineStatus.Wrong;
    } else {
      if (editedSyllableStress.every((v, i) => v === originalLineSS[i])) {
        return LineStatus.Ideal;
      } else {
        return LineStatus.Unideal;
      }
    }
  };

  const originalLineSS = getSyllableStress(originalLine);

  const lineStatus = checkSyllableStress();

  return isEditing ? (
    <input
      onChange={(event) => setLineValue(event.target.value)}
      onKeyDown={(event) =>
        event.key === "Enter" ? setIsEditing(false) : null
      }
      style={{ color: lineStatus, width: `${lineValue.length + 2}ch` }}
      value={lineValue}
    />
  ) : (
    <span onClick={() => setIsEditing(true)} style={{ color: lineStatus }}>
      {lineValue}
    </span>
  );
}
