import "dayjs/locale/ja";

import {
  Anchor,
  Avatar,
  Container,
  Divider,
  Drawer,
  Flex,
  Group,
  Header as MantineHeader,
  NavLink,
  ScrollArea,
  Skeleton,
  Space,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import dayjs from "dayjs";
import Link from "next/link";
import React, { FC, useState } from "react";
import { PostOperationButtons } from "src/component/PostOperationButtons";
import { StateIcon } from "src/component/StateIcon";
import { signOut } from "src/lib/firebase/firebaseAuth";
import { usePosts } from "src/lib/hook/swr/usePosts";
import { useDarkMode } from "src/lib/hook/useDarkMode";
import { useDeleteModal } from "src/lib/hook/useDeleteModal";
import { state } from "src/lib/store/valtio";
import { PostUser } from "src/type/types";
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
  const { user } = useSnapshot(state);
  const { Switch } = useDarkMode();
  const [opened, setOpened] = useState(false);
  const { modalOpen, ModalComponent } = useDeleteModal();
  const { posts } = usePosts();

  const currentUserPosts = posts
    ? posts.filter((post) => post.user.id === user?.id)
    : [];

  return (
    <MantineHeader height={50} withBorder>
      <Container size="lg">
        <Flex className="h-[50px]" justify={"space-between"} align="center">
          <Group spacing={5}>
            <Avatar
              className="border-solid border-[0.5px]"
              src="/logo.png"
              alt="no image here"
              size="sm"
            />
            <Anchor
              variant="text"
              weight="bold"
              align="start"
              underline={false}
              component={Link}
              href="/"
            >
              カレンダー
            </Anchor>
          </Group>
          <Group>
            {Switch}

            {user ? (
              <Avatar
                color="blue"
                radius="xl"
                onClick={() => setOpened(true)}
              />
            ) : (
              <Skeleton circle height={38} />
            )}
          </Group>
        </Flex>
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          position="right"
          title="User Sapce"
          padding="xl"
          size="xl"
        >
          <Divider />

          <div className="p-2">
            <Table>
              <tbody>
                <tr>
                  <td>
                    <Text>名前</Text>
                  </td>
                  <td>
                    <Text>{user?.name}</Text>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Text>Email</Text>
                  </td>
                  <td>
                    <Text>{user?.email}</Text>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Text>所属</Text>
                  </td>
                  <td>
                    <Text>{user?.type}</Text>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <Divider />
          <div className="p-2">
            <div>登録予定一覧</div>

            <Space h="xs" />

            <ScrollArea className="min-h-[100px] max-h-[550px]">
              <Stack spacing={8}>
                {currentUserPosts.map((post) => (
                  <Group key={post.id}>
                    <Text fz="xs">
                      {dayjs(post.date).locale("ja").format("YY年M月D日(dd)")}
                    </Text>
                    <Group className="flex-1" position="apart" noWrap>
                      <Group spacing={5}>
                        <StateIcon post={post as PostUser<string>} />

                        <Anchor
                          className="flex-1"
                          variant="text"
                          component={Link}
                          href={`/post/${post.id}`}
                          lineClamp={1}
                        >
                          {post.title}
                        </Anchor>
                      </Group>

                      <PostOperationButtons
                        post={post as PostUser<string>}
                        modalOpen={modalOpen}
                        IconOnly
                      />
                    </Group>
                  </Group>
                ))}
              </Stack>
            </ScrollArea>
          </div>

          <Divider />

          <NavLink
            color="red"
            variant="subtle"
            label="サインアウト"
            active
            component="button"
            icon={<IconLogout />}
            onClick={handleSignOut}
          />
        </Drawer>
      </Container>

      {ModalComponent}
    </MantineHeader>
  );
};
