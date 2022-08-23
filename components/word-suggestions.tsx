import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import SyllableData from "../data/syllable-data";

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

  return (
    <Row>
      <Col xs={6} lg={4}>
        <Form.Label>Syllables?</Form.Label>
        {selectionSyllables.map((e, i) => {
          return (
            <Form.Check
              defaultChecked
              key={i}
              label={i + 1}
              onChange={(event) =>
                setCheckSyllables([
                  ...checkSyllables.slice(0, i),
                  event.target.checked,
                  ...checkSyllables.slice(i + 1),
                ])
              }
              type="checkbox"
            />
          );
        })}
      </Col>
      <Col xs={6} lg={4}>
        <Form.Label>Stress?</Form.Label>
        {selectionSyllables.map((e, i) => {
          return (
            <Form.Check
              defaultChecked
              key={i}
              label={i + 1}
              onChange={(event) =>
                setCheckStresses([
                  ...checkStresses.slice(0, i),
                  event.target.checked,
                  ...checkStresses.slice(i + 1),
                ])
              }
              type="checkbox"
            />
          );
        })}
      </Col>
      <Col lg={4}>
        <Form.Label>Suggestions</Form.Label>
        <div style={{ maxHeight: "100px", overflowY: "scroll" }}>
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
                        syllable.slice(-1) === pronunciation[i].slice(-1))
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
