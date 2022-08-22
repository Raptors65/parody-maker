import type { NextPage } from "next";
import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const Search: NextPage = () => {
  return (
    <main className="p-5 mb-4 bg-light rounded-3">
      <h1 className="text-center">Song Search</h1>
      <Form action="/search-results" className="m-auto w-sm-50" method="get">
        <InputGroup>
          <Form.Control
            type="text"
            name="q"
            placeholder="Find a song to start from"
            required
          />
          <Button type="submit">
            <FaSearch />
          </Button>
        </InputGroup>
      </Form>
    </main>
  );
};

export default Search;
