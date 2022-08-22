import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

/**
 * Represents the navigation bar of the website.
 * @return {JSX.Element}
 */
export default function LayoutNavbar() {
  return (
    <Navbar bg="light" className="mb-4" expand="lg">
      <Container>
        <Navbar.Brand href="/">Parody Maker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
