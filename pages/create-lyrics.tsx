import type { GetServerSideProps, NextPage } from "next";
import React from "react";
import EditableLine from "../components/editable-line";
import { getLyrics } from "../api/genius";

type Props = {
  artist: string;
  originalLyrics: string[][];
  title: string;
  success: boolean;
};

const CreateLyrics: NextPage<Props> = ({ originalLyrics, success }: Props) => {
  if (success) {
    return (
      <div>
        {originalLyrics.map((paragraph, i) => (
          <div className="mb-3" key={i}>
            {paragraph.map((line, i) => (
              <React.Fragment key={i}>
                <EditableLine originalLine={line} />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  } else {
    return <p>Error</p>;
  }
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  if (typeof query.urlID === "string") {
    const rawLyrics = await getLyrics(query.urlID);
    if (rawLyrics === "") {
      return { props: { originalLyrics: [], success: false } };
    }

    const paragraphs = rawLyrics.split("\n\n").map((paragraph) => {
      const splitParagraph = paragraph
        .split("\n")
        .filter((line) => !(line.startsWith("[") && line.endsWith("]")));

      return splitParagraph;
    });

    return {
      props: {
        originalLyrics: paragraphs,
        success: true,
      },
    };
  } else {
    res.statusCode = 400;
    return { props: { originalLyrics: [], success: false } };
  }
};

export default CreateLyrics;
