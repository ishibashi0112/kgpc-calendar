import "dayjs/locale/ja";

import {
  Anchor,
  Avatar,
  Flex,
  Header as MantineHeader,
  Menu,
  Skeleton,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import Link from "next/link";
import React, { FC } from "react";
import { PostStateIcon } from "src/component/postStateIcon";
import { signOut } from "src/lib/firebase/firebaseAuth";
import { state } from "src/lib/store/valtio";
import { useSnapshot } from "valtio";

const handleSignOut = async () => {
  try {
    await signOut();
    alert("signoutします");
  } catch (error) {
    alert(error);
  }
};

export const Header: FC = () => {
  const snap = useSnapshot(state);

  const currentUserPosts = snap.posts.filter(
    (post) => post.user.id === snap.user?.id
  );

  return (
    <MantineHeader height={50}>
      <Flex className="h-full mx-5" justify={"space-between"} align="center">
        <Anchor align="start" underline={false} component={Link} href="/">
          カレンダー
        </Anchor>

        {snap.user ? (
          <Menu position="bottom-end">
            <Menu.Target>
              <Avatar color="cyan" radius="xl">
                {snap.user.name.slice(0, 2)}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Application</Menu.Label>
              <Menu.Divider />
              <Menu.Label>登録予定一覧</Menu.Label>
              {currentUserPosts.map((post) => (
                <Menu.Item
                  key={post.id}
                  icon={<PostStateIcon post={post} />}
                  component={Link}
                  href={`/post/${post.id}`}
                >
                  {post.title}{" "}
                </Menu.Item>
              ))}

              <Menu.Divider />
              <Menu.Item
                color="red"
                icon={<IconLogout />}
                onClick={handleSignOut}
              >
                サインアウト
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Skeleton circle height={38} />
        )}
      </Flex>
    </MantineHeader>
  );
};
