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
  const [originalLineValue, setOriginalLineValue] = useState(originalLine);
  const [isFocused, setIsFocused] = useState(false);
  const [selection, setSelection] = useState("");
  const originalLineEl: MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);
  const newLineEl: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);

  useEffect(() => {
    originalLineEl.current!.style.height = `${originalLineEl.current?.scrollHeight}px`;
    newLineEl.current!.style.height = `${newLineEl.current?.scrollHeight}px`;
  }, []);

  const getSyllables = (lineString: string) => {
    const syllableStress = [];

    const words = lineString.split(" ").map((word) => {
      let newWord = word.toLowerCase();
      if (
        !(newWord in syllableData && syllableData[newWord].length !== 0) &&
        newWord.endsWith("'s")
      ) {
        newWord = newWord.slice(0, -2);
      }
      return newWord.replaceAll(/[,?!.()]/g, "");
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

  const originalLineSS = getSyllableStress(originalLineValue);
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
  const handleOriginalLineChange = (target: HTMLTextAreaElement) => {
    target.value = target.value.replaceAll("\n", "");
    // If the line hasn't been changed, update parody line as well
    if (originalLineValue === lineValue) {
      setLineValue(target.value);
    }
    setOriginalLineValue(target.value);
    originalLineEl.current!.style.height = "auto";
    originalLineEl.current!.style.height = `${originalLineEl.current?.scrollHeight}px`;
  };

  const handleNewLineChange = (target: HTMLTextAreaElement) => {
    target.value = target.value.replaceAll("\n", "");
    setLineValue(target.value);
    newLineEl.current!.style.height = "auto";
    newLineEl.current!.style.height = `${newLineEl.current?.scrollHeight}px`;
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
      <Col md={4}>
        <textarea
          className={styles.lineTextarea}
          onChange={({ target }) => handleOriginalLineChange(target)}
          ref={originalLineEl}
          rows={1}
          value={originalLineValue}
        />
      </Col>
      <Col md={4}>
        <textarea
          className={`${styles.lineTextarea} ${styles[lineStatus]}`}
          onBlur={handleBlur}
          onChange={({ target }) => {
            handleNewLineChange(target as HTMLTextAreaElement);
          }}
          onFocus={() => {
            setIsFocused(true);
            handleFocus();
          }}
          onSelect={({ target }) => handleSelect(target as HTMLTextAreaElement)}
          ref={newLineEl}
          rows={1}
          value={lineValue}
        />
        {wasLastFocused && selectionSyllables ? (
          <WordSuggestions
            selectionSyllables={selectionSyllables}
            syllableData={syllableData}
          />
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
