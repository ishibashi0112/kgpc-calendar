import "src/styles/globals.css";

import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import React from "react";
import { Auth } from "src/pages-component/auth/Auth";
import { Posts } from "src/pages-component/Posts";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <Auth>
        <Posts>
          <Component {...pageProps} />
        </Posts>
      </Auth>
    </MantineProvider>
  );
};

export default App;
