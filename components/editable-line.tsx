import React, { MutableRefObject, useEffect, useRef, useState } from "react";
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
  const [lineValue, setLineValue] = useState(originalLine);
  const textareaEl: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);

  useEffect(() => {
    textareaEl.current!.style.height = `${textareaEl.current?.scrollHeight}px`;
  }, []);

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

  return (
    <textarea
      onChange={({ target }) => {
        target.value = target.value.replaceAll("\n", "");
        setLineValue(target.value);
        textareaEl.current!.style.height = "auto";
        textareaEl.current!.style.height = `${textareaEl.current?.scrollHeight}px`;
      }}
      ref={textareaEl}
      rows={1}
      style={{
        border: 0,
        color: lineStatus,
        width: "100%",
      }}
      value={lineValue}
    ></textarea>
  );
}
