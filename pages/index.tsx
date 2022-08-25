import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";

const Home: NextPage = () => {
  return (
    <div className="p-4 shadow text-center">
      <h1>Parody Maker</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead">
          This website makes it easy to write lyrics for a parody by analyzing
          vowel sounds and syllable stress for you.
        </p>
        <Link href="/search">
          <Button variant="primary">Create a Parody</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
