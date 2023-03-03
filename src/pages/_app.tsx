import "src/styles/globals.css";

import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { useDarkMode } from "src/lib/hook/useDarkMode";
import { useFirestoreSnapshot } from "src/lib/hook/useFirestoreSnapshot";
import { Auth } from "src/pages-component/auth/Auth";

const App = ({ Component, pageProps }: AppProps) => {
  const { colorScheme } = useDarkMode();
  useFirestoreSnapshot();
  return (
    <>
      <Head>
        <title>KGPC Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          components: {
            Button: { classNames: { root: "active:translate-y-0" } },
            ActionIcon: { classNames: { root: "active:translate-y-0" } },
          },
        }}
      >
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </MantineProvider>
    </>
  );
};

export default App;
