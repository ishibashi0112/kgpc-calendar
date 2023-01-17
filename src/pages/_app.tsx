import "src/styles/globals.css";

import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import React from "react";
import { useDarkMode } from "src/lib/hook/useDarkMode";
import { Auth } from "src/pages-component/auth/Auth";

const App = ({ Component, pageProps }: AppProps) => {
  const { colorScheme } = useDarkMode();
  return (
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
  );
};

export default App;
