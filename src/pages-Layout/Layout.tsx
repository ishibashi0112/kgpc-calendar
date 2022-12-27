import "dayjs/locale/ja";

import { Container } from "@mantine/core";
import { useRouter } from "next/router";
import React, { FC, ReactNode } from "react";
import { Header } from "src/pages-component/Header";

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  const { pathname } = useRouter();

  const size = pathname === "/form" ? "md" : "lg";
  return (
    <div>
      <Header />

      <Container size={size}>{children}</Container>
    </div>
  );
};
