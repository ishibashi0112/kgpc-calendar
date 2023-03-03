import "dayjs/locale/ja";

import {
  Anchor,
  Avatar,
  Container,
  Flex,
  Group,
  Header as MantineHeader,
} from "@mantine/core";
import Link from "next/link";
import React, { FC } from "react";
import { useDarkMode } from "src/lib/hook/useDarkMode";

import { TitleWithLogo } from "./TitleWithLogo";

export const Header: FC = () => {
  const { Switch } = useDarkMode();

  return (
    <MantineHeader height={50} withBorder>
      <Container size="lg">
        <Flex className="h-[50px]" justify={"space-between"} align="center">
          <Anchor
            variant="text"
            weight="bold"
            align="start"
            underline={false}
            component={Link}
            href="/"
          >
            <TitleWithLogo />
          </Anchor>

          <Group>
            {Switch}

            <Avatar color="blue" radius="xl" component={Link} href="/user" />
          </Group>
        </Flex>
      </Container>
    </MantineHeader>
  );
};
