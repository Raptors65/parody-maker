import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Result, searchSongs } from "../api/genius";

type Props = {
  searchResults: Result[];
  searchTerm: string;
};

const SearchResults: NextPage<Props> = ({
  searchResults,
  searchTerm,
}: Props) => {
  return (
    <>
      <h1>Search results: {searchTerm}</h1>
      {searchResults.map((song) => {
        return (
          <div key={song.id}>
            <Link
              href={`/create-lyrics?urlID=${encodeURIComponent(
                song.path.slice(1, -7)
              )}`}
            >
              <a className="h2 d-block mb-0">{song.full_title}</a>
            </Link>
            <br />
            <Image
              src={song.header_image_thumbnail_url}
              width="200"
              height="200"
            />
            <p>Released on {song.release_date_for_display}</p>
            <hr />
          </div>
        );
      })}
    </>
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

export default SearchResults;
