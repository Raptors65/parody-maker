import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import SyllableData from "../data/syllable-data";
import styles from "../styles/WordSuggestions.module.css";

type Props = {
  selectionSyllables: string[];
};

/**
 *
 * @param {Props} props
 * @return {JSX.Element}
 */
export default function WordSuggestions({ selectionSyllables }: Props) {
  const [checkSyllables, setCheckSyllables] = useState<boolean[]>(
    Array(selectionSyllables.length).fill(true)
  );
  const [checkStresses, setCheckStresses] = useState<boolean[]>(
    Array(selectionSyllables.length).fill(true)
  );

  const handleSyllableChange = (newValue: boolean, i: number) =>
    setCheckSyllables([
      ...checkSyllables.slice(0, i),
      newValue,
      ...checkSyllables.slice(i + 1),
    ]);
  const handleStressChange = (newValue: boolean, i: number) =>
    setCheckStresses([
      ...checkStresses.slice(0, i),
      newValue,
      ...checkStresses.slice(i + 1),
    ]);

  return (
    <Row className={styles.suggestionsBox}>
      <Col xs={6} lg={4}>
        <Form.Label className={styles.label}>Match Syllables?</Form.Label>
        {selectionSyllables.map((e, i) => {
          return (
            <Form.Check
              defaultChecked
              key={i}
              label={i + 1}
              onChange={({ target: { checked } }) =>
                handleSyllableChange(checked, i)
              }
              type="checkbox"
            />
          );
        })}
      </Col>
      <Col xs={6} lg={4}>
        <Form.Label className={styles.label}>Match Stress?</Form.Label>
        {selectionSyllables.map((e, i) => {
          return (
            <Form.Check
              defaultChecked
              key={i}
              label={i + 1}
              onChange={({ target: { checked } }) =>
                handleStressChange(checked, i)
              }
              type="checkbox"
            />
          );
        })}
      </Col>
      <Col lg={4}>
        <Form.Label className={styles.label}>Suggestions</Form.Label>
        <div className={styles.suggestionsList}>
          {Object.keys(SyllableData)
            .filter((word) =>
              SyllableData[word].some((pronunciation) => {
                return (
                  selectionSyllables.length === pronunciation.length &&
                  selectionSyllables.every(
                    (syllable, i) =>
                      (!checkSyllables[i] ||
                        syllable.slice(0, 2) ===
                          pronunciation[i].slice(0, 2)) && // vowel sound
                      (!checkStresses[i] ||
                        syllable.slice(-1) === pronunciation[i].slice(-1)) // stress
                  )
                );
              })
            )
            .map((word) => (
              <>
                {word}
                <br />
              </>
            ))}
        </div>
      </Col>
    </Row>
  );
}
