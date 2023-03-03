import "dayjs/locale/ja";

import {
  Anchor,
  Avatar,
  Container,
  Drawer,
  Flex,
  Header as MantineHeader,
  NavLink,
  Skeleton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { IconLogout, IconUser } from "@tabler/icons";
import Link from "next/link";
import React, { FC, useCallback, useState } from "react";
import { signOut } from "src/lib/firebase/firebaseAuth";
import { useDarkMode } from "src/lib/hook/useDarkMode";
import { useSnapshot } from "src/lib/hook/useSnapShot";

import { TitleWithLogo } from "./TitleWithLogo";

export const Header: FC = () => {
  const { isDark, setColorScheme } = useDarkMode();
  const matches = useMediaQuery("(min-width: 1140px)", true, {
    getInitialValueInEffect: false,
  });
  const [opened, setOpened] = useState(false);
  const { user } = useSnapshot();

  const handleSignOut = useCallback(async () => {
    try {
      const result = window.confirm("ログアウトしますか？");
      if (result) {
        await signOut();
      }
    } catch (error) {
      alert(error);
    }
  }, []);

  return (
    <MantineHeader height={50} withBorder>
      <Container size="lg" px={matches ? 0 : "xs"}>
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

          {user ? (
            <>
              <Avatar
                color="gray"
                radius="xl"
                onClick={() => setOpened(true)}
              />
              <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                position="right"
                padding="xs"
              >
                <NavLink
                  label="User Page"
                  icon={<IconUser size={16} />}
                  component={Link}
                  href={`/user/?id=${user.id}`}
                />
                <NavLink
                  label="Color Theme"
                  color={isDark ? "blue" : "yellow"}
                  icon={isDark ? <MoonIcon /> : <SunIcon />}
                  active
                  onClick={() => setColorScheme(isDark ? "light" : "dark")}
                />

                <NavLink
                  label="ログアウト"
                  color="red"
                  active
                  icon={<IconLogout size={16} />}
                  onClick={handleSignOut}
                />
              </Drawer>
            </>
          ) : (
            <Skeleton circle height={38} />
          )}
        </Flex>
      </Container>
    </MantineHeader>
  );
};
