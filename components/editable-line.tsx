import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import syllableStressData from "../data/syllable-stress.json";

interface SyllableStressData {
  [key: string]: number[][];
}
enum LineStatus {
  Ideal = "#0a0",
  Unideal = "#d80",
  Wrong = "#f00",
  Unknown = "#555",
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
  const [isFocused, setIsFocused] = useState(false);
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

  const originalLineSS = getSyllableStress(originalLine);
  const editedSyllableStress = getSyllableStress(lineValue);

  const checkSyllableStress = () => {
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

  const lineStatus = checkSyllableStress();

  return (
    <Row className={isFocused ? "mb-3 mb-md-0" : undefined}>
      <Col md={6}>
        <textarea
          onBlur={() => setIsFocused(false)}
          onChange={({ target }) => {
            target.value = target.value.replaceAll("\n", "");
            setLineValue(target.value);
            textareaEl.current!.style.height = "auto";
            textareaEl.current!.style.height = `${textareaEl.current?.scrollHeight}px`;
          }}
          onFocus={() => setIsFocused(true)}
          ref={textareaEl}
          rows={1}
          style={{
            border: 0,
            color: lineStatus,
            width: "100%",
          }}
          value={lineValue}
        ></textarea>
      </Col>
      <Col md={6}>
        {originalLineSS && editedSyllableStress && isFocused ? (
          <>
            <span style={{ color: LineStatus.Ideal }}>
              {originalLineSS?.join("-")}
            </span>{" "}
            &rarr;{" "}
            <span style={{ color: lineStatus }}>
              {editedSyllableStress?.join("-")}
            </span>
          </>
        ) : null}
      </Col>
    </Row>
  );
}
