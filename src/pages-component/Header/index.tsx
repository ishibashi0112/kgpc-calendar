import "dayjs/locale/ja";

import {
  Anchor,
  Avatar,
  Flex,
  Header as MantineHeader,
  Menu,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import Link from "next/link";
import React, { FC, useCallback } from "react";
import { auth } from "src/lib/firebase/firebase";
import { signOut } from "src/lib/firebase/firebaseAuth";

export const Header: FC = () => {
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      alert("signoutします");
    } catch (error) {
      alert(error);
    }
  }, [auth]);

  return (
    <MantineHeader height={50}>
      <Flex className="h-full mx-5" justify={"space-between"} align="center">
        <Anchor align="start" underline={false} component={Link} href="/">
          カレンダー
        </Anchor>

        <Menu>
          <Menu.Target>
            <Avatar color="cyan" radius="xl">
              MK
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="red"
              icon={<IconLogout />}
              onClick={handleSignOut}
            >
              サインアウト
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </MantineHeader>
  );
};
