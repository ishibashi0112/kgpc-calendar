import "src/styles/globals.css";

import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import React from "react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default App;
