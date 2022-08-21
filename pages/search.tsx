import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import Client from "../api/genius";

type ProcessedSong = {
  id: number;
  title: string;
};

type Props = {
  searchResults: ProcessedSong[];
  searchTerm: string;
};

const Search: NextPage<Props> = ({ searchResults, searchTerm }: Props) => {
  return (
    <div>
      <Head>
        <title>Parody Maker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>Search results: {searchTerm}</h1>
        {searchResults.map((song) => {
          return (
            <Link key={song.id} href={`/create-lyrics?songID=${song.id}`}>
              <div>
                <h2>{song.title}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (typeof query.q === "string" && query.q !== "") {
    const results = await Client.songs.search(query.q);
    const processedResults = results.map((song) => {
      return { id: song.id, title: song.fullTitle };
    });
    return { props: { searchResults: processedResults, searchTerm: query.q } };
  } else {
    return { props: { searchResults: [], searchTerm: "" } };
  }
};

export default Search;
