import React, { useState } from "react";
import { Button, Collapse, Form, InputGroup, Modal } from "react-bootstrap";
import { BsFillPencilFill } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { Stress, SyllableDataInterface, Vowel } from "../data/syllable-data";
import styles from "../styles/EditSyllableData.module.css";

type Props = {
  syllableData: SyllableDataInterface;
  setSyllableData: React.Dispatch<React.SetStateAction<SyllableDataInterface>>;
};

/**
 * @param {Props} props
 * @return {JSX.Element}
 */
export default function EditSyllableData({
  syllableData,
  setSyllableData,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [isModalShowing, setIsModalShowing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleShow = () => setIsModalShowing(true);
  const handleHide = () => setIsModalShowing(false);
  const handleToggle = () => setIsCollapseOpen(!isCollapseOpen);

  return (
    <>
      <Button onClick={handleToggle} variant="primary">
        Add Syllable Data
      </Button>
      <Collapse in={isCollapseOpen}>
        <div className="border col-md-4 p-3">
          <Form onSubmit={(e) => e.preventDefault()}>
            <InputGroup>
              <Form.Control
                onChange={handleChange}
                placeholder="Word to change"
                required
                type="text"
                value={searchTerm}
              />
              <Button onClick={handleShow} type="submit">
                <BsFillPencilFill />
              </Button>
            </InputGroup>
          </Form>
          <div className={styles.searchResults}>
            {searchTerm
              ? Object.keys(syllableData)
                  .filter((word) => word.startsWith(searchTerm))
                  .map((word) => (
                    <Button
                      key={word}
                      onClick={() => setSearchTerm(word)}
                      variant="light"
                    >
                      {word}
                    </Button>
                  ))
                  .slice(0, 10)
              : null}
          </div>
        </div>
      </Collapse>
      <Modal show={isModalShowing} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Edit: {searchTerm}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {searchTerm in syllableData
              ? syllableData[searchTerm].map((pronunciation, i) => (
                  <React.Fragment key={i}>
                    <h6 className="d-inline-block mb-4">
                      Pronunciation {i + 1} {i === 0 ? "(Default)" : null}
                    </h6>
                    <Button
                      className="float-end ms-2"
                      onClick={() =>
                        setSyllableData({
                          ...syllableData,
                          [searchTerm]: syllableData[searchTerm]
                            .slice(0, i)
                            .concat(syllableData[searchTerm].slice(i + 1)),
                        })
                      }
                      variant="danger"
                    >
                      <FaRegTrashAlt />
                    </Button>
                    {i !== syllableData[searchTerm].length - 1 ? (
                      <Button
                        className="float-end"
                        onClick={() =>
                          setSyllableData({
                            ...syllableData,
                            [searchTerm]: [
                              ...syllableData[searchTerm].slice(0, i),
                              syllableData[searchTerm][i + 1],
                              pronunciation,
                              ...syllableData[searchTerm].slice(i + 2),
                            ],
                          })
                        }
                        variant="secondary"
                      >
                        &darr;
                      </Button>
                    ) : null}
                    {i !== 0 ? (
                      <Button
                        className="float-end"
                        onClick={() =>
                          setSyllableData({
                            ...syllableData,
                            [searchTerm]: [
                              ...syllableData[searchTerm].slice(0, i - 1),
                              pronunciation,
                              syllableData[searchTerm][i - 1],
                              ...syllableData[searchTerm].slice(i + 1),
                            ],
                          })
                        }
                        variant="secondary"
                      >
                        &uarr;
                      </Button>
                    ) : null}
                    <ol>
                      {pronunciation.map((syllable, j) => (
                        <li key={j}>
                          <Form.Select
                            className={styles.selectVowel}
                            onChange={(e) =>
                              setSyllableData({
                                ...syllableData,
                                [searchTerm]: [
                                  ...syllableData[searchTerm].slice(0, i),
                                  [
                                    ...pronunciation.slice(0, j),
                                    e.target.value + syllable.slice(-1),
                                    ...pronunciation.slice(j + 1),
                                  ],
                                  ...syllableData[searchTerm].slice(i + 1),
                                ],
                              })
                            }
                            value={syllable.slice(0, 2)}
                          >
                            <option disabled value="">
                              Sound
                            </option>
                            {Object.keys(Vowel).map((vowel, k) => (
                              <option key={k} value={vowel}>
                                {vowel}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Select
                            className={styles.selectStress}
                            onChange={(e) =>
                              setSyllableData({
                                ...syllableData,
                                [searchTerm]: [
                                  ...syllableData[searchTerm].slice(0, i),
                                  [
                                    ...pronunciation.slice(0, j),
                                    syllable.slice(0, 2) + e.target.value,
                                    ...pronunciation.slice(j + 1),
                                  ],
                                  ...syllableData[searchTerm].slice(i + 1),
                                ],
                              })
                            }
                            value={syllable.slice(-1)}
                          >
                            <option disabled value="">
                              Syllable Stress
                            </option>
                            {Object.entries(Stress).map(
                              ([stressName, stressId], k) => (
                                <option key={k} value={stressId}>
                                  {stressName}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </li>
                      ))}
                    </ol>
                    <Button
                      onClick={() =>
                        setSyllableData({
                          ...syllableData,
                          [searchTerm]: [
                            ...syllableData[searchTerm].slice(0, i),
                            [
                              ...pronunciation,
                              Object.values(Vowel)[0] +
                                Object.values(Stress)[0],
                            ],
                            ...syllableData[searchTerm].slice(i + 1),
                          ],
                        })
                      }
                      variant="primary"
                    >
                      Add Syllable
                    </Button>
                    <hr />
                  </React.Fragment>
                ))
              : null}
            <Button
              onClick={() =>
                setSyllableData({
                  ...syllableData,
                  [searchTerm]: [
                    ...(searchTerm in syllableData
                      ? syllableData[searchTerm]
                      : []),
                    [],
                  ],
                })
              }
              variant="success"
            >
              Add Pronunciation
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
