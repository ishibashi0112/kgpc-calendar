import "src/styles/globals.css";

import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import React from "react";
import { Auth } from "src/pages-component/auth/Auth";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </MantineProvider>
  );
};

export default App;
