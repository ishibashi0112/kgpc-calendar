import "dayjs/locale/ja";

import { AppShell, Container, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import React, { FC, ReactNode } from "react";
import { Header } from "src/pages-component/Header";

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  const { pathname } = useRouter();
  const theme = useMantineTheme();

  const size = pathname === "/form" ? "md" : "lg";
  return (
    <div className="h-full bg-black">
      <AppShell
        header={<Header />}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            paddingTop: 50,
            paddingBottom: 0,
          },
        })}
      >
        <Container
          className="min-h-[calc(100vh-50px)]"
          style={{
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
          }}
          size={size}
        >
          {children}
        </Container>
      </AppShell>
    </div>
  );
};
