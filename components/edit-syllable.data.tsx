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

  const handleTermChange = (target: HTMLInputElement) => {
    target.value = target.value.toLowerCase();
    target.value = target.value.replaceAll(/[^a-z0-9'-.]/g, "");
    setSearchTerm(target.value);
  };
  const handleShowModal = () => setIsModalShowing(true);
  const handleHideModal = () => setIsModalShowing(false);
  const handleResultClick = (word: string) => setSearchTerm(word);
  const handleToggleSearch = () => setIsCollapseOpen(!isCollapseOpen);

  const addPronunciation = () =>
    setSyllableData({
      ...syllableData,
      [searchTerm]:
        searchTerm in syllableData ? [...syllableData[searchTerm], []] : [[]],
    });
  const deletePronunciation = (i: number) =>
    setSyllableData({
      ...syllableData,
      [searchTerm]: syllableData[searchTerm]
        .slice(0, i)
        .concat(syllableData[searchTerm].slice(i + 1)),
    });
  const movePronunciationDown = (i: number) =>
    setSyllableData({
      ...syllableData,
      [searchTerm]: [
        ...syllableData[searchTerm].slice(0, i),
        syllableData[searchTerm][i + 1],
        syllableData[searchTerm][i],
        ...syllableData[searchTerm].slice(i + 2),
      ],
    });
  const movePronunciationUp = (i: number) =>
    setSyllableData({
      ...syllableData,
      [searchTerm]: [
        ...syllableData[searchTerm].slice(0, i - 1),
        syllableData[searchTerm][i],
        syllableData[searchTerm][i - 1],
        ...syllableData[searchTerm].slice(i + 1),
      ],
    });

  const addSyllable = (i: number) =>
    setSyllableData({
      ...syllableData,
      [searchTerm]: [
        ...syllableData[searchTerm].slice(0, i),
        [
          ...syllableData[searchTerm][i],
          Object.values(Vowel)[0] + Object.values(Stress)[0],
        ],
        ...syllableData[searchTerm].slice(i + 1),
      ],
    });
  const editVowel = (i: number, j: number, newVowel: string) =>
    setSyllableData({
      ...syllableData,
      [searchTerm]: [
        ...syllableData[searchTerm].slice(0, i),
        [
          ...syllableData[searchTerm][i].slice(0, j),
          newVowel + syllableData[searchTerm][i][j].slice(-1),
          ...syllableData[searchTerm][i].slice(j + 1),
        ],
        ...syllableData[searchTerm].slice(i + 1),
      ],
    });
  const editStress = (i: number, j: number, newStress: string) =>
    setSyllableData({
      ...syllableData,
      [searchTerm]: [
        ...syllableData[searchTerm].slice(0, i),
        [
          ...syllableData[searchTerm][i].slice(0, j),
          syllableData[searchTerm][i][j].slice(0, 2) + newStress,
          ...syllableData[searchTerm][i].slice(j + 1),
        ],
        ...syllableData[searchTerm].slice(i + 1),
      ],
    });

  return (
    <>
      <Button onClick={handleToggleSearch} variant="primary">
        Add Syllable Data
      </Button>
      <Collapse in={isCollapseOpen}>
        <div className="border col-md-4 p-3">
          <Form onSubmit={(e) => e.preventDefault()}>
            <InputGroup>
              <Form.Control
                onChange={({ target }) =>
                  handleTermChange(target as HTMLInputElement)
                }
                placeholder="Word to change"
                required
                type="text"
                value={searchTerm}
              />
              <Button onClick={handleShowModal} type="submit">
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
                      onClick={() => handleResultClick(word)}
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
      <Modal show={isModalShowing} onHide={handleHideModal}>
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
                      onClick={() => deletePronunciation(i)}
                      variant="danger"
                    >
                      <FaRegTrashAlt />
                    </Button>
                    {i !== syllableData[searchTerm].length - 1 ? (
                      <Button
                        className="float-end"
                        onClick={() => movePronunciationDown(i)}
                        variant="secondary"
                      >
                        &darr;
                      </Button>
                    ) : null}
                    {i !== 0 ? (
                      <Button
                        className="float-end"
                        onClick={() => movePronunciationUp(i)}
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
                            onChange={({ target: { value } }) =>
                              editVowel(i, j, value)
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
                            onChange={({ target: { value } }) =>
                              editStress(i, j, value)
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
                    <Button onClick={() => addSyllable(i)} variant="primary">
                      Add Syllable
                    </Button>
                    <hr />
                  </React.Fragment>
                ))
              : null}
            <Button onClick={() => addPronunciation()} variant="success">
              Add Pronunciation
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
