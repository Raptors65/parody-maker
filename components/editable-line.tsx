import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { SyllableDataInterface } from "../data/syllable-data";
import WordSuggestions from "./word-suggestions";
import styles from "../styles/EditableLine.module.css";

enum LineStatus {
  Ideal = "ideal",
  Unideal = "unideal",
  Wrong = "wrong",
  Unknown = "unknown",
}
type Props = {
  handleFocus: () => void;
  originalLine: string;
  syllableData: SyllableDataInterface;
  wasLastFocused: boolean;
};

/**
 * Represents a line of a parody.
 * @param {Props} props
 * @return {JSX.Element}
 */
export default function EditableLine({
  handleFocus,
  originalLine,
  syllableData,
  wasLastFocused,
}: Props) {
  const [lineValue, setLineValue] = useState(originalLine);
  const [isFocused, setIsFocused] = useState(false);
  const [selection, setSelection] = useState("");
  const textareaEl: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);

  useEffect(() => {
    textareaEl.current!.style.height = `${textareaEl.current?.scrollHeight}px`;
  }, []);

  const getSyllables = (lineString: string) => {
    const syllableStress = [];

    const words = lineString.split(" ").map((word) => {
      let newWord = word;
      if (newWord.endsWith("'s")) {
        newWord = newWord.slice(0, -2);
      }
      return newWord.replaceAll(new RegExp("[,?!.()]", "g"), "").toLowerCase();
    });

    for (const word of words) {
      if (word in syllableData && syllableData[word].length !== 0) {
        syllableStress.push(...syllableData[word][0]);
      } else {
        return undefined;
      }
    }

    return syllableStress;
  };

  const getSyllableStress = (lineString: string) => {
    return getSyllables(lineString)?.map((syllable) =>
      parseInt(syllable.slice(-1))
    );
  };

  const originalLineSS = getSyllableStress(originalLine);
  const editedLineSS = getSyllableStress(lineValue.trim());
  const selectionSyllables = getSyllables(selection.trim());

  const checkSyllableStress = () => {
    if (originalLineSS === undefined || editedLineSS === undefined) {
      return LineStatus.Unknown;
    } else if (editedLineSS.length !== originalLineSS?.length) {
      return LineStatus.Wrong;
    } else {
      if (editedLineSS.every((v, i) => v === originalLineSS[i])) {
        return LineStatus.Ideal;
      } else {
        return LineStatus.Unideal;
      }
    }
  };

  const lineStatus = checkSyllableStress();

  const handleBlur = () => setIsFocused(false);
  const handleChange = (target: HTMLTextAreaElement) => {
    target.value = target.value.replaceAll("\n", "");
    setLineValue(target.value);
    textareaEl.current!.style.height = "auto";
    textareaEl.current!.style.height = `${textareaEl.current?.scrollHeight}px`;
  };
  const handleSelect = (target: HTMLTextAreaElement) =>
    setSelection(
      target.value.slice(target.selectionStart, target.selectionEnd)
    );

  return (
    <Row
      className={
        originalLineSS &&
        editedLineSS &&
        (isFocused || (wasLastFocused && selectionSyllables))
          ? "mb-3 mb-md-0" // Add margin to bottom when focused and on a small screen
          : undefined
      }
    >
      <Col className={styles.originalLine} md={4}>
        {originalLine}
      </Col>
      <Col md={4}>
        <textarea
          className={`${styles.lineTextarea} ${styles[lineStatus]}`}
          onBlur={handleBlur}
          onChange={({ target }) => {
            handleChange(target as HTMLTextAreaElement);
          }}
          onFocus={() => {
            setIsFocused(true);
            handleFocus();
          }}
          onSelect={({ target }) => handleSelect(target as HTMLTextAreaElement)}
          ref={textareaEl}
          rows={1}
          value={lineValue}
        ></textarea>
        {wasLastFocused && selectionSyllables ? (
          <WordSuggestions selectionSyllables={selectionSyllables} />
        ) : null}
      </Col>
      <Col md={4}>
        {originalLineSS &&
        editedLineSS &&
        (isFocused || (wasLastFocused && selectionSyllables)) ? (
          <>
            <span className={styles.ideal}>{originalLineSS.join("-")}</span>{" "}
            &rarr;{" "}
            <span className={styles[lineStatus]}>{editedLineSS.join("-")}</span>
          </>
        ) : null}
      </Col>
    </Row>
  );
}
