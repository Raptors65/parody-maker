import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Result, searchSongs } from "../api/genius";

type Props = {
  searchResults: Result[];
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
            <Link
              key={song.id}
              href={`/create-lyrics?urlID=${encodeURIComponent(
                song.path.slice(1, -7)
              )}`}
            >
              <div>
                <h2>{song.full_title}</h2>
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
    const results = await searchSongs(query.q);
    return { props: { searchResults: results, searchTerm: query.q } };
  } else {
    return { props: { searchResults: [], searchTerm: "" } };
  }
};

export default Search;
