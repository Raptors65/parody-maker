import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Parody Maker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Parody Maker</h1>
        <p>Search for a song to start from:</p>
        <form action="/search" method="get">
          <input type="text" name="q" required />
        </form>
      </main>
    </div>
  );
};

export default Home;
