import type { GetServerSideProps, NextPage } from "next";
import * as Genius from "genius-lyrics";
import React from "react";
import EditableLine from "../components/editable-line";

const Client = new Genius.Client(process.env.CLIENT_ACCESS);

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
          <p key={i}>
            {paragraph.map((line, i) => (
              <React.Fragment key={i}>
                <EditableLine originalLine={line} />
                <br />
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>
    );
  } else {
    return <p>Error</p>;
  }
};

/**
 *
 */
export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  if (typeof query.songID === "string") {
    const songID = parseInt(query.songID);
    if (isNaN(songID)) {
      res.statusCode = 400;
      return {
        props: { originalLyrics: [], success: false },
      };
    }

    let song;
    try {
      song = await Client.songs.get(songID);
    } catch (error) {
      res.statusCode = 400;
      return {
        props: { originalLyrics: [], success: false },
      };
    }

    const rawLyrics = await song.lyrics();

    const paragraphs = rawLyrics.split("\n\n").map((paragraph) => {
      const splitParagraph = paragraph
        .split("\n")
        .filter((line) => !(line.startsWith("[") && line.endsWith("]")));

      return splitParagraph;
    });

    return {
      props: {
        artist: song.artist.name,
        originalLyrics: paragraphs,
        title: song.title,
        success: true,
      },
    };
  } else {
    res.statusCode = 400;
    return { props: { originalLyrics: [], success: false } };
  }
};

export default CreateLyrics;
