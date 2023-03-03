import "dayjs/locale/ja";

import { AppShell, Container, MantineNumberSize } from "@mantine/core";
import React, { FC, ReactNode } from "react";
import { Header } from "src/pages-component/Header";

type Props = {
  children: ReactNode;
  size: MantineNumberSize;
};

export const Layout: FC<Props> = ({ children, size }) => {
  return (
    <div className="h-full">
      <AppShell
        header={<Header />}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Container size={size}>{children}</Container>
      </AppShell>
    </div>
  );
};
