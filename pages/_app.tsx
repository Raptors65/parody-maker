import type { AppProps } from "next/app";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, SSRProvider } from "react-bootstrap";
import LayoutNavbar from "../components/layout-navbar";
import Head from "next/head";

/**
 * The root of the app
 * @return {JSX.Element}
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Parody Maker</title>
      </Head>
      <LayoutNavbar />
      <Container>
        <Component {...pageProps} />
      </Container>
    </SSRProvider>
  );
}

export default MyApp;
